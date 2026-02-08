import { bettingOdds } from "@/lib/data"

export function BettingPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-foreground">Betting Odds</h2>
          <span className="rounded-md bg-yellow-400/10 px-2 py-0.5 text-xs font-semibold text-yellow-400">
            Compare
          </span>
        </div>
        <span className="text-xs text-muted-foreground">Lines updated live</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="pb-3 text-left font-medium">Game</th>
              <th className="pb-3 text-center font-medium">FanDuel</th>
              <th className="pb-3 text-center font-medium">DraftKings</th>
              <th className="pb-3 text-center font-medium">BetMGM</th>
            </tr>
          </thead>
          <tbody>
            {bettingOdds.map((odds) => (
              <tr key={odds.game} className="border-b border-border/50">
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{odds.game}</span>
                    <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {odds.league}
                    </span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-mono text-foreground">{odds.fanduel.spread}</span>
                    <span className="text-muted-foreground">{odds.fanduel.total}</span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-mono text-foreground">{odds.draftkings.spread}</span>
                    <span className="text-muted-foreground">{odds.draftkings.total}</span>
                  </div>
                </td>
                <td className="py-4 text-center">
                  <div className="flex flex-col gap-0.5 text-xs">
                    <span className="font-mono text-foreground">{odds.betmgm.spread}</span>
                    <span className="text-muted-foreground">{odds.betmgm.total}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
