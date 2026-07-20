import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, Cake, Star, Share2, Swords, Wand2, UserPlus, Users, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { allowViewIncrement } from '../utils/rateLimiter';
import { isValidShareId, isPlainObject, sanitizeString } from '../utils/security';
import { getQuizMeta, getQuizPath } from '../data/quizzes';
import {
  getMyResultFor,
  getSharedType,
  computeCompatibility,
  savePendingCompare,
} from '../utils/compatibility';
import { shareCompatStory } from '../utils/storyCard';

const QUIZ_META = {
  mbti: {
    label:       'MBTI',
    description: 'Discover your Myers-Briggs type and see how you think, feel, and interact.',
    path:        '/quiz/mbti',
    cta:         'Take the MBTI Quiz',
    gradient:    'from-coral-400 to-coral-500',
    icon:        Brain,
  },
  enneagram: {
    label:       'Enneagram',
    description: 'Uncover your core motivations, fears, and desires with the Enneagram.',
    path:        '/quiz/enneagram',
    cta:         'Take the Enneagram Quiz',
    gradient:    'from-mint-400 to-mint-500',
    icon:        Sparkles,
  },
  cake: {
    label:       'CAKE Workplace',
    description: 'Find your top workplace competency and what kind of professional you are.',
    path:        '/quiz/cake',
    cta:         'Take the CAKE Quiz',
    gradient:    'from-sky-400 to-sky-500',
    icon:        Cake,
  },
  big5: {
    label:       'Big Five',
    description: 'Get a science-backed personality profile across five core trait dimensions.',
    path:        '/assessment',
    cta:         'Take the Big Five Quiz',
    gradient:    'from-violet-400 to-violet-500',
    icon:        Star,
  },
  house: {
    label:       'Wizarding House',
    description: 'Gryffindor, Hufflepuff, Ravenclaw, or Slytherin — get sorted.',
    path:        '/quiz/house',
    cta:         'Take the House Quiz',
    gradient:    'from-amber-400 to-amber-500',
    icon:        Wand2,
  },
};

const OTHER_QUIZZES = Object.entries(QUIZ_META).map(([key, meta]) => ({ key, ...meta }));

// result_data comes from an anonymously-writable table, so nothing in it can
// be trusted — especially not values that end up inside className. Only allow
// the exact utility-class shapes our own palette uses; fall back otherwise.
const SAFE_GRADIENT_RE = /^from-[a-z]+-(?:50|100|200|300|400|500) to-[a-z]+-(?:50|100|200|300|400|500)$/;
const SAFE_ACCENT_RE = /^text-[a-z]+-(?:400|500|600|700|800|900)$/;

function safeGradient(value) {
  return typeof value === 'string' && SAFE_GRADIENT_RE.test(value) ? value : 'from-sky-50 to-sky-100';
}

function safeAccent(value) {
  return typeof value === 'string' && SAFE_ACCENT_RE.test(value) ? value : 'text-gray-800';
}

