import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { track, getSessionId } from '../utils/analytics';

const RATED_PREFIX = 'pq_rated_';

function alreadyRated(quizKey) {
  try {
    return sessionStorage.getItem(RATED_PREFIX + quizKey) === '1';
  } catch {
    return false;
  }
}

function markRated(quizKey) {
  try { sessionStorage.setItem(RATED_PREFIX + quizKey, '1'); } catch { /* ignore */ }
}

/**
 * "How accurate does this feel?" — a 1–5 star rating stored in quiz_feedback.
 * Aggregates feed the admin dashboard so quiz weighting can be tuned on real
 * signal. Hidden once rated (per browser session).
 */
export default function FeedbackWidget({ quizKey, delay = 0.7 }) {
  const { user } = useAuth();
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(() => alreadyRated(quizKey));

  // Ratings affect product decisions, so accept one rating per signed-in
  // account and quiz instead of trusting unlimited anonymous browser sessions.
  if (!supabase || !user) return null;

  async function handleRate(rating) {
    setSubmitted(true);
    markRated(quizKey);
    track('quiz_feedback_given', { quiz: quizKey, rating }, user.id);
    const { error } = await supabase.from('quiz_feedback').insert({
      session_id: getSessionId(),
      user_id: user.id,
      quiz_key: quizKey,
      rating,
    });
    // A duplicate (already rated this session) or rate-limit drop is fine —
    // the thank-you state is the right UI either way.
    if (error && import.meta.env.DEV) console.warn('[feedback] insert failed:', error);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-xl px-5 py-4 shadow-sm border border-gray-200 mb-5"
    >
      {submitted ? (
        <p className="text-sm font-semibold text-gray-500 text-center" role="status">
          Thanks — your feedback makes the quizzes better 💛
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-semibold text-gray-600">How accurate does this feel?</p>
          <div
            className="flex items-center gap-1"
            role="group"
            aria-label="Rate result accuracy from 1 to 5 stars"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
                onMouseEnter={() => setHovered(n)}
                onFocus={() => setHovered(n)}
                onClick={() => handleRate(n)}
                className="p-1 transition-transform hover:scale-110"
              >
                <Star
                  className={`w-6 h-6 transition-colors ${
                    n <= hovered ? 'text-amber-400 fill-amber-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
