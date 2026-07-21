import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, ChevronDown, Compass, Popcorn, Flame, Layers, FlaskConical } from 'lucide-react';
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
    <div className="min-h-screen flex flex-col bg-[#FBFAF9]">

      <main className="flex-1 flex flex-col items-center px-6 pb-24">

        <div className="relative text-center max-w-3xl mx-auto mt-10 md:mt-14 mb-10">
          {/* Ambient aura + orbiting quiz glyphs — the quiz-world energy, both themes. */}
          <div aria-hidden="true" className="hero-aura hero-aura-a" />
          <div aria-hidden="true" className="hero-aura hero-aura-b" />
          <div aria-hidden="true" className="hero-orbit hidden lg:block">
            <span className="orb" style={{ transform: 'translate(0px, -250px)', animationDelay: '-3.6s' }}>
              <QuizGlyph quizKey="big5" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(176px, -232px)', animationDelay: '-4.5s' }}>
              <QuizGlyph quizKey="mbti" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(332px, -177px)', animationDelay: '-0.0s' }}>
              <QuizGlyph quizKey="enneagram" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(436px, -94px)', animationDelay: '-1.8s' }}>
              <QuizGlyph quizKey="house" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(436px, 94px)', animationDelay: '-0.9s' }}>
              <QuizGlyph quizKey="cake" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(415px, 117px)', animationDelay: '-2.7s' }}>
              <QuizGlyph quizKey="naruto" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(-415px, 117px)', animationDelay: '-1.8s' }}>
              <QuizGlyph quizKey="nba" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(-436px, 94px)', animationDelay: '-3.6s' }}>
              <QuizGlyph quizKey="pokemon" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(-436px, -94px)', animationDelay: '-5.4s' }}>
              <QuizGlyph quizKey="starwars" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(-332px, -177px)', animationDelay: '-0.9s' }}>
              <QuizGlyph quizKey="love_language" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(-176px, -232px)', animationDelay: '-2.7s' }}>
              <QuizGlyph quizKey="ikigai" size={30} />
            </span>
            <span className="orb" style={{ transform: 'translate(470px, 0px)', animationDelay: '-0.0s' }}>
              <QuizGlyph quizKey="eq" size={30} />
            </span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-4"
          >
            Discover your{' '}
            <span className="text-coral-500">superpowers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="text-base md:text-lg text-gray-600 max-w-xl mx-auto font-medium leading-relaxed mb-7"
          >
            Decades of research show Big Five traits predict career success, relationship
            stability, and even longevity about as well as IQ or income. Mapping your own
            profile takes about five minutes.
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
                {/* Compact cards: icon, title, and a bottom-pinned time row.
                    Each quiz's full description now lives on its intro screen. */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 items-start">
                  {section.tests.map((t) => (
                    <button
                      key={t.key}
                      onClick={t.action ?? (() => trackAndNavigate(t.key, t.to))}
                      className="text-left px-3 py-2.5 rounded-xl bg-white border border-gray-200 shadow-sm transition-all duration-200 group flex items-center gap-2.5 hover:-translate-y-0.5 hover:border-coral-300 hover:shadow-[0_10px_32px_-14px_rgba(240,104,48,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
                    >
                      {/* Compact cards that hug their content — icon centred beside a
                          title + small time marker. No forced row height, so a
                          short-title card stays short instead of stretching and
                          leaving a big empty gap. */}
                      <span className="shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-3">
                        <QuizGlyph quizKey={t.key} emoji={t.emoji} size={26} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-3">{t.title}</h3>
                        <span className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold text-coral-500/90">
                          {t.time}
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      </div>
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
