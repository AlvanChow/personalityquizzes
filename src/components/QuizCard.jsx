import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function QuizCard({ title, description, icon: Icon, to, locked = false, completed = false, onBeforeNavigate }) {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => { if (locked) return; onBeforeNavigate?.(to); navigate(to); }}
      disabled={locked}
      whileHover={locked ? {} : { y: -4, scale: 1.02 }}
      whileTap={locked ? {} : { scale: 0.98 }}
      className={`relative w-full text-left p-6 rounded-xl transition-all duration-200
        ${locked
          ? 'bg-gray-50 border-2 border-dashed border-gray-200 cursor-not-allowed opacity-60'
          : completed
            ? 'bg-white border-2 border-emerald-200 shadow-sm hover:border-emerald-300 hover:shadow-md cursor-pointer'
            : 'bg-white border border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md cursor-pointer'
        }`}
    >
      {locked && (
        <div className="absolute top-4 right-4">
          <Lock className="w-4 h-4 text-gray-300" />
        </div>
      )}
      {completed && !locked && (
        <div className="absolute top-4 right-4">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${completed ? 'bg-emerald-50' : 'bg-gray-100'}`}>
          <Icon className={`w-5 h-5 ${completed ? 'text-emerald-500' : 'text-coral-400'}`} />
        </div>
        <h3 className="text-base font-bold text-gray-800 leading-snug pr-6">{title}</h3>
      </div>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      {!locked && (
        <div className={`mt-4 inline-flex items-center text-sm font-semibold ${completed ? 'text-emerald-600' : 'text-sky-500'}`}>
          {completed ? 'View Result' : 'Take Quiz'}
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
