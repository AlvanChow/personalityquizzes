import { describe, it, expect } from 'vitest';
import cakeDef from './vectorQuizzes/cake.js';
import houseDef from './vectorQuizzes/house.js';
import { cakeResults } from './cakeResults.js';
import { houseResults } from './houseResults.js';

// The live cake & house quizzes run on the vector experience, which persists a
// result keyed by its CHARS roster. Profile and Circle then look that key up in
// the SEPARATE cakeResults / houseResults tables to render copy and compute
// friend compatibility. If the two sources ever drift (e.g. a cake is renamed
// in one file but not the other) Circle silently drops the compatibility chip
// and Profile shows a blank result. These locks fail loudly instead of silently.

describe('vector cake ↔ cakeResults key lock', () => {
  it('produces exactly the results defined in cakeResults', () => {
    const charKeys = Object.keys(cakeDef.CHARS).sort();
    const resultKeys = Object.keys(cakeResults).sort();
    expect(charKeys).toEqual(resultKeys);
  });

  it('every cake result carries the trait code Circle compatibility needs', () => {
    for (const k of Object.keys(cakeDef.CHARS)) {
      expect(cakeResults[k], `cakeResults missing "${k}"`).toBeTruthy();
      expect(cakeResults[k].trait, `cakeResults.${k}.trait`).toBeTruthy();
    }
  });
});

describe('vector house ↔ houseResults key lock', () => {
  it('every producible house result resolves in houseResults', () => {
    for (const k of Object.keys(houseDef.CHARS)) {
      expect(houseResults[k], `houseResults missing "${k}"`).toBeTruthy();
    }
  });
});
