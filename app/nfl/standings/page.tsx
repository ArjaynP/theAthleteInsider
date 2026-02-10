"use client";

import { useState } from "react";
import Image from "next/image";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { nflStandings, nflPowerRankings, type TeamStanding, type PowerRanking } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

type SortKey = "wins" | "losses" | "pct" | "team";

function StandingsTable({
  standings,
  title,
  logoSrc,
}: {
  standings: TeamStanding[];
  title: string;
  logoSrc?: string;
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
        {logoSrc ? (
          <img src={logoSrc} alt={title} width={30} height={30} className="object-contain" />
        ) : null}
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
                  className="flex items-center justify-center gap-1 w-full"
                >
                  W
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                <button
                  type="button"
                  onClick={() => handleSort("losses")}
                  className="flex items-center justify-center gap-1 w-full"
                >
                  L
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                <button
                  type="button"
                  onClick={() => handleSort("pct")}
                  className="flex items-center justify-center gap-1 w-full"
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

function PowerRankings({ rankings }: { rankings: PowerRanking[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
          Power Rankings
        </h3>
      </div>
      <div className="divide-y divide-border">
        {rankings.map((team) => (
          <div
            key={team.abbreviation}
            className="flex items-center gap-4 p-5 transition-colors hover:bg-secondary/30"
          >
            <div className="flex w-12 flex-col items-center">
              <span className="text-2xl font-black text-foreground">{team.rank}</span>
              <div className="flex items-center gap-1">
                {team.trend === "up" && (
                  <TrendingUp className="h-3 w-3 text-accent" />
                )}
                {team.trend === "down" && (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                {team.trend === "same" && (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                )}
                <span className="text-xs text-muted-foreground">{team.lastWeek}</span>
              </div>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-sm font-black text-foreground">
              {team.abbreviation}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline justify-between">
                <h4 className="font-bold text-foreground">{team.team}</h4>
                <span className="text-sm font-bold tabular-nums text-muted-foreground">
                  {team.record}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{team.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function NFLStandingsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary text-sm font-black text-primary-foreground shadow-md">
                <img src="/nfl-logo-2.png" alt="NFL Logo" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                NFL Standings
              </h1>
              <p className="text-sm text-muted-foreground">
                Current NFL Standings, from Conference, Divisional, and Power Rankings of the 2025-26 Regular Season
              </p>
            </div>
          </div>

          {/* Standings */}
          <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
            Conference Standings
          </h2>
          <div className="mb-12 grid gap-6 lg:grid-cols-2">
            <StandingsTable
              standings={nflStandings.filter((s) => s.conference === "AFC")}
              title="AFC"
              logoSrc="/afc-conference.png"
            />
            <StandingsTable
              standings={nflStandings.filter((s) => s.conference === "NFC")}
              title="NFC"
              logoSrc="/nfc-conference.png"
            />
          </div>

          {/* Divisional Standings */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
              Divisional Standings
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* AFC Divisions */}
              <StandingsTable
                standings={nflStandings.filter((s) => s.division === "East" && s.conference === "AFC")}
                title="AFC East"
              />
              <StandingsTable
                standings={nflStandings.filter((s) => s.division === "North" && s.conference === "AFC")}
                title="AFC North"
              />
              <StandingsTable
                standings={nflStandings.filter((s) => s.division === "South" && s.conference === "AFC")}
                title="AFC South"
              />
              <StandingsTable
                standings={nflStandings.filter((s) => s.division === "West" && s.conference === "AFC")}
                title="AFC West"
              />
              {/* NFC Divisions */}
              <StandingsTable
                standings={nflStandings.filter((s) => s.division === "East" && s.conference === "NFC")}
                title="NFC East"
              />
              <StandingsTable
                standings={nflStandings.filter((s) => s.division === "North" && s.conference === "NFC")}
                title="NFC North"
              />
              <StandingsTable
                standings={nflStandings.filter((s) => s.division === "South" && s.conference === "NFC")}
                title="NFC South"
              />
              <StandingsTable
                standings={nflStandings.filter((s) => s.division === "West" && s.conference === "NFC")}
                title="NFC West"
              />
            </div>
          </div>

          {/* Power Rankings */}
          <div className="mb-8">
            <PowerRankings rankings={nflPowerRankings} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
