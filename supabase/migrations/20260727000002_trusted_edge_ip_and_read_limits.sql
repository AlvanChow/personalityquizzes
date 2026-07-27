/*
  # Trusted edge client IP, and rate limits on the remaining read paths

  ## 1. The Worker collapses every visitor into one rate-limit bucket

  worker/index.js renders Open Graph metadata for /s/:id by calling
  get_shared_result server-to-server. It builds fresh request headers, so the
  visitor's address is never forwarded and Supabase's edge stamps
  cf-connecting-ip with the Worker's own egress address. Every visitor to every
  share link therefore shared a single share_read bucket (120/min), and once
  20260723000001 changed the over-limit behaviour from "return empty" to
  RAISE EXCEPTION, one client at ~2 req/sec could make the Worker return 503
  for the whole site. The rate-limit slot is also consumed before the row
  lookup, so non-existent IDs cost the same as real ones.

  The Worker may now forward the real visitor IP, but only while proving it is
  the Worker: 20260721000001 removed the spoofable x-forwarded-for fallback for
  good reason and this must not reintroduce it. The forwarded header is honoured
  only when the request also carries a shared secret matching edge_config, and
  the value is normalised through inet so a caller who did obtain the secret
  still cannot rotate junk into unlimited unique buckets.

  Fail-safe by construction: with no secret configured (the state this
  migration leaves behind), the forwarded header is ignored entirely and
  behaviour is identical to today.

  To enable, set both halves — they must match:
    -- database
    UPDATE public.edge_config SET share_proxy_secret = '<48+ random chars>';
    -- Cloudflare
    npx wrangler secret put SHARE_PROXY_SECRET

  ## 2. vote_hot_take's read path was unlimited

  The per-IP cap sat inside the `p_choice IN ('a','b')` write branch, but the
  aggregate GROUP BY at the end runs on every call — including the
  `p_choice: null` hydration that src/pages/HotTakes.jsx issues per debate.
  Any anon caller could run unbounded aggregate queries.

  ## 3. list_circle had no limit either

  Authenticated-only and cheap per call, but it joins connections to profiles
  every time and nothing bounded how often. Now 30/min per user.
*/

-- ─── 1. Edge configuration ──────────────────────────────────────────────────

CREATE TABLE public.edge_config (
  id                 boolean     PRIMARY KEY DEFAULT true CHECK (id),
  share_proxy_secret text,
  updated_at         timestamptz NOT NULL DEFAULT now(),
  -- A short secret is worse than none: it would look configured while being
  -- guessable. Reject anything that is not a real random string.
  CONSTRAINT edge_config_secret_strength
    CHECK (share_proxy_secret IS NULL OR char_length(share_proxy_secret) >= 32)
);

ALTER TABLE public.edge_config ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.edge_config FROM PUBLIC, anon, authenticated;

INSERT INTO public.edge_config (id, share_proxy_secret)
VALUES (true, NULL)
ON CONFLICT (id) DO NOTHING;

-- ─── 2. request_client_ip: accept a proven edge-forwarded address ───────────
-- SECURITY DEFINER so it can read the locked-down config table. STABLE is
-- retained: this only reads.

CREATE OR REPLACE FUNCTION public.request_client_ip()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
  headers         json;
  supplied_secret text;
  edge_secret     text;
  forwarded_ip    text;
BEGIN
  headers := nullif(current_setting('request.headers', true), '')::json;
  IF headers IS NULL THEN
    RETURN NULL;
  END IF;

  supplied_secret := headers ->> 'x-edge-proxy-secret';
  IF supplied_secret IS NOT NULL AND char_length(supplied_secret) >= 32 THEN
    SELECT c.share_proxy_secret INTO edge_secret
    FROM public.edge_config c
    WHERE c.id;

    IF edge_secret IS NOT NULL
       AND char_length(edge_secret) >= 32
       AND supplied_secret = edge_secret THEN
      forwarded_ip := headers ->> 'x-edge-client-ip';
      IF forwarded_ip IS NOT NULL AND forwarded_ip <> '' THEN
        -- host(inet) both validates and normalises. An unparseable value falls
        -- through to cf-connecting-ip rather than becoming a bucket key.
        BEGIN
          RETURN host(forwarded_ip::inet);
        EXCEPTION WHEN OTHERS THEN
          NULL;
        END;
      END IF;
    END IF;
  END IF;

  -- cf-connecting-ip is set by Supabase's Cloudflare edge and cannot be forged
  -- by the client. It stays the default for every direct browser call.
  RETURN headers ->> 'cf-connecting-ip';
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

