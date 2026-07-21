# Monetization Strategy

> Status: strategy · Drafted 2026-07-21 · Companion to `Monetization plan.md`
> and `SOCIAL_ROADMAP.md`.
>
> `Monetization plan.md` is an *implementation* plan for one model (pay-per-quiz).
> This document is the *strategy* layer: which models fit which parts of the
> product, in what order, and where the existing plan needs to change.

---

## TL;DR

Your quizzes are not one product — they are three, and each wants a different
money model:

| Segment | Examples | Intent | Willingness to pay | Model |
|---|---|---|---|---|
| **Pop / character** | Naruto, One Piece, Eras, Office | Fun, shareable | ~zero | **Ads + growth** (never paywall) |
| **Serious frameworks** | Big Five, MBTI, Enneagram, DISC, RIASEC | Self-knowledge | Medium–high | **Premium reports + subscription** |
| **Social / compatibility** | Circles, compatibility, You × Friends | Emotional | **Highest** | **Subscription + per-report unlock** |

**Keep the top of funnel (pop quizzes + sharing + invites) free and
ad-supported to feed growth. Put the paywall on _depth_ and _social analytics_,
where intent is real — not on quiz #2.**

---

## The problem with the current `Monetization plan.md`

The current plan makes **the second quiz cost $9**, for every quiz including the
pop/character ones. Two issues:

1. **It fights the growth engine.** `SOCIAL_ROADMAP.md`'s entire viral loop is
   *share → friend takes the same quiz → compare*. If the invited friend hits a
   $9 wall on the quiz they were invited to, the k-factor collapses. The plan
   paywalls the exact behavior that grows the site.
2. **Wrong price for low-intent content.** No one pays $9 to learn which One
   Piece character they are. They will share it or bounce — not buy. Pop quizzes
   monetize through *volume* (ads), not per-unlock fees.

The plan's own header says "grow users first, monetize second" — but the
mechanism (gate quiz #2) does the opposite. The fix is to gate **depth and
social features**, not **quiz count**.

---

## Revenue levers, ranked for this product

### 1. Premium deep-report upsell — *build first*
Free result stays free; charge a one-time fee for the *comprehensive* version of
the serious frameworks. The content already exists (`src/data/lifeAnalysis/*`:
career, relationships, stress, communication, growth, wellness; plus the Deep
MBTI/Enneagram/Big Five quizzes). This is mostly a paywall + Stripe, not new
writing.

- **Model:** 16Personalities / Truity — free test, paid detailed report.
- **Benchmarks:** 16Personalities premium ~$29–49 one-time; Truity ~$19–39;
  Enneagram Institute ~$12.
- **Suggested price:** **$19–29 one-time** per deep report.

### 2. Compatibility / relationship reports — *highest emotional intent*
Couples and friends readily pay to compare. Keep the **invite free** (protects
virality); charge the **initiator** for the detailed side-by-side.
- **Suggested price:** **$9–12** one-time (as in the current plan).

### 3. All-Access subscription — *recurring revenue, binds the social layer*
One price unlocks every deep report + unlimited compatibility + Circle analytics
(You × Friends, circle matrix). The social roadmap is ideal subscription bait: it
creates ongoing reasons to return.
- **Suggested price:** **~$5–8/mo or ~$35–40/yr**, annual-forward (quiz
  engagement is bursty; monthly churns fast).

### 4. Ads on pop quizzes — *monetize volume you can't sell*
Character quizzes drive traffic but will never sell reports. Display/native ads
convert that volume to passive revenue.
- **Path:** Google AdSense now → Mediavine/Raptive at ~50k+ sessions/mo.
- **Reality:** entertainment-quiz RPMs are low (a few $/1k pageviews). A *scale*
  play, not a launch play. Never show ads on the paid/serious surfaces.

### 5. B2B / Teams — *highest ACV, most overlooked*
Workplaces run DISC / Big Five / MBTI for team-building — you have all three. A
"run your team" product (manager invites team → aggregate composition &
compatibility report) is Truity's most profitable line.
- **Suggested price:** **$99–499 per team.** Build after consumer proves out;
  it's the biggest ceiling.

### 6. Affiliate / lead-gen — *easy, contextual*
Result-relevant books (Amazon), courses, dating apps. Therapy referral
(BetterHelp-style) has high CPAs in this niche **but** carries real
ethical/brand-safety weight — recommending therapy off a quiz result is not
neutral. **Start with books/courses, not therapy.**

---

## The thing to do first, regardless: capture emails

There is currently **no email capture** anywhere in the product. That is the
single biggest leak. Every result page is a natural "email me my full breakdown"
moment. An email list is the asset that makes every later model work
(relaunch nudges, report upsells, subscription conversion). Cheapest,
highest-leverage item on this list — do it before any paywall.

---

## Sequenced rollout

| Phase | Ship | Why now |
|---|---|---|
| **0 — Now** | Email capture on result pages | Stops the biggest leak; enables everything downstream |
| **1 — Pre-scale** | One premium deep-report unlock (Stripe Payment Link, no backend rewrite). **No quiz-taking gate.** | Prove people pay for depth |
| **2 — Early traction** | Compatibility unlock + AdSense on pop quizzes | Add emotional-intent revenue + passive ad income |
| **3 — Return-user base** | All-Access subscription bundling Circle/social analytics | Recurring revenue once retention exists |
| **4 — Proven** | B2B Teams | Highest ACV; needs the consumer engine as proof |

Note: Phase 1 reuses most of the current plan's Stripe/`purchases` infrastructure
(`Monetization plan.md` Phases 1–2 & 5) — the change is **what** gets gated
(depth, not quiz #2) and adding email capture ahead of it.

---

## What stays free forever (protect the funnel)

- All pop/character quizzes, start to finish.
- The first-pass result and score for every framework.
- Sharing, share links, story cards, and **compatibility invites** (the growth
  loop must never hit a wall).

## What is paid

- Deep/comprehensive reports on the serious frameworks.
- The detailed compatibility report (initiator pays; invite is free).
- Circle / group analytics.
- Team reports (B2B).

---

## Pricing benchmarks referenced

Figures are category benchmarks for orientation, not guarantees; validate with
your own funnel once live.

- **16Personalities** — free test; premium reports ~$29–49 one-time.
- **Truity** — free tests; detailed reports ~$19–39; TypeFinder for Business
  (team/per-seat).
- **Enneagram Institute (RHETI)** — paid test/report ~$12.
- **Ad networks** — AdSense (open) → Mediavine/Raptive (~50k+ sessions/mo);
  entertainment RPMs low single digits per 1k pageviews.
