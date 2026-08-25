// What's Your Toxic Trait? — vector quiz data module.
//
// A loving roast: eight extremely relatable flaws placed evenly around a
// 2-axis space; matching is cosine similarity (see src/utils/vectorQuiz.js).
// The Monte-Carlo battery in toxic_trait.test.js re-verifies reachability/
// entropy/sensitivity after every roster or question edit — run it before
// shipping ANY change.
//
// Axes: [grip, aim], each in [-1, 1]
//   grip: -1 lets go of everything / +1 grips everything
//   aim:  -1 turned inward (self)  / +1 aimed outward (others)
//
// The eight sit at 45° intervals so no result shadows another. overthinker
// carries the smallest magnitude on purpose: an all-neutral taker falls back
// (nearest-point) to the most universally relatable read.

/* ---------- roster: every trait is a direction in 2-space ---------- */
const CHARS = {
  controlfreak:{name:"The Control Freak", tag:"The Itinerary Has a Backup Itinerary", tier:"front", glyph:"gear", aura:"#e07a4a", img:null, emoji:"📋",
    v:[.92,.38], kindred:"perfectionist", rival:"flake",
    traits:["Organized","Decisive","Reliable","Exacting","Relentless"],
    desc:"You don't distrust other people, exactly — you just trust yourself more, about everything, always. You've 'helped' friends replan trips they'd already planned, and your group's survival in any crisis is genuinely thanks to you. The toxic part isn't the competence. It's that relaxing feels like a task you haven't scheduled yet."},
  oneupper:{name:"The One-Upper", tag:"That Reminds You of a Better Story", tier:"front", glyph:"flash", aura:"#e8b23a", img:null, emoji:"🎤",
    v:[.38,.92], kindred:"controlfreak", rival:"peoplepleaser",
    traits:["Competitive","Entertaining","Quick","Confident","Unstoppable"],
    desc:"Someone mentions a headache; you once had a migraine on a boat, during a storm, in another country. You don't mean to compete — your stories are just genuinely better, and it would be a disservice to keep them from the room. The affection underneath is real: you one-up because you're engaged. Still. Let them finish. Once."},
  grudgekeeper:{name:"The Grudge Collector", tag:"Forgiven, Never Refunded", tier:"front", glyph:"knives", aura:"#b0566a", img:null, emoji:"🧾",
    v:[-.38,.92], kindred:"oneupper", rival:"overthinker",
    traits:["Loyal","Sharp-memoried","Principled","Patient","Petty"],
    desc:"You forgive quickly and forget absolutely nothing. Somewhere in your mind is a beautifully organized archive: who said what in 2019, who didn't text back, which restaurant wronged you personally. You rarely act on it — that's the elegant part — but everyone senses the ledger exists. Your loyalty is fierce because it's earned. And itemized."},
  ghoster:{name:"The Ghost", tag:"Read at 11:47 PM", tier:"front", glyph:"shadow", aura:"#8a93a8", img:null, emoji:"👻",
    v:[-.92,.38], kindred:"flake", rival:"perfectionist",
    traits:["Elusive","Independent","Overwhelmed","Gentle","Vanishing"],
    desc:"You never mean to disappear. The message arrives, you read it, you compose a warm reply in your head — and then three weeks pass and now responding feels like it requires an apology tour. You care about people deeply, in private, from a distance, telepathically. The toxic trait isn't coldness. It's that your warmth so rarely reaches the send button."},
  flake:{name:"The Flake", tag:"So Excited! (Cancels)", tier:"front", glyph:"butterfly", aura:"#7ec49a", img:null, emoji:"🍃",
    v:[-.92,-.38], kindred:"ghoster", rival:"controlfreak",
    traits:["Spontaneous","Warm","Optimistic","Overbooked","Escaping"],
    desc:"Past you keeps making plans that present you has to survive. You say yes with your whole heart — the dinner, the trip, the 7am hike — because at the moment of asking, you genuinely mean it. Then the day arrives and the couch presents its counteroffer. Your friends have learned to book you like a standby flight. Confirmed, but loosely."},
  peoplepleaser:{name:"The People Pleaser", tag:"No, Totally, It's Fine", tier:"front", glyph:"blossom", aura:"#ef7a9b", img:null, emoji:"🫶",
    v:[-.38,-.92], kindred:"overthinker", rival:"oneupper",
    traits:["Generous","Agreeable","Attentive","Selfless","Simmering"],
    desc:"You have said 'it's fine' about things that were spectacularly not fine. You absorb inconveniences like a professional — wrong order, worse seat, weekend plans you dreaded — because someone else's comfort always outbids your own. The resentment compounds quietly, like interest. One day you'll cash it out. Today you'll just say it's fine."},
  overthinker:{name:"The Overthinker", tag:"The 2AM Replay Special", tier:"front", glyph:"coil", aura:"#8b7ae8", img:null, emoji:"🌀",
    v:[.36,-.87], kindred:"peoplepleaser", rival:"grudgekeeper",
    traits:["Thoughtful","Thorough","Imaginative","Careful","Spiraling"],
    desc:"You've re-run today's conversations more times than the people you had them with will ever think about them, combined. Every 'ok.' is a novel; every unanswered text is a verdict. The same brain that catches what everyone misses also builds courtroom dramas out of nothing. You're not crazy — you're thorough. About feelings. At 2am."},
  perfectionist:{name:"The Perfectionist", tag:"Almost Counts as Failure", tier:"front", glyph:"diamond", aura:"#5f88c4", img:null, emoji:"📐",
    v:[.92,-.38], kindred:"controlfreak", rival:"ghoster",
    traits:["Meticulous","Driven","Principled","Polished","Unsatisfied"],
    desc:"Your standards are a gift to everything you touch and a tax on everyone who has to watch you touch it — mostly yourself. 'Good enough' is a phrase other people say. You'll redo work nobody asked you to redo, then apologize for it being late instead of perfect. Here's the roast and the release in one line: nobody else can see the flaw."}
};

