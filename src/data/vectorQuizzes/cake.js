// What Cake Are You? — vector quiz data module.
//
// Conversion of the original CAKE workplace-competency quiz
// (src/data/cakeResults.js) to the vector-matching experience. Every cake is
// a position in 4-axis workplace-personality space; matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in cake.test.js re-verifies reachability/entropy/sensitivity after
// every roster or question edit — run it before shipping ANY change here.
//
// All six original resultKeys (layercake, cupcake, macaron, strawberrycake,
// rollcake, tiramisu) are preserved exactly — users' saved results reference
// them. Each entry carries store:{trait, competency} because the friend-
// compatibility engine (src/utils/compatibility.js) reads the stored
// result.trait code (AO/PS/IN/TM/AD/INF) and result.competency label; both
// are copied verbatim from cakeResults.js. Do not edit the codes.
//
// Axes: [tempo, social, novelty, spotlight], each in [-1, 1]
//   tempo:     -1 deliberate      / +1 full speed
//   social:    -1 heads-down      / +1 people-first
//   novelty:   -1 proven playbook / +1 reinvention
//   spotlight: -1 backstage       / +1 front of room

/* ---------- roster: every cake is a direction in 4-space ---------- */
const CHARS = {
  layercake:{name:"Layer Cake", tag:"The Thousand-Layer Engine", tier:"front", glyph:"cube", aura:"#f39c3d", img:null, emoji:"🎂",
    v:[.95,.10,-.30,.20], kindred:"rollcake", rival:"macaron",
    store:{trait:"AO", competency:"Action Oriented"},
    traits:["Action Oriented","Relentless","Grounded","Dependable","Finisher"],
    desc:"You don't wait for perfect conditions — you stack progress one layer at a time until the finish line has no choice but to show up. While the room is still debating the plan, you've already shipped the first slice and learned something from it. Deadlines relax when they see your name on the project, because everyone knows you finish what you start."},
  cupcake:{name:"Cupcake", tag:"The Wrapped Surprise", tier:"front", glyph:"hex", aura:"#5fb3e8", img:null, emoji:"🧁",
    v:[-.35,-.70,.45,-.55], kindred:"macaron", rival:"tiramisu",
    store:{trait:"PS", competency:"Problem Solving"},
    traits:["Problem Solving","Analytical","Patient","Understated","Ingenious"],
    desc:"You look unassuming right up until someone unwraps the problem nobody else could touch. Where the rest of the team sees a wall, you see a puzzle with a seam in it, and you take a quiet, methodical pleasure in prying it open. At the critical moment, you're the one who breaks the blind spot for everyone."},
  macaron:{name:"Macaron", tag:"The Pastel Original", tier:"front", glyph:"bloom", aura:"#cf8ef0", img:null, emoji:"🫠",
    v:[.30,.00,.95,.45], kindred:"cupcake", rival:"rollcake",
    store:{trait:"IN", competency:"Innovation"},
    traits:["Innovation","Inventive","Playful","Aesthetic","Unexpected"],
    desc:"You take the most tedious task on the board and hand it back as something nobody has ever seen before. Process bores you and possibility doesn't — your instinct to reimagine the obvious is your sharpest professional asset. Even your spreadsheets have a color story."},
  strawberrycake:{name:"Strawberry Cake", tag:"The Break-Room Heartbeat", tier:"front", glyph:"blossom", aura:"#f06a8a", img:null, emoji:"🍓",
    v:[.15,.95,.10,.30], kindred:"tiramisu", rival:"cupcake",
    store:{trait:"TM", competency:"Teamwork"},
    traits:["Teamwork","Warm","Cheerful","Trusted","Uniting"],
    desc:"You give off a warmth that makes collaboration feel less like a meeting and more like a treat. People don't just want to work with you — they quietly want to work for you, because you handle every task with a smooth, human touch. Teams cohere around you the way frosting holds a cake together."},
  rollcake:{name:"Roll Cake", tag:"The Meticulous Swirl", tier:"front", glyph:"spiral", aura:"#3cc8a8", img:null, emoji:"🍥",
    v:[-.90,-.35,-.60,-.45], kindred:"layercake", rival:"macaron",
    store:{trait:"AD", competency:"Attention to Detail"},
    traits:["Attention to Detail","Thorough","Careful","Steady","Reassuring"],
    desc:"You're a perfectionist with cream-filled patience — careful, thorough, and impossible to rattle. Nothing slips through the cracks on your watch, and everyone around you breathes a little easier just knowing you've double-checked it. Your thoroughness is the invisible scaffolding holding the whole project's quality up."},
  tiramisu:{name:"Tiramisu", tag:"The Espresso-Dark Closer", tier:"front", glyph:"diamond", aura:"#c8a878", img:null, emoji:"☕",
    v:[.45,.45,.20,.95], kindred:"strawberrycake", rival:"rollcake",
    store:{trait:"INF", competency:"Influence"},
    traits:["Influence","Confident","Persuasive","Ambitious","Composed"],
    desc:"You carry a grown-up, espresso-dark confidence that makes people want to follow wherever you're headed. You take calculated risks with steady hands and sell the vision so well that the room leaves genuinely excited to move. When you speak, even the deadlines sit up straighter."}
};

