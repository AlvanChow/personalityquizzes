/*
  # Secure API endpoints and database interactions

  1. upsert_quiz_result
     - Explicitly verify caller's auth.uid() matches p_user_id (defense-in-depth on top of RLS)
     - Whitelist allowed quiz keys ('cake', 'mbti', 'enneagram')
     - Validate required fields in the result payload
     - Cap result payload size to prevent oversized writes

  2. analytics_events
     - Fix the authenticated-user INSERT policy so user_id must be
       the caller's own uid or NULL (prevents spoofing another user's events)
     - Add CHECK constraint: event name must match a safe identifier pattern
     - Add CHECK constraint: properties payload capped at 10 KB

  3. profiles
     - Add CHECK constraint: Big Five scores must all be in [0, 100]
*/

-- ─── 1. upsert_quiz_result ────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION upsert_quiz_result(
  p_user_id uuid,
  p_quiz_key text,
  p_result   jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  -- Require an authenticated session
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- Caller may only write to their own profile (defense-in-depth on top of RLS)
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify another user''s quiz results'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- Only accept known quiz keys
  IF p_quiz_key NOT IN ('cake', 'mbti', 'enneagram') THEN
    RAISE EXCEPTION 'Invalid quiz key: %', p_quiz_key
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Require a JSON object with the mandatory fields
  IF p_result IS NULL
     OR jsonb_typeof(p_result) != 'object'
     OR (p_result ->> 'resultKey') IS NULL
     OR (p_result ->> 'name')      IS NULL
     OR (p_result ->> 'quizName')  IS NULL THEN
    RAISE EXCEPTION 'Invalid result payload: missing required fields (resultKey, name, quizName)'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Cap payload size (2 KB is plenty for the stored metadata)
  IF octet_length(p_result::text) > 2048 THEN
    RAISE EXCEPTION 'Result payload too large'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  UPDATE public.profiles
  SET quiz_results = quiz_results || jsonb_build_object(p_quiz_key, p_result)
  WHERE id = p_user_id;
END;
$$;

-- ─── 2. analytics_events ─────────────────────────────────────────────────────

-- Fix the authenticated INSERT policy: user_id must be the caller's own uid
-- or NULL.  The old policy used WITH CHECK (true) which allowed spoofing any
-- user_id value.
DROP POLICY IF EXISTS "analytics_insert_authenticated" ON public.analytics_events;

CREATE POLICY "analytics_insert_authenticated"
  ON public.analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- Event name: lowercase letters, digits, underscores; 1–100 chars.
-- Prevents free-form strings and keeps the column queryable.
ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_event_format
  CHECK (event ~ '^[a-z][a-z0-9_]{0,99}$');

-- Properties: cap at 10 KB to limit storage abuse.
ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_properties_size
  CHECK (octet_length(properties::text) <= 10240);

-- ─── 3. profiles – Big Five score range ──────────────────────────────────────

-- All five trait scores must be numeric values in [0, 100].
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_big5_scores_range
  CHECK (
    big5_scores IS NULL
    OR (
      jsonb_typeof(big5_scores) = 'object'
      AND (big5_scores ->> 'O') IS NOT NULL
      AND (big5_scores ->> 'C') IS NOT NULL
      AND (big5_scores ->> 'E') IS NOT NULL
      AND (big5_scores ->> 'A') IS NOT NULL
      AND (big5_scores ->> 'N') IS NOT NULL
      AND (big5_scores ->> 'O')::numeric BETWEEN 0 AND 100
      AND (big5_scores ->> 'C')::numeric BETWEEN 0 AND 100
      AND (big5_scores ->> 'E')::numeric BETWEEN 0 AND 100
      AND (big5_scores ->> 'A')::numeric BETWEEN 0 AND 100
      AND (big5_scores ->> 'N')::numeric BETWEEN 0 AND 100
    )
  );
