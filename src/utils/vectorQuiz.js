// Vector-space quiz engine.
//
// A "vector quiz" places every possible result at a hand-tuned position in an
// N-axis personality space and measures the taker on the same axes with
// weighted Likert items. Matching uses COSINE SIMILARITY — the direction of
// your profile (which traits lead, in what proportion), not its magnitude.
//
// Why not nearest-point? Two geometry failures, confirmed by simulation:
//   1. Mild characters near the origin are moderately close to everything, so
//      they win a structurally outsized share of outcomes.
//   2. Axes are measured by opposing question pairs, so an agree-with-
//      everything taker has pairs cancel and lands near the origin — where
//      the mild characters live — regardless of what they endorsed hardest.
// Direction survives both: a shrunken vector still points somewhere.
//
// The Monte-Carlo battery in the quiz's test file (reachability, entropy,
// sensitivity, archetype probes) guards these properties on every roster edit.

export function lighten(hex, amt) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substr(0, 2), 16);
  const g = parseInt(h.substr(2, 2), 16);
  const b = parseInt(h.substr(4, 2), 16);
  const m = (c) => Math.round(c + (255 - c) * amt);
  return '#' + [m(r), m(g), m(b)].map((x) => x.toString(16).padStart(2, '0')).join('');
}

// answers: array of Likert values in {-1,-.5,0,.5,1} (null = unanswered).
// Q: [{t, w:[...axes]}]; AXMAX: per-axis max |score| used for normalization.
export function userVector(answers, Q, AXMAX) {
  const s = new Array(AXMAX.length).fill(0);
  answers.forEach((a, i) => {
    if (a === null || a === undefined) return;
    Q[i].w.forEach((w, ax) => { s[ax] += a * w; });
  });
  return s.map((v, ax) => Math.max(-1, Math.min(1, v / AXMAX[ax])));
}

export function magOf(v) {
  return Math.sqrt(v.reduce((acc, x) => acc + x * x, 0)) || 1e-9;
}

// Cosine lands in [-1,1]; display as 60 + 39·sim clamped to [55,99] so perfect
// alignment reads 99% and orthogonality 60% — never a demoralizing "12% match".
export function matchPct(sim) {
  return Math.round(Math.max(55, Math.min(99, 60 + 39 * sim)));
}

// Rank all characters against the user vector. Below magnitude 0.05 the
// profile is undifferentiated and cosine is meaningless — fall back to
// nearest-point, which honestly hands a mild profile a mild character.
export function ranked(uv, CHARS) {
  const mu = magOf(uv);
  const lowSignal = mu < 0.05;
  return Object.keys(CHARS).map((k) => {
    const c = CHARS[k];
    let sim;
    if (lowSignal) {
      let d = 0;
      for (let ax = 0; ax < uv.length; ax++) { const df = uv[ax] - c.v[ax]; d += df * df; }
      sim = -Math.sqrt(d);
    } else {
      let dp = 0;
      for (let ax = 0; ax < uv.length; ax++) dp += uv[ax] * c.v[ax];
      sim = dp / (mu * magOf(c.v));
    }
    return { k, c, sim };
  }).sort((a, b) => b.sim - a.sim);
}
