// Which NBA Legend Are You? — vector quiz data module.
//
// Conversion of the original 'pick'-mode NBA quiz (src/data/quizzes/nba.js)
// to the vector-matching experience. Every legend is a position in 4-axis
// personality space; matching is cosine similarity (see src/utils/vectorQuiz.js
// for the why). The Monte-Carlo battery in nba.test.js re-verifies
// reachability/entropy/sensitivity after every roster or question edit —
// run it before shipping ANY change to this file.
//
// All eight original resultKeys (jordan, lebron, curry, kobe, magic, duncan,
// shaq, iverson) are preserved exactly (saved results reference them); the
// expanded roster — bird, kareem, hakeem, dirk, garnett, drj, barkley,
// rodman, pistol, nash, manu, reggie, muggsy, big_ben — is additive.
// All-time icons sit on the 'front' tier; cult favorites are 'cut'.
// Every profile celebrates a documented playing style and public persona.
//
// Axes: [flair, team, fire, stage], each in [-1, 1]
//   flair: -1 textbook      / +1 showtime (drilled fundamentals vs improvised art)
//   team:  -1 solo mission  / +1 team-first (take the last shot vs make the pass)
//   fire:  -1 ice cold      / +1 full blaze (stone-faced calm vs open flame)
//   stage: -1 quiet grind   / +1 bright lights (anonymous work vs the big arena)

