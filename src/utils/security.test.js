import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  safeJsonParse,
  safeLocalStorageRead,
  safeLocalStorageRemove,
  safeLocalStorageWrite,
  isValidShareId,
} from './security';

function memoryStorage() {
  const values = new Map();
  return {
    getItem: vi.fn((key) => values.get(key) ?? null),
    setItem: vi.fn((key, value) => values.set(key, value)),
    removeItem: vi.fn((key) => values.delete(key)),
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('safe storage', () => {
  it('removes prototype-pollution keys while parsing', () => {
    const value = safeJsonParse('{"safe":1,"constructor":{"bad":true}}');
    expect(value).toEqual({ safe: 1 });
  });

  it('falls back to sessionStorage when localStorage rejects writes', () => {
    const local = memoryStorage();
    local.setItem.mockImplementation(() => { throw new Error('quota'); });
    const session = memoryStorage();
    vi.stubGlobal('localStorage', local);
    vi.stubGlobal('sessionStorage', session);

    expect(safeLocalStorageWrite('result', { type: 'INTJ' })).toBe(true);
    expect(safeLocalStorageRead('result')).toEqual({ type: 'INTJ' });
  });

  it('falls back to sessionStorage when localStorage is missing', () => {
    const session = memoryStorage();
    vi.stubGlobal('localStorage', undefined);
    vi.stubGlobal('sessionStorage', session);

    expect(safeLocalStorageWrite('result', { type: 'INTJ' })).toBe(true);
    expect(session.setItem).toHaveBeenCalledOnce();
  });

  it('ignores corrupt persistent JSON when a valid session fallback exists', () => {
    const local = memoryStorage();
    const session = memoryStorage();
    local.setItem('result', '{broken');
    session.setItem('result', JSON.stringify({ type: 'INTJ' }));
    vi.stubGlobal('localStorage', local);
    vi.stubGlobal('sessionStorage', session);

    expect(safeLocalStorageRead('result')).toEqual({ type: 'INTJ' });
  });

  it('returns false instead of throwing when every storage is unavailable', () => {
    const blocked = {
      getItem: () => { throw new Error('blocked'); },
      setItem: () => { throw new Error('blocked'); },
      removeItem: () => { throw new Error('blocked'); },
    };
    vi.stubGlobal('localStorage', blocked);
    vi.stubGlobal('sessionStorage', blocked);

    expect(safeLocalStorageWrite('result', { ok: true })).toBe(false);
    expect(safeLocalStorageRead('result', 'fallback')).toBe('fallback');
    expect(() => safeLocalStorageRemove('result')).not.toThrow();
  });
});

describe('share ID validation', () => {
  it('accepts only 128-bit lowercase hex tokens', () => {
    expect(isValidShareId('0123456789abcdef0123456789abcdef')).toBe(true);
    expect(isValidShareId('01234567')).toBe(false);
    expect(isValidShareId('0123456789ABCDEF0123456789ABCDEF')).toBe(false);
  });
});
