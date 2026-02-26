import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Cake, Brain, CircleDashed, Share2, Check, Layers, ArrowRight } from 'lucide-react';
import { useBigFive } from '../contexts/BigFiveContext';
import { useAuth } from '../contexts/AuthContext';
import UserMenu from '../components/UserMenu';
import QuizCard from '../components/QuizCard';
import NextQuizBanner from '../components/NextQuizBanner';
import { track } from '../utils/analytics';
import lifeAnalysis from '../data/lifeAnalysis';

const traitOrder = ['O', 'C', 'E', 'A', 'N'];

const traitData = {
  O: {
    label: 'Openness',
    color: 'bg-sky-500',
    trackColor: 'bg-sky-100',
    accent: 'text-sky-700',
    border: 'border-sky-200',
    bg: 'bg-sky-50',
    lowLabel: 'Conventional',
    highLabel: 'Imaginative',
    description:
      'Openness to Experience captures your curiosity, imagination, and appetite for novelty. It reflects how drawn you are to ideas, aesthetics, creativity, and unconventional ways of thinking — essentially, how wide you leave the door open to the unfamiliar.',
    ranges: [
      {
        max: 35,
        heading: 'Grounded & Conventional',
        text: 'You tend to prefer the familiar and the proven. You value tradition, practicality, and concrete thinking over abstract speculation. Change for its own sake holds little appeal — you trust methods that have stood the test of time. This groundedness makes you reliable, focused, and efficient. You don\'t get distracted chasing novelty and are often the stabilizing force in groups that are prone to over-complicating things.',
      },
      {
        max: 65,
        heading: 'Balanced Curiosity',
        text: 'You have a balanced relationship with novelty. You appreciate creativity and new ideas when they\'re relevant and useful, but you don\'t feel compelled to constantly seek the unconventional. You can engage deeply with complex ideas when the situation calls for it, and you\'re practical enough to know when tried-and-true is better. This balance makes you adaptable — capable of thinking creatively without losing sight of what actually works.',
      },
      {
        max: 100,
        heading: 'Highly Imaginative & Curious',
        text: 'You have an active, restless imagination and a deep love for novelty, complexity, and ideas. You\'re drawn to art, philosophy, science, culture, and experiences that most people overlook. Routine can feel suffocating — you need intellectual stimulation and variety to feel alive. You tend to question assumptions, think in abstractions, and find connections others miss. This makes you creative and visionary, though you may sometimes struggle to stay grounded in the practical.',
      },
    ],
  },
  C: {
    label: 'Conscientiousness',
    color: 'bg-mint-500',
    trackColor: 'bg-mint-100',
    accent: 'text-mint-700',
    border: 'border-mint-200',
    bg: 'bg-mint-50',
    lowLabel: 'Spontaneous',
    highLabel: 'Disciplined',
    description:
      'Conscientiousness reflects your capacity for self-regulation, planning, and follow-through. It captures how organized, dependable, and goal-directed you are — essentially, how well you translate intentions into sustained action over time.',
    ranges: [
      {
        max: 35,
        heading: 'Flexible & Spontaneous',
        text: 'You tend to be spontaneous and go with the flow, preferring flexibility over rigid structure. Plans can feel constraining, and you often trust your instincts in the moment over elaborate preparation. You\'re highly adaptable and can think on your feet in ways that more structured people can\'t. The challenge is that long-term goals requiring sustained effort can be harder to stick to — your energy tends to surge and fade with your interest rather than following a steady discipline.',
      },
      {
        max: 65,
        heading: 'Situationally Structured',
        text: 'You balance structure with spontaneity. You can be highly organized when a goal matters enough to you, but you don\'t impose rigid order on every corner of your life. You\'re reliably flexible — disciplined when it counts, easygoing when it doesn\'t. This makes you effective across a wide range of situations: you can follow a system when needed, and abandon it when a better approach presents itself.',
      },
      {
        max: 100,
        heading: 'Highly Disciplined & Driven',
        text: 'You are methodical, dependable, and relentlessly goal-oriented. You plan ahead, keep your commitments, and hold yourself to high standards. Disorder tends to bother you — you work best when things are organized and under control. Others see you as someone who follows through without being asked twice. The flip side is that this drive can shade into perfectionism or difficulty delegating, since no one else quite meets your internal bar.',
      },
    ],
  },
  E: {
    label: 'Extraversion',
    color: 'bg-coral-500',
    trackColor: 'bg-coral-100',
    accent: 'text-coral-700',
    border: 'border-coral-200',
    bg: 'bg-coral-50',
    lowLabel: 'Introverted',
    highLabel: 'Extraverted',
    description:
      'Extraversion reflects how much you draw energy from social stimulation versus inner reflection. It captures your sociability, assertiveness, enthusiasm, and general orientation toward the outer world — people, activity, and engagement — versus the inner world of thought and solitude.',
    ranges: [
      {
        max: 35,
        heading: 'Introverted & Reflective',
        text: 'You are introverted — you recharge in solitude and tend to find extended social interaction draining, even when you genuinely enjoy it. You prefer depth over breadth in relationships: a few close connections mean far more to you than a wide social network. You think carefully before speaking, work well independently, and often do your best thinking when you\'re alone. Noise, crowds, and constant social obligation can leave you feeling depleted. Your inner world is rich and well-developed.',
      },
      {
        max: 65,
        heading: 'Ambiverted',
        text: 'You are ambiverted — you move fluidly between social engagement and solitude without strong resistance to either. You can enjoy a lively social event and then genuinely want a quiet evening to yourself the next day. You read the room well and adjust your energy accordingly, which makes you versatile in both team-based and independent work. You\'re neither a lone wolf nor a social butterfly, but genuinely comfortable in both modes.',
      },
      {
        max: 100,
        heading: 'Highly Extraverted & Energetic',
        text: 'You thrive on connection, stimulation, and action. Social interaction doesn\'t drain you — it charges you up. You\'re enthusiastic, expressive, and assertive, and you naturally move toward the center of things. Large groups, new people, and busy environments suit you well. You often think out loud, prefer collaborative work to solitary tasks, and find long stretches alone to be oddly unsettling. Your energy is infectious, and people are naturally drawn to your presence.',
      },
    ],
  },
  A: {
    label: 'Agreeableness',
    color: 'bg-rose-400',
    trackColor: 'bg-rose-100',
    accent: 'text-rose-700',
    border: 'border-rose-200',
    bg: 'bg-rose-50',
    lowLabel: 'Independent',
    highLabel: 'Cooperative',
    description:
      'Agreeableness reflects your orientation toward cooperation, trust, and concern for others. It captures how empathetic, generous, and accommodating you are in relationships — and how naturally you prioritize harmony and others\' well-being alongside your own.',
    ranges: [
      {
        max: 35,
        heading: 'Independent & Direct',
        text: 'You tend to prioritize your own interests, goals, and perspective without automatically deferring to others. You\'re skeptical by nature, direct in your communication, and willing to challenge people or say difficult truths that more agreeable types would soften or avoid. You value personal autonomy and aren\'t easily swayed by social pressure. This makes you a strong, self-directed individual — but it can also mean relationships require more deliberate effort, since harmony isn\'t your default operating mode.',
      },
      {
        max: 65,
        heading: 'Pragmatically Cooperative',
        text: 'You balance assertiveness with cooperation. You care about others and value good relationships, but you also know when to put your own needs first. You can be both competitive and collaborative depending on the stakes, and you navigate social dynamics with clear-eyed pragmatism rather than pure accommodation. You\'re neither a pushover nor abrasive — you engage with others on genuinely mutual terms.',
      },
      {
        max: 100,
        heading: 'Highly Warm & Empathetic',
        text: 'You are genuinely warm, empathetic, and deeply attuned to the emotional needs of those around you. You prioritize harmony and go out of your way to make others feel seen, supported, and valued. You\'re trusting, generous, and slow to assume the worst in people. Others find you easy to open up to and often lean on you as a source of comfort. The challenge is that your natural tendency to accommodate can make it hard to set firm boundaries or advocate for your own needs when they conflict with someone else\'s.',
      },
    ],
  },
  N: {
    label: 'Neuroticism',
    color: 'bg-teal-500',
    trackColor: 'bg-teal-100',
    accent: 'text-teal-700',
    border: 'border-teal-200',
    bg: 'bg-teal-50',
    lowLabel: 'Stable',
    highLabel: 'Sensitive',
    description:
      'Neuroticism reflects your sensitivity to negative emotional experiences — how frequently and intensely you experience stress, anxiety, sadness, or irritability in response to life\'s challenges. It\'s not a flaw, but a measure of your emotional thermostat: how easily it gets triggered, and how long it takes to return to baseline.',
    ranges: [
      {
        max: 35,
        heading: 'Emotionally Stable & Resilient',
        text: 'You are emotionally stable and difficult to rattle. You bounce back quickly from setbacks, tend to stay calm under pressure, and rarely get swept up in anxiety or rumination. Stressful situations that knock other people off-balance rarely have the same effect on you. Others often see you as a steadying presence — the person who keeps a level head when things go wrong. You may sometimes underestimate how much emotional turbulence others are experiencing, since your baseline is relatively calm.',
      },
      {
        max: 65,
        heading: 'Moderately Emotionally Reactive',
        text: 'You experience a normal, human range of emotional ups and downs. Stressful or challenging situations can trigger anxiety or frustration, but you generally recover and return to equilibrium. You\'re neither emotionally flat nor intensely reactive — you feel things, process them, and move on. This balance means you can empathize with people who struggle emotionally without being consumed by your own feelings, which is a genuinely useful place to operate from.',
      },
      {
        max: 100,
        heading: 'Emotionally Sensitive & Deep',
        text: 'You experience emotions with great depth and intensity. Stress, worry, and negative emotion tend to hit you harder than they hit most people, and they can linger. You may find yourself frequently replaying difficult interactions, anticipating problems, or feeling overwhelmed by life\'s demands. This emotional sensitivity is not a weakness — it\'s paired with a depth of feeling that often translates into exceptional empathy, artistic sensitivity, and a richness of inner experience that others lack. The work is learning to be with the intensity rather than fight it.',
      },
    ],
  },
};

