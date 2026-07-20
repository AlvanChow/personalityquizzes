// Which Soccer Icon Are You? — vector quiz data module.
//
// Conversion of the original 'pick'-mode soccer quiz (src/data/quizzes/soccer.js)
// to the vector-matching experience. Every icon is a position in 4-axis
// personality space; matching is cosine similarity (see src/utils/vectorQuiz.js
// for the why). The Monte-Carlo battery in soccer.test.js re-verifies
// reachability/entropy/sensitivity after every roster or question edit —
// run it before shipping ANY change to this file.
//
// All eight original resultKeys (messi, ronaldo, ronaldinho, zidane, mbappe,
// modric, marta, rapinoe) are preserved exactly (saved results reference
// them); the expanded roster — pele, maradona, cruyff, beckenbauer, r9,
// buffon, maldini, baggio, cantona, gattuso, puyol, higuita, socrates — is
// additive, spanning eras and positions from goalkeepers to No. 10s.
// Global icons sit on the 'front' tier; cult heroes are 'cut'. Every profile
// celebrates a documented playing style and public persona.
//
// Axes: [craft, team, fire, stage], each in [-1, 1]
//   craft: -1 drilled     / +1 street magic (rehearsed precision vs improvised art)
//   team:  -1 solo run    / +1 team engine (take the shot vs make the run for others)
//   fire:  -1 ice calm    / +1 full fire (stillness under pressure vs open flame)
//   stage: -1 quiet craft / +1 center stage (respected by few vs adored by stadiums)

