/**
 * Friend-compatibility engine.
 *
 * Given a shared result (from a /s/:shareId page) and the visitor's own local
 * result for the same quiz, produces a fun-but-credible compatibility report:
 * an overall 0–100 score, a headline, a short blurb, and per-dimension rows.
 *
 * Scores are intentionally warm (floor ~57) — this is a social feature, not a
 * clinical verdict. All math is deterministic so both friends see the same
 * number.
 */
import { safeLocalStorageRead } from './security';

// ─── Visitor's own result lookup ────────────────────────────────────────────

const MBTI_TYPE_RE = /^[IE][SN][TF][JP]$/;

/**
 * Read the visitor's local result identity for a quiz type.
 * Returns null when the visitor hasn't completed that quiz.
 */
export function getMyResultFor(quizType) {
  if (quizType === 'mbti') {
    const data = safeLocalStorageRead('personalens_mbti', null);
    const type = data?.result?.name;
    if (typeof type !== 'string' || !MBTI_TYPE_RE.test(type)) return null;
    return {
      type,
      name: type,
      nickname: data.result.nickname ?? '',
      emoji: data.result.emoji ?? '✨',
      scores: data.scores ?? null,
    };
  }
  if (quizType === 'enneagram') {
    const data = safeLocalStorageRead('personalens_enneagram', null);
    const type = String(data?.result?.typeNumber ?? '');
    if (!/^[1-9]$/.test(type)) return null;
    return {
      type,
      name: `Type ${type}`,
      nickname: data.result.nickname ?? '',
      emoji: data.result.emoji ?? '✨',
      scores: data.scores ?? null,
    };
  }
  if (quizType === 'cake') {
    const data = safeLocalStorageRead('personalens_cake', null);
    const trait = data?.result?.trait;
    if (typeof trait !== 'string' || !trait) return null;
    return {
      type: trait,
      name: data.result.name ?? trait,
      nickname: data.result.competency ?? '',
      emoji: data.result.emoji ?? '✨',
      scores: data.scores ?? null,
    };
  }
  if (quizType === 'house') {
    const data = safeLocalStorageRead('personalens_house', null);
    const key = data?.result?.key;
    if (typeof key !== 'string' || !HOUSES[key]) return null;
    return {
      type: key,
      name: data.result.name ?? key,
      nickname: data.result.tagline ?? '',
      emoji: data.result.emoji ?? '✨',
      scores: data.scores ?? null,
    };
  }
  return null; // big5 shares aren't produced by the app
}

/** Extract the sharer's type identity from a shared_results row. */
export function getSharedType(shared) {
  const quizType = shared?.quiz_type;
  const data = shared?.result_data ?? {};
  if (quizType === 'mbti') {
    const t = typeof data.name === 'string' ? data.name : shared.result_key;
    return typeof t === 'string' && MBTI_TYPE_RE.test(t) ? t : null;
  }
  if (quizType === 'enneagram') {
    const t = String(data.typeNumber ?? '');
    return /^[1-9]$/.test(t) ? t : null;
  }
  if (quizType === 'cake') {
    return typeof data.trait === 'string' && data.trait ? data.trait : null;
  }
  if (quizType === 'house') {
    const t = typeof data.key === 'string' ? data.key : String(shared.result_key ?? '').toLowerCase();
    return HOUSES[t] ? t : null;
  }
  return null;
}

// ─── MBTI ───────────────────────────────────────────────────────────────────

const MBTI_DIMS = [
  {
    key: 'energy',
    letters: ['I', 'E'],
    index: 0,
    label: 'Energy',
    sameText: {
      I: 'You both recharge in your own space — quiet plans, deep one-on-ones.',
      E: 'Double the energy in every room. Nobody is dragging anyone to the party.',
    },
    diffText: 'One brings the spark, the other brings the calm. Great balance.',
    samePts: 14,
    diffPts: 18,
  },
  {
    key: 'worldview',
    letters: ['S', 'N'],
    index: 1,
    label: 'Worldview',
    sameText: {
      S: 'You both live in the real, concrete world — practical plans, shared details.',
      N: 'You both speak in big ideas and possibilities. Conversations go everywhere.',
    },
    diffText: 'One sees what is, the other sees what could be. Expect some translation.',
    samePts: 28,
    diffPts: 12,
  },
  {
    key: 'decisions',
    letters: ['T', 'F'],
    index: 2,
    label: 'Decisions',
    sameText: {
      T: 'You both argue with logic and never take the debate personally.',
      F: 'You both lead with the heart — decisions get made with people in mind.',
    },
    diffText: 'Head meets heart. You cover each other’s blind spots when you listen.',
    samePts: 26,
    diffPts: 12,
  },
  {
    key: 'lifestyle',
    letters: ['J', 'P'],
    index: 3,
    label: 'Lifestyle',
    sameText: {
      J: 'Two planners. The itinerary exists, and it is color-coded.',
      P: 'Two improvisers. Plans are more of a vibe than a commitment.',
    },
    diffText: 'One plans, one improvises — someone books the flights, someone finds the adventure.',
    samePts: 18,
    diffPts: 9,
  },
];

