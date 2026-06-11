import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link";
import Image from "next/image";
import { TrendingUp, Star } from "lucide-react";
import { MLS_NEWS } from "@/lib/mls-data";

export const metadata = {
  title: "Major League Soccer | The Athlete Insider",
  description:
    "MLS news, analysis, scores, standings, and player stats for the 2026 season.",
};

function NewsCard({ article }: { article: typeof MLS_NEWS[number] }) {
  return (
    <div className="group flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-md">
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
    </div>
  );
}

export default function MLSPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">

          {/* Header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl">
              <Image
                src="/mls-logo.svg"
                alt="MLS"
                width={56}
                height={56}
                className="h-12 w-12 object-contain"
                priority
              />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                Major League Soccer
              </h1>
              <p className="text-sm text-muted-foreground">
                MLS 2026 Season · News, Scores &amp; Analysis
              </p>
            </div>
          </div>

          {/* Featured banner */}
          <div className="mb-8 rounded-xl border border-primary/30 bg-primary/5 p-6">
            <div className="mb-2 flex items-center gap-2">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-xs font-black uppercase tracking-widest text-primary">
                Matchweek 15
              </span>
            </div>
            <p className="text-lg font-black text-foreground">
              Inter Miami vs LAFC · Seattle vs Columbus · Montréal vs Atlanta
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Games underway — May 13, 2026
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href="/mls/scores"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                View Scores
              </Link>
              <Link
                href="/mls/standings"
                className="rounded-lg border border-border px-4 py-2 text-sm font-bold text-foreground transition-colors hover:bg-muted"
              >
                Conference Table
              </Link>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main: news */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-1 rounded-full bg-primary" />
                <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                  MLS News
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {MLS_NEWS.map((a) => (
                  <NewsCard key={a.id} article={a} />
                ))}
              </div>
            </div>

            {/* Sidebar: quick links + key dates */}
            <aside className="flex flex-col gap-4">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-black uppercase text-foreground">Quick Links</h3>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Scores",       href: "/mls/scores"    },
                    { label: "Table",        href: "/mls/standings" },
                    { label: "Player Stats", href: "/mls/stats"     },
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
                  <li><span className="font-bold text-foreground">May 13</span> · Matchweek 15 (ongoing)</li>
                  <li><span className="font-bold text-foreground">Jul 2–4</span> · MLS All-Star Weekend</li>
                  <li><span className="font-bold text-foreground">Oct 18</span> · Regular Season Ends</li>
                  <li><span className="font-bold text-foreground">Oct 25</span> · Playoffs Begin</li>
                  <li><span className="font-bold text-foreground">Dec 6</span> · MLS Cup Final</li>
                </ul>
              </div>

              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-foreground">
                  Top Scorers
                </h3>
                <ul className="flex flex-col gap-2">
                  {[
                    { player: "Carlos Vela",     team: "LAFC", goals: 12 },
                    { player: "Cucho Hernández", team: "CLB",  goals: 11 },
                    { player: "Raúl Ruidíaz",    team: "SEA",  goals:  9 },
                  ].map((s, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span>
                        <span className="mr-2 font-black text-primary">{i + 1}.</span>
                        <span className="font-bold text-foreground">{s.player}</span>
                        <span className="ml-1 text-muted-foreground">· {s.team}</span>
                      </span>
                      <span className="font-black text-foreground">{s.goals}</span>
                    </li>
                  ))}
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