/* ---------- questions: weight vector [tempo, social, novelty, spotlight] ---------- */
const Q = [
  {t:"Started beats perfect — I'd rather ship a rough version today than a polished one next month.",  w:[ 1, 0, 0, 0]},
  {t:"I read the instructions all the way to the end before I touch a single thing.",                  w:[-1, 0, 0, 0]},
  {t:"My best workdays are the loud ones — whiteboards, snacks, and a plan coming together out loud.", w:[ 0, 1, 0, 0]},
  {t:"Give me a quiet desk, good headphones, and a meaty to-do list, and I'm completely content.",     w:[ 0,-1, 0, 0]},
  {t:"The moment someone says 'this is how we've always done it,' I start redesigning it in my head.", w:[ 0, 0, 1, 0]},
  {t:"I'll take the method that's worked a hundred times over the shiny idea that's worked once.",     w:[ 0, 0,-1, 0]},
  {t:"Hand me the clicker — presenting to a packed room fires me up instead of scaring me.",           w:[ 0, 0, 0, 1]},
  {t:"I'd rather my work get the applause than my name — the spotlight can happily skip me.",          w:[ 0, 0, 0,-1]},
  {t:"I want my work to have a signature — a little flair that says somebody cared about this.",       w:[ 0, 0, .6, .4]},
  {t:"When a project stalls, my first move is to gather the people, not to grind it out alone.",       w:[ 0, .7, 0, .3]}
];
const AXMAX=[2, 2.7, 2.6, 2.7];
const SPECTRA=[
  {l:"Deliberate", r:"Full Speed"},
  {l:"Heads-Down", r:"People-First"},
  {l:"Proven Playbook", r:"Reinvention"},
  {l:"Backstage", r:"Front of Room"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'cake',
  quizName: 'What Cake Are You?',
  eyebrow: 'The Workplace Bakery Test',
  title: { pre: 'What ', em: 'Cake', post: ' Are You?' },
  lede: 'Ten statements, one honest read of your professional flavor. Answer as the coworker you actually are on deadline day — the slice everyone secretly counts on.',
  seal: { char: '🍰' },
  rosterNoun: 'cakes',
  beginLabel: 'Start the tasting',
  tierLabels: { front: 'Dessert Case', cut: 'Secret Menu' },
  shareEmoji: '🍰',
  shareGradient: 'from-rose-400 to-amber-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the What Cake Are You? workplace test. mypersonalityquizzes.com/quiz/cake`,
  disclaimer: 'Original emblems generated for this quiz. A light-hearted look at workplace strengths, served as dessert — not a validated psychometric assessment or a hiring tool.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
