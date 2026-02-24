import { useEffect, useCallback, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { cakeQuestions } from '../data/cakeQuestions';
import { getCakeResult, cakeResultNameToKey } from '../data/cakeResults';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { optionToAdjustment } from '../utils/scoring';
import { track } from '../utils/analytics';

export default function CakeQuiz() {
  const navigate = useNavigate();
  const { scores, hasCompleted, updateScores } = useBigFive();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    if (!hasCompleted) navigate('/');
  }, [hasCompleted, navigate]);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleComplete = useCallback(async (answers) => {
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
    const resultKey = cakeResultNameToKey[result.name] ?? 'chocolate';

    // Persist result (with resultKey) so CakeResult can display it without recomputing
    // from live scores, and so the guest-sync logic in BigFiveContext can upload it
    // after login without needing to re-derive the key.
    localStorage.setItem('personalens_cake', JSON.stringify({ result, resultKey }));

    if (user) {
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

    // Replace the quiz in browser history so the back button skips it.
    navigate('/quiz/cake/result', { replace: true });
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
      />
    </>
  );
}
