// Generates a synthesized "Personality Mosaic" summary from all available quiz results.
// Combines Big Five baseline scores with MBTI, Enneagram, and CAKE quiz results
// to produce uplifting insights and a single gentle growth note.

import { mbtiInsights } from '../data/mbtiInsights';
import { enneagramInsights } from '../data/enneagramInsights';
import { cakeResults } from '../data/cakeResults';
import { mbtiResults } from '../data/mbtiResults';
import { enneagramResults } from '../data/enneagramResults';

// Uplifting strength sentences for high Big Five traits
const bigFiveHighStrengths = {
  O: "Your openness to new ideas means you find creative angles others miss — complexity doesn't intimidate you, it intrigues you.",
  C: "Your conscientiousness is a rare asset: you're someone who actually follows through, and that reliability builds deep trust over time.",
  E: "Your extraversion gives you a natural ability to energise and mobilise people — you create momentum wherever you go.",
  A: "Your warmth and agreeableness make people feel genuinely safe with you — you build the kind of trust that takes others years to earn.",
};

// Positive reframe for lower Big Five traits
const bigFiveLowStrengths = {
  O: "You bring a grounding reliability to everything you do — your preference for what works prevents the costly experiments others get burned by.",
  C: "Your flexibility means you adapt quickly and don't get paralysed by perfectionism when the situation calls for speed.",
  E: "Your introversion means you process deeply and speak with care — when you do share, people lean in to listen.",
  A: "Your directness cuts through noise that politeness avoids. Used thoughtfully, that courage is a rare and valuable asset.",
};

// Watch-out notes for Big Five patterns (gentle, constructive)
const bigFiveWatchOuts = {
  N_high: "You feel things fully — which fuels your empathy and depth — but that same sensitivity can leave you carrying weight that isn't yours. Building small recovery routines will protect your energy better than trying to care less.",
  C_high: "Your inner critic can be relentless. Remember that 'good enough' done consistently outperforms 'perfect' left waiting — give yourself the same grace you'd offer someone you respect.",
  O_low: "Watch for a tendency to stick with the familiar even when the map has changed. Staying curious about new approaches, even small ones, is worth the occasional discomfort.",
  C_low: "Important commitments can quietly slip when you're in a flexible flow. A simple system to track what actually matters most will give you the freedom you want without the cost.",
  A_low: "Your directness can land harder than you intend. Pausing a beat before a difficult conversation — just to consider delivery — protects relationships worth keeping.",
};

// Picks the most relevant Big Five strength sentence (top positive trait)
function getBigFiveStrength(scores) {
  const posTraits = ['O', 'C', 'E', 'A'];
  const topTrait = posTraits.reduce((a, b) => (scores[a] ?? 50) >= (scores[b] ?? 50) ? a : b);
  const topScore = scores[topTrait] ?? 50;
  return topScore >= 55
    ? bigFiveHighStrengths[topTrait]
    : bigFiveLowStrengths[topTrait];
}

// Picks the most relevant Big Five watch-out (highest concern signal)
function getBigFiveWatchOut(scores) {
  if ((scores.N ?? 50) > 62) return bigFiveWatchOuts.N_high;
  if ((scores.C ?? 50) > 72) return bigFiveWatchOuts.C_high;

  const posTraits = ['O', 'C', 'A'];
  const lowestTrait = posTraits.reduce((a, b) => (scores[a] ?? 50) <= (scores[b] ?? 50) ? a : b);
  const lowestScore = scores[lowestTrait] ?? 50;
  const key = `${lowestTrait}_low`;
  if (lowestScore < 42 && bigFiveWatchOuts[key]) return bigFiveWatchOuts[key];

  return null;
}

// Extracts the growth-direction sentence from a psyche note
function extractGrowthSentence(psycheText) {
  const match = psycheText.match(/Growth\s+(requires|comes from|direction is)[^.]+\./i);
  return match ? match[0] : null;
}

/**
 * Generates a synthesized personality summary from all available data.
 *
 * @param {object} scores   - Big Five scores { O, C, E, A, N } (0–100 each)
 * @param {boolean} hasCompleted - Whether the Big Five baseline is done
 * @param {object} quizResults  - Object containing quiz result entries { mbti?, enneagram?, cake? }
 * @returns {{ headline, body, strengths, watchOut, sourceCount } | null}
 *   Returns null if fewer than 2 data sources are available.
 */
