/*
  # Launch hardening: shared_results abuse surface, rate-limit fixes, constraints

  Fixes findings from the pre-launch security audit:

  1. shared_results
     - result_emoji was completely unconstrained (unbounded storage / defacement
       vector on an anonymously-writable table). Cap at 16 chars.
     - id format was only length-checked; enforce lowercase-hex format.
     - view_count could be seeded to any value on insert; force 0.
     - The blanket SELECT USING (true) policy allowed dumping the entire table.
       Reads now go through get_shared_result(p_id), restoring the
       "must know the token" property.
     - The INSERT rate limit was a single GLOBAL counter that RAISEd at 30/min:
       one attacker could saturate it and block every legitimate share (DoS).
       Now rate-limited per client IP (10/min) with a much higher global
       backstop (120/min).

  2. check_rate_limit() was SECURITY DEFINER with default PUBLIC EXECUTE,
     letting anyone insert arbitrary rows into rate_limit_log and poison
     rate-limit buckets (e.g. freeze a user's quiz saves). Revoked.

  3. profiles: display_name / avatar_url / quiz_results had no size caps, so a
     direct PATCH could bypass the upsert_quiz_result RPC's 2 KB limit.
     Added table CHECK constraints (NOT VALID so pre-existing rows are exempt).

  4. analytics_events
     - The event-name allowlist only existed client-side; the DB accepted any
       regex-matching name. Added a DB-level allowlist CHECK (NOT VALID).
       NOTE: new client events must be added here first or their inserts fail.
     - The per-session rate limit keyed on the client-supplied session_id,
       which an attacker rotates freely. Now also limited per client IP.
     - Re-assert the hardened INSERT policies so the permissive
       WITH CHECK (true) fallbacks in 20260305000001 can never resurface.
*/

-- ─── 1a. shared_results: column constraints ─────────────────────────────────

ALTER TABLE public.shared_results
  ADD CONSTRAINT shared_results_emoji_length
  CHECK (char_length(result_emoji) <= 16) NOT VALID;

ALTER TABLE public.shared_results
  ADD CONSTRAINT shared_results_id_format
  CHECK (id ~ '^[a-f0-9]{8}$') NOT VALID;

-- ─── 1b. shared_results: allow the new 'house' quiz type ────────────────────

ALTER TABLE public.shared_results DROP CONSTRAINT IF EXISTS shared_results_quiz_type_check;
ALTER TABLE public.shared_results
  ADD CONSTRAINT shared_results_quiz_type_check
  CHECK (quiz_type IN ('mbti', 'enneagram', 'cake', 'big5', 'house'));

-- ─── 1c. shared_results: tightened INSERT policy ────────────────────────────

DROP POLICY IF EXISTS "anyone can create shared results" ON public.shared_results;

CREATE POLICY "anyone can create shared results"
  ON public.shared_results
  FOR INSERT
  WITH CHECK (
    id ~ '^[a-f0-9]{8}$'
    AND quiz_type IN ('mbti', 'enneagram', 'cake', 'big5', 'house')
    AND length(result_key) <= 20
    AND length(result_name) <= 100
    AND length(result_emoji) <= 16
    AND octet_length(result_data::text) <= 4096
    AND view_count = 0
  );

-- ─── 1d. shared_results: token-gated reads via RPC ──────────────────────────

CREATE OR REPLACE FUNCTION public.get_shared_result(p_id text)
RETURNS SETOF public.shared_results
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT * FROM public.shared_results
  WHERE id = p_id
    AND p_id ~ '^[a-f0-9]{8}$'
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_shared_result(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_shared_result(text) TO anon, authenticated;

-- Remove the blanket SELECT policy: with RLS enabled and no SELECT policy,
-- anon/authenticated can no longer enumerate the table. The SECURITY DEFINER
-- RPC above is the only read path.
DROP POLICY IF EXISTS "anyone can read shared results" ON public.shared_results;

-- ─── 1e. shared_results: per-IP INSERT rate limit ───────────────────────────

-- Best-effort client IP from the PostgREST request headers. NULL when called
-- outside PostgREST (e.g. service role via direct connection).
CREATE OR REPLACE FUNCTION public.request_client_ip()
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  headers json;
BEGIN
  headers := nullif(current_setting('request.headers', true), '')::json;
  IF headers IS NULL THEN
    RETURN NULL;
  END IF;
  RETURN coalesce(
    headers ->> 'cf-connecting-ip',
    nullif(trim(split_part(headers ->> 'x-forwarded-for', ',', 1)), '')
  );
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.enforce_share_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  client_ip    text;
  recent_count integer;
BEGIN
  -- Per-IP limit: 10 share links per minute. Only the abusing IP is blocked.
  client_ip := public.request_client_ip();
  IF client_ip IS NOT NULL THEN
    IF NOT public.check_rate_limit('share_create', client_ip, 10, 60) THEN
      RAISE EXCEPTION 'Rate limit exceeded: too many share links created. Please try again later.'
        USING ERRCODE = 'P0001';
    END IF;
  END IF;

  -- Global backstop: high enough that legitimate launch traffic never hits
  -- it, low enough to bound a distributed flood.
  SELECT count(*)
  INTO recent_count
  FROM public.shared_results
  WHERE created_at > now() - interval '60 seconds';

  IF recent_count >= 120 THEN
    RAISE EXCEPTION 'Rate limit exceeded: too many share links created. Please try again later.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN NEW;
END;
$$;

-- (Trigger trg_share_rate_limit already exists and now uses the new body.)

-- ─── 2. Lock down check_rate_limit ──────────────────────────────────────────
-- SECURITY DEFINER + default PUBLIC EXECUTE meant anyone could poison
-- rate-limit buckets or flood rate_limit_log. It is only ever called from
-- other SECURITY DEFINER functions, which are unaffected by this revoke.

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer) FROM PUBLIC, anon, authenticated;

