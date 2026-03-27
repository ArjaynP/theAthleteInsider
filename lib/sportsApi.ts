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
