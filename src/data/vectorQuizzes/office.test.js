// Verification battery for The Office vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// hand-built archetype probes proving the axes point where the theme says.
//
// Probe answer arrays follow Q's order in office.js:
//   [wing-it, system, knows-everyone, headphones, keeping-score,
//    guard-weekends, loud-excitement, eyebrow-lottery,
//    favorite-over-boss(cross), deadpan-mischief(cross)]

import def from './office';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Prepared sentinel: systems for everything, keeps the circle small,
      // openly hungry for the title, intensity always simmering.
      name: 'prepared sentinel',
      answers: [-1, 1, -0.5, 0.5, 1, -0.5, 0.5, -0.5, -1, -0.5],
      expect: ['dwight', 'angela', 'jan'],
    },
    {
      // Sunshine people-pleaser: improvises cheerfully, knows the whole
      // floor, would take beloved over boss every time, feelings on max.
      name: 'sunshine people-pleaser',
      answers: [0.5, -0.5, 1, -1, -0.5, 0.5, 1, -1, 1, 0],
      expect: ['erin', 'michael', 'kevin'],
    },
    {
      // Lone-wolf hustler: wings it, skips the small talk, all ambition,
      // too cool to emote about any of it.
      name: 'lone-wolf hustler',
      answers: [1, -0.5, -1, 1, 1, -1, -0.5, 0.5, -1, 0],
      expect: ['ryan', 'creed', 'jan'],
    },
  ],
});
