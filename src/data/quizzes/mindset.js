// Growth Mindset Meter — 'likert' mode with overall-score bands.
// Fixed-mindset statements are reverse-keyed; higher overall % = more growth-oriented.

export default {
  key: 'mindset',
  mode: 'likert',
  resultsHeading: 'Your mindset reading',

  dimensions: {
    ability_beliefs: { label: 'Beliefs About Ability', color: 'bg-emerald-400' },
    effort_beliefs: { label: 'Relationship With Effort', color: 'bg-teal-400' },
  },

  bands: [
    {
      key: 'fixed',
      min: 0,
      name: 'Fixed Leaning',
      emoji: '🪨',
      color: 'from-slate-100 to-gray-50',
      accent: 'text-slate-600',
      tagline: '#ProtectiveMode #TalentStory #ReadyToThaw',
      description:
        'Right now, you tend to experience ability as something you either have or you don\'t — so struggle feels like a verdict, and it seems safer to stay where you already shine. Be gentle with yourself about this: a fixed mindset is almost always learned, often from years of being praised for being smart rather than for trying. Here is the genuinely good news, and it is the whole point — mindsets are not fixed either. The moment you catch the thought "I can\'t do this" and add the word "yet," the thaw has already begun.',
      strengths: ['Clear-eyed about current skills', 'Deep loyalty to proven strengths', 'Honest about what feels hard', 'One insight away from momentum'],
      growth: 'This week, pick one small thing you have written off as "not your thing" and give it twenty genuinely bad minutes. Your beliefs about ability change the same way abilities do — through evidence you create yourself.',
    },
    {
      key: 'mixed',
      min: 35,
      name: 'Mixed Mindset',
      emoji: '🌗',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#BothVoices #ContextDependent #TippingPoint',
      description:
        'You live where most people honestly live: growth-minded in some rooms, fixed in others. You may fully believe practice works for skills you feel safe in, while a quieter voice insists that math, or art, or public speaking is simply "not you." That split is not hypocrisy — it is a map of where you have been encouraged and where you have been bruised. And because mindsets are themselves changeable, every domain where the fixed voice still wins is a door, not a wall.',
      strengths: ['Already growth-minded somewhere', 'Aware of both inner voices', 'Realistic, not naive, about effort', 'Primed for a tipping point'],
      growth: 'Find the one domain where you say "I\'m just not a ___ person" most often, and treat it as an experiment rather than an identity. Borrow the growth voice from the areas where you already trust it.',
    },
    {
      key: 'growth_leaning',
      min: 60,
      name: 'Growth Leaning',
      emoji: '🌿',
      color: 'from-lime-100 to-emerald-50',
      accent: 'text-lime-700',
      tagline: '#YetThinking #FeedbackFriendly #StillStretching',
      description:
        'You genuinely believe abilities are built rather than issued, and it shows: you take on things you might fail at, you can hear critical feedback without hearing an insult, and "not yet" comes more naturally to you than "not ever." Under real pressure — public stakes, old insecurities, a skill tied to your identity — the fixed voice can still grab the microphone, and that is completely human. The skill you are developing now is noticing that voice without obeying it. Mindsets keep growing exactly the way you already believe everything else does.',
      strengths: ['Seeks out honest feedback', 'Frames failure as data', 'Takes on stretch challenges', 'Catches fixed thoughts in the act'],
      growth: 'Notice the specific situations where your growth mindset deserts you — usually the ones closest to your identity — and lower the stakes there on purpose. Practicing badly in private is how the last strongholds fall.',
    },
    {
      key: 'growth',
      min: 80,
      name: 'Growth Mindset',
      emoji: '🌳',
      color: 'from-emerald-100 to-teal-50',
      accent: 'text-emerald-600',
      tagline: '#PowerOfYet #ProcessOverProof #AlwaysBecoming',
      description:
        'You have deeply internalized the idea that people are grown, not stamped: effort reads as investment rather than evidence of inadequacy, feedback feels like fuel, and other people\'s excellence inspires you instead of threatening you. This orientation is one of the most reliable engines of long-term learning that psychology has found — and you came by it honestly, because mindsets are built, and you built this one. Keep in mind it is a practice rather than a trophy; even the greenest mindset has fixed moments on hard days. What you have is not a certificate — it is a garden that keeps growing as long as you keep tending it.',
      strengths: ['Treats effort as investment', 'Metabolizes failure into learning', 'Celebrates others\' growth', 'Chooses challenge over comfort'],
      growth: 'Your edge now is patience with people still stuck in the fixed story — including your past self. Share the process behind your progress, not just the results; that is how mindsets spread.',
    },
  ],

  questions: [
    { id: 1, text: 'With the right practice, I could get meaningfully better at almost anything.', dim: 'ability_beliefs' },
    { id: 2, text: "How intelligent you are is mostly set early in life and doesn't really change.", dim: 'ability_beliefs', reverse: true },
    { id: 3, text: 'When I watch someone excel, I mostly see the years of unglamorous work behind it.', dim: 'ability_beliefs' },
    { id: 4, text: "Either you have a talent for something or you don't.", dim: 'ability_beliefs', reverse: true },
    { id: 5, text: 'I have personally turned a weakness into a strength through practice.', dim: 'ability_beliefs' },
    { id: 6, text: "If I'm not good at something fairly quickly, I take that as a sign it isn't for me.", dim: 'ability_beliefs', reverse: true },
    { id: 7, text: 'Needing to work hard at something makes me suspect I lack the talent for it.', dim: 'effort_beliefs', reverse: true },
    { id: 8, text: 'I treat failure as information about my approach, not a verdict on my worth.', dim: 'effort_beliefs' },
    { id: 9, text: 'Honest critical feedback feels more like a gift than an attack.', dim: 'effort_beliefs' },
    { id: 10, text: "I'd rather look polished at what I know than be seen struggling at something new.", dim: 'effort_beliefs', reverse: true },
    { id: 11, text: 'The word "yet" belongs at the end of most of my "I can\'t do this" sentences.', dim: 'effort_beliefs' },
    { id: 12, text: 'When something gets genuinely difficult, my interest tends to evaporate.', dim: 'effort_beliefs', reverse: true },
  ],
};
