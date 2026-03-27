import { getCached, CACHE_DURATIONS } from './cache-helper';
import { fetchNBAStandings, fetchNBATeamsList, fetchNFLStandings, fetchMLBStandings, fetchMLBSpringTrainingStandings, fetchNBARankings } from './sportsApi';

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