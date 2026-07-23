import { afterEach, describe, it, expect, vi } from 'vitest';
import {
  computeCompatibility,
  getPendingCompare,
  savePendingCompare,
} from './compatibility.js';
import { mbtiResults } from '../data/mbtiResults.js';

const MBTI_TYPES = Object.keys(mbtiResults);
const ENNEA_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const CAKE_TRAITS = ['AO', 'PS', 'IN', 'TM', 'AD', 'INF'];
const HOUSES = ['gryffindor', 'hufflepuff', 'ravenclaw', 'slytherin'];

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('computeCompatibility', () => {
  it('returns null for missing inputs or unknown quiz types', () => {
    expect(computeCompatibility('mbti', null, 'INTJ')).toBeNull();
    expect(computeCompatibility('mbti', 'INTJ', null)).toBeNull();
    expect(computeCompatibility('big5', 'x', 'y')).toBeNull();
    expect(computeCompatibility('house', 'gryffindor', 'durmstrang')).toBeNull();
  });

  it('MBTI: every pair scores in [0,100], is symmetric, and has 4 dimensions', () => {
    for (const a of MBTI_TYPES) {
      for (const b of MBTI_TYPES) {
        const ab = computeCompatibility('mbti', a, b);
        const ba = computeCompatibility('mbti', b, a);
        expect(ab.score).toBeGreaterThanOrEqual(0);
        expect(ab.score).toBeLessThanOrEqual(100);
        expect(ab.score).toBe(ba.score);
        expect(ab.dimensions).toHaveLength(4);
        expect(typeof ab.title).toBe('string');
        for (const d of ab.dimensions) expect(typeof d.text).toBe('string');
      }
    }
  });

  it('MBTI: identical types score higher than full opposites', () => {
    const same = computeCompatibility('mbti', 'INTJ', 'INTJ');
    const opposite = computeCompatibility('mbti', 'INTJ', 'ESFP');
    expect(same.score).toBeGreaterThan(opposite.score);
  });

  it('Enneagram: all 81 pairs score in [0,100] and are symmetric', () => {
    for (const a of ENNEA_TYPES) {
      for (const b of ENNEA_TYPES) {
        const ab = computeCompatibility('enneagram', a, b);
        const ba = computeCompatibility('enneagram', b, a);
        expect(ab.score).toBeGreaterThanOrEqual(0);
        expect(ab.score).toBeLessThanOrEqual(100);
        expect(ab.score).toBe(ba.score);
        expect(ab.dimensions.length).toBeGreaterThan(0);
      }
    }
  });

  it('Cake: all pairs score in [0,100] and are symmetric', () => {
    for (const a of CAKE_TRAITS) {
      for (const b of CAKE_TRAITS) {
        const ab = computeCompatibility('cake', a, b);
        const ba = computeCompatibility('cake', b, a);
        expect(ab.score).toBeGreaterThanOrEqual(0);
        expect(ab.score).toBeLessThanOrEqual(100);
        expect(ab.score).toBe(ba.score);
      }
    }
  });

  it('House: all pairs score in [0,100], symmetric, same house scores highest', () => {
    for (const a of HOUSES) {
      for (const b of HOUSES) {
        const ab = computeCompatibility('house', a, b);
        const ba = computeCompatibility('house', b, a);
        expect(ab.score).toBeGreaterThanOrEqual(0);
        expect(ab.score).toBeLessThanOrEqual(100);
        expect(ab.score).toBe(ba.score);
        if (a === b) expect(ab.score).toBe(90);
        else expect(ab.score).toBeLessThan(90);
      }
    }
  });

  it('always returns a headline title and emoji', () => {
    const res = computeCompatibility('enneagram', '4', '9');
    expect(res.title.length).toBeGreaterThan(0);
    expect(res.emoji.length).toBeGreaterThan(0);
  });
});

describe('pending comparison', () => {
  it('preserves a complete 128-bit share ID', () => {
    const values = new Map();
    vi.stubGlobal('sessionStorage', {
      getItem: (key) => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value),
      removeItem: (key) => values.delete(key),
    });
    const shareId = '0123456789abcdef0123456789abcdef';

    savePendingCompare(shareId, 'mbti', 'A friend');

    expect(getPendingCompare('mbti')).toEqual({
      shareId,
      quizType: 'mbti',
      friendName: 'A friend',
    });
  });
});
