// 3 questions per Enneagram type (types '1' through '9')
// Options: 1 = "not like me at all" → 4 = "very much like me"

export const enneagramQuestions = [
  // ── Type 1: The Reformer ───────────────────────────────────────────────────
  {
    id: 1,
    text: 'I have a strong inner sense of right and wrong and feel driven to correct what\'s wrong in the world.',
    trait: '1',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 2,
    text: 'I notice small errors or inconsistencies that others overlook, and feel a pull to fix them.',
    trait: '1',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 3,
    text: 'I hold myself to very high standards and can be quite self-critical when I fall short.',
    trait: '1',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },

  // ── Type 2: The Helper ────────────────────────────────────────────────────
  {
    id: 4,
    text: 'I find deep fulfilment in helping others and often anticipate what people need before they ask.',
    trait: '2',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 5,
    text: 'I find it hard to say no when someone needs me, even when I\'m already stretched thin.',
    trait: '2',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 6,
    text: 'I tend to put others\' needs before my own and feel most valued when I\'m being helpful.',
    trait: '2',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },

  // ── Type 3: The Achiever ──────────────────────────────────────────────────
  {
    id: 7,
    text: 'I\'m highly goal-oriented and tend to measure my self-worth by my accomplishments.',
    trait: '3',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 8,
    text: 'I\'m very aware of how I\'m perceived and work hard to present a capable, successful image.',
    trait: '3',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 9,
    text: 'I adapt easily to different environments and can read what\'s valued in a room and rise to meet it.',
    trait: '3',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },

  // ── Type 4: The Individualist ─────────────────────────────────────────────
  {
    id: 10,
    text: 'I have a strong sense of being fundamentally different from others and often feel misunderstood.',
    trait: '4',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 11,
    text: 'I\'m drawn to intense, authentic emotional experiences and value depth above almost everything else.',
    trait: '4',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 12,
    text: 'I have a rich inner life and often dwell on what\'s missing or what could have been.',
    trait: '4',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },

  // ── Type 5: The Investigator ──────────────────────────────────────────────
  {
    id: 13,
    text: 'I need significant time alone to recharge and feel drained by prolonged social interaction.',
    trait: '5',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 14,
    text: 'I love to deeply research topics that interest me and prefer to fully understand something before acting.',
    trait: '5',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 15,
    text: 'I tend to be private about my personal life and share little of myself with most people.',
    trait: '5',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },

  // ── Type 6: The Loyalist ──────────────────────────────────────────────────
  {
    id: 16,
    text: 'I often run through worst-case scenarios in my head to prepare for potential problems.',
    trait: '6',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 17,
    text: 'I value loyalty and reliability deeply — I take commitments seriously and expect others to as well.',
    trait: '6',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 18,
    text: 'I sometimes doubt my own judgement and look to trusted people or systems for reassurance.',
    trait: '6',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },

  // ── Type 7: The Enthusiast ────────────────────────────────────────────────
  {
    id: 19,
    text: 'I\'m drawn to new experiences and possibilities and feel restless when stuck in routine.',
    trait: '7',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 20,
    text: 'I prefer to keep things positive and find it difficult to sit with boredom or discomfort for long.',
    trait: '7',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 21,
    text: 'I often have many projects or plans on the go at once and find it hard to commit to just one thing.',
    trait: '7',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },

  // ── Type 8: The Challenger ────────────────────────────────────────────────
  {
    id: 22,
    text: 'I have a strong dislike of being controlled, manipulated, or taken advantage of.',
    trait: '8',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 23,
    text: 'I am naturally assertive and direct — I say what I think and don\'t shy away from confrontation.',
    trait: '8',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 24,
    text: 'I have a strong desire to protect those I care about and a low tolerance for injustice.',
    trait: '8',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },

  // ── Type 9: The Peacemaker ────────────────────────────────────────────────
  {
    id: 25,
    text: 'I avoid conflict wherever possible and feel deeply uncomfortable when there\'s tension around me.',
    trait: '9',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 26,
    text: 'I tend to see all sides of an argument and genuinely find it hard to take a strong position.',
    trait: '9',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
  {
    id: 27,
    text: 'I often go along with what others want and can lose track of my own preferences in the process.',
    trait: '9',
    options: [
      { value: 1, label: 'Not like me at all' },
      { value: 2, label: 'Slightly like me' },
      { value: 3, label: 'Mostly like me' },
      { value: 4, label: 'Very much like me' },
    ],
  },
];
