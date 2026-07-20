// Registry of quizzes that run on the vector-matching experience
// (VectorQuizExperience). Keys must match the catalog entry in
// src/data/quizzes/index.js; each loader resolves to the quiz's experience
// definition (default export of its data module).
//
// A key listed here takes precedence over the generic catalog runner for
// /quiz/<key> and /quiz/<key>/result.

export const VECTOR_QUIZ_LOADERS = {
  naruto: () => import('./naruto'),
  disney: () => import('./disney'),
  eras: () => import('./eras'),
  friends: () => import('./friends'),
  nba: () => import('./nba'),
  office: () => import('./office'),
  onepiece: () => import('./onepiece'),
};

export function isVectorQuiz(key) {
  return Object.prototype.hasOwnProperty.call(VECTOR_QUIZ_LOADERS, key);
}
