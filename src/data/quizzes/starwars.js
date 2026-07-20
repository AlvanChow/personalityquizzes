// Which Star Wars Character Are You? — 'pick' mode quiz.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'starwars',
  mode: 'pick',
  resultsHeading: 'Your character match breakdown',

  results: {
    luke: {
      name: 'Luke Skywalker',
      emoji: '🌅',
      color: 'from-sky-100 to-amber-50',
      accent: 'text-sky-600',
      tagline: '#Hopeful #Restless #BigDestiny',
      description:
        'You have spent your whole life staring past the edge of wherever you happen to be, certain there is something bigger out there with your name on it. What makes you rare is not the dreaming — it is that you actually go, even terrified, even unready. You believe people can change right up until the moment they prove you right, and that stubborn faith has redeemed more situations (and more people) than any clever plan ever could.',
      strengths: ['Unkillable hope', 'Sees the good in difficult people', 'Answers the call even when scared', 'Grows fastest when tested'],
      growth: 'Your impatience to get to the future can pull you out of training before the foundation is set. The mentors nagging you to slow down are usually not wrong — finish the reps.',
      kindred: ['rey', 'leia'],
    },
    leia: {
      name: 'Princess Leia',
      emoji: '👑',
      color: 'from-rose-100 to-pink-50',
      accent: 'text-rose-600',
      tagline: '#BornLeader #SharpTongue #GraceUnderFire',
      description:
        'You do not wait to be rescued — half the time you end up running the rescue mid-way through it. You combine a diplomat\'s poise with a general\'s spine, and your wit is fast enough that people are still processing the insult while already following your orders. Underneath the command presence is a fierce, personal loyalty: you fight for causes because you love the actual people inside them.',
      strengths: ['Decisive under pressure', 'Rallies demoralized people', 'Razor-sharp wit', 'Never abandons the mission'],
      growth: 'You process your own losses by immediately taking care of everyone else\'s. Letting someone see you grieve is not a leadership failure — it is how the people who love you get to show up.',
      kindred: ['han', 'luke'],
    },
    han: {
      name: 'Han Solo',
      emoji: '🎲',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#LovableRogue #Improviser #SecretSoftie',
      description:
        'You act like you are only in it for yourself, then keep turning the ship around at the worst possible moment to help. Rules read as suggestions to you, plans as rough drafts, and somehow your improvised chaos works out more often than everyone else\'s careful strategy. The cynical front is real armor over a real heart — the people who make it past the sarcasm get a loyalty that never quits.',
      strengths: ['Improvises brilliantly', 'Cool in a crisis', 'Charms his way through anything', 'Shows up when it counts'],
      growth: 'Pretending not to care is a habit that occasionally convinces the wrong people. Saying the sincere thing out loud, on time, would save you a lot of dramatic last-minute gestures.',
      kindred: ['chewbacca', 'leia'],
    },
    yoda: {
      name: 'Yoda',
      emoji: '🌿',
      color: 'from-green-100 to-emerald-50',
      accent: 'text-green-700',
      tagline: '#OldSoul #PatientTeacher #DeeperThanYouThink',
      description:
        'People consistently underestimate you, and you have made peace with that — it is honestly useful. You take the long view in a world addicted to urgency, ask questions instead of issuing answers, and hide serious wisdom behind an odd sense of humor. When you finally do act, the gap between how you seemed and what you can actually do leaves everyone quietly recalibrating.',
      strengths: ['Long-view wisdom', 'Teaches without lecturing', 'Unbothered by appearances', 'Devastating when finally provoked'],
      growth: 'Patience can shade into watching problems ripen that you could have picked early. Some situations do not need another wise question — they need you to intervene now.',
      kindred: ['obiwan', 'luke'],
    },
    obiwan: {
      name: 'Obi-Wan Kenobi',
      emoji: '🧘',
      color: 'from-cyan-100 to-sky-50',
      accent: 'text-cyan-700',
      tagline: '#SteadyHand #PrincipledMentor #DryWit',
      description:
        'You are the person everyone wants in the room when things go sideways: calm, principled, and quietly funnier than you get credit for. You carry your responsibilities like they are non-negotiable — because to you, they are — and you would rather de-escalate with words than win with force, though you can absolutely do both. Your loyalty survives distance, years, and even the failures of the people you believed in.',
      strengths: ['Unshakeable composure', 'Mentors with patience', 'Negotiates before fighting', 'Duty-driven to the core'],
      growth: 'You hold yourself responsible for outcomes that were never fully yours to control. Some people\'s choices are their own — carrying their failures as yours helps no one.',
      kindred: ['yoda', 'leia'],
    },
    rey: {
      name: 'Rey',
      emoji: '⚙️',
      color: 'from-orange-100 to-amber-50',
      accent: 'text-orange-600',
      tagline: '#SelfTaught #Resourceful #FindingHome',
      description:
        'Nobody handed you a manual, so you wrote your own — you are the person who can fix it, climb it, or figure it out with whatever happens to be lying around. Years of counting on yourself made you formidable, but your real engine is hope: a quiet certainty that you are meant for more, and that somewhere out there are people who feel like home. When you finally find your crew, you defend it like someone who knows exactly what it cost to be alone.',
      strengths: ['Learns anything solo', 'Scrappy resourcefulness', 'Endures without complaint', 'Fierce once she belongs'],
      growth: 'Self-reliance served you well, but it taught you to treat needing people as a risk. Belonging is not something you have to keep earning — you are allowed to just have it.',
      kindred: ['luke', 'chewbacca'],
    },
    chewbacca: {
      name: 'Chewbacca',
      emoji: '🐻',
      color: 'from-stone-100 to-amber-50',
      accent: 'text-stone-600',
      tagline: '#RideOrDie #GentleGiant #ActionsNotWords',
      description:
        'You do not do grand speeches — you do three-in-the-morning airport pickups, quiet fixes, and standing directly between your people and trouble. Your loyalty is total and completely undramatic: once someone is yours, that is simply a settled fact of the universe. People who mistake your gentleness for softness discover, exactly once, that it was a choice.',
      strengths: ['Absolute loyalty', 'Strength held gently', 'Steady in chaos', 'Communicates more with less'],
      growth: 'You express everything through actions and assume people can read them. Occasionally saying the thing — the pride, the worry, the affection — lands in ways even your best deeds cannot.',
      kindred: ['han', 'rey'],
    },
    vader: {
      name: 'Darth Vader',
      emoji: '🌑',
      color: 'from-slate-100 to-gray-50',
      accent: 'text-slate-700',
      tagline: '#Intensity #AllIn #RedemptionArc',
      description:
        'You feel everything at full volume and commit at full throttle — half-measures are physically painful to you. That intensity makes you extraordinary: when you decide something will happen, it happens, and rooms reorganize themselves around your focus. Your story is really about what that fire is for, because the same drive that can burn things down is exactly what it takes to turn a life around — and no one comes back from a dark chapter more completely than you do.',
      strengths: ['Relentless drive', 'Total commitment', 'Commands any room', 'Capable of profound change'],
      growth: 'When you fixate on an outcome, you can steamroll the people the outcome was supposed to be for. Loosening your grip is not losing control — it is the strongest move you have.',
      kindred: ['luke', 'obiwan'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'A huge opportunity lands in your lap — exciting, but far outside your comfort zone. First reaction?',
      options: [
        { label: 'Yes. I have been waiting my whole life for something bigger than my routine', points: { luke: 2, rey: 1 } },
        { label: 'Play it cool, ask what is in it for me, and secretly start planning immediately', points: { han: 2, vader: 1 } },
        { label: 'Ask the hard questions nobody else is asking, then commit fully once it holds up', points: { leia: 2, obiwan: 1 } },
        { label: 'Sit with it quietly first — big decisions deserve stillness before they get an answer', points: { yoda: 2, obiwan: 1 } },
      ],
    },
    {
      id: 2,
      text: 'Your team\'s project is falling apart the night before the deadline. You…',
      options: [
        { label: 'Roll up my sleeves and rig a working fix out of whatever we have on hand', points: { rey: 2, han: 1 } },
        { label: 'Plant myself next to whoever is panicking — nobody suffers through this alone', points: { chewbacca: 2, leia: 1 } },
        { label: 'Take command: clear standards, clear roles, no more drift — we are finishing this', points: { vader: 2, leia: 1 } },
        { label: 'Calm everyone down, cut scope to what actually matters, and steady the ship', points: { obiwan: 2, yoda: 1 } },
      ],
    },
    {
      id: 3,
      text: 'You fail publicly at something you really cared about. Your honest reaction?',
      options: [
        { label: 'Take it hard for one night, then wake up certain the next attempt is the one', points: { luke: 2, rey: 1 } },
        { label: 'It burns — and I channel that fire into becoming someone this cannot happen to again', points: { vader: 2 } },
        { label: 'Shrug it off in public, replay it at 2 a.m., come back with a bolder plan', points: { han: 2, chewbacca: 1 } },
        { label: 'Look for the lesson before the rematch — failure teaches what winning never could', points: { yoda: 2, obiwan: 1 } },
      ],
    },
    {
      id: 4,
      text: 'Pick your ideal Saturday:',
      options: [
        { label: 'Helping a friend move or fix something, then a big loud meal with the whole crew', points: { chewbacca: 2, han: 1 } },
        { label: 'Exploring somewhere I have never been, preferably off the marked trail', points: { rey: 2, luke: 1 } },
        { label: 'Slow morning, long walk, good book, one genuinely meaningful conversation', points: { obiwan: 2, yoda: 1 } },
        { label: 'Knocking out my entire to-do list and organizing something people swore was unfixable', points: { leia: 2, vader: 1 } },
      ],
    },
    {
      id: 5,
      text: 'Everyone says the thing you want to do is impossible. What now?',
      options: [
        { label: 'Impossible usually just means nobody has believed in it hard enough yet', points: { luke: 2, yoda: 1 } },
        { label: 'I decide it is happening, then outwork every doubt in the room', points: { vader: 2, leia: 1 } },
        { label: 'Break it down, scavenge what I need, and quietly get further than anyone expected', points: { rey: 2, han: 1 } },
        { label: 'Find whoever is leading the charge and become the reason they never give up', points: { chewbacca: 2, obiwan: 1 } },
      ],
    },
    {
      id: 6,
      text: 'Your biggest flaw, if you\'re being honest:',
      options: [
        { label: 'I act allergic to commitment right up until I dive in headfirst', points: { han: 2, rey: 1 } },
        { label: 'I take responsibility for other people\'s choices and carry the guilt as mine', points: { obiwan: 2, chewbacca: 1 } },
        { label: 'I hold everyone to my standards — and I am not always gentle about it', points: { leia: 2, vader: 1 } },
        { label: 'I answer questions with more questions and stay maddeningly patient with problems people want solved today', points: { yoda: 2 } },
      ],
    },
    {
      id: 7,
      text: 'How do your friends describe you when you\'re not in the room?',
      options: [
        { label: '"Intense. When they decide they want something, get out of the way"', points: { vader: 2, leia: 1 } },
        { label: '"They can figure out literally anything by themselves — it\'s honestly unfair"', points: { rey: 2, luke: 1 } },
        { label: '"The most loyal friend alive. Would show up at 3 a.m. without asking why"', points: { chewbacca: 2, han: 1 } },
        { label: '"A dreamer — but the rare kind who actually goes and does the thing"', points: { luke: 2, yoda: 1 } },
      ],
    },
    {
      id: 8,
      text: 'A heated argument breaks out in your friend group. Your role?',
      options: [
        { label: 'Crack the joke that breaks the tension, then quietly pull the angriest one aside', points: { han: 2, chewbacca: 1 } },
        { label: 'Say the hard thing out loud — someone has to, and apparently it\'s me again', points: { leia: 2, vader: 1 } },
        { label: 'Translate. Both sides are usually shouting the same fear in different words', points: { obiwan: 2, yoda: 1 } },
        { label: 'Stay quiet until everyone talks themselves out, then ask the one question that matters', points: { yoda: 2, obiwan: 1 } },
      ],
    },
    {
      id: 9,
      text: 'What motivates you most deeply?',
      options: [
        { label: 'Finding where I truly belong — and proving I earned my place there', points: { rey: 2, luke: 1 } },
        { label: 'Mastery. I need to be exceptional at what I do, whatever it costs me', points: { vader: 2 } },
        { label: 'Protecting my people. Everything else is negotiable', points: { chewbacca: 2, leia: 1 } },
        { label: 'Becoming the person I can sense I could be, even when the path is unclear', points: { luke: 2, yoda: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'Odds are for people who plan on losing — trust your gut and your speed', points: { han: 2, rey: 1 } },
        { label: 'Hope is a discipline: you organize for it and fight for it, you don\'t wait for it', points: { leia: 2, luke: 1 } },
        { label: 'Who you are is what you do when the right thing costs you something', points: { obiwan: 2, vader: 1 } },
        { label: 'Slow down — most of what feels urgent isn\'t, and most of what matters isn\'t loud', points: { yoda: 2, chewbacca: 1 } },
      ],
    },
  ],
};
