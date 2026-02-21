import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';

const DIMENSION_LABELS = {
  IE: { low: 'Introversion (I)', high: 'Extraversion (E)' },
  SN: { low: 'Sensing (S)', high: 'iNtuition (N)' },
  TF: { low: 'Thinking (T)', high: 'Feeling (F)' },
  JP: { low: 'Judging (J)', high: 'Perceiving (P)' },
};

const DIMENSION_ORDER = ['IE', 'SN', 'TF', 'JP'];

function DimensionBar({ dim, score, delay }) {
  const labels = DIMENSION_LABELS[dim];
  const activeLetter = score < 50 ? labels.low : labels.high;
  return (
    <div className="mb-4">
      <div className="flex justify-between text-xs font-semibold text-gray-400 mb-1">
        <span>{labels.low}</span>
        <span>{labels.high}</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-coral-300 to-coral-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-gray-300"
          style={{ left: '50%' }}
        />
      </div>
      <p className="text-right text-xs text-gray-400 mt-1">{activeLetter}</p>
    </div>
  );
}

export default function MBTIResult() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('personalens_mbti');
    if (!raw) {
      navigate('/');
      return;
    }
    setData(JSON.parse(raw));
  }, [navigate]);

  if (!data) return null;

  const { result, scores } = data;

  async function handleShare() {
    const text = `I got ${result.name} — ${result.nickname} on My Personality Quizzes! Discover your MBTI type too.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My MBTI Result', text });
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
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quizzes
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
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Your type is...
            </p>
            <h1 className={`text-5xl font-black tracking-widest mb-1 ${result.accent}`}>
              {result.name}
            </h1>
            <p className={`text-lg font-bold ${result.accent} opacity-70`}>
              {result.nickname}
            </p>
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
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
            Your Dimension Scores
          </h3>
          {DIMENSION_ORDER.map((dim, i) => (
            <DimensionBar key={dim} dim={dim} score={scores[dim] ?? 50} delay={i * 0.1} />
          ))}
        </motion.div>

        <div className="flex gap-3">
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
          >
            All Quizzes
          </motion.button>
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-coral-400 to-coral-500 text-white font-bold shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Result
          </motion.button>
        </div>
      </div>
    </div>
  );
}
