import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';
import { track } from '../utils/analytics';

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
        if (import.meta.env.DEV) console.error('[auth] getSession failed:', err);
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

  const signInWithGoogle = useCallback(async () => {
    if (!supabase) throw new Error('Authentication is not available right now.');
    track('auth_sign_in_started', {}, null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    track('auth_sign_out', {}, user?.id ?? null);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // onAuthStateChange already sets user to null; no need to do it here too.
  }, [user?.id]);

  const value = useMemo(() => ({ user, loading, signInWithGoogle, signOut }), [user, loading, signInWithGoogle, signOut]);

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
