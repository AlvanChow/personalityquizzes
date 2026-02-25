// ─────────────────────────────────────────────────────────────────────────────
// MBTI Results — comprehensive type profiles
// Inspired by 16personalities.com, Myers-Briggs research, and Jungian typology.
// ─────────────────────────────────────────────────────────────────────────────

export const mbtiRoles = {
  analysts: {
    name: 'Analysts',
    code: 'NT',
    emoji: '🔬',
    color: 'from-purple-100 to-indigo-100',
    accent: 'text-purple-700',
    types: ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
    description:
      'Analysts share the Intuitive (N) and Thinking (T) traits. They embrace rationality and impartiality, excelling in intellectual debate and strategic planning. They prize independence, creative problem-solving, and are driven by an insatiable thirst for knowledge. Analysts tend to question everything and are rarely satisfied with surface-level answers.',
  },
  diplomats: {
    name: 'Diplomats',
    code: 'NF',
    emoji: '🌿',
    color: 'from-green-100 to-emerald-100',
    accent: 'text-green-700',
    types: ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
    description:
      'Diplomats share the Intuitive (N) and Feeling (F) traits. They focus on empathy, cooperation, and the deeper meaning behind human interactions. Imaginative and idealistic, they gravitate toward helping others grow and building bridges between people. Diplomats see the world not just as it is, but as it could be.',
  },
  sentinels: {
    name: 'Sentinels',
    code: 'SJ',
    emoji: '🛡️',
    color: 'from-sky-100 to-blue-100',
    accent: 'text-sky-700',
    types: ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
    description:
      'Sentinels share the Sensing (S) and Judging (J) traits. They are practical, grounded, and internally motivated with a strong ability to achieve their goals. Sentinels offer stability and wisdom, tend to plan ahead, and value reliability, tradition, and clear structures. They are the backbone of every community and organisation.',
  },
  explorers: {
    name: 'Explorers',
    code: 'SP',
    emoji: '🧭',
    color: 'from-amber-100 to-orange-100',
    accent: 'text-amber-700',
    types: ['ISTP', 'ISFP', 'ESTP', 'ESFP'],
    description:
      'Explorers share the Sensing (S) and Perceiving (P) traits. They are characterised by independence, quick wit, and a talent for thinking on their feet. Flexible and adaptable, they thrive when stimulated and challenged. Explorers value freedom and spontaneity and are natural risk-takers who live fully in the present moment.',
  },
};

