import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupHero } from "@/components/world-cup/world-cup-hero";
import { WorldCupTabs } from "@/components/world-cup/world-cup-tabs";
import { Star, TrendingUp } from "lucide-react";

export const metadata = {
  title: "2026 FIFA World Cup | The Athlete Insider",
  description:
    "2026 FIFA World Cup news and analysis hub, plus group stage, scores, and player stats pages.",
};

const WORLD_CUP_NEWS = [
  {
    id: "wc-1",
    tag: "Analysis",
    date: "Jun 11, 2026",
    title: "How 48 Teams Changes Group Stage Strategy",
    summary:
      "Tactical flexibility and squad depth will matter more than ever in the expanded tournament format.",
  },
  {
    id: "wc-2",
    tag: "Host Watch",
    date: "Jun 10, 2026",
    title: "USA, Canada, and Mexico Finalize Host-City Preparations",
    summary:
      "Training sites, travel corridors, and fan zones are taking shape ahead of kickoff.",
  },
  {
    id: "wc-3",
    tag: "Scouting",
    date: "Jun 9, 2026",
    title: "10 Breakout Players to Track Before Opening Matchday",
    summary:
      "From established stars to emerging talents, these are the names likely to drive headlines.",
  },
  {
    id: "wc-4",
    tag: "Tactics",
    date: "Jun 8, 2026",
    title: "Pressing Systems That Could Define the Tournament",
    summary:
      "Several contenders are expected to rely on aggressive high presses in early group-stage fixtures.",
  },
];

function NewsCard({ article }: { article: (typeof WORLD_CUP_NEWS)[number] }) {
  return (
    <article className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
          {article.tag}
        </span>
        <span className="text-[10px] text-muted-foreground">{article.date}</span>
      </div>
      <h3 className="font-black leading-snug text-foreground transition-colors group-hover:text-primary">
        {article.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{article.summary}</p>
    </article>
  );
}

export default function WorldCupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <WorldCupHero />
          <WorldCupTabs />

          <div className="mb-8 rounded-xl border border-amber/30 bg-amber/5 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber" />
              <span className="text-xs font-black uppercase tracking-widest text-amber">Editorial Focus</span>
            </div>
            <p className="text-lg font-black text-foreground">
              Tournament previews, tactical breakdowns, and matchday reaction all in one stream.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Live data will be connected shortly. For now, this section uses curated editorial placeholders.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/world-cup/group-stage"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Explore Group Stage
              </Link>
              <Link
                href="/world-cup/scores"
                className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                View Scores
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  News & Analysis
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {WORLD_CUP_NEWS.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </section>

            <aside className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-black uppercase text-foreground">Quick Links</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Group Stage", href: "/world-cup/group-stage" },
                    { label: "Scores", href: "/world-cup/scores" },
                    { label: "Player Stats", href: "/world-cup/stats" },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                    >
                      {link.label}
                      <span className="text-muted-foreground">→</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-foreground">Tournament Snapshot</h3>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li><span className="font-bold text-foreground">2026</span> · Expanded World Cup format</li>
                  <li><span className="font-bold text-foreground">48 Teams</span> · 12 groups in opening round</li>
                  <li><span className="font-bold text-foreground">3 Hosts</span> · USA, Canada, Mexico</li>
                  <li><span className="font-bold text-foreground">Live Data</span> · API feed coming soon</li>
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
