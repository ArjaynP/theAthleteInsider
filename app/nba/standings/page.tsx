"use client";

import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  nbaCupGroups,
  nbaCupWildcards,
  nbaCupBracket,
  type TeamStanding,
  type LeagueStanding,
  type NBACupBracketRound,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowUpDown, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { TeamBadge } from "@/components/team-badge";

type ApiStat = {
  type?: string;
  name?: string;
  value?: number;
  displayValue?: string;
  summary?: string;
};

type ApiStanding = {
  team: {
    displayName: string;
    abbreviation: string;
  };
  stats: ApiStat[];
};

const DIVISION_BY_TEAM: Record<string, string> = {
  BOS: "Atlantic",
  BKN: "Atlantic",
  NYK: "Atlantic",
  PHI: "Atlantic",
  TOR: "Atlantic",
  CHI: "Central",
  CLE: "Central",
  DET: "Central",
  IND: "Central",
  MIL: "Central",
  ATL: "Southeast",
  CHA: "Southeast",
  MIA: "Southeast",
  ORL: "Southeast",
  WAS: "Southeast",
  DAL: "Southwest",
  HOU: "Southwest",
  MEM: "Southwest",
  NOP: "Southwest",
  SAS: "Southwest",
  DEN: "Northwest",
  MIN: "Northwest",
  OKC: "Northwest",
  POR: "Northwest",
  UTA: "Northwest",
  GSW: "Pacific",
  LAC: "Pacific",
  LAL: "Pacific",
  PHX: "Pacific",
  SAC: "Pacific",
};

const EAST_TEAMS = new Set([
  "ATL", "BOS", "BKN", "CHA", "CHI", "CLE", "DET", "IND",
  "MIA", "MIL", "NYK", "ORL", "PHI", "TOR", "WAS",
]);

function normalizeAbbreviation(value: string) {
  const normalized = value.toUpperCase();
  const aliasMap: Record<string, string> = {
    GS: "GSW",
    NY: "NYK",
    NO: "NOP",
    SA: "SAS",
    UTAH: "UTA",
    WSH: "WAS",
  };
  return aliasMap[normalized] ?? normalized;
}

function statDisplay(stats: ApiStat[], type: string, fallback = "-") {
  return stats.find((s) => s.type === type)?.displayValue ?? fallback;
}

function statValue(stats: ApiStat[], type: string, fallback = 0) {
  return stats.find((s) => s.type === type)?.value ?? fallback;
}

function toRecordPair(stats: ApiStat[], type: string) {
  return stats.find((s) => s.type === type)?.summary ?? "-";
}

function deriveConference(abbreviation: string): "East" | "West" {
  return EAST_TEAMS.has(abbreviation) ? "East" : "West";
}

function buildTeamStanding(entry: ApiStanding): TeamStanding {
  const abbreviation = normalizeAbbreviation(entry.team.abbreviation);
  const conference = deriveConference(abbreviation);
  const wins = Math.round(statValue(entry.stats, "wins"));
  const losses = Math.round(statValue(entry.stats, "losses"));
  const seed = Math.round(statValue(entry.stats, "playoffseed", 99));

  return {
    rank: seed,
    team: entry.team.displayName,
    abbreviation,
    wins,
    losses,
    pct: statDisplay(entry.stats, "winpercent", ".000"),
    gb: statDisplay(entry.stats, "gamesbehind", "-"),
    streak: statDisplay(entry.stats, "streak", "-"),
    conference,
    division: DIVISION_BY_TEAM[abbreviation] ?? "-",
    league: "NBA",
    home: toRecordPair(entry.stats, "home"),
    away: toRecordPair(entry.stats, "road"),
    last10: toRecordPair(entry.stats, "lasttengames"),
    conferenceRecord: toRecordPair(entry.stats, "conference"),
    divisionRecord: toRecordPair(entry.stats, "division"),
  };
}

function buildLeagueStanding(team: TeamStanding, rank: number): LeagueStanding {
  return {
    rank,
    team: team.team,
    abbreviation: team.abbreviation,
    record: `${team.wins}-${team.losses}`,
    lastWeek: rank,
    trend: "same",
    summary: "Live NBA API standings",
    league: "NBA",
    wins: team.wins,
    losses: team.losses,
    pct: team.pct,
    gb: team.gb,
    streak: team.streak,
    conference: team.conference,
    division: team.division,
    home: team.home,
    away: team.away,
    last10: team.last10,
    conferenceRecord: team.conferenceRecord,
    divisionRecord: team.divisionRecord,
  };
}

type SortKey = "wins" | "losses" | "pct" | "team";
type ViewType = "regular" | "nbacup";

const teamAbbreviationMap = new Map(nbaCupGroups.map((t) => [t.team, t.abbreviation]));

