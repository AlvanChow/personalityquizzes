// Which Disney Character Are You? — data module.
//
// Vector-quiz conversion of the original pick-mode Disney Hero quiz. Every
// character is a position in 4-axis personality space; matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in disney.test.js re-verifies reachability/entropy/sensitivity
// after every roster or question edit — run it before shipping ANY change.
//
// The original eight resultKeys (moana, simba, elsa, mulan, aladdin, belle,
// stitch, buzz) are preserved exactly — users' saved results reference them.
//
// Axes: [leap, together, horizon, show], each in [-1, 1]
//   leap:     -1 careful plan / +1 leap of faith
//   together: -1 lone star    / +1 found family
//   horizon:  -1 hearth       / +1 horizon
//   show:     -1 soft-spoken  / +1 showstopper
//
// Character images: every entry has img:null. Paste a URL to swap the
// generated emblem for a photo; the emblem code handles the rest.

import { G, emblem } from './glyphs';
export { G, emblem };

const CHARS = {
  moana:{name:"Moana", tag:"The Ocean's Chosen", tier:"front", glyph:"wave", aura:"#17a398", img:null, emoji:"🌊",
    v:[.10,.60,.90,.00], kindred:"mulan", rival:"maui",
    traits:["Determined","Duty-bound","Adventurous","Empathetic","Resilient"],
    desc:"The horizon has been calling you since before you could name it, and you've finally stopped pretending otherwise. You carry two loyalties at once — the people counting on you and the voice insisting there's more — and your gift is refusing to choose between them. You learn on open water, correct course without shame, and come home with exactly what everyone needed."},
  simba:{name:"Simba", tag:"The Sun-Crowned Heir", tier:"front", glyph:"paw", aura:"#f5a623", img:null, emoji:"🦁",
    v:[.60,.65,-.35,.75], kindred:"mufasa", rival:"scar",
    traits:["Playful","Warm","Charismatic","Courageous","Growing"],
    desc:"You're warmth with a mane — playful, magnetic, the reason everyone remembers the afternoon. But your real story is the comeback: you know what it is to run from a hard chapter, and you know what it costs to turn around and walk back into it. When you finally step up, the crown fits so naturally that people wonder why you ever doubted."},
  elsa:{name:"Elsa", tag:"The Quiet Storm", tier:"front", glyph:"bloom", aura:"#a8dcf5", img:null, emoji:"❄️",
    v:[-.50,-.80,.30,-.60], kindred:"belle", rival:"genie",
    traits:["Composed","Powerful","Protective","Perfectionist","Reserved"],
    desc:"You learned early to fold your biggest self away — composed, careful, controlled — because your intensity felt like something that could hurt people. It never was the problem; the hiding was. You're at your most powerful the moment you stop performing smallness and let the storm be beautiful."},
  mulan:{name:"Mulan", tag:"The Quiet Avalanche", tier:"front", glyph:"blossom", aura:"#e0485a", img:null, emoji:"🏮",
    v:[-.35,.40,-.45,-.80], kindred:"moana", rival:"peter_pan",
    traits:["Brave","Resourceful","Loyal","Humble","Decisive"],
    desc:"You'll do the terrifying thing — not for glory, but because someone you love needs it done. You've never fit the mold people prepared for you, so you got resourceful instead: outworking, outthinking, and out-improvising everyone who underestimated you. Your proof is never in the speech; it's the mountain of quiet, decisive action behind you."},
  aladdin:{name:"Aladdin", tag:"The Diamond in the Rough", tier:"front", glyph:"diamond", aura:"#c39bed", img:null, emoji:"✨",
    v:[.85,.25,.15,.20], kindred:"genie", rival:"ursula",
    traits:["Quick-witted","Charming","Generous","Scrappy","Hopeful"],
    desc:"Nobody handed you anything, so you built the fastest improvisation reflexes in town — charm, timing, and an exit plan for every rooftop. What people miss under the quick wit is the generosity: you share what little you have without doing the math first. The only trap you ever fall into is thinking you need to be someone shinier, when the unpolished version was the treasure all along."},
  belle:{name:"Belle", tag:"The Open Book", tier:"front", glyph:"ink", aura:"#e8c14a", img:null, emoji:"📚",
    v:[-.55,-.25,.80,-.35], kindred:"elsa", rival:"cruella",
    traits:["Bookish","Perceptive","Kind","Independent","Unbending"],
    desc:"You live half in this world and half in a bigger one made of books, questions, and ideas — and you've stopped apologizing for it. Your defining gift is sight: you read past reputations and gruff exteriors to whoever is actually in there, and you're stubbornly right about people. Kind but immovable, you'd rather be genuinely odd than beautifully counterfeit."},
  stitch:{name:"Stitch", tag:"The Chaos With a Heart", tier:"front", glyph:"burst", aura:"#3b5bdc", img:null, emoji:"👾",
    v:[.95,.55,-.70,.60], kindred:"simba", rival:"buzz",
    traits:["Chaotic","Devoted","Weird","Fierce","Lovable"],
    desc:"You arrive in people's lives as pure chaos — loud, weird, breaking at least one lamp — and then turn out to be the most devoted heart in the room. You weren't built for belonging, so you built your own: a scrappy, mismatched family you'd defend against the whole galaxy. People start by tolerating you and end up unable to imagine the table without you."},
  buzz:{name:"Buzz Lightyear", tag:"The Mission Commander", tier:"front", glyph:"cube", aura:"#a8d833", img:null, emoji:"🚀",
    v:[-.70,.45,.45,-.15], kindred:"woody", rival:"stitch",
    traits:["Committed","Earnest","Disciplined","Confident","Loyal"],
    desc:"You commit with a seriousness other people save for emergencies — every task is a mission, every promise a launch sequence. That conviction is exactly why the important things get handed to you, even when you take the briefing a little too literally. Your best arc repeats forever: remembering that being one of the crew beats being the hero, and becoming twice as effective the moment you do."},
  woody:{name:"Woody", tag:"The Loyal Sheriff", tier:"front", glyph:"flash", aura:"#c07a45", img:null, emoji:"🤠",
    v:[-.35,.90,-.50,.05], kindred:"buzz", rival:"aladdin",
    traits:["Loyal","Responsible","Protective","Steadfast","Big-hearted"],
    desc:"You're the one who keeps the whole room together — headcounts done, feelings checked, nobody left behind at the rest stop. Leadership isn't a spotlight for you; it's a promise you renew every single day, especially on the days it isn't fun. Your deepest fear is being replaced, and your deepest gift is making everyone else feel irreplaceable."},
  ariel:{name:"Ariel", tag:"The Collector of Horizons", tier:"front", glyph:"fin", aura:"#f4547c", img:null, emoji:"🐚",
    v:[.70,.15,.95,.30], kindred:"rapunzel", rival:"ursula",
    traits:["Curious","Headstrong","Romantic","Daring","Restless"],
    desc:"You want the world so badly it physically aches — every gadget, every gizmo, every shore you haven't touched yet. People call it restlessness; it's actually courage, the refusal to spend your one life behind glass. When you finally trade the safe water for the strange shore, you don't look back."},
  rapunzel:{name:"Rapunzel", tag:"The Lantern-Lit Dreamer", tier:"front", glyph:"spiral", aura:"#f2a0d8", img:null, emoji:"☀️",
    v:[.10,.40,.90,.70], kindred:"ariel", rival:"maleficent",
    traits:["Creative","Sunny","Brave","Curious","Enthusiastic"],
    desc:"You've turned waiting into an art form — painting, reading, baking, mastering everything within reach while dreaming past it. But make no mistake: the moment the door opens, you're through it, frying pan in hand and heart wide open. You meet the world like a festival, and the world can't help joining in."},
  anna:{name:"Anna", tag:"The Open Door", tier:"front", glyph:"blossom", aura:"#c84f8f", img:null, emoji:"🌷",
    v:[.85,.80,.30,.50], kindred:"olaf", rival:"scar",
    traits:["Optimistic","Impulsive","Devoted","Fearless","Warm"],
    desc:"You love first and ask questions later, sprinting into snowstorms for people who slammed doors in your face. Optimism like yours gets mistaken for naivety right up until it saves everyone in the story. You're proof that the boldest thing a heart can do is stay open."},
  tiana:{name:"Tiana", tag:"The Dream Built by Hand", tier:"front", glyph:"leaf", aura:"#2e9e6b", img:null, emoji:"🐸",
    v:[-.90,-.05,.50,-.45], kindred:"mulan", rival:"peter_pan",
    traits:["Hardworking","Ambitious","Practical","Principled","Steadfast"],
    desc:"You don't wish on stars — you out-earn them, one shift and one saved-up coin at a time. Your dream is specific, priced, and closer than anyone realizes, because while they were talking, you were working. Your lesson is the sweet one: the people who love you belong inside the dream, not waiting outside until it's finished."},
  peter_pan:{name:"Peter Pan", tag:"The Boy Who Wouldn't Land", tier:"front", glyph:"feather", aura:"#56b949", img:null, emoji:"🪶",
    v:[.95,.15,.60,.85], kindred:"stitch", rival:"tiana",
    traits:["Playful","Fearless","Free","Cocky","Adventurous"],
    desc:"You treat growing up as a rumor you personally refuse to confirm. Life with you is crowing, flying, and one more adventure before bedtime — and somehow everyone is braver inside your orbit. Just remember the stars work both ways: the real magic was never the leaving, it's coming back with stories."},
  genie:{name:"Genie", tag:"The Phenomenal Friend", tier:"cut", glyph:"coil", aura:"#3fc3f0", img:null, emoji:"🪔",
    v:[.35,.60,.20,1.0], kindred:"aladdin", rival:"maleficent",
    traits:["Hilarious","Generous","Theatrical","Loyal","Boundless"],
    desc:"You're the biggest personality in every room, including a few rooms you're not technically in. Under the impressions, the bits, and the tenth costume change of the hour sits the truest heart going: you'd give anything — including your own freedom — for a friend. The only wish you keep forgetting to make is wanting something for yourself."},
  maui:{name:"Maui", tag:"The Showboat Demigod", tier:"cut", glyph:"ink", aura:"#c8b273", img:null, emoji:"🪝",
    v:[.40,-.10,.15,.95], kindred:"genie", rival:"moana",
    traits:["Boastful","Talented","Showy","Guarded","Heroic"],
    desc:"You're the hero of every story you tell, and to be fair, the stories are pretty great. Under the flexing and the victory chants lives someone who learned early that applause feels safer than closeness. Your best moments come when you stop performing greatness and just quietly do it — you really are that good."},
  olaf:{name:"Olaf", tag:"The Sunniest Snowman", tier:"cut", glyph:"ripple", aura:"#eff7ff", img:null, emoji:"☃️",
    v:[.30,1.0,-.30,.40], kindred:"anna", rival:"hades",
    traits:["Joyful","Innocent","Affectionate","Funny","Wise"],
    desc:"You love hard, hug first, and narrate the scary parts until they're funny. People underestimate the wisdom tucked inside your happiness — you've simply decided that wonder beats worry, every single time. Every group has a heart; you're the one that walks around on its own two feet."},
  maleficent:{name:"Maleficent", tag:"The Long-Game Sorceress", tier:"cut", glyph:"hex", aura:"#7d3bd1", img:null, emoji:"🐉",
    v:[-.95,-.65,.45,-.10], kindred:"scar", rival:"genie",
    traits:["Patient","Elegant","Formidable","Solitary","Proud"],
    desc:"You do not rage; you plan — beautifully, on a timescale that frightens impatient people. Excluded once, you made exclusion your kingdom: elegant, self-contained, and impossible to ignore. Your power was never the thorns; it's the patience, and what you choose to grow with it is entirely up to you."},
  ursula:{name:"Ursula", tag:"The Deal-Making Diva", tier:"cut", glyph:"coil", aura:"#d34fc0", img:null, emoji:"🐙",
    v:[-.60,-.35,.60,.95], kindred:"hades", rival:"ariel",
    traits:["Theatrical","Shrewd","Ambitious","Persuasive","Bold"],
    desc:"You've got flair, hunger, and a contract drafted before the room finishes describing its problem. Nobody reads what people secretly want faster than you, and nobody stages a comeback with more theater. Used generously, that's a superpower — the fine print is optional, and you know it."},
  scar:{name:"Scar", tag:"The Silver-Tongued Schemer", tier:"cut", glyph:"shadow", aura:"#a83d33", img:null, emoji:"👑",
    v:[-.70,-.50,1.0,.30], kindred:"maleficent", rival:"simba",
    traits:["Clever","Sardonic","Ambitious","Eloquent","Scheming"],
    desc:"You're the smartest voice in the room, and you'd simply prefer everyone acknowledge it. Wit is your weapon of choice — dry, elegant, always three sarcastic steps ahead of the crowd. The lesson waiting for you is the quiet one: a mind like yours doesn't need a throne to matter."},
  hades:{name:"Hades", tag:"The Fast-Talking Flame", tier:"cut", glyph:"flame", aura:"#8e9ff5", img:null, emoji:"🔥",
    v:[.10,-.45,.85,.70], kindred:"ursula", rival:"mufasa",
    traits:["Fast-talking","Fiery","Witty","Driven","Impatient"],
    desc:"You run hot, talk fast, and close deals before the other party has found the exit. Being handed the gloomy end of the bargain gave you a chip on your shoulder and the best one-liners in the pantheon. Channel the fire into building instead of burning and, honestly, nobody outworks you."},
  cruella:{name:"Cruella de Vil", tag:"The Uncompromising Icon", tier:"cut", glyph:"fan", aura:"#d5cbe8", img:null, emoji:"🖤",
    v:[.55,-.65,.55,.90], kindred:"ursula", rival:"belle",
    traits:["Dramatic","Fearless","Stylish","Obsessive","Unstoppable"],
    desc:"You'd rather be unforgettable than agreeable, and you dress like the exclamation point at the end of your own sentence. Half genius, half squealing tires, you commit to a vision with a totality that terrifies the timid. Point that ferocity at something worthy and the world doesn't stand a chance — darling, it never did."},
  mufasa:{name:"Mufasa", tag:"The Steady Sunrise", tier:"cut", glyph:"tree", aura:"#e07b2a", img:null, emoji:"🌅",
    v:[-.45,.65,-.85,-.30], kindred:"simba", rival:"scar",
    traits:["Wise","Regal","Warm","Protective","Steady"],
    desc:"You carry authority the old way: calm, warm, and earned twice over before you ever raise your voice. People bring you their storms because you've weathered your own and kept the kingdom fed anyway. Your legacy isn't the title — it's everyone who stands taller because you believed they could."}
};

