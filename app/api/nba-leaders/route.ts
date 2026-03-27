import { NextResponse } from 'next/server';
import { getCachedNBALeagueLeaders } from '@/lib/cachedSportsData';

// Maps Sportradar team alias overrides (same as standings route)
const ALIAS_OVERRIDES: Record<string, string> = {
  GS: 'GSW',
  NY: 'NYK',
  NO: 'NOP',
  SA: 'SAS',
  WSH: 'WAS',
};

function normalizeAlias(alias: string): string {
  const upper = alias?.toUpperCase() ?? '';
  return ALIAS_OVERRIDES[upper] ?? upper;
}

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

const NBA_TEAM_ABBR: Record<string, string> = {
  'Atlanta Hawks': 'ATL', 'Boston Celtics': 'BOS', 'Brooklyn Nets': 'BKN',
  'Charlotte Hornets': 'CHA', 'Chicago Bulls': 'CHI', 'Cleveland Cavaliers': 'CLE',
  'Dallas Mavericks': 'DAL', 'Denver Nuggets': 'DEN', 'Detroit Pistons': 'DET',
  'Golden State Warriors': 'GSW', 'Houston Rockets': 'HOU', 'Indiana Pacers': 'IND',
  'Los Angeles Clippers': 'LAC', 'LA Clippers': 'LAC', 'Los Angeles Lakers': 'LAL', 'Memphis Grizzlies': 'MEM',
  'Miami Heat': 'MIA', 'Milwaukee Bucks': 'MIL', 'Minnesota Timberwolves': 'MIN',
  'New Orleans Pelicans': 'NOP', 'New York Knicks': 'NYK', 'Oklahoma City Thunder': 'OKC',
  'Orlando Magic': 'ORL', 'Philadelphia 76ers': 'PHI', 'Phoenix Suns': 'PHX',
  'Portland Trail Blazers': 'POR', 'Sacramento Kings': 'SAC', 'San Antonio Spurs': 'SAS',
  'Toronto Raptors': 'TOR', 'Utah Jazz': 'UTA', 'Washington Wizards': 'WAS',
};

// ──────────────────────────────────────────────────────────────────────────────
// Stat config — statKey must match the field name in the Sportradar response.
// For Pattern 1 (categories array with a `value` field) this just drives labelling.
// For Pattern 2 (flat average/total objects) this drives the lookup key.
// ──────────────────────────────────────────────────────────────────────────────
const STAT_CONFIG = [
  { id: 'ppg',    label: 'Points Per Game',       abbreviation: 'PPG',    statKey: 'points',             statGroup: 'average' as const, decimals: 1 },
  { id: 'rpg',    label: 'Rebounds Per Game',      abbreviation: 'RPG',    statKey: 'rebounds',           statGroup: 'average' as const, decimals: 1 },
  { id: 'apg',    label: 'Assists Per Game',        abbreviation: 'APG',    statKey: 'assists',            statGroup: 'average' as const, decimals: 1 },
  { id: 'spg',    label: 'Steals Per Game',         abbreviation: 'SPG',    statKey: 'steals',             statGroup: 'average' as const, decimals: 1 },
  { id: 'bpg',    label: 'Blocks Per Game',         abbreviation: 'BPG',    statKey: 'blocks',             statGroup: 'average' as const, decimals: 1 },
  { id: '3pm',    label: '3-Pointers Made',         abbreviation: '3PM',    statKey: 'three_points_made',  statGroup: 'average' as const, decimals: 1 },
  { id: 'fg_pct', label: 'Field Goal %',            abbreviation: 'FG%',    statKey: 'field_goals_pct',    statGroup: 'total'   as const, decimals: 1 },
  { id: '3p_pct', label: '3-Point %',               abbreviation: '3P%',    statKey: 'three_points_pct',   statGroup: 'total'   as const, decimals: 1 },
  { id: 'ft_pct', label: 'Free Throw %',            abbreviation: 'FT%',    statKey: 'free_throws_pct',    statGroup: 'total'   as const, decimals: 1 },
  { id: 'oreb',   label: 'Offensive Rebounds',      abbreviation: 'OREB',   statKey: 'offensive_rebounds', statGroup: 'average' as const, decimals: 1 },
  { id: 'dreb',   label: 'Defensive Rebounds',      abbreviation: 'DREB',   statKey: 'defensive_rebounds', statGroup: 'average' as const, decimals: 1 },
  { id: 'tov',    label: 'Turnovers',               abbreviation: 'TOV',    statKey: 'turnovers',          statGroup: 'average' as const, decimals: 1 },
  { id: 'mpg',    label: 'Minutes Per Game',        abbreviation: 'MPG',    statKey: 'minutes',            statGroup: 'average' as const, decimals: 1 },
];