function getAbbreviation(name: string) {
  return teamAbbreviationMap.get(name) ?? name.slice(0, 3).toUpperCase();
}

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
    else if (sortKey === "pct") cmp = Number.parseFloat(a.pct) - Number.parseFloat(b.pct);
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
        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">#</th>
              <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
                <button type="button" onClick={() => handleSort("team")} className="flex items-center gap-1">
                  Team <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                <button type="button" onClick={() => handleSort("wins")} className="flex items-center justify-center gap-1 w-full">
                  W <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                <button type="button" onClick={() => handleSort("losses")} className="flex items-center justify-center gap-1 w-full">
                  L <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
                <button type="button" onClick={() => handleSort("pct")} className="flex items-center justify-center gap-1 w-full">
                  WIN% <ArrowUpDown className="h-3 w-3" />
                </button>
              </th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">GB</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">CONF</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">DIV</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">HOME</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">AWAY</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">L10</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">STREAK</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((team, i) => {
              const position = i + 1;
              const borderClass =
                showPlayInBorders && (position === 6 || position === 10)
                  ? "border-b-4 border-primary/50"
                  : "border-b border-border/50";

              return (
                <tr key={team.abbreviation} className={cn(borderClass, "transition-colors hover:bg-secondary/30")}>
                  <td className="px-5 py-3 text-sm font-bold tabular-nums text-muted-foreground">{position}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <TeamBadge abbreviation={team.abbreviation} league="NBA" size="md" />
                      <p className="font-bold text-foreground whitespace-nowrap">{team.team}</p>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">{team.wins}</td>
                  <td className="px-5 py-3 text-center tabular-nums text-foreground">{team.losses}</td>
                  <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">{team.pct}</td>
                  <td className="px-5 py-3 text-center tabular-nums text-foreground">{team.gb}</td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground">{team.conferenceRecord || "-"}</td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground whitespace-nowrap">{team.divisionRecord || "-"}</td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground">{team.home || "-"}</td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground">{team.away || "-"}</td>
                  <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground whitespace-nowrap">{team.last10 || "-"}</td>
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
        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">League Standings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">RK</th>
              <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">Team</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">W</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">L</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">WIN%</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">CONF</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">DIV</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">HOME</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">AWAY</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">L10</th>
              <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">STREAK</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((team) => (
              <tr key={team.abbreviation} className="border-b border-border/50 transition-colors hover:bg-secondary/30">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-foreground">{team.rank}</span>
                    <div className="flex flex-col items-center">
                      {team.trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
                      {team.trend === "down" && <TrendingDown className="h-3 w-3 text-destructive" />}
                      {team.trend === "same" && <Minus className="h-3 w-3 text-muted-foreground" />}
                      <span className="text-[10px] text-muted-foreground">{team.lastWeek}</span>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2">
                    <TeamBadge abbreviation={team.abbreviation} league="NBA" size="sm" />
                    <p className="font-bold text-foreground text-sm whitespace-nowrap">{team.team}</p>
                  </div>
                </td>
                <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">{team.wins}</td>
                <td className="px-5 py-3 text-center tabular-nums text-foreground">{team.losses}</td>
                <td className="px-5 py-3 text-center font-bold tabular-nums text-foreground">{team.pct}</td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground">{team.conferenceRecord || "-"}</td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground whitespace-nowrap">{team.divisionRecord || "-"}</td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground">{team.home || "-"}</td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground">{team.away || "-"}</td>
                <td className="px-5 py-3 text-center text-xs tabular-nums text-foreground whitespace-nowrap">{team.last10 || "-"}</td>
                <td className="px-5 py-3 text-center">
                  {team.streak ? (
                    <span
                      className={cn(
                        "rounded px-2 py-0.5 text-xs font-bold",
                        team.streak.startsWith("W") ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
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

function SegmentedControl({ value, onChange }: { value: ViewType; onChange: (value: ViewType) => void }) {
  const options = [
    { value: "regular" as ViewType, label: "Regular Season" },
    { value: "nbacup" as ViewType, label: "Emirates NBA Cup" },
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
              value === option.value ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function NBACupStandings() {
  const eastQuarterfinals = nbaCupBracket.find((r) => r.round === "Quarterfinals" && r.conference === "East");
  const westQuarterfinals = nbaCupBracket.find((r) => r.round === "Quarterfinals" && r.conference === "West");
  const final = nbaCupBracket.find((r) => r.round === "Final");

  const MatchupCard = ({ round, title }: { round: NBACupBracketRound | undefined; title: string }) => (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-lg font-black uppercase tracking-tight text-foreground">{title}</h3>
      </div>
      <div className="p-4 space-y-3">
        {round?.matchups.map((m, idx) => (
          <div key={idx} className="rounded-lg border border-border p-3">
            <div className="text-xs text-muted-foreground mb-2">{m.date} • {m.time}</div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <TeamBadge abbreviation={getAbbreviation(m.team1.teamFull)} league="NBA" size="sm" />
                <span className="font-semibold">{m.team1.teamFull}</span>
              </div>
              <span className="font-black">{m.team1.score ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <TeamBadge abbreviation={getAbbreviation(m.team2.teamFull)} league="NBA" size="sm" />
                <span className="font-semibold">{m.team2.teamFull}</span>
              </div>
              <span className="font-black">{m.team2.score ?? "-"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-2">
        <MatchupCard round={eastQuarterfinals} title="East Quarterfinals" />
        <MatchupCard round={westQuarterfinals} title="West Quarterfinals" />
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">NBA Cup Final</h3>
        </div>
        <div className="p-4">
          {final?.matchups.map((m, idx) => (
            <div key={idx} className="rounded-lg border border-border p-4">
              <div className="text-xs text-muted-foreground mb-2">{m.date} • {m.time}</div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TeamBadge abbreviation={getAbbreviation(m.team1.teamFull)} league="NBA" size="md" />
                    <span className="font-bold">{m.team1.teamFull}</span>
                  </div>
                  <span className="text-2xl font-black">{m.team1.score ?? "-"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TeamBadge abbreviation={getAbbreviation(m.team2.teamFull)} league="NBA" size="md" />
                    <span className="font-bold">{m.team2.teamFull}</span>
                  </div>
                  <span className="text-2xl font-black">{m.team2.score ?? "-"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Group Stage</h3>
        </div>
        <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {nbaCupGroups.map((team) => (
            <div key={`${team.group}-${team.abbreviation}`} className="rounded border border-border p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TeamBadge abbreviation={team.abbreviation} league="NBA" size="sm" />
                  <span className="font-semibold">{team.team}</span>
                </div>
                <span className="text-xs text-muted-foreground">{team.group}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="border-b border-border px-5 py-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-foreground">Wildcards</h3>
        </div>
        <div className="p-4 grid gap-4 md:grid-cols-2">
          {nbaCupWildcards.map((team) => (
            <div key={team.abbreviation} className="rounded border border-border p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TeamBadge abbreviation={team.abbreviation} league="NBA" size="sm" />
                <span className="font-semibold">{team.team}</span>
              </div>
              <span className="text-xs text-muted-foreground">{team.conference} • {team.wins}-{team.losses}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function NBAStandingsPage() {
  const [view, setView] = useState<ViewType>("regular");
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/standings?league=NBA", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.details || data?.error || "Failed to fetch NBA standings");
        }

        if (!Array.isArray(data?.teams)) {
          throw new Error("Unexpected standings format from API");
        }

        const mapped = (data.teams as ApiStanding[])
          .map(buildTeamStanding)
          .sort((a, b) => {
            const aPct = Number.parseFloat(a.pct || "0");
            const bPct = Number.parseFloat(b.pct || "0");
            if (aPct !== bPct) return bPct - aPct;
            return b.wins - a.wins;
          });

        setStandings(mapped);
      } catch (err) {
        console.error("Error fetching standings:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch standings");
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, []);

  const eastStandings = useMemo(
    () => standings.filter((s) => s.conference === "East"),
    [standings]
  );

  const westStandings = useMemo(
    () => standings.filter((s) => s.conference === "West"),
    [standings]
  );

  const leagueRankings = useMemo(
    () => standings.map((team, idx) => buildLeagueStanding(team, idx + 1)),
    [standings]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center text-sm font-black text-primary-foreground shadow-md">
              <img src="/nba-logo-1.png" alt="NBA Logo" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">NBA Standings</h1>
              <p className="text-sm text-muted-foreground">Current NBA conference standings</p>
            </div>
          </div>

          <SegmentedControl value={view} onChange={setView} />

          {view === "regular" && loading && (
            <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
              Loading NBA standings...
            </div>
          )}

          {view === "regular" && error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
              {error}
            </div>
          )}

          {view === "regular" && !loading && !error && (
            <>
              <div className="mb-4 grid gap-6 lg:grid-cols-2">
                <StandingsTable standings={eastStandings} title="Eastern Conference" showPlayInBorders={true} />
                <StandingsTable standings={westStandings} title="Western Conference" showPlayInBorders={true} />
              </div>

              <div className="mb-12 flex items-center justify-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-8 bg-primary/50" />
                  <span>1-6: Guaranteed Playoff Spots | 7-10: Play-In Tournament | 11-15: Eliminated</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">Divisional Standings</h2>
                <div className="grid gap-6 lg:grid-cols-2">
                  <StandingsTable standings={standings.filter((s) => s.division === "Atlantic")} title="Atlantic Division" />
                  <StandingsTable standings={standings.filter((s) => s.division === "Central")} title="Central Division" />
                  <StandingsTable standings={standings.filter((s) => s.division === "Southeast")} title="Southeast Division" />
                  <StandingsTable standings={standings.filter((s) => s.division === "Pacific")} title="Pacific Division" />
                  <StandingsTable standings={standings.filter((s) => s.division === "Northwest")} title="Northwest Division" />
                  <StandingsTable standings={standings.filter((s) => s.division === "Southwest")} title="Southwest Division" />
                </div>
              </div>

              <div className="mb-8">
                <LeagueRankings rankings={leagueRankings} />
              </div>
            </>
          )}

          {view === "nbacup" && <NBACupStandings />}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}