/* ---------- roster: every legend is a direction in 4-space ---------- */
const CHARS = {
  jordan:{name:"Michael Jordan", tag:"The Last Shot", tier:"front", glyph:"flame", aura:"#e04545", img:null, emoji:"🐐",
    v:[-.10,-.45,.85,.55], kindred:"kobe", rival:"lebron",
    traits:["Clutch","Relentless","Exacting","Fearless","Winner"],
    desc:"You live for the moment everyone else is trying to survive. Pressure doesn't shrink you — it sharpens you, and you've been quietly collecting every slight, every doubt, every 'can't' as fuel for years. When it all comes down to one chance, you don't hope for the ball; you demand it."},
  kobe:{name:"Kobe Bryant", tag:"The 4 A.M. Craftsman", tier:"front", glyph:"coil", aura:"#8459d6", img:null, emoji:"🐍",
    v:[-.45,-.70,.55,.30], kindred:"jordan", rival:"shaq",
    traits:["Obsessive","Disciplined","Studious","Intense","Devoted"],
    desc:"You're in love with the work itself — the empty gym, the extra rep, the detail nobody else even knows exists. You study greatness in every field just to steal one more idea, and you hold yourself to a standard that borders on mythology. People call it obsession; you call it respect for the craft."},
  lebron:{name:"LeBron James", tag:"The Empire Builder", tier:"front", glyph:"tree", aura:"#b03a5a", img:null, emoji:"👑",
    v:[-.10,.85,.20,.60], kindred:"magic", rival:"jordan",
    traits:["Visionary","Generous","Durable","Cerebral","Commanding"],
    desc:"You're somehow the most capable person in the room and the most invested in everyone else's rise. You see the whole board — who needs confidence, who's about to level up, where the group should be in five years — and you build toward it patiently. People follow you because your plans always have room for them."},
  curry:{name:"Stephen Curry", tag:"The Joyful Revolution", tier:"front", glyph:"wave", aura:"#f2cd5e", img:null, emoji:"🎯",
    v:[.70,.60,-.05,.30], kindred:"nash", rival:"lebron",
    traits:["Joyful","Inventive","Humble","Deadly","Uplifting"],
    desc:"They said you were too small, too light, too far from the target — so you changed what everyone considers possible and grinned the whole way. Your secret is that the joy is completely real: you'd do this for free, forever. You make excellence look so fun that everyone watching starts believing they could try."},
  magic:{name:"Magic Johnson", tag:"The Showtime Smile", tier:"front", glyph:"flash", aura:"#f0973d", img:null, emoji:"✨",
    v:[.60,.95,.30,.80], kindred:"nash", rival:"bird",
    traits:["Radiant","Unselfish","Charismatic","Creative","Winning"],
    desc:"Your superpower is making other people shine and loving it more than your own spotlight. You see the pass nobody else sees — the connection, the opening, the moment that turns a good group into an unforgettable one. Rooms genuinely get brighter when you walk in, and you spend that light generously."},
  duncan:{name:"Tim Duncan", tag:"The Quiet Fundamental", tier:"front", glyph:"cube", aura:"#b0b7c0", img:null, emoji:"🗿",
    v:[-.95,.50,-.80,-.85], kindred:"hakeem", rival:"garnett",
    traits:["Steady","Humble","Precise","Unshakable","Timeless"],
    desc:"You are the steadiest person anyone knows, and you've made steadiness an art form. No theatrics, no headlines — just two decades of showing up, doing the simple things flawlessly, and letting the results do all your talking. You'd rather be respected by the five people in the room than famous to everyone outside it."},
  shaq:{name:"Shaquille O'Neal", tag:"The Playful Colossus", tier:"front", glyph:"burst", aura:"#5a5fd0", img:null, emoji:"🌋",
    v:[.45,.30,.40,.95], kindred:"barkley", rival:"kobe",
    traits:["Dominant","Hilarious","Generous","Magnetic","Unstoppable"],
    desc:"You're overwhelming force and pure comedy in one enormous package, and nobody has ever figured out how to handle both at once. You dominate the things you care about and clown through everything else, keeping the whole room laughing while you win. Your generosity runs as big as your personality — when you eat, everybody eats."},
  iverson:{name:"Allen Iverson", tag:"The Crossover Heart", tier:"front", glyph:"lightning", aura:"#e0559a", img:null, emoji:"💥",
    v:[.60,-.85,.75,.25], kindred:"muggsy", rival:"jordan",
    traits:["Fearless","Original","Loyal","Explosive","Unbowed"],
    desc:"Nobody has ever successfully told you who to be, and it's far too late to start now. You're smaller than the challenge in front of you basically every day, and you attack it anyway — your way, with your whole chest. That fearlessness gives everyone watching permission to be braver about being themselves."},
  bird:{name:"Larry Bird", tag:"The Stone-Faced Sniper", tier:"front", glyph:"feather", aura:"#55b04f", img:null, emoji:"🍀",
    v:[-.50,.10,.65,-.35], kindred:"dirk", rival:"magic",
    traits:["Confident","Blunt","Crafty","Cold-blooded","Tireless"],
    desc:"You'll tell the room exactly what you're about to do, do it, and walk away without changing expression. Your confidence isn't loud — it's earned in thousands of unglamorous hours nobody ever saw. You love the competition itself far more than the applause that comes after it."},
  kareem:{name:"Kareem Abdul-Jabbar", tag:"The Scholar's Skyhook", tier:"front", glyph:"ink", aura:"#6db3e8", img:null, emoji:"🪝",
    v:[-.60,-.20,-.50,-.55], kindred:"duncan", rival:"bird",
    traits:["Masterful","Thoughtful","Principled","Enduring","Reserved"],
    desc:"You found one perfect thing, refined it for decades, and let mastery speak while everyone else shouted. You're a thinker in a world of talkers — curious, principled, more interested in books and big ideas than in celebrity. Your excellence is a long, patient argument, and you always win it eventually."},
  hakeem:{name:"Hakeem Olajuwon", tag:"The Gentle Dream", tier:"front", glyph:"spiral", aura:"#e2725b", img:null, emoji:"💫",
    v:[.25,.20,-.65,-.40], kindred:"duncan", rival:"shaq",
    traits:["Graceful","Humble","Patient","Nimble","Serene"],
    desc:"You move through hard problems the way a dancer moves through a routine — with footwork, patience, and a grace nobody can quite copy. Your calm runs deep and genuine; humility isn't a performance for you, it's a discipline. Then, when it matters most, you produce something so beautiful the room just quietly applauds."},
  dirk:{name:"Dirk Nowitzki", tag:"The Faithful Fadeaway", tier:"front", glyph:"leaf", aura:"#4a86e0", img:null, emoji:"🦩",
    v:[-.30,.65,-.20,-.55], kindred:"bird", rival:"duncan",
    traits:["Loyal","Humble","Inventive","Patient","Self-deprecating"],
    desc:"You built one unguardable thing through years of strange, patient practice, and you stayed loyal to one place while the whole world told you to chase shortcuts. You laugh at yourself easily, work absurdly hard quietly, and hand the microphone to others. Two decades of showing up made your name permanent."},
  garnett:{name:"Kevin Garnett", tag:"The Blazing Heartbeat", tier:"front", glyph:"eye", aura:"#2fae7a", img:null, emoji:"🐺",
    v:[-.10,.60,1.0,.55], kindred:"big_ben", rival:"duncan",
    traits:["Intense","Loyal","Vocal","Selfless","Electric"],
    desc:"You feel everything at maximum volume — the wins, the losses, the pride of the crest on your chest. Your intensity isn't for show; it's contagious belief, and whole teams organize themselves around your fire. You'll roar at the rafters and defend your people like family, because to you they are."},
  drj:{name:"Julius Erving", tag:"The Doctor of Flight", tier:"front", glyph:"butterfly", aura:"#8fd6b0", img:null, emoji:"🩺",
    v:[.80,.25,-.35,.45], kindred:"pistol", rival:"bird",
    traits:["Elegant","Dignified","Creative","Gracious","Iconic"],
    desc:"You do difficult things with such elegance that people forget how difficult they are. You carry yourself with dignity everywhere — gracious in victory, generous to rivals, smooth in every sense of the word. Your art is making the impossible look inevitable, and doing it like a gentleman."},
  barkley:{name:"Charles Barkley", tag:"The Unfiltered Force", tier:"front", glyph:"paw", aura:"#c9a86a", img:null, emoji:"💪",
    v:[.55,-.30,.85,.55], kindred:"shaq", rival:"rodman",
    traits:["Honest","Forceful","Funny","Defiant","Big-hearted"],
    desc:"You say exactly what you think, you back it up with everything you have, and you refuse to be anybody but yourself. Undersized for the job on paper, you out-willed the giants anyway, night after night. The fire is real, the honesty is total, and the laughter afterward is legendary."},
  rodman:{name:"Dennis Rodman", tag:"The Beautiful Chaos", tier:"cut", glyph:"bloom", aura:"#c458c4", img:null, emoji:"🌈",
    v:[.85,-.15,.45,.85], kindred:"big_ben", rival:"barkley",
    traits:["Relentless","Eccentric","Fearless","Tireless","Unapologetic"],
    desc:"You do the work nobody else wants — the diving, the scrapping, the fiftieth effort — and you do it dressed exactly how you please. You've turned individuality into a discipline and hustle into an art form. People never know what you'll do next, only that you'll bring more energy than anyone in the building."},
  pistol:{name:"Pete Maravich", tag:"The Floppy-Socked Wizard", tier:"cut", glyph:"knives", aura:"#b8cc52", img:null, emoji:"🧦",
    v:[.95,-.45,.10,.60], kindred:"drj", rival:"duncan",
    traits:["Dazzling","Visionary","Obsessive","Showstopping","Pioneering"],
    desc:"You practiced magic tricks until they became fundamentals, then unveiled them when the world least expected it. You see angles and possibilities that simply don't occur to other people, and you can't help sharing them with flair. You were built for a game the future would love — you just arrived early."},
  nash:{name:"Steve Nash", tag:"The Smiling Conductor", tier:"cut", glyph:"ripple", aura:"#b79aec", img:null, emoji:"🪄",
    v:[.70,.90,-.15,-.20], kindred:"magic", rival:"kobe",
    traits:["Creative","Unselfish","Cheerful","Precise","Understated"],
    desc:"You make everyone around you play — and feel — better than they thought they could. You'd rather create a great moment for a teammate than a highlight for yourself, and your creativity never runs dry. Behind the easy grin sits a fanatic's preparation; the flow only looks effortless."},
  manu:{name:"Manu Ginóbili", tag:"The Daring Sixth Man", tier:"cut", glyph:"fin", aura:"#3fc0dc", img:null, emoji:"🦇",
    v:[.90,.55,.45,-.35], kindred:"nash", rival:"dirk",
    traits:["Audacious","Selfless","Clever","Passionate","Clutch"],
    desc:"You accepted a smaller title so the whole team could be bigger, then played like the boldest person on the floor anyway. Your creativity comes with real nerve — you'll try the audacious thing in the biggest moment and make it work. Winning matters more to you than credit, and everyone who knows you knows it."},
  reggie:{name:"Reggie Miller", tag:"The Road-Game Villain", tier:"cut", glyph:"sound", aura:"#d0972e", img:null, emoji:"🏹",
    v:[-.40,-.50,.55,.90], kindred:"curry", rival:"jordan",
    traits:["Clutch","Brash","Focused","Durable","Ice-veined"],
    desc:"You're at your very best when the entire building wants you to fail. Hostile crowds don't rattle you — they focus you, and you'll happily narrate the comeback while you deliver it. You spent years drilling your craft in the shadows so that in the loudest moments you'd be the calmest one alive."},
  muggsy:{name:"Muggsy Bogues", tag:"The Tallest Heart", tier:"cut", glyph:"hex", aura:"#29b8a8", img:null, emoji:"🐝",
    v:[-.15,.85,.50,-.45], kindred:"iverson", rival:"shaq",
    traits:["Gritty","Quick","Selfless","Cheerful","Indomitable"],
    desc:"Every room you've ever entered underestimated you, and you've spent a lifetime cheerfully proving every single one of them wrong. You lead by lifting — pushing the pace, spotting the open teammate, standing up to giants on pure will. Your grit is quiet, your loyalty is loud, and your heart doesn't measure in inches."},
  big_ben:{name:"Ben Wallace", tag:"The Blue-Collar Wall", tier:"cut", glyph:"gear", aura:"#5e81a8", img:null, emoji:"🔔",
    v:[-.80,.40,.20,-.70], kindred:"rodman", rival:"shaq",
    traits:["Undaunted","Strong","Silent","Protective","Blue-collar"],
    desc:"Nobody drafted you, nobody hyped you, and you built a fortress out of that silence. You do the unglamorous work — the effort, the defense, the muscle — at a level that forces the world to notice without you saying a word. Your greatness is measured in everything you prevent, and the people you protect know exactly what you're worth."}
};

