import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Share2 } from 'lucide-react';
import { useBigFive } from '../contexts/BigFiveContext';
import { getCakeResult } from '../data/cakeResults';
import ScoreBar from '../components/ScoreBar';

const traitOrder = ['O', 'C', 'E', 'A', 'N'];

export default function CakeResult() {
  const navigate = useNavigate();
  const { scores, hasCompleted } = useBigFive();

  // Read the result that was captured at quiz-completion time so re-taking other
  // quizzes (which may shift Big Five scores) cannot alter the displayed cake.
  const [storedData] = useState(() => {
    try {
      const raw = localStorage.getItem('personalens_cake');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!hasCompleted) navigate('/');
  }, [hasCompleted, navigate]);

  const [shareError, setShareError] = useState(null);

  if (!hasCompleted) return null;

  // Fall back to re-computing from current scores only when no stored result exists.
  const result = storedData?.result ?? getCakeResult(scores);

  async function handleShare() {
    const text = `I got "${result.name}" on My Personality Quizzes! My dominant trait: ${result.trait}. Find out what cake you are!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Personality Quizzes Result', text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      console.error('Share failed:', err);
      setShareError('Could not share. Please try copying manually.');
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Back to Dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`bg-gradient-to-br ${result.color} rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/60 mb-8`}
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl md:text-7xl mb-4"
            >
              {result.emoji}
            </motion.div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              You are...
            </p>
            <h1 className={`text-3xl md:text-4xl font-extrabold ${result.accent}`}>
              {result.name}
            </h1>
          </div>

          <p className="text-gray-700 leading-relaxed text-center text-base md:text-lg">
            {result.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-8"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Your Updated Profile
          </h3>
          {traitOrder.map((trait, i) => (
            <ScoreBar key={trait} trait={trait} value={scores[trait]} delay={i * 0.08} />
          ))}
        </motion.div>

        <div className="flex gap-3">
          <motion.button
            onClick={() => navigate('/quiz/cake')}
            aria-label="Retake the Cake quiz"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </motion.button>
          <motion.button
            onClick={() => navigate('/dashboard')}
            aria-label="Go to Dashboard"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
          >
            Dashboard
          </motion.button>
          <motion.button
            onClick={handleShare}
            aria-label="Share your cake quiz result"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold shadow-[0_4px_16px_rgba(26,127,212,0.3)] flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
        </div>
        {shareError && (
          <p role="alert" className="mt-3 text-sm text-red-600 text-center font-medium">
            {shareError}
          </p>
        )}
      </div>
    </div>
  );
}
