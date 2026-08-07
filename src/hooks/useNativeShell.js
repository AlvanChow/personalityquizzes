import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { isNativeApp, hideSplashScreen, syncStatusBar, onDeepLink } from '../lib/native';
import { parseDeepLink } from '../utils/deepLink';

/**
 * Native-shell wiring for the iOS app (`ios-app/`). Renders nothing and does
 * nothing at all on the website — every branch is behind `isNativeApp()`.
 *
 * Must be called inside the router: share links that arrive as Universal Links
 * are handed to `navigate()` so they open as an in-app route rather than
 * reloading the whole web view.
 */
export function useNativeShell() {
  const navigate = useNavigate();

  // Opt the native web view into edge-to-edge layout, and mark the document so
  // stylesheets can target app-only behaviour. Done here rather than in
  // index.html so the website keeps its existing viewport verbatim: without
  // `viewport-fit=cover` every env(safe-area-inset-*) stays 0, which is what
  // makes the safe-area padding elsewhere a no-op for browser visitors.
  useEffect(() => {
    if (!isNativeApp()) return;
    document.documentElement.classList.add('native-app');
    const meta = document.querySelector('meta[name="viewport"]');
    const original = meta?.getAttribute('content');
    if (meta && original && !original.includes('viewport-fit')) {
      meta.setAttribute('content', `${original}, viewport-fit=cover`);
    }
    return () => {
      document.documentElement.classList.remove('native-app');
      if (meta && original) meta.setAttribute('content', original);
    };
  }, []);

  // Dismiss the launch screen only once React has painted. `launchAutoHide` is
  // false in capacitor.config.json precisely so this is the moment it happens —
  // otherwise the splash tears away to a blank view while the bundle boots.
  useEffect(() => {
    if (!isNativeApp()) return;
    const raf = requestAnimationFrame(() => { hideSplashScreen(); });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Keep the status bar glyphs legible against whichever theme is active.
  useEffect(() => {
    if (!isNativeApp()) return;
    const root = document.documentElement;
    const apply = () => syncStatusBar(root.classList.contains('dark'));
    apply();
    const observer = new MutationObserver(apply);
    observer.observe(root, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Universal Links (e.g. a shared /s/:id result) open in-app. Auth callbacks
  // are deliberately left to AuthContext, which owns the code exchange.
  useEffect(() => {
    if (!isNativeApp()) return;

    let unsubscribe = () => {};
    let cancelled = false;

    onDeepLink((url) => {
      const link = parseDeepLink(url);
      if (link?.kind === 'route') navigate(link.path);
    }).then((cleanup) => {
      if (cancelled) cleanup();
      else unsubscribe = cleanup;
    });

    return () => { cancelled = true; unsubscribe(); };
  }, [navigate]);
}
