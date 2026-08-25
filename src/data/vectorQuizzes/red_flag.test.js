// Verification battery for the Red Flag vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// archetype probes proving the two axes point where the roster says.
//
// Probe answer arrays follow Q's order in red_flag.js:
//   [they know in 48h(+pur), played it cool(-pur), full throttle(+pur),
//    checks the exits(-pur), honest thing date one(+open),
//    unheard chapters(-open), finishing the conversation(+open),
//    researches thoroughly(-open), falls fast says everything(+pur+open),
//    light and undefined(-pur-open)]

import def from './red_flag';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Comes on strong and says everything — soulmates by Thursday.
      name: 'soulmates by thursday',
      answers: [1, -1, 1, -0.5, 0.5, -0.5, 0.5, 0, 1, -0.5],
      expect: ['lovebomber', 'debater'],
    },
    {
      // Keeps distance, keeps warmth on a drip feed.
      name: 'midnight like, no reply',
      answers: [-1, 1, -1, 1, -0.5, 0.5, 0, 0.5, -0.5, 0.5],
      expect: ['breadcrumber', 'freespirit'],
    },
    {
      // Mild pursuit, cards held very close, does the research.
      name: 'federal investigator',
      answers: [0.5, -0.5, 0.5, 0, -1, 1, -0.5, 1, 0, -0.5],
      expect: ['detective', 'fortress'],
    },
    {
      // No filter, always one more point.
      name: 'one more point',
      answers: [0.5, -0.5, 0, 0, 1, -1, 1, -1, 0.5, 0],
      expect: ['debater', 'therapist'],
    },
  ],
});
