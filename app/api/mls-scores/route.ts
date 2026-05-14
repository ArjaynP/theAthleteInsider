import { NextResponse } from 'next/server';
import { mlsMatches, MLS_CURRENT_MATCHWEEK } from '@/lib/mls-data';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const matchweekParam = searchParams.get('matchweek');
  const matchweek = matchweekParam ? parseInt(matchweekParam, 10) : MLS_CURRENT_MATCHWEEK;

  const matches = mlsMatches[matchweek] ?? [];

  return NextResponse.json({ matches, matchweek });
}
