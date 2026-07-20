import { describe, it, expect } from 'vitest';
import { QUIZ_CATALOG, getQuizMeta } from './index.js';
import { computeQuizResult, LIKERT_OPTIONS } from '../../utils/quizEngine.js';

const KEY_PATTERN = /^[a-z][a-z0-9_]*$/;
const GRADIENT_PATTERN = /^from-[a-z]+-\d{2,3} (via-[a-z]+-\d{2,3} )?to-[a-z]+-\d{2,3}$/;
const ACCENT_PATTERN = /^text-[a-z]+-\d{2,3}$/;

const REQUIRED_RESULT_FIELDS = ['name', 'emoji', 'color', 'accent', 'tagline', 'description', 'strengths', 'growth'];

function validateResultEntry(result, context) {
  for (const field of REQUIRED_RESULT_FIELDS) {
    expect(result[field], `${context} missing ${field}`).toBeTruthy();
  }
  expect(result.color, `${context} color`).toMatch(GRADIENT_PATTERN);
  expect(result.accent, `${context} accent`).toMatch(ACCENT_PATTERN);
  expect(Array.isArray(result.strengths), `${context} strengths must be an array`).toBe(true);
  expect(result.strengths.length, `${context} strengths count`).toBeGreaterThanOrEqual(3);
  expect(result.description.length, `${context} description too short`).toBeGreaterThan(80);
}

describe('quiz catalog metadata', () => {
  it('has unique, well-formed keys and complete card metadata', () => {
    const keys = QUIZ_CATALOG.map((q) => q.key);
    expect(new Set(keys).size).toBe(keys.length);
    for (const meta of QUIZ_CATALOG) {
      expect(meta.key).toMatch(KEY_PATTERN);
      expect(meta.title).toBeTruthy();
      expect(meta.quizName).toBeTruthy();
      expect(meta.emoji).toBeTruthy();
      expect(['pop', 'know']).toContain(meta.category);
      expect(meta.description).toBeTruthy();
      expect(meta.time).toMatch(/^~\d+ min$/);
      expect(meta.gradient).toMatch(GRADIENT_PATTERN);
      expect(meta.custom ? meta.path : meta.load).toBeTruthy();
    }
  });

  it('getQuizMeta resolves known keys and rejects unknown ones', () => {
    expect(getQuizMeta('naruto')?.category).toBe('pop');
    expect(getQuizMeta('nope_not_real')).toBeNull();
  });
});

// One test per quiz so a missing/broken file fails only its own case.
describe.each(QUIZ_CATALOG.filter((q) => q.load).map((q) => [q.key, q]))('quiz definition: %s', (key, meta) => {
  it('loads and passes structural validation', async () => {
    const quiz = (await meta.load()).default;

    expect(quiz.key).toBe(key);
    expect(['pick', 'likert']).toContain(quiz.mode);
    expect(quiz.resultsHeading).toBeTruthy();
    expect(quiz.questions.length).toBeGreaterThanOrEqual(8);

    // Question ids must be unique.
    const ids = quiz.questions.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);

    if (quiz.mode === 'pick') {
      const resultKeys = Object.keys(quiz.results);
      expect(resultKeys.length).toBeGreaterThanOrEqual(4);

      const primaryCounts = Object.fromEntries(resultKeys.map((k) => [k, 0]));
      for (const question of quiz.questions) {
        expect(question.text, `${key} q${question.id} text`).toBeTruthy();
        expect(question.options.length, `${key} q${question.id} options`).toBeGreaterThanOrEqual(3);
        for (const option of question.options) {
          expect(option.label, `${key} q${question.id} option label`).toBeTruthy();
          const pointKeys = Object.keys(option.points ?? {});
          expect(pointKeys.length, `${key} q${question.id} "${option.label}" has no points`).toBeGreaterThan(0);
          for (const pk of pointKeys) {
            expect(resultKeys, `${key} q${question.id} points to unknown result "${pk}"`).toContain(pk);
            expect(option.points[pk]).toBeGreaterThan(0);
          }
          const best = Math.max(...pointKeys.map((pk) => option.points[pk]));
          for (const pk of pointKeys) {
            if (option.points[pk] === best) primaryCounts[pk] += 1;
          }
        }
      }

      for (const [rk, result] of Object.entries(quiz.results)) {
        validateResultEntry(result, `${key}.results.${rk}`);
        expect(primaryCounts[rk], `${key} result "${rk}" is never a top-scoring option — unreachable`).toBeGreaterThanOrEqual(2);
        for (const kin of result.kindred ?? []) {
          expect(resultKeys, `${key}.results.${rk} kindred "${kin}" unknown`).toContain(kin);
        }
      }

      // Engine smoke test: answering everything with option 0 yields a valid result.
      const answers = Object.fromEntries(quiz.questions.map((q) => [q.id, { value: 0 }]));
      const outcome = computeQuizResult(quiz, answers);
      expect(quiz.results[outcome.resultKey]).toBe(outcome.result);
      expect(Object.values(outcome.scores).every((s) => s >= 0 && s <= 100)).toBe(true);
    }

    if (quiz.mode === 'likert') {
      const dims = Object.keys(quiz.dimensions);
      expect(dims.length).toBeGreaterThanOrEqual(1);
      for (const dim of dims) {
        expect(quiz.dimensions[dim].label, `${key} dimension ${dim} label`).toBeTruthy();
        expect(quiz.dimensions[dim].color, `${key} dimension ${dim} color`).toMatch(/^bg-[a-z]+-\d{2,3}$/);
      }

      for (const question of quiz.questions) {
        expect(question.text, `${key} q${question.id} text`).toBeTruthy();
        expect(dims, `${key} q${question.id} unknown dim "${question.dim}"`).toContain(question.dim);
      }
      // Every dimension needs at least 2 items for a stable score.
      for (const dim of dims) {
        const count = quiz.questions.filter((q) => q.dim === dim).length;
        expect(count, `${key} dimension "${dim}" has too few items`).toBeGreaterThanOrEqual(2);
      }

      if (quiz.bands?.length) {
        expect(quiz.bands.length).toBeGreaterThanOrEqual(3);
        expect(quiz.bands[0].min).toBe(0);
        let prev = -1;
        for (const band of quiz.bands) {
          expect(band.key, `${key} band missing key`).toBeTruthy();
          expect(band.min).toBeGreaterThan(prev);
          prev = band.min;
          validateResultEntry(band, `${key}.bands.${band.key}`);
        }
      } else {
        for (const dim of dims) {
          expect(quiz.results?.[dim], `${key} missing results entry for dimension "${dim}"`).toBeTruthy();
          validateResultEntry(quiz.results[dim], `${key}.results.${dim}`);
        }
      }

      // Engine smoke test across the full answer range.
      for (const value of [1, 3, 5]) {
        const answers = Object.fromEntries(quiz.questions.map((q) => [q.id, { value }]));
        const outcome = computeQuizResult(quiz, answers);
        expect(outcome.result, `${key} likert value=${value} produced no result`).toBeTruthy();
        expect(outcome.overallPct).toBeGreaterThanOrEqual(0);
        expect(outcome.overallPct).toBeLessThanOrEqual(100);
      }
    }
  });
});

