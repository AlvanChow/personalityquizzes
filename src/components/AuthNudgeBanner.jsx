import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';

export default function AuthNudgeBanner({ quiz }) {
  const { user, signInWithGoogle } = useAuth();
  if (user) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.8 }}
      className="flex items-center justify-between gap-3 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 mb-3"
    >
      <p className="text-xs text-sky-700 font-semibold leading-snug">
        Sign in to save your result permanently
      </p>
      <button
        onClick={() => { track('auth_nudge_clicked', { quiz }, null); signInWithGoogle(); }}
        className="text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 px-3 py-1.5 rounded-lg transition-colors shrink-0"
      >
        Sign in
      </button>
    </motion.div>
  );
}
