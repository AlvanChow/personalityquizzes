// Which Friends Character Are You? — vector quiz data module.
//
// Conversion of the original 'pick'-mode friends quiz
// (src/data/quizzes/friends.js) to the vector-matching experience. Every
// character is a position in 4-axis personality space; matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in friends.test.js re-verifies reachability/entropy/sensitivity
// after every roster or question edit — run it before shipping ANY change.
//
// All six original resultKeys (rachel, monica, phoebe, ross, chandler, joey)
// are preserved exactly (saved results reference them); the recurring
// favorites — janice, gunther, richard, mike, frank, estelle, david,
// ursula — are additive. Mains sit on the 'front' tier.
//
// Axes: [plan, social, quirk, express], each in [-1, 1]
//   plan:    -1 planner     / +1 free-wheeler
//   social:  -1 solo seat   / +1 whole gang
//   quirk:   -1 by the book / +1 offbeat
//   express: -1 understated / +1 full volume

/* ---------- roster: every character is a direction in 4-space ---------- */
const CHARS = {
  rachel:{name:"Rachel Green", tag:"The Fearless Reinvention", tier:"front", glyph:"bloom", aura:"#4cc38a", img:null, emoji:"🛍️",
    v:[.15,.75,-.40,.45], kindred:"monica", rival:"ross",
    traits:["Magnetic","Stylish","Adaptable","Ambitious","Warm"],
    desc:"You're living proof that starting over is a superpower — whatever chapter you were handed, you had the nerve to trade it for one you actually wanted. People underestimate you exactly once, then watch you learn the job, land the promotion, and look flawless doing it. Your real gift is social gravity: rooms simply arrange themselves around you."},
  monica:{name:"Monica Geller", tag:"The Competitive Caretaker", tier:"front", glyph:"gear", aura:"#a06ee8", img:null, emoji:"🍳",
    v:[-.95,.65,-.35,.40], kindred:"rachel", rival:"phoebe",
    traits:["Organized","Nurturing","Competitive","Driven","Loyal"],
    desc:"You show love in casserole form and relax by alphabetizing something. You're the gravitational center of your circle — the one with the place everyone gathers in, the plan everyone follows, and the standards everyone secretly benefits from. Yes, you'd turn a casual game night into a championship, but that same fire is why everything you commit to actually happens."},
  phoebe:{name:"Phoebe Buffay", tag:"The Offbeat Oracle", tier:"front", glyph:"sound", aura:"#f2c94c", img:null, emoji:"🎸",
    v:[.40,.30,1.0,.45], kindred:"joey", rival:"monica",
    traits:["Original","Honest","Resilient","Whimsical","Kind"],
    desc:"You're gloriously, unapologetically yourself in a world full of people performing normalcy. Your logic makes no sense right up until it makes perfect sense, and your strange, sideways take on life usually lands closer to the truth than everyone else's careful answers. Underneath the whimsy is real steel — you've weathered things that would flatten most people and came out kinder, not harder."},
  ross:{name:"Ross Geller", tag:"The Full-Volume Romantic", tier:"front", glyph:"spiral", aura:"#5b9ee0", img:null, emoji:"🦕",
    v:[-.50,.30,-.70,.85], kindred:"monica", rival:"rachel",
    traits:["Passionate","Knowledgeable","Devoted","Earnest","Dramatic"],
    desc:"You care about things at a level most people find unusual, and that's exactly your charm — when you love something, you love it with footnotes. You're the romantic of your group: earnest, devoted, occasionally spiraling, always sincere. Your feelings arrive at full volume because you have never once been casual about anything that matters."},
  chandler:{name:"Chandler Bing", tag:"The Armor of Wit", tier:"front", glyph:"cube", aura:"#9aa7b8", img:null, emoji:"🃏",
    v:[.10,.45,.25,-.70], kindred:"joey", rival:"janice",
    traits:["Quick-witted","Self-aware","Reliable","Guarded","Generous"],
    desc:"Your first language is sarcasm and your second is deflection, but everyone who matters knows what's underneath: one of the most loyal, generous hearts in the room. You joke because you notice everything — including your own awkwardness — half a second before anyone else does. Your real story is the best kind of growth arc: the avoider who, when it truly counted, showed up more completely than anyone."},
  joey:{name:"Joey Tribbiani", tag:"The Heart of Gold", tier:"front", glyph:"flame", aura:"#e8623f", img:null, emoji:"🍕",
    v:[.80,.95,-.15,.60], kindred:"chandler", rival:"ursula",
    traits:["Loyal","Easygoing","Charming","Protective","Wholehearted"],
    desc:"You lead with your heart and your appetite, in that order — barely. You don't overthink life: you love your people, you love your food, and you commit to both without hesitation or fine print. What everyone misses under the easygoing charm is fierce protectiveness — nobody defends their friends faster, and you'd hand over the last slice for the right person."},
  janice:{name:"Janice Litman-Goralnik", tag:"The Unmistakable Laugh", tier:"cut", glyph:"burst", aura:"#f06fae", img:null, emoji:"📣",
    v:[.20,.75,.30,1.0], kindred:"frank", rival:"chandler",
    traits:["Exuberant","Persistent","Affectionate","Unfiltered","Fearless"],
    desc:"You arrive before you arrive — your laugh, your greeting, and your whole glorious presence enter the room a full beat ahead of you. You love loudly, commit instantly, and have never once pretended to be less than you are just to make a quiet person comfortable. The secret everyone learns eventually: behind the volume sits genuine, surprisingly durable affection."},
  gunther:{name:"Gunther", tag:"The Devoted Barista", tier:"cut", glyph:"ripple", aura:"#b98a4e", img:null, emoji:"☕",
    v:[-.45,-.35,-.20,-.95], kindred:"david", rival:"ross",
    traits:["Steadfast","Observant","Patient","Understated","Constant"],
    desc:"You're the quiet constant — always at your post, always watching, always three steps ahead on everyone else's coffee order and emotional state. You feel things deeply and say almost none of it, holding your biggest hopes behind a perfectly professional counter. People overlook you at their peril: you notice everything, remember everything, and stay long after the loud ones leave."},
  richard:{name:"Richard Burke", tag:"The Steady Gentleman", tier:"cut", glyph:"diamond", aura:"#3aa8a0", img:null, emoji:"🥸",
    v:[-.70,.10,-.50,-.60], kindred:"monica", rival:"chandler",
    traits:["Composed","Mature","Charming","Deliberate","Dignified"],
    desc:"You're the calmest person in any crisis and the most comfortable person in any silence. Where others perform, you simply are — settled, sure of your taste, and quietly magnetic in a way that makes younger, louder people feel like they're auditioning. You know exactly what you want; your only flaw is how long you'll wait to say it out loud."},
  mike:{name:"Mike Hannigan", tag:"The Quiet Wildcard", tier:"cut", glyph:"wave", aura:"#6fc3df", img:null, emoji:"🎹",
    v:[.50,.05,.55,-.55], kindred:"phoebe", rival:"david",
    traits:["Laid-back","Dry-witted","Principled","Surprising","Genuine"],
    desc:"You look like the most normal person in the room right up until someone gets to know you — then the piano playing, the deadpan jokes, and the cheerfully strange opinions come out. You walked away from the safe, expected path once and never regretted it, because you'd rather be happy than impressive. Your calm isn't emptiness; it's a very entertaining inner world running quietly at all times."},
  frank:{name:"Frank Buffay Jr.", tag:"The Runaway Enthusiasm", tier:"cut", glyph:"flash", aura:"#f2a03d", img:null, emoji:"👶",
    v:[.95,.55,.45,.80], kindred:"phoebe", rival:"richard",
    traits:["Enthusiastic","Impulsive","Devoted","Unjaded","All-in"],
    desc:"You do nothing at half throttle — when you find a person, a hobby, or a wildly impractical idea you love, you're already sprinting before anyone can raise a practical objection. Life keeps handing you more than most people could carry, and you keep saying yes anyway, with your whole chest. Your superpower is that cynicism simply never took: you still think everything might be amazing."},
  estelle:{name:"Estelle Leonard", tag:"The No-Nonsense Hustler", tier:"cut", glyph:"fan", aura:"#b3455c", img:null, emoji:"📞",
    v:[.35,-.70,.45,.60], kindred:"ursula", rival:"monica",
    traits:["Brash","Unbothered","Scrappy","Streetwise","Independent"],
    desc:"You've seen it all, believed about half of it, and stopped apologizing decades ago. You work your own angles from your own corner, unbothered by trends, gatekeepers, or what anybody thinks of your methods — the hustle is the art form. And beneath the gravel and the chaos sits real loyalty: you'll go to bat for your people with a shamelessness that borders on heroic."},
  david:{name:"David the Scientist", tag:"The Longing Scholar", tier:"cut", glyph:"coil", aura:"#7d8ce0", img:null, emoji:"🔬",
    v:[-.80,-.25,.20,-.35], kindred:"phoebe", rival:"mike",
    traits:["Brilliant","Earnest","Thoughtful","Hesitant","Devoted"],
    desc:"You think in careful, beautiful detail and feel far more than you ever manage to say in the moment. Your work matters enormously to you, and your great flaw is the same as your great virtue: you weigh every choice so thoroughly that the moment sometimes leaves without you. But when you finally do speak your heart, it's the whole thing — fully researched, completely sincere, years in the making."},
  ursula:{name:"Ursula Buffay", tag:"The Unbothered Twin", tier:"cut", glyph:"shadow", aura:"#8a9a5b", img:null, emoji:"🙃",
    v:[.55,-.95,.70,-.25], kindred:"estelle", rival:"phoebe",
    traits:["Detached","Deadpan","Self-directed","Unpredictable","Cool"],
    desc:"You float through life on your own current, sublimely indifferent to obligations, expectations, and other people's dinner reservations. What reads as aloofness is really total self-direction — you simply never signed the social contract everyone else keeps citing. People find you baffling, then fascinating, because nothing rattles someone who genuinely does not care what the room thinks."}
};

