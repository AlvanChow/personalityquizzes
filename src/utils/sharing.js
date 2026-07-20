import { supabase } from '../lib/supabase';
import { allowShare } from './rateLimiter';

const BASE_URL = 'https://mypersonalityquizzes.com';

// ─── ID generation ─────────────────────────────────────────────────────────
export function generateShareId() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8);
}

// ─── Snapshot trimming ─────────────────────────────────────────────────────
// Only the fields the share page and compatibility engine actually need are
// stored. This keeps rows small (the DB caps result_data at 4 KB), avoids
// duplicating long editorial copy into the DB, and shrinks the abuse surface
// of the anonymously-writable table.
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

// ─── Create a persistent shareable link ────────────────────────────────────
// Inserts a snapshot into shared_results and returns the full share URL.
// Returns null if Supabase is unavailable.
export async function createShareableLink(quizType, result, scores) {
  if (!supabase) return null;

  // Rate limit: max 5 share links per 60 seconds.
  if (!allowShare()) {
    if (import.meta.env.DEV) console.warn('[sharing] rate-limited');
    return null;
  }

  const id = generateShareId();

  const { error } = await supabase.from('shared_results').insert({
    id,
    quiz_type:    quizType,
    result_key:   (result.name ?? result.resultKey ?? '').slice(0, 20),
    result_name:  (result.name ?? '').slice(0, 100),
    result_emoji: (result.emoji ?? '').slice(0, 16),
    result_data:  buildShareSnapshot(result, scores),
  });

  if (error) {
    if (import.meta.env.DEV) console.warn('[sharing] createShareableLink failed:', error);
    return null;
  }

  return `${BASE_URL}/s/${id}`;
}

// ─── Per-platform share copy ────────────────────────────────────────────────
// Returns the text string for a given platform.
export function getShareText(platform, result, shareUrl, quizType) {
  const quizNames = {
    mbti:       'MBTI',
    enneagram:  'Enneagram',
    cake:       'CAKE Workplace',
    big5:       'Big Five',
    house:      'Wizarding House',
  };
  const quizLabel = quizNames[quizType] ?? 'Personality';
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
