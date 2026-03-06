import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Share2, Briefcase, Users, AlertTriangle, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { getStrengthsTheme, DOMAIN_COLORS } from '../data/strengthsThemes';
import NextQuizBanner from '../components/NextQuizBanner';
import InsightCard from '../components/InsightCard';

const DOMAIN_EMOJIS = {
  Executing: '⚙️',
  Influencing: '📣',
  'Relationship Building': '🤝',
  'Strategic Thinking': '♟️',
};

function ThemeBar({ name, score, domain, delay, rank }) {
  const colors = DOMAIN_COLORS[domain] ?? DOMAIN_COLORS.Executing;
  const isTop5 = rank <= 5;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs font-semibold mb-1">
        <span className={isTop5 ? colors.accent : 'text-gray-500'}>
          {rank <= 5 && <span className="mr-1 font-extrabold">#{rank}</span>}
          {name}
        </span>
        <span className={isTop5 ? colors.accent : 'text-gray-400'}>{score}%</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${isTop5 ? colors.bar : 'from-gray-200 to-gray-300'}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 0.6, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default function StrengthsResult() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data] = useState(() => {
    try {
      const raw = localStorage.getItem('personalens_strengths');
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
    track('quiz_result_viewed', { quiz: 'strengths' }, user?.id ?? null);
  }, [data, user?.id]);

  if (!data) return null;

  const { scores, result } = data;
  const { top5, ranked } = result;
  const top5Themes = top5.map((name) => getStrengthsTheme(name)).filter(Boolean);
  const top10 = ranked.slice(0, 10);

  // Domain breakdown for the top 5
  const domainCounts = {};
  top5Themes.forEach((t) => {
    domainCounts[t.domain] = (domainCounts[t.domain] || 0) + 1;
  });
  const domainsPresent = Object.entries(domainCounts).sort(([, a], [, b]) => b - a);

  async function handleShare() {
    const text = `My top 5 CliftonStrengths:\n${top5.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nDiscover yours!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My CliftonStrengths', text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      setShareError('Could not share. Please try copying manually.');
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          aria-label="Back to all quizzes"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </button>

        {/* ── Header card ─────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-gradient-to-br from-violet-100 to-purple-100 rounded-xl p-8 md:p-10 shadow-md border border-white/60 mb-8"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl md:text-7xl mb-4"
            >
              {top5Themes[0]?.emoji ?? '💪'}
            </motion.div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Your Top CliftonStrength
            </p>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-1 text-purple-700">
              {top5[0]}
            </h1>
            <p className="text-sm text-purple-500 font-semibold mb-5">
              {top5Themes[0]?.domain}
            </p>
            <p className="text-gray-700 leading-relaxed text-base md:text-lg">
              {top5Themes[0]?.description}
            </p>
          </div>

          {/* Domain badges */}
          <div className="flex flex-wrap gap-2 justify-center">
            {domainsPresent.map(([domain, count]) => {
              const colors = DOMAIN_COLORS[domain];
              return (
                <span
                  key={domain}
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${colors.badge}`}
                >
                  {DOMAIN_EMOJIS[domain]} {domain} × {count}
                </span>
              );
            })}
          </div>
        </motion.div>

        {/* ── Top 5 theme cards ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-5"
        >
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Your Top 5 Strengths
          </h2>
          <div className="flex flex-col gap-4">
            {top5Themes.map((theme, i) => {
              const colors = DOMAIN_COLORS[theme.domain];
              return (
                <motion.div
                  key={theme.name}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.25 + i * 0.08 }}
                  className={`bg-gradient-to-br ${colors.bg} rounded-xl p-5 border border-white/60 shadow-sm`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl shrink-0">{theme.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-lg font-extrabold ${colors.accent}`}>
                          #{i + 1} {theme.name}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${colors.badge}`}>
                          {theme.domain}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed mb-2">
                        {theme.description}
                      </p>
                      <div className="bg-white/50 rounded-lg p-3">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Watch out for
                        </p>
                        <p className="text-xs text-gray-600 leading-relaxed">{theme.watchOut}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Score bars (top 10) ──────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
            Your Top 10 Theme Scores
          </h3>
          {top10.map(([name, score], i) => {
            const theme = getStrengthsTheme(name);
            return (
              <ThemeBar
                key={name}
                name={name}
                score={score}
                domain={theme?.domain ?? 'Executing'}
                delay={i * 0.06}
                rank={i + 1}
              />
            );
          })}
        </motion.div>

        {/* ── At work insight ──────────────────────────────────────────────── */}
        <InsightCard icon={Briefcase} title="At Work" delay={0.4} color="bg-violet-100 text-violet-600">
          <div className="flex flex-col gap-3">
            {top5Themes.slice(0, 3).map((theme) => (
              <div key={theme.name}>
                <p className="text-xs font-bold text-gray-500 mb-1">{theme.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{theme.atWork}</p>
              </div>
            ))}
          </div>
        </InsightCard>

        {/* ── In relationships insight ─────────────────────────────────────── */}
        <InsightCard icon={Users} title="In Relationships" delay={0.5} color="bg-blue-100 text-blue-600">
          <div className="flex flex-col gap-3">
            {top5Themes.slice(0, 3).map((theme) => (
              <div key={theme.name}>
                <p className="text-xs font-bold text-gray-500 mb-1">{theme.name}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{theme.inRelationships}</p>
              </div>
            ))}
          </div>
        </InsightCard>

        {/* ── Pairs well with ──────────────────────────────────────────────── */}
        <InsightCard icon={Zap} title="Pairs Well With" delay={0.6} color="bg-amber-100 text-amber-600">
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Your top strength, <strong>{top5[0]}</strong>, works especially well alongside these other themes:
          </p>
          <div className="flex flex-wrap gap-2">
            {top5Themes[0]?.pairsWith?.map((p) => (
              <span
                key={p}
                className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                  top5.includes(p)
                    ? 'bg-violet-100 text-violet-700 border-violet-200'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}
              >
                {top5.includes(p) ? '✓ ' : ''}{p}
              </span>
            ))}
          </div>
        </InsightCard>

        {/* ── Growth edge ─────────────────────────────────────────────────── */}
        <InsightCard icon={TrendingUp} title="Growth Edge" delay={0.7} color="bg-emerald-100 text-emerald-600">
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Your lowest-scoring domain out of your top 5 is your natural growth edge — the area where intentional effort yields the biggest returns.
          </p>
          {(() => {
            const lowestDomain = domainsPresent[domainsPresent.length - 1]?.[0];
            const lowestTheme = top5Themes.find((t) => t.domain === lowestDomain);
            if (!lowestTheme) return null;
            return (
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-600 mb-1">{lowestTheme.domain} domain</p>
                <p className="text-sm text-gray-600 leading-relaxed">{lowestTheme.watchOut}</p>
              </div>
            );
          })()}
        </InsightCard>

        {/* ── Famous people ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">
            Famous {top5[0]}s
          </h3>
          <div className="flex flex-wrap gap-2">
            {top5Themes[0]?.famousPeople?.map((person) => (
              <span
                key={person}
                className="text-xs font-semibold bg-violet-50 text-violet-700 px-3 py-1 rounded-full border border-violet-100"
              >
                {person}
              </span>
            ))}
          </div>
        </motion.div>

        <NextQuizBanner currentQuizKey="strengths" />

        <div className="flex gap-3 mt-2">
          <motion.button
            onClick={() => {
              track('quiz_retaken', { quiz: 'strengths' }, user?.id ?? null);
              navigate('/quiz/strengths');
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Retake
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
          >
            All Quizzes
          </motion.button>
          <motion.button
            onClick={handleShare}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold shadow-md flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" /> Share
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