-- Also validate the share id format before it becomes a rate-limit actor key.
CREATE OR REPLACE FUNCTION public.increment_shared_result_views(p_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_id IS NULL OR p_id !~ '^[a-f0-9]{8}$' THEN
    RETURN;
  END IF;

  -- Rate limit: max 10 increments per share ID per minute (silent skip).
  IF NOT public.check_rate_limit('view_increment', p_id, 10, 60) THEN
    RETURN;
  END IF;

  UPDATE public.shared_results
  SET view_count = view_count + 1
  WHERE id = p_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_shared_result_views(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.increment_shared_result_views(text) TO anon, authenticated;

-- ─── 3. profiles: size caps ─────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_display_name_length
  CHECK (display_name IS NULL OR char_length(display_name) <= 100) NOT VALID;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_avatar_url_length
  CHECK (avatar_url IS NULL OR char_length(avatar_url) <= 500) NOT VALID;

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_quiz_results_size
  CHECK (quiz_results IS NULL OR octet_length(quiz_results::text) <= 8192) NOT VALID;

-- ─── 4a. analytics_events: DB-level event allowlist ─────────────────────────
-- Must stay in sync with ALLOWED_EVENTS in src/utils/analytics.js.

ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_event_allowlist
  CHECK (event IN (
    'page_view',
    'baseline_completed',
    'baseline_reset',
    'quiz_started',
    'quiz_completed',
    'quiz_card_clicked',
    'quiz_result_viewed',
    'quiz_retaken',
    'hero_cta_clicked',
    'auth_sign_in_started',
    'auth_sign_in_completed',
    'auth_sign_out',
    'auth_nudge_clicked',
    'share_link_created',
    'share_button_clicked',
    'shared_result_viewed',
    'compat_viewed',
    'compare_quiz_started',
    'quiz_feedback_given',
    'hot_take_voted'
  )) NOT VALID;

-- ─── 4b. analytics_events: per-IP rate limit in addition to per-session ─────

CREATE OR REPLACE FUNCTION public.enforce_analytics_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  client_ip    text;
  recent_count integer;
BEGIN
  -- Per-IP: 120 events/min. session_id is client-controlled and trivially
  -- rotated, so the IP check is the one that actually bounds a flood.
  client_ip := public.request_client_ip();
  IF client_ip IS NOT NULL THEN
    IF NOT public.check_rate_limit('analytics', client_ip, 120, 60) THEN
      RETURN NULL;  -- silently drop
    END IF;
  END IF;

  -- Per-session: 60 events/min (kept from the original limiter).
  SELECT count(*)
  INTO recent_count
  FROM public.analytics_events
  WHERE session_id = NEW.session_id
    AND created_at > now() - interval '60 seconds';

  IF recent_count >= 60 THEN
    RETURN NULL;  -- silently drop
  END IF;

  RETURN NEW;
END;
$$;

-- ─── 4c. analytics_events: re-assert hardened INSERT policies ───────────────
-- 20260305000001 contains WITH CHECK (true) fallbacks guarded by
-- duplicate_object handlers. Re-create the hardened versions unconditionally
-- so a replay or manual policy drop can never leave the permissive versions.

DROP POLICY IF EXISTS "analytics_insert_anon" ON public.analytics_events;
CREATE POLICY "analytics_insert_anon"
  ON public.analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

DROP POLICY IF EXISTS "analytics_insert_authenticated" ON public.analytics_events;
CREATE POLICY "analytics_insert_authenticated"
  ON public.analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
