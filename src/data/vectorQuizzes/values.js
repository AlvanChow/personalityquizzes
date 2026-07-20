// What Do You Value Most? — vector quiz data module.
//
// Conversion of the original 'pick'-mode Schwartz values quiz
// (src/data/quizzes/values.js) to the vector-matching experience.
// Every value is a position in 2-axis space — the two great tensions of
// Schwartz's real circumplex of basic human values — and matching is cosine
// similarity (see src/utils/vectorQuiz.js for the why). The Monte-Carlo
// battery in values.test.js re-verifies reachability/entropy/sensitivity
// after every roster or question edit — run it before shipping ANY change.
//
// All six original resultKeys are preserved exactly (saved results reference
// them): achievement, benevolence, selfdirection, security, stimulation,
// universalism. Nothing renamed, nothing dropped.
//
// Axes: [change, focus], each in [-1, 1]
//   change: -1 conservation       / +1 openness-to-change
//   focus:  -1 self-transcendence / +1 self-enhancement
//
// Each value sits at its circumplex bearing (angles from the +change axis):
// selfdirection −20°, stimulation 35°, achievement 80°, security 165°,
// benevolence 225°, universalism 285°. The 85° gap between achievement and
// security is where Schwartz parks "power" — deliberately left empty here.
// benevolence carries the smallest magnitude on purpose, so an all-neutral
// taker falls back (nearest-point) to the warmest read, not an intense one.

/* ---------- roster: every value is a direction in 2-space ---------- */
const CHARS = {
  achievement:{name:"The Achiever", tag:"The Undeniable Standard", tier:"front", glyph:"diamond", aura:"#e8b23a", img:null, emoji:"🏆",
    v:[.17,.98], kindred:"selfdirection", rival:"universalism",
    traits:["Ambitious","Disciplined","Competitive","Focused","Undeniable"],
    desc:"You feel most alive when you're measurably getting better at something hard, and a goal without a scoreboard barely counts as a goal. Praise is pleasant, but what you're really after is being undeniable — work so good it argues for itself. Just check, now and then, that the ladder you're climbing so brilliantly is leaning against your own wall."},
  benevolence:{name:"The Caregiver", tag:"The Inner-Circle Keeper", tier:"front", glyph:"blossom", aura:"#ef7a9b", img:null, emoji:"💗",
    v:[-.64,-.64], kindred:"universalism", rival:"achievement",
    traits:["Loyal","Attentive","Generous","Dependable","Warm"],
    desc:"You measure a life by whether the people who count on you could always count on you — and yours can. You remember birthdays, notice bad days, and quietly rearrange your plans the moment someone you love is struggling. The world runs on people like you and rarely says so; consider this the saying-so."},
  selfdirection:{name:"The Trailblazer", tag:"The Compass of One", tier:"front", glyph:"spiral", aura:"#8b7ae8", img:null, emoji:"🧭",
    v:[.94,-.34], kindred:"stimulation", rival:"security",
    traits:["Independent","Original","Self-starting","Curious","Unswayed"],
    desc:"You need to think your own thoughts, make your own calls, and live by conclusions you actually reached yourself. Being told how to do something you already know how to do is, to you, a special category of insult. You'd trade a bigger paycheck for full autonomy without blinking — and knowing you, you already have."},
  security:{name:"The Guardian", tag:"The Solid Ground", tier:"front", glyph:"cube", aura:"#8fa3bd", img:null, emoji:"🛡️",
    v:[-.97,.26], kindred:"benevolence", rival:"stimulation",
    traits:["Steady","Prepared","Prudent","Protective","Grounded"],
    desc:"While everyone else chases upside, you're the one asking the unglamorous questions about downside — and you're usually right to. You keep promises, savings, and routines, and there are people who sleep well at night specifically because you exist. Your steadiness isn't a lack of imagination; it's what makes everyone else's risk-taking survivable."},
  stimulation:{name:"The Adventurer", tag:"The Spark Chaser", tier:"front", glyph:"burst", aura:"#f2733f", img:null, emoji:"⚡",
    v:[.82,.57], kindred:"selfdirection", rival:"security",
    traits:["Adventurous","Energetic","Adaptable","Fearless","Spontaneous"],
    desc:"Routine drains you faster than hard work ever could; your real nightmare isn't failure, it's a life that becomes a repeating loop. You say yes first and figure it out mid-air, and your stories are the ones people ask to hear twice. You exist to remind everyone around you not to mistake comfort for living."},
  universalism:{name:"The Humanitarian", tag:"The Wider Circle", tier:"front", glyph:"ripple", aura:"#3cc08e", img:null, emoji:"🌍",
    v:[.26,-.97], kindred:"benevolence", rival:"achievement",
    traits:["Fair","Principled","Big-picture","Compassionate","Far-sighted"],
    desc:"Your conscience has a longer range than most — it reaches past your own circle to strangers, other species, and the planet itself. You're the one asking who got left out of the decision and whether the rules are just or merely convenient. Injustice you can't fix still keeps you up at night, which is exhausting — and exactly why some of it gets fixed at all."}
};

