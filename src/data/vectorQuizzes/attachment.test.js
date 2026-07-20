// Verification battery for the attachment style vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// hand-built archetype probes proving the two axes point where attachment
// theory says. With a 4-style roster the harness thresholds adapt
// automatically (entropy floor 0.85·log2(4) = 1.7 bits, flip floor 0.45).
//
// Probe answer arrays follow Q's order in attachment.js:
//   [slow-reply worry(+anx), handle alone(+av), their week(-anx),
//    say it out loud(-av), replay hangout(+anx), step back(+av),
//    take their word(-anx), lean on someone(-av),
//    eyes the exit(+anx+av), all-in & easy apart(-anx-av)]

import def from './attachment';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Low anxiety, low avoidance: trusts easily, leans in, rests in
      // connection — the secure quadrant, straight down the diagonal.
      name: 'steady harbor',
      answers: [-1, -1, 1, 1, -1, -1, 1, 1, -1, 1],
      expect: ['secure'],
    },
    {
      // High anxiety, low avoidance: worries and replays, but leans hard
      // toward people — reassurance-seeking, never distance-seeking.
      name: 'devoted worrier',
      answers: [1, -1, -1, 1, 1, -1, -1, 1, 0, 0],
      expect: ['anxious'],
    },
    {
      // High anxiety AND high avoidance: wants close, eyes the exit —
      // the push-pull that defines the fearful-avoidant quadrant.
      name: 'brave in-between',
      answers: [1, 1, -1, -1, 1, 1, -1, -1, 1, -1],
      expect: ['fearful'],
    },
  ],
});
