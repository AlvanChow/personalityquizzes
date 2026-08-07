import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { devError } from '../utils/devLog';

export function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

export function AppleIcon({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.365 1.43c0 1.14-.42 2.2-1.26 3.02-.99.98-2.13 1.55-3.29 1.46-.03-1.1.43-2.23 1.24-3.03.9-.9 2.24-1.5 3.31-1.45zM20.7 17.06c-.55 1.27-.81 1.84-1.52 2.96-.99 1.56-2.39 3.5-4.12 3.51-1.54.02-1.94-1-4.03-.99-2.09.01-2.52 1.01-4.06.99-1.73-.02-3.05-1.77-4.04-3.33-2.77-4.35-3.06-9.45-1.35-12.16 1.21-1.92 3.13-3.05 4.93-3.05 1.83 0 2.98 1.01 4.5 1.01 1.47 0 2.36-1.01 4.48-1.01 1.6 0 3.3.88 4.51 2.39-3.96 2.18-3.32 7.85.7 9.68z"/>
    </svg>
  );
}

/**
 * The sign-in surface for the whole app.
 *
 * Both providers are always shown together: App Store Review Guideline 4.8
 * requires an equivalent privacy-preserving option wherever a third-party login
 * is offered, and "equivalent" covers prominence, so neither is hidden behind
 * the other. Presenting the same pair on the website keeps the two builds
 * identical, which is what makes `ios-app/` a pure shell.
 *
 * The `inline` layout keeps both buttons icon-only until `xl`. The site header
 * is the only caller, and with the nav labels also showing it needs ~1110px
 * before two labelled auth buttons fit — so at iPad widths the labels would
 * push "Sign in with Apple" off the right edge, which is the 4.8 problem this
 * component exists to avoid. Icon-only keeps the pair equally prominent; the
 * sr-only spans keep them named.
 *
 * @param redirectPath same-site path to land on afterwards (see safeRedirectPath)
 * @param layout       'stacked' full-width column, or 'inline' for tight chrome
 * @param onStart      notified before a provider is invoked (for analytics)
 */
export default function SignInButtons({
  redirectPath = '',
  layout = 'stacked',
  onStart,
  className = '',
}) {
  const { signInWithGoogle, signInWithApple } = useAuth();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const errorTimerRef = useRef(null);

  useEffect(() => () => clearTimeout(errorTimerRef.current), []);

  async function start(provider, signIn) {
    if (busy) return;
    setError(null);
    setBusy(provider);
    onStart?.(provider);
    try {
      await signIn(redirectPath);
      // On the web this never resolves — the page navigates to the provider.
      // On native it resolves as soon as the system browser is on screen, and
      // the deep-link handler in AuthContext takes it from there.
    } catch (err) {
      devError(`Sign in with ${provider} failed:`, err);
      setError(err?.message?.includes('Too many')
        ? 'Too many sign-in attempts. Please wait a moment.'
        : 'Sign-in failed. Please try again.');
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = setTimeout(() => setError(null), 8000);
    } finally {
      setBusy(null);
    }
  }

  const inline = layout === 'inline';
  const base = inline
    ? 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 disabled:opacity-60'
    : 'w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-60';

  return (
    <div className={className}>
      <div className={inline ? 'flex items-center gap-1.5' : 'flex flex-col gap-2'}>
        <button
          type="button"
          onClick={() => start('google', signInWithGoogle)}
          disabled={busy !== null}
          className={`${base} bg-white border border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-md text-gray-700`}
        >
          <GoogleIcon />
          <span className={inline ? 'hidden xl:inline' : ''}>
            {busy === 'google' ? 'Opening…' : 'Sign in with Google'}
          </span>
          {inline && <span className="xl:hidden sr-only">Sign in with Google</span>}
        </button>

        <button
          type="button"
          onClick={() => start('apple', signInWithApple)}
          disabled={busy !== null}
          className={`${base} bg-black border border-black hover:bg-gray-800 text-white`}
        >
          <AppleIcon />
          <span className={inline ? 'hidden xl:inline' : ''}>
            {busy === 'apple' ? 'Opening…' : 'Sign in with Apple'}
          </span>
          {inline && <span className="xl:hidden sr-only">Sign in with Apple</span>}
        </button>
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium mt-2" role="alert">{error}</p>
      )}
    </div>
  );
}
