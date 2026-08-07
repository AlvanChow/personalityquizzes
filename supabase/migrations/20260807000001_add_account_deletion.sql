/*
  # Self-service account deletion

  App Store Review Guideline 5.1.1(v) requires any app that lets a user create
  an account to let them delete it from inside the app. There was no such path:
  a user could sign out, but the profile, share links, and Circle connections
  stayed. The iOS shell in `ios-app/` cannot ship without this.

  ## Why one argument-less function rather than client-side DELETEs

  The row that actually matters lives in `auth.users`, which no client role can
  touch — RLS on `public.*` is irrelevant there. Deleting it is also what makes
  the deletion *complete*, because almost every user-owned table already hangs
  off it with ON DELETE CASCADE or ON DELETE SET NULL.

  So the shape is: one SECURITY DEFINER function, hard-scoped to auth.uid(),
  that clears what the cascade would not, then drops the auth row and lets the
  database do the rest. A client-side sweep could not do the last step, and any
  function taking a user id as an argument would be an account-deletion oracle
  for every other user — hence no parameters at all.

  ## What is deleted, what is anonymised, what is kept

  Deleted outright:
    - auth.users (cascades to profiles, connections, admins)
    - email_subscribers rows for this user AND for their address. The FK is
      ON DELETE SET NULL, which would otherwise keep the email address
      forever — unlinked but perfectly intact.
    - shared_results rows they own. That FK is ON DELETE SET NULL too, which
      would leave a public share link serving the deleted user's result.

  Anonymised by the existing cascade (ON DELETE SET NULL), so no work here:
    - analytics_events.user_id, quiz_feedback.user_id

  Deliberately kept:
    - security_events. `actor` is a bare uuid with no foreign key, so it
      survives this deletion by design: an audit log that a user can erase by
      deleting their account is not an audit log. Once auth.users is gone the
      uuid resolves to nothing.

  Guest rows keyed by an anonymous session_id (debate_votes) are not reachable
  from a user id at all and are unaffected, by construction.
*/

CREATE OR REPLACE FUNCTION public.delete_my_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
  v_uid   uuid := auth.uid();
  v_email text;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT email INTO v_email FROM auth.users WHERE id = v_uid;

  -- log_security_event() reads the actor from auth.uid() itself, so this must
  -- run while the auth row still exists for the id to mean anything.
  PERFORM public.log_security_event(
    'account_deleted',
    jsonb_build_object('source', 'delete_my_account')
  );

  IF v_email IS NOT NULL THEN
    DELETE FROM public.email_subscribers WHERE lower(email) = lower(v_email);
  END IF;

  DELETE FROM public.email_subscribers WHERE user_id = v_uid;
  DELETE FROM public.shared_results     WHERE owner_id = v_uid;

  -- Everything else follows from this one statement.
  DELETE FROM auth.users WHERE id = v_uid;
END;
$$;

COMMENT ON FUNCTION public.delete_my_account() IS
  'Permanently deletes the calling user''s account and personal data. Scoped to auth.uid(); takes no arguments so it can never act on another user.';

-- Callable only by a signed-in user. anon has no account to delete, and
-- REVOKE FROM PUBLIC stops the default EXECUTE grant from widening this.
REVOKE ALL ON FUNCTION public.delete_my_account() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_my_account() TO authenticated;