export const mbtiResults = {
  // ═══════════════════════════════════════════════════════════════════════════
  // ANALYSTS  (NT)
  // ═══════════════════════════════════════════════════════════════════════════

  INTJ: {
    name: 'INTJ',
    nickname: 'The Architect',
    emoji: '🏛️',
    color: 'from-sky-100 to-slate-100',
    accent: 'text-sky-700',
    role: 'analysts',
    population: '2%',
    description:
      'Strategic, independent, and quietly formidable. INTJs are relentless long-range thinkers who treat the world as a system to be understood and improved. They set impossibly high standards for themselves and others, and have a rare ability to turn complex visions into reality. Private by nature, they trust their own judgement above almost anything else — and are usually right to. Architects form just two percent of the population, and women of this personality type are especially rare. With their insatiable intellectual curiosity and decisive nature, they are among the most strategically capable of all types.',
    strengths: [
      {
        title: 'Rational',
        text: 'INTJs pride themselves on the power of their mind. They can reframe nearly any challenge as an opportunity to hone their rational thinking skills, devising inventive solutions to even the most arduous problems.',
      },
      {
        title: 'Informed',
        text: 'Few personality types are as devoted to developing well-researched, evidence-based opinions. Rather than hunches or half-baked assumptions, they base their conclusions on thorough research and analysis.',
      },
      {
        title: 'Independent',
        text: 'For INTJs, conformity is more or less synonymous with mediocrity. Creative and self-motivated, they strive to do things their own way and refuse to accept "because we\'ve always done it this way" as a reason.',
      },
      {
        title: 'Determined',
        text: 'INTJs are known for being ambitious and goal-oriented. They won\'t rest until they\'ve achieved their own definition of success, approaching challenges head on rather than taking the easy way out.',
      },
      {
        title: 'Curious',
        text: 'Open to new ideas — as long as those ideas are rational and evidence-based. They are especially drawn to offbeat or contrarian points of view, and if the facts prove them wrong, they are generally happy to revise their opinions.',
      },
      {
        title: 'Original',
        text: 'Their rebellious streak is responsible for some of history\'s most unconventional ideas and inventions. INTJs force the people around them to consider new and sometimes surprising ways of looking at things.',
      },
    ],
    weaknesses: [
      {
        title: 'Arrogant',
        text: 'INTJs might be knowledgeable, but they\'re not infallible. Their self-assurance can blind them to useful input from other people — especially anyone they deem to be intellectually inferior.',
      },
      {
        title: 'Dismissive of Emotions',
        text: 'For this type, rationality is king. But emotional context often matters more than they care to admit. INTJs can get impatient with anyone who seems to value feelings more than facts.',
      },
      {
        title: 'Overly Critical',
        text: 'They tend to have enormous self-control, particularly when it comes to thoughts and feelings. When others fail to match their level of restraint, INTJs can appear scathingly critical.',
      },
      {
        title: 'Combative',
        text: 'INTJs hate blindly following anything without understanding why. They can get caught up in arguing about rules and regulations — sometimes at the expense of more important matters.',
      },
      {
        title: 'Socially Detached',
        text: 'Their relentless rationality can lead to frustration in their social lives. Their efforts to defy expectations may leave them feeling isolated or disconnected from other people.',
      },
    ],
    famousPeople: ['Elon Musk', 'Friedrich Nietzsche', 'Michelle Obama', 'Isaac Newton', 'Nikola Tesla', 'Arnold Schwarzenegger', 'Jane Austen', 'Christopher Nolan'],
  },

  INTP: {
    name: 'INTP',
    nickname: 'The Logician',
    emoji: '🔬',
    color: 'from-teal-50 to-sky-100',
    accent: 'text-teal-700',
    role: 'analysts',
    population: '2.5%',
    description:
      'Endlessly curious, analytically precise, and genuinely unconventional. INTPs are natural theorists who are never satisfied with surface-level answers. They love untangling complex problems, questioning assumptions, and chasing ideas wherever they lead. Independent and intellectually restless, they thrive in abstract domains and are fascinated — sometimes obsessively — by how things truly work. Logicians pride themselves on their unique perspectives and vigorous intellect. They can\'t help but puzzle over the mysteries of the universe, which may explain why some of the most influential philosophers and scientists of all time have been INTPs.',
    strengths: [
      {
        title: 'Analytical',
        text: 'INTPs pride themselves on being logically accurate. They tend to study and analyse everything around them, be it complex mathematical formulas or human psychology, with laser-like precision.',
      },
      {
        title: 'Open-Minded',
        text: 'Driven by curiosity and an intense desire to learn, they are rarely afraid to shift their perspective — even in matters of politics, religion, and philosophy — when presented with compelling evidence.',
      },
      {
        title: 'Curious',
        text: 'Always casting about for new things to learn. One week they might be obsessed with geophysics, and the next they might lose themselves in videos about guitar building. When inspiration strikes, INTPs go all in.',
      },
      {
        title: 'Honest',
        text: 'INTPs care about the truth. Rather than taking comfort in ideology or received ideas, they want to understand what\'s really going on beneath the surface — and they expect others to be honest with them in return.',
      },
      {
        title: 'Innovative',
        text: 'Not all of their ideas are feasible, but their willingness to think outside the box can produce remarkable innovations. Their ideas are often ahead of their time.',
      },
    ],
    weaknesses: [
      {
        title: 'Disconnected',
        text: 'INTPs can get lost in their own train of thought even when they\'re with other people. After resurfacing with something to say, they may find that the conversation has moved on without them.',
      },
      {
        title: 'Insensitive',
        text: 'They see rationality as the key to a better world. At times, they may underestimate the importance of emotion, compassion, etiquette, and tradition, coming across as unkind even though their intentions are good.',
      },
      {
        title: 'Dissatisfied',
        text: 'Constantly on the lookout for problems to solve and new approaches to try. Taken too far, this mindset becomes overwhelming — constantly reinventing the wheel rather than reliably addressing needs.',
      },
      {
        title: 'Impatient',
        text: 'INTPs take pride in their knowledge and in sharing ideas. When it comes to explaining their rationale, however, they aren\'t always patient with those who can\'t keep up.',
      },
      {
        title: 'Perfectionistic',
        text: 'Their quest for perfection can get in the way. At times they get so lost in analysing options that they never reach a decision and fail to act on their brilliant ideas.',
      },
    ],
    famousPeople: ['Albert Einstein', 'Charles Darwin', 'Marie Curie', 'Abraham Lincoln', 'Carl Jung', 'Kristen Stewart', 'Bill Gates', 'Socrates'],
  },

  ENTJ: {
    name: 'ENTJ',
    nickname: 'The Commander',
    emoji: '⚡',
    color: 'from-amber-50 to-orange-100',
    accent: 'text-orange-700',
    role: 'analysts',
    population: '1.8%',
    description:
      'Bold, strategic, and almost magnetically decisive. ENTJs see inefficiency as an obstacle to be eliminated and lead with a clarity that others find either inspiring or terrifying. They think in systems, plan for the long game, and bring an unstoppable drive toward ambitious goals. Natural leaders, they excel at rallying others behind a shared vision — whether those others planned to be rallied or not. Commanders are one of the rarest personality types, but their presence is impossible to overlook. They don\'t just manage — they reshape the landscape around them.',
    strengths: [
      {
        title: 'Efficient',
        text: 'ENTJs see inefficiency not just as a problem, but as something that pulls time and energy away from future goals. They are masterful at streamlining processes and eliminating waste.',
      },
      {
        title: 'Energetic',
        text: 'They approach responsibilities with vigour and drive. The more they accomplish throughout the day, the more energised they feel. Busy schedules and complex challenges invigorate them.',
      },
      {
        title: 'Self-Confident',
        text: 'ENTJs trust in their abilities, believe in their capacity as leaders, and make their opinions known with conviction and clarity.',
      },
      {
        title: 'Strong-Willed',
        text: 'They don\'t give up when the going gets tough. ENTJs relentlessly strive to achieve their goals — nothing is quite as satisfying as accomplishing something they\'ve set their mind to.',
      },
      {
        title: 'Strategic Thinker',
        text: 'They exemplify the difference between crisis management and navigating the bigger plan. ENTJs examine every angle of a problem and think several moves ahead.',
      },
      {
        title: 'Charismatic',
        text: 'All their strengths combine to create individuals who are able to inspire and invigorate others, drawing people toward their vision with magnetic authority.',
      },
    ],
    weaknesses: [
      {
        title: 'Stubborn & Dominant',
        text: 'Sometimes their confidence goes too far — they are capable of digging in their heels, trying to win every debate, and pushing their vision to the exclusion of all others.',
      },
      {
        title: 'Intolerant',
        text: 'ENTJs are notoriously unsupportive of ideas that distract from their primary goals, and even more so of ideas based on emotional considerations rather than logic.',
      },
      {
        title: 'Impatient',
        text: 'Some people need more time to think — an intolerable delay to quick-thinking ENTJs. They may misinterpret contemplation as stupidity or disinterest.',
      },
      {
        title: 'Arrogant',
        text: 'They respect quick thoughts and firm convictions, and may look down on those who don\'t match up, creating friction with nearly every other personality type.',
      },
      {
        title: 'Poor Handling of Emotions',
        text: 'ENTJs can be distant from their own emotional expression and sometimes downright scornful of others\'. They may inadvertently trample others\' feelings.',
      },
    ],
    famousPeople: ['Steve Jobs', 'Margaret Thatcher', 'Napoleon Bonaparte', 'Franklin D. Roosevelt', 'Gordon Ramsay', 'Harrison Ford', 'Malcolm X', 'Garry Kasparov'],
  },

  ENTP: {
    name: 'ENTP',
    nickname: 'The Debater',
    emoji: '💡',
    color: 'from-yellow-50 to-amber-100',
    accent: 'text-amber-700',
    role: 'analysts',
    population: '3.2%',
    description:
      'Quick-witted, inventive, and delightfully provocative. ENTPs love a good argument — not to win, but to stress-test ideas from every angle. They\'re energised by intellectual sparring, resist routine with every fibre of their being, and thrive wherever they can challenge assumptions and reinvent the rules. They\'re the ones who ask "but why does it have to be done this way?" and actually mean it. With their flexible minds and accumulated knowledge, ENTPs can shift from idea to idea with astonishing ease, drawing unexpected connections and producing insights that others simply wouldn\'t reach.',
    strengths: [
      {
        title: 'Knowledgeable',
        text: 'ENTPs rarely pass up an opportunity to learn something new, especially abstract concepts. This information isn\'t usually absorbed for any planned purpose — they just find it fascinating.',
      },
      {
        title: 'Quick Thinker',
        text: 'They have tremendously flexible minds and can shift from idea to idea effortlessly, drawing on their accumulated knowledge to prove their points or find creative solutions.',
      },
      {
        title: 'Original',
        text: 'Having little attachment to tradition, ENTPs can discard existing systems and pull together disparate ideas from their extensive knowledge base into something entirely new.',
      },
      {
        title: 'Excellent Brainstormer',
        text: 'Nothing is quite as enjoyable to ENTPs as analysing problems from every angle to find the best solutions. They are irreplaceable in brainstorming sessions.',
      },
      {
        title: 'Charismatic',
        text: 'They have a way with words and wit that others find intriguing. Their confidence, quick thought, and ability to connect disparate ideas create a style of communication that is genuinely charming.',
      },
      {
        title: 'Energetic',
        text: 'When given a chance to examine an interesting problem, ENTPs can be truly impressive in their enthusiasm and energy, lighting up everyone around them.',
      },
    ],
    weaknesses: [
      {
        title: 'Very Argumentative',
        text: 'ENTPs enjoy the mental exercise of debating an idea — but more consensus-oriented types rarely appreciate the vigour with which they tear down beliefs and methods.',
      },
      {
        title: 'Insensitive',
        text: 'Being so rational, they often misjudge others\' feelings and push their debates past others\' tolerance levels. They don\'t consider emotional points to be valid in debates.',
      },
      {
        title: 'Intolerant',
        text: 'Unless people can back up their ideas in a round of mental sparring, ENTPs are likely to dismiss not just the ideas but the people themselves.',
      },
      {
        title: 'Difficulty Focusing',
        text: 'The same flexibility that allows such original ideas makes them readapt perfectly good ones far too often, jumping between projects before completion.',
      },
      {
        title: 'Dislike Practical Matters',
        text: 'ENTPs struggle with organisation, structure, and all things practical. They are interested in what could be — malleable concepts like ideas and plans that can be adapted and debated.',
      },
    ],
    famousPeople: ['Thomas Edison', 'Mark Twain', 'Benjamin Franklin', 'Leonardo da Vinci', 'Sacha Baron Cohen', 'Celine Dion', 'Tom Hanks', 'Robert Downey Jr.'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DIPLOMATS  (NF)
  // ═══════════════════════════════════════════════════════════════════════════

  INFJ: {
    name: 'INFJ',
    nickname: 'The Advocate',
    emoji: '🌟',
    color: 'from-violet-50 to-purple-100',
    accent: 'text-violet-700',
    role: 'diplomats',
    population: '1.5%',
    description:
      'Quietly visionary, deeply principled, and rarer than most people realise. INFJs combine genuine empathy with strategic thinking in a way that feels almost paradoxical. They have an uncanny ability to understand what drives people and use that understanding to create meaningful change. Private but intensely passionate, they work tirelessly for causes that align with their deeply held values — and will not be moved from them. As the rarest personality type, making up just 1–3% of the population, INFJs move through the world with a sense of purpose and idealism that can inspire everyone they touch.',
    strengths: [
      {
        title: 'Insightful',
        text: 'INFJs strive to move beyond superficiality and seek out the deeper truths in life. This gives them an almost uncanny ability to understand people\'s true motivations, feelings, and needs.',
      },
      {
        title: 'Principled',
        text: 'They tend to have strong beliefs and values, particularly when it comes to matters of ethics. When Advocates talk about topics close to their heart, their conviction and heartfelt idealism can inspire and persuade even the sternest of sceptics.',
      },
      {
        title: 'Passionate',
        text: 'INFJs crave a sense of purpose in life. Rather than living on autopilot or sticking to the status quo, they want to chase after their ideals and make a tangible difference in the world.',
      },
      {
        title: 'Altruistic',
        text: 'They aren\'t happy to succeed at another person\'s expense. Advocates want to use their strengths for the greater good and rarely lose sight of how their words and actions might affect others.',
      },
      {
        title: 'Creative',
        text: 'INFJs embrace their creative side, always on the lookout for opportunities to express themselves and think outside the box in deeply personal ways.',
      },
    ],
    weaknesses: [
      {
        title: 'Sensitive to Criticism',
        text: 'When someone challenges their most cherished principles or values, INFJs can become defensive or dismissive. They take critiques of their ideals very personally.',
      },
      {
        title: 'Reluctant to Open Up',
        text: 'Advocates value honesty and authenticity, but they\'re also intensely private. They may find it difficult to be vulnerable about their struggles, not wanting to burden someone else.',
      },
      {
        title: 'Perfectionistic',
        text: 'The Advocate personality type is all but defined by idealism. This doesn\'t always leave room for the messiness of real life, and they may fixate on imperfections rather than appreciating what they have.',
      },
      {
        title: 'Avoiding the Ordinary',
        text: 'INFJs yearn to do extraordinary things with their lives. But without breaking grand visions into small, manageable steps, they may struggle to turn their dreams into reality.',
      },
      {
        title: 'Prone to Burnout',
        text: 'Their perfectionism and reserve leave them with few options for letting off steam. INFJs can exhaust themselves if they don\'t balance their drive to help others with necessary self-care.',
      },
    ],
    famousPeople: ['Martin Luther King Jr.', 'Nelson Mandela', 'Mother Teresa', 'Lady Gaga', 'Morgan Freeman', 'Fyodor Dostoevsky', 'Plato', 'Cate Blanchett'],
  },

  INFP: {
    name: 'INFP',
    nickname: 'The Mediator',
    emoji: '🌿',
    color: 'from-green-50 to-teal-100',
    accent: 'text-green-700',
    role: 'diplomats',
    population: '4.4%',
    description:
      'Idealistic, deeply empathetic, and quietly creative. INFPs live with one foot in a richer inner world of meaning and possibility. Guided by their values above all else, they feel most alive when their work connects to something that matters. They are the ones who truly listen when others feel unseen, and who hold onto the belief that the world can be more beautiful than it currently is. Mediators are poetic, kind, and altruistic people, always eager to help a good cause. Although they may seem quiet or unassuming, they have vibrant, passionate inner lives and a deep well of creativity waiting to be expressed.',
    strengths: [
      {
        title: 'Empathetic',
        text: 'INFPs don\'t just care about those around them in an abstract sense — they can actually feel another person\'s emotions, from joy and elation to sorrow and regret, as if those feelings were their own.',
      },
      {
        title: 'Generous',
        text: 'They rarely enjoy succeeding at others\' expense. INFPs feel called to share the good things in their lives, give credit where it\'s due, and uplift the people around them.',
      },
      {
        title: 'Open-Minded',
        text: 'Tolerant and accepting, INFPs try not to judge anyone else\'s beliefs, lifestyles, or decisions. They live and let live, trusting others to find their own path.',
      },
      {
        title: 'Creative',
        text: 'INFPs love to see things from unconventional perspectives, and many are drawn to creative pursuits. This personality type is well represented among writers, artists, and musicians.',
      },
      {
        title: 'Passionate',
        text: 'INFPs contain a deep well of passion, driven by their profound empathy, strong internal values, and ceaseless curiosity about the human experience.',
      },
    ],
    weaknesses: [
      {
        title: 'Unrealistic',
        text: 'Nothing in this world is perfect, and that can be a difficult truth for INFPs. They can be hopeless romantics with rose-coloured visions of what their lives should be like.',
      },
      {
        title: 'Self-Isolating',
        text: 'INFPs long to connect with others but don\'t always know how. Especially in new environments, they may be reluctant to put themselves out there, sometimes ending up lonely or isolated.',
      },
      {
        title: 'Unfocused',
        text: 'Their imaginative, introspective nature doesn\'t always lend itself to productivity. They can get so caught up in different ideas and ideals that they fail to commit to a course of action.',
      },
      {
        title: 'Emotionally Vulnerable',
        text: 'Unless they establish boundaries, they can absorb other people\'s negative moods or attitudes, which can be detrimental to their personal peace and productivity.',
      },
      {
        title: 'Too Eager to Please',
        text: 'Conflict tends to be stressful for INFPs, who yearn for harmony and acceptance. They may become fixated on trying to clear the air whenever someone dislikes or disapproves of them.',
      },
    ],
    famousPeople: ['William Shakespeare', 'J.R.R. Tolkien', 'Princess Diana', 'Johnny Depp', 'Kurt Cobain', 'Edgar Allan Poe', 'John Lennon', 'Audrey Hepburn'],
  },

  ENFJ: {
    name: 'ENFJ',
    nickname: 'The Protagonist',
    emoji: '🌸',
    color: 'from-rose-50 to-pink-100',
    accent: 'text-rose-700',
    role: 'diplomats',
    population: '2.5%',
    description:
      'Charismatic, empathetic, and born to inspire. ENFJs see the potential in others — often before those people see it themselves — and work hard to help them get there. Warm, persuasive and visionary, they find deep fulfilment in helping people grow. People are naturally drawn to their genuine warmth and their ability to make every person feel like the most important one in the room. Protagonists are natural-born leaders, full of passion and charisma, and they are motivated not by power or status but by a desire to see others succeed and the world improve.',
    strengths: [
      {
        title: 'Receptive',
        text: 'ENFJs have strong opinions, but they\'re far from closed-minded. They recognise the importance of allowing others to express themselves fully and are genuinely interested in other viewpoints.',
      },
      {
        title: 'Reliable',
        text: 'Few things bother ENFJs more than the prospect of letting down a person or cause that they believe in. People with this personality type can be counted on to see their promises and responsibilities through.',
      },
      {
        title: 'Passionate',
        text: 'When ENFJs believe in something, they throw all of their time and energy behind it. They light up when talking about their passions, and that energy is infectious.',
      },
      {
        title: 'Altruistic',
        text: 'They are known for their desire to be a force for positive change. Their genuine interest in other people\'s well-being allows them to pick up on the subtlest shifts in mood and motivation.',
      },
      {
        title: 'Charismatic',
        text: 'Determined and inspiring, ENFJs find ways to channel their energy into getting things done. Their natural confidence and authority make people want to listen and follow.',
      },
    ],
    weaknesses: [
      {
        title: 'Unrealistic',
        text: 'Many ENFJs put pressure on themselves to right every wrong that they encounter. But no matter how hard they try, it just isn\'t realistic for them to solve everyone\'s problems.',
      },
      {
        title: 'Overly Idealistic',
        text: 'ENFJs tend to have clear ideas about what\'s right and wrong. They sometimes think that everyone shares these fundamental values and may be genuinely shocked when people violate them.',
      },
      {
        title: 'Condescending',
        text: 'ENFJs enjoy teaching others, especially about the causes they believe in. But sometimes they try to "fix" people who didn\'t ask for help or guidance, coming across as patronising.',
      },
      {
        title: 'Intense',
        text: 'When it comes to self-improvement, ENFJs may lose sight of the fact that no one is perfect. If they don\'t learn to take a step back, they can exhaust themselves and others.',
      },
      {
        title: 'Overly Empathetic',
        text: 'Compassion is among this personality type\'s greatest strengths. But feeling others\' emotions so viscerally can lead to emotional burnout and difficulty making tough decisions.',
      },
    ],
    famousPeople: ['Barack Obama', 'Oprah Winfrey', 'Martin Luther King Jr.', 'Maya Angelou', 'Ben Affleck', 'Malala Yousafzai', 'John Cusack', 'Demi Lovato'],
  },

  ENFP: {
    name: 'ENFP',
    nickname: 'The Campaigner',
    emoji: '🦋',
    color: 'from-coral-50 to-peach-100',
    accent: 'text-coral-600',
    role: 'diplomats',
    population: '8.1%',
    description:
      'Enthusiastic, creative, and infectiously alive. ENFPs move through the world with boundless energy and a deep, genuine belief in human potential. They see connections everywhere, are full of ideas, and come most alive when they\'re exploring possibilities and bringing others along for the journey. Authentic and wonderfully spontaneous, they can turn any situation into something memorable. Campaigners are enthusiastic, creative, and sociable free spirits who can always find a reason to smile. Their warm energy, combined with their perceptiveness and good-natured spirit, makes them some of the most well-liked people you\'ll ever meet.',
    strengths: [
      {
        title: 'Curious',
        text: 'ENFPs can find beauty and fascination in nearly anything. Imaginative and open-minded, they aren\'t afraid to venture beyond their comfort zone in search of new ideas, experiences, and adventures.',
      },
      {
        title: 'Perceptive',
        text: 'To ENFPs, no one is unimportant — which explains how they can pick up on even the subtlest shifts in another person\'s mood or expression and respond with remarkable sensitivity.',
      },
      {
        title: 'Excellent Communicator',
        text: 'They brim with things to say but can be caring listeners as well. This gives them a nearly unmatched ability to have positive and enjoyable conversations with all sorts of people.',
      },
      {
        title: 'Easygoing',
        text: 'ENFPs may live for deep, meaningful conversations, but they can also be spontaneous and lighthearted, knowing how to find fun and joy in the present moment.',
      },
      {
        title: 'Good-Natured',
        text: 'They are warmhearted and approachable, with an altruistic spirit and a friendly disposition. Their circles of acquaintances and friends often stretch far and wide.',
      },
    ],
    weaknesses: [
      {
        title: 'People-Pleasing',
        text: 'Most ENFPs are uncomfortable with the prospect of being disliked. To maintain the peace, they may compromise on things that matter to them or allow others to treat them poorly.',
      },
      {
        title: 'Unfocused',
        text: 'ENFPs are known for having ever-evolving interests, meaning they may find it challenging to maintain discipline and focus over the long term on any single project.',
      },
      {
        title: 'Disorganised',
        text: 'Their focus on the big picture can overshadow their attention to everyday practical matters, and they may try to avoid routine tasks they view as boring.',
      },
      {
        title: 'Overly Accommodating',
        text: 'ENFPs feel called to uplift others and may find themselves saying yes whenever anyone asks for help. Unless they set boundaries, they can become overcommitted.',
      },
      {
        title: 'Overly Optimistic',
        text: 'Their rosy outlook can lead to well-intentioned but naive decisions — believing people who haven\'t earned their trust or overlooking genuine red flags.',
      },
    ],
    famousPeople: ['Robin Williams', 'Robert Downey Jr.', 'Quentin Tarantino', 'Will Smith', 'Ellen DeGeneres', 'Walt Disney', 'Oscar Wilde', 'Mark Twain'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SENTINELS  (SJ)
  // ═══════════════════════════════════════════════════════════════════════════

  ISTJ: {
    name: 'ISTJ',
    nickname: 'The Logistician',
    emoji: '📋',
    color: 'from-slate-50 to-gray-100',
    accent: 'text-slate-700',
    role: 'sentinels',
    population: '11.6%',
    description:
      'Reliable, meticulous, and quietly essential. ISTJs are the backbone of any organisation or household — they do what they say they\'ll do, when they said they\'d do it, and to a higher standard than anyone asked for. They have a deep respect for tradition and proven methods and deliver consistently, no matter the circumstances. The quiet ones who make everything work. In their families and communities, ISTJs earn respect for their reliability, practicality, and their ability to stay grounded and logical even in the most stressful situations. They mean what they say and say what they mean.',
    strengths: [
      {
        title: 'Honest & Direct',
        text: 'ISTJs mean what they say and say what they mean. When they commit to doing something, they make sure to follow through. Integrity is not an aspiration — it\'s a default.',
      },
      {
        title: 'Responsible',
        text: 'They rarely hesitate to take responsibility for their actions and choices. ISTJs are quick to own up to their mistakes, admitting the truth even if it doesn\'t make them look good.',
      },
      {
        title: 'Calm & Reliable',
        text: 'Rather than being impulsive or spontaneous, they take a measured, consistent approach. ISTJs stay grounded and logical even in the most stressful situations.',
      },
      {
        title: 'Dutiful',
        text: 'ISTJs have a deep respect for structure, tradition, and proven methods. Their strong work ethic and sense of duty make them exceptionally reliable in every role they take on.',
      },
      {
        title: 'Detail-Oriented',
        text: 'They pay close attention to the specifics that others miss. This meticulousness ensures that the work they do is thorough, accurate, and of the highest quality.',
      },
    ],
    weaknesses: [
      {
        title: 'Stubborn',
        text: 'Facts are facts, and ISTJs tend to resist change and new methods that haven\'t been proven to work. They can be overly attached to the way things have always been done.',
      },
      {
        title: 'Judgemental',
        text: 'They can sometimes unfairly judge people who don\'t match their rigorous self-control — suspecting laziness or dishonesty when others are simply coping with different challenges.',
      },
      {
        title: 'Insensitive',
        text: 'ISTJs are very good at setting their feelings aside, but they may say and do things that are devastating to more emotionally attuned people without realising the impact.',
      },
      {
        title: 'Always by the Book',
        text: 'Their respect for rules and established authority can make them inflexible. ISTJs may struggle in situations that require creative improvisation or bending the rules.',
      },
      {
        title: 'Prone to Self-Blame',
        text: 'Their strong work ethic means they routinely shoulder other people\'s responsibilities. They can end up exhausted and discouraged when constantly expected to pick up the slack.',
      },
    ],
    famousPeople: ['George Washington', 'Queen Elizabeth II', 'Warren Buffett', 'Angela Merkel', 'Jeff Bezos', 'Natalie Portman', 'Denzel Washington', 'Sting'],
  },

  ISFJ: {
    name: 'ISFJ',
    nickname: 'The Defender',
    emoji: '🛡️',
    color: 'from-sky-50 to-blue-100',
    accent: 'text-sky-700',
    role: 'sentinels',
    population: '13.8%',
    description:
      'Warm, conscientious, and devotedly loyal. ISFJs are the people who remember your birthday, check in when you\'re struggling, and quietly rearrange their day to help someone who needs it. They show their affection through acts of care and take their responsibilities seriously. Private and modest, they are one of the most reliably generous types — always there when it actually matters. Hardworking and devoted, ISFJs feel a deep sense of responsibility to those around them and can be counted on to meet deadlines, remember special occasions, uphold traditions, and shower their loved ones with care and support.',
    strengths: [
      {
        title: 'Supportive',
        text: 'ISFJs are the ultimate supporters. They genuinely care about other people\'s wellbeing and work tirelessly to ensure those around them feel comfortable and cared for.',
      },
      {
        title: 'Reliable',
        text: 'One of the greatest ISFJ strengths is loyalty. They rarely allow a friendship or relationship to fade from lack of effort, investing a great deal of energy into maintaining strong connections.',
      },
      {
        title: 'Observant',
        text: 'Despite their reserve, ISFJs have well-developed people skills and an excellent eye for detail. They notice what others miss and remember what others forget.',
      },
      {
        title: 'Hardworking',
        text: 'They can be meticulous to the point of perfectionism. ISFJs take their responsibilities seriously, consistently going above and beyond to exceed others\' expectations.',
      },
      {
        title: 'Patient',
        text: 'ISFJs are unlikely to demand instant gratification. They work at a steady, consistent pace and bring a nurturing patience to relationships and responsibilities alike.',
      },
    ],
    weaknesses: [
      {
        title: 'Overly Humble',
        text: 'Despite their hard work and consistency, ISFJs rarely seek the spotlight. This humility can lead to their contributions going unnoticed and unappreciated.',
      },
      {
        title: 'Resistant to Change',
        text: 'ISFJs often find change difficult — particularly when it\'s sudden or involves unfamiliar territory. They are among the types most likely to feel stressed by last-minute changes.',
      },
      {
        title: 'Repressing Feelings',
        text: 'While they enjoy recognition, ISFJs tend to downplay their needs and repress their feelings until resentment builds silently over time.',
      },
      {
        title: 'Overcommitted',
        text: 'ISFJs have genuine difficulty saying no. Their default is to accommodate, which can lead to exhaustion and quiet bitterness when no one notices the cost.',
      },
      {
        title: 'Too Altruistic',
        text: 'ISFJs\' desire to help others can lead to neglecting their own needs. They struggle to ask for help because admitting need feels like failure.',
      },
    ],
    famousPeople: ['Beyoncé', 'Kate Middleton', 'Aretha Franklin', 'Vin Diesel', 'Halle Berry', 'Anne Hathaway', 'Selena Gomez', 'Dr. Watson (Sherlock Holmes)'],
  },

  ESTJ: {
    name: 'ESTJ',
    nickname: 'The Executive',
    emoji: '💼',
    color: 'from-amber-50 to-yellow-100',
    accent: 'text-amber-700',
    role: 'sentinels',
    population: '8.7%',
    description:
      'Organised, decisive, and genuinely effective. ESTJs believe in clear rules, hard work and getting things done the right way. They\'re excellent at managing people and systems, bring order wherever they go, and take their commitments seriously to the point of taking others\' lack of commitment personally. Direct, grounded and dependable — they are who you call when something needs to actually happen. ESTJs strive to create order and security in their environments by establishing rules, structures, and clear roles. They lead by example and expect others to follow suit.',
    strengths: [
      {
        title: 'Dedicated',
        text: 'Seeing things to completion borders on an ethical obligation for ESTJs. Tasks aren\'t abandoned because they\'ve become difficult or boring — they refuse to cut corners or shirk responsibilities.',
      },
      {
        title: 'Strong-Willed',
        text: 'A powerful will makes this dedication possible. ESTJs don\'t give up their beliefs because of simple opposition — they defend their ideas and principles relentlessly.',
      },
      {
        title: 'Honest & Direct',
        text: 'ESTJs work to exemplify truthfulness and reliability, considering stability and security very important. When they say they\'ll do something, they keep their word — always.',
      },
      {
        title: 'Organised',
        text: 'They strive to create order and security in their environments by establishing rules, structures, and clear roles. Chaos is the enemy; systems are the solution.',
      },
      {
        title: 'Natural Leader',
        text: 'A commitment to truth and clear standards makes ESTJs capable and confident leaders who command respect through competence, not intimidation.',
      },
    ],
    weaknesses: [
      {
        title: 'Inflexible',
        text: 'The problem with being so fixated on what works is that ESTJs too often dismiss what might work better. They are reluctant to trust new approaches long enough for them to prove themselves.',
      },
      {
        title: 'Uncomfortable with Change',
        text: 'They are strong adherents to tradition. When suddenly forced to try unvetted solutions, ESTJs become uncomfortable and stressed.',
      },
      {
        title: 'Judgemental',
        text: 'ESTJs have strong convictions about what is right, wrong, and socially acceptable — sometimes ignoring the possibility that there is more than one right way to get things done.',
      },
      {
        title: 'Difficulty Relaxing',
        text: 'Their need to maintain dignity can make it difficult for ESTJs to cut loose. They can get so caught up in facts and methods that they forget to express emotions and just be human.',
      },
      {
        title: 'Difficulty Expressing Emotion',
        text: 'This can be their most challenging weakness — being so focused on efficiency and correctness that emotional intelligence and vulnerability feel like liabilities.',
      },
    ],
    famousPeople: ['Sonia Sotomayor', 'John D. Rockefeller', 'Judge Judy', 'Lyndon B. Johnson', 'Dr. Phil', 'Vince Lombardi', 'Martha Stewart', 'Frank Sinatra'],
  },

  ESFJ: {
    name: 'ESFJ',
    nickname: 'The Consul',
    emoji: '🤝',
    color: 'from-peach-50 to-rose-100',
    accent: 'text-rose-600',
    role: 'sentinels',
    population: '12.3%',
    description:
      'Caring, sociable, and the natural glue of any group. ESFJs are deeply invested in the wellbeing of those around them, thrive in social settings and love bringing people together. Attentive and generous, they feel fulfilled when their community is thriving. Loyal and conscientious, they\'re the first to notice when someone is struggling and the first to quietly do something about it. Consuls naturally offer others security and stability, and they seek out harmony and care deeply about other people\'s feelings. They are social, confident, and generally well-liked, with a strong sense of belonging.',
    strengths: [
      {
        title: 'Caring',
        text: 'ESFJs are excellent at making sure that those close to them are well cared for. They enjoy the routine of day-to-day tasks that keep their loved ones comfortable and happy.',
      },
      {
        title: 'Loyal',
        text: 'They have a strong sense of responsibility and always strive to meet their obligations, making them hardworking and dependable in the workplace and deeply loyal in personal relationships.',
      },
      {
        title: 'Sensitive to Others',
        text: 'ESFJs naturally seek out harmony and care deeply about other people\'s feelings, being careful not to offend or hurt others. They notice emotional shifts that others miss.',
      },
      {
        title: 'Sociable',
        text: 'They are social, confident, and generally well-liked. ESFJs have no problem with small talk or following social cues, and they genuinely enjoy creating connections between people.',
      },
      {
        title: 'Good at Connecting',
        text: 'ESFJs have a strong need to "belong" and they excel at building communities, organising events, and making everyone feel included and valued.',
      },
    ],
    weaknesses: [
      {
        title: 'Worried about Social Status',
        text: 'ESFJs can become preoccupied with social status and influence, potentially limiting their creativity and open-mindedness. They may tie too much of their identity to others\' expectations.',
      },
      {
        title: 'Inflexible',
        text: 'They place a lot of importance on what is socially acceptable and can be very cautious, even critical, of anything unconventional or outside the mainstream.',
      },
      {
        title: 'Vulnerable to Criticism',
        text: 'ESFJs can become very defensive and hurt if someone criticises their habits, beliefs, or traditions. Negative feedback hits them harder than most types.',
      },
      {
        title: 'Needy',
        text: 'They need to hear and see a great deal of appreciation. If their efforts go unnoticed, ESFJs may start fishing for compliments to get reassurance of how much they are valued.',
      },
      {
        title: 'Selfless to a Fault',
        text: 'ESFJs can people-please to the point of losing their own preferences. Their self-worth can become tightly bound to others\' approval, making exclusion or conflict feel devastating.',
      },
    ],
    famousPeople: ['Taylor Swift', 'Bill Clinton', 'Jennifer Garner', 'Ed Sheeran', 'Danny Glover', 'Tyra Banks', 'Larry King', 'Jennifer Lopez'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPLORERS  (SP)
  // ═══════════════════════════════════════════════════════════════════════════

  ISTP: {
    name: 'ISTP',
    nickname: 'The Virtuoso',
    emoji: '🔧',
    color: 'from-zinc-50 to-slate-100',
    accent: 'text-slate-600',
    role: 'explorers',
    population: '5.4%',
    description:
      'Observant, hands-on and coolly effective. ISTPs are natural problem-solvers who trust their instincts and their hands in equal measure. They\'re happiest when taking something apart to understand exactly how it works, or applying real skill to a tangible challenge. Independent, adaptable and remarkably calm under pressure — they act decisively when it counts and rarely waste time on what doesn\'t. Virtuosos are bold and practical experimenters, masters of all kinds of tools. They approach their environments with a flexible logic, looking for practical solutions to the problems at hand.',
    strengths: [
      {
        title: 'Optimistic & Energetic',
        text: 'ISTPs are usually up to their elbows in some project or another. Curious and hands-on, they approach the world with cheerful pragmatism and an infectious sense of "let\'s just try it."',
      },
      {
        title: 'Creative & Practical',
        text: 'They love finding novel solutions and creating things that have real, tangible applications. ISTPs combine imagination with utility in a way few other types can match.',
      },
      {
        title: 'Spontaneous',
        text: 'ISTPs know how to prioritise and can switch gears at a moment\'s notice. This makes them adaptable and able to go with the flow while others are still processing the change.',
      },
      {
        title: 'Rational',
        text: 'They cut through distractions and get right to the heart of an issue. ISTPs base their decisions on facts and direct observation, keeping emotion out of the equation.',
      },
      {
        title: 'Cool Under Pressure',
        text: 'ISTPs are known for their ability to stay calm in emergencies and chaotic situations. Their composure under stress makes them natural first responders and crisis managers.',
      },
    ],
    weaknesses: [
      {
        title: 'Stubborn',
        text: 'Once an ISTP has made up their mind, convincing them to change direction can be an uphill battle. They trust their own experience above external advice.',
      },
      {
        title: 'Insensitive',
        text: 'ISTPs use logic as their primary guide, and emotional arguments rarely sway them. This can make them seem cold or dismissive of other people\'s feelings.',
      },
      {
        title: 'Private & Reserved',
        text: 'ISTPs are notoriously hard to get to know. They keep their personal life locked down tight and may pull away just when relationships start to deepen.',
      },
      {
        title: 'Easily Bored',
        text: 'Once an ISTP has figured out how something works, their interest can drop dramatically. They move on to the next challenge, sometimes leaving projects and people behind.',
      },
      {
        title: 'Risk-Prone',
        text: 'Their love of hands-on experience can lead ISTPs to escalate in situations where a more measured approach would be wiser. Thrill-seeking can shade into recklessness.',
      },
    ],
    famousPeople: ['Clint Eastwood', 'Bear Grylls', 'Bruce Lee', 'Amelia Earhart', 'Michael Jordan', 'Olivia Wilde', 'Tom Cruise', 'James Dean'],
  },

  ISFP: {
    name: 'ISFP',
    nickname: 'The Adventurer',
    emoji: '🎨',
    color: 'from-mint-50 to-teal-100',
    accent: 'text-teal-600',
    role: 'explorers',
    population: '8.8%',
    description:
      'Gentle, open and quietly expressive. ISFPs experience the world through their senses and live in the present with quiet intensity. They have a deep aesthetic sensibility — often creative in understated, personal ways — and a fierce loyalty to their own values even while being flexible about almost everything else. They resist labels, defy expectations and prefer to let their actions speak for them. Adventurers are flexible and charming artists, always ready to explore and experience something new. They are charming, curious, sensitive, and always on the lookout for new experiences.',
    strengths: [
      {
        title: 'Charming',
        text: 'ISFPs are relaxed and warm, and their live-and-let-live attitude naturally makes them likeable and popular. They are effortlessly charming in an understated way.',
      },
      {
        title: 'Sensitive to Others',
        text: 'They easily relate to others\' emotions, helping them establish harmony and goodwill. ISFPs feel the emotional temperature of a room with uncanny accuracy.',
      },
      {
        title: 'Imaginative',
        text: 'ISFPs use creativity and insight to construct bold and beautiful ideas, expressing things in ways that move people on a visceral level.',
      },
      {
        title: 'Passionate',
        text: 'Beneath their quiet exterior lies a vibrant passion that comes alive when ISFPs are engaged in things that capture their hearts, be it art, nature, or the people they love.',
      },
      {
        title: 'Curious',
        text: 'Ideas are well and good, but ISFPs need to see and explore for themselves whether their ideas ring true. They approach the world with an open, exploratory spirit.',
      },
    ],
    weaknesses: [
      {
        title: 'Fiercely Independent',
        text: 'Freedom of expression is their top priority. Anything that interferes with that — including well-meaning regulations or supervisors — can make ISFPs feel deeply constrained.',
      },
      {
        title: 'Unpredictable',
        text: 'ISFPs dislike long-term commitments and plans. Their tendency to actively avoid planning for the future can cause strain with more structured personality types.',
      },
      {
        title: 'Easily Stressed',
        text: 'They live in the present, and sustained pressure or conflict can overwhelm them quickly. ISFPs may shut down rather than confront what\'s stressing them.',
      },
      {
        title: 'Overly Competitive',
        text: 'ISFPs can escalate small things into intense competitions, turning friendly debates into something more serious than intended, especially when their values are challenged.',
      },
      {
        title: 'Low Self-Esteem',
        text: 'ISFPs\' humility and conflict avoidance can translate into not standing up for their own needs. They often undervalue themselves and their contributions.',
      },
    ],
    famousPeople: ['Bob Dylan', 'Frida Kahlo', 'Michael Jackson', 'Lana Del Rey', 'David Bowie', 'Jimi Hendrix', 'Rihanna', 'Marilyn Monroe'],
  },

  ESTP: {
    name: 'ESTP',
    nickname: 'The Entrepreneur',
    emoji: '🚀',
    color: 'from-orange-50 to-coral-100',
    accent: 'text-orange-700',
    role: 'explorers',
    population: '4.3%',
    description:
      'Bold, perceptive and energised by action. ESTPs thrive in fast-moving situations where they can think on their feet and make things happen. They have a sharp eye for opportunity, easy confidence in social settings and a gift for getting people moving. Practical and adaptable, they\'d always rather act than theorise — and when they act, things tend to happen surprisingly quickly. Entrepreneurs are smart, energetic, and very perceptive people who truly enjoy living on the edge. They see an opportunity — to fix a problem, to advance, to have fun — and they seize it without hesitation.',
    strengths: [
      {
        title: 'Bold',
        text: 'ESTPs are full of life and energy. There is no greater joy for them than pushing boundaries and discovering and using new things and ideas. They are the first to jump in.',
      },
      {
        title: 'Rational & Practical',
        text: 'They love knowledge and philosophy, but not for their own sake. What\'s fun for ESTPs is finding ideas that are actionable and drilling into the details so they can actually put them to use.',
      },
      {
        title: 'Original',
        text: 'Combining boldness and practicality, ESTPs love to experiment with new ideas and solutions. They put things together in ways that nobody else would think to.',
      },
      {
        title: 'Perceptive',
        text: 'This originality is helped by their ability to notice changes in situations and people. ESTPs pick up on hidden thoughts and motives where most types would be oblivious.',
      },
      {
        title: 'Direct',
        text: 'This perceptiveness isn\'t used for mind games — ESTPs prefer to communicate clearly, with direct and factual questions and answers. Things are what they are.',
      },
      {
        title: 'Sociable',
        text: 'ESTPs are people of action with an eye for quality, and these qualities make them natural group leaders. They are always aware of their environment and flexible in their approach.',
      },
    ],
    weaknesses: [
      {
        title: 'Impatient',
        text: 'ESTPs move at their own pace to keep things exciting. Slowing down because someone "doesn\'t get it" or having to focus on a single detail for too long is genuinely painful.',
      },
      {
        title: 'Risk-Prone',
        text: 'Impatience can push ESTPs into uncharted territory without thinking of long-term consequences. They sometimes combat boredom with extra risk, escalating situations unnecessarily.',
      },
      {
        title: 'Unstructured',
        text: 'Living in the moment can cause ESTPs to miss the forest for the trees. They love solving problems here and now — perhaps too much, neglecting long-term planning entirely.',
      },
      {
        title: 'May Miss the Bigger Picture',
        text: 'Their action-first approach means ESTPs can barrel into problems without considering how their actions fit into a larger strategy or affect people down the line.',
      },
      {
        title: 'Defiant',
        text: 'ESTPs won\'t be boxed in. Repetition, hard-line rules, and sitting quietly while being lectured at are not something they will tolerate — they want to be where the action is.',
      },
    ],
    famousPeople: ['Ernest Hemingway', 'Madonna', 'Donald Trump', 'Eddie Murphy', 'Jack Nicholson', 'Samuel L. Jackson', 'Winston Churchill', 'Megan Fox'],
  },

  ESFP: {
    name: 'ESFP',
    nickname: 'The Entertainer',
    emoji: '🎉',
    color: 'from-rose-50 to-peach-100',
    accent: 'text-rose-600',
    role: 'explorers',
    population: '8.5%',
    description:
      'Spontaneous, playful and genuinely warm. ESFPs are born for the moment — full of joy, energy and a gift for making everything around them more alive. They love people, embrace experience with open arms and turn ordinary moments into ones people remember. Generous and fun to be around, they live fully and remind everyone else to do the same. Entertainers are spontaneous, energetic, and enthusiastic people — life is never boring around them. They encourage others to participate in shared activities and get the most out of every moment.',
    strengths: [
      {
        title: 'Bold',
        text: 'ESFPs aren\'t known for holding back. Copy-pasted experiences aren\'t enough — they want to explore, experiment, and find their own way. Rules are made to be bent.',
      },
      {
        title: 'Original',
        text: 'Traditions and expectations are secondary to ESFPs, if they are aware of them at all. They love experimenting with new styles and constantly finding new ways to stand out.',
      },
      {
        title: 'Aesthetically Aware',
        text: 'From fashion to home decor, ESFPs have an eye for beauty. They are in touch with their senses and know what looks, feels, tastes, and sounds good.',
      },
      {
        title: 'Practical',
        text: 'ESFPs don\'t get lost in abstractions. They prefer to engage with hands-on problems that produce tangible, visible results — and they\'re very good at it.',
      },
      {
        title: 'Observant',
        text: 'With all this focus on the here and now, ESFPs are excellent at noticing real changes as they happen. They pick up on social cues and environmental shifts with ease.',
      },
      {
        title: 'Excellent People Skills',
        text: 'ESFPs are talkative, witty, and love being the centre of attention. They have an infectious energy that makes people feel welcome and engaged.',
      },
    ],
    weaknesses: [
      {
        title: 'Sensitive',
        text: 'ESFPs are strongly emotional, and very vulnerable to criticism — they can feel like they\'ve been backed into a corner, sometimes reacting badly to feedback.',
      },
      {
        title: 'Conflict-Averse',
        text: 'They sometimes ignore and avoid conflict entirely. They tend to say and do what\'s needed to get out of uncomfortable situations, rather than dealing with the root cause.',
      },
      {
        title: 'Easily Bored',
        text: 'Without constant excitement, ESFPs find ways to create it themselves. Risky behaviour, self-indulgence, and short-term thinking can become an issue.',
      },
      {
        title: 'Poor Long-Term Focus',
        text: 'ESFPs rarely make detailed plans for the future, preferring to let things come as they may. This can cause challenges with savings, career advancement, and long-term goals.',
      },
      {
        title: 'Unfocused',
        text: 'Anything that requires long-term dedication and focus is a particular challenge for ESFPs. In academics, dense theoretical subjects are much more difficult for them.',
      },
    ],
    famousPeople: ['Adele', 'Marilyn Monroe', 'Jamie Oliver', 'Miley Cyrus', 'Steve Irwin', 'Jamie Foxx', 'Nicki Minaj', 'Adam Levine'],
  },
};

/**
 * Derives the MBTI 4-letter type from normalised dimension scores (0–100)
 * and returns the matching result object.
 *
 * @param {{ IE: number, SN: number, TF: number, JP: number }} scores
 * @returns {object} The matching entry from mbtiResults
 */
export function getMBTIResult(scores) {
  const IorE = scores.IE < 50 ? 'I' : 'E';
  const SorN = scores.SN < 50 ? 'S' : 'N';
  const TorF = scores.TF < 50 ? 'T' : 'F';
  const JorP = scores.JP < 50 ? 'J' : 'P';
  const type = IorE + SorN + TorF + JorP;
  return mbtiResults[type];
}

/**
 * Returns the role object for a given 4-letter MBTI type.
 */
export function getMBTIRole(typeName) {
  const result = mbtiResults[typeName];
  if (!result) return null;
  return mbtiRoles[result.role];
}
