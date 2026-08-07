/*
  # Actually scope delete_my_account() to signed-in users

  `20260807000001_add_account_deletion.sql` intends this — it says the function
  is "callable only by a signed-in user" and does:

      REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC;
      GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;

  That is not sufficient on Supabase. The project carries a default privilege
  (`ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT EXECUTE ON FUNCTIONS TO
  anon, authenticated, service_role`), so `anon` receives its own explicit
  EXECUTE grant at CREATE time. Revoking from PUBLIC does not remove an
  explicit per-role grant, so after applying that migration the ACL read:

      {postgres=X/postgres,anon=X/postgres,authenticated=X/postgres,service_role=X/postgres}

  This was verified against production, not inferred.

  No account was ever exposed: the function's first act is to read `auth.uid()`
  and `RAISE EXCEPTION 'Not authenticated'` when it is NULL, which is always the
  case for anon. So this is defence in depth that silently did not take effect,
  not a hole that was open. Fixing it means an unauthenticated caller is stopped
  by the grant instead of by a runtime check.
*/

REVOKE EXECUTE ON FUNCTION public.delete_my_account() FROM anon;
