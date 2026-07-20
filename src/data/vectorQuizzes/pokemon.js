// Which Pokémon Are You? — vector quiz data module.
//
// Conversion of the original 'pick'-mode starter quiz
// (src/data/quizzes/pokemon.js) to the vector-matching experience. Every
// Pokémon is a position in 4-axis personality space; matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in pokemon.test.js re-verifies reachability/entropy/sensitivity
// after every roster or question edit — run it before shipping ANY change.
//
// All six original resultKeys (pikachu, charmander, squirtle, bulbasaur,
// eevee, cyndaquil) are preserved exactly (saved results reference them);
// the fourteen icons — charizard, snorlax, gengar, mewtwo, jigglypuff,
// gyarados, lapras, alakazam, machamp, ditto, meowth, psyduck, lucario,
// dragonite — are additive.
//
// Axes: [volt, bond, drive, wild], each in [-1, 1]
//   volt:  -1 deep calm    / +1 full charge
//   bond:  -1 lone path    / +1 full party
//   drive: -1 easy living  / +1 champion road
//   wild:  -1 steady hand  / +1 wild card

import { G, emblem } from './glyphs';
export { G, emblem };

/* ---------- roster: every Pokémon is a direction in 4-space ---------- */
const CHARS = {
  pikachu:{name:"Pikachu", tag:"The Loyal Livewire", tier:"front", glyph:"lightning", aura:"#f7d02c", img:null, emoji:"⚡",
    v:[.9,.8,.2,.25], kindred:"eevee", rival:"meowth",
    traits:["Loyal","Electric","Spirited","Genuine","Unstoppable"],
    desc:"Your energy enters the room a full second before you do, and it never runs out where your people are concerned. You refuse to become whatever the standard path says you should be — you'll grow plenty, but strictly as yourself. Once someone is yours, you'd take a lightning bolt for them without blinking."},
  charmander:{name:"Charmander", tag:"The Rising Ember", tier:"front", glyph:"flame", aura:"#ef8a37", img:null, emoji:"🔥",
    v:[.55,.45,.65,-.05], kindred:"cyndaquil", rival:"squirtle",
    traits:["Ambitious","Warm","Earnest","Tender","Determined"],
    desc:"You feel everything at full temperature — your enthusiasms are bonfires and your loyalties are furnace-grade. People underestimate you early, not realizing they're talking to a future dragon. The flame you carry needs tending, sure, but it has never once gone out."},
  squirtle:{name:"Squirtle", tag:"The Squad's Cool Head", tier:"front", glyph:"ripple", aura:"#5bc7ee", img:null, emoji:"💧",
    v:[.4,.65,-.15,.6], kindred:"pikachu", rival:"charmander",
    traits:["Cool-headed","Playful","Charming","Unbothered","Quick-witted"],
    desc:"You're the coolest head in any crisis and the biggest personality at any party, which makes you dangerously fun to know. Trouble slides right off your shell; where others spiral, you crack the perfectly timed joke and then actually handle it. You take your fun seriously and your problems lightly, and somehow both keep working out."},
  bulbasaur:{name:"Bulbasaur", tag:"The Patient Gardener", tier:"front", glyph:"bloom", aura:"#6fc35b", img:null, emoji:"🌱",
    v:[-.45,.7,-.6,-.5], kindred:"lapras", rival:"gengar",
    traits:["Dependable","Patient","Nurturing","Grounded","Loyal"],
    desc:"You're the one who remembers the birthday, waters the plants, and shows up early with snacks on moving day. You grow patiently and deliberately, unbothered by anyone else's timeline, and everyone near you feels calmer for it. People pick flashier friends first sometimes — they learn."},
  eevee:{name:"Eevee", tag:"The Infinite Possibility", tier:"front", glyph:"paw", aura:"#b5825a", img:null, emoji:"🦊",
    v:[.3,.35,.35,.7], kindred:"ditto", rival:"lucario",
    traits:["Adaptable","Curious","Versatile","Fearless","Evolving"],
    desc:"You contain multitudes and you know it — while everyone else locked in their one path years ago, you kept your options gloriously open. You adapt to new places, new people, and new problems faster than anyone you know. Your curiosity isn't indecision; it's respect for just how many things you could brilliantly become."},
  cyndaquil:{name:"Cyndaquil", tag:"The Quiet Flame", tier:"front", glyph:"burst", aura:"#e2606e", img:null, emoji:"🌋",
    v:[-.55,.1,.05,-.5], kindred:"bulbasaur", rival:"jigglypuff",
    traits:["Gentle","Shy","Fierce","Observant","Loyal"],
    desc:"You're soft-spoken, a little shy, and routinely underestimated — right up until something you love is threatened and the flames come roaring to life. You prefer cozy corners to center stage and listening to holding forth. Gentle is not the same as weak, and you're the living proof."},
  charizard:{name:"Charizard", tag:"The Proud Inferno", tier:"front", glyph:"feather", aura:"#e0492a", img:null, emoji:"🐉",
    v:[.55,-.35,1,-.05], kindred:"gyarados", rival:"mewtwo",
    traits:["Proud","Blazing","Competitive","Independent","Magnificent"],
    desc:"You have real power and absolutely no interest in pretending otherwise — respect is earned with you, never assumed. You answer to your own standard first, which some people call stubborn and the rest eventually call greatness. But once someone truly earns your loyalty, you will fly through a storm for them."},
  snorlax:{name:"Snorlax", tag:"The Immovable Nap", tier:"front", glyph:"toad", aura:"#75879e", img:null, emoji:"😴",
    v:[-1,.15,-.9,.1], kindred:"lapras", rival:"machamp",
    traits:["Unbothered","Peaceful","Immovable","Content","Comforting"],
    desc:"You have mastered the art everyone else is still fumbling: being completely, unapologetically at peace. Deadlines, drama, and discourse break over you like waves on a mountain — you'll deal with it after the nap. When you finally do move, everyone remembers exactly why nobody wanted to be in the way."},
  gengar:{name:"Gengar", tag:"The Grinning Shadow", tier:"front", glyph:"shadow", aura:"#6d4bcf", img:null, emoji:"👻",
    v:[.55,.25,-.05,1], kindred:"meowth", rival:"alakazam",
    traits:["Mischievous","Playful","Sharp","Loyal","Irrepressible"],
    desc:"Your pranks are legendary, your timing is flawless, and your laugh always seems to come from just over someone's shoulder. Beneath the mischief sits a surprisingly loyal heart that mostly wants everyone to stop being so serious and play. People who look scary rarely are — you'd know."},
  mewtwo:{name:"Mewtwo", tag:"The Solitary Storm", tier:"front", glyph:"eye", aura:"#a986e8", img:null, emoji:"🔮",
    v:[-.15,-.95,.8,-.3], kindred:"alakazam", rival:"charizard",
    traits:["Brilliant","Solitary","Intense","Questioning","Formidable"],
    desc:"You think at a depth most people never visit and prefer to do it far from the noise. You've asked the big questions — who am I, why am I here, who gets to decide — and refused every easy answer. The distance you keep isn't coldness; it's the space a storm needs while it works out what it wants to be."},
  jigglypuff:{name:"Jigglypuff", tag:"The Unstoppable Encore", tier:"front", glyph:"sound", aura:"#f4a8c4", img:null, emoji:"🎤",
    v:[.45,.55,.5,.45], kindred:"pikachu", rival:"snorlax",
    traits:["Expressive","Bold","Persistent","Dramatic","Endearing"],
    desc:"You were born for the spotlight and genuinely cannot understand why anyone would fall asleep during your set. You feel things at performance volume — joy, outrage, and devotion all delivered straight to the back row. Underneath the drama is real courage: you put yourself out there again and again, no matter how the last crowd behaved."},
  gyarados:{name:"Gyarados", tag:"The Risen Tempest", tier:"front", glyph:"wave", aura:"#3a6cd4", img:null, emoji:"🌊",
    v:[.85,-.55,.55,.5], kindred:"charizard", rival:"lapras",
    traits:["Intense","Transformed","Passionate","Powerful","Guarded"],
    desc:"People wrote you off once, and you have never forgotten how it felt — everything you are now was built from that. Your feelings run at sea-storm scale: when you're calm you're majestic, and when you're crossed the weather changes for everyone. The ones you protect never doubt where you stand, because you show up like a tidal wave."},
  lapras:{name:"Lapras", tag:"The Calm-Water Carrier", tier:"cut", glyph:"fin", aura:"#3fbfae", img:null, emoji:"⛵",
    v:[-.9,.3,-.45,-.6], kindred:"dragonite", rival:"gyarados",
    traits:["Serene","Kind","Wise","Steady","Generous"],
    desc:"You're the calm crossing in other people's stormy seasons — patient, unhurried, and quietly wise. You carry your friends places they couldn't reach alone and never once make them feel heavy. Your gentleness isn't fragility; it's strength that decided long ago what it was for."},
  alakazam:{name:"Alakazam", tag:"The Grandmaster Mind", tier:"cut", glyph:"hex", aura:"#bf9330", img:null, emoji:"🥄",
    v:[-.6,-.6,.3,-.7], kindred:"mewtwo", rival:"machamp",
    traits:["Analytical","Composed","Perceptive","Meticulous","Unflappable"],
    desc:"You think five conversations ahead and it shows — you rarely raise your voice because you rarely need to. Every problem is a puzzle with a correct answer, and you'll quietly hold the room until you've found it. Your memory is legendary, your patience is deliberate, and your judgment is the one your friends borrow when it matters."},
  machamp:{name:"Machamp", tag:"The Four-Armed Work Ethic", tier:"cut", glyph:"diamond", aura:"#96a03c", img:null, emoji:"💪",
    v:[.75,.5,.6,-.65], kindred:"lucario", rival:"alakazam",
    traits:["Disciplined","Strong","Encouraging","Tireless","Team-spirited"],
    desc:"You genuinely believe in the reps — show up, do the work, get stronger, repeat — and your consistency puts everyone else's motivation apps to shame. You'd need four arms to carry everything you volunteer to carry for other people, and you'd still offer to grab one more bag. Loud gyms and heavy days don't scare you; skipped fundamentals do."},
  ditto:{name:"Ditto", tag:"The Perfect Impression", tier:"cut", glyph:"ink", aura:"#c45ec9", img:null, emoji:"🎭",
    v:[-.1,-.15,-.35,1], kindred:"eevee", rival:"mewtwo",
    traits:["Adaptable","Observant","Understated","Surprising","Limitless"],
    desc:"You can read a room in seconds and become exactly what the moment requires — the calm one, the funny one, the translator between two stubborn friends. People underestimate the skill in that, mistaking your flexibility for having no shape of your own. They're wrong: your shape is choice, and it's the rarest power in the building."},
  meowth:{name:"Meowth", tag:"The Silver-Tongued Schemer", tier:"cut", glyph:"flash", aura:"#e8d295", img:null, emoji:"🪙",
    v:[.3,-.45,.6,.75], kindred:"gengar", rival:"pikachu",
    traits:["Clever","Ambitious","Scrappy","Charming","Resourceful"],
    desc:"You've always had an angle, a plan, and a backup plan that's mostly the first plan with more style. You taught yourself everything you know, which is why nobody's approval impresses you and nobody's rejection stops you. The scheme of the week rarely lands, but your real treasure was never the coin — it's that you get back up, every single time."},
  psyduck:{name:"Psyduck", tag:"The Accidental Powerhouse", tier:"cut", glyph:"spiral", aura:"#ffc86b", img:null, emoji:"🤯",
    v:[-.35,.35,-.5,.55], kindred:"ditto", rival:"alakazam",
    traits:["Anxious","Earnest","Kind","Bewildered","Secretly mighty"],
    desc:"You spend most days mildly overwhelmed, holding your head and doing your best — and your best is better than you think. The people who love you know the secret: when the pressure finally peaks, you produce solutions out of nowhere that leave the whole room speechless. Your worry was never weakness; it's the hum of something enormous idling."},
  lucario:{name:"Lucario", tag:"The Focused Aura", tier:"cut", glyph:"rinne", aura:"#4a90d9", img:null, emoji:"🥋",
    v:[-.2,-.3,.45,-.95], kindred:"machamp", rival:"gengar",
    traits:["Disciplined","Principled","Perceptive","Devoted","Centered"],
    desc:"You sense what people are feeling before they've said a word, and you take that gift seriously. Your life runs on principle and practice: early mornings, honest effort, and a code you simply do not bend. The few people you let close discover the warmth under the discipline, and they never find a steadier ally anywhere."},
  dragonite:{name:"Dragonite", tag:"The Kindhearted Colossus", tier:"cut", glyph:"coil", aura:"#f2a83c", img:null, emoji:"🐲",
    v:[.1,.85,-.25,-.55], kindred:"lapras", rival:"gyarados",
    traits:["Kind","Powerful","Gentle","Reliable","Humble"],
    desc:"You are enormous strength wrapped around a soft center — the most powerful person in the room and somehow the friendliest. You'll fly any distance to deliver on a promise, and you'd rather help carry a stranger's groceries than win a fight you didn't need. People feel safe around you, and you consider that a better title than champion."}
};

