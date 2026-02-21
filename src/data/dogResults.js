export const dogResults = {
  goldenretriever: {
    name: 'Golden Retriever',
    emoji: '🐕',
    color: 'from-peach-100 to-cream-200',
    accent: 'text-coral-500',
    description: 'You are warm, loyal, and endlessly friendly. People are drawn to your positive energy and genuine kindness. Like a Golden Retriever, you greet every new person and experience with enthusiasm, and your generosity of spirit makes everyone around you feel welcome and valued.',
    trait: 'Agreeableness',
  },
  bordercollie: {
    name: 'Border Collie',
    emoji: '🐾',
    color: 'from-sky-50 to-sky-100',
    accent: 'text-sky-500',
    description: 'You are driven, disciplined, and incredibly focused. When you set your mind to something, nothing can stop you. Like a Border Collie, you thrive on structure and purpose, tackling every task with precision and an impressive work ethic that others can only admire.',
    trait: 'Conscientiousness',
  },
  husky: {
    name: 'Siberian Husky',
    emoji: '🐺',
    color: 'from-teal-50 to-sky-50',
    accent: 'text-teal-400',
    description: 'You are adventurous, curious, and boldly independent. Routine bores you and you are always chasing the next horizon. Like a Siberian Husky, you have an untamed spirit, a love for exploration, and a creative energy that refuses to be contained by convention.',
    trait: 'Openness',
  },
  labrador: {
    name: 'Labrador Retriever',
    emoji: '🦮',
    color: 'from-coral-50 to-peach-100',
    accent: 'text-coral-400',
    description: 'You are the life of the party, outgoing, and full of infectious energy. You make friends everywhere you go and can turn any situation into a good time. Like a Labrador, your boundless enthusiasm and social nature make you the one everyone wants around.',
    trait: 'Extraversion',
  },
  chihuahua: {
    name: 'Chihuahua',
    emoji: '🐶',
    color: 'from-rose-50 to-rose-100',
    accent: 'text-rose-400',
    description: 'You feel things deeply and with great intensity. Your emotional sensitivity gives you a rich inner life and powerful intuition about others. Like a Chihuahua, beneath your sometimes guarded exterior is a fierce heart, unwavering loyalty, and a passionate nature that makes you unforgettable.',
    trait: 'Neuroticism',
  },
  mixedbreed: {
    name: 'Mixed Breed',
    emoji: '🐕‍🦺',
    color: 'from-cream-100 to-mint-50',
    accent: 'text-mint-500',
    description: 'You are beautifully balanced, drawing from a wide range of strengths. No single trait defines you because you are a unique blend of many qualities. Like a Mixed Breed, your versatility is your superpower, allowing you to adapt, connect, and thrive in any situation life throws your way.',
    trait: 'Balance',
  },
};

export function getDogResult(scores) {
  const traitMap = {
    E: 'labrador',
    C: 'bordercollie',
    O: 'husky',
    A: 'goldenretriever',
    N: 'chihuahua',
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
    return dogResults.mixedbreed;
  }

  return dogResults[traitMap[maxTrait]];
}
