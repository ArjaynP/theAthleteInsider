import { NextResponse } from 'next/server';
import { getCachedMLSStandings } from '@/lib/cachedSportsData';
import { mlsEasternStandings, mlsWesternStandings } from '@/lib/mls-data';
import type { MLSTeamStanding } from '@/lib/mls-types';

const EASTERN_TEAM_ABBRS = new Set([
  'ATL', 'CHI', 'CIN', 'CLB', 'CLT', 'DC', 'MIA', 'MTL', 'NASH', 'NSH',
  'NE', 'NYC', 'NY', 'RBNY', 'ORL', 'PHI', 'TOR',
]);

const WESTERN_TEAM_ABBRS = new Set([
  'ATX', 'AUS', 'COL', 'DAL', 'HOU', 'LA', 'LAFC', 'MIN', 'POR', 'RSL',
  'SD', 'SDFC', 'SJ', 'SEA', 'SKC', 'STL', 'VAN',
]);

function inferConference(entry: {
  competitor?: { abbreviation?: string; name?: string };
}): 'Eastern' | 'Western' {
  const abbr = String(entry.competitor?.abbreviation ?? '').toUpperCase();
  if (EASTERN_TEAM_ABBRS.has(abbr)) return 'Eastern';
  if (WESTERN_TEAM_ABBRS.has(abbr)) return 'Western';

  const name = String(entry.competitor?.name ?? '').toLowerCase();
  if (
    name.includes('atlanta') ||
    name.includes('chicago') ||
    name.includes('cincinnati') ||
    name.includes('columbus') ||
    name.includes('charlotte') ||
    name.includes('dc united') ||
    name.includes('inter miami') ||
    name.includes('montreal') ||
    name.includes('nashville') ||
    name.includes('new england') ||
    name.includes('new york city') ||
    name.includes('new york red bulls') ||
    name.includes('orlando') ||
    name.includes('philadelphia') ||
    name.includes('toronto')
  ) {
    return 'Eastern';
  }

  return 'Western';
}

export async function GET() {
  try {
    let raw: Record<string, unknown> | null = null;
    let standingsFetchError: string | null = null;

    try {
      raw = await getCachedMLSStandings() as Record<string, unknown>;
    } catch (error) {
      standingsFetchError = error instanceof Error ? error.message : 'Unknown error';
    }

    if (!raw) {
      return NextResponse.json({
        eastern: mlsEasternStandings,
        western: mlsWesternStandings,
        source: 'fallback',
        warning: standingsFetchError ?? 'SportsRadar standings unavailable',
      });
    }

    const standings = (raw as { standings?: unknown[] }).standings ?? [];

    const totalBlock = standings.find((s) => (s as { type?: string })?.type === 'total') as
      | { groups?: unknown[] }
      | undefined;

    // Depending on endpoint variant, conference groups can be nested in
    // standings[].groups or at standings[] directly.
    const groups = totalBlock?.groups ?? standings;

    const easternGroup = groups.find((g) => {
      const name = String((g as { group_name?: string; name?: string }).group_name ?? (g as { name?: string }).name ?? '').toLowerCase();
      return name.includes('eastern');
    }) as { standings?: unknown[] } | undefined;

    const westernGroup = groups.find((g) => {
      const name = String((g as { group_name?: string; name?: string }).group_name ?? (g as { name?: string }).name ?? '').toLowerCase();
      return name.includes('western');
    }) as { standings?: unknown[] } | undefined;

    const toForm = (value: unknown): string[] => {
      if (typeof value !== 'string') return [];
      return value
        .toUpperCase()
        .split('')
        .filter((char) => char === 'W' || char === 'D' || char === 'L')
        .slice(0, 5);
    };

    const mapStandings = (entries: unknown[], conference: 'Eastern' | 'Western'): MLSTeamStanding[] => {
      return entries
        .map((entry) => {
          const item = entry as {
            rank?: number;
            played?: number;
            win?: number;
            draw?: number;
            loss?: number;
            goals_for?: number;
            goals_against?: number;
            goals_diff?: number;
            points?: number;
            competitor?: { name?: string; abbreviation?: string; form?: string };
          };

          const teamName = item.competitor?.name;
          const abbr = item.competitor?.abbreviation;
          if (!teamName || !abbr || typeof item.rank !== 'number') return null;

          return {
            rank: item.rank,
            team: teamName,
            abbreviation: abbr,
            played: item.played ?? 0,
            won: item.win ?? 0,
            drawn: item.draw ?? 0,
            lost: item.loss ?? 0,
            goalsFor: item.goals_for ?? 0,
            goalsAgainst: item.goals_against ?? 0,
            goalDifference: item.goals_diff ?? 0,
            points: item.points ?? 0,
            form: toForm(item.competitor?.form),
            conference,
          } satisfies MLSTeamStanding;
        })
        .filter((team): team is MLSTeamStanding => team !== null)
        .sort((a, b) => a.rank - b.rank);
    };

    let eastern = mapStandings(easternGroup?.standings ?? [], 'Eastern');
    let western = mapStandings(westernGroup?.standings ?? [], 'Western');

    if (eastern.length === 0 && western.length === 0) {
      // Some seasons return a single table instead of explicit conference groups.
      const singleTable = (groups[0] as { standings?: unknown[] } | undefined)?.standings ?? [];
      const mapped = singleTable
        .map((entry) => {
          const item = entry as {
            rank?: number;
            played?: number;
            win?: number;
            draw?: number;
            loss?: number;
            goals_for?: number;
            goals_against?: number;
            goals_diff?: number;
            points?: number;
            competitor?: { name?: string; abbreviation?: string; form?: string };
          };

          const teamName = item.competitor?.name;
          const abbr = item.competitor?.abbreviation;
          if (!teamName || !abbr || typeof item.rank !== 'number') return null;

          const conference = inferConference(item);

          return {
            rank: item.rank,
            team: teamName,
            abbreviation: abbr,
            played: item.played ?? 0,
            won: item.win ?? 0,
            drawn: item.draw ?? 0,
            lost: item.loss ?? 0,
            goalsFor: item.goals_for ?? 0,
            goalsAgainst: item.goals_against ?? 0,
            goalDifference: item.goals_diff ?? 0,
            points: item.points ?? 0,
            form: toForm(item.competitor?.form),
            conference,
          } satisfies MLSTeamStanding;
        })
        .filter((team): team is MLSTeamStanding => team !== null);

      eastern = mapped
        .filter((team) => team.conference === 'Eastern')
        .sort((a, b) => a.points === b.points ? b.goalDifference - a.goalDifference : b.points - a.points)
        .map((team, index) => ({ ...team, rank: index + 1 }));

      western = mapped
        .filter((team) => team.conference === 'Western')
        .sort((a, b) => a.points === b.points ? b.goalDifference - a.goalDifference : b.points - a.points)
        .map((team, index) => ({ ...team, rank: index + 1 }));
    }

    if (eastern.length === 0 && western.length === 0) {
      return NextResponse.json({
        eastern: mlsEasternStandings,
        western: mlsWesternStandings,
        source: 'fallback',
        warning: 'MLS live standings were empty from SportsRadar',
      });
    }

    return NextResponse.json({
      eastern,
      western,
      source: 'sportradar',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        error: message,
        source: 'sportradar',
      },
      { status: 502 }
    );
  }
}