/* ---------- questions: weight vector [leap, together, horizon, show] ---------- */
const Q = [
  {t:"When something feels right, I jump — I can work out the details on the way down.",        w:[ 1, 0, 0, 0]},
  {t:"I don't start anything big without a list, a map, and at least one backup plan.",        w:[-1, 0, 0, 0]},
  {t:"Everything's better with my people around — even boring errands turn into a good time.", w:[ 0, 1, 0, 0]},
  {t:"I recharge best completely alone: door closed, world on mute, just me.",                 w:[ 0,-1, 0, 0]},
  {t:"I daydream about places I've never been way more than about the place I'm standing.",    w:[ 0, 0, 1, 0]},
  {t:"Honestly, my favorite spot on the whole map is my own cozy corner of home.",             w:[ 0, 0,-1, 0]},
  {t:"If a song I love comes on, I'm singing along — full volume, zero shame.",                w:[ 0, 0, 0, 1]},
  {t:"I'd rather do something wonderful quietly than take a bow for it on stage.",             w:[ 0, 0, 0,-1]},
  {t:"When someone I love needs me, the plan and the dream can both wait — people come first.",w:[ 0, .6,-.8, 0]},
  {t:"I love making an entrance — bold colors, big gestures, a little sparkle, that's me.",    w:[ 0, 0, .3, .7]}
];
const AXMAX=[2, 2.6, 3.1, 2.7];
const SPECTRA=[
  {l:"Careful Plan", r:"Leap of Faith"},
  {l:"Lone Star", r:"Found Family"},
  {l:"Hearth", r:"Horizon"},
  {l:"Soft-Spoken", r:"Showstopper"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'disney',
  quizName: 'Disney Hero Quiz',
  eyebrow: 'Storybook Alignment Test',
  title: { pre: 'Which ', em: 'Disney', post: ' Character Are You?' },
  lede: 'Ten statements, one honest look at the story you’re living. Answer for the version of you that shows up when the music swells.',
  seal: { char: '🏰' },
  rosterNoun: 'characters',
  beginLabel: 'Begin the tale',
  tierLabels: { front: 'Main Character', cut: 'Deep Cut' },
  shareEmoji: '🏰',
  shareGradient: 'from-fuchsia-400 to-purple-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Disney Character Are You? test. mypersonalityquizzes.com/quiz/disney`,
  disclaimer: 'Original emblems generated for this quiz. All characters are © Disney — this is an unofficial fan-made personality test.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
