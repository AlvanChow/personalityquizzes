// sync-subscriber — push new email_subscribers rows into Loops (https://loops.so)
//
// Invoked by a Supabase Database Webhook on INSERT into
// public.email_subscribers. Runs server-side so the ESP API key is never in
// the browser bundle.
//
// Required secrets (set with `supabase secrets set`, see README.md):
//   LOOPS_API_KEY   your Loops API key
//   WEBHOOK_SECRET  a shared secret; the DB webhook must send it as
//                   `Authorization: Bearer <WEBHOOK_SECRET>`
//
// Deploy with JWT verification OFF — we authenticate with WEBHOOK_SECRET, not a
// Supabase JWT:
//   supabase functions deploy sync-subscriber --no-verify-jwt

const LOOPS_API_KEY = Deno.env.get("LOOPS_API_KEY");
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");

// Loops "add contact" endpoint. To send a welcome email instead of / in
// addition to adding the contact, POST to
// https://app.loops.so/api/v1/transactional with a transactionalId — see
// README.md ("Adding a welcome email").
const LOOPS_ENDPOINT = "https://app.loops.so/api/v1/contacts/create";

interface WebhookRecord {
  email?: string;
  source?: string | null;
  user_id?: string | null;
}
interface WebhookPayload {
  type?: "INSERT" | "UPDATE" | "DELETE";
  table?: string;
  record?: WebhookRecord | null;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  // Authenticate the caller (the DB webhook) with a shared secret.
  const auth = req.headers.get("authorization") ?? "";
  if (!WEBHOOK_SECRET || auth !== `Bearer ${WEBHOOK_SECRET}`) {
    return json({ error: "unauthorized" }, 401);
  }
  if (!LOOPS_API_KEY) return json({ error: "LOOPS_API_KEY not configured" }, 500);

  let payload: WebhookPayload;
  try {
    payload = await req.json();
  } catch {
    return json({ error: "invalid json" }, 400);
  }

  // Only act on new inserts that carry an email. Ack anything else so the
  // webhook doesn't retry.
  if (payload.type !== "INSERT" || !payload.record?.email) {
    return json({ skipped: true });
  }

  const { email, source, user_id } = payload.record;

  let res: Response;
  try {
    res = await fetch(LOOPS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOOPS_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        userGroup: "quiz-subscribers",
        // Custom contact properties — create matching properties in Loops if
        // you want to segment on them.
        signupSource: source ?? "personality-quizzes",
        hasAccount: Boolean(user_id),
      }),
    });
  } catch (err) {
    console.error("[sync-subscriber] network error calling Loops", err);
    return json({ error: "loops unreachable" }, 502);
  }

  const result = await res.json().catch(() => ({} as Record<string, unknown>));

  // Loops returns { success: true } on create, or an error when the contact
  // already exists. Treat "already exists" as success so an existing address
  // isn't retried forever.
  const message = typeof result?.message === "string" ? result.message : "";
  const alreadyExists = res.status === 409 || /already/i.test(message);

  if (!res.ok && !alreadyExists) {
    console.error("[sync-subscriber] Loops error", res.status, result);
    return json({ error: "loops sync failed", status: res.status, detail: result }, 502);
  }

  return json({ ok: true, alreadyExists });
});
