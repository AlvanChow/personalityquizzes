/*
  # Harden per-IP rate limiting and direct profile writes

  Follow-ups from the codebase security review:

  1. request_client_ip() used coalesce(cf-connecting-ip, left-most x-forwarded-for).
     The x-forwarded-for left-most hop is CLIENT-supplied, so an attacker could
     rotate/spoof it to keep the per-IP rate-limit actor key unique and defeat
     the per-IP caps on share creation, analytics, feedback, and hot-take votes.
     Supabase fronts PostgREST with its own Cloudflare edge, which sets and
     overwrites cf-connecting-ip, so trust ONLY that header. When it is absent
     (e.g. a trusted service-role connection) callers already fall back to their
     per-session / global limits, exactly as before.

  2. The profiles UPDATE policy allows a user to write any column of their own
     row, so a direct PATCH could bypass upsert_quiz_result()'s validation and
     store arbitrary junk under quiz_results. Add a BEFORE INSERT/UPDATE trigger
     that keeps quiz_results well-formed (a JSON object of objects, bounded key
     count). It only re-validates when quiz_results actually changes, so an
     unrelated update (e.g. big5_scores) never trips on a pre-existing row.
*/

-- ─── 1. request_client_ip: trust only the Cloudflare-set header ──────────────

CREATE OR REPLACE FUNCTION public.request_client_ip()
RETURNS text
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
DECLARE
  headers json;
BEGIN
  headers := nullif(current_setting('request.headers', true), '')::json;
  IF headers IS NULL THEN
    RETURN NULL;
  END IF;
  -- cf-connecting-ip is set by Supabase's Cloudflare edge and cannot be forged
  -- by the client. The former x-forwarded-for left-most fallback was spoofable.
  RETURN headers ->> 'cf-connecting-ip';
EXCEPTION WHEN OTHERS THEN
  RETURN NULL;
END;
$$;

-- ─── 2. profiles: validate quiz_results shape on direct writes ───────────────

CREATE OR REPLACE FUNCTION public.validate_profile_quiz_results()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  -- Only re-check when quiz_results actually changes, so unrelated updates
  -- (big5_scores, display_name, …) never re-validate legacy rows.
  IF TG_OP = 'UPDATE' AND NEW.quiz_results IS NOT DISTINCT FROM OLD.quiz_results THEN
    RETURN NEW;
  END IF;

  IF NEW.quiz_results IS NULL THEN
    RETURN NEW;
  END IF;

  IF jsonb_typeof(NEW.quiz_results) <> 'object' THEN
    RAISE EXCEPTION 'quiz_results must be a JSON object'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF (SELECT count(*) FROM jsonb_object_keys(NEW.quiz_results)) > 100 THEN
    RAISE EXCEPTION 'quiz_results has too many entries'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  IF EXISTS (
    SELECT 1 FROM jsonb_each(NEW.quiz_results) AS e
    WHERE jsonb_typeof(e.value) <> 'object'
  ) THEN
    RAISE EXCEPTION 'each quiz_results entry must be a JSON object'
      USING ERRCODE = 'invalid_parameter_value';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profiles_validate_quiz_results ON public.profiles;
CREATE TRIGGER on_profiles_validate_quiz_results
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.validate_profile_quiz_results();
