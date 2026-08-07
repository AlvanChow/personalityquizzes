import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, ArrowRight } from 'lucide-react';
import SharePanel from '../components/SharePanel';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { safeLocalStorageRead } from '../utils/security';
import { enneagramInsights } from '../data/enneagramInsights';
import { getWing, WING_ADJACENTS } from '../data/enneagramWings';
import AuthNudgeBanner from '../components/AuthNudgeBanner';
import NextQuizBanner from '../components/NextQuizBanner';
import CompareBanner from '../components/CompareBanner';
import FeedbackWidget from '../components/FeedbackWidget';

/*
 * Enneagram result — read as a report, not a dashboard.
 *
 * The previous version stacked ~15 sibling cards, each an identical rounded
 * box with a coloured icon chip and an ALL-CAPS label, and nested cards inside
 * cards (two in the header, six more in the wing). With everything boxed and
 * every heading shouting, nothing outranked anything else, and the icon chips
 * pulled in six unrelated hues that had nothing to do with the type.
 *
 * So: hierarchy comes from type and space instead. One masthead, then sections
 * divided by hairlines. Labels are small caps, not uppercase shouts. Each type
 * carries a single accent colour used for its numeral, its bar and its chips —
 * and nothing else is coloured, so the accent actually means something.
 *
 * Colours are full static class strings because Tailwind scans source text and
 * cannot see composed names. Every family used here has a dark-mode override in
 * index.css, which is why the palette sticks to the standard families.
 */

const TYPE_NAMES = {
  '1': 'Reformer', '2': 'Helper', '3': 'Achiever', '4': 'Individualist',
  '5': 'Investigator', '6': 'Loyalist', '7': 'Enthusiast', '8': 'Challenger', '9': 'Peacemaker',
};

const TYPE_WORD = {
  '1': 'One', '2': 'Two', '3': 'Three', '4': 'Four', '5': 'Five',
  '6': 'Six', '7': 'Seven', '8': 'Eight', '9': 'Nine',
};

