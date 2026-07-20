// Which Office Character Are You? — vector quiz data module.
//
// Conversion of the original 'pick'-mode office quiz
// (src/data/quizzes/office.js) to the vector-matching experience. Every
// character is a position in 4-axis personality space; matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in office.test.js re-verifies reachability/entropy/sensitivity
// after every roster or question edit — run it before shipping ANY change.
//
// All eight original resultKeys (michael, jim, pam, dwight, kelly, angela,
// stanley, kevin) are preserved exactly (saved results reference them); the
// expansion — andy, oscar, erin, darryl, phyllis, creed, jan, toby, ryan —
// is additive. Mains sit on the 'front' tier; the Annex holds the deep cuts.
//
// Axes: [order, social, drive, express], each in [-1, 1]
//   order:   -1 by the book / +1 wing it
//   social:  -1 lone desk   / +1 whole office
//   drive:   -1 coasting    / +1 climbing
//   express: -1 deadpan     / +1 full volume

/* ---------- roster: every character is a direction in 4-space ---------- */
const CHARS = {
  michael:{name:"Michael Scott", tag:"The Showtime Heart", tier:"front", glyph:"burst", aura:"#f59e0b", img:null, emoji:"🎤",
    v:[.60,.95,-.05,.95], kindred:"andy", rival:"toby",
    traits:["Warm","Theatrical","Impulsive","Devoted","Unforgettable"],
    desc:"You love the people around you at a volume most reserve for weddings and playoff games, and you'd rather be their favorite person than their boss — even when you're literally their boss. Your plans fall apart in ways that become legend, but your instincts about people are strangely, reliably right. Every ordinary Tuesday is one good idea away from becoming an event nobody will ever forget."},
  jim:{name:"Jim Halpert", tag:"The Smirking Long Game", tier:"front", glyph:"wave", aura:"#5b9ee0", img:null, emoji:"😏",
    v:[.55,.45,-.25,-.50], kindred:"pam", rival:"dwight",
    traits:["Easygoing","Wry","Observant","Patient","All-in"],
    desc:"You glide through chaos with a raised eyebrow and a private joke, and people trust you precisely because you refuse to take any of it too seriously. But the laid-back act hides a patient, all-in romantic — when something finally matters, you commit with a thoroughness that surprises everyone. Your masterpieces take months to set up, and the payoff is always worth it."},
  pam:{name:"Pam Beesly", tag:"The Quiet Courage", tier:"front", glyph:"blossom", aura:"#e8a1b0", img:null, emoji:"🎨",
    v:[-.25,.50,.15,-.45], kindred:"jim", rival:"jan",
    traits:["Observant","Kind","Creative","Steady","Quietly brave"],
    desc:"You notice everything, say a tenth of it, and quietly keep the whole ecosystem running while louder people take the credit. Your story is courage in small, accumulating doses — speaking up, taking the class, walking across the coals when it counts. The bolder choice has never once been wrong for you, and some part of you finally knows it."},
  dwight:{name:"Dwight Schrute", tag:"The Relentless Sentinel", tier:"front", glyph:"leaf", aura:"#b5a642", img:null, emoji:"🌾",
    v:[-.90,-.30,.85,.30], kindred:"angela", rival:"jim",
    traits:["Intense","Prepared","Loyal","Disciplined","Fearless"],
    desc:"You are intense about everything, prepared for anything, and completely unbothered that people find both of those things strange. While everyone else coasts, you're up before dawn mastering skills nobody else thought to learn — and when a real crisis hits, you're suddenly the only competent person in the building. Your loyalty is absolute: you may battle your people daily, but heaven help the outsider who wrongs them."},
  kelly:{name:"Kelly Kapoor", tag:"The Main Character", tier:"front", glyph:"bloom", aura:"#f050a8", img:null, emoji:"💅",
    v:[.85,.35,.45,.95], kindred:"michael", rival:"ryan",
    traits:["Dazzling","Dramatic","Sharp","Trend-fluent","Unfiltered"],
    desc:"You are the main character, and honestly, everyone should thank you for it. You feel everything at full saturation, narrate life like it deserves narrating, and maintain an encyclopedic archive of who said what to whom and what they were wearing. Beneath the sparkle is someone much sharper than advertised — you clock every dynamic in the room while pretending to check your phone."},
  angela:{name:"Angela Martin", tag:"The Iron Standard", tier:"front", glyph:"paw", aura:"#aebccf", img:null, emoji:"🐱",
    v:[-1,-.50,.30,-.65], kindred:"dwight", rival:"phyllis",
    traits:["Exacting","Composed","Formidable","Traditional","Secretly soft"],
    desc:"You have standards, a plan, and a committee ready to execute both, and you are not sorry about any of it. Things simply work when you're in charge, which is why you quietly are — whatever the org chart says. Beneath the pursed-lip disapproval lives a genuinely tender heart, reserved for a carefully vetted few humans and every cat you have ever met."},
  stanley:{name:"Stanley Hudson", tag:"The Fortress of Peace", tier:"front", glyph:"cube", aura:"#b06a3a", img:null, emoji:"🧩",
    v:[-.35,-.85,-.90,-.40], kindred:"kevin", rival:"michael",
    traits:["Unbothered","Boundaried","Dry","Content","Steadfast"],
    desc:"You solved the puzzle most people spend decades on: work is one chapter of your life, not the whole book. You do the job, you do it fine, and you defend your evenings, weekends, and small daily joys with the discipline of a monk. Anyone lucky enough to catch you off the clock discovers the truth — you're warm, wickedly funny, and fully alive the moment you're doing what you love."},
  kevin:{name:"Kevin Malone", tag:"The Uncomplicated Heart", tier:"front", glyph:"sand", aura:"#9a6bd0", img:null, emoji:"🍪",
    v:[.65,.50,-.75,.30], kindred:"stanley", rival:"angela",
    traits:["Easygoing","Genuine","Content","Funny","Unpretentious"],
    desc:"You cracked the code to happiness, and the code is beautifully simple: good food, good people, and a firm policy against sweating the small stuff. People underestimate you right up until your hidden talents surface — the band, the numbers, the legendary family recipe — and then they never quite recover. Your total lack of pretense makes you the easiest person in any room to be around."},
  andy:{name:"Andy Bernard", tag:"The Eager Crescendo", tier:"front", glyph:"sound", aura:"#d9534f", img:null, emoji:"🎶",
    v:[-.05,.65,.60,.80], kindred:"michael", rival:"dwight",
    traits:["Eager","Musical","Ambitious","Earnest","Persistent"],
    desc:"You want so badly to be liked that you've turned it into a genuine art form — the song, the nickname, the grand gesture, whatever the moment demands. Underneath the eager charm sits real ambition and a temper you've worked hard to befriend, and both make you far more formidable than people expect. When you finally stop performing and just show up, you're impossible not to root for."},
  oscar:{name:"Oscar Martinez", tag:"The Voice of Reason", tier:"front", glyph:"gear", aura:"#2e9cbf", img:null, emoji:"🧮",
    v:[-.60,.20,.30,-.30], kindred:"darryl", rival:"angela",
    traits:["Rational","Precise","Patient","Candid","Idealistic"],
    desc:"You're usually the smartest person in the room and, to your credit, you only mention it several times a day. Patient, precise, and allergic to nonsense, you're the one who quietly checks the math while everyone else argues about the font. Beneath the sighs and corrections is a real idealist who genuinely believes things could work — if people would just listen."},
  erin:{name:"Erin Hannon", tag:"The Unsinkable Sunbeam", tier:"front", glyph:"flash", aura:"#ffd166", img:null, emoji:"☀️",
    v:[.10,.85,-.45,.45], kindred:"andy", rival:"kelly",
    traits:["Sunny","Sincere","Resilient","Eager","Openhearted"],
    desc:"You bring a sincerity so bright that cynics need a moment to adjust their eyes. You throw yourself into every job, friendship, and office party with your whole heart, and you bounce back from setbacks that would flatten most people by the very next morning. What looks like naivety is actually a superpower: you decided the world is good, and you keep making it true."},
  darryl:{name:"Darryl Philbin", tag:"The Understated Climber", tier:"front", glyph:"ripple", aura:"#6c86ab", img:null, emoji:"🎧",
    v:[-.25,.10,.55,-.55], kindred:"jim", rival:"andy",
    traits:["Cool-headed","Capable","Understated","Strategic","Creative"],
    desc:"You're the calmest, most capable person on the floor, and you've perfected the art of being underestimated on purpose. While others perform ambition loudly, you level up in silence — the new skill, the better title, the smarter move, all before anyone notices you were climbing. Your deadpan hides a creative streak and a soft heart you reveal strictly on your own schedule."},
  phyllis:{name:"Phyllis Vance", tag:"The Velvet Needle", tier:"front", glyph:"feather", aura:"#d98c5f", img:null, emoji:"🧶",
    v:[-.15,.60,-.45,-.25], kindred:"stanley", rival:"angela",
    traits:["Warm","Sly","Patient","Confident","Disarming"],
    desc:"You look like the sweetest person in the building, and you are — but the people who mistake sweet for soft learn otherwise exactly once. You remember every birthday, knit the gift yourself, and deliver the single most devastating remark of the meeting without ever raising your voice. Yours is the quiet confidence of someone fully loved at home, with nothing left to prove at work."},
  creed:{name:"Creed Bratton", tag:"The Unknowable Wildcard", tier:"cut", glyph:"eye", aura:"#86c232", img:null, emoji:"🌱",
    v:[.95,-.60,.10,-.30], kindred:"ryan", rival:"dwight",
    traits:["Inscrutable","Unpredictable","Detached","Resourceful","Legendary"],
    desc:"Nobody knows exactly what you do, where you came from, or how you got into the building, and you have decided to keep it that way. You drift through the week on instincts nobody can predict, then drop one sentence so strange and so perfectly timed it becomes folklore for years. You are a complete mystery with excellent survival skills, and honestly, that's a kind of genius."},
  jan:{name:"Jan Levinson", tag:"The Scorched-Earth Striver", tier:"cut", glyph:"flame", aura:"#c4506e", img:null, emoji:"🕯️",
    v:[0,-.50,.90,.60], kindred:"angela", rival:"ryan",
    traits:["Driven","Intense","Polished","Volatile","Magnetic"],
    desc:"You climbed higher than anyone around you, held yourself to a punishing standard, and discovered the polished exterior was the least interesting thing about you. When your carefully controlled life caught fire, you didn't apologize — you rebranded, launched the passion project, and turned the whole spiral into a second act. You are ambition with the safety off: intense, magnetic, and never once boring."},
  toby:{name:"Toby Flenderson", tag:"The Quiet Endurance", tier:"cut", glyph:"shadow", aura:"#97a08c", img:null, emoji:"📋",
    v:[-.45,-.40,-.35,-.90], kindred:"oscar", rival:"michael",
    traits:["Patient","Gentle","Observant","Enduring","Hopeful"],
    desc:"You follow the rules, file the forms, and absorb an astonishing amount of unearned hostility with a patience that borders on heroic. You notice more than anyone realizes and want connection far more than you'll ever say out loud. The quiet truth is that you're kind, thoughtful, and one brave afternoon away from the life you keep almost choosing."},
  ryan:{name:"Ryan Howard", tag:"The Restless Hustler", tier:"cut", glyph:"lightning", aura:"#56ccdf", img:null, emoji:"📱",
    v:[.35,-.65,.95,-.20], kindred:"creed", rival:"jim",
    traits:["Ambitious","Restless","Trendy","Clever","Self-inventing"],
    desc:"You've reinvented yourself more times than most people update their résumé, and every version is chasing something bigger. Quick, trend-fluent, and allergic to being ordinary, you'd rather fail spectacularly at your own idea than succeed quietly at someone else's. The hustle isn't a phase — it's the whole personality, and someday one of those big swings is going to connect."}
};

