import { redis, withCache } from '@/services/cacheService';

export { redis };

export async function getCachedData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  ttl: number = 60
): Promise<T> {
  return withCache(key, ttl, fetchFunction);
}