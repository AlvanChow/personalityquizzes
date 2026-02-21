export const cityResults = {
  tokyo: {
    name: 'Tokyo',
    emoji: '🗼',
    color: 'from-rose-50 to-coral-50',
    accent: 'text-coral-500',
    description: 'You thrive in organized, high-performance environments where precision and reliability are valued. Tokyo matches your disciplined nature, blending cutting-edge efficiency with deep respect for tradition. You would love its punctual trains, immaculate streets, and the satisfying rhythm of a city that runs like clockwork.',
    trait: 'Conscientiousness',
  },
  newyork: {
    name: 'New York City',
    emoji: '🗽',
    color: 'from-sky-50 to-sky-100',
    accent: 'text-sky-500',
    description: 'You are energized by people, noise, and nonstop action. New York City matches your extraverted spirit with its 24/7 buzz, packed sidewalks, and endless social opportunities. You would thrive in a place where every block holds a new conversation, a new friend, and a new adventure.',
    trait: 'Extraversion',
  },
  berlin: {
    name: 'Berlin',
    emoji: '🎨',
    color: 'from-mint-50 to-teal-50',
    accent: 'text-teal-400',
    description: 'You are drawn to the unconventional, the creative, and the boundary-pushing. Berlin matches your open-minded nature with its thriving art scene, experimental culture, and fierce individuality. You would feel at home in a city that celebrates reinvention and rewards those who think differently.',
    trait: 'Openness',
  },
  copenhagen: {
    name: 'Copenhagen',
    emoji: '🚲',
    color: 'from-peach-50 to-cream-200',
    accent: 'text-coral-400',
    description: 'You lead with warmth, kindness, and a genuine care for community. Copenhagen matches your agreeable nature with its emphasis on hygge, social trust, and collective well-being. You would love a city where people look out for each other and happiness is measured in togetherness, not competition.',
    trait: 'Agreeableness',
  },
  paris: {
    name: 'Paris',
    emoji: '🥐',
    color: 'from-rose-50 to-rose-100',
    accent: 'text-rose-400',
    description: 'You feel things deeply and your emotional richness fuels your appreciation for beauty, romance, and meaning. Paris matches your sensitive nature with its moody cafes, poetic streets, and a culture that celebrates the full spectrum of human emotion. You would thrive where passion is a way of life.',
    trait: 'Neuroticism',
  },
  lisbon: {
    name: 'Lisbon',
    emoji: '🌊',
    color: 'from-cream-100 to-sky-50',
    accent: 'text-sky-500',
    description: 'You are beautifully balanced, adaptable, and at ease in many different settings. Lisbon matches your versatile nature with its blend of old-world charm and modern energy, laid-back pace and vibrant nightlife, tradition and innovation. You would love a city as comfortably multifaceted as you are.',
    trait: 'Balance',
  },
};

export function getCityResult(scores) {
  const traitMap = {
    E: 'newyork',
    C: 'tokyo',
    O: 'berlin',
    A: 'copenhagen',
    N: 'paris',
  };

  const traits = ['O', 'C', 'E', 'A', 'N'];
  let maxTrait = traits[0];
  let maxScore = scores[traits[0]];
  let secondMax = 0;

  for (const t of traits) {
    if (scores[t] > maxScore) {
      secondMax = maxScore;
      maxScore = scores[t];
      maxTrait = t;
    } else if (scores[t] > secondMax && scores[t] !== maxScore) {
      secondMax = scores[t];
    }
  }

  if (maxScore - secondMax < 10) {
    return cityResults.lisbon;
  }

  return cityResults[traitMap[maxTrait]];
}
