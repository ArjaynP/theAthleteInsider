import { getCached, CACHE_DURATIONS } from './cache-helper';
import { fetchNBAStandings } from './sportsApi';

export async function getCachedNBAStandings() {
  return getCached(
    'NBA:standings:current',
    fetchNBAStandings,
    CACHE_DURATIONS.STANDINGS
  );
}