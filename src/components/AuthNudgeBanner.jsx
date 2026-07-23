import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';

export default function AuthNudgeBanner({ quiz, delay = 0.75 }) {
  const location = useLocation();
  const { user, signInWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(errorTimerRef.current);
  }, []);

  if (user) return null;

  async function handleSignIn() {
    if (busy) return;
    track('auth_nudge_clicked', { quiz }, null);
    setError(null);
    setBusy(true);
    try {
      // Return to the result the visitor just completed. Guest results remain in
      // local storage and are synced to the authenticated profile after OAuth.
      await signInWithGoogle(`${location.pathname}${location.search}${location.hash}`);
    } catch (err) {
      console.error('Sign in failed:', err);
      setError(err?.message || 'Sign-in failed. Please try again.');
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(null), 8000);
      setBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-sky-50 border border-sky-200 rounded-xl px-5 py-4 mb-5"
    >
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-sky-800 font-extrabold leading-snug">
            Keep this result
          </p>
          <p className="text-xs text-sky-700 font-semibold leading-snug mt-0.5">
            Sign in with Google to save your results and access them on any device.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSignIn}
          disabled={busy}
          className="text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-60 px-3.5 py-2 rounded-lg transition-colors shrink-0 flex items-center gap-1.5"
        >
          <LogIn className="w-3.5 h-3.5" aria-hidden="true" />
          {busy ? 'Opening…' : 'Sign in'}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium mt-2" role="alert">{error}</p>
      )}
    </motion.div>
  );
}
