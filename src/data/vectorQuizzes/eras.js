// Which Taylor Swift Era Are You? — vector quiz data module.
//
// Conversion of the original 'pick'-mode eras quiz (src/data/quizzes/eras.js)
// to the vector-matching experience. Every era is a position in 4-axis
// personality space; matching is cosine similarity (see src/utils/vectorQuiz.js
// for the why). The Monte-Carlo battery in eras.test.js re-verifies
// reachability/entropy/sensitivity after every roster or question edit — run
// it before shipping ANY change to this file.
//
// All eight original resultKeys are preserved exactly (saved results reference
// them); speak_now, tortured_poets, and showgirl are additive. The roster is
// the real era/album catalog — nothing invented. Results are eras as
// personality archetypes, not the artist; no lyrics are quoted anywhere.
//
// Axes: [heart, time, feel, stage], each in [-1, 1]
//   heart: -1 guarded     / +1 open-hearted
//   time:  -1 rooted      / +1 reinventing
//   feel:  -1 cool-headed / +1 full-feeling
//   stage: -1 candlelight / +1 spotlight

/* ---------- roster: every era is a direction in 4-space ---------- */
const CHARS = {
  debut:{name:"Debut (Country Roots)", tag:"The Front-Porch Storyteller", tier:"cut", glyph:"tree", aura:"#4fc9a0", img:null, emoji:"🤠",
    v:[.65,-.95,.25,-.45], kindred:"fearless", rival:"reputation",
    traits:["Sincere","Nostalgic","Homegrown","Brave","Unpolished"],
    desc:"You're the front-porch storyteller — earnest, a little unpolished, and completely unembarrassed about feeling things sincerely. You remember exactly where you came from and who was there at the very beginning, and you'd rather be genuine than slick every single time. Saying the sweet thing out loud takes real courage, and you've had it from day one."},
  fearless:{name:"Fearless", tag:"The Golden Leap", tier:"front", glyph:"flash", aura:"#f0c04a", img:null, emoji:"✨",
    v:[.95,-.40,.55,.30], kindred:"lover", rival:"reputation",
    traits:["Hopeful","Wholehearted","Golden","Daring","Romantic"],
    desc:"You still believe in the big moment — the leap, the first dance, the yes — and you refuse to apologize for it. Where other people hedge and wait for guarantees, you throw your whole heart in, because to you that's the entire point of having one. Your optimism isn't naive; it's a choice you keep making on purpose, and it quietly makes everyone around you braver."},
  speak_now:{name:"Speak Now", tag:"The Handwritten Confession", tier:"cut", glyph:"butterfly", aura:"#b07fe0", img:null, emoji:"💜",
    v:[.50,-.10,.80,.55], kindred:"fearless", rival:"midnights",
    traits:["Outspoken","Whimsical","Self-made","Dramatic","Sincere"],
    desc:"You write your own story — every single word of it — and you say the thing everyone else is only whispering. There's a streak of fairy-tale whimsy in you, but when a moment demands courage you'll stand up in the middle of the ceremony and object. People learn fast that your softness comes with a spine."},
  red:{name:"Red", tag:"The Burning Autumn", tier:"front", glyph:"leaf", aura:"#e05348", img:null, emoji:"🧣",
    v:[.30,-.50,1.0,.00], kindred:"tortured_poets", rival:"nineteen89",
    traits:["Intense","All-or-nothing","Nostalgic","Passionate","Vivid"],
    desc:"You feel everything at maximum saturation — joy, heartbreak, nostalgia — all burning at once like October leaves. You'd rather love something completely and lose it than live at half strength, and you have a rare gift for turning your messiest chapters into your most beautiful stories. People bring you their biggest feelings because you never, ever minimize."},
  nineteen89:{name:"1989", tag:"The Clean-Slate Skyline", tier:"front", glyph:"wave", aura:"#5fb7e8", img:null, emoji:"🌆",
    v:[.40,.90,-.50,.75], kindred:"showgirl", rival:"red",
    traits:["Reinvented","Bright","Unbothered","Social","Polished"],
    desc:"You're the clean slate, the new city, the bright chorus after a heavy chapter. Criticism rolls right off you, and you build a loyal circle that feels like a skyline — dazzling, glittering, and always up for something. You genuinely believe the best era is the one starting right now."},
  reputation:{name:"Reputation", tag:"The Armored Phoenix", tier:"front", glyph:"coil", aura:"#9aa7b3", img:null, emoji:"🐍",
    v:[-.95,.45,-.30,-.35], kindred:"midnights", rival:"lover",
    traits:["Guarded","Strategic","Resilient","Loyal","Unapologetic"],
    desc:"You were forged the day you stopped auditioning for other people's approval. Being misjudged didn't break you — it clarified you — so now you keep a small, fiercely trusted circle and let your results do all of the public speaking. The plot twist everyone misses: under the dark glitter, you love harder than anyone."},
  lover:{name:"Lover", tag:"The Defiant Soft Heart", tier:"front", glyph:"blossom", aura:"#f487b8", img:null, emoji:"💗",
    v:[1.0,.25,.35,.50], kindred:"fearless", rival:"reputation",
    traits:["Openhearted","Warm","Celebratory","Devoted","Golden-hour"],
    desc:"You choose softness on purpose — not because you've never been hurt, but because you have, and you keep your heart open anyway. You romanticize the everyday: golden light on the kitchen table, handwritten notes, celebrating your people loudly and often. Your warmth isn't weakness; it's the most defiant thing about you."},
  folklore:{name:"Folklore / Evermore", tag:"The Firelight Fabulist", tier:"front", glyph:"ink", aura:"#a8b294", img:null, emoji:"🌲",
    v:[-.25,-.40,.05,-.95], kindred:"midnights", rival:"showgirl",
    traits:["Introspective","Imaginative","Quiet","Perceptive","Cozy"],
    desc:"You're happiest a little way off from the noise, weaving meaning out of memory, imagination, and other people's half-told stories. Your inner world is so vivid that solitude never feels empty, and you process everything by turning it into narrative. People discover, years in, that the quiet one was paying the deepest attention all along."},
  midnights:{name:"Midnights", tag:"The 3 A.M. Mirror", tier:"front", glyph:"gear", aura:"#7d84e8", img:null, emoji:"🌙",
    v:[-.60,.15,.60,-.50], kindred:"folklore", rival:"nineteen89",
    traits:["Self-aware","Sleepless","Honest","Complicated","Reflective"],
    desc:"You're the 3 a.m. era — self-aware, a little sleepless, quietly replaying the moments that made you. You hold your contradictions out in the open: confident and doubting, glittering and moody, totally over it and still thinking about it. That midnight honesty is exactly why people trust you with their own unvarnished selves."},
  tortured_poets:{name:"The Tortured Poets Department", tag:"The Ink-Stained Heart", tier:"front", glyph:"feather", aura:"#cdbfa3", img:null, emoji:"🪶",
    v:[-.10,.05,1.0,-.30], kindred:"red", rival:"showgirl",
    traits:["Confessional","Raw","Literary","Dramatic","Unfiltered"],
    desc:"You process life with a pen in your hand and absolutely nothing held back. Every heartbreak, grudge, and five-minute crush gets the full literary treatment, because to you an unexamined feeling is a wasted one. It's dramatic, it's a lot, and it's also the bravest kind of honesty there is."},
  showgirl:{name:"The Life of a Showgirl", tag:"The Center-Stage Shimmer", tier:"front", glyph:"fan", aura:"#f08a3c", img:null, emoji:"💃",
    v:[.45,.55,-.35,1.0], kindred:"nineteen89", rival:"folklore",
    traits:["Dazzling","Confident","Theatrical","Tireless","Radiant"],
    desc:"You understand something most people never learn: the sparkle is the work. Behind your effortless-looking shine sits relentless discipline, sequins over sore feet, and a professional's refusal to phone anything in. When the curtain rises, you give the whole room a reason to believe in showing up dazzling."}
};

