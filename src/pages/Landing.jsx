import { useEffect } from 'react';
import { useNavigate } from 'react-router';
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
      blurb: 'Which anime hero, wizard, or sitcom character are you? Find your fictional twin',
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

  // Sticker wall — a curated taste of the catalog, rendered in the site's own
  // glyph system. Routing and analytics come from the SECTIONS entries above,
  // so big5 keeps its completed→dashboard behaviour and nothing is duplicated.
  const ALL_TESTS = new Map(SECTIONS.flatMap((sec) => sec.tests).map((t) => [t.key, t]));
  const STICKERS = [
    { key: 'mbti', label: 'MBTI', disc: 'bg-sky-100', rotate: -7 },
    { key: 'big5', label: 'Big Five', disc: 'bg-coral-100', rotate: 4 },
    { key: 'enneagram', label: 'Enneagram', disc: 'bg-[#F1E8FF]', rotate: 8 },
    { key: 'house', label: 'Wizarding House', disc: 'bg-cream-200', rotate: 6 },
    { key: 'cake', label: 'What Cake?', disc: 'bg-rose-50', rotate: -5 },
    { key: 'ikigai', label: 'Ikigai', disc: 'bg-mint-100', rotate: 3 },
    { key: 'naruto', label: 'Naruto', disc: 'bg-peach-100', rotate: -4 },
    { key: 'love_language', label: 'Love Language', disc: 'bg-teal-100', rotate: 2 },
    { key: 'hot_takes', label: 'Hot Takes', disc: 'bg-cream-100', rotate: -8 },
  ].map((st) => ({ ...st, test: ALL_TESTS.get(st.key) })).filter((st) => st.test);

  // Real result names from the catalog — the marquee is a shelf of things you
  // can actually get, not decoration.
  const MARQUEE = ['ENFP', 'GRYFFINDOR', 'TYPE 4', 'TIRAMISU', 'KAKASHI', 'HIGH OPENNESS', 'SLYTHERIN', 'INTJ', 'SECURE ATTACHMENT'];

  // The three picks under the marquee: one science, one fun, one fight-starter.
  const TONIGHT = [
    { key: 'big5', blurb: 'The one scientists actually cite' },
    { key: 'house', blurb: 'Settle it officially' },
    { key: 'hot_takes', blurb: '8 debates. Pick your sides.' },
  ].map((t) => ({ ...t, test: ALL_TESTS.get(t.key) })).filter((t) => t.test);

  // The root clips horizontally: the rotated marquee band is deliberately
  // wider than the viewport, and clipping here (not on <body>) keeps the
  // sticky site header working while never creating a nested scroller.
  return (
    <div className="min-h-screen flex flex-col bg-[#FBFAF9] overflow-x-hidden">

      <main className="flex-1 flex flex-col items-center px-6 pb-24">

        {/* ── Hero ── */}
        <div className="relative text-center max-w-3xl mx-auto mt-10 md:mt-16 mb-4">
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="font-fredoka font-semibold text-[44px] md:text-6xl text-gray-900 leading-[1.05] tracking-tight"
          >
            Find out who you{' '}
            <span className="relative inline-block text-coral-500">
              are
              <svg viewBox="0 0 96 14" className="absolute -bottom-1.5 left-0 w-full h-[0.26em]" aria-hidden="true">
                <path d="M3 10 Q24 3 48 8 Q72 13 93 5" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="text-base md:text-lg text-gray-600 font-bold mt-5"
          >
            One 3-minute quiz to start. {totalTests - 1} more to argue with.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex flex-col items-center gap-3 mt-7"
          >
            <button
              onClick={() => {
                track('hero_cta_clicked', { from: 'landing' }, user?.id ?? null);
                navigate(hasCompleted ? '/dashboard' : '/assessment');
              }}
              className="group/cta w-full sm:w-auto bg-coral-500 hover:bg-coral-600 text-white font-fredoka font-semibold text-lg px-11 py-4 rounded-2xl shadow-[0_5px_0_#C24E1D,0_12px_24px_rgba(240,104,48,0.28)] hover:shadow-[0_5px_0_#B84715,0_14px_28px_rgba(240,104,48,0.34)] active:translate-y-[3px] active:shadow-[0_2px_0_#C24E1D] transition-all duration-150 flex items-center justify-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 focus-visible:ring-offset-2"
            >
              {hasCompleted ? 'See my results' : loading ? 'Take the Big 5' : 'Take your first quiz'}
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1 transition-transform duration-200" />
            </button>
            <p className="text-xs font-bold text-gray-500">First 3 tests free · no account needed</p>
          </motion.div>
        </div>

        {/* ── Sticker wall ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.28 }}
          className="relative w-full max-w-md md:max-w-2xl mx-auto mt-10"
        >
          <svg viewBox="0 0 60 60" className="absolute -left-2 top-2 w-9 h-9 md:w-11 md:h-11" aria-hidden="true">
            <path d="M30 8 L33 25 L50 30 L33 35 L30 52 L27 35 L10 30 L27 25 Z" fill="#A8E6C3" stroke="#3BC07B" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <svg viewBox="0 0 60 60" className="absolute -right-1 -top-4 w-11 h-11 md:w-14 md:h-14" aria-hidden="true">
            <path d="M30 4 L34 24 L54 30 L34 36 L30 56 L26 36 L6 30 L26 24 Z" fill="#FFCD3C" stroke="#E0A916" strokeWidth="3" strokeLinejoin="round" />
          </svg>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-9 px-2">
            {STICKERS.map((st) => (
              <button
                key={st.key}
                onClick={st.test.action ?? (() => trackAndNavigate(st.key, st.test.to))}
                style={{ transform: `rotate(${st.rotate}deg)` }}
                className="relative rounded-full bg-[#FFFFFF] p-1.5 shadow-[0_1px_2px_rgba(28,20,12,0.10),0_10px_22px_rgba(28,20,12,0.14)] transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
                aria-label={st.test.title}
              >
                <span className={`w-[72px] h-[72px] md:w-20 md:h-20 rounded-full flex items-center justify-center ${st.disc}`}>
                  <QuizGlyph quizKey={st.key} emoji={st.test.emoji} size={38} />
                </span>
                <span className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#1F1B16] text-[#FBFAF9] dark:bg-[#ECE7DC] dark:text-[#26221B] text-[10px] font-extrabold tracking-wide px-2.5 py-[3px]">
                  {st.label}
                </span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* ── Marquee of real results ── */}
        <div
          aria-hidden="true"
          className="w-[112%] -rotate-2 overflow-hidden bg-[#1F1B16] dark:bg-[#0F0D0B] shadow-[0_8px_20px_rgba(31,27,22,0.25)] mt-12 mb-2 select-none"
        >
          <div className="marquee-track py-3">
            {[0, 1].map((copy) => (
              <span key={copy} className="font-fredoka font-medium text-[17px] text-[#FBFAF9] tracking-wider whitespace-nowrap">
                {MARQUEE.map((r) => `${r}  ✦  `).join('')}
              </span>
            ))}
          </div>
        </div>

        {/* ── Tonight's three ── */}
        <section className="w-full max-w-xl mx-auto mt-14 mb-16">
          <h2 className="font-fredoka font-semibold text-2xl text-gray-900">Tonight's three</h2>
          <p className="text-sm font-semibold text-gray-500 mt-1">A science one, a fun one, a fight-starter.</p>
          <div className="flex flex-col gap-3 mt-5">
            {TONIGHT.map((t) => (
              <button
                key={t.key}
                onClick={t.test.action ?? (() => trackAndNavigate(t.key, t.test.to))}
                className="flex items-center gap-4 text-left bg-white rounded-2xl px-5 py-4 shadow-[0_1px_2px_rgba(28,20,12,0.06),0_8px_18px_rgba(28,20,12,0.07)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_1px_2px_rgba(28,20,12,0.08),0_14px_26px_rgba(28,20,12,0.11)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300"
              >
                <span className="shrink-0">
                  <QuizGlyph quizKey={t.key} emoji={t.test.emoji} size={34} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-black text-gray-900">{t.test.title}</span>
                  <span className="block text-xs font-bold text-gray-500">{t.blurb}</span>
                </span>
                <span className="shrink-0 text-xs font-extrabold text-coral-500">{t.test.time}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => document.getElementById('quizzes')?.scrollIntoView({ behavior: 'smooth' })}
            className="mx-auto mt-6 flex items-center gap-2 text-sm font-extrabold text-gray-500 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-300 rounded-lg px-3 py-1.5"
          >
            Browse all {totalTests} tests
            <ChevronDown className="w-4 h-4" />
          </button>
        </section>

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
