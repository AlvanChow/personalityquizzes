// What's Your Red Flag? — vector quiz data module.
//
// The confessional sibling of the Toxic Trait quiz: eight dating-flavored
// warning labels placed evenly around a 2-axis space; matching is cosine
// similarity (see src/utils/vectorQuiz.js). The Monte-Carlo battery in
// red_flag.test.js re-verifies reachability/entropy/sensitivity after every
// roster or question edit — run it before shipping ANY change.
//
// Axes: [pursuit, openness], each in [-1, 1]
//   pursuit:  -1 keeps distance   / +1 comes on strong
//   openness: -1 cards held close / +1 no filter
//
// The eight sit at 45° intervals so no result shadows another. freespirit
// carries the smallest magnitude on purpose: an all-neutral taker falls back
// (nearest-point) to the gentlest read.

/* ---------- roster: every flag is a direction in 2-space ---------- */
const CHARS = {
  lovebomber:{name:"The Love Bomber", tag:"Soulmates by Thursday", tier:"front", glyph:"flame", aura:"#e0483e", img:null, emoji:"💘",
    v:[.92,.38], kindred:"debater", rival:"breadcrumber",
    traits:["Romantic","All-in","Generous","Fast","Blinding"],
    desc:"By date two you've imagined the apartment, named the dog, and drafted the toast for a wedding no one has proposed. Your affection is genuine and enormous — that's the beautiful part. The flag is the throttle: you go from zero to 'us' so fast that nobody, including you, has checked whether the road actually goes there."},
  debater:{name:"The Debater", tag:"Actually, One More Point", tier:"front", glyph:"sound", aura:"#e8a23a", img:null, emoji:"⚖️",
    v:[.38,.92], kindred:"lovebomber", rival:"fortress",
    traits:["Sharp","Honest","Engaged","Relentless","Exhausting"],
    desc:"To you, a spirited argument is intimacy — you don't debate people you don't respect. You'll take the other side of anything, including your own opinion from ten minutes ago, purely because the conversation deserved better. The flag: not every dinner is a courtroom, and 'winning' a date is a strange trophy to bring home."},
  therapist:{name:"The Unlicensed Therapist", tag:"And How Did That Make You Feel?", tier:"front", glyph:"ripple", aura:"#8b7ae8", img:null, emoji:"🛋️",
    v:[-.38,.92], kindred:"debater", rival:"detective",
    traits:["Insightful","Curious","Articulate","Analytical","Deflecting"],
    desc:"You can diagnose a stranger's attachment style from across a coffee shop, and you narrate everyone's patterns beautifully — everyone's except yours. Analysis is how you stay close to feelings without being caught inside one. The flag: at some point someone will ask how YOU feel, and 'that's interesting, let's unpack why you asked' won't count."},
  freespirit:{name:"The Free Spirit", tag:"Labels Are for Jars", tier:"front", glyph:"butterfly", aura:"#7ec49a", img:null, emoji:"🪁",
    v:[-.87,.36], kindred:"breadcrumber", rival:"fixer",
    traits:["Independent","Fun","Spontaneous","Light","Uncatchable"],
    desc:"You're a fantastic time and a terrible forecast. Everything is easy, breezy, and wonderful right up until the words 'so what are we?' enter the room and you begin describing yourself as a wanderer. You're not dishonest — you really don't know. The flag is that 'keeping it casual' has a shelf life, and someone's usually still holding it after the date."},
  breadcrumber:{name:"The Breadcrumber", tag:"A Like at Midnight", tier:"front", glyph:"sand", aura:"#c9a06a", img:null, emoji:"🍞",
    v:[-.92,-.38], kindred:"freespirit", rival:"lovebomber",
    traits:["Charming","Elusive","Busy","Warm-ish","Intermittent"],
    desc:"You never quite leave and never quite arrive. A story reaction here, a 'we should hang soon!' there — just enough warmth to keep the fire lit, never enough to cook anything. You tell yourself you're being friendly and keeping doors open. The flag: a door held slightly open for years is just a draft, and someone's standing in it."},
  fortress:{name:"The Fortress", tag:"We'll Get to My Childhood Never", tier:"front", glyph:"cube", aura:"#8a93a8", img:null, emoji:"🏰",
    v:[-.38,-.92], kindred:"breadcrumber", rival:"debater",
    traits:["Composed","Private","Steady","Self-sufficient","Sealed"],
    desc:"You are a wonderful listener, an excellent partner on paper, and a complete mystery to everyone who's dated you. Vulnerability feels like handing out copies of your house key, so you deflect with competence and jokes that land. The flag: people can't love what you won't show them — they just love the lobby, and even you get lonely in there."},
  detective:{name:"The Detective", tag:"Season 3, Episode 7: Their Ex", tier:"front", glyph:"eye", aura:"#5f88c4", img:null, emoji:"🔍",
    v:[.38,-.92], kindred:"fortress", rival:"therapist",
    traits:["Perceptive","Thorough","Protective","Suspicious","Unblinking"],
    desc:"Within 48 hours you know their ex, their ex's new partner, and a vacation from 2019 that raises several questions. You call it due diligence; your friends call it a federal investigation. The instinct is self-protection — you've been surprised before and you don't intend to be again. The flag: trust built on surveillance isn't trust. Also, you WILL accidentally like something from 34 weeks ago."},
  fixer:{name:"The Project Manager", tag:"So Much Potential", tier:"front", glyph:"gear", aura:"#e07a4a", img:null, emoji:"🔧",
    v:[.92,-.38], kindred:"lovebomber", rival:"freespirit",
    traits:["Supportive","Ambitious","Devoted","Visionary","Renovating"],
    desc:"You don't date people so much as adopt promising drafts. You see the future version of everyone — two habits, one haircut, and a LinkedIn update away — and you'll happily project-manage the transformation for free. Your belief in people is genuinely moving. The flag: they came for a relationship and got a development plan, and nobody signed off on the roadmap."}
};

