import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
}));

vi.mock('../lib/supabase', () => ({
  supabase: { rpc: mocks.rpc },
}));

vi.mock('./rateLimiter', () => ({
  allowShare: () => true,
}));

import { createShareableLink } from './sharing';

describe('createShareableLink', () => {
  beforeEach(() => {
    mocks.rpc.mockReset();
  });

  it('sends only the stable key and bounded scores to the validated RPC', async () => {
    mocks.rpc.mockResolvedValue({
      data: '0123456789abcdef0123456789abcdef',
      error: null,
    });

    const url = await createShareableLink(
      'naruto',
      {
        key: 'shikamaru',
        name: 'Client-controlled fake name',
        emoji: '💣',
        description: 'Client-controlled fake copy',
      },
      { a0: 50, a1: -25 },
      'fake-owner-id',
    );

    expect(mocks.rpc).toHaveBeenCalledWith('create_shared_result', {
      p_quiz_type: 'naruto',
      p_result_key: 'shikamaru',
      p_scores: { a0: 50, a1: -25 },
    });
    expect(url).toBe(
      'https://mypersonalityquizzes.com/s/0123456789abcdef0123456789abcdef',
    );
  });

  it('rejects malformed RPC responses', async () => {
    mocks.rpc.mockResolvedValue({ data: '01234567', error: null });
    await expect(createShareableLink('big5', { name: 'Profile' }, {
      O: 50, C: 50, E: 50, A: 50, N: 50,
    })).resolves.toBeNull();
  });
});
