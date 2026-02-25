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
      iconBg: 'bg-teal-100 text-teal-600',
      buttonBg: 'bg-teal-500 hover:bg-teal-600',
      buttonText: hasCompleted ? 'View Results' : 'Take the Big 5',
      action: () => trackAndNavigate('big5', hasCompleted ? '/dashboard' : '/assessment'),
      featured: true
    },
    {
      id: 'mbti',
      name: 'MBTI (16 Types)',
      description: 'Are you an INTJ or an ESFP? Find your Myers-Briggs type and understand your cognitive functions.',
      icon: Brain,
      iconBg: 'bg-coral-100 text-coral-600',
      buttonBg: 'bg-coral-500 hover:bg-coral-600',
      buttonText: 'Take the MBTI',
      action: () => trackAndNavigate('mbti', '/quiz/mbti'),
      featured: true
    },
    {
      id: 'enneagram',
      name: 'Enneagram',
      description: 'Discover which of the 9 interconnected personality types drives your deepest motivations and fears.',
      icon: CircleDashed,
      iconBg: 'bg-mint-100 text-mint-600',
      buttonBg: 'bg-mint-500 hover:bg-mint-600',
      buttonText: 'Take the Enneagram',
      action: () => trackAndNavigate('enneagram', '/quiz/enneagram'),
      featured: true
    },
    {
      id: 'cakeme',
      name: 'Cake.me',
      description: 'The viral sensation. What kind of cake matches your vibe? Sweet, layered, or a little nutty?',
      icon: Cake,
      iconBg: 'bg-rose-100 text-rose-600',
      buttonBg: 'bg-rose-400 hover:bg-rose-500',
      buttonText: 'Find Your Cake',
      action: () => trackAndNavigate('cakeme', '/quiz/cake'),
      featured: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-nunito">

      <header className="px-6 py-5 border-b border-gray-200 bg-white">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-coral-400" />
            My Personality Quizzes
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/frameworks')}
              className="text-sm font-bold text-gray-500 hover:text-gray-800 transition-colors hidden sm:block"
            >
              Frameworks
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
              onClick={() => navigate('/frameworks')}
              className="text-gray-500 hover:text-gray-700 font-bold text-base px-5 py-3.5 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center gap-2"
            >
              Explore all frameworks
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
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {quizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <div
                key={quiz.id}
                onClick={quiz.action}
                className="bg-white rounded-xl p-7 cursor-pointer shadow-sm border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${quiz.iconBg} shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 leading-snug">{quiz.name}</h3>
                </div>
                <p className="text-gray-500 font-medium mb-7 leading-relaxed">
                  {quiz.description}
                </p>

                <div className="mt-auto">
                  <button className={`w-full text-white font-bold text-base py-3.5 px-5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2.5 ${quiz.buttonBg}`}>
                    {quiz.buttonText}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
