import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { baselineQuestions, likertOptions } from '../data/baselineQuestions';
import { useBigFive } from '../contexts/BigFiveContext';

export default function Assessment() {
  const navigate = useNavigate();
  const { completeBaseline } = useBigFive();

  const handleComplete = useCallback((answers) => {
    const traitSums = {};
    const traitCounts = {};

    Object.entries(answers).forEach(([qId, { trait, value }]) => {
      const q = baselineQuestions.find((bq) => bq.id === Number(qId));
      const adjusted = q?.reversed ? 6 - value : value;
      traitSums[trait] = (traitSums[trait] || 0) + adjusted;
      traitCounts[trait] = (traitCounts[trait] || 0) + 1;
    });

    const scores = {};
    for (const trait of Object.keys(traitSums)) {
      const avg = traitSums[trait] / traitCounts[trait];
      scores[trait] = Math.round(((avg - 1) / 4) * 100);
    }

    completeBaseline(scores);
    navigate('/dashboard');
  }, [completeBaseline, navigate]);

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
    />
  );
}
