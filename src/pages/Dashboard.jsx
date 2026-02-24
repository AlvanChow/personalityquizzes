import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cake, Brain, CircleDashed, RotateCcw } from 'lucide-react';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import ScoreBar from '../components/ScoreBar';
import QuizCard from '../components/QuizCard';
import { track } from '../utils/analytics';

const traitOrder = ['O', 'C', 'E', 'A', 'N'];

const quizzes = [
  {
    quizKey: 'cake',
    title: 'What Cake Are You?',
    description: 'Discover which delicious cake matches your personality profile.',
    icon: Cake,
    to: '/quiz/cake',
    locked: false,
  },
  {
    quizKey: 'mbti',
    title: 'MBTI (16 Types)',
    description: 'Find your Myers-Briggs type and understand your cognitive style.',
    icon: Brain,
    to: '/quiz/mbti',
    locked: false,
  },
  {
    quizKey: 'enneagram',
    title: 'Enneagram',
    description: 'Discover which of the 9 types drives your deepest motivations.',
    icon: CircleDashed,
    to: '/quiz/enneagram',
    locked: false,
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { scores, hasCompleted, loading, resetScores } = useBigFive();
  const { user } = useAuth();

  useEffect(() => {
    if (!loading && !hasCompleted) navigate('/');
  }, [loading, hasCompleted, navigate]);

  if (loading) return null;
  if (!hasCompleted) return null;

  function handleReset() {
    resetScores();
    navigate('/');
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-6 py-4 border-b border-gray-100 bg-white/60 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-xl font-extrabold tracking-tight text-gray-800">
            My Personality <span className="text-sky-500">Quizzes</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="px-6 py-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-1">
            Your Personality Profile
          </h1>
          <p className="text-gray-500 mb-8">
            Based on your baseline assessment. Take more quizzes to refine your scores.
          </p>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-12">
            {traitOrder.map((trait, i) => (
              <ScoreBar key={trait} trait={trait} value={scores[trait]} delay={i * 0.1} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
            Quiz Library
          </h2>
          <p className="text-gray-500 mb-6">
            Each quiz maps your personality into a fun new world.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.title}
                {...quiz}
                onBeforeNavigate={() =>
                  track('quiz_card_clicked', { quiz: quiz.quizKey, from: 'dashboard' }, user?.id ?? null)
                }
              />
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
