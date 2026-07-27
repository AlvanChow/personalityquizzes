/**
 * Development-only console helpers.
 *
 * Raw Supabase errors carry SQLSTATE codes, constraint names, and hints — the
 * kind of internal detail ErrorBoundary already refuses to print in production.
 * That policy was applied in some call sites and not others, so every
 * diagnostic now goes through here instead of calling console directly. The
 * `no-console` ESLint rule keeps it that way; this file is the one exception.
 *
 * `import.meta.env.DEV` is a compile-time constant, so the console calls are
 * eliminated from the production bundle rather than merely skipped.
 */

export function devError(...args) {
  if (import.meta.env.DEV) console.error(...args);
}

export function devWarn(...args) {
  if (import.meta.env.DEV) console.warn(...args);
}
