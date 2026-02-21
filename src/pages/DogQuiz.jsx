import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { dogQuestions } from '../data/dogQuestions';
import { getDogResult, dogResults } from '../data/dogResults';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

function optionToAdjustment(value) {
  const map = { 1: -4, 2: -2, 3: 2, 4: 4 };
  return map[value] ?? 0;
}

export default function DogQuiz() {
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
    const result = getDogResult(mergedScores);
    const resultKey = Object.entries(dogResults)
      .find(([, r]) => r.name === result.name)?.[0] || 'mixedbreed';

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
              dog: {
                resultKey,
                name: result.name,
                emoji: result.emoji,
                trait: result.trait,
                quizName: 'What Dog Breed Are You?',
              },
            },
          })
          .eq('id', user.id);
      })();
    }

    navigate('/quiz/dog/result');
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
            ? 'bg-sky-50 border-sky-300 text-sky-700'
            : 'bg-white border-gray-100 text-gray-700 hover:border-sky-200 hover:bg-sky-50/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          }`}
      >
        {opt.label}
      </motion.button>
    ));
  }, []);

  if (!hasCompleted) return null;

  return (
    <QuizShell
      questions={dogQuestions}
      onComplete={handleComplete}
      renderOptions={renderOptions}
    />
  );
}
