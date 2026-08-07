# My Personality Quizzes — iOS app

A [Capacitor](https://capacitorjs.com) shell around the web app in the parent
directory. There is no second codebase: the app loads the same Vite bundle that
`mypersonalityquizzes.com` serves, from inside the binary rather than over the
network, and the native-only behaviour is a handful of branches in the web app
guarded by `isNativeApp()` (`../src/lib/native.js`).

Everything Xcode needs lives in `ios/`. It is a generated project, but it is
committed, because Info.plist, the asset catalogue, and the signing settings are
all edited by hand and must not be regenerated.

---

## Requirements

| | |
|---|---|
| macOS | Sonoma or later — **the build cannot be done on Linux or Windows** |
| Xcode | 15+ with the iOS platform installed |
| Node | 22.22+ (same as the web app) |
| Apple Developer Program | $99/year, required to test on a device or submit |

Dependencies are resolved with Swift Package Manager, so there is no CocoaPods
step and no `Podfile`.

## First run

```bash
cd ios-app
npm install
npm run sync      # builds ../dist, then copies it into ios/ and updates plugins
npm run open      # opens ios/App/App.xcodeproj in Xcode
```

In Xcode: select the **App** target → **Signing & Capabilities** → set your
team. Pick a simulator and hit ⌘R.

## Everyday loop

| Command | What it does |
|---|---|
| `npm run sync` | Rebuild the web app, copy it in, refresh native plugins. **Run this after any change under `../src`** |
| `npm run copy` | Same, but skips the plugin refresh — faster when only web code changed |
| `npm run open` | Open the Xcode project. Not `cap open ios` — that resolves `App.xcworkspace`, which only exists for CocoaPods builds and which `cap sync` deletes on an SPM project like this one |
| `npm run assets` | Re-render the app icon and splash from `brand/*.svg` |
| `npm run doctor` | Capacitor's environment diagnostic |

The web view does **not** hot-reload from the dev server. To iterate on UI, use
`npm run dev` in the parent directory and a browser; come back here to verify
the native paths (sign-in, share sheet, haptics, safe areas).

---

## Before this can be submitted

The code is done. These are the account-level steps that cannot be done from a
repository, in the order they need doing.

### 1. Register the App ID

In the [Apple Developer portal](https://developer.apple.com/account), create an
App ID for `com.mypersonalityquizzes.app` with these capabilities:

- **Sign in with Apple** — required, see step 3
- **Associated Domains** — required for Universal Links, see step 5

Note your **Team ID** (10 characters, top right of the portal). Several steps
below need it.

### 2. Add the native redirect to Supabase

Sign-in happens in a system browser and returns through a custom URL scheme, so
Supabase has to be told that scheme is legitimate.

**Supabase → Authentication → URL Configuration → Redirect URLs**, add:

```
com.mypersonalityquizzes.app://auth-callback
```

Leave the existing `https://mypersonalityquizzes.com/**` entries alone — the
website still uses them.

> The scheme is asserted in three places: `capacitor.config.json` (`appId`),
> `ios/App/App/Info.plist` (`CFBundleURLSchemes`), and `../src/utils/deepLink.js`
> (`NATIVE_URL_SCHEME`). `capacitorConfig.test.js` fails the normal `npm test`
> run if they ever drift apart.

### 3. Enable Sign in with Apple

App Store Review Guideline 4.8 requires an equivalent privacy-preserving login
wherever a third-party login is offered. The app offers Google, so Apple is
mandatory — this is a rejection, not a suggestion.

The UI is already built (`../src/components/SignInButtons.jsx` renders both, at
equal prominence, everywhere sign-in appears). What is missing is the provider:

1. Apple Developer portal → **Keys** → create a key with **Sign in with Apple**
   enabled. Download the `.p8` — Apple lets you download it exactly once.
2. Create a **Services ID** (e.g. `com.mypersonalityquizzes.web`) and configure
   its return URL as your Supabase callback:
   `https://<project>.supabase.co/auth/v1/callback`
3. Supabase → **Authentication → Providers → Apple**: enable it and fill in the
   Services ID, Team ID, Key ID, and the `.p8` contents.

Test it on the website first. If it works there, it works in the app — the two
run the same code path.

### 4. Apply the account-deletion migration

`../supabase/migrations/20260807000001_add_account_deletion.sql` adds the
`delete_my_account()` RPC that the Delete Account button on the profile page
calls. **Apply it to production Supabase before submitting.**

Guideline 5.1.1(v) requires an app that creates accounts to let the user delete
theirs from inside the app. Reviewers check this one directly — they sign in and
look for it. Without the migration the button is there and fails.

### 5. Turn on Universal Links (optional, but it is the growth loop)

Without this, a shared `/s/:id` link opens Safari even for someone who has the
app installed — so an invited friend never lands in the app.

The app half is already in the project: `ios/App/App/App.entitlements` declares
both `applinks:` domains and is wired to both build configurations via
`CODE_SIGN_ENTITLEMENTS`. Automatic signing enables the Associated Domains
capability on the App ID when Xcode sees it, so there is nothing to add by hand.
What is left is the server half:

1. Set `IOS_APP_ID` in `../wrangler.jsonc` to `<TeamID>.com.mypersonalityquizzes.app`
   and redeploy the worker. It then serves
   `/.well-known/apple-app-site-association`; until it is set, that path 404s
   deliberately rather than publishing a claim iOS would cache for days.
2. Verify: `curl https://mypersonalityquizzes.com/.well-known/apple-app-site-association`
   must return `application/json` with no redirect.

Claimed paths are `/`, `/s/*`, `/quiz/*`, `/circle`, `/exercise/*` — the things
people actually share. The whole site is deliberately not claimed. The claimed
hosts must stay equal to `SITE_HOSTS` in `../src/utils/deepLink.js`, or a link
opens the app and then dead-ends on a route it refuses to navigate to;
`capacitorConfig.test.js` fails if they diverge.

### 6. App Store Connect

Create the app record, then prepare:

- **Screenshots** — 6.9" iPhone (1320 × 2868) is the required size; App Store
  Connect scales it down for the smaller iPhones. An iPhone 17 Pro Max
  simulator screenshots at exactly that size:
  `xcrun simctl io booted screenshot shot.png`. A 13" iPad set is required too
  for as long as the target builds for iPad — see `TARGETED_DEVICE_FAMILY`
- **Privacy policy URL** — `https://mypersonalityquizzes.com/privacy` (exists)
- **App Privacy questionnaire** — declare what is collected. Today that is:
  email address and name (from the OAuth provider), quiz results, and usage
  analytics, all linked to identity, none used for tracking. See
  `../src/utils/analytics.js` for the exact event set. The same four categories
  are declared in `ios/App/App/PrivacyInfo.xcprivacy`; Apple aggregates that into
  a privacy report but the questionnaire is what is authoritative, so the two
  must say the same thing.
- **Age rating** — 4+. The quizzes contain no objectionable content.
- **Export compliance** — already answered in Info.plist
  (`ITSAppUsesNonExemptEncryption = false`), so builds will not stop for the
  questionnaire on every upload.

---

## The rejection risk this cannot fix for you

**Guideline 4.2 — Minimum Functionality.** A web view wrapped around an existing
website is the most common rejection for a project shaped like this one. What is
already here to argue against it: offline-capable bundled content, native
sign-in, the iOS share sheet, haptics on every answer, and Universal Links.

What would make the case decisively, in rough order of value:

1. **Push notifications** — a genuine reason to have the app rather than the
   site ("your weekly quiz is ready"). Add `@capacitor/push-notifications`.
2. **Offline quiz taking** — the quiz data is already bundled; results already
   fall back to local storage. Mostly a matter of proving it works with the
   network off.
3. **Home screen widget** — showing the user's current type. Native work.

If the app is rejected under 4.2, the fastest credible answer is push
notifications.

---

## How the native paths work

Worth knowing before changing any of it.

**Sign-in.** Google refuses OAuth inside an embedded web view
(`disallowed_useragent`), so `window.location = authUrl` cannot work here.
Instead `AuthContext` asks Supabase for the URL with `skipBrowserRedirect: true`
and opens it with `@capacitor/browser`, which is an `SFSafariViewController` —
a real browser as far as Google is concerned. The provider redirects to
`com.mypersonalityquizzes.app://auth-callback?code=…`, iOS reopens the app, and
the `appUrlOpen` listener trades the code for a session. This is why the native
client sets `flowType: 'pkce'` and `detectSessionInUrl: false`
(`../src/lib/supabase.js`) — there is never a session in the app's own URL.

**Safe areas.** The web view runs edge-to-edge (`contentInset: "never"`,
`overlaysWebView: true`). `useNativeShell` adds `viewport-fit=cover` to the
viewport meta *at runtime*, and only on native — which is what keeps every
`env(safe-area-inset-*)` in the stylesheets at 0 for browser visitors. The
padding itself lives on the components (`SiteHeader`, `SiteFooter`, `QuizShell`)
as `calc()`'d Tailwind classes.

**Plugins.** Only `@capacitor/core` is imported statically by the web bundle.
Every plugin is behind a gated dynamic `import()` in `../src/lib/native.js`, so
Vite emits them as a separate chunk that website visitors never download. The
plugin versions in this `package.json` and the parent one must match, since one
supplies the JS half and the other compiles the native half — `capacitorConfig.test.js`
enforces that.

**Splash.** `launchAutoHide` is off; `useNativeShell` hides the splash after
React's first paint. Otherwise iOS drops it immediately and the user watches a
blank web view while the bundle boots.

## Optional tweaks

- **Landscape on iPhone**: `Info.plist` → `UISupportedInterfaceOrientations`
  currently lists portrait only. Add the two landscape values back to allow it.
- **iPad**: on (`TARGETED_DEVICE_FAMILY = "1,2"`), as shipped in 1.0.
  `UISupportedInterfaceOrientations~ipad` lists all four orientations, which is
  what keeps validation from failing with ITMS-90474.
- **Icon and splash**: edit `brand/icon.svg` / `brand/splash.svg`, then
  `npm run assets`. The generator flattens alpha, which App Store Connect
  rejects icons for having.
