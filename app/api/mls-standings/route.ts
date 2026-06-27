import { NextResponse } from 'next/server';
import { getCachedMLSFormStandings, getCachedMLSStandings } from '@/lib/cachedSportsData';
import { mlsEasternStandings, mlsWesternStandings } from '@/lib/mls-data';
import type { MLSTeamStanding } from '@/lib/mls-types';

export async function GET() {
  try {
    const raw = await getCachedMLSFormStandings().catch(async () => {
      return await getCachedMLSStandings();
    }) as Record<string, unknown>;

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

    const eastern = mapStandings(easternGroup?.standings ?? [], 'Eastern');
    const western = mapStandings(westernGroup?.standings ?? [], 'Western');

    if (eastern.length === 0 && western.length === 0) {
      return NextResponse.json(
        {
          eastern: mlsEasternStandings,
          western: mlsWesternStandings,
          source: 'mock-fallback',
          error: 'MLS live standings are currently unavailable from SportsRadar.',
        },
        { status: 200 }
      );
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
        eastern: mlsEasternStandings,
        western: mlsWesternStandings,
        error: message,
        source: 'mock-fallback',
      },
      { status: 200 }
    );
  }
}
