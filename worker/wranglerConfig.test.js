import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const config = JSON.parse(
  readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8'),
);

describe('Cloudflare asset routing', () => {
  it('runs the Worker before the SPA fallback for navigation routes', () => {
    expect(config.assets.run_worker_first).toEqual([
      '/*',
      '!/assets/*',
      '!/og-image.png',
      '!/vite.svg',
    ]);
  });
});
