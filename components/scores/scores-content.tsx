"use client"

import { useState } from "react"
import { liveGames, type Game } from "@/lib/data"
import { LeagueFilter } from "@/components/league-filter"

function StatusBadge({ status }: { status: Game["status"] }) {
  if (status === "live") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
        <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-destructive" />
        LIVE
      </span>
    )
  }
  if (status === "final") {
    return (
      <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-muted-foreground">
        FINAL
      </span>
    )
  }
  return (
    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
      UPCOMING
    </span>
  )
}

function GameCard({ game }: { game: Game }) {
  const homeWinning = game.homeScore > game.awayScore
  const awayWinning = game.awayScore > game.homeScore

  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/30">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
          {game.league}
        </span>
        <StatusBadge status={game.status} />
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-3">
        {/* Away */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
              {game.awayTeam.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <p className={`font-semibold ${awayWinning ? "text-foreground" : "text-muted-foreground"}`}>
                {game.awayTeam}
              </p>
              {game.awayRecord && (
                <p className="text-xs text-muted-foreground">{game.awayRecord}</p>
              )}
            </div>
          </div>
          <span className={`font-mono text-2xl font-bold ${awayWinning ? "text-foreground" : "text-muted-foreground"}`}>
            {game.status !== "upcoming" ? game.awayScore : "-"}
          </span>
        </div>

        <div className="h-px bg-border" />

        {/* Home */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-xs font-bold text-muted-foreground">
              {game.homeTeam.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <p className={`font-semibold ${homeWinning ? "text-foreground" : "text-muted-foreground"}`}>
                {game.homeTeam}
              </p>
              {game.homeRecord && (
                <p className="text-xs text-muted-foreground">{game.homeRecord}</p>
              )}
            </div>
          </div>
          <span className={`font-mono text-2xl font-bold ${homeWinning ? "text-foreground" : "text-muted-foreground"}`}>
            {game.status !== "upcoming" ? game.homeScore : "-"}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-center rounded-lg bg-secondary/50 py-2">
        <span className="text-xs font-medium text-muted-foreground">{game.time}</span>
      </div>
    </div>
  )
}

export function ScoresContent() {
  const [filter, setFilter] = useState("all")

  const filteredGames = filter === "all"
    ? liveGames
    : liveGames.filter((g) => g.league === filter)

  // Group by status
  const live = filteredGames.filter((g) => g.status === "live")
  const upcoming = filteredGames.filter((g) => g.status === "upcoming")
  const final_ = filteredGames.filter((g) => g.status === "final")

  return (
    <div>
      <div className="mb-6">
        <LeagueFilter active={filter} onChange={setFilter} />
      </div>

      {live.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-destructive" />
            Live Now
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {live.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {upcoming.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Upcoming</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}

      {final_.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-4 text-sm font-semibold text-foreground">Final</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {final_.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