const quizzes = [
  {
    quizKey: 'cake',
    title: 'What Cake Are You?',
    description: 'Discover which delicious cake matches your personality profile.',
    icon: Cake,
    to: '/quiz/cake',
    locked: false,
  },
  {
    quizKey: 'mbti',
    title: 'MBTI (16 Types)',
    description: 'Find your Myers-Briggs type and understand your cognitive style.',
    icon: Brain,
    to: '/quiz/mbti',
    locked: false,
  },
  {
    quizKey: 'enneagram',
    title: 'Enneagram',
    description: 'Discover which of the 9 types drives your deepest motivations.',
    icon: CircleDashed,
    to: '/quiz/enneagram',
    locked: false,
  },
];

function getRange(data, score) {
  return data.ranges.find((r) => score <= r.max) ?? data.ranges[data.ranges.length - 1];
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { scores, hasCompleted, loading } = useBigFive();
  const { user } = useAuth();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!loading && !hasCompleted) navigate('/');
  }, [loading, hasCompleted, navigate]);

  async function handleShare() {
    const lines = traitOrder
      .map((t) => `${traitData[t].label} ${scores[t]}`)
      .join('\n');
    const text = `My Big Five Personality:\n\n${lines}\n\nTake yours at mypersonalityquizzes.com`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        if (navigator.share) {
          await navigator.share({ title: 'My Big Five Personality', text });
        }
      } catch (err) {
        if (err?.name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center">
      <div className="w-7 h-7 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
    </div>
  );
  if (!hasCompleted) return null;

  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate('/')} className="text-lg font-extrabold tracking-tight text-gray-900">
            My Personality <span className="text-coral-500">Quizzes</span>
          </button>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/how-it-works')}
              className="text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors hidden sm:block"
            >
              How It Works
            </button>
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="px-6 py-10 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="flex items-start justify-between gap-4 mb-1">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
              Your Personality Profile
            </h1>
            <motion.button
              onClick={handleShare}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-colors shrink-0 ${
                copied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-gray-900 text-white hover:bg-gray-800'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Share'}
            </motion.button>
          </div>
          <p className="text-gray-500 mb-8">
            Based on your baseline assessment. Take more quizzes to refine your scores.
          </p>

          <div className="flex flex-col gap-4 mb-12">
            {traitOrder.map((trait, i) => {
              const data = traitData[trait];
              const score = scores[trait];
              const range = getRange(data, score);
              return (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className={`rounded-xl border ${data.border} ${data.bg} p-5 shadow-sm`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-extrabold uppercase tracking-wider ${data.accent}`}>{data.label}</span>
                    <span className="text-sm font-bold text-gray-500">{score}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs text-gray-400 w-20 shrink-0">{data.lowLabel}</span>
                    <div className={`flex-1 h-2 ${data.trackColor} rounded-full overflow-hidden`}>
                      <motion.div
                        className={`h-full rounded-full ${data.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${score}%` }}
                        transition={{ duration: 0.6, delay: i * 0.06, ease: 'easeOut' }}
                      />
                    </div>
                    <span className="text-xs text-gray-400 w-20 shrink-0 text-right">{data.highLabel}</span>
                  </div>

                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {data.description}
                  </p>

                  <div className="border-t border-white/80 pt-3">
                    <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${data.accent}`}>
                      Your result — {range.heading}
                    </p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {range.text}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
            Life Analysis
          </h2>
          <p className="text-gray-500 mb-5">
            How your personality plays out across major areas of life.
          </p>

          <div className="flex flex-col gap-4 mb-12">
            {lifeAnalysis.map((category, ci) => {
              const Icon = category.icon;
              const analysis = category.getAnalysis(scores);
              return (
                <motion.div
                  key={category.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: ci * 0.05 }}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <h3 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">{category.label}</h3>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">
                    {analysis.summary}
                  </p>
                  {analysis.careers && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {analysis.careers.map((c) => (
                        <span
                          key={c}
                          className="text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded border border-gray-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  )}
                  <ul className="flex flex-col gap-2">
                    {analysis.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-600 leading-relaxed flex gap-2">
                        <span className="text-gray-400 shrink-0 mt-1">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <NextQuizBanner currentQuizKey="big5" />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
        >
          <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mb-1">
            Quiz Library
          </h2>
          <p className="text-gray-500 mb-5">
            Each quiz maps your personality into a fun new world.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <QuizCard
                key={quiz.title}
                {...quiz}
                onBeforeNavigate={() =>
                  track('quiz_card_clicked', { quiz: quiz.quizKey, from: 'dashboard' }, user?.id ?? null)
                }
              />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35 }}
          className="mt-10"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
              <Layers className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-extrabold text-gray-900">Go Deeper</h2>
          </div>
          <p className="text-gray-500 mb-5">
            Extended assessments for a more nuanced personality profile.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { label: 'Big 5 Deep (IPIP-50)', desc: '50 items for a more precise OCEAN profile', path: '/quiz/big5-deep', accent: 'text-teal-600' },
              { label: 'MBTI Deep (OEJTS)', desc: 'Scientific forced-choice for sharper typing', path: '/quiz/mbti-deep', accent: 'text-coral-600' },
              { label: 'Enneagram Deep (36-item)', desc: 'Core fears & desires weighted inventory', path: '/quiz/enneagram-deep', accent: 'text-violet-600' },
            ].map((dq) => (
              <button
                key={dq.path}
                onClick={() => { track('quiz_card_clicked', { quiz: dq.path, from: 'dashboard' }, user?.id ?? null); navigate(dq.path); }}
                className="text-left p-4 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
              >
                <p className="text-sm font-bold text-gray-800 mb-1">{dq.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-2">{dq.desc}</p>
                <span className={`text-xs font-bold ${dq.accent} flex items-center gap-1`}>
                  Take Quiz <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