/* ---------- questions: weight vector [plan, social, quirk, express] ---------- */
const Q = [
  {t:"I decide things on the spot — overthinking a choice ruins the fun of making it.",              w:[ 1, 0, 0, 0]},
  {t:"I have a system for everything, and yes, the labels on my containers match.",                  w:[-1, 0, 0, 0]},
  {t:"My friends are basically family — my door is always open and my couch is always taken.",       w:[ 0, 1, 0, 0]},
  {t:"I recharge best on my own — a quiet day with nobody needing me is pure luxury.",               w:[ 0,-1, 0, 0]},
  {t:"My taste is a little weird and I love that about me — normal is someone else's hobby.",        w:[ 0, 0, 1, 0]},
  {t:"I like doing things the proper, proven way — traditions and good manners exist for a reason.", w:[ 0, 0,-1, 0]},
  {t:"When I feel something, the entire room finds out — volume included, free of charge.",          w:[ 0, 0, 0, 1]},
  {t:"I keep my real feelings close; the people I love learn to read my small signals.",             w:[ 0, 0, 0,-1]},
  {t:"The perfect night is takeout ordered on impulse with the whole gang crammed in one room.",     w:[ .5, .5, 0, 0]},
  {t:"If something bothers me, I'll make a joke about it long before I'll make a speech about it.",  w:[ 0, 0, .4,-.6]}
];
const AXMAX=[2.5, 2.5, 2.4, 2.6];
const SPECTRA=[
  {l:"Planner", r:"Free-Wheeler"},
  {l:"Solo Seat", r:"Whole Gang"},
  {l:"By the Book", r:"Offbeat"},
  {l:"Understated", r:"Full Volume"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'friends',
  quizName: 'Friends Character Quiz',
  eyebrow: 'Central Perk Alignment Test',
  title: { pre: 'Which ', em: 'Friends', post: ' Character Are You?' },
  lede: 'Ten statements, one honest read of where you sit on the orange couch. Answer as the person your friends actually know — not the one you play at parties.',
  seal: { char: '☕' },
  rosterNoun: 'characters',
  beginLabel: 'Grab a seat at the Perk',
  tierLabels: { front: 'Core Six', cut: 'Recurring Legend' },
  shareEmoji: '☕',
  shareGradient: 'from-amber-400 to-yellow-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Friends Character Are You? test. mypersonalityquizzes.com/quiz/friends`,
  disclaimer: 'Original emblems generated for this quiz. Friends and its characters are © Warner Bros. Entertainment — this is an unofficial fan-made personality test.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
