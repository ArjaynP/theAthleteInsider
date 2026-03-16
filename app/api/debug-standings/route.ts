import { NextResponse } from 'next/server';
import { fetchNBAStandings } from '@/lib/sportsApi';

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      SPORTSRADAR_API_KEY: process.env.SPORTSRADAR_API_KEY ? 'Set ✅' : 'Missing ❌',
    };

    // Fetch standings
    const standings = await fetchNBAStandings();

    return NextResponse.json({
      environmentVariables: envCheck,
      fullResponse: standings,
      dataLocation: {
        'standings.body': standings?.body ? `Array (${standings.body.length})` : 'undefined',
        'standings.response': standings?.response ? `Array (${standings.response.length})` : 'undefined', 
        'standings.data': standings?.data ? `Array (${standings.data.length})` : 'undefined',
        'standings.results': standings?.results ? `Array (${standings.results.length})` : 'undefined',
        isArray: Array.isArray(standings) ? `Array (${standings.length})` : 'Not array',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}