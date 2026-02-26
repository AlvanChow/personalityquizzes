// Open Extended Jungian Type Scales (OEJTS) — 20-item short form
// Forced-choice (A/B) format: each question maps to one of four dimensions

export const mbtiDeepQuestions = [
  // ── E vs I ────────────────────────────────────────────────────────────────────
  { id: 1, text: 'At a social event or party...', trait: 'IE', options: [{ value: 'a', label: 'I get fired up by the party.', pointsTo: 'E', weight: 1 }, { value: 'b', label: 'I get worn out by the party.', pointsTo: 'I', weight: 1 }] },
  { id: 2, text: 'I consider myself to be...', trait: 'IE', options: [{ value: 'a', label: 'Energetic.', pointsTo: 'E', weight: 1 }, { value: 'b', label: 'Mellow.', pointsTo: 'I', weight: 1 }] },
  { id: 3, text: 'When I have a decision to make, I...', trait: 'IE', options: [{ value: 'a', label: 'Talk it over with other people.', pointsTo: 'E', weight: 1 }, { value: 'b', label: 'Make the decision alone.', pointsTo: 'I', weight: 1 }] },
  { id: 4, text: 'In conversations, I generally...', trait: 'IE', options: [{ value: 'a', label: 'Talk more.', pointsTo: 'E', weight: 1 }, { value: 'b', label: 'Listen more.', pointsTo: 'I', weight: 1 }] },
  { id: 5, text: 'On a typical weekend, I...', trait: 'IE', options: [{ value: 'a', label: 'Go out on the town.', pointsTo: 'E', weight: 1 }, { value: 'b', label: 'Stay at home.', pointsTo: 'I', weight: 1 }] },

  // ── S vs N ────────────────────────────────────────────────────────────────────
  { id: 6, text: 'When looking at information, I...', trait: 'SN', options: [{ value: 'a', label: 'Like knowing all the facts.', pointsTo: 'S', weight: 1 }, { value: 'b', label: 'Like filling in the blanks.', pointsTo: 'N', weight: 1 }] },
  { id: 7, text: 'I consider myself more...', trait: 'SN', options: [{ value: 'a', label: 'Realistic.', pointsTo: 'S', weight: 1 }, { value: 'b', label: 'Imaginative.', pointsTo: 'N', weight: 1 }] },
  { id: 8, text: 'I prefer to focus on...', trait: 'SN', options: [{ value: 'a', label: 'The present realities.', pointsTo: 'S', weight: 1 }, { value: 'b', label: 'Future possibilities.', pointsTo: 'N', weight: 1 }] },
  { id: 9, text: 'When starting a project, I want...', trait: 'SN', options: [{ value: 'a', label: 'The exact details.', pointsTo: 'S', weight: 1 }, { value: 'b', label: 'The big picture.', pointsTo: 'N', weight: 1 }] },
  { id: 10, text: 'I tend to trust...', trait: 'SN', options: [{ value: 'a', label: 'My personal experience.', pointsTo: 'S', weight: 1 }, { value: 'b', label: 'Underlying theories.', pointsTo: 'N', weight: 1 }] },

  // ── T vs F ────────────────────────────────────────────────────────────────────
  { id: 11, text: 'When making a decision, I usually...', trait: 'TF', options: [{ value: 'a', label: 'Use reason and logic.', pointsTo: 'T', weight: 1 }, { value: 'b', label: 'Use my instinct and feelings.', pointsTo: 'F', weight: 1 }] },
  { id: 12, text: 'I base my personal morality more on...', trait: 'TF', options: [{ value: 'a', label: 'Justice and fairness.', pointsTo: 'T', weight: 1 }, { value: 'b', label: 'Compassion and empathy.', pointsTo: 'F', weight: 1 }] },
  { id: 13, text: 'I care more if a statement is...', trait: 'TF', options: [{ value: 'a', label: 'Objectively true or false.', pointsTo: 'T', weight: 1 }, { value: 'b', label: 'Morally good or bad.', pointsTo: 'F', weight: 1 }] },
  { id: 14, text: 'When judging others, I tend to consider...', trait: 'TF', options: [{ value: 'a', label: 'The outcome of their actions.', pointsTo: 'T', weight: 1 }, { value: 'b', label: 'Their original intent.', pointsTo: 'F', weight: 1 }] },
  { id: 15, text: 'I consider myself more...', trait: 'TF', options: [{ value: 'a', label: 'Thick-skinned and tough.', pointsTo: 'T', weight: 1 }, { value: 'b', label: 'Sensitive and easily hurt.', pointsTo: 'F', weight: 1 }] },

  // ── J vs P ────────────────────────────────────────────────────────────────────
  { id: 16, text: 'My work and living spaces are...', trait: 'JP', options: [{ value: 'a', label: 'Highly organized.', pointsTo: 'J', weight: 1 }, { value: 'b', label: 'Slightly chaotic.', pointsTo: 'P', weight: 1 }] },
  { id: 17, text: 'When approaching tasks, I usually...', trait: 'JP', options: [{ value: 'a', label: 'Prepare well in advance.', pointsTo: 'J', weight: 1 }, { value: 'b', label: 'Improvise on the spot.', pointsTo: 'P', weight: 1 }] },
  { id: 18, text: 'When I have a project due, I...', trait: 'JP', options: [{ value: 'a', label: 'Get the work done right away.', pointsTo: 'J', weight: 1 }, { value: 'b', label: 'Tend to procrastinate.', pointsTo: 'P', weight: 1 }] },
  { id: 19, text: 'I prefer situations where I can...', trait: 'JP', options: [{ value: 'a', label: 'Commit to a firm plan.', pointsTo: 'J', weight: 1 }, { value: 'b', label: 'Keep my options open.', pointsTo: 'P', weight: 1 }] },
  { id: 20, text: 'I feel more comfortable when I...', trait: 'JP', options: [{ value: 'a', label: 'Have a strict routine.', pointsTo: 'J', weight: 1 }, { value: 'b', label: 'Have flexibility.', pointsTo: 'P', weight: 1 }] },
];
