import { NextResponse } from 'next/server';

const ALIAS_OVERRIDES: Record<string, string> = {
  GS: 'GSW', NY: 'NYK', NO: 'NOP', SA: 'SAS', WSH: 'WAS',
};

function norm(alias: string): string {
  const upper = (alias ?? '').toUpperCase();
  return ALIAS_OVERRIDES[upper] ?? upper;
}

function formatLocalTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York',
    }) + ' ET';
  } catch {
    return '';
  }
}

export type NBAScoreGame = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'FINAL' | 'UPCOMING';
  quarter?: string;
  time?: string;
  startTime?: string;
  league: 'NBA';
  homeRecord: string;
  awayRecord: string;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // date param: YYYY-MM-DD
  const date = searchParams.get('date') ?? new Date().toISOString().slice(0, 10);
  const [year, month, day] = date.split('-');

  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const url = `https://api.sportradar.com/nba/trial/v8/en/games/${year}/${month}/${day}/schedule.json?api_key=${apiKey}`;

  let raw: Record<string, unknown>;
  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
    if (!res.ok) {
      return NextResponse.json({ games: [], error: `Sportradar ${res.status}` });
    }
    raw = await res.json();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ games: [], error: message });
  }

  const rawGames = (raw.games as Array<Record<string, unknown>>) ?? [];

  const games: NBAScoreGame[] = rawGames.map((g) => {
    const srStatus = String(g.status || '').toLowerCase();
    let status: NBAScoreGame['status'] = 'UPCOMING';
    if (srStatus === 'closed' || srStatus === 'complete') status = 'FINAL';
    else if (srStatus === 'inprogress') status = 'LIVE';

    const home = g.home as Record<string, unknown>;
    const away = g.away as Record<string, unknown>;

    const homeAlias = norm(String(home?.alias ?? ''));
    const awayAlias = norm(String(away?.alias ?? ''));

    const homeScore = (g.home_points as number) ?? 0;
    const awayScore = (g.away_points as number) ?? 0;

    // quarter / clock info only present in live game objects
    const quarter = (g.quarter as string | undefined)
      ? `Q${g.quarter}`
      : (g.period as number)
        ? `Q${g.period}`
        : undefined;
    const clock = (g.clock as string | undefined) ?? undefined;

    const startTime = formatLocalTime(String(g.scheduled ?? ''));

    return {
      id: String(g.id),
      homeTeam: homeAlias,
      awayTeam: awayAlias,
      homeScore,
      awayScore,
      status,
      quarter,
      time: clock,
      startTime,
      league: 'NBA',
      // records not available on schedule endpoint – show empty
      homeRecord: '',
      awayRecord: '',
    };
  });

  return NextResponse.json({ games, date });
}
