"use client";

import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MLSTeamStanding } from "@/lib/mls-types";

// ── Qualification colour coding (top 9 per conference → MLS Cup Playoffs) ────

function rowAccentClass(rank: number) {
  if (rank === 1)  return "border-l-amber-400";          // Supporters' Shield contender
  if (rank <= 7)   return "border-l-primary";            // Direct playoff (bye round)
  if (rank <= 9)   return "border-l-orange-400";         // Play-in round
  return "border-l-transparent";                         // Eliminated
}

// ── Form pill ────────────────────────────────────────────────────────────────

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

// ── Standings table ───────────────────────────────────────────────────────────

function StandingsTable({ teams }: { teams: MLSTeamStanding[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs text-muted-foreground">
            <th className="px-4 py-3 text-left font-bold uppercase tracking-widest">#</th>
            <th className="px-4 py-3 text-left font-bold uppercase tracking-widest">Team</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">P</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">W</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">D</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">L</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">GF</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">GA</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">GD</th>
            <th className="px-4 py-3 text-center font-bold uppercase tracking-widest">Pts</th>
            <th className="hidden px-4 py-3 text-center font-bold uppercase tracking-widest md:table-cell">Form</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team, idx) => {
            const prevRank = idx > 0 ? teams[idx - 1].rank : null;
            const showDivider =
              (team.rank === 8 && prevRank !== null && prevRank < 8) ||
              (team.rank === 10 && prevRank !== null && prevRank < 10);

            return (
              <>
                {showDivider && (
                  <tr key={`div-${team.rank}`}>
                    <td colSpan={11} className="px-4 py-1">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                          {team.rank === 8 ? "▼ Play-In Round" : "▼ Eliminated"}
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>
                    </td>
                  </tr>
                )}
                <tr
                  key={team.abbreviation}
                  className={cn(
                    "border-b border-border/50 border-l-2 transition-colors hover:bg-muted/30",
                    rowAccentClass(team.rank)
                  )}
                >
                  <td className="px-4 py-3 font-black text-muted-foreground">{team.rank}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-primary/10">
                        <span className="text-[9px] font-black text-primary">{team.abbreviation}</span>
                      </div>
                      <span className="font-bold text-foreground">{team.team}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{team.played}</td>
                  <td className="px-4 py-3 text-center font-bold text-foreground">{team.won}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{team.drawn}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{team.lost}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{team.goalsFor}</td>
                  <td className="px-4 py-3 text-center text-muted-foreground">{team.goalsAgainst}</td>
                  <td className={cn("px-4 py-3 text-center font-bold", team.goalDifference > 0 ? "text-green-500" : team.goalDifference < 0 ? "text-destructive" : "text-muted-foreground")}>
                    {team.goalDifference > 0 ? `+${team.goalDifference}` : team.goalDifference}
                  </td>
                  <td className="px-4 py-3 text-center text-xl font-black text-foreground">{team.points}</td>
                  <td className="hidden px-4 py-3 md:table-cell">
                    <div className="flex items-center justify-center gap-0.5">
                      {team.form.map((r, i) => <FormPip key={i} result={r} />)}
                    </div>
                  </td>
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ── page ──────────────────────────────────────────────────────────────────────

export default function MLSStandingsPage() {
  const [eastern, setEastern] = useState<MLSTeamStanding[]>([]);
  const [western, setWestern] = useState<MLSTeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"eastern" | "western">("eastern");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/mls-standings");
        if (!res.ok) return;
        const data = await res.json();
        setEastern(data.eastern ?? []);
        setWestern(data.western ?? []);
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
              <span className="text-base font-black text-primary">MLS</span>
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                MLS Table
              </h1>
              <p className="text-sm text-muted-foreground">
                Major League Soccer 2026 · Conference Standings
              </p>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-6 flex flex-wrap gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-amber-400" />
              Supporters&apos; Shield Leader
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-primary" />
              Playoff (Round 1 Bye)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-sm bg-orange-400" />
              Play-In Round
            </span>
          </div>

          {/* Conference tabs */}
          <div className="mb-6 flex gap-2">
            {(["eastern", "western"] as const).map((conf) => (
              <button
                key={conf}
                onClick={() => setActiveTab(conf)}
                className={cn(
                  "rounded-lg px-5 py-2 text-sm font-black uppercase tracking-wide transition-all",
                  activeTab === conf
                    ? "bg-primary text-primary-foreground shadow"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {conf === "eastern" ? "Eastern" : "Western"} Conference
              </button>
            ))}
          </div>

          {loading && (
            <div className="flex min-h-[300px] items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!loading && (
            <StandingsTable teams={activeTab === "eastern" ? eastern : western} />
          )}

        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
