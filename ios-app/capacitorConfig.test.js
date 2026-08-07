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
const iosLock = readJson('./package-lock.json');
const webPackage = readJson('../package.json');
const infoPlist = read('./ios/App/App/Info.plist');
const entitlements = read('./ios/App/App/App.entitlements');
const privacyManifest = read('./ios/App/App/PrivacyInfo.xcprivacy');
const pbxproj = read('./ios/App/App.xcodeproj/project.pbxproj');
const deepLinkSource = read('../src/utils/deepLink.js');

/** Pull the string values of a plist <array> keyed by `key`, from any plist. */
function plistArrayIn(source, key) {
  const match = source.match(
    new RegExp(`<key>${key}</key>\\s*<array>([\\s\\S]*?)</array>`),
  );
  if (!match) return [];
  return [...match[1].matchAll(/<string>(.*?)<\/string>/g)].map((m) => m[1]);
}

const plistArray = (key) => plistArrayIn(infoPlist, key);

/** Every value assigned to an Xcode build setting, one entry per config. */
function buildSetting(name) {
  return [...pbxproj.matchAll(new RegExp(`\\n\\s*${name} = ([^;]+);`, 'g'))]
    .map((m) => m[1].trim());
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
    expect(plistArray('UISupportedInterfaceOrientations'))
      .toEqual(['UIInterfaceOrientationPortrait']);
  });

  it('ships as iPhone-only', () => {
    // TARGETED_DEVICE_FAMILY "1,2" is the Capacitor template default and was
    // never a decision here. Supporting iPad means App Store Connect demands
    // 13" iPad screenshots and review happens on an iPad, where a mobile-first
    // max-w-lg layout is exactly the evidence a Guideline 4.2 rejection wants.
    // Turning iPad back on is a product call, not a default to drift into.
    const families = buildSetting('TARGETED_DEVICE_FAMILY');
    expect(families.length).toBe(2);          // Debug + Release
    expect(new Set(families)).toEqual(new Set(['1']));

    // Kept even though iPad is off: if iPad is ever re-enabled, shipping
    // without all four orientations fails validation with ITMS-90474.
    expect(plistArray('UISupportedInterfaceOrientations~ipad').length).toBe(4);
  });

  it('carries an app-target privacy manifest', () => {
    // Capacitor's own manifest covers the framework, not the binary. Apple
    // aggregates both into the privacy report and emails ITMS-91053 when the
    // app target has none.
    expect(pbxproj).toMatch(/PrivacyInfo\.xcprivacy in Resources/);
    expect(privacyManifest).toMatch(/<key>NSPrivacyTracking<\/key>\s*<false\/>/);
    // Declaring nothing collected would be inaccurate — sign-in takes an email
    // and a name, and analytics are linked to the account.
    expect(plistArrayIn(privacyManifest, 'NSPrivacyCollectedDataTypePurposes').length)
      .toBeGreaterThan(0);
  });
});

describe('Universal Links', () => {
  const claimed = plistArrayIn(entitlements, 'com.apple.developer.associated-domains');

  it('declares the associated domains in a committed entitlements file', () => {
    // Added by hand in Xcode, this survives only in one developer's checkout
    // and silently disappears on a fresh clone. In the project it is reviewable.
    expect(claimed.length).toBeGreaterThan(0);
    expect(buildSetting('CODE_SIGN_ENTITLEMENTS'))
      .toEqual(['App/App.entitlements', 'App/App.entitlements']);
  });

  it('claims exactly the hosts the web app deep-links back into', () => {
    // SITE_HOSTS is what parseDeepLink() will accept as a route. A host claimed
    // here but missing there opens the app and then dead-ends on it.
    const hosts = deepLinkSource.match(/SITE_HOSTS = \[([^\]]+)\]/)?.[1] ?? '';
    const declared = [...hosts.matchAll(/'([^']+)'/g)].map((m) => m[1]);
    expect(claimed).toEqual(declared.map((h) => `applinks:${h}`));
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

  it('has a lockfile that still matches package.json', () => {
    // A lockfile generated from an older package.json installs fine with
    // `npm install` (which quietly reconciles it) and fails outright under
    // `npm ci`, so the drift is invisible until CI or a clean checkout.
    const root = iosLock.packages[''];
    expect(iosLock.name).toBe(iosPackage.name);
    expect(root.dependencies).toEqual(iosPackage.dependencies);
    expect(root.devDependencies).toEqual(iosPackage.devDependencies);
  });
});
