import { NextResponse } from 'next/server';
import { getCachedNBAStandings, getCachedNBARankings, getCachedNFLStandings, getCachedMLBStandings, getCachedMLBSpringTrainingStandings, getCachedMLBSportsRadarStandings, getCachedMLBSportsRadarRankings } from '@/lib/cachedSportsData';

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

// ─── MLB ESPN fallback helpers ────────────────────────────────────────────────
const MLB_TEAM_INFO: Record<string, { conference: string; division: string }> = {
  BAL: { conference: 'AL', division: 'East' }, BOS: { conference: 'AL', division: 'East' },
  NYY: { conference: 'AL', division: 'East' }, TB:  { conference: 'AL', division: 'East' },
  TOR: { conference: 'AL', division: 'East' },
  CWS: { conference: 'AL', division: 'Central' }, CLE: { conference: 'AL', division: 'Central' },
  DET: { conference: 'AL', division: 'Central' }, KC:  { conference: 'AL', division: 'Central' },
  MIN: { conference: 'AL', division: 'Central' },
  HOU: { conference: 'AL', division: 'West' }, LAA: { conference: 'AL', division: 'West' },
  OAK: { conference: 'AL', division: 'West' }, ATH: { conference: 'AL', division: 'West' },
  SEA: { conference: 'AL', division: 'West' }, TEX: { conference: 'AL', division: 'West' },
  ATL: { conference: 'NL', division: 'East' }, MIA: { conference: 'NL', division: 'East' },
  NYM: { conference: 'NL', division: 'East' }, PHI: { conference: 'NL', division: 'East' },
  WSH: { conference: 'NL', division: 'East' },
  CHC: { conference: 'NL', division: 'Central' }, CIN: { conference: 'NL', division: 'Central' },
  MIL: { conference: 'NL', division: 'Central' }, PIT: { conference: 'NL', division: 'Central' },
  STL: { conference: 'NL', division: 'Central' },
  ARI: { conference: 'NL', division: 'West' }, COL: { conference: 'NL', division: 'West' },
  LAD: { conference: 'NL', division: 'West' }, SD:  { conference: 'NL', division: 'West' },
  SF:  { conference: 'NL', division: 'West' },
};

type EspnStat = { type?: string; value?: number; displayValue?: string; summary?: string };
type EspnStanding = { team: { displayName: string; abbreviation: string }; stats: EspnStat[] };

function espnVal(stats: EspnStat[], type: string, fb = 0) { return stats.find(s => s.type === type)?.value ?? fb; }
function espnDisp(stats: EspnStat[], type: string, fb = '-') { return stats.find(s => s.type === type)?.displayValue ?? fb; }
function espnRec(stats: EspnStat[], type: string) { return stats.find(s => s.type === type)?.summary ?? '-'; }

function buildMLBTeamStandingFromESPN(entry: EspnStanding) {
  const abbr = entry.team.abbreviation?.toUpperCase() ?? '';
  const info = MLB_TEAM_INFO[abbr] ?? { conference: 'AL', division: 'East' };
  const wins = Math.round(espnVal(entry.stats, 'wins'));
  const losses = Math.round(espnVal(entry.stats, 'losses'));
  return {
    rank: Math.round(espnVal(entry.stats, 'playoffseed', 99)),
    team: entry.team.displayName,
    abbreviation: abbr,
    wins,
    losses,
    pct: espnDisp(entry.stats, 'winpercent', '.000'),
    gb: espnDisp(entry.stats, 'gamesbehind', '-'),
    streak: espnDisp(entry.stats, 'streak', '-'),
    conference: info.conference,
    division: info.division,
    league: 'MLB' as const,
    home: espnRec(entry.stats, 'home'),
    away: espnRec(entry.stats, 'road'),
    last10: espnRec(entry.stats, 'lasttengames'),
    rs: espnDisp(entry.stats, 'runsscored', '-'),
    ra: espnDisp(entry.stats, 'runsallowed', '-'),
    diff: espnDisp(entry.stats, 'rundifferential', '-'),
    conferenceRecord: espnRec(entry.stats, 'vsleague'),
    divisionRecord: espnRec(entry.stats, 'vsdivision'),
  };
}

