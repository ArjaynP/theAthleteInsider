"use client";

import { useEffect, useRef, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { type TeamStanding } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowUpDown } from "lucide-react";
import { TeamBadge } from "@/components/team-badge";

type ApiTeam = {
  abbreviation?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
};

type SortKey = "wins" | "losses" | "pct" | "team";
type SeasonView = "regular" | "spring";

const MLB_DIVISIONS = ["East", "Central", "West"] as const;

const GRAPEFRUIT_TEAMS = new Set([
  "Baltimore Orioles",
  "Boston Red Sox",
  "Tampa Bay Rays",
  "Toronto Blue Jays",
  "Minnesota Twins",
  "Detroit Tigers",
  "Atlanta Braves",
  "Philadelphia Phillies",
  "New York Mets",
  "Miami Marlins",
  "Washington Nationals",
  "St. Louis Cardinals",
  "Houston Astros",
  "Pittsburgh Pirates",
]);

function toPctValue(pct: string) {
  const parsed = Number.parseFloat(pct);
  return Number.isNaN(parsed) ? 0 : parsed;
}

function compareByRecord(a: TeamStanding, b: TeamStanding) {
  const pctDiff = toPctValue(b.pct) - toPctValue(a.pct);
  if (pctDiff !== 0) return pctDiff;
  const winDiff = b.wins - a.wins;
  if (winDiff !== 0) return winDiff;
  return a.losses - b.losses;
}

function getDivisionLeaders(teams: TeamStanding[]) {
  const leaders = MLB_DIVISIONS.map((division) => {
    const divisionTeams = teams.filter((team) => team.division === division);
    return [...divisionTeams].sort(compareByRecord)[0];
  }).filter((team): team is TeamStanding => Boolean(team));

  return leaders.sort(compareByRecord);
}

function getWildCards(teams: TeamStanding[]) {
  const divisionLeaders = getDivisionLeaders(teams);
  const leaderKeys = new Set(divisionLeaders.map((team) => team.team));
  return teams
    .filter((team) => !leaderKeys.has(team.team))
    .sort(compareByRecord)
    .slice(0, 3);
}

function getRemainingTeams(teams: TeamStanding[]) {
  const divisionLeaders = getDivisionLeaders(teams);
  const wildCards = getWildCards(teams);
  const excluded = new Set([
    ...divisionLeaders.map((team) => team.team),
    ...wildCards.map((team) => team.team),
  ]);

  return teams.filter((team) => !excluded.has(team.team)).sort(compareByRecord);
}

function TeamStandingsRows({
  teams,
  startRank,
  teamLogos = {},
}: {
  teams: TeamStanding[];
  startRank: number;
  teamLogos?: Record<string, string>;
}) {
  return (
    <>
      {teams.map((team, i) => (
        <tr
          key={team.abbreviation}
          className="border-b border-border/50 transition-colors hover:bg-secondary/30"
        >
          <td className="px-5 py-3 text-sm font-bold tabular-nums text-muted-foreground">
            {startRank + i}
          </td>
          <td className="px-5 py-3">
            <div className="flex items-center gap-3">
              {teamLogos[team.abbreviation?.toUpperCase() ?? ""] ? (
                <img
                  src={teamLogos[team.abbreviation?.toUpperCase() ?? ""]}
                  alt={team.team}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <TeamBadge abbreviation={team.abbreviation} league="MLB" size="md" />
              )}
              <div className="min-w-0">
                <p className="whitespace-nowrap font-bold text-foreground">{team.team}</p>
                <p className="text-[10px] text-muted-foreground">{team.division}</p>
              </div>
            </div>
          </td>
          <td className="px-3 py-3 text-center font-bold tabular-nums text-foreground">
            {team.wins}
          </td>
          <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
            {team.losses}
          </td>
          <td className="px-3 py-3 text-center font-bold tabular-nums text-foreground">
            {team.pct}
          </td>
          <td className="px-3 py-3 text-center tabular-nums text-muted-foreground">
            {team.gb}
          </td>
          <td className="px-3 py-3 text-center tabular-nums text-muted-foreground whitespace-nowrap">{team.home ?? "-"}</td>
          <td className="px-3 py-3 text-center tabular-nums text-muted-foreground whitespace-nowrap">{team.away ?? "-"}</td>
          <td className="px-3 py-3 text-center tabular-nums text-foreground">{team.rs ?? "-"}</td>
          <td className="px-3 py-3 text-center tabular-nums text-foreground">{team.ra ?? "-"}</td>
          <td
            className={cn(
              "px-3 py-3 text-center font-bold tabular-nums whitespace-nowrap",
              team.diff?.startsWith("+")
                ? "text-green-500"
                : team.diff?.startsWith("-")
                  ? "text-destructive"
                  : "text-muted-foreground"
            )}
          >
            {team.diff ?? "-"}
          </td>
          <td className="px-3 py-3 text-center">
            <span
              className={cn(
                "rounded px-2 py-0.5 text-xs font-bold",
                team.streak.startsWith("W")
                  ? "bg-green-500/20 text-green-500"
                  : "bg-destructive/20 text-destructive"
              )}
            >
              {team.streak}
            </span>
          </td>
          <td className="px-3 py-3 text-center tabular-nums text-muted-foreground whitespace-nowrap">{team.last10 ?? "-"}</td>
        </tr>
      ))}
    </>
  );
}

