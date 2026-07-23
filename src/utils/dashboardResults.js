import {
  getQuizzesByCategory,
  getQuizPath,
  isQuizCompleted,
  storageKeyFor,
} from '../data/quizzes';
import { safeLocalStorageRead } from './security';

const catalogSections = [
  getQuizzesByCategory('know'),
  getQuizzesByCategory('pop'),
];

// Build the results shelf from both this browser's full result data and the
// compact summaries synced to a signed-in profile. Local data wins because it
// can reopen the full result; remote-only summaries remain visible instead of
// making My Results look empty on a new device.
export function getCompletedResultTiles(remoteResults = {}) {
  const tiles = [];
  const core = [
    { key: 'mbti', emoji: '🧠', title: 'MBTI', to: '/quiz/mbti/result' },
    { key: 'enneagram', emoji: '✳️', title: 'Enneagram', to: '/quiz/enneagram/result' },
    { key: 'cake', emoji: '🍰', title: 'Cake', to: '/quiz/cake/result' },
    { key: 'house', emoji: '🪄', title: 'Wizarding House', to: '/quiz/house/result' },
  ];

  for (const entry of core) {
    const stored = safeLocalStorageRead(`personalens_${entry.key}`, null);
    const localResult = stored?.result;
    const remoteResult = remoteResults?.[entry.key];
    const result = localResult ?? remoteResult;
    if (!result) continue;
    tiles.push({
      ...entry,
      resultName: result.name ?? '',
      resultEmoji: result.emoji ?? entry.emoji,
      canRevisit: Boolean(localResult),
    });
  }

  for (const quizzes of catalogSections) {
    for (const quiz of quizzes) {
      const stored = safeLocalStorageRead(storageKeyFor(quiz.key), null);
      const localResult = stored?.result;
      const remoteResult = remoteResults?.[quiz.key];
      if (!localResult && !remoteResult && !isQuizCompleted(quiz.key)) continue;
      const result = localResult ?? remoteResult ?? {};
      tiles.push({
        key: quiz.key,
        emoji: quiz.emoji,
        title: quiz.title,
        to: quiz.custom ? getQuizPath(quiz) : `/quiz/${quiz.key}/result`,
        resultName: result.name ?? '',
        resultEmoji: result.emoji ?? quiz.emoji,
        canRevisit: Boolean(localResult),
      });
    }
  }

  return tiles;
}
