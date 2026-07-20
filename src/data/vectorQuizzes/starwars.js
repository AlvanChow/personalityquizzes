// Which Star Wars Character Are You? — data module.
//
// Vector-quiz conversion of the original pick-mode Star Wars quiz. Every
// character is a position in 4-axis personality space; matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in starwars.test.js re-verifies reachability/entropy/sensitivity
// after every roster or question edit — run it before shipping ANY change.
//
// The original eight resultKeys (luke, leia, han, yoda, obiwan, rey,
// chewbacca, vader) are preserved exactly — users' saved results reference
// them. The roster expands to twenty-two across all three trilogies:
// saga icons up front, beloved side characters as deep cuts.
//
// Axes: [logos, bond, drive, spark], each in [-1, 1]
//   logos: -1 calculation / +1 instinct
//   bond:  -1 solo flight / +1 found family
//   drive: -1 peacekeeper / +1 empire builder (guard the home vs chase the throne)
//   spark: -1 poker face  / +1 heart on sleeve
//
// Character images: every entry has img:null. Paste a URL to swap the
// generated emblem for a photo; the emblem code handles the rest.

import { G, emblem } from './glyphs';
export { G, emblem };

const CHARS = {
  luke:{name:"Luke Skywalker", tag:"The Restless Hope", tier:"front", glyph:"flash", aura:"#f2c14e", img:null, emoji:"🌅",
    v:[.55,.60,.55,.30], kindred:"rey", rival:"vader",
    traits:["Hopeful","Restless","Brave","Idealistic","Loyal"],
    desc:"You grew up staring past the horizon, certain your real life was waiting somewhere beyond it — and unlike most dreamers, you actually went. Your gift is stubborn hope: you believe people can change right up to the moment they finally do, and that faith has rescued more lost causes than any clever plan. You say yes to the call, scared and unready, and become the person the moment needs somewhere along the way."},
  leia:{name:"Princess Leia", tag:"The Rebel Heart", tier:"front", glyph:"diamond", aura:"#e9e3f7", img:null, emoji:"👑",
    v:[-.40,.70,.20,.55], kindred:"han", rival:"palpatine",
    traits:["Decisive","Witty","Fearless","Devoted","Commanding"],
    desc:"You don't wait to be rescued — halfway through, you're usually the one running the rescue. Quick-witted and iron-spined, you can rally a room full of demoralized people with one sharp sentence and a look that says surrender was never on the table. Beneath the command presence is the real engine: you fight for causes because you love the actual people inside them."},
  han:{name:"Han Solo", tag:"The Lucky Scoundrel", tier:"front", glyph:"cube", aura:"#cf9242", img:null, emoji:"🎲",
    v:[.90,-.15,-.10,.45], kindred:"chewbacca", rival:"lando",
    traits:["Roguish","Quick","Charming","Lucky","Secretly soft"],
    desc:"You insist you're only in it for yourself, then keep turning the ship around at exactly the moment it matters. Rules are suggestions, plans are rough drafts, and somehow your improvised chaos beats everyone else's careful strategy more often than they'd like to admit. The cynical front is armor over a soft heart — anyone who makes it past the sarcasm gets loyalty that never quits."},
  yoda:{name:"Yoda", tag:"The Smallest Giant", tier:"front", glyph:"leaf", aura:"#7fc25c", img:null, emoji:"🌿",
    v:[-.75,-.20,-.60,-.30], kindred:"obiwan", rival:"palpatine",
    traits:["Wise","Patient","Playful","Unassuming","Deep"],
    desc:"People underestimate you constantly, and you've decided that's mostly useful. You take the long view in a world addicted to urgency, teach with questions instead of answers, and hide serious depth behind an odd little sense of humor. When you finally do act, the gap between how you seemed and what you can actually do leaves everyone quietly recalibrating."},
  obiwan:{name:"Obi-Wan Kenobi", tag:"The Civilized Blade", tier:"front", glyph:"ripple", aura:"#5da9e0", img:null, emoji:"🧘",
    v:[-.65,.30,-.45,-.40], kindred:"quigon", rival:"anakin",
    traits:["Composed","Principled","Dry-witted","Dutiful","Steadfast"],
    desc:"You're the one everybody wants in the room when things go wrong: calm, principled, and drier-witted than you get credit for. You'd rather talk a conflict down than win it by force, though you are entirely capable of both. Your loyalty survives distance, years, and even the failures of the people you believed in."},
  rey:{name:"Rey", tag:"The Scavenger Spark", tier:"front", glyph:"gear", aura:"#66d9b8", img:null, emoji:"⚙️",
    v:[.60,-.10,.45,.00], kindred:"finn", rival:"kylo",
    traits:["Resourceful","Resilient","Hopeful","Self-taught","Fierce"],
    desc:"Nobody handed you a manual, so you wrote your own — you're the one who can fix it, climb it, or figure it out with whatever happens to be lying around. Years of counting on yourself made you formidable, but your real engine is a quiet certainty that you're meant for more. When you finally find your people, you defend them like someone who knows exactly what it cost to be alone."},
  chewbacca:{name:"Chewbacca", tag:"The Growling Guardian", tier:"front", glyph:"paw", aura:"#9d6b4c", img:null, emoji:"🐻",
    v:[.30,.90,-.55,-.20], kindred:"han", rival:"boba",
    traits:["Loyal","Gentle","Strong","Steady","Wordless"],
    desc:"You skip the grand speeches and go straight to the deeds: the dawn airport run, the quiet fix, the standing directly between your people and trouble. Your loyalty is total and completely undramatic — once someone is yours, that's simply a settled fact of the universe. Anyone who mistakes your gentleness for softness learns, exactly once, that it was a choice."},
  vader:{name:"Darth Vader", tag:"The Iron Shadow", tier:"front", glyph:"shadow", aura:"#d13b3b", img:null, emoji:"🌑",
    v:[.20,-.60,.85,-.35], kindred:"anakin", rival:"obiwan",
    traits:["Intense","Commanding","Driven","Relentless","Redeemable"],
    desc:"You feel everything at full volume and commit at full throttle — half-measures are physically painful to you. When you decide something will happen, rooms reorganize themselves around your focus, and then it happens. The same fire that can burn a life down is exactly what it takes to turn one around, and nobody comes back from a dark chapter more completely than you."},
  anakin:{name:"Anakin Skywalker", tag:"The Chosen Storm", tier:"front", glyph:"flame", aura:"#4664d6", img:null, emoji:"☄️",
    v:[.75,.15,.90,.50], kindred:"padme", rival:"mace",
    traits:["Passionate","Gifted","Impulsive","Devoted","Volatile"],
    desc:"You were built with more horsepower than anyone around you — more talent, more feeling, more need — and you've never once done anything halfway. You love fiercely, take every loss personally, and treat the word 'impossible' as an insult aimed directly at you. Your whole story hinges on where all that fire gets pointed, because it was always going to change the galaxy one way or the other."},
  padme:{name:"Padmé Amidala", tag:"The Steel Rose", tier:"front", glyph:"blossom", aura:"#f08bbb", img:null, emoji:"🌷",
    v:[-.55,.55,-.30,.10], kindred:"leia", rival:"palpatine",
    traits:["Gracious","Principled","Brave","Diplomatic","Resolute"],
    desc:"You believe in doing things properly — with grace, preparation, and a firm no to anyone who mistakes your kindness for weakness. You'll try diplomacy first, twice, and then calmly handle the problem yourself when talking runs out. People underestimate how much steel it takes to stay hopeful and principled in rooms that reward neither."},
  palpatine:{name:"Emperor Palpatine", tag:"The Patient Puppeteer", tier:"front", glyph:"lightning", aura:"#8166e8", img:null, emoji:"⚡",
    v:[-.85,-.65,.95,-.25], kindred:"maul", rival:"yoda",
    traits:["Patient","Cunning","Eloquent","Ambitious","Inscrutable"],
    desc:"You are always playing a longer game than anyone in the room suspects, and you're comfortable waiting years for a plan to ripen. You read ambition in other people the way musicians read sheet music, and you reveal only the sliver of yourself that serves the moment. That patience and perception make you the most formidable strategist anyone will ever meet — do try to use it for good."},
  kylo:{name:"Kylo Ren", tag:"The Fractured Heir", tier:"front", glyph:"burst", aura:"#ff5c74", img:null, emoji:"🌋",
    v:[.50,-.55,.70,.40], kindred:"vader", rival:"rey",
    traits:["Conflicted","Intense","Talented","Volatile","Yearning"],
    desc:"You live in the tug-of-war between who you're expected to be and who you actually are, and you feel that tension louder than anyone realizes. When you commit, it's total — talent, temper, devotion, everything at once, occasionally at furniture-breaking volume. The pull toward the light never quite leaves you, which is precisely what makes your story worth telling."},
  lando:{name:"Lando Calrissian", tag:"The Velvet Gambler", tier:"cut", glyph:"fan", aura:"#35c5d9", img:null, emoji:"😎",
    v:[.45,.20,.40,.90], kindred:"han", rival:"boba",
    traits:["Suave","Charming","Shrewd","Stylish","Big-hearted"],
    desc:"You could sell sand in a desert and leave the buyer feeling like they won. Style is your native language — the cape, the smile, the perfectly timed entrance — but underneath the showmanship sits a sharp operator quietly responsible for more people than anyone guesses. And when a gamble finally puts a friend at risk, you'll bet everything you built to make it right."},
  quigon:{name:"Qui-Gon Jinn", tag:"The Maverick Sage", tier:"cut", glyph:"feather", aura:"#2e8b64", img:null, emoji:"🍃",
    v:[.55,.05,-.40,-.50], kindred:"obiwan", rival:"maul",
    traits:["Serene","Maverick","Intuitive","Kind","Immovable"],
    desc:"You respect the rules exactly enough to know which ones need breaking. You trust the quiet pull of your own instincts over any committee's ruling, and you have a gift for spotting extraordinary potential in overlooked places. Calm, kind, and immovable once decided, you follow what you know is right — even when every authority in the room says otherwise."},
  mace:{name:"Mace Windu", tag:"The Stern Vanguard", tier:"cut", glyph:"blade", aura:"#b06ae0", img:null, emoji:"⚖️",
    v:[-.50,-.30,-.15,-.70], kindred:"yoda", rival:"palpatine",
    traits:["Stern","Disciplined","Blunt","Vigilant","Principled"],
    desc:"You're the one who says the hard no everyone else was avoiding, and you sleep just fine afterward. Standards, discipline, order — you hold the line because you've seen exactly what happens when nobody does. Beneath the stern exterior is a genuine protector who'd rather be respected than liked, and usually, grudgingly, ends up both."},
  maul:{name:"Darth Maul", tag:"The Double-Edged Grudge", tier:"cut", glyph:"eye", aura:"#b5455e", img:null, emoji:"🗡️",
    v:[-.15,-.85,.75,.00], kindred:"palpatine", rival:"obiwan",
    traits:["Focused","Patient","Theatrical","Relentless","Formidable"],
    desc:"You were handed a raw deal early, and you converted it into fuel with frightening efficiency. Patient, focused, and a little theatrical about your grudges, you can wait years for the rematch — and you'll arrive better prepared than anyone believed possible. Learning to want something beyond the score-settling is your real battle, and it makes you magnetic to watch."},
  r2d2:{name:"R2-D2", tag:"The Little Blue Miracle", tier:"cut", glyph:"sound", aura:"#2ea6ff", img:null, emoji:"🤖",
    v:[.60,.65,-.05,.35], kindred:"luke", rival:"c3po",
    traits:["Plucky","Sassy","Ingenious","Brave","Indispensable"],
    desc:"You're small, allegedly just support staff, and somehow the reason the whole operation didn't collapse — again. You improvise, you sass, and you roll straight into danger while larger and supposedly braver types are still debating the plan. Everyone underestimates you exactly once, and your friends have learned to simply be grateful you're on their side."},
  c3po:{name:"C-3PO", tag:"The Fluent Worrier", tier:"cut", glyph:"hex", aura:"#d4a017", img:null, emoji:"🫖",
    v:[-.70,.55,-.50,.75], kindred:"r2d2", rival:"han",
    traits:["Anxious","Loyal","Meticulous","Talkative","Well-meaning"],
    desc:"You have a statistic for every danger and a worry for every occasion, and you voice all of them, in order, out loud. But look closer: you're always there, in the middle of the chaos you begged everyone to avoid, fussing over your people. Your courage doesn't look like anyone else's — it's showing up terrified, impeccably polite, and staying anyway."},
  finn:{name:"Finn", tag:"The Runaway Hero", tier:"cut", glyph:"butterfly", aura:"#a3cc3e", img:null, emoji:"🤝",
    v:[.35,.85,-.35,.50], kindred:"rey", rival:"kylo",
    traits:["Courageous","Loyal","Earnest","Protective","Genuine"],
    desc:"You woke up one day inside a life that was wrong for you and did the hardest thing a person can do: you walked. Your compass is simple and unshakeable — protect the people you love, whatever it costs — and once you choose someone, you run toward their danger, not away from it. Courage that starts as running away and becomes running back is the realest kind there is."},
  poe:{name:"Poe Dameron", tag:"The Daredevil Ace", tier:"cut", glyph:"spiral", aura:"#e8542f", img:null, emoji:"🚀",
    v:[.90,.35,.15,.70], kindred:"finn", rival:"han",
    traits:["Daring","Cocky","Charismatic","Loyal","Instinctive"],
    desc:"You operate best just past the edge of what's sensible, and you know it, and you grin about it. Charisma and reflexes carry you far, but your real gift is making everyone around you believe the impossible run can actually be made. Learning when to pull up — when leading means not playing the hero — is the hardest lesson you'll ever love."},
  ahsoka:{name:"Ahsoka Tano", tag:"The Untethered Blade", tier:"cut", glyph:"knives", aura:"#ff9d5c", img:null, emoji:"🌙",
    v:[.45,-.40,-.30,.10], kindred:"anakin", rival:"vader",
    traits:["Independent","Principled","Agile","Wry","Self-possessed"],
    desc:"You learned everything the institution had to teach, then discovered its limits and walked your own way — politely, permanently. You carry your convictions like twin blades: balanced, personal, and answerable to no council but your conscience. Years on your own road turned a spirited apprentice into something rarer — a wanderer who protects people without needing permission, credit, or a title."},
  boba:{name:"Boba Fett", tag:"The Silent Contract", tier:"cut", glyph:"sand", aura:"#7a9e7e", img:null, emoji:"🎯",
    v:[-.30,-.85,.30,-.80], kindred:"maul", rival:"han",
    traits:["Laconic","Methodical","Patient","Fearless","Honorable"],
    desc:"You say maybe ten words a day and let your reputation handle the rest of the conversation. You're a professional in a galaxy full of amateurs: prepared, punctual, and bound by a personal code you never bother explaining. People assume the armor is the intimidating part, right up until they watch you calmly out-plan everyone in the room."}
};

