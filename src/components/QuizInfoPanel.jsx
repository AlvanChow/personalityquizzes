import { FlaskConical, Compass, Sparkles, PenLine, ListChecks, Clock, SlidersHorizontal } from 'lucide-react';
import { getQuizInfo } from '../data/quizInfo';

// Honest credibility tiers — see src/data/quizInfo.js for the definitions.
const TIERS = {
  research:   { label: 'Research-based',     Icon: FlaskConical, tone: 'text-mint-500' },
  framework:  { label: 'Popular framework',  Icon: Compass,      tone: 'text-sky-500' },
  reflective: { label: 'Reflective exercise', Icon: PenLine,     tone: 'text-violet-500' },
  fun:        { label: 'Just for fun',       Icon: Sparkles,     tone: 'text-coral-500' },
};

function Chip({ icon: Icon, tone = 'text-gray-400', children }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
      {Icon && <Icon className={`w-3.5 h-3.5 ${tone}`} />}
      {children}
    </span>
  );
}

/**
 * "About this quiz" panel shown on a quiz's intro screen, before questions.
 *
 * Props:
 *   quizKey   — key into QUIZ_INFO (supplies basedOn / tier / format)
 *   measures  — one-line description of what the quiz reveals (moved off the card)
 *   questions — real question count (pass questions.length so it can't drift)
 *   time      — human time estimate, e.g. '~5 min'
 */
export default function QuizInfoPanel({ quizKey, measures, questions, time, className = '' }) {
  const info = getQuizInfo(quizKey);
  if (!info && !measures) return null;
  const tier = info ? TIERS[info.tier] : null;

  return (
    <div className={`rounded-2xl border border-gray-200 bg-white/60 backdrop-blur-sm p-5 text-left ${className}`}>
      <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 mb-2">About this quiz</p>
      {measures && (
        <p className="text-sm text-gray-600 leading-relaxed mb-4">{measures}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {tier && <Chip icon={tier.Icon} tone={tier.tone}>{tier.label}</Chip>}
        {Number.isFinite(questions) && questions > 0 && <Chip icon={ListChecks}>{questions} questions</Chip>}
        {time && <Chip icon={Clock}>{String(time).replace(/^~\s*/, '~')} </Chip>}
        {info?.format && <Chip icon={SlidersHorizontal}>{info.format}</Chip>}
      </div>
      {info?.basedOn && (
        <p className="mt-3 text-xs text-gray-500">
          Based on <span className="font-semibold text-gray-600">{info.basedOn}</span>.
          {info.tier === 'framework' && ' A popular framework — widely used, though its scientific rigor is debated.'}
          {info.tier === 'fun' && ' Made for fun, not a scientific measure.'}
        </p>
      )}
    </div>
  );
}
