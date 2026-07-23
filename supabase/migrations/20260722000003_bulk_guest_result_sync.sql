/*
  # Atomic guest-result sync after sign-in

  A guest can complete more quizzes than the single-result RPC's per-minute
  limit permits. Merge the whole validated result set in one transaction so
  signing in reliably preserves every local result without lost-update races.
*/

CREATE OR REPLACE FUNCTION public.upsert_quiz_results_bulk(
  p_user_id uuid,
  p_results jsonb
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  result_count integer;
  updated_count integer;
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Unauthorized: cannot modify another user''s quiz results'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF p_results IS NULL OR jsonb_typeof(p_results) <> 'object' THEN
    RAISE EXCEPTION 'Results must be a JSON object'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  SELECT count(*) INTO result_count FROM jsonb_object_keys(p_results);
  IF result_count < 1 OR result_count > 100 OR octet_length(p_results::text) > 8192 THEN
    RAISE EXCEPTION 'Invalid result collection size'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM jsonb_each(p_results) AS entry
    WHERE entry.key !~ '^[a-z][a-z0-9_]{1,31}$'
      OR jsonb_typeof(entry.value) <> 'object'
      OR entry.value ->> 'resultKey' IS NULL
      OR entry.value ->> 'name' IS NULL
      OR entry.value ->> 'quizName' IS NULL
      OR octet_length(entry.value::text) > 2048
  ) THEN
    RAISE EXCEPTION 'One or more quiz results are invalid'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF NOT public.check_rate_limit('quiz_bulk_sync', p_user_id::text, 5, 60) THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many result syncs. Please try again later.'
      USING ERRCODE = 'P0001';
  END IF;

  UPDATE public.profiles
  SET quiz_results = COALESCE(quiz_results, '{}'::jsonb) || p_results
  WHERE id = p_user_id;
  GET DIAGNOSTICS updated_count = ROW_COUNT;

  IF updated_count <> 1 THEN
    RAISE EXCEPTION 'Profile not found' USING ERRCODE = 'no_data_found';
  END IF;

  RETURN result_count;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.upsert_quiz_results_bulk(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.upsert_quiz_results_bulk(uuid, jsonb) TO authenticated;

-- check_rate_limit is intentionally not executable by authenticated clients.
-- The legacy single-result RPC therefore also needs a definer boundary; its
-- existing auth.uid() = p_user_id check still prevents cross-account writes.
ALTER FUNCTION public.upsert_quiz_result(uuid, text, jsonb) SECURITY DEFINER;
ALTER FUNCTION public.upsert_quiz_result(uuid, text, jsonb) SET search_path = '';
