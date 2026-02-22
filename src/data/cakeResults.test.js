import { describe, it, expect } from 'vitest';
import { cakeResults, getCakeResult, cakeResultNameToKey } from './cakeResults.js';

const EXPECTED_KEYS = ['funfetti', 'wedding', 'matcha', 'redvelvet', 'lava', 'chocolate'];

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

  it('every result has required fields (name, emoji, color, accent, description, trait)', () => {
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
// getCakeResult – each trait result is reachable
// ─────────────────────────────────────────────
describe('getCakeResult – trait-dominant results', () => {
  // Each case: one trait scores 40, all others score 0
  // 40 - 0 = 40 >= 10, so the dominant trait wins
  const traitToKey = {
    E: 'funfetti',
    C: 'wedding',
    O: 'matcha',
    A: 'redvelvet',
    N: 'lava',
  };

  Object.entries(traitToKey).forEach(([trait, expectedKey]) => {
    it(`returns ${expectedKey} when ${trait} clearly dominates`, () => {
      const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
      scores[trait] = 40;
      const result = getCakeResult(scores);
      expect(result).toBe(cakeResults[expectedKey]);
    });
  });
});

// ─────────────────────────────────────────────
// getCakeResult – balance result
// ─────────────────────────────────────────────
describe('getCakeResult – balance (chocolate)', () => {
  it('returns chocolate when max and second-max differ by exactly 9 (< 10)', () => {
    // maxScore=50, secondMax=41 → difference=9 → balance
    const scores = { O: 50, C: 41, E: 30, A: 20, N: 10 };
    const result = getCakeResult(scores);
    expect(result).toBe(cakeResults.chocolate);
  });

  it('returns chocolate when all traits are equal', () => {
    const scores = { O: 50, C: 50, E: 50, A: 50, N: 50 };
    const result = getCakeResult(scores);
    expect(result).toBe(cakeResults.chocolate);
  });

  it('returns the dominant trait result when scores differ by exactly 10', () => {
    // maxScore=50, secondMax=40 → difference=10 → NOT balance, dominant wins
    const scores = { O: 50, C: 40, E: 30, A: 20, N: 10 };
    const result = getCakeResult(scores);
    expect(result).toBe(cakeResults.matcha); // O maps to matcha
  });

  it('returns chocolate when two traits share the top and differ by 0', () => {
    const scores = { O: 60, C: 60, E: 20, A: 20, N: 20 };
    const result = getCakeResult(scores);
    expect(result).toBe(cakeResults.chocolate);
  });
});
