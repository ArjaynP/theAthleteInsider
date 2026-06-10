import { Users } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupHero } from "@/components/world-cup/world-cup-hero";
import { WorldCupNav } from "@/components/world-cup/world-cup-nav";
import { WORLD_CUP_PLAYER_STATS } from "@/lib/world-cup-data";

export default function WorldCupStatsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <WorldCupHero />
          <WorldCupNav activeTab="player-stats" />

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Player Stats</h2>
                <p className="text-sm text-muted-foreground">
                  Stat leaders will be powered by live tournament data later. The table structure is already in place.
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-background">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-card text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Player</th>
                    <th className="px-4 py-3">Team</th>
                    <th className="px-4 py-3">Stat</th>
                    <th className="px-4 py-3 text-right">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {WORLD_CUP_PLAYER_STATS.map((row) => (
                    <tr key={row.player} className="border-b border-border/60 last:border-0">
                      <td className="px-4 py-3 font-bold text-foreground">{row.player}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.team}</td>
                      <td className="px-4 py-3 text-muted-foreground">{row.stat}</td>
                      <td className="px-4 py-3 text-right font-black text-primary">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