/* ---------- questions: weight vector [volt, bond, drive, wild] ---------- */
const Q = [
  {t:"My default speed is GO — I talk fast, walk fast, and my leg is probably bouncing right now.",              w:[ 1, 0, 0, 0]},
  {t:"Very little rattles me — my resting state sits somewhere between calm and actually napping.",              w:[-1, 0, 0, 0]},
  {t:"Everything's better with my crew — I'd rather do a boring thing together than an amazing thing alone.",    w:[ 0, 1, 0, 0]},
  {t:"I roam best solo — a long trip with nobody else's schedule to think about sounds like heaven.",            w:[ 0,-1, 0, 0]},
  {t:"I keep a mental leaderboard for everything I do — and I fully intend to top it.",                          w:[ 0, 0, 1, 0]},
  {t:"Snacks, naps, zero obligations — the good life isn't a prize you win, it's an afternoon you protect.",     w:[ 0, 0,-1, 0]},
  {t:"I love keeping people guessing — a little harmless mischief is my love language.",                         w:[ 0, 0, 0, 1]},
  {t:"I'm the dependable one: routines kept, promises honored, no surprises on my watch.",                       w:[ 0, 0, 0,-1]},
  {t:"I'd shelve my own big plans in a heartbeat if someone I love needed a hand.",                              w:[ 0, .5,-.7, 0]},
  {t:"Mystery flavor? Unmarked trail? Big red button? I simply have to know.",                                   w:[ .3, 0, 0, .7]}
];
const AXMAX=[2.3, 2.5, 2.7, 2.7];
const SPECTRA=[
  {l:"Deep Calm", r:"Full Charge"},
  {l:"Lone Path", r:"Full Party"},
  {l:"Easy Living", r:"Champion Road"},
  {l:"Steady Hand", r:"Wild Card"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'pokemon',
  quizName: 'Starter Pokémon Quiz',
  eyebrow: 'Trainer Alignment Test',
  title: { pre: 'Which ', em: 'Pokémon', post: ' Are You?' },
  lede: 'Ten statements, one honest read of the creature inside you. Answer as the you who shows up when the battle music starts.',
  seal: { char: '⚡' },
  rosterNoun: 'Pokémon',
  beginLabel: 'Step into the tall grass',
  tierLabels: { front: 'Headliner', cut: 'Rare Encounter' },
  shareEmoji: '⚡',
  shareGradient: 'from-yellow-400 to-amber-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Pokémon Are You? test. mypersonalityquizzes.com/quiz/pokemon`,
  disclaimer: 'Original emblems generated for this quiz. Pokémon and its creatures are © Nintendo / Creatures Inc. / GAME FREAK Inc. — this is an unofficial fan-made personality test.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
