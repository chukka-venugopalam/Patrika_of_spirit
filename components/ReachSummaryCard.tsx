interface ReachSummaryCardProps {
  peopleReached: number
  totalShares: number
  maxDepth: number
}

// Depth has no natural ceiling, so this is purely a visual scale for the
// bar fill — raise it if chains commonly run deeper than this in practice.
const DEPTH_VISUAL_CAP = 10

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact' }).format(value)
}

export default function ReachSummaryCard({
  peopleReached,
  totalShares,
  maxDepth,
}: ReachSummaryCardProps) {
  const depthBarWidth = Math.min(100, Math.round((maxDepth / DEPTH_VISUAL_CAP) * 100))

  return (
    <section
      aria-label="Reach summary"
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <dl className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <dt className="text-sm font-medium text-slate-500">People reached</dt>
          <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
            {formatCount(peopleReached)}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Shares made</dt>
          <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
            {formatCount(totalShares)}
          </dd>
        </div>

        <div>
          <dt className="text-sm font-medium text-slate-500">Deepest chain</dt>
          <dd className="mt-1 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
            {maxDepth} {maxDepth === 1 ? 'level' : 'levels'}
          </dd>
          <div
            className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="presentation"
          >
            <div
              className="h-full rounded-full bg-amber-500"
              style={{ width: `${depthBarWidth}%` }}
            />
          </div>
        </div>
      </dl>
    </section>
  )
}
