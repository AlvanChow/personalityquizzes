import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { generateShareCatalog } from './generate-share-catalog.mjs';

const migrationsUrl = new URL('../supabase/migrations/', import.meta.url);
const marker = '$share_catalog$';
const migrationFiles = (await readdir(migrationsUrl))
  .filter((file) => file.endsWith('.sql'))
  .sort()
  .reverse();

let catalogMigration = null;
let migration = null;
for (const file of migrationFiles) {
  const contents = await readFile(new URL(file, migrationsUrl), 'utf8');
  if (contents.includes(marker)) {
    catalogMigration = file;
    migration = contents;
    break;
  }
}

assert(catalogMigration, 'No migration contains a server share catalog');
const start = migration.indexOf(marker);
const end = migration.indexOf(marker, start + marker.length);

assert.notEqual(start, -1, 'Share catalog start marker is missing from the migration');
assert.notEqual(end, -1, 'Share catalog end marker is missing from the migration');

const migrationCatalog = JSON.parse(migration.slice(start + marker.length, end));
const sourceCatalog = await generateShareCatalog();

assert.deepEqual(
  migrationCatalog,
  sourceCatalog,
  'The database share catalog is stale. Regenerate it when quiz results change.',
);

console.log(
  `Share catalog verified (${sourceCatalog.length} canonical results in ${catalogMigration}).`,
);
