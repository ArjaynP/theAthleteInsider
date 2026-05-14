/**
 * MLS placeholder / mock data for the 2026 season.
 * Replace with live API calls (Sportradar Soccer, ESPN FC, etc.) when available.
 *
 * All shapes match the types in lib/mls-types.ts.
 */

import type { MLSTeamStanding, MLSStatCategory, MLSMatch } from './mls-types';

// ── Conference Standings ──────────────────────────────────────────────────────

export const mlsEasternStandings: MLSTeamStanding[] = [
  { rank: 1,  team: 'Inter Miami CF',         abbreviation: 'MIA',  played: 13, won: 9,  drawn: 2, lost: 2, goalsFor: 29, goalsAgainst: 15, goalDifference: 14, points: 29, form: ['W','W','D','W','W'], conference: 'Eastern' },
  { rank: 2,  team: 'CF Montréal',            abbreviation: 'MTL',  played: 13, won: 8,  drawn: 3, lost: 2, goalsFor: 22, goalsAgainst: 13, goalDifference:  9, points: 27, form: ['W','D','W','W','D'], conference: 'Eastern' },
  { rank: 3,  team: 'Columbus Crew',          abbreviation: 'CLB',  played: 13, won: 8,  drawn: 2, lost: 3, goalsFor: 25, goalsAgainst: 14, goalDifference: 11, points: 26, form: ['W','W','L','W','W'], conference: 'Eastern' },
  { rank: 4,  team: 'New England Revolution', abbreviation: 'NE',   played: 13, won: 7,  drawn: 4, lost: 2, goalsFor: 21, goalsAgainst: 13, goalDifference:  8, points: 25, form: ['D','W','W','D','W'], conference: 'Eastern' },
  { rank: 5,  team: 'New York City FC',       abbreviation: 'NYC',  played: 13, won: 7,  drawn: 3, lost: 3, goalsFor: 20, goalsAgainst: 15, goalDifference:  5, points: 24, form: ['W','L','W','W','D'], conference: 'Eastern' },
  { rank: 6,  team: 'Atlanta United FC',      abbreviation: 'ATL',  played: 13, won: 7,  drawn: 2, lost: 4, goalsFor: 23, goalsAgainst: 18, goalDifference:  5, points: 23, form: ['L','W','W','D','W'], conference: 'Eastern' },
  { rank: 7,  team: 'Philadelphia Union',     abbreviation: 'PHI',  played: 13, won: 6,  drawn: 4, lost: 3, goalsFor: 18, goalsAgainst: 14, goalDifference:  4, points: 22, form: ['W','D','W','L','W'], conference: 'Eastern' },
  { rank: 8,  team: 'Nashville SC',           abbreviation: 'NSH',  played: 13, won: 6,  drawn: 3, lost: 4, goalsFor: 17, goalsAgainst: 15, goalDifference:  2, points: 21, form: ['W','L','D','W','W'], conference: 'Eastern' },
  { rank: 9,  team: 'Charlotte FC',           abbreviation: 'CLT',  played: 13, won: 6,  drawn: 2, lost: 5, goalsFor: 19, goalsAgainst: 18, goalDifference:  1, points: 20, form: ['L','W','W','L','W'], conference: 'Eastern' },
  { rank: 10, team: 'NY Red Bulls',           abbreviation: 'NJ',   played: 13, won: 5,  drawn: 3, lost: 5, goalsFor: 15, goalsAgainst: 16, goalDifference: -1, points: 18, form: ['D','W','L','W','D'], conference: 'Eastern' },
  { rank: 11, team: 'FC Cincinnati',          abbreviation: 'CIN',  played: 13, won: 5,  drawn: 2, lost: 6, goalsFor: 16, goalsAgainst: 19, goalDifference: -3, points: 17, form: ['L','D','W','L','W'], conference: 'Eastern' },
  { rank: 12, team: 'Orlando City SC',        abbreviation: 'ORL',  played: 13, won: 4,  drawn: 4, lost: 5, goalsFor: 15, goalsAgainst: 18, goalDifference: -3, points: 16, form: ['D','L','D','W','D'], conference: 'Eastern' },
  { rank: 13, team: 'D.C. United',            abbreviation: 'DC',   played: 13, won: 4,  drawn: 2, lost: 7, goalsFor: 13, goalsAgainst: 21, goalDifference: -8, points: 14, form: ['L','W','L','D','L'], conference: 'Eastern' },
  { rank: 14, team: 'Chicago Fire FC',        abbreviation: 'CHI',  played: 13, won: 3,  drawn: 3, lost: 7, goalsFor: 12, goalsAgainst: 24, goalDifference:-12, points: 12, form: ['L','L','D','W','L'], conference: 'Eastern' },
  { rank: 15, team: 'Toronto FC',             abbreviation: 'TOR',  played: 13, won: 2,  drawn: 3, lost: 8, goalsFor: 10, goalsAgainst: 27, goalDifference:-17, points:  9, form: ['L','L','D','L','W'], conference: 'Eastern' },
];

