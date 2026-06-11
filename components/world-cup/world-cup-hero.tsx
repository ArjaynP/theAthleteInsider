import Image from "next/image";

export function WorldCupHero() {
  return (
    <div className="mb-8 flex flex-col gap-6 rounded-3xl border border-border bg-gradient-to-br from-card via-background to-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Image
            src="/world-cup-logo-2026.png"
            alt="2026 FIFA World Cup"
            width={56}
            height={56}
            className="h-12 w-12 object-contain"
            priority
          />
        </div>
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            <Image
              src="/world-cup-logo-2026.png"
              alt=""
              width={14}
              height={14}
              className="h-3.5 w-3.5 object-contain"
              aria-hidden="true"
            />
            2026 FIFA World Cup
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
            World Cup Hub
          </h1>
          <p className="text-sm text-muted-foreground">
            Group Stage, news, scores, and player stats. Live API connections will land here later.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Host Nations</div>
          <div className="mt-1 text-lg font-black text-foreground">USA, Canada, Mexico</div>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Format</div>
          <div className="mt-1 text-lg font-black text-foreground">48 Teams</div>
        </div>
        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Coverage</div>
          <div className="mt-1 text-lg font-black text-foreground">Editorial + Live Data</div>
        </div>
      </div>
    </div>
  );
}