// Sportradar v8 category name → our STAT_CONFIG id
const SR_NAME_TO_ID: Record<string, string> = {
  points:               'ppg',
  rebounds:             'rpg',
  assists:                    'apg',
  steals:                     'spg',
  blocks:                     'bpg',
  three_points_made:          '3pm',
  field_goals_pct:            'fg_pct',
  three_points_pct:           '3p_pct',
  free_throws_pct:            'ft_pct',
  offensive_rebounds:         'oreb',
  off_rebounds:               'oreb',
  defensive_rebounds:         'dreb',
  def_rebounds:               'dreb',
  turnovers:                  'tov',
  minutes:                    'mpg',
  // Alternate Sportradar v8 names (Title Case / verbose)
  'points per game':          'ppg',
  'scoring':                  'ppg',
  'rebounds per game':        'rpg',
  'total rebounds':           'rpg',
  'assists per game':         'apg',
  'steals per game':          'spg',
  'blocks per game':          'bpg',
  'blocked shots':            'bpg',
  'three points made':        '3pm',
  '3 pointers made':          '3pm',
  'three_point percentage':   '3p_pct',
  'field goal percentage':    'fg_pct',
  'free throw percentage':    'ft_pct',
  'offensive rebounds':       'oreb',
  'defensive rebounds':       'dreb',
  'minutes per game':         'mpg',
};

function resolveTeamAbbreviation(entry: Record<string, unknown>): string {
  const teams = entry.teams as Array<Record<string, unknown>> | undefined;
  const team = Array.isArray(teams) && teams[0] ? teams[0] : undefined;

  const directAlias = normalizeAlias(
    String((team as any)?.alias ?? (entry.team as any)?.alias ?? '')
  );
  if (directAlias) return directAlias;

  const market = String((team as any)?.market ?? (entry.team as any)?.market ?? '').trim();
  const name = String((team as any)?.name ?? (entry.team as any)?.name ?? '').trim();
  const display = `${market} ${name}`.trim();

  if (display && NBA_TEAM_ABBR[display]) {
    return NBA_TEAM_ABBR[display];
  }

  if (market) {
    return normalizeAlias(market.slice(0, 3));
  }

  return 'NBA';
}

// ──────────────────────────────────────────────────────────────────────────────
// Shared helper: turn a raw leader entry into our standard LeaderEntry
// ──────────────────────────────────────────────────────────────────────────────
function extractLeaderEntry(
  e: Record<string, unknown>,
  idx: number,
  statKey: string,
  decimals: number,
  isPercentage: boolean,
  statGroup: 'average' | 'total',
): LeaderEntry {
  const alias = resolveTeamAbbreviation(e);
  const fullName =
    (e.player as any)?.full_name ??
    [(e.player as any)?.first_name, (e.player as any)?.last_name].filter(Boolean).join(' ') ??
    'Unknown';

  // Priority: direct `value` field → nested average/total objects
  const rawVal: number =
    (e.score as number) ??
    (e.value as number) ??
    ((e[statGroup] as Record<string, number>)?.[statKey]) ??
    ((e.average as Record<string, number>)?.[statKey]) ??
    ((e.total as Record<string, number>)?.[statKey]) ??
    0;

  // Percentage stats from `total` come as 0–1 fractions → multiply by 100
  const value = isPercentage
    ? parseFloat(((rawVal <= 1.5 ? rawVal * 100 : rawVal)).toFixed(decimals))
    : parseFloat(rawVal.toFixed(decimals));

  return { rank: (e.rank as number) ?? idx + 1, player: fullName, team: alias, value };
}