// ─── SportsRadar MLB Standings parser ────────────────────────────────────────
function parseSportsRadarMLBStandings(raw: Record<string, unknown>) {
  const teams: ReturnType<typeof buildMLBTeamStandingFromESPN>[] = [];
  const leagues: any[] = (raw as any)?.league?.season?.leagues ?? [];

  for (const league of leagues) {
    const leagueAlias: string = (league.alias ?? '').toUpperCase(); // "AL" or "NL"
    for (const division of league.divisions ?? []) {
      const divisionName: string = division.name ?? ''; // "East", "Central", "West"
      for (const t of division.teams ?? []) {
        const wins: number = t.win ?? t.wins ?? 0;
        const losses: number = t.loss ?? t.losses ?? 0;
        const winP: number = t.win_p ?? t.win_pct ?? (wins + losses > 0 ? wins / (wins + losses) : 0);
        const gb = t.games_back === 0 ? '-' : t.games_back != null ? String(t.games_back) : '-';
        const streak = t.streak ? `${t.streak.kind === 'win' ? 'W' : 'L'}${t.streak.length}` : '-';
        const rec = (type: string) => {
          const r = (t.records ?? []).find((x: any) => x.record_type === type);
          return r ? `${r.win}-${r.loss}` : '-';
        };
        const runDiff: number | undefined = t.run_diff ?? (t.runs_scored != null && t.runs_allowed != null ? t.runs_scored - t.runs_allowed : undefined);
        teams.push({
          rank: t.rank?.division ?? 99,
          team: `${t.market} ${t.name}`.trim(),
          abbreviation: (t.abbr ?? '').toUpperCase(),
          wins,
          losses,
          pct: winP.toFixed(3),
          gb,
          streak,
          conference: leagueAlias,
          division: divisionName,
          league: 'MLB' as const,
          home: rec('home'),
          away: rec('road'),
          last10: rec('last_10'),
          rs: t.runs_scored != null ? String(t.runs_scored) : '-',
          ra: t.runs_allowed != null ? String(t.runs_allowed) : '-',
          diff: runDiff != null ? (runDiff >= 0 ? `+${runDiff}` : String(runDiff)) : '-',
          conferenceRecord: rec('league'),
          divisionRecord: rec('division'),
        });
      }
    }
  }
  return teams;
}
// ─────────────────────────────────────────────────────────────────────────────

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
        // Try SportsRadar first; fall back to ESPN if it fails
        const [srStandings, srRankings] = await Promise.allSettled([
          getCachedMLBSportsRadarStandings(),
          getCachedMLBSportsRadarRankings(),
        ]);

        let teams: ReturnType<typeof parseSportsRadarMLBStandings>;
        const clinched: Record<string, string> = {};

        if (srStandings.status === 'fulfilled') {
          teams = parseSportsRadarMLBStandings(srStandings.value as Record<string, unknown>);

          // Merge clinched status from Rankings response
          if (srRankings.status === 'fulfilled') {
            for (const lg of (srRankings.value as any)?.league?.season?.leagues ?? []) {
              for (const div of lg.divisions ?? []) {
                for (const t of div.teams ?? []) {
                  if (t.rank?.clinched) {
                    clinched[`${t.market} ${t.name}`.trim()] = t.rank.clinched;
                  }
                }
              }
            }
          } else {
            console.warn('MLB SportsRadar Rankings unavailable:', srRankings.reason?.message);
          }
        } else {
          console.warn('MLB SportsRadar Standings failed, falling back to ESPN:', srStandings.reason?.message);
          const espnRaw = await getCachedMLBStandings() as EspnStanding[];
          teams = espnRaw.map(buildMLBTeamStandingFromESPN);
        }

        return NextResponse.json({ teams, clinched });
      }
      case 'MLB_SPRING': {
        const espnRaw = await getCachedMLBSpringTrainingStandings() as EspnStanding[];
        const teams = espnRaw.map(buildMLBTeamStandingFromESPN);
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