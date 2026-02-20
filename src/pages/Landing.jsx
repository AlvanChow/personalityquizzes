import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useBigFive } from '../contexts/BigFiveContext';
import { Sparkles, Brain, Layers, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Science-Backed',
    desc: 'Built on the Big Five model used by psychologists worldwide.',
  },
  {
    icon: Layers,
    title: 'Endless Skins',
    desc: 'One core profile. Hundreds of fun, themed quiz results.',
  },
  {
    icon: Sparkles,
    title: 'Always Evolving',
    desc: 'Every quiz you take refines your unique personality profile.',
  },
];

export default function Landing() {
  const navigate = useNavigate();
  const { hasCompleted } = useBigFive();

  function handleStart() {
    navigate(hasCompleted ? '/dashboard' : '/assessment');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="text-xl font-extrabold tracking-tight text-gray-800">
            Persona<span className="text-sky-500">Lens</span>
          </span>
          {hasCompleted && (
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors"
            >
              My Dashboard
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-50 border border-sky-100 text-sky-600 text-sm font-semibold mb-8">
            <Sparkles className="w-4 h-4" />
            Powered by the Big Five Model
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Discover Who You
            <br />
            <span className="bg-gradient-to-r from-sky-400 to-coral-400 bg-clip-text text-transparent">
              Really Are.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-500 max-w-md mx-auto mb-10 leading-relaxed">
            One scientific engine. Endless fun quizzes. Uncover the personality traits that make you, you.
          </p>

          <motion.button
            onClick={handleStart}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold text-lg shadow-[0_8px_32px_rgba(26,127,212,0.3)] hover:shadow-[0_12px_40px_rgba(26,127,212,0.4)] transition-shadow duration-300"
          >
            {hasCompleted ? 'Go to Dashboard' : 'Take the Baseline Assessment'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
          className="mt-20 w-full max-w-3xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="text-center p-6 rounded-3xl bg-white/60 border border-gray-100 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
              >
                <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-sky-500" />
                </div>
                <h3 className="font-bold text-gray-800 mb-1">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