// Fetch a share row. Prefers the token-gated RPC (added in the hardening
// migration); falls back to a direct select so the page keeps working if the
// client ships before the migration is applied.
async function fetchSharedResult(shareId) {
  const rpc = await supabase.rpc('get_shared_result', { p_id: shareId });
  if (!rpc.error && Array.isArray(rpc.data)) return rpc.data[0] ?? null;
  if (!rpc.error && rpc.data) return rpc.data;

  const { data, error } = await supabase
    .from('shared_results')
    .select('*')
    .eq('id', shareId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

// ─── Compatibility card ─────────────────────────────────────────────────────

function CompatibilityCard({ shared, quizMeta }) {
  const [shareBusy, setShareBusy] = useState(false);
  const [shareNote, setShareNote] = useState(null);
  const trackedRef = useRef(false);

  const theirType = getSharedType(shared);
  const me = getMyResultFor(shared.quiz_type);
  const compat = me && theirType ? computeCompatibility(shared.quiz_type, theirType, me.type) : null;

  useEffect(() => {
    if (!compat || trackedRef.current) return;
    trackedRef.current = true;
    track('compat_viewed', { quiz: shared.quiz_type, score: compat.score }, null);
  }, [compat, shared.quiz_type]);

  if (!compat) return null;

  const friendName = sanitizeString(shared.result_name, 40) || 'Your friend';
  const friendEmoji = sanitizeString(shared.result_emoji, 16) || '✨';

  async function handleShareMatch() {
    if (shareBusy) return;
    setShareBusy(true);
    setShareNote(null);
    try {
      const outcome = await shareCompatStory(
        shared.quiz_type,
        compat,
        { emoji: me.emoji, name: me.name },
        { emoji: friendEmoji, name: friendName },
        `https://mypersonalityquizzes.com/s/${shared.id}`,
      );
      if (outcome === 'downloaded') setShareNote('Image saved! Add it to your story 📲');
      if (outcome !== 'cancelled') {
        track('share_button_clicked', { quiz: shared.quiz_type, platform: 'compat_story', outcome }, null);
      }
    } catch (err) {
      console.error('[SharedResult] compat story share failed:', err);
      setShareNote('Could not create the image on this device.');
    } finally {
      setShareBusy(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.15 }}
      className="bg-white rounded-xl p-6 shadow-md border border-gray-200 mb-5 overflow-hidden"
    >
      <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        Your compatibility
      </p>

      {/* You vs friend */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="text-center w-24">
          <span className="text-4xl block mb-1">{me.emoji}</span>
          <p className="text-sm font-extrabold text-gray-800 truncate">{me.name}</p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">You</p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.35, type: 'spring', stiffness: 160 }}
          className="text-center shrink-0"
        >
          <span className="text-4xl font-black text-gray-800">{compat.score}%</span>
          <p className="text-xs font-bold text-gray-500 mt-0.5">{compat.emoji} {compat.title}</p>
        </motion.div>
        <div className="text-center w-24">
          <span className="text-4xl block mb-1">{friendEmoji}</span>
          <p className="text-sm font-extrabold text-gray-800 truncate">{friendName}</p>
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Them</p>
        </div>
      </div>

      {/* Score meter */}
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden mb-5" role="img" aria-label={`Compatibility score ${compat.score} percent`}>
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${quizMeta.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${compat.score}%` }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
        />
      </div>

      {/* Dimension breakdown */}
      <div className="space-y-3 mb-5">
        {compat.dimensions.map((d) => (
          <div key={d.label} className="bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{d.label}</span>
              <span className="text-xs font-extrabold text-gray-700">
                {d.you} {d.same ? '=' : '×'} {d.them}
              </span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed">{d.text}</p>
          </div>
        ))}
      </div>

      <motion.button
        onClick={handleShareMatch}
        disabled={shareBusy}
        whileTap={{ scale: 0.98 }}
        className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${quizMeta.gradient} text-white font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-60`}
      >
        {shareBusy ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Creating your story…
          </>
        ) : (
          <>
            <Share2 className="w-4 h-4" />
            Share your match
          </>
        )}
      </motion.button>
      {shareNote && (
        <p className="text-xs text-center text-gray-500 mt-2" role="status">{shareNote}</p>
      )}
    </motion.div>
  );
}

// ─── Circle CTA ───────────────────────────────────────────────────────────────
// Shown when the share link belongs to a signed-in owner (has_owner comes from
// the get_shared_result RPC; the direct-select fallback never sets it, so the
// block simply doesn't render on older data paths). Never rendered for the
// owner viewing their own link.

function CircleCTA({ shared }) {
  const navigate = useNavigate();
  const { user, signInWithGoogle } = useAuth();
  // connection_status from the RPC reflects the viewer at fetch time; local
  // state lets the button flip to "sent" without a refetch.
  const [status, setStatus] = useState(shared.connection_status ?? null);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);

  if (!shared.has_owner || shared.owner_is_me) return null;

  const friendName = sanitizeString(shared.result_name, 40) || 'your friend';

  async function handleRequest() {
    if (busy) return;
    setBusy(true);
    setNote(null);
    try {
      const { data, error } = await supabase.rpc('request_connection', { p_share_id: shared.id });
      if (error) throw error;
      setStatus(data ?? 'pending_sent');
      if (data === 'pending_sent') {
        track('circle_request_sent', { quiz: shared.quiz_type }, user.id);
      }
    } catch (err) {
      console.error('[SharedResult] circle request failed:', err);
      setNote(err?.message?.includes('Too many') ? 'Too many requests — try again in a minute.' : 'Could not send the request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  async function handleSignIn() {
    setNote(null);
    try {
      await signInWithGoogle(`/s/${shared.id}`);
    } catch (err) {
      setNote(err?.message ?? 'Sign-in failed. Please try again.');
    }
  }

  let body;
  if (!user) {
    body = (
      <>
        <p className="text-xs text-gray-400 mb-3">
          Sign in to save this match and see how you compare over time.
        </p>
        <button
          onClick={handleSignIn}
          className="w-full py-3 rounded-xl bg-white border border-gray-300 hover:border-gray-400 text-sm font-bold text-gray-700 shadow-sm flex items-center justify-center gap-2 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Sign in to save this match
        </button>
      </>
    );
  } else if (status === 'accepted') {
    body = (
      <button
        onClick={() => navigate('/circle')}
        className="w-full py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-sm font-bold text-emerald-600 flex items-center justify-center gap-2"
      >
        <Check className="w-4 h-4" />
        In your circle — see your matches
      </button>
    );
  } else if (status === 'pending_sent') {
    body = (
      <div className="w-full py-3 rounded-xl bg-gray-50 border border-gray-200 text-sm font-bold text-gray-400 flex items-center justify-center gap-2">
        <Check className="w-4 h-4" />
        Request sent — waiting on them
      </div>
    );
  } else if (status === 'pending_received') {
    body = (
      <button
        onClick={() => navigate('/circle')}
        className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-[#FAF9F5] text-sm font-bold shadow-md flex items-center justify-center gap-2 transition-colors"
      >
        <Users className="w-4 h-4" />
        They asked to join your circle — respond
      </button>
    );
  } else {
    body = (
      <>
        <p className="text-xs text-gray-400 mb-3">
          Add {friendName} to your circle to keep this match and compare on every quiz.
        </p>
        <button
          onClick={handleRequest}
          disabled={busy}
          className="w-full py-3 rounded-xl bg-gray-900 hover:bg-black text-[#FAF9F5] text-sm font-bold shadow-md flex items-center justify-center gap-2 disabled:opacity-60 transition-colors"
        >
          {busy ? (
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          Add to your circle
        </button>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-5"
    >
      <div className="flex items-center gap-2 mb-1">
        <Users className="w-4 h-4 text-coral-400" />
        <h2 className="text-sm font-extrabold text-gray-800">Circles</h2>
      </div>
      {body}
      {note && (
        <p className="text-xs text-center text-red-500 mt-2" role="alert">{note}</p>
      )}
    </motion.div>
  );
}

export default function SharedResult() {
  const { shareId } = useParams();
  const navigate    = useNavigate();
  const [shared, setShared]   = useState(null);  // shared_results row
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const trackedRef = useRef(false);

  useEffect(() => {
    document.title = 'Shared Result — My Personality Quizzes';
  }, []);

  useEffect(() => {
    if (!supabase) { setNotFound(true); setLoading(false); return; }

    // Validate share ID format before querying the database
    if (!isValidShareId(shareId)) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const data = await fetchSharedResult(shareId);
        if (cancelled) return;
        if (!data) {
          setNotFound(true);
        } else {
          setShared(data);
          // Rate-limited fire-and-forget view count increment
          if (allowViewIncrement()) {
            supabase.rpc('increment_shared_result_views', { p_id: shareId }).then(() => {});
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [shareId]);

  // Track analytics once per load
  useEffect(() => {
    if (trackedRef.current || !shared) return;
    trackedRef.current = true;
    track('shared_result_viewed', { quiz: shared.quiz_type, result_key: shared.result_key }, null);
  }, [shared]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-cream-50 flex flex-col items-center justify-center px-6 text-center">
        <span className="text-5xl mb-4">🤷</span>
        <h1 className="text-xl font-extrabold text-gray-800 mb-2">Result not found</h1>
        <p className="text-sm text-gray-500 mb-6 max-w-xs">
          This link may have expired or the result was removed. Take a quiz yourself!
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-coral-400 to-coral-500 text-white font-bold shadow-md hover:shadow-lg transition-shadow"
        >
          See all quizzes
        </button>
      </div>
    );
  }

  const result      = isPlainObject(shared.result_data) ? shared.result_data : {};
  // quiz_type comes from the DB but only ever selects from our own trusted
  // metadata maps — unknown types fall back to the MBTI meta.
  const catalogMeta = getQuizMeta(shared.quiz_type);
  const quizMeta    = QUIZ_META[shared.quiz_type]
    ?? (catalogMeta && {
      label:       catalogMeta.quizName,
      description: catalogMeta.description,
      path:        getQuizPath(catalogMeta),
      cta:         'Take the Quiz',
      gradient:    catalogMeta.gradient,
      emoji:       catalogMeta.emoji,
    })
    ?? QUIZ_META.mbti;
  const QuizIcon = quizMeta.icon ?? null;

  const resultName  = sanitizeString(shared.result_name, 100);
  const resultEmoji = sanitizeString(shared.result_emoji, 16);

  // Derive subtitle line (tagline / nickname / coreDesire depending on quiz type)
  const subtitle = sanitizeString(result.nickname ?? result.tagline ?? result.coreDesire ?? '', 160) || null;

  // Pull a one-sentence teaser from description (first sentence only)
  const descTeaser = typeof result.description === 'string' && result.description.trim()
    ? sanitizeString(result.description.split(/[.!?]/)[0].trim(), 240) + '.'
    : null;

  // Does the visitor already have their own result for this quiz?
  const hasOwnResult = !!getMyResultFor(shared.quiz_type);
  const isComparable = ['mbti', 'enneagram', 'cake', 'house'].includes(shared.quiz_type);

  function handleTakeQuizToCompare() {
    savePendingCompare(shared.id, shared.quiz_type, resultName);
    track('compare_quiz_started', { quiz: shared.quiz_type }, null);
    navigate(quizMeta.path);
  }

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">

        {/* ── Back link ── */}
        <button
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8 inline-block"
        >
          ← My Personality Quizzes
        </button>

        {/* ── Result card ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className={`bg-gradient-to-br ${safeGradient(result.color)} rounded-xl p-8 shadow-md border border-white/60 mb-4`}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
              className="text-6xl mb-4"
            >
              {resultEmoji}
            </motion.div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
              {quizMeta.label} result
            </p>
            <h1 className={`text-4xl font-black mb-1 ${safeAccent(result.accent)}`}>
              {resultName}
            </h1>
            {subtitle && (
              <p className={`text-base font-bold opacity-70 mb-3 ${safeAccent(result.accent)}`}>
                {subtitle}
              </p>
            )}
            {descTeaser && (
              <p className="text-sm text-gray-600 leading-relaxed mt-4">{descTeaser}</p>
            )}
          </div>
        </motion.div>

        {/* ── Social proof nudge ── */}
        <p className="text-center font-serif italic text-sm text-gray-500 mb-6">
          Their result. Your move.
        </p>

        {/* ── Compatibility: shown when the visitor has their own result ── */}
        {isComparable && hasOwnResult && (
          <CompatibilityCard shared={shared} quizMeta={quizMeta} />
        )}

        {/* ── Circle: save the match when the sharer is a signed-in owner ── */}
        <CircleCTA shared={shared} />

        {/* ── Primary CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
        >
          {isComparable && !hasOwnResult ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${quizMeta.gradient} flex items-center justify-center shrink-0`}>
                  <Swords className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-gray-800">
                    How compatible are you with {resultName || 'them'}?
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Take the {quizMeta.label} quiz and get your match score instantly.
                  </p>
                </div>
              </div>
              <motion.button
                onClick={handleTakeQuizToCompare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${quizMeta.gradient} text-white font-bold shadow-md flex items-center justify-center gap-2`}
              >
                Reveal our compatibility
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${quizMeta.gradient} flex items-center justify-center shrink-0`}>
                  {QuizIcon
                    ? <QuizIcon className="w-5 h-5 text-white" />
                    : <span className="text-xl leading-none">{quizMeta.emoji}</span>}
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-gray-800">
                    Discover your {quizMeta.label} type
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">{quizMeta.description}</p>
                </div>
              </div>
              <motion.button
                onClick={() => navigate(quizMeta.path)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`w-full py-3.5 rounded-xl bg-gradient-to-r ${quizMeta.gradient} text-white font-bold shadow-md flex items-center justify-center gap-2`}
              >
                {quizMeta.cta}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </>
          )}
        </motion.div>

        {/* ── Other quizzes ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="bg-white rounded-xl p-5 shadow-sm border border-gray-200"
        >
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Also try
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {OTHER_QUIZZES.filter(q => q.key !== shared.quiz_type).map(q => {
              const Icon = q.icon;
              return (
                <button
                  key={q.key}
                  onClick={() => navigate(q.path)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${q.gradient} flex items-center justify-center shrink-0`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{q.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
