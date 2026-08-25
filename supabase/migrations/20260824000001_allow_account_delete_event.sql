/*
  # Allow the account_delete_requested analytics event

  `AuthContext.deleteAccount()` has emitted `account_delete_requested` since the
  Delete Account button shipped, but the name was never added to either
  allowlist — the client-side one in `src/utils/analytics.js` or the CHECK
  constraint below. `track()` dropped it before it ever reached the database, so
  the one flow App Store reviewers exercise by hand produced no telemetry at all.

  The client allowlist is fixed in the same change. This adds the DB half, which
  is the one that actually enforces it.

  Restated in full rather than patched because a CHECK constraint has no
  incremental form — this is the same list as
  20260720000006_rename_crews_to_circles.sql plus the one new name. NOT VALID
  for the same reason it was there: existing rows are already known-good and
  skipping the full-table scan keeps this cheap on a live table.
*/

ALTER TABLE public.analytics_events
  DROP CONSTRAINT IF EXISTS analytics_events_event_allowlist;
ALTER TABLE public.analytics_events
  ADD CONSTRAINT analytics_events_event_allowlist
  CHECK (event IN (
    'page_view', 'baseline_completed', 'baseline_reset', 'quiz_started',
    'quiz_completed', 'quiz_card_clicked', 'quiz_result_viewed', 'quiz_retaken',
    'hero_cta_clicked', 'auth_sign_in_started', 'auth_sign_in_completed',
    'auth_sign_out', 'auth_nudge_clicked', 'share_link_created',
    'share_button_clicked', 'shared_result_viewed', 'compat_viewed',
    'compare_quiz_started', 'quiz_feedback_given', 'hot_take_voted',
    'crew_request_sent', 'crew_request_accepted', 'crew_request_declined',
    'crew_viewed', 'crew_member_removed',
    'circle_request_sent', 'circle_request_accepted', 'circle_request_declined',
    'circle_viewed', 'circle_member_removed',
    'account_delete_requested'
  )) NOT VALID;
