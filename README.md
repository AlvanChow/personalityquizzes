# My Personality Quizzes

Endless personality quizzes — discover who you really are.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (auth + database)
- **Hosting**: Cloudflare Workers

## Adding a New Quiz

Quizzes are data, not pages. To ship a new one:

1. Create `src/data/quizzes/<key>.js` following the spec documented at the top
   of `src/data/quizzes/index.js` (`pick` mode for archetype quizzes, `likert`
   for agree/disagree assessments — see `naruto.js` and `grit.js` as examples).
2. Register it in the `QUIZ_CATALOG` array in `src/data/quizzes/index.js`
   (metadata + a lazy `load()` import — quiz data is code-split per quiz).
3. Run `npx vitest run src/data/quizzes/catalog.test.js` — it structurally
   validates every quiz (reachable results, valid point targets, required
   display fields, engine smoke tests).

That's it: routing (`/quiz/<key>` + `/quiz/<key>/result`), scoring, result
rendering, sharing, dashboard/landing cards, and the next-quiz journey all
pick the quiz up from the catalog automatically. Database saves require the
quiz key to match `^[a-z][a-z0-9_]{1,31}$` (enforced by
`supabase/migrations/20260720000004_expand_quiz_catalog.sql`).

---

## Domain Setup (Fix GoDaddy Landing Page)

If your site is showing a GoDaddy parking/landing page instead of your app, the domain's nameservers haven't been pointed to Cloudflare yet. Follow these steps:

### Step 1 — Add your domain to Cloudflare

1. Log in to [Cloudflare](https://dash.cloudflare.com)
2. Click **Add a Site** and enter `mypersonalityquizzes.com`
3. Choose the **Free** plan
4. Cloudflare will scan your existing DNS records — review them and continue
5. Cloudflare will give you **two nameserver addresses** (e.g. `anna.ns.cloudflare.com` and `bart.ns.cloudflare.com`)

### Step 2 — Update nameservers at GoDaddy

1. Log in to [GoDaddy](https://dcc.godaddy.com)
2. Go to **My Products → Domains → mypersonalityquizzes.com → Manage**
3. Scroll to **Nameservers** and click **Change**
4. Select **Enter my own nameservers**
5. Replace the existing nameservers with the two Cloudflare nameservers from Step 1
6. Save

> **Note:** DNS propagation can take up to 48 hours, but usually completes within a few hours. Wait for Cloudflare to send you an email confirming your domain is active before proceeding.

### Step 3 — Ensure your Cloudflare API token has the right permissions

The GitHub Actions deployment uses the `CLOUDFLARE_API_TOKEN` secret to upload
the Worker and register its custom domains. Create a dedicated token from the
**Edit Cloudflare Workers** template and restrict it to the production
Cloudflare account and the `mypersonalityquizzes.com` zone.

- **Account** → Workers Scripts → Edit

Do not add Zone Read or DNS Edit to the deployment token. Workers Custom
Domains create the required DNS records and certificates through the Workers
API. Keep one token for deployment and use a separate, temporary token for any
future DNS administration.

Store the token and account ID as the `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` GitHub Actions secrets. Rotate the deployment token
after any one-time DNS setup.

### Step 4 — Trigger a fresh deployment

Once your domain is active in Cloudflare and the GitHub secrets are configured,
go to **GitHub → Actions → Deploy to Cloudflare Workers → Run workflow**. The
workflow runs the full quality gate, deploys the Worker, and then smoke-tests
the apex domain, `www`, the share Worker route, and the branded auth domain.

Wrangler will use the custom-domain entries under `routes` in `wrangler.jsonc`
to wire up `mypersonalityquizzes.com` and `www.mypersonalityquizzes.com` to the
Worker.

> **Important:** GitHub Actions is the only production deployment authority.
> Keep Cloudflare Workers Builds disconnected for this repository so a second
> build token cannot create duplicate deployments or conflicting checks.

---

## Local Development

```bash
npm install
npm run dev
```

Create a `.env` file based on `.env.example` and fill in your Supabase credentials.

## Build & Deploy

```bash
npm run check
npx wrangler deploy --dry-run
```

Push or merge to `main` to deploy production through GitHub Actions. Do not
deploy production locally or connect Cloudflare Workers Builds.

Apply new files in `supabase/migrations/` to the production Supabase project in
filename order before deploying frontend features that depend on them. The app
degrades safely during a rolling deployment, but the migrations are required
for hardened share tokens, admin account-email access, and atomic guest-result
sync.
