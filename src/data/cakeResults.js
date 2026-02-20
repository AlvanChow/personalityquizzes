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
  chocolate: {
    name: 'Classic Chocolate Cake',
    emoji: '🍫',
    color: 'from-peach-50 to-cream-200',
    accent: 'text-coral-400',
    description: 'You are grounded, dependable, and have a warmth that makes everyone feel at home. You value the timeless things in life and bring comfort to those around you. Like a Classic Chocolate Cake, you are a beloved staple that never goes out of style.',
    trait: 'Balance',
  },
};

export function getCakeResult(scores) {
  if (scores.E > 60) return cakeResults.funfetti;
  if (scores.C > 60) return cakeResults.wedding;
  if (scores.O > 60) return cakeResults.matcha;
  return cakeResults.chocolate;
}
