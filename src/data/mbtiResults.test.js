import { describe, it, expect } from 'vitest';
import { mbtiResults, getMBTIResult } from './mbtiResults.js';

const ALL_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

// ─────────────────────────────────────────────
// Data integrity
// ─────────────────────────────────────────────
describe('mbtiResults – data integrity', () => {
  it('contains exactly 16 type entries', () => {
    expect(Object.keys(mbtiResults)).toHaveLength(16);
  });

  it('contains all 16 expected type keys', () => {
    ALL_TYPES.forEach((type) => {
      expect(mbtiResults).toHaveProperty(type);
    });
  });

  it('every result has required fields', () => {
    Object.entries(mbtiResults).forEach(([type, result]) => {
      expect(result.name, `${type}.name`).toBe(type);
      expect(typeof result.nickname, `${type}.nickname`).toBe('string');
      expect(result.nickname.trim().length, `${type}.nickname non-empty`).toBeGreaterThan(0);
      expect(typeof result.emoji, `${type}.emoji`).toBe('string');
      expect(typeof result.color, `${type}.color`).toBe('string');
      expect(typeof result.accent, `${type}.accent`).toBe('string');
      expect(typeof result.description, `${type}.description`).toBe('string');
      expect(result.description.trim().length, `${type}.description non-empty`).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────
// getMBTIResult – dimension thresholds
// ─────────────────────────────────────────────
describe('getMBTIResult – I vs E threshold', () => {
  it('returns an I type when IE score is 0', () => {
    const result = getMBTIResult({ IE: 0, SN: 0, TF: 0, JP: 0 });
    expect(result.name[0]).toBe('I');
  });

  it('returns an I type when IE score is 49', () => {
    const result = getMBTIResult({ IE: 49, SN: 0, TF: 0, JP: 0 });
    expect(result.name[0]).toBe('I');
  });

  it('returns an E type when IE score is 50', () => {
    const result = getMBTIResult({ IE: 50, SN: 0, TF: 0, JP: 0 });
    expect(result.name[0]).toBe('E');
  });

  it('returns an E type when IE score is 100', () => {
    const result = getMBTIResult({ IE: 100, SN: 0, TF: 0, JP: 0 });
    expect(result.name[0]).toBe('E');
  });
});

describe('getMBTIResult – S vs N threshold', () => {
  it('returns an xSxx type when SN score is 49', () => {
    const result = getMBTIResult({ IE: 0, SN: 49, TF: 0, JP: 0 });
    expect(result.name[1]).toBe('S');
  });

  it('returns an xNxx type when SN score is 50', () => {
    const result = getMBTIResult({ IE: 0, SN: 50, TF: 0, JP: 0 });
    expect(result.name[1]).toBe('N');
  });
});

describe('getMBTIResult – T vs F threshold', () => {
  it('returns an xxTx type when TF score is 49', () => {
    const result = getMBTIResult({ IE: 0, SN: 0, TF: 49, JP: 0 });
    expect(result.name[2]).toBe('T');
  });

  it('returns an xxFx type when TF score is 50', () => {
    const result = getMBTIResult({ IE: 0, SN: 0, TF: 50, JP: 0 });
    expect(result.name[2]).toBe('F');
  });
});

describe('getMBTIResult – J vs P threshold', () => {
  it('returns an xxxJ type when JP score is 49', () => {
    const result = getMBTIResult({ IE: 0, SN: 0, TF: 0, JP: 49 });
    expect(result.name[3]).toBe('J');
  });

  it('returns an xxxP type when JP score is 50', () => {
    const result = getMBTIResult({ IE: 0, SN: 0, TF: 0, JP: 50 });
    expect(result.name[3]).toBe('P');
  });
});

// ─────────────────────────────────────────────
// getMBTIResult – all 16 types reachable
// ─────────────────────────────────────────────
describe('getMBTIResult – all 16 types are reachable', () => {
  const I = 0, E = 100, S = 0, N = 100, T = 0, F = 100, J = 0, P = 100;

  const cases = [
    ['INTJ', { IE: I, SN: N, TF: T, JP: J }],
    ['INTP', { IE: I, SN: N, TF: T, JP: P }],
    ['ENTJ', { IE: E, SN: N, TF: T, JP: J }],
    ['ENTP', { IE: E, SN: N, TF: T, JP: P }],
    ['INFJ', { IE: I, SN: N, TF: F, JP: J }],
    ['INFP', { IE: I, SN: N, TF: F, JP: P }],
    ['ENFJ', { IE: E, SN: N, TF: F, JP: J }],
    ['ENFP', { IE: E, SN: N, TF: F, JP: P }],
    ['ISTJ', { IE: I, SN: S, TF: T, JP: J }],
    ['ISFJ', { IE: I, SN: S, TF: F, JP: J }],
    ['ESTJ', { IE: E, SN: S, TF: T, JP: J }],
    ['ESFJ', { IE: E, SN: S, TF: F, JP: J }],
    ['ISTP', { IE: I, SN: S, TF: T, JP: P }],
    ['ISFP', { IE: I, SN: S, TF: F, JP: P }],
    ['ESTP', { IE: E, SN: S, TF: T, JP: P }],
    ['ESFP', { IE: E, SN: S, TF: F, JP: P }],
  ];

  cases.forEach(([expectedType, scores]) => {
    it(`produces ${expectedType}`, () => {
      const result = getMBTIResult(scores);
      expect(result.name).toBe(expectedType);
    });
  });
});
