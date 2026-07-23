/*
  # Harden share tokens and reads

  New links use 128-bit random tokens (32 lowercase hex characters). Existing
  8-character links remain readable so published URLs do not break. Public share
  reads are rate-limited per trusted client IP, and connection creation handles
  simultaneous opposite-direction requests without leaking a unique violation.
*/

-- Preserve legacy links while requiring 128-bit IDs for every new insert.
ALTER TABLE public.shared_results
  DROP CONSTRAINT IF EXISTS shared_results_id_format;
ALTER TABLE public.shared_results
  ADD CONSTRAINT shared_results_id_format
  CHECK (id ~ '^([a-f0-9]{8}|[a-f0-9]{32})$');

DROP POLICY IF EXISTS "anyone can create shared results" ON public.shared_results;
CREATE POLICY "anyone can create shared results"
  ON public.shared_results
  FOR INSERT
  WITH CHECK (
    id ~ '^[a-f0-9]{32}$'
    AND quiz_type ~ '^[a-z][a-z0-9_-]{1,31}$'
    AND length(result_key) <= 20
    AND length(result_name) <= 100
    AND length(result_emoji) <= 16
    AND octet_length(result_data::text) <= 4096
    AND view_count = 0
    AND (owner_id IS NULL OR owner_id = auth.uid())
  );

-- Token-gated and IP-rate-limited read path. This returns the same curated shape
-- as the Circle migration and never exposes owner_id.
CREATE OR REPLACE FUNCTION public.get_shared_result(p_id text)
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
  connection_status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  client_ip text;
BEGIN
  IF p_id IS NULL OR p_id !~ '^([a-f0-9]{8}|[a-f0-9]{32})$' THEN
    RETURN;
  END IF;

  client_ip := public.request_client_ip();
  IF client_ip IS NOT NULL
     AND NOT public.check_rate_limit('share_read', client_ip, 120, 60) THEN
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
GRANT EXECUTE ON FUNCTION public.get_shared_result(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.increment_shared_result_views(p_id text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_id IS NULL OR p_id !~ '^([a-f0-9]{8}|[a-f0-9]{32})$' THEN
    RETURN;
  END IF;

  IF NOT public.check_rate_limit('view_increment', p_id, 10, 60) THEN
    RETURN;
  END IF;

  UPDATE public.shared_results
  SET view_count = view_count + 1
  WHERE id = p_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.increment_shared_result_views(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_shared_result_views(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.request_connection(p_share_id text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_owner uuid;
  v_quiz text;
  v_existing public.connections%ROWTYPE;
  inserted_count integer;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Sign in to add someone to your circle'
      USING ERRCODE = 'insufficient_privilege';
  END IF;

  IF p_share_id IS NULL OR p_share_id !~ '^([a-f0-9]{8}|[a-f0-9]{32})$' THEN
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
  VALUES (auth.uid(), v_owner, p_share_id, v_quiz)
  ON CONFLICT DO NOTHING;
  GET DIAGNOSTICS inserted_count = ROW_COUNT;

  IF inserted_count = 0 THEN
    SELECT * INTO v_existing FROM public.connections c
    WHERE (c.requester = auth.uid() AND c.addressee = v_owner)
       OR (c.requester = v_owner AND c.addressee = auth.uid());
    RETURN CASE
      WHEN v_existing.status = 'accepted' THEN 'accepted'
      WHEN v_existing.requester = auth.uid() THEN 'pending_sent'
      ELSE 'pending_received'
    END;
  END IF;

  RETURN 'pending_sent';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.request_connection(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.request_connection(text) TO authenticated;
