import { redis } from '@/services/cacheService';

let cacheWriteDisabled = false;
let cacheWriteDisableReason = '';

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
  // Try reading from cache — failures skip the cache (don't throw)
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
  } catch (readError) {
    console.warn(`Cache read skipped for key ${key}:`, (readError as Error).message);
  }

  // Fetch fresh data
  const fresh = await fetchFn();

  // Don't cache empty arrays, nullish values, or empty strings to prevent stale empty cache entries
  const isEmpty = fresh === null || fresh === undefined || fresh === '' ||
    (Array.isArray(fresh) && (fresh as unknown[]).length === 0);

  if (!isEmpty) {
    if (cacheWriteDisabled) {
      return fresh;
    }

    // Write failures are non-fatal — app continues without caching
    try {
      await redis.setex(key, ttl, JSON.stringify(fresh));
    } catch (writeError) {
      const message = (writeError as Error).message;
      if (message.includes('NOPERM')) {
        cacheWriteDisabled = true;
        cacheWriteDisableReason = message;
        console.warn('Cache writes disabled for this process (Redis NOPERM). Reads still work.');
      } else {
        console.warn(`Cache write skipped for key ${key}:`, message);
      }
    }
  }

  return fresh;
}

// Invalidate cache (useful when data updates)
export async function invalidateCache(pattern: string) {
  if (cacheWriteDisabled) {
    console.warn(`Cache invalidation skipped (writes disabled): ${cacheWriteDisableReason}`);
    return;
  }

  try {
    // For exact key
    await redis.del(pattern);
    console.log(`Invalidated cache: ${pattern}`);
  } catch (error) {
    console.error(`Failed to invalidate cache: ${pattern}`, error);
  }
}