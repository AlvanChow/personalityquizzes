// Compact "what this test measures" breakdown for the three core, research-grade
// tests. Shown on each quiz's OWN intro screen (right after a visitor clicks in),
// not on the homepage — the homepage stays a clean grid of quiz cards.
// Keyed by quiz key; each intro renders only its own slice.
export const CORE_BREAKDOWN = {
  big5: {
    heading: 'The five traits you\'ll be scored on',
    items: [
      ['Openness', 'curiosity & imagination'],
      ['Conscientiousness', 'discipline & drive'],
      ['Extraversion', 'energy & sociability'],
      ['Agreeableness', 'warmth & cooperation'],
      ['Neuroticism', 'emotional sensitivity'],
    ],
  },
  mbti: {
    heading: 'The four preferences behind your type',
    items: [
      ['Introvert · Extravert', 'where energy comes from'],
      ['Sensing · Intuition', 'how you take in info'],
      ['Thinking · Feeling', 'how you decide'],
      ['Judging · Perceiving', 'how you meet the world'],
    ],
  },
  enneagram: {
    heading: 'The nine types',
    items: [
      ['1 · Reformer', 'principled'],
      ['2 · Helper', 'caring'],
      ['3 · Achiever', 'driven'],
      ['4 · Individualist', 'expressive'],
      ['5 · Investigator', 'perceptive'],
      ['6 · Loyalist', 'committed'],
      ['7 · Enthusiast', 'spontaneous'],
      ['8 · Challenger', 'decisive'],
      ['9 · Peacemaker', 'easygoing'],
    ],
  },
};
