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
  office: () => import('./office'),
  onepiece: () => import('./onepiece'),
  pokemon: () => import('./pokemon'),
  starwars: () => import('./starwars'),
  superhero: () => import('./superhero'),
  attachment: () => import('./attachment'),
  disc: () => import('./disc'),
  love_language: () => import('./love_language'),
  values: () => import('./values'),
  house: () => import('./house'),
  spirit_animal: () => import('./spirit_animal'),
  toxic_trait: () => import('./toxic_trait'),
  red_flag: () => import('./red_flag'),
  cake: () => import('./cake'),
};

export function isVectorQuiz(key) {
  return Object.prototype.hasOwnProperty.call(VECTOR_QUIZ_LOADERS, key);
}
