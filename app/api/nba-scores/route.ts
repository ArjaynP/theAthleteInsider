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

function getEasternDateString(now = new Date()): string {
  // Force schedule date selection to ET (GMT-4 / GMT-5 with DST).
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const year = parts.find((p) => p.type === 'year')?.value;
  const month = parts.find((p) => p.type === 'month')?.value;
  const day = parts.find((p) => p.type === 'day')?.value;

  return `${year}-${month}-${day}`;
}

function formatQuarter(value: unknown): string | undefined {
  if (value == null) return undefined;
  const raw = String(value).trim();
  if (!raw) return undefined;
  if (/^q\d+$/i.test(raw)) return raw.toUpperCase();
  if (/^\d+$/.test(raw)) return `Q${raw}`;
  return raw.toUpperCase();
}

async function fetchLiveSummary(
  gameId: string,
  apiKey: string
): Promise<{ homeScore?: number; awayScore?: number; quarter?: string; time?: string }> {
  const summaryUrl = `https://api.sportradar.com/nba/trial/v8/en/games/${gameId}/summary.json?api_key=${apiKey}`;
  const summaryRes = await fetch(summaryUrl, {
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!summaryRes.ok) return {};

  const summary = (await summaryRes.json()) as Record<string, any>;
  const game = summary?.game ?? summary;

  const homeScore =
    game?.home?.points ??
    game?.home?.scoring ??
    game?.home_points;
  const awayScore =
    game?.away?.points ??
    game?.away?.scoring ??
    game?.away_points;

  return {
    homeScore: typeof homeScore === 'number' ? homeScore : undefined,
    awayScore: typeof awayScore === 'number' ? awayScore : undefined,
    quarter: formatQuarter(game?.quarter ?? game?.period),
    time: typeof game?.clock === 'string' ? game.clock : undefined,
  };
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
  const date = searchParams.get('date') ?? getEasternDateString();
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

  const baseGames: NBAScoreGame[] = rawGames.map((g) => {
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
    const quarter = formatQuarter((g.quarter as string | undefined) ?? (g.period as number | undefined));
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

  const games = await Promise.all(
    baseGames.map(async (game) => {
      if (game.status !== 'LIVE') return game;

      try {
        const summary = await fetchLiveSummary(game.id, apiKey);
        return {
          ...game,
          homeScore: summary.homeScore ?? game.homeScore,
          awayScore: summary.awayScore ?? game.awayScore,
          quarter: summary.quarter ?? game.quarter,
          time: summary.time ?? game.time,
        };
      } catch {
        return game;
      }
    })
  );

  return NextResponse.json({ games, date });
}
