// Which Soccer Icon Are You? — 'pick' mode quiz.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'soccer',
  mode: 'pick',
  resultsHeading: 'Your icon match breakdown',

  results: {
    messi: {
      name: 'Lionel Messi',
      emoji: '🐐',
      color: 'from-sky-100 to-blue-50',
      accent: 'text-sky-600',
      tagline: '#QuietGenius #LetTheWorkTalk #SmallButMighty',
      description:
        'You are the quietest person in the room and somehow the one everyone watches. You don\'t announce, don\'t posture, don\'t campaign — you simply do the thing, again and again, at a level that eventually makes argument pointless. Your brilliance looks effortless, but it is really thousands of hours of touch and repetition wrapped in genuine humility. You save your words for the people who matter.',
      strengths: ['Lets results speak', 'Deep, unshowy mastery', 'Loyal to his people', 'Calm eye in any storm'],
      growth: 'Your instinct to shrink from the spotlight can leave your ideas unheard in rooms full of louder voices. Sometimes the group needs you to say the brilliant thing, not just do it.',
      kindred: ['modric', 'zidane'],
    },
    ronaldo: {
      name: 'Cristiano Ronaldo',
      emoji: '🚀',
      color: 'from-red-100 to-rose-50',
      accent: 'text-red-600',
      tagline: '#SelfMade #Discipline #BigStageEnergy',
      description:
        'You decided a long time ago exactly who you were going to become, and you have been out-working everyone toward it ever since. Your self-belief isn\'t arrogance — it is a contract you signed with yourself, backed by a training discipline most people can\'t fathom. You want the biggest stage, the hardest challenge, the final say, and you keep delivering deep into chapters where everyone predicted your decline.',
      strengths: ['Iron discipline', 'Unshakeable self-belief', 'Performs biggest on the biggest stage', 'Reinvents his game to stay elite'],
      growth: 'Measuring every day against greatness can make ordinary days feel like failures. Rest is part of the program — even machines get maintenance.',
      kindred: ['mbappe', 'zidane'],
    },
    ronaldinho: {
      name: 'Ronaldinho',
      emoji: '😁',
      color: 'from-yellow-100 to-green-50',
      accent: 'text-green-600',
      tagline: '#PlayWithJoy #Showstopper #MakeThemSmile',
      description:
        'You are proof that excellence and fun are not opposites — they are dance partners. You do your best work when you are playing, improvising, trying the outrageous thing just to see the look on everyone\'s face. People leave your company lighter than they arrived. Your creativity isn\'t decoration; it is how you solve problems no one else can, with a grin the whole way through.',
      strengths: ['Turns work into play', 'Fearless creativity', 'Lifts every room\'s mood', 'Improvises brilliance under pressure'],
      growth: 'Joy is your engine, but follow-through is the road. Pairing your magic with a little routine keeps the show running for decades instead of moments.',
      kindred: ['marta', 'mbappe'],
    },
    zidane: {
      name: 'Zinedine Zidane',
      emoji: '🎩',
      color: 'from-slate-100 to-blue-50',
      accent: 'text-slate-600',
      tagline: '#Elegance #CalmControl #ArtistAtWork',
      description:
        'You move through chaos like it is happening in slow motion. Where others rush, you glide; where others shout, you say one quiet sentence that settles everything. Your work has an elegance people describe as art — economical, precise, somehow inevitable. You lead without raising your voice, and the bigger the occasion, the calmer you get.',
      strengths: ['Grace under pressure', 'Quiet, commanding presence', 'Makes the difficult look effortless', 'Elevates the big occasion'],
      growth: 'You process so much internally that people close to you sometimes have to guess where you stand. Letting them into your thinking earlier saves everyone the guesswork.',
      kindred: ['messi', 'modric'],
    },
    mbappe: {
      name: 'Kylian Mbappé',
      emoji: '⚡',
      color: 'from-blue-100 to-indigo-50',
      accent: 'text-blue-600',
      tagline: '#FastForward #DreamBig #NoWaiting',
      description:
        'You have never once waited your turn. While others plan the future, you sprint into it — learning at double speed, taking on responsibilities people say you are too young for, and delivering anyway. You pair huge ambition with genuine poise, setting goals that sound absurd out loud and then quietly hitting them ahead of schedule. Speed isn\'t just how you move; it is how you think.',
      strengths: ['Learns at double speed', 'Composed beyond his years', 'Ambition with a deadline', 'Rises to moments others fear'],
      growth: 'Sprinting everywhere means occasionally arriving before you\'ve decided why you came. Slowing down for the big decisions makes the fast ones count more.',
      kindred: ['ronaldo', 'ronaldinho'],
    },
    modric: {
      name: 'Luka Modrić',
      emoji: '🧭',
      color: 'from-rose-100 to-slate-50',
      accent: 'text-rose-600',
      tagline: '#EngineRoom #Underrated #NeverStops',
      description:
        'You were told you were too small, too slight, too quiet for the top level — and you simply kept going until the doubters ran out of arguments. You are the engine other people\'s success secretly runs on: always available, always moving, always making the smart pass instead of the flashy one. Your greatness arrived later than the prodigies\' and will outlast most of them, because it was built, not gifted.',
      strengths: ['Tireless, selfless engine', 'Vision that serves the team', 'Proves doubters wrong quietly', 'Gets better with age'],
      growth: 'You have spent so long powering other people\'s highlights that asking for your own moment feels selfish. It isn\'t — the orchestra should hear its conductor sometimes.',
      kindred: ['messi', 'zidane'],
    },
    marta: {
      name: 'Marta',
      emoji: '🔥',
      color: 'from-emerald-100 to-yellow-50',
      accent: 'text-emerald-600',
      tagline: '#Trailblazer #PurePassion #ForTheNextGeneration',
      description:
        'You didn\'t find a path — you cut one, through terrain everyone said was closed to people like you. You play, work, and love with your whole chest, and that raw passion is exactly what makes your brilliance unforgettable. What drives you hardest isn\'t your own trophy shelf; it is making sure the door you forced open stays open for everyone coming behind you.',
      strengths: ['Blazes trails for others', 'Plays with full heart', 'Brilliance forged against the odds', 'Inspires the next generation'],
      growth: 'Carrying a cause and a career at once is heavy, and you rarely put either down. You are allowed to be great for your own joy some days, not just for the mission.',
      kindred: ['ronaldinho', 'rapinoe'],
    },
    rapinoe: {
      name: 'Megan Rapinoe',
      emoji: '🎤',
      color: 'from-fuchsia-100 to-purple-50',
      accent: 'text-fuchsia-600',
      tagline: '#BoldAsBrass #BigMoment #StandForSomething',
      description:
        'You show up loudest exactly when it is riskiest — the biggest stage, the tensest moment, the conversation everyone else is avoiding. You deliver under pressure with a showstopper\'s flair, then use the microphone that winning hands you to say the things that need saying. People always know where you stand, and that unapologetic clarity is precisely why they rally to you.',
      strengths: ['Ice-cold in decisive moments', 'Courage of her convictions', 'Style and substance together', 'Turns a platform into progress'],
      growth: 'Being the lightning rod is a choice you keep making for others\' sake, and it costs more than you admit. Even the boldest voice needs rooms where it can just rest.',
      kindred: ['marta', 'mbappe'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'You\'re handed a huge new project with everyone watching. How do you start?',
      options: [
        { label: 'Quietly. I skip the announcements and let the finished work make the noise', points: { messi: 2, modric: 1 } },
        { label: 'With a plan taped to my wall and a training-camp level routine', points: { ronaldo: 2, mbappe: 1 } },
        { label: 'By making it fun — if the team is smiling, the ideas will come', points: { ronaldinho: 2, marta: 1 } },
        { label: 'Calmly. I set the tempo and everyone else\'s panic evaporates', points: { zidane: 2, messi: 1 } },
      ],
    },
    {
      id: 2,
      text: 'How do your friends describe you when you\'re not in the room?',
      options: [
        { label: '"In a hurry, in a good way — they\'ll run the whole world by 30"', points: { mbappe: 2, ronaldo: 1 } },
        { label: '"The most underrated person we know. They never stop running for us"', points: { modric: 2, messi: 1 } },
        { label: '"Pure fire — they fight for everything and everyone they love"', points: { marta: 2, rapinoe: 1 } },
        { label: '"Fearless. They will say the thing nobody else will say"', points: { rapinoe: 2, marta: 1 } },
      ],
    },
    {
      id: 3,
      text: 'Pick your ideal Saturday:',
      options: [
        { label: 'A slow one at home with family and my oldest friends — no crowds', points: { messi: 2, zidane: 1 } },
        { label: 'Gym at seven, meal-prepped lunch, personal project all afternoon', points: { ronaldo: 2 } },
        { label: 'Something fast and new — day trip, new sport, spontaneous adventure', points: { mbappe: 2, ronaldinho: 1 } },
        { label: 'Pickup games in the park with whoever shows up, winners stay on', points: { marta: 2, ronaldinho: 1 } },
      ],
    },
    {
      id: 4,
      text: 'Someone important underestimates you to your face. What happens next?',
      options: [
        { label: 'I laugh, honestly. Then I enjoy every second of surprising them', points: { ronaldinho: 2, mbappe: 1 } },
        { label: 'Nothing visible. I respond with work so clean it ends the discussion', points: { zidane: 2, messi: 1 } },
        { label: 'I add them to the long list of doubters I\'m already outlasting', points: { modric: 2, marta: 1 } },
        { label: 'I tell them, out loud and on the record, exactly what I\'m about to do', points: { rapinoe: 2, ronaldo: 1 } },
      ],
    },
    {
      id: 5,
      text: 'In a group effort, you are inevitably the one who…',
      options: [
        { label: 'Produces the moment of magic nobody saw coming', points: { messi: 2, ronaldinho: 1 } },
        { label: 'Keeps spirits high when the plan falls apart', points: { ronaldinho: 2, marta: 1 } },
        { label: 'Does the unglamorous connecting work that makes everyone else look good', points: { modric: 2, zidane: 1 } },
        { label: 'Drags the whole thing over the line on pure will', points: { marta: 2, ronaldo: 1 } },
      ],
    },
    {
      id: 6,
      text: 'The pressure moment arrives — everything rides on the next five minutes. You feel…',
      options: [
        { label: 'Hungry. I\'ve trained my whole life for exactly this', points: { ronaldo: 2, mbappe: 1 } },
        { label: 'Still. Time slows down and I see everything clearly', points: { zidane: 2, messi: 1 } },
        { label: 'Fast. While everyone else tightens up, I accelerate', points: { mbappe: 2 } },
        { label: 'Electric — big moments are my favorite stage, and I want the mic', points: { rapinoe: 2, ronaldo: 1 } },
      ],
    },
    {
      id: 7,
      text: 'At the celebration after a big shared win, you are…',
      options: [
        { label: 'Smiling at the edge of it all, happiest watching my people celebrate', points: { messi: 2, modric: 1 } },
        { label: 'Leading the singing on top of a table', points: { mbappe: 2, ronaldinho: 1 } },
        { label: 'Enjoying one quiet glass, already gracefully home by eleven', points: { zidane: 2, messi: 1 } },
        { label: 'Dancing like the night is a final I intend to win', points: { marta: 2, rapinoe: 1 } },
      ],
    },
    {
      id: 8,
      text: 'What actually drives you, deep down?',
      options: [
        { label: 'Being undeniably the best — and proving it again every single year', points: { ronaldo: 2, mbappe: 1 } },
        { label: 'The pure joy of it. The day it stops being fun is the day I stop', points: { ronaldinho: 2, marta: 1 } },
        { label: 'Repaying everyone who believed in me when nobody else did', points: { modric: 2, messi: 1 } },
        { label: 'Leaving things fairer and better than I found them', points: { rapinoe: 2, marta: 1 } },
      ],
    },
    {
      id: 9,
      text: 'Your biggest flaw, if you\'re being honest:',
      options: [
        { label: 'I go so quiet that people can\'t tell what I\'m thinking or feeling', points: { messi: 2, zidane: 1 } },
        { label: 'I\'m brutally hard on myself — good enough never is', points: { ronaldo: 2 } },
        { label: 'Boring-but-necessary tasks quietly vanish from my to-do list', points: { ronaldinho: 2, mbappe: 1 } },
        { label: 'I keep everything inside until I\'ve already made the decision alone', points: { zidane: 2, messi: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'Dream absurdly big, then get there early', points: { mbappe: 2, ronaldo: 1 } },
        { label: 'Keep running when everyone doubts you — time tells the truth', points: { modric: 2, marta: 1 } },
        { label: 'Kick down the door, then hold it open for the people behind you', points: { marta: 2, rapinoe: 1 } },
        { label: 'Be exactly who you are, at full volume, especially when it\'s hard', points: { rapinoe: 2, ronaldinho: 1 } },
      ],
    },
  ],
};
