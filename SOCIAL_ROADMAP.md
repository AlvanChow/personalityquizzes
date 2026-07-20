# Social Roadmap — making the site revolve around people, not quizzes

> Status: proposed · Owner: Alvan · Drafted 2026-07-20 after launch night.
> The thesis: a personality result is only half-interesting alone. The product
> should be built around **comparing, sharing, and finding your people** —
> every result a social object, every visit a reason to pull someone else in.

---

## 0. Where we are today (already shipped)

| Capability | State |
| --- | --- |
| Share links (`/s/:id`) with result snapshot | ✅ live |
| 1-tap Instagram story cards (result + match) | ✅ live |
| Friend compatibility on share pages (MBTI/Enneagram/Cake/House) | ✅ live |
| Viral return loop (take quiz → back to comparison) | ✅ live |
| Community votes on Hot Takes | ✅ live |
| Accuracy ratings (quiz weighting signal) | ✅ live |

What's missing: **persistence** (comparisons vanish after the session), a
**social graph** (no friend list), **group analytics** (only 1:1), and
**discovery** (no way to find compatible strangers). That's the roadmap.

---

## 1. Product pillars

### Pillar A — Crews (persistent friend connections)

The one-off share link becomes a lasting connection.

- **Capture at the moment of magic**: right after the compatibility reveal on
  `/s/:id`, offer "Keep this match — add {name} to your crew." Both sides sign
  in with Google (guests keep today's solo experience; identity is required
  the moment data flows between two people).
- **Crew page** (`/crew`): every connection, their latest *shared* results per
  framework, per-friend compatibility scores, and a "compare" deep-link.
- **Asymmetric consent**: a connection is `pending` until the other side
  accepts. Nothing about either person is visible before acceptance.

### Pillar B — Shared analytics ("You × Friends")

Once connected, the data gets genuinely fun:

- **1:1 deep compare** (`/compare/:connectionId`): Big-5 radar overlay, trait
  deltas ("You're 34 points more extraverted"), MBTI letter-by-letter,
  Enneagram dynamics, house pairing, **Hot Takes agreement score** ("you agree
  on 6/8 great debates") — we already store the votes.
- **What you have in common / where you differ**: computed commonalities
  surfaced as shareable one-liners ("Both INTJ. Both Ravenclaw. Both think a
  hotdog is a sandwich.").
- **Crew matrix**: the whole-group view — type grid of your crew, "the crew's
  average Big 5," "you're the only introvert," compatibility heat-map.
- **Crew story card**: one tap renders the group's types as a story image —
  the same canvas pipeline as today's cards. This is the strongest viral
  artifact we can build.
- **Per-framework visibility controls**: `share_settings` on the profile —
  each result is `private | crew | public` (default: crew after acceptance,
  Big-5 numbers default private with an explicit opt-in).

### Pillar C — Discovery (opt-in "find people like me")

- **A single toggle**: "Make me discoverable" — **default OFF**, one switch in
  Profile, revocable instantly.
- **Match surfaces**: same MBTI type · adjacent Enneagram (wing/line) ·
  Big-5 similarity (vector distance) · same house · Hot Takes overlap.
  Blended into one "People like you" feed with a similarity label, not a
  creepy percentage.
- **Pseudonymous by default**: discovery shows a chosen alias + emoji avatar,
  never email or real name; connecting reveals only what share_settings allow.
- **No free-text chat in v1.** Interaction = a "wave" (emoji-only). Chat is
  the single biggest moderation liability; defer until there's a reason.
- **Safety rails**: block list, report button, k-anonymity floor (no matches
  shown unless the candidate pool ≥ 25), server-side rate limits on waves and
  connection requests, alias profanity filter, all reads through
  SECURITY-DEFINER RPCs (no browsable people table).

### Pillar D — Social-first surfaces (reorient what exists)

- **Result pages**: move the share/compare module directly under the hero —
  the first action after "you are X" is "see who matches you."
- **Homepage**: real social proof only (live counts via k-anonymous
  aggregates): "1,204 comparisons this week," "You'd be with the 4% club."
- **Community stats on every result**: "23% of takers got INTJ too" — one
  aggregate RPC, cached.
- **Crew unlock nudge**: "Invite 2 friends to unlock your Crew Report."

---

## 2. Data model & security (the part that must not be improvised)

New tables (all RLS-on, reads only through RPCs):

```
connections   (id, requester uuid, addressee uuid, status pending|accepted,
               created_at, accepted_at)                    -- unique pair
blocks        (user_id, blocked_id, created_at)
waves         (id, from_user, to_user, emoji, created_at)  -- rate-limited
reports       (id, reporter, subject, reason, created_at)  -- admin-only read
profiles +    (alias text ≤24 chars, discoverable bool DEFAULT false,
               share_settings jsonb, match_keys jsonb)     -- match_keys kept
                                                           -- fresh by trigger
```

RPC surface (SECURITY DEFINER, pinned search_path, per-user rate limits — the
same pattern as tonight's hardening):

- `request_connection(share_id)` / `respond_connection(id, accept)`
- `list_crew()` → connections + only share-approved result fields
- `get_comparison(connection_id)` → both sides' approved results
- `find_similar()` → capped, randomized, k-anonymous candidate list keyed by
  opaque discovery ids (never raw user ids)
- `wave(discovery_id, emoji)` / `block_user(...)` / `report_user(...)`
- `result_distribution(quiz_key)` → community percentages (k ≥ 25)

Hard rules carried over from the launch audit:

1. No blanket SELECT policies on any people-visible table — RPC or nothing.
2. Everything is opt-in; deleting a connection/toggle revokes access
   immediately (checks are at read time, not copy time).
3. Blocks enforced inside every RPC, both directions.
4. Admin dashboard gets a reports queue + discovery-pool health.
5. New analytics events (connection_requested, crew_viewed, wave_sent, …) go
   into the DB allowlist migration *with* the client change, in one PR.

Open privacy question to settle before Pillar C ships: audience age — there's
no age gate today. Discovery between strangers may warrant a 16+/18+ self-attestation
checkbox at toggle-on. Decide before building.

---

## 3. Phasing (each phase ships alone and is useful alone)

| Phase | Scope | Effort* | Depends on |
| --- | --- | --- | --- |
| **1 — Crews MVP** | connections table + accept flow from share pages, `/crew` page with per-friend compatibility (reuses the existing engine) | 1 evening | — |
| **2 — You × Friends** | 1:1 deep-compare page (radar overlay, deltas, Hot-Takes agreement), share_settings, compare story card | 1–2 evenings | 1 |
| **3 — Crew matrix** | group view + crew story card + "only introvert" insights | 1 evening | 2 |
| **4 — Discovery** | discoverable toggle, find_similar RPC, waves, block/report, k-anonymity, admin reports queue | 2 evenings | 1 (not 2/3) |
| **5 — Social surfaces** | homepage social proof, community % on results, crew-unlock nudges | ½ evening | any |
| **6 — Retention** | weekly "debate of the week," crew digest (needs email decision) | later | 4 |

\* "Evening" = one focused session like tonight, including tests, migration,
deploy, and live verification.

Recommended order: **1 → 2 → 5 → 3 → 4 → 6.** Discovery (4) is the most
sensitive and benefits from real crew usage data first.

## 4. Success metrics (all measurable with existing analytics)

- % of shares that convert to a completed comparison (today's funnel)
- % of comparisons that convert to a connection request (new)
- K-factor: invites sent per new user; crew size distribution
- % of users with discoverable ON; waves → connections conversion
- Retention: D7 return rate of users with ≥1 connection vs 0

## 5. Decisions needed from Alvan before building

1. **Sign-in wall for social**: OK that both sides must Google-sign-in?
2. **No chat in v1** (emoji waves only) — confirm.
3. **Age attestation** at discovery toggle-on — 16+? 18+? none?
4. **Aliases**: discovery is alias-only by default — confirm.
5. Which phase to build first (recommendation: Phase 1 next session).
