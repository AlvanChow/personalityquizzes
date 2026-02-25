// Generates a synthesized "Personality Mosaic" summary from all available quiz results.
// Combines Big Five baseline scores with MBTI, Enneagram, and CAKE quiz results
// to produce uplifting insights and a single gentle growth note.

import { mbtiInsights } from '../data/mbtiInsights';
import { enneagramInsights } from '../data/enneagramInsights';
import { cakeResults } from '../data/cakeResults';
import { mbtiResults } from '../data/mbtiResults';
import { enneagramResults } from '../data/enneagramResults';

// ─── MBTI family detection ────────────────────────────────────────────────────

const MBTI_FAMILIES = {
  NT: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  NF: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
  SJ: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  SP: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
};

function getMBTIFamily(typeKey) {
  for (const [family, types] of Object.entries(MBTI_FAMILIES)) {
    if (types.includes(typeKey)) return family;
  }
  return null;
}

// ─── Enneagram center detection ───────────────────────────────────────────────

const ENNEAGRAM_CENTERS = {
  Head: ['5', '6', '7'],
  Heart: ['2', '3', '4'],
  Body:  ['8', '9', '1'],
};

function getEnneagramCenter(typeKey) {
  for (const [center, types] of Object.entries(ENNEAGRAM_CENTERS)) {
    if (types.includes(String(typeKey))) return center;
  }
  return null;
}

// ─── MBTI-family × Enneagram-center combination body texts ───────────────────
// Each entry is a function(mbtiNickname, enneagramTypeName) → string

const COMBINATION_TEXTS = {
  NT: {
    Head: (nick, typeName) =>
      `Both frameworks are pointing the same direction: the ${nick} and the ${typeName} are oriented primarily toward understanding — building accurate models of how things work and staying clear-eyed about what could go wrong. In a world full of people who act before they think, you run the opposite risk. But when you do act, you tend to be right.`,
    Heart: (nick, typeName) =>
      `Your MBTI says strategist; your Enneagram says you feel things deeply. That's not a contradiction — it's leverage. The ${nick}'s precision and the ${typeName}'s emotional intelligence give you access to both the logic of a situation and the human reality inside it. Most people have one or the other. You can move between both registers, which is rarer than it sounds.`,
    Body: (nick, typeName) =>
      `Clear thinking and decisive instinct — the ${nick} provides the map, the ${typeName} provides the drive to actually move. You're not someone who gets stuck in analysis for long. You form a view and act on it. The thing to watch is whether you bring the people who need to come with you before you've already arrived.`,
  },
  NF: {
    Head: (nick, typeName) =>
      `Vision and vigilance together — the ${nick} holds the sense of how things could be; the ${typeName} runs the scenarios of what could go wrong on the way there. That pairing is harder to rattle than it looks from the outside. You're an idealist with contingency plans, which is a more durable combination than idealism alone.`,
    Heart: (nick, typeName) =>
      `The ${nick} and the ${typeName} both live in the emotional register — deeply, and often at cost to themselves. Together they produce a person with unusual perceptive range: you read what's happening beneath the surface of rooms and relationships before most people have noticed there's a surface to break. The energy that makes all that possible is worth protecting deliberately.`,
    Body: (nick, typeName) =>
      `Idealism with spine. The ${nick} holds the conviction that things could be better; the ${typeName} brings the instinctive drive to push toward that. You don't just imagine change — you feel the momentum of it and move accordingly. That combination actually gets things done in ways that pure idealism rarely does on its own.`,
  },
  SJ: {
    Head: (nick, typeName) =>
      `Reliable and rigorous — the ${nick}'s thoroughness and the ${typeName}'s anticipatory, contingency-aware thinking make you the person that important things don't fall apart around. That's not a dramatic strength, but it's an exceptionally rare one. Most systems work because someone with your profile is quietly holding them together.`,
    Heart: (nick, typeName) =>
      `Structure and warmth in the same person. The ${nick} builds what's reliable and consistent; the ${typeName} makes sure what's built actually serves the people inside it. That pairing shows up as genuine trustworthiness — not just someone who delivers, but someone who cares what the delivery means to the people receiving it.`,
    Body: (nick, typeName) =>
      `Dependable and principled — two things that are easy to claim and genuinely hard to embody over time. The ${nick}'s consistency and the ${typeName}'s values-driven instincts make you the kind of person that institutions, families, and teams quietly depend on. You show up, hold the standard, and do it without requiring an audience.`,
  },
  SP: {
    Head: (nick, typeName) =>
      `Present and perceptive — the ${nick} reads what's actually happening in real time with real accuracy; the ${typeName} has already run the analysis on what it means. That combination handles uncertainty better than people who've carefully planned for it, because you're genuinely comfortable operating inside it rather than just tolerating it.`,
    Heart: (nick, typeName) =>
      `The ${nick} is fully engaged with what's happening now; the ${typeName} brings the emotional depth and relational attunement to make that moment feel real. You're hard to forget because you're genuinely, completely there — not performing presence, actually present. That quality is rarer than most people realise.`,
    Body: (nick, typeName) =>
      `Action and instinct, cleanly aligned. The ${nick} is already doing it while others are still discussing it; the ${typeName} acts from conviction rather than calculation. The combination is decisive in a way that's hard to fake and surprisingly easy for others to follow.`,
  },
};

