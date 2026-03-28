import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeaguePageContent } from "@/components/league-page-content";
import { getCachedNBATeamsList, getCachedNBAStandings } from "@/lib/cachedSportsData";
import type { Game, LeagueStanding, TeamStanding } from "@/lib/mock-data";

type ApiTeam = {
  abbreviation?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
};

type SportsRadarTeam = {
  market?: string;
  name?: string;
  alias?: string;
  wins?: number;
  losses?: number;
  win_pct?: number;
  games_behind?: { conference?: number };
  streak?: { kind?: "win" | "loss"; length?: number };
  calc_rank?: { conf_rank?: number; league_rank?: number };
  records?: Array<{ record_type?: string; wins?: number; losses?: number }>;
};

const NBA_TEAM_ABBR: Record<string, string> = {
  "Atlanta Hawks": "ATL",
  "Boston Celtics": "BOS",
  "Brooklyn Nets": "BKN",
  "Charlotte Hornets": "CHA",
  "Chicago Bulls": "CHI",
  "Cleveland Cavaliers": "CLE",
  "Dallas Mavericks": "DAL",
  "Denver Nuggets": "DEN",
  "Detroit Pistons": "DET",
  "Golden State Warriors": "GSW",
  "Houston Rockets": "HOU",
  "Indiana Pacers": "IND",
  "Los Angeles Clippers": "LAC",
  "LA Clippers": "LAC",
  "Los Angeles Lakers": "LAL",
  "Memphis Grizzlies": "MEM",
  "Miami Heat": "MIA",
  "Milwaukee Bucks": "MIL",
  "Minnesota Timberwolves": "MIN",
  "New Orleans Pelicans": "NOP",
  "New York Knicks": "NYK",
  "Oklahoma City Thunder": "OKC",
  "Orlando Magic": "ORL",
  "Philadelphia 76ers": "PHI",
  "Phoenix Suns": "PHX",
  "Portland Trail Blazers": "POR",
  "Sacramento Kings": "SAC",
  "San Antonio Spurs": "SAS",
  "Toronto Raptors": "TOR",
  "Utah Jazz": "UTA",
  "Washington Wizards": "WAS",
};

function formatLocalTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return (
      d.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
        timeZone: "America/New_York",
      }) + " ET"
    );
  } catch {
    return "";
  }
}

function getEasternDateString(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function formatQuarter(value: unknown): string | undefined {
  if (value == null) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  if (/^q\d+$/i.test(raw)) return raw.toUpperCase();
  if (/^\d+$/.test(raw)) return `Q${raw}`;
  return raw.toUpperCase();
}

async function fetchLiveSummary(
  gameId: string,
  apiKey: string
): Promise<{ homeScore?: number; awayScore?: number; quarter?: string; time?: string }> {
  const summaryUrl = `https://api.sportradar.com/nba/trial/v8/en/games/${gameId}/summary.json?api_key=${apiKey}`;
  const summaryRes = await fetch(summaryUrl, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });

  if (!summaryRes.ok) return {};

  const summary = (await summaryRes.json()) as Record<string, any>;
  const game = summary?.game ?? summary;

  const homeScore =
    game?.home?.points ??
    game?.home?.scoring ??
    game?.home_points;
  const awayScore =
    game?.away?.points ??
    game?.away?.scoring ??
    game?.away_points;

  return {
    homeScore: typeof homeScore === "number" ? homeScore : undefined,
    awayScore: typeof awayScore === "number" ? awayScore : undefined,
    quarter: formatQuarter(game?.quarter ?? game?.period),
    time: typeof game?.clock === "string" ? game.clock : undefined,
  };
}

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

