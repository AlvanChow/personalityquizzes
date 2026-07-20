// Verification battery for the Taylor Swift eras vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// hand-built archetype probes proving the axes point where the theme says.
//
// Probe answer arrays follow Q's order in eras.js:
//   [open, guarded, reinvent, rooted, full-feel, cool, spotlight,
//    candlelight, journal(cross), comeback(cross)]

import def from './eras';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Wholehearted hopeful romantic: loves out loud, a little nostalgic,
      // feels big, says it in the room rather than the journal.
      name: 'golden open heart',
      answers: [1, -1, 0, 0.5, 0.5, 0, 0.5, 0, -0.5, 0],
      expect: ['fearless', 'lover'],
    },
    {
      // Armored reinventor: guarded to strangers, thrives on the clean
      // slate, keeps a level head, plans the comeback.
      name: 'armored reinventor',
      answers: [-1, 1, 1, -1, -1, 1, 0, 0, 0, 1],
      expect: ['reputation', 'nineteen89'],
    },
    {
      // Firelight storyteller: rooted, quiet evenings, deep feelings that
      // land in a journal instead of the room.
      name: 'firelight storyteller',
      answers: [0, 1, -0.5, 1, 0.5, 0, -1, 1, 1, -0.5],
      expect: ['folklore', 'midnights'],
    },
  ],
});
