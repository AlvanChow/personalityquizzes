export const cakeResults = {
  funfetti: {
    name: 'Funfetti Cake',
    emoji: '🎉',
    color: 'from-coral-100 to-peach-100',
    accent: 'text-coral-500',
    description: 'Your outgoing, energetic nature means you light up every room you walk into. You bring the party wherever you go, and people are drawn to your infectious enthusiasm. Just like a Funfetti Cake, you are a burst of color, joy, and celebration all rolled into one.',
    trait: 'Extraversion',
  },
  wedding: {
    name: 'Elaborate Wedding Cake',
    emoji: '🎂',
    color: 'from-cream-100 to-sky-50',
    accent: 'text-sky-500',
    description: 'You are detail-oriented, ambitious, and take pride in everything you do. Your meticulous nature and drive for excellence means you never settle for less than the best. Like an Elaborate Wedding Cake, you are a masterpiece of careful planning and flawless execution.',
    trait: 'Conscientiousness',
  },
  matcha: {
    name: 'Matcha Crepe Cake',
    emoji: '🍵',
    color: 'from-mint-50 to-mint-100',
    accent: 'text-mint-500',
    description: 'Your open, curious mind is always seeking the next interesting experience. You embrace the unconventional and find beauty in the unexpected. Like a Matcha Crepe Cake, you are layered, sophisticated, and refreshingly different from the crowd.',
    trait: 'Openness',
  },
  redvelvet: {
    name: 'Red Velvet Cake',
    emoji: '🧁',
    color: 'from-rose-100 to-rose-50',
    accent: 'text-rose-500',
    description: 'Your warm, generous spirit makes everyone around you feel valued and loved. You are the person who remembers birthdays, checks in on friends, and always puts others first. Like a Red Velvet Cake, you are rich with warmth, elegance, and a sweetness that runs deep.',
    trait: 'Agreeableness',
  },
  lava: {
    name: 'Chocolate Lava Cake',
    emoji: '🌋',
    color: 'from-coral-50 to-rose-50',
    accent: 'text-coral-400',
    description: 'You feel things deeply and with great intensity. Your emotional richness gives you incredible empathy and a creative spark that others admire. Like a Chocolate Lava Cake, beneath your composed exterior is a passionate, molten core that makes you truly unforgettable.',
    trait: 'Neuroticism',
  },
  chocolate: {
    name: 'Classic Chocolate Cake',
    emoji: '🍫',
    color: 'from-peach-50 to-cream-200',
    accent: 'text-coral-400',
    description: 'You are grounded, dependable, and have a warmth that makes everyone feel at home. You value the timeless things in life and bring comfort to those around you. Like a Classic Chocolate Cake, you are a beloved staple that never goes out of style.',
    trait: 'Balance',
  },
};

// Reverse-lookup: result display name → result key (e.g. 'Funfetti Cake' → 'funfetti')
export const cakeResultNameToKey = Object.fromEntries(
  Object.entries(cakeResults).map(([key, { name }]) => [name, key])
);

export function getCakeResult(scores) {
  const traitMap = {
    E: 'funfetti',
    C: 'wedding',
    O: 'matcha',
    A: 'redvelvet',
    N: 'lava',
  };

  const traits = ['O', 'C', 'E', 'A', 'N'];
  let maxTrait = traits[0];
  let maxScore = scores[traits[0]];
  let secondMax = 0;

  for (const t of traits.slice(1)) {
    if (scores[t] > maxScore) {
      secondMax = maxScore;
      maxScore = scores[t];
      maxTrait = t;
    } else if (scores[t] > secondMax) {
      secondMax = scores[t];
    }
  }

  if (maxScore - secondMax < 10) {
    return cakeResults.chocolate;
  }

  return cakeResults[traitMap[maxTrait]];
}
