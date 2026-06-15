import Redis from 'ioredis';
import { Redis as UpstashRedis } from '@upstash/redis';

// Unified interface used by cache-helper.ts and this module
export type RedisCacheClient = {
  get(key: string): Promise<string | null>;
  setex(key: string, seconds: number, value: string): Promise<unknown>;
  set(key: string, value: string, exFlag?: 'EX', ttl?: number): Promise<unknown>;
  del(key: string): Promise<unknown>;
  dbsize?(): Promise<number>;
  ping?(): Promise<string>;
  exists?(key: string): Promise<number>;
};

declare global {
  // eslint-disable-next-line no-var
  var _redisClient: RedisCacheClient | undefined;
}

function createClient(): RedisCacheClient {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL;
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (upstashUrl && upstashToken) {
    // Use Upstash REST API (no TCP connection needed)
    const upstash = new UpstashRedis({ url: upstashUrl, token: upstashToken });
    return {
      async get(key: string): Promise<string | null> {
        const value = await upstash.get<unknown>(key);
        if (value === null || value === undefined) return null;
        // @upstash/redis auto-parses JSON; re-serialize to string for cache-helper compatibility
        return typeof value === 'string' ? value : JSON.stringify(value);
      },
      async setex(key: string, seconds: number, value: string): Promise<unknown> {
        // Use SET with EX option — Upstash restricts the legacy SETEX command
        return upstash.set(key, value, { ex: seconds });
      },
      async set(key: string, value: string, exFlag?: 'EX', ttl?: number): Promise<unknown> {
        if (exFlag === 'EX' && ttl) return upstash.set(key, value, { ex: ttl });
        return upstash.set(key, value);
      },
      async del(key: string): Promise<unknown> {
        return upstash.del(key);
      },
    };
  }

  // Fall back to ioredis (local Redis)
  const redisUrl = process.env.REDIS_URL;
  const client = redisUrl
    ? new Redis(redisUrl, {
        connectTimeout: 2000,
        maxRetriesPerRequest: 0,
        enableOfflineQueue: false,
      })
    : new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
        tls: process.env.REDIS_TLS === 'true' ? {} : undefined,
        lazyConnect: true,
        connectTimeout: 2000,
        maxRetriesPerRequest: 0,
        enableOfflineQueue: false,
      });

  client.on('error', (err) => {
    console.error('[redis] connection error', err);
  });

  return client as unknown as RedisCacheClient;
}

export const redis = global._redisClient ?? createClient();
if (process.env.NODE_ENV !== 'production') {
  global._redisClient = redis;
}

export async function getCache<T>(key: string): Promise<T | null> {
  const cached = await redis.get(key);
  if (!cached) return null;

  try {
    return JSON.parse(cached) as T;
  } catch {
    return cached as unknown as T;
  }
}

export async function setCache<T>(key: string, value: T, ttlSeconds?: number) {
  const payload = typeof value === 'string' ? value : JSON.stringify(value);
  if (ttlSeconds && ttlSeconds > 0) {
    await redis.set(key, payload, 'EX', ttlSeconds);
  } else {
    await redis.set(key, payload);
  }
}

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) return cached;

  const fresh = await fetcher();
  await setCache(key, fresh, ttlSeconds);
  return fresh;
}

export async function invalidateCache(key: string) {
  await redis.del(key);
}
