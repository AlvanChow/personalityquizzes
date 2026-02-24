/*
  # Add atomic quiz result upsert function

  Replaces the client-side read-then-write pattern (which is susceptible to
  race conditions) with a single atomic JSONB merge update performed entirely
  inside PostgreSQL.

  The function uses the || operator to merge a new key into quiz_results so
  that concurrent calls for different quiz types cannot overwrite each other.

  RLS still applies because the function runs as SECURITY INVOKER (the default),
  meaning the caller's row-level policies are enforced — a user can only update
  their own profiles row.
*/

CREATE OR REPLACE FUNCTION upsert_quiz_result(
  p_user_id uuid,
  p_quiz_key text,
  p_result jsonb
)
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE public.profiles
  SET quiz_results = quiz_results || jsonb_build_object(p_quiz_key, p_result)
  WHERE id = p_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION upsert_quiz_result(uuid, text, jsonb) TO authenticated;
