import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Shield, AlertTriangle, Sparkles } from 'lucide-react';
import SharePanel from '../components/SharePanel';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { safeLocalStorageRead } from '../utils/security';
import { usePageTitle } from '../hooks/usePageTitle';
import AuthNudgeBanner from '../components/AuthNudgeBanner';
import CompareBanner from '../components/CompareBanner';
import FeedbackWidget from '../components/FeedbackWidget';

// MAX raw score per house = 10 questions × 1 point
const MAX_HOUSE_SCORE = 10;

const houseMeta = {
  g: { label: 'Gryffindor', emoji: '🦁', color: 'bg-red-400' },
  h: { label: 'Hufflepuff', emoji: '🦡', color: 'bg-yellow-400' },
  r: { label: 'Ravenclaw', emoji: '🦅', color: 'bg-blue-400' },
  s: { label: 'Slytherin', emoji: '🐍', color: 'bg-emerald-400' },
};

const houseOrder = ['g', 'h', 'r', 's'];

const resultKeyToLetter = {
  gryffindor: 'g',
  hufflepuff: 'h',
  ravenclaw: 'r',
  slytherin: 's',
};

function HouseBar({ houseKey, score, delay, isTop }) {
  const meta = houseMeta[houseKey];
  const pct = Math.round(((score ?? 0) / MAX_HOUSE_SCORE) * 100);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-sm font-semibold ${isTop ? 'text-gray-800' : 'text-gray-500'}`}>
          {meta.emoji} {meta.label}
          {isTop && (
            <span className="ml-2 text-xs font-bold text-amber-500 uppercase tracking-wide">Your House</span>
          )}
        </span>
        <span className={`text-sm font-bold ${isTop ? 'text-gray-700' : 'text-gray-400'}`}>{pct}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isTop ? meta.color : 'bg-gray-200'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function HouseResult() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [storedData] = useState(() => {
    const stored = safeLocalStorageRead('personalens_house', null);
    // Guard against partial/corrupt stored data, not just missing data.
    return stored?.result?.key ? stored : null;
  });

  usePageTitle(storedData ? `${storedData.result.name} — My Personality Quizzes` : null);

  useEffect(() => {
    if (!storedData) navigate('/');
  }, [storedData, navigate]);

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current || !storedData) return;
    viewedRef.current = true;
    track('quiz_result_viewed', { quiz: 'house' }, user?.id ?? null);
  }, [storedData, user?.id]);

  if (!storedData) return null;

  const result = storedData.result;
  const houseScores = storedData.scores ?? {};
  const topLetter = resultKeyToLetter[result.key];
  const dotColor = houseMeta[topLetter]?.color ?? 'bg-gray-300';

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to all quizzes"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          All Quizzes
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`bg-gradient-to-br ${result.color} rounded-xl p-8 md:p-10 shadow-md border border-white/60 mb-8`}
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
              Your house is...
            </p>
            <h1 className={`text-3xl md:text-4xl font-extrabold ${result.accent}`}>
              {result.name}
            </h1>
            <p className="mt-2 text-xs font-semibold text-gray-400 tracking-wide">{result.tagline}</p>
          </div>

          <p className="text-gray-700 leading-relaxed text-center text-base md:text-lg">
            {result.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">House Traits</h3>
          </div>
          <ul className="space-y-2.5">
            {result.traits.map((trait) => (
              <li key={trait} className="flex items-center gap-3">
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
                <span className="text-sm font-semibold text-gray-700">{trait}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Your House Breakdown
          </h3>
          {houseOrder.map((key, i) => (
            <HouseBar
              key={key}
              houseKey={key}
              score={houseScores[key] ?? 0}
              delay={i * 0.08}
              isTop={key === topLetter}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 mb-5"
        >
          <div className="p-5 bg-emerald-50/60 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-bold text-emerald-700 uppercase tracking-wider">Strengths</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.strengths}</p>
          </div>
          <div className="p-5 bg-amber-50/60">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-amber-600 uppercase tracking-wider">Watch Out</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.watchOut}</p>
          </div>
        </motion.div>

        <FeedbackWidget quizKey="house" />

        <CompareBanner quizType="house" />

        <AuthNudgeBanner quiz="house" />

        <div className="flex gap-3">
          <motion.button
            onClick={() => { track('quiz_retaken', { quiz: 'house' }, user?.id ?? null); navigate('/quiz/house'); }}
            aria-label="Retake the House quiz"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            aria-label="Go to all quizzes"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
          >
            All Quizzes
          </motion.button>
          <SharePanel quizType="house" result={result} scores={houseScores} btnColor="from-amber-500 to-red-500" />
        </div>
      </div>
    </div>
  );
}