// ─── Standalone body texts (only one framework + Big Five) ───────────────────

function standaloneBody(mbtiResult, enneagramResult, hasCompleted, scores) {
  const traitName = (scores) => {
    const posTraits = ['O', 'C', 'E', 'A'];
    const top = posTraits.reduce((a, b) => (scores[a] ?? 50) >= (scores[b] ?? 50) ? a : b);
    return { O: 'openness', C: 'conscientiousness', E: 'extraversion', A: 'agreeableness' }[top];
  };

  if (mbtiResult && hasCompleted) {
    const key = mbtiResult.resultKey;
    const nick = mbtiResults[key]?.nickname || mbtiResult.name;
    return `As ${mbtiResult.name} — the ${nick} — you carry a distinctive architecture for how you process information and make decisions. Your Big Five profile adds important texture: particularly high ${traitName(scores)}, which shapes how the ${nick} pattern actually shows up in your day-to-day life.`;
  }
  if (enneagramResult && hasCompleted) {
    const key = String(enneagramResult.resultKey);
    const typeName = enneagramResults[key]?.nickname || enneagramResult.name;
    return `As Type ${enneagramResult.resultKey} — the ${typeName} — your core motivations run through everything you do with a consistency that people around you feel even when they can't name it. Your Big Five profile adds the day-to-day texture, particularly in ${traitName(scores)} — the trait that shapes how the ${typeName} pattern actually expresses itself.`;
  }
  if (mbtiResult) {
    const key = mbtiResult.resultKey;
    const nick = mbtiResults[key]?.nickname || mbtiResult.name;
    return `As ${mbtiResult.name} — the ${nick} — you carry a distinctive way of seeing the world that shapes how you connect, create, and make decisions. Your quiz history adds more texture to that picture with each framework you complete.`;
  }
  return `Your personality profile reveals a distinctive combination of traits that shapes how you engage with challenges, people, and ideas.`;
}

// ─── Big Five strengths ───────────────────────────────────────────────────────

const BIG5_STRENGTHS = {
  O: {
    high: 'Your openness to experience means you find creative angles where others see dead ends — complexity intrigues you rather than stops you.',
    low:  'You bring grounded reliability to everything you touch. Your preference for what works prevents the costly experiments others get burned by.',
  },
  C: {
    high: 'Your conscientiousness is a rare asset: you\'re the person who actually follows through. In a world of good intentions, reliable execution builds the kind of trust that takes others years to earn.',
    low:  'Your flexibility means you adapt quickly and don\'t get paralysed by perfectionism when speed matters more than polish.',
  },
  E: {
    high: 'Your extraversion gives you a natural ability to energise and mobilise people — you don\'t just participate in rooms, you change their energy.',
    low:  'Your introversion means you process deeply and speak with precision. When you do share, people lean in — your words carry weight because they\'re well-considered.',
  },
  A: {
    high: 'Your agreeableness creates the kind of safety that makes people trust you with the real stuff, not just the polished version. That depth of trust takes others years to build.',
    low:  'Your directness cuts through the noise that politeness leaves intact. Used thoughtfully, the willingness to say the hard thing is genuinely rare and genuinely useful.',
  },
};

