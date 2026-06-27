// UCL Season ID for 2025-26
const UCL_SEASON_ID = 'sr:season:131129';
const MLS_COMPETITION_ID = 'sr:competition:242';

let cachedMLSSeasonId: string | null = null;
let cachedMLSSeasonIdAt = 0;
const MLS_SEASON_CACHE_MS = 6 * 60 * 60 * 1000;

async function resolveCurrentMLSSeasonId(): Promise<string> {
  const now = Date.now();
  if (cachedMLSSeasonId && now - cachedMLSSeasonIdAt < MLS_SEASON_CACHE_MS) {
    return cachedMLSSeasonId;
  }

  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/soccer/trial/v4/en/competitions/${MLS_COMPETITION_ID}/seasons.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`MLS Seasons API error: ${response.status}`);
  }

  const data = await response.json() as {
    seasons?: Array<{ id?: string; start_date?: string; end_date?: string }>;
  };

  const seasons = (data.seasons ?? [])
    .map((season) => ({
      id: season.id ?? '',
      start: season.start_date ? new Date(season.start_date).getTime() : Number.NaN,
      end: season.end_date ? new Date(season.end_date).getTime() : Number.NaN,
    }))
    .filter((season) => season.id.length > 0);

  if (seasons.length === 0) {
    throw new Error('MLS Seasons API returned no seasons');
  }

  const active = seasons.find((season) => Number.isFinite(season.start) && Number.isFinite(season.end) && season.start <= now && now <= season.end);
  const latest = [...seasons].sort((a, b) => {
    const aStart = Number.isFinite(a.start) ? a.start : Number.NEGATIVE_INFINITY;
    const bStart = Number.isFinite(b.start) ? b.start : Number.NEGATIVE_INFINITY;
    return bStart - aStart;
  })[0];

  cachedMLSSeasonId = (active ?? latest).id;
  cachedMLSSeasonIdAt = now;
  return cachedMLSSeasonId;
}

export async function fetchUCLStandings(): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${UCL_SEASON_ID}/standings.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`UCL Standings API error: ${response.status}`);
  return response.json();
}

export async function fetchUCLSchedule(): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${UCL_SEASON_ID}/schedules.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`UCL Schedule API error: ${response.status}`);
  return response.json();
}

export async function fetchUCLSeasonLeaders(): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${UCL_SEASON_ID}/leaders.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`UCL Season Leaders API error: ${response.status}`);
  return response.json();
}

export async function fetchUCLSeasonCompetitors(): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${UCL_SEASON_ID}/competitors.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`UCL Season Competitors API error: ${response.status}`);
  return response.json();
}

export async function fetchUCLCompetitorStats(competitorId: string): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const encodedId = encodeURIComponent(competitorId);
  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${UCL_SEASON_ID}/competitors/${encodedId}/statistics.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`UCL Competitor Stats API error: ${response.status} for ${competitorId}`);
  return response.json();
}

/**
 * Season summaries for UCL — paginated (100 per page).
 * Pass `start` to fetch further pages (0-indexed offset).
 * TTL: 300 s (5 min) — set by the caller via getCached.
 */
export async function fetchUCLSeasonSummaries(start = 0): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${UCL_SEASON_ID}/summaries.json?start=${start}&api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`UCL Season Summaries API error: ${response.status}`);
  return response.json();
}

/**
 * Live summaries across all competitions — filter by UCL competitor IDs in the route.
 * TTL: 1 s — the only truly real-time endpoint.
 */
export async function fetchUCLLiveSummaries(): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/soccer/trial/v4/en/schedules/live/summaries.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`UCL Live Summaries API error: ${response.status}`);
  return response.json();
}

export async function fetchMLSFormStandings(): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');
  const seasonId = await resolveCurrentMLSSeasonId();

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${seasonId}/form_standings.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLS Form Standings API error: ${response.status}`);
  return response.json();
}

export async function fetchMLSStandings(): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');
  const seasonId = await resolveCurrentMLSSeasonId();

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${seasonId}/standings.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLS Standings API error: ${response.status}`);
  return response.json();
}

