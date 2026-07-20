/*
  # Crews: persistent friend connections (Social Phase 1)

  Design constraints (product decisions, 2026-07-20):
  - Google sign-in required on both sides; guests keep the solo experience.
  - Child/family-safe: the ONLY way to form a connection is via a share link
    the owner personally distributed — there is no discovery, no messaging,
    and no way to contact a user you don't already know. Nothing beyond
    quiz-type identities (e.g. "INTJ 🏛️") is ever exposed to crew members.
  - A connection is invisible to the addressee's data until they accept.

  Access model: the connections table has NO insert/update policies — every
  mutation goes through SECURITY DEFINER RPCs that validate, rate-limit, and
  enforce participation. Reads go through list_crew() which returns only
  curated fields.
*/

-- ─── 1. Share ownership (who can be connected to via a share link) ──────────

ALTER TABLE public.shared_results
  ADD COLUMN owner_id uuid REFERENCES auth.users (id) ON DELETE SET NULL;

-- Recreate the INSERT policy: guests insert owner_id NULL; signed-in users
-- may only claim themselves. All prior hardening checks preserved.
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
    AND (owner_id IS NULL OR owner_id = auth.uid())
  );

-- Rework the share read RPC: never expose the raw owner uuid to the public.
-- Instead return booleans + the caller's connection status with the owner.
DROP FUNCTION IF EXISTS public.get_shared_result(text);

