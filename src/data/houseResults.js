export const houseResults = {
  gryffindor: {
    name: 'Gryffindor',
    key: 'gryffindor',
    emoji: '🦁',
    color: 'from-red-50 to-amber-100',
    accent: 'text-red-700',
    tagline: 'Fortune favors the bold',
    description: 'You lead with your heart and your nerve — usually in that order. When something is wrong, you are the first to say so out loud, and when something is scary, you are already halfway through the door. People are drawn to your fire because it makes them braver too. You would rather fail spectacularly doing the right thing than succeed quietly doing nothing.',
    traits: ['Brave', 'Daring', 'Big-hearted', 'Fiercely honest'],
    famousMembers: [],
    strengths: 'You act when everyone else is still hesitating, and your courage gives the people around you permission to be brave.',
    watchOut: 'Leaping before you look can turn noble intentions into avoidable messes — sometimes the bravest move is to pause.',
  },
  hufflepuff: {
    name: 'Hufflepuff',
    key: 'hufflepuff',
    emoji: '🦡',
    color: 'from-yellow-50 to-amber-100',
    accent: 'text-amber-700',
    tagline: 'Loyal to the very end',
    description: 'You are the person people call at 2am, and you always pick up. While others chase glory, you quietly build the kind of trust that holds entire friend groups together. Your kindness is not softness — it takes real backbone to keep showing up, keep being fair, and keep doing the work when no one is watching. The world runs on people like you, whether it admits it or not.',
    traits: ['Loyal', 'Patient', 'Fair-minded', 'Hardworking'],
    famousMembers: [],
    strengths: 'Your steadiness and genuine care make you the most trusted person in any room you walk into.',
    watchOut: 'Putting everyone else first can leave you running on empty — your needs deserve a spot on the list too.',
  },
  ravenclaw: {
    name: 'Ravenclaw',
    key: 'ravenclaw',
    emoji: '🦅',
    color: 'from-blue-50 to-sky-100',
    accent: 'text-blue-700',
    tagline: 'Wit beyond measure',
    description: 'Your mind is a browser with forty tabs open, and honestly, you love it that way. You collect ideas the way other people collect souvenirs, and you would rather understand something deeply than win an argument about it. Original thinking is your superpower — you see angles nobody else notices. For you, the question is always more interesting than the answer.',
    traits: ['Curious', 'Original', 'Perceptive', 'Sharp-witted'],
    famousMembers: [],
    strengths: 'You see the pattern everyone else missed, and your love of learning makes you endlessly adaptable.',
    watchOut: 'Overthinking is your kryptonite — at some point the analysis has to end and the doing has to begin.',
  },
  slytherin: {
    name: 'Slytherin',
    key: 'slytherin',
    emoji: '🐍',
    color: 'from-emerald-50 to-green-100',
    accent: 'text-emerald-700',
    tagline: 'Greatness has a plan',
    description: 'You do not just dream big — you draft the roadmap, spot the shortcuts, and quietly start executing while everyone else is still talking. You read rooms the way other people read books, and you have a gift for turning obstacles into leverage. Being underestimated does not bother you; it is usually an advantage. You know exactly where you are going, and you will absolutely get there.',
    traits: ['Ambitious', 'Resourceful', 'Strategic', 'Determined'],
    famousMembers: [],
    strengths: 'Your focus and resourcefulness mean that once you commit to a goal, it is effectively already done.',
    watchOut: 'Winning can get so tempting that you forget to check what it costs — keep an eye on who is beside you at the finish line.',
  },
};

// Tie-break order is fixed: g, h, r, s.
const houseOrder = ['g', 'h', 'r', 's'];

const letterToResultKey = {
  g: 'gryffindor',
  h: 'hufflepuff',
  r: 'ravenclaw',
  s: 'slytherin',
};

/**
 * Returns the houseResults entry with the highest count.
 * scores = { g: n, h: n, r: n, s: n }; ties break in order g, h, r, s.
 */
export function getHouseResult(scores) {
  let topLetter = houseOrder[0];
  let topScore = scores[houseOrder[0]] ?? 0;

  for (const letter of houseOrder.slice(1)) {
    if ((scores[letter] ?? 0) > topScore) {
      topScore = scores[letter];
      topLetter = letter;
    }
  }

  return houseResults[letterToResultKey[topLetter]];
}
