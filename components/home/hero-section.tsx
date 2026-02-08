import Link from "next/link"
import { articles } from "@/lib/data"

export function HeroSection() {
  const featured = articles.filter((a) => a.featured)
  const main = featured[0]
  const secondary = featured[1]

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main feature */}
        <div className="relative flex flex-col justify-end overflow-hidden rounded-2xl bg-card p-6 lg:col-span-2 lg:min-h-[400px]">
          <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,23,42,0.95)_0%,rgba(15,23,42,0.4)_100%)]" />
          <div className="relative z-10 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary">
                {main.category}
              </span>
              <span className="text-xs text-muted-foreground">Featured</span>
            </div>
            <h1 className="text-balance text-2xl font-bold leading-tight text-foreground lg:text-3xl">
              {main.title}
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {main.excerpt}
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{main.author}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{main.date}</span>
              <span className="h-1 w-1 rounded-full bg-muted-foreground" />
              <span>{main.readTime}</span>
            </div>
            <Link
              href="/news"
              className="mt-1 inline-flex w-fit items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Read More
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Side card */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-1 flex-col justify-end rounded-2xl bg-card p-6">
            <div className="flex flex-col gap-3">
              <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-semibold text-primary w-fit">
                {secondary.category}
              </span>
              <h2 className="text-balance text-lg font-bold leading-tight text-foreground">
                {secondary.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                {secondary.excerpt}
              </p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{secondary.author}</span>
                <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                <span>{secondary.readTime}</span>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl bg-card p-6">
            <h3 className="mb-3 text-sm font-semibold text-foreground">Quick Stats</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Games Today</span>
                <span className="font-mono font-bold text-foreground">8</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Live Now</span>
                <span className="font-mono font-bold text-destructive">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Injuries Reported</span>
                <span className="font-mono font-bold text-foreground">12</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
