import { readFileSync, readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Static guards over the migration set.
 *
 * These are the two invariants the whole access-control model rests on: there
 * is no server tier, so a table without RLS is a public table, and a
 * SECURITY DEFINER function without a pinned search_path is a privilege
 * escalation waiting for someone to create a shadowing object. Both are easy
 * to forget in a new migration and invisible in review.
 */

const DIR = new URL('.', import.meta.url);
const FILES = readdirSync(DIR).filter((name) => name.endsWith('.sql')).sort();
const SQL = FILES.map((name) => ({ name, body: readFileSync(new URL(name, DIR), 'utf8') }));
const ALL = SQL.map((f) => f.body).join('\n');

// Strip $$-quoted function bodies so statements *inside* a function are not
// mistaken for top-level DDL.
function withoutFunctionBodies(sql) {
  return sql.replace(/\$\$[\s\S]*?\$\$/g, '\n/* body */\n');
}

describe('migration safety invariants', () => {
  it('has migrations to check', () => {
    expect(FILES.length).toBeGreaterThan(0);
  });

  it('enables row level security on every table it creates', () => {
    const created = [...ALL.matchAll(/CREATE TABLE (?:IF NOT EXISTS )?public\.(\w+)/gi)]
      .map((m) => m[1]);
    const rlsEnabled = new Set(
      [...ALL.matchAll(/ALTER TABLE (?:public\.)?(\w+)\s+ENABLE ROW LEVEL SECURITY/gi)]
        .map((m) => m[1]),
    );

    expect(created.length).toBeGreaterThan(0);
    expect([...new Set(created)].filter((t) => !rlsEnabled.has(t))).toEqual([]);
  });

  it('pins search_path on every SECURITY DEFINER function', () => {
    const offenders = [];

    for (const { name, body } of SQL) {
      // Each CREATE FUNCTION header runs from CREATE up to the opening $$.
      for (const match of body.matchAll(/CREATE (?:OR REPLACE )?FUNCTION\s+([\s\S]*?)AS \$\$/gi)) {
        const header = match[1];
        if (!/SECURITY DEFINER/i.test(header)) continue;
        if (/SET\s+search_path\s*=/i.test(header)) continue;
        const fnName = header.match(/^\s*(?:public\.)?(\w+)/)?.[1] ?? '?';
        offenders.push(`${name}: ${fnName}`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('leaves no blanket USING (true) read policy in the final state', () => {
    // Migrations are a historical log, not a snapshot: "anyone can read shared
    // results" legitimately existed until 20260720000001 dropped it. What must
    // hold is that any blanket-read policy ever created is dropped by a LATER
    // migration and never recreated.
    const statements = withoutFunctionBodies(ALL).split(';');
    const live = new Map();

    for (const statement of statements) {
      const created = statement.match(/CREATE POLICY\s+"([^"]+)"/i);
      if (created && /USING\s*\(\s*true\s*\)/i.test(statement)) {
        live.set(created[1], true);
        continue;
      }
      const dropped = statement.match(/DROP POLICY\s+(?:IF EXISTS\s+)?"([^"]+)"/i);
      if (dropped) live.delete(dropped[1]);
    }

    expect([...live.keys()]).toEqual([]);
  });

  it('restates grants on the last CREATE OR REPLACE of every function', () => {
    // CREATE OR REPLACE silently drops existing grants, so only the FINAL
    // replacement of a function determines its live privileges. Anything else
    // falls back to Postgres' default PUBLIC EXECUTE.
    const lastDefinition = new Map();

    for (const { name, body } of SQL) {
      for (const m of body.matchAll(/CREATE (?:OR REPLACE )?FUNCTION\s+public\.(\w+)/gi)) {
        lastDefinition.set(m[1], { name, body });
      }
    }

    const offenders = [];
    for (const [fn, { name, body }] of lastDefinition) {
      // Trigger functions are invoked by the trigger, never granted.
      const isTrigger = new RegExp(
        `FUNCTION\\s+public\\.${fn}\\s*\\([^)]*\\)\\s*RETURNS trigger`, 'i',
      ).test(body);
      if (isTrigger) continue;

      const stated = new RegExp(
        `(REVOKE|GRANT)\\s+(?:ALL\\s+)?EXECUTE ON FUNCTION\\s+public\\.${fn}\\b`, 'i',
      ).test(body);
      if (!stated) offenders.push(`${name}: ${fn}`);
    }

    expect(offenders).toEqual([]);
  });
});