/* ---------- questions: weight vector [change, focus] ---------- */
const Q = [
  {t:"Given the choice between a beloved routine and something I've never tried, I'll pick the never-tried almost every time.", w:[ 1, 0]},
  {t:"I feel most like myself when life is settled — plans made, savings growing, no surprises on the calendar.",              w:[-1, 0]},
  {t:"Rules that exist only because \"that's how it's always been done\" practically beg me to challenge them.",               w:[ 1, 0]},
  {t:"Before any big life change I want research, a timeline, and a fallback plan — leaping first is for other people.",       w:[-1, 0]},
  {t:"I keep score with myself — being merely okay at something I care about genuinely bothers me.",                           w:[ 0, 1]},
  {t:"I'd happily take a smaller win for myself if it bought a bigger win for people who need it more.",                       w:[ 0,-1]},
  {t:"When something I worked on succeeds, part of me really wants my name clearly attached to it.",                           w:[ 0, 1]},
  {t:"A story about strangers being treated unfairly can occupy my head for days afterward.",                                  w:[ 0,-1]},
  {t:"I'd rather take a bold, uncertain shot at something remarkable than settle for safe and modest.",                        w:[ .5, .5]},
  {t:"The quiet work of keeping a family, team, or neighborhood steady matters more to me than standing out.",                 w:[-.5,-.5]}
];
const AXMAX=[5, 5];
const SPECTRA=[
  {l:"Preserve", r:"Explore"},
  {l:"Give Back", r:"Get Ahead"}
];

export { CHARS, Q, AXMAX, SPECTRA };

/* ---------- experience definition ---------- */
// Consumed by VectorQuizExperience — copy, theme, and integration config.
const def = {
  key: 'values',
  quizName: 'Core Values Compass',
  eyebrow: 'The Quiet Compass',
  title: { pre: 'What Do You ', em: 'Value', post: ' Most?' },
  lede: 'Ten honest statements about the tradeoffs you actually make. Answer for the person you are when nobody is grading, and the value quietly steering your decisions will surface.',
  seal: { char: '💎' },
  rosterNoun: 'core values',
  beginLabel: 'Take my bearing',
  tierLabels: { front: 'Core Value', cut: 'Core Value' },
  shareEmoji: '💎',
  shareGradient: 'from-violet-400 to-purple-500',
  copyLine: (name, tag, match) =>
    `I got ${name} — "${tag}" (${match}% match) on the What Do You Value Most? quiz. mypersonalityquizzes.com/quiz/values`,
  disclaimer: 'Inspired by Shalom Schwartz\'s theory of basic human values, which maps values in a circle around two great tensions: openness to change vs. conservation, and self-enhancement vs. self-transcendence. This quiz borrows that map for reflection, not diagnosis — most people carry every one of these values, and your compass heading can shift as your life does.',
  theme: {},
  CHARS, Q, AXMAX, SPECTRA,
};
export default def;
