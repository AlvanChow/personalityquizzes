# My Personality Quizzes

Endless personality quizzes — discover who you really are.

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Supabase (auth + database)
- **Hosting**: Cloudflare Workers

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

The GitHub Actions deployment uses the `CLOUDFLARE_API_TOKEN` secret to register the custom domain. This token must have **all** of the following permissions:

- **Account** → Workers Scripts → Edit
- **Zone** → Zone → Read
- **Zone** → DNS → Edit

If your token only has "Edit Workers" permission, the custom domain (`mypersonalityquizzes.com`) won't be wired up even if the Worker code deploys successfully.

To create or update the token: Cloudflare dashboard → **My Profile → API Tokens → Create Token** (use the "Edit Cloudflare Workers" template, then add Zone Read + DNS Edit for your zone).

### Step 4 — Trigger a fresh deployment

Once your domain is active in Cloudflare (email confirmed) and your API token has the right permissions, trigger a new deployment. You have two options:

**Option A — GitHub Actions (recommended):**
Go to your repository on GitHub → **Actions → Deploy to Cloudflare Workers → Run workflow**.
This re-runs the full build + deploy pipeline including custom domain registration.

**Option B — deploy locally:**
```bash
npm run build
npx wrangler deploy
```

Wrangler will use the `custom_domains` in `wrangler.jsonc` to automatically wire up `mypersonalityquizzes.com` and `www.mypersonalityquizzes.com` to the Worker.

> **Important:** The automatic deployment on push to `main` runs *before* you complete the Cloudflare setup. You must trigger a **new** deployment after the domain is active — otherwise the custom domain registration step is skipped.

---

## Local Development

```bash
npm install
npm run dev
```

Create a `.env` file based on `.env.example` and fill in your Supabase credentials.

## Build & Deploy

```bash
npm run build
npx wrangler deploy
```
