// Which NBA Legend Are You? — 'pick' mode quiz.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'nba',
  mode: 'pick',
  resultsHeading: 'Your legend match breakdown',

  results: {
    jordan: {
      name: 'Michael Jordan',
      emoji: '🐐',
      color: 'from-red-100 to-rose-50',
      accent: 'text-red-600',
      tagline: '#ClutchGene #WinnerMindset #RaiseTheBar',
      description:
        'You are wired for the moment everyone else dreads. When the stakes spike, your focus sharpens instead of scattering, and you genuinely want the ball — the responsibility, the pressure, all of it. You hold yourself to a standard most people find exhausting, and you quietly (or not so quietly) hold your team to it too. Losing is not a mood for you; it is homework.',
      strengths: ['Thrives under pressure', 'Sky-high personal standards', 'Turns slights into fuel', 'Closes what others start'],
      growth: 'Not everyone runs on the same competitive voltage you do. Learning to celebrate progress — yours and other people\'s — makes the wins sweeter and the team stronger.',
      kindred: ['kobe', 'lebron'],
    },
    lebron: {
      name: 'LeBron James',
      emoji: '👑',
      color: 'from-violet-100 to-purple-50',
      accent: 'text-violet-600',
      tagline: '#EmpireBuilder #ElevateEveryone #LongGame',
      description:
        'You are the rare person who is both the most capable one in the room and the most invested in making everyone else better. You see the whole board — who needs a confidence boost, which teammate is about to break out, where the group is headed three years from now. You build things bigger than yourself and think in decades, not quarters. People follow you because you make their goals feel like shared ones.',
      strengths: ['Makes everyone around him better', 'Thinks in decades', 'Carries big responsibility gracefully', 'Reinvents himself to stay great'],
      growth: 'You take on so much — the plan, the people, the legacy — that you rarely let anyone carry you. Delegating is not lowering your standard; it is multiplying it.',
      kindred: ['magic', 'jordan'],
    },
    curry: {
      name: 'Stephen Curry',
      emoji: '🎯',
      color: 'from-blue-100 to-yellow-50',
      accent: 'text-blue-600',
      tagline: '#JoyfulGreatness #Underestimated #ChangeTheGame',
      description:
        'People underestimated you once, and instead of getting bitter you got creative. You do impossible-looking things with a grin, and your secret is that the joy is real — you would practice this stuff for free. You would rather change how the game is played than win the old way, and you make excellence look so fun that everyone around you starts believing they can do it too.',
      strengths: ['Joy that lifts the whole room', 'Reinvents the rules', 'Humble under the spotlight', 'Deep, unglamorous practice habits'],
      growth: 'Your easygoing shine can hide how hard you actually work, so people call you lucky. Let them see the reps sometimes — your process is as inspiring as your highlights.',
      kindred: ['magic', 'duncan'],
    },
    kobe: {
      name: 'Kobe Bryant',
      emoji: '🐍',
      color: 'from-purple-100 to-amber-50',
      accent: 'text-purple-600',
      tagline: '#CraftObsessed #FirstOneIn #DetailIsEverything',
      description:
        'You are in love with the process itself — the early mornings, the extra rep, the tiny detail nobody else even notices. Where others see grind, you see devotion to a craft, and you study the best in every field just to steal one more idea. You demand a lot from yourself first and everyone else second, and the people who match your intensity earn a loyalty that never expires.',
      strengths: ['Relentless work ethic', 'Obsessive attention to detail', 'Studies greatness everywhere', 'Total commitment to the craft'],
      growth: 'The standard you hold yourself to can shade into never feeling finished. Mastery includes knowing when a thing — or a day — is allowed to be done.',
      kindred: ['jordan', 'duncan'],
    },
    magic: {
      name: 'Magic Johnson',
      emoji: '✨',
      color: 'from-yellow-100 to-amber-50',
      accent: 'text-amber-600',
      tagline: '#Showtime #MakeItFun #EveryoneEats',
      description:
        'Your superpower is making other people shine and enjoying it more than your own spotlight. You walk into a room and the temperature rises — meetings get livelier, plans get bolder, strangers become collaborators. You have a genius for seeing the pass nobody else sees: the connection, the introduction, the opportunity that turns a good group into an unforgettable one. And you do it all smiling.',
      strengths: ['Contagious enthusiasm', 'Sees connections nobody else does', 'Makes teamwork feel like a party', 'Builds beyond the game'],
      growth: 'You are so good at keeping the energy up that you sometimes perform positivity when you actually need support. The people who love your shine can handle your shadows too.',
      kindred: ['curry', 'shaq'],
    },
    duncan: {
      name: 'Tim Duncan',
      emoji: '🗿',
      color: 'from-slate-100 to-gray-50',
      accent: 'text-slate-600',
      tagline: '#QuietExcellence #Fundamentals #NoDrama',
      description:
        'You are the steadiest person anyone knows, and you like it that way. No theatrics, no headlines — just showing up, doing the fundamentals flawlessly, and letting two decades of consistency speak for itself. You lead by making everyone around you calmer and more prepared, and you would rather be respected by the people in the room than famous to the people outside it.',
      strengths: ['Unshakeable consistency', 'Mastery of the fundamentals', 'Ego-free leadership', 'Calms every room he enters'],
      growth: 'Your allergy to the spotlight means your best work often gets credited to the group. It is okay to stand next to the thing you built and say, "I made that."',
      kindred: ['kobe', 'curry'],
    },
    shaq: {
      name: 'Shaquille O\'Neal',
      emoji: '🌋',
      color: 'from-orange-100 to-amber-50',
      accent: 'text-orange-600',
      tagline: '#LargerThanLife #DominantAndDelightful #BigHeart',
      description:
        'You are impossible to ignore and impossible not to love. You bring overwhelming force to the things you care about and pure comedy to everything else — the rare person who can dominate a project by day and have the whole group crying with laughter by night. Your generosity runs as big as your personality: when you win, everybody around you wins too.',
      strengths: ['Unstoppable when locked in', 'Disarms tension with humor', 'Radical generosity', 'Never takes himself too seriously'],
      growth: 'The big playful energy is a gift, but coasting on natural talent is your quiet temptation. When you pair the charm with full effort, you are genuinely untouchable.',
      kindred: ['magic', 'iverson'],
    },
    iverson: {
      name: 'Allen Iverson',
      emoji: '💥',
      color: 'from-sky-100 to-indigo-50',
      accent: 'text-sky-700',
      tagline: '#HeartOverHeight #BeYourself #FearNoGiant',
      description:
        'Nobody has ever successfully told you who to be. You do things your own way, in your own style, and you would rather lose as yourself than win as a copy of someone else. You are smaller than the challenge in front of you basically every day of your life, and you attack it anyway — that fearlessness gives everyone watching permission to be braver. Your loyalty to your people and your roots is absolute.',
      strengths: ['Fearless against bigger odds', 'Unapologetically original', 'Fierce loyalty to his people', 'Plays with all heart, all the time'],
      growth: 'Doing everything your own way can turn help into a threat. Letting a coach — a mentor, a friend — into the process does not make the story any less yours.',
      kindred: ['shaq', 'jordan'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'It\'s crunch time — the big deadline is tomorrow and the project is behind. What\'s your move?',
      options: [
        { label: 'Take over. This is exactly the moment I\'ve been waiting for', points: { jordan: 2, kobe: 1 } },
        { label: 'No panic — I\'ve been quietly ahead of schedule the whole time', points: { duncan: 2, kobe: 1 } },
        { label: 'Rally the room — crank the music, split the work, make it a heist movie', points: { magic: 2, curry: 1 } },
        { label: 'Crack a joke to cut the tension, then bulldoze my part in one huge push', points: { shaq: 2, iverson: 1 } },
      ],
    },
    {
      id: 2,
      text: 'How do your friends describe you when you\'re not in the room?',
      options: [
        { label: '"Somehow great at everything and still the most fun person here"', points: { curry: 2, magic: 1 } },
        { label: '"Obsessed. In the best way. They do not do anything halfway"', points: { kobe: 2, jordan: 1 } },
        { label: '"The one who organizes everything and checks in on everybody"', points: { lebron: 2, magic: 1 } },
        { label: '"One hundred percent themselves, every minute of every day"', points: { iverson: 2, shaq: 1 } },
      ],
    },
    {
      id: 3,
      text: 'Pick your ideal Saturday:',
      options: [
        { label: 'Big group cookout — I\'m on grill duty, DJ duty, and comedy duty', points: { shaq: 2, magic: 1 } },
        { label: 'Up at dawn to work on my thing before anyone else is even awake', points: { kobe: 2, jordan: 1 } },
        { label: 'Golf, games, goofing off with family — playful competition all day', points: { curry: 2, shaq: 1 } },
        { label: 'Quiet day at home with my hobbies. No plans is the plan', points: { duncan: 2, iverson: 1 } },
      ],
    },
    {
      id: 4,
      text: 'You just pulled off a huge win. What does your celebration look like?',
      options: [
        { label: 'Grinning ear to ear and hugging everyone — this is a group victory', points: { magic: 2, curry: 1 } },
        { label: 'A quiet nod. I expected this. On to the next one', points: { jordan: 2, duncan: 1 } },
        { label: 'Sharing the credit publicly and already planning what it unlocks next', points: { lebron: 2, magic: 1 } },
        { label: 'Celebrating loud and proud with my day-one crew, exactly my way', points: { iverson: 2, shaq: 1 } },
      ],
    },
    {
      id: 5,
      text: 'In any group project, you inevitably end up as…',
      options: [
        { label: 'The organizer — I see everyone\'s strengths and build the plan around them', points: { lebron: 2, magic: 1 } },
        { label: 'The rock — my part is done early, correctly, and without fuss', points: { duncan: 2, kobe: 1 } },
        { label: 'The spark — I keep morale high and somehow recruit extra help', points: { magic: 2, curry: 1 } },
        { label: 'The perfectionist — I redo my section at 2am because it wasn\'t quite right', points: { kobe: 2, jordan: 1 } },
      ],
    },
    {
      id: 6,
      text: 'Someone new shows up and outshines you at the thing you\'re known for. Honest reaction?',
      options: [
        { label: 'Say nothing, train harder, and make sure it never happens twice', points: { jordan: 2, kobe: 1 } },
        { label: 'Respect it — and go right back at them with zero fear', points: { iverson: 2, jordan: 1 } },
        { label: 'Get genuinely excited — a worthy rival makes this way more fun', points: { curry: 2, magic: 1 } },
        { label: 'Laugh, befriend them, and remind everyone there\'s only one me', points: { shaq: 2, iverson: 1 } },
      ],
    },
    {
      id: 7,
      text: 'At a party where you only know one person, you…',
      options: [
        { label: 'Know everyone\'s name within the hour — and they all remember mine', points: { magic: 2, lebron: 1 } },
        { label: 'Become the entertainment — stories, bits, impressions, the works', points: { shaq: 2, magic: 1 } },
        { label: 'Stay planted with my person — I don\'t perform for rooms', points: { iverson: 2, duncan: 1 } },
        { label: 'Start a silly game in the corner that slowly absorbs the whole party', points: { curry: 2, shaq: 1 } },
      ],
    },
    {
      id: 8,
      text: 'What actually gets you out of bed in the morning?',
      options: [
        { label: 'Winning. Being the best is not a goal, it\'s a requirement', points: { jordan: 2 } },
        { label: 'The craft itself — I want to be better at 40 than I was at 20', points: { kobe: 2, duncan: 1 } },
        { label: 'Building something my family and community are proud of', points: { lebron: 2, iverson: 1 } },
        { label: 'Doing my job so well, for so long, that the numbers speak for me', points: { duncan: 2, kobe: 1 } },
      ],
    },
    {
      id: 9,
      text: 'Your biggest flaw, if you\'re being honest:',
      options: [
        { label: 'I bristle at authority — don\'t tell me how to be me', points: { iverson: 2, shaq: 1 } },
        { label: 'I\'m so low-key that people forget to consider me for the big stuff', points: { duncan: 2 } },
        { label: 'I take wild swings that make everyone nervous before they work', points: { curry: 2, magic: 1 } },
        { label: 'I try to manage everything and everyone — it\'s hard to just be a passenger', points: { lebron: 2, jordan: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'I refuse to lose at anything, including board games', points: { jordan: 2, kobe: 2 } },
        { label: 'The job isn\'t finished until it\'s finished — details included', points: { kobe: 2, duncan: 1 } },
        { label: 'Make it excellent, but for the love of the game, make it fun', points: { magic: 2, curry: 1 } },
        { label: 'Be dominant, be kind, be impossible to forget', points: { shaq: 2, lebron: 1 } },
      ],
    },
  ],
};