export default async function NBAPage() {
  let teamLogos: Record<string, string> = {};
  let apiStandings: TeamStanding[] = [];
  let apiRankings: LeagueStanding[] = [];
  let apiGames: Game[] = [];
  let featuredGame: Game | undefined;

  const getRecord = (team: SportsRadarTeam, type: string): string => {
    const rec = (team.records ?? []).find((r) => r.record_type === type);
    return rec ? `${rec.wins ?? 0}-${rec.losses ?? 0}` : "-";
  };

  try {
    const teams = await getCachedNBATeamsList();
    teamLogos = (teams as ApiTeam[]).reduce<Record<string, string>>((acc, team) => {
      if (!team.abbreviation) return acc;
      const abbr = normalizeAbbreviation(team.abbreviation);
      const logo = team.logoLight || team.logo || team.logoDark;
      if (logo) acc[abbr] = logo;
      return acc;
    }, {});
  } catch {
    // fall back to TeamBadge
  }

  try {
    const rawStandings = await getCachedNBAStandings() as {
      conferences?: Array<{
        alias?: string;
        divisions?: Array<{
          name?: string;
          teams?: SportsRadarTeam[];
        }>;
      }>;
    };

    for (const conf of rawStandings.conferences ?? []) {
      const conference = String(conf.alias ?? "").toUpperCase().includes("EAST") ? "East" : "West";

      for (const div of conf.divisions ?? []) {
        for (const team of div.teams ?? []) {
          const displayName = `${team.market ?? ""} ${team.name ?? ""}`.trim();
          const abbreviation =
            NBA_TEAM_ABBR[displayName] ??
            team.alias ??
            (team.market ? team.market.slice(0, 3).toUpperCase() : "?");

          const pct = team.win_pct != null ? team.win_pct.toFixed(3) : ".000";
          const gbVal = team.games_behind?.conference;
          const gb = gbVal === 0 ? "-" : gbVal != null ? String(gbVal) : "-";
          const streak = team.streak ? `${team.streak.kind === "win" ? "W" : "L"}${team.streak.length ?? 0}` : "-";
          const rank = team.calc_rank?.league_rank ?? team.calc_rank?.conf_rank ?? 99;
          const wins = team.wins ?? 0;
          const losses = team.losses ?? 0;

          apiStandings.push({
            rank: team.calc_rank?.conf_rank ?? 99,
            team: displayName,
            abbreviation,
            wins,
            losses,
            pct,
            gb,
            streak,
            conference,
            division: div.name ?? "-",
            league: "NBA",
            home: getRecord(team, "home"),
            away: getRecord(team, "road"),
            last10: getRecord(team, "last_10"),
            conferenceRecord: getRecord(team, "conference"),
            divisionRecord: getRecord(team, "division"),
          });

          apiRankings.push({
            rank,
            team: displayName,
            abbreviation,
            record: `${wins}-${losses}`,
            lastWeek: rank,
            trend: "same",
            summary: `${streak} | ${conference} ${div.name ?? ""}`.trim(),
            league: "NBA",
            wins,
            losses,
            pct,
            gb,
            streak,
            conference,
            division: div.name ?? "-",
            home: getRecord(team, "home"),
            away: getRecord(team, "road"),
            last10: getRecord(team, "last_10"),
            conferenceRecord: getRecord(team, "conference"),
            divisionRecord: getRecord(team, "division"),
          });
        }
      }
    }

    apiStandings.sort((a, b) => {
      if (a.conference === b.conference) return a.rank - b.rank;
      return a.conference.localeCompare(b.conference);
    });

    apiRankings.sort((a, b) => a.rank - b.rank);
  } catch {
    // fall back to mock standings/rankings in LeaguePageContent
  }

  try {
    const apiKey = process.env.SPORTSRADAR_API_KEY;
    if (apiKey) {
      const today = getEasternDateString();
      const [year, month, day] = today.split("-");
      const url = `https://api.sportradar.com/nba/trial/v8/en/games/${year}/${month}/${day}/schedule.json?api_key=${apiKey}`;

      const response = await fetch(url, {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (response.ok) {
        const raw = await response.json() as {
          games?: Array<{
            id?: string;
            status?: string;
            scheduled?: string;
            home_points?: number;
            away_points?: number;
            quarter?: string;
            period?: number;
            clock?: string;
            home?: { alias?: string };
            away?: { alias?: string };
          }>;
        };

        const baseGames = (raw.games ?? []).map((g) => {
          const srStatus = String(g.status ?? "").toLowerCase();
          let status: Game["status"] = "UPCOMING";
          if (srStatus === "closed" || srStatus === "complete") status = "FINAL";
          else if (srStatus === "inprogress") status = "LIVE";

          const homeAlias = normalizeAbbreviation(String(g.home?.alias ?? ""));
          const awayAlias = normalizeAbbreviation(String(g.away?.alias ?? ""));

          return {
            id: String(g.id ?? `${awayAlias}-${homeAlias}-${today}`),
            homeTeam: homeAlias,
            awayTeam: awayAlias,
            homeScore: g.home_points ?? 0,
            awayScore: g.away_points ?? 0,
            status,
            quarter: formatQuarter(g.quarter ?? g.period),
            time: g.clock,
            startTime: formatLocalTime(String(g.scheduled ?? "")),
            league: "NBA",
            homeRecord: "",
            awayRecord: "",
          } satisfies Game;
        });

        apiGames = await Promise.all(
          baseGames.map(async (game) => {
            if (game.status !== "LIVE") return game;

            try {
              const summary = await fetchLiveSummary(game.id, apiKey);
              return {
                ...game,
                homeScore: summary.homeScore ?? game.homeScore,
                awayScore: summary.awayScore ?? game.awayScore,
                quarter: summary.quarter ?? game.quarter,
                time: summary.time ?? game.time,
              };
            } catch {
              return game;
            }
          })
        );

        const atlVsBos = apiGames.find(
          (g) =>
            (g.awayTeam === "ATL" && g.homeTeam === "BOS") ||
            (g.awayTeam === "BOS" && g.homeTeam === "ATL")
        );

        featuredGame =
          atlVsBos ??
          apiGames.find((g) => g.status === "LIVE") ??
          apiGames.find((g) => g.status === "UPCOMING") ??
          apiGames[0];
      }
    }
  } catch {
    // fall back to mock games in LeaguePageContent
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LeaguePageContent
          league="NBA"
          teamLogos={teamLogos}
          standingsOverride={apiStandings.length > 0 ? apiStandings : undefined}
          rankingsOverride={apiRankings.slice(0, 10).length > 0 ? apiRankings.slice(0, 10) : undefined}
          conferencesOverride={["East", "West"]}
          gamesOverride={apiGames.length > 0 ? apiGames : undefined}
          featuredGameOverride={featuredGame}
          scoresPageHref="/nba/scores"
        />
      </main>
      <SiteFooter />
    </div>
  );
}
