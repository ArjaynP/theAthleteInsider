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