import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import { Activity, Brain, CircleDashed, ArrowRight, Sparkles, ChevronDown, Wand2, Flame, Cake } from 'lucide-react';
import { track } from '../utils/analytics';

export default function Landing() {
  const navigate = useNavigate();
  const { hasCompleted } = useBigFive();
  const { user } = useAuth();

  useEffect(() => {
    document.title = 'My Personality Quizzes — Discover Who You Really Are';
  }, []);

  function trackAndNavigate(quizId, destination) {
    track('quiz_card_clicked', { quiz: quizId, from: 'landing' }, user?.id ?? null);
    navigate(destination);
  }

  // The full catalog, grouped but rendered with one consistent card style so
  // every test is visible in a single scannable list.
  const TEST_GROUPS = [
    {
      label: 'Core personality tests',
      hint: 'Science-backed frameworks',
      tests: [
        { id: 'big5', name: 'Big 5 Personality', description: 'The OCEAN model — your five core traits and how you navigate the world.', meta: '25 questions · ~5 min', icon: Activity, action: () => trackAndNavigate('big5', hasCompleted ? '/dashboard' : '/assessment') },
        { id: 'mbti', name: 'MBTI · 16 Types', description: 'Find your Myers-Briggs type and cognitive style — INTJ, ESFP and 14 more.', meta: '28 questions · ~6 min', icon: Brain, to: '/quiz/mbti' },
        { id: 'enneagram', name: 'Enneagram', description: 'Which of the 9 types drives your deepest motivations and fears.', meta: '27 questions · ~5 min', icon: CircleDashed, to: '/quiz/enneagram' },
      ],
    },
    {
      label: 'Just for fun',
      hint: 'Quick & shareable',
      tests: [
        { id: 'house', name: 'Wizarding House', description: 'Gryffindor, Hufflepuff, Ravenclaw or Slytherin — where do you belong?', meta: '10 questions · ~3 min', icon: Wand2, to: '/quiz/house' },
        { id: 'hot_takes', name: 'Hot Takes', description: 'The dress, tennis balls, hotdogs — pick a side and see how people voted.', meta: '8 debates · ~2 min', icon: Flame, to: '/hot-takes' },
        { id: 'cake', name: 'What Cake Are You?', description: 'Your work superpower, served as dessert. Find your professional flavor.', meta: '12 questions · ~2 min', icon: Cake, to: '/quiz/cake' },
      ],
    },
    {
      label: 'In-depth versions',
      hint: 'Longer & more precise',
      tests: [
        { id: 'big5-deep', name: 'Big 5 Deep', description: 'A 50-item IPIP assessment for a more precise OCEAN profile.', meta: '50 questions · ~10 min', icon: Activity, to: '/quiz/big5-deep' },
        { id: 'mbti-deep', name: 'MBTI Deep', description: 'Open Extended Jungian Type Scales — forced-choice for sharper typing.', meta: 'OEJTS · ~8 min', icon: Brain, to: '/quiz/mbti-deep' },
        { id: 'enneagram-deep', name: 'Enneagram Deep', description: 'Core fears & desires inventory with weighted scoring.', meta: '36 questions · ~7 min', icon: CircleDashed, to: '/quiz/enneagram-deep' },
      ],
    },
  ];
  const totalTests = TEST_GROUPS.reduce((n, g) => n + g.tests.length, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF9] font-nunito">

      <header className="px-6 py-5 border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-coral-500" />
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

        <div className="text-center max-w-3xl mx-auto mt-10 md:mt-14 mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-4"
          >
            Your personality is a{' '}
            <span className="text-coral-500">superpower.</span>{' '}
            Learn it.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-medium leading-relaxed mb-7"
          >
            Take a test, discover your type in a few minutes, then share it and see how you match with your friends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4"
          >
            <button
              onClick={() => {
                track('hero_cta_clicked', { from: 'landing' }, user?.id ?? null);
                navigate(hasCompleted ? '/dashboard' : '/assessment');
              }}
              className="group/cta w-full sm:w-auto bg-coral-500 hover:bg-coral-600 text-white font-extrabold text-lg px-9 md:px-11 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3"
            >
              {hasCompleted ? 'See My Results' : 'Start with the Big 5'}
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform duration-200" />
            </button>
            <button
              onClick={() => document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto text-gray-700 hover:text-gray-900 font-bold text-base px-6 py-3.5 rounded-lg border border-gray-300 hover:border-gray-400 bg-white transition-all duration-200 flex items-center justify-center gap-2"
            >
              See all {totalTests} tests
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="text-sm text-gray-500 font-medium"
          >
            Free · No sign-up needed to start
          </motion.p>
        </div>

        <div id="quizzes" className="w-full max-w-5xl scroll-mt-24">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900">All {totalTests} tests</h2>
            <p className="text-sm md:text-base text-gray-500 font-medium mt-1">
              Free to take, no sign-up needed. New here? Start with the Big 5 — it powers your dashboard.
            </p>
          </div>

          {TEST_GROUPS.map((group, gi) => (
            <motion.section
              key={group.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.15 + gi * 0.08 }}
              className={gi === 0 ? '' : 'mt-9'}
            >
              <div className="flex items-baseline justify-between mb-3 px-0.5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">{group.label}</h3>
                <span className="text-xs text-gray-400 font-medium hidden sm:block">{group.hint}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {group.tests.map((t) => {
                  const TIcon = t.icon;
                  return (
                    <button
                      key={t.id}
                      onClick={t.action ?? (() => trackAndNavigate(t.id, t.to))}
                      className="text-left flex items-start gap-3.5 p-4 rounded-xl bg-white border border-gray-200 hover:border-coral-300 hover:shadow-sm transition-all duration-200 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-100 group-hover:bg-coral-50 flex items-center justify-center shrink-0 transition-colors">
                        <TIcon className="w-5 h-5 text-gray-500 group-hover:text-coral-500 transition-colors" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="text-sm font-extrabold text-gray-900 truncate">{t.name}</h4>
                          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-coral-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                        <p className="text-xs text-gray-500 leading-snug mt-0.5 mb-1.5 line-clamp-2">{t.description}</p>
                        <p className="text-[11px] font-semibold text-gray-400">{t.meta}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      </main>

      <footer className="border-t border-gray-200 bg-white py-8 px-6 mt-4">
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
