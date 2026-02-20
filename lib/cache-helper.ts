import { redis } from './redis';

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  LIVE_SCORES: 30,        // 30 seconds for live games
  COMPLETED_GAMES: 3600,  // 1 hour for completed games
  STANDINGS: 3600,        // 1 hour for standings
  PLAYER_STATS: 1800,     // 30 minutes for player stats
  SCHEDULE: 7200,         // 2 hours for schedule
};

// Cache key generators
export const CACHE_KEYS = {
  liveScores: (league: string) => `${league}:scores:live`,
  standings: (league: string, season: string) => `${league}:standings:${season}`,
  playerStats: (league: string, playerId: string) => `${league}:player:${playerId}`,
  schedule: (league: string, date: string) => `${league}:schedule:${date}`,
};

// Generic cache getter with automatic key generation
export async function getCached<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number
): Promise<T> {
  try {
    const cached = await redis.get<string>(key);
    
    if (cached) {
      return JSON.parse(cached) as T;
    }
    
    const fresh = await fetchFn();
    await redis.setex(key, ttl, JSON.stringify(fresh));
    
    return fresh;
  } catch (error) {
    console.error(`Cache error for key ${key}:`, error);
    return fetchFn();
  }
}

// Invalidate cache (useful when data updates)
export async function invalidateCache(pattern: string) {
  try {
    // For exact key
    await redis.del(pattern);
    console.log(`Invalidated cache: ${pattern}`);
  } catch (error) {
    console.error(`Failed to invalidate cache: ${pattern}`, error);
  }
}