// Which Starter Pokémon Are You? — 'pick' mode quiz.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'pokemon',
  mode: 'pick',
  resultsHeading: 'Your starter match breakdown',

  results: {
    pikachu: {
      name: 'Pikachu',
      emoji: '⚡',
      color: 'from-yellow-100 to-amber-50',
      accent: 'text-amber-600',
      tagline: '#SparkPlug #RideOrDie #NoBoxCanHoldMe',
      description:
        'You are the friend people describe as "a lot, in the best way." Your energy walks into the room before you do, and your loyalty is the stuff of legend — once someone is your person, you would take a lightning bolt for them without blinking. You also refuse, politely but absolutely, to become whatever the standard path says you should become. You will grow, but only as yourself.',
      strengths: ['Boundless energy', 'Legendary loyalty', 'Instantly likeable', 'Unmistakably one of a kind'],
      growth: 'Being everyone\'s spark means your own battery drains quietly in the background. Charging alone sometimes isn\'t abandoning the team — it\'s how you keep the lights on.',
      kindred: ['eevee', 'squirtle'],
    },
    charmander: {
      name: 'Charmander',
      emoji: '🔥',
      color: 'from-orange-100 to-red-50',
      accent: 'text-orange-600',
      tagline: '#HeartOnFire #BigDreams #SlowBurnToGreatness',
      description:
        'You feel everything at full temperature — your enthusiasms are infernos, your loyalties are furnace-grade, and when you decide you want something, the wanting itself could power a city. People sometimes underestimate you early, not realizing they are talking to a future dragon. Your flame needs tending, sure, but it never, ever goes out.',
      strengths: ['Burning ambition', 'Wears its heart openly', 'Grows into something magnificent', 'Warms everyone nearby'],
      growth: 'Your feelings run hot enough to scorch when you\'re hurt or frustrated. Learning to bank the fire — not extinguish it — turns your intensity into pure fuel.',
      kindred: ['cyndaquil', 'pikachu'],
    },
    squirtle: {
      name: 'Squirtle',
      emoji: '💧',
      color: 'from-sky-100 to-blue-50',
      accent: 'text-sky-600',
      tagline: '#CoolUnderFire #SquadEnergy #MakeWavesHaveFun',
      description:
        'You are the coolest head in any crisis and the biggest personality at any party — a combination that makes you dangerously fun to be around. Trouble slides off your shell; where others spiral, you crack a joke, size up the situation, and handle it with style. You take your fun seriously and your problems lightly, and somehow both keep working out.',
      strengths: ['Unbothered under pressure', 'Natural squad leader', 'Playful problem-solver', 'Style in everything'],
      growth: 'The cool-kid shell is great armor, but armor works both ways. Letting people see you actually struggle now and then makes your friendships waterproof.',
      kindred: ['pikachu', 'eevee'],
    },
    bulbasaur: {
      name: 'Bulbasaur',
      emoji: '🌱',
      color: 'from-green-100 to-emerald-50',
      accent: 'text-green-600',
      tagline: '#SteadyGrowth #DependableRoots #QuietlyCarrying',
      description:
        'You are the dependable one — the friend who remembers the birthday, waters the plants, and shows up early with snacks when someone is moving apartments. You grow patiently and deliberately, unbothered by anyone else\'s timeline, and you make everyone around you feel calmer and more cared for. People pick flashier friends first sometimes; they learn.',
      strengths: ['Rock-solid dependability', 'Patient, steady growth', 'Nurtures everyone around it', 'Calm that spreads'],
      growth: 'You give care on tap and treat receiving it as an inconvenience to others. Letting your people tend to you for once is how the garden stays healthy.',
      kindred: ['squirtle', 'cyndaquil'],
    },
    eevee: {
      name: 'Eevee',
      emoji: '🦊',
      color: 'from-stone-100 to-amber-50',
      accent: 'text-stone-600',
      tagline: '#InfinitePotential #KeepMyOptionsOpen #CuriousAlways',
      description:
        'You contain multitudes, and you know it. While others locked in their one path years ago, you kept your options gloriously open — new skills, new scenes, new versions of yourself waiting to be tried on. You adapt to any environment faster than anyone you know, and your curiosity isn\'t indecision; it is respect for just how many things you could brilliantly become.',
      strengths: ['Adapts to anything', 'Endless curiosity', 'Many possible futures', 'Reinvents without fear'],
      growth: 'Keeping every door open can quietly become a way of never walking through one. Choosing a path doesn\'t erase your potential — it finally gives it somewhere to go.',
      kindred: ['pikachu', 'bulbasaur'],
    },
    cyndaquil: {
      name: 'Cyndaquil',
      emoji: '🌋',
      color: 'from-rose-100 to-orange-50',
      accent: 'text-rose-600',
      tagline: '#QuietFlame #GentleUntilItCounts #StillWatersBurn',
      description:
        'You are soft-spoken, a little shy, and routinely underestimated — right up until the moment something you love is threatened, at which point the flames on your back come roaring to life. You prefer cozy corners to center stage and listening to holding forth, but the people who know you best have seen the fire and treat you accordingly. Gentle is not the same as weak, and you are living proof.',
      strengths: ['Fierce when it matters', 'Gentle, careful listener', 'Loyal past all logic', 'Underestimated to opponents\' regret'],
      growth: 'You wait for near-emergencies to show your full flame. Letting a little of that fire out in ordinary moments — an opinion here, an ask there — means fewer eruptions later.',
      kindred: ['charmander', 'bulbasaur'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'It\'s 8am on a Monday. What does your energy honestly look like?',
      options: [
        { label: 'Fully charged and talking — I\'ve already texted three people good morning', points: { pikachu: 2, squirtle: 1 } },
        { label: 'Instantly intense — I woke up thinking about my big goal and I\'m already at it', points: { charmander: 2, pikachu: 1 } },
        { label: 'Smooth and unbothered — I cruise into the day at my own cool pace', points: { squirtle: 2, eevee: 1 } },
        { label: 'Quietly up early — plants watered, breakfast made, everything in order', points: { bulbasaur: 2, cyndaquil: 1 } },
      ],
    },
    {
      id: 2,
      text: 'A surprise opportunity lands in your lap, but it means big change. You…',
      options: [
        { label: 'Light up — a whole new version of my life to try on? Say less', points: { eevee: 2, pikachu: 1 } },
        { label: 'Feel terrified, think about it in private, and then quietly say yes', points: { cyndaquil: 2, bulbasaur: 1 } },
        { label: 'Say yes on the spot — my people can come with me, right?', points: { pikachu: 2, charmander: 1 } },
        { label: 'Say yes loudly — this is exactly the destiny-shaped thing I\'ve been waiting for', points: { charmander: 2, eevee: 1 } },
      ],
    },
    {
      id: 3,
      text: 'Your friend calls you upset at midnight. What\'s your move?',
      options: [
        { label: 'Crack the perfectly-timed joke that gets them laughing, then talk it out', points: { squirtle: 2, pikachu: 1 } },
        { label: 'Show up with tea and blankets and stay as long as it takes', points: { bulbasaur: 2, cyndaquil: 1 } },
        { label: 'Help them see all the paths out of this — there are always more options', points: { eevee: 2, squirtle: 1 } },
        { label: 'Listen quietly for an hour — but if someone hurt them, I am suddenly very awake', points: { cyndaquil: 2, charmander: 1 } },
      ],
    },
    {
      id: 4,
      text: 'Pick your ideal weekend:',
      options: [
        { label: 'Packed schedule with all my favorite people — brunch, games, adventure, repeat', points: { pikachu: 2, squirtle: 1 } },
        { label: 'Chasing the dream — my passion project gets my whole burning weekend', points: { charmander: 2 } },
        { label: 'Water, sun, music, zero worries — vacation mode wherever I am', points: { squirtle: 2, eevee: 1 } },
        { label: 'Garden, kitchen, cozy chores, one good friend for dinner', points: { bulbasaur: 2, cyndaquil: 1 } },
      ],
    },
    {
      id: 5,
      text: 'How do your friends describe you when you\'re not in the room?',
      options: [
        { label: '"Honestly, a different person every six months — and great at all of them"', points: { eevee: 2 } },
        { label: '"Shy until you know them. Then surprisingly, wonderfully fierce"', points: { cyndaquil: 2, bulbasaur: 1 } },
        { label: '"The most loyal, most energetic creature alive. There is only one of them"', points: { pikachu: 2, charmander: 1 } },
        { label: '"All heart. When they care about something, they REALLY care"', points: { charmander: 2, cyndaquil: 1 } },
      ],
    },
    {
      id: 6,
      text: 'Conflict breaks out in your group chat. What role do you play?',
      options: [
        { label: 'The defuser — one well-placed joke and everyone remembers we\'re friends', points: { squirtle: 2, pikachu: 1 } },
        { label: 'The peacemaker — I check on both sides privately and replant the friendship', points: { bulbasaur: 2, cyndaquil: 1 } },
        { label: 'The perspective-shifter — I can genuinely see every side, and I say so', points: { eevee: 2, bulbasaur: 1 } },
        { label: 'The quiet one — until someone crosses a line, and then everyone goes very still', points: { cyndaquil: 2, charmander: 1 } },
      ],
    },
    {
      id: 7,
      text: 'In a group project, you are inevitably the one who…',
      options: [
        { label: 'Keeps the group chat alive and everyone\'s spirits charged', points: { pikachu: 2, squirtle: 1 } },
        { label: 'Cares the most, visibly, by a wide margin', points: { charmander: 2, cyndaquil: 1 } },
        { label: 'Stays cool at the deadline and carries the presentation with pure confidence', points: { squirtle: 2, eevee: 1 } },
        { label: 'Quietly does the foundational work everything else grows from', points: { bulbasaur: 2, cyndaquil: 1 } },
      ],
    },
    {
      id: 8,
      text: 'Your biggest flaw, if you\'re being honest:',
      options: [
        { label: 'Commitment. Why would I pick one path when I could keep evolving?', points: { eevee: 2, squirtle: 1 } },
        { label: 'I hide my real opinions until they burst out all at once', points: { cyndaquil: 2, bulbasaur: 1 } },
        { label: 'I run at full voltage until I abruptly, completely crash', points: { pikachu: 2, charmander: 1 } },
        { label: 'I take everything personally — my heart has no shell', points: { charmander: 2, pikachu: 1 } },
      ],
    },
    {
      id: 9,
      text: 'What actually recharges you after a brutal week?',
      options: [
        { label: 'Water in any form — long shower, pool day, rain on the window', points: { squirtle: 2, eevee: 1 } },
        { label: 'Slow rituals — cooking something from scratch, tending my little garden', points: { bulbasaur: 2, cyndaquil: 1 } },
        { label: 'Novelty — a new hobby, a new playlist, a new me by Monday', points: { eevee: 2, pikachu: 1 } },
        { label: 'A warm blanket, a closed door, and blessed, total quiet', points: { cyndaquil: 2, bulbasaur: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'Stay true to exactly who you are — evolution is optional', points: { pikachu: 2, eevee: 1 } },
        { label: 'Keep your flame lit through the rain — small spark now, dragon later', points: { charmander: 2, cyndaquil: 1 } },
        { label: 'Stay cool, have fun, and let trouble roll off your shell', points: { squirtle: 2, pikachu: 1 } },
        { label: 'Grow slow, root deep, and carry your people with you', points: { bulbasaur: 2, eevee: 1 } },
      ],
    },
  ],
};
