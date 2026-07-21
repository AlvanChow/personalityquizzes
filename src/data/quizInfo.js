/**
 * Honest, factual "about this quiz" metadata, keyed by quiz key.
 *
 * This powers the pre-quiz info panel (QuizInfoPanel). It is intentionally
 * factual — no invented ratings or "N million taken" numbers. `basedOn` names
 * the real framework each quiz draws on; `tier` is an honest credibility label:
 *
 *   research   — grounded in peer-reviewed personality/psychology research
 *   framework  — an established, popular framework (widely used; scientific
 *                rigor is debated — e.g. MBTI, Enneagram, DISC)
 *   reflective — a structured self-reflection / coaching exercise, not a test
 *   fun        — for entertainment; a character/vibe match, not a measurement
 *
 * `format` describes how the questions work so people know what to expect.
 * Question counts are NOT stored here — each quiz passes its real
 * questions.length to the panel so the number can never drift out of sync.
 */
export const QUIZ_INFO = {
  // ── Core ──────────────────────────────────────────────────────────────────
  big5:              { basedOn: 'the Big Five (OCEAN) model', tier: 'research',  format: 'Agree/disagree, 1–5' },
  'big5-deep':       { basedOn: 'the IPIP 50-item Big Five inventory', tier: 'research', format: 'Agree/disagree, 1–5' },
  mbti:              { basedOn: 'the Myers–Briggs / Jungian type framework', tier: 'framework', format: 'Agree/disagree, 1–5' },
  'mbti-deep':       { basedOn: 'the Open Extended Jungian Type Scales', tier: 'framework', format: 'Forced choice' },
  enneagram:         { basedOn: 'the Enneagram of Personality', tier: 'framework', format: 'Agree/disagree, 1–5' },
  'enneagram-deep':  { basedOn: 'the Enneagram core fears & desires model', tier: 'framework', format: 'Weighted inventory' },

  // ── Know Yourself ───────────────────────────────────────────────────────────
  riasec:            { basedOn: "Holland's Codes (RIASEC)", tier: 'research', format: 'Agree/disagree, 1–5' },
  love_language:     { basedOn: "Chapman's Five Love Languages", tier: 'framework', format: 'Pick a side' },
  attachment:        { basedOn: 'attachment theory (Bowlby & Ainsworth)', tier: 'research', format: 'Agree/disagree, 1–5' },
  disc:              { basedOn: 'the DISC model', tier: 'framework', format: 'Pick a side' },
  ikigai:            { basedOn: 'the Japanese concept of ikigai', tier: 'reflective', format: 'Reflective prompts' },
  values:            { basedOn: "Schwartz's Theory of Basic Human Values", tier: 'research', format: 'Pick a side' },
  eq:                { basedOn: 'the four-domain model of emotional intelligence', tier: 'research', format: 'Agree/disagree, 1–5' },
  mindset:           { basedOn: "Dweck's growth-mindset research", tier: 'research', format: 'Agree/disagree, 1–5' },
  grit:              { basedOn: "Duckworth's Grit Scale", tier: 'research', format: 'Agree/disagree, 1–5' },
  lifewheel:         { basedOn: 'the Wheel of Life coaching tool', tier: 'reflective', format: 'Rate each area' },

  // ── Just for Fun (self) ─────────────────────────────────────────────────────
  house:             { basedOn: 'the Wizarding World houses', tier: 'fun', format: 'Pick a side' },
  cake:              { basedOn: 'a playful work-style match', tier: 'fun', format: 'Pick a side' },

  // ── Pop culture character matches — all just for fun ────────────────────────
  nba:               { basedOn: 'an NBA-legend personality match', tier: 'fun', format: 'Pick a side' },
  soccer:            { basedOn: 'a soccer-icon personality match', tier: 'fun', format: 'Pick a side' },
  naruto:            { basedOn: 'a Naruto-character alignment match', tier: 'fun', format: 'Agree/disagree, 1–5' },
  onepiece:          { basedOn: 'a One Piece crew match', tier: 'fun', format: 'Pick a side' },
  starwars:          { basedOn: 'a Star Wars character match', tier: 'fun', format: 'Pick a side' },
  superhero:         { basedOn: 'a superhero personality match', tier: 'fun', format: 'Pick a side' },
  disney:            { basedOn: 'a Disney-hero personality match', tier: 'fun', format: 'Pick a side' },
  office:            { basedOn: 'a characters-of-The-Office match', tier: 'fun', format: 'Pick a side' },
  friends:           { basedOn: 'a Friends character match', tier: 'fun', format: 'Pick a side' },
  pokemon:           { basedOn: 'a starter-Pokémon match', tier: 'fun', format: 'Pick a side' },
  eras:              { basedOn: 'a Taylor Swift era match', tier: 'fun', format: 'Pick a side' },
};

export function getQuizInfo(quizKey) {
  return QUIZ_INFO[quizKey] ?? null;
}

export const TIER_LABEL = {
  research: 'Research-based',
  framework: 'Popular framework',
  reflective: 'Reflective exercise',
  fun: 'Just for fun',
};

// One-line "Based on X · <credibility>" string for quizzes whose intro already
// has its own layout (the immersive core/vector flows) — rendered in each
// quiz's native style rather than the full QuizInfoPanel card.
export function getQuizFactsLine(quizKey) {
  const info = QUIZ_INFO[quizKey];
  if (!info) return null;
  return `Based on ${info.basedOn} · ${TIER_LABEL[info.tier]}`;
}
