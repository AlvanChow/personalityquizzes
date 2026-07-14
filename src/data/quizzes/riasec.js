// Career Interest Explorer (RIASEC) — 'likert' mode.
// 18 original "I would enjoy…" statements, 3 per Holland-inspired dimension.
// No reverse items, no bands: the highest-scoring dimension is the result.

export default {
  key: 'riasec',
  mode: 'likert',
  resultsHeading: 'Your interest profile',

  dimensions: {
    realistic: { label: 'Realistic — The Builder', color: 'bg-amber-400' },
    investigative: { label: 'Investigative — The Thinker', color: 'bg-sky-400' },
    artistic: { label: 'Artistic — The Creator', color: 'bg-fuchsia-400' },
    social: { label: 'Social — The Helper', color: 'bg-rose-400' },
    enterprising: { label: 'Enterprising — The Persuader', color: 'bg-orange-400' },
    conventional: { label: 'Conventional — The Organizer', color: 'bg-emerald-400' },
  },

  results: {
    realistic: {
      name: 'The Builder',
      emoji: '🔧',
      color: 'from-amber-100 to-orange-50',
      accent: 'text-amber-700',
      tagline: '#HandsOn #MakeItReal #FixItYourself',
      description:
        'You think with your hands. Abstract talk bores you fast, but give you a tool, a machine, a garden, or a broken thing, and you settle into a focus most people only get from meditation. You trust what can be built, tested, and touched — and your favorite proof that something works is watching it work. Careers that keep you moving and making, from engineering and trades to robotics and the outdoors, will always beat a life of pure meetings.',
      strengths: ['Practical problem-solving', 'Learns fastest by doing', 'Steady with tools and tech', 'Delivers finished, tangible work'],
      growth: 'Because you value doing over discussing, you can check out of the planning conversations that decide what gets built. Staying at the table a little longer means the thing you make is the thing that was actually needed.',
      kindred: ['investigative', 'conventional'],
    },
    investigative: {
      name: 'The Thinker',
      emoji: '🔬',
      color: 'from-sky-100 to-cyan-50',
      accent: 'text-sky-700',
      tagline: '#WhyThough #FollowTheEvidence #DeepDive',
      description:
        'Your native question is "why?" — and you will happily chase the answer through data, books, experiments, and rabbit holes long after everyone else has accepted the surface explanation. You are energized by problems that resist you, and quietly suspicious of answers that come too easily. Research, analysis, science, medicine, and any field where understanding precedes action are where your mind gets to run at full speed.',
      strengths: ['Rigorous, independent analysis', 'Comfortable with complexity', 'Genuinely loves learning', 'Hard to fool with weak arguments'],
      growth: 'Understanding a problem can start to feel like solving it. Set a "good enough to act" threshold — your insights change the world only when they leave your notebook.',
      kindred: ['realistic', 'artistic'],
    },
    artistic: {
      name: 'The Creator',
      emoji: '🎨',
      color: 'from-fuchsia-100 to-pink-50',
      accent: 'text-fuchsia-600',
      tagline: '#BlankPageEnergy #OriginalOnly #MakeItBeautiful',
      description:
        'You experience rules, templates, and dress codes as a mild form of suffocation. What lights you up is the open space before anything exists — the blank page, the empty room, the unwritten melody — and the alchemy of turning a feeling into a thing other people can experience. Design, writing, music, film, and any role where your taste is the tool will feel less like work and more like finally being allowed to breathe.',
      strengths: ['Original ideas on demand', 'Strong personal taste', 'Expresses what others only feel', 'Thrives without a script'],
      growth: 'Your allergy to structure can extend to the deadlines and routines that would actually protect your creative time. A little boring scaffolding is not the enemy of the work — it is what keeps the work happening.',
      kindred: ['investigative', 'social'],
    },
    social: {
      name: 'The Helper',
      emoji: '🤝',
      color: 'from-rose-100 to-pink-50',
      accent: 'text-rose-600',
      tagline: '#PeopleFirst #WatchThemGrow #ShowUp',
      description:
        'For you, the most interesting system in any room is the people in it. You notice who is struggling, you remember what they told you last month, and the moment a person you helped finally gets it — the click — pays you more than any bonus could. Teaching, counseling, healthcare, coaching, and community work are not just jobs you could do; they are the settings where you become the fullest version of yourself.',
      strengths: ['Earns trust quickly', 'Listens beneath the words', 'Patient with slow progress', 'Makes groups feel like teams'],
      growth: 'You give so instinctively that your own tank can run dry without you noticing. Treat your energy like you treat other people\'s problems — as something worth tending to early, not after the crisis.',
      kindred: ['artistic', 'enterprising'],
    },
    enterprising: {
      name: 'The Persuader',
      emoji: '📣',
      color: 'from-orange-100 to-amber-50',
      accent: 'text-orange-600',
      tagline: '#PitchIt #LetsGo #BetOnYourself',
      description:
        'You see opportunities the way other people see obstacles, and you cannot resist recruiting others into your vision of what could be. A room to win over, a deal to close, a stalled project that needs someone to just decide — that is your natural habitat. Leadership, sales, entrepreneurship, law, and politics reward exactly what you have in abundance: nerve, energy, and the ability to make people believe.',
      strengths: ['Persuades without a script', 'Decides under pressure', 'Spots opportunity early', 'Brings contagious momentum'],
      growth: 'Your speed and confidence can leave quieter, more careful voices unheard — and sometimes they are holding the warning you need. Slow down long enough to be persuaded occasionally; it makes your yes worth more.',
      kindred: ['social', 'conventional'],
    },
    conventional: {
      name: 'The Organizer',
      emoji: '📊',
      color: 'from-emerald-100 to-teal-50',
      accent: 'text-emerald-600',
      tagline: '#OrderFromChaos #DetailsMatter #TrustTheSystem',
      description:
        'Where others see a boring spreadsheet, you see a small kingdom that could be ruled beautifully. You take real satisfaction in systems that hum — accurate records, clean processes, plans that survive contact with reality — and you are the reason nothing falls through the cracks. Finance, operations, project management, and data work reward your superpower: making complicated things run so smoothly that people forget how hard that is.',
      strengths: ['Flawless follow-through', 'Catches what everyone misses', 'Builds systems that outlast you', 'Calm inside complexity'],
      growth: 'Your love of the proven way can make new ways feel like threats rather than options. Experiment on purpose now and then — the best process you will ever run is one you were once skeptical of.',
      kindred: ['enterprising', 'realistic'],
    },
  },

  questions: [
    { id: 1, text: 'I would enjoy spending an afternoon fixing something with my hands — a bike, a shelf, a leaky tap.', dim: 'realistic' },
    { id: 2, text: 'I would enjoy digging into a puzzle or a pile of data for hours to figure out why something works the way it does.', dim: 'investigative' },
    { id: 3, text: 'I would enjoy starting from a blank page — designing, writing, or composing something no one has seen before.', dim: 'artistic' },
    { id: 4, text: 'I would enjoy coaching someone through a new skill and being there for the moment it finally clicks.', dim: 'social' },
    { id: 5, text: 'I would enjoy pitching an idea to a skeptical room and winning them over to make it happen.', dim: 'enterprising' },
    { id: 6, text: 'I would enjoy bringing order to a messy system — sorting files, budgets, or schedules until they run smoothly.', dim: 'conventional' },
    { id: 7, text: 'I would enjoy working outdoors with tools, machines, or growing things far more than sitting at a desk.', dim: 'realistic' },
    { id: 8, text: 'I would enjoy reading deep-dive research on a topic and then testing the ideas out for myself.', dim: 'investigative' },
    { id: 9, text: 'I would enjoy work where there is no single right answer and my personal style counts as a strength.', dim: 'artistic' },
    { id: 10, text: 'I would enjoy spending my workday listening to people and helping them untangle their problems.', dim: 'social' },
    { id: 11, text: 'I would enjoy taking the lead on a bold project where quick decisions and persuasion decide the outcome.', dim: 'enterprising' },
    { id: 12, text: 'I would enjoy work with clear procedures, where being accurate and dependable is what makes someone great.', dim: 'conventional' },
    { id: 13, text: 'I would enjoy taking a gadget apart just to see how the pieces fit — and putting it back together better.', dim: 'realistic' },
    { id: 14, text: 'I would enjoy a job whose main task is asking sharp questions and following the evidence wherever it leads.', dim: 'investigative' },
    { id: 15, text: 'I would enjoy turning a vague feeling or idea into something people can see, hear, or read.', dim: 'artistic' },
    { id: 16, text: 'I would enjoy organizing support for someone going through a hard time — it would not even feel like work.', dim: 'social' },
    { id: 17, text: 'I would enjoy negotiating a deal where the result depends on my energy, confidence, and read of the room.', dim: 'enterprising' },
    { id: 18, text: 'I would enjoy tracking the details others overlook — double-checking numbers, catching errors, keeping records exact.', dim: 'conventional' },
  ],
};
