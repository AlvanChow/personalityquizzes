import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Copy, Pencil, Plus, X } from 'lucide-react';
import NextQuizBanner from '../components/NextQuizBanner';
import AuthNudgeBanner from '../components/AuthNudgeBanner';
import { useAuth } from '../contexts/AuthContext';
import { track } from '../utils/analytics';
import { safeLocalStorageRead, sanitizeString } from '../utils/security';

const STORAGE_KEY = 'personalens_flower_petal';
const MAX_ITEMS_PER_PETAL = 8;

// Original prompts inspired by the classic "Flower Exercise" self-inventory
// popularized by Richard N. Bolles in "What Color Is Your Parachute?".
const PETALS = [
  {
    key: 'knowledge',
    title: 'What You Know & Love',
    emoji: '📚',
    prompt: 'Which subjects, fields, and interests light you up? Think of topics you read about voluntarily, talk about at dinner, or lose track of time exploring.',
    color: 'bg-sky-50 border-sky-200',
    chip: 'bg-sky-100 text-sky-700 border-sky-200',
    suggestions: ['Technology', 'Psychology', 'Design', 'Music', 'Cooking', 'Sports & fitness', 'Science', 'Business & finance', 'Travel & cultures', 'Writing & stories', 'Nature & animals', 'History', 'Gaming', 'Health & medicine'],
  },
  {
    key: 'people',
    title: 'People You Work Best With',
    emoji: '👥',
    prompt: 'Describe the kinds of people who bring out your best work — the colleagues, clients, or communities you want around you.',
    color: 'bg-rose-50 border-rose-200',
    chip: 'bg-rose-100 text-rose-700 border-rose-200',
    suggestions: ['Creative types', 'Analytical minds', 'Builders & makers', 'Mentors & teachers', 'Kids & students', 'Entrepreneurs', 'Quiet, focused teams', 'Big collaborative groups', 'People who need help', 'Experts at their craft', 'Optimists', 'Straight shooters'],
  },
  {
    key: 'skills',
    title: 'What You Can Do',
    emoji: '🛠️',
    prompt: 'Your transferable skills — the verbs you\'re best at, anywhere you go. What do people ask for your help with?',
    color: 'bg-amber-50 border-amber-200',
    chip: 'bg-amber-100 text-amber-700 border-amber-200',
    suggestions: ['Writing', 'Teaching & explaining', 'Building things', 'Analyzing & researching', 'Organizing & planning', 'Leading people', 'Listening & counseling', 'Designing', 'Selling & persuading', 'Coding', 'Solving hard problems', 'Negotiating', 'Performing & presenting', 'Caring for others'],
  },
  {
    key: 'conditions',
    title: 'Your Ideal Working Conditions',
    emoji: '🌤️',
    prompt: 'Under what conditions do you do your best work? Picture your best-ever working week — what made it work?',
    color: 'bg-emerald-50 border-emerald-200',
    chip: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    suggestions: ['Working remotely', 'A quiet space', 'Lots of variety', 'Clear structure', 'Autonomy & trust', 'Tight deadlines', 'No deadlines', 'Small close-knit team', 'Time outdoors', 'Flexible hours', 'Regular travel', 'A beautiful workspace'],
  },
  {
    key: 'compensation',
    title: 'Salary & Responsibility',
    emoji: '💰',
    prompt: 'Be honest about money and level: what do you need, what do you want, and how much responsibility genuinely suits you?',
    color: 'bg-violet-50 border-violet-200',
    chip: 'bg-violet-100 text-violet-700 border-violet-200',
    suggestions: ['Enough to live comfortably', 'High earning potential', 'Stability over upside', 'Ownership or equity', 'Leading a team', 'Individual contributor', 'Running my own thing', 'Room to grow slowly', 'Recognition for my work'],
  },
  {
    key: 'places',
    title: 'Where You\'d Love to Live',
    emoji: '📍',
    prompt: 'Geography matters more than we admit. Where would your ideal life actually happen?',
    color: 'bg-teal-50 border-teal-200',
    chip: 'bg-teal-100 text-teal-700 border-teal-200',
    suggestions: ['A big city', 'A small town', 'Near mountains or ocean', 'Near family', 'Living abroad', 'Warm all year', 'Four real seasons', 'A walkable neighborhood', 'Space and quiet', 'Somewhere international & diverse'],
  },
  {
    key: 'purpose',
    title: 'Your Purpose & What Matters',
    emoji: '🌟',
    prompt: 'The center of the flower: what do you want your work — and your life — to be in service of?',
    color: 'bg-pink-50 border-pink-200',
    chip: 'bg-pink-100 text-pink-700 border-pink-200',
    suggestions: ['Helping people directly', 'Creating beautiful things', 'Advancing knowledge', 'Building things that last', 'Fairness & justice', 'Family first', 'Freedom & independence', 'Community', 'Faith or spirituality', 'Leaving the world better'],
  },
];

function emptyPetals() {
  return Object.fromEntries(PETALS.map((p) => [p.key, []]));
}

