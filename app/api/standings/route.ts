import { NextResponse } from 'next/server';
import { getCachedNBAStandings, getCachedNFLStandings, getCachedMLBStandings, getCachedMLBSpringTrainingStandings } from '@/lib/cachedSportsData';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get('league')?.toUpperCase() || 'NBA';

  try {
    let standings;

    switch (league) {
      case 'NBA':
        standings = await getCachedNBAStandings();
        break;
      case 'NFL':
        standings = await getCachedNFLStandings();
        break;
      case 'MLB':
        standings = await getCachedMLBStandings();
        break;
      case 'MLB_SPRING':
        standings = await getCachedMLBSpringTrainingStandings();
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid league. Use NBA, NFL, or MLB' },
          { status: 400 }
        );
    }

    return NextResponse.json({ teams: standings });
  } catch (error) {
    console.error('Error fetching standings:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch standings', details: message },
      { status: 500 }
    );
  }
}