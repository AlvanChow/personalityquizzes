import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { track } from '../utils/analytics';

const STORAGE_KEY = 'personalens_bigfive';
const defaultScores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
const BigFiveContext = createContext(null);

function readLocal() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : defaultScores;
  } catch {
    return defaultScores;
  }
}

function readLocalCompleted() {
  try {
    return localStorage.getItem(`${STORAGE_KEY}_completed`) === 'true';
  } catch {
    return false;
  }
}

function readLocalJson(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Clamp each Big Five trait score to [0, 100] and coerce to a finite number.
 * This ensures the DB-level CHECK constraint is never violated from client data.
 */
function clampScores(scores) {
  const result = {};
  for (const key of ['O', 'C', 'E', 'A', 'N']) {
    const v = Number(scores?.[key]);
    result[key] = Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : 0;
  }
  return result;
}

/**
 * After login, upload any quiz results that were completed as a guest and are
 * not yet in the user's Supabase profile. Each localStorage entry already uses
 * the same normalized shape written by the quiz completion handlers.
 */
async function syncGuestQuizResults(userId, remoteResults) {
  if (!supabase) return;
  const tasks = [];

  const cakeData = readLocalJson('personalens_cake');
  if (cakeData?.resultKey && !remoteResults.cake) {
    const r = cakeData.result;
    tasks.push(supabase.rpc('upsert_quiz_result', {
      p_user_id: userId,
      p_quiz_key: 'cake',
      p_result: { resultKey: cakeData.resultKey, name: r.name, emoji: r.emoji, trait: r.trait, quizName: 'What Cake Are You?' },
    }));
  }

  const mbtiData = readLocalJson('personalens_mbti');
  if (mbtiData?.result && !remoteResults.mbti) {
    const r = mbtiData.result;
    tasks.push(supabase.rpc('upsert_quiz_result', {
      p_user_id: userId,
      p_quiz_key: 'mbti',
      p_result: { resultKey: r.name, name: `${r.name} — ${r.nickname}`, emoji: r.emoji, trait: r.nickname, quizName: 'MBTI (16 Types)' },
    }));
  }

  const enneagramData = readLocalJson('personalens_enneagram');
  if (enneagramData?.result && !remoteResults.enneagram) {
    const r = enneagramData.result;
    tasks.push(supabase.rpc('upsert_quiz_result', {
      p_user_id: userId,
      p_quiz_key: 'enneagram',
      p_result: { resultKey: r.typeNumber, name: r.name, emoji: r.emoji, trait: r.nickname, quizName: 'Enneagram' },
    }));
  }

  if (tasks.length > 0) {
    const results = await Promise.all(tasks);
    results.forEach(({ error }) => {
      if (error) console.error('Failed to sync guest quiz result to Supabase:', error);
    });
  }
}

export function BigFiveProvider({ children }) {
  const { user } = useAuth();
  const [scores, setScores] = useState(readLocal);
  const [hasCompleted, setHasCompleted] = useState(readLocalCompleted);
  const [contextLoading, setContextLoading] = useState(true);
  const hasCompletedRef = useRef(hasCompleted);
  // Tracks the live scores value so callbacks don't close over stale state.
  const scoresRef = useRef(scores);

  useEffect(() => {
    scoresRef.current = scores;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_completed`, String(hasCompleted));
    hasCompletedRef.current = hasCompleted;
  }, [hasCompleted]);

  const syncToSupabase = useCallback(async (newScores, completed, quizResults) => {
    if (!user || !supabase) return;
    const update = { big5_scores: clampScores(newScores), baseline_completed: completed };
    if (quizResults !== undefined) update.quiz_results = quizResults;
    const { error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', user.id);
    if (error) console.error('Failed to sync Big Five scores to Supabase:', error);
  }, [user]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!user || !supabase) {
        if (!cancelled) setContextLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('big5_scores, baseline_completed, quiz_results')
          .eq('id', user.id)
          .maybeSingle();

        if (cancelled) return;

        if (error) {
          if (import.meta.env.DEV) console.error('[bigfive] profile fetch failed:', error);
          return;
        }

        if (data && data.baseline_completed) {
          setScores(data.big5_scores);
          setHasCompleted(true);
        } else {
          const localScores = readLocal();
          const localCompleted = readLocalCompleted();
          if (localCompleted) {
            await supabase
              .from('profiles')
              .update({
                big5_scores: clampScores(localScores),
                baseline_completed: true,
              })
              .eq('id', user.id);
          }
        }

        // Upload any quiz results completed as a guest that aren't yet in Supabase.
        await syncGuestQuizResults(user.id, data?.quiz_results || {});
      } finally {
        if (!cancelled) setContextLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  // updateScores reads from scoresRef so it never triggers a state-updater side effect.
  const updateScores = useCallback((newScores) => {
    const merged = { ...scoresRef.current, ...newScores };
    setScores(merged);
    syncToSupabase(merged, hasCompletedRef.current);
  }, [syncToSupabase]);

  const completeBaseline = useCallback((baselineScores) => {
    setScores(baselineScores);
    setHasCompleted(true);
    syncToSupabase(baselineScores, true);
  }, [syncToSupabase]);

  const resetBaseline = useCallback(() => {
    setScores(defaultScores);
    setHasCompleted(false);
    // Only clear the Big Five localStorage keys — quiz results are preserved.
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(`${STORAGE_KEY}_completed`);
    // Only reset Big Five fields in Supabase; quiz_results is left untouched.
    syncToSupabase(defaultScores, false);
    track('baseline_reset', {}, user?.id ?? null);
  }, [syncToSupabase, user?.id]);

  const value = useMemo(
    () => ({ scores, hasCompleted, loading: contextLoading, updateScores, completeBaseline, resetBaseline }),
    [scores, hasCompleted, contextLoading, updateScores, completeBaseline, resetBaseline],
  );

  return (
    <BigFiveContext.Provider value={value}>
      {children}
    </BigFiveContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useBigFive() {
  const ctx = useContext(BigFiveContext);
  if (!ctx) throw new Error('useBigFive must be used within BigFiveProvider');
  return ctx;
}
