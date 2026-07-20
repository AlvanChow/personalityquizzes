import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import { ArrowRight, Sparkles, ChevronDown, Compass, Popcorn, Flame, Layers, FlaskConical } from 'lucide-react';
import { track } from '../utils/analytics';
import { getQuizzesByCategory, getQuizPath } from '../data/quizzes';
import QuizGlyph from '../components/QuizGlyph';

// Normalize a catalog entry to the shared card shape.
const fromCatalog = (meta) => ({
  key: meta.key,
  emoji: meta.emoji,
  title: meta.title,
  description: meta.description,
  time: meta.time,
  to: getQuizPath(meta),
});

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

  // The full catalog, grouped into themed shelves but rendered with one
  // consistent card style so every test is visible in a single scannable list.
  const SECTIONS = [
    {
      key: 'core',
      heading: 'Core Personality Tests',
      blurb: 'The research-validated models psychologists and employers actually use — the deepest read on who you are',
      icon: FlaskConical,
      tests: [
        { key: 'big5', emoji: '🧬', title: 'Big 5 Personality', description: 'The OCEAN model — your five core traits and how you navigate the world.', time: '~5 min', action: () => trackAndNavigate('big5', hasCompleted ? '/dashboard' : '/assessment') },
        { key: 'mbti', emoji: '🧠', title: 'MBTI · 16 Types', description: 'Find your Myers-Briggs type and cognitive style — INTJ, ESFP and 14 more.', time: '~6 min', to: '/quiz/mbti' },
        { key: 'enneagram', emoji: '✳️', title: 'Enneagram', description: 'Which of the 9 types drives your deepest motivations and fears.', time: '~5 min', to: '/quiz/enneagram' },
      ],
    },
    {
      key: 'know',
      heading: 'Know Yourself',
      blurb: 'Legendary introspective exercises — from the Flower Petal to grit, ikigai, and attachment styles',
      icon: Compass,
      tests: getQuizzesByCategory('know').map(fromCatalog),
    },
    {
      key: 'fun',
      heading: 'Just for Fun',
      blurb: 'Quick hits to share with friends',
      icon: Flame,
      tests: [
        { key: 'house', emoji: '🪄', title: 'Wizarding House', description: 'Gryffindor, Hufflepuff, Ravenclaw or Slytherin — where do you belong?', time: '~3 min', to: '/quiz/house' },
        { key: 'hot_takes', emoji: '🌭', title: 'Hot Takes: Great Debates', description: 'Is the dress blue? Are tennis balls green? Is a hotdog a sandwich? Pick your side.', time: '8 debates · ~2 min', to: '/hot-takes' },
        { key: 'cake', emoji: '🍰', title: 'What Cake Are You?', description: 'Your work superpower, served as dessert. Find your professional flavor.', time: '~2 min', to: '/quiz/cake' },
      ],
    },
    {
      key: 'pop',
      heading: 'Pop Culture Zone',
      blurb: 'Which NBA legend, anime hero, or sitcom character are you? Find your famous twin',
      icon: Popcorn,
      tests: getQuizzesByCategory('pop').map(fromCatalog),
    },
    {
      key: 'deep',
      heading: 'In-Depth Versions',
      blurb: 'Longer, more precise takes on the core tests',
      icon: Layers,
      tests: [
        { key: 'big5-deep', emoji: '📊', title: 'Big 5 Deep', description: 'A 50-item IPIP assessment for a more precise OCEAN profile.', time: '~10 min', to: '/quiz/big5-deep' },
        { key: 'mbti-deep', emoji: '🔬', title: 'MBTI Deep', description: 'Open Extended Jungian Type Scales — forced-choice for sharper typing.', time: '~8 min', to: '/quiz/mbti-deep' },
        { key: 'enneagram-deep', emoji: '🧿', title: 'Enneagram Deep', description: 'Core fears & desires inventory with weighted scoring.', time: '~7 min', to: '/quiz/enneagram-deep' },
      ],
    },
  ];
  const totalTests = SECTIONS.reduce((n, s) => n + s.tests.length, 0);

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
            {totalTests} tests — take one, discover your type in a few minutes, then share it and see how you match with your friends.
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
              {hasCompleted ? 'See My Results' : loading ? 'Take the Big 5' : 'Start with the Big 5'}
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

        {/* ── The full catalog ── */}
        <div id="quizzes" className="w-full max-w-5xl scroll-mt-24">
          {SECTIONS.map((section, si) => {
            const SectionIcon = section.icon;
            return (
              <motion.section
                key={section.key}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 + si * 0.06 }}
                className={si === 0 ? '' : 'mt-14'}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                    <SectionIcon className="w-5 h-5 text-gray-500" />
                  </div>
                  <div>
                    <h2 className="text-xl md:text-2xl font-black text-gray-900">{section.heading}</h2>
                    <p className="text-xs md:text-sm text-gray-500 font-medium">{section.blurb}</p>
                  </div>
                </div>
                {/* Cards stretch to uniform row height; clamped copy plus a
                    bottom-pinned meta row keeps that height tight and aligned. */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {section.tests.map((t) => (
                    <button
                      key={t.key}
                      onClick={t.action ?? (() => trackAndNavigate(t.key, t.to))}
                      className="text-left p-3.5 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-coral-300 transition-all group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
                    >
                      <div>
                        {/* Icon floats so the title and description wrap around it. */}
                        <span className="float-left mr-2.5 mt-0.5">
                          <QuizGlyph quizKey={t.key} emoji={t.emoji} size={30} />
                        </span>
                        <h3 className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2">{t.title}</h3>
                        <p className="text-xs text-gray-500 leading-relaxed mt-1 line-clamp-3">{t.description}</p>
                      </div>
                      <span className="clear-left flex items-center gap-1 mt-auto pt-2 text-xs font-bold text-coral-500">
                        {t.time}
                        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                      </span>
                    </button>
                  ))}
                </div>
              </motion.section>
            );
          })}
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
