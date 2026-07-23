import { afterEach, describe, expect, it, vi } from 'vitest';
import worker, { buildShareMetadata } from './index';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('buildShareMetadata', () => {
  it('builds result-specific social metadata', () => {
    expect(buildShareMetadata({
      quiz_type: 'mbti',
      result_name: 'INTJ — The Architect',
      result_emoji: '🏛️',
    }, 'https://mypersonalityquizzes.com/s/01234567')).toEqual({
      title: '🏛️ INTJ — The Architect — MBTI Result',
      description: 'See this MBTI result: INTJ — The Architect. Take the quiz to discover and save your own result.',
      canonicalUrl: 'https://mypersonalityquizzes.com/s/01234567',
    });
  });

  it('strips control characters from untrusted result fields', () => {
    const metadata = buildShareMetadata({
      quiz_type: 'custom',
      result_name: 'Nice\nResult\u0000',
    }, 'https://mypersonalityquizzes.com/s/01234567');
    expect(metadata.title).toBe('NiceResult — Personality Result');
    expect(Array.from(metadata.description).every((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 && code !== 127;
    })).toBe(true);
  });
});

describe('share route handling', () => {
  it('serves the SPA shell without redirecting the original share URL', async () => {
    const shareUrl = 'https://mypersonalityquizzes.com/s/01234567';
    let assetRequestUrl = null;

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })));
    vi.stubGlobal('HTMLRewriter', class {
      on() { return this; }
      transform(response) { return response; }
    });

    const response = await worker.fetch(new Request(shareUrl), {
      ASSETS: {
        fetch: async (request) => {
          assetRequestUrl = request.url;
          return new Response('<!doctype html><html><head><title>App</title></head></html>', {
            status: 200,
            headers: { 'content-type': 'text/html; charset=UTF-8' },
          });
        },
      },
    });

    expect(assetRequestUrl).toBe(shareUrl);
    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
  });
});
