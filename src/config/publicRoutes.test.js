import { describe, expect, it } from 'vitest';
import { QUIZ_CATALOG } from '../data/quizzes';
import { VECTOR_QUIZ_LOADERS } from '../data/vectorQuizzes/registry';
import { isKnownAppPath, PUBLIC_QUIZ_KEYS } from './publicRoutes';

describe('public route catalog', () => {
  it('includes every runnable catalog and vector quiz', () => {
    const catalogKeys = QUIZ_CATALOG
      .filter((quiz) => quiz.load || Object.hasOwn(VECTOR_QUIZ_LOADERS, quiz.key))
      .map((quiz) => quiz.key);

    for (const key of [...catalogKeys, ...Object.keys(VECTOR_QUIZ_LOADERS)]) {
      expect(PUBLIC_QUIZ_KEYS.has(key), `${key} is missing from Worker routes`).toBe(true);
      expect(isKnownAppPath(`/quiz/${key}`)).toBe(true);
      expect(isKnownAppPath(`/quiz/${key}/result`)).toBe(true);
    }
  });

  it('rejects unknown and near-match paths', () => {
    expect(isKnownAppPath('/quiz/not_real')).toBe(false);
    expect(isKnownAppPath('/privacy/extra')).toBe(false);
    expect(isKnownAppPath('/not-real')).toBe(false);
  });
});
