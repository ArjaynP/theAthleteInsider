import {
  articles,
  games,
  nbaStandings,
  nflStandings,
  mlbStandings,
  nbaLeagueStandings,
  nflPowerRankings,
  polls,
  type Game,
  type TeamStanding,
  type LeagueStanding,
} from "@/lib/mock-data";
import Link from "next/link";
import { ArticleCard } from "@/components/article-card";
import { LiveScoreCard } from "@/components/live-score-card";
import { PollWidget } from "@/components/poll-widget";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { TeamBadge } from "@/components/team-badge";
import { ArrowUp, ArrowDown, Minus, Trophy, Calendar, Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

interface LeaguePageContentProps {
  league: "NBA" | "NFL" | "MLB";
  teamLogos?: Record<string, string>;
  standingsOverride?: TeamStanding[];
  rankingsOverride?: LeagueStanding[];
  conferencesOverride?: string[];
  gamesOverride?: Game[];
  featuredGameOverride?: Game;
  scoresPageHref?: string;
}

function PowerRankingsCard({ rankings, teamLogos }: { rankings: LeagueStanding[]; teamLogos: Record<string, string> }) {
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
          const diff = team.lastWeek - team.rank;
          const badgeLeague = team.league === "NBA" || team.league === "NFL" ? team.league : null;
          const teamLogo = teamLogos[normalizeAbbreviation(team.abbreviation)];
          return (
            <div
              key={team.abbreviation}
              className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-secondary"
            >
              <span className="w-6 text-center text-lg font-black text-foreground">
                {team.rank}
              </span>
              {teamLogo ? (
                <img src={teamLogo} alt={`${team.abbreviation} logo`} className="h-8 w-8 object-contain" />
              ) : badgeLeague ? (
                <TeamBadge abbreviation={team.abbreviation} league={badgeLeague} size="md" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-xs font-black text-foreground">
                  {team.abbreviation.charAt(0)}
                </div>
              )}
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
  teamLogos,
}: {
  standings: TeamStanding[];
  conference: string;
  teamLogos: Record<string, string>;
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
            {filtered.map((team) => {
              const teamLogo = teamLogos[normalizeAbbreviation(team.abbreviation)];
              return (
              <tr
                key={team.abbreviation}
                className="border-b border-border/50 transition-colors hover:bg-secondary/50"
              >
                <td className="py-2 font-bold text-foreground">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {team.rank}
                    </span>
                    {teamLogo ? (
                      <img src={teamLogo} alt={`${team.abbreviation} logo`} className="h-5 w-5 object-contain" />
                    ) : null}
                    {team.abbreviation}
                  </div>
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
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UpcomingGamesWidget({
  leagueGames,
  teamLogos,
  scoresPageHref,
}: {
  leagueGames: Game[];
  teamLogos: Record<string, string>;
  scoresPageHref: string;
}) {
  const upcoming = leagueGames.filter((g) => g.status === "UPCOMING");
  const live = leagueGames.filter((g) => g.status === "LIVE");
  const activeGames = [...live, ...upcoming].slice(0, 4);

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
          <LiveScoreCard key={game.id} game={game} teamLogos={teamLogos} />
        ))}
      </div>
      <div className="mt-4">
        <Link
          href={scoresPageHref}
          className="inline-flex w-full items-center justify-center rounded-lg border border-border bg-secondary px-4 py-2 text-sm font-bold uppercase tracking-wide text-foreground transition-colors hover:bg-secondary/70"
        >
          View All Scores
        </Link>
      </div>
    </div>
  );
}

export function LeaguePageContent({
  league,
  teamLogos: passedLogos,
  standingsOverride,
  rankingsOverride,
  conferencesOverride,
  gamesOverride,
  featuredGameOverride,
  scoresPageHref,
}: LeaguePageContentProps) {
  const leagueArticles = articles.filter((a) => a.league === league);
  const leagueGames = gamesOverride ?? games.filter((g) => g.league === league);
  
  let standings = nbaStandings;
  let rankings = nbaLeagueStandings;
  let conferences: string[] = ["East", "West"];

  if (league === "NFL") {
    standings = nflStandings;
    rankings = nflPowerRankings;
    conferences = ["AFC", "NFC"];
  } else if (league === "MLB") {
    standings = mlbStandings;
    conferences = ["AL", "NL"];
  }

  if (standingsOverride && standingsOverride.length > 0) {
    standings = standingsOverride;
  }

  if (rankingsOverride && rankingsOverride.length > 0) {
    rankings = rankingsOverride;
  }

  if (conferencesOverride && conferencesOverride.length > 0) {
    conferences = conferencesOverride;
  }

  const leaguePolls = polls.filter((p) => p.league === league);

  const teamLogos: Record<string, string> = passedLogos ?? {};

  const gameOfDay =
    featuredGameOverride ??
    leagueGames.find((g) => g.status === "LIVE") ??
    leagueGames.find((g) => g.status === "UPCOMING") ??
    leagueGames[0];

  const resolvedScoresPageHref =
    scoresPageHref ?? `/${league.toLowerCase()}/scores`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* League Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center text-sm font-black text-primary-foreground shadow-md">
            {league === "NBA" ? <img src="/nba-logo-1.png" alt="NBA Logo" /> : league === "NFL" ? <img src="/nfl-logo-2.png" alt="NFL Logo" /> : <img src="/mlb-logo.png" alt="MLB Logo" />}
          </div>
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

      {/* Game of the Day Banner */}
      {gameOfDay && (
        <div className="mb-8 rounded-xl border border-amber/30 bg-amber/5 p-6">
          <div className="mb-3 flex items-center gap-2">
            <Star className="h-5 w-5 text-amber" />
            <span className="text-sm font-black uppercase tracking-widest text-amber">
              Game of the Day
            </span>
          </div>
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              {teamLogos[normalizeAbbreviation(gameOfDay.awayTeam)] ? (
                <img
                  src={teamLogos[normalizeAbbreviation(gameOfDay.awayTeam)]}
                  alt={`${gameOfDay.awayTeam} logo`}
                  className="mx-auto mb-2 h-14 w-14 object-contain"
                />
              ) : gameOfDay.league === "NBA" || gameOfDay.league === "NFL" ? (
                <TeamBadge
                  abbreviation={gameOfDay.awayTeam}
                  league={gameOfDay.league}
                  size="lg"
                  className="mx-auto mb-2"
                />
              ) : (
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-xl font-black text-foreground">
                  {gameOfDay.awayTeam.charAt(0)}
                </div>
              )}
              <p className="text-lg font-black text-foreground">
                {gameOfDay.awayTeam}
              </p>
              <p className="text-xs text-muted-foreground">
                {gameOfDay.awayRecord}
              </p>
            </div>
            <div className="text-center">
              {gameOfDay.status === "LIVE" ? (
                <div>
                  <p className="text-3xl font-black tabular-nums text-foreground">
                    {gameOfDay.awayScore} - {gameOfDay.homeScore}
                  </p>
                  <p className="text-xs font-bold text-accent">
                    {gameOfDay.quarter} {gameOfDay.time}
                  </p>
                </div>
              ) : gameOfDay.status === "FINAL" ? (
                <div>
                  <p className="text-3xl font-black tabular-nums text-foreground">
                    {gameOfDay.awayScore} - {gameOfDay.homeScore}
                  </p>
                  <p className="text-xs font-bold text-muted-foreground">
                    FINAL
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-2xl font-black text-foreground">VS</p>
                  <p className="text-xs font-bold text-primary">
                    {gameOfDay.startTime}
                  </p>
                </div>
              )}
            </div>
            <div className="text-center">
              {teamLogos[normalizeAbbreviation(gameOfDay.homeTeam)] ? (
                <img
                  src={teamLogos[normalizeAbbreviation(gameOfDay.homeTeam)]}
                  alt={`${gameOfDay.homeTeam} logo`}
                  className="mx-auto mb-2 h-14 w-14 object-contain"
                />
              ) : gameOfDay.league === "NBA" || gameOfDay.league === "NFL" ? (
                <TeamBadge
                  abbreviation={gameOfDay.homeTeam}
                  league={gameOfDay.league}
                  size="lg"
                  className="mx-auto mb-2"
                />
              ) : (
                <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-secondary text-xl font-black text-foreground">
                  {gameOfDay.homeTeam.charAt(0)}
                </div>
              )}
              <p className="text-lg font-black text-foreground">
                {gameOfDay.homeTeam}
              </p>
              <p className="text-xs text-muted-foreground">
                {gameOfDay.homeRecord}
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
                  teamLogos={teamLogos}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="flex flex-col gap-6">
          <PowerRankingsCard rankings={rankings} teamLogos={teamLogos} />
          <UpcomingGamesWidget
            leagueGames={leagueGames}
            teamLogos={teamLogos}
            scoresPageHref={resolvedScoresPageHref}
          />
          <NewsletterSignup />
        </aside>
      </div>
    </div>
  );
}
