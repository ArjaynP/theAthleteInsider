import { NextResponse } from 'next/server';
import { getCachedMLBDailyBoxscore, getCachedMLBDailySchedule, getCachedMLBGameBoxscore } from '@/lib/cachedSportsData';

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

type RawScheduleGame = {
  id?: string;
  status?: string;
  scheduled?: string;
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
  currentPitcher?: string;
  currentBatter?: string;
  outs?: number;
  balls?: number;
  strikes?: number;
  bases?: {
    first: boolean;
    second: boolean;
    third: boolean;
  };
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

function toNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  }
  return undefined;
}

function playerName(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const obj = value as Record<string, unknown>;
  if (typeof obj.full_name === 'string' && obj.full_name) return obj.full_name;
  const preferred = typeof obj.preferred_name === 'string' ? obj.preferred_name : undefined;
  const last = typeof obj.last_name === 'string' ? obj.last_name : undefined;
  if (preferred && last) return `${preferred} ${last}`;
  return undefined;
}

function extractBasesFromRunners(value: unknown) {
  const bases = { first: false, second: false, third: false };
  if (!Array.isArray(value)) return bases;
  for (const runner of value) {
    if (!runner || typeof runner !== 'object') continue;
    const r = runner as Record<string, unknown>;
    const base = toNumber(r.base ?? r.current_base ?? r.starting_base);
    if (base === 1) bases.first = true;
    if (base === 2) bases.second = true;
    if (base === 3) bases.third = true;
  }
  return bases;
}

function extractLiveDetails(value: unknown) {
  const src = (value && typeof value === 'object') ? value as Record<string, unknown> : {};
  const situation = (src.situation && typeof src.situation === 'object')
    ? src.situation as Record<string, unknown>
    : {};
  const atBat = (src.at_bat && typeof src.at_bat === 'object')
    ? src.at_bat as Record<string, unknown>
    : {};
  const count = (atBat.count && typeof atBat.count === 'object')
    ? atBat.count as Record<string, unknown>
    : {};

  const outs =
    toNumber(src.outs) ??
    toNumber(situation.outs) ??
    toNumber(atBat.outs);
  const balls =
    toNumber(src.balls) ??
    toNumber(situation.balls) ??
    toNumber(count.balls);
  const strikes =
    toNumber(src.strikes) ??
    toNumber(situation.strikes) ??
    toNumber(count.strikes);

  const currentPitcher =
    playerName(src.current_pitcher) ??
    playerName(situation.pitcher) ??
    playerName(src.pitcher) ??
    playerName((src.defense as Record<string, unknown> | undefined)?.pitcher);
  const currentBatter =
    playerName(src.current_batter) ??
    playerName(atBat.hitter) ??
    playerName(situation.hitter) ??
    playerName((src.offense as Record<string, unknown> | undefined)?.batter);

  const basesFromFlags = {
    first: Boolean(src.on_first ?? situation.on_first),
    second: Boolean(src.on_second ?? situation.on_second),
    third: Boolean(src.on_third ?? situation.on_third),
  };
  const runnerBases = extractBasesFromRunners(src.runners ?? situation.runners ?? atBat.runners);
  const bases = {
    first: basesFromFlags.first || runnerBases.first,
    second: basesFromFlags.second || runnerBases.second,
    third: basesFromFlags.third || runnerBases.third,
  };

  return {
    currentPitcher,
    currentBatter,
    outs,
    balls,
    strikes,
    bases,
  };
}

function mapScheduleGame(g: RawScheduleGame): MLBScoreGame {
  const home = g.home ?? {};
  const away = g.away ?? {};
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
    homeScore: 0,
    awayScore: 0,
    status,
    quarter: undefined,
    time: undefined,
    startTime: formatLocalTime(String(g.scheduled ?? '')),
    league: 'MLB',
    homeRecord,
    awayRecord,
    bases: { first: false, second: false, third: false },
  };
}

function mapBoxscoreGame(g: RawGame): MLBScoreGame {
  const home = g.home as RawTeam;
  const away = g.away as RawTeam;
  const status = toMlbStatus(String(g.status ?? ''));
  const liveDetails = extractLiveDetails(g as RawGame & Record<string, unknown>);
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
    currentPitcher: liveDetails.currentPitcher,
    currentBatter: liveDetails.currentBatter,
    outs: liveDetails.outs,
    balls: liveDetails.balls,
    strikes: liveDetails.strikes,
    bases: liveDetails.bases ?? { first: false, second: false, third: false },
  };
}

async function enhanceLiveGame(game: MLBScoreGame): Promise<MLBScoreGame> {
  if (game.status !== 'LIVE') return game;

  try {
    const boxscore = (await getCachedMLBGameBoxscore(game.id)) as { game?: RawGame & Record<string, unknown> };
    const liveGame = normalizeRawGame((boxscore?.game ?? {}) as RawGame);
    const liveDetails = extractLiveDetails(boxscore?.game);
    const home = liveGame.home ?? {};
    const away = liveGame.away ?? {};

    return {
      ...game,
      homeScore: typeof home.runs === 'number' ? home.runs : game.homeScore,
      awayScore: typeof away.runs === 'number' ? away.runs : game.awayScore,
      quarter: formatInning(liveGame.inning_half, liveGame.inning) ?? game.quarter,
      currentPitcher: liveDetails.currentPitcher ?? game.currentPitcher,
      currentBatter: liveDetails.currentBatter ?? game.currentBatter,
      outs: liveDetails.outs ?? game.outs,
      balls: liveDetails.balls ?? game.balls,
      strikes: liveDetails.strikes ?? game.strikes,
      bases: liveDetails.bases ?? game.bases,
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
    const [scheduleResult, boxscoreResult] = await Promise.allSettled([
      getCachedMLBDailySchedule(year, month, day),
      getCachedMLBDailyBoxscore(year, month, day),
    ]);

    const scheduleRaw = scheduleResult.status === 'fulfilled'
      ? scheduleResult.value as { games?: RawScheduleGame[] }
      : {};

    const boxscoreRaw = boxscoreResult.status === 'fulfilled'
      ? boxscoreResult.value as { league?: { games?: Array<{ game?: RawGame }> }; games?: RawGame[] }
      : {};

    const scheduleGames = (scheduleRaw?.games ?? [])
      .filter((g) => g?.id && g?.home && g?.away)
      .map(mapScheduleGame);

    const boxscoreGames: MLBScoreGame[] = (
      (boxscoreRaw?.league?.games ?? []).map((item) => normalizeRawGame((item?.game ?? item) as RawGame))
    ).concat((boxscoreRaw?.games ?? []).map((g) => normalizeRawGame(g)))
      .filter((g) => g?.id && g?.home && g?.away)
      .map(mapBoxscoreGame);

    const boxById = new Map<string, MLBScoreGame>(boxscoreGames.map((g) => [g.id, g]));

    const merged = scheduleGames.length > 0
      ? scheduleGames.map((base) => {
        const overlay = boxById.get(base.id);
        if (!overlay) return base;
        return {
          ...base,
          homeScore: overlay.homeScore,
          awayScore: overlay.awayScore,
          status: overlay.status,
          quarter: overlay.quarter,
          startTime: base.startTime || overlay.startTime,
          homeRecord: base.homeRecord || overlay.homeRecord,
          awayRecord: base.awayRecord || overlay.awayRecord,
        };
      })
      : boxscoreGames;

    const games = await Promise.all(merged.map(enhanceLiveGame));

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
