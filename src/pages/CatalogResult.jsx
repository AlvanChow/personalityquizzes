import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles, TrendingUp, Heart } from 'lucide-react';
import SharePanel from '../components/SharePanel';
import AuthNudgeBanner from '../components/AuthNudgeBanner';
import NextQuizBanner from '../components/NextQuizBanner';
import { getQuizMeta, storageKeyFor } from '../data/quizzes';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { safeLocalStorageRead } from '../utils/security';

function Spinner() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
    </div>
  );
}

function BreakdownBar({ label, pct, color, isTop, delay }) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-sm font-semibold ${isTop ? 'text-gray-800' : 'text-gray-500'}`}>
          {label}
          {isTop && <span className="ml-2 text-xs font-bold text-amber-500 uppercase tracking-wide">Top</span>}
        </span>
        <span className={`text-sm font-bold ${isTop ? 'text-gray-700' : 'text-gray-400'}`}>{pct}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// Generic result screen for every catalog quiz. Reads the stored outcome from
// localStorage and lazy-loads the quiz definition for breakdown labels.
export default function CatalogResult() {
  const { quizKey } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const meta = getQuizMeta(quizKey);

  const [quiz, setQuiz] = useState(null);
  const [stored] = useState(() => (meta ? safeLocalStorageRead(storageKeyFor(meta.key), null) : null));

  useEffect(() => {
    if (!meta?.load) {
      navigate('/404', { replace: true });
      return;
    }
    if (!stored?.result) {
      navigate(`/quiz/${meta.key}`, { replace: true });
      return;
    }
    let cancelled = false;
    meta.load().then((mod) => {
      if (!cancelled) setQuiz(mod.default);
    });
    return () => { cancelled = true; };
  }, [meta, stored, navigate]);

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current || !stored?.result || !meta) return;
    viewedRef.current = true;
    track('quiz_result_viewed', { quiz: meta.key }, user?.id ?? null);
  }, [stored, meta, user?.id]);

  if (!meta || !stored?.result) return null;
  if (!quiz) return <Spinner />;

  const { result, resultKey, scores, overallPct } = stored;
  const isLikert = quiz.mode === 'likert';
  const hasBands = Boolean(quiz.bands?.length);

  // Breakdown rows: pick mode ranks result matches; likert mode shows the
  // dimension profile in its declared order (a balance snapshot).
  const rows = isLikert
    ? Object.keys(quiz.dimensions).map((dim) => ({
        key: dim,
        label: quiz.dimensions[dim].label,
        pct: scores?.[dim] ?? 0,
        color: quiz.dimensions[dim].color,
      }))
    : Object.entries(quiz.results)
        .map(([key, r]) => ({ key, label: r.name, pct: scores?.[key] ?? 0, color: 'bg-coral-400' }))
        .sort((a, b) => b.pct - a.pct);

  const topRowKey = isLikert && !hasBands
    ? resultKey
    : (isLikert ? [...rows].sort((a, b) => b.pct - a.pct)[0]?.key : rows[0]?.key);

  // For multi-dimension likert quizzes, surface the lowest area as a growth nudge.
  const lowRow = isLikert && rows.length > 1
    ? [...rows].sort((a, b) => a.pct - b.pct)[0]
    : null;

  const kindred = (result.kindred ?? [])
    .map((k) => quiz.results?.[k])
    .filter(Boolean);

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

        {/* ── Hero card ── */}
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
              {hasBands ? 'Your result' : 'You are...'}
            </p>
            <h1 className={`text-3xl md:text-4xl font-extrabold ${result.accent}`}>
              {result.name}
            </h1>
            {hasBands && overallPct != null && (
              <p className={`mt-2 text-lg font-extrabold ${result.accent}`}>
                {overallPct}<span className="text-sm font-bold opacity-70">/100</span>
              </p>
            )}
            <p className="mt-2 text-xs font-semibold text-gray-400 tracking-wide">{result.tagline}</p>
          </div>

          <p className="text-gray-700 leading-relaxed text-center text-base md:text-lg">
            {result.description}
          </p>
        </motion.div>

        {/* ── Strengths ── */}
        {result.strengths?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Your Strengths</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {result.strengths.map((s) => (
                <span key={s} className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1 rounded-full border border-amber-100">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Breakdown ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            {quiz.resultsHeading}
          </h3>
          {rows.map((row, i) => (
            <BreakdownBar
              key={row.key}
              label={row.label}
              pct={row.pct}
              color={isLikert ? row.color : (row.key === topRowKey ? row.color : 'bg-gray-200')}
              isTop={row.key === topRowKey}
              delay={i * 0.08}
            />
          ))}
        </motion.div>

        {/* ── Growth edge ── */}
        {result.growth && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Your Growth Edge</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{result.growth}</p>
            {lowRow && lowRow.key !== topRowKey && (
              <p className="text-xs text-gray-400 leading-relaxed mt-3 pt-3 border-t border-gray-100">
                Lowest area right now: <span className="font-bold text-gray-500">{lowRow.label}</span> ({lowRow.pct}%) — a little attention there goes a long way.
              </p>
            )}
          </motion.div>
        )}

        {/* ── Kindred spirits ── */}
        {kindred.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-100 text-rose-500">
                <Heart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">You&apos;d Get Along With</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {kindred.map((k) => (
                <span key={k.name} className="text-sm font-semibold bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full border border-rose-100">
                  {k.emoji} {k.name}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        <NextQuizBanner currentQuizKey={meta.key} />

        <AuthNudgeBanner quiz={meta.key} />

        <div className="flex gap-3">
          <motion.button
            onClick={() => { track('quiz_retaken', { quiz: meta.key }, user?.id ?? null); navigate(`/quiz/${meta.key}`); }}
            aria-label={`Retake the ${meta.quizName}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </motion.button>
          <motion.button
            onClick={() => navigate('/dashboard')}
            aria-label="Go to Dashboard"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
          >
            Dashboard
          </motion.button>
          <SharePanel quizType={meta.key} result={result} btnColor="from-coral-400 to-coral-500" />
        </div>
      </div>
    </div>
  );
}
