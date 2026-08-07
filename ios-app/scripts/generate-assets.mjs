#!/usr/bin/env node
/**
 * Render the app icon and launch screen from brand/*.svg into the Xcode asset
 * catalogue. Run `npm run assets` after editing either SVG.
 *
 * Two things this guarantees that hand-exporting does not:
 *
 *   - No alpha channel. App Store Connect rejects an app icon that has one,
 *     and the rejection arrives after upload, not at build time.
 *   - sRGB, 8-bit. Xcode warns on anything else.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const ASSETS = join(ROOT, 'ios/App/App/Assets.xcassets');

// The splash is one square image shown with scaleAspectFill; three identical
// copies is simply what the generated Contents.json asks for (1x/2x/3x).
const TARGETS = [
  { src: 'brand/icon.svg', size: 1024, out: ['AppIcon.appiconset/AppIcon-512@2x.png'] },
  {
    src: 'brand/splash.svg',
    size: 2732,
    out: [
      'Splash.imageset/splash-2732x2732.png',
      'Splash.imageset/splash-2732x2732-1.png',
      'Splash.imageset/splash-2732x2732-2.png',
    ],
  },
];

for (const { src, size, out } of TARGETS) {
  const png = await sharp(join(ROOT, src), { density: 400 })
    .resize(size, size, { fit: 'cover' })
    // flatten() drops the alpha channel against an opaque backdrop. The colour
    // matches the SVG ground so an antialiased edge never picks up a halo.
    .flatten({ background: '#15141d' })
    .png({ compressionLevel: 9 })
    .toColorspace('srgb')
    .toBuffer();

  for (const relative of out) {
    const dest = join(ASSETS, relative);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, png);
    console.log(`${relative}  ${size}×${size}  ${(png.length / 1024).toFixed(0)} kB`);
  }
}

console.log('\nAssets written. Run `npm run sync` to copy them into the build.');