function buildSummaryText(petals) {
  const lines = ['🌸 My Flower — a self-portrait in 7 petals', ''];
  for (const petal of PETALS) {
    const items = petals[petal.key] ?? [];
    if (!items.length) continue;
    lines.push(`${petal.emoji} ${petal.title}: ${items.join(', ')}`);
  }
  lines.push('', 'Map yours at mypersonalityquizzes.com');
  return lines.join('\n');
}

function PetalStep({ petal, items, onToggle, onAddCustom, onRemove }) {
  const [custom, setCustom] = useState('');

  function addCustom() {
    const value = sanitizeString(custom, 60).trim();
    if (!value) return;
    onAddCustom(value);
    setCustom('');
  }

  const atLimit = items.length >= MAX_ITEMS_PER_PETAL;

  return (
    <div>
      <div className="text-center mb-6">
        <span className="text-5xl">{petal.emoji}</span>
        <h2 className="text-2xl font-extrabold text-gray-900 mt-3 mb-2">{petal.title}</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-md mx-auto">{petal.prompt}</p>
      </div>

      {/* Selected items */}
      <div className={`rounded-xl border-2 border-dashed p-4 mb-5 min-h-[64px] ${petal.color}`}>
        {items.length === 0 ? (
          <p className="text-xs text-gray-400 font-medium text-center py-2">
            Pick from the ideas below or add your own — aim for 3 to {MAX_ITEMS_PER_PETAL}.
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <button
                key={item}
                onClick={() => onRemove(item)}
                className={`group flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full border ${petal.chip}`}
              >
                {item}
                <X className="w-3 h-3 opacity-50 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2 mb-5">
        {petal.suggestions.filter((s) => !items.includes(s)).map((s) => (
          <button
            key={s}
            onClick={() => !atLimit && onToggle(s)}
            disabled={atLimit}
            className="text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-3 py-1.5 rounded-full transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            + {s}
          </button>
        ))}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }}
          maxLength={60}
          disabled={atLimit}
          placeholder={atLimit ? `Petal is full (${MAX_ITEMS_PER_PETAL} max)` : 'Add your own…'}
          className="flex-1 px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-sky-300 focus:outline-none text-sm font-semibold text-gray-700 bg-white disabled:bg-gray-50"
        />
        <button
          onClick={addCustom}
          disabled={atLimit || !custom.trim()}
          aria-label="Add custom item"
          className="px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold disabled:opacity-40 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function FlowerSummary({ petals, onEditPetal, onRestart }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildSummaryText(petals));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable — the summary stays visible on screen.
    }
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="text-center mb-8"
      >
        <span className="text-6xl">🌸</span>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-2">Your Flower</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          One picture of who you are, from seven angles. The sweet spot — work worth
          chasing — lives where the most petals overlap.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {PETALS.map((petal, i) => (
          <motion.div
            key={petal.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className={`rounded-xl border p-4 ${petal.color} ${petal.key === 'purpose' ? 'sm:col-span-2' : ''}`}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-extrabold text-gray-600 uppercase tracking-wider">
                {petal.emoji} {petal.title}
              </p>
              <button
                onClick={() => onEditPetal(petal.key)}
                aria-label={`Edit ${petal.title}`}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
            {(petals[petal.key] ?? []).length ? (
              <div className="flex flex-wrap gap-1.5">
                {petals[petal.key].map((item) => (
                  <span key={item} className={`text-xs font-bold px-2.5 py-1 rounded-full border ${petal.chip}`}>
                    {item}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Left blank — tap the pencil to fill it in.</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-6">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">What to do with this</p>
        <ul className="text-sm text-gray-600 leading-relaxed space-y-1.5">
          <li>• Look for roles or projects that touch <strong>4+ petals</strong> at once — that overlap is your sweet spot.</li>
          <li>• Share it with someone who knows you well and ask what they&apos;d add.</li>
          <li>• Revisit in six months; the petals that changed are telling you something.</li>
        </ul>
      </div>

      <div className="flex gap-3 mb-6">
        <motion.button
          onClick={handleCopy}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className={`flex-1 py-3.5 rounded-lg font-bold shadow-md flex items-center justify-center gap-2 transition-colors ${
            copied ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-rose-400 to-pink-500 text-white'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy My Flower'}
        </motion.button>
        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 py-3.5 rounded-lg bg-white border-2 border-gray-100 text-gray-700 font-bold shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:border-gray-200 transition-colors"
        >
          Start Over
        </motion.button>
      </div>

      <NextQuizBanner currentQuizKey="flower_petal" />
      <AuthNudgeBanner quiz="flower_petal" />
    </div>
  );
}

export default function FlowerPetal() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [saved] = useState(() => safeLocalStorageRead(STORAGE_KEY, null));
  const [petals, setPetals] = useState(() => ({ ...emptyPetals(), ...(saved?.petals ?? {}) }));
  // -1 = intro, 0..6 = petal steps, 7 = summary
  const [step, setStep] = useState(() => (saved?.completedAt ? PETALS.length : -1));
  // Live completion timestamp — `saved` is frozen at mount, so relying on it
  // inside persist() would wipe completedAt when editing after finishing.
  const completedAtRef = useRef(saved?.completedAt ?? null);

  const startedRef = useRef(false);
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;
    if (!saved?.completedAt) track('quiz_started', { quiz: 'flower_petal' }, user?.id ?? null);
  }, [saved, user?.id]);

  useEffect(() => {
    document.title = 'The Flower Petal Exercise · My Personality Quizzes';
    return () => { document.title = 'My Personality Quizzes'; };
  }, []);

  function persist(nextPetals, completed) {
    if (completed) completedAtRef.current = new Date().toISOString();
    const payload = {
      petals: nextPetals,
      completedAt: completedAtRef.current,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Storage unavailable (quota/private mode) — keep the in-memory session going.
    }
  }

  function updatePetal(key, updater) {
    setPetals((prev) => {
      const next = { ...prev, [key]: updater(prev[key] ?? []) };
      persist(next, false);
      return next;
    });
  }

  function handleNext() {
    if (step === PETALS.length - 1) {
      persist(petals, true);
      track('quiz_completed', { quiz: 'flower_petal' }, user?.id ?? null);
      setStep(PETALS.length);
    } else {
      setStep((s) => s + 1);
    }
    window.scrollTo(0, 0);
  }

  function handleBack() {
    if (step <= 0) {
      setStep(-1);
    } else {
      setStep((s) => s - 1);
    }
    window.scrollTo(0, 0);
  }

  const isIntro = step === -1;
  const isSummary = step >= PETALS.length;
  const petal = !isIntro && !isSummary ? PETALS[step] : null;

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="flex items-center justify-between px-6 pt-6 pb-3">
        <button
          onClick={() => (isIntro || isSummary ? navigate('/dashboard') : handleBack())}
          aria-label={isIntro || isSummary ? 'Back to Dashboard' : 'Previous step'}
          className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {isIntro || isSummary ? 'Dashboard' : 'Back'}
        </button>
        {petal && (
          <span className="text-sm font-semibold text-gray-500">
            Petal {step + 1} of {PETALS.length}
          </span>
        )}
        <button
          onClick={() => navigate('/dashboard')}
          aria-label="Exit exercise"
          className="text-gray-300 hover:text-gray-500 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {petal && (
        <div className="px-6">
          <div className="max-w-lg mx-auto w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-rose-300 to-pink-400 rounded-full"
              animate={{ width: `${((step + 1) / PETALS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      <div className="px-6 py-8">
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {isIntro && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.3 }}
                className="text-center"
              >
                <span className="text-6xl">🌸</span>
                <h1 className="text-3xl font-extrabold text-gray-900 mt-4 mb-3">The Flower Petal Exercise</h1>
                <p className="text-sm text-gray-500 leading-relaxed mb-2 max-w-md mx-auto">
                  The most famous exercise in career coaching, inspired by Richard N. Bolles&apos;
                  classic <em>What Color Is Your Parachute?</em> — you are one person with
                  seven sides, and work that fits all seven is work you&apos;ll love.
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-8 max-w-md mx-auto">
                  Fill in one petal at a time. There are no scores here — just you, on paper,
                  for maybe the first time.
                </p>
                <div className="grid grid-cols-1 gap-2 mb-8 text-left max-w-sm mx-auto">
                  {PETALS.map((p) => (
                    <div key={p.key} className={`flex items-center gap-3 rounded-xl border px-4 py-2.5 ${p.color}`}>
                      <span className="text-xl">{p.emoji}</span>
                      <span className="text-sm font-bold text-gray-700">{p.title}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={() => setStep(0)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full max-w-sm py-4 rounded-lg bg-gradient-to-r from-rose-400 to-pink-500 text-white font-extrabold text-lg shadow-md flex items-center justify-center gap-2"
                >
                  Start the Exercise
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            )}

            {petal && (
              <motion.div
                key={petal.key}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.25 }}
              >
                <PetalStep
                  petal={petal}
                  items={petals[petal.key] ?? []}
                  onToggle={(item) => updatePetal(petal.key, (items) => [...items, item])}
                  onAddCustom={(item) => updatePetal(petal.key, (items) =>
                    items.includes(item) || items.length >= MAX_ITEMS_PER_PETAL ? items : [...items, item]
                  )}
                  onRemove={(item) => updatePetal(petal.key, (items) => items.filter((i) => i !== item))}
                />
                <button
                  onClick={handleNext}
                  className="w-full mt-8 py-4 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  {step === PETALS.length - 1 ? 'See My Flower' : 'Next Petal'}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-center text-xs text-gray-400 mt-3">
                  Petals can be left blank — you can always come back.
                </p>
              </motion.div>
            )}

            {isSummary && (
              <motion.div
                key="summary"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <FlowerSummary
                  petals={petals}
                  onEditPetal={(key) => setStep(PETALS.findIndex((p) => p.key === key))}
                  onRestart={() => {
                    setPetals(emptyPetals());
                    localStorage.removeItem(STORAGE_KEY);
                    // Clear the completion stamp so a redo isn't re-marked done
                    // on the first edit.
                    completedAtRef.current = null;
                    setStep(-1);
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
