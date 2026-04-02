import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { LeaguePageContent } from "@/components/league-page-content";
import { getCachedMLBTeamsList, getCachedMLBSportsRadarStandings, getCachedMLBDailySchedule, getCachedMLBDailyBoxscore } from "@/lib/cachedSportsData";
import type { TeamStanding, LeagueStanding, Game } from "@/lib/mock-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ApiTeam = {
  abbreviation?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
};

// ESPN abbreviation → extra keys to store logo under (SportsRadar/mock data uses these)
const MLB_EXTRA_ABBR_KEYS: Record<string, string> = {
  ARI: "AZ",  // ESPN: ARI → SportsRadar: AZ
  CHW: "CWS",   // ESPN: CHW → SportsRadar/mock: CWS
  TBR: "TB",    // ESPN: TBR → SportsRadar: TB
  KCR: "KC",    // ESPN: KCR → SportsRadar: KC
  SDP: "SD",    // ESPN: SDP → SportsRadar: SD
  SFG: "SF",    // ESPN: SFG → SportsRadar: SF
  WSN: "WSH",   // ESPN: WSN → SportsRadar: WSH
};

function normalizeMLBAbr(value: string) {
  const upper = value.toUpperCase();
  return MLB_EXTRA_ABBR_KEYS[upper] ?? upper;
}

// ── today's games helpers ────────────────────────────────────────────────────

type RawMLBTeamEntry = {
  abbr?: string;
  win?: number;
  loss?: number;
  runs?: number;
};

type RawMLBGameEntry = {
  id?: string | number;
  status?: string;
  scheduled?: string;
  home?: RawMLBTeamEntry;
  away?: RawMLBTeamEntry;
};

function toMLBGameStatus(v: string): 'LIVE' | 'FINAL' | 'UPCOMING' {
  const s = (v ?? '').toLowerCase();
  if (s === 'closed' || s === 'complete') return 'FINAL';
  if (s === 'inprogress' || s === 'live') return 'LIVE';
  return 'UPCOMING';
}

function fmtMLBTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York',
    }) + ' ET';
  } catch {
    return '';
  }
}

