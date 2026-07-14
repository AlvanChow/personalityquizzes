// What's Your Work Style? (DISC) — 'pick' mode quiz inspired by the classic
// DISC framework: Dominance, Influence, Steadiness, Conscientiousness.
// Workplace scenarios, warm second-person reflection.

export default {
  key: 'disc',
  mode: 'pick',
  resultsHeading: 'Your work style breakdown',

  results: {
    driver: {
      name: 'The Driver',
      emoji: '🚀',
      color: 'from-red-100 to-orange-50',
      accent: 'text-red-600',
      tagline: '#MakeItHappen #DecisionsNow #ResultsTalk',
      description:
        'You are built for momentum. While others are still describing the problem, you\'re already testing the first solution — and you\'d rather make a good call today than a perfect one next quarter. Obstacles read to you as puzzles with attitude, and ownership isn\'t a burden, it\'s oxygen. Teams lean on you when the stakes are high and the clock is loud, because you turn ambiguity into a decision and a decision into motion.',
      strengths: ['Decisive under pressure', 'Turns goals into action fast', 'Comfortable owning the outcome', 'Direct, no-guesswork communication'],
      growth: 'Your pace can read as impatience to people who process differently — and their slower "why" questions often catch the thing your speed would have missed. Pausing to bring people along isn\'t friction; it\'s how your wins get bigger.',
      kindred: ['analyst', 'influencer'],
    },
    influencer: {
      name: 'The Influencer',
      emoji: '✨',
      color: 'from-yellow-100 to-amber-50',
      accent: 'text-amber-600',
      tagline: '#EnergyBringer #PeopleFirst #BigIdeas',
      description:
        'You work through connection. Ideas come alive when you talk about them, meetings get lighter when you walk in, and half your best work happens in the conversations other people would call detours. You spot possibilities early, get genuinely excited about them, and — crucially — get other people excited too. Where some see a room of colleagues, you see relationships waiting to happen, and that web of goodwill you build ends up carrying projects further than any process could.',
      strengths: ['Rallies people around an idea', 'Builds relationships everywhere', 'Optimistic and creatively quick', 'Communicates with natural warmth'],
      growth: 'The spark of a new idea will always be more fun than the follow-through — but your influence multiplies when people learn your enthusiasm comes with delivery. A little structure isn\'t a cage; it\'s a stage.',
      kindred: ['driver', 'steadier'],
    },
    steadier: {
      name: 'The Steadier',
      emoji: '🌿',
      color: 'from-green-100 to-emerald-50',
      accent: 'text-green-700',
      tagline: '#CalmInTheStorm #TeamGlue #QuietlyEssential',
      description:
        'You are the person teams quietly build themselves around. You listen more than you talk, follow through on what you promise, and notice when a teammate is struggling long before they say so. You don\'t need the spotlight — you need the work to be good and the people to be okay, in roughly that order reversed. When everything is chaos, your calm consistency is what everyone else calibrates against, whether they realize it or not.',
      strengths: ['Reliable, week in and week out', 'Listens deeply and mediates well', 'Loyal and supportive teammate', 'Keeps calm when everything wobbles'],
      growth: 'Your dislike of rocking the boat can mean your best ideas stay in your head and your workload quietly doubles. Speaking up early — about your opinions and your limits — is a gift to the team, not a disruption of it.',
      kindred: ['analyst', 'influencer'],
    },
    analyst: {
      name: 'The Analyst',
      emoji: '📐',
      color: 'from-indigo-100 to-blue-50',
      accent: 'text-indigo-600',
      tagline: '#MeasureTwice #ShowMeTheData #QualityIsLove',
      description:
        'You believe good work should be correct, not just convincing. You read the documentation nobody else reads, ask the question that exposes the flaw in slide four, and hold your own output to a standard higher than anyone would dare impose on you. Precision isn\'t pedantry to you — it\'s respect: for the problem, for the user, for the truth. When something absolutely cannot be wrong, you\'re the person everyone wants holding the pen.',
      strengths: ['Rigorous, evidence-based thinking', 'Catches what everyone else missed', 'High standards, consistently met', 'Plans for the failure modes'],
      growth: 'Perfect is a direction, not an address — sometimes shipped-and-learning beats polished-and-late. And remember that "this has a flaw" lands better when people also hear what\'s working.',
      kindred: ['driver', 'steadier'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'A big new project kicks off Monday. What\'s your first move?',
      options: [
        { label: 'Define the goal and start moving — momentum now, refinement later', points: { driver: 2 } },
        { label: 'Get everyone in a room and get them genuinely excited about it', points: { influencer: 2 } },
        { label: 'Check in with each teammate about roles and what support they\'ll need', points: { steadier: 2 } },
        { label: 'Map the requirements, risks, and dependencies before anything moves', points: { analyst: 2 } },
      ],
    },
    {
      id: 2,
      text: 'The team meeting has been going in circles for twenty minutes. You…',
      options: [
        { label: 'Cut in: "Okay, decision time. Here are our three options."', points: { driver: 2 } },
        { label: 'Break the tension with humor, then reframe the conversation with fresh energy', points: { influencer: 2 } },
        { label: 'Notice who hasn\'t spoken yet and gently invite them in', points: { steadier: 2 } },
        { label: 'Summarize the positions on the whiteboard so the debate finally has structure', points: { analyst: 2 } },
      ],
    },
    {
      id: 3,
      text: 'What kind of feedback actually lands with you?',
      options: [
        { label: 'Direct and fast — skip the cushioning, just tell me straight', points: { driver: 2 } },
        { label: 'Enthusiastic and personal — tell me what\'s working, then where to aim', points: { influencer: 2 } },
        { label: 'Kind and private, with reassurance that we\'re still good', points: { steadier: 2 } },
        { label: 'Specific and evidence-based — vague praise helps no one, including me', points: { analyst: 2 } },
      ],
    },
    {
      id: 4,
      text: 'A colleague drops a last-minute change on work you\'d carefully planned. You…',
      options: [
        { label: 'Adapt on the spot — the deadline\'s the deadline, let\'s keep moving', points: { driver: 2 } },
        { label: 'Roll with it cheerfully — change keeps things interesting anyway', points: { influencer: 2 } },
        { label: 'Feel rattled — I do my best work with stability — but adjust for the team', points: { steadier: 2 } },
        { label: 'Ask why. Late changes need a real rationale — and an updated plan', points: { analyst: 2 } },
      ],
    },
    {
      id: 5,
      text: 'Your dream role, honestly, would let you…',
      options: [
        { label: 'Own the outcome and make the big calls', points: { driver: 2 } },
        { label: 'Spend the day with people — pitching, connecting, energizing', points: { influencer: 2 } },
        { label: 'Be the dependable core of a close-knit team I trust', points: { steadier: 2 } },
        { label: 'Go deep on hard problems and get them precisely right', points: { analyst: 2 } },
      ],
    },
    {
      id: 6,
      text: 'Under a tight deadline, your teammates would say you become…',
      options: [
        { label: 'More decisive — pressure sharpens me', points: { driver: 2 } },
        { label: 'More vocal — someone has to keep morale alive, and it\'s me', points: { influencer: 2 } },
        { label: 'More focused — head down, steady output, a calming presence', points: { steadier: 2 } },
        { label: 'More careful — a deadline is no excuse for shipping errors', points: { analyst: 2 } },
      ],
    },
    {
      id: 7,
      text: 'What frustrates you most at work?',
      options: [
        { label: 'Slowness — meetings about meetings, decisions that never land', points: { driver: 2 } },
        { label: 'Rigid, joyless environments with no room for spontaneity', points: { influencer: 2 } },
        { label: 'Constant churn — priorities changing before anything gets finished', points: { steadier: 2 } },
        { label: 'Sloppiness — decisions made on vibes when the data was right there', points: { analyst: 2 } },
      ],
    },
    {
      id: 8,
      text: 'Two teammates are locked in a tense disagreement. Your instinct?',
      options: [
        { label: 'Address it head-on — name the real issue and push for a resolution', points: { driver: 2 } },
        { label: 'Lower the temperature — find the common ground and remind them they\'re friends', points: { influencer: 2 } },
        { label: 'Hear each person out separately, then patiently help them meet in the middle', points: { steadier: 2 } },
        { label: 'Separate the facts from the feelings and lay out what\'s actually in dispute', points: { analyst: 2 } },
      ],
    },
    {
      id: 9,
      text: 'How do you most like to be recognized for great work?',
      options: [
        { label: 'Hand me a bigger challenge — that\'s the real reward', points: { driver: 2 } },
        { label: 'Publicly! Shout it out at the all-hands, I\'ll act surprised', points: { influencer: 2 } },
        { label: 'A sincere, personal thank-you means more to me than any stage', points: { steadier: 2 } },
        { label: 'Acknowledge the quality and rigor — specifically, and to the right people', points: { analyst: 2 } },
      ],
    },
    {
      id: 10,
      text: 'Your honest relationship with rules and process?',
      options: [
        { label: 'They\'re guidelines. If a rule slows down results, I\'ll challenge it', points: { driver: 2 } },
        { label: 'Loose — I trust people and relationships over paperwork every time', points: { influencer: 2 } },
        { label: 'Comforting — good process protects the team and keeps work humane', points: { steadier: 2, analyst: 1 } },
        { label: 'Sacred, when well-designed — and I\'m usually the one designing them', points: { analyst: 2 } },
      ],
    },
  ],
};
