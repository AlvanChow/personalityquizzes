import { describe, it, expect } from 'vitest';
import { cakeResults, getCakeResult, cakeResultNameToKey } from './cakeResults.js';

const EXPECTED_KEYS = ['layercake', 'cupcake', 'macaron', 'strawberrycake', 'rollcake', 'tiramisu'];

// ─────────────────────────────────────────────
// cakeResults – data integrity
// ─────────────────────────────────────────────
describe('cakeResults – data integrity', () => {
  it('contains exactly 6 result entries', () => {
    expect(Object.keys(cakeResults)).toHaveLength(6);
  });

  it('contains all expected result keys', () => {
    EXPECTED_KEYS.forEach((key) => {
      expect(cakeResults).toHaveProperty(key);
    });
  });

  it('every result has required fields (name, emoji, color, accent, description, trait, competency, tagline)', () => {
    EXPECTED_KEYS.forEach((key) => {
      const result = cakeResults[key];
      expect(typeof result.name, `${key}.name`).toBe('string');
      expect(result.name.trim().length, `${key}.name non-empty`).toBeGreaterThan(0);
      expect(typeof result.emoji, `${key}.emoji`).toBe('string');
      expect(typeof result.color, `${key}.color`).toBe('string');
      expect(typeof result.accent, `${key}.accent`).toBe('string');
      expect(typeof result.description, `${key}.description`).toBe('string');
      expect(result.description.trim().length, `${key}.description non-empty`).toBeGreaterThan(0);
      expect(typeof result.trait, `${key}.trait`).toBe('string');
      expect(typeof result.competency, `${key}.competency`).toBe('string');
      expect(typeof result.tagline, `${key}.tagline`).toBe('string');
    });
  });
});

// ─────────────────────────────────────────────
// cakeResultNameToKey – reverse lookup
// ─────────────────────────────────────────────
describe('cakeResultNameToKey – reverse lookup', () => {
  it('maps every result name back to its key', () => {
    EXPECTED_KEYS.forEach((key) => {
      const name = cakeResults[key].name;
      expect(cakeResultNameToKey[name]).toBe(key);
    });
  });

  it('contains exactly 6 entries', () => {
    expect(Object.keys(cakeResultNameToKey)).toHaveLength(6);
  });
});

// ─────────────────────────────────────────────
// getCakeResult – each competency result is reachable
// ─────────────────────────────────────────────
describe('getCakeResult – competency-dominant results', () => {
  const competencyToKey = {
    AO:  'layercake',
    PS:  'cupcake',
    IN:  'macaron',
    TM:  'strawberrycake',
    AD:  'rollcake',
    INF: 'tiramisu',
  };

  Object.entries(competencyToKey).forEach(([competency, expectedKey]) => {
    it(`returns ${expectedKey} when ${competency} clearly dominates`, () => {
      const scores = { AO: 2, PS: 2, IN: 2, TM: 2, AD: 2, INF: 2 };
      scores[competency] = 8;
      const result = getCakeResult(scores);
      expect(result).toBe(cakeResults[expectedKey]);
    });
  });

  it('returns the highest-scoring competency result when one is clearly ahead', () => {
    const scores = { AO: 8, PS: 4, IN: 3, TM: 2, AD: 2, INF: 2 };
    expect(getCakeResult(scores)).toBe(cakeResults.layercake);
  });

  it('all-zero scores returns first competency result (AO / layercake)', () => {
    const scores = { AO: 0, PS: 0, IN: 0, TM: 0, AD: 0, INF: 0 };
    expect(getCakeResult(scores)).toBe(cakeResults.layercake);
  });
});
