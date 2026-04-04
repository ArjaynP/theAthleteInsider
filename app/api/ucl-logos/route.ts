import { NextRequest, NextResponse } from 'next/server';
import { getTeamLogos } from '@/lib/sportsdb';

export async function POST(req: NextRequest) {
  try {
    const { names } = await req.json();
    if (!Array.isArray(names)) {
      return NextResponse.json({ error: 'names must be an array' }, { status: 400 });
    }
    const logos = await getTeamLogos(names as string[]);
    return NextResponse.json({ logos });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch logos', details: message }, { status: 500 });
  }
}