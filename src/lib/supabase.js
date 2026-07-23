import { createClient } from '@supabase/supabase-js';
import { DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY } from '../config/supabase';

// Public project configuration.
//
// The anon key is a *public* client credential: it is embedded in the browser
// bundle of every Supabase app and is safe to commit. All access control is
// enforced server-side by Row Level Security (see supabase/migrations), never
// by keeping this key secret. Committing it as a fallback guarantees the
// deployed site can always reach the database even when the CI build runs
// without the VITE_SUPABASE_* environment variables configured.
//
// To point a fork at a different project, set VITE_SUPABASE_URL and
// VITE_SUPABASE_ANON_KEY (they take precedence over these defaults).
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
