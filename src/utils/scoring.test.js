import { describe, it, expect, beforeAll } from 'vitest';
import { optionToAdjustment, computeBaselineScores } from './scoring.js';

// Minimal stub questions: one normal and one reversed per trait, mirroring the
// real baselineQuestions shape so computeBaselineScores can find reversed flags.
const stubQuestions = [
  { id: 1, trait: 'O', reversed: false },
  { id: 2, trait: 'O', reversed: true },
  { id: 3, trait: 'C', reversed: false },
  { id: 4, trait: 'E', reversed: false },
  { id: 5, trait: 'A', reversed: false },
  { id: 6, trait: 'N', reversed: false },
];

// ─────────────────────────────────────────────
// optionToAdjustment
// ─────────────────────────────────────────────
describe('optionToAdjustment', () => {
  it('maps value 1 to -4', () => {
    expect(optionToAdjustment(1)).toBe(-4);
  });

  it('maps value 2 to -2', () => {
    expect(optionToAdjustment(2)).toBe(-2);
  });

  it('maps value 3 to +2', () => {
    expect(optionToAdjustment(3)).toBe(2);
  });

  it('maps value 4 to +4', () => {
    expect(optionToAdjustment(4)).toBe(4);
  });

  it('returns 0 for an unrecognised value', () => {
    expect(optionToAdjustment(99)).toBe(0);
    expect(optionToAdjustment(0)).toBe(0);
    expect(optionToAdjustment(undefined)).toBe(0);
  });
});

