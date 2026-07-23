import { getBigFiveScoreRows } from '../utils/bigFiveShare';

export default function BigFiveScoreCard({ result }) {
  const rows = getBigFiveScoreRows(result);
  if (rows.length === 0) return null;

  return (
    <section
      aria-labelledby="shared-big-five-heading"
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-5"
    >
      <div className="flex items-end justify-between gap-4 mb-1">
        <h2 id="shared-big-five-heading" className="text-base font-extrabold text-gray-800">
          Big Five trait scores
        </h2>
        <span className="text-xs font-bold text-gray-400">0–100</span>
      </div>
      <p className="text-xs text-gray-400 mb-5">
        Each score shows where this profile falls between the two ends of the trait.
      </p>

      <div className="space-y-4">
        {rows.map((trait) => (
          <div key={trait.key}>
            <div className="flex items-center justify-between gap-3 mb-1.5">
              <span className="text-sm font-extrabold text-gray-700">{trait.label}</span>
              <span className="text-sm font-black text-gray-800 tabular-nums">{trait.score}</span>
            </div>
            <div
              role="progressbar"
              aria-label={`${trait.label} score ${trait.score} out of 100`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={trait.score}
              className="h-2.5 bg-gray-100 rounded-full overflow-hidden"
            >
              <div
                className={`h-full rounded-full ${trait.color}`}
                style={{ width: `${trait.score}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-[10px] font-semibold text-gray-400">
              <span>{trait.low}</span>
              <span>{trait.high}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
