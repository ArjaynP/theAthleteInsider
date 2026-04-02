import { NextResponse } from 'next/server';
import { getCachedMLBSportsRadarStandings, getCachedMLBTeamSeasonalStats } from '@/lib/cachedSportsData';
import { getCached, CACHE_DURATIONS } from '@/lib/cache-helper';

// ─── types ───────────────────────────────────────────────────────────────────

type LeaderEntry = {
  rank: number;
  player: string;
  team: string;
  value: number;
};

type StatCategory = {
  id: string;
  label: string;
  abbreviation: string;
  leaders: LeaderEntry[];
};

// Sportradar MLB abbreviation overrides (same set used in other MLB routes)
const MLB_EXTRA_ABBR_KEYS: Record<string, string> = {
  ARI: 'AZ', CHW: 'CWS', TBR: 'TB', KCR: 'KC', SDP: 'SD', SFG: 'SF', WSN: 'WSH',
};

function normalizeAbbr(value: string): string {
  const upper = (value ?? '').toUpperCase();
  return MLB_EXTRA_ABBR_KEYS[upper] ?? upper;
}

// ─── stat specification ───────────────────────────────────────────────────────

type HittingOverall = {
  ab?: number;
  rbi?: number;
  slg?: number;
  avg?: string;
  onbase?: { h?: number; d?: number; t?: number; hr?: number };
  runs?: { total?: number };
  steal?: { stolen?: number };
};

type PitchingOverall = {
  era?: number;
  whip?: number;
  oba?: number;
  ip_1?: number; // total outs pitched (1 out = 1/3 inning)
  ip_2?: number; // formatted innings (17.2 = 17 and 2/3 innings)
  onbase?: { h?: number; hr?: number; hbp?: number; bb?: number };
  runs?: { total?: number; earned?: number };
  outs?: { ktotal?: number };
  games?: {
    play?: number;
    start?: number;
    win?: number;
    loss?: number;
    complete?: number;
    shutout?: number;
    save?: number;
    svo?: number;
  };
};

type RawPlayer = {
  preferred_name?: string;
  first_name?: string;
  last_name?: string;
  statistics?: {
    hitting?: { overall?: HittingOverall };
    pitching?: { overall?: PitchingOverall };
  };
};

type PlayerEntry = {
  name: string;
  team: string;
  hitting: HittingOverall | null;
  pitching: PitchingOverall | null;
};

type StatSpec = {
  id: string;
  label: string;
  abbreviation: string;
  decimals: number;
  /** true = lower is better (ERA, WHIP, OBA); sort ascending for leaders */
  ascendingBest?: boolean;
  /** optional minimum threshold filter */
  qualify?: (p: PlayerEntry) => boolean;
  extract: (p: PlayerEntry) => number | string | undefined;
};

const HITTING_STATS: StatSpec[] = [
  {
    id: 'runs', label: 'Runs', abbreviation: 'R', decimals: 0,
    qualify: (p) => (p.hitting?.runs?.total ?? 0) > 0,
    extract: (p) => p.hitting?.runs?.total,
  },
  {
    id: 'hits', label: 'Hits', abbreviation: 'H', decimals: 0,
    qualify: (p) => (p.hitting?.onbase?.h ?? 0) > 0,
    extract: (p) => p.hitting?.onbase?.h,
  },
  {
    id: 'doubles', label: 'Doubles', abbreviation: '2B', decimals: 0,
    qualify: (p) => (p.hitting?.ab ?? 0) > 0,
    extract: (p) => p.hitting?.onbase?.d,
  },
  {
    id: 'triples', label: 'Triples', abbreviation: '3B', decimals: 0,
    qualify: (p) => (p.hitting?.ab ?? 0) > 0,
    extract: (p) => p.hitting?.onbase?.t,
  },
  {
    id: 'home_runs', label: 'Home Runs', abbreviation: 'HR', decimals: 0,
    qualify: (p) => (p.hitting?.ab ?? 0) > 0,
    extract: (p) => p.hitting?.onbase?.hr,
  },
  {
    id: 'rbi', label: 'Runs Batted In', abbreviation: 'RBI', decimals: 0,
    qualify: (p) => (p.hitting?.ab ?? 0) > 0,
    extract: (p) => p.hitting?.rbi,
  },
  {
    id: 'slugging_percentage', label: 'Slugging Percentage', abbreviation: 'SLG', decimals: 3,
    qualify: (p) => (p.hitting?.ab ?? 0) >= 50,
    extract: (p) => p.hitting?.slg,
  },
  {
    id: 'stolen_bases', label: 'Stolen Bases', abbreviation: 'SB', decimals: 0,
    qualify: (p) => (p.hitting?.ab ?? 0) > 0,
    extract: (p) => p.hitting?.steal?.stolen,
  },
  {
    id: 'batting_avg', label: 'Batting Average', abbreviation: 'AVG', decimals: 3,
    qualify: (p) => (p.hitting?.ab ?? 0) >= 50,
    extract: (p) => p.hitting?.avg,
  },
];

