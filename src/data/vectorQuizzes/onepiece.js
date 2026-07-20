// Which One Piece Character Are You? — data module.
//
// Vector-quiz conversion of the original pick-mode One Piece Crew quiz. Every
// character is a position in 4-axis personality space; matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in onepiece.test.js re-verifies reachability/entropy/sensitivity
// after every roster or question edit — run it before shipping ANY change.
//
// The original eight resultKeys (luffy, zoro, nami, usopp, sanji, chopper,
// robin, franky) are preserved exactly — users' saved results reference them.
// The roster expands beyond the Straw Hats to twenty seafarers.
//
// Axes: [helm, crew, drive, show], each in [-1, 1]
//   helm:  -1 chart it   / +1 wing it (plan vs instinct)
//   crew:  -1 solo sail  / +1 crew first
//   drive: -1 anchor     / +1 horizon (protect the harbor vs chase the dream)
//   show:  -1 stone-faced/ +1 center stage
//
// Character images: every entry has img:null. Paste a URL to swap the
// generated emblem for a photo; the emblem code handles the rest.

import { G, emblem } from './glyphs';
export { G, emblem };

const CHARS = {
  luffy:{name:"Monkey D. Luffy", tag:"The Grinning Horizon", tier:"front", glyph:"spiral", aura:"#f04c3a", img:null, emoji:"🍖",
    v:[.85,.70,.65,.85], kindred:"ace", rival:"katakuri",
    traits:["Fearless","Magnetic","Instinctive","Loyal","Free"],
    desc:"You move through life on appetite and instinct, and somehow the wildest route keeps turning out to be the right one. Strangers become lifelong friends within an hour of meeting you, because being near you makes people braver than they thought they could be. You don't chase freedom — you simply refuse, cheerfully and completely, to live without it."},
  zoro:{name:"Roronoa Zoro", tag:"The Unbending Blade", tier:"front", glyph:"blade", aura:"#3fae6a", img:null, emoji:"⚔️",
    v:[.30,-.35,.75,-.65], kindred:"luffy", rival:"mihawk",
    traits:["Disciplined","Stoic","Unbreakable","Direct","Devoted"],
    desc:"You picked your mountain years ago and you've been climbing it every single day since, no announcements, no excuses. You may take the scenic route — fine, every route — but you have never once lost sight of the summit. You rarely say the warm thing out loud; you just take the hit meant for a friend without a second of hesitation."},
  nami:{name:"Nami", tag:"The Storm Reader", tier:"front", glyph:"wave", aura:"#f5a623", img:null, emoji:"🍊",
    v:[-.90,.40,.20,.30], kindred:"robin", rival:"buggy",
    traits:["Strategic","Sharp","Resourceful","Pragmatic","Caring"],
    desc:"You're the one who actually knows where the group is going, what it will cost, and which three things could go wrong on the way. People tease you about the budgets and the backup plans right up until your planning saves everyone. Behind the sharp negotiating sits someone who cares so much it occasionally embarrasses you."},
  usopp:{name:"Usopp", tag:"The Trembling Sharpshooter", tier:"front", glyph:"ripple", aura:"#a4c93f", img:null, emoji:"🎯",
    v:[-.30,.60,.25,.80], kindred:"chopper", rival:"luffy",
    traits:["Imaginative","Jittery","Brave","Funny","Ingenious"],
    desc:"You're honest about being scared, and that's exactly what makes your courage the real kind. You spin tall tales, invent gadgets nobody asked for, and keep morale alive when everything looks lost. Then the moment truly counts, your knees shake — and you plant your feet and take the shot anyway."},
  sanji:{name:"Sanji", tag:"The Knight of the Kitchen", tier:"front", glyph:"knives", aura:"#3a72d8", img:null, emoji:"🍳",
    v:[-.15,.70,-.55,.60], kindred:"nami", rival:"zoro",
    traits:["Chivalrous","Stylish","Nurturing","Principled","Dramatic"],
    desc:"Your love language is looking after people — usually through food, always with flair. You hold yourself to a personal code you won't compromise, even when it costs you, and you'd go without before you let anyone else do the same. The polish and the drama are real, but so is the steel underneath."},
  chopper:{name:"Tony Tony Chopper", tag:"The Cotton-Candy Heart", tier:"front", glyph:"blossom", aura:"#f2789f", img:null, emoji:"🩺",
    v:[-.40,.85,-.55,-.20], kindred:"usopp", rival:"law",
    traits:["Gentle","Curious","Humble","Steadfast","Kind"],
    desc:"You lead with kindness in a world that doesn't always deserve it, and you refuse to let that change you. You're the one quietly checking that everyone ate, slept, and is actually okay behind the brave face. People underestimate the soft-spoken one — until a real emergency hits and you're suddenly the calmest, most capable person in the room."},
  robin:{name:"Nico Robin", tag:"The Smiling Archive", tier:"front", glyph:"bloom", aura:"#9b6dd6", img:null, emoji:"📚",
    v:[-.60,-.15,.60,-.75], kindred:"law", rival:"franky",
    traits:["Calm","Erudite","Wry","Observant","Devoted"],
    desc:"You're the calm, watchful one who has already read the room, the subtext, and three books on the subject. Your curiosity runs deep and a little dark — you'll cheerfully mention the worst-case scenario everyone was avoiding, then smile serenely. It took you years to believe you belonged somewhere, and now your loyalty is quiet, absolute, and slightly terrifying."},
  franky:{name:"Franky", tag:"The Roaring Blueprint", tier:"front", glyph:"gear", aura:"#35d0ea", img:null, emoji:"🔧",
    v:[.25,.50,.30,1.0], kindred:"usopp", rival:"katakuri",
    traits:["Loud","Inventive","Big-hearted","Bold","Skilled"],
    desc:"You're maximum volume, maximum heart, and maximum output, usually all at once. Where others see a broken thing you see a weekend project, and where others see an impossible dream you start sketching blueprints. You cry openly at moving stories, then back up every ounce of that enthusiasm with genuine, hard-won skill."},
  brook:{name:"Brook", tag:"The Soul of the Party", tier:"front", glyph:"sound", aura:"#b9aede", img:null, emoji:"🎻",
    v:[.40,.85,-.15,.90], kindred:"franky", rival:"mihawk",
    traits:["Joyful","Musical","Courteous","Wistful","Loyal"],
    desc:"You've decided that joy is a discipline, and you practice it louder than anyone. You turn long waits into songs, grim rooms into parties, and every goodbye into a promise to meet again. Underneath the jokes lives someone who understands loneliness better than most — which is exactly why you'll never let a friend feel it."},
  jinbe:{name:"Jinbe", tag:"The Steady Helmsman", tier:"front", glyph:"fin", aura:"#2f9e8f", img:null, emoji:"🌊",
    v:[-.70,.50,-.55,-.45], kindred:"whitebeard", rival:"ace",
    traits:["Honorable","Steady","Wise","Dutiful","Composed"],
    desc:"You're the steady hand people reach for when the water turns rough. Duty isn't a burden to you; it's a promise you renew daily — measured, honorable, and completely unshakeable once given. You speak carefully, act deliberately, and hold the course while louder voices panic."},
  law:{name:"Trafalgar Law", tag:"The Deadpan Surgeon", tier:"front", glyph:"hex", aura:"#e8d44f", img:null, emoji:"⚕️",
    v:[-.85,-.60,.55,-.30], kindred:"robin", rival:"luffy",
    traits:["Calculating","Deadpan","Precise","Independent","Principled"],
    desc:"You plan thirteen steps ahead, say about six words, and let the results do the talking. Alliances are tools, feelings are private, and the eye-roll you give reckless people is nearly audible — yet you keep saving them anyway. Underneath the deadpan is an old debt of gratitude you've quietly spent your whole life repaying."},
  shanks:{name:"Shanks", tag:"The Easygoing Legend", tier:"front", glyph:"flash", aura:"#b02a37", img:null, emoji:"🕊️",
    v:[.80,.45,-.50,.10], kindred:"buggy", rival:"mihawk",
    traits:["Easygoing","Generous","Unshakeable","Charismatic","Decisive"],
    desc:"You've got nothing left to prove, and it shows in how lightly you carry your strength. You'll laugh off an insult, buy the next round, and let people wildly underestimate you — right up until something that matters is threatened. Then the temperature in the room drops, and everyone remembers exactly who they're talking to."},
  ace:{name:"Portgas D. Ace", tag:"The Blazing Big Brother", tier:"front", glyph:"flame", aura:"#f07830", img:null, emoji:"🔥",
    v:[.65,.25,.15,.70], kindred:"sabo", rival:"jinbe",
    traits:["Passionate","Protective","Bold","Warm","Restless"],
    desc:"You burn hot and love harder, wearing every feeling right there on your sleeve. Fiercely protective of your chosen family, you'd cross an ocean to settle a wrong done to one of them. Beneath the swagger sits a quieter question — whether you deserve the love you're given — and everyone who knows you answers it without hesitation."},
  whitebeard:{name:"Edward Newgate (Whitebeard)", tag:"The Father of the Seas", tier:"cut", glyph:"tree", aura:"#efe7d4", img:null, emoji:"⚓",
    v:[.35,.90,-.75,.45], kindred:"ace", rival:"garp",
    traits:["Paternal","Mighty","Loyal","Generous","Commanding"],
    desc:"You gave up chasing treasure a long time ago, because you found the thing worth more: a family that calls you theirs. You're the biggest presence in any room and you spend all of it on protection, standing between the storm and your people. Loyalty flows both ways with you — total, loud, and non-negotiable."},
  buggy:{name:"Buggy", tag:"The Accidental Legend", tier:"cut", glyph:"burst", aura:"#6fb5e8", img:null, emoji:"🤡",
    v:[.15,-.25,.50,1.0], kindred:"usopp", rival:"shanks",
    traits:["Theatrical","Lucky","Cunning","Boisterous","Resilient"],
    desc:"You're a showman first, a schemer second, and — to your own eternal surprise — a legend third. Somehow your luck, your flair, and your genius for taking credit keep landing you on stages you never planned to reach. Laugh all you want; the people who wrote you off keep having to update their charts."},
  hancock:{name:"Boa Hancock", tag:"The Proud Empress", tier:"cut", glyph:"coil", aura:"#d6488f", img:null, emoji:"🐍",
    v:[.35,-.75,.40,.55], kindred:"mihawk", rival:"buggy",
    traits:["Proud","Regal","Dramatic","Guarded","Devoted"],
    desc:"You move through the world like it should be grateful for the view, and honestly, your confidence does most of the work. Behind the imperious front is a past that taught you to trust almost no one — so the few people you let in receive a devotion that would topple empires. You're proud, dramatic, and far kinder than you'll ever admit in public."},
  mihawk:{name:"Dracule Mihawk", tag:"The Lonely Summit", tier:"cut", glyph:"feather", aura:"#7a8a9e", img:null, emoji:"🦅",
    v:[-.50,-.95,.15,-.70], kindred:"katakuri", rival:"shanks",
    traits:["Solitary","Masterful","Austere","Patient","Discerning"],
    desc:"You climbed to the top of your craft and found it quiet up there — which suits you fine. You keep your own company, your own schedule, and standards so high that most challengers simply confirm your solitude. Yet you watch promising people with something like hope, waiting patiently for the one who will make things interesting again."},
  sabo:{name:"Sabo", tag:"The Gentleman Firebrand", tier:"cut", glyph:"flame", aura:"#6d5bd0", img:null, emoji:"🎩",
    v:[-.45,.35,.55,.10], kindred:"ace", rival:"garp",
    traits:["Principled","Courteous","Fiery","Strategic","Loyal"],
    desc:"You believe the world's rules were written badly, and you've made it your life's work to redraft them. Polished manners, iron conviction: you'll debate like a gentleman and fight like a wildfire for people who can't fight for themselves. The family you chose outranks the one you were born into, and you never forget a promise made to either."},
  katakuri:{name:"Charlotte Katakuri", tag:"The Flawless Guardian", tier:"cut", glyph:"eye", aura:"#a34a9e", img:null, emoji:"🍡",
    v:[-.80,.20,-.15,-.90], kindred:"zoro", rival:"luffy",
    traits:["Perfectionist","Composed","Vigilant","Selfless","Formidable"],
    desc:"You've built a reputation for being flawless, and you maintain it the unglamorous way: preparation, discipline, and standards nobody ever sees you sweat for. You read situations several moves ahead and quietly arrange things so the people behind you never feel the impact. Perfection was never the point — protecting them is."},
  garp:{name:"Monkey D. Garp", tag:"The Fist of Love", tier:"cut", glyph:"paw", aura:"#c58a4f", img:null, emoji:"👊",
    v:[.80,.30,-.60,.70], kindred:"luffy", rival:"whitebeard",
    traits:["Boisterous","Legendary","Blunt","Doting","Tough"],
    desc:"You're a legend who refuses to act like one, laughing through meetings, napping through ceremonies, and solving problems with alarming directness. You turned down every promotion that would have taken you away from the actual work. Your love is loud, your standards are relentless, and the people you train complain constantly — then turn out extraordinary."}
};

