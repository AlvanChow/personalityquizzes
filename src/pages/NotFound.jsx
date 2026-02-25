import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-6xl mb-4">🔍</p>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-6">This page doesn't exist. Let's get you back on track.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-coral-400 hover:bg-coral-500 text-white font-bold rounded-2xl transition-colors shadow-md"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
}
