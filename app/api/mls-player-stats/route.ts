import { NextResponse } from 'next/server';
import { getCachedMLSSeasonLeaders } from '@/lib/cachedSportsData';
import type { MLSStatCategory, MLSStatEntry } from '@/lib/mls-types';

// Map Sportradar list `type` strings to display metadata.
const LIST_TYPE_MAP: Record<string, { id: string; label: string; abbreviation: string }> = {
  goals:            { id: 'goals',            label: 'Goals',           abbreviation: 'G'   },
  assists:          { id: 'assists',           label: 'Assists',         abbreviation: 'A'   },
  yellow_cards:     { id: 'yellow_cards',      label: 'Yellow Cards',    abbreviation: 'YC'  },
  red_cards:        { id: 'red_cards',         label: 'Red Cards',       abbreviation: 'RC'  },
  yellow_red_cards: { id: 'yellow_red_cards',  label: 'Second Yellows',  abbreviation: 'YRC' },
};

const DISPLAY_ORDER = ['goals', 'assists', 'yellow_cards', 'red_cards', 'yellow_red_cards'];

interface SRDatapoint  { type: string; value: number; }
interface SRCompetitor { id?: string; name?: string; abbreviation?: string; datapoints?: SRDatapoint[]; }
interface SRPlayer     { id?: string; name?: string; competitors?: SRCompetitor[]; }
interface SRRankEntry  { rank: number; players: SRPlayer[]; }
interface SRList       { type: string; leaders: SRRankEntry[]; }

export async function GET() {
  try {
    const raw = (await getCachedMLSSeasonLeaders()) as Record<string, unknown>;

    const lists = (raw?.lists as SRList[]) ?? [];

    if (!lists.length) {
      return NextResponse.json(
        { error: 'No leader data returned from Sportradar', raw: Object.keys(raw ?? {}) },
        { status: 404 }
      );
    }

    const seenIds   = new Set<string>();
    const categories: MLSStatCategory[] = [];

    const sorted = [...lists].sort((a, b) => {
      const ai = DISPLAY_ORDER.indexOf(a.type);
      const bi = DISPLAY_ORDER.indexOf(b.type);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });

    for (const list of sorted) {
      const meta = LIST_TYPE_MAP[list.type];
      if (!meta || seenIds.has(meta.id)) continue;
      seenIds.add(meta.id);

      const leaders: MLSStatEntry[] = [];

      for (const rankEntry of list.leaders) {
        for (const player of rankEntry.players ?? []) {
          if (leaders.length >= 5) break;

          const competitor = player.competitors?.[0];
          const datapoint  = competitor?.datapoints?.find((dp) => dp.type === list.type);
          const value      = datapoint?.value ?? 0;

          if (value === 0) continue;

          leaders.push({
            rank:   rankEntry.rank,
            player: player.name ?? 'Unknown',
            team:   competitor?.abbreviation ?? competitor?.name ?? '',
            value,
          });
        }
        if (leaders.length >= 5) break;
      }

      if (leaders.length > 0) {
        categories.push({ id: meta.id, label: meta.label, abbreviation: meta.abbreviation, leaders });
      }
    }

    return NextResponse.json({
      categories,
      generatedAt: new Date().toISOString(),
      source: 'sportradar',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch MLS player stats', details: message },
      { status: 500 }
    );
  }
}
