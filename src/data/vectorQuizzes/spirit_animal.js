// What's Your Spirit Animal? — vector quiz data module.
//
// Eight animal archetypes placed evenly around a 2-axis space; matching is
// cosine similarity (see src/utils/vectorQuiz.js). The Monte-Carlo battery in
// spirit_animal.test.js re-verifies reachability/entropy/sensitivity after
// every roster or question edit — run it before shipping ANY change.
//
// Axes: [bold, pack], each in [-1, 1]
//   bold: -1 gentle/patient   / +1 fierce/direct
//   pack: -1 solitary/self-contained / +1 together/communal
//
// The eight sit at 45° intervals so no result shadows another. dolphin
// carries the smallest magnitude on purpose: an all-neutral taker falls back
// (nearest-point) to the friendliest read.

/* ---------- roster: every animal is a direction in 2-space ---------- */
const CHARS = {
  lion:{name:"The Lion", tag:"The Golden Standard", tier:"front", glyph:"burst", aura:"#e8a23a", img:null, emoji:"🦁",
    v:[.92,.38], kindred:"wolf", rival:"owl",
    traits:["Confident","Protective","Decisive","Magnetic","Proud"],
    desc:"You don't chase the spotlight; it just keeps finding where you already are. When a room needs someone to decide, defend, or go first, heads turn toward you before anyone says a word — and you've stopped pretending you mind. Your pride isn't vanity. It's the standard you hold for everyone lucky enough to be yours."},
  wolf:{name:"The Wolf", tag:"The Loyal Compass", tier:"front", glyph:"paw", aura:"#7d8fa8", img:null, emoji:"🐺",
    v:[.38,.92], kindred:"lion", rival:"cat",
    traits:["Loyal","Strategic","Devoted","Tough","True"],
    desc:"You are ride-or-die in a world of ride-or-maybe. Your circle is small, chosen, and permanent — cross someone you love and you'll discover exactly how much wilderness you keep behind those good manners. You think in packs: who's struggling, who's thriving, who needs backup tonight. They all sleep easier because of you."},
  dolphin:{name:"The Dolphin", tag:"The Bright Current", tier:"front", glyph:"wave", aura:"#58b8d9", img:null, emoji:"🐬",
    v:[-.36,.87], kindred:"wolf", rival:"eagle",
    traits:["Playful","Clever","Social","Buoyant","Quick"],
    desc:"You're the reason the group chat is funny and the hard day gets survivable. Your intelligence is quick and generous — you read a room in seconds and then lift it, because life's too short for a heavy silence you could have turned into a running joke. People mistake your lightness for simplicity. The joke, as usual, is yours."},
  deer:{name:"The Deer", tag:"The Gentle Radar", tier:"front", glyph:"leaf", aura:"#c9a06a", img:null, emoji:"🦌",
    v:[-.92,.38], kindred:"dolphin", rival:"bear",
    traits:["Sensitive","Graceful","Alert","Kind","Present"],
    desc:"You feel the temperature of a room drop before anyone else knows a window is open. That sensitivity is your superpower and your tax: you notice everything — the unsaid thing, the forced smile, the friend who went quiet — and you move toward it gently, without making it weird. The world is louder than you'd like. You soften it anyway."},
  owl:{name:"The Owl", tag:"The Midnight Library", tier:"front", glyph:"eye", aura:"#8b7ae8", img:null, emoji:"🦉",
    v:[-.92,-.38], kindred:"deer", rival:"lion",
    traits:["Wise","Observant","Independent","Measured","Deep"],
    desc:"You watch, you wait, and then you say the one sentence that reorganizes the whole conversation. Crowds drain you, but ideas never do — your inner life is a lit window at 2am, full of books half-read and thoughts fully formed. People come to you for advice and leave wondering how you knew. You always knew. You were paying attention."},
  cat:{name:"The Cat", tag:"The Sovereign Comfort", tier:"front", glyph:"coil", aura:"#b98fd6", img:null, emoji:"🐈",
    v:[-.38,-.92], kindred:"owl", rival:"wolf",
    traits:["Independent","Selective","Serene","Self-assured","Cozy"],
    desc:"Your affection is real but it is by invitation only, and that is precisely why it means so much. You've mastered what most people spend decades chasing: genuinely enjoying your own company, on your own schedule, in your own sunbeam. You show up for people fully — when you choose to. The choosing is the point."},
  eagle:{name:"The Eagle", tag:"The Long View", tier:"front", glyph:"feather", aura:"#5f88c4", img:null, emoji:"🦅",
    v:[.38,-.92], kindred:"bear", rival:"dolphin",
    traits:["Visionary","Focused","Free","Exacting","Solo"],
    desc:"You see the whole map while everyone else argues about the next turn. Heights that scare most people are simply where you think best — alone, unhurried, with the noise of the ground far away. You commit rarely, but when you dive, you dive all the way. Your life is proof that solitude and ambition were never opposites."},
  bear:{name:"The Bear", tag:"The Quiet Mountain", tier:"front", glyph:"tree", aura:"#8a6f4d", img:null, emoji:"🐻",
    v:[.92,-.38], kindred:"lion", rival:"deer",
    traits:["Strong","Grounded","Patient","Protective","Unmovable"],
    desc:"You are slow to anger, impossible to move, and exactly who everyone hopes shows up when things get genuinely bad. You'd rather be underestimated — it's quieter — but the people who know you have seen the moment the easygoing giant stands all the way up. You guard your peace, your people, and your honey. In that order some days."}
};

