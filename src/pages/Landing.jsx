import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import { Activity, Brain, CircleDashed, Cake, ArrowRight, Sparkles, Users, ChevronDown } from 'lucide-react';
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
      description: 'The scientifically-backed OCEAN model. Discover your core traits and how you navigate the world.',
      icon: Activity,
      iconBg: 'bg-teal-100 text-teal-500',
      buttonBg: 'bg-teal-400 hover:bg-teal-500',
      buttonText: hasCompleted ? 'View Results' : 'Take the Big 5',
      action: () => trackAndNavigate('big5', hasCompleted ? '/dashboard' : '/assessment'),
      featured: true
    },
    {
      id: 'mbti',
      name: 'MBTI (16 Types)',
      description: 'Are you an INTJ or an ESFP? Find your Myers-Briggs type and understand your cognitive functions.',
      icon: Brain,
      iconBg: 'bg-coral-100 text-coral-500',
      buttonBg: 'bg-coral-400 hover:bg-coral-500',
      buttonText: 'Take the MBTI',
      action: () => trackAndNavigate('mbti', '/quiz/mbti'),
      featured: true
    },
    {
      id: 'enneagram',
      name: 'Enneagram',
      description: 'Discover which of the 9 interconnected personality types drives your deepest motivations and fears.',
      icon: CircleDashed,
      iconBg: 'bg-mint-100 text-mint-500',
      buttonBg: 'bg-mint-400 hover:bg-mint-500',
      buttonText: 'Take the Enneagram',
      action: () => trackAndNavigate('enneagram', '/quiz/enneagram'),
      featured: true
    },
    {
      id: 'cakeme',
      name: 'Cake.me',
      description: 'The viral sensation. What kind of cake matches your vibe? Sweet, layered, or a little nutty?',
      icon: Cake,
      iconBg: 'bg-rose-100 text-rose-500',
      buttonBg: 'bg-rose-400 hover:bg-rose-500',
      buttonText: 'Find Your Cake',
      action: () => trackAndNavigate('cakeme', '/quiz/cake'),
      featured: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-peach-50 via-white to-mint-50 overflow-hidden relative font-nunito">

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-200/40 blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-mint-200/40 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[40%] left-[40%] w-[20%] h-[20%] rounded-full bg-coral-200/20 blur-[80px]"
        />
      </div>

      <header className="px-6 py-6 relative z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-2xl font-extrabold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-coral-400" />
            My Personality Quizzes
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/frameworks')}
              className="text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors hidden sm:block"
            >
              Frameworks
            </button>
            {hasCompleted && (
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm font-bold text-gray-700 hover:text-gray-900 bg-white px-5 py-2.5 rounded-full shadow-sm border-2 border-mint-100 transition-all hover:shadow-md hover:border-mint-200"
              >
                Back to Dashboard
              </button>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-24 relative z-10">

        <div className="text-center max-w-3xl mx-auto mt-12 md:mt-20 mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-coral-100 text-coral-500 text-sm font-bold px-4 py-2 rounded-full mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Science meets self-discovery
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-black text-gray-900 leading-[1.08] tracking-tight mb-7"
          >
            Your personality is a <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-400 via-rose-400 to-peach-400">
              superpower. Learn it.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed mb-10"
          >
            Most people go their whole lives without understanding why they think, feel, and act the way they do. Our research-backed assessments decode the patterns behind your personality in under 10 minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <button
              onClick={() => {
                track('hero_cta_clicked', { from: 'landing' }, user?.id ?? null);
                navigate(hasCompleted ? '/dashboard' : '/assessment');
              }}
              className="group/cta bg-gradient-to-r from-coral-400 to-rose-400 hover:from-coral-500 hover:to-rose-500 text-white font-extrabold text-lg px-10 py-4.5 rounded-2xl shadow-lg shadow-coral-200/50 hover:shadow-xl hover:shadow-coral-300/50 transition-all duration-300 flex items-center gap-3 hover:scale-[1.03] active:scale-[0.98]"
            >
              {hasCompleted ? 'See My Results' : 'Start Your Deep Dive'}
              <ArrowRight className="w-5 h-5 group-hover/cta:translate-x-1.5 transition-transform duration-300" />
            </button>
            <button
              onClick={() => navigate('/frameworks')}
              className="text-gray-500 hover:text-gray-700 font-bold text-base px-6 py-4 rounded-2xl hover:bg-white/60 transition-all duration-300 flex items-center gap-2"
            >
              Explore all frameworks
              <ChevronDown className="w-4 h-4" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex items-center justify-center gap-2 text-sm text-gray-400 font-medium"
          >
            <Users className="w-4 h-4" />
            <span>Taken by <strong className="text-gray-500">50,000+</strong> curious humans</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {quizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <motion.div
                key={quiz.id}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={quiz.action}
                className="bg-white rounded-[2rem] p-8 cursor-pointer shadow-lg shadow-gray-200/40 border-2 border-transparent hover:border-gray-100 transition-all duration-300 flex flex-col group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-5">
                    <motion.div
                      whileHover={{ rotate: 10 }}
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${quiz.iconBg} shadow-sm shrink-0`}
                    >
                      <Icon className="w-7 h-7" />
                    </motion.div>
                    <h3 className="text-2xl font-extrabold text-gray-900 leading-snug">{quiz.name}</h3>
                  </div>
                  <p className="text-gray-500 font-medium mb-8 leading-relaxed text-lg">
                    {quiz.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <button className={`w-full text-white font-bold text-lg py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${quiz.buttonBg} shadow-md hover:shadow-lg`}>
                      {quiz.buttonText}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