/* ---------- questions: weight vector [heart, time, feel, stage] ---------- */
const Q = [
  {t:"When I love something — a person, a place, a random Tuesday — everyone within earshot hears about it.", w:[ 1, 0, 0, 0]},
  {t:"New people get the friendly trailer version of me; the full story takes years to earn.",                w:[-1, 0, 0, 0]},
  {t:"Every couple of years I basically become a new person — new look, new obsessions, whole new chapter.", w:[ 0, 1, 0, 0]},
  {t:"Old photos, the hometown, the people who knew me back when — that's my anchor, not my past.",          w:[ 0,-1, 0, 0]},
  {t:"I feel everything at full volume — great days sparkle, and bad ones become a whole saga.",             w:[ 0, 0, 1, 0]},
  {t:"Even mid-crisis I stay level — I'm the calm voice in the room while everyone else spirals.",           w:[ 0, 0,-1, 0]},
  {t:"A big night out — sparkle, music, a little audience — genuinely recharges me.",                        w:[ 0, 0, 0, 1]},
  {t:"My perfect evening is candlelight, quiet, and one or two people I completely trust.",                  w:[ 0, 0, 0,-1]},
  {t:"I'd rather pour the sharp, honest thing into a journal than say it out loud in the room.",             w:[-.5, 0, .5, 0]},
  {t:"When life knocks me down, my comeback arrives with an outfit, a soundtrack, and perfect timing.",      w:[ 0, .5, 0, .5]}
];
const AXMAX=[2.5, 2.5, 2.5, 2.5];
const SPECTRA=[
  {l:"Guarded", r:"Open-Hearted"},
  {l:"Rooted", r:"Reinventing"},
  {l:"Cool-Headed", r:"Full-Feeling"},
  {l:"Candlelight", r:"Spotlight"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'eras',
  quizName: 'Eras Quiz',
  eyebrow: 'Era Alignment Test',
  title: { pre: 'Which ', em: 'Taylor Swift', post: ' Era Are You?' },
  lede: 'Ten statements, one honest read of your current chapter. Answer as the person you are right now — not the era you miss.',
  seal: { char: '🫶' },
  rosterNoun: 'eras',
  beginLabel: 'Step into your era',
  tierLabels: { front: 'Main Stage', cut: 'Deep Cut' },
  shareEmoji: '🎤',
  shareGradient: 'from-pink-400 to-fuchsia-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Taylor Swift Era Are You? test. mypersonalityquizzes.com/quiz/eras`,
  disclaimer: 'An unofficial fan-made personality test. Not affiliated with, endorsed by, or connected to Taylor Swift, her management, or her labels. Era descriptions are original writing about personality archetypes — no lyrics are quoted.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
