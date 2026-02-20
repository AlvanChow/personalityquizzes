import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFive } from '../contexts/BigFiveContext';
import { Activity, Brain, CircleDashed, Cake, ArrowRight, Sparkles } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { hasCompleted } = useBigFive();

  const quizzes = [
    {
      id: 'big5',
      name: 'Big 5 Personality',
      description: 'The scientifically-backed OCEAN model. Discover your core traits and how you navigate the world.',
      icon: Activity,
      theme: 'blue',
      iconBg: 'bg-blue-50 text-blue-500',
      buttonBg: 'bg-blue-500 hover:bg-blue-600',
      buttonText: hasCompleted ? 'View Results' : 'Take the Big 5',
      action: () => navigate(hasCompleted ? '/dashboard' : '/assessment'),
      featured: true
    },
    {
      id: 'mbti',
      name: 'MBTI (16 Types)',
      description: 'Are you an INTJ or an ESFP? Find your Myers-Briggs type and understand your cognitive functions.',
      icon: Brain,
      theme: 'purple',
      iconBg: 'bg-purple-50 text-purple-500',
      buttonBg: 'bg-purple-500 hover:bg-purple-600',
      buttonText: 'Take the MBTI',
      action: () => navigate('/assessment'),
      featured: false
    },
    {
      id: 'enneagram',
      name: 'Enneagram',
      description: 'Discover which of the 9 interconnected personality types drives your deepest motivations and fears.',
      icon: CircleDashed,
      theme: 'teal',
      iconBg: 'bg-teal-50 text-teal-500',
      buttonBg: 'bg-teal-500 hover:bg-teal-600',
      buttonText: 'Take the Enneagram',
      action: () => navigate('/assessment'),
      featured: false
    },
    {
      id: 'cakeme',
      name: 'Cake.me',
      description: 'The viral sensation. What kind of cake matches your vibe? Sweet, layered, or a little nutty?',
      icon: Cake,
      theme: 'rose',
      iconBg: 'bg-rose-50 text-rose-500',
      buttonBg: 'bg-rose-500 hover:bg-rose-600',
      buttonText: 'Find Your Cake',
      action: () => navigate('/cake-quiz'),
      featured: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] overflow-hidden relative font-sans">

      {/* Gentle Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-rose-100/40 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-100/40 blur-[100px]" />
      </div>

      {/* Navbar */}
      <header className="px-6 py-6 relative z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-rose-400" />
            My Personality Quizzes
          </span>
          {hasCompleted && (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 bg-white px-5 py-2.5 rounded-full shadow-sm border border-gray-100 transition-all hover:shadow-md"
            >
              Back to Dashboard
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-24 relative z-10">

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mt-12 md:mt-20 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-100 shadow-sm text-gray-500 text-sm font-medium mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            Your journey starts here
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 leading-[1.1] tracking-tight mb-6"
          >
            Discover who <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-300">
              you really are.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed"
          >
            From deep scientific assessments to fun viral trends. Choose your favorite personality framework below and start exploring.
          </motion.p>
        </div>

        {/* Quizzes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {quizzes.map((quiz) => {
            const Icon = quiz.icon;
            return (
              <motion.div
                key={quiz.id}
                whileHover={{ y: -5 }}
                onClick={quiz.action}
                className="bg-white rounded-[2rem] p-8 cursor-pointer shadow-sm hover:shadow-xl hover:shadow-gray-200/50 border border-gray-100 transition-all duration-300 flex flex-col group relative overflow-hidden"
              >
                {/* Gentle background hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${quiz.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    {quiz.featured && (
                      <span className="bg-rose-50 text-rose-600 text-xs font-bold px-3 py-1.5 rounded-full tracking-wide">
                        Popular
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{quiz.name}</h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="mt-auto pt-4">
                    <button className={`w-full text-white font-medium py-3.5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${quiz.buttonBg} shadow-sm hover:shadow-md`}>
                      {quiz.buttonText}
                      <ArrowRight className="w-4 h-4" />
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
