// Which Taylor Swift Era Are You? — 'pick' mode quiz.
// Results are eras as personality archetypes, not people. No lyrics quoted.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'eras',
  mode: 'pick',
  resultsHeading: 'Your era match breakdown',

  results: {
    debut: {
      name: 'Debut (Country Roots)',
      emoji: '🤠',
      color: 'from-teal-100 to-emerald-50',
      accent: 'text-teal-600',
      tagline: '#Hometown #Earnest #FirstChapter',
      description:
        'You are the front-porch storyteller — earnest, nostalgic, and completely unembarrassed about feeling things sincerely. You remember where you came from and who was there at the very beginning, and you would rather be genuine and a little unpolished than slick and hollow. There is real bravery in your openness: you say the sweet thing out loud, you dream in public, and you keep your roots close while you grow.',
      strengths: ['Sincere to the core', 'Remembers where home is', 'Brave enough to begin', 'Nostalgic in the best way'],
      growth: 'Honoring where you came from is beautiful — just do not let the hometown version of you veto the person you are becoming. New chapters are allowed.',
      kindred: ['fearless', 'folklore'],
    },
    fearless: {
      name: 'Fearless',
      emoji: '✨',
      color: 'from-yellow-100 to-amber-50',
      accent: 'text-amber-600',
      tagline: '#GoldenHour #Hopeful #LeapFirst',
      description:
        'You are the hopeful romantic who still believes in the big moment — the leap, the first dance, the yes. Where other people hedge and wait for guarantees, you throw yourself in wholeheartedly, because to you the entire point of having a heart is using it. Your optimism is not naive; it is a choice you keep making on purpose, and it quietly makes everyone around you braver.',
      strengths: ['Wholehearted in everything', 'Contagious optimism', 'Takes the leap first', 'Believes in people'],
      growth: 'Not every leap deserves you. Your hope is a genuine gift — spend it on the people and dreams that leap back.',
      kindred: ['lover', 'debut'],
    },
    red: {
      name: 'Red',
      emoji: '🧣',
      color: 'from-red-100 to-rose-50',
      accent: 'text-red-600',
      tagline: '#AllOrNothing #AutumnSoul #FeelItAll',
      description:
        'You feel everything at maximum saturation — joy, heartbreak, nostalgia, all burning at once like October leaves. You would rather love something completely and lose it than experience life at half strength, and you have a rare gift for turning your messiest chapters into your most beautiful stories. People bring you their feelings because you never, ever minimize — you understand that big emotions are not a malfunction.',
      strengths: ['Feels with full intensity', 'Turns pain into art', 'Never lukewarm about anything', 'Takes every feeling seriously'],
      growth: 'Every feeling is real, but not every feeling is a forecast. Let the wave pass before you rename the whole ocean after it.',
      kindred: ['folklore', 'fearless'],
    },
    nineteen89: {
      name: '1989',
      emoji: '🌆',
      color: 'from-sky-100 to-blue-50',
      accent: 'text-sky-600',
      tagline: '#FreshStart #CityLights #BrightSide',
      description:
        'You are the reinvention era — the clean slate, the new city, the bright chorus after a heavy chapter. You have learned to let criticism roll right off you and to surround yourself with friends who feel like a skyline: dazzling, loyal, and always up for something. Your optimism is polished but completely real; you genuinely believe the best chapter is the one starting right now.',
      strengths: ['Master of the fresh start', 'Lets negativity roll off', 'Builds a loyal circle anywhere', 'Bright energy on demand'],
      growth: 'Reinvention is your art form, but you do not have to outrun every hard feeling with a new chapter. Sometimes the glow-up is sitting still and letting it catch up.',
      kindred: ['reputation', 'lover'],
    },
    reputation: {
      name: 'Reputation',
      emoji: '🐍',
      color: 'from-slate-100 to-zinc-50',
      accent: 'text-slate-700',
      tagline: '#Unapologetic #Reborn #ArmorOn',
      description:
        'You are the era of unapologetic self-reinvention — the phoenix chapter, forged the day you stopped auditioning for other people\'s approval. Being underestimated or misjudged did not break you; it clarified you. Now you keep a small, fiercely trusted circle, guard your softness behind excellent armor, and let your results do all of the public speaking. The plot twist everyone misses: under the dark glitter, you love harder than anyone.',
      strengths: ['Immune to public opinion', 'Turns setbacks into fuel', 'Protects her circle fiercely', 'Loves hard behind the armor'],
      growth: 'The armor did its job — you made it through. But a few people have genuinely earned the drawbridge coming down, and letting them in is not a security breach.',
      kindred: ['midnights', 'nineteen89'],
    },
    lover: {
      name: 'Lover',
      emoji: '💗',
      color: 'from-pink-100 to-rose-50',
      accent: 'text-pink-600',
      tagline: '#OpenHearted #PastelSkies #ChooseSoft',
      description:
        'You are the era of choosing softness on purpose — not because you have never been hurt, but because you have, and you decided to keep your heart open anyway. You romanticize the everyday: golden light on the kitchen table, handwritten notes, celebrating your people loudly and often. Your warmth is not weakness; it is the most defiant thing about you.',
      strengths: ['Loves out loud', 'Finds magic in the everyday', 'Openhearted on purpose', 'Celebrates everyone around her'],
      growth: 'You pour into everyone else\'s cup and call whatever is left your share. Romanticize your own life first sometimes — the golden hour belongs to you too.',
      kindred: ['fearless', 'red'],
    },
    folklore: {
      name: 'Folklore / Evermore',
      emoji: '🌲',
      color: 'from-stone-100 to-gray-50',
      accent: 'text-stone-600',
      tagline: '#Introspective #Storyteller #CozyDepth',
      description:
        'You are the introspective storyteller — happiest a little way off from the noise, weaving meaning out of memory, imagination, and other people\'s half-told stories. You process the world by turning it into narrative, and your inner life is so vivid that solitude never feels empty to you. People often discover, years in, that the quiet one was paying the deepest attention all along.',
      strengths: ['Rich inner world', 'Sees the story in everything', 'Genuinely happy in solitude', 'Deeply perceptive'],
      growth: 'Not every feeling needs a final draft before it can be shared. Let people read the work-in-progress version of you sometimes.',
      kindred: ['midnights', 'red'],
    },
    midnights: {
      name: 'Midnights',
      emoji: '🌙',
      color: 'from-indigo-100 to-violet-50',
      accent: 'text-indigo-600',
      tagline: '#LateNightThoughts #GlitterAndGloom #SelfAware',
      description:
        'You are the 3 a.m. era — self-aware, a little sleepless, quietly replaying the moments that made you. You hold your contradictions out in the open: confident and doubting, glittering and moody, totally over it and still thinking about it. That midnight honesty is your superpower — you will admit the thing everyone else is hiding, which is exactly why people trust you with their own unvarnished selves.',
      strengths: ['Radically self-aware', 'At peace with contradictions', 'Honest about the messy parts', 'Late-night wisdom on tap'],
      growth: 'Reflection only helps when it eventually reaches a verdict. Some nights, close the case file and go to sleep — the morning has information too.',
      kindred: ['reputation', 'folklore'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'It\'s Friday night and you have zero obligations. What actually happens?',
      options: [
        { label: 'I host something warm — string lights, good snacks, everyone I love in one room', points: { lover: 2, fearless: 1 } },
        { label: 'Out in the city with my closest friends, feeling completely untouchable', points: { nineteen89: 2, reputation: 1 } },
        { label: 'Candle lit, rain sounds on, journaling something no one will ever read', points: { folklore: 2, midnights: 1 } },
        { label: 'A long drive, windows down, the loudest and most emotional playlist I own', points: { red: 2, debut: 1 } },
      ],
    },
    {
      id: 2,
      text: 'Someone underestimates you publicly. Your move:',
      options: [
        { label: 'Say nothing. Succeed so thoroughly that the silence does all the talking', points: { reputation: 2, midnights: 1 } },
        { label: 'Feel it deeply, write about it, and turn it into something beautiful', points: { red: 2, folklore: 1 } },
        { label: 'Laugh it off with my people — their opinion is the only poll that counts', points: { nineteen89: 2, lover: 1 } },
        { label: 'Stay kind and keep going. Sincerity outlasts snark every single time', points: { fearless: 2, debut: 1 } },
      ],
    },
    {
      id: 3,
      text: 'Your ideal romance feels like:',
      options: [
        { label: 'A storybook — big gestures, first dances, butterflies that never wear off', points: { fearless: 2, lover: 1 } },
        { label: 'A slow burn told in glances and inside jokes — half imagined, all consuming', points: { folklore: 2, red: 1 } },
        { label: 'Golden and easy — someone who feels like a warm kitchen on a Sunday morning', points: { lover: 2, debut: 1 } },
        { label: 'Magnetic and a little secret — we keep the world out and each other in', points: { reputation: 2, midnights: 1 } },
      ],
    },
    {
      id: 4,
      text: 'What time of day are you most yourself?',
      options: [
        { label: 'Golden hour, obviously — everything and everyone looks like a memory being made', points: { lover: 2, fearless: 1 } },
        { label: 'Well past midnight, when the thoughts finally get honest', points: { midnights: 2, reputation: 1 } },
        { label: 'Early morning — coffee outside, world still quiet, nobody performing anything yet', points: { debut: 2, folklore: 1 } },
        { label: 'The bright middle of the day, out in the world with my people', points: { nineteen89: 2 } },
      ],
    },
    {
      id: 5,
      text: 'Your friends call you when they need:',
      options: [
        { label: 'Someone to hype them into bravery — I make big leaps feel possible', points: { fearless: 2, nineteen89: 1 } },
        { label: 'Someone who will feel it WITH them at full volume, zero judgment', points: { red: 2, lover: 1 } },
        { label: 'Perspective from someone who has clearly already thought about this at 3 a.m.', points: { midnights: 2, folklore: 1 } },
        { label: 'A defender who will take their side to the end, receipts fully organized', points: { reputation: 2 } },
      ],
    },
    {
      id: 6,
      text: 'Pick a weekend aesthetic:',
      options: [
        { label: 'Flannel, a bonfire, someone\'s guitar, everybody singing badly and meaning it', points: { debut: 2, fearless: 1 } },
        { label: 'Scarves, falling leaves, and a bittersweet feeling I kind of enjoy having', points: { red: 2 } },
        { label: 'A cabin in the woods, a chunky cardigan, a novel, and at least one secret', points: { folklore: 2, midnights: 1 } },
        { label: 'City lights, something sparkly under my coat, a night we will retell for years', points: { nineteen89: 2, reputation: 1 } },
      ],
    },
    {
      id: 7,
      text: 'How do you handle a painful ending — a job, a relationship, a whole chapter?',
      options: [
        { label: 'Grieve it at full volume, then frame the memory like it belongs in a gallery', points: { red: 2, folklore: 1 } },
        { label: 'Reinvent: new look, new routine, new city energy, brand-new me', points: { nineteen89: 2, reputation: 1 } },
        { label: 'Go quiet for a while, reflect, and come back softer and wiser', points: { folklore: 2, lover: 1 } },
        { label: 'Come back bolder — the ending becomes the origin story', points: { reputation: 2, midnights: 1 } },
      ],
    },
    {
      id: 8,
      text: 'Your daydreams are mostly about:',
      options: [
        { label: 'The life I\'m hoping for — I can picture the whole fairytale in detail', points: { fearless: 2, lover: 1 } },
        { label: 'Entirely fictional lives — I invent whole characters, backstories included', points: { folklore: 2 } },
        { label: 'Replaying real moments and drafting the sharper comeback I should have said', points: { midnights: 2, red: 1 } },
        { label: 'Home — the people and places that made me, and making them proud', points: { debut: 2, fearless: 1 } },
      ],
    },
    {
      id: 9,
      text: 'Your texting style:',
      options: [
        { label: 'Voice memos with a full emotional narrative arc, sometimes in multiple parts', points: { red: 2, debut: 1 } },
        { label: 'Heart emojis, hype, and remembering every single person\'s big day', points: { lover: 2, fearless: 1 } },
        { label: 'Read at 2:14 a.m., answered at 2:47 a.m. with a startlingly honest paragraph', points: { midnights: 2, folklore: 1 } },
        { label: 'Curated and deliberate. You do not owe anyone an instant reply', points: { reputation: 2, nineteen89: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a personal motto:',
      options: [
        { label: 'Grow as far as you like — just never forget your roots', points: { debut: 2, folklore: 1 } },
        { label: 'Leap first. The net has a habit of appearing for the brave', points: { fearless: 2, nineteen89: 1 } },
        { label: 'Softness is a strength, not a weakness', points: { lover: 2, red: 1 } },
        { label: 'Let them say whatever they want — you know exactly who you are', points: { reputation: 2, midnights: 1 } },
      ],
    },
  ],
};
