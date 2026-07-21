/**
 * Generic scoring engine for catalog quizzes (src/data/quizzes/).
 *
 * Two quiz modes are supported:
 *
 * 'pick'   — every question offers scenario options; each option awards points
 *            to one or more result keys via `points: { resultKey: n }`.
 *            The result with the most points wins. Answer values are option
 *            array indexes.
 *
 * 'likert' — every question is an agree/disagree statement tagged with a
 *            dimension (`dim`). Answer values are 1–5 (see LIKERT_OPTIONS).
 *            Items with `reverse: true` are flipped before scoring.
 *            If the quiz defines `bands`, the overall percentage picks a band
 *            result; otherwise the highest-scoring dimension's entry in
 *            `results` wins.
 */

export const LIKERT_OPTIONS = [
  { value: 1, label: 'Strongly disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly agree' },
];

const LIKERT_MAX = 5;

function computePick(quiz, answers) {
  const raw = {};
  for (const key of Object.keys(quiz.results)) raw[key] = 0;

  let total = 0;
  for (const question of quiz.questions) {
    const answer = answers[question.id];
    if (answer == null) continue;
    const option = question.options[answer.value];
    if (!option?.points) continue;
    for (const [key, pts] of Object.entries(option.points)) {
      if (raw[key] == null) continue;
      raw[key] += pts;
      total += pts;
    }
  }

  // Share-of-total percentages so the breakdown bars read as "match strength".
  const scores = {};
  for (const [key, pts] of Object.entries(raw)) {
    scores[key] = total > 0 ? Math.round((pts / total) * 100) : 0;
  }

  // Ties break by declaration order of quiz.results.
  let resultKey = Object.keys(quiz.results)[0];
  for (const key of Object.keys(quiz.results)) {
    if (raw[key] > raw[resultKey]) resultKey = key;
  }

  return { mode: 'pick', resultKey, result: quiz.results[resultKey], scores, raw };
}

function computeLikert(quiz, answers) {
  const sums = {};
  const counts = {};
  for (const dim of Object.keys(quiz.dimensions)) {
    sums[dim] = 0;
    counts[dim] = 0;
  }

  let overallSum = 0;
  let overallCount = 0;
  for (const question of quiz.questions) {
    const answer = answers[question.id];
    if (answer == null) continue;
    const value = question.reverse ? LIKERT_MAX + 1 - answer.value : answer.value;
    if (sums[question.dim] == null) continue;
    sums[question.dim] += value;
    counts[question.dim] += 1;
    overallSum += value;
    overallCount += 1;
  }

  // Normalize each dimension from its min (all 1s) → max (all 5s) to 0–100.
  // These absolute scores decide the winner and drive banded/balance quizzes.
  const scores = {};
  for (const dim of Object.keys(quiz.dimensions)) {
    scores[dim] = counts[dim] > 0
      ? Math.round(((sums[dim] - counts[dim]) / (counts[dim] * (LIKERT_MAX - 1))) * 100)
      : 0;
  }

  const overallPct = overallCount > 0
    ? Math.round(((overallSum - overallCount) / (overallCount * (LIKERT_MAX - 1))) * 100)
    : 0;

  // ─── Spread + tie detection ───────────────────────────────────────────────
  // A flat profile (someone who answers everything the same way, or is genuinely
  // even) must NOT be presented as a confident single winner. `spread` is the
  // gap between the strongest and weakest answered dimension; below TIE_EPS the
  // result is "balanced", not a type. This is the fix for "100% on all six".
  const TIE_EPS = 8;
  const answeredScores = Object.keys(quiz.dimensions)
    .filter((d) => counts[d] > 0)
    .map((d) => scores[d]);
  const maxScore = answeredScores.length ? Math.max(...answeredScores) : 0;
  const minScore = answeredScores.length ? Math.min(...answeredScores) : 0;
  const spread = maxScore - minScore;
  const tie = answeredScores.length <= 1 ? false : spread < TIE_EPS;

  // ─── Relative (ipsative) display scores ───────────────────────────────────
  // Interest inventories (positively-keyed, `scoring: 'relative'`) report each
  // dimension RELATIVE to the person's own range, so the profile always has a
  // shape — the strongest lands ~100, the weakest ~15, and "likes everything"
  // collapses to a flat mid-scale (never 100% across the board). The winner is
  // unchanged (min-max is order-preserving).
  let displayScores = scores;
  if (quiz.scoring === 'relative') {
    displayScores = {};
    for (const dim of Object.keys(quiz.dimensions)) {
      if (counts[dim] === 0) { displayScores[dim] = 0; continue; }
      displayScores[dim] = spread > 0
        ? Math.round(15 + ((scores[dim] - minScore) / spread) * 85)
        : 50;
    }
  }

  if (quiz.bands?.length) {
    // Bands are declared in ascending `min` order; the last one at or below
    // the overall percentage wins.
    let band = quiz.bands[0];
    let bandIndex = 0;
    quiz.bands.forEach((b, i) => {
      if (overallPct >= b.min) {
        band = b;
        bandIndex = i;
      }
    });
    return {
      mode: 'likert',
      resultKey: band.key ?? `band_${bandIndex}`,
      result: band,
      scores,
      overallPct,
    };
  }

  // Winner is the highest ABSOLUTE dimension (order matches displayScores).
  let topDim = Object.keys(quiz.dimensions)[0];
  for (const dim of Object.keys(quiz.dimensions)) {
    if (scores[dim] > scores[topDim]) topDim = dim;
  }

  return {
    mode: 'likert',
    resultKey: topDim,
    result: quiz.results[topDim],
    scores: displayScores,
    rawScores: scores,
    overallPct,
    spread,
    tie,
  };
}

/**
 * Compute the outcome of a catalog quiz.
 * @param {object} quiz    - quiz definition (see src/data/quizzes/index.js spec)
 * @param {object} answers - QuizShell answers map: { [questionId]: { value } }
 * @returns {{ mode, resultKey, result, scores, overallPct? , raw? }}
 */
export function computeQuizResult(quiz, answers) {
  return quiz.mode === 'likert' ? computeLikert(quiz, answers) : computePick(quiz, answers);
}
