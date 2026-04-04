import { NextResponse } from 'next/server';
import { getCached, CACHE_DURATIONS } from '@/lib/cache-helper';
import { fetchUCLSchedule } from '@/lib/sportsApi';
import { getUCLTeamLogos } from '@/lib/sportsdb';

// ── Types ────────────────────────────────────────────────────────────────────

interface SRCompetitor {
  id: string;
  name: string;
  abbreviation: string;
  qualifier: 'home' | 'away';
}

interface SREventStatus {
  status: string;
  home_score?: number;
  away_score?: number;
  winner_id?: string;
}

interface SREvent {
  id: string;
  start_time: string;
  competitors: SRCompetitor[];
  sport_event_context?: {
    round?: { name?: string };
    stage?: { phase?: string };
  };
}

interface SRScheduleItem {
  sport_event: SREvent;
  sport_event_status: SREventStatus;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getComp(comps: SRCompetitor[], qualifier: 'home' | 'away') {
  return comps.find((c) => c.qualifier === qualifier) ?? comps[0];
}

function tieKey(a: string, b: string) {
  return [a, b].sort().join('::');
}

function buildTies(items: SRScheduleItem[]) {
  const map = new Map<string, SRScheduleItem[]>();
  for (const item of items) {
    const comps = item.sport_event.competitors ?? [];
    const home = getComp(comps, 'home');
    const away = getComp(comps, 'away');
    const key = tieKey(home?.id ?? '', away?.id ?? '');
    const group = map.get(key) ?? [];
    group.push(item);
    map.set(key, group);
  }
  // Sort legs by date within each tie
  for (const legs of map.values()) {
    legs.sort((a, b) => a.sport_event.start_time.localeCompare(b.sport_event.start_time));
  }
  return Array.from(map.values());
}

function formatTie(legs: SRScheduleItem[]) {
  const leg1 = legs[0];
  const leg2 = legs[1];

  const comps = leg1.sport_event.competitors ?? [];
  // "home" in leg 1 is the first-leg home team treated as the tie's "home" team
  const homeComp = getComp(comps, 'home');
  const awayComp = getComp(comps, 'away');

  const l1Status = leg1.sport_event_status;
  const l2Status = leg2?.sport_event_status;

  const leg1Score: string | null =
    l1Status?.home_score != null ? `${l1Status.home_score}-${l1Status.away_score}` : null;
  const leg2Score: string | null =
    l2Status?.home_score != null ? `${l2Status.home_score}-${l2Status.away_score}` : null;

  // Aggregate: leg1 home + leg2 away = homeTeam total; leg1 away + leg2 home = awayTeam total
  let homeAgg: number | null = null;
  let awayAgg: number | null = null;
  if (l1Status?.home_score != null && l2Status?.away_score != null) {
    homeAgg = (l1Status.home_score ?? 0) + (l2Status.away_score ?? 0);
    awayAgg = (l1Status.away_score ?? 0) + (l2Status.home_score ?? 0);
  }

  const isCompleted = l1Status?.status === 'closed' && (!leg2 || l2Status?.status === 'closed');
  const winnerId = isCompleted
    ? homeAgg != null && awayAgg != null
      ? homeAgg > awayAgg
        ? homeComp.id
        : awayAgg > homeAgg
          ? awayComp.id
          : null
      : null
    : null;

  return {
    id: leg1.sport_event.id,
    homeTeam: { id: homeComp.id, name: homeComp.name, abbreviation: homeComp.abbreviation },
    awayTeam: { id: awayComp.id, name: awayComp.name, abbreviation: awayComp.abbreviation },
    leg1: leg1Score,
    leg2: leg2Score,
    homeAgg,
    awayAgg,
    status: isCompleted ? 'completed' : l1Status?.status === 'closed' ? 'in_progress' : 'upcoming',
    winnerId,
  };
}

// ── Order for R16 bracket (4 ties on each side) ──────────────────────────────
// The bracket screenshot shows Silver path / Blue path layout.
// We'll order ties so the two halves feed properly into QF/SF/Final.
// Since SportsRadar doesn't expose bracket paths directly, we order by
// the first-leg date then match day order.

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const raw = await getCached('UCL:bracket:2526', fetchUCLSchedule, CACHE_DURATIONS.STANDINGS) as { schedules: SRScheduleItem[] };
    const schedules: SRScheduleItem[] = raw.schedules ?? [];

    const byRound: Record<string, SRScheduleItem[]> = {
      // Only Feb-Mar 2026 playoff_round games are the UCL Knockout Playoffs.
      // August 2025 playoff_round games are qualification rounds — exclude them.
      playoff_round: [],
      round_of_16: [],
      quarterfinal: [],
      semifinal: [],
      final: [],
    };

    for (const item of schedules) {
      const rnd = item.sport_event?.sport_event_context?.round?.name ?? '';
      if (!(rnd in byRound)) continue;
      // Skip pre-season qualification playoff_round games (Aug 2025)
      if (rnd === 'playoff_round' && item.sport_event.start_time < '2026') continue;
      byRound[rnd].push(item);
    }

    const koPOTies = buildTies(byRound.playoff_round).map(formatTie);
    const r16Ties  = buildTies(byRound.round_of_16).map(formatTie);
    const qfTies   = buildTies(byRound.quarterfinal).map(formatTie);
    const sfTies   = buildTies(byRound.semifinal).map(formatTie);

    // Final is a single game
    const finalItems = byRound.final;
    const finalTie = finalItems.length > 0 ? (() => {
      const item = finalItems[0];
      const comps = item.sport_event.competitors ?? [];
      const home = getComp(comps, 'home');
      const away = getComp(comps, 'away');
      const st = item.sport_event_status;
      return {
        id: item.sport_event.id,
        homeTeam: { id: home?.id ?? '', name: home?.name ?? 'TBD', abbreviation: home?.abbreviation ?? 'TBD' },
        awayTeam: { id: away?.id ?? '', name: away?.name ?? 'TBD', abbreviation: away?.abbreviation ?? 'TBD' },
        leg1: null, leg2: null,
        homeAgg: st?.home_score ?? null,
        awayAgg: st?.away_score ?? null,
        status: st?.status === 'closed' ? 'completed' : st?.status === 'live' ? 'in_progress' : 'upcoming',
        winnerId: st?.winner_id ?? null,
      };
    })() : null;

    // Collect all unique team names (excluding TBD) and fetch logos
    const allTies = [...koPOTies, ...r16Ties, ...qfTies, ...sfTies, ...(finalTie ? [finalTie] : [])];
    const teamNames = [
      ...new Set(
        allTies.flatMap((t) => [t.homeTeam.name, t.awayTeam.name]).filter((n) => n && n !== 'TBD')
      ),
    ];
    const logos = teamNames.length > 0 ? await getUCLTeamLogos(teamNames) : {};

    // Inject logoUrl into every team object
    function withLogo<T extends { name: string }>(team: T): T & { logoUrl: string | null } {
      return { ...team, logoUrl: logos[team.name] ?? null };
    }
    const enrichTie = (tie: ReturnType<typeof formatTie>) => ({
      ...tie,
      homeTeam: withLogo(tie.homeTeam),
      awayTeam: withLogo(tie.awayTeam),
    });

    return NextResponse.json({
      koPO: koPOTies.map(enrichTie),
      r16:  r16Ties.map(enrichTie),
      qf:   qfTies.map(enrichTie),
      sf:   sfTies.map(enrichTie),
      final: finalTie ? enrichTie(finalTie) : null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Failed to fetch UCL bracket', details: message }, { status: 500 });
  }
}
