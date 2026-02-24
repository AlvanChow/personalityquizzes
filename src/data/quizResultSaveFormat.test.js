/**
 * Verifies that the objects returned by each quiz's result-fetching function
 * contain the exact fields used when saving to localStorage and Supabase.
 *
 * These tests act as a contract: if the data shape changes (e.g. a field is
 * renamed) the quiz save/load and Profile history display will break.
 */
import { describe, it, expect } from 'vitest';
import { cakeResults, getCakeResult, cakeResultNameToKey } from './cakeResults.js';
import { mbtiResults, getMBTIResult } from './mbtiResults.js';
import { enneagramResults, getEnneagramResult } from './enneagramResults.js';

// ─────────────────────────────────────────────
// Cake – fields used in CakeQuiz localStorage save and Supabase upsert
// ─────────────────────────────────────────────
describe('Cake save-format contract', () => {
  const allCakeScores = [
    { O: 80, C: 10, E: 10, A: 10, N: 10 }, // matcha
    { O: 10, C: 80, E: 10, A: 10, N: 10 }, // wedding
    { O: 10, C: 10, E: 80, A: 10, N: 10 }, // funfetti
    { O: 10, C: 10, E: 10, A: 80, N: 10 }, // redvelvet
    { O: 10, C: 10, E: 10, A: 10, N: 80 }, // lava
    { O: 50, C: 50, E: 50, A: 50, N: 50 }, // chocolate (balanced)
  ];

  allCakeScores.forEach((scores, i) => {
    it(`getCakeResult[${i}] returns an object with name, emoji, and trait`, () => {
      const result = getCakeResult(scores);
      expect(typeof result.name).toBe('string');
      expect(result.name.trim().length).toBeGreaterThan(0);
      expect(typeof result.emoji).toBe('string');
      expect(typeof result.trait).toBe('string');
      expect(result.trait.trim().length).toBeGreaterThan(0);
    });

    it(`getCakeResult[${i}].name resolves to a valid key via cakeResultNameToKey`, () => {
      const result = getCakeResult(scores);
      const key = cakeResultNameToKey[result.name];
      expect(key).toBeDefined();
      expect(cakeResults).toHaveProperty(key);
    });
  });

  it('every cakeResults entry has name, emoji, and trait (fields stored in Supabase)', () => {
    Object.entries(cakeResults).forEach(([key, entry]) => {
      expect(typeof entry.name, `${key}.name`).toBe('string');
      expect(typeof entry.emoji, `${key}.emoji`).toBe('string');
      expect(typeof entry.trait, `${key}.trait`).toBe('string');
    });
  });
});

// ─────────────────────────────────────────────
// MBTI – fields used in MBTIQuiz Supabase upsert
// Stored as: resultKey=result.name, name=`${result.name} — ${result.nickname}`,
//            emoji=result.emoji, trait=result.nickname
// Looked up in Profile as: mbtiResults[result.resultKey]
// ─────────────────────────────────────────────
describe('MBTI save-format contract', () => {
  // Spot-check a representative sample across all 16 types.
  const sampleScores = [
    { IE: 0,   SN: 100, TF: 0,   JP: 0   }, // INTJ
    { IE: 100, SN: 100, TF: 100, JP: 100 }, // ENFP
    { IE: 0,   SN: 0,   TF: 0,   JP: 0   }, // ISTJ
    { IE: 100, SN: 0,   TF: 100, JP: 100 }, // ESTP
  ];

  sampleScores.forEach((scores) => {
    it(`getMBTIResult with ${JSON.stringify(scores)} returns name and nickname`, () => {
      const result = getMBTIResult(scores);
      expect(typeof result.name).toBe('string');
      expect(result.name.trim().length).toBeGreaterThan(0);
      expect(typeof result.nickname).toBe('string');
      expect(result.nickname.trim().length).toBeGreaterThan(0);
      expect(typeof result.emoji).toBe('string');
    });

    it(`getMBTIResult result.name is a valid key into mbtiResults (Profile round-trip)`, () => {
      const result = getMBTIResult(scores);
      // result.name is saved as resultKey; Profile looks up mbtiResults[resultKey]
      expect(mbtiResults).toHaveProperty(result.name);
      expect(mbtiResults[result.name]).toBe(result);
    });
  });

  it('every mbtiResults entry has name, nickname, emoji (fields stored/displayed)', () => {
    Object.entries(mbtiResults).forEach(([key, entry]) => {
      expect(typeof entry.name, `${key}.name`).toBe('string');
      expect(typeof entry.nickname, `${key}.nickname`).toBe('string');
      expect(typeof entry.emoji, `${key}.emoji`).toBe('string');
    });
  });
});

// ─────────────────────────────────────────────
// Enneagram – fields used in EnneagramQuiz Supabase upsert
// Stored as: resultKey=result.typeNumber, name=result.name,
//            emoji=result.emoji, trait=result.nickname
// Looked up in Profile as: enneagramResults[result.resultKey]
// ─────────────────────────────────────────────
describe('Enneagram save-format contract', () => {
  const VALID_TYPES = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

  VALID_TYPES.forEach((winningType) => {
    it(`getEnneagramResult type ${winningType}: typeNumber, name, nickname, emoji are present`, () => {
      const scores = Object.fromEntries(VALID_TYPES.map((t) => [t, 1]));
      scores[winningType] = 12;
      const result = getEnneagramResult(scores);

      expect(result.typeNumber).toBe(winningType);
      expect(typeof result.name).toBe('string');
      expect(result.name.trim().length).toBeGreaterThan(0);
      expect(typeof result.nickname).toBe('string');
      expect(result.nickname.trim().length).toBeGreaterThan(0);
      expect(typeof result.emoji).toBe('string');
    });

    it(`getEnneagramResult type ${winningType}: typeNumber resolves in enneagramResults (Profile round-trip)`, () => {
      const scores = Object.fromEntries(VALID_TYPES.map((t) => [t, 1]));
      scores[winningType] = 12;
      const result = getEnneagramResult(scores);
      // result.typeNumber is saved as resultKey; Profile looks up enneagramResults[resultKey]
      expect(enneagramResults).toHaveProperty(result.typeNumber);
      expect(enneagramResults[result.typeNumber]).toBe(result);
    });
  });

  it('every enneagramResults entry has typeNumber, name, nickname, emoji', () => {
    VALID_TYPES.forEach((t) => {
      const entry = enneagramResults[t];
      expect(entry.typeNumber, `${t}.typeNumber`).toBe(t);
      expect(typeof entry.name, `${t}.name`).toBe('string');
      expect(typeof entry.nickname, `${t}.nickname`).toBe('string');
      expect(typeof entry.emoji, `${t}.emoji`).toBe('string');
    });
  });
});
