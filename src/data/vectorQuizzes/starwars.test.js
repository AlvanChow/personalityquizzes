import def from './starwars';
import { registerBattery } from './battery';

// Archetype probes: hand-built answer sheets (Likert values per question in
// starwars.js Q order) that must land on thematically-correct characters.
// Axes: [logos, bond, drive, spark].
registerBattery(def, {
  probes: [
    {
      // Gut-led, people-first, meant-for-more — but would still pick a loved
      // one over the dream. The farmboy staring past the horizon.
      name: 'hopeful big-hearted dreamer',
      answers: [1, -0.5, 1, -1, 1, -1, 0.5, -0.5, 0.5, 0],
      expect: ['luke', 'r2d2', 'poe'],
    },
    {
      // Meticulous, solitary, throne-hungry, gives absolutely nothing away.
      name: 'patient long-game mastermind',
      answers: [-1, 1, -1, 1, 1, -1, -1, 1, -1, -0.5],
      expect: ['palpatine', 'maul', 'vader', 'boba'],
    },
    {
      // Careful, devoted, guards the home front, chooses people over glory
      // every single time.
      name: 'steadfast home-front protector',
      answers: [-0.5, 0.5, 1, -1, -1, 1, 0.5, -0.5, 1, 0],
      expect: ['padme', 'c3po', 'leia', 'chewbacca'],
    },
  ],
});
