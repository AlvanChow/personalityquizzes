/*
  # Add analytics_events table

  Stores internal analytics events — page views, quiz lifecycle, auth events,
  and key CTA interactions. All writes come from the browser client (anon or
  authenticated). No SELECT access is granted through the anon key; reads are
  performed server-side via the service_role key.

  Session duration and drop-off rates are derived in queries from the raw
  event timestamps (MAX - MIN grouped by session_id) rather than stored
  explicitly as separate rows.
*/

CREATE TABLE public.analytics_events (
  id          bigint      GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id  uuid        NOT NULL,
  user_id     uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  event       text        NOT NULL,
  properties  jsonb       NOT NULL DEFAULT '{}',
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- session_id  → aggregate session-level metrics (duration, funnel)
-- user_id     → per-user event history
-- event       → filter by event type in dashboards
-- created_at  → time-range queries (DESC for recency-first access patterns)
CREATE INDEX idx_analytics_events_session_id ON public.analytics_events (session_id);
CREATE INDEX idx_analytics_events_user_id    ON public.analytics_events (user_id);
CREATE INDEX idx_analytics_events_event      ON public.analytics_events (event);
CREATE INDEX idx_analytics_events_created_at ON public.analytics_events (created_at DESC);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Any client (anon or authenticated) may INSERT events.
-- Nobody reads through the anon/authenticated key — only service_role.
CREATE POLICY "analytics_insert_anon"
  ON public.analytics_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "analytics_insert_authenticated"
  ON public.analytics_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
