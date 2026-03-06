/*
  # Add admin dashboard support

  Creates the `admins` table and grants admin users read access to
  `analytics_events` and `profiles`. Safe to run even if prior migrations
  haven't been applied — uses CREATE TABLE IF NOT EXISTS and guards each
  policy creation with an existence check.

  To grant admin access to a user after running this migration:
    INSERT INTO public.admins (user_id) VALUES ('<your-user-uuid>');
*/

-- ─── analytics_events (create if not yet applied) ────────────────────────────

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  uuid        NOT NULL,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  event       text        NOT NULL,
  properties  jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON public.analytics_events (session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id    ON public.analytics_events (user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event      ON public.analytics_events (event);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON public.analytics_events (created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "analytics_insert_anon"
    ON public.analytics_events FOR INSERT TO anon WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "analytics_insert_authenticated"
    ON public.analytics_events FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── admins table ─────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.admins (
  user_id    uuid        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Users can read own admin row"
    ON public.admins FOR SELECT TO authenticated USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── analytics_events admin read ──────────────────────────────────────────────

DO $$ BEGIN
  CREATE POLICY "Admins can read all analytics events"
    ON public.analytics_events FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── profiles admin read ──────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE POLICY "Admins can read all profiles"
    ON public.profiles FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
