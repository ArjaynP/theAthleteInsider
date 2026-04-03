import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Star } from "lucide-react";

export const metadata = {
  title: "UEFA Champions League | The Athlete Insider",
  description:
    "UEFA Champions League news, scores, standings, stats, and knockout phase bracket.",
};

// ── Placeholder news articles ─────────────────────────────────────────────────
// TODO: Replace with CMS / API-driven articles when available.
const UCL_NEWS = [
  {
    id: "ucl-1",
    title: "Liverpool Top the UCL League Phase with Dominant Campaign",
    summary:
      "The Reds secured top spot with seven wins from eight matches, setting up a favorable Round of 16 draw.",
    tag: "Analysis",
    date: "Mar 30, 2026",
  },
  {
    id: "ucl-2",
    title: "Real Madrid Draw Liverpool in Round of 16",
    summary:
      "The 14-time champions face an Anfield test in what promises to be the tie of the round.",
    tag: "Draws",
    date: "Mar 29, 2026",
  },
  {
    id: "ucl-3",
    title: "Harry Kane Leads the Golden Boot Race with 8 Goals",
    summary:
      "The England captain has been in lethal form, finding the net in six of his eight league-phase appearances.",
    tag: "Stats",
    date: "Mar 28, 2026",
  },
  {
    id: "ucl-4",
    title: "Club Brugge's Cinderella Run Ends in League Phase",
    summary:
      "The Belgian side earned their knockout-phase spot despite a tough final matchday loss.",
    tag: "Recap",
    date: "Mar 27, 2026",
  },
];

function NewsCard({ article }: { article: typeof UCL_NEWS[number] }) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-primary">
          {article.tag}
        </span>
        <span className="text-[10px] text-muted-foreground">{article.date}</span>
      </div>
      <h3 className="font-black leading-snug text-foreground group-hover:text-primary transition-colors">
        {article.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{article.summary}</p>
    </div>
  );
}

export default function UCLPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">

          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
              <Image src="/uefa-logo.jpg" alt="UEFA" width={56} height={56} className="h-14 w-14 object-cover" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                Champions League
              </h1>
              <p className="text-sm text-muted-foreground">
                UEFA Champions League 2025–26 · News, Scores &amp; Analysis
              </p>
            </div>
          </div>

          {/* Featured banner */}
          <div className="mb-8 rounded-xl border border-amber/30 bg-amber/5 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-amber" />
              <span className="text-xs font-black uppercase tracking-widest text-amber">
                Round of 16
              </span>
            </div>
            <p className="text-lg font-black text-foreground">
              Liverpool vs Real Madrid · Atlético vs Arsenal · Barcelona vs Inter
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              First legs from April 8–9, 2026
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/ucl/scores"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                View Scores
              </Link>
              <Link
                href="/ucl/knockout"
                className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                Knockout Bracket
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main: news */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  UCL News
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {UCL_NEWS.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            </div>

            {/* Sidebar: quick links */}
            <aside className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-black uppercase text-foreground">Quick Links</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Standings", href: "/ucl/standings" },
                    { label: "Scores", href: "/ucl/scores" },
                    { label: "Knockout Phase", href: "/ucl/knockout" },
                    { label: "Player Stats", href: "/ucl/stats" },
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
                  Key Dates
                </h3>
                <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <li><span className="font-bold text-foreground">Apr 8–9</span> · R16 Leg 1</li>
                  <li><span className="font-bold text-foreground">Apr 15–16</span> · R16 Leg 2</li>
                  <li><span className="font-bold text-foreground">Apr 22–23</span> · QF Leg 1</li>
                  <li><span className="font-bold text-foreground">Apr 29–30</span> · QF Leg 2</li>
                  <li><span className="font-bold text-foreground">Apr 29–30</span> · SF Leg 1</li>
                  <li><span className="font-bold text-foreground">May 6–7</span> · SF Leg 2</li>
                  <li><span className="font-bold text-foreground">May 30</span> · Final · Munich</li>
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
