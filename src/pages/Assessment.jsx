import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useRef } from 'react';
import QuizShell from '../components/QuizShell';
import { baselineQuestions, likertOptions } from '../data/baselineQuestions';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import { computeBaselineScores } from '../utils/scoring';
import { track } from '../utils/analytics';

export default function Assessment() {
  const navigate = useNavigate();
  const { completeBaseline } = useBigFive();
  const { user } = useAuth();
  const startTimeRef = useRef(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  const handleComplete = useCallback((answers) => {
    const scores = computeBaselineScores(answers, baselineQuestions);
    completeBaseline(scores);
    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('baseline_completed', { duration_ms }, user?.id ?? null);
    navigate('/dashboard');
  }, [completeBaseline, navigate, user]);

  const renderOptions = useCallback((question, onAnswer, selectedValue) => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400 w-16 text-right shrink-0">Disagree</span>
        <div className="flex gap-2 flex-1 justify-center">
          {likertOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              className={`w-9 h-9 rounded-full text-sm font-bold transition-all duration-150
                ${selectedValue === opt.value
                  ? 'bg-sky-400 text-white scale-110 shadow-md'
                  : 'bg-gray-100 text-gray-400 hover:bg-sky-100 hover:text-sky-500'
                }`}
            >
              {opt.value}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 w-16 shrink-0">Agree</span>
      </div>
    );
  }, []);

  return (
    <QuizShell
      questions={baselineQuestions}
      onComplete={handleComplete}
      renderOptions={renderOptions}
      quizKey="baseline"
      userId={user?.id ?? null}
      questionsPerPage={10}
    />
  );
}
