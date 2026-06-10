import { Globe, Newspaper } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupHero } from "@/components/world-cup/world-cup-hero";
import { WorldCupNav } from "@/components/world-cup/world-cup-nav";
import { WORLD_CUP_NEWS } from "@/lib/world-cup-data";

export default function WorldCupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <WorldCupHero />
          <WorldCupNav activeTab="news-analysis" />

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="rounded-2xl border border-border bg-card p-5 shadow-sm lg:col-span-2">
              <div className="mb-4 flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <Newspaper className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-foreground">News & Analysis</h2>
                  <p className="text-sm text-muted-foreground">
                    Editorial coverage and tournament analysis will live here while the data endpoints are built out.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {WORLD_CUP_NEWS.map((item) => (
                  <article key={item.title} className="rounded-2xl border border-border bg-background p-5 transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="mb-3 inline-flex rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                      {item.tag}
                    </div>
                    <h3 className="text-lg font-black leading-snug text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>

            <aside className="flex flex-col gap-6">
              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  <h3 className="font-black uppercase tracking-tight text-foreground">World Cup Sections</h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Group Stage, Scores, and Player Stats now live on dedicated World Cup subpages.
                </p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-foreground">Quick Links</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><span className="font-bold text-foreground">/world-cup/group-stage</span> · Group stage hub</li>
                  <li><span className="font-bold text-foreground">/world-cup/scores</span> · Match scorecards</li>
                  <li><span className="font-bold text-foreground">/world-cup/stats</span> · Player leaderboards</li>
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