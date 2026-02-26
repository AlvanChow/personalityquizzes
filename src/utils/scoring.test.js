import { describe, it, expect, beforeAll } from 'vitest';
import {
  optionToAdjustment,
  computeBaselineScores,
  computeMBTIScores,
  computeEnneagramScores,
} from './scoring.js';

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

  it('produces a score of 100 for a trait when all 5 questions answered optimally', () => {
    // O questions: ids 21,22,23 (non-reversed), 24,25 (reversed)
    // Non-reversed: value 5 → adjusted 5; Reversed: value 1 → adjusted 5
    const answers = {
      21: { trait: 'O', value: 5 },
      22: { trait: 'O', value: 5 },
      23: { trait: 'O', value: 5 },
      24: { trait: 'O', value: 1 }, // reversed → adjusted 5
      25: { trait: 'O', value: 1 }, // reversed → adjusted 5
    };
    const scores = computeBaselineScores(answers, baselineQuestions);
    expect(scores.O).toBe(100);
  });

  it('produces a score of 0 for a trait when all 5 questions answered at the minimum', () => {
    // Non-reversed: value 1 → adjusted 1; Reversed: value 5 → adjusted 1
    const answers = {
      21: { trait: 'O', value: 1 },
      22: { trait: 'O', value: 1 },
      23: { trait: 'O', value: 1 },
      24: { trait: 'O', value: 5 }, // reversed → adjusted 1
      25: { trait: 'O', value: 5 }, // reversed → adjusted 1
    };
    const scores = computeBaselineScores(answers, baselineQuestions);
    expect(scores.O).toBe(0);
  });

  it('produces a score of 50 for a trait when all answers are neutral (3)', () => {
    // reversed: 6-3=3; non-reversed: 3 → avg=3 → score=50
    const answers = {
      21: { trait: 'O', value: 3 },
      22: { trait: 'O', value: 3 },
      23: { trait: 'O', value: 3 },
      24: { trait: 'O', value: 3 },
      25: { trait: 'O', value: 3 },
    };
    const scores = computeBaselineScores(answers, baselineQuestions);
    expect(scores.O).toBe(50);
  });
});

// ─────────────────────────────────────────────
// computeMBTIScores
// ─────────────────────────────────────────────
describe('computeMBTIScores – scale boundaries', () => {
  it('produces score 0 when all answers for a dimension are value 1', () => {
    // avg = 1  →  ((1-1)/3)*100 = 0
    const answers = {
      1: { trait: 'IE', value: 1 },
      2: { trait: 'IE', value: 1 },
    };
    const scores = computeMBTIScores(answers);
    expect(scores.IE).toBe(0);
  });

  it('produces score 100 when all answers for a dimension are value 4', () => {
    // avg = 4  →  ((4-1)/3)*100 = 100
    const answers = {
      1: { trait: 'IE', value: 4 },
      2: { trait: 'IE', value: 4 },
    };
    const scores = computeMBTIScores(answers);
    expect(scores.IE).toBe(100);
  });

  it('produces score 50 when all answers are value 2.5 average (mix of 2 and 3)', () => {
    // avg = (2+3)/2 = 2.5  →  ((2.5-1)/3)*100 = 50
    const answers = {
      1: { trait: 'SN', value: 2 },
      2: { trait: 'SN', value: 3 },
    };
    const scores = computeMBTIScores(answers);
    expect(scores.SN).toBe(50);
  });

  it('produces score 33 for a single value-2 answer', () => {
    // avg = 2  →  ((2-1)/3)*100 = 33.33  →  rounds to 33
    const answers = { 1: { trait: 'TF', value: 2 } };
    const scores = computeMBTIScores(answers);
    expect(scores.TF).toBe(33);
  });

  it('produces score 67 for a single value-3 answer', () => {
    // avg = 3  →  ((3-1)/3)*100 = 66.67  →  rounds to 67
    const answers = { 1: { trait: 'JP', value: 3 } };
    const scores = computeMBTIScores(answers);
    expect(scores.JP).toBe(67);
  });
});

describe('computeMBTIScores – all four dimensions isolated', () => {
  it('scores IE independently from SN, TF, JP', () => {
    const answers = {
      1: { trait: 'IE', value: 4 },
      2: { trait: 'SN', value: 1 },
      3: { trait: 'TF', value: 1 },
      4: { trait: 'JP', value: 1 },
    };
    const scores = computeMBTIScores(answers);
    expect(scores.IE).toBe(100);
    expect(scores.SN).toBe(0);
    expect(scores.TF).toBe(0);
    expect(scores.JP).toBe(0);
  });
});

