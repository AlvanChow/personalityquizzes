// Verification battery for the wizarding house vector quiz.
//
// Uses the shared Monte-Carlo harness (battery.js): structural integrity,
// reachability, entropy, top-share concentration, and sensitivity — plus
// hand-built archetype probes proving the two axes sort the way the houses
// say they do. With a 4-house roster the harness thresholds adapt
// automatically (entropy floor 0.85·log2(4) = 1.7 bits, flip floor 0.45).
//
// Probe answer arrays follow Q's order in house.js:
//   [leap first(+nerve), walk around it(-nerve), win with people(+crew),
//    guard my becoming(-crew), speak up on the spot(+nerve),
//    wait for the moment(-nerve), unglamorous role(+crew),
//    great over liked(-crew), 3am door(+nerve+crew), rules are suggestions(+nerve-crew)]

import def from './house';
import { registerBattery } from './battery';

registerBattery(def, {
  probes: [
    {
      // Daring AND devoted: leaps, speaks up, and does it all for their
      // people — the gryffindor quadrant, straight down the diagonal.
      name: 'bold defender',
      answers: [1, -1, 1, -1, 1, -1, 1, -1, 1, 0],
      expect: ['gryffindor'],
    },
    {
      // Deliberate AND devoted: patient, team-first, allergic to drama,
      // still first out the door for a friend — the hufflepuff quadrant.
      name: 'steadfast friend',
      answers: [-1, 1, 1, -1, -1, 1, 1, -1, 0.5, -1],
      expect: ['hufflepuff'],
    },
    {
      // Decisive AND self-directed: clear personal vision, greatness over
      // approval, rules as suggestions — the slytherin quadrant.
      name: 'ambitious strategist',
      answers: [1, -1, -1, 1, 0.5, -1, -1, 1, -0.5, 1],
      expect: ['slytherin'],
    },
  ],
});
