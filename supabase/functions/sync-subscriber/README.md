# sync-subscriber — email list automation

Automatically pushes every new `email_subscribers` row into
[Loops](https://loops.so) so signups land in your email tool with no manual CSV
import. Runs as a Supabase Edge Function triggered by a Database Webhook.

```
result page → email_subscribers (INSERT) → DB webhook → sync-subscriber → Loops
```

The ESP API key lives in Edge Function secrets, never in the browser bundle.

---

## One-time setup

### 1. Get a Loops API key
Loops → **Settings → API** → create a key. (Free tier covers ~1,000 contacts.)

### 2. Pick a webhook secret
Any random string — it authenticates the webhook → function call. Generate one:

```bash
openssl rand -hex 32
```

### 3. Deploy the function

```bash
export SUPABASE_ACCESS_TOKEN=<your NEW access token>   # rotate the old one first
supabase link --project-ref ivptkiuhxzdhjnslzalv

supabase secrets set LOOPS_API_KEY=<loops-key> WEBHOOK_SECRET=<random-secret>

# --no-verify-jwt: we authenticate with WEBHOOK_SECRET, not a Supabase JWT
supabase functions deploy sync-subscriber --no-verify-jwt
```

The function URL is:
`https://ivptkiuhxzdhjnslzalv.supabase.co/functions/v1/sync-subscriber`

### 4. Create the Database Webhook
Supabase Dashboard → **Database → Webhooks → Create a new hook**:

- **Table:** `public.email_subscribers`
- **Events:** `Insert`
- **Type:** Supabase Edge Functions → `sync-subscriber`
- **HTTP Headers:** add
  `Authorization: Bearer <the WEBHOOK_SECRET from step 2>`

Save. That's it — new signups now sync to Loops.

### 5. Verify

```bash
# tail logs, then submit the email form on a result page (or insert a test row)
supabase functions logs sync-subscriber
```

A successful sync logs `{ ok: true }`; the contact appears in Loops → Audience.

---

## Adding a welcome email later

Create a Loops **Loop** (automation) triggered on "Contact created" — no code
change needed. Or send a transactional email from the function: create a
transactional template in Loops, then add a second `fetch` in `index.ts`:

```ts
await fetch("https://app.loops.so/api/v1/transactional", {
  method: "POST",
  headers: { Authorization: `Bearer ${LOOPS_API_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({ email, transactionalId: "<your-template-id>" }),
});
```

## Swapping to a different ESP

Only `LOOPS_ENDPOINT` and the request body in `index.ts` are Loops-specific.
For Resend/Mailchimp/Kit, change those two spots and the `LOOPS_API_KEY` secret
name; the webhook, auth, and payload handling stay the same.

## Notes

- **Idempotent:** an address that already exists in Loops is treated as success,
  so re-delivered webhooks don't error.
- **Backfill existing subscribers:** export the current list from the admin
  dashboard (Email List → Export CSV) and import it into Loops once; the webhook
  handles everyone from then on.
- **Security:** the function rejects any request without the correct
  `Authorization: Bearer <WEBHOOK_SECRET>`. Keep both secrets out of git — they
  live only in `supabase secrets`.