// ─────────────────────────────────────────────
// computeEnneagramScores
// ─────────────────────────────────────────────
describe('computeEnneagramScores – accumulation', () => {
  it('sums values for each type independently', () => {
    const answers = {
      1: { trait: '1', value: 4 },
      2: { trait: '1', value: 3 },
      3: { trait: '2', value: 2 },
    };
    const scores = computeEnneagramScores(answers);
    expect(scores['1']).toBe(7);
    expect(scores['2']).toBe(2);
    expect(scores['3']).toBeUndefined();
  });

  it('returns 0 accumulation start (no pre-seeding)', () => {
    const answers = { 1: { trait: '9', value: 1 } };
    const scores = computeEnneagramScores(answers);
    expect(scores['9']).toBe(1);
    expect(scores['1']).toBeUndefined();
  });

  it('handles the maximum possible score per type (3 questions × 4 = 12)', () => {
    const answers = {
      1: { trait: '5', value: 4 },
      2: { trait: '5', value: 4 },
      3: { trait: '5', value: 4 },
    };
    const scores = computeEnneagramScores(answers);
    expect(scores['5']).toBe(12);
  });

  it('handles all 9 types with distinct scores', () => {
    const answers = {};
    for (let t = 1; t <= 9; t++) {
      answers[t] = { trait: String(t), value: t === 9 ? 4 : 1 };
    }
    const scores = computeEnneagramScores(answers);
    expect(scores['9']).toBe(4);
    for (let t = 1; t <= 8; t++) {
      expect(scores[String(t)]).toBe(1);
    }
  });
});

// ─────────────────────────────────────────────
// computeBaselineScores – incomplete / missing traits
// ─────────────────────────────────────────────
describe('computeBaselineScores – incomplete/missing traits', () => {
  it('returns an empty object when answers is empty', () => {
    const scores = computeBaselineScores({}, stubQuestions);
    expect(scores).toEqual({});
  });

  it('omits traits that have no answers', () => {
    // Only O answered; C, E, A, N should be absent
    const answers = { 1: { trait: 'O', value: 3 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    expect(scores).toHaveProperty('O');
    expect(scores).not.toHaveProperty('C');
    expect(scores).not.toHaveProperty('E');
    expect(scores).not.toHaveProperty('A');
    expect(scores).not.toHaveProperty('N');
  });

  it('treats an unmatched question id (not in questions array) as non-reversed', () => {
    // qId 999 is not in stubQuestions; q?.reversed is undefined → falsy → no flip
    const answers = { 999: { trait: 'O', value: 2 } };
    const scores = computeBaselineScores(answers, stubQuestions);
    // adjusted = 2 (no flip) → score = 25
    expect(scores.O).toBe(25);
  });
});

// ─────────────────────────────────────────────
// computeMBTIScores – missing dimensions
// ─────────────────────────────────────────────
describe('computeMBTIScores – missing dimensions', () => {
  it('returns an empty object when answers is empty', () => {
    const scores = computeMBTIScores({});
    expect(scores).toEqual({});
  });

  it('omits dimensions that have no answers', () => {
    // Only IE answered
    const answers = { 1: { trait: 'IE', value: 2 } };
    const scores = computeMBTIScores(answers);
    expect(scores).toHaveProperty('IE');
    expect(scores).not.toHaveProperty('SN');
    expect(scores).not.toHaveProperty('TF');
    expect(scores).not.toHaveProperty('JP');
  });

  it('scores a single-question dimension correctly', () => {
    // avg = 1 → score = 0
    const answers = { 1: { trait: 'SN', value: 1 } };
    const scores = computeMBTIScores(answers);
    expect(scores.SN).toBe(0);
  });
});

// ─────────────────────────────────────────────
// computeEnneagramScores – missing types
// ─────────────────────────────────────────────
describe('computeEnneagramScores – missing types', () => {
  it('returns an empty object when answers is empty', () => {
    const scores = computeEnneagramScores({});
    expect(scores).toEqual({});
  });

  it('only includes types that have at least one answer', () => {
    // Only types '1' and '3' answered
    const answers = {
      1: { trait: '1', value: 3 },
      2: { trait: '3', value: 2 },
    };
    const scores = computeEnneagramScores(answers);
    expect(scores).toHaveProperty('1');
    expect(scores).toHaveProperty('3');
    // Types 2, 4-9 are not present
    ['2', '4', '5', '6', '7', '8', '9'].forEach((t) => {
      expect(scores).not.toHaveProperty(t);
    });
  });

  it('does not pre-seed any type to 0 (no zero-initialization)', () => {
    // A freshly returned scores object from a single-type input should
    // have exactly one key, not 9 keys with the rest being 0
    const answers = { 1: { trait: '5', value: 4 } };
    const scores = computeEnneagramScores(answers);
    expect(Object.keys(scores)).toHaveLength(1);
    expect(scores['5']).toBe(4);
  });
});
