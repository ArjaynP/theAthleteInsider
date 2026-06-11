import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupTabs } from "@/components/world-cup/world-cup-tabs";
import { Globe } from "lucide-react";

export const metadata = {
  title: "World Cup Group Stage | The Athlete Insider",
  description: "Group stage coverage for the 2026 FIFA World Cup.",
};

const GROUPS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];

export default function WorldCupGroupStagePage() {
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
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">World Cup Group Stage</h1>
              <p className="text-sm text-muted-foreground">Group tables and fixtures will populate from API soon.</p>
            </div>
          </div>

          <WorldCupTabs />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GROUPS.map((group) => (
              <section key={group} className="rounded-xl border border-border bg-card p-5">
                <h2 className="mb-3 text-lg font-black uppercase text-foreground">Group {group}</h2>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Standings and qualification race details will appear here.</p>
                  <p className="rounded-lg bg-muted/50 px-3 py-2">Awaiting live table feed.</p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
