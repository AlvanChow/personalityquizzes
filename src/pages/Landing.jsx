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
      bgColor: 'bg-[#FF90E8]',
      buttonText: hasCompleted ? 'View Results' : 'Take the Big 5',
      action: () => navigate(hasCompleted ? '/dashboard' : '/assessment'),
      featured: true
    },
    {
      id: 'mbti',
      name: 'MBTI (16 Types)',
      description: 'Are you an INTJ or an ESFP? Find your Myers-Briggs type and understand your cognitive functions.',
      icon: Brain,
      bgColor: 'bg-[#FFC900]',
      buttonText: 'Take the MBTI',
      action: () => navigate('/assessment'),
      featured: false
    },
    {
      id: 'enneagram',
      name: 'Enneagram',
      description: 'Discover which of the 9 interconnected personality types drives your deepest motivations and fears.',
      icon: CircleDashed,
      bgColor: 'bg-[#00E5FF]',
      buttonText: 'Take the Enneagram',
      action: () => navigate('/assessment'),
      featured: false
    },
    {
      id: 'cakeme',
      name: 'Cake.me',
      description: 'The viral sensation. What kind of cake matches your vibe? Sweet, layered, or a little nutty?',
      icon: Cake,
      bgColor: 'bg-[#B4FA72]',
      buttonText: 'Find Your Cake',
      action: () => navigate('/cake-quiz'),
      featured: true
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F4F4] overflow-hidden font-sans selection:bg-[#FF90E8] selection:text-black">
      {/* Navbar */}
      <header className="px-6 py-4 border-b-4 border-black bg-white relative z-20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-2xl sm:text-3xl font-black text-black tracking-tighter uppercase flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#FF90E8] fill-current" />
            My Personality Quizzes
          </span>
          {hasCompleted && (
            <button
              onClick={() => navigate('/dashboard')}
              className="hidden sm:block text-sm font-black text-black uppercase bg-[#B4FA72] border-4 border-black px-6 py-2 rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[4px] active:translate-x-[4px] active:shadow-none transition-all"
            >
              Dashboard
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 pb-32 relative z-10">

        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mt-16 md:mt-24 mb-20 relative">

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="text-6xl sm:text-7xl md:text-8xl font-black text-black leading-none tracking-tighter mb-8 uppercase"
          >
            Discover who <br className="hidden md:block" />
            <span className="inline-block bg-[#FFC900] px-6 py-2 border-4 border-black transform -rotate-2 mt-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              you really are.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-2xl text-black max-w-2xl mx-auto leading-relaxed font-bold bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-2xl"
          >
            From deep scientific assessments to viral trends. Choose your flavor below and start exploring.
          </motion.p>
        </div>

        {/* Quizzes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {quizzes.map((quiz, index) => {
            const Icon = quiz.icon;
            return (
              <motion.div
                key={quiz.id}
                whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={quiz.action}
                className={`${quiz.bgColor} border-4 border-black rounded-[2rem] p-6 sm:p-8 cursor-pointer shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col group`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-white border-4 border-black rounded-2xl flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <Icon className="w-8 h-8 text-black" />
                  </div>
                  {quiz.featured && (
                    <span className="bg-black text-white text-sm font-black px-4 py-2 rounded-full uppercase tracking-widest transform rotate-3 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.8)]">
                      Viral!
                    </span>
                  )}
                </div>

                <h3 className="text-3xl sm:text-4xl font-black text-black mb-4 uppercase tracking-tight">{quiz.name}</h3>
                <p className="text-black font-bold text-lg mb-8 flex-1 leading-snug bg-white/60 p-5 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  {quiz.description}
                </p>

                <div className="mt-auto">
                  <button className="w-full bg-white text-black font-black uppercase tracking-wide text-xl py-4 border-4 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-black group-hover:text-white transition-colors flex items-center justify-center gap-3">
                    {quiz.buttonText}
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </main>
    </div>
  );
}
