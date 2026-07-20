import def from './onepiece';
import { registerBattery } from './battery';

// Archetype probes: hand-built answer sheets (Likert values per question in
// onepiece.js Q order) that must land on thematically-correct characters.
// Axes: [helm, crew, drive, show].
registerBattery(def, {
  probes: [
    {
      // Pure instinct, crew everywhere, one giant dream, heart on sleeve,
      // picks the dream over staying anchored, loves an entrance.
      name: 'loud dream-chasing captain',
      answers: [1, -1, 1, -1, 1, -1, 1, -1, -1, 1],
      expect: ['luffy', 'ace'],
    },
    {
      // Careful planner, crew-first, happiest looking after the harbor,
      // stone-faced, people over dreams every single time.
      name: 'steady stone-faced caretaker',
      answers: [-1, 1, 1, -1, -1, 1, -1, 1, 1, -1],
      expect: ['jinbe', 'chopper', 'katakuri'],
    },
    {
      // Solitary ambitious strategist: meticulous, alone by choice, chasing
      // a big goal, gives absolutely nothing away.
      name: 'solitary ambitious strategist',
      answers: [-1, 1, -1, 1, 1, -1, -1, 1, -1, -1],
      expect: ['law', 'mihawk', 'robin'],
    },
  ],
});