/* ---------- questions: weight vector [bold, pack] ---------- */
const Q = [
  {t:"When something needs confronting, I'd rather have the hard conversation today than tiptoe around it for a week.",       w:[ 1, 0]},
  {t:"I get further with patience and gentleness than force — I win people over, not push them over.",                         w:[-1, 0]},
  {t:"Risk sharpens me: I make my best moves when the stakes are real.",                                                       w:[ 1, 0]},
  {t:"I'll trade winning the point for peace in the room almost every time.",                                                  w:[-1, 0]},
  {t:"I do nearly everything better with my people around — energy, ideas, courage, all of it.",                               w:[ 0, 1]},
  {t:"My best thinking happens alone, and I guard that solitude fiercely.",                                                    w:[ 0,-1]},
  {t:"Being part of a tight-knit group — knowing my people and being known — is non-negotiable for me.",                       w:[ 0, 1]},
  {t:"I could vanish on a solo trip for a week and come back restored, not lonely.",                                           w:[ 0,-1]},
  {t:"When a group goes sideways, I step up and take charge without waiting to be asked.",                                     w:[ .5, .5]},
  {t:"I keep protective watch over the people I love from a slight distance — steady, but not in the middle of everything.",   w:[ .5,-.5]}
];
const AXMAX=[5, 5];
const SPECTRA=[
  {l:"Gentle", r:"Fierce"},
  {l:"Lone Path", r:"Pack Heart"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'spirit_animal',
  quizName: 'Spirit Animal Match',
  eyebrow: 'The Wild Mirror',
  title: { pre: "What's Your ", em: 'Spirit Animal', post: '?' },
  lede: 'Ten honest statements about how you move through the world — how you fight, rest, love, and roam. Answer as the creature you actually are, and your animal will find you.',
  seal: { char: '🐾' },
  rosterNoun: 'animals',
  beginLabel: 'Find my animal',
  tierLabels: { front: 'Spirit Animal', cut: 'Spirit Animal' },
  shareEmoji: '🐾',
  shareGradient: 'from-emerald-400 to-teal-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the What's Your Spirit Animal? quiz. mypersonalityquizzes.com/quiz/spirit_animal`,
  disclaimer: 'A playful animal-archetype match, written with affection for the folklore that pairs people with creatures. It reads the direction you lean — fierce or gentle, pack or lone path — for fun and reflection, not diagnosis.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
