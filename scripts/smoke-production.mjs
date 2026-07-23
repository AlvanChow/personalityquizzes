import { readFile } from 'node:fs/promises';

const baseUrl = (process.env.SMOKE_BASE_URL || 'https://mypersonalityquizzes.com').replace(/\/+$/, '');
const wwwUrl = (process.env.SMOKE_WWW_URL || 'https://www.mypersonalityquizzes.com').replace(/\/+$/, '');
const authHealthUrl = process.env.SMOKE_AUTH_HEALTH_URL
  || 'https://auth.mypersonalityquizzes.com/auth/v1/health';
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

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'personalityquizzes-production-smoke/1.0' },
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
  const shareUrl = `${baseUrl}/s/01234567`;
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
    body.includes('Shared Personality Result'),
    `${shareUrl} did not run the share metadata Worker`,
  );
}

async function checkAuthDomain() {
  const { response } = await fetchText(authHealthUrl);
  requireValue(
    response.status === 401,
    `${authHealthUrl} returned HTTP ${response.status}; expected 401 without an API key`,
  );
}

const entryAsset = await expectedEntryAsset();

await Promise.all([
  retry('apex domain serves the deployed build', () => checkAppShell(baseUrl, entryAsset)),
  retry('www domain serves the deployed build', () => checkAppShell(wwwUrl, entryAsset)),
  retry('share route reaches the Worker', checkShareRoute),
  retry('branded auth domain reaches Supabase', checkAuthDomain),
]);

console.log('Production smoke test passed.');
