import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { getPendingCompare, clearPendingCompare } from '../utils/compatibility';

/**
 * Shown on quiz result pages when the visitor arrived from a friend's shared
 * result (/s/:shareId) and just completed the quiz. One tap takes them back to
 * the share page, which now renders the full compatibility breakdown.
 */
export default function CompareBanner({ quizType }) {
  const navigate = useNavigate();
  const [pending] = useState(() => getPendingCompare(quizType));

  if (!pending) return null;

  const friendLabel = pending.friendName ? `you and ${pending.friendName}` : 'you two';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="mb-5"
    >
      <button
        onClick={() => {
          clearPendingCompare();
          navigate(`/s/${pending.shareId}`);
        }}
        className="w-full p-5 rounded-xl bg-gradient-to-r from-fuchsia-500 to-rose-500 text-white shadow-md hover:shadow-lg transition-shadow group text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[11px] font-extrabold text-white/70 uppercase tracking-wider">
                Your friend is waiting
              </p>
              <p className="text-lg font-extrabold mt-0.5">See how compatible {friendLabel} are</p>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white/80 group-hover:translate-x-1 transition-transform shrink-0" />
        </div>
      </button>
    </motion.div>
  );
}
