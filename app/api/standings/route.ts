import { NextResponse } from 'next/server';
import { getCachedNBAStandings } from '@/lib/cachedSportsData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get('league')?.toUpperCase() || 'NBA';

  try {
    let standings;

    switch (league) {
      case 'NBA':
        standings = await getCachedNBAStandings();
        break;
      // Add NFL, MLB cases later
      default:
        return NextResponse.json(
          { error: 'Invalid league. Use NBA, NFL, or MLB' },
          { status: 400 }
        );
    }

    return NextResponse.json(standings);
  } catch (error) {
    console.error('Error fetching standings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch standings', details: error.message },
      { status: 500 }
    );
  }
}