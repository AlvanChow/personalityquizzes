import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Sparkles, TrendingUp, Heart, Trophy } from 'lucide-react';
import SharePanel from '../components/SharePanel';
import AuthNudgeBanner from '../components/AuthNudgeBanner';
import NextQuizBanner from '../components/NextQuizBanner';
import FeedbackWidget from '../components/FeedbackWidget';
import { getQuizMeta, storageKeyFor } from '../data/quizzes';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { safeLocalStorageRead } from '../utils/security';

const PICK_PALETTE = ['bg-coral-400', 'bg-sky-400', 'bg-mint-400', 'bg-violet-400', 'bg-amber-400', 'bg-rose-400'];

function Spinner() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
    </div>
  );
}

function SectionCard({ icon: Icon, iconBg, title, delay, children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-5"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// Donut gauge for overall-score (banded) quizzes.
function ScoreRing({ pct, accentClass }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative w-[104px] h-[104px] mx-auto">
      <svg width="104" height="104" viewBox="0 0 104 104" className={accentClass}>
        <circle cx="52" cy="52" r={r} fill="none" stroke="currentColor" strokeOpacity="0.16" strokeWidth="9" />
        <motion.circle
          cx="52" cy="52" r={r} fill="none" stroke="currentColor" strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 1.1, delay: 0.35, ease: 'easeOut' }}
          transform="rotate(-90 52 52)"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-black leading-none ${accentClass}`}>{pct}</span>
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">/ 100</span>
      </div>
    </div>
  );
}

// One ranked row in the profile leaderboard.
function RankRow({ rank, emoji, label, pct, colorBg, isTop, delay }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${isTop ? 'bg-gray-50 ring-1 ring-gray-900/5' : ''}`}>
      <span className={`shrink-0 w-6 text-center text-sm font-black tabular-nums ${isTop ? 'text-amber-500' : 'text-gray-300'}`}>
        {rank}
      </span>
      {emoji && <span className="text-xl shrink-0 leading-none">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className={`text-sm font-bold truncate ${isTop ? 'text-gray-900' : 'text-gray-600'}`}>{label}</span>
          <span className={`text-sm font-black tabular-nums shrink-0 ${isTop ? 'text-gray-800' : 'text-gray-400'}`}>{pct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${colorBg} ${isTop ? '' : 'opacity-60'}`}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  );
}

// Sub-dimension tile for banded quizzes (e.g. grit's passion / perseverance).
function DimensionTile({ emoji, label, pct, colorBg, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex-1 min-w-[150px] rounded-xl border border-gray-100 bg-gray-50/70 p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-gray-500 leading-tight">{emoji ? `${emoji} ` : ''}{label}</span>
        <span className="text-lg font-black text-gray-800 tabular-nums">{pct}</span>
      </div>
      <div className="h-2 bg-gray-200/70 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${colorBg}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay: delay + 0.1, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

// Ladder of all bands with the achieved one highlighted.
function BandLadder({ bands, currentKey, accentClass }) {
  return (
    <div className="flex flex-col gap-2">
      {bands.map((b, i) => {
        const isCurrent = (b.key ?? `band_${i}`) === currentKey;
        return (
          <div
            key={b.key ?? i}
            className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 border transition-colors ${
              isCurrent ? 'border-transparent bg-gray-900 text-white shadow-sm' : 'border-gray-100 bg-white'
            }`}
          >
            <span className="text-lg shrink-0">{b.emoji}</span>
            <span className={`text-sm font-bold flex-1 ${isCurrent ? 'text-white' : 'text-gray-500'}`}>{b.name}</span>
            {isCurrent
              ? <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-2 py-0.5 rounded-full">You</span>
              : <span className="text-[11px] font-bold text-gray-300 tabular-nums">{b.min}+</span>}
          </div>
        );
      })}
      <p className={`text-[11px] font-semibold text-center mt-1 ${accentClass}`}>
        Higher isn&apos;t better — each band is a different, valid place to be.
      </p>
    </div>
  );
}