/* ---------- questions: weight vector [flair, team, fire, stage] ---------- */
const Q = [
  {t:"I improvise my way through most things — the plan is whatever I come up with in the moment.",       w:[ 1, 0, 0, 0]},
  {t:"I drill the basics until they're automatic — give me the reliable move over the fancy one.",        w:[-1, 0, 0, 0]},
  {t:"Setting someone else up to shine feels even better than shining myself.",                           w:[ 0, 1, 0, 0]},
  {t:"When everything's on the line, I want it in my hands — I trust myself most.",                       w:[ 0,-1, 0, 0]},
  {t:"I run hot — when I care about something, everyone in the building knows it.",                       w:[ 0, 0, 1, 0]},
  {t:"The bigger the moment, the calmer I get; you'd never read the stakes off my face.",                 w:[ 0, 0,-1, 0]},
  {t:"A big audience brings out my absolute best — turn the bright lights on.",                           w:[ 0, 0, 0, 1]},
  {t:"I'd rather be quietly great than loudly famous.",                                                   w:[ 0, 0, 0,-1]},
  {t:"Tell me I can't do something and you've just written my to-do list.",                               w:[ 0,-.4, .6, 0]},
  {t:"Style points count — doing it beautifully matters almost as much as getting it done.",              w:[ .6, 0, 0, .4]}
];
const AXMAX=[2.6, 2.4, 2.6, 2.4];
const SPECTRA=[
  {l:"Textbook", r:"Showtime"},
  {l:"Solo Mission", r:"Team-First"},
  {l:"Ice Cold", r:"Full Blaze"},
  {l:"Quiet Grind", r:"Bright Lights"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'nba',
  quizName: 'NBA Legend Quiz',
  eyebrow: 'Hardwood Alignment Test',
  title: { pre: 'Which ', em: 'NBA Legend', post: ' Are You?' },
  lede: 'Ten statements, one honest scouting report of how you compete. Answer for the version of you that shows up when the game is on the line.',
  seal: { char: '🏀' },
  rosterNoun: 'legends',
  beginLabel: 'Take the floor',
  tierLabels: { front: 'All-Time Icon', cut: 'Cult Legend' },
  shareEmoji: '🏀',
  shareGradient: 'from-orange-500 to-amber-600',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which NBA Legend Are You? test. mypersonalityquizzes.com/quiz/nba`,
  disclaimer: 'Original emblems generated for this quiz. This is an unofficial fan-made personality test — not affiliated with or endorsed by the NBA or any player. Profiles celebrate each legend\'s documented playing style and public persona.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
