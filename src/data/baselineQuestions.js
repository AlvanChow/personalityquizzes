export const baselineQuestions = [
  // Extraversion (E)
  { id: 1, text: 'Am the life of the party.', trait: 'E', reversed: false },
  { id: 2, text: 'Feel comfortable around people.', trait: 'E', reversed: false },
  { id: 3, text: "Don't mind being the center of attention.", trait: 'E', reversed: false },
  { id: 4, text: "Don't talk a lot.", trait: 'E', reversed: true },
  { id: 5, text: 'Keep in the background.', trait: 'E', reversed: true },

  // Agreeableness (A)
  { id: 6, text: "Sympathize with others' feelings.", trait: 'A', reversed: false },
  { id: 7, text: 'Have a soft heart.', trait: 'A', reversed: false },
  { id: 8, text: 'Take time out for others.', trait: 'A', reversed: false },
  { id: 9, text: 'Feel little concern for others.', trait: 'A', reversed: true },
  { id: 10, text: 'Am not really interested in others.', trait: 'A', reversed: true },

  // Conscientiousness (C)
  { id: 11, text: 'Am always prepared.', trait: 'C', reversed: false },
  { id: 12, text: 'Pay attention to details.', trait: 'C', reversed: false },
  { id: 13, text: 'Get chores done right away.', trait: 'C', reversed: false },
  { id: 14, text: 'Often forget to put things back in their proper place.', trait: 'C', reversed: true },
  { id: 15, text: 'Make a mess of things.', trait: 'C', reversed: true },

  // Neuroticism (N)
  { id: 16, text: 'Get stressed out easily.', trait: 'N', reversed: false },
  { id: 17, text: 'Worry about things.', trait: 'N', reversed: false },
  { id: 18, text: 'Am easily disturbed.', trait: 'N', reversed: false },
  { id: 19, text: 'Am relaxed most of the time.', trait: 'N', reversed: true },
  { id: 20, text: 'Seldom feel blue.', trait: 'N', reversed: true },

  // Openness to Experience (O)
  { id: 21, text: 'Have a rich vocabulary.', trait: 'O', reversed: false },
  { id: 22, text: 'Have a vivid imagination.', trait: 'O', reversed: false },
  { id: 23, text: 'Have excellent ideas.', trait: 'O', reversed: false },
  { id: 24, text: 'Am not interested in abstract ideas.', trait: 'O', reversed: true },
  { id: 25, text: 'Do not have a good imagination.', trait: 'O', reversed: true },
];

export const likertOptions = [
  { value: 1, label: 'Strongly Disagree' },
  { value: 2, label: 'Disagree' },
  { value: 3, label: 'Neutral' },
  { value: 4, label: 'Agree' },
  { value: 5, label: 'Strongly Agree' },
];
