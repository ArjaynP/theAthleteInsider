import { Trophy } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupHero } from "@/components/world-cup/world-cup-hero";
import { WorldCupNav } from "@/components/world-cup/world-cup-nav";
import { WORLD_CUP_GROUPS } from "@/lib/world-cup-data";

export default function WorldCupGroupStagePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <WorldCupHero />
          <WorldCupNav activeTab="group-stage" />

          <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">Group Stage</h2>
                <p className="text-sm text-muted-foreground">
                  Placeholder groups are ready now; the live schedule feed will slot in once the API is connected.
                </p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {WORLD_CUP_GROUPS.map((group) => (
                <div key={group.name} className="rounded-2xl border border-border bg-background p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-black uppercase tracking-tight text-foreground">{group.name}</h3>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                      Preview
                    </span>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {group.teams.map((team) => (
                      <li key={team} className="flex items-center justify-between rounded-lg bg-card px-3 py-2">
                        <span className="font-medium text-foreground">{team}</span>
                        <span className="text-xs uppercase tracking-widest">TBD</span>
                      </li>
                    ))}
                  </ul>
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
