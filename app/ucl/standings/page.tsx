"use client";

import React, { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { UCLTeamStanding } from "@/lib/ucl-types";

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

const SECTION_DIVIDERS: Record<number, { label: string; color: string }> = {
  1:  { label: "Automatic Round of 16", color: "bg-primary" },
  9:  { label: "Knockout Phase Play-Off Places (Seeded)", color: "bg-amber-500" },
  17: { label: "Knockout Phase Play-Off Places (Unseeded)", color: "bg-orange-500" },
  25: { label: "Eliminated", color: "bg-destructive/70" },
};

function sectionColor(rank: number) {
  if (rank <= 8) return "border-l-primary";
  if (rank <= 16) return "border-l-amber-500";
  if (rank <= 24) return "border-l-orange-500";
  return "border-l-destructive/50";
}

function StandingsTable({ teams, logos }: { teams: UCLTeamStanding[]; logos: Record<string, string | null> }) {
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
          {teams.map((team) => {
            return (
              <React.Fragment key={team.abbreviation}>
                <tr
                  className={cn(
                    "border-b border-border/50 transition-colors hover:bg-muted/40 border-l-2",
                    sectionColor(team.rank)
                  )}
                >
                  <td className="px-4 py-3 text-center font-bold tabular-nums text-muted-foreground">
                    {team.rank}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded bg-muted">
                        {logos[team.team] ? (
                          <Image src={logos[team.team]!} alt={team.team} width={28} height={28} className="object-contain" />
                        ) : (
                          <span className="text-[9px] font-black text-primary">{team.abbreviation}</span>
                        )}
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
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function UCLStandingsPage() {
  const [standings, setStandings] = useState<UCLTeamStanding[]>([]);
  const [logos, setLogos] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStandings() {
      try {
        const res = await fetch("/api/ucl-standings", { cache: "no-store" });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.details || data?.error || "Failed to fetch standings");

        // Find the "total" standings block with all 36 teams
        const totalBlock = (data.standings as any[]).find(
          (s: any) => s.type === "total"
        );
        const group = totalBlock?.groups?.[0];
        const entries: any[] = group?.standings ?? [];

        const mapped: UCLTeamStanding[] = entries.map((e: any) => ({
          rank: e.rank,
          team: e.competitor.name,
          abbreviation: e.competitor.abbreviation,
          played: e.played,
          won: e.win,
          drawn: e.draw,
          lost: e.loss,
          goalsFor: e.goals_for,
          goalsAgainst: e.goals_against,
          goalDifference: e.goals_diff,
          points: e.points,
          form: e.competitor.form ? Array.from(e.competitor.form as string) : [],
        }));

        setStandings(mapped);

        // Fetch logos for all teams
        const names = mapped.map((t) => t.team);
        const logoRes = await fetch("/api/ucl-logos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ names }),
        });
        if (logoRes.ok) {
          const logoData = await logoRes.json();
          setLogos(logoData.logos ?? {});
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch standings");
      } finally {
        setLoading(false);
      }
    }
    fetchStandings();
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
              <span className="h-3 w-1 rounded bg-amber-500" />
              Ranks 9–16: Knockout Play-Off (Seeded)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-1 rounded bg-orange-500" />
              Ranks 17–24: Knockout Play-Off (Unseeded)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-1 rounded bg-destructive/50" />
              Ranks 25–36: Eliminated
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-border bg-card p-8 text-center">
              <p className="font-bold text-foreground">Failed to load standings</p>
              <p className="mt-1 text-sm text-muted-foreground">{error}</p>
            </div>
          ) : (
            <StandingsTable teams={standings} logos={logos} />
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