/* ---------- questions: weight vector [pursuit, openness] ---------- */
const Q = [
  {t:"When I like someone, they know within 48 hours — subtlety has never been my strong suit.",                               w:[ 1, 0]},
  {t:"I've been accused of playing it cool so well that nobody could tell I was playing at all.",                              w:[-1, 0]},
  {t:"My idea of romance is full-throttle: constant texts, big plans, soon.",                                                  w:[ 1, 0]},
  {t:"The moment someone wants to define things, part of me starts checking where the exits are.",                            w:[-1, 0]},
  {t:"I'll say the honest thing on date one that most people save for month three.",                                           w:[ 0, 1]},
  {t:"There are whole chapters of my life that even my closest people have never heard.",                                      w:[ 0,-1]},
  {t:"If we disagree, we're finishing the conversation — I've never met a hill I wouldn't at least visit.",                    w:[ 0, 1]},
  {t:"I research new people thoroughly before I trust them. Thoroughly.",                                                     w:[ 0,-1]},
  {t:"I fall fast, say everything, and regret nothing until approximately 2am.",                                               w:[ .5, .5]},
  {t:"I keep things light and undefined on purpose — mystery is a feature, not a bug.",                                        w:[-.5,-.5]}
];
const AXMAX=[5, 5];
const SPECTRA=[
  {l:"Keeps Distance", r:"Comes On Strong"},
  {l:"Cards Close", r:"No Filter"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'red_flag',
  quizName: 'Red Flag Detector',
  eyebrow: 'The Confessional',
  title: { pre: "What's Your ", em: 'Red Flag', post: '?' },
  lede: "Ten statements about how you actually date, flirt, and dodge. Answer honestly — your friends already know the answer anyway — and we'll hand you your flag with ceremony.",
  seal: { char: '🚩' },
  rosterNoun: 'red flags',
  beginLabel: 'Raise my flag',
  tierLabels: { front: 'Red Flag', cut: 'Red Flag' },
  shareEmoji: '🚩',
  shareGradient: 'from-rose-400 to-red-500',
  copyLine: (name, tag, match) =>
    `My red flag is ${name} — "${tag}" (${match}% match). Find yours: mypersonalityquizzes.com/quiz/red_flag`,
  disclaimer: "A self-aware bit, not relationship advice. Every flag here is a normal human tendency turned up one notch too far — and knowing yours is genuinely most of the fix. Date kindly; the person across the table has a flag too.",
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
