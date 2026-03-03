/*
  # Harden function-level permissions

  Two security improvements:

  1. upsert_quiz_result — revoke default PUBLIC EXECUTE grant
     PostgreSQL grants EXECUTE to PUBLIC when a function is created, meaning the
     anon role could call this function. The function's own auth.uid() check would
     reject the call, but the function should not be reachable by unauthenticated
     callers at all. Revoking from PUBLIC and keeping only the explicit grant to
     the authenticated role closes that gap.

  2. handle_new_user — fix SECURITY DEFINER without fixed search_path
     SECURITY DEFINER functions run with the privileges of the function owner. If
     search_path is not fixed, an attacker who can create objects in a schema that
     appears earlier in the search path could redirect unqualified name lookups.
     Setting search_path = '' forces every reference to be fully qualified, which
     the function body already does (public.profiles).
*/

-- ─── 1. upsert_quiz_result: restrict EXECUTE to authenticated role only ───────

REVOKE EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.upsert_quiz_result(uuid, text, jsonb) TO authenticated;

-- ─── 2. handle_new_user: pin search_path on the SECURITY DEFINER function ─────

ALTER FUNCTION public.handle_new_user() SET search_path = '';