const PITCHING_STATS: StatSpec[] = [
  {
    id: 'wins', label: 'Wins', abbreviation: 'W', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.games?.win,
  },
  {
    id: 'losses', label: 'Losses', abbreviation: 'L', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.games?.loss,
  },
  {
    id: 'era', label: 'Earned Run Average', abbreviation: 'ERA', decimals: 2,
    ascendingBest: true,
    qualify: (p) => (p.pitching?.ip_1 ?? 0) >= 30, // min 10 IP (30 outs)
    extract: (p) => p.pitching?.era,
  },
  {
    id: 'games', label: 'Games Pitched', abbreviation: 'G', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.games?.play,
  },
  {
    id: 'games_started', label: 'Games Started', abbreviation: 'GS', decimals: 0,
    qualify: (p) => (p.pitching?.games?.start ?? 0) > 0,
    extract: (p) => p.pitching?.games?.start,
  },
  {
    id: 'complete_games', label: 'Complete Games', abbreviation: 'CG', decimals: 0,
    qualify: (p) => (p.pitching?.games?.start ?? 0) > 0,
    extract: (p) => p.pitching?.games?.complete,
  },
  {
    id: 'shutouts', label: 'Shutouts', abbreviation: 'SHO', decimals: 0,
    qualify: (p) => (p.pitching?.games?.start ?? 0) > 0,
    extract: (p) => p.pitching?.games?.shutout,
  },
  {
    id: 'saves', label: 'Saves', abbreviation: 'SV', decimals: 0,
    qualify: (p) => (p.pitching?.games?.svo ?? 0) > 0,
    extract: (p) => p.pitching?.games?.save,
  },
  {
    id: 'save_opportunities', label: 'Save Opportunities', abbreviation: 'SVO', decimals: 0,
    qualify: (p) => (p.pitching?.games?.svo ?? 0) > 0,
    extract: (p) => p.pitching?.games?.svo,
  },
  {
    id: 'innings_pitched', label: 'Innings Pitched', abbreviation: 'IP', decimals: 1,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.ip_2,
  },
  {
    id: 'hits_allowed', label: 'Hits Allowed', abbreviation: 'HA', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.onbase?.h,
  },
  {
    id: 'runs_allowed', label: 'Runs Allowed', abbreviation: 'RA', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.runs?.total,
  },
  {
    id: 'earned_runs', label: 'Earned Runs', abbreviation: 'ER', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.runs?.earned,
  },
  {
    id: 'home_runs_allowed', label: 'Home Runs Allowed', abbreviation: 'HRA', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.onbase?.hr,
  },
  {
    id: 'hit_by_pitch', label: 'Hit By Pitch', abbreviation: 'HBP', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.onbase?.hbp,
  },
  {
    id: 'walks', label: 'Walks', abbreviation: 'BB', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.onbase?.bb,
  },
  {
    id: 'strikeouts', label: 'Strikeouts', abbreviation: 'K', decimals: 0,
    qualify: (p) => (p.pitching?.games?.play ?? 0) > 0,
    extract: (p) => p.pitching?.outs?.ktotal,
  },
  {
    id: 'whip', label: 'WHIP', abbreviation: 'WHIP', decimals: 3,
    ascendingBest: true,
    qualify: (p) => (p.pitching?.ip_1 ?? 0) >= 30,
    extract: (p) => p.pitching?.whip,
  },
  {
    id: 'opp_batting_avg', label: 'Opp. Batting Avg', abbreviation: 'OBA', decimals: 3,
    ascendingBest: true,
    qualify: (p) => (p.pitching?.ip_1 ?? 0) >= 30,
    extract: (p) => p.pitching?.oba,
  },
];

// ─── helpers ─────────────────────────────────────────────────────────────────

function buildLeaders(
  spec: StatSpec,
  players: PlayerEntry[],
): LeaderEntry[] {
  type Scored = { player: PlayerEntry; value: number }; // always number after coercion

  const scored: Scored[] = [];
  for (const p of players) {
    if (spec.qualify && !spec.qualify(p)) continue;
    const raw = spec.extract(p);
    if (raw === undefined || raw === null) continue;
    // Sportradar sometimes returns numeric fields as strings
    const numVal = typeof raw === 'string' ? parseFloat(raw) : Number(raw);
    if (Number.isNaN(numVal)) continue;
    scored.push({ player: p, value: numVal });
  }

  scored.sort((a, b) =>
    spec.ascendingBest ? a.value - b.value : b.value - a.value
  );

  return scored.slice(0, 5).map((s, i) => ({
    rank: i + 1,
    player: s.player.name,
    team: s.player.team,
    value: parseFloat(s.value.toFixed(spec.decimals)),
  }));
}

