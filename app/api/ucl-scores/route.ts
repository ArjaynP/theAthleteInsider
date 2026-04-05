import { NextResponse } from 'next/server';
import {
  getCachedUCLSeasonSummaries,
  getCachedUCLLiveSummaries,
} from '@/lib/cachedSportsData';
import type { UCLMatch } from '@/lib/ucl-types';

// Sportradar UCL competition ID — used to filter live summaries
const UCL_COMPETITION_ID = 'sr:competition:7';

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Convert an ISO kickoff string to a YYYY-MM-DD date in ET timezone */
function toETDateString(iso: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(new Date(iso));
    const y = parts.find((p) => p.type === 'year')?.value;
    const m = parts.find((p) => p.type === 'month')?.value;
    const d = parts.find((p) => p.type === 'day')?.value;
    return `${y}-${m}-${d}`;
  } catch {
    return '';
  }
}

function getRoundLabel(ctx: Record<string, unknown> | undefined): string {
  if (!ctx) return 'UCL';

  const stage = ctx.stage as Record<string, unknown> | undefined;
  const round = ctx.round as Record<string, unknown> | undefined;

  const stageType = String(stage?.type ?? '').toLowerCase();
  const stageName = String(stage?.name ?? '');
  const roundName = String(round?.name ?? '');
  const roundNumber = round?.number as number | undefined;

  // Named round (knockout phases often carry a round.name)
  if (roundName) return roundName;

  // League phase matchdays
  if (stageType === 'league_phase' || stageType.includes('league')) {
    return roundNumber != null ? `Matchday ${roundNumber}` : (stageName || 'League Phase');
  }

  // KO playoff round (the 16-team play-in before R16)
  if (stageType.includes('playoff')) return 'KO Playoffs';

  // Fall back to stage name if present, then generic round number
  if (stageName) return stageName;
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

  return {
    id: String(event.id ?? ''),
    // Return full team name (used directly for display and logo lookup)
    homeTeam: String(homeComp.name ?? homeComp.abbreviation ?? ''),
    awayTeam: String(awayComp.name ?? awayComp.abbreviation ?? ''),
    homeScore: (statusObj.home_score as number) ?? 0,
    awayScore: (statusObj.away_score as number) ?? 0,
    status: matchState,
    kickoff: kickoff || undefined,
    kickoffDisplay: kickoff ? formatKickoffDisplay(kickoff) : undefined,
    round: getRoundLabel(ctx),
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
  const dateParam = searchParams.get('date'); // YYYY-MM-DD in ET; null = all dates

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
      const scheduled = String((ev?.scheduled as string | undefined) ?? '');

      // Filter by date when requested
      if (dateParam && scheduled && toETDateString(scheduled) !== dateParam) continue;

      // Overlay live data when available (real-time scores + clock)
      const effective = liveMap.has(id) ? liveMap.get(id)! : summary;
      const match = normalizeSummary(effective);
      if (match) matches.push(match);
    }

    // Sort: LIVE → UPCOMING (soonest first) → FINAL (most recent first)
    matches.sort((a, b) => {
      const diff = statusOrder(a.status) - statusOrder(b.status);
      if (diff !== 0) return diff;
      if (a.status === 'UPCOMING') {
        return (a.kickoff ?? '') < (b.kickoff ?? '') ? -1 : 1;
      }
      if (a.status === 'FINAL') {
        return (a.kickoff ?? '') > (b.kickoff ?? '') ? -1 : 1;
      }
      return 0;
    });

    return NextResponse.json({ matches });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ matches: [], error: message });
  }
}
