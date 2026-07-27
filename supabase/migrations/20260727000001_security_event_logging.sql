/*
  # Server-authoritative security event logging

  Before this migration nothing recorded a security event in a way an attacker
  could not shape:

  - Auth events existed only as browser-emitted analytics (auth_sign_in_started
    / _completed / auth_sign_out). Those are suppressible via the analytics
    opt-out, silently droppable by the per-IP and per-session limiters, and
    forgeable by any anon caller holding the public key. src/utils/analytics.js
    says as much in its own TRUST NOTE.
  - Authorization denials (`Unauthorized: cannot modify another user's quiz
    results`, `Admin access required`) raised to the caller and vanished.
  - Rate-limit denials were never recorded at all: check_rate_limit() only
    wrote to rate_limit_log on the ALLOW path, so a blocked request left no
    trace, and rate_limit_log is purged after ten minutes regardless.
  - No client IP was ever persisted against an actor.

  ## Two channels, one call

  log_security_event() writes to both a server log and a table, because
  neither alone is sufficient:

  - RAISE LOG reaches the Postgres server log immediately and is NOT rolled
    back. This is the channel that matters: most denial paths end in RAISE
    EXCEPTION, which would discard a table row written earlier in the same
    transaction. Postgres has no autonomous transactions, so this is how a
    denial that aborts still leaves evidence.
  - An INSERT into security_events is what the admin dashboard reads. It
    survives whenever the surrounding transaction commits — the trigger paths
    that RETURN NULL, and callers that log without raising.

  Callers make one call and get whichever channels apply to their path.

  ## Volatility

  Any function that calls log_security_event() performs DML and therefore
  cannot be declared STABLE. admin_list_auth_users() is recreated below
  without STABLE for exactly that reason.
*/

-- ─── 1. security_events ─────────────────────────────────────────────────────

