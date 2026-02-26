import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, List, ChevronRight } from 'lucide-react';
import { track } from '../utils/analytics';

const slideVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
};

function PagedQuestionsView({ questions, answers: initialAnswers, onComplete, renderOptions, questionsPerPage, exitPath }) {
  const navigate = useNavigate();
  const [localAnswers, setLocalAnswers] = useState({ ...initialAnswers });
  const [page, setPage] = useState(0);
  const [shakeId, setShakeId] = useState(null);
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const pageQuestions = questions.slice(page * questionsPerPage, (page + 1) * questionsPerPage);
  const scrollRef = useRef(null);
  const cardRefs = useRef({});
  const shakeTimerRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(shakeTimerRef.current);
  }, []);

  const handleAnswer = useCallback((question, value) => {
    setLocalAnswers(prev => ({
      ...prev,
      [question.id]: { trait: question.trait, value },
    }));
    setShakeId(prev => prev === question.id ? null : prev);
  }, []);

  const pageAnswered = pageQuestions.every(q => localAnswers[q.id] != null);
  const isLastPage = page === totalPages - 1;
  const totalAnswered = Object.keys(localAnswers).length;

  const handleNext = useCallback(() => {
    if (pageAnswered) {
      if (isLastPage) {
        onComplete(localAnswers);
      } else {
        setPage(prev => prev + 1);
        window.scrollTo(0, 0);
        if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
      }
      return;
    }

    // Find the first unanswered question on this page
    const firstUnanswered = pageQuestions.find(q => localAnswers[q.id] == null);
    if (firstUnanswered && cardRefs.current[firstUnanswered.id]) {
      cardRefs.current[firstUnanswered.id].scrollIntoView({ behavior: 'smooth', block: 'center' });
      setShakeId(firstUnanswered.id);
      clearTimeout(shakeTimerRef.current);
      shakeTimerRef.current = setTimeout(() => setShakeId(null), 800);
    }
  }, [pageAnswered, isLastPage, onComplete, localAnswers, pageQuestions]);

  const handleBack = useCallback(() => {
    if (page === 0) {
      navigate(exitPath);
    } else {
      setPage(prev => prev - 1);
      window.scrollTo(0, 0);
      if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
    }
  }, [page, navigate, exitPath]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <div className="flex items-center justify-between px-6 pt-6 pb-3 bg-cream-50 sticky top-0 z-10 border-b border-gray-200">
        <button
          onClick={handleBack}
          aria-label={page === 0 ? 'Exit quiz' : 'Go to previous page'}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {page === 0 ? 'Exit' : 'Back'}
        </button>
        <span className="text-sm font-semibold text-gray-500">
          Page {page + 1} of {totalPages}
        </span>
        <button
          onClick={() => navigate(exitPath)}
          aria-label="Exit quiz"
          className="text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-auto pb-28">
        <div className="max-w-2xl mx-auto px-4 pt-4">
          <div className="space-y-5">
            {pageQuestions.map((q, idx) => (
              <div
                key={q.id}
                ref={el => { cardRefs.current[q.id] = el; }}
                className={`bg-white rounded-lg p-5 shadow-sm border-2 transition-colors duration-300
                  ${shakeId === q.id ? 'border-red-400 animate-[shake_0.4s_ease-in-out]' : 'border-gray-200'}`}
              >
                <p className="text-sm font-semibold text-gray-700 mb-3 leading-snug">
                  <span className={`font-bold mr-1.5 transition-colors duration-300 ${shakeId === q.id ? 'text-red-400' : 'text-sky-400'}`}>
                    {page * questionsPerPage + idx + 1}.
                  </span>
                  {q.text}
                </p>
                <div className="flex flex-col gap-2">
                  {renderOptions(q, (value) => handleAnswer(q, value), localAnswers[q.id]?.value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar with progress and next/submit button */}
      <div className="fixed bottom-0 inset-x-0 bg-cream-50 border-t border-gray-200 px-6 py-4 z-20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-sky-500">
              {totalAnswered} of {questions.length} answered
            </span>
            <span className="text-sm font-medium text-gray-400">
              {Math.round((totalAnswered / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden mb-3">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(totalAnswered / questions.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <button
            onClick={handleNext}
            className={`w-full py-3 rounded-lg text-base font-bold transition-all flex items-center justify-center gap-2
              ${pageAnswered
                ? 'bg-sky-500 hover:bg-sky-600 text-white shadow-sm'
                : 'bg-sky-200 text-white hover:bg-sky-300'
              }`}
          >
            {isLastPage ? 'Submit All Answers' : 'Next'}
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function AllQuestionsView({ questions, answers, onAnswerAll, renderOptions }) {
  const [localAnswers, setLocalAnswers] = useState({ ...answers });

  const handleAnswer = useCallback((question, value) => {
    setLocalAnswers(prev => ({
      ...prev,
      [question.id]: { trait: question.trait, value },
    }));
  }, []);

  const answered = Object.keys(localAnswers).length;
  const total = questions.length;
  const allAnswered = answered >= total;

  return (
    <div className="flex-1 overflow-auto pb-28">
      <div className="max-w-2xl mx-auto px-4 pt-4">
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-500">
            {answered} / {total} answered
          </p>
          {allAnswered && (
            <button
              onClick={() => onAnswerAll(localAnswers)}
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-5 py-2 rounded-lg text-sm transition-all"
            >
              Submit All
            </button>
          )}
        </div>

        <div className="space-y-5">
          {questions.map((q, idx) => (
            <div key={q.id} className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
              <p className="text-sm font-semibold text-gray-700 mb-3 leading-snug">
                <span className="text-sky-400 font-bold mr-1.5">{idx + 1}.</span>
                {q.text}
              </p>
              <div className="flex flex-col gap-2">
                {renderOptions(q, (value) => handleAnswer(q, value), localAnswers[q.id]?.value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {allAnswered && (
        <div className="fixed bottom-6 inset-x-0 flex justify-center px-6 z-20">
          <button
            onClick={() => onAnswerAll(localAnswers)}
            className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-8 py-4 rounded-lg text-base transition-all shadow-md flex items-center gap-2"
          >
            Submit All Answers
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function QuizShell({ questions, onComplete, renderOptions, quizKey, userId = null, exitPath = '/', allowViewAll = false, questionsPerPage = null }) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(1);
  const [viewAll, setViewAll] = useState(false);

  // Fire quiz_started once on mount. startedRef guards against React
  // StrictMode's double-invocation of effects in development.
  const startedRef = useRef(false);
  useEffect(() => {
    if (!quizKey || startedRef.current) return;
    startedRef.current = true;
    track('quiz_started', { quiz: quizKey }, userId);
  }, [quizKey, userId]);

  const question = questions[currentIndex];

  const handleAnswer = useCallback((value) => {
    if (isAnimating) return;

    const newAnswers = { ...answers, [question.id]: { trait: question.trait, value } };
    setAnswers(newAnswers);
    setIsAnimating(true);
    setDirection(1);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  }, [isAnimating, answers, question, currentIndex, questions.length, onComplete]);

  const handleBack = useCallback(() => {
    if (isAnimating) return;
    if (currentIndex === 0) {
      navigate(exitPath);
      return;
    }
    setDirection(-1);
    setIsAnimating(true);
    setCurrentIndex(prev => prev - 1);
  }, [isAnimating, currentIndex, navigate, exitPath]);

  if (questionsPerPage) {
    return (
      <PagedQuestionsView
        questions={questions}
        answers={answers}
        onComplete={onComplete}
        renderOptions={renderOptions}
        questionsPerPage={questionsPerPage}
        exitPath={exitPath}
      />
    );
  }

  if (viewAll && allowViewAll) {
    return (
      <div className="min-h-screen flex flex-col bg-cream-50">
        <div className="flex items-center justify-between px-6 pt-6 pb-3 bg-cream-50 sticky top-0 z-10 border-b border-gray-200">
          <button
            onClick={() => setViewAll(false)}
            aria-label="Back to one-at-a-time view"
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            One at a time
          </button>
          <button
            onClick={() => navigate(exitPath)}
            aria-label="Exit quiz"
            className="text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <AllQuestionsView
          questions={questions}
          answers={answers}
          onAnswerAll={onComplete}
          renderOptions={renderOptions}
          quizKey={quizKey}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      {/* Top bar with back button, view-all toggle, and exit */}
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <button
          onClick={handleBack}
          aria-label={currentIndex === 0 ? 'Exit quiz' : 'Go to previous question'}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {currentIndex === 0 ? 'Exit' : 'Back'}
        </button>
        <div className="flex items-center gap-3">
          {allowViewAll && (
            <button
              onClick={() => setViewAll(true)}
              aria-label="View all questions at once"
              className="flex items-center gap-1.5 text-sm font-semibold text-sky-400 hover:text-sky-500 transition-colors"
            >
              <List className="w-4 h-4" />
              View all
            </button>
          )}
          <button
            onClick={() => navigate(exitPath)}
            aria-label="Exit quiz"
            className="text-gray-300 hover:text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={question.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.18, ease: 'easeInOut' }}
              onAnimationComplete={(definition) => {
                if (definition === 'center') setIsAnimating(false);
              }}
              className="w-full"
            >
              <h2 className="text-lg font-semibold text-gray-700 text-center mb-8 leading-snug">
                {question.text}
              </h2>

              <div className="flex flex-col gap-3">
                {renderOptions(question, handleAnswer, answers[question.id]?.value)}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full px-6 pb-6">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-sky-500">
              {currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-400">
              {Math.round(((currentIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
