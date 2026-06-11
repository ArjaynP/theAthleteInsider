import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupPageHeader } from "@/components/world-cup/world-cup-page-header";
import { WorldCupSectionNav } from "@/components/world-cup/world-cup-section-nav";
import { WorldCupSidebar } from "@/components/world-cup/world-cup-sidebar";
import { WORLD_CUP_PLAYER_STATS } from "@/lib/world-cup-data";

export default function WorldCupStatsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <WorldCupPageHeader
            title="World Cup Player Stats"
            subtitle="2026 FIFA World Cup · Player leaders"
          />

          <WorldCupSectionNav />

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Player Leaders</h2>
                <p className="text-sm text-muted-foreground">
                  This table structure is ready for live tournament stats once the API endpoint is connected.
                </p>
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

            <WorldCupSidebar />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