CREATE FUNCTION public.get_shared_result(p_id text)
RETURNS TABLE (
  id text,
  quiz_type text,
  result_key text,
  result_name text,
  result_emoji text,
  result_data jsonb,
  view_count integer,
  created_at timestamptz,
  has_owner boolean,
  owner_is_me boolean,
  connection_status text   -- null | 'pending_sent' | 'pending_received' | 'accepted'
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
BEGIN
  IF p_id IS NULL OR p_id !~ '^[a-f0-9]{8}$' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    s.id, s.quiz_type, s.result_key, s.result_name, s.result_emoji,
    s.result_data, s.view_count, s.created_at,
    (s.owner_id IS NOT NULL) AS has_owner,
    (auth.uid() IS NOT NULL AND s.owner_id = auth.uid()) AS owner_is_me,
    (
      SELECT CASE
        WHEN c.status = 'accepted' THEN 'accepted'
        WHEN c.requester = auth.uid() THEN 'pending_sent'
        ELSE 'pending_received'
      END
      FROM public.connections c
      WHERE auth.uid() IS NOT NULL
        AND s.owner_id IS NOT NULL
        AND ((c.requester = auth.uid() AND c.addressee = s.owner_id)
          OR (c.requester = s.owner_id AND c.addressee = auth.uid()))
      LIMIT 1
    ) AS connection_status
  FROM public.shared_results s
  WHERE s.id = p_id
  LIMIT 1;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_shared_result(text) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_shared_result(text) TO anon, authenticated;

-- ─── 2. Connections ─────────────────────────────────────────────────────────

CREATE TABLE public.connections (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  requester   uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  addressee   uuid        NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  status      text        NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted')),
  share_id    text,                          -- the share link that sparked it
  quiz_type   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz,
  CHECK (requester <> addressee)
);

-- One connection per pair, regardless of direction.
CREATE UNIQUE INDEX idx_connections_pair
  ON public.connections (least(requester, addressee), greatest(requester, addressee));
CREATE INDEX idx_connections_addressee ON public.connections (addressee, status);
CREATE INDEX idx_connections_requester ON public.connections (requester, status);

ALTER TABLE public.connections ENABLE ROW LEVEL SECURITY;
-- No policies: all access via the RPCs below.

-- ─── 3. RPCs ────────────────────────────────────────────────────────────────

-- Request a connection to the owner of a share link you received.
CREATE FUNCTION public.request_connection(p_share_id text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_owner uuid;
  v_quiz  text;
  v_existing public.connections%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in to add someone to your crew'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF p_share_id IS NULL OR p_share_id !~ '^[a-f0-9]{8}$' THEN
    RAISE EXCEPTION 'Invalid share link' USING ERRCODE = 'invalid_parameter_value';
  END IF;

  SELECT owner_id, quiz_type INTO v_owner, v_quiz
  FROM public.shared_results WHERE id = p_share_id;

  IF v_owner IS NULL THEN
    RAISE EXCEPTION 'This share link cannot receive crew requests'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF v_owner = auth.uid() THEN
    RAISE EXCEPTION 'That is your own result' USING ERRCODE = 'invalid_parameter_value';
  END IF;

  -- Idempotent: return the existing status if the pair already has a row.
  SELECT * INTO v_existing FROM public.connections c
  WHERE (c.requester = auth.uid() AND c.addressee = v_owner)
     OR (c.requester = v_owner AND c.addressee = auth.uid());
  IF FOUND THEN
    RETURN CASE
      WHEN v_existing.status = 'accepted' THEN 'accepted'
      WHEN v_existing.requester = auth.uid() THEN 'pending_sent'
      ELSE 'pending_received'
    END;
  END IF;

  IF NOT public.check_rate_limit('crew_request', auth.uid()::text, 10, 60) THEN
    RAISE EXCEPTION 'Too many crew requests. Please try again shortly.'
      USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.connections (requester, addressee, share_id, quiz_type)
  VALUES (auth.uid(), v_owner, p_share_id, v_quiz);

  RETURN 'pending_sent';
END;
$$;

-- Accept (true) or decline (false) an incoming request. Decline deletes.
CREATE FUNCTION public.respond_connection(p_connection_id uuid, p_accept boolean)
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

-- Leave a crew / cancel a sent request. Either participant may remove.
CREATE FUNCTION public.remove_connection(p_connection_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  DELETE FROM public.connections
  WHERE id = p_connection_id
    AND (requester = auth.uid() OR addressee = auth.uid());
END;
$$;

-- The caller's whole crew: accepted friends + pending requests, with each
-- friend's display name and quiz-type identities ONLY (no scores, no email).
CREATE FUNCTION public.list_crew()
RETURNS TABLE (
  connection_id uuid,
  status text,
  direction text,          -- 'incoming' | 'outgoing'
  friend_name text,
  friend_types jsonb,      -- { mbti: {...}, enneagram: {...}, cake: {...}, house: {...} }
  quiz_type text,
  created_at timestamptz,
  accepted_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN;
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

-- Supabase's default privileges also grant new functions to anon explicitly,
-- so revoke from both PUBLIC and anon.
REVOKE EXECUTE ON FUNCTION public.request_connection(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.respond_connection(uuid, boolean) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.remove_connection(uuid) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.list_crew() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_connection(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.respond_connection(uuid, boolean) TO authenticated;
GRANT EXECUTE ON FUNCTION public.remove_connection(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.list_crew() TO authenticated;

-- ─── 4. Analytics: new crew events ──────────────────────────────────────────

ALTER TABLE public.analytics_events
  DROP CONSTRAINT IF EXISTS analytics_events_event_allowlist;

ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_event_allowlist
  CHECK (event IN (
    'page_view', 'baseline_completed', 'baseline_reset', 'quiz_started',
    'quiz_completed', 'quiz_card_clicked', 'quiz_result_viewed', 'quiz_retaken',
    'hero_cta_clicked', 'auth_sign_in_started', 'auth_sign_in_completed',
    'auth_sign_out', 'auth_nudge_clicked', 'share_link_created',
    'share_button_clicked', 'shared_result_viewed', 'compat_viewed',
    'compare_quiz_started', 'quiz_feedback_given', 'hot_take_voted',
    'crew_request_sent', 'crew_request_accepted', 'crew_request_declined',
    'crew_viewed', 'crew_member_removed'
  )) NOT VALID;
