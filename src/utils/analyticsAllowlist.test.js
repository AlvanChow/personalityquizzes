import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Keeps three independent allowlists of analytics event names in agreement:
 *
 *   1. the `track('…')` call sites across src/
 *   2. ALLOWED_EVENTS in src/utils/analytics.js       (drops unknown names)
 *   3. analytics_events_event_allowlist in Postgres   (rejects unknown names)
 *
 * All three are plain lists maintained by hand, and a name missing from 2 or 3
 * fails silently — `track()` returns early behind a dev-only warning, so the
 * event simply never exists and nobody notices until someone goes looking for
 * a funnel that was never recorded. That is exactly how
 * `account_delete_requested` shipped emitting into a void.
 *
 * Read as source text rather than imported so the DB constraint (SQL) and the
 * call sites (JSX) can be compared without a build step.
 */

const root = new URL('../../', import.meta.url);
const read = (p) => readFileSync(new URL(p, root), 'utf8');

/** Every event name passed to track() anywhere under src/. */
function trackedEventNames() {
  const names = new Set();
  const walk = (dir) => {
    for (const entry of readdirSync(new URL(dir, root), { withFileTypes: true })) {
      const path = `${dir}${entry.name}`;
      if (entry.isDirectory()) walk(`${path}/`);
      else if (/\.jsx?$/.test(entry.name) && !/\.test\.jsx?$/.test(entry.name)) {
        for (const m of read(path).matchAll(/\btrack\(\s*'([^']+)'/g)) names.add(m[1]);
      }
    }
  };
  walk('src/');
  return names;
}

/** ALLOWED_EVENTS in analytics.js. */
function clientAllowlist() {
  const block = read('src/utils/analytics.js')
    .match(/const ALLOWED_EVENTS = new Set\(\[([\s\S]*?)\]\)/)?.[1] ?? '';
  return new Set([...block.matchAll(/'([^']+)'/g)].map((m) => m[1]));
}

/**
 * The event allowlist from the newest migration that redefines the CHECK
 * constraint — the constraint is restated in full each time, so the last one
 * in filename order is the live definition.
 */
function databaseAllowlist() {
  const dir = 'supabase/migrations/';
  const files = readdirSync(new URL(dir, root))
    .filter((f) => f.endsWith('.sql'))
    .sort();

  let latest = null;
  for (const file of files) {
    const match = read(`${dir}${file}`).match(
      /ADD CONSTRAINT analytics_events_event_allowlist\s*CHECK \(event IN \(([\s\S]*?)\)\)/,
    );
    if (match) latest = match[1];
  }
  if (latest === null) throw new Error('no analytics event allowlist constraint found');
  return new Set([...latest.matchAll(/'([^']+)'/g)].map((m) => m[1]));
}

describe('analytics event allowlists', () => {
  const tracked = trackedEventNames();
  const client = clientAllowlist();
  const database = databaseAllowlist();

  it('finds the call sites and both allowlists', () => {
    expect(tracked.size).toBeGreaterThan(10);
    expect(client.size).toBeGreaterThan(10);
    expect(database.size).toBeGreaterThan(10);
  });

  it('lets every event the app emits through the client allowlist', () => {
    const dropped = [...tracked].filter((e) => !client.has(e));
    expect(dropped).toEqual([]);
  });

  it('lets every event the app emits through the database constraint', () => {
    // A name that clears ALLOWED_EVENTS but not the CHECK constraint is worse
    // than one dropped client-side: the insert reaches Postgres and fails.
    const rejected = [...tracked].filter((e) => !database.has(e));
    expect(rejected).toEqual([]);
  });

  it('keeps the client allowlist within what the database accepts', () => {
    const unknown = [...client].filter((e) => !database.has(e));
    expect(unknown).toEqual([]);
  });
});
