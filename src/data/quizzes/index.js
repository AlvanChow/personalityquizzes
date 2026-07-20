/**
 * Central quiz catalog.
 *
 * Metadata here is eager (it renders cards on Landing/Dashboard); question and
 * result data is lazy-loaded per quiz via `load()` so the main bundle stays
 * small no matter how many quizzes we add.
 *
 * ── Quiz definition spec (default export of each sibling file) ──────────────
 * {
 *   key: 'naruto',                    // ^[a-z][a-z0-9_]*$, matches catalog key
 *   mode: 'pick' | 'likert',
 *   resultsHeading: 'Your …',         // heading over the breakdown bars
 *
 *   // 'pick' mode — scenario questions, each option awards points:
 *   questions: [{ id, text, options: [{ label, points: { resultKey: n } }] }],
 *   results: {
 *     resultKey: {
 *       name, emoji,
 *       color:  'from-x-100 to-y-50',   // Tailwind gradient for the hero card
 *       accent: 'text-x-600',
 *       tagline,                        // '#Hashtag #Style #Vibes'
 *       description,                    // 2–4 sentences, second person
 *       strengths: ['…', '…'],          // 3–4 short phrases
 *       growth: '…',                    // 1–2 sentence growth edge
 *       kindred: ['otherKey', '…'],     // optional: results you'd vibe with
 *     },
 *   },
 *
 *   // 'likert' mode — agree/disagree statements (1–5), tagged by dimension:
 *   questions: [{ id, text, dim: 'SA', reverse: false }],
 *   dimensions: { SA: { label: 'Self-Awareness', color: 'bg-sky-400' } },
 *   results: { SA: { name, emoji, color, accent, tagline, description, strengths, growth } },
 *   // optional — overall-score bands instead of a top-dimension winner:
 *   bands: [{ key, min: 0, name, emoji, color, accent, tagline, description, strengths, growth }],
 * }
 */

