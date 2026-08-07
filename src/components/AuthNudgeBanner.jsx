import { useLocation } from 'react-router';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import SignInButtons from './SignInButtons';

export default function AuthNudgeBanner({ quiz, delay = 0.75 }) {
  const location = useLocation();
  const { user } = useAuth();

  if (user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="bg-sky-50 border border-sky-200 rounded-xl px-5 py-4 mb-5"
    >
      <p className="text-sm text-sky-800 font-extrabold leading-snug">
        Keep this result
      </p>
      <p className="text-xs text-sky-700 font-semibold leading-snug mt-0.5">
        Sign in to save your results and access them on any device.
      </p>
      {/* Return to the result the visitor just completed. Guest results remain
          in local storage and are synced to the authenticated profile after
          the provider redirect. */}
      <SignInButtons
        className="mt-3"
        redirectPath={`${location.pathname}${location.search}${location.hash}`}
        onStart={() => track('auth_nudge_clicked', { quiz }, null)}
      />
    </motion.div>
  );
}
