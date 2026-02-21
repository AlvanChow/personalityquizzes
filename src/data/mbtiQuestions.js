// trait: 'IE' | 'SN' | 'TF' | 'JP'
// options value 1 = strongly first letter (I / S / T / J)
// options value 4 = strongly second letter (E / N / F / P)

export const mbtiQuestions = [
  // ── I / E  (Introversion vs Extraversion) ──────────────────────────────────
  {
    id: 1,
    text: 'After a long, busy week, the most restorative thing for you is...',
    trait: 'IE',
    options: [
      { value: 1, label: 'A full day alone — no plans, no people, completely decompressing' },
      { value: 2, label: 'A quiet evening in with one close friend or your partner' },
      { value: 3, label: 'A relaxed hangout with a small group you already know' },
      { value: 4, label: 'Getting out and socialising — people recharge you' },
    ],
  },
  {
    id: 2,
    text: 'In a meeting or group discussion, you tend to...',
    trait: 'IE',
    options: [
      { value: 1, label: 'Listen carefully and share your thoughts only when directly asked' },
      { value: 2, label: 'Speak up occasionally when you have something important to add' },
      { value: 3, label: 'Contribute fairly regularly and enjoy exchanging ideas' },
      { value: 4, label: 'Jump in often, love to riff off others and drive the conversation' },
    ],
  },
  {
    id: 3,
    text: 'When facing a big decision, your instinct is to...',
    trait: 'IE',
    options: [
      { value: 1, label: 'Think it through thoroughly on your own before mentioning it to anyone' },
      { value: 2, label: 'Reflect privately first, then perhaps talk it over with one trusted person' },
      { value: 3, label: 'Talk it through with a few close people to gather their perspectives' },
      { value: 4, label: 'Think out loud with as many people as possible — others help you process' },
    ],
  },
  {
    id: 4,
    text: 'You arrive at a gathering where you know very few people. You...',
    trait: 'IE',
    options: [
      { value: 1, label: 'Stay close to the one or two you know and avoid going out of your way to meet others' },
      { value: 2, label: 'Stay in your comfort zone but open up if someone approaches you first' },
      { value: 3, label: 'Gradually warm up and end up having genuine conversations with a few new people' },
      { value: 4, label: 'Start introducing yourself almost immediately — new people are exciting' },
    ],
  },
  {
    id: 5,
    text: 'An entire Saturday with no plans makes you feel...',
    trait: 'IE',
    options: [
      { value: 1, label: 'Genuinely relieved — unstructured alone time is exactly what you need' },
      { value: 2, label: 'Mostly good, though you might check in with someone later' },
      { value: 3, label: 'Fine, but you\'ll probably reach out and make loose plans with someone' },
      { value: 4, label: 'A little restless — you\'d rather fill the day with people and activity' },
    ],
  },
  {
    id: 6,
    text: 'When working on a project, you do your best work...',
    trait: 'IE',
    options: [
      { value: 1, label: 'Completely alone in a quiet space with no interruptions' },
      { value: 2, label: 'Mostly solo, checking in with someone occasionally' },
      { value: 3, label: 'Collaborating with a partner or small team for most of it' },
      { value: 4, label: 'In a lively, open environment with constant back-and-forth' },
    ],
  },
  {
    id: 7,
    text: 'People who know you well would most likely describe you as...',
    trait: 'IE',
    options: [
      { value: 1, label: 'Private and introspective — you keep your inner world to yourself' },
      { value: 2, label: 'Selective — open with a trusted few, more guarded with most others' },
      { value: 3, label: 'Friendly and easy to talk to in most situations' },
      { value: 4, label: 'Outgoing and energising — the one who gets things going socially' },
    ],
  },

  // ── S / N  (Sensing vs iNtuition) ──────────────────────────────────────────
  {
    id: 8,
    text: 'When learning a new skill, you prefer to start by...',
    trait: 'SN',
    options: [
      { value: 1, label: 'Following step-by-step instructions and practising each step concretely' },
      { value: 2, label: 'Getting a clear walkthrough before diving into the hands-on part' },
      { value: 3, label: 'Understanding the overall structure first, then working out the details' },
      { value: 4, label: 'Grasping the big idea or vision and exploring freely from there' },
    ],
  },
  {
    id: 9,
    text: 'You tend to trust more in...',
    trait: 'SN',
    options: [
      { value: 1, label: 'Your direct, concrete experience — what you can see and verify yourself' },
      { value: 2, label: 'Facts and evidence, though you consider what they imply' },
      { value: 3, label: 'Patterns and trends — what experience suggests about what\'s coming' },
      { value: 4, label: 'Your gut intuitions, even when you can\'t fully explain them' },
    ],
  },
  {
    id: 10,
    text: 'When reading, you gravitate toward...',
    trait: 'SN',
    options: [
      { value: 1, label: 'Practical, factual writing — how-tos, journalism, biographies' },
      { value: 2, label: 'Clear narratives grounded in real events, with some broader insight' },
      { value: 3, label: 'Thought-provoking fiction or essays that raise bigger questions' },
      { value: 4, label: 'Abstract, visionary or philosophical works that challenge how you see things' },
    ],
  },
  {
    id: 11,
    text: 'When describing a past experience, you tend to...',
    trait: 'SN',
    options: [
      { value: 1, label: 'Share the specific, concrete details — who, what, where, when' },
      { value: 2, label: 'Give a clear account of what happened with some reflection at the end' },
      { value: 3, label: 'Summarise the key events but focus more on what they meant to you' },
      { value: 4, label: 'Jump straight to the insight or theme the experience revealed' },
    ],
  },
  {
    id: 12,
    text: 'When problem-solving, you prefer to...',
    trait: 'SN',
    options: [
      { value: 1, label: 'Work with what you know has worked before — proven, reliable methods' },
      { value: 2, label: 'Stick to established approaches but adapt them if needed' },
      { value: 3, label: 'Look for patterns across situations and try new angles' },
      { value: 4, label: 'Brainstorm radically different approaches, even unconventional ones' },
    ],
  },
  {
    id: 13,
    text: 'In conversation, you\'re more drawn to discussing...',
    trait: 'SN',
    options: [
      { value: 1, label: 'Real, concrete things — current events, practical tips, shared experiences' },
      { value: 2, label: 'Real situations, but also what they mean or imply' },
      { value: 3, label: 'Ideas, theories, and the deeper significance behind things' },
      { value: 4, label: 'Abstract possibilities, hypothetical scenarios, and future visions' },
    ],
  },
  {
    id: 14,
    text: 'You\'re more likely to say...',
    trait: 'SN',
    options: [
      { value: 1, label: '"Just tell me exactly what I need to do and I\'ll do it well."' },
      { value: 2, label: '"Give me a clear plan and I\'ll take it from there."' },
      { value: 3, label: '"I want to understand the why before I figure out the how."' },
      { value: 4, label: '"I\'d rather reinvent the whole approach than follow a template."' },
    ],
  },

  // ── T / F  (Thinking vs Feeling) ───────────────────────────────────────────
  {
    id: 15,
    text: 'When a close friend makes a decision you think is a mistake, you...',
    trait: 'TF',
    options: [
      { value: 1, label: 'Give your honest, logical assessment, even if it\'s hard to hear' },
      { value: 2, label: 'Focus on the practical steps or risks they should weigh up' },
      { value: 3, label: 'Balance practical advice with acknowledging how they feel' },
      { value: 4, label: 'Start by listening and validating their feelings before saying anything critical' },
    ],
  },
  {
    id: 16,
    text: 'In a group discussion, you value most...',
    trait: 'TF',
    options: [
      { value: 1, label: 'Logical consistency — ideas should hold up under rational scrutiny' },
      { value: 2, label: 'Clear reasoning and evidence, even on emotionally loaded topics' },
      { value: 3, label: 'Both good reasoning and consideration of how decisions affect people' },
      { value: 4, label: 'That everyone feels heard and that the human impact is front of mind' },
    ],
  },
  {
    id: 17,
    text: 'Your decisions are usually based on...',
    trait: 'TF',
    options: [
      { value: 1, label: 'Pure logic — what makes the most sense, independent of feelings' },
      { value: 2, label: 'Objective analysis first, with minimal influence from emotion' },
      { value: 3, label: 'A mix of logic and gut feeling — what\'s both sensible and feels right' },
      { value: 4, label: 'Primarily what feels right and aligns with your values and relationships' },
    ],
  },
  {
    id: 18,
    text: 'When you disagree with someone, you tend to...',
    trait: 'TF',
    options: [
      { value: 1, label: 'Point out the flaw in their argument directly and stick to the facts' },
      { value: 2, label: 'Calmly lay out your reasoning and explain where theirs doesn\'t hold up' },
      { value: 3, label: 'Try to find common ground before explaining where you differ' },
      { value: 4, label: 'Focus on keeping the relationship intact and finding a middle ground' },
    ],
  },
  {
    id: 19,
    text: 'When evaluating a plan, the first thing you ask is...',
    trait: 'TF',
    options: [
      { value: 1, label: '"Is this logically sound? Does it hold up under scrutiny?"' },
      { value: 2, label: '"What are the rational pros and cons of this approach?"' },
      { value: 3, label: '"Does this make sense, and does it feel right for everyone involved?"' },
      { value: 4, label: '"How will this affect the people involved? Does it align with our values?"' },
    ],
  },
  {
    id: 20,
    text: 'You\'d describe yourself as someone who is more...',
    trait: 'TF',
    options: [
      { value: 1, label: 'Fair than warm — you hold people to the same objective standard' },
      { value: 2, label: 'Analytical first, empathetic when the situation calls for it' },
      { value: 3, label: 'Warm but grounded — you lead with heart but logic keeps you anchored' },
      { value: 4, label: 'Deeply tuned in to how others feel, sometimes more than outcomes' },
    ],
  },
  {
    id: 21,
    text: 'When someone close to you is visibly upset, your first instinct is to...',
    trait: 'TF',
    options: [
      { value: 1, label: 'Identify the root cause of the problem and suggest a concrete fix' },
      { value: 2, label: 'Help them see things more clearly and offer practical perspective' },
      { value: 3, label: 'Sit with them briefly, then gently help them work through it' },
      { value: 4, label: 'Focus entirely on making them feel heard, supported and understood' },
    ],
  },

  // ── J / P  (Judging vs Perceiving) ─────────────────────────────────────────
  {
    id: 22,
    text: 'Your approach to planning a holiday is...',
    trait: 'JP',
    options: [
      { value: 1, label: 'Everything booked in advance — accommodation, restaurants, a full itinerary' },
      { value: 2, label: 'Key things planned ahead; open slots within a clear structure' },
      { value: 3, label: 'A rough idea of highlights with plenty of room to see how things unfold' },
      { value: 4, label: 'Book the flight and figure out the rest when you get there' },
    ],
  },
  {
    id: 23,
    text: 'When given a week-long project at work, you...',
    trait: 'JP',
    options: [
      { value: 1, label: 'Break it into a detailed schedule immediately and start on day one' },
      { value: 2, label: 'Map out the key steps and milestones, then work through them steadily' },
      { value: 3, label: 'Get a feel for the scope but prefer to adapt as you go' },
      { value: 4, label: 'Wait for inspiration and tend to do your best work close to the deadline' },
    ],
  },
  {
    id: 24,
    text: 'Your calendar or schedule is typically...',
    trait: 'JP',
    options: [
      { value: 1, label: 'Packed with specific appointments, reminders and to-do lists' },
      { value: 2, label: 'Structured with some breathing room deliberately built in' },
      { value: 3, label: 'Loosely planned — you check it occasionally and shift things as needed' },
      { value: 4, label: 'Mostly in your head — rigid schedules feel limiting and stressful' },
    ],
  },
  {
    id: 25,
    text: 'When plans you were looking forward to change last minute, you feel...',
    trait: 'JP',
    options: [
      { value: 1, label: 'Genuinely frustrated — you had arranged everything around those plans' },
      { value: 2, label: 'A bit thrown off, though you adapt once you accept the change' },
      { value: 3, label: 'Mostly fine — you\'re used to plans shifting and roll with it' },
      { value: 4, label: 'Low-key relieved — spontaneous changes often lead somewhere better' },
    ],
  },
  {
    id: 26,
    text: 'When making a significant purchase, you...',
    trait: 'JP',
    options: [
      { value: 1, label: 'Research thoroughly beforehand, make the decision, and stick to it' },
      { value: 2, label: 'Come prepared with clear criteria and buy once something fits' },
      { value: 3, label: 'Browse widely and take your time before committing' },
      { value: 4, label: 'Buy when something speaks to you in the moment' },
    ],
  },
  {
    id: 27,
    text: 'Your workspace or living space tends to be...',
    trait: 'JP',
    options: [
      { value: 1, label: 'Neat, organised and clearly structured — everything has its place' },
      { value: 2, label: 'Generally tidy with organised areas for the things you use most' },
      { value: 3, label: 'A mix — organised in the spots that matter, messier elsewhere' },
      { value: 4, label: 'Comfortably chaotic — you know where things are even if others wouldn\'t' },
    ],
  },
  {
    id: 28,
    text: 'How do you feel about finishing tasks before their deadline?',
    trait: 'JP',
    options: [
      { value: 1, label: 'Essential — you always aim to finish well ahead of any deadline' },
      { value: 2, label: 'Important — you work steadily to avoid any last-minute stress' },
      { value: 3, label: 'Nice if it happens, but you often wrap things up around the deadline' },
      { value: 4, label: 'Deadlines are when you finally focus — pressure brings out your best work' },
    ],
  },
];
