// What's Your Attachment Style? — vector quiz data module.
//
// Conversion of the original 'pick'-mode attachment quiz
// (src/data/quizzes/attachment.js) to the vector-matching experience.
// Every style is a position in 2-axis space — the two dimensions the real
// attachment model actually uses — and matching is cosine similarity
// (see src/utils/vectorQuiz.js for the why). The Monte-Carlo battery in
// attachment.test.js re-verifies reachability/entropy/sensitivity after
// every roster or question edit — run it before shipping ANY change here.
//
// All four original resultKeys are preserved exactly (saved results
// reference them); the roster is the four styles of the model — nothing
// invented, nothing dropped. Tone is warm and educational, never clinical:
// every style is written strengths-first, and growth is framed hopefully.
//
// Axes: [anxiety, avoidance], each in [-1, 1]
//   anxiety:   -1 settled   / +1 watchful   (how loud the worry radar runs)
//   avoidance: -1 leans in  / +1 keeps space (how closeness itself feels)
//
// The four styles are the four quadrants of that plane — which is exactly
// why direction matching works so cleanly here: each style owns ~90° of sky.
// secure sits at the smallest magnitude on purpose, so an all-neutral taker
// falls back (nearest-point) to the mildest read, not an intense one.

/* ---------- roster: every style is a direction in 2-space ---------- */
const CHARS = {
  secure:{name:"Secure", tag:"The Steady Harbor", tier:"front", glyph:"tree", aura:"#4fbf7a", img:null, emoji:"🌳",
    v:[-.75,-.75], kindred:"anxious", rival:"fearful",
    traits:["Steady","Open","Direct","Trusting","Restful"],
    desc:"Closeness feels like home to you, and distance doesn't read as danger — you can say \"that stung\" without bracing for disaster and hear it back without crumbling. People tend to exhale around you, because your steadiness quietly gives them permission to be fully themselves. It isn't that you never worry; it's that connection, for you, is a place to rest instead of a puzzle to solve."},
  anxious:{name:"Anxious-Preoccupied", tag:"The Wholehearted Tide", tier:"front", glyph:"wave", aura:"#f2a94e", img:null, emoji:"🌊",
    v:[.85,-.70], kindred:"secure", rival:"avoidant",
    traits:["Devoted","Attuned","Expressive","Loyal","Deep-feeling"],
    desc:"You love with the volume all the way up — you catch the smallest shift in tone, remember everything that matters to your people, and show up with a devotion most only talk about. The same fine-tuned radar that makes you so attuned can spin stories in the quiet moments, turning a slow reply into a verdict it never was. Your love was never the problem; learning to feel safe inside it is the adventure."},
  avoidant:{name:"Dismissive-Avoidant", tag:"The Quiet Summit", tier:"front", glyph:"shadow", aura:"#8fb0d6", img:null, emoji:"🏔️",
    v:[-.70,.85], kindred:"secure", rival:"anxious",
    traits:["Self-reliant","Calm","Private","Dependable","Unflappable"],
    desc:"You're wonderfully self-contained — calm in a crisis, unbothered by drama, and genuinely at ease in your own company. Your love runs practical and understated: you show it by being dependable, fixing what's broken, and honoring other people's independence the way you treasure your own. Letting someone see you mid-struggle, not just after you've handled it, is your next frontier — and it deepens bonds far more often than it burdens them."},
  fearful:{name:"Fearful-Avoidant", tag:"The Brave In-Between", tier:"front", glyph:"butterfly", aura:"#a884e0", img:null, emoji:"🌗",
    v:[.80,.75], kindred:"anxious", rival:"secure",
    traits:["Perceptive","Empathetic","Layered","Courageous","Protective"],
    desc:"You hold two truths at once — a deep longing for closeness and a well-earned caution about it — which makes you fluent in both the heart that reaches and the heart that retreats. That lived complexity gives your empathy a depth nobody can fake, and the people you let in are protected fiercely. Choosing connection anyway, even when part of you wants to bolt, is a quiet courage most people never have to find."}
};

/* ---------- questions: weight vector [anxiety, avoidance] ---------- */
const Q = [
  {t:"When someone I love takes ages to answer a message, my mind starts drafting theories about what changed.", w:[ 1,  0]},
  {t:"When life gets heavy, my first instinct is to go quiet and handle it alone before anyone notices.",        w:[ 0,  1]},
  {t:"If a close friend seems distant this week, I figure it's about their week — not a verdict on me.",         w:[-1,  0]},
  {t:"Saying things like \"I missed you\" or \"you matter to me\" out loud comes easily to me.",                 w:[ 0, -1]},
  {t:"After a good hangout, I sometimes replay the whole thing, scanning for a moment I got wrong.",             w:[ 1,  0]},
  {t:"When emotions get intense fast, I feel a pull to step back and get some air.",                             w:[ 0,  1]},
  {t:"When someone tells me we're good, I take them at their word and actually stop worrying.",                  w:[-1,  0]},
  {t:"Leaning on someone during a rough patch feels natural to me — that's what closeness is for.",              w:[ 0, -1]},
  {t:"The closer a relationship gets to really mattering, the more some part of me eyes the exit.",              w:[ .5, .5]},
  {t:"I can be all-in with someone and completely fine when we're apart — both feel easy.",                      w:[-.5,-.5]}
];
const AXMAX=[5, 5];
const SPECTRA=[
  {l:"Settled", r:"Watchful"},
  {l:"Leans In", r:"Keeps Space"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'attachment',
  quizName: 'Attachment Style Quiz',
  eyebrow: 'The Closeness Blueprint',
  title: { pre: "What's Your ", em: 'Attachment', post: ' Style?' },
  lede: 'Ten honest statements about how closeness actually feels to you. There are no wrong answers and no broken styles — just the pattern your heart learned first, and every pattern can grow.',
  seal: { char: '🫂' },
  rosterNoun: 'styles',
  beginLabel: 'Trace my blueprint',
  tierLabels: { front: 'Core Style', cut: 'Core Style' },
  shareEmoji: '🫂',
  shareGradient: 'from-sky-400 to-blue-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the What's Your Attachment Style? quiz. mypersonalityquizzes.com/quiz/attachment`,
  disclaimer: 'For reflection, not diagnosis. Attachment styles are patterns, not permanent labels — they soften and shift with awareness, safe relationships, and time. This quiz is a friendly introduction to a rich area of psychology; if closeness feels genuinely hard right now, a good therapist is worth a hundred quizzes.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
