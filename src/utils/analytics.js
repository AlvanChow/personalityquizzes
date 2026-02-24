import { supabase } from '../lib/supabase';

// ─── Session ID ──────────────────────────────────────────────────────────────
// One UUID per browser tab, stored in sessionStorage.
// A new tab or a fresh browser open creates a new session.
// A same-tab page refresh preserves the session.
const SESSION_KEY = 'pq_session_id';

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
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
  const sessionId = getSessionId();

  // Merge device info into the first event of this session only.
  const DEVICE_SENT_KEY = 'pq_device_sent';
  let mergedProperties = properties;
  if (!sessionStorage.getItem(DEVICE_SENT_KEY)) {
    mergedProperties = { ...getDeviceInfo(), ...properties };
    sessionStorage.setItem(DEVICE_SENT_KEY, '1');
  }

  supabase
    .from('analytics_events')
    .insert({
      session_id:  sessionId,
      user_id:     userId ?? null,
      event,
      properties:  mergedProperties,
    })
    .then(({ error }) => {
      if (error && import.meta.env.DEV) {
        console.warn('[analytics] insert failed:', event, error);
      }
    });
}
