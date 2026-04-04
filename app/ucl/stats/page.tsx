"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { Loader2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UCLStatCategory } from "@/lib/ucl-types";
import { uclPlayerStats, UCL_ABBREV_TO_NAME } from "@/lib/ucl-data";

// ── Stat card (same pattern as NBA / MLB stats pages) ─────────────────────────

function StatCard({ category, logos }: { category: UCLStatCategory; logos: Record<string, string | null> }) {
  const topPlayer = category.leaders[0];
  const others = category.leaders.slice(1);

  if (!topPlayer) return null;

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-black uppercase tracking-tight text-foreground">{category.label}</h3>
        <div className="rounded bg-accent/10 px-2 py-1 text-xs font-bold text-accent">
          {category.abbreviation}
        </div>
      </div>

      {/* Top player */}
      <div className="flex bg-gradient-to-b from-card to-background p-6">
        <div className="relative mr-4 h-16 w-16 shrink-0">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
            {topPlayer.player.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber text-xs font-black text-amber-900 shadow-sm">
            #1
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">{topPlayer.value}</span>
            <span className="text-xs font-bold uppercase text-muted-foreground">{category.abbreviation}</span>
          </div>
          <p className="font-bold text-foreground">{topPlayer.player}</p>
          <div className="flex items-center gap-1.5 mt-0.5">
            {(() => {
              const fullName = UCL_ABBREV_TO_NAME[topPlayer.team] ?? topPlayer.team;
              const logo = logos[fullName];
              return logo ? (
                <Image src={logo} alt={fullName} width={16} height={16} className="h-4 w-4 object-contain" />
              ) : null;
            })()}
            <p className="text-xs font-bold text-muted-foreground">{topPlayer.team}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard rows */}
      <div className="flex-1 px-2 pb-2">
        <table className="w-full text-sm">
          <tbody>
            {others.map((stat) => (
              <tr key={stat.rank} className="group border-b border-border/40 last:border-0 hover:bg-muted/50">
                <td className="w-8 p-3 text-center text-xs font-bold text-muted-foreground">{stat.rank}</td>
                <td className="p-3">
                  <div className="font-bold text-foreground">{stat.player}</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {(() => {
                      const fullName = UCL_ABBREV_TO_NAME[stat.team] ?? stat.team;
                      const logo = logos[fullName];
                      return logo ? (
                        <Image src={logo} alt={fullName} width={14} height={14} className="h-3.5 w-3.5 object-contain" />
                      ) : null;
                    })()}
                    <div className="text-[10px] text-muted-foreground">{stat.team}</div>
                  </div>
                </td>
                <td className="p-3 text-right font-black tabular-nums text-foreground transition-colors group-hover:text-primary">
                  {stat.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function UCLStatsPage() {
  // TODO: Replace with API fetch when provider is integrated.
  // Pattern: fetch("/api/ucl-leaders") returning { categories: UCLStatCategory[] }
  const [categories, setCategories] = useState<UCLStatCategory[]>([]);
  const [logos, setLogos] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(async () => {
      setCategories(uclPlayerStats);
      setLoading(false);
      // Fetch logos for all teams referenced in stat leaders
      const abbrevs = [
        ...new Set(uclPlayerStats.flatMap((cat) => cat.leaders.map((l) => l.team))),
      ];
      const names = abbrevs.map((a) => UCL_ABBREV_TO_NAME[a] ?? a);
      try {
        const res = await fetch("/api/ucl-logos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ names }),
        });
        if (res.ok) {
          const data = await res.json();
          setLogos(data.logos ?? {});
        }
      } catch {
        // logos remain empty; team abbreviations shown as fallback
      }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

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
                UCL Player Stats
              </h1>
              <p className="text-sm text-muted-foreground">
                UEFA Champions League 2025–26 · League leaders
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <StatCard key={cat.id} category={cat} logos={logos} />
              ))}
            </div>
          )}

          <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            <TrendingUp className="mx-auto mb-4 h-8 w-8 text-primary opacity-50" />
            <h3 className="mb-2 text-lg font-bold text-foreground">More Stats Coming Soon</h3>
            <p className="text-sm">
              Expected goals (xG), progressive passes, defensive actions, and per-90 metrics will be
              available once the UEFA / football data API is connected.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
