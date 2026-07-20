import def from './pokemon';
import { registerBattery } from './battery';

// Q order: [0] volt+, [1] volt-, [2] bond+, [3] bond-, [4] drive+,
// [5] drive-, [6] wild+, [7] wild-, [8] bond/drive cross, [9] volt/wild cross.
registerBattery(def, {
  probes: [
    {
      name: 'sleepy homebody (deep calm, easy living)',
      answers: [-1, 1, 0, 0, -1, 1, 0, 0, 0.5, -1],
      expect: ['snorlax', 'lapras'],
    },
    {
      name: 'lone champion (solo path, championship drive)',
      answers: [0.5, -0.5, -1, 1, 1, -1, 0, 0, -1, 0],
      expect: ['charizard', 'mewtwo', 'gyarados'],
    },
    {
      name: 'party trickster (full charge, bonded, wild card)',
      answers: [1, -1, 1, -1, 0, 0, 1, -1, 0, 1],
      expect: ['gengar', 'squirtle', 'pikachu'],
    },
  ],
});
