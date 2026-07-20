// Which Superhero Are You? — data module.
//
// Vector-quiz conversion of the original pick-mode Superhero quiz. Every
// hero is a position in 4-axis personality space; matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in superhero.test.js re-verifies reachability/entropy/sensitivity
// after every roster or question edit — run it before shipping ANY change.
//
// The original eight resultKeys (superman, batman, wonderwoman, spiderman,
// ironman, cap, blackpanther, hulk) are preserved exactly — users' saved
// results reference them. The source quiz mixed DC and Marvel, so the
// expanded roster keeps that cross-universe spread.
//
// Axes: [instinct, team, maverick, spotlight], each in [-1, 1]
//   instinct:  -1 master plan / +1 pure instinct
//   team:      -1 lone wolf   / +1 team player
//   maverick:  -1 guardian    / +1 maverick (push limits vs. protect home)
//   spotlight: -1 shadows     / +1 spotlight
//
// Character images: every entry has img:null. Paste a URL to swap the
// generated emblem for a photo; the emblem code handles the rest.

import { G, emblem } from './glyphs';
export { G, emblem };

const CHARS = {
  superman:{name:"Superman", tag:"The Hope on the Horizon", tier:"front", glyph:"burst", aura:"#4a9df5", img:null, emoji:"☀️",
    v:[.05,.70,-.75,.00], kindred:"cap", rival:"batman",
    traits:["Steadfast","Hopeful","Gentle","Dependable","Selfless"],
    desc:"You could cut every corner — you're that capable — and it genuinely never occurs to you. Raised on the idea that strength exists to serve, you show up early, keep promises nobody remembers you making, and treat every single person like they matter. Your real superpower isn't the strength; it's that people quietly become more hopeful versions of themselves around you."},
  batman:{name:"Batman", tag:"The Night's Contingency Plan", tier:"front", glyph:"shadow", aura:"#9aa3b8", img:null, emoji:"🦇",
    v:[-.90,-.65,-.25,-.80], kindred:"black_widow", rival:"superman",
    traits:["Prepared","Disciplined","Brooding","Strategic","Devoted"],
    desc:"You have a contingency plan for your contingency plans, and it isn't paranoia — it's love wearing armor. Whatever life threw at you, you alchemized it into discipline: the extra hour of study, the trained skill, the read of a room nobody else caught. You protect people from the shadows, which means half of them will never know how much they owe you — and you prefer it that way."},
  wonderwoman:{name:"Wonder Woman", tag:"The Truth Unsheathed", tier:"front", glyph:"blade", aura:"#e35d78", img:null, emoji:"🛡️",
    v:[.55,.25,.55,.35], kindred:"superman", rival:"black_widow",
    traits:["Honest","Fearless","Compassionate","Decisive","Principled"],
    desc:"You lead with truth the way other people lead with small talk, and injustice in front of you is automatically your business. You'll step into the conflict everyone else is edging away from, yet you fight without hatred — you'd always rather win an enemy over than crush one. People leave conversations with you feeling thoroughly seen and slightly braver."},
  spiderman:{name:"Spider-Man", tag:"The Friendly Neighborhood Heart", tier:"front", glyph:"hex", aura:"#e02929", img:null, emoji:"🕸️",
    v:[.55,.40,-.70,.10], kindred:"ms_marvel", rival:"wolverine",
    traits:["Witty","Kind","Resilient","Overbooked","Loyal"],
    desc:"You're perpetually overbooked, slightly late, and still somehow the person who never actually lets anyone down. Humor is your pressure valve — the scarier things get, the faster the quips come — but under the jokes sits a conscience that won't let you look away from anyone who needs help. You carry loads that would flatten most people and still make it to dinner, usually."},
  ironman:{name:"Iron Man", tag:"The Self-Built Tomorrow", tier:"front", glyph:"gear", aura:"#d9a441", img:null, emoji:"⚙️",
    v:[-.15,-.10,.85,.90], kindred:"spiderman", rival:"cap",
    traits:["Inventive","Confident","Restless","Sardonic","Generous"],
    desc:"Your brain runs at a clock speed that makes waiting physically painful, so you build instead: prototypes, plans, comebacks, whole futures. You lead with confidence and one-liners and let people assume the swagger is the whole story — but when the moment demands real sacrifice, you never run the math on yourself first. You upgrade everything you touch, including, slowly and grudgingly, yourself."},
  cap:{name:"Captain America", tag:"The Compass That Holds", tier:"front", glyph:"flash", aura:"#7fb2d9", img:null, emoji:"⭐",
    v:[-.45,.90,-.40,-.10], kindred:"superman", rival:"ironman",
    traits:["Upright","Steady","Loyal","Courageous","Unbending"],
    desc:"You're the person others check themselves against — not because you preach, but because you do the right thing with unnerving consistency, especially when it's unpopular. You believe in keeping your word, backing your people, and getting up one more time than you're knocked down. You'd rather lose honestly than win crooked, and somehow that's exactly why your side keeps winning."},
  blackpanther:{name:"Black Panther", tag:"The Composed Crown", tier:"front", glyph:"paw", aura:"#a06ae8", img:null, emoji:"🐆",
    v:[-.60,.45,-.50,-.45], kindred:"storm", rival:"batman",
    traits:["Composed","Strategic","Dutiful","Precise","Regal"],
    desc:"You move through the world with a composure that makes people straighten up a little when you enter the room. You honor where you come from without being trapped by it, weigh every decision like someone who knows others will live inside it, and prefer one precise move to ten loud ones. Your circle is small and chosen with care — and for them, there is nothing you would not do."},
  hulk:{name:"Hulk", tag:"The Gentle Earthquake", tier:"front", glyph:"burst", aura:"#6ec24a", img:null, emoji:"💚",
    v:[.95,-.60,-.10,.55], kindred:"spiderman", rival:"wolverine",
    traits:["Intense","Brilliant","Honest","Misunderstood","Unstoppable"],
    desc:"You contain multitudes: a thoughtful, brilliant inner life and feelings powerful enough to rearrange furniture. People who only see one side of you always underestimate the other, which never stops being their mistake. The day your intellect and your intensity stop fighting and start working together, nothing on the planet can slow you down."},
  flash:{name:"The Flash", tag:"The Lightning That Laughs", tier:"front", glyph:"lightning", aura:"#f5d33c", img:null, emoji:"⚡",
    v:[.75,.55,-.25,.45], kindred:"green_lantern", rival:"superman",
    traits:["Quick","Upbeat","Warm","Restless","Forgiving"],
    desc:"You move through life at a sprint and still notice everyone in it — quick with help, quicker with a joke, first to arrive even when you left last. Your optimism isn't naivety; it's a decision you re-make every morning, usually while running late for something. People forget that the fastest thing about you was never your feet — it's how quickly you forgive, adapt, and show up again."},
  aquaman:{name:"Aquaman", tag:"The King of Two Tides", tier:"front", glyph:"wave", aura:"#2fb8a6", img:null, emoji:"🔱",
    v:[.80,.10,-.40,.55], kindred:"wonderwoman", rival:"thor",
    traits:["Brash","Loyal","Rugged","Big-hearted","Unshakable"],
    desc:"You belong to two worlds and refuse to shrink yourself to fit neatly into either one. Brash on the surface and steady underneath, you'd rather wade straight into the problem than sit through the meeting about it. People mistake the swagger for the whole story until the tide comes in and they see how much you've been holding back."},
  green_lantern:{name:"Green Lantern", tag:"The Will Made Light", tier:"cut", glyph:"rinne", aura:"#35d17a", img:null, emoji:"🟢",
    v:[.85,-.25,.55,.45], kindred:"flash", rival:"captain_marvel",
    traits:["Fearless","Cocky","Imaginative","Willful","Daring"],
    desc:"Fear tells everyone where to stop, and you treat that line as a starting suggestion. You run on sheer will — cocky, fast, occasionally spectacular in your mistakes — and your imagination builds solutions mid-fall that no manual would ever approve. What keeps it from being recklessness is simple: when it truly counts, you do not blink."},
  thor:{name:"Thor", tag:"The Thunder With a Grin", tier:"front", glyph:"lightning", aura:"#8fa3f5", img:null, emoji:"🔨",
    v:[.50,.35,.30,.90], kindred:"hulk", rival:"aquaman",
    traits:["Boisterous","Mighty","Warm","Theatrical","Humbled"],
    desc:"You arrive like weather — loud, magnificent, impossible to ignore — and you love every second of it. Underneath the pageantry sits real substance: hard-won humility, a huge heart, and the strength to carry your people through their worst days. You've learned the difference between being worthy of applause and being worthy, and you finally know which one matters."},
  black_widow:{name:"Black Widow", tag:"The Quiet Ledger", tier:"front", glyph:"diamond", aura:"#b03a52", img:null, emoji:"🕷️",
    v:[-.80,.15,-.10,-.90], kindred:"cap", rival:"thor",
    traits:["Observant","Composed","Resourceful","Guarded","Loyal"],
    desc:"You read every room twice before it reads you once, and you keep your cards so close that most people don't realize you're playing. Your past taught you skills you didn't choose, and you've spent every day since spending them on people you did. The loudest heroes get the statues; you just quietly make sure everyone gets home."},
  doctor_strange:{name:"Doctor Strange", tag:"The Keeper of Unseen Doors", tier:"front", glyph:"eye", aura:"#f28f3c", img:null, emoji:"🔮",
    v:[-.85,-.40,.35,-.30], kindred:"blackpanther", rival:"ironman",
    traits:["Brilliant","Aloof","Dutiful","Wry","Disciplined"],
    desc:"You were brilliant first and wise second, and the tuition for that second lesson cost you almost everything. Now you stand guard over problems most people never learn existed, weighing terrible trade-offs with a steady hand and a dry remark. Your arrogance never fully left — it just finally started working for someone other than you."},
  storm:{name:"Storm", tag:"The Regal Tempest", tier:"cut", glyph:"sound", aura:"#d8def0", img:null, emoji:"🌩️",
    v:[-.25,.55,-.15,.45], kindred:"blackpanther", rival:"hulk",
    traits:["Serene","Commanding","Deep-feeling","Graceful","Resolute"],
    desc:"You carry a calm that other people borrow in a crisis, and an authority you never have to raise your voice to prove. Your feelings run continent-deep, but you've made peace with them, and that mastery is exactly what makes you a leader people follow into weather of every kind. Grace is not softness in you; it's power holding perfectly still."},
  wolverine:{name:"Wolverine", tag:"The Reluctant Blade", tier:"front", glyph:"knives", aura:"#b5762f", img:null, emoji:"🦡",
    v:[.95,-.85,-.10,-.60], kindred:"storm", rival:"hulk",
    traits:["Gruff","Fierce","Loyal","Solitary","Enduring"],
    desc:"You've been through more than you'll ever say, and you cope by pretending you don't care — right up until someone needs you, which blows your cover every time. You're the reluctant one: last to join, first into danger, grumbling the entire way. The gruffness fools strangers; the people you protect know it's the deepest loyalty in the room wearing a scowl."},
  captain_marvel:{name:"Captain Marvel", tag:"The Engine Without Limits", tier:"cut", glyph:"flash", aura:"#45cef0", img:null, emoji:"🌟",
    v:[-.35,-.20,.90,.15], kindred:"ms_marvel", rival:"green_lantern",
    traits:["Determined","Bold","Self-reliant","Driven","Unbreakable"],
    desc:"You've spent your whole life being told where the ceiling is, and getting up anyway became your signature move. You push limits on principle — tougher standards, harder problems, past the edge of every map — and you don't much care who's watching. Your confidence isn't armor over doubt; it's the receipts from every single time they said you'd fall."},
  ms_marvel:{name:"Ms. Marvel", tag:"The Fangirl Ascendant", tier:"cut", glyph:"spiral", aura:"#e858b8", img:null, emoji:"✨",
    v:[.30,.80,.45,.55], kindred:"captain_marvel", rival:"wolverine",
    traits:["Enthusiastic","Creative","Devoted","Optimistic","Earnest"],
    desc:"You grew up studying heroes the way other people study for finals, and it turns out all that devotion was secretly training. You're proof that a big heart, a group chat, and stubborn optimism can stand toe-to-toe with almost anything, and you never stop being amazed that you get to try. You dream on a cosmic scale, start right where you're standing, and make both feel like the same adventure."}
};

