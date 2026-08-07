import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';
import { allowAuth } from '../utils/rateLimiter';
import { devError } from '../utils/devLog';
import { safeRedirectPath, parseDeepLink, NATIVE_AUTH_REDIRECT } from '../utils/deepLink';
import { isNativeApp, openExternalUrl, closeExternalBrowser, onDeepLink } from '../lib/native';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!supabase);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      })
      .catch((err) => {
        devError('[auth] getSession failed:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      // Guard on SIGNED_IN specifically — INITIAL_SESSION fires on every page
      // load for returning users and must not be counted as a new login.
      if (event === 'SIGNED_IN' && session?.user) {
        track('auth_sign_in_completed', {}, session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Native sign-in finishes out-of-process: the system browser redirects to
  // com.mypersonalityquizzes.app://auth-callback?code=…, iOS reopens the app,
  // and we trade that code for a session here. On the web this subscribes to
  // nothing — Supabase handles the redirect on page load as it always has.
  useEffect(() => {
    if (!supabase || !isNativeApp()) return;

    let unsubscribe = () => {};
    let cancelled = false;

    onDeepLink(async (url) => {
      const link = parseDeepLink(url);
      if (!link || link.kind === 'route') return;

      // Dismiss the SFSafariViewController either way — leaving it open on top
      // of a completed sign-in is the single most confusing failure here.
      await closeExternalBrowser();

      if (link.kind === 'auth-error') {
        devError('[auth] provider returned an error:', link.message);
        return;
      }

      const { error } = await supabase.auth.exchangeCodeForSession(link.code);
      if (error) {
        devError('[auth] code exchange failed:', error);
        return;
      }
      // onAuthStateChange sets the user; only the return path is ours to
      // restore. history is used rather than the router because this listener
      // lives above BrowserRouter.
      if (link.next) window.history.replaceState({}, '', link.next);
    }).then((cleanup) => {
      if (cancelled) cleanup();
      else unsubscribe = cleanup;
    });

    return () => { cancelled = true; unsubscribe(); };
  }, []);

  // redirectPath (e.g. '/s/abc123') brings the user back to where they were —
  // essential for the "sign in to save this match" flow on share pages.
  const signIn = useCallback(async (provider, redirectPath = '') => {
    if (!supabase) throw new Error('Authentication is not available right now.');
    if (!allowAuth()) throw new Error('Too many sign-in attempts. Please wait a moment.');
    track('auth_sign_in_started', { provider }, null);
    const safePath = safeRedirectPath(redirectPath);

    if (isNativeApp()) {
      // `next` rides along on the redirect URL because the app is relaunched
      // by iOS on the way back, so nothing in memory survives the round trip.
      const redirectTo = safePath
        ? `${NATIVE_AUTH_REDIRECT}?next=${encodeURIComponent(safePath)}`
        : NATIVE_AUTH_REDIRECT;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo, skipBrowserRedirect: true },
      });
      if (error) throw error;
      if (!data?.url) throw new Error('Could not start sign-in. Please try again.');

      // Must be a system browser, not this web view: Google rejects OAuth from
      // embedded web views ("disallowed_useragent"), which is what a plain
      // window.location assignment would be inside the app.
      const opened = await openExternalUrl(data.url);
      if (!opened) throw new Error('Could not open the sign-in page. Please try again.');
      return;
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + safePath },
    });
    if (error) throw error;
  }, []);

  const signInWithGoogle = useCallback((redirectPath = '') => signIn('google', redirectPath), [signIn]);

  // Offered alongside Google to satisfy App Store Review Guideline 4.8, which
  // requires an equivalent privacy-preserving login wherever a third-party one
  // is offered. Works on the website too, so both surfaces stay identical.
  const signInWithApple = useCallback((redirectPath = '') => signIn('apple', redirectPath), [signIn]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    // Sign-out is not rate-limited: it shares the 'auth' bucket with sign-in, and
    // dropping it would silently strand a user who clicked "Sign out" (and it is
    // not an abuse vector — it clears the local session and makes one API call).
    track('auth_sign_out', {}, user?.id ?? null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // onAuthStateChange already sets user to null; no need to do it here too.
  }, [user?.id]);

  // Permanently removes the account and everything attached to it (App Store
  // Review Guideline 5.1.1(v) requires this to be reachable in-app). The RPC is
  // SECURITY DEFINER and scoped to auth.uid(); see the accompanying migration.
  const deleteAccount = useCallback(async () => {
    if (!supabase) throw new Error('Account deletion is not available right now.');
    track('account_delete_requested', {}, user?.id ?? null);
    const { error } = await supabase.rpc('delete_my_account');
    if (error) throw error;
    // The auth row is gone, so the access token is dead; clear it locally too.
    // `scope: 'local'` skips the server round trip that would now 401.
    await supabase.auth.signOut({ scope: 'local' }).catch(() => {});
    setUser(null);
  }, [user?.id]);

  const value = useMemo(
    () => ({ user, loading, signInWithGoogle, signInWithApple, signOut, deleteAccount }),
    [user, loading, signInWithGoogle, signInWithApple, signOut, deleteAccount],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
