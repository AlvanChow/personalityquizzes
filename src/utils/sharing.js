import { supabase } from '../lib/supabase';
import { allowShare } from './rateLimiter';
import { getQuizMeta } from '../data/quizzes';

const BASE_URL = 'https://mypersonalityquizzes.com';

// ─── ID generation ─────────────────────────────────────────────────────────
export function generateShareId(byteLength = 16) {
  if (!Number.isInteger(byteLength) || byteLength < 16 || byteLength > 32) {
    throw new RangeError('Share ID byte length must be between 16 and 32.');
  }
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

// ─── Snapshot trimming ─────────────────────────────────────────────────────
// The database now derives every public result field from a private catalog.
// This client-side snapshot remains useful for stable UI cache keys and for
// extracting the small numeric score object sent to the validated RPC.
export function buildShareSnapshot(result, scores) {
  const snapshot = {
    name:        typeof result.name === 'string' ? result.name.slice(0, 100) : '',
    emoji:       typeof result.emoji === 'string' ? result.emoji.slice(0, 16) : '',
    color:       typeof result.color === 'string' ? result.color.slice(0, 60) : undefined,
    accent:      typeof result.accent === 'string' ? result.accent.slice(0, 40) : undefined,
    nickname:    typeof result.nickname === 'string' ? result.nickname.slice(0, 100) : undefined,
    tagline:     typeof result.tagline === 'string' ? result.tagline.slice(0, 120) : undefined,
    coreDesire:  typeof result.coreDesire === 'string' ? result.coreDesire.slice(0, 160) : undefined,
    competency:  typeof result.competency === 'string' ? result.competency.slice(0, 60) : undefined,
    typeNumber:  typeof result.typeNumber === 'string' ? result.typeNumber.slice(0, 2) : undefined,
    trait:       typeof result.trait === 'string' ? result.trait.slice(0, 8) : undefined,
    key:         typeof result.key === 'string' ? result.key.slice(0, 20) : undefined,
    description: typeof result.description === 'string' ? (result.description.match(/^[^.!?]*[.!?]?/)?.[0] ?? '').slice(0, 240) : undefined,
  };
  // Raw quiz scores power the friend-compatibility breakdown.
  if (scores && typeof scores === 'object' && !Array.isArray(scores)) {
    const clean = {};
    for (const [k, v] of Object.entries(scores)) {
      const n = Number(v);
      if (/^[A-Za-z0-9]{1,4}$/.test(k) && Number.isFinite(n)) clean[k] = Math.max(-1000, Math.min(1000, n));
    }
    if (Object.keys(clean).length > 0 && Object.keys(clean).length <= 12) snapshot.scores = clean;
  }
  // Drop undefined keys so the stored JSON stays compact.
  return Object.fromEntries(Object.entries(snapshot).filter(([, v]) => v !== undefined));
}

// Identifies the exact immutable result snapshot behind a share URL. SharePanel
// uses this to avoid reusing a link after a retake changes the result or scores.
export function getShareSnapshotKey(quizType, result, scores, ownerId = null) {
  const snapshot = buildShareSnapshot(result, scores);
  if (snapshot.scores) {
    snapshot.scores = Object.fromEntries(
      Object.entries(snapshot.scores).sort(([left], [right]) => left.localeCompare(right)),
    );
  }
  return JSON.stringify({
    quizType,
    ownerId: ownerId ?? null,
    snapshot,
  });
}

export function getShareResultKey(quizType, result) {
  if (quizType === 'big5') return 'profile';
  if (quizType === 'enneagram' && result.typeNumber != null) return String(result.typeNumber);
  return String(result.key ?? result.resultKey ?? result.name ?? '').slice(0, 20);
}

// ─── Create a persistent shareable link ────────────────────────────────────
// The create_shared_result RPC validates the quiz/result pair, generates the
// 128-bit token, derives public copy from the server-owned result catalog, and
// infers ownership from the authenticated session. The browser only supplies
// the stable result key and bounded numeric scores.
export async function createShareableLink(quizType, result, scores, ownerId = null) {
  if (!supabase) return null;

  // Rate limit: max 5 share links per 60 seconds.
  if (!allowShare()) {
    if (import.meta.env.DEV) console.warn('[sharing] rate-limited');
    return null;
  }

  const snapshot = buildShareSnapshot(result, scores);
  const { data, error } = await supabase.rpc('create_shared_result', {
    p_quiz_type: quizType,
    p_result_key: getShareResultKey(quizType, result),
    p_scores: snapshot.scores ?? {},
  });

  if (error || typeof data !== 'string' || !/^[a-f0-9]{32}$/.test(data)) {
    if (import.meta.env.DEV) console.warn('[sharing] createShareableLink failed:', error ?? data);
    return null;
  }

  // ownerId is deliberately not sent. Keeping it in this signature preserves
  // the exact-snapshot cache key while the database uses auth.uid() directly.
  void ownerId;
  return `${BASE_URL}/s/${data}`;
}

// ─── Per-platform share copy ────────────────────────────────────────────────
// Returns the text string for a given platform.
export function getShareText(platform, result, shareUrl, quizType) {
  const quizNames = {
    mbti:       'MBTI',
    enneagram:  'Enneagram',
    cake:       'Cake',
    big5:       'Big Five',
    house:      'Wizarding House',
  };
  const quizLabel = quizNames[quizType] ?? getQuizMeta(quizType)?.quizName ?? 'Personality';
  const emoji     = result.emoji ?? '';
  const name      = result.name ?? '';
  const tagline   = result.tagline ?? result.nickname ?? result.coreDesire ?? '';

  if (platform === 'twitter') {
    const tag = tagline ? ` "${tagline}"` : '';
    return `I got ${emoji} ${name}${tag} on My Personality Quizzes!\n\nFind out your ${quizLabel} type 👇\n${shareUrl}`;
  }

  if (platform === 'whatsapp') {
    const tag = tagline ? ` (${tagline})` : '';
    return `I just got *${name}*${tag} on My Personality Quizzes! 🧠\n\nSee my full result and find out your own ${quizLabel} type: ${shareUrl}`;
  }

  // 'copy' — just the URL
  return shareUrl;
}

// ─── Platform openers ───────────────────────────────────────────────────────
export function openTwitterShare(text) {
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer,width=600,height=450');
}

export function openWhatsAppShare(text) {
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
