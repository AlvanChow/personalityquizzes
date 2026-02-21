import { describe, it, expect } from 'vitest';
import { enneagramResults, getEnneagramResult } from './enneagramResults.js';

const VALID_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

// ─────────────────────────────────────────────
// Data integrity
// ─────────────────────────────────────────────
describe('enneagramResults – data integrity', () => {
  it('contains exactly 9 type entries', () => {
    expect(Object.keys(enneagramResults)).toHaveLength(9);
  });

  it('contains all 9 type keys (strings "1" through "9")', () => {
    VALID_TYPES.forEach((t) => {
      expect(enneagramResults).toHaveProperty(t);
    });
  });

  it('every result has required fields', () => {
    VALID_TYPES.forEach((t) => {
      const result = enneagramResults[t];
      expect(typeof result.name, `${t}.name`).toBe('string');
      expect(result.name.trim().length, `${t}.name non-empty`).toBeGreaterThan(0);
      expect(typeof result.nickname, `${t}.nickname`).toBe('string');
      expect(result.nickname.trim().length, `${t}.nickname non-empty`).toBeGreaterThan(0);
      expect(result.typeNumber, `${t}.typeNumber`).toBe(t);
      expect(typeof result.emoji, `${t}.emoji`).toBe('string');
      expect(typeof result.color, `${t}.color`).toBe('string');
      expect(typeof result.accent, `${t}.accent`).toBe('string');
      expect(typeof result.description, `${t}.description`).toBe('string');
      expect(result.description.trim().length, `${t}.description non-empty`).toBeGreaterThan(0);
      expect(typeof result.coreDesire, `${t}.coreDesire`).toBe('string');
      expect(result.coreDesire.trim().length, `${t}.coreDesire non-empty`).toBeGreaterThan(0);
      expect(typeof result.coreFear, `${t}.coreFear`).toBe('string');
      expect(result.coreFear.trim().length, `${t}.coreFear non-empty`).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────
// getEnneagramResult – each type is reachable
// ─────────────────────────────────────────────
describe('getEnneagramResult – each type wins when it has the highest score', () => {
  VALID_TYPES.forEach((winningType) => {
    it(`returns type ${winningType} when type ${winningType} has the highest score`, () => {
      const scores = Object.fromEntries(VALID_TYPES.map((t) => [t, 3]));
      scores[winningType] = 12; // clearly dominant
      const result = getEnneagramResult(scores);
      expect(result.typeNumber).toBe(winningType);
    });
  });
});

// ─────────────────────────────────────────────
// getEnneagramResult – tie-breaking
// ─────────────────────────────────────────────
describe('getEnneagramResult – tie-breaking', () => {
  it('returns the lower type number when two types are tied', () => {
    const scores = Object.fromEntries(VALID_TYPES.map((t) => [t, 3]));
    scores['3'] = 10;
    scores['7'] = 10;
    const result = getEnneagramResult(scores);
    expect(result.typeNumber).toBe('3');
  });

  it('returns type 1 when all types are tied', () => {
    const scores = Object.fromEntries(VALID_TYPES.map((t) => [t, 6]));
    const result = getEnneagramResult(scores);
    expect(result.typeNumber).toBe('1');
  });

  it('returns type 1 when type 1 is tied at the top with type 9', () => {
    const scores = Object.fromEntries(VALID_TYPES.map((t) => [t, 3]));
    scores['1'] = 12;
    scores['9'] = 12;
    const result = getEnneagramResult(scores);
    expect(result.typeNumber).toBe('1');
  });
});

// ─────────────────────────────────────────────
// getEnneagramResult – handles missing scores
// ─────────────────────────────────────────────
describe('getEnneagramResult – missing scores', () => {
  it('defaults missing type scores to 0 and picks the highest present', () => {
    const scores = { '5': 9 }; // only type 5 provided
    const result = getEnneagramResult(scores);
    expect(result.typeNumber).toBe('5');
  });
});
