import { useCallback, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { houseQuestions } from '../data/houseQuestions';
import { getHouseResult } from '../data/houseResults';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';
import { allowQuizSave } from '../utils/rateLimiter';
import { usePageTitle } from '../hooks/usePageTitle';

export default function HouseQuiz() {
  usePageTitle('House Quiz — My Personality Quizzes');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const submittingRef = useRef(false);

  const handleComplete = useCallback(async (answers) => {
    // Guard against double submission
    if (submittingRef.current) return;
    submittingRef.current = true;

    // Each answer's value is a house letter — one point per pick.
    const scores = { g: 0, h: 0, r: 0, s: 0 };
    Object.values(answers).forEach(({ value }) => {
      if (value in scores) scores[value] += 1;
    });

    const result = getHouseResult(scores);

    // Store scores alongside result so HouseResult can render the house breakdown
    localStorage.setItem('personalens_house', JSON.stringify({ result, resultKey: result.key, scores }));

    if (user && supabase && allowQuizSave()) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'house',
          p_result: {
            resultKey: result.key,
            name: result.name,
            emoji: result.emoji,
            trait: result.tagline,
            quizName: 'Wizarding House',
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save house quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        submittingRef.current = false;
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'house', result_key: result.key, duration_ms }, user?.id ?? null);

    navigate('/quiz/house/result', { replace: true });
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
        questions={houseQuestions}
        onComplete={handleComplete}
        renderOptions={renderOptions}
        quizKey="house"
        userId={user?.id ?? null}
        exitPath="/"
        questionsPerPage={5}
      />
    </>
  );
}
