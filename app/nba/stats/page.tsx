"use client";

import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { nbaPlayerStats, type StatCategory } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { Medal, Trophy, TrendingUp } from "lucide-react";

function StatCard({ category }: { category: StatCategory }) {
  const topPlayer = category.leaders[0];
  const others = category.leaders.slice(1);

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-black uppercase tracking-tight text-foreground">
          {category.label}
        </h3>
        <div className="rounded bg-accent/10 px-2 py-1 text-xs font-bold text-accent">
          {category.abbreviation}
        </div>
      </div>

      {/* Top Player */}
      <div className="flex bg-gradient-to-b from-card to-background p-6">
        <div className="relative mr-4 h-16 w-16 flex-shrink-0">
          <div className="flex h-full w-full items-center justify-center rounded-full bg-primary/20 text-xl font-bold text-primary">
            {topPlayer.player.charAt(0)}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber text-xs font-bold text-amber-900 shadow-sm">
            #1
          </div>
        </div>
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex items-baseline justify-between">
             <span className="text-3xl font-black text-foreground">{topPlayer.value}</span>
             <span className="text-xs font-bold uppercase text-muted-foreground">{category.abbreviation}</span>
          </div>
          <p className="font-bold text-foreground">{topPlayer.player}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold text-foreground">
              {topPlayer.team}
            </span>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="flex-1 px-2 pb-2">
        <table className="w-full text-sm">
          <tbody>
            {others.map((stat) => (
              <tr 
                key={stat.rank} 
                className="group border-b border-border/40 last:border-0 hover:bg-muted/50"
              >
                <td className="w-8 p-3 text-center text-xs font-bold text-muted-foreground">
                  {stat.rank}
                </td>
                <td className="p-3">
                  <div className="font-bold text-foreground">{stat.player}</div>
                  <div className="text-[10px] text-muted-foreground">{stat.team}</div>
                </td>
                <td className="p-3 text-right font-black tabular-nums text-foreground group-hover:text-primary transition-colors">
                  {stat.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Footer link */}
      <div className="border-t border-border bg-muted/20 p-3 text-center">
        <button className="text-xs font-bold uppercase tracking-wide text-muted-foreground transition-colors hover:text-primary">
          View Full Rankings
        </button>
      </div>
    </div>
  );
}

export default function NBAStatsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 rounded-full bg-primary" />
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                  NBA Player Stats
                </h1>
                <p className="text-sm text-muted-foreground">
                  Current season league leaders
                </p>
              </div>
            </div>
          </div>

          {/* Stats Sections */}
          <div className="space-y-16">
            {[
              { title: "Scoring", ids: ["ppg", "3pm", "fg_pct", "3p_pct", "ft_pct"] },
              { title: "Playmaking", ids: ["apg", "tov", "ast_to"] },
              { title: "Defense", ids: ["bpg", "spg", "pf"] },
              { title: "Rebounding", ids: ["rpg", "oreb", "dreb"] },
              { title: "Playing Time", ids: ["mpg", "gp"] },
            ].map((section) => (
              <section key={section.title}>
                <div className="mb-6 flex items-center gap-2 border-b border-border pb-2">
                  <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                    {section.title}
                  </h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {section.ids.map((id) => {
                    const category = nbaPlayerStats.find((s) => s.id === id);
                    if (!category) return null;
                    return <StatCard key={category.id} category={category} />;
                  })}
                </div>
              </section>
            ))}
          </div>
          
          <div className="mt-12 rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
            <TrendingUp className="mx-auto mb-4 h-8 w-8 text-primary opacity-50" />
            <h3 className="mb-2 text-lg font-bold text-foreground">More Stats Coming Soon</h3>
            <p>Advanced metrics, team stats, and historical data are currently being integrated.</p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
