import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, RotateCcw, Share2, Briefcase, Users, Star, ShieldAlert, Sparkles, TrendingUp, Zap, AlertTriangle, ChevronDown, Layers, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { mbtiInsights } from '../data/mbtiInsights';
import { mbtiRoles } from '../data/mbtiResults';
import NextQuizBanner from '../components/NextQuizBanner';
import InsightCard from '../components/InsightCard';

const DIMENSION_LABELS = {
  IE: { low: 'Introversion (I)', high: 'Extraversion (E)' },
  SN: { low: 'Sensing (S)', high: 'iNtuition (N)' },
  TF: { low: 'Thinking (T)', high: 'Feeling (F)' },
  JP: { low: 'Judging (J)', high: 'Perceiving (P)' },
};

const DIMENSION_ORDER = ['IE', 'SN', 'TF', 'JP'];

const ROLE_ICON_COLORS = {
  analysts:  'bg-purple-100 text-purple-600',
  diplomats: 'bg-green-100 text-green-600',
  sentinels: 'bg-sky-100 text-sky-600',
  explorers: 'bg-amber-100 text-amber-600',
};

const ROLE_BADGE_COLORS = {
  analysts:  'bg-purple-100 text-purple-700 border-purple-200',
  diplomats: 'bg-green-100 text-green-700 border-green-200',
  sentinels: 'bg-sky-100 text-sky-700 border-sky-200',
  explorers: 'bg-amber-100 text-amber-700 border-amber-200',
};

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

