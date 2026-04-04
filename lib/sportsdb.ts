import { getCached } from '@/lib/cache-helper';

const SEVEN_DAYS = 60 * 60 * 24 * 7;

// SportsRadar names → TheSportsDB search terms
// Also includes short canonical names used by UCL stats/standings/scores pages
const SR_TO_SPORTSDB: Record<string, string> = {
  // ── SportsRadar full names ──────────────────────────────────────────────────
  'Liverpool FC': 'Liverpool',
  'FC Barcelona': 'Barcelona',
  'Arsenal FC': 'Arsenal',
  'Chelsea FC': 'Chelsea',
  'Manchester City': 'Manchester City',
  'Newcastle United': 'Newcastle United',
  'Tottenham Hotspur': 'Tottenham Hotspur',
  'Bayern Munich': 'Bayern Munich',
  'Borussia Dortmund': 'Borussia Dortmund',
  'Bayer Leverkusen': 'Bayer Leverkusen',
  'Atalanta BC': 'Atalanta',
  'Inter Milano': 'Inter Milan',
  'Juventus Turin': 'Juventus',
  'Paris Saint-Germain': 'Paris SG',
  'AS Monaco': 'AS Monaco',
  'Atletico Madrid': 'Atletico Madrid',
  'Real Madrid': 'Real Madrid',
  'Sporting CP': 'Sporting CP',
  'SL Benfica': 'Benfica',
  'Club Brugge': 'Club Brugge',
  'Glasgow Rangers': 'Rangers',
  'Celtic Glasgow': 'Celtic',
  'FC Copenhagen': 'FC Copenhagen',
  'FC Basel 1893': 'FC Basel',
  'Galatasaray Istanbul': 'Galatasaray',
  'Fenerbahce Istanbul': 'Fenerbahce',
  'Olympiacos Piraeus': 'Olympiacos',
  'FK Crvena Zvezda Belgrade': 'Red Star Belgrade',
  'Bodoe/Glimt': 'Bodo/Glimt',
  'SK Sturm Graz': 'Sturm Graz',
  'Ferencvarosi Budapest': 'Ferencvaros',
  'Qarabag FK': 'Qarabag',
  'FC Kairat Almaty': 'FC Kairat',
  // UCL 2025-26 SportsRadar variants
  'Aston Villa FC': 'Aston Villa',
  'PSV Eindhoven': 'PSV',
  'AC Milan': 'AC Milan',
  'Celtic FC': 'Celtic',
  'Real Madrid CF': 'Real Madrid',
  'FC Internazionale Milano': 'Inter Milan',
  'FC Inter Milano': 'Inter Milan',
  'Club Atletico de Madrid': 'Atletico Madrid',
  'Olympique Marseille': 'Marseille',
  'Pafos FC': 'Pafos',
  'Union Saint-Gilloise': 'Union Saint-Gilloise',
  'Athletic Bilbao': 'Athletic Bilbao',
  'SSC Napoli': 'Napoli',
  'Ajax Amsterdam': 'Ajax',
  'Eintracht Frankfurt': 'Eintracht Frankfurt',
  'Slavia Prague': 'Slavia Prague',
  'Villarreal CF': 'Villarreal',

  // ── Short / canonical names (used by UCL stats, standings, scores pages) ───
  // These fall through to direct TheSportsDB search, but explicit mapping
  // handles cases where the canonical short name differs from TSDB's search key.
  'Liverpool': 'Liverpool',
  'Barcelona': 'Barcelona',
  'Arsenal': 'Arsenal',
  'Inter Milan': 'Inter Milan',
  'Aston Villa': 'Aston Villa',
  'PSV': 'PSV',
  'Atalanta': 'Atalanta',
  'Benfica': 'Benfica',
  'Monaco': 'AS Monaco',
  'Celtic': 'Celtic',
  'Juventus': 'Juventus',
};

