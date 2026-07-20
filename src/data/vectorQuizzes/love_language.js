// How You Give & Receive Love — vector quiz data module.
//
// Conversion of the original 'pick'-mode love-style quiz
// (src/data/quizzes/loveLanguage.js) to the vector-matching experience.
// Every love language is a position in 3-axis affection space; matching is
// cosine similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in love_language.test.js re-verifies reachability/entropy/
// sensitivity after every roster or question edit — run it before shipping
// ANY change to this file.
//
// All five original resultKeys (words, time, gifts, acts, touch) are
// preserved exactly (saved results reference them). No additions: the five
// languages are the framework, and each owns its own direction.
//
// Axes: [channel, medium, proximity], each in [-1, 1]
//   channel:   -1 shown (deeds, things)     / +1 spoken (words said out loud)
//   medium:    -1 keepsakes (things to hold) / +1 shared hours (time together)
//   proximity: -1 carries any distance      / +1 needs arm's reach
//
//   Words of Affirmation  = spoken, travels any distance
//   Quality Time          = shared hours, mildly up close
//   Thoughtful Gifts      = shown, keepsakes, travels any distance
//   Acts of Service       = strongly shown, quietly practical
//   Physical Touch        = up close, leaning shared hours

/* ---------- roster: every love language is a direction in 3-space ---------- */
const CHARS = {
  words:{name:"Words of Affirmation", tag:"The Heart Out Loud", tier:"front", glyph:"ink", aura:"#ef7a94", img:null, emoji:"💬",
    v:[.90,.05,-.30], kindred:"time", rival:"acts",
    traits:["Encouraging","Expressive","Sincere","Uplifting","Eloquent"],
    desc:"Love becomes real for you the moment it's said — the specific compliment, the long birthday message, the \"I'm proud of you\" timed exactly right. You give it the same way, saying the kind thing out loud instead of just thinking it, and your words have carried people through weeks they couldn't have managed alone. Let actions count as evidence too, because some people who adore you will never be fluent in your language."},
  time:{name:"Quality Time", tag:"The Undivided Hour", tier:"front", glyph:"ripple", aura:"#e6b23e", img:null, emoji:"⏳",
    v:[.05,.90,.15], kindred:"touch", rival:"gifts",
    traits:["Present","Unhurried","Devoted","Attentive","Steadfast"],
    desc:"Attention is your currency of love: the phone face-down, the unhurried afternoon, the feeling that being with you is exactly where someone wants to be. You notice distraction instantly and offer presence generously — you're the one who actually shows up, stays late, and listens all the way to the end of the story. When plans keep falling through, say \"I miss real time with you\" out loud instead of quietly keeping score."},
  gifts:{name:"Thoughtful Gifts", tag:"The Quiet Noticer", tier:"front", glyph:"cube", aura:"#ab7fe8", img:null, emoji:"🎁",
    v:[-.30,-.90,-.25], kindred:"acts", rival:"time",
    traits:["Observant","Thoughtful","Sentimental","Generous","Meticulous"],
    desc:"A gift was never about the object for you — it's proof that someone was paying attention when you weren't looking, like the exact tea you mentioned once in passing. You keep a quiet mental catalog of what the people you love love, and you live for the moment the perfect small thing finds its person. Tell people it's the thought, not the price tag, you're really hoping to unwrap — and remember a forgotten occasion is rarely a verdict on how much you matter."},
  acts:{name:"Acts of Service", tag:"The Rolled-Up Sleeves", tier:"front", glyph:"gear", aura:"#45c48f", img:null, emoji:"🛠️",
    v:[-.90,-.15,-.20], kindred:"gifts", rival:"words",
    traits:["Dependable","Practical","Selfless","Proactive","Steady"],
    desc:"You believe love is a verb: while others are composing the perfect message, you've already fixed the wobbly shelf, run the errand, and left dinner in the fridge. Being cared for, to you, looks like someone noticing the thing you were dreading and quietly making it disappear — and your own devotion shows up in a hundred small handled things. Let people return the favor sometimes; receiving help gracefully is how they learn their care landed."},
  touch:{name:"Physical Touch", tag:"The Open-Armed Welcome", tier:"front", glyph:"blossom", aura:"#58aee8", img:null, emoji:"🤗",
    v:[-.05,.35,.95], kindred:"time", rival:"gifts",
    traits:["Affectionate","Comforting","Warm","Grounding","Openhearted"],
    desc:"Closeness, for you, is literal: the real hug hello, the hand on a shoulder at the hard moment, sitting near enough that words become optional. You're often the warmest person in the room — the one whose hugs friends genuinely miss when you're far away. Long before you've found the right words, your presence has already said them."}
};

/* ---------- questions: weight vector [channel, medium, proximity] ---------- */
const Q = [
  {t:"When I care about someone, they're going to hear it — I say the kind thing out loud instead of just thinking it.",              w:[ 1, 0, 0]},
  {t:"Sweet words are nice, but I trust what people do — a quietly handled errand beats a beautiful paragraph.",                      w:[-1, 0, 0]},
  {t:"The best present anyone can give me is a whole unhurried afternoon with nowhere else to be.",                                   w:[ 0, 1, 0]},
  {t:"I keep the little things people give me — ticket stubs, silly cards, that one perfect mug — like tiny proof of being known.",   w:[ 0,-1, 0]},
  {t:"I'm a hugger — one real hug hello can fix half of whatever kind of day I was having.",                                          w:[ 0, 0, 1]},
  {t:"Love travels fine without a couch: a voice note, a letter, or a package in the mail reaches me across any distance.",           w:[ 0, 0,-1]},
  {t:"My happy place is sitting close with someone I love — phones face-down, shoulders touching, nowhere to be.",                    w:[ 0, .5, .5]},
  {t:"I keep a running mental list of things my favorite people mention wanting, and I live for the day the perfect little surprise finds them.", w:[-.4,-.6, 0]},
  {t:"Long letters and late-night phone calls could carry one of my friendships across an ocean.",                                    w:[ .5, 0,-.5]},
  {t:"Trade real words with me till midnight — deep conversation makes me feel closer to someone than any gift could.",               w:[ .5, .5, 0]}
];
const AXMAX=[3.4, 3.6, 3.0];
const SPECTRA=[
  {l:"Show It", r:"Say It"},
  {l:"Keepsakes", r:"Shared Hours"},
  {l:"Any Distance", r:"Arm's Reach"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'love_language',
  quizName: 'Love Style Quiz',
  eyebrow: 'The Five Love Languages',
  title: { pre: 'How Do You ', em: 'Give & Receive', post: ' Love?' },
  lede: 'Ten statements, one honest read of how love actually reaches you — and how it leaves you, headed for your favorite people. Answer as the friend and partner you really are, not the one a greeting card says you should be.',
  seal: { char: '💝' },
  rosterNoun: 'love languages',
  beginLabel: 'Find your language',
  tierLabels: { front: 'Love Language', cut: 'Deep Cut' },
  shareEmoji: '💝',
  shareGradient: 'from-rose-400 to-red-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the How You Give & Receive Love quiz. mypersonalityquizzes.com/quiz/love_language`,
  disclaimer: 'Original emblems generated for this quiz. Inspired by the five love languages framework popularized by Dr. Gary Chapman — a warm self-reflection for romance and friendship alike, not relationship advice or a clinical assessment.',
  theme: {
    baseAura: '#e08296',
    vars: {
      '--ink': '#171019', '--ink-2': '#211625', '--ink-3': '#2b1c2f',
      '--seal': '#d94f6e', '--gold': '#d9a05a',
    },
  },
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
