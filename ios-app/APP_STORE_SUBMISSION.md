# App Store Connect — filled-in answers

Everything on this page is text to paste into a form in App Store Connect. It
exists because the forms are where a submission quietly goes wrong: the answers
have to agree with `ios/App/App/PrivacyInfo.xcprivacy`, with the privacy policy,
and with what the app actually does, and reconstructing that from memory at
submission time is how they drift.

Steps that need the Apple Developer portal or the Supabase dashboard are in
[`README.md`](./README.md) — they cannot be prepared in advance.

---

## App information

| Field | Value |
|---|---|
| Bundle ID | `com.mypersonalityquizzes.app` |
| Primary language | English (U.S.) |
| Category | Primary: **Lifestyle**. Secondary: **Entertainment** |
| Age rating | **4+** — no objectionable content; quiz copy is pre-authored, not user-generated |
| Privacy policy URL | `https://mypersonalityquizzes.com/privacy` |
| Support URL | `https://mypersonalityquizzes.com/support` |
| Marketing URL | `https://mypersonalityquizzes.com` (optional) |
| Copyright | `2026 My Personality Quizzes` |
| Export compliance | Already answered in `Info.plist` (`ITSAppUsesNonExemptEncryption = false`) — uploads will not stop for it |

Age rating questionnaire: answer **None** to every content question. There is no
gambling, no contests, no unrestricted web access (the web view loads bundled
content, not arbitrary URLs), and no user-generated content — Circle connects
accounts but has no free-text field anyone else can see.

---

## App Privacy questionnaire

Must match `ios/App/App/PrivacyInfo.xcprivacy`. Apple aggregates the manifest
into a privacy report, but **this questionnaire is what is authoritative**, so
if you change one, change the other.

Answer **No** to "Do you or your third-party partners use data for tracking?" —
there is no ad network, no cross-app measurement, and no third-party analytics
SDK. Analytics are first-party rows in our own Supabase project.

Four data types, all **linked to the user's identity**, none used for tracking:

| Data type | Category | Purpose | Why it is collected |
|---|---|---|---|
| Email address | Contact Info | App Functionality | Comes from the OAuth provider at sign-in; identifies the account |
| Name | Contact Info | App Functionality | Comes from the OAuth provider; shown on the profile and to Circle connections |
| Other Data | Other Data | App Functionality | Quiz answers and results, so the dashboard, comparisons, and share links work |
| Product Interaction | Usage Data | Analytics | The event allowlist in `../src/utils/analytics.js` — page views, quiz funnel, share and Circle actions |

Not collected, and do not tick: location, contacts, health, financial info,
identifiers used for advertising, browsing history, search history, purchases,
sensitive info, diagnostics.

---

## App Review Information

### Sign-in

Tick **Sign-in required**. There is no username/password to hand over — sign-in
is OAuth-only — so put this in the notes rather than leaving the demo account
fields to be guessed at:

> Sign-in is via Sign in with Apple or Google. No demo credentials are needed —
> please use any Apple ID or Google account; a new account is created
> automatically on first sign-in.
>
> Signing in is not required to evaluate the app: every quiz can be taken, and
> every result viewed, as a guest. Signing in adds saved history, comparing
> results with friends, and sharing.

### Account deletion (Guideline 5.1.1(v))

Reviewers check this directly, and `/profile` redirects to the home page when
signed out — so it is invisible until they sign in. Spell out the path:

> **Account deletion is available in the app.** After signing in: tap the
> account menu in the top-right → **Profile** → scroll to **Delete Account** →
> type DELETE to confirm.
>
> This calls a `delete_my_account` database function that permanently removes
> the account, profile, saved results, Circle connections, and share links. It
> is also documented at https://mypersonalityquizzes.com/support

### Minimum functionality (Guideline 4.2)

The likeliest rejection for an app of this shape, so pre-empt it rather than
waiting to appeal. Keep it specific — a generic "it is a real app" does not
help:

> This app is not a web page wrapper. The full quiz catalogue is compiled into
> the binary and runs offline — please try it in Airplane Mode. It also uses:
>
> - Sign in with Apple and Google through SFSafariViewController, with the
>   session returned to the app over a custom URL scheme
> - the native iOS share sheet for sharing results
> - haptic feedback on every quiz answer
> - Universal Links, so a shared result link opens directly in the app
> - full-bleed edge-to-edge layout with native safe-area handling and a
>   native launch screen
>
> Account data syncs with the website so a person can move between the two, but
> the app is independently usable.

If it is rejected under 4.2 anyway, the fastest credible answer is push
notifications (`@capacitor/push-notifications`) — a genuine reason to have the
app rather than the site. Budget for the possibility.

---

## Screenshots

The app is universal (`TARGETED_DEVICE_FAMILY = "1,2"`), so App Store Connect
asks for a 13" iPad set as well as the iPhone set. Capture on the **largest
simulator of each family** — App Store Connect reuses those for smaller
devices. Confirm the exact required sizes in the media manager, since Apple
moves them. The 1.0 sets live in `../mpq-screenshots/` (untracked).

Capture with a signed-in account that has real results; empty states sell
nothing. Six frames, in this order:

1. **Landing** — the hero, above the fold
2. **A quiz mid-question** — shows the progress bar and answer buttons
3. **A result page** — the payoff screen, scrolled to the type and its summary
4. **Dashboard** — several completed quizzes, so it looks lived-in
5. **Circle** — comparing with a friend
6. **The share sheet open** over a result — this one is doing double duty as
   4.2 evidence

Simulator screenshots: `⌘S` in Simulator saves to the Desktop at the exact
pixel size Apple wants. Hide the debug overlays first.

---

## Version and build numbers

`MARKETING_VERSION = 1.0` and `CURRENT_PROJECT_VERSION = 1` are set for the
first submission. **Every subsequent upload needs `CURRENT_PROJECT_VERSION`
bumped** even if nothing else changed — App Store Connect rejects a duplicate
build number, and it is the single most common upload failure after the first
one.

---

## Before you hit Submit

- [ ] The three account-level steps in [`README.md`](./README.md) are done
- [ ] Both `20260807*` migrations applied to production Supabase
- [ ] Apple sign-in tested **on the website** first (same code path)
- [ ] `curl -i https://mypersonalityquizzes.com/.well-known/apple-app-site-association`
      returns 200 `application/json` with no redirect
- [ ] Delete Account exercised end to end on a throwaway account
- [ ] Quiz taken start-to-finish in Airplane Mode on a real device
- [ ] Universal Link opened the app from Messages after a fresh install
- [ ] `https://mypersonalityquizzes.com/support` loads
