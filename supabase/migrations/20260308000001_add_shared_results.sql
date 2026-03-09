/*
  # Add shared_results table

  Stores public snapshots of quiz results so users can share a permanent link
  to their result. Anyone can read or create a row — no authentication required
  because the sharing is intentional and the data is non-sensitive.

  The view_count column is incremented server-side via the
  increment_shared_result_views() RPC so we can measure viral reach.
*/

CREATE TABLE public.shared_results (
  id           text        PRIMARY KEY,                -- 8-char random token
  quiz_type    text        NOT NULL CHECK (quiz_type IN ('mbti','enneagram','cake','big5')),
  result_key   text        NOT NULL,                   -- e.g. "INTJ", "type4", "AO"
  result_name  text        NOT NULL,                   -- display name shown on share page
  result_emoji text        NOT NULL,
  result_data  jsonb       NOT NULL,                   -- full result snapshot
  view_count   integer     NOT NULL DEFAULT 0,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Index for the common lookup: fetch one row by its share token
CREATE INDEX idx_shared_results_created_at ON public.shared_results (created_at DESC);

ALTER TABLE public.shared_results ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) can read a shared result by its token
CREATE POLICY "anyone can read shared results"
  ON public.shared_results
  FOR SELECT
  USING (true);

-- Anyone can create a shared result (with data-size guards in the check)
CREATE POLICY "anyone can create shared results"
  ON public.shared_results
  FOR INSERT
  WITH CHECK (
    length(id) = 8
    AND quiz_type IN ('mbti', 'enneagram', 'cake', 'big5')
    AND length(result_key) <= 20
    AND length(result_name) <= 100
    AND octet_length(result_data::text) <= 4096
  );

-- RPC to increment view count without exposing an UPDATE policy to the public
CREATE OR REPLACE FUNCTION public.increment_shared_result_views(p_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE shared_results SET view_count = view_count + 1 WHERE id = p_id;
$$;

GRANT EXECUTE ON FUNCTION public.increment_shared_result_views(text) TO anon, authenticated;
