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