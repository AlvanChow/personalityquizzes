# Monetization Plan — RETIRED

> Decision (2026-07): **the product is free.** There is no paywall, and the
> pay-per-quiz plan that used to live in this file has been retired. Quizzes,
> deep reports, compatibility, sharing, and Circles are all free to use.

## What replaces it

Instead of charging, the site grows an **opt-in email list** — the highest-
leverage asset for a free product. Result pages invite visitors to leave their
email for new quizzes and a copy of their results.

**Shipped:**

| Piece | Where |
|---|---|
| `email_subscribers` table (anon/auth insert, admin-only read, per-IP rate limit) | `supabase/migrations/20260721000002_add_email_subscribers.sql` |
| `EmailCaptureCard` opt-in component (self-suppresses after subscribe/dismiss) | `src/components/EmailCaptureCard.jsx` |
| `isValidEmail` helper | `src/utils/security.js` |
| `email_captured` / `email_capture_dismissed` analytics | `src/utils/analytics.js` |
| Placement on result surfaces | MBTI / Enneagram / Catalog / Vector results + Dashboard |

## If monetization is ever revisited

The full menu of options — premium reports, compatibility unlocks,
subscription, ads, B2B teams — and why each fits (or doesn't) is preserved in
`MONETIZATION_STRATEGY.md` as **optional future levers**. Nothing there is
active; the current direction is free + email list.
