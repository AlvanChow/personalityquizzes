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
    }, 'https://mypersonalityquizzes.com/s/0123456789abcdef0123456789abcdef')).toEqual({
      title: '🏛️ INTJ — The Architect — MBTI Result',
      description: 'See this MBTI result: INTJ — The Architect. Take the quiz to discover and save your own result.',
      canonicalUrl: 'https://mypersonalityquizzes.com/s/0123456789abcdef0123456789abcdef',
    });
  });

  it('strips control characters from untrusted result fields', () => {
    const metadata = buildShareMetadata({
      quiz_type: 'custom',
      result_name: 'Nice\nResult\u0000',
    }, 'https://mypersonalityquizzes.com/s/0123456789abcdef0123456789abcdef');
    expect(metadata.title).toBe('NiceResult — Personality Result');
    expect(Array.from(metadata.description).every((character) => {
      const code = character.charCodeAt(0);
      return code >= 32 && code !== 127;
    })).toBe(true);
  });
});

describe('share route handling', () => {
  const shareUrl = 'https://mypersonalityquizzes.com/s/0123456789abcdef0123456789abcdef';

  function htmlAssets(onRequest = () => {}) {
    return {
      fetch: async (request) => {
        onRequest(request);
        return new Response('<!doctype html><html><head><title>App</title></head></html>', {
          status: 200,
          headers: { 'content-type': 'text/html; charset=UTF-8' },
        });
      },
    };
  }

  function stubRewriter() {
    vi.stubGlobal('HTMLRewriter', class {
      on() { return this; }
      transform(response) { return response; }
    });
  }

  it('serves an existing share with the original URL and cache policy', async () => {
    let assetRequestUrl = null;

    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([{
      quiz_type: 'mbti',
      result_name: 'INTJ',
      result_emoji: '🏛️',
    }]), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })));
    stubRewriter();

    const response = await worker.fetch(new Request(shareUrl), {
      ASSETS: htmlAssets((request) => { assetRequestUrl = request.url; }),
    });

    expect(assetRequestUrl).toBe(shareUrl);
    expect(response.status).toBe(200);
    expect(response.headers.get('location')).toBeNull();
    expect(response.headers.get('cache-control')).toContain('max-age=300');
  });

  it('returns a real 404 for a missing share', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    })));
    stubRewriter();

    const response = await worker.fetch(new Request(shareUrl), {
      ASSETS: htmlAssets(),
    });

    expect(response.status).toBe(404);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('degrades to the app shell when the share service fails', async () => {
    // A failed lookup is not proof the share is missing, so the visitor must
    // still get a working page rather than a 503 or a wrong 404.
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('failed', { status: 500 })));
    stubRewriter();

    const response = await worker.fetch(new Request(shareUrl), {
      ASSETS: htmlAssets(),
    });

    expect(response.status).toBe(200);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('forwards the visitor IP to the share RPC when the edge secret is set', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchSpy);
    stubRewriter();

    await worker.fetch(
      new Request(shareUrl, { headers: { 'cf-connecting-ip': '203.0.113.7' } }),
      { ASSETS: htmlAssets(), SHARE_PROXY_SECRET: 'x'.repeat(48) },
    );

    const { headers } = fetchSpy.mock.calls[0][1];
    expect(headers['x-edge-client-ip']).toBe('203.0.113.7');
    expect(headers['x-edge-proxy-secret']).toBe('x'.repeat(48));
  });

  it('sends no edge headers when the secret is not configured', async () => {
    const fetchSpy = vi.fn().mockResolvedValue(new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    }));
    vi.stubGlobal('fetch', fetchSpy);
    stubRewriter();

    await worker.fetch(
      new Request(shareUrl, { headers: { 'cf-connecting-ip': '203.0.113.7' } }),
      { ASSETS: htmlAssets() },
    );

    const { headers } = fetchSpy.mock.calls[0][1];
    expect(headers['x-edge-client-ip']).toBeUndefined();
    expect(headers['x-edge-proxy-secret']).toBeUndefined();
  });

  it('returns a real 404 for an unknown SPA route', async () => {
    const response = await worker.fetch(
      new Request('https://mypersonalityquizzes.com/not-a-real-page'),
      { ASSETS: htmlAssets() },
    );

    expect(response.status).toBe(404);
  });

  it('keeps known SPA routes at 200', async () => {
    const response = await worker.fetch(
      new Request('https://mypersonalityquizzes.com/privacy'),
      { ASSETS: htmlAssets() },
    );

    expect(response.status).toBe(200);
  });
});
