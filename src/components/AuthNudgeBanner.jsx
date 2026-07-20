import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';

export default function AuthNudgeBanner({ quiz }) {
  const { user, signInWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  const errorTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(errorTimerRef.current);
  }, []);

  if (user) return null;

  async function handleSignIn() {
    track('auth_nudge_clicked', { quiz }, null);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign in failed:', err);
      setError(err?.message || 'Sign-in failed. Please try again.');
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(null), 8000);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.8 }}
      className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 mb-3"
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-sky-700 font-semibold leading-snug">
          Sign in to save your result permanently
        </p>
        <button
          onClick={handleSignIn}
          className="text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 px-3 py-1.5 rounded-lg transition-colors shrink-0"
        >
          Sign in
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium mt-2" role="alert">{error}</p>
      )}
    </motion.div>
  );
}
