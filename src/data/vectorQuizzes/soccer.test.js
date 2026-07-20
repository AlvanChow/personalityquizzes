// Verification battery for the Soccer Icon vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// hand-built archetype probes proving the axes point where the theme says.
//
// Probe answer arrays follow Q's order in soccer.js:
//   [improvise, drill-basics, set-others-up, my-hands, heart-on-sleeve,
//    calm-under-stakes, big-audience, quietly-respected, style-counts(cross),
//    unglamorous-running(cross)]

import def from './soccer';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Street showman: pure improvisation, wants the ball himself, loves
      // the lights, allergic to grunt work — the maverick quadrant.
      name: 'street showman',
      answers: [1, -1, -1, 1, 0.5, -0.5, 1, -1, 1, -1],
      expect: ['cantona', 'higuita', 'maradona'],
    },
    {
      // Quiet engine: lives to set others up, no spotlight, happy to do
      // the unglamorous running — the selfless midfield heartbeat.
      name: 'quiet engine',
      answers: [-0.5, 0.5, 1, -1, 0, 0.5, -1, 1, 0, 1],
      expect: ['modric', 'puyol', 'maldini'],
    },
    {
      // Team-fire warrior: drilled, selfless, and burning about it —
      // the captain who tackles for the badge.
      name: 'team-fire warrior',
      answers: [-1, 1, 1, -1, 1, -1, -0.5, 0.5, -1, 1],
      expect: ['puyol', 'gattuso'],
    },
  ],
});