const N_STRENGTHS = {
  low:  'Your emotional resilience under pressure is a quiet superpower — you bring steadiness to situations that would knock most people off balance.',
  high: 'You feel things fully, which is the source of both your empathy and your depth. That sensitivity is worth protecting, not suppressing.',
};

function getBig5Strength(scores) {
  const posTraits = ['O', 'C', 'E', 'A'];
  const top = posTraits.reduce((a, b) => (scores[a] ?? 50) >= (scores[b] ?? 50) ? a : b);
  const val = scores[top] ?? 50;
  return val >= 55 ? BIG5_STRENGTHS[top].high : BIG5_STRENGTHS[top].low;
}

// ─── Per-type Enneagram watch-outs ───────────────────────────────────────────
// Written specifically for each type — more personal than extracted psyche notes.

const ENNEAGRAM_WATCH_OUTS = {
  '1': "Your inner standard-setter rarely goes off duty. The discipline that makes you effective can turn on you when 'good enough' becomes impossible to reach — and when it does, it costs you energy that could go somewhere useful. Watch for perfectionism wearing the mask of diligence.",
  '2': "Your instinct to help is one of your most genuine qualities. Its shadow: sometimes helping others is easier than attending to yourself. Make sure the generosity is running in both directions.",
  '3': "You adapt well — sometimes so well that you lose track of what you actually want, underneath all the things you're good at performing. What you'd pursue if no one was watching is worth knowing.",
  '4': "Your depth and emotional range are real strengths. So is the awareness that longing for what's absent can become a way of avoiding what's present. The ordinary moment is worth staying in.",
  '5': "Your instinct to prepare thoroughly before engaging is intelligent — until it becomes a reason to keep waiting. At some point, knowing less than everything is simply the starting condition, not a problem to solve before you begin.",
  '6': "You're good at anticipating what might go wrong, which is genuinely useful. The thing to watch: anxiety about what could happen can crowd out your judgment about what's actually likely. Your instincts are better than you tend to give them credit for.",
  '7': "The range and optimism you bring is real. The pattern worth noticing: staying in motion can be a way of not sitting with something important. Some of your best material lives in the places you've been moving quickly past.",
  '8': "Your directness and conviction are real strengths. The watch-out: the intensity that comes naturally to you can register as pressure to people who haven't decided to trust you yet. Slowing the pace occasionally earns more ground, not less.",
  '9': "Your ability to hold all sides and keep the peace is rare. The cost: you can lose track of your own position in the process. Your actual perspective — not the diplomatic version — is worth more than you tend to let on.",
};

// ─── MBTI-family watch-outs (fallback if no Enneagram) ───────────────────────

const MBTI_WATCH_OUTS = {
  NT: "The analytical precision that's your strongest suit can tip into perpetual refinement — one more angle to consider before committing. At some point, the analysis is done and the move needs to be made.",
  NF: "Your attunement to others is one of your best qualities and one of your highest costs. Make sure the ideals you're working toward are actually yours — not assembled from what everyone else seems to need from you.",
  SJ: "Reliability and consistency are real strengths — and they can also become reasons to avoid changing something that genuinely needs changing. The system that once worked is worth examining periodically.",
  SP: "Your ability to stay present and responsive is genuinely valuable. The pattern to watch: commitments that require steady, undramatic follow-through over a long horizon can get deprioritised in favour of what's immediate and alive.",
};

// ─── Big Five watch-outs (last-resort fallback) ──────────────────────────────

