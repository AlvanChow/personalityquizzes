// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  insert: vi.fn(),
  from: vi.fn(),
}));

vi.mock('../lib/supabase', () => ({
  supabase: { from: mocks.from },
}));

vi.mock('./rateLimiter', () => ({
  allowAnalytics: () => true,
}));

import {
  isAnalyticsOptedOut,
  setAnalyticsOptOut,
  track,
} from './analytics';

describe('analytics privacy preference', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    mocks.insert.mockReset();
    mocks.from.mockReset();
    mocks.insert.mockResolvedValue({ error: null });
    mocks.from.mockReturnValue({ insert: mocks.insert });
  });

  it('persists opt-out and suppresses every event', () => {
    expect(setAnalyticsOptOut(true)).toBe(true);
    expect(isAnalyticsOptedOut()).toBe(true);

    track('page_view', { path: '/privacy' });

    expect(mocks.from).not.toHaveBeenCalled();
  });

  it('allows events again after the user opts back in', async () => {
    setAnalyticsOptOut(true);
    expect(setAnalyticsOptOut(false)).toBe(false);

    track('page_view', { path: '/' });

    expect(mocks.from).toHaveBeenCalledWith('analytics_events');
    expect(mocks.insert).toHaveBeenCalledWith(expect.objectContaining({
      event: 'page_view',
      properties: expect.objectContaining({ path: '/' }),
    }));
  });
});
