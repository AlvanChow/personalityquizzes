// Which Wizarding House Do You Belong In? — vector quiz data module.
//
// Conversion of the original letter-tally house quiz (src/data/houseQuestions.js
// + src/data/houseResults.js) to the vector-matching experience. Every house is
// a position in 2-axis personality space and matching is cosine similarity
// (see src/utils/vectorQuiz.js for the why). The Monte-Carlo battery in
// house.test.js re-verifies reachability/entropy/sensitivity after every
// roster or question edit — run it before shipping ANY change to this file.
//
// COMPAT CONTRACT: the friend-compatibility engine (src/utils/compatibility.js
// HOUSES map) reads the stored result.key and expects EXACTLY these four keys:
// gryffindor, hufflepuff, ravenclaw, slytherin. Never rename or drop them.
//
// Axes: [nerve, compass], each in [-1, 1]
//   nerve:   -1 deliberate / +1 daring    (think it through vs. leap first)
//   compass: -1 own star   / +1 the crew  (personal ambition vs. collective loyalty)
//
// The four houses are the four quadrants of that plane — each owns ~90° of
// sky, which is exactly why direction matching works so cleanly here:
//   gryffindor  daring + for the crew      (~30°)
//   hufflepuff  deliberate + for the crew  (~119°)
//   ravenclaw   deliberate + own star      (~215°)
//   slytherin   daring + own star          (~303°)
// hufflepuff sits at the smallest magnitude on purpose, so an all-neutral
// taker falls back (nearest-point) to the gentlest read, not an intense one.

/* ---------- roster: every house is a direction in 2-space ---------- */
const CHARS = {
  gryffindor:{name:"Gryffindor", tag:"Fortune Favors the Bold", tier:"front", glyph:"flame", aura:"#e8574c", img:null, emoji:"🦁",
    v:[.85,.50], kindred:"hufflepuff", rival:"slytherin",
    traits:["Brave","Daring","Big-hearted","Honest","Chivalrous"],
    desc:"You lead with your heart and your nerve — usually in that order — and when something is wrong, you're the first to say so out loud. Fear doesn't stop you; it's just the weather you walk through on the way to doing the right thing. People are drawn to your fire because standing next to you makes them braver too."},
  hufflepuff:{name:"Hufflepuff", tag:"Loyal to the Very End", tier:"front", glyph:"paw", aura:"#e6b845", img:null, emoji:"🦡",
    v:[-.45,.80], kindred:"gryffindor", rival:"slytherin",
    traits:["Loyal","Patient","Fair-minded","Hardworking","Kind"],
    desc:"You're the 2am phone call that always gets answered, quietly building the kind of trust that holds whole friend groups together. Your kindness isn't softness — it takes real backbone to keep showing up, keep playing fair, and keep doing the work when nobody's watching. The world runs on people like you, and the ones who matter know it."},
  ravenclaw:{name:"Ravenclaw", tag:"Wit Beyond Measure", tier:"front", glyph:"feather", aura:"#5b8fd9", img:null, emoji:"🦅",
    v:[-.80,-.55], kindred:"slytherin", rival:"gryffindor",
    traits:["Curious","Original","Perceptive","Sharp-witted","Inventive"],
    desc:"Your mind is a browser with forty tabs open, and honestly, you love it that way. You collect ideas the way other people collect souvenirs, and you'd rather understand a thing deeply than win an argument about it. You see the angle everybody else missed, because for you the question is always more interesting than the answer."},
  slytherin:{name:"Slytherin", tag:"Greatness Has a Plan", tier:"front", glyph:"coil", aura:"#4dba7c", img:null, emoji:"🐍",
    v:[.55,-.85], kindred:"ravenclaw", rival:"gryffindor",
    traits:["Ambitious","Resourceful","Strategic","Determined","Shrewd"],
    desc:"You don't just dream big — you draft the roadmap, spot the shortcuts, and quietly start executing while everyone else is still talking. You read rooms the way other people read books, and being underestimated has only ever worked in your favor. You know exactly where you're going, and you will absolutely get there."}
};

/* ---------- questions: weight vector [nerve, compass] ---------- */
const Q = [
  {t:"When a once-in-a-lifetime chance shows up, I leap first and figure out the landing on the way down.",          w:[ 1,  0]},
  {t:"Before any big decision, I need to walk around it a few times and look at it from every angle.",               w:[-1,  0]},
  {t:"A win doesn't feel real to me until the people I love are celebrating it with me.",                            w:[ 0,  1]},
  {t:"I have a very clear picture of who I'm becoming, and I guard the time it takes — even from people I like.",    w:[ 0, -1]},
  {t:"If something unfair is happening right in front of me, I'll say so on the spot — even if my voice shakes.",    w:[ 1,  0]},
  {t:"I'd rather wait patiently for the right moment than force a dramatic one.",                                    w:[-1,  0]},
  {t:"I'd happily take the unglamorous role if it got my team across the finish line.",                              w:[ 0,  1]},
  {t:"Being genuinely great at my thing matters more to me than being universally liked.",                           w:[ 0, -1]},
  {t:"If a friend called me in trouble at 3am, I'd be out the door before they finished the sentence.",              w:[ .5, .5]},
  {t:"A rule that exists only to slow everyone down reads more like a suggestion to me.",                            w:[ .5,-.5]}
];
const AXMAX=[5, 5];
const SPECTRA=[
  {l:"Deliberate", r:"Daring"},
  {l:"Own Star", r:"The Crew"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'house',
  quizName: 'Wizarding House',
  eyebrow: 'The Sorting Ceremony',
  title: { pre: 'Which ', em: 'Wizarding House', post: ' Do You Belong In?' },
  lede: 'Ten honest statements — no spells, no trick questions. Answer for who you actually are when the moment counts, and the sorting takes care of itself.',
  seal: { char: '🪄' },
  rosterNoun: 'houses',
  beginLabel: 'Begin the sorting',
  tierLabels: { front: 'House', cut: 'House' },
  shareEmoji: '🪄',
  shareGradient: 'from-amber-400 to-amber-700',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the Which Wizarding House Do You Belong In? quiz. mypersonalityquizzes.com/quiz/house`,
  disclaimer: 'Original crests generated for this quiz. The wizarding houses are from the Wizarding World, © Warner Bros. Entertainment / J.K. Rowling — this is an unofficial fan-made personality test.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
