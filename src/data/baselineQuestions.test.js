import { describe, it, expect } from 'vitest';
import { baselineQuestions, likertOptions } from './baselineQuestions.js';

const VALID_TRAITS = ['O', 'C', 'E', 'A', 'N'];

describe('baselineQuestions – structure', () => {
  it('contains exactly 25 questions', () => {
    expect(baselineQuestions).toHaveLength(25);
  });

  it('every question has a numeric id', () => {
    baselineQuestions.forEach((q) => {
      expect(typeof q.id).toBe('number');
    });
  });

  it('question ids are unique and span 1–25', () => {
    const ids = baselineQuestions.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 25 }, (_, i) => i + 1));
  });

  it('every question has a non-empty text string', () => {
    baselineQuestions.forEach((q) => {
      expect(typeof q.text).toBe('string');
      expect(q.text.trim().length).toBeGreaterThan(0);
    });
  });

  it('every question has a valid Big Five trait letter', () => {
    baselineQuestions.forEach((q) => {
      expect(VALID_TRAITS).toContain(q.trait);
    });
  });

  it('every question has a boolean reversed field', () => {
    baselineQuestions.forEach((q) => {
      expect(typeof q.reversed).toBe('boolean');
    });
  });
});

describe('baselineQuestions – trait distribution', () => {
  it('has exactly 5 questions per trait', () => {
    const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    baselineQuestions.forEach((q) => { counts[q.trait]++; });
    VALID_TRAITS.forEach((t) => {
      expect(counts[t]).toBe(5);
    });
  });

  it('has at least one reversed and one non-reversed question per trait', () => {
    VALID_TRAITS.forEach((trait) => {
      const forTrait = baselineQuestions.filter((q) => q.trait === trait);
      expect(forTrait.some((q) => q.reversed)).toBe(true);
      expect(forTrait.some((q) => !q.reversed)).toBe(true);
    });
  });
});

describe('likertOptions – structure', () => {
  it('contains exactly 5 options', () => {
    expect(likertOptions).toHaveLength(5);
  });

  it('option values are 1 through 5', () => {
    const values = likertOptions.map((o) => o.value).sort((a, b) => a - b);
    expect(values).toEqual([1, 2, 3, 4, 5]);
  });

  it('every option has a non-empty label', () => {
    likertOptions.forEach((o) => {
      expect(typeof o.label).toBe('string');
      expect(o.label.trim().length).toBeGreaterThan(0);
    });
  });
});
