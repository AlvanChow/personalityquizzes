// Wheel of Life Balance Audit — 'likert' mode.
// Eight classic coaching spokes; the most nourished life area wins.

export default {
  key: 'lifewheel',
  mode: 'likert',
  resultsHeading: 'Your life balance snapshot',

  dimensions: {
    career: { label: 'Career', color: 'bg-sky-400' },
    money: { label: 'Money', color: 'bg-emerald-400' },
    health: { label: 'Health', color: 'bg-lime-400' },
    friends: { label: 'Friends', color: 'bg-amber-400' },
    love: { label: 'Love', color: 'bg-rose-400' },
    growth: { label: 'Growth', color: 'bg-violet-400' },
    fun: { label: 'Fun & Play', color: 'bg-orange-400' },
    environment: { label: 'Environment', color: 'bg-teal-400' },
  },

  results: {
    career: {
      name: 'The Calling',
      emoji: '💼',
      color: 'from-sky-100 to-blue-50',
      accent: 'text-sky-600',
      tagline: '#WorkThatFits #MondayReady #Purposeful',
      description:
        'Right now, your career is the brightest spoke on your wheel. Your work is giving back more energy than it takes, and what you do most days feels connected to something you actually care about — a combination many people spend decades chasing. Enjoy the rare pleasure of Mondays that do not feel like a sentence. This is what it looks like when effort and meaning point in the same direction.',
      strengths: ['Work that energizes you', 'A sense of professional purpose', 'Momentum you can feel', 'Skills being genuinely used'],
      growth: 'A thriving career can quietly annex the hours that belong to friends, health, and play — and a wheel with one long spoke still wobbles. Let this strong area fund the others, not replace them.',
    },
    money: {
      name: 'The Steady Ground',
      emoji: '🪙',
      color: 'from-emerald-100 to-green-50',
      accent: 'text-emerald-600',
      tagline: '#CalmNumbers #BufferBuilt #EnoughIsReal',
      description:
        'Money is your most nourished area right now — not necessarily because there is a fortune in the account, but because there is calm in the relationship. Surprise expenses bend your month without breaking it, and thinking about your finances brings more steadiness than dread. That quiet is worth more than most luxuries. Financial peace is the background hum that lets every other part of life play its melody.',
      strengths: ['A real buffer against surprises', 'Calm, not dread, around money', 'Spending aligned with values', 'Freedom to make choices'],
      growth: 'Remember that money is a strong spoke, not the wheel itself — it exists to fund health, connection, and joy. If the balance is growing while friendships or fun shrink, it may be time to spend some security on living.',
    },
    health: {
      name: 'The Vital Spark',
      emoji: '💪',
      color: 'from-lime-100 to-green-50',
      accent: 'text-lime-700',
      tagline: '#RestedAndReady #BodyAsHome #EnergyRich',
      description:
        'Your body is the strongest spoke on your wheel right now. You are sleeping, moving, and eating in ways you could actually sustain, and most mornings you wake up with energy you get to decide how to spend. That physical foundation is invisible right up until it is missing — and yours is holding beautifully. Health like this is not vanity; it is capacity for everything else you love.',
      strengths: ['Consistent energy through the day', 'Sustainable habits, not crash plans', 'A body you trust', 'Rest you actually get'],
      growth: 'The wheel matters more than any one spoke — vitality is at its best when it is spent on people, play, and purpose rather than only maintained. Point this energy at whichever life area is running on fumes.',
    },
    friends: {
      name: 'The Chosen Family',
      emoji: '🫂',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#CallAnyTime #DeepBench #KnownAndLoved',
      description:
        'Friendship is where your life is richest right now. You have people you could call at a hard moment without rehearsing first, and your calendar holds names that refill you rather than drain you. In an era when loneliness is quietly epidemic, a bench like yours is genuine wealth. You have built something that no promotion or purchase can replicate: being truly known.',
      strengths: ['Friends who show up', 'Conversations that go deep', 'Laughter on a regular basis', 'A safety net made of people'],
      growth: 'A full social life can gently crowd out solitude, savings, or the unglamorous errands other spokes need — and the wheel only rolls smoothly when they all get a turn. Bring your people along as you tend the quieter areas.',
    },
    love: {
      name: 'The Open Heart',
      emoji: '💞',
      color: 'from-rose-100 to-pink-50',
      accent: 'text-rose-600',
      tagline: '#DeeplySeen #WarmthAtHome #HeartFull',
      description:
        'Love is your most nourished area right now — whether that means a partnership where you feel deeply seen, or a hard-won peace with exactly where you are. There is warmth in your closest bonds, and affection flows in both directions without being rationed. That kind of emotional home base changes how every other challenge feels. You are living proof that intimacy is built in small, daily choices rather than grand gestures.',
      strengths: ['Feeling seen, not just liked', 'Affection given and received', 'Conflict that ends in repair', 'A soft place to land'],
      growth: 'Even the warmest bond cannot be the whole wheel — love thrives when both people also have health, friends, and pursuits of their own to bring home. Keep tending the spokes that make you interesting to the person who loves you.',
    },
    growth: {
      name: 'The Becoming',
      emoji: '🌱',
      color: 'from-violet-100 to-purple-50',
      accent: 'text-violet-600',
      tagline: '#AlwaysLearning #StretchZone #WorkInProgress',
      description:
        'Personal growth is the brightest spoke on your wheel: you are actively learning things that stretch you, and you can point to real ways this year\'s version of you outgrew last year\'s. That forward motion is its own kind of nourishment — humans wilt without it, whatever else is going well. You have made becoming someone a practice rather than an accident. The trajectory you are on is the most valuable thing you own.',
      strengths: ['Learning that stretches you', 'Visible progress year over year', 'Curiosity as a habit', 'Comfort with being a beginner'],
      growth: 'Growth is the spoke that feeds all the others — but the wheel still matters more than any single spoke, and self-improvement can become a polite way to postpone living. Let some of what you are becoming be enjoyed, not just upgraded.',
    },
    fun: {
      name: 'The Playful Spirit',
      emoji: '🎈',
      color: 'from-orange-100 to-amber-50',
      accent: 'text-orange-600',
      tagline: '#JoyOnPurpose #TimeFlies #SeriouslyPlayful',
      description:
        'Fun is your most nourished life area — and that is rarer and wiser than it sounds. You still do things purely because they delight you, and you regularly lose track of time inside something you love. Most adults quietly resign from play and then wonder where their spark went; you never handed in that resignation. Joy on purpose is a discipline, and you have kept it.',
      strengths: ['Hobbies with no ROI required', 'Regular flow-state time', 'Spontaneity kept alive', 'Delight as a default setting'],
      growth: 'Play shines brightest when the rest of the wheel is sturdy enough to hold it — fun stacked on neglected health or finances starts to feel like escape. Aim some of that playful energy at a spoke that has been waiting its turn.',
    },
    environment: {
      name: 'The Sanctuary Keeper',
      emoji: '🏡',
      color: 'from-teal-100 to-cyan-50',
      accent: 'text-teal-600',
      tagline: '#RestorativeSpace #RootedHere #HomeAsHaven',
      description:
        'Your environment is the strongest spoke on your wheel: home restores you instead of nagging you, and your surroundings — rooms, neighborhood, workspace — actually fit the person you are. That fit is easy to underrate until you have lived without it. A space that welcomes you back every day is quiet, compounding self-care. You have built a backdrop that makes the rest of your life easier to live.',
      strengths: ['A home that recharges you', 'Surroundings that reflect you', 'Order without rigidity', 'A workspace that works'],
      growth: 'A beautiful nest matters most for what happens inside and beyond it — the wheel needs every spoke, and sanctuaries can quietly become hiding places. Use this restorative base as a launchpad toward the areas still under construction.',
    },
  },

  questions: [
    { id: 1, text: 'My work gives me energy more often than it drains me.', dim: 'career' },
    { id: 2, text: 'What I do most days feels connected to something I actually care about.', dim: 'career' },
    { id: 3, text: 'I could cover an unexpected expense without it wrecking my month.', dim: 'money' },
    { id: 4, text: 'When I think about my finances, I feel more calm than dread.', dim: 'money' },
    { id: 5, text: 'My body feels rested and capable most days of the week.', dim: 'health' },
    { id: 6, text: "I sleep, move, and eat in ways I'd be happy to keep for decades.", dim: 'health' },
    { id: 7, text: 'I have friends I could call at a hard moment without rehearsing first.', dim: 'friends' },
    { id: 8, text: 'My weeks regularly include people who refill me rather than drain me.', dim: 'friends' },
    { id: 9, text: 'I feel deeply seen in my closest relationship — or genuinely at peace with my relationship status.', dim: 'love' },
    { id: 10, text: 'There is real warmth and affection in my life right now.', dim: 'love' },
    { id: 11, text: 'I am currently learning something that stretches me.', dim: 'growth' },
    { id: 12, text: "I can point to a real way I've grown in the past year.", dim: 'growth' },
    { id: 13, text: "I regularly do things just because they're fun, not because they're productive.", dim: 'fun' },
    { id: 14, text: 'Within the last month, I lost track of time doing something I love.', dim: 'fun' },
    { id: 15, text: 'My home feels like a place that restores me, not another to-do list.', dim: 'environment' },
    { id: 16, text: 'My physical surroundings — home, neighborhood, workspace — fit who I am.', dim: 'environment' },
  ],
};
