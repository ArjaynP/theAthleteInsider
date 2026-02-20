import { NextResponse } from 'next/server';
import { redis, getCachedData } from '@/lib/redis';

export async function GET() {
  try {
    // Simulate an expensive API call
    const fetchExpensiveData = async () => {
      console.log('Fetching expensive data...');
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
      return {
        timestamp: new Date().toISOString(),
        data: 'This is expensive data!',
      };
    };

    // Get cached or fresh data (cached for 30 seconds)
    const data = await getCachedData(
      'expensive-data-key',
      fetchExpensiveData,
      30
    );

    // Get cache stats
    const cacheSize = await redis.dbsize();

    return NextResponse.json({
      data,
      cacheInfo: {
        totalKeys: cacheSize,
        note: 'Refresh within 30 seconds to see cache in action',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}