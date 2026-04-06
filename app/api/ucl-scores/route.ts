import { NextResponse } from 'next/server';
import {
  getCachedUCLSeasonSummaries,
  getCachedUCLLiveSummaries,
} from '@/lib/cachedSportsData';
import type { UCLMatch } from '@/lib/ucl-types';

// Sportradar UCL competition ID — used to filter live summaries
const UCL_COMPETITION_ID = 'sr:competition:7';

// ── Helpers ──────────────────────────────────────────────────────────────────

// Rounds that use two-legged ties; round.number = leg (1 or 2)
const KNOCKOUT_ROUNDS = new Set(['KO Playoffs', 'Round of 16', 'Quarterfinals', 'Semi-finals']);

// stage.name (case-insensitive) → canonical label
const ROUND_NAME_MAP: Record<string, string> = {
  'round of 16':                     'Round of 16',
  'last 16':                         'Round of 16',
  'round of sixteen':                'Round of 16',
  'knockout round play-offs':        'KO Playoffs',
  'knockout round play offs':        'KO Playoffs',
  'knockout round playoffs':         'KO Playoffs',
  'knockout playoffs':               'KO Playoffs',
  'knockout play-offs':              'KO Playoffs',
  'knockout play offs':              'KO Playoffs',
  'ko play-offs':                    'KO Playoffs',
  'ko playoffs':                     'KO Playoffs',
  'quarter-finals':                  'Quarterfinals',
  'quarter finals':                  'Quarterfinals',
  'quarterfinals':                   'Quarterfinals',
  'quarter final':                   'Quarterfinals',
  'semi-finals':                     'Semi-finals',
  'semi finals':                     'Semi-finals',
  'semifinals':                      'Semi-finals',
  'semi final':                      'Semi-finals',
  'final':                           'Final',
};

// stage.phase (Sportradar's standardised snake_case field) → canonical label
const STAGE_PHASE_MAP: Record<string, string> = {
  'knockout_round_play_offs': 'KO Playoffs',
  'knockout_round_playoffs':  'KO Playoffs',
  'ko_playoffs':              'KO Playoffs',
  'ko_play_offs':             'KO Playoffs',
  'playoffs':                 'KO Playoffs',
  'last_16':                  'Round of 16',
  'round_of_16':              'Round of 16',
  'last_sixteen':             'Round of 16',
  'quarterfinals':            'Quarterfinals',
  'quarter_finals':           'Quarterfinals',
  'semifinals':               'Semi-finals',
  'semi_finals':              'Semi-finals',
  'final':                    'Final',
};

function getRoundLabel(ctx: Record<string, unknown> | undefined): string {
  if (!ctx) return 'UCL';

  const stage = ctx.stage as Record<string, unknown> | undefined;
  const round = ctx.round as Record<string, unknown> | undefined;

  const stageType  = String(stage?.type  ?? '').toLowerCase().trim();
  const stagePhase = String(stage?.phase ?? '').toLowerCase().trim();
  const stageName  = String(stage?.name  ?? '').trim();
  const roundName  = String(round?.name  ?? '').trim();
  const roundNumber = round?.number as number | undefined;

  // ── League phase: identified by type or phase ────────────────────────────
  const isLeague =
    stageType === 'league' || stageType === 'group' ||
    stagePhase === 'league' || stagePhase === 'regular_season' ||
    stagePhase === 'regular season' || stagePhase.includes('league');
  if (isLeague) {
    return roundNumber != null ? `Matchday ${roundNumber}` : (stageName || 'League Phase');
  }

  // ── stage.phase — most reliable for knockout stages ────────────────────
  if (stagePhase) {
    const direct = STAGE_PHASE_MAP[stagePhase];
    if (direct) return direct;
    const normalized = stagePhase.replace(/[\s-]/g, '_');
    const norm = STAGE_PHASE_MAP[normalized];
    if (norm) return norm;
  }

  // ── round.name ────────────────────────────────────────────────────────
  if (roundName) {
    const mapped = ROUND_NAME_MAP[roundName.toLowerCase()];
    if (mapped) return mapped;
  }

  // ── stage.name ───────────────────────────────────────────────────────
  if (stageName) {
    const mapped = ROUND_NAME_MAP[stageName.toLowerCase()];
    if (mapped) return mapped;
    const phaseKey = stageName.toLowerCase().replace(/[\s-]/g, '_');
    const mappedPhase = STAGE_PHASE_MAP[phaseKey];
    if (mappedPhase) return mappedPhase;
    return stageName;
  }

  // ── Fallbacks ────────────────────────────────────────────────────────
  if (stagePhase.includes('playoff') || stageType.includes('playoff')) return 'KO Playoffs';
  return roundNumber != null ? `Round ${roundNumber}` : 'UCL';
}

function formatKickoffDisplay(iso: string): string {
  try {
    return (
      new Date(iso).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
        timeZone: 'America/New_York',
      }) + ' ET'
    );
  } catch {
    return '';
  }
}

