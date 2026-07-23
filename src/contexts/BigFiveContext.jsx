import { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { track } from '../utils/analytics';
import { allowProfileSync } from '../utils/rateLimiter';
import {
  safeLocalStorageRead,
  safeLocalStorageRemove,
  safeLocalStorageWrite,
  isPlainObject,
} from '../utils/security';
import { QUIZ_CATALOG, storageKeyFor } from '../data/quizzes';

const STORAGE_KEY = 'personalens_bigfive';
const defaultScores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
const BigFiveContext = createContext(null);

function readLocal() {
  const parsed = safeLocalStorageRead(STORAGE_KEY, null);
  // Validate the shape: must be a plain object with expected keys.
  if (!isPlainObject(parsed)) return defaultScores;
  // Normalize: guarantee all five O/C/E/A/N keys exist as finite 0–100
  // numbers, so partial/legacy data never produces NaN bars downstream.
  return clampScores(parsed);
}

function readLocalCompleted() {
  return safeLocalStorageRead(`${STORAGE_KEY}_completed`, false) === true;
}

function readLocalJson(key) {
  const parsed = safeLocalStorageRead(key, null);
  // Only return plain objects to prevent prototype pollution
  return isPlainObject(parsed) ? parsed : null;
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
  const pendingResults = {};

  const cakeData = readLocalJson('personalens_cake');
  if (cakeData?.resultKey && !remoteResults.cake) {
    const r = cakeData.result;
    pendingResults.cake = {
      resultKey: cakeData.resultKey,
      name: r.name,
      emoji: r.emoji,
      trait: r.trait,
      quizName: 'What Cake Are You?',
    };
  }

  const mbtiData = readLocalJson('personalens_mbti');
  const mbtiQuizKey = mbtiData?.quizKey || 'mbti';
  if (mbtiData?.result && !remoteResults[mbtiQuizKey]) {
    const r = mbtiData.result;
    pendingResults[mbtiQuizKey] = {
      resultKey: r.name,
      name: `${r.name} — ${r.nickname}`,
      emoji: r.emoji,
      trait: r.nickname,
      quizName: mbtiData.quizName || 'MBTI (16 Types)',
    };
  }

  const enneagramData = readLocalJson('personalens_enneagram');
  const enneagramQuizKey = enneagramData?.quizKey || 'enneagram';
  if (enneagramData?.result && !remoteResults[enneagramQuizKey]) {
    const r = enneagramData.result;
    pendingResults[enneagramQuizKey] = {
      resultKey: r.typeNumber,
      name: r.name,
      emoji: r.emoji,
      trait: r.nickname,
      quizName: enneagramData.quizName || 'Enneagram',
    };
  }

  const houseData = readLocalJson('personalens_house');
  if (houseData?.result?.key && !remoteResults.house) {
    const r = houseData.result;
    pendingResults.house = {
      resultKey: r.key,
      name: r.name,
      emoji: r.emoji,
      trait: r.tagline ?? '',
      quizName: 'Wizarding House',
    };
  }

  // Every other catalog + vector quiz (naruto, office, riasec, eq, love_language, …).
  // These all persist under personalens_<key> with the standard { resultKey, result }
  // shape written by CatalogQuiz / VectorQuizExperience. The four quizzes above stay
  // special-cased because they carry bespoke compat fields / composite names; the rest
  // sync generically here. Without this, a guest who completes ANY themed/catalog quiz
  // loses it on sign-in — and it gets wiped from localStorage on sign-out (PERSONAL_KEYS),
  // so the result is destroyed. This is the core "start as a guest, sign in to save" path.
  for (const meta of QUIZ_CATALOG) {
    if (meta.custom) continue;                // flower_petal etc. store no standard result
    const key = meta.key;
    if (remoteResults[key]) continue;         // already on the server
    const data = readLocalJson(storageKeyFor(key));
    const r = data?.result;
    if (!r || !data.resultKey || !r.name) continue;
    pendingResults[key] = {
      resultKey: String(data.resultKey).slice(0, 40),
      name:      String(r.name).slice(0, 120),
      emoji:     typeof r.emoji === 'string' ? r.emoji : '',
      tagline:   typeof r.tagline === 'string' ? r.tagline : '',
      quizName:  meta.quizName,
    };
  }

  if (Object.keys(pendingResults).length === 0) return;

  async function retry(operation) {
    let lastError = null;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        const outcome = await operation();
        if (!outcome.error) return { ok: true, value: outcome };
        lastError = outcome.error;
      } catch (error) {
        lastError = error;
      }
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 250 * (attempt + 1)));
      }
    }
    return { ok: false, error: lastError ?? new Error('Guest result sync failed') };
  }

  // One server-side merge avoids lost updates and the per-call rate limit when
  // a returning guest has completed many quizzes. The individual RPC fallback
  // keeps sign-in compatible while the new migration is rolling out.
  const bulk = await retry(() => supabase.rpc('upsert_quiz_results_bulk', {
    p_user_id: userId,
    p_results: pendingResults,
  }));
  if (bulk.ok) return;

  const missingBulkRpc = bulk.error?.code === 'PGRST202' || bulk.error?.code === '42883';
  if (!missingBulkRpc) {
    console.error('Failed to bulk-sync guest quiz results to Supabase:', bulk.error);
    return;
  }

  for (const [quizKey, result] of Object.entries(pendingResults)) {
    const fallback = await retry(() => supabase.rpc('upsert_quiz_result', {
      p_user_id: userId,
      p_quiz_key: quizKey,
      p_result: result,
    }));
    if (!fallback.ok) {
      console.error(`Failed to sync guest quiz result "${quizKey}" to Supabase:`, fallback.error);
    }
  }
}