/**
 * Season summaries for MLS — paginated (100 per page).
 * Pass `start` to fetch further pages (0-indexed offset).
 */
export async function fetchMLSSeasonSummaries(start = 0): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');
  const seasonId = await resolveCurrentMLSSeasonId();

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${seasonId}/summaries.json?start=${start}&api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLS Season Summaries API error: ${response.status}`);
  return response.json();
}

export async function fetchMLSSeasonLeaders(): Promise<Record<string, unknown>> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');
  const seasonId = await resolveCurrentMLSSeasonId();

  const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${seasonId}/leaders.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLS Season Leaders API error: ${response.status}`);
  return response.json();
}

// Static fallback: maps team abbreviation → division name
// Used when ESPN's API doesn't return the division-level hierarchy.
const NBA_DIVISION_BY_ABBR: Record<string, string> = {
  BOS: 'Atlantic', BKN: 'Atlantic', NYK: 'Atlantic', PHI: 'Atlantic', TOR: 'Atlantic',
  CHI: 'Central',  CLE: 'Central',  DET: 'Central',  IND: 'Central',  MIL: 'Central',
  ATL: 'Southeast',CHA: 'Southeast',MIA: 'Southeast',ORL: 'Southeast',WAS: 'Southeast',
  DAL: 'Southwest',HOU: 'Southwest',MEM: 'Southwest',NOP: 'Southwest',SAS: 'Southwest',
  DEN: 'Northwest',MIN: 'Northwest',OKC: 'Northwest',POR: 'Northwest',UTA: 'Northwest',
  GSW: 'Pacific',  LAC: 'Pacific',  LAL: 'Pacific',  PHX: 'Pacific',  SAC: 'Pacific',
};

export async function fetchNBAStandings() {
  // ESPN public API — no key required; returns conferences → divisions → teams
  const url = 'https://site.api.espn.com/apis/v2/sports/basketball/nba/standings?season=2026';

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`NBA Standings API error: ${response.status}`);
  }

  const data = await response.json();

  // Transform ESPN conference→division→team tree into the internal shape:
  // { conferences[{ alias, divisions[{ name, teams[] }] }] }
  // ESPN v2 can return either:
  //   (a) conf.children[] = divisions, each with div.standings.entries[]
  //   (b) conf.standings.entries[] flat (no division children) — off-season/playoff response
  // Both cases are handled below; division is derived from NBA_DIVISION_BY_ABBR when missing.
  type EspnStat = { name?: string; type?: string; value?: number; displayValue?: string; summary?: string };

  const getStat = (stats: EspnStat[], key: string) =>
    stats.find(s => (s.type ?? s.name ?? '').toLowerCase() === key.toLowerCase());
  const getVal  = (stats: EspnStat[], key: string, fb = 0) => getStat(stats, key)?.value ?? fb;
  const getDisp = (stats: EspnStat[], key: string, fb = '') => getStat(stats, key)?.displayValue ?? fb;
  const getSumm = (stats: EspnStat[], key: string, fb = '-') => getStat(stats, key)?.summary ?? fb;

  const parseRec = (summary: string) => {
    const [w, l] = summary.split('-').map(Number);
    return { wins: isNaN(w) ? 0 : w, losses: isNaN(l) ? 0 : l };
  };

  function buildTeamEntry(entry: any): unknown {
    const stats: EspnStat[] = entry.stats ?? [];
    const wins     = Math.round(getVal(stats, 'wins'));
    const losses   = Math.round(getVal(stats, 'losses'));
    const winPct   = getVal(stats, 'winpercent');
    const gbRaw    = getVal(stats, 'gamesbehind');
    const seed     = Math.round(getVal(stats, 'playoffseed', 99));
    const streakStr  = getDisp(stats, 'streak');
    const streakKind = streakStr.startsWith('W') ? 'win' : 'loss';
    const streakLen  = parseInt(streakStr.slice(1), 10) || 0;
    return {
      market: entry.team?.location ?? '',
      name:   entry.team?.name ?? '',
      alias:  entry.team?.abbreviation ?? '',
      wins,
      losses,
      win_pct: winPct,
      games_behind: { conference: gbRaw },
      streak: streakLen > 0 ? { kind: streakKind, length: streakLen } : null,
      calc_rank: { conf_rank: seed },
      records: [
        { record_type: 'home',       ...parseRec(getSumm(stats, 'home')) },
        { record_type: 'road',       ...parseRec(getSumm(stats, 'road')) },
        { record_type: 'last_10',    ...parseRec(getSumm(stats, 'lastten')) },
        { record_type: 'conference', ...parseRec(getSumm(stats, 'vsconf')) },
        { record_type: 'division',   ...parseRec(getSumm(stats, 'vsdivision')) },
      ],
    };
  }

  const conferences: unknown[] = [];

  for (const conf of data.children ?? []) {
    const confName: string = (conf.abbreviation ?? conf.name ?? '').toUpperCase();
    const confAlias = confName.includes('EAST') || confName === 'EAST' ? 'EAST' : 'WEST';
    const divisions: unknown[] = [];

    const divChildren: any[] = conf.children ?? [];

    if (divChildren.length > 0) {
      // Case (a): ESPN returned division hierarchy
      for (const div of divChildren) {
        const teams: unknown[] = [];
        for (const entry of div.standings?.entries ?? []) {
          teams.push(buildTeamEntry(entry));
        }
        if (teams.length > 0) {
          divisions.push({ name: div.name ?? '', teams });
        }
      }
    }

    // Case (b): no division children — group flat entries by division using lookup table
    if (divisions.length === 0) {
      const flatEntries: any[] = conf.standings?.entries ?? [];
      const divMap = new Map<string, unknown[]>();
      for (const entry of flatEntries) {
        const abbr: string = (entry.team?.abbreviation ?? '').toUpperCase();
        const divName = NBA_DIVISION_BY_ABBR[abbr] ?? 'Unknown';
        if (!divMap.has(divName)) divMap.set(divName, []);
        divMap.get(divName)!.push(buildTeamEntry(entry));
      }
      for (const [divName, teams] of divMap) {
        divisions.push({ name: divName, teams });
      }
    }

    conferences.push({ alias: confAlias, divisions });
  }

  return { conferences };
}

