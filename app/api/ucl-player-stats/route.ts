import { NextResponse } from 'next/server';
import { getCachedUCLSeasonCompetitors, getCachedUCLCompetitorStats } from '@/lib/cachedSportsData';
import type { UCLStatCategory, UCLPlayerStatEntry } from '@/lib/ucl-types';

// Stat categories sourced from the Sportradar "Seasonal Competitor Statistics" player stats fields
const STAT_CATEGORIES: Array<{
  id: string;
  label: string;
  abbreviation: string;
  field: string;
}> = [
  { id: 'goals',            label: 'Goals',             abbreviation: 'G',   field: 'goals_scored'      },
  { id: 'assists',          label: 'Assists',            abbreviation: 'A',   field: 'assists'           },
  { id: 'shots_on_target',  label: 'Shots on Target',   abbreviation: 'SOT', field: 'shots_on_target'   },
  { id: 'chances_created',  label: 'Chances Created',   abbreviation: 'CC',  field: 'chances_created'   },
  { id: 'passes_completed', label: 'Passes Completed',  abbreviation: 'PAS', field: 'passes_successful' },
  { id: 'tackles_won',      label: 'Tackles Won',       abbreviation: 'TKW', field: 'tackles_successful'},
  { id: 'clean_sheets',     label: 'Clean Sheets',      abbreviation: 'CS',  field: 'clean_sheets'      },
  { id: 'yellow_cards',     label: 'Yellow Cards',      abbreviation: 'YC',  field: 'yellow_cards'      },
];

interface PlayerAggregate {
  name: string;
  team: string;
  stats: Record<string, number>;
}

/**
 * Fetch competitor stats in parallel batches to respect trial-key rate limits.
 * Concurrency is capped at 3 simultaneous requests.
 */
async function fetchAllCompetitorStats(
  competitorIds: string[],
  concurrency = 3
): Promise<Array<Record<string, unknown> | null>> {
  const results: Array<Record<string, unknown> | null> = new Array(competitorIds.length).fill(null);
  let cursor = 0;

  async function worker() {
    while (cursor < competitorIds.length) {
      const i = cursor++;
      try {
        results[i] = (await getCachedUCLCompetitorStats(competitorIds[i])) as Record<string, unknown>;
      } catch {
        results[i] = null;
      }
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

export async function GET() {
  try {
    // 1. Retrieve this season's full competitor list
    const competitorsData = (await getCachedUCLSeasonCompetitors()) as Record<string, unknown>;

    // Sportradar returns either { season_competitors: [...] } or { competitors: [...] }
    const rawList =
      (competitorsData?.season_competitors as unknown[]) ??
      (competitorsData?.competitors as unknown[]) ??
      [];

    if (!rawList.length) {
      return NextResponse.json(
        { error: 'No UCL competitors found in season' },
        { status: 404 }
      );
    }

    // Normalise: each item may be { id, abbreviation, name } or { competitor: { id, abbreviation, name } }
    const competitors = rawList.map((item: unknown) => {
      const c = item as Record<string, unknown>;
      if (c.competitor && typeof c.competitor === 'object') {
        return c.competitor as Record<string, string>;
      }
      return c as Record<string, string>;
    });

    const competitorIds = competitors.map((c) => c.id).filter(Boolean) as string[];

    // 2. Fetch seasonal stats for every competitor (cached per team)
    const statsResults = await fetchAllCompetitorStats(competitorIds);

    // 3. Aggregate player entries from all teams
    const allPlayers: PlayerAggregate[] = [];

    statsResults.forEach((result, i) => {
      if (!result) return;
      const competitor = result.competitor as Record<string, unknown> | undefined;
      if (!competitor) return;

      // Prefer the abbreviation from the stats response; fall back to competitorsData mapping
      const teamAbbrev =
        (competitor.abbreviation as string) ??
        competitors[i]?.abbreviation ??
        '';

      const players = (competitor.players as unknown[]) ?? [];
      players.forEach((rawPlayer: unknown) => {
        const p = rawPlayer as Record<string, unknown>;
        allPlayers.push({
          name: p.name as string,
          team: teamAbbrev,
          stats: (p.statistics as Record<string, number>) ?? {},
        });
      });
    });

    // 4. Build leaderboard categories — top 5 per stat, players with 0 excluded
    const categories: UCLStatCategory[] = STAT_CATEGORIES.map(({ id, label, abbreviation, field }) => {
      const sorted = [...allPlayers]
        .filter((p) => (p.stats[field] ?? 0) > 0)
        .sort((a, b) => (b.stats[field] ?? 0) - (a.stats[field] ?? 0))
        .slice(0, 5);

      const leaders: UCLPlayerStatEntry[] = sorted.map((p, idx) => ({
        rank: idx + 1,
        player: p.name,
        team: p.team,
        value: p.stats[field] ?? 0,
      }));

      return { id, label, abbreviation, leaders };
    }).filter((cat) => cat.leaders.length > 0);

    return NextResponse.json({
      categories,
      generatedAt: new Date().toISOString(),
      source: 'sportradar',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch UCL player stats', details: message },
      { status: 500 }
    );
  }
}
