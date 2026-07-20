import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emblem } from '../data/vectorQuizzes/glyphs';
import './narutoQuiz.css';

const FRAMEWORKS = [
  {
    id: 'big5',
    name: 'The Big Five (OCEAN)',
    subtitle: 'The Gold Standard of Personality Science',
    color: 'from-teal-50 to-mint-50',
    border: 'border-teal-100',
    accent: 'text-teal-700',
    badge: 'Empirically validated',
    badgeColor: 'bg-teal-100 text-teal-700',
    quizPath: '/assessment',
    quizLabel: 'Take the Big 5',
    origin: 'Developed over decades of psychometric research, the Big Five emerged from factor analysis of thousands of personality descriptors. Lewis Goldberg coined the "Big Five" label in 1981, and the model was further formalised by Costa & McCrae\'s NEO-PI instrument.',
    howItWorks: 'The model measures five broad, independent dimensions of personality — Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (OCEAN). Each trait exists on a continuous spectrum rather than a binary category. Scores are derived from Likert-scale self-report items and normalised against population distributions.',
    validity: 'The Big Five is the most scientifically validated personality model in existence. It has been replicated cross-culturally in over 50 countries, demonstrates strong test-retest reliability, and predicts real-world outcomes including academic performance, career success, relationship satisfaction, and health behaviour.',
    criticisms: 'Critics note that trait models describe but don\'t explain behaviour — they capture what, not why. The Big Five also performs less well across cultures that are more collectivist or that have less exposure to Western psychological instruments.',
    sources: ['Costa & McCrae (1992) — NEO Personality Inventory', 'Goldberg (1993) — The structure of phenotypic personality traits', 'John & Srivastava (1999) — The Big-Five trait taxonomy'],
  },
  {
    id: 'mbti',
    name: 'MBTI (Myers-Briggs Type Indicator)',
    subtitle: 'The World\'s Most Popular Personality Test',
    color: 'from-coral-50 to-peach-50',
    border: 'border-coral-100',
    accent: 'text-coral-700',
    badge: 'Widely used',
    badgeColor: 'bg-coral-100 text-coral-700',
    quizPath: '/quiz/mbti',
    quizLabel: 'Take the MBTI',
    origin: 'Developed by Isabel Briggs Myers and her mother Katharine Cook Briggs during World War II, the MBTI was inspired by Carl Jung\'s theory of psychological types (1921). Myers and Briggs operationalised Jung\'s theory into a practical assessment that could be used for career guidance and team building.',
    howItWorks: 'The MBTI classifies people across four dichotomies: Introversion/Extraversion, Sensing/iNtuition, Thinking/Feeling, and Judging/Perceiving — producing 16 distinct type profiles. Each letter represents a preferred mode of perception or judgment, not a fixed trait.',
    validity: 'MBTI has enormous cultural reach — over 2 million assessments are completed annually. Research confirms that it meaningfully captures real differences in cognitive style, communication preference, and work behaviour. It correlates meaningfully with Big Five traits (e.g., E/I maps onto Extraversion; J/P onto Conscientiousness).',
    criticisms: 'Critics note that the MBTI uses forced-choice binary categories where research suggests most people fall near the middle. Test-retest reliability is moderate — up to 50% of people get a different type on re-testing. Academic personality psychologists generally prefer the Big Five for research purposes.',
    sources: ['Myers & Briggs Foundation', 'Jung (1921) — Psychological Types', 'McCrae & Costa (1989) — Reinterpreting the Myers-Briggs Type Indicator from the perspective of the Five-Factor Model of Personality'],
  },
  {
    id: 'enneagram',
    name: 'The Enneagram',
    subtitle: 'Nine Archetypes of Human Motivation',
    color: 'from-mint-50 to-teal-50',
    border: 'border-mint-100',
    accent: 'text-mint-700',
    badge: 'Depth psychology',
    badgeColor: 'bg-mint-100 text-mint-700',
    quizPath: '/quiz/enneagram',
    quizLabel: 'Take the Enneagram',
    origin: 'The Enneagram\'s origins are contested and layered. The nine-pointed symbol appeared in the work of G.I. Gurdjieff in the early 20th century. Oscar Ichazo and Claudio Naranjo later mapped nine psychological fixations onto it in the 1960s-70s. Don Richard Riso and Russ Hudson (The Enneagram Institute) systematised it into the research-informed model widely used today.',
    howItWorks: 'The Enneagram describes nine core personality structures, each defined by a dominant motivation (core desire) and a core fear. Each type has a characteristic defence mechanism, a stress direction (disintegration), and a growth direction (integration). Rather than measuring traits, it seeks to illuminate the deeper "why" beneath surface behaviour.',
    validity: 'The Enneagram has generated a growing body of academic research since the 2000s. Studies show adequate test-retest reliability and meaningful correlations with Big Five traits (e.g., Type 1 correlates with high Conscientiousness; Type 4 with high Openness and Neuroticism). Its depth and clinical utility are widely acknowledged by psychotherapists.',
    criticisms: 'The Enneagram is less empirically developed than the Big Five. Type boundaries can feel blurry, self-typing is inherently subjective, and the model\'s origins mix philosophy, spirituality, and psychology in ways that resist clean scientific validation.',
    sources: ['Riso & Hudson (1996) — Personality Types', 'Naranjo (1994) — Character and Neurosis', 'Sutton et al. (2012) — Rethinking the Development History of the Enneagram'],
  },
  {
    id: 'cake',
    name: 'Cake.me',
    subtitle: 'Personality Through the Lens of Confection',
    color: 'from-rose-50 to-peach-50',
    border: 'border-rose-100',
    accent: 'text-rose-700',
    badge: 'For fun',
    badgeColor: 'bg-rose-100 text-rose-700',
    quizPath: '/quiz/cake',
    quizLabel: 'Take the Cake Quiz',
    origin: 'Cake.me is a playful personality framework that maps Big Five trait profiles onto six distinct cake archetypes. It was designed to make personality psychology accessible, shareable, and fun — while staying grounded in real trait science.',
    howItWorks: 'The quiz uses 10 scenario-based questions that measure tendencies across Extraversion, Openness, Conscientiousness, Agreeableness, and Neuroticism. Your answers adjust your underlying Big Five scores, and the dominant adjusted trait determines which cake archetype you match. Funfetti = high Extraversion. Matcha Crepe = high Openness. Red Velvet = high Agreeableness. Lava Cake = high Neuroticism. Wedding Cake = high Conscientiousness. Chocolate = balanced.',
    validity: 'Cake.me is not a clinical instrument. It is a pedagogical tool — a gateway to understanding the Big Five in a low-stakes, engaging format. The underlying scoring mechanism is directly grounded in OCEAN trait research.',
    criticisms: 'Like any simplified personality tool, Cake.me trades precision for accessibility. A single dominant trait doesn\'t capture the full complexity of a person\'s personality profile. Think of it as an introduction, not a conclusion.',
    sources: ['Costa & McCrae (1992) — The Big Five framework', 'John et al. (2008) — Paradigm shift to the integrative Big-Five taxonomy'],
  },
];