export type NBARankingsConference = {
  id: string;
  name: string;
  alias: string;
  divisions: Array<{
    id: string;
    name: string;
    alias: string;
    teams: Array<{
      id: string;
      name: string;
      market: string;
      rank: {
        conference: number;
        division: number;
        clinched?: string;
      };
    }>;
  }>;
};

export async function fetchNBARankings(): Promise<NBARankingsConference[]> {
  // Sportradar rankings endpoint is not available on the trial tier (returns 403).
  // Clinch statuses are computed mathematically in route.ts from the standings data.
  return [];
}

export type NBATeamListItem = {
  id?: string | number;
  name?: string;
  abbreviation?: string;
  logo?: string;
  logoLight?: string;
  logoDark?: string;
  [key: string]: unknown;
};

export async function fetchNBATeamsList(): Promise<NBATeamListItem[]> {
  const response = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams',
    { method: 'GET', headers: { Accept: 'application/json' }, next: { revalidate: 86400 } }
  );

  if (!response.ok) {
    throw new Error(`NBA Teams API error: ${response.status}`);
  }

  const data = await response.json();

  const teamEntries: any[] =
    data?.sports?.[0]?.leagues?.[0]?.teams ?? [];

  return teamEntries.map((entry: any) => {
    const team = entry?.team ?? entry;
    const logos: any[] = Array.isArray(team?.logos) ? team.logos : [];

    const defaultLogo =
      logos.find((l) => Array.isArray(l?.rel) && l.rel.includes('default') && !l.rel.includes('scoreboard'))?.href ??
      logos[0]?.href;

    const darkLogo =
      logos.find((l) => Array.isArray(l?.rel) && l.rel.includes('dark') && !l.rel.includes('scoreboard'))?.href ??
      defaultLogo;

    return {
      id: team?.id,
      name: team?.displayName ?? team?.name,
      abbreviation: team?.abbreviation,
      logo: defaultLogo,
      logoLight: defaultLogo,
      logoDark: darkLogo,
    } satisfies NBATeamListItem;
  });
}

