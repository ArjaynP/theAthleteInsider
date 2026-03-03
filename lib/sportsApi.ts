// NBA Teams Standings
export async function fetchNBAStandings() {
  const url = `https://${process.env.RAPIDAPI_HOST_NBA}/nbastandings`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
      'X-RapidAPI-Host': process.env.RAPIDAPI_HOST_NBA!,
    },
  });

  if (!response.ok) {
    throw new Error(`NBA Standings API error: ${response.status}`);
  }

  return response.json();
}