// Extract Sportradar team IDs from the cached standings response
function extractTeamIds(standings: unknown): string[] {
  const raw = standings as Record<string, unknown> | undefined;
  if (!raw) return [];

  const ids: string[] = [];
  const leagues = (raw?.league as Record<string, unknown>)?.season
    ? ((raw.league as Record<string, unknown>).season as Record<string, unknown>)?.leagues
    : (raw?.league as Record<string, unknown>)?.conferences
      ?? (raw?.leagues)
      ?? [];

  // Path 1: league.season.leagues[].divisions[].teams[]
  if (Array.isArray(leagues)) {
    for (const league of leagues as Array<Record<string, unknown>>) {
      for (const division of (league.divisions ?? []) as Array<Record<string, unknown>>) {
        for (const team of (division.teams ?? []) as Array<Record<string, unknown>>) {
          if (typeof team.id === 'string' && team.id) ids.push(team.id);
        }
      }
    }
  }

  // Path 2: league.conferences[].divisions[].teams[]
  const conferences = (raw?.league as Record<string, unknown>)?.conferences;
  if (ids.length === 0 && Array.isArray(conferences)) {
    for (const conf of conferences as Array<Record<string, unknown>>) {
      for (const division of (conf.divisions ?? []) as Array<Record<string, unknown>>) {
        for (const team of (division.teams ?? []) as Array<Record<string, unknown>>) {
          if (typeof team.id === 'string' && team.id) ids.push(team.id);
        }
      }
    }
  }

  return [...new Set(ids)]; // deduplicate
}

// Batch-fetch team stats honouring trial API rate limit (5 concurrent, 300 ms between batches)
async function fetchAllTeamStats(teamIds: string[], year: number): Promise<Array<unknown>> {
  const batchSize = 5;
  const delayMs = 300;
  const allResults: unknown[] = [];

  for (let i = 0; i < teamIds.length; i += batchSize) {
    const batch = teamIds.slice(i, i + batchSize);
    const settled = await Promise.allSettled(
      batch.map((id) => getCachedMLBTeamSeasonalStats(id, year))
    );
    for (const r of settled) {
      allResults.push(r.status === 'fulfilled' ? r.value : null);
    }
    if (i + batchSize < teamIds.length) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return allResults;
}

// Main computation: standings → team IDs → player stats → leaders
async function computeMLBLeaders(year: number): Promise<StatCategory[]> {
  const standings = await getCachedMLBSportsRadarStandings();
  const teamIds = extractTeamIds(standings);

  if (teamIds.length === 0) {
    console.warn('[mlb-leaders] No team IDs found in standings response');
    return [];
  }

  const teamStatResults = await fetchAllTeamStats(teamIds, year);

  // Flatten all players across all teams
  const allPlayers: PlayerEntry[] = [];
  for (const result of teamStatResults) {
    if (!result) continue;
    const data = result as Record<string, unknown>;
    const teamAbbr = normalizeAbbr(String(data.abbr ?? ''));
    const players = (data.players ?? []) as RawPlayer[];

    for (const p of players) {
      const name = p.preferred_name
        ? `${p.preferred_name} ${p.last_name ?? ''}`.trim()
        : `${p.first_name ?? ''} ${p.last_name ?? ''}`.trim();
      if (!name) continue;

      allPlayers.push({
        name,
        team: teamAbbr,
        hitting: p.statistics?.hitting?.overall ?? null,
        pitching: p.statistics?.pitching?.overall ?? null,
      });
    }
  }

  if (allPlayers.length === 0) return [];

  // Build StatCategory list (hitting + pitching)
  const categories: StatCategory[] = [];

  for (const spec of [...HITTING_STATS, ...PITCHING_STATS]) {
    const leaders = buildLeaders(spec, allPlayers);
    if (leaders.length > 0) {
      categories.push({ id: spec.id, label: spec.label, abbreviation: spec.abbreviation, leaders });
    }
  }

  return categories;
}

// ─── route ───────────────────────────────────────────────────────────────────

export async function GET() {
  const year = 2026;

  try {
    const categories = await getCached(
      `MLB:leaders:computed:${year}`,
      () => computeMLBLeaders(year),
      CACHE_DURATIONS.STANDINGS // 1 hour – re-aggregates from individual team caches on miss
    ) as StatCategory[];

    if (categories.length === 0) {
      return NextResponse.json({ error: 'No leader data available' }, { status: 503 });
    }

    return NextResponse.json({ categories });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[mlb-leaders] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
