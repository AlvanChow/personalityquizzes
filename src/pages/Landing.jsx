import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import { Activity, Brain, CircleDashed, Cake, ArrowRight, Sparkles, Users, ChevronDown, Layers } from 'lucide-react';
import { track } from '../utils/analytics';

export default function Landing() {
  const navigate = useNavigate();
  const { hasCompleted } = useBigFive();
  const { user } = useAuth();

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
      icon: Activity,
      cardGradient: 'from-teal-500 to-emerald-600',
      iconBg: 'bg-white/20',
      buttonBg: 'bg-white text-teal-700 hover:bg-white/90',
      glowColor: 'shadow-teal-500/25',
      buttonText: hasCompleted ? 'View Results' : 'Take the Big 5',
      action: () => trackAndNavigate('big5', hasCompleted ? '/dashboard' : '/assessment'),
      featured: true
    },
    {
      id: 'mbti',
      name: 'MBTI (16 Types)',
      tagline: 'Most Popular',
      description: 'Are you an INTJ or an ESFP? Find your Myers-Briggs type and understand your cognitive functions.',
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
      icon: CircleDashed,
      cardGradient: 'from-violet-500 to-purple-600',
      iconBg: 'bg-white/20',
      buttonBg: 'bg-white text-violet-700 hover:bg-white/90',
      glowColor: 'shadow-violet-500/25',
      buttonText: 'Take the Enneagram',
      action: () => trackAndNavigate('enneagram', '/quiz/enneagram'),
      featured: true
    },
    {
      id: 'cakeme',
      name: 'Cake.me',
      tagline: 'Viral Hit',
      description: 'The viral sensation. What kind of cake matches your vibe? Sweet, layered, or a little nutty?',
      icon: Cake,
      cardGradient: 'from-pink-400 to-rose-500',
      iconBg: 'bg-white/20',
      buttonBg: 'bg-white text-pink-600 hover:bg-white/90',
      glowColor: 'shadow-pink-400/25',
      buttonText: 'Find Your Cake',
      action: () => trackAndNavigate('cakeme', '/quiz/cake'),
      featured: true
    }
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
              className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors hidden sm:block"
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

        <div className="text-center max-w-3xl mx-auto mt-14 md:mt-20 mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[1.08] tracking-tight mb-6"
          >
            Your personality is a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-rose-500">
              superpower. Learn it.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mb-9"
          >
            Most people go their whole lives without understanding why they think, feel, and act the way they do. Our research-backed assessments decode the patterns behind your personality in under 10 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7"
          >
            <button
              onClick={() => {
                track('hero_cta_clicked', { from: 'landing' }, user?.id ?? null);
                navigate(hasCompleted ? '/dashboard' : '/assessment');
              }}
              className="group/cta bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-xl md:text-2xl px-12 md:px-14 py-4 md:py-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
            >
              {hasCompleted ? 'See My Results' : 'Start Your Deep Dive'}
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => navigate('/how-it-works')}
              className="text-gray-500 hover:text-gray-700 font-bold text-base px-5 py-3.5 rounded-lg hover:bg-white/60 transition-all duration-200 flex items-center gap-2"
            >
              How it works
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium"
          >
            <Users className="w-4 h-4" />
            <span>Taken by <strong className="text-gray-600">50,000+</strong> curious humans</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {quizzes.map((quiz, index) => {
            const Icon = quiz.icon;
            return (
              <motion.div
                key={quiz.id}
                onClick={quiz.action}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + index * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative overflow-hidden rounded-2xl p-8 cursor-pointer shadow-lg ${quiz.glowColor} hover:shadow-xl transition-shadow duration-300 flex flex-col group bg-gradient-to-br ${quiz.cardGradient}`}
              >
                {/* Decorative background circles */}
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-white/5 rounded-full" />

                <div className="relative flex items-center gap-4 mb-2">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${quiz.iconBg} backdrop-blur-sm shrink-0`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-white/70 mb-1">{quiz.tagline}</span>
                    <h3 className="text-2xl font-black text-white leading-snug">{quiz.name}</h3>
                  </div>
                </div>
                <p className="relative text-white/80 font-semibold mb-8 leading-relaxed text-[15px]">
                  {quiz.description}
                </p>

                <div className="relative mt-auto">
                  <button className={`w-full font-extrabold text-base py-4 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg ${quiz.buttonBg}`}>
                    {quiz.buttonText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </button>
                </div>
              </motion.div>
            );
          })}
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
              <p className="text-sm text-gray-500 font-medium">Extended assessments for more nuanced results</p>
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
                accent: 'text-teal-600',
              },
              {
                id: 'mbti-deep',
                name: 'MBTI Deep',
                badge: 'OEJTS',
                description: 'Open Extended Jungian Type Scales — a scientific forced-choice format for sharper typing.',
                path: '/quiz/mbti-deep',
                border: 'border-coral-200',
                badgeBg: 'bg-coral-100 text-coral-700',
                accent: 'text-coral-600',
              },
              {
                id: 'enneagram-deep',
                name: 'Enneagram Deep',
                badge: '36-Item',
                description: 'Core fears & desires inventory with 4 questions per type and weighted scoring.',
                path: '/quiz/enneagram-deep',
                border: 'border-violet-200',
                badgeBg: 'bg-violet-100 text-violet-700',
                accent: 'text-violet-600',
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
                  <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full ${quiz.badgeBg}`}>
                    {quiz.badge}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 mb-1">{quiz.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">{quiz.description}</p>
                <span className={`text-sm font-bold ${quiz.accent} flex items-center gap-1.5`}>
                  Take Quiz
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
