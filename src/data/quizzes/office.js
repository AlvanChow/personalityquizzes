// Which Office Character Are You? — 'pick' mode quiz (The Office, US).
// Every option awards points to one or more result keys; highest total wins.

export default {
  key: 'office',
  mode: 'pick',
  resultsHeading: 'Your character match breakdown',

  results: {
    michael: {
      name: 'Michael Scott',
      emoji: '🎤',
      color: 'from-orange-100 to-amber-50',
      accent: 'text-orange-600',
      tagline: '#HeartFirst #Showtime #FoundFamily',
      description:
        'You lead with your heart at a volume most people reserve for emergencies. Yes, you want to be liked — because to you the people around you are not coworkers or acquaintances, they are family, and you would cancel anything to show up for their big moments. Your plans are sixty percent chaos, but your instincts about people are weirdly, consistently right, and nobody makes an ordinary Tuesday feel like an event the way you do.',
      strengths: ['Loves people loudly', 'Fearless commitment to the bit', 'Surprisingly great instincts', 'Makes everyone feel seen'],
      growth: 'Not every silence needs a joke and not every room needs a show. The people who love you already love you — you can let a moment just be a moment.',
      kindred: ['kelly', 'kevin'],
    },
    jim: {
      name: 'Jim Halpert',
      emoji: '😏',
      color: 'from-sky-100 to-blue-50',
      accent: 'text-sky-600',
      tagline: '#EasyGoing #Mischief #SecretRomantic',
      description:
        'You coast through chaos with a raised eyebrow and a glance at an imaginary camera only you can see. Underneath the pranks and the deliberately unbothered attitude is someone deeply romantic and quietly ambitious — when you decide something truly matters, you go all in, and it is genuinely moving to watch. People trust you because you never take yourself too seriously, but you always take them seriously.',
      strengths: ['Defuses tension effortlessly', 'Master of the long game', 'Reads the room instantly', 'All in when it counts'],
      growth: 'Coasting is comfortable, but you do your best work when you want something out loud. Say the ambitious thing sooner — you have earned the right to want more.',
      kindred: ['pam', 'stanley'],
    },
    pam: {
      name: 'Pam Beesly',
      emoji: '🎨',
      color: 'from-rose-100 to-pink-50',
      accent: 'text-rose-600',
      tagline: '#QuietCourage #Artist #SlowBloom',
      description:
        'You are the warm, observant one who notices everything and keeps the whole ecosystem running with a kindness nobody thinks to thank. You may have spent chapters of your life playing it safe, but your real story is courage in small, accumulating doses — speaking up, taking the class, choosing the braver version of yourself. Your creativity is not loud, but it is real, and it is entirely yours.',
      strengths: ['Notices what others miss', 'Kind but never a pushover', 'Braver every year', 'Quietly creative'],
      growth: 'You keep waiting for permission you do not actually need. The bolder choice has never once been the wrong one for you — keep receipts on that.',
      kindred: ['jim', 'angela'],
    },
    dwight: {
      name: 'Dwight Schrute',
      emoji: '🌾',
      color: 'from-yellow-100 to-lime-50',
      accent: 'text-yellow-700',
      tagline: '#AlwaysPrepared #FierceLoyalty #FarmStrong',
      description:
        'You are intense about everything, and honestly, the world needs more people like you. While others coast, you are up before dawn doing things properly and mastering skills nobody else bothered to learn — and when a real crisis hits, you are suddenly the only competent person in the building. Your loyalty is absolute: you may bicker with your people daily, but heaven help the outsider who wrongs them.',
      strengths: ['Prepared for literally anything', 'Unmatched work ethic', 'Fiercely loyal', 'Zero fear of being different'],
      growth: 'Not everything is a competition or a threat assessment. Your softer moments are some of your best ones — let people see them on purpose.',
      kindred: ['angela', 'michael'],
    },
    kelly: {
      name: 'Kelly Kapoor',
      emoji: '💅',
      color: 'from-pink-100 to-fuchsia-50',
      accent: 'text-pink-600',
      tagline: '#MainCharacter #PopCulture #BigFeelings',
      description:
        'You are the main character, and frankly, everyone should be grateful for it. You feel everything at full saturation, narrate life like it deserves narrating, and maintain an encyclopedic mental database of celebrity news, group-chat drama, and who wore what to whose party. Under the sparkle is someone far sharper than people give you credit for — you clock every dynamic in the room while pretending to check your phone.',
      strengths: ['Endlessly entertaining', 'Emotionally fluent', 'Sharper than she lets on', 'Never a dull moment'],
      growth: 'Your feelings are valid, but the volume knob has settings between zero and one hundred. Save the grand-finale energy for the things that truly deserve it.',
      kindred: ['michael', 'kevin'],
    },
    angela: {
      name: 'Angela Martin',
      emoji: '🐱',
      color: 'from-slate-100 to-gray-50',
      accent: 'text-slate-600',
      tagline: '#HighStandards #Order #SecretSoftie',
      description:
        'You have standards, and you are not sorry about it. In a world of people winging it, you are the one with the plan, the budget, the correct forks, and a committee ready to execute — things simply work when you are in charge. And beneath the pursed-lip disapproval is a genuinely tender heart, reserved for a carefully vetted few humans and every cat you have ever met.',
      strengths: ['Impeccable standards', 'Gets things done properly', 'Formidable behind the scenes', 'Deeply loyal to her chosen few'],
      growth: 'Letting someone see you be soft will not dissolve your authority. The people you secretly adore would love to hear it out loud once in a while.',
      kindred: ['dwight', 'pam'],
    },
    stanley: {
      name: 'Stanley Hudson',
      emoji: '🧩',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#Boundaries #Unbothered #WeekendMode',
      description:
        'You figured out what takes most people decades: work is one chapter of your life, not the whole book. You do your job, you do it fine, and you protect your peace with the discipline of a monk — no drama, no committees, no staying late. But anyone who catches you off the clock knows the truth: you are warm, wickedly funny, and fully alive the second you are doing what you actually love.',
      strengths: ['Unshakeable boundaries', 'Immune to drama', 'Knows exactly what matters', 'Quietly hilarious'],
      growth: 'Boundaries are your superpower, but every so often the party, the small talk, or the extra moment is genuinely worth it. Opt in occasionally — on your own terms.',
      kindred: ['jim', 'kevin'],
    },
    kevin: {
      name: 'Kevin Malone',
      emoji: '🍪',
      color: 'from-purple-100 to-violet-50',
      accent: 'text-purple-600',
      tagline: '#SimpleJoys #ChillVibes #HiddenTalent',
      description:
        'You cracked the code to happiness, and the code is beautifully simple: good food, good people, and not sweating the things that do not need sweating. People underestimate you constantly, then discover your unexpected pockets of brilliance — the specific things you love, you are genuinely great at. Meanwhile, your total lack of pretense makes you the easiest person in any room to be around.',
      strengths: ['Effortlessly content', 'Zero pretense', 'Surprising hidden talents', 'Instantly likable'],
      growth: 'The path of least resistance is comfy, but the things you actually care about deserve your full effort — you are capable of far more than you advertise.',
      kindred: ['stanley', 'michael'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'It\'s Monday morning. Your first hour looks like:',
      options: [
        { label: 'Making the rounds — greeting everyone, testing out new jokes, boosting morale whether they asked or not', points: { michael: 2, kelly: 1 } },
        { label: 'Easing in with coffee while quietly setting up something amusing for later', points: { jim: 2, stanley: 1 } },
        { label: 'Already deep into my checklist — I was here early and my systems are humming', points: { dwight: 2, angela: 1 } },
        { label: 'Head down, doing what\'s required, mentally counting the hours until lunch', points: { stanley: 2, kevin: 1 } },
      ],
    },
    {
      id: 2,
      text: 'A coworker\'s birthday is coming up. Your role in the celebration:',
      options: [
        { label: 'I AM the celebration — speech, entertainment, possibly a themed costume', points: { michael: 2, kelly: 1 } },
        { label: 'Running the planning committee so everything is tasteful, on budget, and correct', points: { angela: 2, pam: 1 } },
        { label: 'I\'m mostly here for the cake, and I will be first in line for it', points: { kevin: 2, stanley: 1 } },
        { label: 'Quietly making the handmade card or decoration that ends up meaning the most', points: { pam: 2, jim: 1 } },
      ],
    },
    {
      id: 3,
      text: 'A meeting has gone twenty minutes over. You are:',
      options: [
        { label: 'Doodling in the margins and trading amused glances with my favorite person across the room', points: { pam: 2, jim: 1 } },
        { label: 'Saying what everyone is thinking: "Can we wrap this up?" — and meaning it', points: { stanley: 2, angela: 1 } },
        { label: 'Somehow steering the discussion into a story about my weekend', points: { kelly: 2, michael: 1 } },
        { label: 'Taking detailed notes and challenging weak points — meetings are serious business', points: { dwight: 2 } },
      ],
    },
    {
      id: 4,
      text: 'A friend is having a genuinely terrible day. Your move:',
      options: [
        { label: 'Drop everything for a big gesture — I will embarrass myself completely if it gets one laugh out of them', points: { michael: 2, kevin: 1 } },
        { label: 'Show up with their favorite snacks and something low-stakes and fun to do', points: { kevin: 2, jim: 1 } },
        { label: 'Full debrief: who hurt them, every detail, and I am on their side one thousand percent', points: { kelly: 2 } },
        { label: 'Listen quietly now, then leave a small thoughtful something for them to find later', points: { pam: 2, angela: 1 } },
      ],
    },
    {
      id: 5,
      text: 'Be honest — what does your desk (or room) look like?',
      options: [
        { label: 'A personal shrine: photos, mementos, and at least one item guaranteed to start a conversation', points: { kelly: 2, michael: 1 } },
        { label: 'Immaculate. Labeled. Everything at right angles — and yes, I notice that yours isn\'t', points: { angela: 2, dwight: 1 } },
        { label: 'Minimal and functional, with one or two hidden jokes for people who pay attention', points: { jim: 2, stanley: 1 } },
        { label: 'The snack drawer is the main attraction and everybody knows it', points: { kevin: 2 } },
      ],
    },
    {
      id: 6,
      text: 'How do you handle conflict with someone you see every day?',
      options: [
        { label: 'Head-on: state the facts, cite the rules, escalate through proper channels if needed', points: { dwight: 2, angela: 1 } },
        { label: 'Sidestep the drama, then quietly defuse it later with humor', points: { jim: 2, kevin: 1 } },
        { label: 'I need everyone to like me, so expect a heartfelt (possibly excessive) reconciliation gesture', points: { michael: 2, pam: 1 } },
        { label: 'Tell my three closest confidants every detail... but confront them directly? We\'ll see', points: { kelly: 2 } },
      ],
    },
    {
      id: 7,
      text: 'Your dream weekend:',
      options: [
        { label: 'Working my land — projects, animals, self-sufficiency. Idle hands are wasted hands', points: { dwight: 2 } },
        { label: 'Crossword puzzle, long nap, family time, and absolutely zero thoughts about work', points: { stanley: 2, kevin: 1 } },
        { label: 'Farmers market in the morning, painting or a craft project in the afternoon, cozy evening in', points: { pam: 2, angela: 1 } },
        { label: 'Reality TV marathon, a little retail therapy, and my group chats absolutely thriving', points: { kelly: 2, michael: 1 } },
      ],
    },
    {
      id: 8,
      text: 'What do you secretly want people to say about you when you\'re not around?',
      options: [
        { label: '"The funniest, most beloved person I know — basically family"', points: { michael: 2, kelly: 1 } },
        { label: '"Effortlessly cool, but would drop everything for the people they love"', points: { jim: 2, pam: 1 } },
        { label: '"The single most capable person to have around in a crisis"', points: { dwight: 2, angela: 1 } },
        { label: '"Knows exactly what matters in life and doesn\'t apologize for it"', points: { stanley: 2, kevin: 1 } },
      ],
    },
    {
      id: 9,
      text: 'There\'s a potluck coming up. What do you bring?',
      options: [
        { label: 'My legendary specialty dish, made in a comically large pot — it takes all night and it\'s worth it', points: { kevin: 2, michael: 1 } },
        { label: 'Something impeccable, coordinated with the theme, with correct serving utensils and a label', points: { angela: 2, pam: 1 } },
        { label: 'Something cute I grabbed on the way — I\'m really there for the people and the gossip', points: { kelly: 2, jim: 1 } },
        { label: 'The exact same reliable dish I bring every single year. It works. Why would I change it?', points: { stanley: 2, dwight: 1 } },
      ],
    },
    {
      id: 10,
      text: 'Choose a life philosophy:',
      options: [
        { label: 'Standards exist for a reason — hold the line even when it makes you unpopular', points: { angela: 2, dwight: 1 } },
        { label: 'Don\'t take any of it too seriously. The people around you are the actual point', points: { jim: 2, pam: 1 } },
        { label: 'Go big with your whole heart, even if you embarrass yourself sometimes', points: { michael: 2, kelly: 1 } },
        { label: 'Protect your peace — work funds your life, not the other way around', points: { stanley: 2, kevin: 1 } },
      ],
    },
  ],
};
