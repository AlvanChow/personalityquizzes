import { supabase } from '../lib/supabase';
import { allowShare } from './rateLimiter';

const BASE_URL = 'https://mypersonalityquizzes.com';

// ─── ID generation ─────────────────────────────────────────────────────────
export function generateShareId() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 8);
}

// ─── Create a persistent shareable link ────────────────────────────────────
// Inserts a snapshot into shared_results and returns the full share URL.
// Returns null if Supabase is unavailable.
export async function createShareableLink(quizType, result) {
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
    result_emoji: result.emoji ?? '',
    result_data:  result,
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
