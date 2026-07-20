// Emotional Intelligence Check-In — 'likert' mode.
// Four classic EQ domains; the strongest dimension becomes "your EQ superpower".

export default {
  key: 'eq',
  mode: 'likert',
  resultsHeading: 'Your EQ profile',

  dimensions: {
    self_awareness: { label: 'Self-Awareness', color: 'bg-sky-400' },
    self_management: { label: 'Self-Management', color: 'bg-emerald-400' },
    social_awareness: { label: 'Social Awareness', color: 'bg-amber-400' },
    relationships: { label: 'Relationship Skills', color: 'bg-rose-400' },
  },

  results: {
    self_awareness: {
      name: 'The Self-Knower',
      emoji: '🪞',
      color: 'from-sky-100 to-cyan-50',
      accent: 'text-sky-600',
      tagline: '#InnerCompass #NameItToTameIt #ClearEyed',
      description:
        'Your EQ superpower is the rarest one: you actually know what is going on inside you while it is happening. Where most people discover their feelings three days late, you can name yours in real time — and knowing why you react the way you do gives you a head start on every hard conversation. That inner clarity is the foundation the other three EQ skills are built on. It makes your apologies precise, your boundaries honest, and your decisions genuinely yours.',
      strengths: ['Names emotions in real time', 'Knows own triggers and patterns', 'Honest self-assessment', 'Decisions aligned with values'],
      growth: 'Self-knowledge can quietly become self-absorption if the spotlight never swings outward. Try turning that same curious, non-judgmental attention onto what the people around you might be feeling.',
    },
    self_management: {
      name: 'The Steady Hand',
      emoji: '🧘',
      color: 'from-emerald-100 to-teal-50',
      accent: 'text-emerald-600',
      tagline: '#GraceUnderFire #PauseButton #EvenKeel',
      description:
        'Your EQ superpower is the pause — that split second between feeling something and doing something, where you consistently choose well. Deadlines slip, plans implode, someone says the exact wrong thing, and you remain the person in the room whose voice does not change. People trust you with fragile situations because your emotions inform your choices without hijacking them. That steadiness is not coldness; it is strength that has learned its own dosage.',
      strengths: ['Responds instead of reacting', 'Recovers quickly from setbacks', 'Reliable under pressure', 'Keeps hard days contained'],
      growth: 'Composure can shade into suppression if the feelings you manage so well never get a voice at all. Letting trusted people see you unpolished now and then will deepen their trust, not dent it.',
    },
    social_awareness: {
      name: 'The Room-Reader',
      emoji: '📡',
      color: 'from-amber-100 to-yellow-50',
      accent: 'text-amber-700',
      tagline: '#EmotionalRadar #UnspokenHeard #QuietNoticer',
      description:
        'Your EQ superpower is perception: you read the emotional weather of a room the way other people read a clock. The colleague who went quiet, the friend whose "I\'m fine" arrived half a beat late, the tension nobody is naming — you catch it all, usually before anyone says a word. That radar makes people feel genuinely seen around you, which is one of the rarest gifts a person can give. You understand that most of what humans communicate never makes it into sentences.',
      strengths: ['Reads unspoken feelings', 'Notices who is being left out', 'Senses group mood shifts', 'Makes people feel seen'],
      growth: 'Sensing everything can mean carrying everything — and sometimes filling in stories the data does not support. Check your reads out loud ("you seem a little off today?") instead of quietly acting on them.',
    },
    relationships: {
      name: 'The Connector',
      emoji: '🤝',
      color: 'from-rose-100 to-pink-50',
      accent: 'text-rose-600',
      tagline: '#BridgeBuilder #RepairArtist #PeopleFirst',
      description:
        'Your EQ superpower is what happens between people: you build trust fast, keep it long, and repair it when it cracks. You can deliver hard feedback that lands as care, disagree without leaving scorch marks, and reach out first after a conflict while everyone else is still rehearsing their grievances. Friends route their crises through you because talking to you reliably makes things better. Relationships are not a soft skill for you — they are the operating system everything else runs on.',
      strengths: ['Builds trust quickly', 'Repairs conflict early', 'Gives feedback with warmth', 'Turns tension into conversation'],
      growth: 'Being everyone\'s bridge means a lot of foot traffic over you. Make sure the person who tends every relationship in your life is also on the list of people being tended to.',
    },
  },

  questions: [
    { id: 1, text: "I can name what I'm feeling while I'm feeling it.", dim: 'self_awareness' },
    { id: 2, text: 'I usually know why something upset me, not just that it did.', dim: 'self_awareness' },
    { id: 3, text: 'My mood often shifts without me noticing until someone else points it out.', dim: 'self_awareness', reverse: true },
    { id: 4, text: 'I have a clear sense of which situations bring out my best and my worst.', dim: 'self_awareness' },
    { id: 5, text: "When I'm frustrated, I can pause before saying something I'd regret.", dim: 'self_management' },
    { id: 6, text: 'A bad morning rarely gets to write the story of my whole day.', dim: 'self_management' },
    { id: 7, text: 'When plans fall apart at the last minute, I find my footing again quickly.', dim: 'self_management' },
    { id: 8, text: 'When stress builds up, I tend to snap at whoever happens to be nearby.', dim: 'self_management', reverse: true },
    { id: 9, text: 'When someone is quiet in a meeting, I notice.', dim: 'social_awareness' },
    { id: 10, text: 'I can usually sense the mood of a room within moments of walking in.', dim: 'social_awareness' },
    { id: 11, text: 'I often pick up on what someone is feeling before they say a word about it.', dim: 'social_awareness' },
    { id: 12, text: "I'm often surprised to learn that someone close to me had been struggling.", dim: 'social_awareness', reverse: true },
    { id: 13, text: 'People come to me when they need to talk something through.', dim: 'relationships' },
    { id: 14, text: 'I can disagree with someone and leave the relationship stronger than before.', dim: 'relationships' },
    { id: 15, text: 'After a conflict, I tend to wait for the other person to reach out first.', dim: 'relationships', reverse: true },
    { id: 16, text: 'Giving difficult feedback kindly is something I know how to do.', dim: 'relationships' },
  ],
};
