// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
  bigFive: {
    scores: { O: 0, C: 0, E: 0, A: 0, N: 0 },
    hasCompleted: false,
    quizResults: {},
    loading: false,
  },
  sharePanelProps: [],
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => mocks.navigate,
}));
vi.mock('../contexts/BigFiveContext', () => ({
  useBigFive: () => mocks.bigFive,
}));
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: null }),
}));
vi.mock('../components/NextQuizBanner', () => ({ default: () => null }));
vi.mock('../components/FeedbackWidget', () => ({ default: () => null }));
vi.mock('../components/AuthNudgeBanner', () => ({ default: () => null }));
vi.mock('../components/SharePanel', () => ({
  default: (props) => {
    mocks.sharePanelProps.push(props);
    return <button>Share</button>;
  },
}));

import Dashboard from './Dashboard';
import { getCompletedResultTiles } from '../utils/dashboardResults';

describe('Dashboard results access', () => {
  beforeEach(() => {
    cleanup();
    localStorage.clear();
    mocks.navigate.mockReset();
    mocks.bigFive.hasCompleted = false;
    mocks.bigFive.scores = { O: 0, C: 0, E: 0, A: 0, N: 0 };
    mocks.bigFive.quizResults = {};
    mocks.bigFive.loading = false;
    mocks.sharePanelProps.length = 0;
  });

  it('finds a locally saved Cake result without a Big Five result', () => {
    localStorage.setItem('personalens_cake', JSON.stringify({
      resultKey: 'strawberry',
      result: { name: 'Strawberry Cake', emoji: '🍓' },
    }));

    expect(getCompletedResultTiles()).toEqual(expect.arrayContaining([
      expect.objectContaining({
        key: 'cake',
        resultName: 'Strawberry Cake',
        canRevisit: true,
      }),
    ]));
  });

  it('renders My Results instead of redirecting a Cake-only visitor home', () => {
    localStorage.setItem('personalens_cake', JSON.stringify({
      resultKey: 'strawberry',
      result: { name: 'Strawberry Cake', emoji: '🍓' },
    }));

    render(<Dashboard />);

    expect(screen.getByRole('heading', { name: 'My Results' })).toBeTruthy();
    expect(screen.getByText('Strawberry Cake')).toBeTruthy();
    expect(mocks.navigate).not.toHaveBeenCalled();
  });

  it('shows a signed-in remote result summary on a new device', () => {
    mocks.bigFive.quizResults = {
      cake: {
        resultKey: 'strawberry',
        name: 'Strawberry Cake',
        emoji: '🍓',
        quizName: 'What Cake Are You?',
      },
    };

    render(<Dashboard />);

    expect(screen.getByText('Strawberry Cake')).toBeTruthy();
    expect(screen.getByText('Saved result').closest('button').disabled).toBe(true);
  });

  it('creates a persistent Big Five profile share instead of copying stale clipboard text', () => {
    mocks.bigFive.hasCompleted = true;
    mocks.bigFive.scores = { O: 82, C: 71, E: 35, A: 64, N: 28 };

    render(<Dashboard />);

    expect(screen.getByRole('button', { name: 'Share' })).toBeTruthy();
    expect(mocks.sharePanelProps).toHaveLength(1);
    expect(mocks.sharePanelProps[0]).toEqual(expect.objectContaining({
      quizType: 'big5',
      scores: mocks.bigFive.scores,
      result: expect.objectContaining({
        key: 'profile',
        name: 'Big Five Personality Profile',
      }),
    }));
  });
});
