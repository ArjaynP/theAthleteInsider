"use client"

import { liveGames } from "@/lib/data"

function StatusBadge({ status }: { status: "live" | "final" | "upcoming" }) {
  if (status === "live") {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold text-destructive">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
        LIVE
      </span>
    )
  }
  if (status === "final") {
    return <span className="text-xs font-medium text-muted-foreground">FINAL</span>
  }
  return <span className="text-xs font-medium text-primary">UPCOMING</span>
}

export function ScoresTicker() {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-4 overflow-x-auto py-3 scrollbar-none">
          <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Scores
          </span>
          <div className="h-4 w-px shrink-0 bg-border" />
          {liveGames.map((game) => (
            <div
              key={game.id}
              className="flex shrink-0 items-center gap-3 rounded-lg border border-border bg-background px-3 py-2"
            >
              <StatusBadge status={game.status} />
              <div className="flex flex-col text-xs">
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${game.awayScore > game.homeScore ? "text-foreground" : "text-muted-foreground"}`}>
                    {game.awayTeam}
                  </span>
                  <span className={`font-mono font-bold ${game.awayScore > game.homeScore ? "text-foreground" : "text-muted-foreground"}`}>
                    {game.status !== "upcoming" ? game.awayScore : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-semibold ${game.homeScore > game.awayScore ? "text-foreground" : "text-muted-foreground"}`}>
                    {game.homeTeam}
                  </span>
                  <span className={`font-mono font-bold ${game.homeScore > game.awayScore ? "text-foreground" : "text-muted-foreground"}`}>
                    {game.status !== "upcoming" ? game.homeScore : ""}
                  </span>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">{game.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
