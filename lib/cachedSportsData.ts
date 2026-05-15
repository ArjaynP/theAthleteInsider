import { getCached, CACHE_DURATIONS } from './cache-helper';
import { fetchNBAStandings, fetchNBATeamsList, fetchNFLStandings, fetchMLBStandings, fetchMLBSpringTrainingStandings, fetchNBARankings, fetchNBALeagueLeaders, fetchNBAPlayerHeadshots, fetchMLBSportsRadarStandings, fetchMLBSportsRadarRankings, fetchMLBTeamsList, fetchMLBDailyBoxscore, fetchMLBGameBoxscore, fetchMLBDailySchedule, fetchMLBSeasonalStatsByTeam, fetchUCLStandings, fetchUCLSeasonLeaders, fetchUCLSeasonCompetitors, fetchUCLCompetitorStats, fetchUCLSeasonSummaries, fetchUCLLiveSummaries, fetchMLSFormStandings } from './sportsApi';

export async function getCachedNBAStandings() {
  return getCached(
    'NBA:standings:current',
    fetchNBAStandings,
    CACHE_DURATIONS.STANDINGS
  );
}

export async function getCachedNBARankings() {
  return getCached(
    'NBA:rankings:current',
    fetchNBARankings,
    CACHE_DURATIONS.STANDINGS
  );
}

export async function getCachedNFLStandings() {
  return getCached(
    'NFL:standings:current',
    fetchNFLStandings,
    CACHE_DURATIONS.STANDINGS
  );
}

export async function getCachedMLBStandings() {
  return getCached(
    'MLB:standings:current',
    fetchMLBStandings,
    CACHE_DURATIONS.STANDINGS
  );
}

export async function getCachedMLBSpringTrainingStandings() {
  return getCached(
    'MLB:standings:spring',
    fetchMLBSpringTrainingStandings,
    CACHE_DURATIONS.STANDINGS
  );
}

// ...existing code...
export async function getCachedNBATeamsList() {
  return getCached(
    'NBA:teams:list',
    fetchNBATeamsList,
    60 * 60 * 24
  );
}

export async function getCachedNBALeagueLeaders() {
  return getCached(
    'NBA:leaders:players:2025',
    fetchNBALeagueLeaders,
    CACHE_DURATIONS.PLAYER_STATS
  );
}

export async function getCachedNBAPlayerHeadshots(): Promise<Record<string, string>> {
  return getCached(
    'NBA:players:headshots:v2', // v2 = diacritic-normalized keys
    fetchNBAPlayerHeadshots,
    60 * 60 * 24 // 24 hours — rosters change rarely mid-season
  ) as Promise<Record<string, string>>;
}

export async function getCachedMLBSportsRadarStandings() {
  return getCached(
    'MLB:standings:sportradar:2026',
    fetchMLBSportsRadarStandings,
    CACHE_DURATIONS.STANDINGS
  );
}

export async function getCachedMLBSportsRadarRankings() {
  return getCached(
    'MLB:rankings:sportradar:2026',
    fetchMLBSportsRadarRankings,
    CACHE_DURATIONS.STANDINGS
  );
}

export async function getCachedMLBTeamsList() {
  return getCached(
    'MLB:teams:list:v3',
    fetchMLBTeamsList,
    60 * 60 * 24
  );
}

export async function getCachedMLBDailyBoxscore(year: string, month: string, day: string) {
  return getCached(
    `MLB:daily:boxscore:${year}-${month}-${day}`,
    () => fetchMLBDailyBoxscore({ year, month, day }),
    CACHE_DURATIONS.LIVE_SCORES
  );
}

export async function getCachedMLBGameBoxscore(gameId: string) {
  return getCached(
    `MLB:game:boxscore:${gameId}`,
    () => fetchMLBGameBoxscore(gameId),
    CACHE_DURATIONS.LIVE_SCORES
  );
}

export async function getCachedMLBDailySchedule(year: string, month: string, day: string) {
  return getCached(
    `MLB:daily:schedule:${year}-${month}-${day}`,
    () => fetchMLBDailySchedule({ year, month, day }),
    CACHE_DURATIONS.LIVE_SCORES
  );
}

export async function getCachedMLBTeamSeasonalStats(teamId: string, year: number) {
  return getCached(
    `MLB:stats:team:${year}:${teamId}`,
    () => fetchMLBSeasonalStatsByTeam(teamId, year),
    CACHE_DURATIONS.STANDINGS // 1 hour
  );
}

export async function getCachedUCLStandings() {
  return getCached(
    'UCL:standings:2526',
    fetchUCLStandings,
    CACHE_DURATIONS.STANDINGS
  );
}

export async function getCachedUCLSeasonLeaders() {
  return getCached(
    'UCL:leaders:131129',
    fetchUCLSeasonLeaders,
    CACHE_DURATIONS.PLAYER_STATS // 30 minutes
  );
}

export async function getCachedUCLSeasonCompetitors() {
  return getCached(
    'UCL:season:competitors:131129',
    fetchUCLSeasonCompetitors,
    CACHE_DURATIONS.STANDINGS // 1 hour — competitor list rarely changes
  );
}

export async function getCachedUCLCompetitorStats(competitorId: string) {
  return getCached(
    `UCL:stats:competitor:${competitorId}`,
    () => fetchUCLCompetitorStats(competitorId),
    CACHE_DURATIONS.PLAYER_STATS // 30 minutes
  );
}

/**
 * All UCL season summaries, paginated automatically (100 per request).
 * TTL: 300 s (5 min) — balances freshness with Sportradar rate limits.
 */
export async function getCachedUCLSeasonSummaries(): Promise<Record<string, unknown>[]> {
  return getCached(
    'UCL:summaries:season:131129',
    async () => {
      const all: Record<string, unknown>[] = [];
      const pageSize = 100;
      let start = 0;

      while (true) {
        const page = await fetchUCLSeasonSummaries(start) as Record<string, unknown>;
        const batch = (page.summaries as Record<string, unknown>[]) ?? [];
        all.push(...batch);
        // Stop when this page returned fewer items than a full page
        if (batch.length < pageSize) break;
        start += pageSize;
      }

      return all;
    },
    300 // 5 minutes
  ) as Promise<Record<string, unknown>[]>;
}

/**
 * Currently-live soccer matches across all competitions.
 * TTL: 1 s — must stay near-real-time.
 * The caller (route) filters to UCL competition ID.
 */
export async function getCachedUCLLiveSummaries(): Promise<Record<string, unknown>[]> {
  return getCached(
    'UCL:summaries:live',
    async () => {
      const data = await fetchUCLLiveSummaries() as Record<string, unknown>;
      return (data.summaries as Record<string, unknown>[]) ?? [];
    },
    1 // 1 second
  ) as Promise<Record<string, unknown>[]>;
}

export async function getCachedMLSFormStandings() {
  return getCached(
    'MLS:standings:form:130281',
    fetchMLSFormStandings,
    CACHE_DURATIONS.STANDINGS
  );
}
