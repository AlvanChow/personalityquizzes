import def from './cake';
import { registerBattery } from './battery';

// 6-result, 4-axis compat quiz: the battery's small-roster defaults apply
// unchanged (entropy ≥ 0.85·log2(6) ≈ 2.20 bits, top share ≤ 2.2/6 ≈ 36.7%,
// flip rate ≥ 0.45).
//
// Question order: [tempo+, tempo-, social+, social-, novelty+, novelty-,
// spotlight+, spotlight-, cross(novelty/spotlight), cross(social/spotlight)].
registerBattery(def, {
  probes: [
    // Ships fast, skips the manual, trusts the proven route — Action
    // Oriented (Layer Cake) territory.
    { name: 'full-speed executor', answers: [1, -1, 0, 0, -0.5, 1, 0, 0, 0, 0], expect: ['layercake'] },
    // Deliberate, heads-down, loves a novel angle on a hard problem, shuns
    // the spotlight — Problem Solving (Cupcake) territory.
    { name: 'quiet problem-cracker', answers: [-1, 1, -1, 1, 1, -0.5, -1, 1, 0, -1], expect: ['cupcake'] },
    // Bold, front-of-room, rallies people and grabs the clicker — Influence
    // (Tiramisu) territory.
    { name: 'front-of-room closer', answers: [1, 0, 0.5, 0, 0, 0, 1, -1, 0.5, 0.5], expect: ['tiramisu'] },
  ],
});
