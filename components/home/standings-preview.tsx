import Link from "next/link"
import { nbaEastStandings, nbaWestStandings } from "@/lib/data"

function StandingsTable({ title, data }: { title: string; data: typeof nbaEastStandings }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="pb-2 text-left font-medium">#</th>
            <th className="pb-2 text-left font-medium">Team</th>
            <th className="pb-2 text-right font-medium">W</th>
            <th className="pb-2 text-right font-medium">L</th>
            <th className="hidden pb-2 text-right font-medium sm:table-cell">PCT</th>
            <th className="pb-2 text-right font-medium">GB</th>
          </tr>
        </thead>
        <tbody>
          {data.map((team) => (
            <tr key={team.team} className="border-b border-border/50 last:border-0">
              <td className="py-2.5 text-xs font-medium text-muted-foreground">{team.rank}</td>
              <td className="py-2.5 text-sm font-semibold text-foreground">{team.team}</td>
              <td className="py-2.5 text-right font-mono text-sm text-foreground">{team.wins}</td>
              <td className="py-2.5 text-right font-mono text-sm text-muted-foreground">{team.losses}</td>
              <td className="hidden py-2.5 text-right font-mono text-sm text-muted-foreground sm:table-cell">
                {team.pct.toFixed(3)}
              </td>
              <td className="py-2.5 text-right font-mono text-sm text-muted-foreground">{team.gb}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function StandingsPreview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">NBA Standings</h2>
        <Link
          href="/standings"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Full Standings
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <StandingsTable title="Eastern Conference" data={nbaEastStandings} />
        <StandingsTable title="Western Conference" data={nbaWestStandings} />
      </div>
    </section>
  )
}