/* ---------- questions: weight vector [order, social, drive, express] ---------- */
const Q = [
  {t:"I make it up as I go — my best days are the ones that went nothing like the plan.",           w:[ 1, 0, 0, 0]},
  {t:"I have a system for everything, and yes, it has labels, backups, and a laminated copy.",      w:[-1, 0, 0, 0]},
  {t:"I know everyone's birthday, their usual order, and how their week is actually going.",        w:[ 0, 1, 0, 0]},
  {t:"Headphones on, head down — my ideal day involves the smallest possible amount of small talk.",w:[ 0,-1, 0, 0]},
  {t:"I'm quietly keeping score in life, and I intend to win — the title, the raise, all of it.",   w:[ 0, 0, 1, 0]},
  {t:"The day job funds my real life — I guard my evenings and weekends like treasure.",            w:[ 0, 0,-1, 0]},
  {t:"When I'm excited about something, everyone within three rooms knows immediately.",            w:[ 0, 0, 0, 1]},
  {t:"I could win the lottery and you'd only learn it from a slight change in my eyebrows.",        w:[ 0, 0, 0,-1]},
  {t:"I'd rather be everyone's favorite than everyone's boss.",                                     w:[ 0, .5,-.5, 0]},
  {t:"A bit of mischief delivered completely straight-faced is my love language.",                  w:[ .5, 0, 0,-.5]}
];
const AXMAX=[2.5, 2.5, 2.5, 2.5];
const SPECTRA=[
  {l:"By the Book", r:"Wing It"},
  {l:"Lone Desk", r:"Whole Office"},
  {l:"Coasting", r:"Climbing"},
  {l:"Deadpan", r:"Full Volume"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'office',
  quizName: 'The Office Character Quiz',
  eyebrow: 'Dunder Mifflin Desk Assignment',
  title: { pre: 'Which ', em: 'Office', post: ' Character Are You?' },
  lede: 'Ten statements, one honest read of how you actually show up between nine and five. Answer as the real you — not the version in your performance review.',
  seal: { char: '📎' },
  rosterNoun: 'characters',
  beginLabel: 'Clock in',
  tierLabels: { front: 'Main Floor', cut: 'The Annex' },
  shareEmoji: '📎',
  shareGradient: 'from-slate-500 to-gray-600',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Office Character Are You? test. mypersonalityquizzes.com/quiz/office`,
  disclaimer: 'Original emblems generated for this quiz. The Office (US) and its characters are © NBCUniversal — this is an unofficial fan-made personality test.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
