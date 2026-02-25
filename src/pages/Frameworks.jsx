import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Activity, Brain, CircleDashed, Cake, BookOpen, FlaskConical, Star } from 'lucide-react';

const frameworks = [
  {
    id: 'big5',
    icon: Activity,
    iconBg: 'bg-teal-100 text-teal-600',
    name: 'The Big Five (OCEAN)',
    subtitle: 'The Gold Standard of Personality Science',
    color: 'from-teal-50 to-mint-50',
    border: 'border-teal-100',
    accent: 'text-teal-700',
    badge: 'Empirically validated',
    badgeColor: 'bg-teal-100 text-teal-700',
    origin: 'Developed over decades of psychometric research, the Big Five emerged from factor analysis of thousands of personality descriptors. Lewis Goldberg coined the "Big Five" label in 1981, and the model was further formalised by Costa & McCrae\'s NEO-PI instrument.',
    howItWorks: 'The model measures five broad, independent dimensions of personality — Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism (OCEAN). Each trait exists on a continuous spectrum rather than a binary category. Scores are derived from Likert-scale self-report items and normalised against population distributions.',
    validity: 'The Big Five is the most scientifically validated personality model in existence. It has been replicated cross-culturally in over 50 countries, demonstrates strong test-retest reliability, and predicts real-world outcomes including academic performance, career success, relationship satisfaction, and health behaviour.',
    criticisms: 'Critics note that trait models describe but don\'t explain behaviour — they capture what, not why. The Big Five also performs less well across cultures that are more collectivist or that have less exposure to Western psychological instruments.',
    sources: ['Costa & McCrae (1992) — NEO Personality Inventory', 'Goldberg (1993) — The structure of phenotypic personality traits', 'John & Srivastava (1999) — The Big-Five trait taxonomy'],
  },
  {
    id: 'mbti',
    icon: Brain,
    iconBg: 'bg-coral-100 text-coral-600',
    name: 'MBTI (Myers-Briggs Type Indicator)',
    subtitle: 'The World\'s Most Used Personality Framework',
    color: 'from-coral-50 to-peach-50',
    border: 'border-coral-100',
    accent: 'text-coral-700',
    badge: 'Widely used',
    badgeColor: 'bg-coral-100 text-coral-700',
    origin: 'Developed by Isabel Briggs Myers and her mother Katharine Cook Briggs during World War II, the MBTI was inspired by Carl Jung\'s theory of psychological types (1921). Myers and Briggs operationalised Jung\'s theory into a practical assessment that could be used for career guidance and team building.',
    howItWorks: 'The MBTI classifies people across four dichotomies: Introversion/Extraversion, Sensing/iNtuition, Thinking/Feeling, and Judging/Perceiving — producing 16 distinct type profiles. Each letter represents a preferred mode of perception or judgment, not a fixed trait.',
    validity: 'MBTI has enormous cultural reach — over 2 million assessments are completed annually. Research confirms that it meaningfully captures real differences in cognitive style, communication preference, and work behaviour. It correlates meaningfully with Big Five traits (e.g., E/I maps onto Extraversion; J/P onto Conscientiousness).',
    criticisms: 'Critics note that the MBTI uses forced-choice binary categories where research suggests most people fall near the middle. Test-retest reliability is moderate — up to 50% of people get a different type on re-testing. Academic personality psychologists generally prefer the Big Five for research purposes.',
    sources: ['Myers & Briggs Foundation', 'Jung (1921) — Psychological Types', 'McCrae & Costa (1989) — Reinterpreting the Myers-Briggs Type Indicator from the perspective of the Five-Factor Model of Personality'],
  },
  {
    id: 'enneagram',
    icon: CircleDashed,
    iconBg: 'bg-mint-100 text-mint-600',
    name: 'The Enneagram',
    subtitle: 'Nine Archetypes of Human Motivation',
    color: 'from-mint-50 to-teal-50',
    border: 'border-mint-100',
    accent: 'text-mint-700',
    badge: 'Depth psychology',
    badgeColor: 'bg-mint-100 text-mint-700',
    origin: 'The Enneagram\'s origins are contested and layered. The nine-pointed symbol appeared in the work of G.I. Gurdjieff in the early 20th century. Oscar Ichazo and Claudio Naranjo later mapped nine psychological fixations onto it in the 1960s-70s. Don Richard Riso and Russ Hudson (The Enneagram Institute) systematised it into the research-informed model widely used today.',
    howItWorks: 'The Enneagram describes nine core personality structures, each defined by a dominant motivation (core desire) and a core fear. Each type has a characteristic defence mechanism, a stress direction (disintegration), and a growth direction (integration). Rather than measuring traits, it seeks to illuminate the deeper "why" beneath surface behaviour.',
    validity: 'The Enneagram has generated a growing body of academic research since the 2000s. Studies show adequate test-retest reliability and meaningful correlations with Big Five traits (e.g., Type 1 correlates with high Conscientiousness; Type 4 with high Openness and Neuroticism). Its depth and clinical utility are widely acknowledged by psychotherapists.',
    criticisms: 'The Enneagram is less empirically developed than the Big Five. Type boundaries can feel blurry, self-typing is inherently subjective, and the model\'s origins mix philosophy, spirituality, and psychology in ways that resist clean scientific validation.',
    sources: ['Riso & Hudson (1996) — Personality Types', 'Naranjo (1994) — Character and Neurosis', 'Sutton et al. (2012) — Rethinking the Development History of the Enneagram'],
  },
  {
    id: 'cake',
    icon: Cake,
    iconBg: 'bg-rose-100 text-rose-500',
    name: 'Cake.me',
    subtitle: 'Personality Through the Lens of Confection',
    color: 'from-rose-50 to-peach-50',
    border: 'border-rose-100',
    accent: 'text-rose-700',
    badge: 'For fun',
    badgeColor: 'bg-rose-100 text-rose-700',
    origin: 'Cake.me is a playful personality framework that maps Big Five trait profiles onto six distinct cake archetypes. It was designed to make personality psychology accessible, shareable, and fun — while staying grounded in real trait science.',
    howItWorks: 'The quiz uses 10 scenario-based questions that measure tendencies across Extraversion, Openness, Conscientiousness, Agreeableness, and Neuroticism. Your answers adjust your underlying Big Five scores, and the dominant adjusted trait determines which cake archetype you match. Funfetti = high Extraversion. Matcha Crepe = high Openness. Red Velvet = high Agreeableness. Lava Cake = high Neuroticism. Wedding Cake = high Conscientiousness. Chocolate = balanced.',
    validity: 'Cake.me is not a clinical instrument. It is a pedagogical tool — a gateway to understanding the Big Five in a low-stakes, engaging format. The underlying scoring mechanism is directly grounded in OCEAN trait research.',
    criticisms: 'Like any simplified personality tool, Cake.me trades precision for accessibility. A single dominant trait doesn\'t capture the full complexity of a person\'s personality profile. Think of it as an introduction, not a conclusion.',
    sources: ['Costa & McCrae (1992) — The Big Five framework', 'John et al. (2008) — Paradigm shift to the integrative Big-Five taxonomy'],
  },
];

