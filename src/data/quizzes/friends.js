// Which Friends Character Are You? — 'pick' mode quiz.
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'friends',
  mode: 'pick',
  resultsHeading: 'Your character match breakdown',

  results: {
    rachel: {
      name: 'Rachel Green',
      emoji: '🛍️',
      color: 'from-emerald-100 to-green-50',
      accent: 'text-emerald-600',
      tagline: '#Reinvention #Style #GrowthArc',
      description:
        'You are living proof that starting over is a superpower. Whatever chapter you were handed, you had the nerve to trade it for one you actually wanted — and you did it with great hair. You are socially magnetic, far more capable than people initially assume, and your taste is genuinely impeccable. The best part of your story is watching you outgrow every box anyone tried to put you in.',
      strengths: ['Reinvents herself fearlessly', 'Magnetic social energy', 'Impeccable taste', 'Rises to every new chapter'],
      growth: 'You can do hard things without a safety net — you have proven it repeatedly. Trust that before the panic spiral, not after.',
      kindred: ['monica', 'joey'],
    },
    monica: {
      name: 'Monica Geller',
      emoji: '🍳',
      color: 'from-violet-100 to-purple-50',
      accent: 'text-violet-600',
      tagline: '#HostWithTheMost #Competitive #MamaBear',
      description:
        'You show love in casserole form and clean when you are stressed, happy, or simply awake. You are the gravitational center of your friend group — the one with the place everyone gathers in, the plan everyone follows, and the standards everyone secretly benefits from. Yes, you are competitive enough to turn a casual game night into a championship event, but that same fire is why everything you commit to actually happens.',
      strengths: ['Hosts like a professional', 'Fiercely nurturing', 'Follows through on everything', 'Thrives on a challenge'],
      growth: 'Not everything needs to be a ten out of ten performance. Your people came for you, not the perfectly executed evening — let something be messy once and watch nobody leave.',
      kindred: ['rachel', 'ross'],
    },
    phoebe: {
      name: 'Phoebe Buffay',
      emoji: '🎸',
      color: 'from-yellow-100 to-amber-50',
      accent: 'text-amber-600',
      tagline: '#FreeSpirit #Original #QuietSteel',
      description:
        'You are gloriously, unapologetically yourself in a world full of people performing normalcy. Your logic makes no sense right up until it makes perfect sense, your honesty is startling, and your offbeat take on life is usually truer than everyone else\'s careful answers. Underneath the whimsy is real steel — you have weathered things that would flatten most people and came out kinder, not harder.',
      strengths: ['Completely original', 'Disarmingly honest', 'Resilient beyond measure', 'Kind in unexpected ways'],
      growth: 'Your instinct is to keep things light so nobody worries about you. Letting your friends carry something heavy for you once in a while is a gift to them, too.',
      kindred: ['joey', 'rachel'],
    },
    ross: {
      name: 'Ross Geller',
      emoji: '🦕',
      color: 'from-blue-100 to-sky-50',
      accent: 'text-blue-600',
      tagline: '#Passionate #Nerd #AllInRomantic',
      description:
        'You care about things at a level most people find unusual, and that is exactly your charm. Dinosaurs, grammar, the objectively correct way to assemble a sandwich — when you love something, you love it with footnotes. You are the romantic of your group: earnest, devoted, occasionally spiraling, always sincere. Your feelings arrive at full volume because you have never once been casual about anything that matters.',
      strengths: ['Deeply knowledgeable', 'Romantic to his core', 'Loyal through decades', 'Enthusiasm that cannot be faked'],
      growth: 'Not every setback is a catastrophe, and being right is not the same as being happy. Take one breath before the dramatic monologue — you will still get to deliver it.',
      kindred: ['monica', 'chandler'],
    },
    chandler: {
      name: 'Chandler Bing',
      emoji: '🃏',
      color: 'from-slate-100 to-zinc-50',
      accent: 'text-slate-600',
      tagline: '#QuickWit #LoyalHeart #JokeAsArmor',
      description:
        'Your first language is sarcasm and your second is deflection, but everyone who matters knows what is underneath: one of the most loyal, generous hearts in the room. You joke because you notice everything — including your own awkwardness — about half a second before anyone else does. And your real story is the best kind of growth arc: the commitment-avoider who, when it truly counted, showed up more completely than anyone.',
      strengths: ['Fastest wit in the room', 'Secretly the most reliable', 'Self-aware to a fault', 'Shows up when it counts'],
      growth: 'The joke is armor, and you are allowed to take it off. The sincere sentence you are scared to say is usually the one people need most from you.',
      kindred: ['joey', 'ross'],
    },
    joey: {
      name: 'Joey Tribbiani',
      emoji: '🍕',
      color: 'from-red-100 to-orange-50',
      accent: 'text-red-600',
      tagline: '#RideOrDie #BigAppetite #HeartOfGold',
      description:
        'You lead with your heart and your appetite, in that order — barely. You do not overthink life: you love your people, you love your food, and you commit to both without hesitation or fine print. What people miss under the easygoing charm is a fierce protectiveness — nobody defends their friends faster or more completely than you. You would hand over the last slice for the right person, and there is no bigger love than that.',
      strengths: ['Unwaveringly loyal', 'Lives fully in the moment', 'Charm that opens every door', 'Loves without conditions'],
      growth: 'Living in the moment is your gift, but tomorrow keeps showing up anyway. A little planning would let future-you enjoy the moment even more.',
      kindred: ['chandler', 'phoebe'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'Someone new joins your friend group. You:',
      options: [
        { label: 'Befriend them instantly — offer them food, learn their life story, done, we\'re close now', points: { joey: 2, phoebe: 1 } },
        { label: 'Subtly interview them. Are they good enough for this group? The vetting has begun', points: { monica: 2, ross: 1 } },
        { label: 'Break the ice with a joke about how awkward this exact moment is', points: { chandler: 2 } },
        { label: 'Compliment something specific about them and make them feel like they\'ve always belonged', points: { rachel: 2, joey: 1 } },
      ],
    },
    {
      id: 2,
      text: 'What\'s your natural role at a dinner party?',
      options: [
        { label: 'Hosting, obviously. Everything is homemade and the napkins are coordinated', points: { monica: 2, rachel: 1 } },
        { label: 'The entertainment — songs, wild stories, opinions nobody saw coming', points: { phoebe: 2, joey: 1 } },
        { label: 'Delivering a passionate mini-lecture on a topic exactly one person asked about', points: { ross: 2 } },
        { label: 'Providing commentary from the couch while helping with approximately nothing', points: { chandler: 2, joey: 1 } },
      ],
    },
    {
      id: 3,
      text: 'A friend cancels plans at the last minute. Honest reaction?',
      options: [
        { label: 'Wounded for ten minutes, followed by a dramatic speech about how I\'m totally fine', points: { ross: 2, monica: 1 } },
        { label: 'Quietly thrilled — sweatpants and takeout it is', points: { chandler: 2, joey: 1 } },
        { label: 'Clearly the universe wanted me to do something else tonight. I wonder what it is', points: { phoebe: 2 } },
        { label: 'Immediately restructure the evening into errands, self-care, and getting ahead on my list', points: { monica: 2, rachel: 1 } },
      ],
    },
    {
      id: 4,
      text: 'How do you handle a breakup — yours or a best friend\'s?',
      options: [
        { label: 'Ice cream, tissues, a complete forensic analysis of what went wrong, then a makeover', points: { rachel: 2, monica: 1 } },
        { label: 'Insist loudly that I\'m fine. I am not fine. Everyone can tell', points: { ross: 2, chandler: 1 } },
        { label: 'Channel it into a brutally honest song or poem, then genuinely move on', points: { phoebe: 2 } },
        { label: 'Distraction package: comfort food, fun plans, and unwavering "you deserve better" loyalty', points: { joey: 2, rachel: 1 } },
      ],
    },
    {
      id: 5,
      text: 'Describe your kitchen situation:',
      options: [
        { label: 'Professional grade. Organized. Guests may not rearrange anything, thank you', points: { monica: 2 } },
        { label: 'I make one signature thing brilliantly; beyond that, the takeout menus are alphabetized by cuisine', points: { joey: 2, chandler: 1 } },
        { label: 'My real kitchen is the coffee shop where the staff knows my order by heart', points: { rachel: 2, phoebe: 1 } },
        { label: 'Home to some unconventional experiments that I fully stand behind', points: { phoebe: 2, monica: 1 } },
      ],
    },
    {
      id: 6,
      text: 'Your flirting style, be honest:',
      options: [
        { label: 'A confident opening line that has no business working as often as it does', points: { joey: 2, rachel: 1 } },
        { label: 'Sarcastic banter until they either fall for me or file a complaint', points: { chandler: 2 } },
        { label: 'Deep eye contact, earnest conversation, and mentally planning our future by the second date', points: { ross: 2, monica: 1 } },
        { label: 'Effortless charm and a great outfit — I know exactly what I\'m doing', points: { rachel: 2, phoebe: 1 } },
      ],
    },
    {
      id: 7,
      text: 'Your biggest flaw, if you\'re being really honest:',
      options: [
        { label: 'Competitive to a degree that has ruined at least one casual board game night', points: { monica: 2, ross: 1 } },
        { label: 'Jealousy sneaks up on me, and I do not handle it gracefully', points: { ross: 2 } },
        { label: 'I deflect every sincere moment with a joke, even the ones that deserve better', points: { chandler: 2, joey: 1 } },
        { label: 'I\'m a little too comfortable letting other people handle the boring practical stuff', points: { rachel: 2, joey: 1 } },
      ],
    },
    {
      id: 8,
      text: 'Your ideal Sunday:',
      options: [
        { label: 'A deep-cleaning spree — genuinely fun for me — followed by hosting dinner for everyone', points: { monica: 2 } },
        { label: 'A craft project or guitar in the park, plus a delightfully odd conversation with a stranger', points: { phoebe: 2 } },
        { label: 'A museum or documentary, then telling everyone about it in extensive detail', points: { ross: 2, chandler: 1 } },
        { label: 'Sleep until noon, an enormous sandwich, and the game on TV', points: { joey: 2, chandler: 1 } },
      ],
    },
    {
      id: 9,
      text: 'A friend needs to borrow money. You:',
      options: [
        { label: 'Hand it over instantly, no questions — what\'s mine is theirs, always has been', points: { joey: 2, phoebe: 1 } },
        { label: 'Lend it, along with a budget spreadsheet and a gentle but firm repayment plan', points: { monica: 2, ross: 1 } },
        { label: 'Give it with a joke attached so the moment doesn\'t get uncomfortably heavy', points: { chandler: 2, rachel: 1 } },
        { label: 'Share what I can and pitch them three unconventional side hustles, at least one involving crafts', points: { phoebe: 2 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'Whatever I do, I do it fully — feelings, hobbies, arguments, all of it', points: { ross: 2, monica: 1 } },
        { label: 'Take care of your people and everything else sorts itself out', points: { joey: 2, monica: 1 } },
        { label: 'Life is too absurd to take seriously — laugh at it before it laughs at you', points: { chandler: 2, phoebe: 1 } },
        { label: 'You can always reinvent yourself. The next chapter is yours to write', points: { rachel: 2, phoebe: 1 } },
      ],
    },
  ],
};
