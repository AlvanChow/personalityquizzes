/**
 * Custom SVG glyphs for every quiz — one consistent duotone geometric style
 * (24×24 viewBox, soft fill + accent detail) so the catalog reads as one
 * designed system instead of a wall of platform emojis.
 *
 * Each glyph is intentionally representative: Big 5 is a pentagon radar,
 * Enneagram is the actual nine-point figure, Ikigai is the four-circle venn,
 * Career Explorer is the Holland hexagon, Naruto is an uzumaki spiral, etc.
 */

const C = {
  coral: '#f97066',
  rose: '#f43f5e',
  amber: '#f59e0b',
  emerald: '#10b981',
  teal: '#14b8a6',
  sky: '#38bdf8',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#8b5cf6',
  fuchsia: '#d946ef',
  slate: '#64748b',
  ink: '#475569',
};

const GLYPHS = {
  // ── Core ──────────────────────────────────────────────────────────────────
  big5: (
    <>
      {/* pentagon radar chart */}
      <polygon points="12,3.4 20.18,9.34 17.06,18.96 6.94,18.96 3.82,9.34" fill="none" stroke={C.teal} strokeWidth="1.6" strokeLinejoin="round" />
      <polygon points="12,6.8 17.2,10.4 15.3,16.6 8.6,16.2 7.4,10.2" fill={C.teal} fillOpacity=".3" stroke={C.teal} strokeWidth="1.3" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.4" fill={C.teal} />
    </>
  ),
  mbti: (
    <>
      {/* four dichotomy quadrants */}
      <rect x="4.2" y="4.2" width="7" height="7" rx="1.8" fill={C.coral} fillOpacity=".28" />
      <rect x="12.8" y="4.2" width="7" height="7" rx="1.8" fill={C.coral} />
      <rect x="4.2" y="12.8" width="7" height="7" rx="1.8" fill={C.coral} fillOpacity=".28" />
      <rect x="12.8" y="12.8" width="7" height="7" rx="1.8" fill={C.coral} fillOpacity=".28" />
    </>
  ),
  enneagram: (
    <>
      {/* the actual enneagram figure: circle, triangle, hexad */}
      <circle cx="12" cy="12" r="8.6" fill="none" stroke={C.violet} strokeWidth="1.5" />
      <polygon points="12,3.4 19.45,16.3 4.55,16.3" fill={C.violet} fillOpacity=".18" stroke={C.violet} strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M17.53 5.41 L14.94 20.08 L20.47 10.51 L6.47 5.41 L9.06 20.08 L3.53 10.51 Z" fill="none" stroke={C.violet} strokeWidth="1.1" strokeLinejoin="round" />
    </>
  ),

  // ── Know Yourself ─────────────────────────────────────────────────────────
  flower_petal: (
    <>
      {/* seven petals */}
      {[0, 1, 2, 3, 4, 5, 6].map((k) => (
        <ellipse key={k} cx="12" cy="6.9" rx="2.7" ry="4.7" fill={C.rose} fillOpacity=".32" stroke={C.rose} strokeWidth="1" transform={`rotate(${k * 51.43} 12 12)`} />
      ))}
      <circle cx="12" cy="12" r="2.6" fill={C.amber} />
    </>
  ),
  riasec: (
    <>
      {/* Holland hexagon with vertex nodes */}
      <polygon points="12,3.4 19.45,7.7 19.45,16.3 12,20.6 4.55,16.3 4.55,7.7" fill={C.teal} fillOpacity=".14" stroke={C.teal} strokeWidth="1.5" strokeLinejoin="round" />
      {[[12, 3.4], [19.45, 7.7], [19.45, 16.3], [12, 20.6], [4.55, 16.3], [4.55, 7.7]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill={i === 0 ? C.coral : C.teal} />
      ))}
    </>
  ),
  love_language: (
    <>
      {/* speech bubble with a heart inside */}
      <path d="M5.4 4.6 h13.2 a2.6 2.6 0 0 1 2.6 2.6 v6.4 a2.6 2.6 0 0 1 -2.6 2.6 H11l-3.6 3.6 v-3.6 H5.4 a2.6 2.6 0 0 1 -2.6 -2.6 V7.2 a2.6 2.6 0 0 1 2.6 -2.6 Z" fill={C.rose} fillOpacity=".18" stroke={C.rose} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 13.4 C10.2 11.9 8.6 10.7 8.6 9.1 C8.6 8 9.5 7.1 10.6 7.1 C11.2 7.1 11.7 7.4 12 7.8 C12.3 7.4 12.8 7.1 13.4 7.1 C14.5 7.1 15.4 8 15.4 9.1 C15.4 10.7 13.8 11.9 12 13.4 Z" fill={C.rose} />
    </>
  ),
  attachment: (
    <>
      {/* two interlocked rings */}
      <circle cx="9" cy="12" r="5.2" fill="none" stroke={C.sky} strokeWidth="1.8" />
      <circle cx="15" cy="12" r="5.2" fill="none" stroke={C.indigo} strokeWidth="1.8" />
      <path d="M12 8.2 a5.2 5.2 0 0 1 0 7.6 a5.2 5.2 0 0 1 0 -7.6 Z" fill={C.indigo} fillOpacity=".25" />
    </>
  ),
  disc: (
    <>
      {/* four-quadrant wheel, one highlighted */}
      <circle cx="12" cy="12" r="8.6" fill={C.amber} fillOpacity=".16" stroke={C.amber} strokeWidth="1.5" />
      <path d="M12 12 L12 3.4 A8.6 8.6 0 0 1 20.6 12 Z" fill={C.amber} />
      <line x1="12" y1="3.4" x2="12" y2="20.6" stroke={C.amber} strokeWidth="1.3" />
      <line x1="3.4" y1="12" x2="20.6" y2="12" stroke={C.amber} strokeWidth="1.3" />
    </>
  ),
  ikigai: (
    <>
      {/* the four-circle ikigai venn */}
      <circle cx="12" cy="7.8" r="4.9" fill={C.rose} fillOpacity=".3" />
      <circle cx="16.2" cy="12" r="4.9" fill={C.amber} fillOpacity=".3" />
      <circle cx="12" cy="16.2" r="4.9" fill={C.emerald} fillOpacity=".3" />
      <circle cx="7.8" cy="12" r="4.9" fill={C.sky} fillOpacity=".3" />
      <circle cx="12" cy="12" r="1.5" fill={C.ink} />
    </>
  ),
  values: (
    <>
      {/* faceted gem */}
      <polygon points="7.2,4.6 16.8,4.6 20.4,9.2 12,19.8 3.6,9.2" fill={C.violet} fillOpacity=".25" stroke={C.violet} strokeWidth="1.4" strokeLinejoin="round" />
      <polyline points="3.6,9.2 20.4,9.2" fill="none" stroke={C.violet} strokeWidth="1.1" />
      <polyline points="7.2,4.6 9.8,9.2 12,19.8 14.2,9.2 16.8,4.6" fill="none" stroke={C.violet} strokeWidth="1.1" strokeLinejoin="round" />
    </>
  ),
  eq: (
    <>
      {/* brain with a heart at its center */}
      <path d="M12 4.2 C9.8 4.2 8.6 5.6 8.4 6.8 C6.6 6.9 5.2 8.3 5.2 10.1 C5.2 10.9 5.5 11.6 6 12.2 C5.5 12.8 5.2 13.6 5.2 14.4 C5.2 16.3 6.7 17.8 8.6 17.9 C9 19 10.1 19.8 12 19.8 C13.9 19.8 15 19 15.4 17.9 C17.3 17.8 18.8 16.3 18.8 14.4 C18.8 13.6 18.5 12.8 18 12.2 C18.5 11.6 18.8 10.9 18.8 10.1 C18.8 8.3 17.4 6.9 15.6 6.8 C15.4 5.6 14.2 4.2 12 4.2 Z" fill={C.sky} fillOpacity=".22" stroke={C.sky} strokeWidth="1.4" />
      <path d="M12 15.1 C10.7 14 9.6 13.2 9.6 12.1 C9.6 11.3 10.2 10.7 11 10.7 C11.4 10.7 11.8 10.9 12 11.2 C12.2 10.9 12.6 10.7 13 10.7 C13.8 10.7 14.4 11.3 14.4 12.1 C14.4 13.2 13.3 14 12 15.1 Z" fill={C.coral} />
    </>
  ),
  mindset: (
    <>
      {/* sprout: growth */}
      <line x1="12" y1="20" x2="12" y2="10.6" stroke={C.emerald} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 11.4 C12 8 9.2 6.2 6.2 6.6 C6.5 9.8 9.2 11.8 12 11.4 Z" fill={C.emerald} fillOpacity=".85" />
      <path d="M12 8.8 C12 5.8 14.5 4 17.8 4.4 C17.5 7.6 14.8 9.4 12 8.8 Z" fill={C.emerald} fillOpacity=".45" />
      <path d="M8 20 h8" stroke={C.slate} strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  grit: (
    <>
      {/* summit with a flag */}
      <path d="M2.9 19 L9 8.8 L12.3 13.6 L15.1 9.9 L21.1 19 Z" fill={C.amber} fillOpacity=".3" stroke={C.amber} strokeWidth="1.4" strokeLinejoin="round" />
      <line x1="9" y1="8.8" x2="9" y2="3.6" stroke={C.ink} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M9 3.8 h4.2 l-1.5 1.7 1.5 1.7 H9 Z" fill={C.coral} />
    </>
  ),
  lifewheel: (
    <>
      {/* eight-spoke balance wheel with one wedge lit */}
      <circle cx="12" cy="12" r="8.6" fill={C.indigo} fillOpacity=".12" stroke={C.indigo} strokeWidth="1.5" />
      <path d="M12 12 L12 3.4 A8.6 8.6 0 0 1 18.08 5.92 Z" fill={C.indigo} fillOpacity=".8" />
      {[[12, 3.4], [18.08, 5.92], [20.6, 12], [18.08, 18.08], [12, 20.6], [5.92, 18.08], [3.4, 12], [5.92, 5.92]].map(([x, y], i) => (
        <line key={i} x1="12" y1="12" x2={x} y2={y} stroke={C.indigo} strokeWidth="1" />
      ))}
    </>
  ),

  // ── Just for Fun ──────────────────────────────────────────────────────────
  house: (
    <>
      {/* wand + sparkles */}
      <line x1="5.6" y1="18.4" x2="14.6" y2="9.4" stroke={C.amber} strokeWidth="2.4" strokeLinecap="round" />
      <line x1="5.6" y1="18.4" x2="9.2" y2="14.8" stroke={C.ink} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M17.6 3.4 l.8 2.1 2.1.8 -2.1.8 -.8 2.1 -.8-2.1 -2.1-.8 2.1-.8 Z" fill={C.violet} />
      <path d="M19.6 11.2 l.55 1.45 1.45.55 -1.45.55 -.55 1.45 -.55-1.45 -1.45-.55 1.45-.55 Z" fill={C.amber} />
      <circle cx="13.6" cy="4.8" r="1" fill={C.violet} fillOpacity=".6" />
    </>
  ),
  hot_takes: (
    <>
      {/* flame */}
      <path d="M12 3.4 C13.7 6.3 18 8.5 18 13 A6 6 0 0 1 6 13 C6 10.4 7.5 8.8 8.8 7.3 C9.2 9 10.2 9.9 11.1 10.1 C10 7.6 10.8 5.1 12 3.4 Z" fill={C.coral} fillOpacity=".35" stroke={C.coral} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M12 10.6 C13 12 15 12.9 15 15.1 A3 3 0 0 1 9 15.1 C9 13.4 10.4 12.4 12 10.6 Z" fill={C.amber} />
    </>
  ),
  cake: (
    <>
      {/* layered cake with a candle */}
      <rect x="4.4" y="13.6" width="15.2" height="5.6" rx="1.6" fill={C.rose} fillOpacity=".3" stroke={C.rose} strokeWidth="1.3" />
      <path d="M6.4 13.6 v-2.4 a1.8 1.8 0 0 1 1.8 -1.8 h7.6 a1.8 1.8 0 0 1 1.8 1.8 v2.4" fill={C.rose} fillOpacity=".6" />
      <line x1="12" y1="9.2" x2="12" y2="6" stroke={C.ink} strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="12" cy="4.6" r="1.2" fill={C.amber} />
    </>
  ),

  // ── Pop Culture ───────────────────────────────────────────────────────────
  nba: (
    <>
      {/* basketball */}
      <circle cx="12" cy="12" r="8.6" fill={C.amber} fillOpacity=".25" stroke={C.amber} strokeWidth="1.5" />
      <line x1="12" y1="3.4" x2="12" y2="20.6" stroke={C.amber} strokeWidth="1.3" />
      <line x1="3.4" y1="12" x2="20.6" y2="12" stroke={C.amber} strokeWidth="1.3" />
      <path d="M5.9 5.9 A12 12 0 0 1 5.9 18.1 M18.1 5.9 A12 12 0 0 0 18.1 18.1" fill="none" stroke={C.amber} strokeWidth="1.3" />
    </>
  ),
  soccer: (
    <>
      {/* soccer ball */}
      <circle cx="12" cy="12" r="8.6" fill="none" stroke={C.ink} strokeWidth="1.5" />
      <polygon points="12,8.6 15.23,10.95 14,14.75 10,14.75 8.77,10.95" fill={C.ink} />
      {[[12, 3.4], [20.18, 9.34], [17.06, 18.96], [6.94, 18.96], [3.82, 9.34]].map(([x, y], i) => {
        const inner = [[12, 8.6], [15.23, 10.95], [14, 14.75], [10, 14.75], [8.77, 10.95]][i];
        return <line key={i} x1={inner[0]} y1={inner[1]} x2={x} y2={y} stroke={C.ink} strokeWidth="1.2" />;
      })}
    </>
  ),
  naruto: (
    <>
      {/* uzumaki spiral */}
      <path d="M12.6 12.4 c.1-1-1.3-1.5-2.1-.8 c-1.3 1-.8 3.1.7 3.7 c2.2.9 4.5-.8 4.9-3 c.5-2.9-1.7-5.5-4.6-5.7 c-3.6-.3-6.6 2.6-6.7 6.1 c-.1 4.2 3.3 7.6 7.5 7.5 c4.8-.1 8.5-4.2 8.1-8.9" fill="none" stroke={C.coral} strokeWidth="1.8" strokeLinecap="round" />
    </>
  ),
  onepiece: (
    <>
      {/* straw-hat jolly roger */}
      <line x1="5.4" y1="18.6" x2="18.6" y2="13.4" stroke={C.slate} strokeWidth="1.7" strokeLinecap="round" />
      <line x1="5.4" y1="13.4" x2="18.6" y2="18.6" stroke={C.slate} strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="12.2" r="4.5" fill="#fff" stroke={C.ink} strokeWidth="1.4" />
      <circle cx="10.4" cy="11.9" r=".95" fill={C.ink} />
      <circle cx="13.6" cy="11.9" r=".95" fill={C.ink} />
      <path d="M8.2 7.4 a3.9 3.3 0 0 1 7.6 0" fill={C.amber} />
      <ellipse cx="12" cy="7.5" rx="6.2" ry="1.5" fill={C.amber} />
      <path d="M8.3 6.9 h7.4 v1.2 H8.3 Z" fill={C.coral} />
    </>
  ),
  starwars: (
    <>
      {/* lightsaber */}
      <line x1="14.6" y1="3.2" x2="8.4" y2="13.6" stroke={C.sky} strokeWidth="4.2" strokeLinecap="round" opacity=".3" />
      <line x1="14.6" y1="3.2" x2="8.4" y2="13.6" stroke={C.sky} strokeWidth="2.2" strokeLinecap="round" />
      <line x1="7.6" y1="15" x2="5.4" y2="18.7" stroke={C.ink} strokeWidth="2.8" strokeLinecap="round" />
      <line x1="6.1" y1="14.1" x2="9.8" y2="16.3" stroke={C.ink} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M17.8 15.4 l.7 1.8 1.8.7 -1.8.7 -.7 1.8 -.7-1.8 -1.8-.7 1.8-.7 Z" fill={C.amber} />
    </>
  ),
  superhero: (
    <>
      {/* shield with bolt */}
      <path d="M12 3.4 L19 6 V11.4 C19 15.9 16.1 19.3 12 20.6 C7.9 19.3 5 15.9 5 11.4 V6 Z" fill={C.blue} fillOpacity=".22" stroke={C.blue} strokeWidth="1.5" strokeLinejoin="round" />
      <polygon points="13.1,7.2 9.8,12.6 11.7,12.6 10.9,16.8 14.3,11.3 12.4,11.3" fill={C.amber} />
    </>
  ),
  disney: (
    <>
      {/* castle */}
      <rect x="9.9" y="8.4" width="4.2" height="10.6" fill={C.fuchsia} fillOpacity=".35" stroke={C.fuchsia} strokeWidth="1.2" />
      <rect x="4.6" y="12" width="3.4" height="7" fill={C.fuchsia} fillOpacity=".25" stroke={C.fuchsia} strokeWidth="1.2" />
      <rect x="16" y="12" width="3.4" height="7" fill={C.fuchsia} fillOpacity=".25" stroke={C.fuchsia} strokeWidth="1.2" />
      <polygon points="9.9,8.4 12,4.6 14.1,8.4" fill={C.fuchsia} />
      <polygon points="4.6,12 6.3,9.2 8,12" fill={C.fuchsia} fillOpacity=".7" />
      <polygon points="16,12 17.7,9.2 19.4,12" fill={C.fuchsia} fillOpacity=".7" />
      <line x1="12" y1="4.6" x2="12" y2="2.8" stroke={C.ink} strokeWidth="1" />
      <path d="M12 2.9 h2 l-.7.8 .7.8 h-2 Z" fill={C.amber} transform="translate(0,-.3)" />
    </>
  ),
  office: (
    <>
      {/* necktie: knot + blade */}
      <path d="M9.4 3.8 h5.2 l-1 3.4 h-3.2 Z" fill={C.indigo} />
      <path d="M10.3 7.9 h3.4 l1.9 8.6 -3.6 4.3 -3.6-4.3 Z" fill={C.indigo} fillOpacity=".55" stroke={C.indigo} strokeWidth="1.1" strokeLinejoin="round" />
      <line x1="10.9" y1="9.6" x2="12.9" y2="11.6" stroke={C.indigo} strokeWidth="1" strokeLinecap="round" />
    </>
  ),
  friends: (
    <>
      {/* coffee cup with steam */}
      <path d="M6 10 h10 v6.2 a3 3 0 0 1 -3 3 H9 a3 3 0 0 1 -3 -3 Z" fill={C.amber} fillOpacity=".3" stroke={C.amber} strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M16 11.4 h1.4 a2.3 2.3 0 0 1 0 4.6 H16" fill="none" stroke={C.amber} strokeWidth="1.4" />
      <path d="M9.4 7.4 c-.8-1.1.8-1.7 0-2.9 M13 7.4 c-.8-1.1.8-1.7 0-2.9" fill="none" stroke={C.slate} strokeWidth="1.2" strokeLinecap="round" />
    </>
  ),
  pokemon: (
    <>
      {/* pokeball */}
      <path d="M3.4 12 a8.6 8.6 0 0 1 17.2 0 Z" fill={C.coral} fillOpacity=".75" />
      <circle cx="12" cy="12" r="8.6" fill="none" stroke={C.ink} strokeWidth="1.5" />
      <line x1="3.4" y1="12" x2="20.6" y2="12" stroke={C.ink} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.7" fill="#fff" stroke={C.ink} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill={C.ink} />
    </>
  ),
  eras: (
    <>
      {/* microphone + sparkle */}
      <rect x="9.7" y="3.6" width="4.6" height="8.6" rx="2.3" fill={C.fuchsia} fillOpacity=".4" stroke={C.fuchsia} strokeWidth="1.4" />
      <path d="M7 10.6 a5 5 0 0 0 10 0" fill="none" stroke={C.fuchsia} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="15.6" x2="12" y2="19" stroke={C.fuchsia} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9.2" y1="19.6" x2="14.8" y2="19.6" stroke={C.fuchsia} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M18.6 4.2 l.6 1.6 1.6.6 -1.6.6 -.6 1.6 -.6-1.6 -1.6-.6 1.6-.6 Z" fill={C.amber} />
    </>
  ),

  // ── In-Depth (base motif + magnifier) ─────────────────────────────────────
  'big5-deep': (
    <>
      <rect x="4.4" y="12.4" width="2.6" height="6.6" rx="1" fill={C.teal} fillOpacity=".45" />
      <rect x="8.4" y="9" width="2.6" height="10" rx="1" fill={C.teal} fillOpacity=".7" />
      <rect x="12.4" y="5.6" width="2.6" height="13.4" rx="1" fill={C.teal} />
      <circle cx="16.2" cy="8.6" r="4.4" fill="#fff" fillOpacity=".7" stroke={C.ink} strokeWidth="1.6" />
      <line x1="19.4" y1="11.8" x2="21.6" y2="14" stroke={C.ink} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  'mbti-deep': (
    <>
      <rect x="4.4" y="4.4" width="5.6" height="5.6" rx="1.4" fill={C.coral} />
      <rect x="11.4" y="4.4" width="5.6" height="5.6" rx="1.4" fill={C.coral} fillOpacity=".3" />
      <rect x="4.4" y="11.4" width="5.6" height="5.6" rx="1.4" fill={C.coral} fillOpacity=".3" />
      <circle cx="14.8" cy="14.8" r="4.4" fill="#fff" fillOpacity=".7" stroke={C.ink} strokeWidth="1.6" />
      <line x1="18" y1="18" x2="20.6" y2="20.6" stroke={C.ink} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  'enneagram-deep': (
    <>
      <circle cx="10.4" cy="10.4" r="6.6" fill="none" stroke={C.violet} strokeWidth="1.4" />
      <polygon points="10.4,4.6 15.4,13.3 5.4,13.3" fill={C.violet} fillOpacity=".25" stroke={C.violet} strokeWidth="1.1" strokeLinejoin="round" />
      <circle cx="15.6" cy="15.6" r="4.4" fill="#fff" fillOpacity=".7" stroke={C.ink} strokeWidth="1.6" />
      <line x1="18.8" y1="18.8" x2="21.2" y2="21.2" stroke={C.ink} strokeWidth="2" strokeLinecap="round" />
    </>
  ),
};

// Legacy/alias keys used around the app.
GLYPHS.big5_deep = GLYPHS['big5-deep'];
GLYPHS.mbti_deep = GLYPHS['mbti-deep'];
GLYPHS.enneagram_deep = GLYPHS['enneagram-deep'];
GLYPHS.wizard = GLYPHS.house;

/**
 * Renders the custom glyph for a quiz key, falling back to the provided emoji
 * (or nothing) when no glyph exists yet.
 */
export default function QuizGlyph({ quizKey, emoji = null, size = 28, className = '' }) {
  const glyph = GLYPHS[quizKey];
  if (!glyph) {
    return emoji ? <span style={{ fontSize: size * 0.8, lineHeight: 1 }}>{emoji}</span> : null;
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-hidden="true"
      focusable="false"
    >
      {glyph}
    </svg>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function hasGlyph(quizKey) {
  return !!GLYPHS[quizKey];
}
