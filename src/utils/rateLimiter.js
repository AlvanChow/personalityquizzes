/**
 * Client-side sliding-window rate limiter.
 *
 * Each named "bucket" tracks timestamps of recent actions. When a caller asks
 * to perform an action via `allow()`, the limiter checks whether the number of
 * actions in the current window exceeds the configured maximum. If so, the
 * action is rejected (returns false).
 *
 * This is a defense-in-depth layer — it prevents runaway client code or casual
 * abuse from hammering Supabase endpoints. Server/DB-level constraints remain
 * the authoritative backstop.
 */

const buckets = new Map();

/**
 * Check whether an action is allowed under rate limiting rules.
 *
 * @param {string}  key       - Unique identifier for the rate-limit bucket
 *                               (e.g. 'analytics', 'share', 'quiz_save').
 * @param {number}  maxCalls  - Maximum number of calls allowed within `windowMs`.
 * @param {number}  windowMs  - Sliding window duration in milliseconds.
 * @returns {boolean} true if the action is allowed, false if rate-limited.
 */
export function allow(key, maxCalls, windowMs) {
  const now = Date.now();
  let timestamps = buckets.get(key);

  if (!timestamps) {
    timestamps = [];
    buckets.set(key, timestamps);
  }

  // Evict expired entries outside the window
  const cutoff = now - windowMs;
  while (timestamps.length > 0 && timestamps[0] <= cutoff) {
    timestamps.shift();
  }

  if (timestamps.length >= maxCalls) {
    return false;
  }

  timestamps.push(now);
  return true;
}

/**
 * Reset a specific rate-limit bucket (useful for testing or logout).
 * @param {string} key - The bucket key to reset.
 */
export function reset(key) {
  buckets.delete(key);
}

/**
 * Reset all rate-limit buckets.
 */
export function resetAll() {
  buckets.clear();
}

// ─── Pre-configured limiters for common operations ──────────────────────────

/** Analytics events: max 30 per 60 seconds */
export function allowAnalytics() {
  return allow('analytics', 30, 60_000);
}

/** Share link creation: max 5 per 60 seconds */
export function allowShare() {
  return allow('share', 5, 60_000);
}

/** Quiz result save to Supabase: max 5 per 60 seconds */
export function allowQuizSave() {
  return allow('quiz_save', 5, 60_000);
}

/** Profile sync to Supabase: max 10 per 60 seconds */
export function allowProfileSync() {
  return allow('profile_sync', 10, 60_000);
}

/** Shared result view-count increment: max 3 per 30 seconds */
export function allowViewIncrement() {
  return allow('view_increment', 3, 30_000);
}

/** Admin dashboard data fetch: max 5 per 30 seconds */
export function allowAdminFetch() {
  return allow('admin_fetch', 5, 30_000);
}

/** Auth actions (sign-in / sign-out): max 5 per 60 seconds */
export function allowAuth() {
  return allow('auth', 5, 60_000);
}
