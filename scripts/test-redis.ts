import 'dotenv/config';
import { redis, getCache, setCache } from '../services/cacheService';

async function testRedis() {
  console.log('Testing Redis connection...\n');

  try {
    await redis.ping();
    console.log('✅ PING Redis');

    // Test 1: Set a value
    await redis.set('test-key', 'Hello from Redis!');
    console.log('✅ SET test-key');

    // Test 2: Get the value
    const value = await redis.get('test-key');
    console.log('✅ GET test-key:', value);

    // Test 3: Set with expiration (5 seconds)
    await redis.setex('expire-test', 5, 'This will expire in 5 seconds');
    console.log('✅ SET expire-test with 5s TTL');

    // Test 4: Check if key exists
    const exists = await redis.exists('test-key');
    console.log('✅ EXISTS test-key:', exists === 1);

    // Test 5: Delete a key
    await redis.del('test-key');
    console.log('✅ DEL test-key');

    // Test 6: Verify deletion
    const deleted = await redis.get('test-key');
    console.log('✅ GET test-key after delete:', deleted === null ? 'null (deleted)' : deleted);

    // Test 7: Service helpers set/get JSON with TTL
    await setCache('json-test', { ok: true, at: new Date().toISOString() }, 30);
    const jsonValue = await getCache<{ ok: boolean; at: string }>('json-test');
    console.log('✅ service set/get JSON:', jsonValue?.ok === true);
    await redis.del('json-test');

    console.log('\n🎉 All Redis tests passed!');
  } catch (error) {
    console.error('❌ Redis test failed:', error);
    process.exit(1);
  }
}

testRedis();