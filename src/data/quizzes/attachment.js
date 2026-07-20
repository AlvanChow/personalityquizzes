// What's Your Attachment Style? — 'pick' mode quiz inspired by attachment theory.
// Reflection entertainment, not diagnosis: every style is described with genuine
// strengths first, and growth is framed hopefully — attachment styles can change
// with awareness and safe relationships.

export default {
  key: 'attachment',
  mode: 'pick',
  resultsHeading: 'Your attachment style breakdown',

  results: {
    secure: {
      name: 'Secure',
      emoji: '🌳',
      color: 'from-emerald-100 to-green-50',
      accent: 'text-emerald-600',
      tagline: '#SteadyAnchor #SafeHarbor #ComeAsYouAre',
      description:
        'Closeness feels like home to you, and space doesn\'t feel like a threat. You can say "that hurt my feelings" without bracing for disaster, and hear the same from someone else without crumbling. People tend to exhale around you — your steadiness gives them permission to be fully themselves. It\'s not that you never worry; it\'s that connection, for you, is a place to rest rather than a puzzle to solve.',
      strengths: ['Comfortable with both closeness and independence', 'Communicates needs directly and kindly', 'Repairs conflict instead of fearing it', 'Makes others feel safe to open up'],
      growth: 'Your ease can make you the unofficial therapist of every group — remember that your needs deserve airtime too. And stay curious about loved ones whose hearts work differently; what feels simple to you took some of them years to learn.',
      kindred: ['anxious', 'avoidant'],
    },
    anxious: {
      name: 'Anxious-Preoccupied',
      emoji: '🌊',
      color: 'from-amber-100 to-orange-50',
      accent: 'text-amber-700',
      tagline: '#BigHeart #AllIn #DeepFeeler',
      description:
        'You love with the volume turned all the way up. You notice the smallest shifts in tone, remember everything that matters to your people, and show up for them with a devotion most only talk about. The same sensitive radar that makes you such an attuned friend and partner can also spin stories in the quiet moments — a slow reply becomes a verdict, a busy week becomes distance. Your love was never the problem; learning to feel safe inside it is the adventure.',
      strengths: ['Deeply attuned to others\' feelings', 'Loyal and wholehearted', 'Works hard on relationships', 'Notices what others miss'],
      growth: 'Practice letting reassurance come from inside as well as outside — the connection is usually far sturdier than the anxious moment claims. With awareness and steady, safe relationships, that beautiful sensitivity becomes pure superpower.',
      kindred: ['secure', 'fearful'],
    },
    avoidant: {
      name: 'Dismissive-Avoidant',
      emoji: '🏔️',
      color: 'from-slate-100 to-blue-50',
      accent: 'text-slate-600',
      tagline: '#QuietStrength #SelfContained #StillWaters',
      description:
        'You are wonderfully self-contained — calm in crises, unflustered by drama, genuinely happy in your own company. Your love tends to be practical and understated: you show it by being dependable, solving problems, and respecting people\'s independence the way you treasure your own. Needing space isn\'t coldness; it\'s how you recharge. The people who know you well understand that your steady, low-key presence is its own quiet declaration of care.',
      strengths: ['Calm and grounded under pressure', 'Respects boundaries beautifully', 'Self-sufficient and dependable', 'Loves without smothering'],
      growth: 'Letting someone see you mid-struggle — not just after you\'ve handled it — is the next frontier, and it tends to deepen bonds rather than burden them. Closeness on your own terms is still yours to define; awareness and trustworthy people make it feel safer than you\'d expect.',
      kindred: ['secure', 'fearful'],
    },
    fearful: {
      name: 'Fearful-Avoidant',
      emoji: '🌗',
      color: 'from-violet-100 to-purple-50',
      accent: 'text-violet-600',
      tagline: '#BraveHeart #BothWorlds #StillHoping',
      description:
        'You hold two truths at once: a deep longing for closeness and a well-earned caution about it. That combination makes you remarkably perceptive — you understand both the person who clings and the person who retreats, because you\'ve been both. Your empathy has depth that only lived complexity can create. The fact that you keep reaching for connection anyway, even when part of you wants to bolt, is quiet courage most people never have to find.',
      strengths: ['Rare empathy for every kind of heart', 'Emotionally deep and perceptive', 'Courageous — keeps choosing connection', 'Fiercely protective of loved ones'],
      growth: 'Your mixed signals usually mean "I care so much it scares me" — saying that sentence out loud, to safe people, works wonders. Attachment patterns soften with awareness and steady relationships, and yours is already softening just by you taking a quiz like this.',
      kindred: ['anxious', 'avoidant'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'A close friend hasn\'t replied to your message all day. What runs through your mind?',
      options: [
        { label: 'They\'re probably just busy — they\'ll get back to me when they can', points: { secure: 2 } },
        { label: 'I re-read what I sent, wondering if I said something wrong', points: { anxious: 2 } },
        { label: 'Honestly, I barely notice — long gaps between messages feel normal to me', points: { avoidant: 2 } },
        { label: 'Part of me wants to double-text, part of me wants to pull back first', points: { fearful: 2 } },
      ],
    },
    {
      id: 2,
      text: 'Someone you\'re growing close to says, "Hey, can we talk later?" Your gut reaction?',
      options: [
        { label: 'Mostly curious — I\'ll find out what it\'s about when we talk', points: { secure: 2 } },
        { label: 'My mind immediately starts running through what I might have done', points: { anxious: 2, fearful: 1 } },
        { label: 'Noted. I stay level and get on with my day until then', points: { avoidant: 2 } },
        { label: 'I brace myself — "we need to talk" and bad news feel wired together for me', points: { fearful: 2 } },
      ],
    },
    {
      id: 3,
      text: 'When a relationship — romantic or platonic — gets really close, you tend to…',
      options: [
        { label: 'Settle in and enjoy it — closeness feels like home', points: { secure: 2 } },
        { label: 'Hold on tight and want even more reassurance that it\'s real', points: { anxious: 2 } },
        { label: 'Feel a gentle pull to reclaim some breathing room and independence', points: { avoidant: 2 } },
        { label: 'Feel both at once: wanting to move closer and wanting an exit route', points: { fearful: 2 } },
      ],
    },
    {
      id: 4,
      text: 'How do you handle conflict with someone you love?',
      options: [
        { label: 'Talk it through — hard conversations usually bring us closer', points: { secure: 2 } },
        { label: 'I need to resolve it right now; unresolved tension keeps me up at night', points: { anxious: 2 } },
        { label: 'I need space first — I process alone before I can talk it out', points: { avoidant: 2 } },
        { label: 'I can swing between wanting to fix it this second and shutting down entirely', points: { fearful: 2 } },
      ],
    },
    {
      id: 5,
      text: 'Asking for help when you\'re genuinely struggling feels…',
      options: [
        { label: 'Natural — that\'s what the people who love me are there for', points: { secure: 2 } },
        { label: 'Doable, but afterward I worry I was too much', points: { anxious: 2 } },
        { label: 'Mostly unnecessary — my first instinct is to figure it out myself', points: { avoidant: 2 } },
        { label: 'Risky — I want to, but letting my guard down has stung before', points: { fearful: 2 } },
      ],
    },
    {
      id: 6,
      text: 'Someone gives you a heartfelt, glowing compliment. You…',
      options: [
        { label: 'Take it in and thank them — it feels good to be seen', points: { secure: 2 } },
        { label: 'Glow inside, and quietly hope they keep saying things like that', points: { anxious: 2 } },
        { label: 'Deflect a little — that much spotlight on my inner world gets uncomfortable', points: { avoidant: 2 } },
        { label: 'Feel warmed and wary at the same time — do they really mean it?', points: { fearful: 2 } },
      ],
    },
    {
      id: 7,
      text: 'What does "space" in a close relationship mean to you?',
      options: [
        { label: 'Something healthy — we can be apart and still be solid', points: { secure: 2 } },
        { label: 'A little scary — distance makes me worry the connection is fading', points: { anxious: 2 } },
        { label: 'Essential — it\'s where I recharge and come back to myself', points: { avoidant: 2 } },
        { label: 'Confusing — I crave it, then worry about what taking it might mean', points: { fearful: 2 } },
      ],
    },
    {
      id: 8,
      text: 'Someone you love is hurting. How do you naturally show up?',
      options: [
        { label: 'I move toward them — being present comes easily to me', points: { secure: 2 } },
        { label: 'I pour everything into helping, sometimes forgetting my own needs entirely', points: { anxious: 2 } },
        { label: 'I show love practically — solutions, logistics, quiet usefulness', points: { avoidant: 2 } },
        { label: 'I care intensely but sometimes freeze, unsure my comfort is wanted', points: { fearful: 2 } },
      ],
    },
    {
      id: 9,
      text: 'A new relationship is going suspiciously well. Your inner monologue?',
      options: [
        { label: '"This is lovely. Let\'s see where it goes."', points: { secure: 2 } },
        { label: '"Do they like me as much as I like them? I kind of need to know."', points: { anxious: 2 } },
        { label: '"Great — as long as it leaves room for my own life and rhythms."', points: { avoidant: 2 } },
        { label: '"Okay… so when does the other shoe drop?"', points: { fearful: 2 } },
      ],
    },
    {
      id: 10,
      text: 'Deep down, what do you most want the people closest to you to understand?',
      options: [
        { label: 'That I\'m here, steadily, and they can genuinely count on that', points: { secure: 2 } },
        { label: 'That I love fiercely, and being clearly wanted back means everything', points: { anxious: 2 } },
        { label: 'That my need for independence has never meant a lack of love', points: { avoidant: 2 } },
        { label: 'That behind any mixed signals is a heart that wants connection badly', points: { fearful: 2 } },
      ],
    },
  ],
};
