/*
  # Rename "Crews" to "Circles"

  Product rename only — the connections model is unchanged. This migration:

  1. Adds `list_circle()` as the canonical crew-list RPC. `list_crew()` is
     kept temporarily so clients built before this rename keep working while
     the new bundle deploys; it is dropped in the follow-up migration
     (20260720000007) once the new client is live.
  2. Recreates `request_connection` with circle wording in its user-facing
     errors and a `circle_request` rate-limit bucket (same name/signature,
     so this is transparent to both old and new clients).
  3. Extends the analytics allowlist with the `circle_*` events. The old
     `crew_*` names stay allowed because rows with those events already
     exist; nothing writes them after the client deploy.
*/

-- ─── 1. list_circle (same body as list_crew) ────────────────────────────────

CREATE OR REPLACE FUNCTION public.list_circle()
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

REVOKE EXECUTE ON FUNCTION public.list_circle() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.list_circle() TO authenticated;

-- ─── 2. request_connection: circle wording + rate bucket ────────────────────

CREATE OR REPLACE FUNCTION public.request_connection(p_share_id text)
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
    RAISE EXCEPTION 'Sign in to add someone to your circle'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF p_share_id IS NULL OR p_share_id !~ '^[a-f0-9]{8}$' THEN
    RAISE EXCEPTION 'Invalid share link' USING ERRCODE = 'invalid_parameter_value';
  END IF;

  SELECT owner_id, quiz_type INTO v_owner, v_quiz
  FROM public.shared_results WHERE id = p_share_id;

  IF v_owner IS NULL THEN
    RAISE EXCEPTION 'This share link cannot receive circle requests'
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

  IF NOT public.check_rate_limit('circle_request', auth.uid()::text, 10, 60) THEN
    RAISE EXCEPTION 'Too many circle requests. Please try again shortly.'
      USING ERRCODE = 'P0001';
  END IF;

  INSERT INTO public.connections (requester, addressee, share_id, quiz_type)
  VALUES (auth.uid(), v_owner, p_share_id, v_quiz);

  RETURN 'pending_sent';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.request_connection(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_connection(text) TO authenticated;

-- ─── 3. analytics allowlist: add circle_* (keep crew_* for existing rows) ───

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
    'crew_viewed', 'crew_member_removed',
    'circle_request_sent', 'circle_request_accepted', 'circle_request_declined',
    'circle_viewed', 'circle_member_removed'
  )) NOT VALID;
