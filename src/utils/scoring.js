/**
 * Maps a multiple-choice answer value (1–4) to a Big Five trait score adjustment.
 * Used by all themed quizzes (cake, dog, city).
 */
export function optionToAdjustment(value) {
  const map = { 1: -4, 2: -2, 3: 2, 4: 4 };
  return map[value] ?? 0;
}

/**
 * Computes normalised Big Five scores (0–100) from a baseline answers map.
 *
 * @param {Record<string, { trait: string, value: number }>} answers
 *   Object keyed by question id (string), each entry has the trait letter and
 *   the raw Likert value (1–5) chosen by the user.
 * @param {Array<{ id: number, trait: string, reversed: boolean }>} questions
 *   The full baselineQuestions array, needed to look up the `reversed` flag.
 * @returns {Record<string, number>} scores – one 0–100 value per trait letter.
 */
export function computeBaselineScores(answers, questions) {
  const traitSums = {};
  const traitCounts = {};

  Object.entries(answers).forEach(([qId, { trait, value }]) => {
    const q = questions.find((bq) => bq.id === Number(qId));
    const adjusted = q?.reversed ? 6 - value : value;
    traitSums[trait] = (traitSums[trait] || 0) + adjusted;
    traitCounts[trait] = (traitCounts[trait] || 0) + 1;
  });

  const scores = {};
  for (const trait of Object.keys(traitSums)) {
    const avg = traitSums[trait] / traitCounts[trait];
    scores[trait] = Math.round(((avg - 1) / 4) * 100);
  }
  return scores;
}
