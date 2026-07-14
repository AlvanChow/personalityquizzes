// Which Wizarding House Fits You? — 'pick' mode quiz.
// Each house is framed around its core values; every option awards points and the highest total wins.

export default {
  key: 'wizard',
  mode: 'pick',
  resultsHeading: 'Your house match breakdown',

  results: {
    gryffindor: {
      name: 'Gryffindor',
      emoji: '🦁',
      color: 'from-red-100 to-amber-50',
      accent: 'text-red-700',
      tagline: '#Courage #FirstToLeap #HeartOnFire',
      description:
        'You run toward the things other people run from — hard conversations, big risks, moments that demand someone stand up first. It is not that you never feel fear; it is that fear has never once gotten the final vote. Friends know that if something unjust happens in front of you, silence is simply not on the menu, and that makes you the person they want beside them when it counts.',
      strengths: ['Acts when others hesitate', 'Defends people on instinct', 'Thrives under pressure', 'Radical honesty'],
      growth: 'Boldness is your gift, but not every dragon needs slaying today. Pausing to think before you charge turns raw courage into real heroism.',
      kindred: ['hufflepuff', 'slytherin'],
    },
    hufflepuff: {
      name: 'Hufflepuff',
      emoji: '🦡',
      color: 'from-yellow-100 to-amber-50',
      accent: 'text-yellow-700',
      tagline: '#Loyalty #ShowUp #SteadyHands',
      description:
        'You are the person people can actually count on — not in the abstract, but at 6am with a moving van, or at midnight when someone needs to talk. You believe fairness is non-negotiable, that unglamorous work still deserves doing well, and that kindness is a strength rather than a softness. Communities quietly run on people like you, and everyone in yours knows it.',
      strengths: ['Unshakeable reliability', 'Deep sense of fairness', 'Patient, honest work ethic', 'Makes everyone feel they belong'],
      growth: 'You give your time and energy so freely that your own goals keep sliding to the bottom of the list. Guarding a little of that devotion for yourself is not selfish — it is sustainable.',
      kindred: ['gryffindor', 'ravenclaw'],
    },
    ravenclaw: {
      name: 'Ravenclaw',
      emoji: '🦅',
      color: 'from-blue-100 to-indigo-50',
      accent: 'text-blue-700',
      tagline: '#Curiosity #SharpMind #WonderFirst',
      description:
        'Your mind is a permanently open browser with forty fascinating tabs, and you would not have it any other way. You ask the question nobody else thought of, follow ideas down rabbit holes for the pure joy of understanding, and would rather be interestingly wrong than boringly right. People come to you when a problem needs a genuinely original angle — and leave with three book recommendations.',
      strengths: ['Original, independent thinking', 'Loves learning for its own sake', 'Spots patterns others miss', 'Questions every assumption'],
      growth: 'Analysis is your comfort zone, and it can become a very elegant hiding place. Some questions are only answered by acting before you feel one hundred percent certain.',
      kindred: ['slytherin', 'hufflepuff'],
    },
    slytherin: {
      name: 'Slytherin',
      emoji: '🐍',
      color: 'from-emerald-100 to-green-50',
      accent: 'text-emerald-700',
      tagline: '#Ambition #LongGame #MakeItHappen',
      description:
        'You see where you are going years before anyone else does, and you are quietly, relentlessly building the path to get there. Resourcefulness is your signature: where others see a locked door, you see a hinge problem. You choose your inner circle carefully and champion them hard — because you know great ambitions are achieved by great alliances, not lone wolves.',
      strengths: ['Clear long-term vision', 'Resourceful in any situation', 'Reads rooms and incentives', 'Turns setbacks into strategy'],
      growth: 'Playing your cards close keeps you safe, but it can leave allies guessing where they stand. Letting trusted people see the real scoreboard makes them fight harder for your wins.',
      kindred: ['ravenclaw', 'gryffindor'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'You witness something clearly unfair happening at work or school. You…',
      options: [
        { label: 'Call it out on the spot, whatever it costs me', points: { gryffindor: 2, hufflepuff: 1 } },
        { label: 'Stand beside the person affected so they know they\'re not alone', points: { hufflepuff: 2, gryffindor: 1 } },
        { label: 'Gather the facts first so the case is airtight before anyone can dismiss it', points: { ravenclaw: 2, slytherin: 1 } },
        { label: 'Quietly work the right channels — find the person with power to actually fix it', points: { slytherin: 2, ravenclaw: 1 } },
      ],
    },
    {
      id: 2,
      text: 'A completely free afternoon appears in your calendar. What happens to it?',
      options: [
        { label: 'Something with adrenaline — the activity that scares me just enough', points: { gryffindor: 2, slytherin: 1 } },
        { label: 'Low-key time with my people — helping a friend move, baking for the group', points: { hufflepuff: 2 } },
        { label: 'A glorious rabbit hole — one fascinating topic and four hours gone', points: { ravenclaw: 2 } },
        { label: 'Progress on the long-term project nobody knows about yet', points: { slytherin: 2, ravenclaw: 1 } },
      ],
    },
    {
      id: 3,
      text: 'In group projects, you are inevitably the one who…',
      options: [
        { label: 'Volunteers to present and takes the risky creative swing', points: { gryffindor: 2, slytherin: 1 } },
        { label: 'Does the unglamorous glue-work that actually holds the whole thing together', points: { hufflepuff: 2, ravenclaw: 1 } },
        { label: 'Designs the clever structure and questions every assumption in the brief', points: { ravenclaw: 2, slytherin: 1 } },
        { label: 'Figures out exactly what the evaluator wants and steers the team straight there', points: { slytherin: 2, gryffindor: 1 } },
      ],
    },
    {
      id: 4,
      text: 'Which compliment would land the deepest?',
      options: [
        { label: '"You were brave when it actually counted"', points: { gryffindor: 2, hufflepuff: 1 } },
        { label: '"You\'re the one person everyone knows they can count on"', points: { hufflepuff: 2 } },
        { label: '"That\'s the most interesting idea I\'ve heard all year"', points: { ravenclaw: 2 } },
        { label: '"How did you pull that off? Nobody else could have"', points: { slytherin: 2, gryffindor: 1 } },
      ],
    },
    {
      id: 5,
      text: 'A big opportunity opens up, but you\'re honestly not fully ready. You…',
      options: [
        { label: 'Leap. Readiness is overrated — I\'ll learn on the way down', points: { gryffindor: 2, slytherin: 1 } },
        { label: 'Ask people I trust for honest advice, then prepare properly', points: { hufflepuff: 2, ravenclaw: 1 } },
        { label: 'Study everything about it until "not ready" stops being true', points: { ravenclaw: 2, hufflepuff: 1 } },
        { label: 'Take it — then quietly out-prepare everyone who was "more qualified"', points: { slytherin: 2, gryffindor: 1 } },
      ],
    },
    {
      id: 6,
      text: 'Your friends would say your fatal flaw is…',
      options: [
        { label: 'Acting first and thinking… eventually', points: { gryffindor: 2 } },
        { label: 'Saying yes to everyone until there\'s nothing left for me', points: { hufflepuff: 2, gryffindor: 1 } },
        { label: 'Overthinking simple decisions into philosophical crises', points: { ravenclaw: 2 } },
        { label: 'Playing my cards so close that nobody knows what I really want', points: { slytherin: 2, ravenclaw: 1 } },
      ],
    },
    {
      id: 7,
      text: 'What kind of stories do you love most?',
      options: [
        { label: 'Underdogs charging at impossible odds', points: { gryffindor: 2, hufflepuff: 1 } },
        { label: 'Found families and friendships that survive everything', points: { hufflepuff: 2 } },
        { label: 'Mysteries and mind-bending ideas that change how I see the world', points: { ravenclaw: 2, slytherin: 1 } },
        { label: 'Cunning protagonists playing the long game brilliantly', points: { slytherin: 2 } },
      ],
    },
    {
      id: 8,
      text: 'Your team just failed, hard and publicly. Your first instinct?',
      options: [
        { label: 'Take responsibility out loud and rally everyone for round two', points: { gryffindor: 2, hufflepuff: 1 } },
        { label: 'Check on everyone — the project can wait, the people can\'t', points: { hufflepuff: 2 } },
        { label: 'Run the post-mortem: what exactly went wrong, and why?', points: { ravenclaw: 2, slytherin: 1 } },
        { label: 'Salvage what\'s usable and start positioning us for the next win', points: { slytherin: 2, ravenclaw: 1 } },
      ],
    },
    {
      id: 9,
      text: 'Which motto could hang above your desk?',
      options: [
        { label: '"If it scares you, that\'s the signpost"', points: { gryffindor: 2 } },
        { label: '"Show up. Every time. For everyone"', points: { hufflepuff: 2, gryffindor: 1 } },
        { label: '"Question everything — especially the obvious"', points: { ravenclaw: 2 } },
        { label: '"Dream in decades, plan in weeks"', points: { slytherin: 2, ravenclaw: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Decades from now, what do you most want to be remembered for?',
      options: [
        { label: 'Standing up when everyone else stayed seated', points: { gryffindor: 2, slytherin: 1 } },
        { label: 'Being the reason people felt they belonged somewhere', points: { hufflepuff: 2 } },
        { label: 'An idea or a body of work that outlives me', points: { ravenclaw: 2, slytherin: 1 } },
        { label: 'Building something genuinely ambitious from absolutely nothing', points: { slytherin: 2, hufflepuff: 1 } },
      ],
    },
  ],
};
