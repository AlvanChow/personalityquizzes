/*
  # Quiz feedback + admin metrics access

  1. quiz_feedback table
     Users rate how accurate/useful a quiz result felt (1–5). One rating per
     quiz per browser session (unique index) so aggregates aren't dominated by
     repeat submissions. Used to weight quiz importance over time.

     Writes: anon (user_id must be NULL) and authenticated (own user_id or
     NULL), rate-limited per client IP. Reads: admins only.

  2. Admin SELECT policies
     - quiz_feedback: admins can read everything (rating aggregates).
     - shared_results: the public SELECT policy was dropped in the hardening
       migration (reads go through the token RPC); admins get a direct SELECT
       policy so the dashboard can show share/virality metrics.
*/

CREATE TABLE public.quiz_feedback (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  uuid        NOT NULL,
  user_id     uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  quiz_key    text        NOT NULL CHECK (quiz_key IN ('big5', 'mbti', 'enneagram', 'cake', 'house', 'mbti_deep', 'enneagram_deep', 'big5_deep')),
  rating      smallint    NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- One rating per quiz per browser session.
CREATE UNIQUE INDEX idx_quiz_feedback_session_quiz ON public.quiz_feedback (session_id, quiz_key);
CREATE INDEX idx_quiz_feedback_quiz_created ON public.quiz_feedback (quiz_key, created_at DESC);

ALTER TABLE public.quiz_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feedback_insert_anon"
  ON public.quiz_feedback
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "feedback_insert_authenticated"
  ON public.quiz_feedback
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "feedback_admin_read"
  ON public.quiz_feedback
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Per-IP rate limit: silently drop floods (max 10 ratings/min per IP).
CREATE OR REPLACE FUNCTION public.enforce_feedback_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  client_ip text;
BEGIN
  client_ip := public.request_client_ip();
  IF client_ip IS NOT NULL THEN
    IF NOT public.check_rate_limit('feedback', client_ip, 10, 60) THEN
      RETURN NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_feedback_rate_limit
  BEFORE INSERT ON public.quiz_feedback
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_feedback_rate_limit();

-- ─── Admin metrics access ───────────────────────────────────────────────────

CREATE POLICY "shared_results_admin_read"
  ON public.shared_results
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
