/*
  # Expand quiz catalog: pattern-based quiz keys

  The app now ships a data-driven quiz catalog (20+ quizzes, with more to come),
  so the hard-coded quiz-key whitelists in upsert_quiz_result and shared_results
  become a deployment bottleneck: every new quiz would need a migration.

  This migration replaces the enumerated whitelists with strict format checks:

  1. upsert_quiz_result — accepts any key matching ^[a-z][a-z0-9_]{1,31}$.
     Risk assessment: the function already requires an authenticated caller,
     restricts writes to the caller's own profile row, validates the payload
     shape, caps payload size at 2 KB, and rate-limits to 10 saves/minute.
     A pattern check preserves all of that while removing the migration
     treadmill; an attacker can at worst store junk keys in their own profile.

  2. shared_results — quiz_type CHECK constraint and the INSERT policy get the
     same pattern check (plus '-' since legacy types could contain it). The
     existing size caps and the global 30-inserts/minute trigger stay in force.
*/

-- ─── 1. upsert_quiz_result: format-validated quiz keys ───────────────────────

CREATE OR REPLACE FUNCTION public.upsert_quiz_result(
  p_user_id  uuid,
  p_quiz_key text,
  p_result   jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  allowed boolean;
BEGIN
  -- Require an authenticated session
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- Caller may only write to their own profile
  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify another user''s quiz results'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- Quiz keys are lowercase snake_case identifiers, 2–32 chars
  IF p_quiz_key IS NULL OR p_quiz_key !~ '^[a-z][a-z0-9_]{1,31}$' THEN
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

  -- Per-user rate limit: max 10 quiz saves per 60 seconds
  SELECT public.check_rate_limit('quiz_save', p_user_id::text, 10, 60)
  INTO allowed;

  IF NOT allowed THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many quiz saves. Please try again later.'
      USING ERRCODE = 'rate_limit_exceeded';
  END IF;

  UPDATE public.profiles
  SET quiz_results = quiz_results || jsonb_build_object(p_quiz_key, p_result)
  WHERE id = p_user_id;
END;
$$;

-- CREATE OR REPLACE does not preserve grants — re-apply the security posture.
REVOKE EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) TO authenticated;


-- ─── 2. shared_results: format-validated quiz_type ───────────────────────────

ALTER TABLE public.shared_results
  DROP CONSTRAINT IF EXISTS shared_results_quiz_type_check;

ALTER TABLE public.shared_results
  ADD CONSTRAINT shared_results_quiz_type_check
  CHECK (quiz_type ~ '^[a-z][a-z0-9_-]{1,31}$');

DROP POLICY IF EXISTS "anyone can create shared results" ON public.shared_results;

CREATE POLICY "anyone can create shared results"
  ON public.shared_results
  FOR INSERT
  WITH CHECK (
    length(id) = 8
    AND quiz_type ~ '^[a-z][a-z0-9_-]{1,31}$'
    AND length(result_key) <= 20
    AND length(result_name) <= 100
    AND octet_length(result_data::text) <= 4096
  );
