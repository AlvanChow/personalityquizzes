/* global HTMLRewriter */
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from '../src/config/supabase';
import { isKnownAppPath } from '../src/config/publicRoutes';

const SHARE_ID_RE = /^[a-f0-9]{32}$/;
const SITE_NAME = 'My Personality Quizzes';
const DEFAULT_DESCRIPTION = 'A friend shared a personality result with you. See their result and discover your own type.';

const QUIZ_LABELS = {
  big5: 'Big Five',
  cake: 'Cake',
  enneagram: 'Enneagram',
  house: 'Wizarding House',
  mbti: 'MBTI',
};

function cleanText(value, maxLength) {
  return typeof value === 'string'
    ? Array.from(value)
      .filter((character) => {
        const code = character.charCodeAt(0);
        return code >= 32 && code !== 127;
      })
      .join('')
      .trim()
      .slice(0, maxLength)
    : '';
}

export function buildShareMetadata(shared, canonicalUrl) {
  const name = cleanText(shared?.result_name, 100);
  const emoji = cleanText(shared?.result_emoji, 16);
  const quizType = cleanText(shared?.quiz_type, 32);
  const quizLabel = QUIZ_LABELS[quizType] || 'Personality';
  const title = name
    ? `${emoji ? `${emoji} ` : ''}${name} — ${quizLabel} Result`
    : `Shared Personality Result — ${SITE_NAME}`;
  const description = name
    ? `See this ${quizLabel} result: ${name}. Take the quiz to discover and save your own result.`
    : DEFAULT_DESCRIPTION;

  return {
    title: cleanText(title, 160),
    description: cleanText(description, 240),
    canonicalUrl,
  };
}

async function fetchSharedResult(shareId, request, env) {
  const headers = {
    apikey: DEFAULT_SUPABASE_ANON_KEY,
    authorization: `Bearer ${DEFAULT_SUPABASE_ANON_KEY}`,
    'content-type': 'application/json',
  };

  // This call is server-to-server, so Supabase's edge sees this Worker's egress
  // address rather than the visitor's — which would put every visitor to every
  // share link in a single per-IP rate-limit bucket. Forward the real address,
  // authenticated with a shared secret so the database can tell an edge-supplied
  // header apart from a client-supplied one (see request_client_ip). Without
  // SHARE_PROXY_SECRET configured on both sides, nothing is sent and the
  // database ignores the headers entirely.
  const clientIp = request.headers.get('cf-connecting-ip');
  if (env.SHARE_PROXY_SECRET && clientIp) {
    headers['x-edge-proxy-secret'] = env.SHARE_PROXY_SECRET;
    headers['x-edge-client-ip'] = clientIp;
  }

  const response = await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/rpc/get_shared_result`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ p_id: shareId }),
    signal: AbortSignal.timeout(1800),
  });
  if (!response.ok) {
    throw new Error(`Share service returned HTTP ${response.status}`);
  }
  const payload = await response.json();
  return Array.isArray(payload) ? (payload[0] ?? null) : payload;
}

function withStatus(response, status, cacheControl) {
  const headers = new Headers(response.headers);
  headers.set('cache-control', cacheControl);
  return new Response(response.body, { status, headers });
}

function applyMetadata(response, metadata) {
  const setContent = (content) => ({
    element(element) { element.setAttribute('content', content); },
  });

  return new HTMLRewriter()
    .on('title', { element(element) { element.setInnerContent(metadata.title); } })
    .on('meta[name="description"]', setContent(metadata.description))
    .on('meta[property="og:title"]', setContent(metadata.title))
    .on('meta[property="og:description"]', setContent(metadata.description))
    .on('meta[property="og:url"]', setContent(metadata.canonicalUrl))
    .on('meta[name="twitter:title"]', setContent(metadata.title))
    .on('meta[name="twitter:description"]', setContent(metadata.description))
    .on('link[rel="canonical"]', {
      element(element) { element.setAttribute('href', metadata.canonicalUrl); },
    })
    .transform(response);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const match = url.pathname.match(/^\/s\/([^/]+)\/?$/);
    if (request.method !== 'GET') return env.ASSETS.fetch(request);

    if (match && SHARE_ID_RE.test(match[1])) {
      const canonicalUrl = `https://mypersonalityquizzes.com/s/${match[1]}`;
      const shellPromise = env.ASSETS.fetch(request);
      let shared;
      let lookupFailed = false;
      try {
        shared = await fetchSharedResult(match[1], request, env);
      } catch {
        // Rate limit, timeout, or a Supabase outage. A failed lookup is not
        // proof the share is missing, so serve the app shell with generic
        // metadata instead of failing the request: the SPA repeats the lookup
        // from the visitor's own browser and renders either the result or its
        // own not-found state. Only a *successful* empty lookup is a 404.
        lookupFailed = true;
        shared = null;
      }

      const shell = await shellPromise;
      if (!shell.ok || !shell.headers.get('content-type')?.includes('text/html')) return shell;

      if (lookupFailed) {
        return applyMetadata(
          withStatus(shell, 200, 'no-store'),
          buildShareMetadata(null, canonicalUrl),
        );
      }

      const status = shared ? 200 : 404;
      const html = withStatus(
        shell,
        status,
        shared ? 'public, max-age=300' : 'no-store',
      );
      return applyMetadata(html, buildShareMetadata(shared, canonicalUrl));
    }

    const assetResponse = await env.ASSETS.fetch(request);
    const isHtml = assetResponse.headers.get('content-type')?.includes('text/html');
    if (isHtml && !isKnownAppPath(url.pathname)) {
      return withStatus(assetResponse, 404, 'no-store');
    }
    return assetResponse;
  },
};