export const mlsWesternStandings: MLSTeamStanding[] = [
  { rank: 1,  team: 'LAFC',                   abbreviation: 'LAFC', played: 13, won: 10, drawn: 2, lost: 1, goalsFor: 32, goalsAgainst: 13, goalDifference: 19, points: 32, form: ['W','W','W','D','W'], conference: 'Western' },
  { rank: 2,  team: 'Seattle Sounders FC',    abbreviation: 'SEA',  played: 13, won: 9,  drawn: 2, lost: 2, goalsFor: 27, goalsAgainst: 12, goalDifference: 15, points: 29, form: ['W','W','D','W','W'], conference: 'Western' },
  { rank: 3,  team: 'LA Galaxy',              abbreviation: 'LAG',  played: 13, won: 8,  drawn: 3, lost: 2, goalsFor: 24, goalsAgainst: 14, goalDifference: 10, points: 27, form: ['D','W','W','W','D'], conference: 'Western' },
  { rank: 4,  team: 'Colorado Rapids',        abbreviation: 'COL',  played: 13, won: 8,  drawn: 2, lost: 3, goalsFor: 22, goalsAgainst: 15, goalDifference:  7, points: 26, form: ['W','L','W','W','W'], conference: 'Western' },
  { rank: 5,  team: 'FC Dallas',              abbreviation: 'DAL',  played: 13, won: 7,  drawn: 3, lost: 3, goalsFor: 20, goalsAgainst: 14, goalDifference:  6, points: 24, form: ['W','W','D','L','W'], conference: 'Western' },
  { rank: 6,  team: 'Vancouver Whitecaps',    abbreviation: 'VAN',  played: 13, won: 7,  drawn: 2, lost: 4, goalsFor: 19, goalsAgainst: 15, goalDifference:  4, points: 23, form: ['L','W','W','D','W'], conference: 'Western' },
  { rank: 7,  team: 'Portland Timbers',       abbreviation: 'POR',  played: 13, won: 6,  drawn: 4, lost: 3, goalsFor: 18, goalsAgainst: 15, goalDifference:  3, points: 22, form: ['D','W','D','W','W'], conference: 'Western' },
  { rank: 8,  team: 'Real Salt Lake',         abbreviation: 'RSL',  played: 13, won: 6,  drawn: 3, lost: 4, goalsFor: 18, goalsAgainst: 16, goalDifference:  2, points: 21, form: ['W','D','L','W','W'], conference: 'Western' },
  { rank: 9,  team: 'Austin FC',              abbreviation: 'ATX',  played: 13, won: 6,  drawn: 2, lost: 5, goalsFor: 17, goalsAgainst: 17, goalDifference:  0, points: 20, form: ['L','W','W','L','W'], conference: 'Western' },
  { rank: 10, team: 'Sporting Kansas City',   abbreviation: 'SKC',  played: 13, won: 5,  drawn: 3, lost: 5, goalsFor: 16, goalsAgainst: 17, goalDifference: -1, points: 18, form: ['D','L','W','W','D'], conference: 'Western' },
  { rank: 11, team: 'Minnesota United FC',    abbreviation: 'MIN',  played: 13, won: 5,  drawn: 2, lost: 6, goalsFor: 15, goalsAgainst: 19, goalDifference: -4, points: 17, form: ['L','W','D','L','W'], conference: 'Western' },
  { rank: 12, team: 'Houston Dynamo FC',      abbreviation: 'HOU',  played: 13, won: 4,  drawn: 3, lost: 6, goalsFor: 14, goalsAgainst: 20, goalDifference: -6, points: 15, form: ['D','L','W','L','D'], conference: 'Western' },
  { rank: 13, team: 'St. Louis City SC',      abbreviation: 'STL',  played: 13, won: 4,  drawn: 2, lost: 7, goalsFor: 13, goalsAgainst: 22, goalDifference: -9, points: 14, form: ['L','D','L','W','L'], conference: 'Western' },
  { rank: 14, team: 'San Jose Earthquakes',   abbreviation: 'SJ',   played: 13, won: 3,  drawn: 3, lost: 7, goalsFor: 12, goalsAgainst: 23, goalDifference:-11, points: 12, form: ['L','D','L','W','L'], conference: 'Western' },
  { rank: 15, team: 'San Diego FC',           abbreviation: 'SD',   played: 13, won: 2,  drawn: 3, lost: 8, goalsFor: 10, goalsAgainst: 27, goalDifference:-17, points:  9, form: ['L','L','D','L','W'], conference: 'Western' },
];

