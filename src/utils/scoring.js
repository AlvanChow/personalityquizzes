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

/**
 * Computes MBTI scores from forced-choice (A/B) deep quiz answers.
 *
 * Each question has two options, each with a `pointsTo` letter and `weight`.
 * Counts weighted points per letter, then computes percentage for each dimension.
 * Returns the same { IE, SN, TF, JP } shape as computeMBTIScores().
 *
 * @param {Record<string, { trait: string, value: string }>} answers
 * @param {Array} questions - The mbtiDeepQuestions array
 * @returns {{ IE: number, SN: number, TF: number, JP: number }}
 */
export function computeMBTIDeepScores(answers, questions) {
  const points = { I: 0, E: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  Object.entries(answers).forEach(([qId, { value }]) => {
    const q = questionMap.get(Number(qId));
    if (!q) return;
    const chosen = q.options.find((o) => o.value === value);
    if (chosen) {
      points[chosen.pointsTo] = (points[chosen.pointsTo] || 0) + chosen.weight;
    }
  });

  return {
    IE: Math.round((points.E / (points.I + points.E || 1)) * 100),
    SN: Math.round((points.N / (points.S + points.N || 1)) * 100),
    TF: Math.round((points.F / (points.T + points.F || 1)) * 100),
    JP: Math.round((points.P / (points.J + points.P || 1)) * 100),
  };
}

/**
 * Computes Enneagram scores from the weighted-Likert deep quiz answers.
 *
 * Each option has `addsToType` (type number) and `weight` (score contribution).
 * Accumulates weighted scores per type.
 * Returns the same { '1': n, ..., '9': n } shape as computeEnneagramScores().
 *
 * @param {Record<string, { trait: string, value: number }>} answers
 * @param {Array} questions - The enneagramDeepQuestions array
 * @returns {Record<string, number>}
 */
export function computeEnneagramDeepScores(answers, questions) {
  const scores = {};
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  Object.entries(answers).forEach(([qId, { value }]) => {
    const q = questionMap.get(Number(qId));
    if (!q) return;
    const chosen = q.options.find((o) => o.value === value);
    if (chosen) {
      const type = String(chosen.addsToType);
      scores[type] = (scores[type] || 0) + chosen.weight;
    }
  });

  return scores;
}
