// Verification battery for the Spirit Animal vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// archetype probes proving the two axes point where the roster says. With an
// 8-animal roster the harness thresholds adapt automatically.
//
// Probe answer arrays follow Q's order in spirit_animal.js:
//   [hard conversation(+bold), win people over(-bold), risk sharpens(+bold),
//    peace in the room(-bold), better with people(+pack), best alone(-pack),
//    tight-knit group(+pack), solo trip(-pack),
//    take charge(+bold+pack), protective watch(+bold-pack)]

import def from './spirit_animal';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Fierce and communal in equal measure — the lion/wolf ridge.
      name: 'pack leader',
      answers: [1, -0.5, 1, -1, 1, -1, 1, -0.5, 1, 0],
      expect: ['lion', 'wolf'],
    },
    {
      // Gentle, community-minded, conflict-averse — the deer's meadow,
      // with the dolphin next door.
      name: 'gentle heart of the herd',
      answers: [-1, 1, -0.5, 1, 1, -0.5, 1, 0, -0.5, -0.5],
      expect: ['deer', 'dolphin'],
    },
    {
      // Gentle AND solitary: watches, thinks, guards the quiet — owl country.
      name: 'solitary sage',
      answers: [-1, 1, -1, 1, -1, 1, -0.5, 1, -0.5, 0],
      expect: ['owl', 'cat'],
    },
    {
      // Fierce and solitary — the bear/eagle ridge.
      name: 'lone summit',
      answers: [1, -1, 1, -0.5, -1, 1, -0.5, 1, 0, 1],
      expect: ['bear', 'eagle'],
    },
  ],
});
