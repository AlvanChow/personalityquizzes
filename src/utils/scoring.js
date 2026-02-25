/**
 * Maps a multiple-choice answer value (1–4) to a Big Five trait score adjustment.
 * Used by all themed quizzes.
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

  const questionMap = new Map(questions.map((q) => [q.id, q]));

  Object.entries(answers).forEach(([qId, { trait, value }]) => {
    const q = questionMap.get(Number(qId));
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

/**
 * Computes normalised MBTI dimension scores (0–100) from quiz answers.
 *
 * Each question targets one dichotomy ('IE' | 'SN' | 'TF' | 'JP').
 * Option values 1–4: 1 = strongly first letter, 4 = strongly second letter.
 * Score < 50 → first letter; score ≥ 50 → second letter.
 *
 * @param {Record<string, { trait: 'IE'|'SN'|'TF'|'JP', value: number }>} answers
 * @returns {{ IE: number, SN: number, TF: number, JP: number }}
 */
export function computeMBTIScores(answers) {
  const sums = {};
  const counts = {};

  Object.values(answers).forEach(({ trait, value }) => {
    sums[trait] = (sums[trait] || 0) + value;
    counts[trait] = (counts[trait] || 0) + 1;
  });

  const scores = {};
  for (const dim of Object.keys(sums)) {
    const avg = sums[dim] / counts[dim];
    scores[dim] = Math.round(((avg - 1) / 3) * 100);
  }
  return scores;
}

/**
 * Accumulates raw Enneagram scores per type from quiz answers.
 *
 * Each question targets one of the 9 types ('1'–'9').
 * Option values 1–4: 1 = not like me at all, 4 = very much like me.
 * Maximum possible score per type = (questions per type) × 4.
 *
 * @param {Record<string, { trait: string, value: number }>} answers
 * @returns {Record<string, number>}  e.g. { '1': 9, '2': 4, ... '9': 11 }
 */
export function computeEnneagramScores(answers) {
  const scores = {};
  Object.values(answers).forEach(({ trait, value }) => {
    scores[trait] = (scores[trait] || 0) + value;
  });
  return scores;
}