describe('quiz engine', () => {
  it('exposes a standard 5-point likert scale', () => {
    expect(LIKERT_OPTIONS).toHaveLength(5);
    expect(LIKERT_OPTIONS[0].value).toBe(1);
    expect(LIKERT_OPTIONS[4].value).toBe(5);
  });

  it('pick mode: accumulates points, breaks ties by declaration order', () => {
    const quiz = {
      key: 't',
      mode: 'pick',
      results: { a: { name: 'A' }, b: { name: 'B' } },
      questions: [
        { id: 1, text: 'q', options: [{ label: 'x', points: { a: 2 } }, { label: 'y', points: { b: 2 } }] },
        { id: 2, text: 'q', options: [{ label: 'x', points: { b: 1, a: 1 } }] },
      ],
    };
    const win = computeQuizResult(quiz, { 1: { value: 1 }, 2: { value: 0 } });
    expect(win.resultKey).toBe('b');
    const tie = computeQuizResult(quiz, { 2: { value: 0 } });
    expect(tie.resultKey).toBe('a');
  });

  it('likert mode: normalizes 1–5 to 0–100 and honors reverse items', () => {
    const quiz = {
      key: 't',
      mode: 'likert',
      dimensions: { x: { label: 'X', color: 'bg-sky-400' } },
      results: { x: { name: 'X' } },
      questions: [
        { id: 1, text: 'q', dim: 'x' },
        { id: 2, text: 'q', dim: 'x', reverse: true },
      ],
    };
    const outcome = computeQuizResult(quiz, { 1: { value: 5 }, 2: { value: 1 } });
    expect(outcome.scores.x).toBe(100);
    expect(outcome.overallPct).toBe(100);
    const low = computeQuizResult(quiz, { 1: { value: 1 }, 2: { value: 5 } });
    expect(low.scores.x).toBe(0);
  });

  it('likert bands: overall percentage selects the highest qualifying band', () => {
    const band = (key, min) => ({
      key, min, name: key, emoji: '🔥', color: 'from-orange-100 to-amber-50', accent: 'text-orange-600',
      tagline: '#t', description: 'd'.repeat(100), strengths: ['a', 'b', 'c'], growth: 'g',
    });
    const quiz = {
      key: 't',
      mode: 'likert',
      dimensions: { x: { label: 'X', color: 'bg-sky-400' } },
      bands: [band('low', 0), band('mid', 40), band('high', 75)],
      questions: [{ id: 1, text: 'q', dim: 'x' }, { id: 2, text: 'q', dim: 'x' }],
    };
    expect(computeQuizResult(quiz, { 1: { value: 1 }, 2: { value: 1 } }).resultKey).toBe('low');
    expect(computeQuizResult(quiz, { 1: { value: 3 }, 2: { value: 4 } }).resultKey).toBe('mid');
    expect(computeQuizResult(quiz, { 1: { value: 5 }, 2: { value: 5 } }).resultKey).toBe('high');
  });
});
