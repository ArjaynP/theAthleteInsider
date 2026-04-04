import { NextResponse } from 'next/server';
import { getCachedMLBDailyBoxscore, getCachedMLBDailySchedule, getCachedMLBGameBoxscore } from '@/lib/cachedSportsData';

type RawTeam = {
  abbr?: string;
  runs?: number;
  win?: number;
  loss?: number;
  events?: unknown[];
  [key: string]: unknown;
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
  [key: string]: unknown;
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
  const normalizedHalf = normalizeInningHalf(half);
  const halfLabel = normalizedHalf === 'T' ? 'TOP' : normalizedHalf === 'B' ? 'BOT' : undefined;
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
  const nestedGame = raw.game && typeof raw.game === 'object'
    ? raw.game
    : undefined;

  if (nestedGame) {
    const merged: RawGame = {
      ...(raw as Record<string, unknown>),
      ...(nestedGame as Record<string, unknown>),
    };
    merged.id = nestedGame.id ?? raw.id;
    merged.status = nestedGame.status ?? raw.status;
    merged.scheduled = nestedGame.scheduled ?? raw.scheduled;
    merged.inning = nestedGame.inning ?? raw.inning;
    merged.inning_half = nestedGame.inning_half ?? raw.inning_half;
    merged.home = nestedGame.home ?? raw.home;
    merged.away = nestedGame.away ?? raw.away;
    return merged;
  }
  return raw;
}

function asObject(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, unknown>
    : undefined;
}

function normalizeInningHalf(value: unknown): 'T' | 'B' | undefined {
  if (typeof value !== 'string') return undefined;
  const normalized = value.trim().toUpperCase();
  if (normalized === 'T' || normalized === 'TOP') return 'T';
  if (normalized === 'B' || normalized === 'BOT' || normalized === 'BOTTOM') return 'B';
  return undefined;
}

function collectEvents(src: Record<string, unknown>) {
  const allEvents: Record<string, unknown>[] = [];
  const pushEvents = (value: unknown) => {
    if (!Array.isArray(value)) return;
    for (const item of value) {
      const event = asObject(item);
      if (event) allEvents.push(event);
    }
  };

  pushEvents(src.events);
  pushEvents(asObject(src.home)?.events);
  pushEvents(asObject(src.away)?.events);

  return allEvents;
}

function selectCurrentEvent(
  events: Array<Record<string, unknown>>,
  inning?: number,
  inningHalf?: 'T' | 'B'
) {
  let latestMatch: Record<string, unknown> | undefined;
  for (const event of events) {
    const eventInning = toNumber(event.inning);
    const eventHalf = normalizeInningHalf(event.inning_half ?? event.half_inning);
    const inningMatch = inning === undefined || eventInning === inning;
    const halfMatch = inningHalf === undefined || eventHalf === inningHalf;
    if (inningMatch && halfMatch) latestMatch = event;
  }
  if (latestMatch) return latestMatch;
  return events.length > 0 ? events[events.length - 1] : undefined;
}