// Presentation metadata layered onto the editorial content above.
const META = [
  { aura: '#35b58e', glyph: 'hex',     tierClass: 'badge-front', path: '/assessment' },
  { aura: '#7fb2d9', glyph: 'ripple',  tierClass: 'badge-front', path: '/quiz/mbti' },
  { aura: '#a983d6', glyph: 'rinne',   tierClass: 'badge-front', path: '/quiz/enneagram' },
  { aura: '#e0b13a', glyph: 'blossom', tierClass: 'badge-cut',   path: '/quiz/cake' },
];

// The engine section is our own story — cited against our own test suite.
const ENGINE = {
  name: 'The Matching Engine',
  subtitle: 'How the character quizzes actually work',
  badge: 'Simulation-verified',
  origin: 'Every character quiz on this site places its results as hand-tuned positions in a shared personality space — axes like strategy vs. instinct or lone wolf vs. bonds first — and measures you on the same axes with weighted, opposing-pair statements.',
  howItWorks: 'Your answers become a vector; your match is the result whose direction is closest to yours (cosine similarity). Direction, not magnitude — so agreeing with everything cannot collapse you onto the blandest character. Which traits lead is what decides your match.',
  validity: 'Every roster ships with a Monte-Carlo battery in our test suite: tens of thousands of simulated takers must reach every single result, the winner distribution must stay near its entropy ceiling, and changing half your answers must change the outcome about 80% of the time. If an edit breaks any of that, it cannot ship.',
};

