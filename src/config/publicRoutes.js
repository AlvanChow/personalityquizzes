export const PUBLIC_QUIZ_KEYS = new Set([
  'attachment',
  'cake',
  'disc',
  'disney',
  'enneagram',
  'eq',
  'eras',
  'friends',
  'grit',
  'house',
  'ikigai',
  'lifewheel',
  'love_language',
  'mbti',
  'mindset',
  'naruto',
  'nba',
  'office',
  'onepiece',
  'pokemon',
  'riasec',
  'soccer',
  'starwars',
  'superhero',
  'values',
]);

const EXACT_APP_PATHS = new Set([
  '/',
  '/admin',
  '/assessment',
  '/circle',
  '/crew',
  '/dashboard',
  '/exercise/flower-petal',
  '/hot-takes',
  '/how-it-works',
  '/privacy',
  '/profile',
  '/quiz/big5-deep',
  '/quiz/enneagram-deep',
  '/quiz/mbti-deep',
]);

export function isKnownAppPath(pathname) {
  const normalized = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  if (EXACT_APP_PATHS.has(normalized)) return true;

  const quizMatch = normalized.match(/^\/quiz\/([^/]+)(?:\/result)?$/);
  return Boolean(quizMatch && PUBLIC_QUIZ_KEYS.has(quizMatch[1]));
}