function mbtiCompatibility(you, them) {
  let score = 10;
  const dimensions = MBTI_DIMS.map((d) => {
    const a = you[d.index];
    const b = them[d.index];
    const same = a === b;
    score += same ? d.samePts : d.diffPts;
    return {
      label: d.label,
      you: a,
      them: b,
      same,
      text: same ? d.sameText[a] : d.diffText,
    };
  });
  return { score, dimensions };
}

// ─── Enneagram ──────────────────────────────────────────────────────────────

// Growth/stress line connections in the Enneagram symbol (bidirectional).
const ENNEA_LINES = new Set(['1-7', '1-4', '2-8', '2-4', '3-9', '3-6', '5-8', '5-7', '6-9']);
const ENNEA_CENTERS = { 1: 'Body', 2: 'Heart', 3: 'Heart', 4: 'Heart', 5: 'Head', 6: 'Head', 7: 'Head', 8: 'Body', 9: 'Body' };

function enneaLineKey(a, b) {
  return a < b ? `${a}-${b}` : `${b}-${a}`;
}

function enneaAdjacent(a, b) {
  const na = Number(a);
  const nb = Number(b);
  return Math.abs(na - nb) === 1 || (na === 9 && nb === 1) || (na === 1 && nb === 9);
}

function enneagramCompatibility(you, them) {
  const sameCenter = ENNEA_CENTERS[you] === ENNEA_CENTERS[them];
  const jitter = (Number(you) * 3 + Number(them) * 7) % 4; // deterministic ±
  let score;
  let relationship;
  let text;
  if (you === them) {
    score = 90;
    relationship = 'Mirror souls';
    text = `Two Type ${you}s — you understand each other's core fears and desires instantly, because they're the same ones.`;
  } else if (ENNEA_LINES.has(enneaLineKey(you, them))) {
    score = 86 + jitter;
    relationship = 'Growth partners';
    text = `Types ${you} and ${them} are directly connected on the Enneagram — each of you embodies what the other grows toward.`;
  } else if (enneaAdjacent(you, them)) {
    score = 82 + jitter;
    relationship = 'Natural neighbors';
    text = `Types ${you} and ${them} sit side by side on the Enneagram — you likely share a wing's worth of common ground.`;
  } else if (sameCenter) {
    score = 76 + jitter;
    relationship = 'Same wavelength';
    text = `You're both ${ENNEA_CENTERS[you]} types — you process the world through the same center of intelligence.`;
  } else {
    score = 70 + jitter;
    relationship = 'Opposites attract';
    text = `Types ${you} and ${them} come from different centers — you'll surprise each other constantly, in a good way.`;
  }
  return {
    score,
    dimensions: [
      { label: 'Center', you: ENNEA_CENTERS[you], them: ENNEA_CENTERS[them], same: sameCenter, text },
      { label: 'Dynamic', you: `Type ${you}`, them: `Type ${them}`, same: you === them, text: relationship },
    ],
  };
}

// ─── Cake (workplace competencies) ──────────────────────────────────────────

const CAKE_LABELS = {
  AO: 'Action Oriented',
  PS: 'Problem Solving',
  IN: 'Innovation',
  TM: 'Teamwork',
  AD: 'Attention to Detail',
  INF: 'Influence',
};

const CAKE_POWER_PAIRS = {
  'AD-AO': { score: 92, name: 'The Ship-It Duo', text: 'One of you builds momentum, the other makes sure nothing breaks. Projects actually finish — and finish well.' },
  'IN-PS': { score: 90, name: 'The Idea Lab', text: 'One invents, the other stress-tests. Together your ideas are both original and bulletproof.' },
  'INF-TM': { score: 91, name: 'The People Powerhouse', text: 'One rallies the room, the other holds it together. Every team wants this pair.' },
  'AO-PS': { score: 85, name: 'Think & Do', text: 'One dives in, one thinks it through — you meet in the productive middle.' },
  'AD-PS': { score: 87, name: 'The Quality Guild', text: 'Deep thinking meets rigorous checking. Your work holds up under any scrutiny.' },
  'AO-INF': { score: 86, name: 'The Momentum Machine', text: 'Vision that sells plus execution that delivers. Things happen when you two team up.' },
};

