import {
  articles,
  games,
  nbaStandings,
  nflStandings,
  mlbStandings,
  nbaPowerRankings,
  nflPowerRankings,
  mlbPowerRankings,
  polls,
  type TeamStanding,
  type PowerRanking,
} from "@/lib/mock-data";
import { ArticleCard } from "@/components/article-card";
import { LiveScoreCard } from "@/components/live-score-card";
import { PollWidget } from "@/components/poll-widget";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { ArrowUp, ArrowDown, Minus, Trophy, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LeaguePageContentProps {
  league: "NBA" | "NFL" | "MLB";
}

function PowerRankingsCard({ rankings }: { rankings: PowerRanking[] }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Trophy className="h-5 w-5 text-amber" />
        <h3 className="text-lg font-black uppercase text-foreground">
          Power Rankings
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {rankings.map((team) => {
          const diff = team.previousRank - team.rank;
          return (
            <div
              key={team.abbreviation}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <span className="w-6 text-center text-lg font-black text-foreground">
                {team.rank}
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                {team.abbreviation.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">
                  {team.team}
                </p>
                <p className="text-xs text-muted-foreground">{team.record}</p>
              </div>
              <div className="flex items-center gap-1">
                {diff > 0 ? (
                  <ArrowUp className="h-3 w-3 text-accent" />
                ) : diff < 0 ? (
                  <ArrowDown className="h-3 w-3 text-destructive" />
                ) : (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    "text-xs font-bold",
                    diff > 0
                      ? "text-accent"
                      : diff < 0
                        ? "text-destructive"
                        : "text-muted-foreground"
                  )}
                >
                  {Math.abs(diff) || "-"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MiniStandingsTable({
  standings,
  conference,
}: {
  standings: TeamStanding[];
  conference: string;
}) {
  const filtered = standings.filter((s) => s.conference === conference);
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h3 className="mb-4 text-sm font-black uppercase tracking-widest text-foreground">
        {conference} Standings
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="pb-2 text-left font-bold uppercase tracking-widest">
                Team
              </th>
              <th className="pb-2 text-center font-bold uppercase tracking-widest">
                W
              </th>
              <th className="pb-2 text-center font-bold uppercase tracking-widest">
                L
              </th>
              <th className="pb-2 text-center font-bold uppercase tracking-widest">
                PCT
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((team) => (
              <tr
                key={team.abbreviation}
                className="border-b border-border/50 transition-colors hover:bg-secondary/50"
              >
                <td className="py-2 font-bold text-foreground">
                  <span className="mr-2 text-xs text-muted-foreground">
                    {team.rank}
                  </span>
                  {team.abbreviation}
                </td>
                <td className="py-2 text-center tabular-nums text-foreground">
                  {team.wins}
                </td>
                <td className="py-2 text-center tabular-nums text-muted-foreground">
                  {team.losses}
                </td>
                <td className="py-2 text-center tabular-nums text-foreground">
                  {team.pct}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UpcomingGamesWidget({ leagueGames }: { leagueGames: typeof games }) {
  const upcoming = leagueGames.filter((g) => g.status === "UPCOMING");
  const live = leagueGames.filter((g) => g.status === "LIVE");
  const activeGames = [...live, ...upcoming];

  if (activeGames.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-black uppercase text-foreground">
          {live.length > 0 ? "Live & Upcoming" : "Upcoming Games"}
        </h3>
      </div>
      <div className="flex flex-col gap-3">
        {activeGames.map((game) => (
          <LiveScoreCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
}

export function LeaguePageContent({ league }: LeaguePageContentProps) {
  const leagueArticles = articles.filter((a) => a.league === league);
  const leagueGames = games.filter((g) => g.league === league);
  
  let standings = nbaStandings;
  let rankings = nbaPowerRankings;
  let conferences: string[] = ["East", "West"];

  if (league === "NFL") {
    standings = nflStandings;
    rankings = nflPowerRankings;
    conferences = ["AFC", "NFC"];
  } else if (league === "MLB") {
    standings = mlbStandings;
    rankings = mlbPowerRankings;
    conferences = ["AL", "NL"];
  }

  const leaguePolls = polls.filter((p) => p.league === league);

  // Pick a "Game of the Week"
  const gameOfWeek = leagueGames[0];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* League Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-1.5 rounded-full bg-primary" />
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tight text-foreground">
              {league}
            </h1>
            <p className="text-sm text-muted-foreground">
              News, Scores, Standings & Analysis
            </p>
          </div>
        </div>
      </div>

      {/* Game of the Week Banner */}
      {gameOfWeek && (
        <div className="mb-8 rounded-xl border border-amber/30 bg-amber/5 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber" />
            <span className="text-sm font-black uppercase tracking-widest text-amber">
              Game of the Week
            </span>
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-xl font-black text-foreground">
                {gameOfWeek.awayTeam.charAt(0)}
              </div>
              <p className="text-lg font-black text-foreground">
                {gameOfWeek.awayTeam}
              </p>
              <p className="text-xs text-muted-foreground">
                {gameOfWeek.awayRecord}
              </p>
            </div>
            <div className="text-center">
              {gameOfWeek.status === "LIVE" ? (
                <div>
                  <p className="text-3xl font-black tabular-nums text-foreground">
                    {gameOfWeek.awayScore} - {gameOfWeek.homeScore}
                  </p>
                  <p className="text-xs font-bold text-accent">
                    {gameOfWeek.quarter} {gameOfWeek.time}
                  </p>
                </div>
              ) : gameOfWeek.status === "FINAL" ? (
                <div>
                  <p className="text-3xl font-black tabular-nums text-foreground">
                    {gameOfWeek.awayScore} - {gameOfWeek.homeScore}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    FINAL
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-black text-foreground">VS</p>
                  <p className="text-xs font-bold text-primary">
                    {gameOfWeek.startTime}
                  </p>
                </div>
              )}
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-xl font-black text-foreground">
                {gameOfWeek.homeTeam.charAt(0)}
              </div>
              <p className="text-lg font-black text-foreground">
                {gameOfWeek.homeTeam}
              </p>
              <p className="text-xs text-muted-foreground">
                {gameOfWeek.homeRecord}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main content */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {/* News Feed */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-primary" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                {league} News
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {leagueArticles.slice(0, 4).map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </div>

          {/* Poll */}
          {leaguePolls[0] && <PollWidget poll={leaguePolls[0]} />}

          {/* Standings */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="h-8 w-1 rounded-full bg-accent" />
              <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                Standings
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {conferences.map((conf) => (
                <MiniStandingsTable
                  key={conf}
                  standings={standings}
                  conference={conf}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <PowerRankingsCard rankings={rankings} />
          <UpcomingGamesWidget leagueGames={leagueGames} />
          <NewsletterSignup />
        </aside>
      </div>
    </div>
  );
}
