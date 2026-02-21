export const enneagramResults = {
  '1': {
    name: 'Type 1 — The Reformer',
    nickname: 'The Reformer',
    typeNumber: '1',
    emoji: '⚖️',
    color: 'from-amber-50 to-yellow-100',
    accent: 'text-amber-700',
    description: 'Principled, purposeful and self-controlled. Ones have a powerful inner sense of right and wrong and a genuine drive to make things better. They notice what\'s broken in the world and feel morally compelled to fix it. They hold themselves — and quietly, others — to very high standards. At their best, they are ethical, organised and inspiring advocates for meaningful improvement.',
    coreDesire: 'To be good, balanced, and to have integrity',
    coreFear: 'Being corrupt, evil, or fundamentally flawed',
  },
  '2': {
    name: 'Type 2 — The Helper',
    nickname: 'The Helper',
    typeNumber: '2',
    emoji: '🤗',
    color: 'from-rose-50 to-pink-100',
    accent: 'text-rose-700',
    description: 'Warm, giving, and deeply tuned in to others. Twos have a genuine gift for making people feel seen and cared for. They anticipate needs before they\'re expressed and find deep fulfilment in being truly helpful. Connection and love are everything to them. At their best, they are generous, empathetic, and the person everyone wants in their corner when things get hard.',
    coreDesire: 'To feel loved and to know their love is appreciated',
    coreFear: 'Being unwanted or unloved, or feeling that they have no worth',
  },
  '3': {
    name: 'Type 3 — The Achiever',
    nickname: 'The Achiever',
    typeNumber: '3',
    emoji: '🏆',
    color: 'from-orange-50 to-amber-100',
    accent: 'text-orange-700',
    description: 'Driven, adaptable, and acutely image-aware. Threes are goal-setters who measure their worth in results, and they deliver them. They read environments quickly, understand what\'s valued, and excel at presenting their best self to the world. Ambitious and energetic, they are often the most visibly successful person in the room. At their best, they inspire others through genuine achievement and lead by example.',
    coreDesire: 'To feel valuable, worthy and admired',
    coreFear: 'Being worthless or seen as a failure',
  },
  '4': {
    name: 'Type 4 — The Individualist',
    nickname: 'The Individualist',
    typeNumber: '4',
    emoji: '🎭',
    color: 'from-violet-50 to-purple-100',
    accent: 'text-violet-700',
    description: 'Expressive, sensitive, and resolutely authentic. Fours live with a deep sense of being different — of having something unique inside them that the world has not quite seen or understood. They are drawn to beauty, meaning, and intense emotional experience. Creative and introspective, they feel things more acutely than most. At their best, they bring extraordinary originality and emotional depth to everything they touch.',
    coreDesire: 'To find themselves and their significance — to create a unique identity',
    coreFear: 'Having no identity, no personal significance, or being fundamentally flawed',
  },
  '5': {
    name: 'Type 5 — The Investigator',
    nickname: 'The Investigator',
    typeNumber: '5',
    emoji: '🔭',
    color: 'from-teal-50 to-sky-100',
    accent: 'text-teal-700',
    description: 'Perceptive, cerebral, and quietly fascinating. Fives have a deep need to understand the world and a corresponding drive to acquire knowledge, skills and insight. They tend to be private, self-sufficient, and often more comfortable observing than participating. They conserve their energy carefully. At their best, they are visionary thinkers with profound expertise and the ability to explain complex things with rare clarity.',
    coreDesire: 'To be capable and competent, to understand the world',
    coreFear: 'Being helpless, incompetent, or overwhelmed by the demands of the world',
  },
  '6': {
    name: 'Type 6 — The Loyalist',
    nickname: 'The Loyalist',
    typeNumber: '6',
    emoji: '🛡️',
    color: 'from-sky-50 to-blue-100',
    accent: 'text-sky-700',
    description: 'Responsible, engaged, and fiercely loyal. Sixes have a deep need for security and trust. They are acutely aware of what could go wrong and think carefully through risks — not because they\'re pessimistic, but because they genuinely care about protecting what matters. They value reliability and commitment deeply. At their best, they are courageous, warm, and the kind of person others depend on without even realising it.',
    coreDesire: 'To have security, support, and to feel certain',
    coreFear: 'Being without support, guidance, or being unable to survive alone',
  },
  '7': {
    name: 'Type 7 — The Enthusiast',
    nickname: 'The Enthusiast',
    typeNumber: '7',
    emoji: '🌈',
    color: 'from-yellow-50 to-lime-100',
    accent: 'text-lime-700',
    description: 'Spontaneous, optimistic, and hungry for experience. Sevens move through the world with infectious energy and an appetite for everything interesting, fun or stimulating. They resist boredom, prefer options to obligations, and always have something exciting on the horizon. At their best, they are joyful, creative, and capable of finding possibility and delight even in unexpected places.',
    coreDesire: 'To be satisfied and content — to have their needs met',
    coreFear: 'Being deprived, trapped in pain, or missing out',
  },
  '8': {
    name: 'Type 8 — The Challenger',
    nickname: 'The Challenger',
    typeNumber: '8',
    emoji: '🔥',
    color: 'from-red-50 to-rose-100',
    accent: 'text-red-700',
    description: 'Self-confident, decisive, and powerfully direct. Eights move through the world with a forceful energy and a deep need to remain in control of their own destiny. They are natural protectors who will fight hard for those they care about and have zero tolerance for manipulation or injustice. Intense and magnetic, they make things happen. At their best, they are inspiring, protective leaders who use their considerable strength in service of others.',
    coreDesire: 'To protect themselves, to be in control of their own life and destiny',
    coreFear: 'Being harmed, controlled, or manipulated by others',
  },
  '9': {
    name: 'Type 9 — The Peacemaker',
    nickname: 'The Peacemaker',
    typeNumber: '9',
    emoji: '☮️',
    color: 'from-mint-50 to-green-100',
    accent: 'text-green-700',
    description: 'Receptive, steady, and genuinely easy to be around. Nines have a natural gift for seeing all sides of a situation and a deep desire for harmony. They dislike conflict and will often adapt or yield to maintain peace. Open-minded and accepting, they make others feel at ease immediately. At their best, they are profoundly wise, inclusive and capable of bringing very different people together around something meaningful.',
    coreDesire: 'To have inner stability and peace of mind',
    coreFear: 'Loss and separation, fragmentation — falling apart',
  },
};

/**
 * Returns the Enneagram result for the type with the highest accumulated score.
 * Ties are broken by the lower type number.
 *
 * @param {Record<string, number>} scores  e.g. { '1': 8, '2': 5, ... '9': 11 }
 * @returns {object} The matching entry from enneagramResults
 */
export function getEnneagramResult(scores) {
  let maxType = '1';
  let maxScore = scores['1'] ?? 0;

  for (let t = 2; t <= 9; t++) {
    const key = String(t);
    const score = scores[key] ?? 0;
    if (score > maxScore) {
      maxScore = score;
      maxType = key;
    }
  }

  return enneagramResults[maxType];
}