function normalizeSummary(summary: Record<string, unknown>): UCLMatch | null {
  const event = summary.sport_event as Record<string, unknown> | undefined;
  const statusObj = summary.sport_event_status as Record<string, unknown> | undefined;

  if (!event || !statusObj) return null;

  const competitors = (event.competitors as Record<string, unknown>[]) ?? [];
  const homeComp = competitors.find((c) => String(c.qualifier) === 'home');
  const awayComp = competitors.find((c) => String(c.qualifier) === 'away');

  if (!homeComp || !awayComp) return null;

  const srStatus = String(statusObj.status ?? '').toLowerCase();
  const matchStatus = String(statusObj.match_status ?? '').toLowerCase();

  let matchState: UCLMatch['status'] = 'UPCOMING';
  if (srStatus === 'closed' || srStatus === 'ended' || matchStatus === 'ended') {
    matchState = 'FINAL';
  } else if (srStatus === 'live' || srStatus === 'inprogress') {
    matchState = 'LIVE';
  }

  // Live clock display
  const clockObj = statusObj.clock as Record<string, unknown> | undefined;
  let clockDisplay: string | undefined;
  if (matchState === 'LIVE') {
    if (matchStatus === 'halftime') {
      clockDisplay = 'HT';
    } else if (clockObj?.played) {
      // "67:00" → "67'"
      clockDisplay = String(clockObj.played).split(':')[0] + "'";
    } else if (matchStatus === '1st_half') {
      clockDisplay = '1H';
    } else if (matchStatus === '2nd_half') {
      clockDisplay = '2H';
    }
  }

  const ctx = event.sport_event_context as Record<string, unknown> | undefined;
  const venueObj = event.venue as Record<string, unknown> | undefined;
  const kickoff = String(event.scheduled ?? '');

  const roundLabel = getRoundLabel(ctx);
  const roundObj   = ctx?.round as Record<string, unknown> | undefined;
  const leg        = KNOCKOUT_ROUNDS.has(roundLabel)
    ? (roundObj?.number as number | undefined)
    : undefined;

  return {
    id: String(event.id ?? ''),
    homeTeam: String(homeComp.name ?? homeComp.abbreviation ?? ''),
    awayTeam: String(awayComp.name ?? awayComp.abbreviation ?? ''),
    homeScore: (statusObj.home_score as number) ?? 0,
    awayScore: (statusObj.away_score as number) ?? 0,
    status: matchState,
    kickoff: kickoff || undefined,
    kickoffDisplay: kickoff ? formatKickoffDisplay(kickoff) : undefined,
    round: roundLabel,
    leg,
    clock: clockDisplay,
    venue: venueObj?.name ? String(venueObj.name) : undefined,
  };
}

function isUCLEvent(summary: Record<string, unknown>): boolean {
  const event = summary.sport_event as Record<string, unknown> | undefined;
  const ctx = event?.sport_event_context as Record<string, unknown> | undefined;
  const competition = ctx?.competition as Record<string, unknown> | undefined;
  return String(competition?.id ?? '') === UCL_COMPETITION_ID;
}

// ── Status sort ordering ──────────────────────────────────────────────────────

function statusOrder(status: UCLMatch['status']): number {
  return status === 'LIVE' ? 0 : status === 'UPCOMING' ? 1 : 2;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  if (!process.env.SPORTSRADAR_API_KEY) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const roundParam = searchParams.get('round'); // e.g. "Matchday 1", "Quarterfinals"

  try {
    const [seasonSummaries, rawLive] = await Promise.all([
      getCachedUCLSeasonSummaries(),
      getCachedUCLLiveSummaries().catch((): Record<string, unknown>[] => []),
    ]);

    // Build a map of live summaries keyed by sport_event.id for fast overlay
    const liveMap = new Map<string, Record<string, unknown>>();
    for (const s of rawLive) {
      if (isUCLEvent(s)) {
        const ev = s.sport_event as Record<string, unknown> | undefined;
        const id = String(ev?.id ?? '');
        if (id) liveMap.set(id, s);
      }
    }

    const matches: UCLMatch[] = [];
    for (const summary of seasonSummaries) {
      const ev = summary.sport_event as Record<string, unknown> | undefined;
      const id = String(ev?.id ?? '');
      const ctx = ev?.sport_event_context as Record<string, unknown> | undefined;

      // Filter by round when requested
      if (roundParam && getRoundLabel(ctx) !== roundParam) continue;

      // Overlay live data when available (real-time scores + clock)
      const effective = liveMap.has(id) ? liveMap.get(id)! : summary;
      const match = normalizeSummary(effective);
      if (match) matches.push(match);
    }

    // Sort: leg → status → kickoff time
    matches.sort((a, b) => {
      const legDiff = (a.leg ?? 0) - (b.leg ?? 0);
      if (legDiff !== 0) return legDiff;
      const statusDiff = statusOrder(a.status) - statusOrder(b.status);
      if (statusDiff !== 0) return statusDiff;
      if (a.status === 'UPCOMING') return (a.kickoff ?? '') < (b.kickoff ?? '') ? -1 : 1;
      if (a.status === 'FINAL')    return (a.kickoff ?? '') > (b.kickoff ?? '') ? -1 : 1;
      return 0;
    });

    return NextResponse.json({ matches });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ matches: [], error: message });
  }
}
