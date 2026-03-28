import { NextResponse } from 'next/server';
import { getCachedNBAPlayerHeadshots } from '@/lib/cachedSportsData';

export async function GET() {
  try {
    const headshots = await getCachedNBAPlayerHeadshots();
    return NextResponse.json({ headshots });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('NBA Players headshots API error:', message);
    // Return empty map so the UI degrades gracefully
    return NextResponse.json({ headshots: {} }, { status: 500 });
  }
}
