import { CORE_BREAKDOWN } from '../data/coreBreakdown';

// Compact "what this test measures" panel shown on a core test's intro screen
// (right after a visitor clicks in). Styled to sit inside the immersive .nq ink
// shell: it inherits the paper text colour and the heading picks up the quiz's
// aura. Renders nothing for an unknown key.
export default function CoreIntroBreakdown({ quizKey }) {
  const data = CORE_BREAKDOWN[quizKey];
  if (!data) return null;

  return (
    <div
      style={{
        margin: '22px auto 2px',
        maxWidth: 480,
        textAlign: 'left',
        border: '1px solid var(--line, rgba(150,150,150,.28))',
        borderRadius: 16,
        padding: '15px 18px',
        background: 'rgba(255,255,255,.02)',
      }}
    >
      <p
        style={{
          margin: '0 0 11px',
          fontSize: '.68rem',
          fontWeight: 700,
          letterSpacing: '.09em',
          textTransform: 'uppercase',
          color: 'var(--aura-l, currentColor)',
          opacity: 0.9,
        }}
      >
        {data.heading}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(132px, 1fr))', gap: '9px 18px' }}>
        {data.items.map(([label, desc]) => (
          <div key={label} style={{ minWidth: 0 }}>
            <div style={{ fontSize: '.85rem', fontWeight: 700, lineHeight: 1.25 }}>{label}</div>
            <div style={{ fontSize: '.72rem', opacity: 0.55, lineHeight: 1.3 }}>{desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
