"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { Loader2, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UCLTeamStanding } from "@/lib/ucl-types";
import { uclStandings } from "@/lib/ucl-data";

const FORM_COLOR: Record<string, string> = {
  W: "bg-green-600 text-white",
  D: "bg-muted text-muted-foreground",
  L: "bg-destructive/20 text-destructive",
};

function FormPip({ result }: { result: string }) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 items-center justify-center rounded-sm text-[8px] font-black",
        FORM_COLOR[result] ?? "bg-muted"
      )}
    >
      {result}
    </span>
  );
}

function StandingsTable({ teams }: { teams: UCLTeamStanding[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-4 py-3 text-left font-bold uppercase tracking-widest">Rank</th>
            <th className="px-4 py-3 text-left font-bold uppercase tracking-widest">Team</th>
            <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">P</th>
            <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">W</th>
            <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">D</th>
            <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">L</th>
            <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">GF</th>
            <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">GA</th>
            <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">GD</th>
            <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">Pts</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">Form</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, idx) => {
            const autoQualify = idx < 8;
            const playoff = idx >= 8 && idx < 16;

            return (
              <tr
                key={team.abbreviation}
                className={cn(
                  "border-b border-border/50 transition-colors hover:bg-muted/40",
                  autoQualify && "border-l-2 border-l-primary",
                  playoff && "border-l-2 border-l-amber"
                )}
              >
                <td className="px-4 py-3 text-center font-bold tabular-nums text-muted-foreground">
                  {team.rank}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded bg-primary/10 text-[9px] font-black text-primary">
                      {team.abbreviation}
                    </div>
                    <span className="font-bold text-foreground">{team.team}</span>
                  </div>
                </td>
                <td className="px-3 py-3 text-center tabular-nums text-foreground">{team.played}</td>
                <td className="px-3 py-3 text-center tabular-nums text-foreground">{team.won}</td>
                <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">{team.drawn}</td>
                <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">{team.lost}</td>
                <td className="px-3 py-3 text-center tabular-nums text-foreground">{team.goalsFor}</td>
                <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">{team.goalsAgainst}</td>
                <td className={cn("px-3 py-3 text-center tabular-nums font-bold",
                  team.goalDifference > 0 ? "text-accent" : team.goalDifference < 0 ? "text-destructive" : "text-muted-foreground"
                )}>
                  {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                </td>
                <td className="px-3 py-3 text-center font-black tabular-nums text-foreground">{team.points}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-0.5">
                    {team.form.map((r, i) => (
                      <FormPip key={i} result={r} />
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function UCLStandingsPage() {
  // TODO: Replace with API fetch when provider is integrated.
  // Pattern: fetch("/api/ucl-standings") returning { standings: UCLTeamStanding[] }
  const [standings, setStandings] = useState<UCLTeamStanding[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStandings(uclStandings);
      setLoading(false);
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
                UCL Standings
              </h1>
              <p className="text-sm text-muted-foreground">
                UEFA Champions League 2025–26 · League Phase
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-1 rounded bg-primary" />
              Ranks 1–8: Automatic Round of 16
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-1 rounded bg-amber" />
              Ranks 9–16: Knockout Playoff Round
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-1 rounded bg-destructive/50" />
              Ranks 17–36: Eliminated
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <StandingsTable teams={standings} />
          )}

          <div className="mt-8 rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
            <TrendingUp className="mx-auto mb-3 h-7 w-7 text-primary opacity-50" />
            <p className="font-bold text-foreground">Full 36-Team League Phase Coming Soon</p>
            <p className="mt-1 text-sm">
              Live standings powered by UEFA API integration will display all 36 clubs once connected.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
