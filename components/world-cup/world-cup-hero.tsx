import { Globe } from "lucide-react";

export function WorldCupHero() {
  return (
    <section className="mb-8 rounded-3xl border border-border/60 bg-[radial-gradient(circle_at_10%_20%,rgba(37,99,235,0.22),transparent_34%),radial-gradient(circle_at_72%_52%,rgba(37,99,235,0.12),transparent_46%),linear-gradient(180deg,rgba(6,11,20,0.94),rgba(2,6,12,0.98))] p-4 sm:p-6 lg:p-8">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-stretch lg:gap-6">
        <div className="rounded-2xl border border-border/40 bg-background/20 p-5 backdrop-blur-sm sm:p-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/35 bg-primary/10 px-3 py-1">
            <Globe className="h-4 w-4 text-primary" />
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-primary">
              2026 FIFA World Cup
            </span>
          </div>

          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary/20">
              <Globe className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tight text-foreground sm:text-5xl">
                World Cup Hub
              </h1>
              <p className="mt-2 max-w-3xl text-base text-muted-foreground sm:text-2xl/relaxed">
                Group Stage, news, scores, and player stats. Live API connections
                will land here later.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
          <div className="rounded-2xl border border-border/40 bg-background/25 p-5 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              Host Nations
            </p>
            <p className="mt-2 text-2xl font-black text-foreground">USA, Canada, Mexico</p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-background/25 p-5 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              Format
            </p>
            <p className="mt-2 text-2xl font-black text-foreground">48 Teams</p>
          </div>

          <div className="rounded-2xl border border-border/40 bg-background/25 p-5 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-muted-foreground">
              Coverage
            </p>
            <p className="mt-2 text-2xl font-black text-foreground">Editorial + Live Data</p>
          </div>
        </div>
      </div>
    </section>
  );
}