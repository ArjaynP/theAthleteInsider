import { NextResponse } from 'next/server';

const UCL_SEASON_ID = 'sr:season:131129';

export async function GET() {
  const apiKey = process.env.SPORTSRADAR_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'Missing SPORTSRADAR_API_KEY' }, { status: 500 });

  try {
    const url = `https://api.sportradar.com/soccer/trial/v4/en/seasons/${encodeURIComponent(UCL_SEASON_ID)}/leaders.json?api_key=${apiKey}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' }, cache: 'no-store' });
    const text = await res.text();
    let json: unknown;
    try { json = JSON.parse(text); } catch { json = text; }

    return NextResponse.json({
      status: res.status,
      url: url.replace(apiKey, '***'),
      topLevelKeys: typeof json === 'object' && json !== null ? Object.keys(json as object) : null,
      raw: json,
    });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
