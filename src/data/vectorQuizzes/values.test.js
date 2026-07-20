// Verification battery for the Core Values Compass vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// hand-built archetype probes proving the two axes point where Schwartz's
// circumplex says. With a 6-value roster the harness thresholds adapt
// automatically (entropy floor 0.85·log2(6) ≈ 2.20 bits, flip floor 0.45).
//
// Probe answer arrays follow Q's order in values.js:
//   [pick the never-tried(+chg), settled life(-chg), challenge the rules(+chg),
//    fallback plan(-chg), keep score(+enh), smaller win for me(-enh),
//    name attached(+enh), strangers treated unfairly(-enh),
//    bold uncertain shot(+chg+enh), keep the team steady(-chg-enh)]

import def from './values';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // High self-enhancement with a slight openness lean: keeps score,
      // wants the credit, declines to hand wins away — the achievement
      // bearing (80°), well clear of stimulation's quadrant.
      name: 'undeniable achiever',
      answers: [0.5, -0.5, 0, 0, 1, -1, 1, -1, 0.5, -0.5],
      expect: ['achievement'],
    },
    {
      // High self-transcendence with a slight openness lean: gives wins
      // away, loses sleep over strangers, questions convenient rules —
      // the universalism bearing (285°), past benevolence's inner circle.
      name: 'planet-first conscience',
      answers: [0.5, 0, 1, 0, -1, 1, -1, 1, 0, 0],
      expect: ['universalism'],
    },
    {
      // Deep conservation with a whisper of self-enhancement: settled life,
      // fallback plans, no bold bets — the security bearing (165°), the
      // conservation flank benevolence doesn't own.
      name: 'steady guardian',
      answers: [-1, 1, -1, 1, 0, 0, 0.5, -0.5, -1, 0],
      expect: ['security'],
    },
  ],
});
