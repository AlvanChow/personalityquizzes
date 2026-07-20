import def from './superhero';
import { registerBattery } from './battery';

// Archetype probes: hand-built answer sheets (Likert values per question in
// superhero.js Q order) that must land on thematically-correct heroes.
// Axes: [instinct, team, maverick, spotlight].
registerBattery(def, {
  probes: [
    {
      // Plans everything, works alone, saves the day from the shadows —
      // the cowl-and-contingencies profile.
      name: 'shadow strategist',
      answers: [-1, 1, -1, 1, 0, 0, -1, 1, 0, -1],
      expect: ['batman', 'black_widow'],
    },
    {
      // Team-first guardian: people over ambition every time, does the
      // saving without needing the applause.
      name: 'sunny team guardian',
      answers: [0.5, 0, 1, -1, -1, 1, -0.5, 0.5, 1, 0],
      expect: ['superman', 'cap', 'spiderman'],
    },
    {
      // Limit-pushing showboat: fearless, self-directed, chasing the next
      // horizon with maximum flair.
      name: 'swaggering limit-pusher',
      answers: [0.5, -0.5, -0.5, 0.5, 1, -1, 1, -1, -1, 1],
      expect: ['ironman', 'green_lantern', 'captain_marvel'],
    },
  ],
});
