import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

export default function QuizCard({ title, description, icon: Icon, to, locked = false, onBeforeNavigate }) {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => { if (locked) return; onBeforeNavigate?.(to); navigate(to); }}
      disabled={locked}
      whileHover={locked ? {} : { y: -4, scale: 1.02 }}
      whileTap={locked ? {} : { scale: 0.98 }}
      className={`relative w-full text-left p-6 rounded-3xl transition-shadow duration-300
        ${locked
          ? 'bg-gray-50 border-2 border-dashed border-gray-200 cursor-not-allowed opacity-60'
          : 'bg-white border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] cursor-pointer'
        }`}
    >
      {locked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-4 h-4 text-gray-300" />
        </div>
      )}
      <div className="w-12 h-12 rounded-2xl bg-cream-100 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-coral-400" />
      </div>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      {!locked && (
        <div className="mt-4 inline-flex items-center text-sm font-semibold text-sky-500">
          Take Quiz
          <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
      {locked && (
        <div className="mt-4 text-sm font-medium text-gray-400">Coming Soon</div>
      )}
    </motion.button>
  );
}
