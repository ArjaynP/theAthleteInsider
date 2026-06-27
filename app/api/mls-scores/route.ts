import { NextResponse } from 'next/server';
import {
  getCachedMLSSeasonSummaries,
  getCachedUCLLiveSummaries,
} from '@/lib/cachedSportsData';
import { mlsMatches, MLS_CURRENT_MATCHWEEK } from '@/lib/mls-data';
import type { MLSMatch } from '@/lib/mls-types';

// Sportradar MLS competition ID
const MLS_COMPETITION_ID = 'sr:competition:242';

// ── Helpers ──────────────────────────────────────────────────────────────────

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

function normalizeSummary(summary: Record<string, unknown>): MLSMatch | null {
  const event = summary.sport_event as Record<string, unknown> | undefined;
  const statusObj = summary.sport_event_status as Record<string, unknown> | undefined;

  if (!event || !statusObj) return null;

  const competitors = (event.competitors as Record<string, unknown>[]) ?? [];
  const homeComp = competitors.find((c) => String(c.qualifier) === 'home');
  const awayComp = competitors.find((c) => String(c.qualifier) === 'away');

  if (!homeComp || !awayComp) return null;

  const srStatus   = String(statusObj.status ?? '').toLowerCase();
  const matchStatus = String(statusObj.match_status ?? '').toLowerCase();

  let matchState: MLSMatch['status'] = 'UPCOMING';
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
      clockDisplay = String(clockObj.played).split(':')[0] + "'";
    } else if (matchStatus === '1st_half') {
      clockDisplay = '1H';
    } else if (matchStatus === '2nd_half') {
      clockDisplay = '2H';
    }
  }

  const ctx      = event.sport_event_context as Record<string, unknown> | undefined;
  const roundObj = ctx?.round as Record<string, unknown> | undefined;
  const matchweek = roundObj?.number as number | undefined;

  const venueObj = event.venue as Record<string, unknown> | undefined;
  const kickoff  = String(event.scheduled ?? '');

  return {
    id:             String(event.id ?? ''),
    homeTeam:       String(homeComp.name ?? homeComp.abbreviation ?? ''),
    awayTeam:       String(awayComp.name ?? awayComp.abbreviation ?? ''),
    homeScore:      (statusObj.home_score as number) ?? 0,
    awayScore:      (statusObj.away_score as number) ?? 0,
    status:         matchState,
    kickoff:        kickoff || undefined,
    kickoffDisplay: kickoff ? formatKickoffDisplay(kickoff) : undefined,
    matchweek:      matchweek,
    clock:          clockDisplay,
    venue:          venueObj?.name ? String(venueObj.name) : undefined,
  };
}

function isMLSEvent(summary: Record<string, unknown>): boolean {
  const event       = summary.sport_event as Record<string, unknown> | undefined;
  const ctx         = event?.sport_event_context as Record<string, unknown> | undefined;
  const competition = ctx?.competition as Record<string, unknown> | undefined;
  return String(competition?.id ?? '') === MLS_COMPETITION_ID;
}

function getMatchweekNumber(summary: Record<string, unknown>): number | undefined {
  const event    = summary.sport_event as Record<string, unknown> | undefined;
  const ctx      = event?.sport_event_context as Record<string, unknown> | undefined;
  const roundObj = ctx?.round as Record<string, unknown> | undefined;
  const explicit = roundObj?.number as number | undefined;
  if (typeof explicit === 'number') return explicit;

  // Some feeds encode week/round in names only (e.g., "week_15").
  const roundName = String(roundObj?.name ?? '').toLowerCase();
  const stageObj = ctx?.stage as Record<string, unknown> | undefined;
  const stageName = String(stageObj?.name ?? '').toLowerCase();
  const stagePhase = String(stageObj?.phase ?? '').toLowerCase();
  const combined = `${roundName} ${stageName} ${stagePhase}`;
  const match = combined.match(/(?:matchweek|week|round)[^\d]*(\d{1,2})/i) ?? combined.match(/\b(\d{1,2})\b/);
  if (!match) return undefined;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function statusOrder(status: MLSMatch['status']): number {
  return status === 'LIVE' ? 0 : status === 'UPCOMING' ? 1 : 2;
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  if (!process.env.SPORTSRADAR_API_KEY) {
    return NextResponse.json({ error: 'Missing API key' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const matchweekParam = searchParams.get('matchweek');
  const matchweek = matchweekParam ? parseInt(matchweekParam, 10) : null;

  try {
    const [seasonSummaries, rawLive] = await Promise.all([
      getCachedMLSSeasonSummaries().catch((): Record<string, unknown>[] => []),
      getCachedUCLLiveSummaries().catch((): Record<string, unknown>[] => []),
    ]);

    if (seasonSummaries.length === 0) {
      const fallbackWeek = matchweek ?? MLS_CURRENT_MATCHWEEK;
      const fallback = mlsMatches[fallbackWeek] ?? [];
      return NextResponse.json({
        matches: fallback,
        matchweek: fallbackWeek,
        source: 'mock-fallback',
      });
    }

    // Build a map of live MLS summaries keyed by sport_event.id
    const liveMap = new Map<string, Record<string, unknown>>();
    for (const s of rawLive) {
      if (isMLSEvent(s)) {
        const ev = s.sport_event as Record<string, unknown> | undefined;
        const id = String(ev?.id ?? '');
        if (id) liveMap.set(id, s);
      }
    }

    const matches: MLSMatch[] = [];
    for (const summary of seasonSummaries) {
      // Season summaries endpoint is already season-scoped. Keep broad acceptance
      // and only apply competition-id gate when that metadata is present.
      const event = summary.sport_event as Record<string, unknown> | undefined;
      const ctx = event?.sport_event_context as Record<string, unknown> | undefined;
      const competition = ctx?.competition as Record<string, unknown> | undefined;
      const compId = String(competition?.id ?? '');
      if (compId && compId !== MLS_COMPETITION_ID) continue;

      // Filter by matchweek when requested
      if (matchweek !== null) {
        const summaryWeek = getMatchweekNumber(summary);
        if (summaryWeek !== undefined && summaryWeek !== matchweek) continue;
      }

      const ev  = summary.sport_event as Record<string, unknown> | undefined;
      const id  = String(ev?.id ?? '');

      // Overlay live data when available
      const effective = liveMap.has(id) ? liveMap.get(id)! : summary;
      const match = normalizeSummary(effective);
      if (match) matches.push(match);
    }

    // Sort: status (LIVE first) → kickoff ascending
    matches.sort((a, b) => {
      const statusDiff = statusOrder(a.status) - statusOrder(b.status);
      if (statusDiff !== 0) return statusDiff;
      const ka = a.kickoff ?? '';
      const kb = b.kickoff ?? '';
      if (a.status === 'FINAL') return ka > kb ? -1 : 1; // most recent first for finals
      return ka < kb ? -1 : 1;
    });

    return NextResponse.json({ matches, matchweek, source: 'sportradar' });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const fallbackWeek = matchweek ?? MLS_CURRENT_MATCHWEEK;
    const fallback = mlsMatches[fallbackWeek] ?? [];
    return NextResponse.json(
      {
        matches: fallback,
        matchweek: fallbackWeek,
        source: 'mock-fallback',
        error: message,
      },
      { status: 200 }
    );
  }
}
