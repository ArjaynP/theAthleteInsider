import { NextResponse } from 'next/server';
import { getCachedNBAStandings, getCachedNBARankings, getCachedNFLStandings, getCachedMLBStandings, getCachedMLBSpringTrainingStandings } from '@/lib/cachedSportsData';

// Market + Name → abbreviation for SportsRadar NBA teams (no alias field in standings response)
const NBA_TEAM_ABBR: Record<string, string> = {
  'Atlanta Hawks': 'ATL', 'Boston Celtics': 'BOS', 'Brooklyn Nets': 'BKN',
  'Charlotte Hornets': 'CHA', 'Chicago Bulls': 'CHI', 'Cleveland Cavaliers': 'CLE',
  'Dallas Mavericks': 'DAL', 'Denver Nuggets': 'DEN', 'Detroit Pistons': 'DET',
  'Golden State Warriors': 'GSW', 'Houston Rockets': 'HOU', 'Indiana Pacers': 'IND',
  'Los Angeles Clippers': 'LAC', 'LA Clippers': 'LAC', 'Los Angeles Lakers': 'LAL', 'Memphis Grizzlies': 'MEM',
  'Miami Heat': 'MIA', 'Milwaukee Bucks': 'MIL', 'Minnesota Timberwolves': 'MIN',
  'New Orleans Pelicans': 'NOP', 'New York Knicks': 'NYK', 'Oklahoma City Thunder': 'OKC',
  'Orlando Magic': 'ORL', 'Philadelphia 76ers': 'PHI', 'Phoenix Suns': 'PHX',
  'Portland Trail Blazers': 'POR', 'Sacramento Kings': 'SAC', 'San Antonio Spurs': 'SAS',
  'Toronto Raptors': 'TOR', 'Utah Jazz': 'UTA', 'Washington Wizards': 'WAS',
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const league = searchParams.get('league')?.toUpperCase() || 'NBA';

  try {
    switch (league) {
      case 'NBA': {
        const [standingsResult, rankingsResult] = await Promise.allSettled([
          getCachedNBAStandings(),
          getCachedNBARankings(),
        ]);

        if (standingsResult.status === 'rejected') throw standingsResult.reason;

        // Build clinched map — silently skip if rankings are unavailable (e.g. 429)
        const clinched: Record<string, string> = {};
        if (rankingsResult.status === 'fulfilled') {
          for (const conf of rankingsResult.value) {
            for (const div of conf.divisions ?? []) {
              for (const team of div.teams ?? []) {
                if (team.rank?.clinched) {
                  clinched[`${team.market} ${team.name}`] = team.rank.clinched;
                }
              }
            }
          }
        } else {
          console.warn('NBA Rankings unavailable:', rankingsResult.reason?.message);
        }

        // Flatten SportsRadar conferences[].divisions[].teams[] → TeamStanding[]
        const raw = standingsResult.value as any;
        const teams: Record<string, unknown>[] = [];

        for (const conf of raw.conferences ?? []) {
          const conference = String(conf.alias ?? '').toUpperCase().includes('EAST') ? 'East' : 'West';
          for (const div of conf.divisions ?? []) {
            for (const t of div.teams ?? []) {
              const displayName = `${t.market} ${t.name}`;
              const abbreviation = NBA_TEAM_ABBR[displayName] ?? t.alias ?? t.market?.slice(0, 3).toUpperCase() ?? '?';

              const getRecord = (type: string): string => {
                const rec = (t.records ?? []).find((r: any) => r.record_type === type);
                return rec ? `${rec.wins}-${rec.losses}` : '-';
              };

              const pct = t.win_pct != null ? t.win_pct.toFixed(3) : '.000';
              const gbVal = t.games_behind?.conference;
              const gb = gbVal === 0 ? '-' : gbVal != null ? String(gbVal) : '-';
              const streak = t.streak ? `${t.streak.kind === 'win' ? 'W' : 'L'}${t.streak.length}` : '-';

              teams.push({
                rank: t.calc_rank?.conf_rank ?? 99,
                team: displayName,
                abbreviation,
                wins: t.wins ?? 0,
                losses: t.losses ?? 0,
                pct,
                gb,
                streak,
                conference,
                division: div.name ?? '-',
                league: 'NBA',
                home: getRecord('home'),
                away: getRecord('road'),
                last10: getRecord('last_10'),
                conferenceRecord: getRecord('conference'),
                divisionRecord: getRecord('division'),
              });
            }
          }
        }

        return NextResponse.json({ teams, clinched });
      }
      case 'NFL': {
        const teams = await getCachedNFLStandings();
        return NextResponse.json({ teams });
      }
      case 'MLB': {
        const teams = await getCachedMLBStandings();
        return NextResponse.json({ teams });
      }
      case 'MLB_SPRING': {
        const teams = await getCachedMLBSpringTrainingStandings();
        return NextResponse.json({ teams });
      }
      default:
        return NextResponse.json(
          { error: 'Invalid league. Use NBA, NFL, or MLB' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error fetching standings:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to fetch standings', details: message },
      { status: 500 }
    );
  }
}