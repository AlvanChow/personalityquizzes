import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Share2, Briefcase, Users, Brain } from 'lucide-react';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import { getCakeResult } from '../data/cakeResults';
import ScoreBar from '../components/ScoreBar';
import { track } from '../utils/analytics';

const traitOrder = ['O', 'C', 'E', 'A', 'N'];

// Insights keyed by dominant trait that determines the cake result
const cakeInsights = {
  Extraversion: {
    careers: ['Sales & business development', 'Event management', 'Public relations', 'Teaching & training', 'Leadership & management', 'Performing arts'],
    friendship: 'You are likely the social engine of your friend group — initiating plans, making introductions, and keeping energy high. You thrive in friendships that are active and fun, and you have a gift for making people feel immediately at ease.',
    psyche: 'Your dominant Extraversion means you process the world through engagement. Solitude can feel like stagnation. Growth opportunity: learning to sit quietly with your own thoughts and developing relationships that go beyond surface-level energy.',
  },
  Conscientiousness: {
    careers: ['Project management', 'Finance & accounting', 'Law', 'Medicine & surgery', 'Engineering', 'Operations & logistics'],
    friendship: 'You are the friend who follows through — shows up, remembers plans, and can be counted on without question. Others find your reliability deeply comforting. Growth edge: learning to let go of expectations and enjoy the spontaneous moments.',
    psyche: 'Your dominant Conscientiousness means you feel most at ease when things are ordered and moving toward a goal. Watch for perfectionism, which can prevent you from enjoying work or relationships that don\'t meet your internal standards.',
  },
  Openness: {
    careers: ['Creative arts & design', 'Research & academia', 'Philosophy & writing', 'Architecture', 'Innovation & strategy', 'Culinary arts'],
    friendship: 'You are the friend who introduces people to new ideas, places, and experiences. You bond through curiosity and love friendships that feel expansive. Growth edge: making sure you also show up for the unglamorous, ordinary moments.',
    psyche: 'Your dominant Openness means you are energised by novelty and depth. Routine can feel like a slow death. The psychological challenge is channelling this restlessness productively, rather than perpetually seeking the next interesting thing.',
  },
  Agreeableness: {
    careers: ['Social work & counseling', 'Nursing & healthcare', 'Human resources', 'Education', 'Non-profit & advocacy', 'Diplomacy'],
    friendship: 'You are the most considerate, warm-hearted friend imaginable — the one people turn to in crisis. Your gift is making others feel genuinely cared for. Growth edge: learning to advocate for your own needs and to receive as naturally as you give.',
    psyche: 'Your dominant Agreeableness means you are wired for harmony. The risk is self-erasure — saying yes when you mean no, or suppressing your own needs to keep others comfortable. Growth comes from discovering that honesty and warmth can coexist.',
  },
  Neuroticism: {
    careers: ['Creative writing & art', 'Therapy & counseling', 'Advocacy & social justice', 'Music & performance', 'Research into human experience', 'Healthcare'],
    friendship: 'You are a deeply loyal, empathetic friend with an extraordinary ability to truly understand what others are going through. Your emotional depth creates profound connection. Growth edge: ensuring your own emotional needs are tended to, not just others\'.',
    psyche: 'Your dominant emotional sensitivity is not a flaw — it is the source of your creativity, empathy, and depth. The work is learning to be with intensity rather than fight it, and developing a stable centre that doesn\'t get swept away in every emotional tide.',
  },
  Balance: {
    careers: ['Varies widely — your balanced profile means you can adapt to many environments', 'Management & coordination', 'Consulting', 'Teaching', 'Healthcare administration'],
    friendship: 'Your balanced profile makes you an exceptionally versatile friend — you can meet people where they are. You don\'t overwhelm anyone with any single dominant trait, which makes you steady, adaptable, and genuinely easy to be around.',
    psyche: 'Your psychological profile doesn\'t have a single dominant driver — which means you operate from a place of equilibrium. The opportunity here is to develop depth in specific areas by making deliberate choices, rather than letting your natural adaptability become avoidance of commitment.',
  },
};

export default function CakeResult() {
  const navigate = useNavigate();
  const { scores, hasCompleted } = useBigFive();
  const { user } = useAuth();

  // Read the result that was captured at quiz-completion time so re-taking other
  // quizzes (which may shift Big Five scores) cannot alter the displayed cake.
  const [storedData] = useState(() => {
    try {
      const raw = localStorage.getItem('personalens_cake');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!hasCompleted) navigate('/assessment');
  }, [hasCompleted, navigate]);

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current || !hasCompleted) return;
    viewedRef.current = true;
    track('quiz_result_viewed', { quiz: 'cake' }, user?.id ?? null);
  }, [hasCompleted, user?.id]);

  const [shareError, setShareError] = useState(null);

  if (!hasCompleted) return null;

  // Fall back to re-computing from current scores only when no stored result exists.
  const result = storedData?.result ?? getCakeResult(scores);
  const insights = cakeInsights[result.trait];

  async function handleShare() {
    const text = `I got "${result.name}" on My Personality Quizzes! My dominant trait: ${result.trait}. Find out what cake you are!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Personality Quizzes Result', text });
      } else {
        await navigator.clipboard.writeText(text);
      }
    } catch (err) {
      if (err?.name === 'AbortError') return;
      console.error('Share failed:', err);
      setShareError('Could not share. Please try copying manually.');
    }
  }

  return (
    <div className="min-h-screen bg-cream-50 px-6 py-8">
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Back to Dashboard"
          className="flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={`bg-gradient-to-br ${result.color} rounded-3xl p-8 md:p-10 shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/60 mb-8`}
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="text-6xl md:text-7xl mb-4"
            >
              {result.emoji}
            </motion.div>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
              You are...
            </p>
            <h1 className={`text-3xl md:text-4xl font-extrabold ${result.accent}`}>
              {result.name}
            </h1>
          </div>

          <p className="text-gray-700 leading-relaxed text-center text-base md:text-lg">
            {result.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-8"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Your Updated Profile
          </h3>
          {traitOrder.map((trait, i) => (
            <ScoreBar key={trait} trait={trait} value={scores[trait]} delay={i * 0.08} />
          ))}
        </motion.div>

        {insights && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-sky-100 text-sky-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Career & Work</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.careers.map((c) => (
                  <span key={c} className="text-xs font-semibold bg-sky-50 text-sky-600 px-3 py-1 rounded-full border border-sky-100">{c}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-100 text-rose-500">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Friendships & Relationships</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{insights.friendship}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-3xl p-6 shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-violet-100 text-violet-600">
                  <Brain className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Psychological Insights</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{insights.psyche}</p>
            </motion.div>
          </>
        )}

        <div className="flex gap-3">
          <motion.button
            onClick={() => { track('quiz_retaken', { quiz: 'cake' }, user?.id ?? null); navigate('/quiz/cake'); }}
            aria-label="Retake the Cake quiz"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </motion.button>
          <motion.button
            onClick={() => navigate('/dashboard')}
            aria-label="Go to Dashboard"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
          >
            Dashboard
          </motion.button>
          <motion.button
            onClick={handleShare}
            aria-label="Share your cake quiz result"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold shadow-[0_4px_16px_rgba(26,127,212,0.3)] flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
        </div>
        {shareError && (
          <p role="alert" className="mt-3 text-sm text-red-600 text-center font-medium">
            {shareError}
          </p>
        )}
      </div>
    </div>
  );
}
