import { motion } from 'framer-motion';

export default function InsightCard({ icon: Icon, title, children, delay, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}