/* ---------- questions: weight vector [instinct, team, maverick, spotlight] ---------- */
const Q = [
  {t:"In a sudden crisis I move first and trust my gut — the explanation can catch up later.",       w:[ 1, 0, 0, 0]},
  {t:"Before anything big, I've run the scenario in my head a dozen times, exits included.",         w:[-1, 0, 0, 0]},
  {t:"I'm at my best with my crew beside me — backup isn't a weakness, it's the whole plan.",        w:[ 0, 1, 0, 0]},
  {t:"I work best alone: fewer people to coordinate, fewer people to worry about.",                  w:[ 0,-1, 0, 0]},
  {t:"Ordinary doesn't interest me — I want to push past every limit and see what's on the other side.", w:[ 0, 0, 1, 0]},
  {t:"Honestly, keeping my own little corner of the world safe and happy is the whole mission.",     w:[ 0, 0,-1, 0]},
  {t:"If I pulled off something incredible, believe me, everyone would hear about it.",              w:[ 0, 0, 0, 1]},
  {t:"I'd rather save the day quietly and be gone before anyone starts clapping.",                   w:[ 0, 0, 0,-1]},
  {t:"The moment someone I care about needs help, my own big plans go straight to the bench.",       w:[ 0, .6,-.8, 0]},
  {t:"A dramatic entrance, a sharp look, one great line — presentation is half the job.",            w:[ 0, 0, .3, .7]}
];
const AXMAX=[2, 2.6, 3.1, 2.7];
const SPECTRA=[
  {l:"Master Plan", r:"Pure Instinct"},
  {l:"Lone Wolf", r:"Team Player"},
  {l:"Guardian", r:"Maverick"},
  {l:"Shadows", r:"Spotlight"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'superhero',
  quizName: 'Superhero Quiz',
  eyebrow: 'Cape & Cowl Alignment Test',
  title: { pre: 'Which ', em: 'Superhero', post: ' Are You?' },
  lede: 'Ten statements, one honest look at the hero underneath. Answer for the version of you that shows up when the alarm goes off.',
  seal: { char: '🦸' },
  rosterNoun: 'heroes',
  beginLabel: 'Answer the call',
  tierLabels: { front: 'Marquee', cut: 'Deep Cut' },
  shareEmoji: '🦸',
  shareGradient: 'from-blue-500 to-indigo-600',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Superhero Are You? test. mypersonalityquizzes.com/quiz/superhero`,
  disclaimer: 'Original emblems generated for this quiz. Superman, Batman, Wonder Woman, The Flash, Aquaman, and Green Lantern are © DC Comics / Warner Bros. Discovery; Spider-Man, Iron Man, Captain America, Black Panther, Hulk, Thor, Black Widow, Doctor Strange, Storm, Wolverine, Captain Marvel, and Ms. Marvel are © Marvel / The Walt Disney Company — this is an unofficial fan-made personality test.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
