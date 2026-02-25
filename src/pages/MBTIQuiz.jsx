import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { mbtiQuestions } from '../data/mbtiQuestions';
import { getMBTIResult } from '../data/mbtiResults';
import { computeMBTIScores } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';

export default function MBTIQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleComplete = useCallback(async (answers) => {
    const scores = computeMBTIScores(answers);
    const result = getMBTIResult(scores);

    localStorage.setItem('personalens_mbti', JSON.stringify({ scores, result }));

    if (user) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'mbti',
          p_result: {
            resultKey: result.name,
            name: `${result.name} — ${result.nickname}`,
            emoji: result.emoji,
            trait: result.nickname,
            quizName: 'MBTI (16 Types)',
            scores,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save MBTI quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'mbti', result_key: result.name, duration_ms }, user?.id ?? null);

    // Replace the quiz in browser history so the back button skips it.
    navigate('/quiz/mbti/result', { replace: true });
  }, [navigate, user]);

  const optionLetters = ['A', 'B', 'C', 'D'];

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    return question.options.map((opt, idx) => (
      <motion.button
        key={opt.value}
        onClick={() => onAnswer(opt.value)}
        whileTap={{ scale: 0.98 }}
        className={`w-full px-4 py-3.5 rounded-2xl text-left transition-all duration-150 border-2 flex items-start gap-3
          ${selectedValue === opt.value
            ? 'bg-coral-400 border-coral-400 text-white shadow-[0_2px_10px_rgba(255,138,92,0.35)]'
            : 'bg-white border-gray-100 text-gray-700 hover:border-coral-200 hover:bg-coral-50 shadow-sm'
          }`}
      >
        <span className={`text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5
          ${selectedValue === opt.value ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-400'}`}>
          {optionLetters[idx]}
        </span>
        <span className="text-sm font-medium leading-snug">{opt.label}</span>
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
        questions={mbtiQuestions}
        onComplete={handleComplete}
        renderOptions={renderOptions}
        quizKey="mbti"
        userId={user?.id ?? null}
      />
    </>
  );
}
