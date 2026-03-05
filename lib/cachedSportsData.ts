import { getCached, CACHE_DURATIONS } from './cache-helper';
import { fetchNBAStandings, fetchNBATeamsList } from './sportsApi';

export async function getCachedNBAStandings() {
  return getCached(
    'NBA:standings:current',
    fetchNBAStandings,
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