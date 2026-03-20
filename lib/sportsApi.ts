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
  
  // Extract the entries (teams) from the nested structure
  return data.standings?.entries || [];
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
  const apiKey = process.env.SPORTSRADAR_API_KEY;

  if (!apiKey) {
    throw new Error('Missing SPORTSRADAR_API_KEY in environment.');
  }

  const response = await fetch(`https://api.sportradar.com/nba/trial/v8/en/league/teams.json?api_key=${apiKey}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`NBA Teams API error: ${response.status}`);
  }

  const data = await response.json();

  const leagues = Array.isArray(data?.sports)
    ? data.sports.flatMap((sport: any) => (Array.isArray(sport?.leagues) ? sport.leagues : []))
    : [];

  const nbaLeague = leagues.find((league: any) => league?.abbreviation === 'NBA') ?? leagues[0];
  const teams = Array.isArray(nbaLeague?.teams) ? nbaLeague.teams : [];

  return teams.map((entry: any) => {
    const team = entry?.team ?? entry;
    const logos = Array.isArray(team?.logos) ? team.logos : [];

    const defaultLogo =
      logos.find((logo: any) => Array.isArray(logo?.rel) && logo.rel.includes('default'))?.href ??
      logos[0]?.href;

    const darkLogo =
      logos.find((logo: any) => Array.isArray(logo?.rel) && logo.rel.includes('dark'))?.href ??
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
