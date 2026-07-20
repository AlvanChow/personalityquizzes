import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizShell from '../components/QuizShell';
import { getQuizMeta, storageKeyFor } from '../data/quizzes';
import { computeQuizResult, LIKERT_OPTIONS } from '../utils/quizEngine';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';
import { allowQuizSave } from '../utils/rateLimiter';

function Spinner() {
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-200 border-t-sky-400 rounded-full animate-spin" />
    </div>
  );
}

// Generic runner for every quiz in the catalog (src/data/quizzes).
// The quiz definition is lazy-loaded so each quiz costs nothing until opened.
export default function CatalogQuiz() {
  const { quizKey } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const meta = getQuizMeta(quizKey);

  const [quiz, setQuiz] = useState(null);
  const startTimeRef = useRef(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    startTimeRef.current = Date.now();
  }, []);

  useEffect(() => {
    if (!meta?.load) {
      navigate('/404', { replace: true });
      return;
    }
    let cancelled = false;
    meta.load().then((mod) => {
      if (!cancelled) setQuiz(mod.default);
    });
    return () => { cancelled = true; };
  }, [meta, navigate]);

  useEffect(() => {
    if (meta) document.title = `${meta.title} · My Personality Quizzes`;
    return () => { document.title = 'My Personality Quizzes'; };
  }, [meta]);

  const handleComplete = useCallback(async (answers) => {
    if (submittingRef.current || !quiz) return;
    submittingRef.current = true;

    const outcome = computeQuizResult(quiz, answers);
    const stored = {
      quizKey: quiz.key,
      resultKey: outcome.resultKey,
      result: outcome.result,
      scores: outcome.scores,
      overallPct: outcome.overallPct ?? null,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem(storageKeyFor(quiz.key), JSON.stringify(stored));

    // Best-effort profile sync — the localStorage copy is authoritative for
    // rendering, so a failed save should never block the result screen.
    if (user && supabase && allowQuizSave()) {
      try {
        const { error } = await supabase.rpc('upsert_quiz_result', {
          p_user_id: user.id,
          p_quiz_key: quiz.key,
          p_result: {
            resultKey: outcome.resultKey,
            name: outcome.result.name,
            emoji: outcome.result.emoji,
            tagline: outcome.result.tagline,
            quizName: meta.quizName,
          },
        });
        if (error) throw error;
      } catch (err) {
        console.error(`Failed to save ${quiz.key} quiz result:`, err);
      }
    }

    const duration_ms = startTimeRef.current ? Date.now() - startTimeRef.current : null;
    track('quiz_completed', { quiz: quiz.key, result_key: outcome.resultKey, duration_ms }, user?.id ?? null);

    navigate(`/quiz/${quiz.key}/result`, { replace: true });
  }, [quiz, meta, user, navigate]);

  const renderPickOptions = useCallback((question, onAnswer, selectedValue) => {
    return question.options.map((opt, index) => (
      <motion.button
        key={index}
        onClick={() => onAnswer(index)}
        whileTap={{ scale: 0.97 }}
        className={`w-full px-6 py-4 rounded-2xl text-left font-semibold transition-all duration-150 border-2
          ${selectedValue === index
            ? 'bg-coral-400 border-coral-400 text-white shadow-[0_2px_10px_rgba(255,138,92,0.35)]'
            : 'bg-white border-gray-200 text-gray-700 hover:border-coral-300 hover:bg-coral-50 shadow-sm'
          }`}
      >
        {opt.label}
      </motion.button>
    ));
  }, []);

  const renderLikertOptions = useCallback((question, onAnswer, selectedValue) => {
    return LIKERT_OPTIONS.map((opt) => (
      <motion.button
        key={opt.value}
        onClick={() => onAnswer(opt.value)}
        whileTap={{ scale: 0.97 }}
        className={`w-full px-5 py-3 rounded-xl text-left text-sm font-semibold transition-all duration-150 border-2
          ${selectedValue === opt.value
            ? 'bg-sky-400 border-sky-400 text-white shadow-[0_2px_10px_rgba(59,154,229,0.35)]'
            : 'bg-white border-gray-200 text-gray-700 hover:border-sky-300 hover:bg-sky-50 shadow-sm'
          }`}
      >
        {opt.label}
      </motion.button>
    ));
  }, []);

  if (!meta) return null;
  if (!quiz) return <Spinner />;

  const isLikert = quiz.mode === 'likert';

  return (
    <QuizShell
      questions={quiz.questions}
      onComplete={handleComplete}
      renderOptions={isLikert ? renderLikertOptions : renderPickOptions}
      quizKey={quiz.key}
      userId={user?.id ?? null}
      exitPath="/dashboard"
      questionsPerPage={isLikert ? 6 : null}
    />
  );
}
