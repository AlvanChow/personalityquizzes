import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, RotateCcw, Share2, Briefcase, Users, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';

// MAX raw score per competency = 2 questions × 4 points = 8
const MAX_COMPETENCY_SCORE = 8;

const competencyMeta = {
  AO:  { label: 'Action Oriented',     color: 'bg-amber-400' },
  PS:  { label: 'Problem Solving',     color: 'bg-sky-400' },
  IN:  { label: 'Innovation',          color: 'bg-rose-400' },
  TM:  { label: 'Teamwork',            color: 'bg-pink-400' },
  AD:  { label: 'Attention to Detail', color: 'bg-teal-400' },
  INF: { label: 'Influence',           color: 'bg-stone-400' },
};

const competencyOrder = ['AO', 'PS', 'IN', 'TM', 'AD', 'INF'];

function CompetencyBar({ competencyKey, score, delay, isTop }) {
  const meta = competencyMeta[competencyKey];
  const pct = Math.round(((score ?? 0) / MAX_COMPETENCY_SCORE) * 100);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className={`text-sm font-semibold ${isTop ? 'text-gray-800' : 'text-gray-500'}`}>
          {meta.label}
          {isTop && (
            <span className="ml-2 text-xs font-bold text-amber-500 uppercase tracking-wide">Top</span>
          )}
        </span>
        <span className={`text-sm font-bold ${isTop ? 'text-gray-700' : 'text-gray-400'}`}>{pct}%</span>
      </div>
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isTop ? meta.color : 'bg-gray-200'}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

const cakeInsights = {
  AO: {
    workStyle: 'You operate with a strong bias for action — your instinct is to start moving and course-correct along the way. You measure a good day in deliverables completed, not meetings attended. When energy dips in a team, you are the one who picks up the pace. The risk is occasionally outrunning the plan; your biggest growth comes from pausing long enough to ensure effort is pointed in the right direction before accelerating.',
    teamwork: 'You are a galvanizing presence in any team. Others find your drive contagious, and you often set the tempo for the whole group. You are at your collaborative best when the goal is clear and the path to it is yours to determine. You can frustrate colleagues who need more deliberation time — your growth edge is learning to hold space for that without losing momentum.',
    careers: ['Operations & logistics', 'Startup founding', 'Sales & business development', 'Project management', 'Field delivery & execution', 'Manufacturing & production'],
  },
  PS: {
    workStyle: 'You are the person who sees past the surface of a problem to its structural cause. Where others want to move forward, you want to understand first. Your thinking is systematic and recursive — you recheck assumptions, test edge cases, and do not accept the first answer that arrives. You are at your best when given real problems to chew on, and you deliver solutions that actually hold up under pressure.',
    teamwork: "You are the team's quiet insurance policy. You catch the flawed assumption before it becomes a failure. Because you work most intensely inside your own head, teammates may not always know how much you are contributing — your growth opportunity is making your reasoning visible so others can build on it, not just benefit from its outputs.",
    careers: ['Engineering & software development', 'Strategy & management consulting', 'Data analysis & data science', 'Research & product development', 'Finance & risk management', 'UX research'],
  },
  IN: {
    workStyle: 'You are energized by the blank page. Constraints feel like starting points, not limitations — you find creative ways around or through them. You are constantly asking whether the way something is done is actually the best way. You generate more ideas than you can execute, which means your biggest professional leverage is pairing with people who can help you filter, prioritize, and ship.',
    teamwork: 'You make teams more interesting. You introduce angles others have not considered and push against stale thinking in ways that produce genuinely better outcomes. Your collaborative growth area is staying long enough in a shared process to see your ideas through — innovation is most powerful when it does not abandon the team at the implementation stage.',
    careers: ['Product design & UX', 'Creative direction & brand', 'Innovation & R&D', 'Content strategy & copywriting', 'Architecture & industrial design', 'Entrepreneurship'],
  },
  TM: {
    workStyle: 'People are your medium. You are most productive in collaborative environments where you can move between building something and building the relationships that make it possible. You have an intuitive understanding of team dynamics — you know when morale needs a lift, when a conflict needs naming, and when to bring the right people together. You tend to hold teams together during difficult patches.',
    teamwork: 'You are the person who makes collaboration actually feel good. You remember who needs recognition, you create space for quieter voices, and you make sure no one is left behind when the team moves fast. Your growth edge is ensuring that your attentiveness to others does not come at the cost of your own output — sometimes your strongest contribution is what you personally deliver, not just what you enable.',
    careers: ['People & HR management', 'Community building & partnerships', 'Teaching & facilitation', 'Account management & client services', 'Non-profit program management', 'Healthcare coordination'],
  },
  AD: {
    workStyle: 'You are the standard-setter. You have an eye for inconsistency that most people lack, and you take quiet professional pride in the fact that work leaving your hands is work you can stand behind completely. You are the person who catches the error before it reaches the client — and the one who builds the systems that prevent errors from occurring at all. High-stakes, high-visibility work plays directly to your strengths.',
    teamwork: 'You raise the quality bar for everyone around you — not through pressure, but through example. People trust work that has been through your hands. Your collaborative challenge is recognizing when good enough actually is good enough, and when insisting on more thoroughness creates friction that slows the team down more than the uncorrected detail ever would.',
    careers: ['Audit & compliance', 'Quality assurance & testing', 'Legal & contract management', 'Finance & accounting', 'Medical & clinical research', 'Technical writing & editing'],
  },
  INF: {
    workStyle: 'You are comfortable in front of a room, in a negotiation, or wherever stakes are highest. Your confidence is grounded — you have usually done the work to back up your position, and you know how to read an audience and adjust in real time. You take calculated risks because you have thought through the downside. You are most effective when you have a compelling vision to sell and the latitude to sell it your way.',
    teamwork: 'You make teams more ambitious. When you believe in a direction, you create genuine momentum — people follow because you have made the destination sound worth reaching. Your growth edge is ensuring that influence flows both ways: that you are as skilled at listening to your team as you are at leading them, and that you leave room for others to shape the path.',
    careers: ['Leadership & general management', 'Business development & partnerships', 'Marketing & brand strategy', 'Venture capital & investing', 'Executive communications', 'Policy & advocacy'],
  },
};

