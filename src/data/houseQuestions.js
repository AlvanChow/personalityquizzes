// Each option maps to exactly one house:
// g = Gryffindor, h = Hufflepuff, r = Ravenclaw, s = Slytherin.
// House positions are shuffled across questions so answer order carries no signal.
export const houseQuestions = [
  {
    id: 1,
    text: 'You find a locked door with a sign that says KEEP OUT. What do you do?',
    options: [
      { value: 'r', label: 'Study the door — who locked it, and what are they hiding?' },
      { value: 'g', label: 'Try the handle. Signs like that are basically invitations' },
      { value: 'h', label: 'Leave it alone — someone put that sign there for a reason' },
      { value: 's', label: 'Walk away… and come back later when no one is around' },
    ],
  },
  {
    id: 2,
    text: 'Your best friend takes the blame for something you did. You...',
    options: [
      { value: 'g', label: 'Stand up and confess on the spot, whatever it costs' },
      { value: 's', label: 'Let it play out — you can repay the favor quietly later' },
      { value: 'h', label: 'Own up in private and insist on taking the punishment' },
      { value: 'r', label: 'Calmly lay out the facts until the truth speaks for itself' },
    ],
  },
  {
    id: 3,
    text: 'Which of these would be hardest for you to live with?',
    options: [
      { value: 'h', label: 'Betraying someone who trusted you' },
      { value: 'r', label: 'Being wrong and never finding out' },
      { value: 's', label: 'Being ordinary — just another face in the crowd' },
      { value: 'g', label: 'Backing down when it mattered most' },
    ],
  },
  {
    id: 4,
    text: 'A group project is falling apart the night before the deadline. You...',
    options: [
      { value: 's', label: 'Make sure your part is flawless — your name is on this' },
      { value: 'h', label: "Stay up late quietly patching everyone else's pieces" },
      { value: 'g', label: 'Rally the group with a now-or-never speech' },
      { value: 'r', label: 'Rebuild the plan — cut what is broken, save what works' },
    ],
  },
  {
    id: 5,
    text: 'Years from now, you would most want to be remembered as...',
    options: [
      { value: 'g', label: 'The fearless one' },
      { value: 'r', label: 'The brilliant one' },
      { value: 's', label: 'The one who went places' },
      { value: 'h', label: 'The one people could always count on' },
    ],
  },
  {
    id: 6,
    text: 'You find a wallet stuffed with cash and no ID. You...',
    options: [
      { value: 'h', label: 'Turn it in untouched — someone is worried sick' },
      { value: 's', label: 'Hold onto it — if no one ever claims it, that is fate' },
      { value: 'r', label: 'Play detective — receipts and cards are full of clues' },
      { value: 'g', label: 'Post everywhere and personally track the owner down' },
    ],
  },
  {
    id: 7,
    text: 'Your ideal free afternoon looks like...',
    options: [
      { value: 'r', label: 'Falling down a rabbit hole about something fascinating' },
      { value: 'h', label: 'Cooking a big meal for the people you love' },
      { value: 'g', label: 'Anything with a little adrenaline in it' },
      { value: 's', label: 'Plotting your next big move over good coffee' },
    ],
  },
  {
    id: 8,
    text: 'You spot a classmate cheating on a big exam. You...',
    options: [
      { value: 's', label: 'Say nothing — but remember it. It might be useful' },
      { value: 'g', label: 'Confront them about it directly, face to face' },
      { value: 'r', label: 'Do nothing — they have only cheated themselves of the learning' },
      { value: 'h', label: 'Report it quietly. It is unfair to everyone who studied' },
    ],
  },
  {
    id: 9,
    text: 'A wish-granting creature offers you one gift. Pick.',
    options: [
      { value: 'g', label: 'Courage that never wavers, no matter the odds' },
      { value: 'h', label: 'A lifetime of unshakable friendships' },
      { value: 's', label: 'A quiet word of influence in every important room' },
      { value: 'r', label: 'The true answer to any question you ask' },
    ],
  },
  {
    id: 10,
    text: 'You are losing an argument you really care about. You...',
    options: [
      { value: 'r', label: 'Concede the point — being right matters more than winning' },
      { value: 's', label: 'Change the battlefield — win it another way, another day' },
      { value: 'h', label: 'Look for the middle ground you can both live with' },
      { value: 'g', label: 'Dig in and argue harder — you know you are right' },
    ],
  },
];