// ─────────────────────────────────────────────
// computeBaselineScores – scale boundaries
// ─────────────────────────────────────────────
describe('computeBaselineScores – scale boundaries', () => {
  it('converts a Likert 1 (strongly disagree) to score 0', () => {
    const answers = { 1: { trait: 'O', value: 1 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    // avg = 1 → ((1-1)/4)*100 = 0
    expect(scores.O).toBe(0);
  });

  it('converts a Likert 5 (strongly agree) to score 100', () => {
    const answers = { 1: { trait: 'O', value: 5 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    // avg = 5 → ((5-1)/4)*100 = 100
    expect(scores.O).toBe(100);
  });

  it('converts a Likert 3 (neutral) to score 50', () => {
    const answers = { 1: { trait: 'O', value: 3 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    // avg = 3 → ((3-1)/4)*100 = 50
    expect(scores.O).toBe(50);
  });

  it('converts Likert 2 to score 25', () => {
    const answers = { 1: { trait: 'O', value: 2 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    // avg = 2 → ((2-1)/4)*100 = 25
    expect(scores.O).toBe(25);
  });

  it('converts Likert 4 to score 75', () => {
    const answers = { 1: { trait: 'O', value: 4 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    // avg = 4 → ((4-1)/4)*100 = 75
    expect(scores.O).toBe(75);
  });
});

// ─────────────────────────────────────────────
// computeBaselineScores – reversed questions
// ─────────────────────────────────────────────
describe('computeBaselineScores – reversed questions', () => {
  it('flips a reversed question: value 2 becomes adjusted 4, yielding score 75', () => {
    // question id 2 has reversed: true
    // adjusted = 6 - 2 = 4  →  score = ((4-1)/4)*100 = 75
    const answers = { 2: { trait: 'O', value: 2 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    expect(scores.O).toBe(75);
  });

  it('flips a reversed question: value 5 becomes adjusted 1, yielding score 0', () => {
    // adjusted = 6 - 5 = 1  →  score = 0
    const answers = { 2: { trait: 'O', value: 5 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    expect(scores.O).toBe(0);
  });

  it('flips a reversed question: value 1 becomes adjusted 5, yielding score 100', () => {
    // adjusted = 6 - 1 = 5  →  score = 100
    const answers = { 2: { trait: 'O', value: 1 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    expect(scores.O).toBe(100);
  });

  it('does not flip a non-reversed question', () => {
    // question id 1 has reversed: false – value should pass through unchanged
    const answers = { 1: { trait: 'O', value: 2 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    expect(scores.O).toBe(25);
  });
});

// ─────────────────────────────────────────────
// computeBaselineScores – multi-question averaging
// ─────────────────────────────────────────────
describe('computeBaselineScores – multi-question averaging', () => {
  it('averages multiple answers for the same trait', () => {
    // Q1 (not reversed): value 1 → adjusted 1
    // Q2 (reversed):     value 1 → adjusted 5
    // avg = (1 + 5) / 2 = 3  →  score = 50
    const answers = {
      1: { trait: 'O', value: 1 },
      2: { trait: 'O', value: 1 },
    };
    const scores = computeBaselineScores(answers, stubQuestions);
    expect(scores.O).toBe(50);
  });

  it('calculates each trait independently', () => {
    const answers = {
      1: { trait: 'O', value: 5 }, // O → 100
      3: { trait: 'C', value: 1 }, // C → 0
      4: { trait: 'E', value: 3 }, // E → 50
    };
    const scores = computeBaselineScores(answers, stubQuestions);
    expect(scores.O).toBe(100);
    expect(scores.C).toBe(0);
    expect(scores.E).toBe(50);
    expect(scores.A).toBeUndefined(); // no A answer provided
  });

  it('rounds fractional scores correctly', () => {
    // Q1 (not reversed): value 2 → 2; Q2 (reversed): value 3 → 6-3=3
    // avg = (2 + 3) / 2 = 2.5  →  ((2.5-1)/4)*100 = 37.5  →  rounds to 38
    const answers = {
      1: { trait: 'O', value: 2 },
      2: { trait: 'O', value: 3 },
    };
    const scores = computeBaselineScores(answers, stubQuestions);
    expect(scores.O).toBe(38);
  });
});

// ─────────────────────────────────────────────
// computeBaselineScores – real baselineQuestions
// ─────────────────────────────────────────────
describe('computeBaselineScores – with real baselineQuestions', () => {
  // Import here so we test against the actual data file, not stubs.
  let baselineQuestions;

  beforeAll(async () => {
    ({ baselineQuestions } = await import('../data/baselineQuestions.js'));
  });

  it('produces a score of 100 for a trait when all 5 questions answered 5', () => {
    // All O questions: ids 1, 6, 11, 16, 21
    // Q6 (reversed): value 5 → adjusted 1; Q16 (reversed): value 5 → adjusted 1
    // Non-reversed (1,11,21): value 5 → adjusted 5
    // To get 100 we need avg=5 for all, so reversed questions need value 1
    const answers = {
      1:  { trait: 'O', value: 5 },
      6:  { trait: 'O', value: 1 }, // reversed → adjusted 5
      11: { trait: 'O', value: 5 },
      16: { trait: 'O', value: 1 }, // reversed → adjusted 5
      21: { trait: 'O', value: 5 },
    };
    const scores = computeBaselineScores(answers, baselineQuestions);
    expect(scores.O).toBe(100);
  });

  it('produces a score of 0 for a trait when all 5 questions answered at the minimum', () => {
    // Non-reversed: value 1 → adjusted 1; Reversed: value 5 → adjusted 1
    const answers = {
      1:  { trait: 'O', value: 1 },
      6:  { trait: 'O', value: 5 }, // reversed → adjusted 1
      11: { trait: 'O', value: 1 },
      16: { trait: 'O', value: 5 }, // reversed → adjusted 1
      21: { trait: 'O', value: 1 },
    };
    const scores = computeBaselineScores(answers, baselineQuestions);
    expect(scores.O).toBe(0);
  });

  it('produces a score of 50 for a trait when all answers are neutral (3)', () => {
    // reversed: 6-3=3; non-reversed: 3 → avg=3 → score=50
    const answers = {
      1:  { trait: 'O', value: 3 },
      6:  { trait: 'O', value: 3 },
      11: { trait: 'O', value: 3 },
      16: { trait: 'O', value: 3 },
      21: { trait: 'O', value: 3 },
    };
    const scores = computeBaselineScores(answers, baselineQuestions);
    expect(scores.O).toBe(50);
  });
});