function rawEntryToGame(g: RawMLBGameEntry): Game {
  const home = g.home ?? {};
  const away = g.away ?? {};
  return {
    id: String(g.id ?? ''),
    homeTeam: normalizeMLBAbr(String(home.abbr ?? '')),
    awayTeam: normalizeMLBAbr(String(away.abbr ?? '')),
    homeScore: typeof home.runs === 'number' ? home.runs : 0,
    awayScore: typeof away.runs === 'number' ? away.runs : 0,
    status: toMLBGameStatus(String(g.status ?? '')),
    startTime: fmtMLBTime(String(g.scheduled ?? '')),
    league: 'MLB',
    homeRecord: (typeof home.win === 'number' && typeof home.loss === 'number') ? `${home.win}-${home.loss}` : '',
    awayRecord: (typeof away.win === 'number' && typeof away.loss === 'number') ? `${away.win}-${away.loss}` : '',
  };
}
  let teamLogos: Record<string, string> = {};
  let apiStandings: TeamStanding[] = [];
  let powerRankings: LeagueStanding[] = [];
  let todayGames: Game[] = [];
  let featuredGame: Game | undefined;

  try {
    const teams = await getCachedMLBTeamsList();
    teamLogos = (teams as ApiTeam[]).reduce<Record<string, string>>((acc, team) => {
      if (!team.abbreviation) return acc;
      // Store under both the raw abbr and normalized key so lookups work
      const raw = team.abbreviation.toUpperCase();
      const logo = team.logoLight || team.logo || team.logoDark;
      if (logo) {
        acc[raw] = logo;
        const normalized = normalizeMLBAbr(raw);
        if (normalized !== raw) acc[normalized] = logo;
      }
      return acc;
    }, {});
  } catch {
    // fall back to TeamBadge
  }

  try {
    const raw = await getCachedMLBSportsRadarStandings() as Record<string, unknown>;
    const leagues: any[] = (raw as any)?.league?.season?.leagues ?? [];

    for (const league of leagues) {
      const leagueAlias: string = (league.alias ?? "").toUpperCase();
      for (const division of league.divisions ?? []) {
        const divisionName: string = division.name ?? "";
        for (const t of division.teams ?? []) {
          const wins: number = t.win ?? t.wins ?? 0;
          const losses: number = t.loss ?? t.losses ?? 0;
          const winP: number =
            t.win_p ?? t.win_pct ?? (wins + losses > 0 ? wins / (wins + losses) : 0);
          const gb = t.games_back === 0 ? "-" : t.games_back != null ? String(t.games_back) : "-";
          const streak = t.streak
            ? `${t.streak.kind === "win" ? "W" : "L"}${t.streak.length}`
            : "-";
          const rec = (type: string) => {
            const r = (t.records ?? []).find((x: any) => x.record_type === type);
            return r ? `${r.win}-${r.loss}` : "-";
          };

          apiStandings.push({
            rank: t.rank?.division ?? 99,
            team: `${t.market} ${t.name}`.trim(),
            abbreviation: (t.abbr ?? "").toUpperCase(),
            wins,
            losses,
            pct: winP.toFixed(3),
            gb,
            streak,
            conference: leagueAlias,
            division: divisionName,
            league: "MLB",
            home: rec("home"),
            away: rec("road"),
            last10: rec("last_10"),
          });
        }
      }
    }

    powerRankings = [...apiStandings]
      .sort((a, b) => Number.parseFloat(b.pct || "0") - Number.parseFloat(a.pct || "0"))
      .slice(0, 10)
      .map((t, i) => ({
        rank: i + 1,
        team: t.team,
        abbreviation: t.abbreviation,
        record: `${t.wins}-${t.losses}`,
        lastWeek: i + 1,
        trend: "same" as const,
        summary: `${t.wins}-${t.losses} • ${t.conference} ${t.division}`,
        league: "MLB" as const,
        wins: t.wins,
        losses: t.losses,
        pct: t.pct,
        conference: t.conference,
        division: t.division,
      }));
  } catch {
    // fall back to mock standings in LeaguePageContent
  }

  // ── today's games ──────────────────────────────────────────────────────────
  try {
    const estNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/New_York' }));
    const year  = String(estNow.getFullYear());
    const month = String(estNow.getMonth() + 1).padStart(2, '0');
    const day   = String(estNow.getDate()).padStart(2, '0');

    const [scheduleResult, boxscoreResult] = await Promise.allSettled([
      getCachedMLBDailySchedule(year, month, day),
      getCachedMLBDailyBoxscore(year, month, day),
    ]);

    const scheduleData = (scheduleResult.status === 'fulfilled' ? scheduleResult.value : {}) as { games?: RawMLBGameEntry[] };
    const boxscoreData = (boxscoreResult.status === 'fulfilled' ? boxscoreResult.value : {}) as {
      league?: { games?: Array<{ game?: RawMLBGameEntry }> };
      games?: RawMLBGameEntry[];
    };

    const rawScheduleGames: RawMLBGameEntry[] = (scheduleData.games ?? []).filter((g) => g?.id && g?.home && g?.away);
    const rawBoxGames: RawMLBGameEntry[] = [
      ...(boxscoreData.league?.games ?? []).map((item) => (item?.game ?? item) as RawMLBGameEntry),
      ...(boxscoreData.games ?? []),
    ].filter((g) => g?.id);

    // Overlay boxscore scores/status onto schedule entries
    const boxById = new Map<string, RawMLBGameEntry>(rawBoxGames.map((g) => [String(g.id), g]));
    const merged: RawMLBGameEntry[] = (rawScheduleGames.length > 0 ? rawScheduleGames : rawBoxGames).map((base) => {
      const box = boxById.get(String(base.id));
      if (!box) return base;
      return {
        ...base,
        status: box.status ?? base.status,
        home: { ...base.home, runs: box.home?.runs ?? 0 },
        away: { ...base.away, runs: box.away?.runs ?? 0 },
      };
    });

    // Sort by scheduled time (earliest first)
    merged.sort((a, b) => {
      const aT = a.scheduled ? Date.parse(a.scheduled) : Infinity;
      const bT = b.scheduled ? Date.parse(b.scheduled) : Infinity;
      return aT - bT;
    });

    todayGames = merged.map(rawEntryToGame);

    // Game of the Day = game whose two teams have the highest combined win total
    if (todayGames.length > 0) {
      const winsByAbbr: Record<string, number> = {};
      for (const team of apiStandings) {
        winsByAbbr[team.abbreviation] = team.wins;
      }
      featuredGame = todayGames.reduce((best, g) => {
        const bWins = (winsByAbbr[best.homeTeam] ?? 0) + (winsByAbbr[best.awayTeam] ?? 0);
        const gWins = (winsByAbbr[g.homeTeam] ?? 0) + (winsByAbbr[g.awayTeam] ?? 0);
        return gWins > bWins ? g : best;
      });
    }
  } catch {
    // games are non-critical; page renders without them
  }

  // TEMP DEBUG: Log teamLogos keys and all team abbreviations in standings
  if (process.env.NODE_ENV !== "production") {
    // Print all logo keys
    console.log("[MLB DEBUG] teamLogos keys:", Object.keys(teamLogos));
    // Print all abbreviations in standings
    const allAbbrs = apiStandings.map((t) => t.abbreviation);
    console.log("[MLB DEBUG] Standings abbreviations:", allAbbrs);
    // Print if WSH is present in both
    console.log("[MLB DEBUG] teamLogos['WSH']:", teamLogos["WSH"]);
    console.log("[MLB DEBUG] Standings has WSH:", allAbbrs.includes("WSH"));
  }
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LeaguePageContent
          league="MLB"
          teamLogos={teamLogos}
          standingsOverride={apiStandings.length > 0 ? apiStandings : undefined}
          rankingsOverride={powerRankings.length > 0 ? powerRankings : undefined}
          conferencesOverride={["AL", "NL"]}
          gamesOverride={todayGames.length > 0 ? todayGames : undefined}
          featuredGameOverride={featuredGame}
        />
      </main>
      <SiteFooter />
    </div>
  );
}
