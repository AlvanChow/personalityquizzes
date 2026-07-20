// Verification battery for the NBA Legend vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// hand-built archetype probes proving the axes point where the theme says.
//
// Probe answer arrays follow Q's order in nba.js:
//   [improvise, drill-basics, assist-first, my-hands, run-hot, calm-under-fire,
//    big-audience, quietly-great, prove-them-wrong(cross), style-points(cross)]

import def from './nba';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Stone-cold fundamentalist: drilled, team-first, ice in the veins,
      // allergic to headlines — the quiet cornerstone.
      name: 'stone-cold fundamentalist',
      answers: [-1, 1, 1, -1, -1, 1, -1, 1, -0.5, -1],
      expect: ['duncan', 'big_ben'],
    },
    {
      // Joyful team creator: improvises freely, lives to set others up,
      // stays cool and keeps a low profile.
      name: 'joyful team creator',
      answers: [1, -1, 1, -1, -0.5, 0.5, -0.5, 0.5, 0, 0.5],
      expect: ['nash', 'curry', 'manu'],
    },
    {
      // Solo showman on full blaze: all flair, wants the last shot,
      // runs hot, loves the biggest possible stage.
      name: 'solo showman on full blaze',
      answers: [1, -1, -1, 1, 1, -1, 1, -1, 1, 1],
      expect: ['barkley', 'iverson', 'rodman'],
    },
  ],
});
