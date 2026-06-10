import { Trophy } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupHero } from "@/components/world-cup/world-cup-hero";
import { WorldCupNav } from "@/components/world-cup/world-cup-nav";
import { WORLD_CUP_SCORE_PLACEHOLDERS } from "@/lib/world-cup-data";

export default function WorldCupScoresPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <WorldCupHero />
          <WorldCupNav activeTab="scores" />

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Scores</h2>
                <p className="text-sm text-muted-foreground">
                  Scorecards will be API-driven later. For now, these placeholders define the layout and hierarchy.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {WORLD_CUP_SCORE_PLACEHOLDERS.map((game) => (
                <div key={game.matchup} className="flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 sm:flex-row sm:items-center sm:justify-between">
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
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