function parseESPNTeamEntries(entries: any[]): NBATeamListItem[] {
  return entries.map((entry: any) => {
    const team = entry?.team ?? entry;
    const logos: any[] = Array.isArray(team?.logos) ? team.logos : [];

    const defaultLogo =
      logos.find((l) => Array.isArray(l?.rel) && l.rel.includes('default') && !l.rel.includes('scoreboard'))?.href ??
      logos[0]?.href;

    const darkLogo =
      logos.find((l) => Array.isArray(l?.rel) && l.rel.includes('dark') && !l.rel.includes('scoreboard'))?.href ??
      defaultLogo;

    return {
      id: team?.id,
      name: team?.displayName ?? team?.name,
      abbreviation: team?.abbreviation,
      logo: defaultLogo,
      logoLight: defaultLogo,
      logoDark: darkLogo,
    } satisfies NBATeamListItem;
  });
}

export async function fetchMLBTeamsList(): Promise<NBATeamListItem[]> {
  const response = await fetch(
    'https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/teams',
    { method: 'GET', headers: { Accept: 'application/json' }, next: { revalidate: 86400 } }
  );

  if (!response.ok) {
    throw new Error(`MLB Teams API error: ${response.status}`);
  }

  const data = await response.json();
  const teamEntries: any[] = data?.sports?.[0]?.leagues?.[0]?.teams ?? [];
  return parseESPNTeamEntries(teamEntries);
}

export async function fetchNFLStandings() {
  const url =
    'https://site.api.espn.com/apis/v2/sports/football/nfl/standings?season=2025';

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`NFL Standings API error: ${response.status}`);
  }

  const data = await response.json();
  return data.standings?.entries || [];
}

export async function fetchMLBStandings() {
  const url =
    'https://site.api.espn.com/apis/v2/sports/baseball/mlb/standings?season=2026';

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`MLB Standings API error: ${response.status}`);
  }

  const data = await response.json();

  // 2026+ endpoint returns a children[] structure (one per league)
  if (Array.isArray(data.children)) {
    const entries: unknown[] = [];
    for (const child of data.children) {
      const childEntries = child?.standings?.entries;
      if (Array.isArray(childEntries)) entries.push(...childEntries);
    }
    return entries;
  }

  return data.standings?.entries || [];
}

export async function fetchMLBSpringTrainingStandings() {
  const url =
    'https://site.api.espn.com/apis/v2/sports/baseball/mlb/standings?season=2026&seasontype=1';

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`MLB Spring Training Standings API error: ${response.status}`);
  }

  const data = await response.json();
  return data.standings?.entries || [];
}

