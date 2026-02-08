import Link from "next/link";
import { articles } from "@/lib/mock-data";
import { Clock, ArrowRight } from "lucide-react";

export function HeroSection() {
  const featured = articles.filter((a) => a.featured);
  const hero = featured[0];
  const secondary = featured[1];

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Main Hero */}
        <Link
          href={`/article/${hero.id}`}
          className="group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 md:min-h-[500px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="relative z-10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                Breaking
              </span>
              <span className="rounded bg-amber px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-background">
                {hero.league}
              </span>
              <span className="text-xs text-muted-foreground">
                {hero.category}
              </span>
            </div>
            <h1 className="mb-3 text-balance text-3xl font-black uppercase leading-none tracking-tight text-foreground transition-colors group-hover:text-primary md:text-4xl lg:text-5xl">
              {hero.title}
            </h1>
            <p className="mb-4 max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
              {hero.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {hero.author}
              </span>
              <span>{hero.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {hero.readTime}
              </span>
              <ArrowRight className="h-4 w-4 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </div>
        </Link>

        {/* Secondary Hero */}
        <Link
          href={`/article/${secondary.id}`}
          className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 md:min-h-[500px]"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
          <div className="relative z-10">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                Preview
              </span>
              <span className="rounded bg-amber px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-background">
                {secondary.league}
              </span>
            </div>
            <h2 className="mb-3 text-balance text-2xl font-black uppercase leading-none tracking-tight text-foreground transition-colors group-hover:text-primary md:text-3xl">
              {secondary.title}
            </h2>
            <p className="mb-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
              {secondary.excerpt}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">
                {secondary.author}
              </span>
              <span>{secondary.date}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {secondary.readTime}
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
