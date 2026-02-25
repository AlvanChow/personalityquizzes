export const cakeResults = {
  layercake: {
    name: 'Layer Cake',
    emoji: '🎂',
    color: 'from-orange-100 to-amber-50',
    accent: 'text-amber-600',
    description: 'You are like a well-stacked thousand layer cake! You always put your passion and action into work no matter how difficult things are, and always manage to bring notable results. You are the person who does not wait for perfect conditions — you build momentum and carry projects across the finish line through sheer force of follow-through.',
    competency: 'Action Oriented',
    tagline: '#Executor #Perseverance #JustDoIt',
    trait: 'AO',
  },
  cupcake: {
    name: 'Cupcake',
    emoji: '🧁',
    color: 'from-sky-100 to-blue-50',
    accent: 'text-sky-600',
    description: 'You are like a cupcake whose knowledge and skills can only be seen once you open the wrapper. You always solve problems and break through blind spots for the team at critical moments! When others see a wall, you see a puzzle — and you take a quiet, methodical pleasure in dismantling it.',
    competency: 'Problem Solving',
    tagline: '#Sherlock #BrainIsFried #Spazalyzing',
    trait: 'PS',
  },
  macaron: {
    name: 'Macaron',
    emoji: '🫠',
    color: 'from-pink-100 to-rose-50',
    accent: 'text-rose-500',
    description: 'You are like a colorful macaron — pleasing and fresh. Despite facing tedious and boring tasks, you still bring fun, new approaches that produce outputs that are one-of-a-kind! You see possibility where others see process, and your instinct to reimagine the obvious is your greatest professional asset.',
    competency: 'Innovation',
    tagline: '#Craytive #SensoryOverload #Aesthetics',
    trait: 'IN',
  },
  strawberrycake: {
    name: 'Strawberry Cake',
    emoji: '🍓',
    color: 'from-rose-100 to-pink-50',
    accent: 'text-rose-600',
    description: "You are like a strawberry cake, giving off a warm, cheery energy. You win everyone's hearts at work with the smooth, human way you handle tasks. People do not just want to work with you — they want to work for you. Your natural warmth makes teams cohere and collaboration feel effortless.",
    competency: 'Teamwork',
    tagline: '#SocialButterfly #PersonalityHires #WorkBestie',
    trait: 'TM',
  },
  rollcake: {
    name: 'Roll Cake',
    emoji: '🍥',
    color: 'from-teal-50 to-emerald-50',
    accent: 'text-teal-600',
    description: 'You are like a roll cake, with a heart as dense as good cream filling. While being a perfectionist and careful, you give everyone around you a sense of security. Nothing falls through the cracks on your watch — your thoroughness is the invisible scaffolding that keeps quality high.',
    competency: 'Attention to Detail',
    tagline: '#MeticulousAF #Perfectionist #DoubleChecker',
    trait: 'AD',
  },
  tiramisu: {
    name: 'Tiramisu',
    emoji: '☕',
    color: 'from-stone-100 to-amber-50',
    accent: 'text-stone-600',
    description: 'You are like a tiramisu cake — exuding maturity and a strong voice. You give off a leader aura that makes people willing to follow you forward. You are comfortable taking calculated risks, and you know how to sell a vision that gets people genuinely excited to move.',
    competency: 'Influence',
    tagline: '#RiskTaker #Workaholic #NoPainNoGain',
    trait: 'INF',
  },
};

// Reverse-lookup: result display name → result key (e.g. 'Macaron' → 'macaron')
export const cakeResultNameToKey = Object.fromEntries(
  Object.entries(cakeResults).map(([key, { name }]) => [name, key])
);

export function getCakeResult(scores) {
  // scores = { AO: n, PS: n, IN: n, TM: n, AD: n, INF: n }
  const competencyMap = {
    AO: 'layercake',
    PS: 'cupcake',
    IN: 'macaron',
    TM: 'strawberrycake',
    AD: 'rollcake',
    INF: 'tiramisu',
  };

  const competencies = Object.keys(competencyMap);
  let topKey = competencies[0];
  let topScore = scores[competencies[0]] ?? 0;

  for (const key of competencies.slice(1)) {
    if ((scores[key] ?? 0) > topScore) {
      topScore = scores[key];
      topKey = key;
    }
  }

  return cakeResults[competencyMap[topKey]];
}
