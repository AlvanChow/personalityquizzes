// IPIP-50: 50-item Big Five inventory (10 questions per trait)
// Public domain from the International Personality Item Pool
// Same format as baselineQuestions — reuses computeBaselineScores()

import { likertOptions } from './baselineQuestions';

export { likertOptions };

export const bigFiveDeepQuestions = [
  // ── Extraversion (E) ─────────────────────────────────────────────────────────
  { id: 1, text: 'Am the life of the party.', trait: 'E', reversed: false },
  { id: 2, text: 'Feel comfortable around people.', trait: 'E', reversed: false },
  { id: 3, text: "Don't mind being the center of attention.", trait: 'E', reversed: false },
  { id: 4, text: 'Start conversations.', trait: 'E', reversed: false },
  { id: 5, text: 'Talk to a lot of different people at parties.', trait: 'E', reversed: false },
  { id: 6, text: "Don't talk a lot.", trait: 'E', reversed: true },
  { id: 7, text: 'Keep in the background.', trait: 'E', reversed: true },
  { id: 8, text: 'Have little to say.', trait: 'E', reversed: true },
  { id: 9, text: "Don't like to draw attention to myself.", trait: 'E', reversed: true },
  { id: 10, text: 'Am quiet around strangers.', trait: 'E', reversed: true },

  // ── Agreeableness (A) ────────────────────────────────────────────────────────
  { id: 11, text: "Sympathize with others' feelings.", trait: 'A', reversed: false },
  { id: 12, text: 'Have a soft heart.', trait: 'A', reversed: false },
  { id: 13, text: 'Take time out for others.', trait: 'A', reversed: false },
  { id: 14, text: "Feel others' emotions.", trait: 'A', reversed: false },
  { id: 15, text: 'Make people feel at ease.', trait: 'A', reversed: false },
  { id: 16, text: 'Feel little concern for others.', trait: 'A', reversed: true },
  { id: 17, text: 'Am not really interested in others.', trait: 'A', reversed: true },
  { id: 18, text: 'Insult people.', trait: 'A', reversed: true },
  { id: 19, text: "Am not interested in other people's problems.", trait: 'A', reversed: true },
  { id: 20, text: 'Am hard to get to know.', trait: 'A', reversed: true },

  // ── Conscientiousness (C) ────────────────────────────────────────────────────
  { id: 21, text: 'Am always prepared.', trait: 'C', reversed: false },
  { id: 22, text: 'Pay attention to details.', trait: 'C', reversed: false },
  { id: 23, text: 'Get chores done right away.', trait: 'C', reversed: false },
  { id: 24, text: 'Like order.', trait: 'C', reversed: false },
  { id: 25, text: 'Follow a schedule.', trait: 'C', reversed: false },
  { id: 26, text: 'Often forget to put things back in their proper place.', trait: 'C', reversed: true },
  { id: 27, text: 'Make a mess of things.', trait: 'C', reversed: true },
  { id: 28, text: 'Shirk my duties.', trait: 'C', reversed: true },
  { id: 29, text: 'Leave my belongings around.', trait: 'C', reversed: true },
  { id: 30, text: 'Neglect my duties.', trait: 'C', reversed: true },

  // ── Neuroticism (N) ──────────────────────────────────────────────────────────
  { id: 31, text: 'Get stressed out easily.', trait: 'N', reversed: false },
  { id: 32, text: 'Worry about things.', trait: 'N', reversed: false },
  { id: 33, text: 'Am easily disturbed.', trait: 'N', reversed: false },
  { id: 34, text: 'Get upset easily.', trait: 'N', reversed: false },
  { id: 35, text: 'Change my mood a lot.', trait: 'N', reversed: false },
  { id: 36, text: 'Am relaxed most of the time.', trait: 'N', reversed: true },
  { id: 37, text: 'Seldom feel blue.', trait: 'N', reversed: true },
  { id: 38, text: 'Have frequent mood swings.', trait: 'N', reversed: false },
  { id: 39, text: 'Get irritated easily.', trait: 'N', reversed: false },
  { id: 40, text: 'Often feel blue.', trait: 'N', reversed: false },

  // ── Openness to Experience (O) ───────────────────────────────────────────────
  { id: 41, text: 'Have a rich vocabulary.', trait: 'O', reversed: false },
  { id: 42, text: 'Have a vivid imagination.', trait: 'O', reversed: false },
  { id: 43, text: 'Have excellent ideas.', trait: 'O', reversed: false },
  { id: 44, text: 'Am quick to understand things.', trait: 'O', reversed: false },
  { id: 45, text: 'Use difficult words.', trait: 'O', reversed: false },
  { id: 46, text: 'Spend time reflecting on things.', trait: 'O', reversed: false },
  { id: 47, text: 'Am full of ideas.', trait: 'O', reversed: false },
  { id: 48, text: 'Am not interested in abstract ideas.', trait: 'O', reversed: true },
  { id: 49, text: 'Do not have a good imagination.', trait: 'O', reversed: true },
  { id: 50, text: 'Have difficulty understanding abstract ideas.', trait: 'O', reversed: true },
];