/* ---------- roster: every icon is a direction in 4-space ---------- */
const CHARS = {
  messi:{name:"Lionel Messi", tag:"The Quiet Genius", tier:"front", glyph:"spiral", aura:"#57b2ea", img:null, emoji:"🐐",
    v:[.85,.30,-.35,-.75], kindred:"modric", rival:"ronaldo",
    traits:["Humble","Instinctive","Loyal","Understated","Masterful"],
    desc:"You're the quietest person in the room and somehow the one everyone watches. You don't announce or campaign — you simply do the thing, again and again, until argument becomes pointless. Your brilliance looks effortless, but it's thousands of hours of touch and repetition wrapped in genuine humility."},
  ronaldo:{name:"Cristiano Ronaldo", tag:"The Relentless Standard", tier:"front", glyph:"burst", aura:"#e64545", img:null, emoji:"🚀",
    v:[-.85,-.60,.50,.70], kindred:"mbappe", rival:"messi",
    traits:["Disciplined","Ambitious","Confident","Tireless","Clutch"],
    desc:"You decided long ago exactly who you were going to become, and you've been out-working everyone toward it ever since. Your self-belief isn't arrogance — it's a contract you signed with yourself, backed by discipline most people can't fathom. You want the biggest stage and the hardest challenge, and you keep delivering long after everyone predicted your decline."},
  ronaldinho:{name:"Ronaldinho", tag:"The Laughing Magician", tier:"front", glyph:"sound", aura:"#9fd63e", img:null, emoji:"😁",
    v:[.90,.45,.05,.70], kindred:"r9", rival:"gattuso",
    traits:["Joyful","Inventive","Playful","Fearless","Magnetic"],
    desc:"You're living proof that excellence and fun are dance partners, not opposites. Your best work happens when you're playing — improvising, trying the outrageous thing just to see the look on everyone's face. Your creativity isn't decoration; it's how you solve problems nobody else can, grinning the whole way through."},
  zidane:{name:"Zinedine Zidane", tag:"The Gliding Maestro", tier:"front", glyph:"ripple", aura:"#a9b9d6", img:null, emoji:"🎩",
    v:[.45,.10,-.85,-.30], kindred:"baggio", rival:"gattuso",
    traits:["Elegant","Composed","Precise","Quiet","Inevitable"],
    desc:"You move through chaos like it's happening in slow motion. Where others rush you glide, and where others shout you say one quiet sentence that settles everything. The bigger the occasion, the calmer you get, and your work carries an elegance people can only describe as art."},
  mbappe:{name:"Kylian Mbappé", tag:"The Fast Forward", tier:"front", glyph:"flash", aura:"#3d68e0", img:null, emoji:"⚡",
    v:[-.15,-.45,-.20,.65], kindred:"ronaldo", rival:"maldini",
    traits:["Fast","Poised","Ambitious","Modern","Assured"],
    desc:"You have never once waited your turn. While others plan the future you sprint into it — learning at double speed, taking on responsibility people say you're too young for, and delivering anyway. You set goals that sound absurd out loud, then quietly hit them ahead of schedule."},
  modric:{name:"Luka Modrić", tag:"The Midfield Metronome", tier:"front", glyph:"gear", aura:"#e06a8e", img:null, emoji:"🧭",
    v:[.10,.90,-.25,-.60], kindred:"zidane", rival:"cantona",
    traits:["Tireless","Selfless","Smart","Resilient","Underrated"],
    desc:"They said you were too small, too slight, too quiet for the top level — so you simply kept going until the doubters ran out of arguments. You're the engine other people's success secretly runs on: always available, always moving, always choosing the smart pass over the flashy one. Your greatness was built rather than gifted, which is exactly why it lasts."},
  marta:{name:"Marta", tag:"The Trailblazing Flame", tier:"front", glyph:"flame", aura:"#ff8c42", img:null, emoji:"🔥",
    v:[.55,.50,.85,.25], kindred:"rapinoe", rival:"beckenbauer",
    traits:["Passionate","Pioneering","Brave","Generous","Relentless"],
    desc:"You didn't find a path — you cut one, straight through terrain everyone said was closed to people like you. You play, work, and love with your whole chest, and that raw passion is what makes your brilliance unforgettable. What drives you hardest isn't your own trophy shelf; it's holding the door open for everyone coming behind you."},
  rapinoe:{name:"Megan Rapinoe", tag:"The Fearless Showstopper", tier:"front", glyph:"bloom", aura:"#d24fd2", img:null, emoji:"🎤",
    v:[.30,.35,.55,.95], kindred:"cantona", rival:"zidane",
    traits:["Bold","Clutch","Outspoken","Stylish","Principled"],
    desc:"You show up loudest exactly when it's riskiest — the biggest stage, the tensest moment, the conversation everyone else avoids. You deliver under pressure with genuine flair, then use the microphone that winning hands you to say what needs saying. People always know where you stand, and that clarity is exactly why they rally to you."},
  pele:{name:"Pelé", tag:"The Smiling King", tier:"front", glyph:"diamond", aura:"#f2d357", img:null, emoji:"👑",
    v:[.45,.70,.15,.35], kindred:"ronaldinho", rival:"maradona",
    traits:["Radiant","Gracious","Winning","Beloved","Timeless"],
    desc:"You make excellence look like celebration — greatness delivered with a grin and shared with everyone around you. You lift whole rooms just by walking in, and your ambition has always been for the group's joy, never at its expense. Decades from now people will still measure magic against the standard you set while smiling."},
  maradona:{name:"Diego Maradona", tag:"The Impossible No. 10", tier:"front", glyph:"fox", aura:"#d4a017", img:null, emoji:"🔟",
    v:[.90,-.55,.85,.35], kindred:"higuita", rival:"pele",
    traits:["Electric","Devoted","Defiant","Magical","Volcanic"],
    desc:"You carry whole causes on your shoulders and somehow make the impossible feel inevitable. You feel everything at maximum volume — love, loyalty, defiance — and you'd rather blaze honestly than glow politely. When your people need a miracle, you take one touch and go make it yourself."},
  cruyff:{name:"Johan Cruyff", tag:"The Total Visionary", tier:"front", glyph:"hex", aura:"#e8721c", img:null, emoji:"🧠",
    v:[-.55,.40,.20,.40], kindred:"socrates", rival:"beckenbauer",
    traits:["Visionary","Opinionated","Inventive","Sharp","Influential"],
    desc:"You don't just play the game — you redesign it while everyone else is still learning the rules. You see structures and possibilities nobody else sees, and you'll explain them out loud whether the room asked or not. Your ideas outlive trophies, because you'd rather change how things are done than merely win once."},
  beckenbauer:{name:"Franz Beckenbauer", tag:"The Imperial Calm", tier:"front", glyph:"cube", aura:"#dbe0e8", img:null, emoji:"🦅",
    v:[-.50,.30,-.70,.10], kindred:"maldini", rival:"cruyff",
    traits:["Composed","Regal","Efficient","Assured","Graceful"],
    desc:"You stroll through pressure that makes other people sprint in circles. Authority sits on you naturally — not because you demand it, but because your composure makes everyone else feel the plan is already working. You do difficult things with such unhurried grace that people forget they were ever difficult."},
  r9:{name:"Ronaldo Nazário", tag:"The Original Phenomenon", tier:"front", glyph:"lightning", aura:"#4fe0c8", img:null, emoji:"💥",
    v:[.80,-.15,-.20,.30], kindred:"ronaldinho", rival:"buffon",
    traits:["Explosive","Instinctive","Joyful","Unstoppable","Resilient"],
    desc:"You have a gift so natural it looks like it was waiting for you to be born. When the moment opens you're through it before anyone else reacts, all instinct and joy and forward motion. Setbacks that would end most stories only set up your comebacks, and you grin your way through every one of them."},
  buffon:{name:"Gianluigi Buffon", tag:"The Joyful Guardian", tier:"front", glyph:"eye", aura:"#1fa383", img:null, emoji:"🧤",
    v:[-.20,.65,.45,.40], kindred:"puyol", rival:"r9",
    traits:["Passionate","Dependable","Warm","Vocal","Enduring"],
    desc:"You're the one everybody trusts when everything is on fire, and you genuinely love being that person. You guard what matters with theatrical passion, roaring encouragement one minute and laughing the next. Decades of showing up taught you the secret: enthusiasm, protected and renewed, outlasts talent every time."},
  maldini:{name:"Paolo Maldini", tag:"The Elegant Wall", tier:"front", glyph:"blade", aura:"#b03a4d", img:null, emoji:"🛡️",
    v:[-.75,.50,-.50,-.45], kindred:"beckenbauer", rival:"mbappe",
    traits:["Elegant","Loyal","Disciplined","Reserved","Classy"],
    desc:"You've turned defending — of people, of standards, of places — into an art form. You do the hard thing so cleanly it barely looks like a fight, because you'd rather read the danger early than crash into it late. One cause, one crest, one lifetime of quiet class: your loyalty is the most elegant thing about you."},
  baggio:{name:"Roberto Baggio", tag:"The Divine Ponytail", tier:"front", glyph:"blossom", aura:"#8878ee", img:null, emoji:"🪷",
    v:[.60,-.25,-.55,-.55], kindred:"zidane", rival:"ronaldo",
    traits:["Artistic","Gentle","Resilient","Soulful","Graceful"],
    desc:"You're an artist in a results business, and you've made peace with the weight that carries. You create moments of beauty so pure that people forgive everything around them just to watch. Your deepest strength is quieter still: after your most public stumble, you stood back up with a serenity most people never find."},
  cantona:{name:"Eric Cantona", tag:"The Collar-Up King", tier:"cut", glyph:"fan", aura:"#a94ae0", img:null, emoji:"🎭",
    v:[.50,-.55,.30,.95], kindred:"maradona", rival:"gattuso",
    traits:["Audacious","Theatrical","Confident","Enigmatic","Poetic"],
    desc:"You walk into every room like you own the deed, and somehow the room agrees. You do things your own way — audacious, theatrical, occasionally baffling — then deliver so magnificently the debate simply ends. Half poet and half thunderstorm, you'd rather be memorable and misunderstood than agreeable and forgotten."},
  gattuso:{name:"Gennaro Gattuso", tag:"The Snarling Heartbeat", tier:"cut", glyph:"paw", aura:"#b57339", img:null, emoji:"⚒️",
    v:[-.65,.60,.95,.00], kindred:"puyol", rival:"ronaldinho",
    traits:["Gritty","Loyal","Fiery","Honest","Indomitable"],
    desc:"You're the teammate people want beside them when everything goes wrong. You run further, tackle harder, and care louder than anyone, and every ounce of it is in service of the people next to you. The stars collect the headlines, but everyone inside the walls knows the truth: the whole thing runs on your fire."},
  puyol:{name:"Carles Puyol", tag:"The Lionhearted Captain", tier:"cut", glyph:"tree", aura:"#963a5f", img:null, emoji:"🦁",
    v:[-.45,.85,.65,-.50], kindred:"gattuso", rival:"cantona",
    traits:["Brave","Selfless","Humble","Unyielding","Steadfast"],
    desc:"You'd throw yourself in front of anything for your people, and they know it without you ever saying so. Your leadership isn't speeches — it's a standard, kept every single day, with zero interest in credit. Flashier types come and go, but lasting things are built on exactly one ingredient: people like you who never, ever stop."},
  higuita:{name:"René Higuita", tag:"The Scorpion Gambler", tier:"cut", glyph:"coil", aura:"#3ee06e", img:null, emoji:"🦂",
    v:[.95,-.25,.35,.50], kindred:"cantona", rival:"maldini",
    traits:["Daring","Eccentric","Creative","Playful","Fearless"],
    desc:"Where everyone else sees a rule, you see a suggestion — and probably an opportunity. You take risks that make sensible people cover their eyes, then land them with a showman's grin. Your madness has a method: you'd rather fail spectacularly being yourself than succeed quietly being someone else."},
  socrates:{name:"Sócrates", tag:"The Bearded Philosopher", tier:"cut", glyph:"ink", aura:"#79b356", img:null, emoji:"🩺",
    v:[-.25,.70,.20,.10], kindred:"cruyff", rival:"ronaldo",
    traits:["Cerebral","Idealistic","Cool","Principled","Stylish"],
    desc:"You play the long game — of ideas, of principle, of the collective good. Effortlessly cool on the surface, you're driven underneath by the belief that the team, and the world, should be run more beautifully and more fairly. You make thinking look stylish and conviction look calm, and people follow both."}
};

