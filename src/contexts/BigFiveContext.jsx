import { createContext, useContext, useState, useEffect } from 'react';

const STORAGE_KEY = 'personalens_bigfive';

const defaultScores = { O: 0, C: 0, E: 0, A: 0, N: 0 };

const BigFiveContext = createContext(null);

export function BigFiveProvider({ children }) {
  const [scores, setScores] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : defaultScores;
    } catch {
      return defaultScores;
    }
  });

  const [hasCompleted, setHasCompleted] = useState(() => {
    try {
      return localStorage.getItem(`${STORAGE_KEY}_completed`) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scores));
  }, [scores]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_completed`, String(hasCompleted));
  }, [hasCompleted]);

  function updateScores(newScores) {
    setScores(prev => ({ ...prev, ...newScores }));
  }

  function completeBaseline(baselineScores) {
    setScores(baselineScores);
    setHasCompleted(true);
  }

  function resetScores() {
    setScores(defaultScores);
    setHasCompleted(false);
  }

  return (
    <BigFiveContext.Provider value={{ scores, hasCompleted, updateScores, completeBaseline, resetScores }}>
      {children}
    </BigFiveContext.Provider>
  );
}

export function useBigFive() {
  const ctx = useContext(BigFiveContext);
  if (!ctx) throw new Error('useBigFive must be used within BigFiveProvider');
  return ctx;
}
