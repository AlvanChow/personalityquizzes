// Verification battery for the Friends vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// hand-built archetype probes proving the axes point where the theme says.
//
// Probe answer arrays follow Q's order in friends.js:
//   [spontaneous, planner, gang, solo, offbeat, proper, loud, quiet,
//    impulse-takeout-night(cross), joke-not-speech(cross)]

import def from './friends';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Meticulous host: plans everything, gathers everyone, plays it
      // by the book, keeps the volume respectably up.
      name: 'meticulous host',
      answers: [-1, 1, 1, -1, -0.5, 1, 0.5, -0.5, 0.5, -0.5],
      expect: ['monica', 'ross'],
    },
    {
      // Quiet counter-watcher: keeps to routine, guards the heart,
      // says almost nothing and notices absolutely everything.
      name: 'quiet counter-watcher',
      answers: [-0.5, 0.5, -1, 1, 0, 0.5, -1, 1, -1, 0],
      expect: ['gunther', 'david'],
    },
    {
      // Offbeat free spirit: improvises life, keeps some of the gang
      // close, and wears the weirdness proudly.
      name: 'offbeat free spirit',
      answers: [1, -1, 0.5, 0, 1, -1, 0.5, 0, 0.5, 0.5],
      expect: ['phoebe', 'frank'],
    },
  ],
});