function ExpandableItem({ title, text, accent }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen(o => !o)} className="w-full text-left">
      <div className="flex items-center justify-between py-2">
        <span className={`text-sm font-semibold ${accent}`}>{title}</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs text-gray-500 leading-relaxed pb-2 overflow-hidden"
          >
            {text}
          </motion.p>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function MBTIResult() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data] = useState(() => {
    try {
      const raw = localStorage.getItem('personalens_mbti');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [shareError, setShareError] = useState(null);

  useEffect(() => {
    if (!data) navigate('/');
  }, [data, navigate]);

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current || !data) return;
    viewedRef.current = true;
    track('quiz_result_viewed', { quiz: 'mbti' }, user?.id ?? null);
  }, [data, user?.id]);

  if (!data) return null;

  const { result, scores } = data;
  const insights = mbtiInsights[result.name];
  const roleData = result.role ? mbtiRoles[result.role] : null;
  const roleIconColor = result.role ? ROLE_ICON_COLORS[result.role] : '';
  const roleBadgeColor = result.role ? ROLE_BADGE_COLORS[result.role] : '';

  async function handleShare() {
    const text = `I got ${result.name} — ${result.nickname} on My Personality Quizzes! Discover your MBTI type too.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My MBTI Result', text });
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
          onClick={() => navigate('/')}
          aria-label="Back to all quizzes"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Quizzes
        </button>

        {/* ── Type header card ── */}
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
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Your type is...
            </p>
            <h1 className={`text-5xl font-black tracking-widest mb-1 ${result.accent}`}>
              {result.name}
            </h1>
            <p className={`text-lg font-bold ${result.accent} opacity-70 mb-3`}>
              {result.nickname}
            </p>
            {roleData && (
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${roleBadgeColor}`}>
                <span>{roleData.emoji}</span>
                {roleData.name}
              </span>
            )}
          </div>

          <p className="text-gray-700 leading-relaxed text-center text-base md:text-lg">
            {result.description}
          </p>
        </motion.div>

        {/* ── Dimension scores ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-5">
            Your Dimension Scores
          </h3>
          {DIMENSION_ORDER.map((dim, i) => (
            <DimensionBar key={dim} dim={dim} score={scores[dim] ?? 50} delay={i * 0.1} />
          ))}
        </motion.div>

        {/* ── Role group card ── */}
        {roleData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${roleIconColor}`}>
                <span className="text-sm">{roleData.emoji}</span>
              </div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
                {roleData.name} · {roleData.code}
              </h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{roleData.description}</p>
          </motion.div>
        )}

        {insights && (
          <>
            {/* ── Career & Work ── */}
            <InsightCard icon={Briefcase} title="Career & Work" delay={0.4} color="bg-sky-100 text-sky-600">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{insights.careerNote}</p>
              <div className="flex flex-wrap gap-2">
                {insights.careers.map((c) => (
                  <span key={c} className="text-xs font-semibold bg-sky-50 text-sky-600 px-3 py-1 rounded-full border border-sky-100">
                    {c}
                  </span>
                ))}
              </div>
            </InsightCard>

            {/* ── Friendships & Relationships ── */}
            <InsightCard icon={Users} title="Friendships & Relationships" delay={0.45} color="bg-rose-100 text-rose-500">
              <p className="text-sm text-gray-600 leading-relaxed">{insights.friendships}</p>
            </InsightCard>

            {/* ── Strengths ── */}
            {result.strengths?.length > 0 && (
              <InsightCard icon={Star} title="Strengths" delay={0.5} color="bg-emerald-100 text-emerald-600">
                <div className="divide-y divide-gray-100">
                  {result.strengths.map((s) => (
                    <ExpandableItem key={s.title} title={s.title} text={s.text} accent="text-emerald-700" />
                  ))}
                </div>
              </InsightCard>
            )}

            {/* ── Blind Spots ── */}
            {result.weaknesses?.length > 0 && (
              <InsightCard icon={ShieldAlert} title="Blind Spots" delay={0.55} color="bg-orange-100 text-orange-600">
                <div className="divide-y divide-gray-100">
                  {result.weaknesses.map((w) => (
                    <ExpandableItem key={w.title} title={w.title} text={w.text} accent="text-orange-700" />
                  ))}
                </div>
              </InsightCard>
            )}

            {/* ── Peak & Pressure ── */}
            {(insights.atBest || insights.underStress) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
              >
                {insights.atBest && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-emerald-100 text-emerald-600">
                        <Zap className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">At Their Best</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{insights.atBest}</p>
                  </div>
                )}
                {insights.atBest && insights.underStress && (
                  <div className="border-t border-gray-100 mb-5" />
                )}
                {insights.underStress && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-amber-100 text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Under Stress</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{insights.underStress}</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* ── Growth Direction ── */}
            <InsightCard icon={TrendingUp} title="Growth Direction" delay={0.65} color="bg-violet-100 text-violet-600">
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{insights.psyche}</p>
              {insights.growthTips?.length > 0 && (
                <ul className="space-y-2">
                  {insights.growthTips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-violet-400 mt-0.5 shrink-0">&#x2022;</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}
            </InsightCard>

            {/* ── Famous People ── */}
            {result.famousPeople?.length > 0 && (
              <InsightCard icon={Sparkles} title="Famous Examples" delay={0.7} color="bg-peach-100 text-peach-600">
                <p className="text-xs text-gray-400 font-semibold mb-3 uppercase tracking-wider">
                  ~{result.population} of the population
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.famousPeople.map((person) => (
                    <span key={person} className="text-xs font-semibold bg-peach-50 text-peach-700 px-3 py-1 rounded-full border border-peach-100">
                      {person}
                    </span>
                  ))}
                </div>
              </InsightCard>
            )}
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.75 }}
          className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 border border-amber-200 mb-5"
        >
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
              <Layers className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-extrabold text-gray-800 mb-1">Want a more nuanced result?</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">
                Take the OEJTS scientific assessment — 20 forced-choice questions for sharper type classification.
              </p>
              <button
                onClick={() => navigate('/quiz/mbti-deep')}
                className="text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-colors"
              >
                Go Deeper <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        <NextQuizBanner currentQuizKey="mbti" />

        <div className="flex gap-3 mt-2">
          <motion.button
            onClick={() => { track('quiz_retaken', { quiz: 'mbti' }, user?.id ?? null); navigate('/quiz/mbti'); }}
            aria-label="Retake the MBTI quiz"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-sm hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </motion.button>
          <motion.button
            onClick={() => navigate('/')}
            aria-label="Go to all quizzes"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-sm hover:border-gray-200 transition-colors"
          >
            All Quizzes
          </motion.button>
          <motion.button
            onClick={handleShare}
            aria-label="Share your MBTI result"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-gradient-to-r from-coral-400 to-coral-500 text-white font-bold shadow-md flex items-center justify-center gap-2"
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
