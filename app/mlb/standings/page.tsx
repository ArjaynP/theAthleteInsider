"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { mlbStandings, type TeamStanding } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";

type SortKey = "wins" | "losses" | "pct" | "team";

function StandingsTable({
  standings,
  title,
}: {
  standings: TeamStanding[];
  title: string;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("wins");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = [...standings].sort((a, b) => {
    let cmp = 0;
    if (sortKey === "team") cmp = a.team.localeCompare(b.team);
    else if (sortKey === "pct")
      cmp = Number.parseFloat(a.pct) - Number.parseFloat(b.pct);
    else cmp = a[sortKey] - b[sortKey];
    return sortAsc ? cmp : -cmp;
  });

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
          {title}
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
                #
              </th>
              <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
                <button
                  type="button"
                  onClick={() => handleSort("team")}
                  className="flex items-center gap-1"
                >
                  Team
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                <button
                  type="button"
                  onClick={() => handleSort("wins")}
                  className="flex items-center gap-1"
                >
                  W
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                <button
                  type="button"
                  onClick={() => handleSort("losses")}
                  className="flex items-center gap-1"
                >
                  L
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                <button
                  type="button"
                  onClick={() => handleSort("pct")}
                  className="flex items-center gap-1"
                >
                  PCT
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                GB
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                Streak
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, i) => (
              <tr
                key={team.abbreviation}
                className="border-b border-border/50 transition-colors hover:bg-secondary/30"
              >
                <td className="px-5 py-3 text-sm font-bold tabular-nums text-muted-foreground">
                  {i + 1}
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                      {team.abbreviation.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{team.team}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {team.conference}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">
                  {team.wins}
                </td>
                <td className="px-5 py-3 text-center tabular-nums text-muted-foreground">
                  {team.losses}
                </td>
                <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">
                  {team.pct}
                </td>
                <td className="px-5 py-3 text-center tabular-nums text-muted-foreground">
                  {team.gb}
                </td>
                <td className="px-5 py-3 text-center">
                  <span
                    className={cn(
                      "rounded px-2 py-0.5 text-xs font-bold",
                      team.streak.startsWith("W")
                        ? "bg-accent/20 text-accent"
                        : "bg-destructive/20 text-destructive"
                    )}
                  >
                    {team.streak}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MLBStandingsPage() {
    return (
        <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
            <div className="mx-auto max-w-7xl px-4 py-8">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center bg-primary text-sm font-black text-primary-foreground shadow-md">
                    <img src="/mlb-logo.png" alt="MLB Logo" />
                </div>
                <div className="h-10 w-1.5 rounded-full bg-primary" />
                <div>
                <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                    MLB Standings
                </h1>
                <p className="text-sm text-muted-foreground">
                    Current MLB standings
                </p>
                </div>
            </div>

            {/* Standings */}
            <div className="mb-12 grid gap-6 lg:grid-cols-2">
                <StandingsTable
                standings={mlbStandings.filter((s) => s.conference === "AL")}
                title="American League"
                />
                <StandingsTable
                standings={mlbStandings.filter((s) => s.conference === "NL")}
                title="National League"
                />
            </div>

            {/* Divisional Standings */}
            <div className="mb-8">
                <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
                Divisional Standings
                </h2>
                <div className="grid gap-6 lg:grid-cols-2">
                {/* AL Divisions */}
                <StandingsTable
                    standings={mlbStandings.filter((s) => s.division === "East" && s.conference === "AL")}
                    title="AL East"
                />
                <StandingsTable
                    standings={mlbStandings.filter((s) => s.division === "Central" && s.conference === "AL")}
                    title="AL Central"
                />
                <StandingsTable
                    standings={mlbStandings.filter((s) => s.division === "West" && s.conference === "AL")}
                    title="AL West"
                />
                {/* NL Divisions */}
                <StandingsTable
                    standings={mlbStandings.filter((s) => s.division === "East" && s.conference === "NL")}
                    title="NL East"
                />
                <StandingsTable
                    standings={mlbStandings.filter((s) => s.division === "Central" && s.conference === "NL")}
                    title="NL Central"
                />
                <StandingsTable
                    standings={mlbStandings.filter((s) => s.division === "West" && s.conference === "NL")}
                    title="NL West"
                />
                </div>
            </div>
            </div>
        </main>
        <SiteFooter />
        </div>
    );
}