-- This function has always relied on the default PUBLIC EXECUTE grant. That was
-- harmless while it only echoed the caller's own IP, but it now compares a
-- secret: a caller could invoke it with a guessed x-edge-proxy-secret and read
-- the return value to learn whether the guess was right. A 32+ character random
-- secret makes that infeasible, but the oracle should not exist. Every caller is
-- a SECURITY DEFINER function and is unaffected by the revoke — the same
-- reasoning 20260720000001 applied to check_rate_limit.
REVOKE EXECUTE ON FUNCTION public.request_client_ip() FROM PUBLIC, anon, authenticated;

-- ─── 3. vote_hot_take: cap the tally read, not just the vote ────────────────

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

  client_ip := public.request_client_ip();

  -- 60/min per IP covers the whole Hot Takes page (8 debates) being hydrated
  -- several times over with room to spare. Returning empty is already handled
  -- by the caller, which keeps the saved pick visible without percentages.
  IF client_ip IS NOT NULL
     AND NOT public.check_rate_limit('hot_take_read', client_ip, 60, 60) THEN
    RETURN;
  END IF;

  IF p_choice IN ('a', 'b') AND p_session IS NOT NULL THEN
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

-- ─── 4. list_circle: bound the per-caller read ──────────────────────────────
-- Authenticated-only and cheap, but it joins connections to profiles on every
-- call and had no cap at all. Silently returning empty would look like an
-- empty circle, so this raises the same way the other limited RPCs do.
-- Dropping STABLE is required: check_rate_limit() performs DML.

CREATE OR REPLACE FUNCTION public.list_circle()
RETURNS TABLE (
  connection_id uuid,
  status text,
  direction text,
  friend_name text,
  friend_types jsonb,
  quiz_type text,
  created_at timestamptz,
  accepted_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
  END IF;

  IF NOT public.check_rate_limit('circle_list', auth.uid()::text, 30, 60) THEN
    RAISE EXCEPTION 'Too many requests. Please try again shortly.'
      USING ERRCODE = 'P0001';
  END IF;

  RETURN QUERY
  SELECT
    c.id,
    c.status,
    CASE WHEN c.addressee = auth.uid() THEN 'incoming' ELSE 'outgoing' END,
    COALESCE(NULLIF(p.display_name, ''), 'A friend'),
    -- Type identities are visible only once accepted, or to the addressee of
    -- an incoming request (the requester consented by requesting). An
    -- outgoing pending request must never reveal the other person's data.
    CASE WHEN c.status = 'accepted' OR c.addressee = auth.uid() THEN (
      SELECT COALESCE(jsonb_object_agg(k, jsonb_build_object(
        'resultKey', p.quiz_results -> k ->> 'resultKey',
        'name',      p.quiz_results -> k ->> 'name',
        'emoji',     p.quiz_results -> k ->> 'emoji'
      )), '{}'::jsonb)
      FROM jsonb_object_keys(COALESCE(p.quiz_results, '{}'::jsonb)) AS k
      WHERE k IN ('mbti', 'mbti_deep', 'enneagram', 'enneagram_deep', 'cake', 'house')
    ) ELSE '{}'::jsonb END,
    c.quiz_type,
    c.created_at,
    c.accepted_at
  FROM public.connections c
  JOIN public.profiles p
    ON p.id = CASE WHEN c.requester = auth.uid() THEN c.addressee ELSE c.requester END
  WHERE c.requester = auth.uid() OR c.addressee = auth.uid()
  ORDER BY (c.status = 'pending') DESC, c.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.list_circle() FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.list_circle() TO authenticated;

-- ─── 5. Strip privileges that RLS cannot govern ─────────────────────────────
-- Supabase's default privileges grant ALL on every new public table to anon
-- and authenticated, and RLS is what actually denies access. That holds for
-- SELECT/INSERT/UPDATE/DELETE — but NOT for TRUNCATE, which bypasses row-level
-- security entirely. Verified against a stock Postgres: as anon,
-- `DELETE FROM public.profiles` removes 0 rows while `TRUNCATE public.profiles`
-- succeeds.
--
-- This is latent rather than live: PostgREST only ever issues
-- SELECT/INSERT/UPDATE/DELETE/CALL, so there is no path from the public anon
-- key to a TRUNCATE today. It costs nothing to close, and neither TRUNCATE nor
-- REFERENCES is used by any code path, so revoking them cannot regress the app.

DO $$
DECLARE
  target regclass;
BEGIN
  FOR target IN
    SELECT c.oid::regclass
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public' AND c.relkind = 'r'
  LOOP
    EXECUTE format('REVOKE TRUNCATE, REFERENCES ON TABLE %s FROM anon, authenticated', target);
  END LOOP;
END $$;

-- Keep future tables clean without having to remember this.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  REVOKE TRUNCATE, REFERENCES ON TABLES FROM anon, authenticated;
