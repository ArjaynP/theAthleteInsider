"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { nbaStandings, nbaPowerRankings, nbaCupGroups, nbaCupWildcards, nbaCupBracket, type TeamStanding, type PowerRanking } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

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

type ViewType = "regular" | "nbacup" | "playoffs";

function SegmentedControl({ value, onChange }: { value: ViewType; onChange: (value: ViewType) => void }) {
  const options = [
    { value: "regular" as ViewType, label: "Regular Season" },
    { value: "nbacup" as ViewType, label: "NBA Cup" },
    { value: "playoffs" as ViewType, label: "Playoff Tree" },
  ];

  return (
    <div className="mb-8 flex justify-center">
      <div className="inline-flex rounded-lg border border-border bg-card p-1">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-md px-6 py-2 text-sm font-bold uppercase tracking-wide transition-all",
              value === option.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function PlayoffBracket() {
  return (
    <div className="rounded-xl border border-border bg-card p-8">
      <div className="text-center">
        <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-2">
          2025-26 NBA Playoffs
        </h3>
        <p className="text-muted-foreground">
          Playoff bracket will be available when postseason begins
        </p>
      </div>
    </div>
  );
}

function NBACupStandings() {
  const eastGroups = ["East A", "East B", "East C"];
  const westGroups = ["West A", "West B", "West C"];

  function GroupStandingsTable({ groupName }: { groupName: string }) {
    const teams = nbaCupGroups.filter((t) => t.group === groupName);
    
    return (
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border bg-primary/5 px-4 py-3">
          <h4 className="text-sm font-black uppercase tracking-tight text-foreground">
            Group {groupName.split(" ")[1]}
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-4 py-2 text-left font-bold uppercase tracking-widest">Team</th>
                <th className="px-4 py-2 text-center font-bold uppercase tracking-widest">W</th>
                <th className="px-4 py-2 text-center font-bold uppercase tracking-widest">L</th>
                <th className="px-4 py-2 text-center font-bold uppercase tracking-widest">PCT</th>
                <th className="px-4 py-2 text-center font-bold uppercase tracking-widest">PD</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, i) => (
                <tr
                  key={team.abbreviation}
                  className={cn(
                    "border-b border-border/50 last:border-0 transition-colors hover:bg-secondary/30",
                    team.qualified && "bg-accent/5"
                  )}
                >
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary text-xs font-black text-foreground">
                        {team.abbreviation.charAt(0)}
                      </div>
                      <span className="font-bold text-foreground">{team.abbreviation}</span>
                      {team.qualified && (
                        <span className="rounded bg-accent px-1.5 py-0.5 text-[10px] font-bold text-accent-foreground">Q</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center font-bold tabular-nums text-foreground">{team.wins}</td>
                  <td className="px-4 py-2 text-center tabular-nums text-muted-foreground">{team.losses}</td>
                  <td className="px-4 py-2 text-center font-bold tabular-nums text-foreground">{team.pct}</td>
                  <td className={cn(
                    "px-4 py-2 text-center font-bold tabular-nums",
                    team.pointDiff > 0 ? "text-accent" : team.pointDiff < 0 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {team.pointDiff > 0 ? `+${team.pointDiff}` : team.pointDiff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  function WildcardStandings() {
    const eastQualified = nbaCupGroups.filter((t) => t.conference === "East" && t.qualified);
    const westQualified = nbaCupGroups.filter((t) => t.conference === "West" && t.qualified);
    const eastWildcard = nbaCupWildcards.find((t) => t.conference === "East");
    const westWildcard = nbaCupWildcards.find((t) => t.conference === "West");

    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {/* East Quarterfinals */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
              Eastern Conference Quarterfinals
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {eastQualified.map((team, i) => (
              <div key={team.abbreviation} className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-muted-foreground">{i + 1}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                    {team.abbreviation.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{team.team}</p>
                    <p className="text-xs text-muted-foreground">Group {team.group.split(" ")[1]} Winner</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{team.wins}-{team.losses}</p>
                  <p className="text-xs text-muted-foreground">+{team.pointDiff} PD</p>
                </div>
              </div>
            ))}
            {eastWildcard && (
              <div className="flex items-center justify-between rounded-lg border border-amber/30 bg-amber/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-amber">4</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                    {eastWildcard.abbreviation.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{eastWildcard.team}</p>
                    <p className="text-xs text-amber font-bold">Wildcard</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{eastWildcard.wins}-{eastWildcard.losses}</p>
                  <p className="text-xs text-muted-foreground">+{eastWildcard.pointDiff} PD</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* West Quarterfinals */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border px-5 py-4">
            <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
              Western Conference Quarterfinals
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {westQualified.map((team, i) => (
              <div key={team.abbreviation} className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-muted-foreground">{i + 1}</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                    {team.abbreviation.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{team.team}</p>
                    <p className="text-xs text-muted-foreground">Group {team.group.split(" ")[1]} Winner</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{team.wins}-{team.losses}</p>
                  <p className="text-xs text-muted-foreground">+{team.pointDiff} PD</p>
                </div>
              </div>
            ))}
            {westWildcard && (
              <div className="flex items-center justify-between rounded-lg border border-amber/30 bg-amber/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-black text-amber">4</span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                    {westWildcard.abbreviation.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{westWildcard.team}</p>
                    <p className="text-xs text-amber font-bold">Wildcard</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-foreground">{westWildcard.wins}-{westWildcard.losses}</p>
                  <p className="text-xs text-muted-foreground">+{westWildcard.pointDiff} PD</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  function NBACupBracketView() {
    return (
      <div className="space-y-8">
        {nbaCupBracket.map((round) => (
          <div key={round.round} className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="border-b border-border px-5 py-4">
              <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
                {round.round}
              </h3>
            </div>
            <div className="p-6">
              <div className="grid gap-4 md:grid-cols-2">
                {round.matchups.map((matchup, i) => (
                  <div key={i} className="rounded-lg border border-border bg-secondary/20 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        {matchup.date}
                      </span>
                      <span className={cn(
                        "rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                        matchup.status === "complete" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                      )}>
                        {matchup.status === "complete" ? "Final" : "Scheduled"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between rounded bg-card px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-secondary text-xs font-black text-foreground">
                            {matchup.home.charAt(0)}
                          </div>
                          <span className="font-bold text-foreground">{matchup.home}</span>
                        </div>
                        {matchup.homeScore !== undefined && (
                          <span className="text-xl font-black text-foreground">{matchup.homeScore}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between rounded bg-card px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 items-center justify-center rounded bg-secondary text-xs font-black text-foreground">
                            {matchup.away.charAt(0)}
                          </div>
                          <span className="font-bold text-foreground">{matchup.away}</span>
                        </div>
                        {matchup.awayScore !== undefined && (
                          <span className="text-xl font-black text-foreground">{matchup.awayScore}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Group Stages */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
          Group Stage
        </h2>
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-foreground">
            Eastern Conference
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {eastGroups.map((group) => (
              <GroupStandingsTable key={group} groupName={group} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-foreground">
            Western Conference
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {westGroups.map((group) => (
              <GroupStandingsTable key={group} groupName={group} />
            ))}
          </div>
        </div>
      </div>

      {/* Qualified Teams / Wildcard */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
          Qualified Teams
        </h2>
        <WildcardStandings />
      </div>

      {/* Bracket */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
          NBA Cup Bracket
        </h2>
        <NBACupBracketView />
      </div>
    </div>
  );
}

export default function NBAStandingsPage() {
  const [view, setView] = useState<ViewType>("regular");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center text-sm font-black text-primary-foreground shadow-md">
                <img src="/nba-logo-1.png" alt="NBA Logo" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                NBA Standings
              </h1>
              <p className="text-sm text-muted-foreground">
                Current NBA conference standings
              </p>
            </div>
          </div>

          {/* Segmented Control */}
          <SegmentedControl value={view} onChange={setView} />

          {/* Regular Season Standings */}
          {view === "regular" && (
            <>
              {/* Standings */}
              <div className="mb-12 grid gap-6 lg:grid-cols-2">
            <StandingsTable
              standings={nbaStandings.filter((s) => s.conference === "East")}
              title="Eastern Conference"
            />
            <StandingsTable
              standings={nbaStandings.filter((s) => s.conference === "West")}
              title="Western Conference"
            />
          </div>

          {/* Divisional Standings */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
              Divisional Standings
            </h2>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* East Divisions */}
              <StandingsTable
                standings={nbaStandings.filter((s) => s.division === "Atlantic")}
                title="Atlantic Division"
              />
              <StandingsTable
                standings={nbaStandings.filter((s) => s.division === "Central")}
                title="Central Division"
              />
              <StandingsTable
                standings={nbaStandings.filter((s) => s.division === "Southeast")}
                title="Southeast Division"
              />
              {/* West Divisions */}
              <StandingsTable
                standings={nbaStandings.filter((s) => s.division === "Pacific")}
                title="Pacific Division"
              />
              <StandingsTable
                standings={nbaStandings.filter((s) => s.division === "Northwest")}
                title="Northwest Division"
              />
              <StandingsTable
                standings={nbaStandings.filter((s) => s.division === "Southwest")}
                title="Southwest Division"
              />
            </div>
          </div>

          {/* Power Rankings */}
          <div className="mb-8">
            <PowerRankings rankings={nbaPowerRankings} />
          </div>
            </>
          )}

          {/* NBA Cup Standings */}
          {view === "nbacup" && <NBACupStandings />}

          {/* Playoff Tree */}
          {view === "playoffs" && <PlayoffBracket />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
