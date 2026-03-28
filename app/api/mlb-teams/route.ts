import { NextResponse } from 'next/server';
import { getCachedMLBTeamsList } from '@/lib/cachedSportsData';

export async function GET() {
  try {
    const teams = await getCachedMLBTeamsList();
    return NextResponse.json({ teams });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to fetch MLB teams',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
