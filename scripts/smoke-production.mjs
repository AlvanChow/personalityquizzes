import { readFile } from 'node:fs/promises';
import { DEFAULT_SUPABASE_ANON_KEY } from '../src/config/supabase.js';

const baseUrl = (process.env.SMOKE_BASE_URL || 'https://mypersonalityquizzes.com').replace(/\/+$/, '');
const wwwUrl = (process.env.SMOKE_WWW_URL || 'https://www.mypersonalityquizzes.com').replace(/\/+$/, '');
const authHealthUrl = process.env.SMOKE_AUTH_HEALTH_URL
  || 'https://auth.mypersonalityquizzes.com/auth/v1/health';
const authSettingsUrl = process.env.SMOKE_AUTH_SETTINGS_URL
  || 'https://auth.mypersonalityquizzes.com/auth/v1/settings';
const shareCanaryId = process.env.SMOKE_SHARE_CANARY_ID
  || '0000000000000000000000000000cafe';
const skipBuildMatch = process.env.SMOKE_SKIP_BUILD_MATCH === '1';
const attempts = Number.parseInt(process.env.SMOKE_ATTEMPTS || '12', 10);
const retryDelayMs = Number.parseInt(process.env.SMOKE_RETRY_DELAY_MS || '5000', 10);

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

async function retry(label, check) {
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      await check();
      console.log(`✓ ${label}`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < attempts) {
        console.log(`Retrying ${label} (${attempt}/${attempts}): ${error.message}`);
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
      }
    }
  }

  throw new Error(`${label} failed after ${attempts} attempts: ${lastError?.message}`);
}

async function fetchText(url, headers = {}) {
  const response = await fetch(url, {
    headers: {
      'user-agent': 'personalityquizzes-production-smoke/1.0',
      ...headers,
    },
    signal: AbortSignal.timeout(10_000),
  });
  const body = await response.text();
  return { response, body };
}

async function expectedEntryAsset() {
  if (skipBuildMatch) return null;

  const distHtml = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
  const match = distHtml.match(/<script\b[^>]*\bsrc="([^"]*\/assets\/index-[^"]+\.js)"/i);
  requireValue(match, 'Could not find the built entry asset in dist/index.html');
  return match[1];
}

async function checkAppShell(url, entryAsset) {
  const { response, body } = await fetchText(`${url}/`);
  requireValue(response.status === 200, `${url} returned HTTP ${response.status}`);
  requireValue(
    response.headers.get('content-type')?.includes('text/html'),
    `${url} did not return HTML`,
  );
  requireValue(body.includes('My Personality Quizzes'), `${url} returned the wrong app shell`);
  if (entryAsset) {
    requireValue(
      body.includes(entryAsset),
      `${url} is not serving the just-built asset ${entryAsset}`,
    );
  }
}

async function checkShareRoute() {
  const shareUrl = `${baseUrl}/s/${shareCanaryId}`;
  const { response, body } = await fetchText(shareUrl);
  requireValue(response.status === 200, `${shareUrl} returned HTTP ${response.status}`);
  requireValue(
    response.headers.get('cache-control')?.includes('max-age=300'),
    `${shareUrl} is missing the Worker cache policy`,
  );
  requireValue(
    body.includes(`href="${shareUrl}"`) && body.includes(`content="${shareUrl}"`),
    `${shareUrl} is missing Worker-generated canonical metadata`,
  );
  requireValue(
    body.includes('Big Five Personality Profile')
      && body.includes('Big Five Result')
      && !body.includes('Shared Personality Result — My Personality Quizzes'),
    `${shareUrl} did not return the expected permanent Big Five canary`,
  );
}

async function checkAuthDomain() {
  const { response } = await fetchText(authHealthUrl);
  requireValue(
    response.status === 401,
    `${authHealthUrl} returned HTTP ${response.status}; expected 401 without an API key`,
  );
}

async function checkAuthProviders() {
  const { response, body } = await fetchText(authSettingsUrl, {
    apikey: DEFAULT_SUPABASE_ANON_KEY,
    authorization: `Bearer ${DEFAULT_SUPABASE_ANON_KEY}`,
  });
  requireValue(response.status === 200, `${authSettingsUrl} returned HTTP ${response.status}`);
  const settings = JSON.parse(body);
  requireValue(settings?.external?.google === true, 'Google authentication is not enabled');
  requireValue(
    settings?.external?.email === false,
    'Email/password authentication is still enabled in Supabase',
  );
}

async function checkNotFoundStatuses() {
  const routes = [
    '/not-a-real-page',
    '/s/01234567',
    '/s/ffffffffffffffffffffffffffffffff',
  ];

  for (const route of routes) {
    const { response } = await fetchText(`${baseUrl}${route}`);
    requireValue(
      response.status === 404,
      `${baseUrl}${route} returned HTTP ${response.status}; expected 404`,
    );
  }
}

const entryAsset = await expectedEntryAsset();

await Promise.all([
  retry('apex domain serves the deployed build', () => checkAppShell(baseUrl, entryAsset)),
  retry('www domain serves the deployed build', () => checkAppShell(wwwUrl, entryAsset)),
  retry('share route reaches the Worker', checkShareRoute),
  retry('branded auth domain reaches Supabase', checkAuthDomain),
  retry('only the intended Google auth provider is enabled', checkAuthProviders),
  retry('unknown and missing routes return real 404s', checkNotFoundStatuses),
]);

console.log('Production smoke test passed.');