export default function CakeResult() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [storedData] = useState(() => {
    try {
      const raw = localStorage.getItem('personalens_cake');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!storedData) navigate('/');
  }, [storedData, navigate]);

  const viewedRef = useRef(false);
  useEffect(() => {
    if (viewedRef.current || !storedData) return;
    viewedRef.current = true;
    track('quiz_result_viewed', { quiz: 'cake' }, user?.id ?? null);
  }, [storedData, user?.id]);

  const [shareError, setShareError] = useState(null);

  if (!storedData) return null;

  const result = storedData.result;
  const competencyScores = storedData.scores ?? {};
  const insights = cakeInsights[result.trait];

  async function handleShare() {
    const text = `I got "${result.name}" on My Personality Quizzes! My top workplace competency: ${result.competency}. ${result.tagline} Find out what cake you are!`;
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
    <div className="min-h-screen bg-gray-50 px-6 py-8">
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
          className={`bg-gradient-to-br ${result.color} rounded-xl p-8 md:p-10 shadow-md border border-white/60 mb-8`}
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
            <p className="mt-2 text-xs font-semibold text-gray-400 tracking-wide">{result.tagline}</p>
          </div>

          <p className="text-gray-700 leading-relaxed text-center text-base md:text-lg">
            {result.description}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-8"
        >
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
            Your Competency Breakdown
          </h3>
          {competencyOrder.map((key, i) => (
            <CompetencyBar
              key={key}
              competencyKey={key}
              score={competencyScores[key] ?? 0}
              delay={i * 0.08}
              isTop={key === result.trait}
            />
          ))}
        </motion.div>

        {insights && (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-sky-100 text-sky-600">
                  <Briefcase className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Career Paths</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {insights.careers.map((c) => (
                  <span key={c} className="text-xs font-semibold bg-sky-50 text-sky-600 px-3 py-1 rounded-full border border-sky-100">{c}</span>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-rose-100 text-rose-500">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Teamwork & Relationships</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{insights.teamwork}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-violet-100 text-violet-600">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Work Style</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{insights.workStyle}</p>
            </motion.div>
          </>
        )}

        <div className="flex gap-3">
          <motion.button
            onClick={() => { track('quiz_retaken', { quiz: 'cake' }, user?.id ?? null); navigate('/quiz/cake'); }}
            aria-label="Retake the Cake quiz"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Retake
          </motion.button>
          <motion.button
            onClick={() => navigate('/dashboard')}
            aria-label="Go to Dashboard"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
          >
            Dashboard
          </motion.button>
          <motion.button
            onClick={handleShare}
            aria-label="Share your cake quiz result"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 py-3.5 rounded-lg bg-gradient-to-r from-sky-400 to-sky-500 text-white font-bold shadow-md flex items-center justify-center gap-2"
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
