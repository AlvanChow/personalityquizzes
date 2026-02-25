import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Share2, Briefcase, Users, Brain, Feather, Heart, AlertTriangle, TrendingUp, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { enneagramInsights } from '../data/enneagramInsights';
import { getWing, WING_ADJACENTS } from '../data/enneagramWings';

const MAX_SCORE_PER_TYPE = 12;

function TypeBar({ typeNum, score, label, delay, isTop }) {
  const pct = Math.round((score / MAX_SCORE_PER_TYPE) * 100);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span className={isTop ? 'text-mint-600' : 'text-gray-600'}>Type {typeNum} — {label}</span>
        <span className={isTop ? 'text-mint-600' : 'text-gray-600'}>{pct}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isTop ? 'bg-gradient-to-r from-mint-300 to-mint-400' : 'bg-gradient-to-r from-gray-300 to-gray-400'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

const TYPE_NAMES = {
  '1': 'Reformer', '2': 'Helper', '3': 'Achiever', '4': 'Individualist',
  '5': 'Investigator', '6': 'Loyalist', '7': 'Enthusiast', '8': 'Challenger', '9': 'Peacemaker',
};

function InsightCard({ icon: Icon, title, children, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

export default function EnneagramResult() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data] = useState(() => {
    try {
      const raw = localStorage.getItem('personalens_enneagram');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [shareError, setShareError] = useState(null);

  useEffect(() => { if (!data) navigate('/'); }, [data, navigate]);

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current || !data) return;
    viewedRef.current = true;
    track('quiz_result_viewed', { quiz: 'enneagram' }, user?.id ?? null);
  }, [data, user?.id]);

  if (!data) return null;

  const { result, scores } = data;
  const insights = enneagramInsights[result.typeNumber];
  const topScore = Math.max(...Object.values(scores));
  const sortedTypes = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const { wingType, wingKey, wing } = getWing(result.typeNumber, scores);
  const [adj1, adj2] = WING_ADJACENTS[result.typeNumber];
  const wingBalance = {
    left: { type: adj1, name: TYPE_NAMES[adj1], score: scores[adj1] ?? 0 },
    right: { type: adj2, name: TYPE_NAMES[adj2], score: scores[adj2] ?? 0 },
  };

  async function handleShare() {
    const text = `I'm a ${result.name} on the Enneagram! My core desire: ${result.coreDesire}. Find out your type!`;
    try {
      if (navigator.share) { await navigator.share({ title: 'My Enneagram Result', text }); }
      else { await navigator.clipboard.writeText(text); }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setShareError('Could not share. Please try copying manually.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button onClick={() => navigate('/')} aria-label="Back to all quizzes"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </button>

        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`bg-gradient-to-br ${result.color} rounded-xl p-8 md:p-10 shadow-md border border-white/60 mb-8`}>
          <div className="text-center mb-6">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }} className="text-6xl md:text-7xl mb-4">
              {result.emoji}
            </motion.div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">You are...</p>
            <h1 className={`text-3xl md:text-4xl font-extrabold mb-1 ${result.accent}`}>{result.name}</h1>
          </div>
          <p className="text-gray-700 leading-relaxed text-center text-base md:text-lg mb-6">{result.description}</p>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Core Desire</p>
              <p className="text-sm font-semibold text-gray-700">{result.coreDesire}</p>
            </div>
            <div className="bg-white/60 rounded-lg p-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Core Fear</p>
              <p className="text-sm font-semibold text-gray-700">{result.coreFear}</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">Your Type Scores</h3>
          {sortedTypes.map(([typeNum, score], i) => (
            <TypeBar key={typeNum} typeNum={typeNum} score={score} label={TYPE_NAMES[typeNum]}
              delay={i * 0.08} isTop={score === topScore} />
          ))}
        </motion.div>

        {wing && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-violet-200 mb-5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-violet-100 text-violet-600">
                <Feather className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-violet-500 uppercase tracking-wider">Your Wing</h3>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1 mt-3">
              {wingKey.toUpperCase()}: {wing.name}
            </h2>
            <p className="text-xs font-semibold text-violet-400 mb-4">
              Type {result.typeNumber} with a {TYPE_NAMES[wingType]} wing
            </p>

            <p className="text-sm text-gray-600 leading-relaxed mb-5">{wing.summary}</p>

            <div className="bg-white/60 rounded-lg p-4 mb-4">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Wing Balance</p>
              <div className="flex items-center gap-3">
                <span className={`text-xs font-bold ${wingType === adj1 ? 'text-violet-600' : 'text-gray-400'} shrink-0`}>
                  {adj1}w
                </span>
                <div className="flex-1 flex h-3 rounded-full overflow-hidden bg-gray-100">
                  <motion.div
                    className={`h-full rounded-l-full ${wingType === adj1 ? 'bg-gradient-to-r from-violet-300 to-violet-400' : 'bg-gray-300'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((wingBalance.left.score / (wingBalance.left.score + wingBalance.right.score || 1)) * 100)}%` }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  />
                  <motion.div
                    className={`h-full rounded-r-full ${wingType === adj2 ? 'bg-gradient-to-r from-violet-300 to-violet-400' : 'bg-gray-300'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((wingBalance.right.score / (wingBalance.left.score + wingBalance.right.score || 1)) * 100)}%` }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  />
                </div>
                <span className={`text-xs font-bold ${wingType === adj2 ? 'text-violet-600' : 'text-gray-400'} shrink-0`}>
                  {adj2}w
                </span>
              </div>
              <div className="flex justify-between mt-1.5">
                <span className="text-[10px] text-gray-400 font-medium">{wingBalance.left.name} ({wingBalance.left.score})</span>
                <span className="text-[10px] text-gray-400 font-medium">{wingBalance.right.name} ({wingBalance.right.score})</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-white/60 rounded-lg p-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Key Traits</p>
                <ul className="space-y-1.5">
                  {wing.keyTraits.map((trait) => (
                    <li key={trait} className="text-sm text-gray-600 leading-relaxed flex items-start gap-2">
                      <span className="text-violet-400 mt-0.5 shrink-0">&#x2022;</span>
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">At Their Best</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{wing.atTheirBest}</p>
              </div>

              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blind Spot</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{wing.blindSpot}</p>
              </div>

              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <Heart className="w-3.5 h-3.5 text-rose-400" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Relationships</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{wing.relationship}</p>
              </div>

              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Growth Path</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{wing.growth}</p>
              </div>

              <div className="bg-white/60 rounded-lg p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Under Stress</p>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{wing.stress}</p>
              </div>
            </div>
          </motion.div>
        )}

        {insights && (
          <>
            <InsightCard icon={Briefcase} title="Career & Work" delay={0.4} color="bg-mint-100 text-mint-600">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{insights.careerNote}</p>
              <div className="flex flex-wrap gap-2">
                {insights.careers.map((c) => (
                  <span key={c} className="text-xs font-semibold bg-mint-50 text-mint-600 px-3 py-1 rounded-full border border-mint-100">{c}</span>
                ))}
              </div>
            </InsightCard>
            <InsightCard icon={Users} title="Friendships & Relationships" delay={0.5} color="bg-rose-100 text-rose-500">
              <p className="text-sm text-gray-600 leading-relaxed">{insights.friendships}</p>
            </InsightCard>
            <InsightCard icon={Brain} title="Psychological Insights" delay={0.6} color="bg-violet-100 text-violet-600">
              <p className="text-sm text-gray-600 leading-relaxed">{insights.psyche}</p>
            </InsightCard>
          </>
        )}

        <div className="flex gap-3 mt-2">
          <motion.button onClick={() => { track('quiz_retaken', { quiz: 'enneagram' }, user?.id ?? null); navigate('/quiz/enneagram'); }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors flex items-center justify-center gap-2">
            <RotateCcw className="w-4 h-4" /> Retake
          </motion.button>
          <motion.button onClick={() => navigate('/')} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors">
            All Quizzes
          </motion.button>
          <motion.button onClick={handleShare} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-gradient-to-r from-mint-400 to-mint-500 text-white font-bold shadow-md flex items-center justify-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </motion.button>
        </div>
        {shareError && <p role="alert" className="mt-3 text-sm text-red-600 text-center font-medium">{shareError}</p>}
      </div>
    </div>
  );
}