function getBig5WatchOut(scores) {
  if ((scores.N ?? 50) > 62) {
    return "You feel things fully, which is the source of your depth — but that same sensitivity can leave you carrying weight that isn't yours to carry. Building small recovery habits (not walls — just circuits to reset) matters more for you than for most.";
  }
  if ((scores.C ?? 50) > 72) {
    return "Your inner critic is a diligent editor. Remember that perfect is often the enemy of shipped — give yourself the same grace you'd offer someone you genuinely respect.";
  }
  const posTraits = ['O', 'C', 'A'];
  const lowest = posTraits.reduce((a, b) => (scores[a] ?? 50) <= (scores[b] ?? 50) ? a : b);
  if ((scores[lowest] ?? 50) < 42) {
    return {
      O: "Watch for a tendency to stick with the familiar even when the map has changed. Staying curious about new approaches — even small ones — is worth the occasional discomfort.",
      C: "Important commitments can slip quietly when you're in a flexible rhythm. A simple system to track what actually matters most gives you the freedom you want without the cost.",
      A: "Your directness can land harder than you intend. Pausing a beat before a difficult conversation — just to consider delivery — protects relationships worth keeping.",
    }[lowest] || null;
  }
  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

/**
 * Generates a synthesized personality mosaic from all available data.
 *
 * @param {object}  scores        Big Five scores { O, C, E, A, N } (0–100)
 * @param {boolean} hasCompleted  Whether the Big Five baseline is done
 * @param {object}  quizResults   { mbti?, enneagram?, cake? }
 * @returns {{ body, strengths, watchOut, sourceCount } | null}
 *   Returns null if fewer than 2 data sources are available.
 */
export function generateProfileSummary({ scores, hasCompleted, quizResults }) {
  const mbtiResult      = quizResults?.mbti;
  const enneagramResult = quizResults?.enneagram;
  const cakeResult      = quizResults?.cake;

  const sourceCount = [hasCompleted, !!mbtiResult, !!enneagramResult, !!cakeResult].filter(Boolean).length;
  if (sourceCount < 2) return null;

  // ── Body paragraph ───────────────────────────────────────────────────────
  const mbtiKey         = mbtiResult?.resultKey;
  const enneagramKey    = enneagramResult ? String(enneagramResult.resultKey) : null;
  const mbtiFamily      = mbtiKey ? getMBTIFamily(mbtiKey) : null;
  const enneagramCenter = enneagramKey ? getEnneagramCenter(enneagramKey) : null;
  const mbtiNickname    = mbtiKey ? (mbtiResults[mbtiKey]?.nickname ?? mbtiResult.name) : null;
  const enneagramName   = enneagramKey ? (enneagramResults[enneagramKey]?.nickname ?? enneagramResult.name) : null;

  let body;
  if (mbtiResult && enneagramResult && mbtiFamily && enneagramCenter) {
    body = COMBINATION_TEXTS[mbtiFamily]?.[enneagramCenter]?.(mbtiNickname, enneagramName)
      ?? standaloneBody(mbtiResult, enneagramResult, hasCompleted, scores ?? {});
  } else {
    body = standaloneBody(mbtiResult, enneagramResult, hasCompleted, scores ?? {});
  }

  // ── Strengths (up to 3) ──────────────────────────────────────────────────
  const strengths = [];

  if (hasCompleted && scores) {
    strengths.push(getBig5Strength(scores));
    if      ((scores.N ?? 50) < 36) strengths.push(N_STRENGTHS.low);
    else if ((scores.N ?? 50) > 65) strengths.push(N_STRENGTHS.high);
  }

  if (mbtiResult && strengths.length < 3) {
    const insight = mbtiInsights[mbtiKey];
    if (insight) strengths.push(insight.careerNote.split('.')[0] + '.');
  }

  if (enneagramResult && strengths.length < 3) {
    const insight = enneagramInsights[enneagramKey];
    if (insight) strengths.push(insight.friendships.split('.')[0] + '.');
  }

  if (cakeResult && strengths.length < 3) {
    const cake = cakeResults[cakeResult.resultKey];
    if (cake) {
      strengths.push(
        `In the workplace, your standout strength is ${cake.competency.toLowerCase()} — the ${cake.name} energy you bring is what teams remember long after the project ends.`
      );
    }
  }

  // ── Watch-out (single, most specific available) ──────────────────────────
  let watchOut = null;
  if (enneagramKey && ENNEAGRAM_WATCH_OUTS[enneagramKey]) {
    watchOut = ENNEAGRAM_WATCH_OUTS[enneagramKey];
  } else if (mbtiFamily && MBTI_WATCH_OUTS[mbtiFamily]) {
    watchOut = MBTI_WATCH_OUTS[mbtiFamily];
  } else if (hasCompleted && scores) {
    watchOut = getBig5WatchOut(scores);
  }

  return {
    body,
    strengths: strengths.slice(0, 3),
    watchOut,
    sourceCount,
  };
}
