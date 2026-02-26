import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { mbtiDeepQuestions } from '../data/mbtiDeepQuestions';
import { getMBTIResult } from '../data/mbtiResults';
import { computeMBTIDeepScores } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';

export default function MBTIDeepQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleComplete = useCallback(async (answers) => {
    const scores = computeMBTIDeepScores(answers, mbtiDeepQuestions);
    const result = getMBTIResult(scores);

    localStorage.setItem('personalens_mbti', JSON.stringify({ scores, result }));

    if (user && supabase) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'mbti_deep',
          p_result: {
            resultKey: result.name,
            name: `${result.name} — ${result.nickname}`,
            emoji: result.emoji,
            trait: result.nickname,
            quizName: 'MBTI Deep (OEJTS)',
            scores,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save MBTI deep quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'mbti_deep', result_key: result.name, duration_ms }, user?.id ?? null);

    navigate('/quiz/mbti/result', { replace: true });
  }, [navigate, user]);

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    return question.options.map((opt) => (
      <motion.button
        key={opt.value}
        onClick={() => onAnswer(opt.value)}
        whileTap={{ scale: 0.98 }}
        className={`w-full px-5 py-4 rounded-2xl text-left transition-all duration-150 border-2 flex items-start gap-3
          ${selectedValue === opt.value
            ? 'bg-coral-400 border-coral-400 text-white shadow-[0_2px_10px_rgba(255,138,92,0.35)]'
            : 'bg-white border-gray-100 text-gray-700 hover:border-coral-200 hover:bg-coral-50 shadow-sm'
          }`}
      >
        <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5
          ${selectedValue === opt.value ? 'bg-white/25 text-white' : 'bg-gray-100 text-gray-400'}`}>
          {opt.value.toUpperCase()}
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
        questions={mbtiDeepQuestions}
        onComplete={handleComplete}
        renderOptions={renderOptions}
        quizKey="mbti_deep"
        userId={user?.id ?? null}
      />
    </>
  );
}
