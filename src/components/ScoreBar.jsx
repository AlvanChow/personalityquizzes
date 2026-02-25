import { motion } from 'framer-motion';

const traitMeta = {
  O: { label: 'Openness', color: 'bg-sky-500' },
  C: { label: 'Conscientiousness', color: 'bg-mint-500' },
  E: { label: 'Extraversion', color: 'bg-coral-500' },
  A: { label: 'Agreeableness', color: 'bg-rose-400' },
  N: { label: 'Neuroticism', color: 'bg-teal-500' },
};

export default function ScoreBar({ trait, value, delay = 0 }) {
  const meta = traitMeta[trait];

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm font-semibold text-gray-700">{meta.label}</span>
        <span className="text-sm font-bold text-gray-500">{value}</span>
      </div>
      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${meta.color}`}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