export async function fetchNBALeagueLeaders() {
  const apiKey = process.env.SPORTSRADAR_API_KEY;

  if (!apiKey) {
    throw new Error('Missing SPORTSRADAR_API_KEY in environment.');
  }

  const url = `https://api.sportradar.com/nba/trial/v8/en/seasons/2025/REG/leaders.json?api_key=${apiKey}`;

  // Use cache: 'no-store' to skip Next.js data cache — response is ~3.76MB which
  // exceeds the 2MB limit. Redis (getCached) handles caching instead.
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`NBA League Leaders API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetches every active NBA player's headshot URL from ESPN by pulling all 30
 * team rosters in parallel.  Returns a map keyed by lower-cased display name
 * so callers can do a fast case-insensitive lookup.
 *
 * Headshot pattern: https://a.espncdn.com/i/headshots/nba/players/full/{id}.png
 */
export async function fetchNBAPlayerHeadshots(): Promise<Record<string, string>> {
  // Reuse the teams list we already cache elsewhere.
  const teams = await fetchNBATeamsList();
  const teamIds = teams.map((t) => t.id).filter(Boolean) as (string | number)[];

  const rosterResponses = await Promise.allSettled(
    teamIds.map((id) =>
      fetch(
        `https://site.api.espn.com/apis/site/v2/sports/basketball/nba/teams/${id}/roster`,
        { headers: { Accept: 'application/json' }, next: { revalidate: 86400 } }
      ).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`Roster ${id}: ${r.status}`))))
    )
  );

  const map: Record<string, string> = {};

  // Normalize a name to a consistent lookup key: lowercase + strip diacritics.
  // This ensures "Luka Dončić" (SportsRadar) matches "Luka Doncic" (ESPN) and vice versa.
  function nameKey(name: string): string {
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  for (const result of rosterResponses) {
    if (result.status !== 'fulfilled') continue;
    const data = result.value as Record<string, unknown>;

    // ESPN returns athletes either as flat array or grouped by position
    const topLevel = Array.isArray(data.athletes) ? (data.athletes as any[]) : [];

    for (const entry of topLevel) {
      // Position-group shape: { position: string, items: [...] }
      const players: any[] = Array.isArray(entry.items) ? entry.items : [entry];

      for (const player of players) {
        if (!player?.id || !player?.displayName) continue;

        const headshotUrl: string =
          (typeof player.headshot === 'string'
            ? player.headshot
            : (player.headshot as any)?.href) ??
          `https://a.espncdn.com/i/headshots/nba/players/full/${player.id}.png`;

        map[nameKey(player.displayName as string)] = headshotUrl;

        // Also index by fullName when it differs (e.g. "Nicolas Claxton" vs "Nic Claxton")
        if (player.fullName && player.fullName !== player.displayName) {
          map[nameKey(player.fullName as string)] = headshotUrl;
        }
      }
    }
  }

  return map;
}

export async function fetchMLBSportsRadarStandings() {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/mlb/trial/v8/en/seasons/2026/REG/standings.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLB SportsRadar Standings API error: ${response.status}`);
  return response.json();
}

export async function fetchMLBSportsRadarRankings() {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const url = `https://api.sportradar.com/mlb/trial/v8/en/seasons/2026/REG/rankings.json?api_key=${apiKey}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) throw new Error(`MLB SportsRadar Rankings API error: ${response.status}`);
  return response.json();
}

function getSportsRadarHost() {
  return process.env.SPORTSRADAR_HOST ?? 'https://api.sportradar.com';
}

function getSportsRadarAccessLevel() {
  return process.env.SPORTSRADAR_ACCESS_LEVEL ?? 'trial';
}

export async function fetchMLBDailyBoxscore(date: { year: string; month: string; day: string }) {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const host = getSportsRadarHost();
  const accessLevel = getSportsRadarAccessLevel();
  const { year, month, day } = date;
  const url = `${host}/mlb/${accessLevel}/v8/en/games/${year}/${month}/${day}/boxscore.json?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLB Daily Boxscore API error: ${response.status}`);
  return response.json();
}

export async function fetchMLBGameBoxscore(gameId: string) {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const host = getSportsRadarHost();
  const accessLevel = getSportsRadarAccessLevel();
  const url = `${host}/mlb/${accessLevel}/v8/en/games/${gameId}/boxscore.json?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLB Game Boxscore API error: ${response.status}`);
  return response.json();
}

export async function fetchMLBDailySchedule(date: { year: string; month: string; day: string }) {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const host = getSportsRadarHost();
  const accessLevel = getSportsRadarAccessLevel();
  const { year, month, day } = date;
  const url = `${host}/mlb/${accessLevel}/v8/en/games/${year}/${month}/${day}/schedule.json?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLB Daily Schedule API error: ${response.status}`);
  return response.json();
}

export async function fetchMLBSeasonalStatsByTeam(teamId: string, year: number): Promise<unknown> {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) throw new Error('Missing SPORTSRADAR_API_KEY');

  const host = getSportsRadarHost();
  const accessLevel = getSportsRadarAccessLevel();
  const url = `${host}/mlb/${accessLevel}/v8/en/seasons/${year}/REG/teams/${teamId}/statistics.json?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`MLB Seasonal Stats API error: ${response.status} (team ${teamId})`);
  return response.json();
}
