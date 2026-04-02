import { getCached, CACHE_DURATIONS } from './cache-helper';
import { fetchNBAStandings, fetchNBATeamsList, fetchNFLStandings, fetchMLBStandings, fetchMLBSpringTrainingStandings, fetchNBARankings, fetchNBALeagueLeaders, fetchNBAPlayerHeadshots, fetchMLBSportsRadarStandings, fetchMLBSportsRadarRankings, fetchMLBTeamsList, fetchMLBDailyBoxscore, fetchMLBGameBoxscore, fetchMLBDailySchedule, fetchMLBSeasonalStatsByTeam } from './sportsApi';

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
