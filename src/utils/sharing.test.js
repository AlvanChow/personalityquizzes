import { describe, it, expect } from 'vitest';
import { buildShareSnapshot, generateShareId } from './sharing.js';
import { mbtiResults } from '../data/mbtiResults.js';
import { enneagramResults } from '../data/enneagramResults.js';
import { cakeResults } from '../data/cakeResults.js';

// The DB INSERT policy caps result_data at 4096 bytes of jsonb text. jsonb's
// text form adds separators/spaces, so keep compact-JSON snapshots well under
// the cap to leave headroom.
const SNAPSHOT_BYTE_BUDGET = 3500;

const SAMPLE_SCORES = {
  mbti: { IE: 72, SN: 31, TF: 55, JP: 48 },
  enneagram: { 1: 4, 2: 6, 3: 8, 4: 12, 5: 7, 6: 5, 7: 9, 8: 3, 9: 6 },
  cake: { AO: 8, PS: 6, IN: 4, TM: 7, AD: 5, INF: 3 },
};

describe('buildShareSnapshot', () => {
  it('every MBTI result snapshot fits the DB size budget', () => {
    for (const [key, result] of Object.entries(mbtiResults)) {
      const snap = buildShareSnapshot(result, SAMPLE_SCORES.mbti);
      const size = new TextEncoder().encode(JSON.stringify(snap)).length;
      expect(size, `${key} snapshot is ${size} bytes`).toBeLessThanOrEqual(SNAPSHOT_BYTE_BUDGET);
      expect(snap.name).toBe(result.name);
      expect(snap.scores).toEqual(SAMPLE_SCORES.mbti);
    }
  });

  it('every Enneagram and Cake snapshot fits the budget and keeps identity fields', () => {
    for (const result of Object.values(enneagramResults)) {
      const snap = buildShareSnapshot(result, SAMPLE_SCORES.enneagram);
      expect(new TextEncoder().encode(JSON.stringify(snap)).length).toBeLessThanOrEqual(SNAPSHOT_BYTE_BUDGET);
      expect(snap.typeNumber).toBe(result.typeNumber);
    }
    for (const result of Object.values(cakeResults)) {
      const snap = buildShareSnapshot(result, SAMPLE_SCORES.cake);
      expect(new TextEncoder().encode(JSON.stringify(snap)).length).toBeLessThanOrEqual(SNAPSHOT_BYTE_BUDGET);
      expect(snap.trait).toBe(result.trait);
    }
  });

  it('drops malformed score keys and non-finite values', () => {
    const snap = buildShareSnapshot(
      { name: 'X', emoji: '✨' },
      { OK: 5, 'bad key!': 9, huge: Infinity, nan: NaN },
    );
    expect(snap.scores).toEqual({ OK: 5 });
  });

  it('tolerates hostile/oversized inputs without exceeding limits', () => {
    const hostile = {
      name: 'a'.repeat(10000),
      emoji: '🔥'.repeat(500),
      description: 'x'.repeat(50000),
      color: 'z'.repeat(500),
      accent: 'z'.repeat(500),
    };
    const snap = buildShareSnapshot(hostile, null);
    expect(snap.name.length).toBeLessThanOrEqual(100);
    expect(snap.emoji.length).toBeLessThanOrEqual(16);
    expect(new TextEncoder().encode(JSON.stringify(snap)).length).toBeLessThanOrEqual(2000);
  });
});

describe('generateShareId', () => {
  it('produces a 128-bit lowercase hex token by default', () => {
    for (let i = 0; i < 20; i++) {
      expect(generateShareId()).toMatch(/^[a-f0-9]{32}$/);
    }
  });

  it('can produce a legacy 32-bit token during a safe database rollout', () => {
    expect(generateShareId(4)).toMatch(/^[a-f0-9]{8}$/);
  });

  it('rejects unsafe token sizes', () => {
    expect(() => generateShareId(3)).toThrow(RangeError);
  });
});