async function fetchBadge(searchName: string): Promise<string> {
  const url = `https://www.thesportsdb.com/api/v1/json/3/searchteams.php?t=${encodeURIComponent(searchName)}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return '';
    const data = await res.json();
    return (data?.teams?.[0]?.strBadge as string) ?? '';
  } catch {
    return '';
  }
}

export async function getTeamLogo(srName: string): Promise<string | null> {
  const searchName = SR_TO_SPORTSDB[srName] ?? srName;
  const cacheKey = `sportsdb:badge:${searchName.toLowerCase().replace(/\s+/g, '_')}`;
  const result = await getCached(cacheKey, () => fetchBadge(searchName), SEVEN_DAYS);
  return result || null;
}

export async function getTeamLogos(srNames: string[]): Promise<Record<string, string | null>> {
  const unique = [...new Set(srNames)];
  // Batch requests (5 at a time) with a small delay between batches to avoid
  // Cloudflare rate limiting on TheSportsDB when many teams are fetched at once.
  const BATCH_SIZE = 5;
  const BATCH_DELAY_MS = 250;
  const result: Record<string, string | null> = {};
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    if (i > 0) await new Promise((r) => setTimeout(r, BATCH_DELAY_MS));
    const batch = unique.slice(i, i + BATCH_SIZE);
    const pairs = await Promise.all(batch.map(async (name) => [name, await getTeamLogo(name)] as const));
    for (const [name, logo] of pairs) result[name] = logo;
  }
  return result;
}

// ── ESPN UCL Team Logos ────────────────────────────────────────────────────────

const ESPN_UCL_URL = 'https://site.api.espn.com/apis/site/v2/sports/soccer/UEFA.Champions/teams';

// SportsRadar team name → ESPN displayName
const SR_TO_ESPN: Record<string, string> = {
  // SportsRadar full names
  'Arsenal FC': 'Arsenal',
  'Bayern Munich': 'Bayern Munich',
  'Liverpool FC': 'Liverpool',
  'Tottenham Hotspur': 'Tottenham Hotspur',
  'FC Barcelona': 'Barcelona',
  'Chelsea FC': 'Chelsea',
  'Sporting CP': 'Sporting CP',
  'Manchester City': 'Manchester City',
  'Real Madrid': 'Real Madrid',
  'Inter Milano': 'Internazionale',
  'Paris Saint-Germain': 'Paris Saint-Germain',
  'Newcastle United': 'Newcastle United',
  'Juventus Turin': 'Juventus',
  'Atletico Madrid': 'Atlético Madrid',
  'Atalanta BC': 'Atalanta',
  'Bayer Leverkusen': 'Bayer Leverkusen',
  'Borussia Dortmund': 'Borussia Dortmund',
  'Olympiacos Piraeus': 'Olympiacos',
  'Club Brugge': 'Club Brugge',
  'Galatasaray Istanbul': 'Galatasaray',
  'AS Monaco': 'AS Monaco',
  'Qarabag FK': 'FK Qarabag',
  'Bodoe/Glimt': 'Bodo/Glimt',
  'SL Benfica': 'Benfica',
  'Olympique Marseille': 'Marseille',
  'Pafos FC': 'Pafos',
  'Union Saint-Gilloise': 'Union St.-Gilloise',
  'PSV Eindhoven': 'PSV Eindhoven',
  'Athletic Bilbao': 'Athletic Club',
  'SSC Napoli': 'Napoli',
  'FC Copenhagen': 'F.C. København',
  'Ajax Amsterdam': 'Ajax Amsterdam',
  'Eintracht Frankfurt': 'Eintracht Frankfurt',
  'Slavia Prague': 'Slavia Prague',
  'Villarreal CF': 'Villarreal',
  'FC Kairat Almaty': 'Kairat Almaty',
  // Short / canonical names used by standings & scores pages
  // Only entries that differ from the SR full names already mapped above
  'Liverpool': 'Liverpool',
  'Barcelona': 'Barcelona',
  'Arsenal': 'Arsenal',
  'Chelsea': 'Chelsea',
  'Inter Milan': 'Internazionale',
  'Aston Villa': 'Aston Villa',
  'PSV': 'PSV Eindhoven',
  'Atalanta': 'Atalanta',
  'Benfica': 'Benfica',
  'Monaco': 'AS Monaco',
  'Juventus': 'Juventus',
  'Napoli': 'Napoli',
  'Ajax': 'Ajax Amsterdam',
  'Marseille': 'Marseille',
  'Galatasaray': 'Galatasaray',
  'Olympiacos': 'Olympiacos',
  'AC Milan': 'AC Milan',
  'Celtic': 'Celtic',
};

async function fetchESPNUCLLogos(): Promise<Record<string, string>> {
  const res = await fetch(ESPN_UCL_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`ESPN API error: ${res.status}`);
  const data = await res.json();
  const teams: { team: { displayName: string; logos?: { href: string }[] } }[] =
    data?.sports?.[0]?.leagues?.[0]?.teams ?? [];
  const map: Record<string, string> = {};
  for (const { team } of teams) {
    const logo = team.logos?.[0]?.href;
    if (logo) map[team.displayName] = logo;
  }
  return map;
}

/** Fetches logos for UCL teams by SportsRadar name from the ESPN API. Cached for 7 days. */
export async function getUCLTeamLogos(srNames: string[]): Promise<Record<string, string | null>> {
  const espnMap = await getCached('espn:ucl:logos', fetchESPNUCLLogos, SEVEN_DAYS);
  return Object.fromEntries(
    srNames.map((srName) => {
      const espnName = SR_TO_ESPN[srName] ?? srName;
      return [srName, espnMap[espnName] ?? null];
    })
  );
}