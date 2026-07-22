/*
  # Email subscribers (free-product growth: opt-in email capture)

  The product is free — there is no paywall. In place of one, result pages
  invite visitors to join an email list (new quizzes + a copy of their
  results). This table stores those opt-ins.

  Mirrors the quiz_feedback pattern:
    Writes: anon (user_id must be NULL) and authenticated (own user_id or NULL),
    rate-limited per client IP. Reads: admins only (export lives behind the
    admin dashboard). No public SELECT.

  Notes
  - Email is normalized (trim + lowercase) in the BEFORE INSERT trigger so the
    case-insensitive unique index dedupes reliably regardless of client input.
  - A duplicate email raises a unique violation (SQLSTATE 23505); the client
    treats that as success ("already on the list").
  - A signed-in user's auth email is NOT marketing consent, so the opt-in is
    shown to everyone and recorded here explicitly.
*/

CREATE TABLE public.email_subscribers (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email       text        NOT NULL,
  source      text,
  session_id  uuid,
  user_id     uuid        REFERENCES auth.users (id) ON DELETE SET NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT email_subscribers_email_format
    CHECK (email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
           AND char_length(email) <= 254),
  CONSTRAINT email_subscribers_source_len
    CHECK (source IS NULL OR char_length(source) <= 64)
);

-- Case-insensitive dedupe: one row per address.
CREATE UNIQUE INDEX idx_email_subscribers_email_lower
  ON public.email_subscribers (lower(email));
CREATE INDEX idx_email_subscribers_created
  ON public.email_subscribers (created_at DESC);

ALTER TABLE public.email_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_subscribers_insert_anon"
  ON public.email_subscribers
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "email_subscribers_insert_authenticated"
  ON public.email_subscribers
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());

CREATE POLICY "email_subscribers_admin_read"
  ON public.email_subscribers
  FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Normalize the address and enforce a per-IP rate limit: silently drop floods
-- (max 5 signups/min per IP). Reuses the shared rate-limit + client-IP helpers.
CREATE OR REPLACE FUNCTION public.enforce_email_signup_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  client_ip text;
BEGIN
  NEW.email := lower(btrim(NEW.email));

  client_ip := public.request_client_ip();
  IF client_ip IS NOT NULL THEN
    IF NOT public.check_rate_limit('email_signup', client_ip, 5, 60) THEN
      RETURN NULL;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_email_signup_rate_limit
  BEFORE INSERT ON public.email_subscribers
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_email_signup_rate_limit();