function cakeCompatibility(you, them) {
  const youLabel = CAKE_LABELS[you] ?? you;
  const themLabel = CAKE_LABELS[them] ?? them;
  let score;
  let text;
  if (you === them) {
    score = 88;
    text = `You're both ${youLabel} types — instant mutual respect, and you never have to explain your work style.`;
  } else {
    const pair = CAKE_POWER_PAIRS[[you, them].sort().join('-')];
    if (pair) {
      score = pair.score;
      text = `${pair.name}: ${pair.text}`;
    } else {
      // Deterministic and symmetric: same pair → same score in both directions.
      score = 79 + (((you.length + them.length) * 7) % 4);
      text = `${youLabel} meets ${themLabel} — different superpowers that make a team more complete.`;
    }
  }
  return {
    score,
    dimensions: [
      { label: 'Superpower', you: youLabel, them: themLabel, same: you === them, text },
    ],
  };
}

// ─── Wizarding houses ───────────────────────────────────────────────────────

const HOUSES = {
  gryffindor: { label: 'Gryffindor', vibe: 'bold' },
  hufflepuff: { label: 'Hufflepuff', vibe: 'loyal' },
  ravenclaw:  { label: 'Ravenclaw', vibe: 'curious' },
  slytherin:  { label: 'Slytherin', vibe: 'ambitious' },
};

const HOUSE_PAIRS = {
  'gryffindor-hufflepuff': { score: 86, text: 'Courage backed by loyalty — one charges ahead, the other makes sure no one is left behind.' },
  'gryffindor-ravenclaw':  { score: 83, text: 'Daring meets strategy. One acts, one plans — together the plan actually survives contact.' },
  'gryffindor-slytherin':  { score: 80, text: 'Two forces of will. Rivals on a bad day, unstoppable on a good one.' },
  'hufflepuff-ravenclaw':  { score: 85, text: 'Steady heart, curious mind. The friendship where 2am talks and remembered birthdays coexist.' },
  'hufflepuff-slytherin':  { score: 81, text: 'Ambition with a conscience attached. One dreams big, the other keeps it human.' },
  'ravenclaw-slytherin':   { score: 87, text: 'Cleverness squared. You two could either found a company or take over a small country.' },
};

function houseCompatibility(you, them) {
  let score;
  let text;
  const same = you === them;
  if (same) {
    score = 90;
    text = `Two ${HOUSES[you].label}s — the common room already feels like home. Instant shorthand, shared instincts.`;
  } else {
    const pair = HOUSE_PAIRS[[you, them].sort().join('-')];
    score = pair?.score ?? 82;
    text = pair?.text ?? 'Different houses, same castle — you balance each other out.';
  }
  return {
    score,
    dimensions: [
      { label: 'Houses', you: HOUSES[you].label, them: HOUSES[them].label, same, text },
    ],
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

function headlineFor(score) {
  if (score >= 90) return { title: 'Twin flames', emoji: '🔥' };
  if (score >= 82) return { title: 'Power duo', emoji: '⚡' };
  if (score >= 72) return { title: 'Complementary pair', emoji: '🧩' };
  return { title: 'Odd couple (the fun kind)', emoji: '🎢' };
}

/**
 * Compute compatibility between the sharer's result and the visitor's.
 *
 * @param {string} quizType  'mbti' | 'enneagram' | 'cake'
 * @param {string} theirType sharer's type identity (from getSharedType)
 * @param {string} myType    visitor's type identity (from getMyResultFor().type)
 * @returns {{score:number, title:string, emoji:string, dimensions:Array}|null}
 */
export function computeCompatibility(quizType, theirType, myType) {
  if (!theirType || !myType) return null;
  let base;
  if (quizType === 'mbti') base = mbtiCompatibility(myType, theirType);
  else if (quizType === 'enneagram') base = enneagramCompatibility(myType, theirType);
  else if (quizType === 'cake') base = cakeCompatibility(myType, theirType);
  else if (quizType === 'house' && HOUSES[myType] && HOUSES[theirType]) base = houseCompatibility(myType, theirType);
  else return null;

  const score = Math.max(0, Math.min(100, Math.round(base.score)));
  return { score, ...headlineFor(score), dimensions: base.dimensions };
}

// ─── Compare-return loop (viral) ────────────────────────────────────────────
// When a visitor lands on a shared result but hasn't taken that quiz yet, we
// remember the share so their own result page can offer the comparison.

const COMPARE_KEY = 'pq_compare';

export function savePendingCompare(shareId, quizType, friendName) {
  try {
    sessionStorage.setItem(COMPARE_KEY, JSON.stringify({
      shareId: String(shareId).slice(0, 16),
      quizType: String(quizType).slice(0, 16),
      friendName: String(friendName ?? '').slice(0, 60),
    }));
  } catch { /* storage unavailable — the loop is a nice-to-have */ }
}

export function getPendingCompare(quizType) {
  try {
    const raw = sessionStorage.getItem(COMPARE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    if (quizType && parsed.quizType !== quizType) return null;
    if (!/^[a-f0-9]{8}$/.test(parsed.shareId ?? '')) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingCompare() {
  try { sessionStorage.removeItem(COMPARE_KEY); } catch { /* ignore */ }
}
