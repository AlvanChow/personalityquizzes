import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { track, getSessionId } from '../utils/analytics';
import { isValidEmail } from '../utils/security';

// Global (per-browser) suppression flags. Once a visitor subscribes or
// dismisses, the card never shows again on any result surface — no nagging.
const SUBSCRIBED_KEY = 'pq_email_captured';
const DISMISSED_KEY = 'pq_email_dismissed';

function readFlag(key) {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}
function writeFlag(key) {
  try { localStorage.setItem(key, '1'); } catch { /* ignore */ }
}

/**
 * Opt-in email capture shown on result surfaces.
 *
 * The product is free — this is the growth mechanism in place of a paywall:
 * leave your email to get new quizzes and a copy of your results. Opt-ins are
 * stored in `email_subscribers` (RLS: anon/auth insert, admin-only read). A
 * duplicate address is treated as success. Self-suppresses across pages once
 * the visitor subscribes or dismisses.
 */
export default function EmailCaptureCard({
  source = 'result',
  title = 'Get your results — and new quizzes — in your inbox',
  blurb = "It's all free. Leave your email for fresh quizzes and a copy of your results. No spam, unsubscribe anytime.",
  delay = 0.75,
}) {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState('');
  const [hidden, setHidden] = useState(
    () => readFlag(SUBSCRIBED_KEY) || readFlag(DISMISSED_KEY),
  );

  if (!supabase || hidden) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (status === 'submitting') return;

    const value = email.trim().toLowerCase();
    if (!isValidEmail(value)) {
      setErrorMsg('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    const { error } = await supabase.from('email_subscribers').insert({
      email: value,
      source: source ? String(source).slice(0, 64) : null,
      session_id: getSessionId(),
      user_id: user?.id ?? null,
    });

    // 23505 = unique violation → already subscribed. That's a success too.
    if (error && error.code !== '23505') {
      if (import.meta.env.DEV) console.warn('[email-capture] insert failed:', error);
      setErrorMsg('Something went wrong — please try again.');
      setStatus('error');
      return;
    }

    writeFlag(SUBSCRIBED_KEY);
    track('email_captured', { source }, user?.id ?? null);
    setStatus('success');
  }

  function handleDismiss() {
    writeFlag(DISMISSED_KEY);
    track('email_capture_dismissed', { source }, user?.id ?? null);
    setHidden(true);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative bg-white rounded-xl px-5 py-5 shadow-sm border border-gray-200 mb-5"
    >
      {status === 'success' ? (
        <div className="flex items-center justify-center gap-2 py-1 text-center" role="status">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-mint-100 text-mint-500 shrink-0">
            <Check className="w-4 h-4" />
          </span>
          <p className="text-sm font-semibold text-gray-600">You&rsquo;re on the list — talk soon 💛</p>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label="Dismiss email signup"
            className="absolute top-2.5 right-2.5 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-900/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-3 mb-3 pr-6">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-coral-100 text-coral-500 shrink-0">
              <Mail className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-extrabold text-gray-800 leading-snug">{title}</h3>
              <p className="text-xs font-semibold text-gray-500 mt-0.5">{blurb}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2" noValidate>
            <label htmlFor="email-capture-input" className="sr-only">Email address</label>
            <input
              id="email-capture-input"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === 'error') setStatus('idle');
              }}
              placeholder="you@example.com"
              aria-invalid={status === 'error'}
              aria-describedby={status === 'error' ? 'email-capture-error' : undefined}
              className="flex-1 min-w-0 px-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-semibold text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-200 transition-colors"
            />
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="shrink-0 px-6 py-2.5 rounded-lg bg-coral-500 hover:bg-coral-600 disabled:opacity-60 text-white font-extrabold text-sm transition-colors flex items-center justify-center gap-2"
            >
              {status === 'submitting' ? 'Joining…' : 'Join free'}
            </button>
          </form>

          {status === 'error' && (
            <p id="email-capture-error" role="alert" className="text-xs font-semibold text-coral-600 mt-2">
              {errorMsg}
            </p>
          )}
        </>
      )}
    </motion.div>
  );
}
