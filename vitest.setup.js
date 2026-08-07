/**
 * Web Storage for the jsdom test environment.
 *
 * Node 22+ exposes its own `localStorage`/`sessionStorage` globals. They are
 * *own properties* of `globalThis`, and `localStorage` throws away its value
 * unless the process was started with `--localstorage-file`, so reading it
 * yields `undefined`.
 *
 * That matters here because Vitest's `populateGlobal` copies jsdom's window
 * onto `globalThis` but skips any key that is already present on it
 * (`if (k in global) return keysArray.includes(k)`) — and `localStorage` is not
 * on its allow-list. So on Node 22+ jsdom's storage is never installed, and
 * both `localStorage` and `window.localStorage` (Vitest aliases `window` to the
 * global) resolve to Node's inert one. Tests then fail with
 * "Cannot read properties of undefined (reading 'clear')".
 *
 * Node's `sessionStorage` is a working Storage, but it is process-wide, so test
 * files sharing a worker would leak state into each other. Both are therefore
 * replaced with a fresh instance per test environment rather than only
 * patching the broken one.
 *
 * Applied only under jsdom (`document` present) so that Node-environment tests
 * still fail honestly if they touch browser-only APIs.
 */

class MemoryStorage {
  #entries = new Map();

  get length() {
    return this.#entries.size;
  }

  key(index) {
    const keys = [...this.#entries.keys()];
    return index < keys.length ? keys[Number(index)] : null;
  }

  getItem(key) {
    const k = String(key);
    return this.#entries.has(k) ? this.#entries.get(k) : null;
  }

  setItem(key, value) {
    this.#entries.set(String(key), String(value));
  }

  removeItem(key) {
    this.#entries.delete(String(key));
  }

  clear() {
    this.#entries.clear();
  }
}

if (typeof document !== 'undefined') {
  for (const name of ['localStorage', 'sessionStorage']) {
    Object.defineProperty(globalThis, name, {
      value: new MemoryStorage(),
      configurable: true,
      writable: true,
    });
  }
}
