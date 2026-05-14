"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Loader2, TrendingUp } from "lucide-react";
import type { MLSStatCategory } from "@/lib/mls-types";

// ── Stat card ──────────────────────────────────────────────────────────────────

function StatCard({ category }: { category: MLSStatCategory }) {
  const topPlayer = category.leaders[0];
  const others    = category.leaders.slice(1);

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
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-xs font-black text-amber-900 shadow-sm">
            #1
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-black text-foreground">{topPlayer.value}</span>
            <span className="text-xs font-bold uppercase text-muted-foreground">{category.abbreviation}</span>
          </div>
          <p className="font-bold text-foreground">{topPlayer.player}</p>
          <div className="mt-0.5 flex items-center gap-1.5">
            <div className="flex h-4 w-4 items-center justify-center rounded bg-primary/10">
              <span className="text-[8px] font-black text-primary">{topPlayer.team}</span>
            </div>
            <span className="text-xs text-muted-foreground">{topPlayer.team}</span>
          </div>
        </div>
      </div>

      {/* Other leaders */}
      <div className="flex flex-col border-t border-border">
        {others.map((player) => (
          <div
            key={player.rank}
            className="flex items-center justify-between border-b border-border/50 px-4 py-2.5 last:border-0 hover:bg-muted/30"
          >
            <div className="flex items-center gap-3">
              <span className="w-4 text-center text-xs font-black text-muted-foreground">
                {player.rank}
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{player.player}</p>
                <p className="text-[10px] text-muted-foreground">{player.team}</p>
              </div>
            </div>
            <span className="text-sm font-black text-foreground">{player.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function MLSStatsPage() {
  const [categories, setCategories] = useState<MLSStatCategory[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/mls-player-stats");
        if (!res.ok) return;
        const data = await res.json();
        setCategories(data.categories ?? []);
      } catch {
        // leave empty
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">

          {/* Page header */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-7 w-7 text-primary" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                Player Stats
              </h1>
              <p className="text-sm text-muted-foreground">
                Major League Soccer 2026 · Statistical Leaders
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && categories.length === 0 && (
            <div className="rounded-xl border border-border bg-card p-12 text-center text-muted-foreground">
              <p className="text-lg font-bold">No stats available</p>
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {categories.map((cat) => (
                <StatCard key={cat.id} category={cat} />
              ))}
            </div>
          )}

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