function FrameworkCard({ fw, delay }) {
  const Icon = fw.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={`bg-gradient-to-br ${fw.color} rounded-3xl border ${fw.border} p-7 md:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.06)]`}
    >
      <div className="flex items-start justify-between mb-5">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${fw.iconBg} shadow-sm`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${fw.badgeColor}`}>{fw.badge}</span>
      </div>

      <h2 className={`text-xl font-extrabold mb-0.5 ${fw.accent}`}>{fw.name}</h2>
      <p className="text-sm font-semibold text-gray-500 mb-5">{fw.subtitle}</p>

      <div className="space-y-4">
        <Section icon={BookOpen} title="Origins">
          <p className="text-sm text-gray-600 leading-relaxed">{fw.origin}</p>
        </Section>
        <Section icon={FlaskConical} title="How It Works">
          <p className="text-sm text-gray-600 leading-relaxed">{fw.howItWorks}</p>
        </Section>
        <Section icon={Star} title="Validity & Use">
          <p className="text-sm text-gray-600 leading-relaxed">{fw.validity}</p>
        </Section>
        <div className="bg-white/50 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Limitations</p>
          <p className="text-sm text-gray-600 leading-relaxed">{fw.criticisms}</p>
        </div>
        <div className="bg-white/50 rounded-2xl p-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Key Sources</p>
          <ul className="space-y-1">
            {fw.sources.map((s) => (
              <li key={s} className="text-xs text-gray-500 font-medium">· {s}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white/50 rounded-2xl p-4">
      <div className="flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5 text-gray-400" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</p>
      </div>
      {children}
    </div>
  );
}

export default function Frameworks() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-cream-50">
      <header className="px-6 py-5 border-b border-gray-100 bg-white/70 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <span className="text-lg font-extrabold text-gray-800">
            The <span className="text-sky-500">Frameworks</span>
          </span>
          <div className="w-16" />
        </div>
      </header>

      <main className="px-6 py-10 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            The science behind the quizzes
          </h1>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Every quiz here is grounded in real personality psychology. Here's what each framework is, where it comes from, and how seriously to take it.
          </p>
        </motion.div>

        <div className="space-y-8">
          {frameworks.map((fw, i) => (
            <FrameworkCard key={fw.id} fw={fw} delay={i * 0.1} />
          ))}
        </div>
      </main>
    </div>
  );
}
