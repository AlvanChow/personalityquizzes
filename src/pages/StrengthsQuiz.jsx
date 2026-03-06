import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizShell from '../components/QuizShell';
import { strengthsQuestions } from '../data/strengthsQuestions';
import { computeStrengthsScores, normalizeStrengthsScores, getStrengthsResult } from '../utils/scoring';
import { getStrengthsTheme } from '../data/strengthsThemes';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';

export default function StrengthsQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleComplete = useCallback(async (answers) => {
    const rawScores = computeStrengthsScores(answers);
    const scores = normalizeStrengthsScores(rawScores);
    const result = getStrengthsResult(scores);

    localStorage.setItem('personalens_strengths', JSON.stringify({ scores, result }));

    if (user && supabase) {
      const top5 = result.top5;
      const themes = top5.map((t) => getStrengthsTheme(t));
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'strengths',
          p_result: {
            resultKey: top5.join(','),
            name: top5.join(' · '),
            emoji: themes[0]?.emoji ?? '💪',
            trait: themes.map((t) => t?.domain ?? '').join(' · '),
            quizName: 'CliftonStrengths',
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save CliftonStrengths result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'strengths', result_key: result.top5[0], duration_ms }, user?.id ?? null);

    navigate('/quiz/strengths/result', { replace: true });
  }, [navigate, user]);

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    const scaleLabels = { 1: 'Not me', 2: 'A little', 3: 'Mostly', 4: 'Totally' };
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-gray-400 w-14 text-right shrink-0">Not me</span>
          <div className="flex gap-2.5 flex-1 justify-center">
            {[1, 2, 3, 4].map((val) => (
              <button
                key={val}
                onClick={() => onAnswer(val)}
                className={`w-10 h-10 rounded-full text-sm font-bold transition-all duration-150
                  ${selectedValue === val
                    ? 'bg-violet-500 text-white scale-110 shadow-[0_2px_10px_rgba(139,92,246,0.35)]'
                    : 'bg-gray-100 text-gray-400 hover:bg-violet-100 hover:text-violet-500'
                  }`}
              >
                {val}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 w-14 shrink-0">Totally me</span>
        </div>
        {selectedValue != null && (
          <p className="text-xs text-violet-500 font-semibold">{scaleLabels[selectedValue]}</p>
        )}
      </div>
    );
  }, []);

  return (
    <>
      {saveError && (
        <p role="alert" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold px-5 py-3 rounded-2xl shadow-md z-50">
          {saveError}
        </p>
      )}
      <QuizShell
        questions={strengthsQuestions}
        onComplete={handleComplete}
        renderOptions={renderOptions}
        quizKey="strengths"
        userId={user?.id ?? null}
        questionsPerPage={5}
      />
    </>
  );
}
