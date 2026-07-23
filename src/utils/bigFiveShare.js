import { isPlainObject } from './security';

const BIG_FIVE_TRAITS = [
  { key: 'O', label: 'Openness', low: 'Practical', high: 'Imaginative', color: 'bg-sky-500' },
  { key: 'C', label: 'Conscientiousness', low: 'Flexible', high: 'Disciplined', color: 'bg-mint-500' },
  { key: 'E', label: 'Extraversion', low: 'Reserved', high: 'Outgoing', color: 'bg-coral-500' },
  { key: 'A', label: 'Agreeableness', low: 'Direct', high: 'Compassionate', color: 'bg-rose-400' },
  { key: 'N', label: 'Neuroticism', low: 'Steady', high: 'Sensitive', color: 'bg-teal-500' },
];

export function getBigFiveScoreRows(result) {
  if (!isPlainObject(result?.scores)) return [];

  return BIG_FIVE_TRAITS.flatMap((trait) => {
    const rawScore = Number(result.scores[trait.key]);
    if (!Number.isFinite(rawScore)) return [];
    return [{
      ...trait,
      score: Math.round(Math.max(0, Math.min(100, rawScore))),
    }];
  });
}
