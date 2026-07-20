import { describe, it, expect } from 'vitest';
import { CHARS, Q, AXMAX, SPECTRA, G, emblem } from './naruto';
import { userVector, magOf, matchPct, ranked } from '../../utils/vectorQuiz';

// ─── The verification battery ────────────────────────────────────────────────
// This is the same methodology the standalone quiz shipped with: structural
// integrity, then Monte-Carlo measurement of the matching engine itself.
// If a roster or question edit breaks reachability, entropy, or sensitivity,
// these tests fail before users ever see a stale-feeling quiz.

const LIKERT = [-1, -0.5, 0, 0.5, 1];
const KEYS = Object.keys(CHARS);

// Deterministic RNG (mulberry32) so simulation results are reproducible.
function rng(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomAnswers(rand) {
  return Q.map(() => LIKERT[Math.floor(rand() * 5)]);
}

function winnerOf(answers) {
  return ranked(userVector(answers, Q, AXMAX), CHARS)[0].k;
}

describe('naruto vector quiz — structural integrity', () => {
  it('has the full 23-character roster', () => {
    expect(KEYS.length).toBe(23);
  });

  it('has 10 questions with 4-axis weights and 4 axis maxima', () => {
    expect(Q.length).toBe(10);
    Q.forEach((q) => {
      expect(typeof q.t).toBe('string');
      expect(q.t.length).toBeGreaterThan(10);
      expect(q.w.length).toBe(4);
    });
    expect(AXMAX.length).toBe(4);
    expect(SPECTRA.length).toBe(4);
  });

  it('AXMAX matches the actual per-axis maximum from the weights', () => {
    // Max |score| per axis = sum of |w| across questions.
    const maxima = [0, 1, 2, 3].map((ax) =>
      Q.reduce((acc, q) => acc + Math.abs(q.w[ax]), 0));
    maxima.forEach((m, ax) => expect(AXMAX[ax]).toBeCloseTo(m, 5));
  });

  it('every character has a valid vector, glyph, and resolvable relations', () => {
    KEYS.forEach((k) => {
      const c = CHARS[k];
      expect(c.v.length, `${k} vector length`).toBe(4);
      c.v.forEach((x) => { expect(x).toBeGreaterThanOrEqual(-1); expect(x).toBeLessThanOrEqual(1); });
      expect(G[c.glyph], `${k} glyph "${c.glyph}"`).toBeTypeOf('function');
      expect(CHARS[c.kindred], `${k} kindred "${c.kindred}"`).toBeTruthy();
      expect(CHARS[c.rival], `${k} rival "${c.rival}"`).toBeTruthy();
      expect(c.kindred).not.toBe(k);
      expect(c.rival).not.toBe(k);
      expect(['front', 'cut']).toContain(c.tier);
      expect(c.aura).toMatch(/^#[0-9a-f]{6}$/i);
      expect(c.traits.length).toBe(5);
      expect(c.desc.length).toBeGreaterThan(80);
      expect(c.tag.length).toBeGreaterThan(3);
    });
  });

  it('every emblem builder emits valid SVG with no NaN/undefined', () => {
    KEYS.forEach((k) => {
      const svg = emblem(CHARS[k], 100, true, true);
      expect(svg).toContain('<svg');
      expect(svg).toContain('</svg>');
      expect(svg).not.toContain('NaN');
      expect(svg).not.toContain('undefined');
    });
  });

  it('no two characters point in identical directions (shadowing)', () => {
    // Near-parallel vectors risk one character permanently shadowing the
    // other under direction matching — the Neji/Obito bug class. The shipped
    // roster's closest pair is kurama/hidan at cosine 0.998, and the
    // Monte-Carlo battery confirms BOTH win healthy shares (5.7% / 2.7%),
    // so the real guard is reachability below; this catches true clones.
    for (let i = 0; i < KEYS.length; i++) {
      for (let j = i + 1; j < KEYS.length; j++) {
        const a = CHARS[KEYS[i]].v, b = CHARS[KEYS[j]].v;
        let dp = 0;
        for (let ax = 0; ax < 4; ax++) dp += a[ax] * b[ax];
        const cos = dp / (magOf(a) * magOf(b));
        expect(cos, `${KEYS[i]} vs ${KEYS[j]} cosine ${cos.toFixed(4)}`).toBeLessThan(0.999);
      }
    }
  });
});

describe('naruto vector quiz — matching engine', () => {
  it('matchPct maps cosine into [55, 99] with 99 at perfect alignment', () => {
    expect(matchPct(1)).toBe(99);
    expect(matchPct(0)).toBe(60);
    expect(matchPct(-1)).toBe(55);
  });

  it('all-neutral answers fall back to nearest-point and still return a full ranking', () => {
    const uv = userVector(Q.map(() => 0), Q, AXMAX);
    expect(magOf(uv)).toBeLessThan(0.05);
    const list = ranked(uv, CHARS);
    expect(list.length).toBe(23);
    // The winner should be a mild-vector character, not a corner extremist.
    expect(magOf(list[0].c.v)).toBeLessThan(1.2);
  });

  it('archetype probes land on thematically-correct characters', () => {
    // Pure ambition (agree the-best, disagree couch, choose-the-dream, flair):
    const ambition = [0, 0, 0, 0, 1, -1, 0, 0, -1, 0.5];
    const winAmbition = winnerOf(ambition);
    expect(['madara', 'orochimaru', 'obito']).toContain(winAmbition);

    // Warm bonded leader (bonds, people-over-goals, expressive):
    const warm = [0.5, 0, 1, -1, 0, 0, 1, -1, 1, 0];
    expect(['hashirama', 'naruto', 'jiraiya', 'tsunade']).toContain(winnerOf(warm));

    // Cold lone strategist:
    const strategist = [-1, 1, -1, 1, 0, 0, -1, 1, 0, -1];
    expect(['shikamaru', 'kakashi', 'itachi', 'sasori', 'tobirama', 'neji']).toContain(winnerOf(strategist));
  });

  it('Monte-Carlo: every character is reachable and no one dominates', () => {
    const N = 40000;
    const rand = rng(20260720);
    const wins = Object.fromEntries(KEYS.map((k) => [k, 0]));
    for (let i = 0; i < N; i++) wins[winnerOf(randomAnswers(rand))]++;

    // Reachability: every character must win at least once.
    KEYS.forEach((k) => expect(wins[k], `${k} unreachable`).toBeGreaterThan(0));

    // Entropy: distribution must stay broad (standalone shipped at 4.28 bits
    // against a log2(23) ≈ 4.52 ceiling; require ≥ 4.0).
    const H = -KEYS.reduce((acc, k) => {
      const p = wins[k] / N;
      return acc + (p > 0 ? p * Math.log2(p) : 0);
    }, 0);
    expect(H).toBeGreaterThan(4.0);

    // Concentration: top result ≤ 15% (uniform would be 4.3%).
    const top = Math.max(...Object.values(wins)) / N;
    expect(top).toBeLessThan(0.15);
  }, 30000);

  it('Monte-Carlo: answers meaningfully change the result (sensitivity)', () => {
    const N = 4000;
    const rand = rng(987654321);
    let flips = 0;
    for (let i = 0; i < N; i++) {
      const a = randomAnswers(rand);
      const b = a.map((v) => (rand() < 0.5 ? LIKERT[Math.floor(rand() * 5)] : v));
      if (winnerOf(a) !== winnerOf(b)) flips++;
    }
    // Standalone shipped at ~80% flip rate; require ≥ 65% to catch regressions.
    expect(flips / N).toBeGreaterThan(0.65);
  }, 30000);
});