CREATE TABLE public.security_events (
  id         bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event      text        NOT NULL CHECK (event ~ '^[a-z][a-z0-9_]{0,63}$'),
  actor      uuid,                                  -- auth.uid() when known
  client_ip  text        CHECK (client_ip IS NULL OR char_length(client_ip) <= 45),
  dedupe_key text        CHECK (dedupe_key IS NULL OR char_length(dedupe_key) <= 200),
  detail     jsonb       NOT NULL DEFAULT '{}'::jsonb
               CHECK (jsonb_typeof(detail) = 'object' AND octet_length(detail::text) <= 2048),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_security_events_created ON public.security_events (created_at DESC);
CREATE INDEX idx_security_events_event   ON public.security_events (event, created_at DESC);
CREATE INDEX idx_security_events_actor   ON public.security_events (actor, created_at DESC)
  WHERE actor IS NOT NULL;
CREATE INDEX idx_security_events_dedupe  ON public.security_events (event, dedupe_key, created_at DESC)
  WHERE dedupe_key IS NOT NULL;

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

-- An RLS policy does not grant a table privilege, so both halves are needed:
-- strip every default grant, hand back SELECT only, then let the policy narrow
-- that to admins. Writes have no grant and no policy — the SECURITY DEFINER
-- logger is the only writer.
REVOKE ALL ON TABLE public.security_events FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.security_events TO authenticated;

CREATE POLICY "security_events_admin_read"
  ON public.security_events
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- ─── 2. log_security_event ──────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.log_security_event(
  p_event      text,
  p_detail     jsonb DEFAULT '{}'::jsonb,
  p_dedupe_key text  DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_actor  uuid;
  v_ip     text;
  v_detail jsonb;
  v_dedupe text;
BEGIN
  IF p_event IS NULL OR p_event !~ '^[a-z][a-z0-9_]{0,63}$' THEN
    RETURN;
  END IF;

  -- Truncate once: the lookup below and the stored value must be the same
  -- string or the dedupe silently never matches.
  v_dedupe := left(p_dedupe_key, 200);

  v_detail := coalesce(p_detail, '{}'::jsonb);
  IF jsonb_typeof(v_detail) <> 'object' OR octet_length(v_detail::text) > 2048 THEN
    v_detail := '{}'::jsonb;
  END IF;

  v_actor := auth.uid();
  v_ip    := public.request_client_ip();

  -- Collapse repeats so a sustained flood cannot turn its own denials into a
  -- storage amplification. Best-effort by design: a caller that raises after
  -- logging rolls this lookup back too, which errs toward recording more.
  IF v_dedupe IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.security_events e
    WHERE e.event = p_event
      AND e.dedupe_key = v_dedupe
      AND e.created_at > now() - interval '60 seconds'
  ) THEN
    RETURN;
  END IF;

  -- Durable channel: survives the RAISE EXCEPTION that most callers end with.
  RAISE LOG '[security] event=% actor=% ip=% detail=%',
    p_event,
    coalesce(v_actor::text, '-'),
    coalesce(v_ip, '-'),
    v_detail;

  -- Queryable channel: what the admin dashboard reads.
  INSERT INTO public.security_events (event, actor, client_ip, dedupe_key, detail)
  VALUES (p_event, v_actor, v_ip, v_dedupe, v_detail);
EXCEPTION WHEN OTHERS THEN
  -- Observability must never break the operation it is observing.
  RETURN;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.log_security_event(text, jsonb, text)
  FROM PUBLIC, anon, authenticated;

-- ─── 3. Record rate-limit denials ───────────────────────────────────────────
-- Body is unchanged except for the log call on the reject path. Previously the
-- RETURN false at the top of this branch was the end of the story.

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
  DELETE FROM public.rate_limit_log
  WHERE action = p_action
    AND actor_key = p_actor_key
    AND created_at < now() - make_interval(secs => p_window_seconds * 2);

  SELECT count(*)
  INTO recent_count
  FROM public.rate_limit_log
  WHERE action = p_action
    AND actor_key = p_actor_key
    AND created_at > now() - make_interval(secs => p_window_seconds);

  IF recent_count >= p_max_calls THEN
    PERFORM public.log_security_event(
      'rate_limit_hit',
      jsonb_build_object(
        'action', p_action,
        'actor_key', p_actor_key,
        'limit', p_max_calls,
        'window_seconds', p_window_seconds
      ),
      p_action || ':' || p_actor_key
    );
    RETURN false;
  END IF;

  INSERT INTO public.rate_limit_log (action, actor_key)
  VALUES (p_action, p_actor_key);

  RETURN true;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.check_rate_limit(text, text, integer, integer)
  FROM PUBLIC, anon, authenticated;

-- ─── 4. Record authorization denials ────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.upsert_quiz_result(
  p_user_id  uuid,
  p_quiz_key text,
  p_result   jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  allowed boolean;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF auth.uid() <> p_user_id THEN
    PERFORM public.log_security_event(
      'authz_denied',
      jsonb_build_object('fn', 'upsert_quiz_result', 'target_user', p_user_id)
    );
    RAISE EXCEPTION 'Unauthorized: cannot modify another user''s quiz results'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF p_quiz_key IS NULL OR p_quiz_key !~ '^[a-z][a-z0-9_]{1,31}$' THEN
    RAISE EXCEPTION 'Invalid quiz key: %', p_quiz_key
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_result IS NULL
     OR jsonb_typeof(p_result) <> 'object'
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

REVOKE EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) TO authenticated;


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
    PERFORM public.log_security_event(
      'authz_denied',
      jsonb_build_object('fn', 'upsert_quiz_results_bulk', 'target_user', p_user_id)
    );
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
GRANT  EXECUTE ON FUNCTION public.upsert_quiz_results_bulk(uuid, jsonb) TO authenticated;


-- respond_connection's "Request not found" doubles as the authorization
-- failure for someone guessing connection UUIDs to accept on another user's
-- behalf, so it is worth a record.
CREATE OR REPLACE FUNCTION public.respond_connection(p_connection_id uuid, p_accept boolean)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_row public.connections%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  SELECT * INTO v_row FROM public.connections
  WHERE id = p_connection_id AND addressee = auth.uid() AND status = 'pending';

  IF NOT FOUND THEN
    PERFORM public.log_security_event(
      'authz_denied',
      jsonb_build_object('fn', 'respond_connection', 'connection_id', p_connection_id)
    );
    RAISE EXCEPTION 'Request not found' USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF p_accept THEN
    UPDATE public.connections
    SET status = 'accepted', accepted_at = now()
    WHERE id = p_connection_id;
    RETURN 'accepted';
  ELSE
    DELETE FROM public.connections WHERE id = p_connection_id;
    RETURN 'declined';
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.respond_connection(uuid, boolean) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.respond_connection(uuid, boolean) TO authenticated;

-- ─── 5. Admin data access: log the denial AND the success ───────────────────
-- Dropping STABLE is required, not cosmetic: log_security_event() performs an
-- INSERT, which a non-volatile function may not do.

CREATE OR REPLACE FUNCTION public.admin_list_auth_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()
  ) THEN
    PERFORM public.log_security_event(
      'authz_denied',
      jsonb_build_object('fn', 'admin_list_auth_users')
    );
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  -- This returns up to 10k rows and had no cap. Admin-gated, so the concern is
  -- accident and credential misuse rather than anonymous abuse.
  IF NOT public.check_rate_limit('admin_read', auth.uid()::text, 20, 60) THEN
    RAISE EXCEPTION 'Too many requests. Please try again shortly.'
      USING ERRCODE = 'P0001';
  END IF;

  -- Exporting every account email is the most sensitive read in the product.
  -- This call commits, so the table row is reliable here.
  PERFORM public.log_security_event(
    'admin_data_access',
    jsonb_build_object('fn', 'admin_list_auth_users')
  );

  RETURN QUERY
  SELECT u.id, u.email::text, u.created_at, u.last_sign_in_at
  FROM auth.users u
  WHERE u.email IS NOT NULL
  ORDER BY u.created_at DESC
  LIMIT 10000;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_auth_users() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.admin_list_auth_users() TO authenticated;