// ── Player Stat Leaders ──────────────────────────────────────────────────────

export const mlsPlayerStats: MLSStatCategory[] = [
  {
    id: 'goals',
    label: 'Goals',
    abbreviation: 'G',
    leaders: [
      { rank: 1, player: 'Carlos Vela',        team: 'LAFC', value: 12 },
      { rank: 2, player: 'Cucho Hernández',    team: 'CLB',  value: 11 },
      { rank: 3, player: 'Raúl Ruidíaz',       team: 'SEA',  value:  9 },
      { rank: 4, player: 'Folarin Balogun',    team: 'LAG',  value:  9 },
      { rank: 5, player: 'Xherdan Shaqiri',    team: 'MIA',  value:  8 },
    ],
  },
  {
    id: 'assists',
    label: 'Assists',
    abbreviation: 'A',
    leaders: [
      { rank: 1, player: 'Luciano Acosta',     team: 'CIN',  value: 10 },
      { rank: 2, player: 'Riqui Puig',         team: 'LAG',  value:  8 },
      { rank: 3, player: 'Xherdan Shaqiri',    team: 'MIA',  value:  7 },
      { rank: 4, player: 'Lorenzo Insigne',    team: 'TOR',  value:  6 },
      { rank: 5, player: 'Dax McCarty',        team: 'NSH',  value:  6 },
    ],
  },
  {
    id: 'shots_on_target',
    label: 'Shots on Target',
    abbreviation: 'SOT',
    leaders: [
      { rank: 1, player: 'Carlos Vela',        team: 'LAFC', value: 38 },
      { rank: 2, player: 'Cucho Hernández',    team: 'CLB',  value: 35 },
      { rank: 3, player: 'Raúl Ruidíaz',       team: 'SEA',  value: 31 },
      { rank: 4, player: 'Folarin Balogun',    team: 'LAG',  value: 29 },
      { rank: 5, player: 'Caden Clark',        team: 'ATL',  value: 27 },
    ],
  },
  {
    id: 'saves',
    label: 'Goalkeeper Saves',
    abbreviation: 'SV',
    leaders: [
      { rank: 1, player: 'Andre Blake',        team: 'PHI',  value: 47 },
      { rank: 2, player: 'Stefan Frei',        team: 'SEA',  value: 44 },
      { rank: 3, player: 'John McCarthy',      team: 'CLT',  value: 41 },
      { rank: 4, player: 'Matt Freese',        team: 'NYC',  value: 38 },
      { rank: 5, player: 'Patrick Schulte',    team: 'STL',  value: 36 },
    ],
  },
  {
    id: 'yellow_cards',
    label: 'Yellow Cards',
    abbreviation: 'YC',
    leaders: [
      { rank: 1, player: 'Kellyn Acosta',      team: 'LAG',  value: 8 },
      { rank: 2, player: 'Alejandro Bedoya',   team: 'PHI',  value: 7 },
      { rank: 3, player: 'Derrick Etienne',    team: 'COL',  value: 7 },
      { rank: 4, player: 'Diego Chara',        team: 'POR',  value: 6 },
      { rank: 5, player: 'Victor Ulloa',       team: 'MIA',  value: 6 },
    ],
  },
];

// ── Matchweek Fixtures ────────────────────────────────────────────────────────

