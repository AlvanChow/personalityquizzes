import def from './disney';
import { registerBattery } from './battery';

// Archetype probes: hand-built answer sheets (Likert values per question in
// disney.js Q order) that must land on thematically-correct characters.
// Axes: [leap, together, horizon, show].
registerBattery(def, {
  probes: [
    {
      // Leaps first, allergic to plans, aches for far-off shores, happy in a
      // bit of spotlight, picks the dream over staying put.
      name: 'restless horizon-chaser',
      answers: [1, -1, 0, 0, 1, -1, 0.5, -0.5, -1, 1],
      expect: ['ariel', 'peter_pan'],
    },
    {
      // Careful planner, family-first, deepest roots at home, does wonderful
      // things quietly, people over dreams every time.
      name: 'devoted hearth-keeper',
      answers: [0, 1, 1, -1, -1, 1, -0.5, 0.5, 1, -1],
      expect: ['mufasa', 'woody', 'mulan'],
    },
    {
      // Meticulous long-game schemer: solitary, ambitious for a bigger stage,
      // theatrical about it, and the dream outranks everybody.
      name: 'grand ambitious loner',
      answers: [-1, 1, -1, 1, 1, -1, 1, -1, -1, 0],
      expect: ['scar', 'ursula', 'maleficent'],
    },
  ],
});
