// What's Your Work Style? (DISC) — vector quiz data module.
//
// Conversion of the original 'pick'-mode DISC quiz (src/data/quizzes/disc.js)
// to the vector-matching experience. Every work style is a position in 2-axis
// personality space; matching is cosine similarity (see src/utils/vectorQuiz.js
// for the why). The Monte-Carlo battery in disc.test.js re-verifies
// reachability/entropy/sensitivity after every roster or question edit — run
// it before shipping ANY change to this file.
//
// All four original resultKeys (driver, influencer, steadier, analyst) are
// preserved exactly (saved results reference them). No additions: DISC is a
// four-quadrant framework, and each style owns its quadrant.
//
// Axes: [focus, pace], each in [-1, 1]
//   focus: -1 task-focused / +1 people-focused
//   pace:  -1 reserved     / +1 outgoing
//
//   Dominance (driver)            = task + outgoing
//   Influence (influencer)        = people + outgoing
//   Steadiness (steadier)         = people + reserved
//   Conscientiousness (analyst)   = task + reserved

/* ---------- roster: every work style is a direction in 2-space ---------- */
const CHARS = {
  driver:{name:"The Driver", tag:"The Momentum Engine", tier:"front", glyph:"lightning", aura:"#e8543f", img:null, emoji:"🚀",
    v:[-.65,.80], kindred:"influencer", rival:"steadier",
    traits:["Decisive","Direct","Fast-moving","Accountable","Bold"],
    desc:"You turn ambiguity into a decision and a decision into motion, usually before the rest of the room has finished describing the problem. You'd rather make a good call today than a perfect one next quarter, and owning the outcome isn't a burden to you — it's oxygen. When the stakes are high and the clock is loud, everyone quietly looks your way, because they know you'll make the call."},
  influencer:{name:"The Influencer", tag:"The Energy Multiplier", tier:"front", glyph:"burst", aura:"#f2b437", img:null, emoji:"✨",
    v:[.72,.82], kindred:"driver", rival:"analyst",
    traits:["Magnetic","Optimistic","Persuasive","Warm","Spontaneous"],
    desc:"You work through connection: ideas come alive when you talk about them, and half your best thinking happens in the conversations other people would call detours. You spot possibilities early, get genuinely excited about them, and — this is the rare part — get everyone else excited too. The web of goodwill you build ends up carrying projects further than any process chart ever could."},
  steadier:{name:"The Steadier", tag:"The Calm Constant", tier:"front", glyph:"leaf", aura:"#4cc38a", img:null, emoji:"🌿",
    v:[.85,-.62], kindred:"analyst", rival:"driver",
    traits:["Reliable","Patient","Loyal","Calm","Supportive"],
    desc:"You're the person teams quietly build themselves around — the one who listens more than you talk and delivers exactly what you promised, week after week. You notice a struggling teammate long before they say a word, and when everything wobbles, your consistency is what everyone else calibrates against. You don't need the spotlight; you need the work to be good and the people to be okay."},
  analyst:{name:"The Analyst", tag:"The Precision Instrument", tier:"front", glyph:"gear", aura:"#6f8ce8", img:null, emoji:"📐",
    v:[-.82,-.72], kindred:"steadier", rival:"influencer",
    traits:["Precise","Rigorous","Thorough","Independent","Principled"],
    desc:"You believe good work should be correct, not merely convincing, and you hold your own output to a standard nobody would dare impose on you. You read the fine print others skip and ask the quiet question that exposes the flaw in slide four before it becomes a crisis in month four. When something absolutely cannot be wrong, you're the person everyone wants holding the pen."}
};

/* ---------- questions: weight vector [focus, pace] ---------- */
const Q = [
  {t:"How my teammates are doing matters more to me than how the task list is doing.",                w:[ 1, 0]},
  {t:"Once I know the goal, I'd happily skip the small talk and get straight to work.",               w:[-1, 0]},
  {t:"I'd rather the team feel great about a good result than feel tense about a perfect one.",       w:[ 1, 0]},
  {t:"I judge a week by what actually got finished, not by how nice the meetings felt.",              w:[-1, 0]},
  {t:"I think out loud — my best ideas show up mid-sentence, preferably with an audience.",           w:[ 0, 1]},
  {t:"I like to sleep on big decisions before I say them out loud.",                                  w:[ 0,-1]},
  {t:"I'd rather start now and steer as we go than wait around for perfect conditions.",              w:[ 0, 1]},
  {t:"Slow and steady genuinely wins — I'd rather do it once, carefully, than twice in a hurry.",     w:[ 0,-1]},
  {t:"A room full of people I've never met sounds energizing, not exhausting.",                       w:[ .5, .5]},
  {t:"When a deadline heats up, I get blunter and faster — pressure just sharpens me.",               w:[-.5, .5]}
];
const AXMAX=[5, 5];
const SPECTRA=[
  {l:"Task-Focused", r:"People-Focused"},
  {l:"Reserved", r:"Outgoing"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'disc',
  quizName: 'DISC Work Style',
  eyebrow: 'The DISC Framework',
  title: { pre: "What's Your ", em: 'Work Style', post: '?' },
  lede: 'Ten statements, one honest read of how you actually operate — on teams, under deadlines, in the meeting that could have been an email. Answer as the colleague you are on a normal Tuesday, not the one on your résumé.',
  seal: { char: '🎯' },
  rosterNoun: 'work styles',
  beginLabel: 'Start the assessment',
  tierLabels: { front: 'Core Style', cut: 'Deep Cut' },
  shareEmoji: '🎯',
  shareGradient: 'from-amber-500 to-orange-600',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the What's Your Work Style? (DISC) test. mypersonalityquizzes.com/quiz/disc`,
  disclaimer: 'Original emblems generated for this quiz. Inspired by the classic DISC framework (Dominance, Influence, Steadiness, Conscientiousness) — a light-hearted self-reflection, not a validated psychometric assessment or a hiring tool.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
