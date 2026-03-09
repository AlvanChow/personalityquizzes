import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Sparkles, Cake, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';

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
};

const OTHER_QUIZZES = Object.entries(QUIZ_META).map(([key, meta]) => ({ key, ...meta }));

export default function SharedResult() {
  const { shareId } = useParams();
  const navigate    = useNavigate();
  const [shared, setShared]   = useState(null);  // shared_results row
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!supabase) { setNotFound(true); setLoading(false); return; }

    (async () => {
      const { data, error } = await supabase
        .from('shared_results')
        .select('*')
        .eq('id', shareId)
        .single();

      if (error || !data) {
        setNotFound(true);
      } else {
        setShared(data);
        // Fire-and-forget view count increment
        supabase.rpc('increment_shared_result_views', { p_id: shareId }).then(() => {});
      }
      setLoading(false);
    })();
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

  const result   = shared.result_data;
  const quizMeta = QUIZ_META[shared.quiz_type] ?? QUIZ_META.mbti;
  const QuizIcon = quizMeta.icon;

  // Derive subtitle line (tagline / nickname / coreDesire depending on quiz type)
  const subtitle = result.nickname ?? result.tagline ?? result.coreDesire ?? null;

  // Pull a one-sentence teaser from description (first sentence only)
  const descTeaser = result.description
    ? result.description.split(/[.!?]/)[0].trim() + '.'
    : null;

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
          className={`bg-gradient-to-br ${result.color ?? 'from-sky-50 to-sky-100'} rounded-xl p-8 shadow-md border border-white/60 mb-4`}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 180 }}
              className="text-6xl mb-4"
            >
              {shared.result_emoji}
            </motion.div>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">
              {quizMeta.label} result
            </p>
            <h1 className={`text-4xl font-black mb-1 ${result.accent ?? 'text-gray-800'}`}>
              {shared.result_name}
            </h1>
            {subtitle && (
              <p className={`text-base font-bold opacity-70 mb-3 ${result.accent ?? 'text-gray-700'}`}>
                {subtitle}
              </p>
            )}
            {descTeaser && (
              <p className="text-sm text-gray-600 leading-relaxed mt-4">{descTeaser}</p>
            )}
          </div>
        </motion.div>

        {/* ── Social proof nudge ── */}
        <p className="text-center text-xs text-gray-400 mb-6">
          Someone shared this result — what&apos;s yours?
        </p>

        {/* ── Primary CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${quizMeta.gradient} flex items-center justify-center shrink-0`}>
              <QuizIcon className="w-5 h-5 text-white" />
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
