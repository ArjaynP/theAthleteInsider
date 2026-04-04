import { NextResponse } from 'next/server';
import { getCachedUCLStandings } from '@/lib/cachedSportsData';

export async function GET() {
  try {
    const raw = await getCachedUCLStandings() as Record<string, unknown>;
    // SportsRadar returns { generated_at, standings: [...] }
    const standings = (raw as any).standings ?? [];
    return NextResponse.json({ standings });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch UCL standings', details: message },
      { status: 500 }
    );
  }
}
