import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { cakeQuestions } from '../data/cakeQuestions';
import { getCakeResult } from '../data/cakeResults';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { optionToAdjustment } from '../utils/scoring';

export default function CakeQuiz() {
  const navigate = useNavigate();
  const { scores, hasCompleted, updateScores } = useBigFive();
  const { user } = useAuth();

  useEffect(() => {
    if (!hasCompleted) navigate('/');
  }, [hasCompleted, navigate]);

  const handleComplete = useCallback((answers) => {
    const adjustments = {};
    Object.values(answers).forEach(({ trait, value }) => {
      const adj = optionToAdjustment(value);
      adjustments[trait] = (adjustments[trait] || 0) + adj;
    });

    const newScores = {};
    Object.entries(adjustments).forEach(([trait, adj]) => {
      newScores[trait] = Math.min(100, Math.max(0, scores[trait] + adj));
    });

    updateScores(newScores);

    const mergedScores = { ...scores, ...newScores };
    const result = getCakeResult(mergedScores);
    const resultKey = Object.entries(
      { funfetti: 'Funfetti Cake', wedding: 'Elaborate Wedding Cake', matcha: 'Matcha Crepe Cake', redvelvet: 'Red Velvet Cake', lava: 'Chocolate Lava Cake', chocolate: 'Classic Chocolate Cake' }
    ).find(([, name]) => name === result.name)?.[0] || 'chocolate';

    if (user) {
      (async () => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('quiz_results')
          .eq('id', user.id)
          .maybeSingle();

        const existing = profile?.quiz_results || {};
        await supabase
          .from('profiles')
          .update({
            quiz_results: {
              ...existing,
              cake: {
                resultKey,
                name: result.name,
                emoji: result.emoji,
                trait: result.trait,
                quizName: 'What Cake Are You?',
              },
            },
          })
          .eq('id', user.id);
      })();
    }

    navigate('/quiz/cake/result');
  }, [scores, updateScores, navigate, user]);

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    return question.options.map((opt) => (
      <motion.button
        key={opt.value}
        onClick={() => onAnswer(opt.value)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-200 border-2
          ${selectedValue === opt.value
            ? 'bg-coral-50 border-coral-300 text-coral-700'
            : 'bg-white border-gray-100 text-gray-700 hover:border-coral-200 hover:bg-coral-50/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          }`}
      >
        {opt.label}
      </motion.button>
    ));
  }, []);

  if (!hasCompleted) return null;

  return (
    <QuizShell
      questions={cakeQuestions}
      onComplete={handleComplete}
      renderOptions={renderOptions}
    />
  );
}
