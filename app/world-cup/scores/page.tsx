import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupPageHeader } from "@/components/world-cup/world-cup-page-header";
import { WorldCupSectionNav } from "@/components/world-cup/world-cup-section-nav";
import { WorldCupSidebar } from "@/components/world-cup/world-cup-sidebar";
import { WORLD_CUP_SCORES } from "@/lib/world-cup-data";

export default function WorldCupScoresPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <WorldCupPageHeader
            title="World Cup Scores"
            subtitle="2026 FIFA World Cup · Results and fixtures"
          />

          <WorldCupSectionNav />

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Match Center</h2>
                <p className="text-sm text-muted-foreground">
                  Scorecards are placeholders for now and will become API-driven once the World Cup feed is connected.
                </p>
              </div>

              <div className="space-y-3">
                {WORLD_CUP_SCORES.map((game) => (
                  <div
                    key={game.matchup}
                    className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <div className="font-black text-foreground">{game.matchup}</div>
                      <div className="text-sm text-muted-foreground">{game.time}</div>
                    </div>
                    <div className="inline-flex w-fit rounded-full border border-dashed border-border px-3 py-1 text-xs font-black uppercase tracking-widest text-muted-foreground">
                      {game.status}
                    </div>
                  </div>
                ))}
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