export function generateProfileSummary({ scores, hasCompleted, quizResults }) {
  const mbtiResult = quizResults?.mbti;
  const enneagramResult = quizResults?.enneagram;
  const cakeResult = quizResults?.cake;

  const sourceCount = [hasCompleted, !!mbtiResult, !!enneagramResult, !!cakeResult].filter(Boolean).length;
  if (sourceCount < 2) return null;

  const strengths = [];
  let watchOut = null;

  // ── Big Five ─────────────────────────────────────────────────────────────
  if (hasCompleted && scores) {
    strengths.push(getBigFiveStrength(scores));

    // Low-neuroticism resilience is worth calling out explicitly
    if ((scores.N ?? 50) < 36) {
      strengths.push("Your emotional resilience under pressure is a quiet superpower — you bring steadiness to situations that would unsettle most people.");
    }

    watchOut = getBigFiveWatchOut(scores);
  }

  // ── MBTI ─────────────────────────────────────────────────────────────────
  if (mbtiResult) {
    const key = mbtiResult.resultKey;
    const insight = mbtiInsights[key];
    if (insight) {
      // First sentence of the career note as a strength
      const careerFirst = insight.careerNote.split('.')[0] + '.';
      if (strengths.length < 3) strengths.push(careerFirst);

      // Watch-out: extract the growth sentence from the psyche note
      if (!watchOut) {
        watchOut = extractGrowthSentence(insight.psyche);
      }
    }
  }

  // ── Enneagram ────────────────────────────────────────────────────────────
  if (enneagramResult) {
    const key = String(enneagramResult.resultKey);
    const insight = enneagramInsights[key];
    if (insight) {
      // First sentence of the friendship note as a strength
      const friendFirst = insight.friendships.split('.')[0] + '.';
      if (strengths.length < 3) strengths.push(friendFirst);

      if (!watchOut) {
        watchOut = extractGrowthSentence(insight.psyche);
      }
    }
  }

  // ── CAKE ─────────────────────────────────────────────────────────────────
  if (cakeResult) {
    const key = cakeResult.resultKey;
    const cake = cakeResults[key];
    if (cake && strengths.length < 3) {
      strengths.push(
        `In the workplace, your standout strength is ${cake.competency.toLowerCase()} — the ${cake.name} energy you bring is what teams remember long after the project ends.`
      );
    }
  }

  // ── Opening body sentence ────────────────────────────────────────────────
  let body = '';

  if (mbtiResult && enneagramResult) {
    const mbtiNickname = mbtiResults[mbtiResult.resultKey]?.nickname || mbtiResult.name;
    const enneagramNickname = enneagramResults[String(enneagramResult.resultKey)]?.nickname || enneagramResult.name;
    body = `The ${mbtiNickname} mind paired with ${enneagramNickname} depth — that's a rare combination that gives you both strategic vision and real emotional presence. These frameworks are pointing at the same person from different angles, and the picture they form is distinctly yours.`;
  } else if (mbtiResult) {
    const mbtiNickname = mbtiResults[mbtiResult.resultKey]?.nickname || mbtiResult.name;
    body = `As ${mbtiResult.name} — the ${mbtiNickname} — you carry a distinct way of seeing the world that shapes how you connect, create, and make decisions. Your Big Five profile adds texture to that picture, showing exactly where your wiring runs deepest.`;
  } else if (enneagramResult) {
    const enneagramNickname = enneagramResults[String(enneagramResult.resultKey)]?.nickname || enneagramResult.name;
    body = `As a Type ${enneagramResult.resultKey} ${enneagramNickname}, your core motivations run deep and give your actions a consistency that the people around you feel — even when they can't name it. Your Big Five profile fills in the day-to-day texture of that character.`;
  } else if (cakeResult) {
    const key = cakeResult.resultKey;
    const cake = cakeResults[key];
    body = `Your personality profile and ${cake?.competency.toLowerCase() ?? 'workplace'} strengths together paint a picture of someone with a clear, distinctive style — both in how you think and in how you show up for others.`;
  }

  return {
    body,
    strengths: strengths.slice(0, 3),
    watchOut,
    sourceCount,
  };
}
