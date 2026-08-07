/**
 * Deep-link parsing for the iOS shell (`ios-app/`).
 *
 * Pure string logic, deliberately free of any Capacitor import so it can be
 * unit-tested in the plain node environment the rest of the suite uses.
 *
 * Two kinds of link reach the app:
 *   1. `com.mypersonalityquizzes.app://auth-callback?code=…` — the OAuth
 *      redirect coming back from the system browser (see AuthContext).
 *   2. `https://mypersonalityquizzes.com/s/abc123` — a share link, when
 *      Universal Links are configured (see `ios-app/README.md`).
 */

/** Must stay in sync with CFBundleURLSchemes in ios-app/ios/App/App/Info.plist. */
export const NATIVE_URL_SCHEME = 'com.mypersonalityquizzes.app';

/** Registered as an additional redirect URL in the Supabase auth settings. */
export const NATIVE_AUTH_REDIRECT = `${NATIVE_URL_SCHEME}://auth-callback`;

/** Hosts whose https links the app claims via Universal Links. */
export const SITE_HOSTS = ['mypersonalityquizzes.com', 'www.mypersonalityquizzes.com'];

/**
 * Narrow an untrusted redirect target to a same-site absolute path.
 *
 * Rejects anything that could leave the origin (`//evil.com`, `https://…`) or
 * smuggle control characters into a header or URL. Returns '' when unusable,
 * which every caller treats as "land on the current page / home".
 */
export function safeRedirectPath(path) {
  if (typeof path !== 'string') return '';
  if (!path.startsWith('/') || path.startsWith('//')) return '';
  const hasControlCharacters = Array.from(path).some((char) => {
    const code = char.charCodeAt(0);
    return code < 32 || code === 127;
  });
  return hasControlCharacters ? '' : path;
}

/**
 * Classify an incoming deep link.
 *
 * @returns one of
 *   `{ kind: 'auth-code', code, next }`   — exchange `code` for a session
 *   `{ kind: 'auth-error', message }`     — provider denied or cancelled
 *   `{ kind: 'route', path }`             — navigate in-app
 *   `null`                                — not ours; ignore
 */
export function parseDeepLink(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl) return null;

  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return null;
  }

  if (url.protocol === `${NATIVE_URL_SCHEME}:`) {
    const error = url.searchParams.get('error_description') || url.searchParams.get('error');
    if (error) return { kind: 'auth-error', message: error };

    const code = url.searchParams.get('code');
    if (code) {
      return { kind: 'auth-code', code, next: safeRedirectPath(url.searchParams.get('next')) };
    }
    return null;
  }

  // Universal Link into the site. `url.pathname` is already origin-relative and
  // starts with '/', but it still goes through safeRedirectPath so a malformed
  // host-relative value can never be handed to the router.
  if (url.protocol === 'https:' && SITE_HOSTS.includes(url.hostname)) {
    const path = safeRedirectPath(`${url.pathname}${url.search}${url.hash}`);
    return path ? { kind: 'route', path } : null;
  }

  return null;
}
