/*
  # House quiz + Hot Takes debate votes

  1. debate_votes
     Anonymous one-vote-per-session polls for the "Hot Takes" page (the dress,
     tennis balls, hotdog-is-a-sandwich, ...). No direct table access — all
     reads/writes go through the vote_hot_take() RPC, which validates input,
     rate-limits per client IP, upserts the caller's vote, and returns the
     aggregate counts (the only data anyone can read back).

  2. upsert_quiz_result: accept the new 'house' quiz key.
*/

CREATE TABLE public.debate_votes (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  debate      text        NOT NULL CHECK (debate ~ '^[a-z0-9_]{1,40}$'),
  choice      text        NOT NULL CHECK (choice IN ('a', 'b')),
  session_id  uuid        NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (session_id, debate)
);

CREATE INDEX idx_debate_votes_debate ON public.debate_votes (debate, choice);

-- RLS on with no policies: nobody reads or writes the table directly.
ALTER TABLE public.debate_votes ENABLE ROW LEVEL SECURITY;

-- Vote (or just fetch counts when p_choice is NULL) for one debate.
-- Returns the aggregate per choice — never individual rows.
CREATE OR REPLACE FUNCTION public.vote_hot_take(p_debate text, p_choice text, p_session uuid)
RETURNS TABLE(choice text, votes bigint)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  client_ip text;
BEGIN
  IF p_debate IS NULL OR p_debate !~ '^[a-z0-9_]{1,40}$' THEN
    RETURN;
  END IF;

  IF p_choice IN ('a', 'b') AND p_session IS NOT NULL THEN
    -- Rate limit actual votes per client IP (30/min); silently skip the
    -- write when limited — the caller still gets the current counts.
    client_ip := public.request_client_ip();
    IF client_ip IS NULL OR public.check_rate_limit('debate_vote', client_ip, 30, 60) THEN
      INSERT INTO public.debate_votes (debate, choice, session_id)
      VALUES (p_debate, p_choice, p_session)
      ON CONFLICT (session_id, debate) DO UPDATE SET choice = excluded.choice;
    END IF;
  END IF;

  RETURN QUERY
  SELECT v.choice, count(*)::bigint
  FROM public.debate_votes v
  WHERE v.debate = p_debate
  GROUP BY v.choice;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.vote_hot_take(text, text, uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.vote_hot_take(text, text, uuid) TO anon, authenticated;

-- ─── upsert_quiz_result: accept 'house' ─────────────────────────────────────

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

  IF p_quiz_key NOT IN ('cake', 'mbti', 'enneagram', 'mbti_deep', 'enneagram_deep', 'house') THEN
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

REVOKE EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) TO authenticated;
