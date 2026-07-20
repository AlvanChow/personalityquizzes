import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/**
 * Returns whether the current user is in the `admins` table.
 * Resolves quickly because the query is a primary-key lookup.
 */
export function useAdmin() {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  // checkedFor records which user id the stored answer belongs to, so a user
  // switch never briefly reuses the previous user's admin flag.
  const [state, setState] = useState({ isAdmin: false, checkedFor: null });

  useEffect(() => {
    if (!userId || !supabase) return;

    let cancelled = false;
    supabase
      .from('admins')
      .select('user_id')
      .eq('user_id', userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setState({ isAdmin: !!data, checkedFor: userId });
      })
      .catch(() => {
        if (!cancelled) setState({ isAdmin: false, checkedFor: userId });
      });
    return () => { cancelled = true; };
  }, [userId]);

  if (!userId || !supabase) return { isAdmin: false, loading: false };
  return {
    isAdmin: state.checkedFor === userId && state.isAdmin,
    loading: state.checkedFor !== userId,
  };
}
