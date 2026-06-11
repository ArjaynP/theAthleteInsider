import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupHero } from "@/components/world-cup/world-cup-hero";
import { WorldCupTabs } from "@/components/world-cup/world-cup-tabs";
import { TrendingUp } from "lucide-react";

export const metadata = {
  title: "2026 FIFA World Cup | The Athlete Insider",
  description:
    "2026 FIFA World Cup news and analysis, with dedicated pages for group stage, scores, and player stats.",
};

const WORLD_CUP_NEWS = [
  {
    id: "wc-news-1",
    title: "Early Tactical Trends to Watch Ahead of 2026",
    summary:
      "National teams are testing wider rotations and hybrid midfield roles as preparations ramp up for the expanded tournament.",
    tag: "Analysis",
    date: "Jun 11, 2026",
  },
  {
    id: "wc-news-2",
    title: "Host City Logistics Could Shape Group-Stage Recovery",
    summary:
      "Travel windows across North America may influence squad rotation plans, especially during compressed turnaround periods.",
    tag: "Feature",
    date: "Jun 10, 2026",
  },
  {
    id: "wc-news-3",
    title: "Young Breakout Candidates for the 2026 Spotlight",
    summary:
      "From South America to Europe, several rising stars are positioned to become key contributors in marquee fixtures.",
    tag: "Scouting",
    date: "Jun 9, 2026",
  },
  {
    id: "wc-news-4",
    title: "How the 48-Team Format Changes Qualification Math",
    summary:
      "Expanded pathways create new tactical tradeoffs in group play, where goal difference and rotation could be decisive.",
    tag: "Explainer",
    date: "Jun 8, 2026",
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
      <h2 className="font-black leading-snug text-foreground transition-colors group-hover:text-primary">
        {article.title}
      </h2>
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
          <WorldCupTabs activeTab="news" />

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  World Cup News
                </h2>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {WORLD_CUP_NEWS.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            </div>

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
                <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-foreground">
                  Coverage Plan
                </h3>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li>
                    <span className="font-bold text-foreground">News Desk</span> · Daily previews and recaps
                  </li>
                  <li>
                    <span className="font-bold text-foreground">Data Hub</span> · Live scores integration coming soon
                  </li>
                  <li>
                    <span className="font-bold text-foreground">Stats Center</span> · Player leaderboard tracking
                  </li>
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