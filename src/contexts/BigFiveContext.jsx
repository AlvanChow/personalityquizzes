import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

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

  const syncToSupabase = useCallback(async (newScores, completed) => {
    if (!user) return;
    const { error } = await supabase
      .from('profiles')
      .update({
        big5_scores: newScores,
        baseline_completed: completed,
      })
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
        .select('big5_scores, baseline_completed')
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
    syncToSupabase(defaultScores, false);
  }

  return (
    <BigFiveContext.Provider value={{ scores, hasCompleted, loading: contextLoading, updateScores, completeBaseline, resetScores }}>
      {children}
    </BigFiveContext.Provider>
  );
}

export function useBigFive() {
  const ctx = useContext(BigFiveContext);
  if (!ctx) throw new Error('useBigFive must be used within BigFiveProvider');
  return ctx;
}