export const mlsMatches: Record<number, MLSMatch[]> = {
  13: [
    { id: 'm13-1', homeTeam: 'Inter Miami CF', awayTeam: 'Columbus Crew',    homeScore: 2, awayScore: 1, status: 'FINAL', matchweek: 13, venue: 'Chase Stadium, Fort Lauderdale' },
    { id: 'm13-2', homeTeam: 'LAFC',           awayTeam: 'Seattle Sounders FC', homeScore: 3, awayScore: 1, status: 'FINAL', matchweek: 13, venue: 'BMO Stadium, Los Angeles' },
    { id: 'm13-3', homeTeam: 'LA Galaxy',      awayTeam: 'FC Dallas',        homeScore: 2, awayScore: 2, status: 'FINAL', matchweek: 13, venue: 'Dignity Health Sports Park' },
    { id: 'm13-4', homeTeam: 'CF Montréal',    awayTeam: 'Philadelphia Union', homeScore: 1, awayScore: 0, status: 'FINAL', matchweek: 13, venue: 'Stade Saputo, Montreal' },
    { id: 'm13-5', homeTeam: 'Colorado Rapids', awayTeam: 'Sporting Kansas City', homeScore: 2, awayScore: 0, status: 'FINAL', matchweek: 13, venue: 'Dick\'s Sporting Goods Park' },
    { id: 'm13-6', homeTeam: 'Nashville SC',   awayTeam: 'Atlanta United FC', homeScore: 1, awayScore: 1, status: 'FINAL', matchweek: 13, venue: 'GEODIS Park, Nashville' },
    { id: 'm13-7', homeTeam: 'New York City FC', awayTeam: 'NY Red Bulls',   homeScore: 2, awayScore: 1, status: 'FINAL', matchweek: 13, venue: 'Yankee Stadium, New York' },
    { id: 'm13-8', homeTeam: 'Portland Timbers', awayTeam: 'Vancouver Whitecaps', homeScore: 0, awayScore: 1, status: 'FINAL', matchweek: 13, venue: 'Providence Park, Portland' },
  ],
  14: [
    { id: 'm14-1', homeTeam: 'Columbus Crew',  awayTeam: 'New England Revolution', homeScore: 1, awayScore: 1, status: 'FINAL', matchweek: 14, venue: 'Lower.com Field, Columbus' },
    { id: 'm14-2', homeTeam: 'Seattle Sounders FC', awayTeam: 'LA Galaxy',   homeScore: 2, awayScore: 0, status: 'FINAL', matchweek: 14, venue: 'Lumen Field, Seattle' },
    { id: 'm14-3', homeTeam: 'Atlanta United FC', awayTeam: 'D.C. United',   homeScore: 3, awayScore: 0, status: 'FINAL', matchweek: 14, venue: 'Mercedes-Benz Stadium, Atlanta' },
    { id: 'm14-4', homeTeam: 'Inter Miami CF', awayTeam: 'Charlotte FC',     homeScore: 2, awayScore: 0, status: 'FINAL', matchweek: 14, venue: 'Chase Stadium, Fort Lauderdale' },
    { id: 'm14-5', homeTeam: 'LAFC',           awayTeam: 'Colorado Rapids',  homeScore: 1, awayScore: 2, status: 'FINAL', matchweek: 14, venue: 'BMO Stadium, Los Angeles' },
    { id: 'm14-6', homeTeam: 'Austin FC',      awayTeam: 'FC Dallas',        homeScore: 1, awayScore: 1, status: 'FINAL', matchweek: 14, venue: 'Q2 Stadium, Austin' },
    { id: 'm14-7', homeTeam: 'Real Salt Lake', awayTeam: 'Minnesota United FC', homeScore: 2, awayScore: 1, status: 'FINAL', matchweek: 14, venue: 'America First Field, Sandy' },
    { id: 'm14-8', homeTeam: 'Chicago Fire FC', awayTeam: 'Toronto FC',      homeScore: 1, awayScore: 0, status: 'FINAL', matchweek: 14, venue: 'Soldier Field, Chicago' },
  ],
  15: [
    { id: 'm15-1', homeTeam: 'Inter Miami CF', awayTeam: 'LAFC',             homeScore: 2, awayScore: 1, status: 'LIVE', clock: "73'", matchweek: 15, venue: 'Chase Stadium, Fort Lauderdale' },
    { id: 'm15-2', homeTeam: 'Seattle Sounders FC', awayTeam: 'Columbus Crew', homeScore: 1, awayScore: 0, status: 'LIVE', clock: "58'", matchweek: 15, venue: 'Lumen Field, Seattle' },
    { id: 'm15-3', homeTeam: 'CF Montréal',    awayTeam: 'Atlanta United FC', homeScore: 0, awayScore: 0, status: 'LIVE', clock: "45+2'", matchweek: 15, venue: 'Stade Saputo, Montreal' },
    { id: 'm15-4', homeTeam: 'LA Galaxy',      awayTeam: 'Vancouver Whitecaps', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: '10:30 PM ET', matchweek: 15, venue: 'Dignity Health Sports Park' },
    { id: 'm15-5', homeTeam: 'Colorado Rapids', awayTeam: 'Portland Timbers', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: '9:00 PM ET', matchweek: 15, venue: 'Dick\'s Sporting Goods Park' },
    { id: 'm15-6', homeTeam: 'Nashville SC',   awayTeam: 'Philadelphia Union', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: '7:30 PM ET', matchweek: 15, venue: 'GEODIS Park, Nashville' },
    { id: 'm15-7', homeTeam: 'Austin FC',      awayTeam: 'Sporting Kansas City', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: '8:00 PM ET', matchweek: 15, venue: 'Q2 Stadium, Austin' },
    { id: 'm15-8', homeTeam: 'New York City FC', awayTeam: 'New England Revolution', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: '7:30 PM ET', matchweek: 15, venue: 'Yankee Stadium, New York' },
  ],
  16: [
    { id: 'm16-1', homeTeam: 'LAFC',           awayTeam: 'Inter Miami CF',   homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: 'May 17 · 10:30 PM ET', matchweek: 16, venue: 'BMO Stadium, Los Angeles' },
    { id: 'm16-2', homeTeam: 'Columbus Crew',  awayTeam: 'CF Montréal',      homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: 'May 17 · 7:30 PM ET', matchweek: 16, venue: 'Lower.com Field, Columbus' },
    { id: 'm16-3', homeTeam: 'Seattle Sounders FC', awayTeam: 'Colorado Rapids', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: 'May 17 · 10:00 PM ET', matchweek: 16, venue: 'Lumen Field, Seattle' },
    { id: 'm16-4', homeTeam: 'Atlanta United FC', awayTeam: 'Nashville SC',  homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: 'May 18 · 7:30 PM ET', matchweek: 16, venue: 'Mercedes-Benz Stadium, Atlanta' },
    { id: 'm16-5', homeTeam: 'New England Revolution', awayTeam: 'NY Red Bulls', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: 'May 18 · 7:30 PM ET', matchweek: 16, venue: 'Gillette Stadium, Boston' },
    { id: 'm16-6', homeTeam: 'LA Galaxy',      awayTeam: 'Real Salt Lake',   homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: 'May 18 · 10:30 PM ET', matchweek: 16, venue: 'Dignity Health Sports Park' },
    { id: 'm16-7', homeTeam: 'FC Dallas',      awayTeam: 'Houston Dynamo FC', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: 'May 18 · 9:00 PM ET', matchweek: 16, venue: 'Toyota Stadium, Frisco' },
    { id: 'm16-8', homeTeam: 'Philadelphia Union', awayTeam: 'Charlotte FC', homeScore: 0, awayScore: 0, status: 'UPCOMING', kickoffDisplay: 'May 18 · 7:30 PM ET', matchweek: 16, venue: 'Subaru Park, Chester' },
  ],
};

