import { NextResponse } from 'next/server';
import { getCachedNBAStandings, getCachedNBARankings, getCachedNFLStandings, getCachedMLBStandings, getCachedMLBSpringTrainingStandings } from '@/lib/cachedSportsData';

// ─── Clinch computation ────────────────────────────────────────────────────
// Priority: division (5) > conference (4) > playoff_berth (3) > play_in (2) > eliminated (1)
const CLINCH_PRIORITY: Record<string, number> = {
  eliminated: 1, play_in: 2, playoff_berth: 3, conference: 4, division: 5,
};
const NBA_GAMES = 82;

function setIfHigher(map: Record<string, string>, key: string, status: string) {
  if ((CLINCH_PRIORITY[status] ?? 0) > (CLINCH_PRIORITY[map[key]] ?? 0)) {
    map[key] = status;
  }
}

function computeClinchedFromStandings(
  teams: Array<{ team: string; wins: number; losses: number; conference: string; division: string }>
): Record<string, string> {
  const result: Record<string, string> = {};
  const byDivision: Record<string, typeof teams> = {};
  const byConference: Record<string, typeof teams> = {};

  for (const t of teams) {
    const dk = `${t.conference}::${t.division}`;
    (byDivision[dk] ??= []).push(t);
    (byConference[t.conference] ??= []).push(t);
  }

  // Division clinch: leader.wins > 82 - second_place.losses
  for (const divTeams of Object.values(byDivision)) {
    const sorted = [...divTeams].sort((a, b) => b.wins - a.wins || a.losses - b.losses);
    if (sorted.length < 2) continue;
    const [leader, second] = sorted;
    if (leader.wins > NBA_GAMES - second.losses) {
      setIfHigher(result, leader.team, 'division');
    }
  }

  // Conference-level: playoff berth (top 6), play-in (7–10), elimination (11+)
  for (const confTeams of Object.values(byConference)) {
    const sorted = [...confTeams].sort((a, b) => b.wins - a.wins || a.losses - b.losses);
    const seventh  = sorted[6];   // 0-indexed = 7th place
    const tenth    = sorted[9];   // 0-indexed = 10th place
    const eleventh = sorted[10];  // 0-indexed = 11th place

    for (let i = 0; i < sorted.length; i++) {
      const team = sorted[i];

      if (i <= 5 && seventh) {
        // Top-6: clinch playoff berth when guaranteed above 7th
        if (team.wins > NBA_GAMES - seventh.losses) {
          setIfHigher(result, team.team, 'playoff_berth');
        }
      } else if (i >= 6 && i <= 9 && eleventh) {
        // 7–10: clinch play-in spot when guaranteed above 11th
        if (team.wins > NBA_GAMES - eleventh.losses) {
          setIfHigher(result, team.team, 'play_in');
        }
      } else if (i >= 10 && tenth) {
        // 11+: eliminated when max wins can't reach 10th
        const maxWins = team.wins + (NBA_GAMES - team.wins - team.losses);
        if (maxWins < tenth.wins) {
          setIfHigher(result, team.team, 'eliminated');
        }
      }
    }
  }

  return result;
}
// ──────────────────────────────────────────────────────────────────────────

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

        // Compute clinch statuses mathematically from standings data
        const computed = computeClinchedFromStandings(
          teams.map(t => ({
            team: t.team as string,
            wins: t.wins as number,
            losses: t.losses as number,
            conference: t.conference as string,
            division: t.division as string,
          }))
        );

        // Merge: computed is the baseline; API-provided data wins if it reports higher priority
        const finalClinched: Record<string, string> = { ...computed };
        for (const [key, status] of Object.entries(clinched)) {
          if ((CLINCH_PRIORITY[status] ?? 0) > (CLINCH_PRIORITY[finalClinched[key]] ?? 0)) {
            finalClinched[key] = status;
          }
        }

        return NextResponse.json({ teams, clinched: finalClinched });
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