// Generic result screen for every catalog quiz. Reads the stored outcome from
// localStorage and lazy-loads the quiz definition for breakdown labels.
export default function CatalogResult() {
  const { quizKey } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const meta = getQuizMeta(quizKey);

  const [quiz, setQuiz] = useState(null);
  const [stored] = useState(() => {
    if (!meta) return null;
    const persisted = safeLocalStorageRead(storageKeyFor(meta.key), null);
    return persisted?.result ? persisted : location.state?.storedResult ?? null;
  });

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

  // Build the ranked / dimension rows. Called unconditionally (hooks rule);
  // returns empty until the quiz definition has loaded.
  const model = useMemo(() => {
    if (!quiz || !stored?.result) return null;
    const isLikert = quiz.mode === 'likert';
    const hasBands = Boolean(quiz.bands?.length);
    const scores = stored.scores ?? {};

    if (isLikert && hasBands) {
      // Banded: sub-dimensions become tiles, bands become a ladder.
      const tiles = Object.keys(quiz.dimensions).map((dim) => ({
        key: dim,
        label: quiz.dimensions[dim].label,
        pct: scores[dim] ?? 0,
        colorBg: quiz.dimensions[dim].color,
      }));
      return { kind: 'banded', tiles, bands: quiz.bands };
    }

    // Unbanded likert or pick → a ranked leaderboard.
    const raw = isLikert
      ? Object.keys(quiz.dimensions).map((dim) => ({
          key: dim,
          label: quiz.dimensions[dim].label,
          emoji: quiz.results?.[dim]?.emoji ?? '',
          shortName: quiz.results?.[dim]?.name ?? quiz.dimensions[dim].label,
          pct: scores[dim] ?? 0,
          colorBg: quiz.dimensions[dim].color,
        }))
      : Object.entries(quiz.results).map(([key, r], i) => ({
          key,
          label: r.name,
          emoji: r.emoji ?? '',
          shortName: r.name,
          pct: scores[key] ?? 0,
          colorBg: PICK_PALETTE[i % PICK_PALETTE.length],
        }));
    // Stable rank: highest pct first, declaration order breaks ties.
    const rows = raw
      .map((r, i) => ({ ...r, order: i }))
      .sort((a, b) => (b.pct - a.pct) || (a.order - b.order));
    // RIASEC's Holland code — the first letters of the top three interests.
    const code = quiz.key === 'riasec'
      ? rows.slice(0, 3).map((r) => r.key[0].toUpperCase()).join('')
      : null;
    return { kind: 'ranked', rows, code };
  }, [quiz, stored]);

  if (!meta || !stored?.result) return null;
  if (!quiz || !model) return <Spinner />;

  const { result, scores, overallPct } = stored;
  const hasBands = model.kind === 'banded';

  // A flat / no-signal profile is presented as "balanced", never a confident
  // single winner. Low-but-not-flat profiles soften the headline so a
  // relatively-strongest-yet-modest area isn't oversold as a "superpower".
  const rawScores = stored.rawScores ?? scores;
  const tie = !hasBands && !!stored.tie;
  const topRaw = rawScores?.[stored.resultKey] ?? 100;
  const lowConfidence = !hasBands && !tie && topRaw < 55;

  const BALANCED_COPY = 'You spread pretty evenly across these — no single one runs away with it. That breadth is genuinely useful, but it also means this read is less sharp than usual. Retake and answer more decisively if you want a clearer standout.';

  const kindred = tie ? [] : (result.kindred ?? [])
    .map((k) => quiz.results?.[k])
    .filter(Boolean);

  const tagPills = (!tie && typeof result.tagline === 'string')
    ? result.tagline.split(/\s+/).filter(Boolean).slice(0, 4)
    : [];

  const topBlend = model.kind === 'ranked' ? model.rows.slice(0, 3) : [];
  const lowRow = model.kind === 'ranked' && model.rows.length > 2
    ? model.rows[model.rows.length - 1]
    : null;

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Back to Dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`relative overflow-hidden bg-gradient-to-br ${result.color} rounded-2xl p-8 md:p-10 shadow-md border border-white/60 mb-6`}
        >
          <div className="text-center relative">
            <div className="relative inline-flex items-center justify-center mb-4">
              <span className="absolute w-24 h-24 rounded-full bg-white/50 dark:bg-white/10 blur-2xl" aria-hidden="true" />
              <motion.span
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 12 }}
                className="relative text-6xl md:text-7xl"
              >
                {tie ? '⚖️' : result.emoji}
              </motion.span>
            </div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              {hasBands ? 'Your result' : tie ? 'Your profile' : lowConfidence ? 'Your strongest area' : 'You are…'}
            </p>
            <h1 className={`text-3xl md:text-4xl font-black leading-tight ${tie ? 'text-gray-800' : result.accent}`}>
              {tie ? 'Fairly balanced' : result.name}
            </h1>

            {tagPills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 mt-3">
                {tagPills.map((t) => (
                  <span key={t} className={`text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/55 dark:bg-white/10 ${result.accent}`}>
                    {t}
                  </span>
                ))}
              </div>
            )}

            {hasBands && overallPct != null && (
              <div className="mt-6">
                <ScoreRing pct={overallPct} accentClass={result.accent} />
              </div>
            )}

            <p className="text-gray-700 leading-relaxed text-[15px] md:text-base mt-5 text-left">
              {tie ? BALANCED_COPY : result.description}
            </p>
          </div>
        </motion.div>

        {/* ── Strengths ── */}
        {result.strengths?.length > 0 && (
          <SectionCard icon={Sparkles} iconBg="bg-amber-100 text-amber-600" title="Your Strengths" delay={0.25}>
            <div className="flex flex-wrap gap-2">
              {result.strengths.map((s) => (
                <span key={s} className="text-xs font-semibold bg-amber-50 text-amber-700 px-3 py-1.5 rounded-full border border-amber-100">
                  {s}
                </span>
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── Ranked profile (unbanded likert + pick) ── */}
        {model.kind === 'ranked' && (
          <SectionCard icon={Trophy} iconBg="bg-sky-100 text-sky-600" title={quiz.resultsHeading} delay={0.35}>
            {!tie && topBlend.length >= 2 && (
              <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-100">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Your top blend</span>
                {topBlend.map((r) => (
                  <span key={r.key} className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-50 border border-gray-100 rounded-full px-2.5 py-1">
                    {r.emoji} {r.shortName}
                  </span>
                ))}
                {model.code && (
                  <span className="ml-auto text-[11px] font-black tracking-widest text-sky-600 bg-sky-50 border border-sky-100 rounded-full px-2.5 py-1">
                    CODE · {model.code}
                  </span>
                )}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              {model.rows.map((row, i) => (
                <RankRow
                  key={row.key}
                  rank={i + 1}
                  emoji={row.emoji}
                  label={row.label}
                  pct={row.pct}
                  colorBg={row.colorBg}
                  isTop={i === 0}
                  delay={0.1 + i * 0.07}
                />
              ))}
            </div>
          </SectionCard>
        )}

        {/* ── Dimension tiles + band ladder (banded likert) ── */}
        {model.kind === 'banded' && (
          <>
            {model.tiles.length > 0 && (
              <SectionCard icon={Trophy} iconBg="bg-sky-100 text-sky-600" title={quiz.resultsHeading} delay={0.35}>
                <div className="flex flex-wrap gap-3">
                  {model.tiles.map((t, i) => (
                    <DimensionTile key={t.key} label={t.label} pct={t.pct} colorBg={t.colorBg} delay={0.1 + i * 0.08} />
                  ))}
                </div>
              </SectionCard>
            )}
            <SectionCard icon={TrendingUp} iconBg="bg-violet-100 text-violet-600" title="Where you land" delay={0.45}>
              <BandLadder bands={model.bands} currentKey={stored.resultKey} accentClass={result.accent} />
            </SectionCard>
          </>
        )}

        {/* ── Growth edge (skipped on a balanced/tie profile — the dim-specific
             copy would misdescribe an undifferentiated result) ── */}
        {!tie && result.growth && (
          <SectionCard icon={TrendingUp} iconBg="bg-emerald-100 text-emerald-600" title="Your Growth Edge" delay={0.5}>
            <p className="text-sm text-gray-600 leading-relaxed">{result.growth}</p>
            {lowRow
              && lowRow.key !== model.rows?.[0]?.key
              && (rawScores?.[lowRow.key] ?? 100) < 55
              && (model.rows[0].pct - lowRow.pct) >= 25 && (
              <p className="text-xs text-gray-400 leading-relaxed mt-3 pt-3 border-t border-gray-100">
                Quietest area right now: <span className="font-bold text-gray-500">{lowRow.shortName}</span> — a little attention there goes a long way.
              </p>
            )}
          </SectionCard>
        )}

        {/* ── Kindred spirits ── */}
        {kindred.length > 0 && (
          <SectionCard icon={Heart} iconBg="bg-rose-100 text-rose-500" title="You'd Get Along With" delay={0.55}>
            <div className="flex flex-wrap gap-2">
              {kindred.map((k) => (
                <span key={k.name} className="text-sm font-semibold bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full border border-rose-100">
                  {k.emoji} {k.name}
                </span>
              ))}
            </div>
          </SectionCard>
        )}

        <FeedbackWidget quizKey={meta.key} />

        <AuthNudgeBanner quiz={meta.key} />

        <NextQuizBanner currentQuizKey={meta.key} />

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
          <SharePanel quizType={meta.key} result={result} scores={scores} btnColor="from-coral-400 to-coral-500" />
        </div>
      </div>
    </div>
  );
}