// ── Current Matchweek ─────────────────────────────────────────────────────────

export const MLS_CURRENT_MATCHWEEK = 15;
export const MLS_TOTAL_MATCHWEEKS  = 34;

// ── News Articles ─────────────────────────────────────────────────────────────

export const MLS_NEWS = [
  {
    id: 'mls-1',
    title: 'LAFC on Fire: Nine-Game Unbeaten Run Puts LA in Pole Position',
    summary:
      'Carlos Vela\'s 12 goals lead the Western Conference pace-setters as Bob Bradley\'s side look unstoppable heading into the summer schedule.',
    tag: 'Analysis',
    date: 'May 13, 2026',
  },
  {
    id: 'mls-2',
    title: 'Inter Miami Surge to Top of Eastern Conference',
    summary:
      'Back-to-back wins moved Miami to the summit of the East, with Xherdan Shaqiri pulling the strings in a potent attacking display.',
    tag: 'Form',
    date: 'May 12, 2026',
  },
  {
    id: 'mls-3',
    title: 'Cucho Hernández Close to Golden Boot Lead After Hat-Trick',
    summary:
      'Columbus Crew\'s Colombian striker is the hottest forward in the league right now, netting 11 goals in 13 appearances this season.',
    tag: 'Stats',
    date: 'May 11, 2026',
  },
  {
    id: 'mls-4',
    title: 'Cascadia Derby Preview: Seattle vs Portland — Who Blinks First?',
    summary:
      'The Pacific Northwest rivalry heats up in Matchweek 15. Both sides desperately need points as the playoff picture tightens.',
    tag: 'Preview',
    date: 'May 10, 2026',
  },
];