function buildPlayerNameIndex(value: unknown) {
  const namesById = new Map<string, string>();
  const seen = new Set<unknown>();

  const visit = (node: unknown, depth: number) => {
    if (depth > 6 || !node || typeof node !== 'object' || seen.has(node)) return;
    seen.add(node);

    if (Array.isArray(node)) {
      for (const child of node) visit(child, depth + 1);
      return;
    }

    const obj = node as Record<string, unknown>;
    const id = typeof obj.id === 'string' ? obj.id : undefined;
    const name = playerName(obj);
    if (id && name && !namesById.has(id)) namesById.set(id, name);

    for (const child of Object.values(obj)) {
      if (!child || typeof child !== 'object') continue;
      visit(child, depth + 1);
    }
  };

  visit(value, 0);
  return namesById;
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
  const src = asObject(value) ?? {};
  const situation = asObject(src.situation) ?? {};
  const atBat = asObject(src.at_bat) ?? {};
  const count = asObject(atBat.count) ?? {};
  // Some SportsRadar responses nest live state under linescore or game_detail
  const linescore = asObject(src.linescore) ?? {};
  const gameDetail = asObject(src.game_detail) ?? {};
  const currentInning = asObject(linescore.current_inning) ?? {};

  const inning =
    toNumber(src.inning) ??
    toNumber(situation.inning) ??
    toNumber(atBat.inning) ??
    toNumber(linescore.inning) ??
    toNumber(currentInning.number) ??
    toNumber(gameDetail.inning);

  const inningHalf =
    normalizeInningHalf(src.inning_half ?? src.half_inning) ??
    normalizeInningHalf(situation.inning_half ?? situation.half_inning) ??
    normalizeInningHalf(atBat.inning_half ?? atBat.half_inning) ??
    normalizeInningHalf(linescore.inning_half ?? linescore.half_inning) ??
    normalizeInningHalf(currentInning.half ?? currentInning.inning_half) ??
    normalizeInningHalf(gameDetail.inning_half ?? gameDetail.half_inning);

  const events = collectEvents(src);
  const currentEvent = selectCurrentEvent(events, inning, inningHalf);
  const namesById = buildPlayerNameIndex(src);
  const eventPitcherId = typeof currentEvent?.pitcher_id === 'string' ? currentEvent.pitcher_id : undefined;
  const eventHitterId = typeof currentEvent?.hitter_id === 'string' ? currentEvent.hitter_id : undefined;

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
    playerName(asObject(src.defense)?.pitcher) ??
    playerName(currentEvent?.pitcher) ??
    (eventPitcherId ? namesById.get(eventPitcherId) : undefined);
  const currentBatter =
    playerName(src.current_batter) ??
    playerName(atBat.hitter) ??
    playerName(situation.hitter) ??
    playerName(asObject(src.offense)?.batter) ??
    playerName(currentEvent?.hitter) ??
    (eventHitterId ? namesById.get(eventHitterId) : undefined);

  const situationBases = asObject(situation.bases) ?? {};
  const atBatBases = asObject(atBat.bases) ?? {};

  const basesFromFlags = {
    first: Boolean(src.on_first ?? situation.on_first ?? situationBases.first ?? atBatBases.first),
    second: Boolean(src.on_second ?? situation.on_second ?? situationBases.second ?? atBatBases.second),
    third: Boolean(src.on_third ?? situation.on_third ?? situationBases.third ?? atBatBases.third),
  };
  const runnerBases = extractBasesFromRunners(
    src.runners ??
    situation.runners ??
    atBat.runners ??
    currentEvent?.runners
  );
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
    inning,
    inning_half: inningHalf,
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
  const home = (g.home ?? {}) as RawTeam;
  const away = (g.away ?? {}) as RawTeam;
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
    quarter: status === 'LIVE'
      ? (
        formatInning(liveDetails.inning_half, liveDetails.inning) ??
        formatInning(g.inning_half, g.inning)
      )
      : undefined,
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

function toScheduledTimestamp(value: unknown): number {
  if (typeof value !== 'string' || !value.trim()) return Number.POSITIVE_INFINITY;
  const timestamp = Date.parse(value);
  return Number.isNaN(timestamp) ? Number.POSITIVE_INFINITY : timestamp;
}

async function enhanceLiveGame(game: MLBScoreGame): Promise<MLBScoreGame> {
  if (game.status !== 'LIVE') return game;

  try {
    const boxscore = (await getCachedMLBGameBoxscore(game.id)) as { game?: RawGame & Record<string, unknown> } | RawGame;
    const boxscoreObj = asObject(boxscore) ?? {};
    const normalizedSource = normalizeRawGame(
      (asObject(boxscoreObj.game)
        ? boxscoreObj
        : { game: boxscoreObj }) as RawGame
    );
    const liveGame = normalizedSource;
    const liveDetails = extractLiveDetails(normalizedSource);
    const home = liveGame.home ?? {};
    const away = liveGame.away ?? {};
    const status = toMlbStatus(String(liveGame.status ?? game.status));

    return {
      ...game,
      status,
      homeScore: typeof home.runs === 'number' ? home.runs : game.homeScore,
      awayScore: typeof away.runs === 'number' ? away.runs : game.awayScore,
      quarter: status === 'LIVE'
        ? (
          formatInning(liveDetails.inning_half, liveDetails.inning) ??
          formatInning(liveGame.inning_half, liveGame.inning) ??
          game.quarter
        )
        : undefined,
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

    const normalizedBoxscoreRawGames = (
      (boxscoreRaw?.league?.games ?? []).map((item) => normalizeRawGame((item?.game ?? item) as RawGame))
    ).concat((boxscoreRaw?.games ?? []).map((g) => normalizeRawGame(g)));

    const boxscoreGames: MLBScoreGame[] = normalizedBoxscoreRawGames
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
          time: overlay.time,
          startTime: base.startTime || overlay.startTime,
          homeRecord: base.homeRecord || overlay.homeRecord,
          awayRecord: base.awayRecord || overlay.awayRecord,
          currentPitcher: overlay.currentPitcher,
          currentBatter: overlay.currentBatter,
          outs: overlay.outs,
          balls: overlay.balls,
          strikes: overlay.strikes,
          bases: overlay.bases,
        };
      })
      : boxscoreGames;

    const scheduledAtById = new Map<string, number>();
    for (const game of scheduleRaw?.games ?? []) {
      if (!game?.id) continue;
      scheduledAtById.set(String(game.id), toScheduledTimestamp(game.scheduled));
    }
    for (const game of normalizedBoxscoreRawGames) {
      if (!game?.id) continue;
      const id = String(game.id);
      if (scheduledAtById.has(id)) continue;
      scheduledAtById.set(id, toScheduledTimestamp(game.scheduled));
    }

    merged.sort((a, b) => {
      const aScheduledAt = scheduledAtById.get(a.id) ?? Number.POSITIVE_INFINITY;
      const bScheduledAt = scheduledAtById.get(b.id) ?? Number.POSITIVE_INFINITY;
      if (aScheduledAt !== bScheduledAt) return aScheduledAt - bScheduledAt;
      return a.id.localeCompare(b.id);
    });

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
