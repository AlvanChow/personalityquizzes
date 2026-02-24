import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slideVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

export default function QuizShell({ questions, onComplete, renderOptions }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);

  const question = questions[currentIndex];

  const handleAnswer = useCallback((value) => {
    if (isAnimating) return;

    const newAnswers = { ...answers, [question.id]: { trait: question.trait, value } };
    setAnswers(newAnswers);
    setIsAnimating(true);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete(newAnswers);
    }
  }, [isAnimating, answers, question, currentIndex, questions.length, onComplete]);

  return (
    <div className="min-h-screen flex flex-col bg-cream-50">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={question.id}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.12, ease: 'easeInOut' }}
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