// ──────────────────────────────────────────────────────────────────────────────
// Pattern 1 — Sportradar v8: raw.categories = [{name, leaders: [...]}]
// ──────────────────────────────────────────────────────────────────────────────
function tryParseCategoriesArray(raw: Record<string, unknown>): StatCategory[] {
  const srCats = raw.categories as Array<Record<string, unknown>> | undefined;
  if (!Array.isArray(srCats) || srCats.length === 0) return [];

  // Always log actual names — essential for diagnosing name mismatches
  console.log('[nba-leaders] SR category names:', srCats.map(c => c.name));

  const out: StatCategory[] = [];
  const seen = new Set<string>();
  for (const srCat of srCats) {
    const rawName = (srCat.name as string | undefined) ?? '';
    const name    = rawName.toLowerCase().trim();
    const srType  = String(srCat.type ?? '').toLowerCase().trim();

    // Direct lookup first, then substring/containment fallback
    let cfgId = SR_NAME_TO_ID[name];
    if (!cfgId) {
      for (const [key, id] of Object.entries(SR_NAME_TO_ID)) {
        if (name.includes(key) || key.includes(name)) {
          cfgId = id;
          break;
        }
      }
    }

    const cfg = cfgId ? STAT_CONFIG.find(c => c.id === cfgId) : undefined;
    if (!cfg) continue;

    // Leaders payload has both total + average for many categories.
    // Keep only the category type that matches the card we render.
    if (srType && srType !== cfg.statGroup) continue;
    if (seen.has(cfg.id)) continue;

    const entries =
      (srCat.ranks as Array<Record<string, unknown>> | undefined) ??
      (srCat.leaders as Array<Record<string, unknown>> | undefined);
    if (!Array.isArray(entries) || entries.length === 0) continue;

    const isPercentage = cfg.statGroup === 'total' && cfg.statKey.endsWith('_pct');
    const leaders = entries.slice(0, 5).map((e, i) =>
      extractLeaderEntry(e, i, cfg.statKey, cfg.decimals, isPercentage, cfg.statGroup)
    );
    if (leaders.length > 0) {
      out.push({ id: cfg.id, label: cfg.label, abbreviation: cfg.abbreviation, leaders });
      seen.add(cfg.id);
    }
  }
  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
// Pattern 2 — flat: raw.average.points = [...], raw.total.field_goals_pct = [...]
// Also handles league-nested: raw.league.leaders.average / raw.league.leaders.total
// ──────────────────────────────────────────────────────────────────────────────
function tryParseFlatAverageTotal(raw: Record<string, unknown>): StatCategory[] {
  const leagueLeaders = (raw.league as any)?.leaders ?? {};
  const averageGroup  = (raw.average ?? leagueLeaders.average ?? {}) as Record<string, unknown[]>;
  const totalGroup    = (raw.total   ?? leagueLeaders.total   ?? {}) as Record<string, unknown[]>;

  const out: StatCategory[] = [];
  for (const cfg of STAT_CONFIG) {
    const group   = cfg.statGroup === 'average' ? averageGroup : totalGroup;
    const entries = group[cfg.statKey];
    if (!Array.isArray(entries) || entries.length === 0) continue;

    const isPercentage = cfg.statGroup === 'total' && cfg.statKey.endsWith('_pct');
    const leaders = entries.slice(0, 5).map((e: unknown, i) =>
      extractLeaderEntry(e as Record<string, unknown>, i, cfg.statKey, cfg.decimals, isPercentage, cfg.statGroup)
    );
    if (leaders.length > 0) out.push({ id: cfg.id, label: cfg.label, abbreviation: cfg.abbreviation, leaders });
  }
  return out;
}

function parseLeadersFromRaw(raw: Record<string, unknown>): StatCategory[] {
  // [] is truthy in JS so must check .length, not use ||
  const cats = tryParseCategoriesArray(raw);
  return cats.length > 0 ? cats : tryParseFlatAverageTotal(raw);
}

export async function GET() {
  try {
    const raw = await getCachedNBALeagueLeaders() as Record<string, unknown>;
    const categories = parseLeadersFromRaw(raw);

    if (categories.length === 0) {
      const debugKeys = Object.keys(raw);
      const srCats = raw.categories as Array<Record<string, unknown>> | undefined;
      const sampleNames = Array.isArray(srCats) ? srCats.slice(0, 5).map(c => c.name) : [];
      const sampleLeaderKeys = Array.isArray(srCats) && srCats[0]
        ? Object.keys(((srCats[0].ranks as any)?.[0] ?? (srCats[0].leaders as any)?.[0] ?? {}))
        : [];
      console.warn('NBA Leaders: parser found no categories.', {
        topLevelKeys: debugKeys,
        categoryNames: sampleNames,
        leaderEntryKeys: sampleLeaderKeys,
      });
      return NextResponse.json(
        { error: 'No leader data available', debug: { topLevelKeys: debugKeys, categoryNames: sampleNames } },
        { status: 503 }
      );
    }

    return NextResponse.json({ categories });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('NBA Leaders API error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
