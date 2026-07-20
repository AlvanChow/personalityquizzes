// Which Naruto Character Are You? — data module.
//
// Faithful port of the standalone "Shinobi Alignment Test". Every character
// is a position in 4-axis personality space; matching is cosine similarity
// (see src/utils/vectorQuiz.js for the why). The Monte-Carlo battery in
// naruto.test.js re-verifies reachability/entropy/sensitivity after every
// roster or question edit — run it before shipping ANY change to this file.
//
// Axes: [logos, social, drive, express], each in [-1, 1]
//   logos:   -1 strategy  / +1 instinct
//   social:  -1 lone      / +1 bonds
//   drive:   -1 protector / +1 trailblazer (ambition)
//   express: -1 reserved  / +1 expressive
//
// Character images: every entry has img:null. Paste a URL to swap the
// generated chakra emblem for a photo; the emblem code handles the rest.

import { G, emblem } from './glyphs';
export { G, emblem };

/* ---------- glyph builders (all original, centred at 110,110) ---------- */
const CHARS = {
  naruto:{name:"Naruto Uzumaki", tag:"The Unbreakable Heart", tier:"front", glyph:"spiral", aura:"#f5a623", img:null,
    v:[.80,.90,.30,.90], kindred:"lee", rival:"sasuke",
    traits:["Relentless","Warm","Loud","Loyal","Optimistic"],
    desc:"You lead with pure heart and refuse to quit, no matter how long the odds. People underestimate you at first, then get pulled into your orbit by sheer force of belief. Loyalty is your whole religion — you'd walk through fire for anyone you've claimed as your own."},
  sasuke:{name:"Sasuke Uchiha", tag:"The Lone Blade", tier:"front", glyph:"lightning", aura:"#6d5bd0", img:null,
    v:[-.20,-.90,.90,-.30], kindred:"itachi", rival:"naruto",
    traits:["Driven","Independent","Intense","Gifted","Guarded"],
    desc:"You carry your goals alone and hold yourself to a standard almost nobody else can see. Talent comes easily, and you lean on discipline to carry you the rest of the way. Beneath the cool distance sits a fierce, complicated loyalty you rarely let anyone witness."},
  kakashi:{name:"Kakashi Hatake", tag:"The Quiet Master", tier:"front", glyph:"lightning", aura:"#7fb2d9", img:null,
    v:[-.80,.00,-.40,-.70], kindred:"itachi", rival:"guy",
    traits:["Wise","Laid-back","Perceptive","Mysterious","Steady"],
    desc:"You're endlessly capable and wear it lightly, hiding real depth behind a relaxed, hard-to-read exterior. You read people and situations faster than you let on, and you prefer to guide while others find their footing. You'll show up late without blinking and stand by your people without fail."},
  itachi:{name:"Itachi Uchiha", tag:"The Silent Sacrifice", tier:"front", glyph:"feather", aura:"#b23a55", img:null,
    v:[-.80,-.40,-.20,-.60], kindred:"kakashi", rival:"orochimaru",
    traits:["Genius","Selfless","Composed","Strategic","Enigmatic"],
    desc:"You shoulder heavy burdens alone and let people misunderstand you if it keeps them safe. Brilliant and self-controlled, you play a longer game than anyone around you realizes. Every hard choice you make quietly serves someone you love."},
  gaara:{name:"Gaara", tag:"The Steady Shield", tier:"front", glyph:"sand", aura:"#cf6f47", img:null,
    v:[-.30,-.20,.00,-.85], kindred:"sasuke", rival:"naruto",
    traits:["Stoic","Protective","Composed","Resilient","Loyal"],
    desc:"You've turned hard-won pain into a quiet duty to protect. Calm to the point of stillness, you carry authority without ever raising your voice. People feel safer when you're the one standing guard."},
  jiraiya:{name:"Jiraiya", tag:"The Gallant Sage", tier:"front", glyph:"toad", aura:"#cc4f3e", img:null,
    v:[.35,.75,-.35,.85], kindred:"naruto", rival:"orochimaru",
    traits:["Wise","Flamboyant","Big-hearted","Free-spirited","Devoted"],
    desc:"You mentor with a wide-open heart and a taste for the dramatic entrance. Experience made you wise, and you spend that wisdom lifting up the people coming after you. Underneath the showmanship runs deep devotion to your students and your ideals."},
  minato:{name:"Minato Namikaze", tag:"The Yellow Flash", tier:"front", glyph:"flash", aura:"#e8c14a", img:null,
    v:[-.70,.50,-.70,-.20], kindred:"kakashi", rival:"obito",
    traits:["Brilliant","Swift","Humble","Selfless","Composed"],
    desc:"You combine dazzling skill with genuine humility, solving problems at a speed others struggle to follow. Calm under pressure, you lead by example and put your people first at every turn. When everything hangs in the balance, you give whatever it takes to protect what you love."},
  tsunade:{name:"Tsunade", tag:"The Healing Fist", tier:"front", glyph:"diamond", aura:"#35b58e", img:null,
    v:[.10,.50,-.15,.55], kindred:"jiraiya", rival:"orochimaru",
    traits:["Bold","Nurturing","Strong-willed","Brash","Loyal"],
    desc:"You lead with raw strength and an even bigger sense of duty to the people under you. A soft touch for healing sits right alongside a temper and a fist that can level a wall. You gamble big, love hard, and carry burdens most people would crumble under."},
  hashirama:{name:"Hashirama Senju", tag:"The God of Shinobi", tier:"front", glyph:"tree", aura:"#57a84f", img:null,
    v:[.50,.85,-.35,.75], kindred:"naruto", rival:"madara",
    traits:["Idealistic","Warm","Powerful","Forgiving","Dramatic"],
    desc:"You dream big and lead with an open, forgiving heart, holding a whole community together through sheer warmth. Enormous power sits alongside a goofy, emotional streak that puts everyone at ease. You believe in people to a fault and keep reaching for a world where everyone belongs."},
  tobirama:{name:"Tobirama Senju", tag:"The Cold Current", tier:"front", glyph:"wave", aura:"#3fa2c0", img:null,
    v:[-.75,-.25,-.35,-.45], kindred:"hashirama", rival:"orochimaru",
    traits:["Pragmatic","Blunt","Brilliant","Disciplined","Wary"],
    desc:"You approach every problem with a cool, analytical mind and say the hard truths out loud. A relentless innovator, you build the tools and systems others rely on for generations. Beneath the stern exterior runs a fierce loyalty to the people and the order you protect."},
  lee:{name:"Rock Lee", tag:"The Burning Effort", tier:"front", glyph:"flame", aura:"#3fbf6f", img:null,
    v:[.70,.50,.10,.95], kindred:"guy", rival:"neji",
    traits:["Hardworking","Sincere","Passionate","Brave","Kind"],
    desc:"You believe hard work beats raw talent, and you'll bleed to prove it. Your sincerity is total: earnest effort, honest ambition, and a big open heart. Where others see limits, you see a training montage."},
  guy:{name:"Might Guy", tag:"The Blazing Spirit", tier:"cut", glyph:"flame", aura:"#35b85f", img:null,
    v:[.90,.60,.20,1.0], kindred:"lee", rival:"kakashi",
    traits:["Intense","Sincere","Devoted","Courageous","Energetic"],
    desc:"You bring maximum intensity to everything, from training to friendship to a single thumbs-up. Your energy is contagious and your sincerity is bulletproof. When things get truly desperate, you're capable of feats that leave legends speechless."},
  neji:{name:"Neji Hyuga", tag:"The Sharpened Pride", tier:"cut", glyph:"ripple", aura:"#8fb8d8", img:null,
    v:[-.55,-.35,.10,-.50], kindred:"sasuke", rival:"lee",
    traits:["Precise","Disciplined","Talented","Proud","Evolving"],
    desc:"You hold yourself and everyone around you to exacting standards, with the skill to back it up. Early on you believed the world was fixed; growth taught you to fight for a different future. Precise and disciplined, you carry a depth of feeling you seldom show."},
  shikamaru:{name:"Shikamaru Nara", tag:"The Ten-Move Mind", tier:"front", glyph:"shadow", aura:"#7a8aa0", img:null,
    v:[-.95,.20,-.60,-.60], kindred:"kakashi", rival:"sasuke",
    traits:["Strategic","Calm","Perceptive","Loyal","Understated"],
    desc:"You conserve energy for what matters and solve problems in your head before anyone notices there was one. You see several moves ahead and favor a clever exit over a loud brawl. Under all the sighing sits someone fiercely dependable the moment your people need a plan."},
  bee:{name:"Killer Bee", tag:"The Free Rhythm", tier:"cut", glyph:"sound", aura:"#29c0b0", img:null,
    v:[.20,.60,.15,.90], kindred:"naruto", rival:"sasuke",
    traits:["Confident","Creative","Generous","Powerful","Free"],
    desc:"You move to your own beat and turn everything into a performance, backed by serious power. Confident and generous, you mentor without ego and celebrate out loud. You've made peace with the storm inside you and channel it straight into flow."},
  kurama:{name:"Kurama", tag:"The Nine-Tailed Fox", tier:"front", glyph:"fox", aura:"#e5642b", img:null,
    v:[.45,-.55,.55,.80], kindred:"naruto", rival:"obito",
    traits:["Proud","Powerful","Sardonic","Independent","Fierce"],
    desc:"You carry ancient pride and enough raw power to level a landscape when provoked. Sharp-tongued and fiercely independent, you answer to no one and make sure everyone knows it. Under all the growling sits a loyalty that runs deep once someone finally earns your respect."},
  orochimaru:{name:"Orochimaru", tag:"The Endless Seeker", tier:"front", glyph:"coil", aura:"#a983d6", img:null,
    v:[-.70,-.90,1.0,-.35], kindred:"madara", rival:"itachi",
    traits:["Brilliant","Ambitious","Fearless","Solitary","Obsessive"],
    desc:"You're driven by an insatiable hunger to know and to slip past every limit set in front of you. Brilliant and utterly self-directed, you follow curiosity past every fence others stop at. Attachment is a luxury; discovery is the whole point."},
  deidara:{name:"Deidara", tag:"The Explosive Artist", tier:"cut", glyph:"burst", aura:"#e0b13a", img:null,
    v:[.30,-.50,.75,.85], kindred:"bee", rival:"sasori",
    traits:["Artistic","Bold","Proud","Dramatic","Impulsive"],
    desc:"You believe a thing reaches its peak in the instant it goes off. Bold, dramatic, and proud of your craft, you aim for a spectacular impression every single time. You take your art personally, because to you it is deeply personal."},
  sasori:{name:"Sasori", tag:"The Timeless Craftsman", tier:"cut", glyph:"gear", aura:"#b06a4a", img:null,
    v:[-.75,-.85,.60,-.60], kindred:"orochimaru", rival:"deidara",
    traits:["Meticulous","Patient","Controlled","Detached","Ingenious"],
    desc:"You believe true art lasts forever, and you build with patience most people can't summon. Meticulous and self-contained, you prize control and permanence. Behind the calm exterior runs a mind always engineering the next perfect piece."},
  hidan:{name:"Hidan", tag:"The Undying Zealot", tier:"cut", glyph:"jashin", aura:"#c23a34", img:null,
    v:[.55,-.55,.65,.90], kindred:"deidara", rival:"shikamaru",
    traits:["Fanatical","Loud","Reckless","Fearless","Volatile"],
    desc:"You throw yourself into your beliefs with total, screaming devotion. Loud and reckless, you fear almost nothing and treat pain as part of the ritual. Once you commit to something, you follow it to the bitter end and laugh the whole way there."},
  obito:{name:"Obito Uchiha", tag:"The Man Behind the Mask", tier:"front", glyph:"eye", aura:"#bb4736", img:null,
    v:[-.75,-.75,.90,-.55], kindred:"sasuke", rival:"kakashi",
    traits:["Calculating","Enigmatic","Driven","Complex","Guarded"],
    desc:"You move through the world behind a mask, letting people see only what serves your design. A single loss reshaped your whole path, and you pursue your vision with relentless, patient resolve. Every layer you wear hides a heart that once believed, and in some buried way still does."},
  pain:{name:"Pain (Nagato)", tag:"The Voice of Pain", tier:"front", glyph:"rinne", aura:"#8168cc", img:null,
    v:[-.55,-.30,.95,-.45], kindred:"obito", rival:"naruto",
    traits:["Messianic","Calm","Philosophical","Detached","Resolute"],
    desc:"You carry a grand vision and the cold conviction to see it through. Calm and philosophical, you speak in absolutes about a broken world and your plan to remake it. Every action serves the cause, and you shoulder the weight of that mission with unshakable resolve."},
  madara:{name:"Madara Uchiha", tag:"The Sovereign of War", tier:"front", glyph:"uchiwa", aura:"#a8343e", img:null,
    v:[.35,-.70,1.0,.40], kindred:"obito", rival:"naruto",
    traits:["Arrogant","Powerful","Theatrical","Ambitious","Unyielding"],
    desc:"You command any room through sheer force of presence and refuse to bow to anyone. Overwhelming ambition drives you toward a vision only you can see, delivered with theatrical flair. You measure yourself against legends and fully intend to surpass them all."}
};

