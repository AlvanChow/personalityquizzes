import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Brain, CircleDashed, ArrowRight } from 'lucide-react';

const suggestions = [
  { label: 'Big 5 Personality', path: '/assessment', Icon: Activity, color: 'bg-teal-100 text-teal-700' },
  { label: 'MBTI (16 Types)',   path: '/quiz/mbti',  Icon: Brain,     color: 'bg-coral-100 text-coral-700' },
  { label: 'Enneagram',         path: '/quiz/enneagram', Icon: CircleDashed, color: 'bg-violet-100 text-violet-700' },
];

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-md w-full"
      >
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          This page doesn&apos;t exist. While you&apos;re here — why not take a quiz?
        </p>

        <div className="flex flex-col gap-3 mb-8">
          {suggestions.map(({ label, path, Icon, color }, i) => (
            <motion.button
              key={path}
              onClick={() => navigate(path)}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + i * 0.07 }}
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all group text-left"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="flex-1 text-sm font-bold text-gray-700">{label}</span>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.button>
          ))}
        </div>

        <button
          onClick={() => navigate('/')}
          className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← Back to Home
        </button>
      </motion.div>
    </div>
  );
}
