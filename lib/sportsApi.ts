export async function fetchNBAStandings() {
  const apiKey = process.env.SPORTSRADAR_API_KEY;

  if (!apiKey) {
    throw new Error('Missing SPORTSRADAR_API_KEY in environment.');
  }

  const url = `https://api.sportradar.com/nba/trial/v8/en/seasons/2025/REG/standings.json?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`NBA Standings API error: ${response.status}`);
  }

  const data = await response.json();
  // Return full raw response — route.ts does the SportsRadar-specific mapping
  return data;
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
  const apiKey = process.env.SPORTSRADAR_API_KEY;

  if (!apiKey) {
    throw new Error('Missing SPORTSRADAR_API_KEY in environment.');
  }

  const url = `https://api.sportradar.com/nba/trial/v8/en/seasons/2025/REG/rankings.json?api_key=${apiKey}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`NBA Rankings API error: ${response.status}`);
  }

  const data = await response.json();
  return (data.conferences ?? []) as NBARankingsConference[];
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
    'https://site.api.espn.com/apis/v2/sports/baseball/mlb/standings?season=2025';

  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`MLB Standings API error: ${response.status}`);
  }

  const data = await response.json();
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
