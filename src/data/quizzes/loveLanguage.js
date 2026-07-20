// How You Give & Receive Love — 'pick' mode quiz inspired by the five love languages.
// Warm, reflective self-knowledge quiz: how you naturally express care, and what
// makes you feel most appreciated — in romance and in friendship alike.

export default {
  key: 'love_language',
  mode: 'pick',
  resultsHeading: 'Your love style breakdown',

  results: {
    words: {
      name: 'Words of Affirmation',
      emoji: '💬',
      color: 'from-rose-100 to-pink-50',
      accent: 'text-rose-600',
      tagline: '#SayItOutLoud #HeartOnPaper #IHeardYou',
      description:
        'For you, love becomes real when it is spoken. A specific compliment, a heartfelt text, someone saying "I\'m proud of you" at exactly the right moment — these land deeper for you than any grand gesture. You give love the same way: you are the friend who writes the long birthday message, the partner who says the kind thing out loud instead of just thinking it. Your words have probably carried people through weeks they could not have managed alone.',
      strengths: ['Says the thing others only think', 'Remembers exactly what people need to hear', 'Makes appreciation specific, not generic', 'Builds people up in their own voice'],
      growth: 'Because words matter so much to you, careless ones can cut deeper than the speaker ever intended. Practice letting actions count as evidence of love too — some people who adore you will never be fluent in your language.',
      kindred: ['time', 'touch'],
    },
    time: {
      name: 'Quality Time',
      emoji: '⏳',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#FullyPresent #PhoneDown #JustUs',
      description:
        'Attention is your currency of love. You do not need the fancy plan — you need the phone face-down, the unhurried afternoon, the feeling that being with you is exactly where someone wants to be. You notice distraction instantly, and you offer presence generously: you are the friend who actually shows up, stays late, and listens all the way to the end of the story. To be truly with someone is, for you, the whole point.',
      strengths: ['Gives rare, undivided attention', 'Shows up consistently', 'Turns ordinary moments into connection', 'Listens past the surface'],
      growth: 'When people you love are busy or scattered, it can feel like rejection when it is usually just life. Naming what you need — "I miss real time with you" — works better than quietly keeping score of cancelled plans.',
      kindred: ['touch', 'words'],
    },
    gifts: {
      name: 'Thoughtful Gifts',
      emoji: '🎁',
      color: 'from-violet-100 to-purple-50',
      accent: 'text-violet-600',
      tagline: '#SawThisAndThoughtOfYou #TokenOfLove #TheNoticer',
      description:
        'For you, a gift was never about the object — it is proof that someone was paying attention when you were not looking. The exact tea you mentioned once in passing, the postcard from a city you dream about: these say "you live in my mind" more convincingly than any speech. You give the same way, keeping a quiet mental catalog of what the people you love love, and delighting in the moment the perfect small thing finds its person.',
      strengths: ['Listens for the details others miss', 'Turns memory into meaning', 'Marks occasions so they feel special', 'Generous without being showy'],
      growth: 'Not everyone speaks in objects, and a forgotten occasion is rarely a verdict on how much you matter. Let people know that thoughtfulness — not price, not polish — is what you are really hoping to receive.',
      kindred: ['acts', 'words'],
    },
    acts: {
      name: 'Acts of Service',
      emoji: '🛠️',
      color: 'from-emerald-100 to-teal-50',
      accent: 'text-emerald-600',
      tagline: '#LoveIsAVerb #ConsiderItDone #ShowDontTell',
      description:
        'You believe love is something you do. While others are composing the perfect message, you have already fixed the wobbly shelf, handled the errand, and left dinner in the fridge. Being cared for, to you, looks like someone lightening your load without being asked — noticing the thing you were dreading and simply making it disappear. Your devotion is quiet, practical, and absolutely dependable, and the people close to you feel it in a hundred small handled things.',
      strengths: ['Notices needs before they\'re spoken', 'Follows through, every time', 'Loves practically and reliably', 'Makes hard weeks lighter'],
      growth: 'You can get so busy doing for people that you forget to simply be with them — and you rarely let anyone return the favor. Receiving help gracefully is its own act of love; it tells people their care landed.',
      kindred: ['gifts', 'time'],
    },
    touch: {
      name: 'Physical Touch',
      emoji: '🤗',
      color: 'from-sky-100 to-blue-50',
      accent: 'text-sky-600',
      tagline: '#HugFirst #WarmPresence #ShoulderToLeanOn',
      description:
        'Closeness, for you, is literal. A real hug hello, a hand on the shoulder at the hard moment, sitting close enough that words become optional — this is how love reaches you fastest and how you offer it most naturally. You are often the warmest person in the room, the one whose hugs friends genuinely miss when you are far away. Long before you have found the right words, your presence has already said them.',
      strengths: ['Comforts without needing words', 'Radiates warmth and welcome', 'Grounds people in stressful moments', 'Makes affection feel safe and easy'],
      growth: 'Distance — physical or emotional — can feel like starvation to you in ways others do not always understand. Learning to feel loved through words and time as well gives your heart more than one doorway.',
      kindred: ['time', 'words'],
    },
  },

  questions: [
    {
      id: 1,
      text: 'A close friend just landed the job they\'ve been chasing for months. What\'s your instinct?',
      options: [
        { label: 'Send a long, specific message about exactly why they earned this', points: { words: 2 } },
        { label: 'Clear your whole evening so you can celebrate together properly', points: { time: 2 } },
        { label: 'Hunt down a small congratulations gift tied to an inside joke', points: { gifts: 2 } },
        { label: 'Show up with dinner handled so all they have to do is enjoy it', points: { acts: 2, time: 1 } },
        { label: 'Give them the biggest hug of their life the second you see them', points: { touch: 2 } },
      ],
    },
    {
      id: 2,
      text: 'Think of a moment you felt deeply loved. What was most likely happening?',
      options: [
        { label: 'Someone told me, in real words, what I mean to them', points: { words: 2 } },
        { label: 'Someone gave me their full, unhurried attention — phone away, nowhere else to be', points: { time: 2 } },
        { label: 'Someone gave me something that proved they\'d really been listening', points: { gifts: 2 } },
        { label: 'Someone quietly took care of something I\'d been dreading', points: { acts: 2 } },
        { label: 'A long hug, a hand on my shoulder, someone simply staying close', points: { touch: 2 } },
      ],
    },
    {
      id: 3,
      text: 'Your partner or best friend has had a brutal week. How do you show up?',
      options: [
        { label: 'Remind them who they are: "You\'re handling this better than you think"', points: { words: 2 } },
        { label: 'Block off the evening and just be with them, no agenda', points: { time: 2 } },
        { label: 'Leave a small comfort at their door — favorite snack, a silly card', points: { gifts: 2 } },
        { label: 'Silently take three chores off their plate before they can protest', points: { acts: 2 } },
        { label: 'Blanket, couch, sit close — comfort first, conversation optional', points: { touch: 2, time: 1 } },
      ],
    },
    {
      id: 4,
      text: 'In any close relationship, what quietly stings the most?',
      options: [
        { label: 'Feeling appreciated but never actually hearing it said', points: { words: 2 } },
        { label: 'Being together but never having their full attention', points: { time: 2 } },
        { label: 'An occasion remembered at the last minute, with zero thought behind it', points: { gifts: 2 } },
        { label: 'Being the only one who carries the practical load', points: { acts: 2 } },
        { label: 'Warmth drying up — no hugs, no closeness, just polite distance', points: { touch: 2 } },
      ],
    },
    {
      id: 5,
      text: 'You need to apologize and really mean it. Beyond the words "I\'m sorry," you…',
      options: [
        { label: 'Write out exactly what you got wrong and what they mean to you', points: { words: 2 } },
        { label: 'Ask for real time together so you can reconnect properly', points: { time: 2 } },
        { label: 'Bring a small peace offering chosen with obvious care', points: { gifts: 2 } },
        { label: 'Repair whatever your mistake caused before they even ask', points: { acts: 2 } },
        { label: 'Offer a hug that lasts until things feel okay again', points: { touch: 2 } },
      ],
    },
    {
      id: 6,
      text: 'A dear friend moves across the country. How do you keep the friendship alive?',
      options: [
        { label: 'Long voice notes and messages that say what they mean to me', points: { words: 2 } },
        { label: 'A standing video call that neither of us is allowed to cancel', points: { time: 2 } },
        { label: 'Real mail: postcards, tiny packages, inside jokes made physical', points: { gifts: 2 } },
        { label: 'Order dinner to their door on their worst weeks, from 2,000 miles away', points: { acts: 2 } },
        { label: 'Count the days until the airport hug — screens never quite do it for me', points: { touch: 2, time: 1 } },
      ],
    },
    {
      id: 7,
      text: 'Which small moment would secretly make your entire day?',
      options: [
        { label: 'A text out of nowhere: "I was just thinking about how great you are"', points: { words: 2 } },
        { label: 'Someone saying "no plans, no agenda — I just want to hang out with you"', points: { time: 2 } },
        { label: 'Finding a little "saw this and thought of you" surprise on your desk', points: { gifts: 2 } },
        { label: 'Coming home to discover the task you\'d been dreading is already done', points: { acts: 2 } },
        { label: 'A spontaneous, wholehearted hug from someone you love', points: { touch: 2 } },
      ],
    },
    {
      id: 8,
      text: 'When you\'re getting to know someone new, how do you build the bond?',
      options: [
        { label: 'Deep conversation — I want to trade words late into the night', points: { words: 2 } },
        { label: 'Doing things together — shared hours are how people become real to me', points: { time: 2 } },
        { label: 'Quietly noting what they love, saving it for the perfect surprise later', points: { gifts: 2 } },
        { label: 'Finding small ways to be useful to them before they ever ask', points: { acts: 2 } },
        { label: 'Easy warmth — hugs hello, high fives, sitting comfortably close', points: { touch: 2 } },
      ],
    },
    {
      id: 9,
      text: 'What\'s your signature move as a friend?',
      options: [
        { label: 'The hype person — pep talks, toasts, and the exact right words at the right time', points: { words: 2 } },
        { label: 'The one who always shows up — and always stays a little longer', points: { time: 2 } },
        { label: 'The rememberer — no birthday, milestone, or tiny victory goes unmarked', points: { gifts: 2 } },
        { label: 'The doer — moving day, airport runs, soup when you\'re sick', points: { acts: 2 } },
        { label: 'The warm one — greeter of hugs, squeezer of shoulders, human sunshine', points: { touch: 2 } },
      ],
    },
    {
      id: 10,
      text: 'At the end of a genuinely hard day, what actually refills you?',
      options: [
        { label: 'Hearing someone say, sincerely, "I\'m proud of you"', points: { words: 2 } },
        { label: 'Unhurried company — someone fully present, just for me', points: { time: 2 } },
        { label: 'A small treat that says someone was thinking of me today', points: { gifts: 2 } },
        { label: 'Someone stepping in on the logistics so I don\'t face them alone', points: { acts: 2 } },
        { label: 'Physical closeness — a hug, a cuddle, a shoulder to lean on', points: { touch: 2 } },
      ],
    },
  ],
};
