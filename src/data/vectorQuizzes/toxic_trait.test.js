// Verification battery for the Toxic Trait vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// archetype probes proving the two axes point where the roster says.
//
// Probe answer arrays follow Q's order in toxic_trait.js:
//   [redo the plan(+grip), hypothetical plans(-grip), can't delegate(+grip),
//    dodge under pressure(-grip), whose fault, out loud(+aim),
//    museum exhibit of blame(-aim), keeps receipts(+aim),
//    absorb silently(-aim), 'a lot'(+grip+aim), cancel plans(-grip-aim)]

import def from './toxic_trait';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Grips everything, aims outward: reorganizes the group's plans and
      // says whose fault it was — the control freak's home quadrant.
      name: 'clipboard commander',
      answers: [1, -1, 1, -1, 1, -0.5, 1, -1, 0.5, -0.5],
      expect: ['controlfreak', 'oneupper'],
    },
    {
      // Mild grip, strongly inward: assumes fault, absorbs friction,
      // replays it all at 2am.
      name: 'midnight archivist',
      answers: [0.5, -0.5, 0.5, -0.5, -1, 1, -0.5, 1, 0, -0.5],
      expect: ['overthinker', 'perfectionist'],
    },
    {
      // Lets go of everything, aimed outward-ish: leaves the chat, dodges
      // the plan, still keeps a little score — the ghost's hallway.
      name: 'read at midnight',
      answers: [-1, 1, -1, 1, 0.5, -0.5, 0.5, -0.5, 0, 0],
      expect: ['ghoster', 'flake'],
    },
    {
      // High grip, gently inward: redoes their own work, absorbs the cost.
      name: 'unsatisfied artisan',
      answers: [1, -1, 1, -1, -0.5, 0.5, 0, 0.5, 0, 0],
      expect: ['perfectionist', 'controlfreak'],
    },
  ],
});