function StandingsTableHeader({ onSort }: { onSort: (key: SortKey) => void }) {
  return (
    <thead>
      <tr className="border-b border-border text-xs text-muted-foreground">
        <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">#</th>
        <th className="px-5 py-3 text-left font-bold uppercase tracking-widest">
          <button type="button" onClick={() => onSort("team")} className="flex items-center gap-1">
            Team
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </th>
        <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
          <button type="button" onClick={() => onSort("wins")} className="flex items-center gap-1">
            W
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </th>
        <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
          <button type="button" onClick={() => onSort("losses")} className="flex items-center gap-1">
            L
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </th>
        <th className="px-5 py-3 text-center font-bold uppercase tracking-widest">
          <button type="button" onClick={() => onSort("pct")} className="flex items-center gap-1">
            PCT
            <ArrowUpDown className="h-3 w-3" />
          </button>
        </th>
        <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">GB</th>
        <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">HOME</th>
        <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">AWAY</th>
        <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">RS</th>
        <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">RA</th>
        <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">DIFF</th>
        <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">STRK</th>
        <th className="px-3 py-3 text-center font-bold uppercase tracking-widest">L10</th>
      </tr>
    </thead>
  );
}

function StandingsTable({
  standings,
  title,
  showMlbPostseasonLayout = false,
  teamLogos = {},
}: {
  standings: TeamStanding[];
  title: string;
  showMlbPostseasonLayout?: boolean;
  teamLogos?: Record<string, string>;
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
          <StandingsTableHeader onSort={handleSort} />
          <tbody>
            {showMlbPostseasonLayout ? (
              <>
                <tr className="bg-secondary/20">
                  <td colSpan={13} className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    Division Leaders
                  </td>
                </tr>
                <TeamStandingsRows teams={getDivisionLeaders(sorted)} startRank={1} teamLogos={teamLogos} />
                <tr className="bg-secondary/10">
                  <td colSpan={13} className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    Wild Card
                  </td>
                </tr>
                <TeamStandingsRows teams={getWildCards(sorted)} startRank={4} teamLogos={teamLogos} />
                <tr className="bg-secondary/5">
                  <td colSpan={13} className="px-5 py-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                    Remaining Teams
                  </td>
                </tr>
                <TeamStandingsRows teams={getRemainingTeams(sorted)} startRank={7} teamLogos={teamLogos} />
              </>
            ) : (
              <TeamStandingsRows teams={sorted} startRank={1} teamLogos={teamLogos} />
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function MLBStandingsPage() {
  const [seasonView, setSeasonView] = useState<SeasonView>("regular");
  const [standings, setStandings] = useState<TeamStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [springStandings, setSpringStandings] = useState<TeamStanding[]>([]);
  const [springLoading, setSpringLoading] = useState(false);
  const [springError, setSpringError] = useState<string | null>(null);
  const [teamLogos, setTeamLogos] = useState<Record<string, string>>({});
  const hasFetchedSpring = useRef(false);

  const grapefruitStandings = springStandings.filter((s) => GRAPEFRUIT_TEAMS.has(s.team));
  const cactusStandings = springStandings.filter((s) => !GRAPEFRUIT_TEAMS.has(s.team));

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/standings?league=MLB", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.details || data?.error || "Failed to fetch MLB standings");
        }

        if (!Array.isArray(data?.teams)) {
          throw new Error("Unexpected standings format from API");
        }

        const mapped = (data.teams as TeamStanding[])
          .sort((a, b) => {
            const aPct = Number.parseFloat(a.pct || "0");
            const bPct = Number.parseFloat(b.pct || "0");
            if (aPct !== bPct) return bPct - aPct;
            return b.wins - a.wins;
          });

        setStandings(mapped);
      } catch (err) {
        console.error("Error fetching MLB standings:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch standings");
      } finally {
        setLoading(false);
      }
    }

    fetchStandings();
  }, []);

  useEffect(() => {
    async function fetchLogos() {
      try {
        const res = await fetch("/api/mlb-teams");
        const data = await res.json();
        if (!res.ok || !Array.isArray(data?.teams)) return;
        const logos = (data.teams as ApiTeam[]).reduce<Record<string, string>>((acc, team) => {
          if (!team.abbreviation) return acc;
          const logo = team.logoLight || team.logo || team.logoDark;
          if (logo) acc[team.abbreviation.toUpperCase()] = logo;
          return acc;
        }, {});
        setTeamLogos(logos);
      } catch {
        // logos non-critical
      }
    }
    fetchLogos();
  }, []);

  useEffect(() => {
    if (seasonView !== "spring" || hasFetchedSpring.current) return;
    hasFetchedSpring.current = true;

    async function fetchSpringStandings() {
      try {
        setSpringLoading(true);
        setSpringError(null);

        const response = await fetch("/api/standings?league=MLB_SPRING", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.details || data?.error || "Failed to fetch spring training standings");
        }

        if (!Array.isArray(data?.teams)) {
          throw new Error("Unexpected standings format from API");
        }

        const mapped = (data.teams as TeamStanding[])
          .sort((a, b) => {
            const aPct = Number.parseFloat(a.pct || "0");
            const bPct = Number.parseFloat(b.pct || "0");
            if (aPct !== bPct) return bPct - aPct;
            return b.wins - a.wins;
          });

        setSpringStandings(mapped);
      } catch (err) {
        console.error("Error fetching spring training standings:", err);
        setSpringError(err instanceof Error ? err.message : "Failed to fetch standings");
      } finally {
        setSpringLoading(false);
      }
    }

    fetchSpringStandings();
  }, [seasonView]);

  const alStandings = standings.filter((s) => s.conference === "AL");
  const nlStandings = standings.filter((s) => s.conference === "NL");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center bg-primary text-sm font-black text-primary-foreground shadow-md">
              <img src="/mlb-logo.png" alt="MLB Logo" />
            </div>
            <div className="h-10 w-1.5 rounded-full bg-primary" />
            <div>
              <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                MLB Standings
              </h1>
              <p className="text-sm text-muted-foreground">Current MLB standings</p>
            </div>
          </div>

          <div className="mb-8 inline-flex rounded-lg border border-border bg-card p-1">
            <button
              type="button"
              onClick={() => setSeasonView("regular")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors",
                seasonView === "regular"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Regular Season
            </button>
            <button
              type="button"
              onClick={() => setSeasonView("spring")}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-bold uppercase tracking-wide transition-colors",
                seasonView === "spring"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Spring Training
            </button>
          </div>

          {seasonView === "regular" ? (
            <>
              {loading && (
                <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                  Loading MLB standings...
                </div>
              )}

              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
                  {error}
                </div>
              )}

              {!loading && !error && (
                <>
                  <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
                    WILD CARD
                  </h2>
                  <div className="mb-12 grid gap-6 lg:grid-cols-2">
                    <StandingsTable
                      standings={alStandings}
                      title="American League"
                      showMlbPostseasonLayout
                      teamLogos={teamLogos}
                    />
                    <StandingsTable
                      standings={nlStandings}
                      title="National League"
                      showMlbPostseasonLayout
                      teamLogos={teamLogos}
                    />
                  </div>

                  <div className="mb-8">
                    <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
                      Regular Season
                    </h2>
                    <div className="grid gap-6 lg:grid-cols-2">
                      <StandingsTable
                        standings={standings.filter((s) => s.division === "East" && s.conference === "AL")}
                        title="AL East"
                        teamLogos={teamLogos}
                      />
                      <StandingsTable
                        standings={standings.filter((s) => s.division === "Central" && s.conference === "AL")}
                        title="AL Central"
                        teamLogos={teamLogos}
                      />
                      <StandingsTable
                        standings={standings.filter((s) => s.division === "West" && s.conference === "AL")}
                        title="AL West"
                        teamLogos={teamLogos}
                      />
                      <StandingsTable
                        standings={standings.filter((s) => s.division === "East" && s.conference === "NL")}
                        title="NL East"
                        teamLogos={teamLogos}
                      />
                      <StandingsTable
                        standings={standings.filter((s) => s.division === "Central" && s.conference === "NL")}
                        title="NL Central"
                        teamLogos={teamLogos}
                      />
                      <StandingsTable
                        standings={standings.filter((s) => s.division === "West" && s.conference === "NL")}
                        title="NL West"
                        teamLogos={teamLogos}
                      />
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              <h2 className="mb-6 text-2xl font-black uppercase tracking-tight text-foreground">
                Spring Training Standings
              </h2>

              {springLoading && (
                <div className="rounded-xl border border-border bg-card p-8 text-center text-muted-foreground">
                  Loading spring training standings...
                </div>
              )}

              {springError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-8 text-center text-destructive">
                  {springError}
                </div>
              )}

              {!springLoading && !springError && (
                <div className="mb-12 grid gap-6 lg:grid-cols-2">
                  <StandingsTable standings={grapefruitStandings} title="Grapefruit League" teamLogos={teamLogos} />
                  <StandingsTable standings={cactusStandings} title="Cactus League" teamLogos={teamLogos} />
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
