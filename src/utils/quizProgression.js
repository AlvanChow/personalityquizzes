import { Activity, Brain, CircleDashed, Cake } from 'lucide-react';

const QUIZ_ORDER = [
  {
    key: 'big5',
    check: () => localStorage.getItem('personalens_bigfive_completed') === 'true',
    label: 'Big 5 Personality',
    description: 'The scientifically-backed OCEAN model. Discover your core traits.',
    path: '/assessment',
    icon: Activity,
    gradient: 'from-teal-500 to-emerald-600',
    time: '~5 min',
  },
  {
    key: 'mbti',
    check: () => !!localStorage.getItem('personalens_mbti'),
    label: 'MBTI (16 Types)',
    description: 'Find your Myers-Briggs type and cognitive style.',
    path: '/quiz/mbti',
    icon: Brain,
    gradient: 'from-coral-400 to-rose-500',
    time: '~5 min',
  },
  {
    key: 'enneagram',
    check: () => !!localStorage.getItem('personalens_enneagram'),
    label: 'Enneagram',
    description: 'Discover which of the 9 types drives your deepest motivations.',
    path: '/quiz/enneagram',
    icon: CircleDashed,
    gradient: 'from-violet-500 to-purple-600',
    time: '~5 min',
  },
  {
    key: 'cake',
    check: () => !!localStorage.getItem('personalens_cake'),
    label: 'Cake.me',
    description: 'What kind of cake matches your vibe?',
    path: '/quiz/cake',
    icon: Cake,
    gradient: 'from-pink-400 to-rose-500',
    time: '~2 min',
  },
];

export function getNextQuiz(currentKey) {
  const currentIndex = QUIZ_ORDER.findIndex((q) => q.key === currentKey);
  for (let i = currentIndex + 1; i < QUIZ_ORDER.length; i++) {
    if (!QUIZ_ORDER[i].check()) return QUIZ_ORDER[i];
  }
  for (let i = 0; i < currentIndex; i++) {
    if (!QUIZ_ORDER[i].check()) return QUIZ_ORDER[i];
  }
  return null;
}

export function getCompletedCount() {
  return QUIZ_ORDER.filter((q) => q.check()).length;
}

export { QUIZ_ORDER };