function Emblem({ aura, glyph, size }) {
  const html = emblem({ name: '', aura, glyph, img: null }, size, true, true);
  return <span style={{ display: 'inline-flex', flex: 'none' }} dangerouslySetInnerHTML={{ __html: html }} />;
}

function Block({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <p className="rlabel" style={{ marginBottom: 6 }}>{label}</p>
      <p style={{ fontSize: '.92rem', lineHeight: 1.7, margin: 0 }}>{children}</p>
    </div>
  );
}

function FrameworkCard({ fw, meta, navigate }) {
  return (
    <section style={{ marginBottom: 'clamp(40px, 8vw, 64px)', '--aura': meta.aura, '--aura-l': meta.aura }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 14, flexWrap: 'wrap' }}>
        <Emblem aura={meta.aura} glyph={meta.glyph} size={84} />
        <div style={{ minWidth: 220, flex: 1 }}>
          <span className={`badge ${meta.tierClass}`}>{fw.badge}</span>
          <h2 style={{ fontFamily: 'var(--disp)', fontSize: 'clamp(1.4rem, 4vw, 1.9rem)', lineHeight: 1.15, margin: '8px 0 2px', color: 'var(--paper)' }}>{fw.name}</h2>
          <p className="res-tag" style={{ color: meta.aura, margin: 0 }}>{fw.subtitle}</p>
        </div>
      </div>
      <div className="res-card" style={{ marginTop: 10 }}>
        <Block label="Origins">{fw.origin}</Block>
        <Block label="How it works">{fw.howItWorks}</Block>
        <Block label="Validity &amp; use">{fw.validity}</Block>
        {fw.criticisms && <Block label="Fair criticisms">{fw.criticisms}</Block>}
        {fw.sources?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <p className="rlabel" style={{ marginBottom: 6 }}>Key sources</p>
            {fw.sources.map((src) => (
              <p key={src} style={{ fontSize: '.8rem', lineHeight: 1.6, margin: '0 0 3px', opacity: 0.75, fontStyle: 'italic' }}>{src}</p>
            ))}
          </div>
        )}
        {(fw.quizPath ?? meta.path) && (
          <button className="btn btn-primary" style={{ marginTop: 6 }} onClick={() => navigate(fw.quizPath ?? meta.path)}>
            {fw.quizLabel ?? 'Take it'} →
          </button>
        )}
      </div>
    </section>
  );
}

export default function Frameworks() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'How It Works · My Personality Quizzes';
    return () => { document.title = 'My Personality Quizzes'; };
  }, []);

  return (
    <div className="nq no-seal" style={{ '--aura': '#cba24a', '--aura-l': '#e6cf92' }}>
      <div className="bg" aria-hidden="true">
        <div className="glow g1" /><div className="glow g2" /><div className="grain" /><div className="vignette" />
      </div>
      <main className="wrap" style={{ justifyContent: 'flex-start', maxWidth: 860 }}>
        <section style={{ textAlign: 'center', margin: 'clamp(8px,3vw,28px) 0 clamp(36px,7vw,56px)' }}>
          <p className="eyebrow solo" style={{ justifyContent: 'center' }}>The Methodology</p>
          <h1 style={{ fontFamily: 'var(--disp)', fontWeight: 800, fontSize: 'clamp(2.1rem,6.5vw,3.3rem)', lineHeight: 1.05, letterSpacing: '-.01em', margin: '14px 0 0', color: 'var(--paper)' }}>
            The science behind<br /><span style={{ color: 'var(--gold)' }}>the quizzes.</span>
          </h1>
          <p className="lede" style={{ margin: '18px auto 0' }}>
            Ordered by evidence — from the most replicated model in personality science
            to the ones that are verified fun. Where each comes from, how it works, and
            how seriously to take it.
          </p>
        </section>

        {FRAMEWORKS.map((fw, i) => (
          <FrameworkCard key={fw.name} fw={fw} meta={META[i]} navigate={navigate} />
        ))}

        <FrameworkCard
          fw={ENGINE}
          meta={{ aura: '#d93a2b', glyph: 'burst', tierClass: 'badge-cut', path: '/quiz/naruto' }}
          navigate={navigate}
        />

        <div style={{ textAlign: 'center', paddingBottom: 40 }}>
          <button className="btn btn-ghost" onClick={() => navigate('/')}>← All quizzes</button>
        </div>
      </main>
    </div>
  );
}
