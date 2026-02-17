"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { nbaStandings, nbaLeagueStandings, nbaCupGroups, nbaCupWildcards, nbaCupBracket, type TeamStanding, type LeagueStanding, type NBACupBracketRound } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";

type SortKey = "wins" | "losses" | "pct" | "team";

function StandingsTable({
  standings,
  title,
  showPlayInBorders = false,
}: {
  standings: TeamStanding[];
  title: string;
  showPlayInBorders?: boolean;
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
                  WIN%
                  <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                GB
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                CONF
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                DIV
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                HOME
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                AWAY
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                L10
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                STREAK
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, i) => {
              const position = i + 1;
              // Determine border class for play-in visual separation
              const borderClass = showPlayInBorders && (position === 6 || position === 10)
                ? "border-b-4 border-primary/50"
                : "border-b border-border/50";
              
              return (
                <tr
                  key={team.abbreviation}
                  className={cn(
                    borderClass,
                    "transition-colors hover:bg-secondary/30"
                  )}
                >
                  <td className="px-5 py-3 text-sm font-bold tabular-nums text-muted-foreground">
                    {position}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                        {team.abbreviation.charAt(0)}
                      </div>
                      <p className="font-bold text-foreground whitespace-nowrap">{team.team}</p>
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
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                    {team.conferenceRecord || "-"}
                  </td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                    {team.divisionRecord || "-"}
                  </td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                    {team.home || "-"}
                  </td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                    {team.away || "-"}
                  </td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                    {team.last10 || "-"}
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function LeagueRankings({ rankings }: { rankings: LeagueStanding[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">
          League Standings
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
                RK
              </th>
              <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
                Team
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                W
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                L
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                WIN%
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                CONF
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                DIV
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                HOME
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                AWAY
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                L10
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                STREAK
              </th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((team) => (
              <tr
                key={team.abbreviation}
                className="border-b border-border/50 transition-colors hover:bg-secondary/30"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-foreground">{team.rank}</span>
                    <div className="flex flex-col items-center">
                      {team.trend === "up" && (
                        <TrendingUp className="h-3 w-3 text-accent" />
                      )}
                      {team.trend === "down" && (
                        <TrendingDown className="h-3 w-3 text-destructive" />
                      )}
                      {team.trend === "same" && (
                        <Minus className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className="text-[10px] text-muted-foreground">{team.lastWeek}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                      {team.abbreviation.charAt(0)}
                    </div>
                    <p className="font-bold text-foreground text-sm whitespace-nowrap">{team.team}</p>
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
                <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                  {team.conferenceRecord || "-"}
                </td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                  {team.divisionRecord || "-"}
                </td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                  {team.home || "-"}
                </td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                  {team.away || "-"}
                </td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-muted-foreground">
                  {team.last10 || "-"}
                </td>
                <td className="px-5 py-3 text-center">
                  {team.streak ? (
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
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type ViewType = "regular" | "nbacup" | "playoffs";

function SegmentedControl({ value, onChange }: { value: ViewType; onChange: (value: ViewType) => void }) {
  const options = [
    { value: "regular" as ViewType, label: "Regular Season" },
    { value: "nbacup" as ViewType, label: "Emirates NBA Cup" },
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
    const eastQuarterfinals = nbaCupBracket.find(r => r.round === "Quarterfinals" && r.conference === "East");
    const westQuarterfinals = nbaCupBracket.find(r => r.round === "Quarterfinals" && r.conference === "West");
    const eastSemifinals = nbaCupBracket.find(r => r.round === "Semifinals" && r.conference === "East");
    const westSemifinals = nbaCupBracket.find(r => r.round === "Semifinals" && r.conference === "West");
    const final = nbaCupBracket.find(r => r.round === "Final");

    const MatchupCard = ({ matchup, date, time }: { matchup: any; date: string; time: string }) => (
      <div className="rounded-lg border-2 border-border bg-card overflow-hidden">
        {/* Date and Time Header */}
        <div className="flex items-center justify-between bg-primary/5 px-3 py-1.5 border-b border-border">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{date}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{time}</span>
        </div>
        
        {/* Teams */}
        <div className="p-2 space-y-1">
          <div className={cn(
            "flex items-center justify-between rounded px-2 py-1.5",
            matchup.team1.winner ? "bg-accent/20 border-2 border-accent" : "bg-secondary/50"
          )}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground w-4">{matchup.team1.seed}</span>
              <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary text-[10px] font-black">
                {matchup.team1.team.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-bold">{matchup.team1.teamFull}</span>
            </div>
            <span className="text-lg font-black">{matchup.team1.score}</span>
          </div>
          <div className={cn(
            "flex items-center justify-between rounded px-2 py-1.5",
            matchup.team2.winner ? "bg-accent/20 border-2 border-accent" : "bg-secondary/50"
          )}>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-muted-foreground w-4">{matchup.team2.seed}</span>
              <div className="flex h-6 w-6 items-center justify-center rounded bg-secondary text-[10px] font-black">
                {matchup.team2.team.substring(0, 2).toUpperCase()}
              </div>
              <span className="text-sm font-bold">{matchup.team2.teamFull}</span>
            </div>
            <span className="text-lg font-black">{matchup.team2.score}</span>
          </div>
        </div>
      </div>
    );

    return (
      <div className="rounded-xl border border-border bg-gradient-to-br from-blue-950/20 to-blue-900/10 p-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-black uppercase tracking-tight text-foreground mb-2">
            Emirates NBA Cup Bracket
          </h2>
          <p className="text-sm text-muted-foreground">2025-26 Season</p>
        </div>

        {/* Tree Bracket Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_300px_1fr]">
          {/* WEST SIDE (Left) */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-tight text-red-400">WEST</h3>
            </div>
            
            <div className="grid gap-8 grid-cols-2">
              {/* West Quarterfinals */}
              <div className="space-y-4">
                <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Quarterfinals
                </h4>
                {westQuarterfinals?.matchups.map((m, i) => (
                  <MatchupCard key={i} matchup={m} date={m.date} time={m.time} />
                ))}
              </div>

              {/* West Semifinals */}
              <div className="space-y-4 flex flex-col justify-center">
                <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Semifinals
                </h4>
                <p className="text-xs text-muted-foreground">Las Vegas, NV</p>
                {westSemifinals?.matchups.map((m, i) => (
                  <MatchupCard key={i} matchup={m} date={m.date} time={m.time} />
                ))}
              </div>
            </div>
          </div>

          {/* CENTER - CHAMPIONSHIP */}
          <div className="flex flex-col items-center justify-center">
            {final && (
              <div className="space-y-4">
                <div className="text-center mb-4">
                  <h3 className="text-xl font-black uppercase tracking-tight text-foreground mb-1">
                    Championship
                  </h3>
                  <p className="text-xs text-muted-foreground">Las Vegas, NV</p>
                </div>
                
                <div className="rounded-xl border-2 border-blue-500/50 bg-gradient-to-br from-blue-950/40 to-purple-950/40 p-6 backdrop-blur-sm">
                  <div className="text-center mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{final.matchups[0].date}</span>
                    <span className="mx-2 text-muted-foreground">•</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{final.matchups[0].time}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3",
                      final.matchups[0].team1.winner ? "bg-accent/30 border-2 border-accent" : "bg-secondary/50"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-black">
                          {final.matchups[0].team1.team}
                        </div>
                        <span className="text-base font-bold">{final.matchups[0].team1.teamFull}</span>
                      </div>
                      <span className="text-3xl font-black">{final.matchups[0].team1.score}</span>
                    </div>
                    
                    <div className={cn(
                      "flex items-center justify-between rounded-lg px-4 py-3",
                      final.matchups[0].team2.winner ? "bg-accent/30 border-2 border-accent" : "bg-secondary/50"
                    )}>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-sm font-black">
                          {final.matchups[0].team2.team}
                        </div>
                        <span className="text-base font-bold">{final.matchups[0].team2.teamFull}</span>
                      </div>
                      <span className="text-3xl font-black">{final.matchups[0].team2.score}</span>
                    </div>
                  </div>
                </div>

                {/* Champion Trophy */}
                <div className="mt-6 text-center">
                  <div className="inline-flex flex-col items-center">
                    <div className="mb-2">
                      <img src="/nba-cup.png" alt="NBA Cup Trophy" className="h-24 w-24 object-contain" />
                    </div>
                    <div className="text-sm font-black uppercase tracking-wider text-accent">
                      {final.matchups[0].team1.winner ? final.matchups[0].team1.teamFull : final.matchups[0].team2.teamFull}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Emirates NBA Cup Champions</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EAST SIDE (Right) */}
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-black uppercase tracking-tight text-blue-400">EAST</h3>
            </div>
            
            <div className="grid gap-8 grid-cols-2">
              {/* East Semifinals */}
              <div className="space-y-4 flex flex-col justify-center">
                <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Semifinals
                </h4>
                <p className="text-xs text-muted-foreground">Las Vegas, NV</p>
                {eastSemifinals?.matchups.map((m, i) => (
                  <MatchupCard key={i} matchup={m} date={m.date} time={m.time} />
                ))}
              </div>

              {/* East Quarterfinals */}
              <div className="space-y-4">
                <h4 className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
                  Quarterfinals
                </h4>
                {eastQuarterfinals?.matchups.map((m, i) => (
                  <MatchupCard key={i} matchup={m} date={m.date} time={m.time} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Bracket */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
          Emirates NBA Cup Bracket
        </h2>
        <NBACupBracketView />
      </div>

      {/* Group Stages */}
      <div>
        <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
          Group Stage
        </h2>
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-foreground">
            East
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {eastGroups.map((group) => (
              <GroupStandingsTable key={group} groupName={group} />
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-lg font-black uppercase tracking-tight text-foreground">
            West
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

          {/* Standings News & Insights */}
          {view === "regular" && (
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Championship Odds */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Championship Odds
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">BOS</span>
                    <span className="text-sm font-bold text-accent">+280</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-foreground">LAL</span>
                    <span className="text-sm font-bold text-accent">+350</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">DEN</span>
                    <span className="text-sm text-muted-foreground">+450</span>
                  </div>
                </div>
              </div>

              {/* Power Rankings Top 5 */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Power Rankings
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">1.</span>
                    <span className="text-sm font-bold text-foreground">Boston Celtics</span>
                    <TrendingUp className="ml-auto h-3 w-3 text-accent" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-foreground">2.</span>
                    <span className="text-sm font-bold text-foreground">LA Lakers</span>
                    <TrendingUp className="ml-auto h-3 w-3 text-accent" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">3.</span>
                    <span className="text-sm text-muted-foreground">New York Knicks</span>
                    <TrendingDown className="ml-auto h-3 w-3 text-destructive" />
                  </div>
                </div>
              </div>

              {/* Biggest Surprise */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Biggest Surprise
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-black text-foreground">
                    LAL
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">LA Lakers</p>
                    <p className="text-xs text-muted-foreground">38-15 • 1st West</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  LeBron and AD leading a 7-game win streak, exceeding preseason expectations.
                </p>
              </div>

              {/* Biggest Upset */}
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-3 text-xs font-black uppercase tracking-widest text-muted-foreground">
                  Biggest Disappointment
                </h3>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-sm font-black text-foreground">
                    PHX
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Phoenix Suns</p>
                    <p className="text-xs text-muted-foreground">27-26 • 10th West</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Big 3 of Durant, Booker, and Beal struggling to find chemistry and consistency.
                </p>
              </div>
            </div>
          )}

          {/* Regular Season Standings */}
          {view === "regular" && (
            <>
              {/* Standings */}
              <div className="mb-4 grid gap-6 lg:grid-cols-2">
            <StandingsTable
              standings={nbaStandings.filter((s) => s.conference === "East")}
              title="Eastern Conference"
              showPlayInBorders={true}
            />
            <StandingsTable
              standings={nbaStandings.filter((s) => s.conference === "West")}
              title="Western Conference"
              showPlayInBorders={true}
            />
          </div>
          
          {/* Play-In Legend */}
          <div className="mb-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-primary/50" />
              <span>1-6: Guaranteed Playoff Spots | 7-10: Play-In Tournament | 11-15: Eliminated</span>
            </div>
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

          {/* League Rankings */}
          <div className="mb-8">
            <LeagueRankings rankings={nbaLeagueStandings} />
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