/* ---------- questions: weight vector [helm, crew, drive, show] ---------- */
const Q = [
  {t:"My best decisions happen on gut feeling — I figure out the reasons somewhere down the road.",   w:[ 1, 0, 0, 0]},
  {t:"Before anything big I want a route mapped out, a budget, and at least one backup plan.",        w:[-1, 0, 0, 0]},
  {t:"Everything's more fun with my whole crew of friends along — even errands turn into adventures.",w:[ 0, 1, 0, 0]},
  {t:"I'm at my best alone: quiet room, closed door, nobody asking if I'm okay every five minutes.",  w:[ 0,-1, 0, 0]},
  {t:"I've got one huge, slightly unreasonable dream, and I fully intend to reach it.",               w:[ 0, 0, 1, 0]},
  {t:"Honestly, the good life is simple: familiar places, great food, and people I can look after.",  w:[ 0, 0,-1, 0]},
  {t:"Whatever I'm feeling, everyone in the room knows it within about ten seconds.",                 w:[ 0, 0, 0, 1]},
  {t:"I keep a straight face and play things close — very few people ever see the unfiltered me.",    w:[ 0, 0, 0,-1]},
  {t:"If someone I love needed me, I'd walk away from my biggest dream mid-chase, no hesitation.",    w:[ 0, .6,-.8, 0]},
  {t:"I love making an entrance — loud announcements, bold style, a little bit of theater.",          w:[ 0, 0, .3, .7]}
];
const AXMAX=[2, 2.6, 3.1, 2.7];
const SPECTRA=[
  {l:"Chart It", r:"Wing It"},
  {l:"Solo Sail", r:"Crew First"},
  {l:"Anchor", r:"Horizon"},
  {l:"Stone-Faced", r:"Center Stage"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'onepiece',
  quizName: 'One Piece Crew Quiz',
  eyebrow: 'Grand Line Alignment Test',
  title: { pre: 'Which ', em: 'One Piece', post: ' Character Are You?' },
  lede: 'Ten statements, one honest reading of how you sail. Answer for the version of you that shows up when the sea gets rough.',
  seal: { char: '🏴‍☠️' },
  rosterNoun: 'characters',
  beginLabel: 'Set sail',
  tierLabels: { front: 'Main Deck', cut: 'Deep Cut' },
  shareEmoji: '🏴‍☠️',
  shareGradient: 'from-red-500 to-rose-600',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which One Piece Character Are You? test. mypersonalityquizzes.com/quiz/onepiece`,
  disclaimer: 'Original emblems generated for this quiz. One Piece and its characters are © Eiichiro Oda / Shueisha — this is an unofficial fan-made personality test.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
