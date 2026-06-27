import { NextResponse } from 'next/server';
import { getMLSTeamLogos } from '@/lib/sportsdb';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawTeams = searchParams.get('teams') ?? '';

    const teams = rawTeams
      .split(',')
      .map((team) => team.trim())
      .filter(Boolean);

    if (teams.length === 0) {
      return NextResponse.json({ logos: {}, source: 'espn' });
    }

    const logos = await getMLSTeamLogos(teams);
    return NextResponse.json({ logos, source: 'espn' });
  } catch (error) {
    return NextResponse.json(
      {
        logos: {},
        source: 'espn',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
