import Redis from 'ioredis';

// Prefer a single URL (works with rediss://:password@host:port) but allow host/port fallback
const redisUrl = process.env.REDIS_URL;
const redisHost = process.env.REDIS_HOST || '127.0.0.1';
const redisPort = Number(process.env.REDIS_PORT) || 6379;
const redisPassword = process.env.REDIS_PASSWORD;
const useTls = process.env.REDIS_TLS === 'true';

type RedisClient = ReturnType<typeof createClient>;

declare global {
  // eslint-disable-next-line no-var
  var _redisClient: RedisClient | undefined;
}

function createClient() {
  const client = redisUrl
    ? new Redis(redisUrl)
    : new Redis({
        host: redisHost,
        port: redisPort,
        password: redisPassword,
        tls: useTls ? {} : undefined,
        lazyConnect: true,
      });

  client.on('error', (err) => {
    console.error('[redis] connection error', err);
  });

  return client;
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