/* ---------- questions: weight vector [logos, bond, drive, spark] ---------- */
const Q = [
  {t:"In the big moments I trust my gut completely — the reasons show up later, if ever.",          w:[ 1, 0, 0, 0]},
  {t:"I don't move until I've done the homework: options compared, route mapped, backup ready.",    w:[-1, 0, 0, 0]},
  {t:"My people come first, full stop — I'd drop everything the moment one of them needed me.",     w:[ 0, 1, 0, 0]},
  {t:"A whole day with no plans, no calls, and nobody needing me anywhere sounds perfect.",         w:[ 0,-1, 0, 0]},
  {t:"I'm meant for something bigger than where I started, and I intend to prove it.",              w:[ 0, 0, 1, 0]},
  {t:"I'd rather keep the people and places I love safe than chase glory somewhere far away.",      w:[ 0, 0,-1, 0]},
  {t:"Everyone can tell exactly how I'm feeling within about ten seconds of me walking in.",        w:[ 0, 0, 0, 1]},
  {t:"I keep my cards close — people call me hard to read, and honestly I prefer it that way.",     w:[ 0, 0, 0,-1]},
  {t:"If my biggest dream meant leaving someone I love behind, the dream loses. Every time.",       w:[ 0, .6,-.8, 0]},
  {t:"Give me the dramatic entrance every time — bold style, big statements, a little showmanship.",w:[ 0, 0, .3, .7]}
];
const AXMAX=[2, 2.6, 3.1, 2.7];
const SPECTRA=[
  {l:"Calculation", r:"Instinct"},
  {l:"Solo Flight", r:"Found Family"},
  {l:"Peacekeeper", r:"Empire Builder"},
  {l:"Poker Face", r:"Heart on Sleeve"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'starwars',
  quizName: 'Star Wars Character Quiz',
  eyebrow: 'Galactic Alignment Test',
  title: { pre: 'Which ', em: 'Star Wars', post: ' Character Are You?' },
  lede: 'Ten statements, one honest reading of where you\'d stand in the galaxy. Answer for the version of you that shows up when the stakes jump to lightspeed.',
  seal: { char: '🌌' },
  rosterNoun: 'characters',
  beginLabel: 'Make the jump',
  tierLabels: { front: 'Saga Icon', cut: 'Deep Cut' },
  shareEmoji: '🌌',
  shareGradient: 'from-indigo-600 to-slate-800',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Star Wars Character Are You? test. mypersonalityquizzes.com/quiz/starwars`,
  disclaimer: 'Original emblems generated for this quiz. Star Wars and its characters are © Lucasfilm / Disney — this is an unofficial fan-made personality test.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