/* ---------- questions: weight vector [craft, team, fire, stage] ---------- */
const Q = [
  {t:"My best ideas arrive mid-move — I trust the touch I invent in the moment over the one I rehearsed.",  w:[ 1, 0, 0, 0]},
  {t:"I practice the basics until they're automatic — repetition is where my confidence comes from.",       w:[-1, 0, 0, 0]},
  {t:"Setting someone else up for the winning moment feels even better than taking it myself.",             w:[ 0, 1, 0, 0]},
  {t:"When everything's on the line, I want it in my hands — I back myself over anybody.",                  w:[ 0,-1, 0, 0]},
  {t:"I wear my heart on my sleeve — when I care about something, the whole street knows.",                 w:[ 0, 0, 1, 0]},
  {t:"The bigger the stakes, the calmer I get; pressure seems to slow the world down for me.",              w:[ 0, 0,-1, 0]},
  {t:"A huge audience brings out my absolute best — turn every light in the stadium on me.",                w:[ 0, 0, 0, 1]},
  {t:"I'd rather be quietly respected by a few than loudly famous to everyone.",                            w:[ 0, 0, 0,-1]},
  {t:"Style counts — if it isn't done beautifully, it's only half done.",                                   w:[ .5, 0, 0, .5]},
  {t:"I'll happily do the unglamorous running that makes everyone else look good.",                         w:[-.3, .6, .3, 0]}
];
const AXMAX=[2.8, 2.6, 2.3, 2.5];
const SPECTRA=[
  {l:"Drilled", r:"Street Magic"},
  {l:"Solo Run", r:"Team Engine"},
  {l:"Ice Calm", r:"Full Fire"},
  {l:"Quiet Craft", r:"Center Stage"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'soccer',
  quizName: 'Soccer Icon Quiz',
  eyebrow: 'Beautiful Game Alignment Test',
  title: { pre: 'Which ', em: 'Soccer Icon', post: ' Are You?' },
  lede: 'Ten statements, one honest scouting report of how you play the game of life. Answer for the version of you that shows up when the whistle blows.',
  seal: { char: '⚽' },
  rosterNoun: 'icons',
  beginLabel: 'Step onto the pitch',
  tierLabels: { front: 'Global Icon', cut: 'Cult Hero' },
  shareEmoji: '⚽',
  shareGradient: 'from-emerald-500 to-green-600',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Soccer Icon Are You? test. mypersonalityquizzes.com/quiz/soccer`,
  disclaimer: 'Original emblems generated for this quiz. This is an unofficial fan-made personality test — not affiliated with or endorsed by any club, league, or federation. Profiles celebrate each icon\'s documented playing style and public persona.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
