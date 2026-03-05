/*
  # Add admin dashboard support

  1. New Tables
    - `admins` — stores user IDs of admin users
      - `user_id` (uuid, primary key, references auth.users)
      - `created_at` (timestamptz)

  2. New Policies
    - `admins` table: authenticated users can read their own row (to check admin status)
    - `analytics_events`: admins can SELECT all rows
    - `profiles`: admins can SELECT all rows (existing per-user policy stays intact)

  To grant admin access to a user, INSERT their user_id into the `admins` table:
    INSERT INTO public.admins (user_id) VALUES ('<user-uuid>');
*/

-- ─── admins table ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admins (
  user_id    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Authenticated users can check their own admin status.
CREATE POLICY "Users can read own admin row"
  ON public.admins
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ─── analytics_events admin read ─────────────────────────────────────────────

CREATE POLICY "Admins can read all analytics events"
  ON public.analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );

-- ─── profiles admin read ──────────────────────────────────────────────────────

-- The existing "Users can read own profile" policy stays in place.
-- This additional policy lets admins read every profile row.
CREATE POLICY "Admins can read all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.admins WHERE user_id = auth.uid()
    )
  );
