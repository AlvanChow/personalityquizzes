// Grit & Perseverance Scale — 'likert' mode with overall-score bands.
// Passion = consistency of interests; Perseverance = sustained effort through setbacks.
// All items are original prose — not drawn from any published grit instrument.

export default {
  key: 'grit',
  mode: 'likert',
  resultsHeading: 'Your grit reading',

  dimensions: {
    passion: { label: 'Passion — Consistency of Interests', color: 'bg-orange-400' },
    perseverance: { label: 'Perseverance — Sustained Effort', color: 'bg-red-400' },
  },

  bands: [
    {
      key: 'explorer',
      min: 0,
      name: 'The Explorer',
      emoji: '🧭',
      color: 'from-sky-100 to-cyan-50',
      accent: 'text-sky-600',
      tagline: '#WideOpen #Sampler #SeasonOfSearch',
      description:
        'Your energy moves toward whatever is newest and most alive — you sample widely, drop what stops singing, and follow curiosity wherever it points next. That is not a character flaw; it is a strategy, and research on careers and creativity keeps vindicating it: people usually find the pursuit worth years of grit by first exploring broadly. Grit is at its most powerful when it is spent on the right thing, and you are still shopping wisely. The breadth you are banking now is exactly what deep commitment will draw on later.',
      strengths: ['Fearless curiosity', 'Fast learner across domains', 'Low sunk-cost bias', 'Rich cross-pollination of ideas'],
      growth: 'Exploration turns into avoidance only when nothing ever gets a second season. Pick the one pursuit that keeps quietly resurfacing and give it ninety days past the boring part — just to see what is on the other side.',
    },
    {
      key: 'builder',
      min: 40,
      name: 'The Builder',
      emoji: '🧱',
      color: 'from-amber-100 to-orange-50',
      accent: 'text-amber-700',
      tagline: '#BrickByBrick #FindingTheThread #SteadyEnough',
      description:
        'You have real staying power when something matters to you — you have finished hard things and kept promises to yourself — but your commitment is still selective, and a genuinely shiny new idea can occasionally talk you out of an old one. That puts you exactly where most accomplished people once stood: interests are consolidating, quitting is becoming a decision instead of a drift. You are past sampling and not yet all-in, which is a fine place to build from. The foundation is laid; what goes on top is a choice you get to make on purpose.',
      strengths: ['Finishes what truly matters', 'Learning to quit deliberately', 'Interests starting to converge', 'Balances novelty and follow-through'],
      growth: 'Your next level is fewer, bigger bets: write down the two or three pursuits you would still want to be working on in five years. Let the shiny new ideas audition for those slots instead of replacing them.',
    },
    {
      key: 'finisher',
      min: 65,
      name: 'The Finisher',
      emoji: '🏁',
      color: 'from-orange-100 to-amber-50',
      accent: 'text-orange-600',
      tagline: '#SeesItThrough #LongGame #QuietlyRelentless',
      description:
        'You are the person projects want assigned to them: when you start something, it gets finished — through the boring middle, past the setbacks, long after the initial excitement has left the building. Your interests hold steady across years, not weeks, and people who know you describe you as steady rather than streaky. This combination of durable passion and stubborn follow-through is rare, and it compounds: your years quietly stack instead of restarting. What looks like luck from the outside is mostly your refusal to leave things half-built.',
      strengths: ['Reliable follow-through', 'Durable long-term interests', 'Unfazed by the boring middle', 'Setbacks become fuel'],
      growth: 'Finishers can keep pouring effort into commitments that stopped deserving it — grit and stubbornness share a wardrobe. Once or twice a year, audit your long hauls and make sure each one is still worth its miles.',
    },
    {
      key: 'unbreakable',
      min: 85,
      name: 'The Unbreakable',
      emoji: '🔥',
      color: 'from-red-100 to-rose-50',
      accent: 'text-red-600',
      tagline: '#DecadeDeep #ThroughTheWall #KeeperOfTheFlame',
      description:
        'Your passion and perseverance are both running near the top of the scale: you have a through-line that has organized your choices for years, and setbacks that would end other people\'s projects barely change your pace. You do not just survive the wall — you have come to expect it, almost greet it, because you know most competitors turn around there. This is the profile shared by people who finish decade-sized ambitions. The flame you keep is not loud, but it does not go out.',
      strengths: ['Years-long consistency of purpose', 'Extraordinary resilience', 'Immune to shiny distractions', 'Effort as identity, not mood'],
      growth: 'The unbreakable sometimes forget they are allowed to rest — and that the people around them cannot always match the pace. Schedule recovery like it is part of the training, because it is.',
    },
  ],

  questions: [
    { id: 1, text: 'The things that fascinated me a few years ago still fascinate me today.', dim: 'passion' },
    { id: 2, text: "A shiny new idea can lure me away from a project I swore I'd finish.", dim: 'passion', reverse: true },
    { id: 3, text: 'I have one or two long-term pursuits that quietly organize my choices.', dim: 'passion' },
    { id: 4, text: 'Looking back, my interests seem to change with the seasons.', dim: 'passion', reverse: true },
    { id: 5, text: 'I could tell you what I want to be working toward three years from now.', dim: 'passion' },
    { id: 6, text: 'I tend to fall hard for a new hobby, then abandon it within a few months.', dim: 'passion', reverse: true },
    { id: 7, text: 'Setbacks sting, but they rarely make me quit.', dim: 'perseverance' },
    { id: 8, text: 'I finish what I start, even after the initial excitement wears off.', dim: 'perseverance' },
    { id: 9, text: 'When a goal starts demanding boring, repetitive work, I usually bow out.', dim: 'perseverance', reverse: true },
    { id: 10, text: 'People who know me well would call me steady rather than streaky.', dim: 'perseverance' },
    { id: 11, text: "I've kept a promise to myself for months after it stopped being fun.", dim: 'perseverance' },
    { id: 12, text: 'If success takes much longer than I expected, I start looking for the exit.', dim: 'perseverance', reverse: true },
  ],
};
