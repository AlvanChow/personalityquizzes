import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { mbtiQuestions } from '../data/mbtiQuestions';
import { getMBTIResult } from '../data/mbtiResults';
import { computeMBTIScores } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function MBTIQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleComplete = useCallback((answers) => {
    const scores = computeMBTIScores(answers);
    const result = getMBTIResult(scores);

    localStorage.setItem('personalens_mbti', JSON.stringify({ scores, result }));

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
                mbti: {
                  type: result.name,
                  nickname: result.nickname,
                  quizName: 'MBTI (16 Types)',
                },
              },
            })
            .eq('id', user.id);
        } catch (err) {
          console.error('Failed to save MBTI quiz result:', err);
        }
      })();
    }

    navigate('/quiz/mbti/result');
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
            ? 'bg-coral-50 border-coral-300 text-coral-700'
            : 'bg-white border-gray-100 text-gray-700 hover:border-coral-200 hover:bg-coral-50/50 shadow-[0_2px_12px_rgba(0,0,0,0.04)]'
          }`}
      >
        {opt.label}
      </motion.button>
    ));
  }, []);

  return (
    <QuizShell
      questions={mbtiQuestions}
      onComplete={handleComplete}
      renderOptions={renderOptions}
    />
  );
}
