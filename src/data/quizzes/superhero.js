// Which Superhero Are You? — 'pick' mode quiz.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'superhero',
  mode: 'pick',
  resultsHeading: 'Your hero match breakdown',

  results: {
    superman: {
      name: 'Superman',
      emoji: '☀️',
      color: 'from-blue-100 to-sky-50',
      accent: 'text-blue-600',
      tagline: '#SteadyStrength #SmallTownValues #HopeGiver',
      description:
        'You could probably get away with cutting corners — you are that capable — and it genuinely never occurs to you. Raised on the idea that strength exists to serve, you show up early, keep promises nobody remembers you making, and treat every person like they matter, because to you they do. Your real superpower is not the talent; it is that people around you quietly become more hopeful versions of themselves.',
      strengths: ['Reliability people build lives on', 'Power handled gently', 'Unfailing optimism', 'Leads by quiet example'],
      growth: 'You hold yourself to a standard no one could sustain and hide the strain behind an easy smile. Admitting you have limits will not break anyone\'s faith in you — it will deepen it.',
      kindred: ['cap', 'wonderwoman'],
    },
    batman: {
      name: 'Batman',
      emoji: '🦇',
      color: 'from-slate-100 to-zinc-50',
      accent: 'text-slate-700',
      tagline: '#AlwaysPrepared #NightOwl #TurnsPainIntoPurpose',
      description:
        'You have a contingency plan for your contingency plans, and it is not paranoia — it is love wearing armor. Whatever life has thrown at you, you alchemized it into discipline: the extra study, the trained skill, the read of a room nobody else caught. You keep people at arm\'s length and protect them from the shadows, which means half of them never learn how much they owe you. You prefer it that way.',
      strengths: ['Outprepares everyone', 'Sees ten steps ahead', 'Iron self-discipline', 'Turns setbacks into fuel'],
      growth: 'Doing everything alone at 2 a.m. feels safer, but your best chapters have always involved the handful of people you finally trusted. Let the team in earlier.',
      kindred: ['blackpanther', 'ironman'],
    },
    wonderwoman: {
      name: 'Wonder Woman',
      emoji: '🛡️',
      color: 'from-red-100 to-amber-50',
      accent: 'text-red-600',
      tagline: '#TruthTeller #CompassionateWarrior #NoHesitation',
      description:
        'You lead with truth the way other people lead with small talk. Injustice in front of you is automatically your business, and you will step into a conflict everyone else is edging away from — yet you fight without hatred, and you would always rather convert an enemy than crush one. People leave conversations with you feeling both thoroughly seen and slightly braver.',
      strengths: ['Fearless honesty', 'Acts while others hesitate', 'Warmth without weakness', 'Principled to the bone'],
      growth: 'Not every hill needs your full cavalry charge. Learning to let small wrongs stay small preserves your fire for the battles that actually change things.',
      kindred: ['superman', 'cap'],
    },
    spiderman: {
      name: 'Spider-Man',
      emoji: '🕸️',
      color: 'from-rose-100 to-sky-50',
      accent: 'text-rose-600',
      tagline: '#FriendlyNeighborhood #JokesUnderPressure #HeartFirst',
      description:
        'You are perpetually overbooked, slightly late, and still somehow the person who never actually lets anyone down. Humor is your pressure valve — the scarier things get, the faster the quips come — but underneath the jokes is a conscience that will not let you look away from anyone who needs help. You carry responsibilities that would flatten most people and still make it to dinner. Usually.',
      strengths: ['Grace under chaos', 'Disarming humor', 'Never outgrows kindness', 'Carries heavy loads lightly'],
      growth: 'You say yes to everyone and quietly shortchange yourself. Guarding a little time for your own life is not selfish — even the friendly neighborhood needs you rested.',
      kindred: ['ironman', 'hulk'],
    },
    ironman: {
      name: 'Iron Man',
      emoji: '⚙️',
      color: 'from-amber-100 to-red-50',
      accent: 'text-amber-700',
      tagline: '#BuildTheFuture #FastestBrain #HeartUnderTheArmor',
      description:
        'Your brain runs at a clock speed that makes waiting physically painful, so you build instead: prototypes, plans, comebacks, whole futures. You lead with confidence and one-liners, and you let people assume the swagger is all there is — but your track record says otherwise, because when the moment demands real sacrifice, you never do the math on yourself first. You improve everything you touch, including, slowly and grudgingly, yourself.',
      strengths: ['Relentless inventiveness', 'Thrives on impossible problems', 'Charisma with receipts', 'Big sacrifice when it counts'],
      growth: 'You iterate on your gadgets but deflect feedback on yourself with a joke. The upgrade you keep postponing is the conversation where you say what you actually feel.',
      kindred: ['spiderman', 'batman'],
    },
    cap: {
      name: 'Captain America',
      emoji: '⭐',
      color: 'from-sky-100 to-blue-50',
      accent: 'text-sky-700',
      tagline: '#MoralCompass #TeamFirst #StandsAloneIfNeeded',
      description:
        'You are the person others check themselves against — not because you preach, but because you simply do the right thing with unnerving consistency, especially when it is unpopular. You believe in people, in keeping your word, and in getting back up, and you would rather lose honestly than win crooked. Teams work near you because you make everyone believe the plan can hold.',
      strengths: ['Unbending integrity', 'Brings out people\'s best', 'Steady in any storm', 'Leads from the front'],
      growth: 'Your certainty is a gift, but it can shade into stubbornness once you have planted your flag. Being persuadable on the details is not a compromise of your principles.',
      kindred: ['superman', 'wonderwoman'],
    },
    blackpanther: {
      name: 'Black Panther',
      emoji: '🐆',
      color: 'from-purple-100 to-violet-50',
      accent: 'text-purple-700',
      tagline: '#ComposedPower #LegacyMinded #StrategicHeart',
      description:
        'You move through the world with a composure that makes people straighten up a little when you enter. You honor where you come from without being trapped by it, weigh decisions like someone who knows others will live inside them, and prefer one precise, well-timed action over ten loud ones. Your circle is small and chosen with care — and for them, and for your community, there is nothing you would not do.',
      strengths: ['Regal calm', 'Thinks in generations', 'Precise, decisive action', 'Duty woven with heart'],
      growth: 'You absorb pressure silently because showing strain feels like failing the people counting on you. Sharing the weight is not weakness — it is how legacies outlast one set of shoulders.',
      kindred: ['batman', 'wonderwoman'],
    },
    hulk: {
      name: 'Hulk',
      emoji: '💚',
      color: 'from-green-100 to-lime-50',
      accent: 'text-green-700',
      tagline: '#BigFeelings #BiggerHeart #StrongestWhenWhole',
      description:
        'You contain multitudes: a thoughtful, brilliant inner life and feelings powerful enough to move furniture. People who only see one side of you always underestimate the other. Your journey is not about suppressing what you feel — it is about ending the war between your halves, because the day your intellect and your intensity start working together, nothing on the planet can stop you.',
      strengths: ['Deep thinking under the surface', 'Honest, unfiltered emotions', 'Enormous strength when it matters', 'Endures what would break others'],
      growth: 'You treat your intensity as a problem to hide rather than a power to steer. Naming feelings early — while they are still words — keeps them from becoming weather.',
      kindred: ['spiderman', 'superman'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'It\'s day one of a big, intimidating project. How do you start?',
      options: [
        { label: 'Show up early, do the unglamorous groundwork, and set a steady tone for everyone', points: { superman: 2, cap: 1 } },
        { label: 'Research everything that could possibly go wrong before I take a single step', points: { batman: 2, blackpanther: 1 } },
        { label: 'Build a rough version immediately — I learn by making, breaking, and remaking', points: { ironman: 2, spiderman: 1 } },
        { label: 'Feel wildly underqualified, panic briefly, then figure it out faster than anyone expected', points: { spiderman: 2, hulk: 1 } },
      ],
    },
    {
      id: 2,
      text: 'A friend comes to you upset about being badly wronged. You…',
      options: [
        { label: 'Get the full truth first — then stand beside them and set it right, out loud', points: { wonderwoman: 2, cap: 1 } },
        { label: 'Remind them exactly who they are, then back them for as long as it takes', points: { cap: 2, superman: 1 } },
        { label: 'Stay measured, quietly verify both sides, then act with precision instead of heat', points: { blackpanther: 2, batman: 1 } },
        { label: 'Feel it with them at full volume — their anger is my anger, no doubts about whose side I\'m on', points: { hulk: 2, spiderman: 1 } },
      ],
    },
    {
      id: 3,
      text: 'You fail publicly at something you care about. Honest reaction?',
      options: [
        { label: 'Disappear into work until I\'ve closed every gap that failure exposed', points: { batman: 2, blackpanther: 1 } },
        { label: 'Joke about it in public, then obsess over version two until it\'s undeniable', points: { ironman: 2 } },
        { label: 'Own it plainly, apologize where it\'s due, and get back to work without drama', points: { superman: 2, wonderwoman: 1 } },
        { label: 'It hits hard — big feelings first, then a comeback nobody saw coming', points: { hulk: 2, spiderman: 1 } },
      ],
    },
    {
      id: 4,
      text: 'Your week is completely overloaded. How do you cope?',
      options: [
        { label: 'Sprint between commitments, apologize for being late, somehow keep every promise anyway', points: { spiderman: 2, ironman: 1 } },
        { label: 'Write an honest priority list and do the hardest right thing first', points: { cap: 2, superman: 1 } },
        { label: 'Cut what doesn\'t matter without guilt — clarity is a kindness to everyone', points: { wonderwoman: 2, hulk: 1 } },
        { label: 'Delegate to people I trust and protect my thinking time — nobody wins alone', points: { blackpanther: 2, batman: 1 } },
      ],
    },
    {
      id: 5,
      text: 'What do people most underestimate about you?',
      options: [
        { label: 'How much I\'m holding back — I keep my full strength gentle on purpose', points: { superman: 2, cap: 1 } },
        { label: 'How much heart is hiding underneath the confidence and the one-liners', points: { ironman: 2, spiderman: 1 } },
        { label: 'How thoughtful I am — people see the big reactions and miss the deep thinking underneath', points: { hulk: 2 } },
        { label: 'How much I notice. I\'m quiet in the corner because I\'m reading the entire room', points: { batman: 2, blackpanther: 1 } },
      ],
    },
    {
      id: 6,
      text: 'In a group project, you are inevitably the one who…',
      options: [
        { label: 'Keeps the team honest — deadlines, promises, and morale', points: { cap: 2, superman: 1 } },
        { label: 'Lightens the mood while quietly carrying more than their share', points: { spiderman: 2, hulk: 1 } },
        { label: 'Steps back, sees the whole system, then makes one decisive call at the right moment', points: { blackpanther: 2, batman: 1 } },
        { label: 'Says the uncomfortable truth everyone is dancing around — kindly, but clearly', points: { wonderwoman: 2, cap: 1 } },
      ],
    },
    {
      id: 7,
      text: 'It\'s midnight. Where are you, realistically?',
      options: [
        { label: 'Decompressing alone after a day of holding it together for everybody else', points: { hulk: 2, spiderman: 1 } },
        { label: 'Wide awake and deep in a project — night is when my brain works best', points: { batman: 2, ironman: 1 } },
        { label: 'Asleep. I protect my routine because people are counting on me tomorrow', points: { superman: 2, cap: 1 } },
        { label: 'Down a rabbit hole of a new obsession I\'ll be an expert in by Thursday', points: { ironman: 2, spiderman: 1 } },
      ],
    },
    {
      id: 8,
      text: 'You see a stranger being treated unfairly. You…',
      options: [
        { label: 'Step in directly and immediately — injustice in front of me is my business', points: { wonderwoman: 2, superman: 1 } },
        { label: 'Defuse it with humor first, but plant myself in the middle if it escalates', points: { spiderman: 2, hulk: 1 } },
        { label: 'Stand up calmly and refuse to move, even if I\'m standing alone', points: { cap: 2, wonderwoman: 1 } },
        { label: 'Handle it quietly and thoroughly — the loudest response isn\'t always the strongest', points: { blackpanther: 2, batman: 1 } },
      ],
    },
    {
      id: 9,
      text: 'What motivates you most deeply?',
      options: [
        { label: 'Being someone people can count on every single time, without being asked', points: { superman: 2, cap: 1 } },
        { label: 'Making peace with every part of myself — and turning what I once fought into strength', points: { hulk: 2 } },
        { label: 'The people in my corner of the world — if I can help, I don\'t get to look away', points: { spiderman: 2, superman: 1 } },
        { label: 'Leaving every place fairer than I found it', points: { wonderwoman: 2, blackpanther: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'Preparation is a promise you make to the people you protect', points: { batman: 2, blackpanther: 1 } },
        { label: 'Build the future instead of waiting for it — and iterate fast when you get it wrong', points: { ironman: 2, spiderman: 1 } },
        { label: 'Doing the right thing doesn\'t require permission, applause, or company', points: { cap: 2, superman: 1 } },
        { label: 'Honor the past, serve the present, and leave the door open to the future', points: { blackpanther: 2, wonderwoman: 1 } },
      ],
    },
  ],
};
