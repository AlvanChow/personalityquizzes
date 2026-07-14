// Which One Piece Pirate Are You? — 'pick' mode quiz.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'onepiece',
  mode: 'pick',
  resultsHeading: 'Your crew match breakdown',

  results: {
    luffy: {
      name: 'Monkey D. Luffy',
      emoji: '🍖',
      color: 'from-red-100 to-orange-50',
      accent: 'text-red-600',
      tagline: '#BornFree #CaptainEnergy #AllHeart',
      description:
        'You move through life on instinct and appetite, and somehow it keeps working out. Rules that make no sense get ignored, strangers become lifelong friends within an hour, and impossible odds mostly just make you grin wider. People follow you not because you demand it, but because being near you makes them braver than they thought they could be.',
      strengths: ['Fearless optimism', 'Magnetic leadership', 'Unconditional loyalty', 'Bounces back from anything'],
      growth: 'Your gut is brilliant, but it is not a substitute for reading the fine print. Slowing down for five minutes of planning would spare your friends a lot of frantic rescues.',
      kindred: ['zoro', 'usopp'],
    },
    zoro: {
      name: 'Roronoa Zoro',
      emoji: '⚔️',
      color: 'from-green-100 to-emerald-50',
      accent: 'text-green-700',
      tagline: '#Discipline #NoExcuses #QuietStorm',
      description:
        'You picked your mountain a long time ago and you have been climbing it every single day since. You do not talk about the grind; you just do the reps while other people are still debating whether to start. Your loyalty is granite — you rarely say the warm thing out loud, but you would take the hit meant for a friend without a second of hesitation.',
      strengths: ['Iron discipline', 'Unbreakable word', 'Calm in chaos', 'Trains while others sleep'],
      growth: 'Not every problem yields to more effort, and asking for directions — literally or figuratively — is not defeat. Let people contribute before you carry the whole thing alone.',
      kindred: ['luffy', 'robin'],
    },
    nami: {
      name: 'Nami',
      emoji: '🍊',
      color: 'from-orange-100 to-amber-50',
      accent: 'text-orange-600',
      tagline: '#SharpMind #ChartTheCourse #SecretSoftie',
      description:
        'You are the one who actually knows where the group is going, how much it will cost, and what could go wrong at every step. People tease you about being pragmatic — right up until your planning saves everyone. Beneath the sharp negotiating and the eye-rolls at reckless friends is someone who cares so much it occasionally embarrasses you.',
      strengths: ['Strategic planning', 'Reads situations instantly', 'Resourceful under pressure', 'Fierce about her people'],
      growth: 'You brace for the worst so you are never caught off guard, but the people around you have earned more trust than you extend. Letting them carry some of the worry is allowed.',
      kindred: ['robin', 'sanji'],
    },
    usopp: {
      name: 'Usopp',
      emoji: '🎯',
      color: 'from-yellow-100 to-lime-50',
      accent: 'text-yellow-700',
      tagline: '#BraveCoward #Inventor #Storyteller',
      description:
        'You are honest about your fear — and that is exactly what makes your courage real. You embellish stories, invent gadgets nobody asked for, and make everyone laugh when morale is at rock bottom. Then, when it truly counts and your knees are shaking, you plant your feet and take the shot anyway. That is a rarer kind of brave than the fearless kind.',
      strengths: ['Creative problem-solving', 'Courage despite fear', 'Lifts group morale', 'Surprising precision under pressure'],
      growth: 'You narrate yourself as the sidekick in a story where you keep doing hero things. Update the script — the evidence is on your side.',
      kindred: ['luffy', 'chopper'],
    },
    sanji: {
      name: 'Sanji',
      emoji: '🍳',
      color: 'from-sky-100 to-blue-50',
      accent: 'text-sky-700',
      tagline: '#FeedThePeople #StyleAndSubstance #SoftHeartSharpSuit',
      description:
        'Your love language is taking care of people — usually through food, always with flair. You hold yourself to a personal code you never compromise, even when it costs you, and you would rather go hungry than watch someone else do without. The dramatics and the polish are real, but so is the steel underneath: cross someone you protect and you find it fast.',
      strengths: ['Nurtures everyone around him', 'Unshakeable personal code', 'Grace under fire', 'Notices what people need'],
      growth: 'You give lavishly and accept almost nothing in return, as if being cared for would cost you your role. It would not — let someone cook for you once in a while.',
      kindred: ['nami', 'chopper'],
    },
    chopper: {
      name: 'Tony Tony Chopper',
      emoji: '🩺',
      color: 'from-pink-100 to-rose-50',
      accent: 'text-pink-600',
      tagline: '#GentleHealer #BiggerThanYouThink #HeartFirst',
      description:
        'You lead with kindness in a world that does not always deserve it, and you refuse to let that change you. You are the one checking that everyone ate, slept, and is actually okay behind their brave face. People underestimate you because you are soft-spoken and easily flustered — then a real emergency hits and suddenly you are the calmest, most capable person in the room.',
      strengths: ['Deep compassion', 'Cool head in emergencies', 'Endlessly curious learner', 'Sees the person behind the mask'],
      growth: 'You deflect every compliment like it was fired at you. Practice saying "thank you, I worked hard on that" — because you did, and everyone knows it.',
      kindred: ['usopp', 'sanji'],
    },
    robin: {
      name: 'Nico Robin',
      emoji: '📚',
      color: 'from-violet-100 to-purple-50',
      accent: 'text-violet-600',
      tagline: '#QuietDepths #EndlessCuriosity #DarkHumor',
      description:
        'You are the calm, watchful one who has already read the room, the subtext, and probably three books on the subject. Your curiosity runs deep and a little dark — you will cheerfully mention the worst-case scenario everyone else was avoiding, then smile serenely. It took you time to trust that you belong somewhere, and now that you do, your devotion is quiet, absolute, and slightly terrifying.',
      strengths: ['Encyclopedic curiosity', 'Unflappable composure', 'Reads people and rooms', 'Loyal once trust is earned'],
      growth: 'Old habits tell you to keep an exit route from every relationship. You can retire the escape plans — these people are staying.',
      kindred: ['nami', 'zoro'],
    },
    franky: {
      name: 'Franky',
      emoji: '🔧',
      color: 'from-cyan-100 to-sky-50',
      accent: 'text-cyan-600',
      tagline: '#BuildItBigger #LoudHeart #EngineerOfDreams',
      description:
        'You are maximum volume, maximum heart, and maximum output. Where others see a broken thing, you see a weekend project; where others see a crazy dream, you start drawing blueprints. You cry openly at moving stories, hype up your friends like a one-person stadium, and back every ounce of that enthusiasm with genuine, hard-won skill.',
      strengths: ['Builds what others only imagine', 'Contagious enthusiasm', 'Openly big-hearted', 'Turns setbacks into upgrades'],
      growth: 'Not everything needs a bigger, louder, more spectacular version — sometimes people just need you to sit still and listen. Your presence is enough without the fireworks.',
      kindred: ['usopp', 'luffy'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'A friend proposes a totally unplanned weekend road trip, leaving in one hour. You…',
      options: [
        { label: 'Am already in the car. Destination? We\'ll figure it out on the way', points: { luffy: 2, usopp: 1 } },
        { label: 'Get intrigued and quietly start researching fascinating obscure stops', points: { robin: 2, nami: 1 } },
        { label: 'Say yes, then pack snacks and make sure nobody goes hungry out there', points: { sanji: 2, chopper: 1 } },
        { label: 'Ask for twenty minutes to check the car and rig up a proper sound system', points: { franky: 2, zoro: 1 } },
      ],
    },
    {
      id: 2,
      text: 'It\'s 2am and a friend calls you in a genuine crisis. What do they get?',
      options: [
        { label: 'No questions asked — I\'m already putting my shoes on', points: { zoro: 2, luffy: 1 } },
        { label: 'A calm voice and a practical plan: logistics, money, who to call, in what order', points: { nami: 2, robin: 1 } },
        { label: 'Morale support — I keep them talking and even laughing until it feels survivable', points: { usopp: 2, sanji: 1 } },
        { label: 'Full care mode: are they safe, fed, warm, and actually okay?', points: { chopper: 2 } },
      ],
    },
    {
      id: 3,
      text: 'The team\'s big project is falling apart the day before the deadline. Your move?',
      options: [
        { label: 'Rally everyone with loud, irrational, contagious confidence', points: { luffy: 2, franky: 1 } },
        { label: 'Put my head down and execute my part flawlessly — someone has to hold the line', points: { zoro: 2 } },
        { label: 'Re-plan ruthlessly: cut what can\'t be saved, reroute everyone to what can', points: { nami: 2, robin: 1 } },
        { label: 'Take care of the humans — coffee runs, pep talks, snack deliveries — so they can perform', points: { sanji: 2, chopper: 1 } },
      ],
    },
    {
      id: 4,
      text: 'What do your friends actually say about you when you\'re not around?',
      options: [
        { label: '"Best storyteller alive. Half of it is exaggerated, all of it is entertaining"', points: { usopp: 2, luffy: 1 } },
        { label: '"Calm, a little mysterious, and somehow knows something about everything"', points: { robin: 2, zoro: 1 } },
        { label: '"The sweetest person you\'ll ever meet — pretends compliments don\'t matter, visibly melts"', points: { chopper: 2, usopp: 1 } },
        { label: '"Huge energy, bigger heart — will drop everything to fix your shelf, your bike, or your life"', points: { franky: 2, sanji: 1 } },
      ],
    },
    {
      id: 5,
      text: 'Right before a big high-stakes moment — interview, performance, match — you feel…',
      options: [
        { label: 'Genuinely excited. Big moments are the whole point of being alive', points: { luffy: 2, franky: 1 } },
        { label: 'Locked in. I prepared for this; nerves are just background noise', points: { zoro: 2 } },
        { label: 'Fired up and a little theatrical — pressure brings out my flair', points: { sanji: 2, nami: 1 } },
        { label: 'Terrified, honestly — and I do it anyway, shaking the entire time', points: { chopper: 2, usopp: 1 } },
      ],
    },
    {
      id: 6,
      text: 'Pick your perfect Sunday:',
      options: [
        { label: 'Brunch with friends, then joyfully plotting my budget and my next big trip', points: { nami: 2, sanji: 1 } },
        { label: 'Tinkering on my hobby project and telling anyone who\'ll listen about my grand plans', points: { usopp: 2, franky: 1 } },
        { label: 'A quiet café, a thick book about something ancient, and nobody rushing me', points: { robin: 2 } },
        { label: 'Building something loud in the garage with friends — the messier, the better', points: { franky: 2, luffy: 1 } },
      ],
    },
    {
      id: 7,
      text: 'Someone is openly rude to a member of your friend group. You…',
      options: [
        { label: 'Am instantly and loudly in their face — nobody messes with my people', points: { luffy: 2, sanji: 1 } },
        { label: 'Deliver one icy stare and a quiet "want to repeat that?" It usually settles things', points: { zoro: 2 } },
        { label: 'Get my friend out of there, then spend the evening making sure they\'re okay', points: { chopper: 2, nami: 1 } },
        { label: 'Dismantle the rude person with one devastatingly calm, precise sentence', points: { robin: 2, usopp: 1 } },
      ],
    },
    {
      id: 8,
      text: 'Your desk or workspace is best described as…',
      options: [
        { label: 'Organized and optimized — labeled, budgeted, everything earning its place', points: { nami: 2, robin: 1 } },
        { label: 'Curated — the good pens, the good coffee, small touches of style everywhere', points: { sanji: 2 } },
        { label: 'A glorious chaos of half-finished inventions and parts I swear I\'ll use someday', points: { usopp: 2, franky: 1 } },
        { label: 'Heavy-duty and functional — built to take a beating and produce real work', points: { franky: 2, zoro: 1 } },
      ],
    },
    {
      id: 9,
      text: 'Which belief is closest to your personal philosophy?',
      options: [
        { label: 'Freedom is the whole point — a life spent meeting others\' expectations is no life at all', points: { luffy: 2, franky: 1 } },
        { label: 'A promise made is a debt owed. I\'d rather suffer than break my word', points: { zoro: 2, sanji: 1 } },
        { label: 'Dream big, but chart the course — hope is not a strategy', points: { nami: 2, robin: 1 } },
        { label: 'Courage isn\'t being fearless. It\'s being scared and showing up anyway', points: { usopp: 2, chopper: 1 } },
      ],
    },
    {
      id: 10,
      text: 'At a party, you are most reliably found…',
      options: [
        { label: 'Running the kitchen — nobody leaves my gathering hungry, and every plate looks incredible', points: { sanji: 2, nami: 1 } },
        { label: 'Wherever the pets and the shy people are — we\'ve formed our own cozy corner', points: { chopper: 2, luffy: 1 } },
        { label: 'Deep in a one-on-one conversation in the quietest room, thoroughly content', points: { robin: 2, zoro: 1 } },
        { label: 'At the center of the dance floor, or fixing the host\'s speaker system — possibly both', points: { franky: 2, usopp: 1 } },
      ],
    },
  ],
};
