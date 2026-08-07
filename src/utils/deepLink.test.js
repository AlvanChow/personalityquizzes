import { describe, expect, it } from 'vitest';
import {
  parseDeepLink,
  safeRedirectPath,
  NATIVE_URL_SCHEME,
  NATIVE_AUTH_REDIRECT,
} from './deepLink';

describe('safeRedirectPath', () => {
  it('keeps a same-site absolute path intact, query and hash included', () => {
    expect(safeRedirectPath('/quiz/mbti/result?from=share#details'))
      .toBe('/quiz/mbti/result?from=share#details');
  });

  it('rejects anything that could leave the origin', () => {
    expect(safeRedirectPath('//evil.example.com')).toBe('');
    expect(safeRedirectPath('https://evil.example.com')).toBe('');
    expect(safeRedirectPath('quiz/mbti')).toBe('');
  });

  it('rejects control characters that could be smuggled into a URL', () => {
    expect(safeRedirectPath('/circle')).toBe('/circle');  // control
    expect(safeRedirectPath('/circle\nSet-Cookie: a=b')).toBe('');
    expect(safeRedirectPath('/circle\u007f')).toBe('');  // DEL
  });

  it('rejects non-strings', () => {
    expect(safeRedirectPath(undefined)).toBe('');
    expect(safeRedirectPath(null)).toBe('');
    expect(safeRedirectPath(42)).toBe('');
  });
});

describe('parseDeepLink', () => {
  it('reads the PKCE code out of the OAuth callback', () => {
    expect(parseDeepLink(`${NATIVE_AUTH_REDIRECT}?code=abc123`))
      .toEqual({ kind: 'auth-code', code: 'abc123', next: '' });
  });

  it('carries the return path through the callback', () => {
    expect(parseDeepLink(`${NATIVE_AUTH_REDIRECT}?code=abc123&next=%2Fs%2Fdeadbeef`))
      .toEqual({ kind: 'auth-code', code: 'abc123', next: '/s/deadbeef' });
  });

  // The return path survives a round trip through the provider and iOS, so it
  // is attacker-influenced by the time it gets back here.
  it('drops an off-site return path rather than following it', () => {
    expect(parseDeepLink(`${NATIVE_AUTH_REDIRECT}?code=abc&next=https%3A%2F%2Fevil.example.com`))
      .toEqual({ kind: 'auth-code', code: 'abc', next: '' });
    expect(parseDeepLink(`${NATIVE_AUTH_REDIRECT}?code=abc&next=%2F%2Fevil.example.com`))
      .toEqual({ kind: 'auth-code', code: 'abc', next: '' });
  });

  it('surfaces a provider error instead of a code', () => {
    expect(parseDeepLink(`${NATIVE_AUTH_REDIRECT}?error=access_denied&error_description=User%20cancelled`))
      .toEqual({ kind: 'auth-error', message: 'User cancelled' });
    expect(parseDeepLink(`${NATIVE_AUTH_REDIRECT}?error=access_denied`))
      .toEqual({ kind: 'auth-error', message: 'access_denied' });
  });

  it('ignores a callback carrying neither a code nor an error', () => {
    expect(parseDeepLink(`${NATIVE_URL_SCHEME}://auth-callback`)).toBeNull();
  });

  it('routes a share link on either site host', () => {
    expect(parseDeepLink('https://mypersonalityquizzes.com/s/deadbeef'))
      .toEqual({ kind: 'route', path: '/s/deadbeef' });
    expect(parseDeepLink('https://www.mypersonalityquizzes.com/quiz/grit?x=1#y'))
      .toEqual({ kind: 'route', path: '/quiz/grit?x=1#y' });
  });

  it('ignores links to other hosts and other schemes', () => {
    expect(parseDeepLink('https://evil.example.com/s/deadbeef')).toBeNull();
    expect(parseDeepLink('http://mypersonalityquizzes.com/s/deadbeef')).toBeNull();
    expect(parseDeepLink('someotherapp://auth-callback?code=abc')).toBeNull();
  });

  it('ignores junk instead of throwing', () => {
    expect(parseDeepLink('not a url')).toBeNull();
    expect(parseDeepLink('')).toBeNull();
    expect(parseDeepLink(undefined)).toBeNull();
    expect(parseDeepLink(null)).toBeNull();
  });
});
