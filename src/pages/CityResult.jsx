import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';
import { useBigFive } from '../contexts/BigFiveContext';
import { getCityResult } from '../data/cityResults';
import ScoreBar from '../components/ScoreBar';

const traitOrder = ['O', 'C', 'E', 'A', 'N'];

export default function CityResult() {
  const navigate = useNavigate();
  const { scores, hasCompleted } = useBigFive();

  useEffect(() => {
    if (!hasCompleted) navigate('/');
  }, [hasCompleted, navigate]);

  if (!hasCompleted) return null;

  const result = getCityResult(scores);

  async function handleShare() {
    const text = `I got "${result.name}" on My Personality Quizzes! My dominant trait: ${result.trait}. Find out what city you should live in!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Personality Quizzes Result', text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch {
      // user cancelled
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
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
              You should live in...
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
            onClick={() => navigate('/dashboard')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
          >
            Dashboard
          </motion.button>
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-teal-300 to-teal-400 text-white font-bold shadow-[0_4px_16px_rgba(59,186,196,0.3)] flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Result
          </motion.button>
        </div>
      </div>
    </div>
  );
}
