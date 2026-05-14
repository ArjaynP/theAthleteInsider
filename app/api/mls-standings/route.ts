import { NextResponse } from 'next/server';
import { mlsEasternStandings, mlsWesternStandings } from '@/lib/mls-data';

export async function GET() {
  return NextResponse.json({
    eastern: mlsEasternStandings,
    western: mlsWesternStandings,
  });
}
