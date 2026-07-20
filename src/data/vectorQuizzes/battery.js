// Shared Monte-Carlo verification battery for vector quizzes.
//
// Same methodology the original Naruto build shipped with: structural
// integrity of the roster, then simulation-measured properties of the
// matching engine itself. Import registerBattery(def, options) from a quiz's
// test file — every roster or question edit re-runs the full battery in CI.

/* eslint-disable no-undef -- vitest globals are injected by the test runner */
import { describe, it, expect } from 'vitest';
import { G, emblem } from './glyphs';
import { userVector, magOf, ranked } from '../../utils/vectorQuiz';

const LIKERT = [-1, -0.5, 0, 0.5, 1];

// Deterministic RNG (mulberry32) so simulation results are reproducible.
export function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function winnerOf(def, answers) {
  return ranked(userVector(answers, def.Q, def.AXMAX), def.CHARS)[0].k;
}

/**
 * Registers the standard battery as a vitest suite.
 *
 * options:
 *   sims           – winner-distribution sample count   (default 40000)
 *   entropyFloor   – min Shannon entropy in bits        (default 0.85·log2(N))
 *   topShareMax    – max share of the most-won result   (default max(0.15, 2.2/N))
 *   flipFloor      – min sensitivity flip rate          (default N>=10 ? 0.65 : 0.45)
 *   maxPairCosine  – max cosine between two rosters     (default 0.999)
 *   probes         – [{name, answers, expect: [keys]}]  archetype sanity checks
 */
export function registerBattery(def, options = {}) {
  const { CHARS, Q, AXMAX, SPECTRA, key } = def;
  const KEYS = Object.keys(CHARS);
  const N = KEYS.length;
  const nAxes = AXMAX.length;
  const {
    sims = 40000,
    entropyFloor = 0.85 * Math.log2(N),
    topShareMax = Math.max(0.15, 2.2 / N),
    flipFloor = N >= 10 ? 0.65 : 0.45,
    maxPairCosine = 0.999,
    probes = [],
  } = options;

  const randomAnswers = (rand) => Q.map(() => LIKERT[Math.floor(rand() * 5)]);

  describe(`${key} vector quiz — structural integrity`, () => {
    it(`has a roster of ${N} with valid vectors, glyphs, and relations`, () => {
      expect(N).toBeGreaterThanOrEqual(4);
      KEYS.forEach((k) => {
        const c = CHARS[k];
        expect(c.v.length, `${k} vector length`).toBe(nAxes);
        c.v.forEach((x) => { expect(x).toBeGreaterThanOrEqual(-1); expect(x).toBeLessThanOrEqual(1); });
        expect(G[c.glyph], `${k} glyph "${c.glyph}"`).toBeTypeOf('function');
        expect(CHARS[c.kindred], `${k} kindred "${c.kindred}"`).toBeTruthy();
        expect(CHARS[c.rival], `${k} rival "${c.rival}"`).toBeTruthy();
        expect(c.kindred).not.toBe(k);
        expect(c.rival).not.toBe(k);
        expect(['front', 'cut']).toContain(c.tier);
        expect(c.aura).toMatch(/^#[0-9a-f]{6}$/i);
        expect(c.traits.length).toBe(5);
        expect(c.desc.length, `${k} description too thin`).toBeGreaterThan(80);
        expect(c.tag.length).toBeGreaterThan(3);
      });
    });

    it('questions carry per-axis weights and AXMAX matches the actual maxima', () => {
      expect(Q.length).toBeGreaterThanOrEqual(8);
      Q.forEach((q) => {
        expect(typeof q.t).toBe('string');
        expect(q.t.length).toBeGreaterThan(10);
        expect(q.w.length).toBe(nAxes);
      });
      expect(SPECTRA.length).toBe(nAxes);
      const maxima = Array.from({ length: nAxes }, (_, ax) =>
        Q.reduce((acc, q) => acc + Math.abs(q.w[ax]), 0));
      maxima.forEach((m, ax) => {
        expect(AXMAX[ax], `AXMAX[${ax}]`).toBeCloseTo(m, 5);
        expect(m, `axis ${ax} unmeasured`).toBeGreaterThan(0);
      });
    });

    it('every emblem renders valid SVG with no NaN/undefined', () => {
      KEYS.forEach((k) => {
        const svg = emblem(CHARS[k], 100, true, true);
        expect(svg).toContain('<svg');
        expect(svg).not.toContain('NaN');
        expect(svg).not.toContain('undefined');
      });
    });

    it('no two results point in identical directions (shadowing)', () => {
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const a = CHARS[KEYS[i]].v, b = CHARS[KEYS[j]].v;
          let dp = 0;
          for (let ax = 0; ax < nAxes; ax++) dp += a[ax] * b[ax];
          const cos = dp / (magOf(a) * magOf(b));
          expect(cos, `${KEYS[i]} vs ${KEYS[j]} cosine ${cos.toFixed(4)}`).toBeLessThan(maxPairCosine);
        }
      }
    });
  });

  describe(`${key} vector quiz — matching engine`, () => {
    if (probes.length > 0) {
      it('archetype probes land on thematically-correct results', () => {
        probes.forEach((p) => {
          const win = winnerOf(def, p.answers);
          expect(p.expect, `probe "${p.name}" won by ${win}`).toContain(win);
        });
      });
    }

    it(`Monte-Carlo: all ${N} reachable, entropy ≥ ${entropyFloor.toFixed(2)} bits, top ≤ ${(topShareMax * 100).toFixed(0)}%`, () => {
      const rand = rng(20260720);
      const wins = Object.fromEntries(KEYS.map((k) => [k, 0]));
      for (let i = 0; i < sims; i++) wins[winnerOf(def, randomAnswers(rand))]++;

      KEYS.forEach((k) => expect(wins[k], `${k} unreachable`).toBeGreaterThan(0));

      const H = -KEYS.reduce((acc, k) => {
        const p = wins[k] / sims;
        return acc + (p > 0 ? p * Math.log2(p) : 0);
      }, 0);
      expect(H, `entropy ${H.toFixed(2)} / ceiling ${Math.log2(N).toFixed(2)}`).toBeGreaterThan(entropyFloor);

      const top = Math.max(...Object.values(wins)) / sims;
      expect(top).toBeLessThanOrEqual(topShareMax);
    }, 60000);

    it(`Monte-Carlo: answers meaningfully change the result (flip rate ≥ ${flipFloor})`, () => {
      const rand = rng(987654321);
      const trials = 4000;
      let flips = 0;
      for (let i = 0; i < trials; i++) {
        const a = randomAnswers(rand);
        const b = a.map((v) => (rand() < 0.5 ? LIKERT[Math.floor(rand() * 5)] : v));
        if (winnerOf(def, a) !== winnerOf(def, b)) flips++;
      }
      expect(flips / trials).toBeGreaterThan(flipFloor);
    }, 60000);
  });
}
