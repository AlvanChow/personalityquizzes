import { describe, it, expect } from 'vitest';
import { enneagramQuestions } from './enneagramQuestions.js';

const VALID_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

describe('enneagramQuestions – structure', () => {
  it('contains exactly 27 questions', () => {
    expect(enneagramQuestions).toHaveLength(27);
  });

  it('every question has a numeric id', () => {
    enneagramQuestions.forEach((q) => {
      expect(typeof q.id).toBe('number');
    });
  });

  it('question ids are unique and span 1–27', () => {
    const ids = enneagramQuestions.map((q) => q.id).sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 27 }, (_, i) => i + 1));
  });

  it('every question has a non-empty text string', () => {
    enneagramQuestions.forEach((q) => {
      expect(typeof q.text).toBe('string');
      expect(q.text.trim().length).toBeGreaterThan(0);
    });
  });

  it('every question has a valid Enneagram type trait (1–9)', () => {
    enneagramQuestions.forEach((q) => {
      expect(VALID_TYPES).toContain(q.trait);
    });
  });

  it('every question has exactly 4 options', () => {
    enneagramQuestions.forEach((q) => {
      expect(q.options).toHaveLength(4);
    });
  });

  it('every option has a value of 1, 2, 3 or 4', () => {
    enneagramQuestions.forEach((q) => {
      const values = q.options.map((o) => o.value).sort();
      expect(values).toEqual([1, 2, 3, 4]);
    });
  });

  it('every option has a non-empty label', () => {
    enneagramQuestions.forEach((q) => {
      q.options.forEach((o) => {
        expect(typeof o.label).toBe('string');
        expect(o.label.trim().length).toBeGreaterThan(0);
      });
    });
  });
});

describe('enneagramQuestions – type distribution', () => {
  it('has exactly 3 questions per type', () => {
    const counts = Object.fromEntries(VALID_TYPES.map((t) => [t, 0]));
    enneagramQuestions.forEach((q) => { counts[q.trait]++; });
    VALID_TYPES.forEach((t) => {
      expect(counts[t]).toBe(3);
    });
  });
});
