# Monetization Plan

## Strategy
Grow users first. Monetize second. This plan is ready to implement when the codebase has traction.

---

## Core Rule
**The first quiz any user takes is free — whichever quiz that is.**
Every quiz after the first requires payment or a bundle purchase.

This applies to all 7 quizzes:
- Big Five baseline (`/assessment`)
- MBTI (`/quiz/mbti`)
- Enneagram (`/quiz/enneagram`)
- CAKE (`/quiz/cake`)
- Big Five Deep (`/quiz/big5-deep`)
- MBTI Deep (`/quiz/mbti-deep`)
- Enneagram Deep (`/quiz/enneagram-deep`)

---

## Pricing

| Product | Price |
|---|---|
| Single quiz unlock | $9 |
| Compatibility report (any quiz) | $12 |
| Bundle — all quizzes + unlimited compatibility | $29 |

---

## Tracking "First Quiz Used"

**Authenticated users:**
- Add `first_quiz_completed` boolean to `profiles` table (default `false`)
- Set to `true` on completion of their first quiz, regardless of which one
- Check this flag on every quiz gate

**Anonymous users:**
- Track via localStorage key `personalens_first_quiz_used` (boolean)
- If user later signs in, sync flag to their profile (similar to existing `syncGuestQuizResults`)

**Gate logic:**
```
canTakeQuiz(quizKey) →
  if user has not completed any quiz yet → allow (free)
  if user owns `bundle` → allow
  if user owns `quizKey` purchase → allow
  else → show PaywallModal
```

---

## What Stays Free Forever
- Whichever quiz the user takes first
- All quiz results and scores from that first quiz
- The Big Five life analysis on the dashboard (Career, Relationships, Stress, etc.)
- Shareable result links
- The dashboard itself

---

## Implementation Phases

### Phase 1 — Database + Stripe Setup
1. New Supabase migration:
   - Add `first_quiz_completed boolean DEFAULT false` to `profiles` table
   - New `purchases` table: `user_id, product_key, stripe_session_id, created_at`
     - `product_key` values: `mbti`, `enneagram`, `cake`, `big5-deep`, `mbti-deep`, `enneagram-deep`, `bundle`, `compatibility`
   - New `compatibility_reports` table: `id, user_id, quiz_type, invite_token, results_a, results_b, created_at`
   - RLS policies for both tables
2. Create Stripe products + Payment Links for each product
3. Supabase Edge Function: Stripe webhook handler that writes to `purchases` on `checkout.session.completed`

### Phase 2 — Purchase Hook + Access Logic
4. `usePurchases()` hook:
   - Reads user's rows from `purchases` table
   - Exposes `hasAccess(productKey)` — returns `true` if they own the item or own `bundle`
   - Exposes `hasUsedFreeQuiz()` — checks `first_quiz_completed` on profile (or localStorage for anon)
5. Update quiz completion handlers (all 7 quizzes) to set `first_quiz_completed = true` on first completion

### Phase 3 — Quiz Paywall
6. `PaywallModal` component:
   - Triggered when user navigates to a paid quiz without access
   - Shows what they're unlocking
   - Two CTAs: "Unlock This Quiz — $9" and "Get Everything — $29"
   - Prompts login if user is not signed in (required to track purchases)
7. Gate all 7 quiz routes — check `hasAccess(quizKey)` on mount, show `PaywallModal` if blocked

### Phase 4 — Compatibility Report
8. New `/quiz/compatibility` page:
   - User selects a quiz type
   - Generates a shareable invite link (token stored in `compatibility_reports`)
   - Friend opens link, takes the same quiz
   - Side-by-side comparison view generated on completion
9. Gate: requires `hasAccess('compatibility')` or `hasAccess('bundle')`

### Phase 5 — Bundle + Checkout Flow
10. Checkout redirect: clicking any "Buy" CTA redirects to Stripe Payment Link with `?client_reference_id={userId}` for webhook attribution
11. Success handling: after Stripe redirects back, poll `purchases` briefly, then unlock and route user into the quiz they tried to take
12. Bundle CTA on Dashboard: "Unlock Everything — $29" card showing what's included

---

## Files to Create / Modify

| File | Change |
|---|---|
| `supabase/migrations/` | New migration: `purchases`, `compatibility_reports` tables, `first_quiz_completed` column, RLS |
| `supabase/functions/stripe-webhook/` | New Edge Function for Stripe webhook |
| `src/hooks/usePurchases.js` | New hook |
| `src/components/PaywallModal.jsx` | New component |
| `src/pages/Compatibility.jsx` | New page |
| `src/pages/Dashboard.jsx` | Add bundle CTA, lock icons on quiz cards |
| `src/App.jsx` | Add `/quiz/compatibility` route |
| `src/pages/Assessment.jsx` | Add gate check + set `first_quiz_completed` on finish |
| `src/pages/CakeQuiz.jsx` | Add gate check + set `first_quiz_completed` on finish |
| `src/pages/MBTIQuiz.jsx` | Add gate check + set `first_quiz_completed` on finish |
| `src/pages/EnneagramQuiz.jsx` | Add gate check + set `first_quiz_completed` on finish |
| `src/pages/BigFiveDeepQuiz.jsx` | Add gate check + set `first_quiz_completed` on finish |
| `src/pages/MBTIDeepQuiz.jsx` | Add gate check + set `first_quiz_completed` on finish |
| `src/pages/EnneagramDeepQuiz.jsx` | Add gate check + set `first_quiz_completed` on finish |

---

## Open Questions (decide before implementing)
- Should anonymous users be able to take a second quiz before being forced to create an account + pay? Suggested: no — prompt login at the paywall.
- Should the compatibility report count as a "quiz" for the free-first-quiz rule? Suggested: no — it's a separate product.
- Stripe Payment Links vs. custom checkout session? Suggested: Payment Links first (simpler, no server), upgrade later if needed.
