import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WorldCupHero } from "@/components/world-cup/world-cup-hero";
import { WorldCupSectionNav } from "@/components/world-cup/world-cup-section-nav";
import { WorldCupSidebar } from "@/components/world-cup/world-cup-sidebar";
import { WORLD_CUP_NEWS } from "@/lib/world-cup-data";

export default function WorldCupPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <WorldCupHero />
          <WorldCupSectionNav />

          <div className="grid gap-8 lg:grid-cols-3">
            <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="mb-4">
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                  News & Analysis
                </h2>
                <p className="text-sm text-muted-foreground">
                  This is the World Cup home page. Editorial coverage is live now, and data-backed modules can be connected later.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {WORLD_CUP_NEWS.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-border bg-background p-5 transition-all hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="mb-3 inline-flex rounded-full bg-primary/10 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-primary">
                      {item.tag}
                    </div>
                    <h3 className="text-lg font-black leading-snug text-foreground">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
                  </article>
                ))}
              </div>
            </section>

            <WorldCupSidebar />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
