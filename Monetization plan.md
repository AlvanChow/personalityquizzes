# Monetization Plan — RETIRED

> Decision (2026-07): **the product is free.** There is no paywall, and the
> pay-per-quiz plan that used to live in this file has been retired. Quizzes,
> deep reports, compatibility, sharing, and Circles are all free to use.

## What replaces it

Instead of charging or collecting standalone newsletter addresses, result pages
invite visitors to sign in with Google. Supabase Auth retains the verified
account email and the authenticated profile keeps quiz results available across
devices. The product does not promise to email a copy of a result.

**Shipped:**

| Piece | Where |
|---|---|
| Google OAuth + authenticated result sync | `src/contexts/AuthContext.jsx`, `src/contexts/BigFiveContext.jsx` |
| Sign-in result-saving prompt | `src/components/AuthNudgeBanner.jsx` |
| Admin-only account-email view | `supabase/migrations/20260722000002_admin_auth_accounts.sql` |
| Placement on result surfaces | MBTI / Enneagram / Catalog / Vector results + Dashboard |

## If monetization is ever revisited

The full menu of options — premium reports, compatibility unlocks,
subscription, ads, B2B teams — and why each fits (or doesn't) is preserved in
`MONETIZATION_STRATEGY.md` as **optional future levers**. Nothing there is
active; the current direction is free + signed-in accounts.
