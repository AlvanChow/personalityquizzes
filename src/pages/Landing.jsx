import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import { Activity, Brain, CircleDashed, ArrowRight, Sparkles, Users, ChevronDown, Layers, Wand2, Flame, Cake } from 'lucide-react';
import { track } from '../utils/analytics';

// Every quiz type, surfaced as tappable chips in the hero so the full range is
// visible at a glance (and one tap away) without scrolling.
const QUICK_PICKS = [
  { id: 'big5',      label: 'Big 5',           to: '/assessment',     icon: Activity,     cls: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100' },
  { id: 'mbti',      label: 'MBTI',            to: '/quiz/mbti',      icon: Brain,        cls: 'bg-coral-50 text-coral-600 border-coral-200 hover:bg-coral-100' },
  { id: 'enneagram', label: 'Enneagram',       to: '/quiz/enneagram', icon: CircleDashed, cls: 'bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100' },
  { id: 'house',     label: 'Wizarding House', to: '/quiz/house',     icon: Wand2,        cls: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' },
  { id: 'hot_takes', label: 'Hot Takes',       to: '/hot-takes',      icon: Flame,        cls: 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100' },
  { id: 'cake',      label: 'Cake',            to: '/quiz/cake',      icon: Cake,         cls: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100' },
];

export default function Landing() {
  const navigate = useNavigate();
  // `loading` covers the window where a signed-in user's completion only
  // exists in Supabase — until it resolves, don't claim they haven't done it.
  const { hasCompleted, loading } = useBigFive();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'My Personality Quizzes — Discover Who You Really Are';
  }, []);

  function trackAndNavigate(quizId, destination) {
    track('quiz_card_clicked', { quiz: quizId, from: 'landing' }, user?.id ?? null);
    navigate(destination);
  }

  const quizzes = [
    {
      id: 'big5',
      name: 'Big 5 Personality',
      tagline: '#1 Most Accurate',
      description: 'The scientifically-backed OCEAN model. Discover your core traits and how you navigate the world.',
      meta: '25 questions · ~5 min',
      icon: Activity,
      cardGradient: 'from-teal-500 to-emerald-600',
      iconBg: 'bg-white/20',
      buttonBg: 'bg-white text-teal-700 hover:bg-white/90',
      glowColor: 'shadow-teal-500/25',
      buttonText: hasCompleted ? 'View Results' : loading ? 'Big 5 Personality' : 'Take the Big 5',
      action: () => trackAndNavigate('big5', hasCompleted ? '/dashboard' : '/assessment'),
      featured: true
    },
    {
      id: 'mbti',
      name: 'MBTI (16 Types)',
      tagline: 'Most Popular',
      description: 'Are you an INTJ or an ESFP? Find your Myers-Briggs type and understand your cognitive functions.',
      meta: '28 questions · ~6 min',
      icon: Brain,
      cardGradient: 'from-coral-400 to-rose-500',
      iconBg: 'bg-white/20',
      buttonBg: 'bg-white text-coral-600 hover:bg-white/90',
      glowColor: 'shadow-coral-400/25',
      buttonText: 'Take the MBTI',
      action: () => trackAndNavigate('mbti', '/quiz/mbti'),
      featured: true
    },
    {
      id: 'enneagram',
      name: 'Enneagram',
      tagline: 'Deep Insight',
      description: 'Discover which of the 9 interconnected personality types drives your deepest motivations and fears.',
      meta: '27 questions · ~5 min',
      icon: CircleDashed,
      cardGradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-white/20',
      buttonBg: 'bg-white text-violet-700 hover:bg-white/90',
      glowColor: 'shadow-violet-500/25',
      buttonText: 'Take the Enneagram',
      action: () => trackAndNavigate('enneagram', '/quiz/enneagram'),
      featured: true
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FFF8F5] via-[#FDF5F3] to-[#F9F0F8] font-nunito">

      <header className="px-6 py-5 border-b border-rose-100/60 bg-white/70 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-coral-400" />
            My Personality Quizzes
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/how-it-works')}
              className="text-sm font-bold text-gray-600 hover:text-gray-800 transition-colors hidden sm:block"
            >
              How It Works
            </button>
            {hasCompleted && (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-bold text-gray-700 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-all"
              >
                Back to Dashboard
              </button>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-24">

        <div className="text-center max-w-3xl mx-auto mt-9 md:mt-12 mb-9">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="inline-flex items-center gap-2 rounded-full bg-white/70 border border-rose-100 px-3.5 py-1.5 mb-5 text-xs font-bold text-gray-600"
          >
            <Sparkles className="w-3.5 h-3.5 text-coral-400" />
            8 quizzes · science-backed & just-for-fun
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-4"
          >
            Your personality is a{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-rose-500">
              superpower.
            </span>{' '}
            Learn it.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-medium leading-relaxed mb-6"
          >
            Take a quiz, discover your type in ~5 minutes, then share it and see how you match with your friends. 👇
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-3"
          >
            <button
              onClick={() => {
                track('hero_cta_clicked', { from: 'landing' }, user?.id ?? null);
                navigate(hasCompleted ? '/dashboard' : '/assessment');
              }}
              className="group/cta w-full sm:w-auto bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-lg md:text-xl px-9 md:px-12 py-3.5 md:py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
            >
              {hasCompleted ? 'See My Results' : 'Start with the Big 5'}
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto text-gray-700 hover:text-gray-900 font-bold text-base px-6 py-3.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 bg-white/60 transition-all duration-200 flex items-center justify-center gap-2"
            >
              See all quizzes
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Quick-pick: every quiz type visible at a glance, one tap away */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.26 }}
            className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-5"
          >
            {QUICK_PICKS.map((q) => {
              const QIcon = q.icon;
              return (
                <button
                  key={q.label}
                  onClick={() => trackAndNavigate(q.id, q.to)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-bold transition-colors ${q.cls}`}
                >
                  <QIcon className="w-3.5 h-3.5" />
                  {q.label}
                </button>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-gray-500 font-medium"
          >
            <span className="text-emerald-600 font-bold">Free</span>
            <span className="text-gray-300">·</span>
            <span>No sign-up to start</span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1.5"><Users className="w-4 h-4" />Taken by <strong className="text-gray-700">50,000+</strong> people</span>
          </motion.div>
        </div>

        <div id="quizzes" className="w-full max-w-5xl scroll-mt-24">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">Choose your quiz</h2>
            <p className="text-sm md:text-base text-gray-500 font-medium mt-1">
              New here? Start with the Big 5 — it powers your dashboard. Or pick whichever calls to you.
            </p>
          </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {quizzes.map((quiz, index) => {
            const Icon = quiz.icon;
            return (
              <motion.div
                key={quiz.id}
                role="button"
                tabIndex={0}
                onClick={quiz.action}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); quiz.action(); } }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer shadow-lg ${quiz.glowColor} hover:shadow-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50 transition-shadow duration-300 flex flex-col group bg-gradient-to-br ${quiz.cardGradient} ${index === 0 ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Decorative background circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

                <div className="relative flex items-center gap-4 mb-2">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${quiz.iconBg} backdrop-blur-sm shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="inline-block text-xs font-extrabold uppercase tracking-widest text-white/70 mb-1">{quiz.tagline}</span>
                    <h3 className="text-2xl font-black text-white leading-snug">{quiz.name}</h3>
                  </div>
                </div>
                <p className="relative text-white/80 font-semibold mb-3 leading-relaxed text-sm">
                  {quiz.description}
                </p>

                <p className="relative text-white/50 text-xs font-semibold mb-6">
                  {quiz.meta}
                </p>

                <div className="relative mt-auto pointer-events-none">
                  <span className={`w-full font-extrabold text-base py-4 px-5 rounded-xl flex items-center justify-center gap-2.5 shadow-md ${quiz.buttonBg}`}>
                    {quiz.buttonText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        </div>

        {/* ── Just for Fun section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="w-full max-w-5xl mt-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <Flame className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Just for Fun</h2>
              <p className="text-sm text-gray-600 font-medium">Quick hits to share with friends</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'house',
                name: 'Wizarding House',
                badge: 'Sorting Quiz',
                icon: Wand2,
                description: 'Gryffindor, Hufflepuff, Ravenclaw, or Slytherin — where do you truly belong?',
                path: '/quiz/house',
                border: 'border-amber-200',
                badgeBg: 'bg-amber-100 text-amber-700',
              },
              {
                id: 'hot_takes',
                name: 'Hot Takes',
                badge: 'Great Debates',
                icon: Flame,
                description: 'The dress. Tennis balls. Hotdogs. Pick your side and see how the internet voted.',
                path: '/hot-takes',
                border: 'border-rose-200',
                badgeBg: 'bg-rose-100 text-rose-600',
              },
              {
                id: 'cake',
                name: 'What Cake Are You?',
                badge: 'Workplace',
                icon: Cake,
                description: 'Your work superpower, served as dessert. Find your professional flavor.',
                path: '/quiz/cake',
                border: 'border-sky-200',
                badgeBg: 'bg-sky-100 text-sky-700',
              },
            ].map((quiz, i) => {
              const FunIcon = quiz.icon;
              return (
                <motion.button
                  key={quiz.id}
                  onClick={() => trackAndNavigate(quiz.id, quiz.path)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.55 + i * 0.08 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`text-left p-6 rounded-xl bg-white border-2 ${quiz.border} shadow-sm hover:shadow-md transition-all group`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <FunIcon className="w-4 h-4 text-gray-500" />
                    <span className={`text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${quiz.badgeBg}`}>
                      {quiz.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-gray-900 mb-1">{quiz.name}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">{quiz.description}</p>
                  <span className="text-sm font-bold text-coral-500 flex items-center gap-1.5">
                    Jump In
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* ── Go Deeper section ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="w-full max-w-5xl mt-16"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900">Go Deeper</h2>
              <p className="text-sm text-gray-600 font-medium">Extended assessments for more nuanced results</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: 'big5-deep',
                name: 'Big 5 Deep',
                badge: 'IPIP-50',
                description: '50-item assessment for a more precise OCEAN profile with double the questions.',
                path: '/quiz/big5-deep',
                border: 'border-teal-200',
                badgeBg: 'bg-teal-100 text-teal-700',
              },
              {
                id: 'mbti-deep',
                name: 'MBTI Deep',
                badge: 'OEJTS',
                description: 'Open Extended Jungian Type Scales — a scientific forced-choice format for sharper typing.',
                path: '/quiz/mbti-deep',
                border: 'border-coral-200',
                badgeBg: 'bg-coral-100 text-coral-700',
              },
              {
                id: 'enneagram-deep',
                name: 'Enneagram Deep',
                badge: '36-Item',
                description: 'Core fears & desires inventory with 4 questions per type and weighted scoring.',
                path: '/quiz/enneagram-deep',
                border: 'border-violet-200',
                badgeBg: 'bg-violet-100 text-violet-700',
              },
            ].map((quiz, i) => (
              <motion.button
                key={quiz.id}
                onClick={() => trackAndNavigate(quiz.id, quiz.path)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.65 + i * 0.08 }}
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-6 rounded-xl bg-white border-2 ${quiz.border} shadow-sm hover:shadow-md transition-all group`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${quiz.badgeBg}`}>
                    {quiz.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">{quiz.name}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{quiz.description}</p>
                <span className="text-sm font-bold text-coral-500 flex items-center gap-1.5">
                  Take Quiz
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-rose-100/60 bg-white/70 backdrop-blur-sm py-8 px-6 mt-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} My Personality Quizzes. All rights reserved.
          </span>
          <nav className="flex items-center gap-5">
            <button
              onClick={() => navigate('/how-it-works')}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => navigate('/assessment')}
              className="text-sm text-gray-500 hover:text-gray-700 font-medium transition-colors"
            >
              Take the Big 5
            </button>
          </nav>
        </div>
      </footer>
    </div>
  );
}
