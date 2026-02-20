import { Redis } from '@upstash/redis';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!redisUrl || !redisToken) {
  throw new Error('Missing Upstash Redis configuration. Set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN.');
}

// Initialize Redis client
export const redis = new Redis({
  url: redisUrl,
  token: redisToken,
});

// Helper function to get cached data or fetch fresh
export async function getCachedData<T>(
  key: string,
  fetchFunction: () => Promise<T>,
  ttl: number = 60 // Time to live in seconds (default 60 seconds)
): Promise<T> {
  try {
    // Try to get from cache
    const cached = await redis.get<T>(key);
    
    if (cached) {
      console.log(`✅ Cache HIT for key: ${key}`);
      return cached;
    }

    console.log(`❌ Cache MISS for key: ${key}`);
    
    // Fetch fresh data
    const freshData = await fetchFunction();
    
    // Store in cache
    await redis.setex(key, ttl, JSON.stringify(freshData));
    
    return freshData;
  } catch (error) {
    console.error('Redis error:', error);
    // If Redis fails, still return fresh data
    return fetchFunction();
  }
}