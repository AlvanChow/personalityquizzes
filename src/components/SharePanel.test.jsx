// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({
  createShareableLink: vi.fn(),
  clipboardWrite: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { id: 'user-1' } }),
}));
vi.mock('../utils/analytics', () => ({
  track: vi.fn(),
}));
vi.mock('../utils/sharing', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    createShareableLink: mocks.createShareableLink,
    openTwitterShare: vi.fn(),
    openWhatsAppShare: vi.fn(),
  };
});
vi.mock('../utils/storyCard', () => ({
  shareResultStory: vi.fn(),
}));
vi.mock('framer-motion', async () => {
  const React = await import('react');
  const motion = new Proxy({}, {
    get: (_, tag) => React.forwardRef(function MotionElement({ children, ...props }, ref) {
      const {
        initial: _initial,
        animate: _animate,
        exit: _exit,
        transition: _transition,
        whileHover: _whileHover,
        whileTap: _whileTap,
        ...domProps
      } = props;
      return React.createElement(tag, { ...domProps, ref }, children);
    }),
  });
  return {
    motion,
    AnimatePresence: ({ children }) => children,
  };
});

import SharePanel from './SharePanel';

const result = {
  key: 'profile',
  name: 'Big Five Personality Profile',
  emoji: '🧬',
  tagline: 'My five-trait personality profile',
};

describe('SharePanel result snapshots', () => {
  beforeEach(() => {
    cleanup();
    mocks.createShareableLink.mockReset();
    mocks.clipboardWrite.mockReset();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mocks.clipboardWrite },
    });
  });

  it('creates and copies a new link when retake scores change', async () => {
    const oldScores = { O: 55, C: 60, E: 80, A: 65, N: 70 };
    const newScores = { O: 50, C: 45, E: 45, A: 50, N: 45 };
    mocks.createShareableLink
      .mockResolvedValueOnce('https://mypersonalityquizzes.com/s/old')
      .mockResolvedValueOnce('https://mypersonalityquizzes.com/s/new');

    const { rerender } = render(
      <SharePanel quizType="big5" result={result} scores={oldScores} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Share your result' }));
    expect(await screen.findByText('https://mypersonalityquizzes.com/s/old')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Close share panel' }));

    rerender(<SharePanel quizType="big5" result={result} scores={newScores} />);
    fireEvent.click(screen.getByRole('button', { name: 'Share your result' }));
    expect(await screen.findByText('https://mypersonalityquizzes.com/s/new')).toBeTruthy();

    expect(mocks.createShareableLink).toHaveBeenCalledTimes(2);
    expect(mocks.createShareableLink).toHaveBeenLastCalledWith(
      'big5',
      result,
      newScores,
      'user-1',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Copy link' }));
    await waitFor(() => {
      expect(mocks.clipboardWrite).toHaveBeenCalledWith(
        'https://mypersonalityquizzes.com/s/new',
      );
    });
  });
});
