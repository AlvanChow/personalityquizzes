import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { getNextQuiz, getCompletedCount, QUIZ_ORDER } from '../utils/quizProgression';

export default function NextQuizBanner({ currentQuizKey }) {
  const navigate = useNavigate();
  const next = getNextQuiz(currentQuizKey);
  const completed = getCompletedCount();
  const total = QUIZ_ORDER.length;

  if (!next) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mt-6 mb-4 p-5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 text-center"
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
        <p className="text-sm font-bold text-emerald-700">
          You&apos;ve completed all {total} quizzes!
        </p>
        <p className="text-xs text-emerald-600 mt-1 mb-3">
          Ready for more depth? Try an extended assessment.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <button
            onClick={() => navigate('/quiz/big5-deep')}
            className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 hover:border-emerald-300 transition-colors"
          >
            Big 5 Deep (50 items)
          </button>
          <button
            onClick={() => navigate('/quiz/mbti-deep')}
            className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 hover:border-emerald-300 transition-colors"
          >
            MBTI Deep (OEJTS)
          </button>
          <button
            onClick={() => navigate('/quiz/enneagram-deep')}
            className="text-xs font-bold text-emerald-700 bg-white px-3 py-1.5 rounded-lg border border-emerald-200 hover:border-emerald-300 transition-colors"
          >
            Enneagram Deep (36 items)
          </button>
        </div>
      </motion.div>
    );
  }

  const NextIcon = next.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="mt-6 mb-4"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-gray-400">
          Quiz journey: {completed}/{total} completed
        </span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
        <div
          className="h-full bg-gradient-to-r from-sky-300 to-sky-400 rounded-full transition-all"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>

      <button
        onClick={() => navigate(next.path)}
        className={`w-full p-5 rounded-xl bg-gradient-to-r ${next.gradient} text-white shadow-md hover:shadow-lg transition-all group`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <NextIcon className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <p className="text-[11px] font-extrabold text-white/70 uppercase tracking-wider">
                Continue your journey
              </p>
              <p className="text-lg font-extrabold mt-0.5">{next.label}</p>
              <p className="text-xs text-white/80 mt-0.5">{next.time}</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform" />
        </div>
      </button>
    </motion.div>
  );
}
