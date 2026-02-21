import { useCallback } from 'react';
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

  const handleComplete = useCallback((answers) => {
    const scores = computeEnneagramScores(answers);
    const result = getEnneagramResult(scores);

    localStorage.setItem('personalens_enneagram', JSON.stringify({ scores, result }));

    if (user) {
      (async () => {
        try {
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
                enneagram: {
                  type: result.typeNumber,
                  nickname: result.nickname,
                  quizName: 'Enneagram',
                },
              },
            })
            .eq('id', user.id);
        } catch (err) {
          console.error('Failed to save Enneagram quiz result:', err);
        }
      })();
    }

    navigate('/quiz/enneagram/result');
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
    <QuizShell
      questions={enneagramQuestions}
      onComplete={handleComplete}
      renderOptions={renderOptions}
    />
  );
}
