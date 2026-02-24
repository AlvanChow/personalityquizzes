import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { enneagramQuestions } from '../data/enneagramQuestions';
import { getEnneagramResult } from '../data/enneagramResults';
import { computeEnneagramScores } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function EnneagramQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);

  const handleComplete = useCallback(async (answers) => {
    const scores = computeEnneagramScores(answers);
    const result = getEnneagramResult(scores);

    localStorage.setItem('personalens_enneagram', JSON.stringify({ scores, result }));

    if (user) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'enneagram',
          p_result: {
            resultKey: result.typeNumber,
            name: result.name,
            emoji: result.emoji,
            trait: result.nickname,
            quizName: 'Enneagram',
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save Enneagram quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        return;
      }
    }

    // Replace the quiz in browser history so the back button skips it.
    navigate('/quiz/enneagram/result', { replace: true });
  }, [navigate, user]);

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    return question.options.map((opt) => (
      <motion.button
        key={opt.value}
        onClick={() => onAnswer(opt.value)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`w-full px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-200 border-2
          ${selectedValue === opt.value
            ? 'bg-mint-50 border-mint-300 text-mint-700'
            : 'bg-white border-gray-100 text-gray-700 hover:border-mint-200 hover:bg-mint-50/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          }`}
      >
        {opt.label}
      </motion.button>
    ));
  }, []);

  return (
    <>
      {saveError && (
        <p role="alert" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-3 rounded-2xl shadow-md z-50">
          {saveError}
        </p>
      )}
      <QuizShell
        questions={enneagramQuestions}
        onComplete={handleComplete}
        renderOptions={renderOptions}
      />
    </>
  );
}
