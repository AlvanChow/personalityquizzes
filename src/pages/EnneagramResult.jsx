import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Share2 } from 'lucide-react';

const MAX_SCORE_PER_TYPE = 12; // 3 questions × 4 max points

function TypeBar({ typeNum, score, label, delay, isTop }) {
  const pct = Math.round((score / MAX_SCORE_PER_TYPE) * 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span className={isTop ? 'text-mint-600' : 'text-gray-400'}>
          Type {typeNum} — {label}
        </span>
        <span className={isTop ? 'text-mint-600' : 'text-gray-400'}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isTop ? 'bg-gradient-to-r from-mint-300 to-mint-400' : 'bg-gray-200'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

const TYPE_NAMES = {
  '1': 'Reformer',
  '2': 'Helper',
  '3': 'Achiever',
  '4': 'Individualist',
  '5': 'Investigator',
  '6': 'Loyalist',
  '7': 'Enthusiast',
  '8': 'Challenger',
  '9': 'Peacemaker',
};

export default function EnneagramResult() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem('personalens_enneagram');
    if (!raw) {
      navigate('/');
      return;
    }
    setData(JSON.parse(raw));
  }, [navigate]);

  if (!data) return null;

  const { result, scores } = data;

  // Sort all types by score descending for the bar chart, show top 5
  const sortedTypes = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  async function handleShare() {
    const text = `I\'m a ${result.name} on the Enneagram! My core desire: ${result.coreDesire}. Find out your type!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Enneagram Result', text });
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
              You are...
            </p>
            <h1 className={`text-3xl md:text-4xl font-extrabold mb-1 ${result.accent}`}>
              {result.name}
            </h1>
          </div>

          <p className="text-gray-700 leading-relaxed text-center text-base md:text-lg mb-6">
            {result.description}
          </p>

          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/60 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Core Desire</p>
              <p className="text-sm font-semibold text-gray-700">{result.coreDesire}</p>
            </div>
            <div className="bg-white/60 rounded-2xl p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Core Fear</p>
              <p className="text-sm font-semibold text-gray-700">{result.coreFear}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-8"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
            Your Top Types
          </h3>
          {sortedTypes.map(([typeNum, score], i) => (
            <TypeBar
              key={typeNum}
              typeNum={typeNum}
              score={score}
              label={TYPE_NAMES[typeNum]}
              delay={i * 0.08}
              isTop={typeNum === result.typeNumber}
            />
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
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-mint-400 to-mint-500 text-white font-bold shadow-[0_4px_16px_rgba(0,0,0,0.15)] flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share Result
          </motion.button>
        </div>
      </div>
    </div>
  );
}
