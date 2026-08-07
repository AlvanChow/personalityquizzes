import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * Static guards over the iOS shell's configuration.
 *
 * Everything checked here is a value that has to be identical in two or three
 * unrelated files — a JSON config, an Xcode plist, and a JS module. Nothing
 * fails at build time when they drift; sign-in simply stops working on device,
 * which is the slowest possible place to find out. These run in the normal
 * `npm test` suite and need no Xcode, no macOS, and no ios-app/node_modules.
 */

const read = (p) => readFileSync(new URL(p, import.meta.url), 'utf8');
const readJson = (p) => JSON.parse(read(p));

const capacitorConfig = readJson('./capacitor.config.json');
const iosPackage = readJson('./package.json');
const webPackage = readJson('../package.json');
const infoPlist = read('./ios/App/App/Info.plist');
const deepLinkSource = read('../src/utils/deepLink.js');

/** Pull the string values of a plist <array> keyed by `key`. */
function plistArray(key) {
  const match = infoPlist.match(
    new RegExp(`<key>${key}</key>\\s*<array>([\\s\\S]*?)</array>`),
  );
  if (!match) return [];
  return [...match[1].matchAll(/<string>(.*?)<\/string>/g)].map((m) => m[1]);
}

describe('capacitor config', () => {
  it('builds from the web app\'s Vite output', () => {
    // Vite has no `build.outDir` override in vite.config.js, so it emits to
    // dist/ at the repo root — one level up from here.
    expect(capacitorConfig.webDir).toBe('../dist');
  });

  it('keeps the splash under app control so it hides after first paint', () => {
    // useNativeShell calls SplashScreen.hide() once React has painted. With
    // launchAutoHide left on, iOS tears the splash away first and the user
    // sees a blank web view while the bundle boots.
    expect(capacitorConfig.plugins.SplashScreen.launchAutoHide).toBe(false);
  });

  it('goes edge-to-edge, which is what the safe-area padding assumes', () => {
    expect(capacitorConfig.ios.contentInset).toBe('never');
    expect(capacitorConfig.plugins.StatusBar.overlaysWebView).toBe(true);
  });
});

describe('OAuth callback scheme', () => {
  const registered = plistArray('CFBundleURLSchemes');

  it('is registered in Info.plist', () => {
    expect(registered).toHaveLength(1);
  });

  it('matches the appId, so the scheme is unambiguously ours', () => {
    expect(registered[0]).toBe(capacitorConfig.appId);
  });

  it('matches the scheme the web app builds its redirect URL from', () => {
    // A mismatch means Supabase redirects to a scheme iOS will not route,
    // and sign-in dead-ends in the system browser with no way back.
    const declared = deepLinkSource.match(/NATIVE_URL_SCHEME = '([^']+)'/)?.[1];
    expect(declared).toBe(registered[0]);
  });
});

describe('Info.plist submission requirements', () => {
  it('answers the export-compliance question up front', () => {
    // Without this, every single build stops for a manual encryption
    // questionnaire in App Store Connect before it can be distributed.
    expect(infoPlist).toMatch(/<key>ITSAppUsesNonExemptEncryption<\/key>\s*<false\/>/);
  });

  it('locks iPhone to portrait', () => {
    // The web layout is mobile-first; landscape on a phone just stretches it.
    // iPad keeps every orientation.
    expect(plistArray('UISupportedInterfaceOrientations'))
      .toEqual(['UIInterfaceOrientationPortrait']);
    expect(plistArray('UISupportedInterfaceOrientations~ipad').length).toBeGreaterThan(1);
  });
});

describe('Capacitor plugin versions', () => {
  // The JS half of a plugin ships in the web bundle and the native half is
  // compiled into the binary from ios-app/. If the two resolve to different
  // majors the bridge call fails at runtime, on device only.
  const shared = Object.keys(webPackage.dependencies)
    .filter((name) => name.startsWith('@capacitor/'));

  it('has Capacitor packages shared between the two package.json files', () => {
    expect(shared.length).toBeGreaterThan(0);
  });

  it.each(shared)('%s is pinned to the same range in both', (name) => {
    expect(iosPackage.dependencies[name]).toBe(webPackage.dependencies[name]);
  });

  it('installs a native counterpart for every plugin the web bundle imports', () => {
    for (const name of shared) {
      expect(iosPackage.dependencies).toHaveProperty(name);
    }
  });
});
