/*
  # Add database-level rate limiting and security hardening

  ## Changes

  1. Rate-limit analytics_events INSERT
     - Uses a per-session sliding window (max 60 events per 60 seconds).
     - Prevents automated flooding of the analytics table.

  2. Rate-limit shared_results INSERT
     - Global limiter: max 30 new rows per minute across all users.
     - Prevents spam creation of share links.

  3. Rate-limit increment_shared_result_views RPC
     - Per-share-ID limit: max 10 increments per minute per share ID.
     - Prevents artificial inflation of view counts.

  4. Expand upsert_quiz_result quiz key whitelist
     - Adds 'mbti_deep' and 'enneagram_deep' to the allowed quiz keys so
       deep-dive quiz results can be saved.
     - Adds per-user rate limiting (max 10 calls per 60 seconds).

  5. Pin search_path on handle_updated_at (SECURITY DEFINER safeguard)

  All rate-limiting uses lightweight COUNT queries against timestamped rows
  or a dedicated rate_limit_log table. The client-side rate limiter is the
  first line of defense; these DB checks are the authoritative backstop.
*/

-- ─── Rate-limit log table ────────────────────────────────────────────────────
-- A lightweight append-only table used by rate-limiting checks in DB functions.
-- Rows auto-expire via a periodic cleanup or TTL index.

CREATE TABLE IF NOT EXISTS public.rate_limit_log (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  action      text        NOT NULL,       -- e.g. 'share_create', 'view_increment', 'quiz_save'
  actor_key   text        NOT NULL,       -- session_id, user_id, or share_id depending on action
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_rate_limit_log_lookup
  ON public.rate_limit_log (action, actor_key, created_at DESC);

-- Auto-purge entries older than 5 minutes to keep the table small.
-- This runs as a periodic cleanup; alternatively a pg_cron job can be used.
-- For now, the function-level checks prune on read.

ALTER TABLE public.rate_limit_log ENABLE ROW LEVEL SECURITY;

-- No direct access via anon/authenticated keys; only called by SECURITY DEFINER functions.
-- Default RLS: deny all. Functions bypass RLS via SECURITY DEFINER.


-- ─── Helper: check rate limit ────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_action    text,
  p_actor_key text,
  p_max_calls integer,
  p_window_seconds integer
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recent_count integer;
BEGIN
  -- Prune old entries for this action+actor (keep table small)
  DELETE FROM public.rate_limit_log
  WHERE action = p_action
    AND actor_key = p_actor_key
    AND created_at < now() - make_interval(secs => p_window_seconds * 2);

  -- Count recent entries within the window
  SELECT count(*)
  INTO recent_count
  FROM public.rate_limit_log
  WHERE action = p_action
    AND actor_key = p_actor_key
    AND created_at > now() - make_interval(secs => p_window_seconds);

  IF recent_count >= p_max_calls THEN
    RETURN false;  -- Rate limited
  END IF;

  -- Log this action
  INSERT INTO public.rate_limit_log (action, actor_key)
  VALUES (p_action, p_actor_key);

  RETURN true;  -- Allowed
END;
$$;


-- ─── 1. Rate-limited analytics insert ────────────────────────────────────────
-- Enforce max 60 events per session per minute at the DB level.
-- We add a trigger-based check since RLS WITH CHECK cannot call functions
-- that perform DML (INSERT into rate_limit_log). Instead we use a BEFORE
-- INSERT trigger.

CREATE OR REPLACE FUNCTION public.enforce_analytics_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recent_count integer;
BEGIN
  -- Count recent events from this session in the last 60 seconds
  SELECT count(*)
  INTO recent_count
  FROM public.analytics_events
  WHERE session_id = NEW.session_id
    AND created_at > now() - interval '60 seconds';

  IF recent_count >= 60 THEN
    -- Silently drop the event (don't raise an exception to avoid client errors)
    RETURN NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_analytics_rate_limit ON public.analytics_events;
CREATE TRIGGER trg_analytics_rate_limit
  BEFORE INSERT ON public.analytics_events
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_analytics_rate_limit();


-- ─── 2. Rate-limited shared_results insert ───────────────────────────────────
-- Global limit: max 30 new share links per minute across all users.
-- This prevents automated spam while still allowing normal usage.

CREATE OR REPLACE FUNCTION public.enforce_share_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  recent_count integer;
BEGIN
  -- Global rate limit: max 30 new share links per minute
  SELECT count(*)
  INTO recent_count
  FROM public.shared_results
  WHERE created_at > now() - interval '60 seconds';

  IF recent_count >= 30 THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many share links created. Please try again later.'
      USING ERRCODE = 'rate_limit_exceeded';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_share_rate_limit ON public.shared_results;
CREATE TRIGGER trg_share_rate_limit
  BEFORE INSERT ON public.shared_results
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_share_rate_limit();


-- ─── 3. Rate-limited view count increment ────────────────────────────────────
-- Replace the existing function with a rate-limited version.

CREATE OR REPLACE FUNCTION public.increment_shared_result_views(p_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  allowed boolean;
BEGIN
  -- Rate limit: max 10 increments per share ID per minute
  SELECT public.check_rate_limit('view_increment', p_id, 10, 60)
  INTO allowed;

  IF NOT allowed THEN
    -- Silently skip — don't error for view count abuse
    RETURN;
  END IF;

  UPDATE public.shared_results
  SET view_count = view_count + 1
  WHERE id = p_id;
END;
$$;

-- Re-grant since we replaced the function
GRANT EXECUTE ON FUNCTION public.increment_shared_result_views(text) TO anon, authenticated;


-- ─── 4. Updated upsert_quiz_result with expanded whitelist + rate limiting ───

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

  -- Accept known quiz keys (including deep variants)
  IF p_quiz_key NOT IN ('cake', 'mbti', 'enneagram', 'mbti_deep', 'enneagram_deep') THEN
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

-- Restore the security grants from migration 20260303000001.
-- CREATE OR REPLACE does not preserve existing grants, so we must re-apply
-- the REVOKE PUBLIC + GRANT authenticated to prevent anon access.
REVOKE EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) TO authenticated;


-- ─── 5. Pin search_path on handle_updated_at ─────────────────────────────────
-- This function is LANGUAGE plpgsql but not SECURITY DEFINER, so this is a
-- low-risk change. Pinning search_path is still good practice.

ALTER FUNCTION public.handle_updated_at() SET search_path = '';


-- ─── 6. Periodic cleanup of rate_limit_log ──────────────────────────────────
-- Create a function that can be called by pg_cron or manually to clean up
-- old rate limit entries.

CREATE OR REPLACE FUNCTION public.cleanup_rate_limit_log()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  DELETE FROM public.rate_limit_log
  WHERE created_at < now() - interval '10 minutes';
$$;

-- Only service_role should call this
REVOKE EXECUTE ON FUNCTION public.cleanup_rate_limit_log() FROM PUBLIC;
