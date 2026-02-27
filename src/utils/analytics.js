import { supabase } from '../lib/supabase';

// ─── Allowed event names ──────────────────────────────────────────────────────
// Must stay in sync with the analytics_events_event_format DB constraint
// (pattern: ^[a-z][a-z0-9_]{0,99}$) and the events actually used in the app.
const ALLOWED_EVENTS = new Set([
  'page_view',
  'baseline_completed',
  'baseline_reset',
  'quiz_started',
  'quiz_completed',
  'quiz_card_clicked',
  'quiz_result_viewed',
  'quiz_retaken',
  'hero_cta_clicked',
  'auth_sign_in_started',
  'auth_sign_in_completed',
  'auth_sign_out',
]);

// ─── Session ID ──────────────────────────────────────────────────────────────
// One UUID per browser tab, stored in sessionStorage.
// A new tab or a fresh browser open creates a new session.
// A same-tab page refresh preserves the session.
const SESSION_KEY = 'pq_session_id';

function getSessionId() {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    // sessionStorage unavailable (e.g. private browsing with storage blocked).
    // Return an ephemeral ID so analytics still fires for this call.
    return crypto.randomUUID();
  }
}

// ─── Device / browser metadata ───────────────────────────────────────────────
// Captured synchronously and lazily (first call only), then cached.
// Attached to the very first event of each session so session-level
// metadata is queryable via DISTINCT ON (session_id) ORDER BY created_at.
let _deviceInfo = null;

function getDeviceInfo() {
  if (_deviceInfo) return _deviceInfo;
  const ua = navigator.userAgent;
  _deviceInfo = {
    browser:         detectBrowser(ua),
    os:              detectOS(ua),
    language:        navigator.language,
    timezone:        Intl.DateTimeFormat().resolvedOptions().timeZone,
    viewport_width:  window.innerWidth,
    viewport_height: window.innerHeight,
    screen_width:    window.screen.width,
    screen_height:   window.screen.height,
  };
  return _deviceInfo;
}

function detectBrowser(ua) {
  if (/Edg\//.test(ua))         return 'Edge';
  if (/OPR\/|Opera/.test(ua))   return 'Opera';
  if (/Firefox\//.test(ua))     return 'Firefox';
  if (/Chrome\//.test(ua))      return 'Chrome';
  if (/Safari\//.test(ua))      return 'Safari';
  return 'Other';
}

function detectOS(ua) {
  if (/Windows/.test(ua))            return 'Windows';
  if (/Android/.test(ua))            return 'Android';
  if (/iPhone|iPad|iPod/.test(ua))   return 'iOS';
  if (/Mac/.test(ua))                return 'macOS';
  if (/Linux/.test(ua))              return 'Linux';
  return 'Other';
}

// ─── Core track function ─────────────────────────────────────────────────────
// Fire-and-forget — callers do NOT await this.
// userId should be user.id for authenticated users, or null for guests.
export function track(event, properties = {}, userId = null) {
  if (!supabase) return;

  // Drop events that aren't in the allowlist to keep analytics clean and to
  // avoid hitting the DB-level event_format CHECK constraint.
  if (!ALLOWED_EVENTS.has(event)) {
    if (import.meta.env.DEV) console.warn('[analytics] unknown event dropped:', event);
    return;
  }

  // Sanitize properties: ensure it is a plain object and cap individual string
  // values at 500 chars so the row stays within the 10 KB properties limit.
  const sanitizedProps = {};
  if (properties && typeof properties === 'object' && !Array.isArray(properties)) {
    for (const [k, v] of Object.entries(properties)) {
      sanitizedProps[k] = typeof v === 'string' ? v.slice(0, 500) : v;
    }
  }

  const sessionId = getSessionId();

  // Merge device info into the first event of this session only.
  const DEVICE_SENT_KEY = 'pq_device_sent';
  let finalProperties = sanitizedProps;
  try {
    if (!sessionStorage.getItem(DEVICE_SENT_KEY)) {
      finalProperties = { ...getDeviceInfo(), ...sanitizedProps };
      sessionStorage.setItem(DEVICE_SENT_KEY, '1');
    }
  } catch {
    // sessionStorage unavailable — include device info as best effort.
    finalProperties = { ...getDeviceInfo(), ...sanitizedProps };
  }

  supabase
    .from('analytics_events')
    .insert({
      session_id:  sessionId,
      user_id:     userId ?? null,
      event,
      properties:  finalProperties,
    })
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn('[analytics] insert failed:', event, error);
      }
    });
}