// Categories: 'pop' = pop-culture matches, 'know' = introspective assessments.
export const QUIZ_CATALOG = [
  // ── Know Yourself ──────────────────────────────────────────────────────────
  {
    key: 'flower_petal',
    title: 'The Flower Petal Exercise',
    quizName: 'Flower Petal Exercise',
    emoji: '🌸',
    category: 'know',
    description: 'The legendary self-inventory from career coaching: map who you are across 7 petals to see the work and life that fits you.',
    time: '~15 min',
    gradient: 'from-rose-400 to-pink-500',
    path: '/exercise/flower-petal',
    custom: true,
  },
  {
    key: 'riasec',
    title: 'Career Interest Explorer',
    quizName: 'Career Interest Explorer (RIASEC)',
    emoji: '🧭',
    category: 'know',
    description: 'The famous Holland Codes: are you a Builder, Thinker, Creator, Helper, Persuader, or Organizer at heart?',
    time: '~4 min',
    gradient: 'from-teal-500 to-cyan-600',
    load: () => import('./riasec.js'),
  },
  {
    key: 'love_language',
    title: 'How You Give & Receive Love',
    quizName: 'Love Style Quiz',
    emoji: '💝',
    category: 'know',
    description: 'Words, time, gifts, acts, or touch — discover the language that makes you feel most loved.',
    time: '~3 min',
    gradient: 'from-rose-400 to-red-500',
    load: () => import('./loveLanguage.js'),
  },
  {
    key: 'attachment',
    title: "What's Your Attachment Style?",
    quizName: 'Attachment Style Quiz',
    emoji: '🫂',
    category: 'know',
    description: 'Secure, anxious, avoidant, or fearful — see the blueprint your closest relationships run on.',
    time: '~3 min',
    gradient: 'from-sky-400 to-blue-500',
    load: () => import('./attachment.js'),
  },
  {
    key: 'disc',
    title: "What's Your Work Style? (DISC)",
    quizName: 'DISC Work Style',
    emoji: '🎯',
    category: 'know',
    description: 'The classic DISC framework: Driver, Influencer, Steadier, or Conscientious — how you move through work.',
    time: '~3 min',
    gradient: 'from-amber-500 to-orange-600',
    load: () => import('./disc.js'),
  },
  {
    key: 'ikigai',
    title: 'Find Your Ikigai Direction',
    quizName: 'Ikigai Finder',
    emoji: '🌅',
    category: 'know',
    description: 'The Japanese art of a life worth living: where do passion, mission, vocation, and profession pull you?',
    time: '~3 min',
    gradient: 'from-red-400 to-rose-500',
    load: () => import('./ikigai.js'),
  },
  {
    key: 'values',
    title: 'What Do You Value Most?',
    quizName: 'Core Values Compass',
    emoji: '💎',
    category: 'know',
    description: 'Inspired by Schwartz\'s famous theory of basic values — find the core value quietly steering your decisions.',
    time: '~3 min',
    gradient: 'from-violet-400 to-purple-500',
    load: () => import('./values.js'),
  },
  {
    key: 'eq',
    title: 'Emotional Intelligence Check-In',
    quizName: 'EQ Check-In',
    emoji: '🧠',
    category: 'know',
    description: 'Rate yourself across the four classic EQ domains and find your emotional superpower.',
    time: '~4 min',
    gradient: 'from-sky-500 to-cyan-500',
    load: () => import('./eq.js'),
  },
  {
    key: 'mindset',
    title: 'Growth Mindset Meter',
    quizName: 'Growth Mindset Meter',
    emoji: '🌱',
    category: 'know',
    description: 'Fixed or growth? Measure how you really think about talent, effort, and failure.',
    time: '~3 min',
    gradient: 'from-emerald-400 to-teal-500',
    load: () => import('./mindset.js'),
  },
  {
    key: 'grit',
    title: 'Grit & Perseverance Scale',
    quizName: 'Grit Scale',
    emoji: '🔥',
    category: 'know',
    description: 'Passion plus perseverance for long-term goals — the famous predictor of success. How much do you have?',
    time: '~3 min',
    gradient: 'from-orange-500 to-red-500',
    load: () => import('./grit.js'),
  },
  {
    key: 'lifewheel',
    title: 'Wheel of Life Balance Audit',
    quizName: 'Wheel of Life',
    emoji: '🎡',
    category: 'know',
    description: 'The coaching classic: score 8 areas of your life to see what\'s thriving and what\'s starving.',
    time: '~4 min',
    gradient: 'from-indigo-400 to-violet-500',
    load: () => import('./lifewheel.js'),
  },

  // ── Pop Culture ────────────────────────────────────────────────────────────
  {
    key: 'nba',
    title: 'Which NBA Legend Are You?',
    quizName: 'NBA Legend Quiz',
    emoji: '🏀',
    category: 'pop',
    description: 'Clutch assassin, joyful shooter, relentless workhorse — find the basketball great who plays like you live.',
    time: '~3 min',
    gradient: 'from-orange-500 to-amber-600',
    load: () => import('./nba.js'),
  },
  {
    key: 'soccer',
    title: 'Which Soccer Icon Are You?',
    quizName: 'Soccer Icon Quiz',
    emoji: '⚽',
    category: 'pop',
    description: 'Quiet genius or showstopper? Find the football legend whose game matches your personality.',
    time: '~3 min',
    gradient: 'from-emerald-500 to-green-600',
    load: () => import('./soccer.js'),
  },
  {
    key: 'naruto',
    title: 'Which Naruto Character Are You?',
    quizName: 'Naruto Character Quiz',
    emoji: '🍥',
    category: 'pop',
    description: 'Believe it — find out which Hidden Leaf (or Sand) ninja shares your soul.',
    time: '~3 min',
    gradient: 'from-orange-400 to-red-500',
    load: () => import('./naruto.js'),
  },
  {
    key: 'onepiece',
    title: 'Which One Piece Pirate Are You?',
    quizName: 'One Piece Crew Quiz',
    emoji: '🏴‍☠️',
    category: 'pop',
    description: 'Captain, swordsman, navigator, cook — find your place on the crew sailing for the One Piece.',
    time: '~3 min',
    gradient: 'from-red-500 to-rose-600',
    load: () => import('./onepiece.js'),
  },
  // NOTE: the wizarding-house quiz lives at /quiz/house (its own page with
  // share + friend-compatibility wired in), not in this catalog — see the
  // "Just for Fun" group on Landing.
  {
    key: 'starwars',
    title: 'Which Star Wars Character Are You?',
    quizName: 'Star Wars Character Quiz',
    emoji: '🌌',
    category: 'pop',
    description: 'Jedi, scoundrel, princess, or something darker — discover your place in the galaxy far, far away.',
    time: '~3 min',
    gradient: 'from-indigo-600 to-slate-800',
    load: () => import('./starwars.js'),
  },
  {
    key: 'superhero',
    title: 'Which Superhero Are You?',
    quizName: 'Superhero Quiz',
    emoji: '🦸',
    category: 'pop',
    description: 'Genius billionaire, friendly neighborhood hero, or Amazon warrior — find your inner cape.',
    time: '~3 min',
    gradient: 'from-blue-500 to-indigo-600',
    load: () => import('./superhero.js'),
  },
  {
    key: 'disney',
    title: 'Which Disney Hero Are You?',
    quizName: 'Disney Hero Quiz',
    emoji: '🏰',
    category: 'pop',
    description: 'Adventurer, dreamer, rebel, or royal — find the animated hero who shares your heart.',
    time: '~3 min',
    gradient: 'from-fuchsia-400 to-purple-500',
    load: () => import('./disney.js'),
  },
  {
    key: 'office',
    title: 'Which Office Character Are You?',
    quizName: 'The Office Character Quiz',
    emoji: '📎',
    category: 'pop',
    description: 'World\'s best boss, prankster, or beet farmer — find your Dunder Mifflin desk.',
    time: '~3 min',
    gradient: 'from-slate-500 to-gray-600',
    load: () => import('./office.js'),
  },
  {
    key: 'friends',
    title: 'Which Friends Character Are You?',
    quizName: 'Friends Character Quiz',
    emoji: '☕',
    category: 'pop',
    description: 'Could you BE any more curious? Find your seat on the orange couch at Central Perk.',
    time: '~3 min',
    gradient: 'from-amber-400 to-yellow-500',
    load: () => import('./friends.js'),
  },
  {
    key: 'pokemon',
    title: 'Which Starter Pokémon Are You?',
    quizName: 'Starter Pokémon Quiz',
    emoji: '⚡',
    category: 'pop',
    description: 'Fire, water, grass, or electric — which iconic starter would choose you back?',
    time: '~3 min',
    gradient: 'from-yellow-400 to-amber-500',
    load: () => import('./pokemon.js'),
  },
  {
    key: 'eras',
    title: 'Which Taylor Swift Era Are You?',
    quizName: 'Eras Quiz',
    emoji: '🎤',
    category: 'pop',
    description: 'Fearless romantic, reputation villain, or folklore poet — find the era that soundtracks your soul.',
    time: '~3 min',
    gradient: 'from-pink-400 to-fuchsia-500',
    load: () => import('./eras.js'),
  },
];

const byKey = new Map(QUIZ_CATALOG.map((q) => [q.key, q]));

export function getQuizMeta(key) {
  return byKey.get(key) ?? null;
}

export function getQuizPath(meta) {
  return meta.path ?? `/quiz/${meta.key}`;
}

export function getQuizzesByCategory(category) {
  return QUIZ_CATALOG.filter((q) => q.category === category);
}

// localStorage key where a quiz's latest result is stored.
export function storageKeyFor(quizKey) {
  return `personalens_${quizKey}`;
}

export function isQuizCompleted(quizKey) {
  try {
    const raw = localStorage.getItem(storageKeyFor(quizKey));
    if (!raw) return false;
    // Quizzes store a result on finish; the Flower Petal exercise persists
    // partial progress with completedAt null until it's actually done — an
    // in-progress save must not count as completed.
    const parsed = JSON.parse(raw);
    return !!(parsed && typeof parsed === 'object' && (parsed.result || parsed.completedAt));
  } catch {
    return false;
  }
}
