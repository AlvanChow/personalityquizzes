// Which Disney Hero Are You? — 'pick' mode quiz.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'disney',
  mode: 'pick',
  resultsHeading: 'Your hero match breakdown',

  results: {
    moana: {
      name: 'Moana',
      emoji: '🌊',
      color: 'from-cyan-100 to-teal-50',
      accent: 'text-cyan-700',
      tagline: '#CalledToMore #Wayfinder #LeadsWithHeart',
      description:
        'You have always felt a pull toward something beyond the life laid out for you — and unlike most people, you eventually answer it. You carry two loyalties at once: to the people counting on you and to the voice inside insisting there is more, and your genius is refusing to choose between them. You make mistakes at full speed, learn on open water, and come home with exactly what everyone needed.',
      strengths: ['Answers the inner call', 'Duty and daring in balance', 'Learns while moving', 'Brings people home better'],
      growth: 'You take responsibility for outcomes the size of an ocean and treat asking for help as a detour. Even wayfinders navigate by more than one star — let your crew actually crew.',
      kindred: ['mulan', 'simba'],
    },
    simba: {
      name: 'Simba',
      emoji: '🦁',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#SunnyHeart #GrowsIntoIt #ComebackStory',
      description:
        'You are warmth with legs — playful, magnetic, the reason the group chat is fun. But your real story is heavier and better: you know what it is to run from a chapter of your life, and you know what it takes to turn around and walk back into it. When you finally step into your responsibilities, you do it wholeheartedly, and people are startled by how naturally the leadership fits.',
      strengths: ['Infectious joy', 'Courage to face the past', 'Grows into big shoes', 'Draws people together'],
      growth: 'Avoidance is your old default — when something shames you, you vanish into distraction. You already know from experience that facing it early costs less than the long way around.',
      kindred: ['stitch', 'aladdin'],
    },
    elsa: {
      name: 'Elsa',
      emoji: '❄️',
      color: 'from-sky-100 to-indigo-50',
      accent: 'text-sky-600',
      tagline: '#QuietPower #Perfectionist #ThawingNicely',
      description:
        'You learned early to hold your biggest self in check — to be composed, careful, controlled — because your intensity felt like something that might hurt people. It never was the problem; hiding it was. You are at your most powerful exactly when you stop performing smallness, and the people who love you would rather stand next to your storm than outside your walls. Protectiveness is your love language, even when it looks like distance.',
      strengths: ['Immense self-discipline', 'Protective to a fault', 'Creates beauty from pressure', 'Powerful once unleashed'],
      growth: 'Your instinct under stress is to isolate and handle it alone, which reads as coldness to people who just want in. Letting someone witness the mess is the real act of courage.',
      kindred: ['belle', 'mulan'],
    },
    mulan: {
      name: 'Mulan',
      emoji: '🏮',
      color: 'from-red-100 to-rose-50',
      accent: 'text-red-600',
      tagline: '#QuietCourage #Ingenuity #FamilyFirst',
      description:
        'You will do the terrifying thing — not for glory, but because someone you love needed it done. You have never quite fit the mold people prepared for you, and instead of shrinking, you got resourceful: outworking, outthinking, and out-improvising everyone who underestimated you. Your proof is never in the speech; it is in the mountain of quiet, decisive action behind you.',
      strengths: ['Brave where it counts', 'Clever under constraint', 'Outworks every doubt', 'Loyalty made of steel'],
      growth: 'You are so used to earning your place twice over that you struggle to accept credit at face value. You no longer need to prove it — some rooms you have simply already won.',
      kindred: ['moana', 'elsa'],
    },
    aladdin: {
      name: 'Aladdin',
      emoji: '✨',
      color: 'from-purple-100 to-amber-50',
      accent: 'text-purple-600',
      tagline: '#StreetSmart #QuickThinker #DiamondInTheRough',
      description:
        'Nobody handed you anything, so you developed the fastest improvisation reflexes in town — charm, timing, and an escape plan for every situation. What people miss under the quick wit is the generosity: you share what little you have without doing the math first. Your only real trap is thinking you need to be someone shinier to be wanted, when your unpolished, quick-hearted self was always the whole treasure.',
      strengths: ['Thinks fastest in tight corners', 'Generous beyond his means', 'Charm with substance', 'Turns nothing into something'],
      growth: 'You embellish the edges of yourself to fit what you think people want. The pattern to break is simple to say and hard to do: let them meet the real one first.',
      kindred: ['stitch', 'simba'],
    },
    belle: {
      name: 'Belle',
      emoji: '📚',
      color: 'from-yellow-100 to-rose-50',
      accent: 'text-yellow-700',
      tagline: '#BookishBrave #SeesDeeper #NotAfraidToBeOdd',
      description:
        'You live half in this world and half in a bigger one made of books, ideas, and questions — and you have stopped apologizing for it. Your defining gift is sight: you read past reputations, first impressions, and gruff exteriors to whoever is actually in there, and you are stubbornly right about people. Kind but immovable, you would rather be genuinely yourself in a small town than counterfeit in a castle.',
      strengths: ['Sees past appearances', 'Curious without limits', 'Gentle but unbending', 'Comfortable being different'],
      growth: 'You give patient, transformative belief to complicated people and sometimes overspend on projects who are not doing their part. Your insight deserves reciprocity, not just potential.',
      kindred: ['elsa', 'moana'],
    },
    stitch: {
      name: 'Stitch',
      emoji: '👾',
      color: 'from-blue-100 to-indigo-50',
      accent: 'text-blue-600',
      tagline: '#TinyChaos #FoundFamily #SoftcoreMayhem',
      description:
        'You arrived in most people\'s lives as pure chaos — loud, weird, breaking at least one thing — and then revealed yourself to be the most devoted heart in the room. You were not built for belonging, so you built your own: a scrappy, mismatched family you would defend against the entire galaxy. People start by tolerating you, and end up unable to imagine the table without you.',
      strengths: ['Ferocious devotion', 'Unapologetically weird', 'Turns outsiders into family', 'More capable than he looks'],
      growth: 'When you feel rejection coming, you break things first so it hurts less. Your people are not going anywhere — you can put down the wrecking ball.',
      kindred: ['simba', 'aladdin'],
    },
    buzz: {
      name: 'Buzz Lightyear',
      emoji: '🚀',
      color: 'from-green-100 to-lime-50',
      accent: 'text-green-600',
      tagline: '#MissionMode #FullCommitment #LearnsToLand',
      description:
        'You commit to things with a seriousness other people reserve for emergencies — every task is a mission, every promise a launch sequence. Yes, you occasionally take yourself a bit too seriously, but that same conviction is why people trust you with the important stuff. Your best arc is the one you keep repeating: discovering that being one of the crew matters more than being the hero of the story, and becoming twice as effective the moment you do.',
      strengths: ['Total follow-through', 'Unshakeable self-belief', 'Takes the mission seriously', 'Loyal wingman once landed'],
      growth: 'When reality contradicts your script, you defend the script a beat too long. The fastest recoveries happen when you laugh, update the plan, and rejoin the team.',
      kindred: ['mulan', 'moana'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'An opportunity comes up far from home — new city, new people, new everything. You…',
      options: [
        { label: 'Feel the pull instantly — part of me has always wanted to see past the edge of the map', points: { moana: 2, aladdin: 1 } },
        { label: 'Research it inside and out first — but yes, my life could use a bigger story', points: { belle: 2, elsa: 1 } },
        { label: 'Only if my people can come too — new places are just backdrops without them', points: { stitch: 2, simba: 1 } },
        { label: 'Treat it like a mission: gear checked, plan drafted, launch on schedule', points: { buzz: 2, mulan: 1 } },
      ],
    },
    {
      id: 2,
      text: 'How do your friends describe you when you\'re not around?',
      options: [
        { label: '"Pure sunshine — but there\'s more underneath the goofball than people realize"', points: { simba: 2, stitch: 1 } },
        { label: '"Reserved until you\'re in, and carrying way more than anyone realizes"', points: { elsa: 2, belle: 1 } },
        { label: '"The one who\'ll do the terrifying thing if it protects the family"', points: { mulan: 2, moana: 1 } },
        { label: '"Quick, charming, always has a plan B — and a plan C in their back pocket"', points: { aladdin: 2, stitch: 1 } },
      ],
    },
    {
      id: 3,
      text: 'You\'re handed a big responsibility and everyone is watching. First move?',
      options: [
        { label: 'Listen — to the team and to my gut — then chart a course and own every call out loud', points: { moana: 2, simba: 1 } },
        { label: 'Take it dead seriously: study the brief, run the drills, no winging it with people counting on me', points: { buzz: 2, mulan: 1 } },
        { label: 'Retreat somewhere quiet and master it privately before anyone watches me practice', points: { elsa: 2, belle: 1 } },
        { label: 'Stay loose — I\'m at my best when the plan falls apart and I have to invent a better one live', points: { aladdin: 2, stitch: 1 } },
      ],
    },
    {
      id: 4,
      text: 'Pick your ideal Saturday:',
      options: [
        { label: 'A bookshop, a bakery, and a long wander with my head happily in the clouds', points: { belle: 2, elsa: 1 } },
        { label: 'Beach chaos with my chosen family — snacks, sandcastles, at least one harmless disaster', points: { stitch: 2, aladdin: 1 } },
        { label: 'Outside from sunrise: hiking, swimming, dramatic viewpoints, zero itinerary', points: { simba: 2, moana: 1 } },
        { label: 'Training for something — a race, a skill, a personal best that\'s been taunting me', points: { mulan: 2, buzz: 1 } },
      ],
    },
    {
      id: 5,
      text: 'Your biggest flaw, honestly?',
      options: [
        { label: 'I take responsibility for everything and everyone, whether or not it\'s mine to carry', points: { moana: 2, mulan: 1 } },
        { label: 'I shut people out when I\'m struggling — to protect them, I keep telling myself', points: { elsa: 2 } },
        { label: 'I polish the truth into the person I think people want, instead of trusting who I am', points: { aladdin: 2, simba: 1 } },
        { label: 'I take everything seriously — including, in hindsight, several jokes', points: { buzz: 2, belle: 1 } },
      ],
    },
    {
      id: 6,
      text: 'A newcomer is struggling to fit into your group. You…',
      options: [
        { label: 'Declare them family on the spot. It\'s official, there\'s no paperwork, and no takebacks', points: { stitch: 2, simba: 1 } },
        { label: 'Pull them into the fun — one inside joke and a shared adventure fix most awkwardness', points: { simba: 2, aladdin: 1 } },
        { label: 'Watch out for them quietly and shut down anyone who gives them a hard time', points: { mulan: 2, elsa: 1 } },
        { label: 'Ask real questions — everyone is interesting once someone bothers to read past the cover', points: { belle: 2, moana: 1 } },
      ],
    },
    {
      id: 7,
      text: 'Everyone says the thing you\'re trying to do is impossible. You…',
      options: [
        { label: 'Check my reasons one more time, then go anyway — horizons never come to people who wait', points: { moana: 2, belle: 1 } },
        { label: 'Stop performing possibility for an audience and go build it where no one is watching', points: { elsa: 2, moana: 1 } },
        { label: 'Recalculate, tighten the plan, and attempt the mission anyway — by the book', points: { buzz: 2, mulan: 1 } },
        { label: 'Perfect — impossible odds are my home turf, and tight corners produce my best ideas', points: { aladdin: 2, stitch: 1 } },
      ],
    },
    {
      id: 8,
      text: 'You mess up badly and let someone down. What now?',
      options: [
        { label: 'My instinct is to vanish from the awkwardness — but I\'ve learned to come back and face it', points: { simba: 2, aladdin: 1 } },
        { label: 'Big remorse, clumsy but heartfelt repairs, and absolute devotion from that day on', points: { stitch: 2, elsa: 1 } },
        { label: 'Name it honestly, apologize without excuses, and change the pattern — not just the words', points: { belle: 2, moana: 1 } },
        { label: 'Quietly work twice as hard until my actions have repaid what the mistake cost', points: { mulan: 2, buzz: 1 } },
      ],
    },
    {
      id: 9,
      text: 'What motivates you most deeply?',
      options: [
        { label: 'Answering the call I\'ve felt forever — and bringing my people somewhere better because I did', points: { moana: 2, mulan: 1 } },
        { label: 'A life bigger than the script I was handed — more books, more ideas, more world', points: { belle: 2, elsa: 1 } },
        { label: 'The little family I found. I was a mess until they claimed me, and I\'d do anything for them', points: { stitch: 2, simba: 1 } },
        { label: 'The mission. Give me a real purpose and I\'ll follow it past the edge of the known universe', points: { buzz: 2, mulan: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'You can\'t outrun who you are — the sooner you turn and face it, the lighter you travel', points: { simba: 2, stitch: 1 } },
        { label: 'The bravest thing you can be is fully yourself, even if it scares a few people', points: { elsa: 2, belle: 1 } },
        { label: 'Loyalty isn\'t proven in comfortable moments — it shows up when standing up costs you something', points: { mulan: 2, moana: 1 } },
        { label: 'What you\'re born with matters less than what you build when nobody hands you anything', points: { aladdin: 2, simba: 1 } },
      ],
    },
  ],
};
