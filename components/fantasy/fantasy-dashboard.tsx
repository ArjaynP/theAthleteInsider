"use client"

import { useState } from "react"
import { fantasyPlayers, type FantasyPlayer } from "@/lib/data"

function RecommendationBadge({ rec }: { rec: FantasyPlayer["recommendation"] }) {
  const styles = {
    Start: "bg-accent/10 text-accent",
    Sit: "bg-destructive/10 text-destructive",
    Flex: "bg-yellow-400/10 text-yellow-400",
  }
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${styles[rec]}`}>
      {rec}
    </span>
  )
}

function MatchupBadge({ rating }: { rating: FantasyPlayer["matchupRating"] }) {
  const styles = {
    Easy: "bg-accent/10 text-accent",
    Medium: "bg-yellow-400/10 text-yellow-400",
    Hard: "bg-destructive/10 text-destructive",
  }
  return (
    <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${styles[rating]}`}>
      {rating}
    </span>
  )
}

function StatCard({ label, value, subtext }: { label: string; value: string; subtext?: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
      {subtext && <p className="mt-0.5 text-xs text-muted-foreground">{subtext}</p>}
    </div>
  )
}

function PlayerRow({ player, expanded, onToggle }: { player: FantasyPlayer; expanded: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border/50 last:border-0">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/30"
      >
        {/* Name & Position */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{player.name}</span>
            {player.injuryStatus && (
              <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                {player.injuryStatus}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span>{player.team}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>{player.position}</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground" />
            <span>{player.matchup}</span>
            <MatchupBadge rating={player.matchupRating} />
          </div>
        </div>

        {/* Fantasy Pts */}
        <div className="hidden text-right sm:block">
          <p className="font-mono text-sm font-bold text-foreground">{player.fantasyPts}</p>
          <p className="text-[10px] text-muted-foreground">avg FPTS</p>
        </div>

        {/* Projected */}
        <div className="hidden text-right md:block">
          <p className="font-mono text-sm font-bold text-primary">{player.projectedPts}</p>
          <p className="text-[10px] text-muted-foreground">projected</p>
        </div>

        {/* Recommendation */}
        <div className="shrink-0">
          <RecommendationBadge rec={player.recommendation} />
        </div>

        {/* Expand icon */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="grid grid-cols-2 gap-3 border-t border-border/50 bg-secondary/20 px-5 py-4 md:grid-cols-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Usage Rate</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-foreground">{player.usage}%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Minutes</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-foreground">{player.minutes}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Avg FPTS</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-foreground">{player.fantasyPts}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Matchup</p>
            <div className="mt-0.5 flex items-center gap-1">
              <span className="font-mono text-sm font-bold text-foreground">{player.matchup}</span>
              <MatchupBadge rating={player.matchupRating} />
            </div>
          </div>
          {player.injuryStatus && (
            <div className="col-span-full">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Injury Note</p>
              <p className="mt-0.5 text-sm text-destructive">
                Status: {player.injuryStatus} — Monitor closely before game time. Reduced minutes expected if active.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function FantasyDashboard() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filterRec, setFilterRec] = useState<string>("all")

  const filtered = filterRec === "all"
    ? fantasyPlayers
    : fantasyPlayers.filter((p) => p.recommendation === filterRec)

  const starters = fantasyPlayers.filter((p) => p.recommendation === "Start")
  const avgProjected = (fantasyPlayers.reduce((acc, p) => acc + p.projectedPts, 0) / fantasyPlayers.length).toFixed(1)
  const injured = fantasyPlayers.filter((p) => p.injuryStatus).length

  return (
    <div>
      {/* Stats overview */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Must Starts" value={String(starters.length)} subtext="clear starts this week" />
        <StatCard label="Avg Projection" value={avgProjected} subtext="fantasy points" />
        <StatCard label="Injury Watch" value={String(injured)} subtext="players with status" />
        <StatCard label="Week" value="16" subtext="of NBA season" />
      </div>

      {/* Start/Sit Recommendations */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex flex-col gap-3 border-b border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-bold text-foreground">Start / Sit Recommendations</h2>
          <div className="flex gap-2">
            {["all", "Start", "Sit", "Flex"].map((rec) => (
              <button
                key={rec}
                onClick={() => setFilterRec(rec)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition-colors ${
                  filterRec === rec
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {rec === "all" ? "All" : rec}
              </button>
            ))}
          </div>
        </div>

        {filtered.map((player) => (
          <PlayerRow
            key={player.name}
            player={player}
            expanded={expandedId === player.name}
            onToggle={() => setExpandedId(expandedId === player.name ? null : player.name)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            No players match the selected filter.
          </div>
        )}
      </div>

      {/* Streaming Picks & Waiver Wire */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold text-foreground">Streaming Picks</h3>
          <p className="mb-3 text-xs text-muted-foreground">Top streaming options for this week based on matchup analysis</p>
          <div className="flex flex-col gap-3">
            {[
              { name: "De'Aaron Fox", team: "SAC", matchup: "vs POR", why: "Portland ranks 29th in PG defense" },
              { name: "Cade Cunningham", team: "DET", matchup: "vs WAS", why: "Washington allows 4th-most PG fantasy points" },
              { name: "Jalen Williams", team: "OKC", matchup: "vs LAL", why: "Lakers struggle with versatile wings" },
            ].map((pick) => (
              <div key={pick.name} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                <div>
                  <p className="text-sm font-semibold text-foreground">{pick.name}</p>
                  <p className="text-xs text-muted-foreground">{pick.team} {pick.matchup}</p>
                </div>
                <p className="max-w-[180px] text-right text-[10px] text-accent">{pick.why}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="mb-4 font-bold text-foreground">Injury Impact Watch</h3>
          <p className="mb-3 text-xs text-muted-foreground">How key injuries affect your fantasy lineup</p>
          <div className="flex flex-col gap-3">
            {[
              { name: "Anthony Davis", status: "Questionable", impact: "If out, Austin Reaves becomes top-30 play" },
              { name: "Brandon Ingram", status: "Game-Time Decision", impact: "CJ McCollum and Trey Murphy get usage boost" },
              { name: "Kawhi Leonard", status: "Out", impact: "Norman Powell and James Harden benefit significantly" },
            ].map((injury) => (
              <div key={injury.name} className="flex items-center justify-between rounded-lg bg-secondary/50 px-3 py-2.5">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{injury.name}</p>
                    <span className="rounded bg-destructive/10 px-1.5 py-0.5 text-[10px] font-semibold text-destructive">
                      {injury.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{injury.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