/* ---------- questions: weight vector [grip, aim] ---------- */
const Q = [
  {t:"If I don't organize the group plan myself, I will quietly redo everyone else's version of it.",                          w:[ 1, 0]},
  {t:"Commitment makes me itchy — plans are best when they're still hypothetical.",                                            w:[-1, 0]},
  {t:"I have a hard time delegating. If you want it done right, well — you've met me.",                                        w:[ 1, 0]},
  {t:"My default under pressure is to dodge: change the subject, leave the chat, reschedule the feelings.",                    w:[-1, 0]},
  {t:"When something goes wrong, my first instinct is to establish whose fault it was. Out loud.",                             w:[ 0, 1]},
  {t:"When something goes wrong, I assume it was me — then build a museum exhibit about it in my head.",                       w:[ 0,-1]},
  {t:"I keep receipts — screenshots, dates, exact words — and I will cite my sources mid-argument.",                           w:[ 0, 1]},
  {t:"I'd rather absorb an inconvenience silently than cause even mild friction by mentioning it.",                            w:[ 0,-1]},
  {t:"People have described me as 'a lot,' and honestly they were underselling it.",                                           w:[ .5, .5]},
  {t:"I cancel plans I was excited about, because the me who made them had more energy than the me who has to attend.",        w:[-.5,-.5]}
];
const AXMAX=[5, 5];
const SPECTRA=[
  {l:"Lets Go", r:"Grips Tight"},
  {l:"Turned Inward", r:"Aimed Outward"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'toxic_trait',
  quizName: 'Toxic Trait Check',
  eyebrow: 'The Loving Roast',
  title: { pre: "What's Your ", em: 'Toxic Trait', post: '?' },
  lede: "Ten statements, zero judgment, one mirror. Answer honestly — not as the person you're trying to become, but as the person your group chat already knows — and we'll name the flaw with love.",
  seal: { char: '🔥' },
  rosterNoun: 'toxic traits',
  beginLabel: 'Roast me',
  tierLabels: { front: 'Toxic Trait', cut: 'Toxic Trait' },
  shareEmoji: '🔥',
  shareGradient: 'from-orange-400 to-rose-500',
  copyLine: (name, tag, match) =>
    `My toxic trait is ${name} — "${tag}" (${match}% match). Find yours: mypersonalityquizzes.com/quiz/toxic_trait`,
  disclaimer: "A loving roast, not a clinical anything. Everyone has all eight of these on the wrong day; this quiz names the one you lean on hardest. If a result stings in a useful way, that's a feature — but the only diagnosis here is 'human.'",
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
