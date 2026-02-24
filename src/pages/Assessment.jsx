import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { baselineQuestions, likertOptions } from '../data/baselineQuestions';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import { computeBaselineScores } from '../utils/scoring';
import { track } from '../utils/analytics';

export default function Assessment() {
  const navigate = useNavigate();
  const { completeBaseline } = useBigFive();
  const { user } = useAuth();
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleComplete = useCallback((answers) => {
    const scores = computeBaselineScores(answers, baselineQuestions);
    completeBaseline(scores);
    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('baseline_completed', { duration_ms }, user?.id ?? null);
    navigate('/dashboard');
  }, [completeBaseline, navigate, user]);

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    return likertOptions.map((opt) => (
      <motion.button
        key={opt.value}
        onClick={() => onAnswer(opt.value)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-200 border-2
          ${selectedValue === opt.value
            ? 'bg-sky-50 border-sky-300 text-sky-700'
            : 'bg-white border-gray-100 text-gray-700 hover:border-sky-200 hover:bg-sky-50/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          }`}
      >
        <div className="flex items-center gap-4">
          <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
            ${selectedValue === opt.value
              ? 'bg-sky-400 text-white'
              : 'bg-gray-100 text-gray-400'
            }`}>
            {opt.value}
          </span>
          <span>{opt.label}</span>
        </div>
      </motion.button>
    ));
  }, []);

  return (
    <QuizShell
      questions={baselineQuestions}
      onComplete={handleComplete}
      renderOptions={renderOptions}
      quizKey="baseline"
      userId={user?.id ?? null}
    />
  );
}
