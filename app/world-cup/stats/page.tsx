import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupTabs } from "@/components/world-cup/world-cup-tabs";
import { Globe, TrendingUp } from "lucide-react";

export const metadata = {
  title: "World Cup Player Stats | The Athlete Insider",
  description: "Player stats leaders for the 2026 FIFA World Cup.",
};

const STAT_CATEGORIES = [
  "Goals",
  "Assists",
  "Expected Goals",
  "Shots on Target",
  "Key Passes",
  "Progressive Carries",
  "Tackles Won",
  "Saves",
];

export default function WorldCupStatsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Globe className="h-7 w-7 text-primary" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">World Cup Player Stats</h1>
              <p className="text-sm text-muted-foreground">Stat leaders will update from the live tournament API feed.</p>
            </div>
          </div>

          <WorldCupTabs />

          <div className="mb-6 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <TrendingUp className="h-4 w-4 text-primary" />
              Metrics are in placeholder mode until the World Cup data endpoint is connected.
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {STAT_CATEGORIES.map((category) => (
              <section key={category} className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-2 text-base font-black uppercase text-foreground">{category}</h2>
                <p className="text-sm text-muted-foreground">Top performers and per-match rates will appear here.</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
