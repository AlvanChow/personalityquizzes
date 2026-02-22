import { describe, it, expect } from 'vitest';
import { cakeQuestions } from './cakeQuestions.js';

const VALID_TRAITS = ['E', 'C', 'O', 'N', 'A'];

describe('cakeQuestions – structure', () => {
  it('contains exactly 10 questions', () => {
    expect(cakeQuestions).toHaveLength(10);
  });

  it('every question has a numeric id', () => {
    cakeQuestions.forEach((q) => {
      expect(typeof q.id).toBe('number');
    });
  });

  it('question ids are unique and span 1–10', () => {
    const ids = cakeQuestions.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 10 }, (_, i) => i + 1));
  });

  it('every question has a non-empty text string', () => {
    cakeQuestions.forEach((q) => {
      expect(typeof q.text).toBe('string');
      expect(q.text.trim().length).toBeGreaterThan(0);
    });
  });

  it('every question has a valid Big Five trait letter', () => {
    cakeQuestions.forEach((q) => {
      expect(VALID_TRAITS).toContain(q.trait);
    });
  });

  it('every question has exactly 4 options', () => {
    cakeQuestions.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('every option has a value of 1, 2, 3 or 4', () => {
    cakeQuestions.forEach((q) => {
      const values = q.options.map((o) => o.value).sort((a, b) => a - b);
      expect(values).toEqual([1, 2, 3, 4]);
    });
  });

  it('every option has a non-empty label', () => {
    cakeQuestions.forEach((q) => {
      q.options.forEach((o) => {
        expect(typeof o.label).toBe('string');
        expect(o.label.trim().length).toBeGreaterThan(0);
      });
    });
  });
});

describe('cakeQuestions – trait distribution', () => {
  it('has exactly 2 questions per trait', () => {
    const counts = Object.fromEntries(VALID_TRAITS.map((t) => [t, 0]));
    cakeQuestions.forEach((q) => { counts[q.trait]++; });
    VALID_TRAITS.forEach((t) => {
      expect(counts[t]).toBe(2);
    });
  });
});
