import def from './disc';
import { registerBattery } from './battery';

// 4-result, 2-axis framework quiz: the four DISC quadrants sit roughly 90°
// apart, so the battery's small-roster defaults apply unchanged
// (entropy ≥ 0.85·log2(4) = 1.70 bits, top share ≤ 55%, flip rate ≥ 0.45).
//
// Question order: [people+, task-, people+, task-, outgoing+, reserved-,
// outgoing+, reserved-, cross(people/outgoing), cross(task/outgoing)].
registerBattery(def, {
  probes: [
    // Task-focused and outgoing: skips small talk, ships fast, sharpened by
    // pressure — Dominance quadrant.
    { name: 'decisive driver', answers: [-1, 1, -1, 1, 1, -1, 1, -1, 0, 1], expect: ['driver'] },
    // People-focused and outgoing: thinks out loud, energized by strangers,
    // team morale over the task list — Influence quadrant.
    { name: 'warm rally-er', answers: [1, -1, 1, -1, 1, -1, 1, -1, 1, 0], expect: ['influencer'] },
    // Task-focused and reserved: sleeps on decisions, does it once carefully,
    // measures the week in finished work — Conscientiousness quadrant.
    { name: 'careful perfectionist', answers: [-1, 1, -1, 1, -1, 1, -1, 1, -1, 0], expect: ['analyst'] },
  ],
});