/* ---------- questions: weight vector [logos, social, drive, express] ---------- */
const Q = [
  {t:"I make my best calls on a gut feeling and figure out the reasons later.",        w:[ 1, 0, 0, 0]},
  {t:"Before anything big, I've got a plan, a backup plan, and probably a spreadsheet.",                 w:[-1, 0, 0, 0]},
  {t:"My people are my whole world — I'd drop everything the second one of them needed me.",               w:[ 0, 1, 0, 0]},
  {t:"Give me headphones, a closed door, and zero interruptions, and I'm in my element.",                               w:[ 0,-1, 0, 0]},
  {t:"I want to be the best at what I do, and I'm fine with everyone knowing it.",w:[ 0, 0, 1, 0]},
  {t:"My perfect weekend is a comfy couch, great snacks, and absolutely nowhere to be.",                             w:[ 0, 0,-1, 0]},
  {t:"You can read my whole mood off my face before I say a single word.",                   w:[ 0, 0, 0, 1]},
  {t:"I keep my feelings to myself and let very few people past the surface.",                     w:[ 0, 0, 0,-1]},
  {t:"My big goal or someone I love? I'd choose the person every single time.",                   w:[ 0, .6,-.8, 0]},
  {t:"I love making a statement — bold looks, big gestures, a little drama, that's me.",    w:[ 0, 0, .3, .7]}
];
const AXMAX=[2, 2.6, 3.1, 2.7];
const SPECTRA=[
  {l:"Strategy", r:"Instinct"},
  {l:"Lone Wolf", r:"Bonds First"},
  {l:"Protector", r:"Trailblazer"},
  {l:"Reserved", r:"Expressive"}
];

export { CHARS, Q, AXMAX, SPECTRA };


/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'naruto',
  quizName: 'Naruto Character Quiz',
  eyebrow: 'Shinobi Alignment Test',
  title: { pre: 'Which ', em: 'Naruto', post: ' Character Are You?' },
  lede: 'Ten statements, one honest read of your ninja way. Answer for the version of you that shows up when it counts.',
  seal: { char: '忍' },
  rosterNoun: 'characters',
  beginLabel: 'Begin the trial',
  tierLabels: { front: 'Front Line', cut: 'Deep Cut' },
  shareEmoji: '🍥',
  shareGradient: 'from-orange-400 to-red-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Naruto Character Are You? test. mypersonalityquizzes.com/quiz/naruto`,
  disclaimer: 'Original emblems generated for this quiz. Naruto and its characters are © Masashi Kishimoto / Shueisha — this is an unofficial fan-made personality test.',
  // CJK display fonts, loaded at runtime only while this quiz is open.
  fontsHref: 'https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;700;800&family=Zen+Kaku+Gothic+New:wght@400;500;700&family=Yuji+Syuku&display=swap',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
