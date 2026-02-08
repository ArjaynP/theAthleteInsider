"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LiveScoreCard } from "@/components/live-score-card";
import {
  games,
  nbaStandings,
  nflStandings,
  type TeamStanding,
} from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { ArrowUpDown, Trophy } from "lucide-react";

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
        <Trophy className="h-5 w-5 text-amber" />
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

export default function ScoresPage() {
  const [activeLeague, setActiveLeague] = useState<"ALL" | "NBA" | "NFL">(
    "ALL"
  );

  const filteredGames =
    activeLeague === "ALL"
      ? games
      : games.filter((g) => g.league === activeLeague);

  const liveGames = filteredGames.filter((g) => g.status === "LIVE");
  const finalGames = filteredGames.filter((g) => g.status === "FINAL");
  const upcomingGames = filteredGames.filter((g) => g.status === "UPCOMING");

  const showNBA = activeLeague === "ALL" || activeLeague === "NBA";
  const showNFL = activeLeague === "ALL" || activeLeague === "NFL";

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-1.5 rounded-full bg-primary" />
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
                  Scores & Standings
                </h1>
                <p className="text-sm text-muted-foreground">
                  Live scores, results, and league standings
                </p>
              </div>
            </div>

            {/* League Filter */}
            <div className="flex rounded-lg border border-border bg-card p-1">
              {(["ALL", "NBA", "NFL"] as const).map((league) => (
                <button
                  key={league}
                  type="button"
                  onClick={() => setActiveLeague(league)}
                  className={cn(
                    "rounded-md px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all",
                    activeLeague === league
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {league}
                </button>
              ))}
            </div>
          </div>

          {/* Live Games */}
          {liveGames.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-accent" />
                </span>
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                  Live Now
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {liveGames.map((game) => (
                  <LiveScoreCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}

          {/* Final Games */}
          {finalGames.length > 0 && (
            <section className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-muted-foreground" />
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                  Final
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {finalGames.map((game) => (
                  <LiveScoreCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Games */}
          {upcomingGames.length > 0 && (
            <section className="mb-12">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-6 w-1 rounded-full bg-primary" />
                <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
                  Upcoming
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingGames.map((game) => (
                  <LiveScoreCard key={game.id} game={game} />
                ))}
              </div>
            </section>
          )}

          {/* Standings */}
          <section id="standings">
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-amber" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                Standings
              </h2>
            </div>
            <div className="flex flex-col gap-6">
              {showNBA && (
                <>
                  <StandingsTable
                    standings={nbaStandings.filter(
                      (s) => s.conference === "East"
                    )}
                    title="NBA Eastern Conference"
                  />
                  <StandingsTable
                    standings={nbaStandings.filter(
                      (s) => s.conference === "West"
                    )}
                    title="NBA Western Conference"
                  />
                </>
              )}
              {showNFL && (
                <>
                  <StandingsTable
                    standings={nflStandings.filter(
                      (s) => s.conference === "AFC"
                    )}
                    title="NFL AFC"
                  />
                  <StandingsTable
                    standings={nflStandings.filter(
                      (s) => s.conference === "NFC"
                    )}
                    title="NFL NFC"
                  />
                </>
              )}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
