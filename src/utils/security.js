/**
 * Security utility functions for input sanitization and safe data handling.
 *
 * These are defense-in-depth measures that protect against:
 * - Prototype pollution via JSON.parse of untrusted data
 * - localStorage tampering
 * - Unexpected data shapes from external sources
 */

/**
 * Safely parse JSON with protection against prototype pollution.
 * Strips __proto__, constructor, and prototype keys from parsed objects.
 *
 * @param {string} raw - The raw JSON string to parse.
 * @param {*} fallback - Value to return if parsing fails.
 * @returns {*} The parsed and sanitized value, or the fallback.
 */
export function safeJsonParse(raw, fallback = null) {
  if (typeof raw !== 'string') return fallback;

  try {
    return JSON.parse(raw, (key, value) => {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        return undefined;
      }
      return value;
    });
  } catch {
    return fallback;
  }
}

/**
 * Read and safely parse a JSON value from localStorage.
 * Returns the fallback if the key doesn't exist, parsing fails, or
 * localStorage is unavailable.
 *
 * @param {string} key - The localStorage key.
 * @param {*} fallback - Value to return on failure.
 * @returns {*} The parsed value or fallback.
 */
export function safeLocalStorageRead(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return safeJsonParse(raw, fallback);
  } catch {
    return fallback;
  }
}

/**
 * Validate that a value is a plain object (not null, not an array).
 * @param {*} val
 * @returns {boolean}
 */
export function isPlainObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}

/**
 * Sanitize a string for safe display — strips control characters (except
 * common whitespace) that could cause rendering issues.
 *
 * @param {string} str - The input string.
 * @param {number} maxLen - Maximum allowed length (default 500).
 * @returns {string} The sanitized string.
 */
export function sanitizeString(str, maxLen = 500) {
  if (typeof str !== 'string') return '';
  // Remove control chars except tab, newline, carriage return
  // eslint-disable-next-line no-control-regex
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').slice(0, maxLen);
}

/**
 * Validate a UUID v4 string format.
 * @param {string} id
 * @returns {boolean}
 */
export function isValidUUID(id) {
  if (typeof id !== 'string') return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

/**
 * Validate a share ID format (8 lowercase hex characters).
 * @param {string} id
 * @returns {boolean}
 */
export function isValidShareId(id) {
  if (typeof id !== 'string') return false;
  return /^[a-f0-9]{8}$/.test(id);
}
