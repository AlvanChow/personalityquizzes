/*
  # Fix anon analytics_events INSERT policy

  The original anon INSERT policy used WITH CHECK (true), which allowed any
  guest to claim an arbitrary user_id value. Anonymous sessions are by
  definition unauthenticated, so their rows must have user_id IS NULL.

  Authenticated users already have a separate policy that enforces
  user_id IS NULL OR user_id = auth.uid() (added in migration 20260226000001).
*/

DROP POLICY IF EXISTS "analytics_insert_anon" ON public.analytics_events;

CREATE POLICY "analytics_insert_anon"
  ON public.analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);
