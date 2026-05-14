import { NextResponse } from 'next/server';
import { mlsPlayerStats } from '@/lib/mls-data';

export async function GET() {
  return NextResponse.json({ categories: mlsPlayerStats });
}