// localStorage keys holding personal quiz data, cleared on sign-out so the
// next person on a shared device can't see the previous user's results.
// Catalog quizzes all store under personalens_<key> (see storageKeyFor).
const PERSONAL_KEYS = [
  STORAGE_KEY,
  `${STORAGE_KEY}_completed`,
  'personalens_cake',
  'personalens_mbti',
  'personalens_enneagram',
  'personalens_house',
  'personalens_hottakes',
  'personalens_flower_petal',
  ...QUIZ_CATALOG.map((q) => `personalens_${q.key}`),
];

export function BigFiveProvider({ children }) {
  const { user } = useAuth();
  const [scores, setScores] = useState(readLocal);
  const [hasCompleted, setHasCompleted] = useState(readLocalCompleted);
  const [contextLoading, setContextLoading] = useState(true);
  const hasCompletedRef = useRef(hasCompleted);
  // Tracks the live scores value so callbacks don't close over stale state.
  const scoresRef = useRef(scores);
  // Tracks the previous user so we can detect a sign-out transition.
  const prevUserIdRef = useRef(null);

  // On sign-out (user → null after being signed in), wipe locally cached
  // personality data. Guest sessions (never signed in) are untouched.
  useEffect(() => {
    if (user) {
      prevUserIdRef.current = user.id;
      return;
    }
    if (prevUserIdRef.current) {
      prevUserIdRef.current = null;
      try {
        PERSONAL_KEYS.forEach(safeLocalStorageRemove);
      } catch { /* storage unavailable */ }
      setScores(defaultScores);
      setHasCompleted(false);
    }
  }, [user]);

  useEffect(() => {
    scoresRef.current = scores;
    safeLocalStorageWrite(STORAGE_KEY, scores);
  }, [scores]);

  useEffect(() => {
    safeLocalStorageWrite(`${STORAGE_KEY}_completed`, hasCompleted);
    hasCompletedRef.current = hasCompleted;
  }, [hasCompleted]);

  const syncToSupabase = useCallback(async (newScores, completed, quizResults) => {
    if (!user || !supabase) return;
    // Rate limit profile syncs to prevent excessive DB writes
    if (!allowProfileSync()) {
      if (import.meta.env.DEV) console.warn('[bigfive] profile sync rate-limited');
      return;
    }
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
          // clampScores tolerates null/partial DB values and always returns a
          // complete, in-range O/C/E/A/N object.
          setScores(clampScores(data.big5_scores));
          setHasCompleted(true);
        } else {
          const localScores = readLocal();
          const localCompleted = readLocalCompleted();
          if (localCompleted) {
            const { error: uploadError } = await supabase
              .from('profiles')
              .update({
                big5_scores: clampScores(localScores),
                baseline_completed: true,
              })
              .eq('id', user.id);
            if (uploadError) console.error('[bigfive] failed to sync local baseline to Supabase:', uploadError);
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
    safeLocalStorageRemove(STORAGE_KEY);
    safeLocalStorageRemove(`${STORAGE_KEY}_completed`);
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
