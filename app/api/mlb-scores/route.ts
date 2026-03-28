import { NextResponse } from 'next/server';
import { getCachedMLBDailyBoxscore, getCachedMLBGameBoxscore } from '@/lib/cachedSportsData';

type RawTeam = {
  abbr?: string;
  runs?: number;
  win?: number;
  loss?: number;
};

type RawGame = {
  id?: string;
  status?: string;
  scheduled?: string;
  inning?: number;
  inning_half?: string;
  game?: {
    id?: string;
    status?: string;
    scheduled?: string;
    inning?: number;
    inning_half?: string;
    home?: RawTeam;
    away?: RawTeam;
  };
  home?: RawTeam;
  away?: RawTeam;
};

type MLBScoreGame = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'LIVE' | 'FINAL' | 'UPCOMING';
  quarter?: string;
  time?: string;
  startTime?: string;
  league: 'MLB';
  homeRecord: string;
  awayRecord: string;
};

const MLB_EXTRA_ABBR_KEYS: Record<string, string> = {
  ARI: 'AZ',
  CHW: 'CWS',
  TBR: 'TB',
  KCR: 'KC',
  SDP: 'SD',
  SFG: 'SF',
  WSN: 'WSH',
};

function normalizeAbbreviation(value: string) {
  const upper = value.toUpperCase();
  return MLB_EXTRA_ABBR_KEYS[upper] ?? upper;
}

function toMlbStatus(value: string): MLBScoreGame['status'] {
  const status = value.toLowerCase();
  if (status === 'closed' || status === 'complete') return 'FINAL';
  if (status === 'inprogress' || status === 'live') return 'LIVE';
  return 'UPCOMING';
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

function formatInning(half?: string, inning?: number): string | undefined {
  if (!inning || !half) return undefined;
  const halfLabel = half === 'T' ? 'TOP' : half === 'B' ? 'BOT' : undefined;
  if (!halfLabel) return undefined;
  return `${halfLabel} ${inning}`;
}

function getEasternDateString(now = new Date()): string {
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

function normalizeRawGame(raw: RawGame): RawGame {
  if (raw.game) {
    return {
      id: raw.game.id ?? raw.id,
      status: raw.game.status ?? raw.status,
      scheduled: raw.game.scheduled ?? raw.scheduled,
      inning: raw.game.inning ?? raw.inning,
      inning_half: raw.game.inning_half ?? raw.inning_half,
      home: raw.game.home ?? raw.home,
      away: raw.game.away ?? raw.away,
    };
  }
  return raw;
}

async function enhanceLiveGame(game: MLBScoreGame): Promise<MLBScoreGame> {
  if (game.status !== 'LIVE') return game;

  try {
    const boxscore = (await getCachedMLBGameBoxscore(game.id)) as { game?: RawGame };
    const liveGame = normalizeRawGame((boxscore?.game ?? {}) as RawGame);
    const home = liveGame.home ?? {};
    const away = liveGame.away ?? {};

    return {
      ...game,
      homeScore: typeof home.runs === 'number' ? home.runs : game.homeScore,
      awayScore: typeof away.runs === 'number' ? away.runs : game.awayScore,
      quarter: formatInning(liveGame.inning_half, liveGame.inning) ?? game.quarter,
    };
  } catch {
    return game;
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const requestedDate = searchParams.get('date') ?? getEasternDateString();
  const date = /^\d{4}-\d{2}-\d{2}$/.test(requestedDate) ? requestedDate : getEasternDateString();
  const [year, month, day] = date.split('-');

  try {
    const raw = (await getCachedMLBDailyBoxscore(year, month, day)) as {
      league?: { games?: Array<{ game?: RawGame }> };
      games?: RawGame[];
    };

    const dailyGames: RawGame[] = (raw?.league?.games ?? [])
      .map((item) => normalizeRawGame((item?.game ?? item) as RawGame));

    const fallbackGames: RawGame[] = (raw?.games ?? []).map((g) => normalizeRawGame(g));
    const sourceGames = dailyGames.length > 0 ? dailyGames : fallbackGames;

    const mapped: MLBScoreGame[] = sourceGames
      .filter((g) => g?.id && g?.home && g?.away)
      .map((g) => {
        const home = g.home as RawTeam;
        const away = g.away as RawTeam;
        const status = toMlbStatus(String(g.status ?? ''));
        const homeRecord = (typeof home.win === 'number' && typeof home.loss === 'number')
          ? `${home.win}-${home.loss}`
          : '';
        const awayRecord = (typeof away.win === 'number' && typeof away.loss === 'number')
          ? `${away.win}-${away.loss}`
          : '';

        return {
          id: String(g.id),
          homeTeam: normalizeAbbreviation(String(home.abbr ?? '')),
          awayTeam: normalizeAbbreviation(String(away.abbr ?? '')),
          homeScore: typeof home.runs === 'number' ? home.runs : 0,
          awayScore: typeof away.runs === 'number' ? away.runs : 0,
          status,
          quarter: status === 'LIVE' ? formatInning(g.inning_half, g.inning) : undefined,
          time: undefined,
          startTime: formatLocalTime(String(g.scheduled ?? '')),
          league: 'MLB',
          homeRecord,
          awayRecord,
        };
      });

    const games = await Promise.all(mapped.map(enhanceLiveGame));

    return NextResponse.json({ games, date });
  } catch (error) {
    return NextResponse.json(
      {
        games: [],
        date,
        error: error instanceof Error ? error.message : 'Failed to fetch MLB scores',
      },
      { status: 200 }
    );
  }
}
