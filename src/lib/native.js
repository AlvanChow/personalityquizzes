/**
 * Capacitor bridge for the iOS shell (see `ios-app/`).
 *
 * The same bundle serves the website and the native app, so every helper here
 * degrades to a no-op (or the plain-web behaviour) when `isNativeApp()` is
 * false.
 *
 * Nothing is imported statically — not even `@capacitor/core`. Detection reads
 * the `Capacitor` global that the native runtime injects into the web view
 * before any app script runs; in a browser that global is simply absent. Every
 * plugin then loads through a gated dynamic `import()`, so Vite emits the
 * Capacitor packages as separate chunks that website visitors never request
 * and that cost the main bundle nothing.
 */

function bridge() {
  return typeof globalThis === 'undefined' ? undefined : globalThis.Capacitor;
}

/** True only inside the packaged iOS/Android app, never in a mobile browser. */
export function isNativeApp() {
  const cap = bridge();
  return typeof cap?.isNativePlatform === 'function' && cap.isNativePlatform() === true;
}

/** 'ios' | 'android' | 'web' */
export function nativePlatform() {
  const cap = bridge();
  if (!isNativeApp() || typeof cap.getPlatform !== 'function') return 'web';
  return cap.getPlatform();
}

export function isIOSApp() {
  return isNativeApp() && nativePlatform() === 'ios';
}

// A plugin import that fails (missing native counterpart, offline chunk) must
// never take down a quiz, so every caller funnels through this.
async function loadPlugin(loader) {
  if (!isNativeApp()) return null;
  try {
    return await loader();
  } catch {
    return null;
  }
}

/**
 * Dismiss the native launch screen. Called once the React tree has painted so
 * the user never sees a white flash between the splash and the first route.
 */
export async function hideSplashScreen() {
  const mod = await loadPlugin(() => import('@capacitor/splash-screen'));
  try {
    await mod?.SplashScreen.hide({ fadeOutDuration: 200 });
  } catch { /* splash already gone */ }
}

/**
 * Match the native status bar to the web theme. `dark` mirrors the `dark`
 * class on <html> that index.html sets before first paint.
 *
 * Capacitor's `Style.Dark` means "dark *content*" (black glyphs), which is what
 * a light background wants — hence the inversion.
 */
export async function syncStatusBar(dark) {
  const mod = await loadPlugin(() => import('@capacitor/status-bar'));
  if (!mod) return;
  try {
    await mod.StatusBar.setStyle({ style: dark ? mod.Style.Dark : mod.Style.Light });
  } catch { /* status bar unavailable */ }
}

/**
 * Open a URL outside the app's own web view.
 *
 * On native this is an SFSafariViewController: it keeps the user in-app, and —
 * unlike a WKWebView — Google permits OAuth inside it, which is what makes the
 * sign-in flow in AuthContext work at all. Returns true if it was handled
 * natively so callers can skip their `window.open` fallback.
 */
export async function openExternalUrl(url) {
  const mod = await loadPlugin(() => import('@capacitor/browser'));
  if (!mod) return false;
  try {
    await mod.Browser.open({ url, presentationStyle: 'popover' });
    return true;
  } catch {
    return false;
  }
}

/** Close the SFSafariViewController opened by openExternalUrl(). */
export async function closeExternalBrowser() {
  const mod = await loadPlugin(() => import('@capacitor/browser'));
  try {
    await mod?.Browser.close();
  } catch { /* already closed by the user */ }
}

/**
 * Subscribe to deep links (custom scheme + universal links). Returns a cleanup
 * function; safe to call on web, where it subscribes to nothing.
 *
 * Covers both ways a link arrives, which are genuinely different events:
 *
 *   - `appUrlOpen` fires when the app is already running. This is the OAuth
 *     callback's path, since SFSafariViewController keeps the app alive.
 *   - `getLaunchUrl()` is the *cold start* — someone tapped a shared /s/:id
 *     link with the app not running, which is the common case for a share.
 *     There is no listener registered yet when that happens, so the URL has to
 *     be pulled rather than pushed.
 *
 * A launch URL is sometimes *also* delivered as `appUrlOpen`, depending on iOS
 * version and whether the app was suspended or terminated, so consecutive
 * duplicates are dropped — handling an auth code twice would make the second
 * exchange fail and log a spurious error.
 */
export async function onDeepLink(handler) {
  const mod = await loadPlugin(() => import('@capacitor/app'));
  if (!mod) return () => {};

  let lastUrl = null;
  let cancelled = false;
  const deliver = (url) => {
    if (cancelled || !url || url === lastUrl) return;
    lastUrl = url;
    handler(url);
  };

  let sub;
  try {
    sub = await mod.App.addListener('appUrlOpen', (event) => deliver(event?.url));
  } catch {
    return () => {};
  }

  try {
    const launch = await mod.App.getLaunchUrl();
    deliver(launch?.url);
  } catch { /* no launch URL — the app was opened from the home screen */ }

  return () => {
    cancelled = true;
    sub.remove();
  };
}

/**
 * Share through the iOS share sheet. Returns false when unavailable so callers
 * fall back to `navigator.share` / clipboard, exactly as on the website.
 */
export async function nativeShare({ title, text, url, files }) {
  const mod = await loadPlugin(() => import('@capacitor/share'));
  if (!mod) return false;
  try {
    const { value } = await mod.Share.canShare();
    if (!value) return false;
    await mod.Share.share({ title, text, url, files });
    return true;
  } catch (err) {
    // A user-cancelled sheet is a success from the caller's point of view: the
    // share was offered. Only a genuine failure should trigger the fallback.
    if (String(err?.message ?? '').toLowerCase().includes('cancel')) return true;
    return false;
  }
}

/** Light haptic tick for quiz answer taps. No-op on web. */
export async function tapFeedback() {
  const mod = await loadPlugin(() => import('@capacitor/haptics'));
  try {
    await mod?.Haptics.impact({ style: mod.ImpactStyle.Light });
  } catch { /* haptics unavailable (simulator, low power mode) */ }
}
