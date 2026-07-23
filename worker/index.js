/* global HTMLRewriter */
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from '../src/config/supabase';

const SHARE_ID_RE = /^(?:[a-f0-9]{8}|[a-f0-9]{32})$/;
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

async function fetchSharedResult(shareId) {
  const response = await fetch(`${DEFAULT_SUPABASE_URL}/rest/v1/rpc/get_shared_result`, {
    method: 'POST',
    headers: {
      apikey: DEFAULT_SUPABASE_ANON_KEY,
      authorization: `Bearer ${DEFAULT_SUPABASE_ANON_KEY}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ p_id: shareId }),
    signal: AbortSignal.timeout(1800),
  });
  if (!response.ok) return null;
  const payload = await response.json();
  return Array.isArray(payload) ? (payload[0] ?? null) : payload;
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
    if (request.method !== 'GET' || !match || !SHARE_ID_RE.test(match[1])) {
      return env.ASSETS.fetch(request);
    }

    const canonicalUrl = `https://mypersonalityquizzes.com/s/${match[1]}`;
    const [shell, shared] = await Promise.all([
      env.ASSETS.fetch(new Request(new URL('/index.html', request.url), request)),
      fetchSharedResult(match[1]).catch(() => null),
    ]);
    if (!shell.ok || !shell.headers.get('content-type')?.includes('text/html')) return shell;

    const headers = new Headers(shell.headers);
    headers.set('cache-control', 'public, max-age=300');
    const html = new Response(shell.body, { status: shell.status, headers });
    return applyMetadata(html, buildShareMetadata(shared, canonicalUrl));
  },
};