-- ─── 6. Failed sign-ins ─────────────────────────────────────────────────────
-- GoTrue owns authentication, so failed logins are recorded in
-- auth.audit_log_entries rather than anywhere this schema controls. Surface
-- them read-only to admins instead of duplicating auth state into public.

CREATE OR REPLACE FUNCTION public.admin_list_auth_audit(p_limit integer DEFAULT 200)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  action text,
  actor_id text,
  actor_username text,
  ip_address text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()
  ) THEN
    PERFORM public.log_security_event(
      'authz_denied',
      jsonb_build_object('fn', 'admin_list_auth_audit')
    );
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF NOT public.check_rate_limit('admin_read', auth.uid()::text, 20, 60) THEN
    RAISE EXCEPTION 'Too many requests. Please try again shortly.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN QUERY
  SELECT
    e.id,
    e.created_at,
    e.payload ->> 'action',
    e.payload ->> 'actor_id',
    e.payload ->> 'actor_username',
    e.ip_address::text
  FROM auth.audit_log_entries e
  ORDER BY e.created_at DESC
  LIMIT least(greatest(coalesce(p_limit, 200), 1), 1000);
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_auth_audit(integer) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.admin_list_auth_audit(integer) TO authenticated;

-- ─── 7. Retention ───────────────────────────────────────────────────────────
-- 90 days rather than the 12 months used for product analytics: these rows
-- carry client IPs, so they are kept only as long as they are useful for
-- investigating an incident.

CREATE OR REPLACE FUNCTION public.prune_expired_product_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  DELETE FROM public.analytics_events
  WHERE created_at < now() - interval '12 months';

  DELETE FROM public.quiz_feedback
  WHERE created_at < now() - interval '12 months';

  DELETE FROM public.security_events
  WHERE created_at < now() - interval '90 days';

  DELETE FROM public.rate_limit_log
  WHERE created_at < now() - interval '10 minutes';

  RETURN NULL;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.prune_expired_product_data() FROM PUBLIC, anon, authenticated;
