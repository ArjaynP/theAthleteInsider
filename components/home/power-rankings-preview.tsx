import { powerRankings } from "@/lib/data"

function RankChange({ current, previous }: { current: number; previous: number }) {
  const diff = previous - current
  if (diff > 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs font-semibold text-accent">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6" />
        </svg>
        {diff}
      </span>
    )
  }
  if (diff < 0) {
    return (
      <span className="flex items-center gap-0.5 text-xs font-semibold text-destructive">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="m6 9 6 6 6-6" />
        </svg>
        {Math.abs(diff)}
      </span>
    )
  }
  return <span className="text-xs text-muted-foreground">--</span>
}

export function PowerRankingsPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Power Rankings</h2>
        <span className="text-xs text-muted-foreground">Updated Feb 7, 2026</span>
      </div>

      <div className="flex flex-col gap-3">
        {powerRankings.map((item) => (
          <div
            key={item.rank}
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
          >
            {/* Rank */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <span className="text-lg font-bold text-foreground">{item.rank}</span>
            </div>

            {/* Change */}
            <div className="w-8 shrink-0 text-center">
              <RankChange current={item.rank} previous={item.prevRank} />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{item.team}</span>
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.league}
                </span>
                <span className="font-mono text-xs text-muted-foreground">{item.record}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
