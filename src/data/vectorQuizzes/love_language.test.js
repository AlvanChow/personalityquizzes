import def from './love_language';
import { registerBattery } from './battery';

// 5-result, 3-axis framework quiz: the five love languages sit at well-spread
// directions (closest pair ≈ cosine 0.5), so the battery's small-roster
// defaults apply unchanged (entropy ≥ 0.85·log2(5) ≈ 1.97 bits, top share
// ≤ 44%, flip rate ≥ 0.45).
//
// Question order: [say+, show-, hours+, keepsake-, close+, distance-,
// cross(hours/close), cross(show/keepsake), cross(say/distance),
// cross(say/hours)].
registerBattery(def, {
  probes: [
    // Says it out loud, trusts words over errands, feels loved across any
    // distance via letters and calls — Words of Affirmation.
    { name: 'heart out loud', answers: [1, -1, 0, 0, 0, 1, 0, 0, 1, 0.5], expect: ['words'] },
    // Treasures keepsakes, hunts the perfect little surprise, no need for a
    // whole afternoon or a hug to feel it — Thoughtful Gifts.
    { name: 'quiet noticer', answers: [0, 0.5, -1, 1, 0, 1, -0.5, 1, 0, -0.5], expect: ['gifts'] },
    // Hugger, couch-and-shoulders person, distance starves them — Physical
    // Touch.
    { name: 'open arms', answers: [0, 0, 0.5, 0, 1, -1, 1, 0, -1, 0], expect: ['touch'] },
  ],
});
