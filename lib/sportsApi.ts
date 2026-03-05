export async function fetchNBAStandings() {
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST_NBA;

  if (!apiKey || !apiHost) {
    throw new Error('Missing RAPIDAPI_KEY or RAPIDAPI_HOST_NBA in environment.');
  }

  const url = `https://${apiHost}/nbastandings`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost,
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
  const apiKey = process.env.RAPIDAPI_KEY;
  const apiHost = process.env.RAPIDAPI_HOST_NBA;

  if (!apiKey || !apiHost) {
    throw new Error('Missing RAPIDAPI_KEY or RAPIDAPI_HOST_NBA in environment.');
  }

  const response = await fetch(`https://${apiHost}/nbateamlist`, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': apiKey,
      'X-RapidAPI-Host': apiHost,
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
