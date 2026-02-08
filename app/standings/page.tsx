import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { nbaEastStandings, nbaWestStandings, type TeamStanding } from "@/lib/data"

export const metadata: Metadata = {
  title: "Standings | The Athlete Insider",
  description: "Full NBA and NFL standings, conference tables, and playoff picture.",
}

function StandingsTable({ title, data }: { title: string; data: TeamStanding[] }) {
  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-5 py-4">
        <h2 className="font-bold text-foreground">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-medium">#</th>
              <th className="px-5 py-3 text-left font-medium">Team</th>
              <th className="px-5 py-3 text-right font-medium">W</th>
              <th className="px-5 py-3 text-right font-medium">L</th>
              <th className="px-5 py-3 text-right font-medium">PCT</th>
              <th className="px-5 py-3 text-right font-medium">GB</th>
              <th className="hidden px-5 py-3 text-right font-medium md:table-cell">Streak</th>
              <th className="hidden px-5 py-3 text-right font-medium md:table-cell">L10</th>
            </tr>
          </thead>
          <tbody>
            {data.map((team, i) => (
              <tr
                key={team.team}
                className={`border-b border-border/50 transition-colors hover:bg-secondary/30 ${
                  i < 6 ? "" : "opacity-60"
                }`}
              >
                <td className="px-5 py-3.5 text-sm font-medium text-muted-foreground">{team.rank}</td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-[10px] font-bold text-muted-foreground">
                      {team.team.slice(0, 3).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-foreground">{team.team}</span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right font-mono text-sm font-medium text-foreground">{team.wins}</td>
                <td className="px-5 py-3.5 text-right font-mono text-sm text-muted-foreground">{team.losses}</td>
                <td className="px-5 py-3.5 text-right font-mono text-sm text-muted-foreground">{team.pct.toFixed(3)}</td>
                <td className="px-5 py-3.5 text-right font-mono text-sm text-muted-foreground">{team.gb}</td>
                <td className="hidden px-5 py-3.5 text-right md:table-cell">
                  <span className={`text-sm font-medium ${team.streak.startsWith("W") ? "text-accent" : "text-destructive"}`}>
                    {team.streak}
                  </span>
                </td>
                <td className="hidden px-5 py-3.5 text-right font-mono text-sm text-muted-foreground md:table-cell">
                  {team.last10}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function StandingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-2xl font-bold text-foreground">Standings</h1>
            <p className="text-sm text-muted-foreground">
              Full conference standings, records, and playoff picture
            </p>
          </div>

          {/* NBA Section */}
          <div className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-md bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                NBA
              </span>
              <span className="text-sm text-muted-foreground">2025-26 Season</span>
            </div>
            <div className="grid gap-6 xl:grid-cols-2">
              <StandingsTable title="Eastern Conference" data={nbaEastStandings} />
              <StandingsTable title="Western Conference" data={nbaWestStandings} />
            </div>
          </div>

          {/* NFL Placeholder */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                NFL
              </span>
              <span className="text-sm text-muted-foreground">2025-26 Season</span>
            </div>
            <div className="flex items-center justify-center rounded-xl border border-border bg-card p-12">
              <div className="text-center">
                <p className="mb-1 text-sm font-semibold text-foreground">NFL Standings Coming Soon</p>
                <p className="text-xs text-muted-foreground">Full AFC and NFC standings will be available during the season</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
