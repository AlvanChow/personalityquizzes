import { describe, it, expect } from 'vitest';
import { mbtiQuestions } from './mbtiQuestions.js';

const VALID_TRAITS = ['IE', 'SN', 'TF', 'JP'];

describe('mbtiQuestions – structure', () => {
  it('contains exactly 28 questions', () => {
    expect(mbtiQuestions).toHaveLength(28);
  });

  it('every question has a numeric id', () => {
    mbtiQuestions.forEach((q) => {
      expect(typeof q.id).toBe('number');
    });
  });

  it('question ids are unique and span 1–28', () => {
    const ids = mbtiQuestions.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 28 }, (_, i) => i + 1));
  });

  it('every question has a non-empty text string', () => {
    mbtiQuestions.forEach((q) => {
      expect(typeof q.text).toBe('string');
      expect(q.text.trim().length).toBeGreaterThan(0);
    });
  });

  it('every question has a valid MBTI dichotomy trait', () => {
    mbtiQuestions.forEach((q) => {
      expect(VALID_TRAITS).toContain(q.trait);
    });
  });

  it('every question has exactly 4 options', () => {
    mbtiQuestions.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('every option has a value of 1, 2, 3 or 4', () => {
    mbtiQuestions.forEach((q) => {
      const values = q.options.map((o) => o.value).sort();
      expect(values).toEqual([1, 2, 3, 4]);
    });
  });

  it('every option has a non-empty label', () => {
    mbtiQuestions.forEach((q) => {
      q.options.forEach((o) => {
        expect(typeof o.label).toBe('string');
        expect(o.label.trim().length).toBeGreaterThan(0);
      });
    });
  });
});

describe('mbtiQuestions – dichotomy distribution', () => {
  it('has exactly 7 questions per dichotomy', () => {
    const counts = { IE: 0, SN: 0, TF: 0, JP: 0 };
    mbtiQuestions.forEach((q) => { counts[q.trait]++; });
    VALID_TRAITS.forEach((t) => {
      expect(counts[t]).toBe(7);
    });
  });
});