const ACCENT = {
  '1': { text: 'text-amber-700',   bar: 'bg-amber-500',   chip: 'bg-amber-50 text-amber-700 border-amber-200' },
  '2': { text: 'text-rose-500',    bar: 'bg-rose-400',    chip: 'bg-rose-50 text-rose-500 border-rose-200' },
  '3': { text: 'text-orange-700',  bar: 'bg-orange-500',  chip: 'bg-orange-50 text-orange-700 border-orange-200' },
  '4': { text: 'text-violet-700',  bar: 'bg-violet-500',  chip: 'bg-violet-50 text-violet-700 border-violet-200' },
  '5': { text: 'text-sky-500',     bar: 'bg-sky-400',     chip: 'bg-sky-50 text-sky-500 border-sky-200' },
  '6': { text: 'text-teal-400',    bar: 'bg-teal-400',    chip: 'bg-teal-50 text-teal-400 border-teal-200' },
  '7': { text: 'text-yellow-700',  bar: 'bg-yellow-500',  chip: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
  '8': { text: 'text-red-700',     bar: 'bg-red-500',     chip: 'bg-red-50 text-red-700 border-red-200' },
  '9': { text: 'text-emerald-700', bar: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
};

// The standard quiz maxes at 12 per type (3 questions × 4). The deep quiz uses
// weighted options (up to +4 × 4 questions = 16, and can go negative), so the
// denominator depends on which quiz produced the stored scores.
function maxScorePerType(quizKey) {
  return quizKey === 'enneagram_deep' ? 16 : 12;
}

/** Section heading: small caps over a hairline. One per section, never nested. */
function SectionHead({ children }) {
  return (
    <h2 className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gray-400 pb-3 mb-6 border-b border-gray-200">
      {children}
    </h2>
  );
}

/** A labelled paragraph in a definition list. Replaces the old boxed sub-cards. */
function Facet({ label, children }) {
  return (
    <div className="py-4 border-t border-gray-100 first:border-t-0 first:pt-0">
      <dt className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-gray-400 mb-1.5">{label}</dt>
      <dd className="text-[0.95rem] leading-relaxed text-gray-600">{children}</dd>
    </div>
  );
}

function ScoreRow({ typeNum, score, maxScore, isTop, accent, delay }) {
  const pct = Math.max(0, Math.min(100, Math.round((score / maxScore) * 100)));
  return (
    <div className="py-2.5">
      <div className="flex items-baseline justify-between gap-4 mb-1.5">
        <span className={`text-sm ${isTop ? `font-bold ${accent.text}` : 'font-semibold text-gray-500'}`}>
          <span className="tabular-nums">{typeNum}</span>
          <span className="mx-1.5 text-gray-300">·</span>
          {TYPE_NAMES[typeNum]}
        </span>
        <span className={`text-xs tabular-nums ${isTop ? `font-bold ${accent.text}` : 'font-semibold text-gray-400'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-[3px] rounded-full bg-gray-100 overflow-hidden">
        {/* Runners-up use the same accent at low opacity rather than a grey.
            bg-gray-300/400 have no dark-mode override in index.css, so they
            render near-white on the dark theme and outshout the top type. */}
        <motion.div
          className={`h-full rounded-full ${accent.bar} ${isTop ? '' : 'opacity-25'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, delay, ease: [0.2, 0.7, 0.3, 1] }}
        />
      </div>
    </div>
  );
}

export default function EnneagramResult() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [data] = useState(() => {
    const persisted = safeLocalStorageRead('personalens_enneagram', null);
    const stored = WING_ADJACENTS[persisted?.result?.typeNumber] ? persisted : location.state?.storedResult;
    // Guard against partial/corrupt stored data: we need a resolvable type
    // number and a non-empty scores object, or the page can't render.
    if (!WING_ADJACENTS[stored?.result?.typeNumber]) return null;
    if (!stored.scores || typeof stored.scores !== 'object' || Object.keys(stored.scores).length === 0) return null;
    return stored;
  });
  useEffect(() => { if (!data) navigate('/'); }, [data, navigate]);

  useEffect(() => {
    if (data) document.title = `${data.result.name} — My Personality Quizzes`;
  }, [data]);

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current || !data) return;
    viewedRef.current = true;
    track('quiz_result_viewed', { quiz: 'enneagram' }, user?.id ?? null);
  }, [data, user?.id]);

  if (!data) return null;

  const { result, scores } = data;
  const maxScore = maxScorePerType(data.quizKey);
  const insights = enneagramInsights[result.typeNumber];
  const sortedTypes = Object.entries(scores).sort(([, a], [, b]) => b - a);
  const { wingType, wingKey, wing } = getWing(result.typeNumber, scores);
  const [adj1, adj2] = WING_ADJACENTS[result.typeNumber];
  const accent = ACCENT[result.typeNumber] ?? ACCENT['9'];
  // Wing scores can be negative in the deep quiz — clamp so the balance bar
  // widths stay in [0, 100].
  const leftScore = Math.max(0, scores[adj1] ?? 0);
  const rightScore = Math.max(0, scores[adj2] ?? 0);
  const leftPct = Math.round((leftScore / (leftScore + rightScore || 1)) * 100);

  // `font-display` sits on the root so the serif runs through the whole
  // result, body copy included — the report reads in one voice instead of
  // switching typeface halfway down. Nunito still owns the rest of the app.
  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8 font-display">
      <div className="max-w-xl mx-auto">
        <button onClick={() => navigate('/')} aria-label="Back to all quizzes"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to Quizzes
        </button>

        {/* ── Masthead ─────────────────────────────────────────────── */}
        <motion.header
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.7, 0.3, 1] }}
          className="mb-14"
        >
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-gray-400 mb-6">
            Your Enneagram type
          </p>

          <div className="flex items-start gap-5">
            <span
              aria-hidden="true"
              className={`font-display leading-none ${accent.text} text-[5rem] md:text-[6rem] -mt-3 -ml-1 select-none`}
            >
              {result.typeNumber}
            </span>
            <div className="pt-2">
              <p className="text-sm font-semibold text-gray-400 mb-0.5">Type {TYPE_WORD[result.typeNumber]}</p>
              <h1 className="font-display text-3xl md:text-4xl leading-[1.05] text-gray-900">
                The {TYPE_NAMES[result.typeNumber]}
              </h1>
            </div>
          </div>

          <p className="mt-7 text-[1.02rem] leading-[1.7] text-gray-600 max-w-[60ch]">
            {result.description}
          </p>

          <dl className="mt-8">
            <Facet label="Core desire">{result.coreDesire}</Facet>
            <Facet label="Core fear">{result.coreFear}</Facet>
          </dl>
        </motion.header>

        {/* ── Scores ───────────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mb-14"
        >
          <SectionHead>Where you scored</SectionHead>
          {sortedTypes.map(([typeNum, score], i) => (
            <ScoreRow
              key={typeNum} typeNum={typeNum} score={score} maxScore={maxScore}
              isTop={typeNum === result.typeNumber} accent={accent} delay={0.2 + i * 0.05}
            />
          ))}
        </motion.section>

        {/* ── Wing ─────────────────────────────────────────────────── */}
        {wing && (
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-14"
          >
            <SectionHead>Your wing</SectionHead>

            <h3 className="font-display text-2xl md:text-3xl leading-tight text-gray-900">
              {wingKey.toLowerCase()} — {wing.name}
            </h3>
            <p className="mt-1 text-sm font-semibold text-gray-400">
              Type {result.typeNumber} leaning {TYPE_NAMES[wingType]}
            </p>
            <p className="mt-5 text-[0.98rem] leading-[1.7] text-gray-600 max-w-[60ch]">{wing.summary}</p>

            {/* Balance between the two adjacent types */}
            <div className="mt-7">
              <div className="flex items-baseline justify-between mb-2">
                <span className={`text-xs font-bold ${wingType === adj1 ? accent.text : 'text-gray-400'}`}>
                  {result.typeNumber}w{adj1} · {TYPE_NAMES[adj1]}
                </span>
                <span className={`text-xs font-bold ${wingType === adj2 ? accent.text : 'text-gray-400'}`}>
                  {TYPE_NAMES[adj2]} · {result.typeNumber}w{adj2}
                </span>
              </div>
              <div className="flex h-[3px] rounded-full overflow-hidden bg-gray-100">
                <motion.div
                  className={`h-full ${accent.bar} ${wingType === adj1 ? '' : 'opacity-25'}`}
                  initial={{ width: 0 }} animate={{ width: `${leftPct}%` }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                />
                <motion.div
                  className={`h-full ${accent.bar} ${wingType === adj2 ? '' : 'opacity-25'}`}
                  initial={{ width: 0 }} animate={{ width: `${100 - leftPct}%` }}
                  transition={{ duration: 0.7, delay: 0.35 }}
                />
              </div>
            </div>

            <dl className="mt-8">
              <Facet label="Key traits">
                <ul className="space-y-1.5">
                  {wing.keyTraits.map((trait) => (
                    <li key={trait} className="flex gap-2.5">
                      <span className="text-gray-300 select-none">—</span>
                      <span>{trait}</span>
                    </li>
                  ))}
                </ul>
              </Facet>
              <Facet label="At their best">{wing.atTheirBest}</Facet>
              <Facet label="Blind spot">{wing.blindSpot}</Facet>
              <Facet label="In relationships">{wing.relationship}</Facet>
              <Facet label="Growth path">{wing.growth}</Facet>
              <Facet label="Under stress">{wing.stress}</Facet>
            </dl>
          </motion.section>
        )}

        {/* ── Insights ─────────────────────────────────────────────── */}
        {insights && (
          <motion.section
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="mb-14"
          >
            <SectionHead>What this looks like in life</SectionHead>
            <dl>
              <Facet label="Career &amp; work">
                <p>{insights.careerNote}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {insights.careers.map((c) => (
                    <span key={c} className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${accent.chip}`}>
                      {c}
                    </span>
                  ))}
                </div>
              </Facet>
              <Facet label="Friendships &amp; relationships">{insights.friendships}</Facet>
              <Facet label="Inner life">{insights.psyche}</Facet>
            </dl>
          </motion.section>
        )}

        {/* ── Go deeper ────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-12 pt-6 border-t border-gray-200"
        >
          <h3 className="font-display text-xl text-gray-900 mb-1.5">Want a more nuanced read?</h3>
          <p className="text-sm leading-relaxed text-gray-500 mb-4 max-w-[52ch]">
            The 36-item core fears and desires inventory uses weighted scoring, which separates
            close types far more cleanly than this one can.
          </p>
          <button
            onClick={() => navigate('/quiz/enneagram-deep')}
            className={`text-sm font-bold ${accent.text} hover:opacity-70 flex items-center gap-1.5 transition-opacity`}
          >
            Take the deep inventory <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <FeedbackWidget quizKey={data.quizKey || 'enneagram'} />

        <AuthNudgeBanner quiz={data.quizKey || 'enneagram'} />

        <CompareBanner quizType="enneagram" />

        <NextQuizBanner currentQuizKey="enneagram" />

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
          <SharePanel quizType="enneagram" result={result} scores={scores} btnColor="from-mint-400 to-mint-500" />
        </div>
      </div>
    </div>
  );
}
