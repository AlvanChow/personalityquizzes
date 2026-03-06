// 2 questions per CliftonStrengths theme (34 themes × 2 = 68 questions)
// Options: 1 = "Not like me at all" → 4 = "Very much like me"
// Question 1 per theme: behavioral angle ("I tend to…")
// Question 2 per theme: motivational angle ("I feel energized by…" / "I find it natural to…")

const OPTIONS = [
  { value: 1, label: 'Not like me at all' },
  { value: 2, label: 'Slightly like me' },
  { value: 3, label: 'Mostly like me' },
  { value: 4, label: 'Very much like me' },
];

export const strengthsQuestions = [
  // ── Achiever (Executing) ──────────────────────────────────────────────────
  {
    id: 1,
    text: 'I feel most productive when I can point to something concrete I accomplished today.',
    trait: 'Achiever',
    options: OPTIONS,
  },
  {
    id: 2,
    text: 'I find it difficult to fully relax until I have made measurable progress on my goals.',
    trait: 'Achiever',
    options: OPTIONS,
  },

  // ── Arranger (Executing) ──────────────────────────────────────────────────
  {
    id: 3,
    text: 'When leading a project, I enjoy reconfiguring roles and resources to find the most effective combination.',
    trait: 'Arranger',
    options: OPTIONS,
  },
  {
    id: 4,
    text: 'I feel energized when I am coordinating multiple moving parts simultaneously.',
    trait: 'Arranger',
    options: OPTIONS,
  },

  // ── Belief (Executing) ────────────────────────────────────────────────────
  {
    id: 5,
    text: 'I make major life decisions based on deeply held core values, even when it is costly.',
    trait: 'Belief',
    options: OPTIONS,
  },
  {
    id: 6,
    text: 'I feel most alive when my work aligns with what I believe truly matters in life.',
    trait: 'Belief',
    options: OPTIONS,
  },

  // ── Consistency (Executing) ───────────────────────────────────────────────
  {
    id: 7,
    text: 'I go out of my way to ensure everyone is treated according to the same rules and standards.',
    trait: 'Consistency',
    options: OPTIONS,
  },
  {
    id: 8,
    text: 'I feel uncomfortable when some people receive preferential treatment over others.',
    trait: 'Consistency',
    options: OPTIONS,
  },

  // ── Deliberative (Executing) ──────────────────────────────────────────────
  {
    id: 9,
    text: 'Before making a decision, I carefully consider potential risks and unintended consequences.',
    trait: 'Deliberative',
    options: OPTIONS,
  },
  {
    id: 10,
    text: 'I feel more confident in my choices when I have had time to think through all possible pitfalls.',
    trait: 'Deliberative',
    options: OPTIONS,
  },

  // ── Discipline (Executing) ────────────────────────────────────────────────
  {
    id: 11,
    text: 'I naturally create routines, timelines, and structures to organize my daily work.',
    trait: 'Discipline',
    options: OPTIONS,
  },
  {
    id: 12,
    text: 'I feel unsettled when my environment or schedule lacks predictability and order.',
    trait: 'Discipline',
    options: OPTIONS,
  },

  // ── Focus (Executing) ─────────────────────────────────────────────────────
  {
    id: 13,
    text: 'When I set a goal, I filter out distractions and stay locked onto it until it is done.',
    trait: 'Focus',
    options: OPTIONS,
  },
  {
    id: 14,
    text: 'I feel frustrated when conversations or meetings drift away from the original purpose.',
    trait: 'Focus',
    options: OPTIONS,
  },

  // ── Responsibility (Executing) ────────────────────────────────────────────
  {
    id: 15,
    text: 'When I commit to something, I follow through even when it becomes inconvenient.',
    trait: 'Responsibility',
    options: OPTIONS,
  },
  {
    id: 16,
    text: 'I feel a strong sense of personal obligation to deliver on my commitments, no matter the obstacles.',
    trait: 'Responsibility',
    options: OPTIONS,
  },

  // ── Restorative (Executing) ───────────────────────────────────────────────
  {
    id: 17,
    text: 'I enjoy diagnosing what is wrong with a system, process, or situation and finding the fix.',
    trait: 'Restorative',
    options: OPTIONS,
  },
  {
    id: 18,
    text: 'I feel deep satisfaction when I can revive something that was broken or struggling.',
    trait: 'Restorative',
    options: OPTIONS,
  },

  // ── Activator (Influencing) ───────────────────────────────────────────────
  {
    id: 19,
    text: 'I push for action when teams get stuck in endless planning or deliberation.',
    trait: 'Activator',
    options: OPTIONS,
  },
  {
    id: 20,
    text: 'I feel energized the moment I can turn an idea or decision into a tangible first step.',
    trait: 'Activator',
    options: OPTIONS,
  },

  // ── Command (Influencing) ─────────────────────────────────────────────────
  {
    id: 21,
    text: 'When a situation calls for direction, I do not hesitate to step up and take charge.',
    trait: 'Command',
    options: OPTIONS,
  },
  {
    id: 22,
    text: 'I feel at ease addressing conflict or tension directly, where others might avoid it.',
    trait: 'Command',
    options: OPTIONS,
  },

  // ── Communication (Influencing) ───────────────────────────────────────────
  {
    id: 23,
    text: 'I enjoy finding vivid stories and language that bring abstract ideas to life for others.',
    trait: 'Communication',
    options: OPTIONS,
  },
  {
    id: 24,
    text: 'I feel most engaged when I can craft a message that truly resonates with an audience.',
    trait: 'Communication',
    options: OPTIONS,
  },

  // ── Competition (Influencing) ─────────────────────────────────────────────
  {
    id: 25,
    text: 'I regularly pay attention to how my performance compares to others around me.',
    trait: 'Competition',
    options: OPTIONS,
  },
  {
    id: 26,
    text: 'I feel a strong drive to win and a genuine sting when I fall short of first place.',
    trait: 'Competition',
    options: OPTIONS,
  },

  // ── Maximizer (Influencing) ───────────────────────────────────────────────
  {
    id: 27,
    text: 'I prefer to invest my time in developing already-strong talents rather than fixing weaknesses.',
    trait: 'Maximizer',
    options: OPTIONS,
  },
  {
    id: 28,
    text: 'I feel most rewarded when I help something that is already good become truly excellent.',
    trait: 'Maximizer',
    options: OPTIONS,
  },

  // ── Self-Assurance (Influencing) ──────────────────────────────────────────
  {
    id: 29,
    text: 'I trust my own instincts and judgment even when others push back against my decisions.',
    trait: 'Self-Assurance',
    options: OPTIONS,
  },
  {
    id: 30,
    text: 'I feel an inner confidence in my ability to manage my own life and handle what comes my way.',
    trait: 'Self-Assurance',
    options: OPTIONS,
  },

  // ── Significance (Influencing) ────────────────────────────────────────────
  {
    id: 31,
    text: 'I want my work to have a meaningful impact and be recognized as important by others.',
    trait: 'Significance',
    options: OPTIONS,
  },
  {
    id: 32,
    text: 'I feel driven to stand out by doing things that are excellent and worth noticing.',
    trait: 'Significance',
    options: OPTIONS,
  },

  // ── Woo (Influencing) ─────────────────────────────────────────────────────
  {
    id: 33,
    text: 'I enjoy meeting new people and quickly find common ground with almost anyone.',
    trait: 'Woo',
    options: OPTIONS,
  },
  {
    id: 34,
    text: 'I feel energized by winning over someone who was initially skeptical or reserved.',
    trait: 'Woo',
    options: OPTIONS,
  },

  // ── Adaptability (Relationship Building) ──────────────────────────────────
  {
    id: 35,
    text: 'I respond to unexpected changes or disruptions with flexibility rather than frustration.',
    trait: 'Adaptability',
    options: OPTIONS,
  },
  {
    id: 36,
    text: 'I feel comfortable taking each day as it comes rather than adhering to a rigid plan.',
    trait: 'Adaptability',
    options: OPTIONS,
  },

  // ── Connectedness (Relationship Building) ─────────────────────────────────
  {
    id: 37,
    text: 'I often reflect on how events and people are linked together in a larger, meaningful pattern.',
    trait: 'Connectedness',
    options: OPTIONS,
  },
  {
    id: 38,
    text: 'I feel a deep sense that nothing happens by accident and that all things are ultimately connected.',
    trait: 'Connectedness',
    options: OPTIONS,
  },

  // ── Developer (Relationship Building) ─────────────────────────────────────
  {
    id: 39,
    text: 'I notice small signs of growth in people and find joy in helping them develop further.',
    trait: 'Developer',
    options: OPTIONS,
  },
  {
    id: 40,
    text: 'I feel genuinely fulfilled when someone I have invested in reaches a new level of capability.',
    trait: 'Developer',
    options: OPTIONS,
  },

  // ── Empathy (Relationship Building) ───────────────────────────────────────
  {
    id: 41,
    text: 'I can sense what other people are feeling, even before they have put it into words.',
    trait: 'Empathy',
    options: OPTIONS,
  },
  {
    id: 42,
    text: 'I feel other people\'s emotions as if they were my own, making it hard to remain indifferent to their struggles.',
    trait: 'Empathy',
    options: OPTIONS,
  },

  // ── Harmony (Relationship Building) ───────────────────────────────────────
  {
    id: 43,
    text: 'When a group is in conflict, I look for areas of agreement and steer toward common ground.',
    trait: 'Harmony',
    options: OPTIONS,
  },
  {
    id: 44,
    text: 'I feel uncomfortable when disagreements go unresolved and actively work to find consensus.',
    trait: 'Harmony',
    options: OPTIONS,
  },

  // ── Includer (Relationship Building) ──────────────────────────────────────
  {
    id: 45,
    text: 'I actively try to bring people on the margins into the group so no one feels excluded.',
    trait: 'Includer',
    options: OPTIONS,
  },
  {
    id: 46,
    text: 'I feel bothered when I see someone being left out and instinctively work to include them.',
    trait: 'Includer',
    options: OPTIONS,
  },

  // ── Individualization (Relationship Building) ──────────────────────────────
  {
    id: 47,
    text: 'I quickly pick up on what makes each person unique and tailor my approach accordingly.',
    trait: 'Individualization',
    options: OPTIONS,
  },
  {
    id: 48,
    text: 'I feel more interested in understanding individual differences than in identifying what people have in common.',
    trait: 'Individualization',
    options: OPTIONS,
  },

  // ── Positivity (Relationship Building) ────────────────────────────────────
  {
    id: 49,
    text: 'I naturally bring enthusiasm and energy that lifts the mood of people around me.',
    trait: 'Positivity',
    options: OPTIONS,
  },
  {
    id: 50,
    text: 'I feel that life is genuinely better when approached with optimism, and I find it easy to do so.',
    trait: 'Positivity',
    options: OPTIONS,
  },

  // ── Relator (Relationship Building) ───────────────────────────────────────
  {
    id: 51,
    text: 'I invest deeply in a small circle of close relationships rather than spreading myself across many connections.',
    trait: 'Relator',
    options: OPTIONS,
  },
  {
    id: 52,
    text: 'I feel most connected when I can engage authentically with people I already know and trust.',
    trait: 'Relator',
    options: OPTIONS,
  },

  // ── Analytical (Strategic Thinking) ───────────────────────────────────────
  {
    id: 53,
    text: 'I question claims and look for evidence before accepting conclusions at face value.',
    trait: 'Analytical',
    options: OPTIONS,
  },
  {
    id: 54,
    text: 'I feel most satisfied when I have had the chance to fully examine the data behind a decision.',
    trait: 'Analytical',
    options: OPTIONS,
  },

  // ── Context (Strategic Thinking) ──────────────────────────────────────────
  {
    id: 55,
    text: 'I research the history and background of a situation before deciding how to act.',
    trait: 'Context',
    options: OPTIONS,
  },
  {
    id: 56,
    text: 'I feel that understanding how things came to be is essential to knowing where they should go.',
    trait: 'Context',
    options: OPTIONS,
  },

  // ── Futuristic (Strategic Thinking) ───────────────────────────────────────
  {
    id: 57,
    text: 'I regularly envision possibilities for the future and find it easy to inspire others with what could be.',
    trait: 'Futuristic',
    options: OPTIONS,
  },
  {
    id: 58,
    text: 'I feel most alive when I am imagining what the world could look like years or decades from now.',
    trait: 'Futuristic',
    options: OPTIONS,
  },

  // ── Ideation (Strategic Thinking) ─────────────────────────────────────────
  {
    id: 59,
    text: 'I love generating new ideas and making unexpected connections between unrelated concepts.',
    trait: 'Ideation',
    options: OPTIONS,
  },
  {
    id: 60,
    text: 'I feel a rush of excitement when a completely fresh concept clicks into place in my mind.',
    trait: 'Ideation',
    options: OPTIONS,
  },

  // ── Input (Strategic Thinking) ────────────────────────────────────────────
  {
    id: 61,
    text: 'I collect information, articles, and resources because they might be useful or interesting someday.',
    trait: 'Input',
    options: OPTIONS,
  },
  {
    id: 62,
    text: 'I feel satisfied knowing that my archive of knowledge and references is constantly growing.',
    trait: 'Input',
    options: OPTIONS,
  },

  // ── Intellection (Strategic Thinking) ─────────────────────────────────────
  {
    id: 63,
    text: 'I enjoy deep, solitary thinking and often lose track of time when wrestling with a complex idea.',
    trait: 'Intellection',
    options: OPTIONS,
  },
  {
    id: 64,
    text: 'I feel that thinking things through carefully is not just useful — it is intrinsically satisfying.',
    trait: 'Intellection',
    options: OPTIONS,
  },

  // ── Learner (Strategic Thinking) ──────────────────────────────────────────
  {
    id: 65,
    text: 'I actively seek out new subjects to study, even when they have no immediate practical application.',
    trait: 'Learner',
    options: OPTIONS,
  },
  {
    id: 66,
    text: 'I feel energized by the process of learning itself, regardless of where the knowledge leads.',
    trait: 'Learner',
    options: OPTIONS,
  },

  // ── Strategic (Strategic Thinking) ────────────────────────────────────────
  {
    id: 67,
    text: 'When facing a complex problem, I quickly map out multiple paths forward and select the best route.',
    trait: 'Strategic',
    options: OPTIONS,
  },
  {
    id: 68,
    text: 'I feel most effective when I can see through complexity and identify the patterns that others miss.',
    trait: 'Strategic',
    options: OPTIONS,
  },
];
