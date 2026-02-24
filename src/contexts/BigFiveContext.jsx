import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
 * After login, upload any quiz results that were completed as a guest and are
 * not yet in the user's Supabase profile. Each localStorage entry already uses
 * the same normalized shape written by the quiz completion handlers.
 */
async function syncGuestQuizResults(userId, remoteResults) {
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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_completed`, String(hasCompleted));
    hasCompletedRef.current = hasCompleted;
  }, [hasCompleted]);

  const syncToSupabase = useCallback(async (newScores, completed, quizResults) => {
    if (!user) return;
    const update = { big5_scores: newScores, baseline_completed: completed };
    if (quizResults !== undefined) update.quiz_results = quizResults;
    const { error } = await supabase
      .from('profiles')
      .update(update)
      .eq('id', user.id);
    if (error) console.error('Failed to sync Big Five scores to Supabase:', error);
  }, [user]);

  useEffect(() => {
    if (!user) {
      setContextLoading(false);
      return;
    }
    let cancelled = false;

    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('big5_scores, baseline_completed, quiz_results')
        .eq('id', user.id)
        .maybeSingle();

      if (cancelled) return;

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
              big5_scores: localScores,
              baseline_completed: true,
            })
            .eq('id', user.id);
        }
      }

      // Upload any quiz results completed as a guest that aren't yet in Supabase.
      await syncGuestQuizResults(user.id, data?.quiz_results || {});

      if (!cancelled) setContextLoading(false);
    })();

    return () => { cancelled = true; };
  }, [user]);

  function updateScores(newScores) {
    setScores((prev) => {
      const merged = { ...prev, ...newScores };
      syncToSupabase(merged, hasCompletedRef.current);
      return merged;
    });
  }

  function completeBaseline(baselineScores) {
    setScores(baselineScores);
    setHasCompleted(true);
    syncToSupabase(baselineScores, true);
  }

  function resetScores() {
    setScores(defaultScores);
    setHasCompleted(false);
    // Clear all quiz result localStorage entries so stale results are not shown.
    localStorage.removeItem('personalens_cake');
    localStorage.removeItem('personalens_mbti');
    localStorage.removeItem('personalens_enneagram');
    // Reset quiz_results in Supabase along with the Big Five fields.
    syncToSupabase(defaultScores, false, {});
    track('dashboard_reset', {}, user?.id ?? null);
  }

  return (
    <BigFiveContext.Provider value={{ scores, hasCompleted, loading: contextLoading, updateScores, completeBaseline, resetScores }}>
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
