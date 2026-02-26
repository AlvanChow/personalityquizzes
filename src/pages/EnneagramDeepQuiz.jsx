import { useCallback, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizShell from '../components/QuizShell';
import { enneagramDeepQuestions } from '../data/enneagramDeepQuestions';
import { getEnneagramResult } from '../data/enneagramResults';
import { computeEnneagramDeepScores } from '../utils/scoring';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';

export default function EnneagramDeepQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saveError, setSaveError] = useState(null);
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleComplete = useCallback(async (answers) => {
    const scores = computeEnneagramDeepScores(answers, enneagramDeepQuestions);
    const result = getEnneagramResult(scores);

    localStorage.setItem('personalens_enneagram', JSON.stringify({ scores, result, isDeep: true }));

    if (user && supabase) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: 'enneagram_deep',
          p_result: {
            resultKey: result.typeNumber,
            name: result.name,
            emoji: result.emoji,
            trait: result.nickname,
            quizName: 'Enneagram Deep (36-item)',
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error('Failed to save Enneagram deep quiz result:', err);
        setSaveError('Could not save your result. Please check your connection and try again.');
        return;
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: 'enneagram_deep', result_key: result.typeNumber, duration_ms }, user?.id ?? null);

    navigate('/quiz/enneagram/result', { replace: true });
  }, [navigate, user]);

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    const scaleLabels = { 1: 'Very Inaccurate', 2: 'Inaccurate', 3: 'Neutral', 4: 'Accurate', 5: 'Very Accurate' };
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 w-full">
          <span className="text-xs text-gray-400 w-14 text-right shrink-0">Inaccurate</span>
          <div className="flex gap-2 flex-1 justify-center">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => onAnswer(val)}
                className={`w-9 h-9 rounded-full text-sm font-bold transition-all duration-150
                  ${selectedValue === val
                    ? 'bg-mint-400 text-white scale-110 shadow-[0_2px_10px_rgba(59,192,123,0.35)]'
                    : 'bg-gray-100 text-gray-400 hover:bg-mint-100 hover:text-mint-500'
                  }`}
              >
                {val}
              </button>
            ))}
          </div>
          <span className="text-xs text-gray-400 w-14 shrink-0">Accurate</span>
        </div>
        {selectedValue != null && (
          <p className="text-xs text-mint-500 font-semibold">{scaleLabels[selectedValue]}</p>
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
        questions={enneagramDeepQuestions}
        onComplete={handleComplete}
        renderOptions={renderOptions}
        quizKey="enneagram_deep"
        userId={user?.id ?? null}
        questionsPerPage={9}
      />
    </>
  );
}
