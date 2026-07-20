// Find Your Ikigai Direction — 'pick' mode.
// Which of the four ikigai circles pulls you strongest: what you love (passion),
// what the world needs (mission), what you're good at (craft), or what you can
// be paid for (pragmatist). Each option awards 2 pts to its primary circle,
// sometimes 1 pt to a secondary.

export default {
  key: 'ikigai',
  mode: 'pick',
  resultsHeading: 'Your ikigai circle pull',

  results: {
    passion: {
      name: 'The Passion Seeker',
      emoji: '❤️‍🔥',
      color: 'from-rose-100 to-pink-50',
      accent: 'text-rose-600',
      tagline: '#WhatYouLove #FollowTheSpark #FeelAlive',
      description:
        'Your compass needle points at joy. You can tell within a week whether work makes you feel alive or gray, and no salary or title has ever managed to bribe that feeling into changing its verdict. When you love something you lose track of time, talk about it unprompted, and do it on weekends for free. Your ikigai work starts from the circle of what you love — the challenge is building the other circles around that fire without smothering it.',
      strengths: ['Instantly knows what excites them', 'Contagious enthusiasm', 'Works hardest when no one is watching', 'Immune to hollow success'],
      growth: 'Passion tells you where to dig but not how to survive the digging. Borrow a little from the Pragmatist — a runway of savings or skills buys your passion the time it needs to become a livelihood.',
      kindred: ['craft', 'mission'],
    },
    mission: {
      name: 'The Mission Keeper',
      emoji: '🌍',
      color: 'from-emerald-100 to-teal-50',
      accent: 'text-emerald-600',
      tagline: '#WhatTheWorldNeeds #Purpose #LeaveItBetter',
      description:
        'Before you ask whether work is fun or lucrative, you ask a harder question: does it matter? You measure your days by who was helped, and busy-ness without impact leaves you strangely hollow no matter how impressive it looks. You are pulled hardest by the circle of what the world needs — the wrongs that nag at you are not noise, they are your assignment. Your ikigai lives where that sense of duty meets something you can sustain.',
      strengths: ['Unshakeable sense of purpose', 'Sees the people behind the problem', 'Keeps going when the cause is hard', 'Gives work meaning for others too'],
      growth: 'A mission without maintenance becomes martyrdom. You are allowed to be paid, rested, and even delighted while doing good — a burned-out helper helps no one for very long.',
      kindred: ['passion', 'craft'],
    },
    craft: {
      name: 'The Craft Master',
      emoji: '🛠️',
      color: 'from-sky-100 to-indigo-50',
      accent: 'text-sky-700',
      tagline: '#Mastery #OneMoreRep #SharpenTheSaw',
      description:
        'You are drawn to the deep end of skill. Where others want variety or applause, you want the next level — the harder problem, the cleaner technique, the version of your work that would impress the only judge you really answer to: your future self. You are pulled strongest by the circle of what you are good at, and getting better is its own reward. Your ikigai grows wherever excellence is noticed, needed, and never quite finished.',
      strengths: ['Relentless deliberate practice', 'Patience for the long climb', 'Standards that pull others up', 'Quiet, earned confidence'],
      growth: 'Mastery can become a comfortable hiding place — always sharpening, rarely shipping. Point your skill at something the world is actually waiting for, before the tenth polish nobody asked for.',
      kindred: ['pragmatist', 'passion'],
    },
    pragmatist: {
      name: 'The Pragmatist',
      emoji: '💼',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#SolidGround #FreedomFund #BuiltToLast',
      description:
        'You understand something the dreamers around you often learn too late: security is not the opposite of a meaningful life, it is the foundation under one. You instinctively run the numbers — time, money, risk, payoff — and you build careful ground beneath the people you love. You are pulled strongest by the circle of what you can be paid for, and there is real wisdom in that. Your ikigai emerges when the stable base you have built finally gets asked what it was all for.',
      strengths: ['Clear-eyed about tradeoffs', 'Builds durable security', 'Reliable when stakes are real', 'Turns plans into paychecks'],
      growth: 'Keep asking the question your spreadsheets cannot answer: secure for the sake of what? Schedule small, low-stakes bets on things you merely love — the foundation is finished enough to build something on it.',
      kindred: ['craft', 'mission'],
    },
  },

  questions: [
    {
      id: 1,
      text: "It's late on a weeknight and you're still happily awake working on something. What is it?",
      options: [
        { label: 'Something I love so much I lost track of time — the doing is the reward', points: { passion: 2 } },
        { label: 'Something that could genuinely help people who are struggling', points: { mission: 2 } },
        { label: "Practicing my craft — one more iteration until it's truly excellent", points: { craft: 2 } },
        { label: 'A side project with real earning potential that could open doors', points: { pragmatist: 2 } },
      ],
    },
    {
      id: 2,
      text: 'A benefactor funds a completely free year of your life. How do you spend it?',
      options: [
        { label: "Finally chasing the thing I've always loved but never had time for", points: { passion: 2 } },
        { label: 'Volunteering or building something for a cause I deeply believe in', points: { mission: 2 } },
        { label: 'Apprenticing under a master — a full year of deliberate practice', points: { craft: 2 } },
        { label: 'Building a foundation — qualifications, investments, a real safety net', points: { pragmatist: 2 } },
      ],
    },
    {
      id: 3,
      text: 'A new project lands in front of you. What is the first question you actually ask?',
      options: [
        { label: 'Does it light me up? If I feel nothing, the answer is no', points: { passion: 2 } },
        { label: 'Who does it help? I ask that before I ask anything else', points: { mission: 2 } },
        { label: 'Will it stretch me? I pick whatever makes me better at my craft', points: { craft: 2 } },
        { label: 'Do the numbers work? Time in versus value out has to add up', points: { pragmatist: 2 } },
      ],
    },
    {
      id: 4,
      text: 'Which compliment lands the deepest?',
      options: [
        { label: '"Your enthusiasm is contagious — anyone can see you love this"', points: { passion: 2 } },
        { label: '"What you did actually changed things for people"', points: { mission: 2, passion: 1 } },
        { label: '"That is the best work I have ever seen anyone do on this"', points: { craft: 2 } },
        { label: '"You have built something solid — your people will never have to worry"', points: { pragmatist: 2 } },
      ],
    },
    {
      id: 5,
      text: 'A day feels wasted when…',
      options: [
        { label: 'I did everything I was supposed to do and felt absolutely nothing', points: { passion: 2 } },
        { label: 'I was busy from morning to night but helped no one', points: { mission: 2 } },
        { label: "I didn't get even slightly better at anything", points: { craft: 2 } },
        { label: 'I have nothing to show for it — no progress banked, no ground gained', points: { pragmatist: 2, craft: 1 } },
      ],
    },
    {
      id: 6,
      text: "You're scanning a job posting. Which line makes you actually sit up?",
      options: [
        { label: '"You will spend your days on the thing you already can\'t stop thinking about"', points: { passion: 2 } },
        { label: '"Your work will directly improve people\'s lives"', points: { mission: 2 } },
        { label: '"You will learn from the very best people in the field"', points: { craft: 2 } },
        { label: '"Top-of-market pay, equity, and long-term stability"', points: { pragmatist: 2 } },
      ],
    },
    {
      id: 7,
      text: 'What would actually make you quit a perfectly decent job?',
      options: [
        { label: 'Waking up dreading it — life is too short to feel gray forty hours a week', points: { passion: 2 } },
        { label: "Realizing the company's impact on the world is something I can't stand behind", points: { mission: 2 } },
        { label: 'Stagnating — no one left to learn from and no harder problems coming', points: { craft: 2 } },
        { label: 'Shaky ground — layoffs looming, or a better offer that truly secures my future', points: { pragmatist: 2 } },
      ],
    },
    {
      id: 8,
      text: 'Friends tend to come to you when they need…',
      options: [
        { label: 'A spark — I remind them what being excited about something feels like', points: { passion: 2 } },
        { label: 'A conscience — I help them find what actually matters in the mess', points: { mission: 2 } },
        { label: 'An expert — when I know a domain, I really know it', points: { craft: 2 } },
        { label: 'A realist — budgets, plans, and how to actually pull the thing off', points: { pragmatist: 2 } },
      ],
    },
    {
      id: 9,
      text: 'Your quiet fear about choosing the wrong path is…',
      options: [
        { label: 'Ending up impressively successful at something I never actually loved', points: { passion: 2 } },
        { label: 'Spending decades busy without leaving anything better behind', points: { mission: 2 } },
        { label: 'Never finding out how good I could have become', points: { craft: 2, passion: 1 } },
        { label: 'Betting everything on a dream and losing the ground under my feet', points: { pragmatist: 2 } },
      ],
    },
    {
      id: 10,
      text: 'Twenty years from now, the version of success that makes you smile is…',
      options: [
        { label: 'Still in love with my work — people say I light up when I talk about it', points: { passion: 2 } },
        { label: 'A body of work that left real people genuinely better off', points: { mission: 2 } },
        { label: 'Being the one others quietly call the master', points: { craft: 2 } },
        { label: 'Freedom bought and paid for — my family secure, my options wide open', points: { pragmatist: 2, mission: 1 } },
      ],
    },
  ],
};
