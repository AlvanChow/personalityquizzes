/*
  # Expand quiz catalog: pattern-based quiz keys (hardening-preserving rework)

  The app now ships a data-driven quiz catalog (20+ quizzes, with more to
  come), so the enumerated quiz-key whitelists become a deployment bottleneck:
  every new quiz would need a migration. This replaces the enumerated lists
  with strict format checks.

  Reworked from the original expansion branch so that NONE of the
  20260720000001 hardening regresses: the shared_results INSERT policy keeps
  the id format check, the result_emoji length cap, and the view_count = 0
  guard; upsert_quiz_result keeps the valid P0001 errcode on rate limiting.

  Also widens quiz_feedback's quiz_key CHECK to the same pattern so catalog
  quizzes can collect accuracy ratings.
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
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF auth.uid() != p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify another user''s quiz results'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- Quiz keys are lowercase snake_case identifiers, 2–32 chars. The caller is
  -- authenticated, writes only to their own row, and is size- and rate-capped,
  -- so a pattern check is sufficient: at worst a caller stores junk keys in
  -- their own profile.
  IF p_quiz_key IS NULL OR p_quiz_key !~ '^[a-z][a-z0-9_]{1,31}$' THEN
    RAISE EXCEPTION 'Invalid quiz key: %', p_quiz_key
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_result IS NULL
     OR jsonb_typeof(p_result) != 'object'
     OR (p_result ->> 'resultKey') IS NULL
     OR (p_result ->> 'name')      IS NULL
     OR (p_result ->> 'quizName')  IS NULL THEN
    RAISE EXCEPTION 'Invalid result payload: missing required fields (resultKey, name, quizName)'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF octet_length(p_result::text) > 2048 THEN
    RAISE EXCEPTION 'Result payload too large'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  SELECT public.check_rate_limit('quiz_save', p_user_id::text, 10, 60)
  INTO allowed;

  IF NOT allowed THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many quiz saves. Please try again later.'
      USING ERRCODE = 'P0001';
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

-- Recreate the INSERT policy with the pattern check, preserving every other
-- guard from the launch hardening (id format, emoji cap, view_count seed).
DROP POLICY IF EXISTS "anyone can create shared results" ON public.shared_results;

CREATE POLICY "anyone can create shared results"
  ON public.shared_results
  FOR INSERT
  WITH CHECK (
    id ~ '^[a-f0-9]{8}$'
    AND quiz_type ~ '^[a-z][a-z0-9_-]{1,31}$'
    AND length(result_key) <= 20
    AND length(result_name) <= 100
    AND length(result_emoji) <= 16
    AND octet_length(result_data::text) <= 4096
    AND view_count = 0
  );


-- ─── 3. quiz_feedback: format-validated quiz keys ────────────────────────────

ALTER TABLE public.quiz_feedback
  DROP CONSTRAINT IF EXISTS quiz_feedback_quiz_key_check;

ALTER TABLE public.quiz_feedback
  ADD CONSTRAINT quiz_feedback_quiz_key_check
  CHECK (quiz_key ~ '^[a-z][a-z0-9_]{1,31}$');
