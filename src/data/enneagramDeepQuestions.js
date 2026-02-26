// 36-item Enneagram core fears/desires inventory (4 questions per type)
// Uses weighted 5-point Likert scale

const enneagramLikert = (type) => [
  { value: 5, label: 'Very Accurate', addsToType: type, weight: 4 },
  { value: 4, label: 'Moderately Accurate', addsToType: type, weight: 2 },
  { value: 3, label: 'Neutral', addsToType: type, weight: 0 },
  { value: 2, label: 'Moderately Inaccurate', addsToType: type, weight: -1 },
  { value: 1, label: 'Very Inaccurate', addsToType: type, weight: -2 },
];

export const enneagramDeepQuestions = [
  // Type 1
  { id: 1, text: 'I have a strong inner critic that tells me when things aren\'t perfect.', trait: '1', options: enneagramLikert('1') },
  { id: 2, text: 'I feel a deep sense of obligation to fix what is wrong in the world.', trait: '1', options: enneagramLikert('1') },
  { id: 3, text: 'It is very hard for me to relax when there are chores to be done.', trait: '1', options: enneagramLikert('1') },
  { id: 4, text: 'I am highly organized and methodical because mistakes bother me.', trait: '1', options: enneagramLikert('1') },
  // Type 2
  { id: 5, text: 'I am deeply driven to be loved and needed by others.', trait: '2', options: enneagramLikert('2') },
  { id: 6, text: 'I often put the needs of my friends and family ahead of my own.', trait: '2', options: enneagramLikert('2') },
  { id: 7, text: 'I naturally know what other people need, sometimes before they do.', trait: '2', options: enneagramLikert('2') },
  { id: 8, text: 'I feel unappreciated if people don\'t acknowledge how much I help them.', trait: '2', options: enneagramLikert('2') },
  // Type 3
  { id: 9, text: 'My self-worth is closely tied to my successes and achievements.', trait: '3', options: enneagramLikert('3') },
  { id: 10, text: 'I am highly adaptable and can change my persona to impress an audience.', trait: '3', options: enneagramLikert('3') },
  { id: 11, text: 'I fear being seen as a failure more than almost anything else.', trait: '3', options: enneagramLikert('3') },
  { id: 12, text: 'I am very goal-oriented and constantly push myself to excel.', trait: '3', options: enneagramLikert('3') },
  // Type 4
  { id: 13, text: 'I feel that I am fundamentally different and unique from others.', trait: '4', options: enneagramLikert('4') },
  { id: 14, text: 'I experience deep, intense emotions that others often don\'t understand.', trait: '4', options: enneagramLikert('4') },
  { id: 15, text: 'I long for a sense of identity and authentic meaning in my life.', trait: '4', options: enneagramLikert('4') },
  { id: 16, text: 'I sometimes withdraw from others because I feel misunderstood.', trait: '4', options: enneagramLikert('4') },
  // Type 5
  { id: 17, text: 'I prefer to observe situations from a distance rather than jump in.', trait: '5', options: enneagramLikert('5') },
  { id: 18, text: 'I hoard my time and energy because I easily feel depleted by people.', trait: '5', options: enneagramLikert('5') },
  { id: 19, text: 'I feel most secure when I have mastered a complex subject or skill.', trait: '5', options: enneagramLikert('5') },
  { id: 20, text: 'I tend to rely purely on logic and disconnect from my emotions.', trait: '5', options: enneagramLikert('5') },
  // Type 6
  { id: 21, text: 'I naturally anticipate worst-case scenarios and plan for them.', trait: '6', options: enneagramLikert('6') },
  { id: 22, text: 'I place a high value on loyalty, trust, and security in my relationships.', trait: '6', options: enneagramLikert('6') },
  { id: 23, text: 'I often struggle with self-doubt and look to authorities for guidance.', trait: '6', options: enneagramLikert('6') },
  { id: 24, text: 'I am highly vigilant and constantly scan my environment for threats.', trait: '6', options: enneagramLikert('6') },
  // Type 7
  { id: 25, text: 'I have a severe fear of missing out and want to experience everything.', trait: '7', options: enneagramLikert('7') },
  { id: 26, text: 'I avoid negative emotions by staying busy and making fun plans.', trait: '7', options: enneagramLikert('7') },
  { id: 27, text: 'I am spontaneous, optimistic, and love starting new adventures.', trait: '7', options: enneagramLikert('7') },
  { id: 28, text: 'I sometimes struggle to finish projects because I get distracted by newer, more exciting ideas.', trait: '7', options: enneagramLikert('7') },
  // Type 8
  { id: 29, text: 'I have a strong need to be in control and avoid being vulnerable.', trait: '8', options: enneagramLikert('8') },
  { id: 30, text: 'I am naturally confrontational and will step up to protect the weak.', trait: '8', options: enneagramLikert('8') },
  { id: 31, text: 'People often describe me as intense, direct, and commanding.', trait: '8', options: enneagramLikert('8') },
  { id: 32, text: 'I respect people who stand their ground and don\'t back down from a fight.', trait: '8', options: enneagramLikert('8') },
  // Type 9
  { id: 33, text: 'I will do almost anything to avoid conflict and maintain inner peace.', trait: '9', options: enneagramLikert('9') },
  { id: 34, text: 'I have a habit of merging with others\' preferences instead of asserting my own.', trait: '9', options: enneagramLikert('9') },
  { id: 35, text: 'I am easygoing, accommodating, and often serve as a mediator.', trait: '9', options: enneagramLikert('9') },
  { id: 36, text: 'I sometimes struggle with inertia and tuning out when things get tense.', trait: '9', options: enneagramLikert('9') },
];
