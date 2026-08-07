// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import AuthNudgeBanner from './AuthNudgeBanner';

const auth = vi.hoisted(() => ({
  user: null,
  signInWithGoogle: vi.fn(),
  signInWithApple: vi.fn(),
}));

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => auth,
}));

vi.mock('../utils/analytics', () => ({
  track: vi.fn(),
}));

beforeEach(() => {
  auth.user = null;
  auth.signInWithGoogle.mockReset().mockResolvedValue(undefined);
  auth.signInWithApple.mockReset().mockResolvedValue(undefined);
});

afterEach(cleanup);

describe('AuthNudgeBanner', () => {
  it('asks guests to sign in without promising an emailed result', () => {
    render(
      <MemoryRouter>
        <AuthNudgeBanner quiz="mbti" delay={0} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Keep this result')).toBeTruthy();
    expect(screen.queryByText(/inbox|email a copy|get your results/i)).toBeNull();
  });

  it('returns OAuth users to the exact result URL', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/quiz/mbti/result?from=share#details']}>
        <AuthNudgeBanner quiz="mbti" delay={0} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /sign in with google/i }));
    expect(auth.signInWithGoogle).toHaveBeenCalledWith('/quiz/mbti/result?from=share#details');
  });

  // App Store Review Guideline 4.8: wherever a third-party login is offered,
  // an equivalent privacy-preserving option must be too.
  it('offers Sign in with Apple alongside Google, with the same return path', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/quiz/mbti/result']}>
        <AuthNudgeBanner quiz="mbti" delay={0} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: /sign in with apple/i }));
    expect(auth.signInWithApple).toHaveBeenCalledWith('/quiz/mbti/result');
    expect(auth.signInWithGoogle).not.toHaveBeenCalled();
  });

  it('does not render for signed-in users', () => {
    auth.user = { id: 'user-1' };
    const { container } = render(
      <MemoryRouter>
        <AuthNudgeBanner quiz="mbti" delay={0} />
      </MemoryRouter>,
    );
    expect(container.innerHTML).toBe('');
  });
});
