import { useCallback, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { cakeQuestions } from '../data/cakeQuestions';
import { getCakeResult, cakeResultNameToKey } from '../data/cakeResults';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';

export default function CakeQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleComplete = useCallback(async (answers) => {
    // Direct accumulation: sum option values per competency key
    const scores = {};
    Object.values(answers).forEach(({ trait, value }) => {
      scores[trait] = (scores[trait] || 0) + value;
    });

    const result = getCakeResult(scores);
    const resultKey = cakeResultNameToKey[result.name] ?? 'layercake';

    // Store scores alongside result so CakeResult can render the competency breakdown
    localStorage.setItem('personalens_cake', JSON.stringify({ result, resultKey, scores }));

    if (user && supabase) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'cake',
          p_result: {
            resultKey,
            name: result.name,
            emoji: result.emoji,
            trait: result.trait,
            quizName: 'What Cake Are You?',
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save cake quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'cake', result_key: resultKey, duration_ms }, user?.id ?? null);

    navigate('/quiz/cake/result', { replace: true });
  }, [navigate, user]);

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    return question.options.map((opt) => (
      <motion.button
        key={opt.value}
        onClick={() => onAnswer(opt.value)}
        whileTap={{ scale: 0.97 }}
        className={`w-full px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-150 border-2
          ${selectedValue === opt.value
            ? 'bg-coral-400 border-coral-400 text-white shadow-[0_2px_10px_rgba(255,138,92,0.35)]'
            : 'bg-white border-gray-200 text-gray-700 hover:border-coral-300 hover:bg-coral-50 shadow-sm'
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
        questions={cakeQuestions}
        onComplete={handleComplete}
        renderOptions={renderOptions}
        quizKey="cake"
        userId={user?.id ?? null}
        exitPath="/dashboard"
        questionsPerPage={6}
      />
    </>
  );
}
