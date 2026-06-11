import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupTabs } from "@/components/world-cup/world-cup-tabs";
import { CalendarDays, Globe } from "lucide-react";

export const metadata = {
  title: "World Cup Scores | The Athlete Insider",
  description: "Live and completed scores for the 2026 FIFA World Cup.",
};

const SCORE_BUCKETS = [
  {
    title: "Live Matches",
    description: "Real-time scoreboards and match events will load from API feeds.",
  },
  {
    title: "Upcoming Fixtures",
    description: "Kickoff schedules and venue details will be available here.",
  },
  {
    title: "Final Results",
    description: "Completed match results and recaps will appear in this section.",
  },
];

export default function WorldCupScoresPage() {
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
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">World Cup Scores</h1>
              <p className="text-sm text-muted-foreground">Scores page scaffolded and ready for API integration.</p>
            </div>
          </div>

          <WorldCupTabs />

          <div className="mb-6 rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
              <CalendarDays className="h-4 w-4 text-primary" />
              Matchday timeline will be enabled with live data.
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {SCORE_BUCKETS.map((bucket) => (
              <section key={bucket.title} className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-2 text-lg font-black uppercase text-foreground">{bucket.title}</h2>
                <p className="text-sm text-muted-foreground">{bucket.description}</p>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
