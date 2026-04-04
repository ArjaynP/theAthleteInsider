/**
 * UCL placeholder / mock data for 2025–26 season.
 * Replace these with API calls when a data provider is integrated
 * (e.g. API-Football, Sportradar Football, UEFA API, or ESPN FC).
 *
 * All shapes match the types in lib/ucl-types.ts.
 */

import type {
  UCLTeamStanding,
  UCLStatCategory,
  UCLMatch,
  UCLKnockoutBracket,
} from './ucl-types';

// ── League Phase Standings (top 16 shown by default) ─────────────────────────

export const uclStandings: UCLTeamStanding[] = [
  { rank: 1,  team: 'Liverpool',        abbreviation: 'LIV', played: 8, won: 7, drawn: 0, lost: 1, goalsFor: 23, goalsAgainst:  9, goalDifference: 14, points: 21, form: ['W','W','W','W','W'] },
  { rank: 2,  team: 'Barcelona',        abbreviation: 'BAR', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 18, goalsAgainst:  6, goalDifference: 12, points: 19, form: ['W','W','D','W','W'] },
  { rank: 3,  team: 'Arsenal',          abbreviation: 'ARS', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 17, goalsAgainst:  7, goalDifference: 10, points: 19, form: ['W','W','W','D','W'] },
  { rank: 4,  team: 'Inter Milan',      abbreviation: 'INT', played: 8, won: 6, drawn: 1, lost: 1, goalsFor: 14, goalsAgainst:  5, goalDifference:  9, points: 19, form: ['W','D','W','W','W'] },
  { rank: 5,  team: 'Atlético Madrid',  abbreviation: 'ATM', played: 8, won: 6, drawn: 0, lost: 2, goalsFor: 16, goalsAgainst:  7, goalDifference:  9, points: 18, form: ['W','W','L','W','W'] },
  { rank: 6,  team: 'Bayer Leverkusen', abbreviation: 'LEV', played: 8, won: 5, drawn: 2, lost: 1, goalsFor: 15, goalsAgainst:  7, goalDifference:  8, points: 17, form: ['D','W','W','W','D'] },
  { rank: 7,  team: 'Aston Villa',      abbreviation: 'AVL', played: 8, won: 5, drawn: 1, lost: 2, goalsFor: 13, goalsAgainst:  8, goalDifference:  5, points: 16, form: ['W','W','L','W','W'] },
  { rank: 8,  team: 'PSV Eindhoven',    abbreviation: 'PSV', played: 8, won: 5, drawn: 1, lost: 2, goalsFor: 14, goalsAgainst: 10, goalDifference:  4, points: 16, form: ['L','W','W','W','D'] },
  { rank: 9,  team: 'Real Madrid',      abbreviation: 'RMA', played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 16, goalsAgainst: 11, goalDifference:  5, points: 14, form: ['D','W','W','L','W'] },
  { rank: 10, team: 'AC Milan',         abbreviation: 'MIL', played: 8, won: 4, drawn: 2, lost: 2, goalsFor: 11, goalsAgainst:  9, goalDifference:  2, points: 14, form: ['W','D','W','L','W'] },
  { rank: 11, team: 'Atalanta',         abbreviation: 'ATA', played: 8, won: 4, drawn: 1, lost: 3, goalsFor: 13, goalsAgainst: 11, goalDifference:  2, points: 13, form: ['L','W','W','D','W'] },
  { rank: 12, team: 'Benfica',          abbreviation: 'BEN', played: 8, won: 4, drawn: 0, lost: 4, goalsFor: 14, goalsAgainst: 14, goalDifference:  0, points: 12, form: ['L','W','L','W','W'] },
  { rank: 13, team: 'Monaco',           abbreviation: 'MON', played: 8, won: 3, drawn: 2, lost: 3, goalsFor: 10, goalsAgainst: 11, goalDifference: -1, points: 11, form: ['D','L','W','W','D'] },
  { rank: 14, team: 'Sporting CP',      abbreviation: 'SPO', played: 8, won: 3, drawn: 2, lost: 3, goalsFor:  9, goalsAgainst: 11, goalDifference: -2, points: 11, form: ['L','D','W','W','D'] },
  { rank: 15, team: 'Club Brugge',      abbreviation: 'BRU', played: 8, won: 3, drawn: 1, lost: 4, goalsFor: 10, goalsAgainst: 14, goalDifference: -4, points: 10, form: ['L','W','L','W','D'] },
  { rank: 16, team: 'Celtic',           abbreviation: 'CEL', played: 8, won: 3, drawn: 1, lost: 4, goalsFor:  9, goalsAgainst: 15, goalDifference: -6, points: 10, form: ['W','L','L','W','D'] },
];

// ── Player Stat Leaders ────────────────────────────────────────────────────────

export const uclPlayerStats: UCLStatCategory[] = [
  // ── Attacking ──────────────────────────────────────────────────────────────
  {
    id: 'goals',
    label: 'Goals',
    abbreviation: 'G',
    leaders: [
      { rank: 1, player: 'Harry Kane',        team: 'BAY', value: 8 },
      { rank: 2, player: 'Erling Haaland',    team: 'MCI', value: 7 },
      { rank: 3, player: 'Kylian Mbappé',     team: 'RMA', value: 6 },
      { rank: 4, player: 'Lautaro Martínez',  team: 'INT', value: 6 },
      { rank: 5, player: 'Mohamed Salah',     team: 'LIV', value: 5 },
    ],
  },
  {
    id: 'attempts',
    label: 'Attempts',
    abbreviation: 'ATT',
    leaders: [
      { rank: 1, player: 'Erling Haaland',    team: 'MCI', value: 38 },
      { rank: 2, player: 'Harry Kane',        team: 'BAY', value: 35 },
      { rank: 3, player: 'Kylian Mbappé',     team: 'RMA', value: 31 },
      { rank: 4, player: 'Lautaro Martínez',  team: 'INT', value: 28 },
      { rank: 5, player: 'Bukayo Saka',       team: 'ARS', value: 26 },
    ],
  },
  {
    id: 'assists',
    label: 'Assists',
    abbreviation: 'A',
    leaders: [
      { rank: 1, player: 'Kevin De Bruyne',         team: 'MCI', value: 6 },
      { rank: 2, player: 'Pedri',                   team: 'BAR', value: 5 },
      { rank: 3, player: 'Bukayo Saka',             team: 'ARS', value: 5 },
      { rank: 4, player: 'Trent Alexander-Arnold',  team: 'RMA', value: 4 },
      { rank: 5, player: 'Raphinha',                team: 'BAR', value: 4 },
    ],
  },
  // ── Passing ───────────────────────────────────────────────────────────────
  {
    id: 'passing_accuracy',
    label: 'Passing Accuracy',
    abbreviation: 'PA%',
    leaders: [
      { rank: 1, player: 'Pedri',           team: 'BAR', value: 94 },
      { rank: 2, player: 'Rodri',           team: 'MCI', value: 93 },
      { rank: 3, player: 'Granit Xhaka',    team: 'LEV', value: 92 },
      { rank: 4, player: 'Nicolo Barella',  team: 'INT', value: 91 },
      { rank: 5, player: 'Declan Rice',     team: 'ARS', value: 90 },
    ],
  },
  {
    id: 'crossing_accuracy',
    label: 'Crossing Accuracy',
    abbreviation: 'CRS%',
    leaders: [
      { rank: 1, player: 'Bukayo Saka',       team: 'ARS', value: 42 },
      { rank: 2, player: 'Raphinha',          team: 'BAR', value: 39 },
      { rank: 3, player: 'Kevin De Bruyne',   team: 'MCI', value: 37 },
      { rank: 4, player: 'Leroy Sané',        team: 'BAY', value: 35 },
      { rank: 5, player: 'Mohamed Salah',     team: 'LIV', value: 33 },
    ],
  },
  {
    id: 'passes_completed',
    label: 'Passes Completed',
    abbreviation: 'PAS',
    leaders: [
      { rank: 1, player: 'Pedri',           team: 'BAR', value: 412 },
      { rank: 2, player: 'Rodri',           team: 'MCI', value: 398 },
      { rank: 3, player: 'Granit Xhaka',    team: 'LEV', value: 375 },
      { rank: 4, player: 'Declan Rice',     team: 'ARS', value: 362 },
      { rank: 5, player: 'Nicolo Barella',  team: 'INT', value: 341 },
    ],
  },
  // ── Defending ─────────────────────────────────────────────────────────────
  {
    id: 'balls_recovered',
    label: 'Balls Recovered',
    abbreviation: 'REC',
    leaders: [
      { rank: 1, player: 'Declan Rice',       team: 'ARS', value: 52 },
      { rank: 2, player: 'Rodri',             team: 'MCI', value: 49 },
      { rank: 3, player: 'Granit Xhaka',      team: 'LEV', value: 45 },
      { rank: 4, player: 'Nicolo Barella',    team: 'INT', value: 43 },
      { rank: 5, player: 'Aurélien Tchouaméni', team: 'RMA', value: 41 },
    ],
  },
  {
    id: 'tackles',
    label: 'Tackles',
    abbreviation: 'TKL',
    leaders: [
      { rank: 1, player: 'Declan Rice',         team: 'ARS', value: 28 },
      { rank: 2, player: 'Rodri',               team: 'MCI', value: 25 },
      { rank: 3, player: 'Aurélien Tchouaméni', team: 'RMA', value: 23 },
      { rank: 4, player: 'Granit Xhaka',        team: 'LEV', value: 21 },
      { rank: 5, player: 'Sofyan Amrabat',      team: 'BAR', value: 20 },
    ],
  },
  {
    id: 'tackles_won',
    label: 'Tackles Won',
    abbreviation: 'TKW',
    leaders: [
      { rank: 1, player: 'Declan Rice',         team: 'ARS', value: 22 },
      { rank: 2, player: 'Rodri',               team: 'MCI', value: 19 },
      { rank: 3, player: 'Aurélien Tchouaméni', team: 'RMA', value: 18 },
      { rank: 4, player: 'Granit Xhaka',        team: 'LEV', value: 17 },
      { rank: 5, player: 'Sofyan Amrabat',      team: 'BAR', value: 16 },
    ],
  },
  // ── Goalkeeping ───────────────────────────────────────────────────────────
  {
    id: 'saves',
    label: 'Saves',
    abbreviation: 'SV',
    leaders: [
      { rank: 1, player: 'Jan Oblak',           team: 'ATM', value: 31 },
      { rank: 2, player: 'Emiliano Martínez',   team: 'AVL', value: 28 },
      { rank: 3, player: 'André Onana',         team: 'INT', value: 25 },
      { rank: 4, player: 'David Raya',          team: 'ARS', value: 23 },
      { rank: 5, player: 'Alisson Becker',      team: 'LIV', value: 19 },
    ],
  },
  {
    id: 'goals_conceded',
    label: 'Goals Conceded',
    abbreviation: 'GC',
    leaders: [
      { rank: 1, player: 'Alisson Becker',      team: 'LIV', value: 4 },
      { rank: 2, player: 'David Raya',          team: 'ARS', value: 5 },
      { rank: 3, player: 'André Onana',         team: 'INT', value: 6 },
      { rank: 4, player: 'Jan Oblak',           team: 'ATM', value: 7 },
      { rank: 5, player: 'Emiliano Martínez',   team: 'AVL', value: 8 },
    ],
  },
  {
    id: 'saves_from_penalties',
    label: 'Saves from Penalties',
    abbreviation: 'PSV',
    leaders: [
      { rank: 1, player: 'Jan Oblak',           team: 'ATM', value: 2 },
      { rank: 2, player: 'Emiliano Martínez',   team: 'AVL', value: 2 },
      { rank: 3, player: 'David Raya',          team: 'ARS', value: 1 },
      { rank: 4, player: 'Alisson Becker',      team: 'LIV', value: 1 },
      { rank: 5, player: 'André Onana',         team: 'INT', value: 1 },
    ],
  },
  {
    id: 'clean_sheets',
    label: 'Clean Sheets',
    abbreviation: 'CS',
    leaders: [
      { rank: 1, player: 'Alisson Becker',      team: 'LIV', value: 5 },
      { rank: 2, player: 'André Onana',         team: 'INT', value: 4 },
      { rank: 3, player: 'David Raya',          team: 'ARS', value: 4 },
      { rank: 4, player: 'Emiliano Martínez',   team: 'AVL', value: 3 },
      { rank: 5, player: 'Jan Oblak',           team: 'ATM', value: 3 },
    ],
  },
  // ── Discipline ────────────────────────────────────────────────────────────
  {
    id: 'yellow_cards',
    label: 'Yellow Cards',
    abbreviation: 'YC',
    leaders: [
      { rank: 1, player: 'Granit Xhaka',          team: 'LEV', value: 4 },
      { rank: 2, player: 'Declan Rice',            team: 'ARS', value: 3 },
      { rank: 3, player: 'Aurélien Tchouaméni',    team: 'RMA', value: 3 },
      { rank: 4, player: 'Nicolo Barella',         team: 'INT', value: 3 },
      { rank: 5, player: 'Rodri',                  team: 'MCI', value: 3 },
    ],
  },
  {
    id: 'red_cards',
    label: 'Red Cards',
    abbreviation: 'RC',
    leaders: [
      { rank: 1, player: 'Wout Faes',             team: 'LEV', value: 1 },
      { rank: 2, player: 'Stefan de Vrij',        team: 'INT', value: 1 },
      { rank: 3, player: 'Edmond Tapsoba',        team: 'LEV', value: 1 },
      { rank: 4, player: 'Nuno Mendes',           team: 'PSG', value: 1 },
      { rank: 5, player: 'Jan Vertonghen',        team: 'BEN', value: 1 },
    ],
  },
];

// ── Today's / Recent Matches ──────────────────────────────────────────────────

export const uclMatches: UCLMatch[] = [
  {
    id: 'ucl-r16-1',
    homeTeam: 'LIV',
    awayTeam: 'RMA',
    homeScore: 0,
    awayScore: 0,
    status: 'UPCOMING',
    kickoffDisplay: '3:00 PM ET',
    round: 'Round of 16 – Leg 1',
    venue: 'Anfield, Liverpool',
  },
  {
    id: 'ucl-r16-2',
    homeTeam: 'INT',
    awayTeam: 'BAR',
    homeScore: 0,
    awayScore: 0,
    status: 'UPCOMING',
    kickoffDisplay: '3:00 PM ET',
    round: 'Round of 16 – Leg 1',
    venue: 'San Siro, Milan',
  },
  {
    id: 'ucl-r16-3',
    homeTeam: 'ATM',
    awayTeam: 'ARS',
    homeScore: 0,
    awayScore: 0,
    status: 'UPCOMING',
    kickoffDisplay: '12:45 PM ET',
    round: 'Round of 16 – Leg 1',
    venue: 'Metropolitano, Madrid',
  },
  {
    id: 'ucl-r16-4',
    homeTeam: 'LEV',
    awayTeam: 'BEN',
    homeScore: 0,
    awayScore: 0,
    status: 'UPCOMING',
    kickoffDisplay: '12:45 PM ET',
    round: 'Round of 16 – Leg 1',
    venue: 'BayArena, Leverkusen',
  },
];

// ── Knockout Bracket ──────────────────────────────────────────────────────────

export const uclKnockoutBracket: UCLKnockoutBracket = {
  season: '2025–26',
  roundOf16: [
    {
      id: 'r16-a',
      round: 'round_of_16',
      homeTeam: { name: 'Liverpool',  abbreviation: 'LIV', seed: 1 },
      awayTeam: { name: 'Real Madrid', abbreviation: 'RMA', seed: 9 },
      status: 'upcoming',
    },
    {
      id: 'r16-b',
      round: 'round_of_16',
      homeTeam: { name: 'Barcelona',  abbreviation: 'BAR', seed: 2 },
      awayTeam: { name: 'Inter Milan', abbreviation: 'INT', seed: 4 },
      status: 'upcoming',
    },
    {
      id: 'r16-c',
      round: 'round_of_16',
      homeTeam: { name: 'Arsenal',   abbreviation: 'ARS', seed: 3 },
      awayTeam: { name: 'Atlético Madrid', abbreviation: 'ATM', seed: 5 },
      status: 'upcoming',
    },
    {
      id: 'r16-d',
      round: 'round_of_16',
      homeTeam: { name: 'Bayer Leverkusen', abbreviation: 'LEV', seed: 6 },
      awayTeam: { name: 'Benfica',   abbreviation: 'BEN', seed: 12 },
      status: 'upcoming',
    },
    {
      id: 'r16-e',
      round: 'round_of_16',
      homeTeam: { name: 'Aston Villa',  abbreviation: 'AVL', seed: 7 },
      awayTeam: { name: 'AC Milan',     abbreviation: 'MIL', seed: 10 },
      status: 'upcoming',
    },
    {
      id: 'r16-f',
      round: 'round_of_16',
      homeTeam: { name: 'PSV Eindhoven', abbreviation: 'PSV', seed: 8 },
      awayTeam: { name: 'Atalanta',     abbreviation: 'ATA', seed: 11 },
      status: 'upcoming',
    },
    {
      id: 'r16-g',
      round: 'round_of_16',
      homeTeam: { name: 'Monaco',       abbreviation: 'MON', seed: 13 },
      awayTeam: { name: 'Celtic',       abbreviation: 'CEL', seed: 16 },
      status: 'upcoming',
    },
    {
      id: 'r16-h',
      round: 'round_of_16',
      homeTeam: { name: 'Sporting CP',  abbreviation: 'SPO', seed: 14 },
      awayTeam: { name: 'Club Brugge', abbreviation: 'BRU', seed: 15 },
      status: 'upcoming',
    },
  ],
  quarterFinals: [
    { id: 'qf-a', round: 'quarter_finals', homeTeam: { name: 'TBD', abbreviation: 'TBD' }, awayTeam: { name: 'TBD', abbreviation: 'TBD' }, status: 'upcoming' },
    { id: 'qf-b', round: 'quarter_finals', homeTeam: { name: 'TBD', abbreviation: 'TBD' }, awayTeam: { name: 'TBD', abbreviation: 'TBD' }, status: 'upcoming' },
    { id: 'qf-c', round: 'quarter_finals', homeTeam: { name: 'TBD', abbreviation: 'TBD' }, awayTeam: { name: 'TBD', abbreviation: 'TBD' }, status: 'upcoming' },
    { id: 'qf-d', round: 'quarter_finals', homeTeam: { name: 'TBD', abbreviation: 'TBD' }, awayTeam: { name: 'TBD', abbreviation: 'TBD' }, status: 'upcoming' },
  ],
  semiFinals: [
    { id: 'sf-a', round: 'semi_finals', homeTeam: { name: 'TBD', abbreviation: 'TBD' }, awayTeam: { name: 'TBD', abbreviation: 'TBD' }, status: 'upcoming' },
    { id: 'sf-b', round: 'semi_finals', homeTeam: { name: 'TBD', abbreviation: 'TBD' }, awayTeam: { name: 'TBD', abbreviation: 'TBD' }, status: 'upcoming' },
  ],
  final: {
    id: 'final',
    round: 'final',
    homeTeam: { name: 'TBD', abbreviation: 'TBD' },
    awayTeam: { name: 'TBD', abbreviation: 'TBD' },
    status: 'upcoming',
    venue: 'Allianz Arena, Munich',
  },
};

// ── Abbreviation → Full name (for TheSportsDB logo lookups) ──────────────────
export const UCL_ABBREV_TO_NAME: Record<string, string> = {
  LIV: 'Liverpool',
  RMA: 'Real Madrid',
  INT: 'Inter Milan',
  BAR: 'Barcelona',
  ATM: 'Atletico Madrid',
  ARS: 'Arsenal',
  LEV: 'Bayer Leverkusen',
  BEN: 'Benfica',
  MIL: 'AC Milan',
  AVL: 'Aston Villa',
  ATA: 'Atalanta',
  PSV: 'PSV Eindhoven',
  MON: 'AS Monaco',
  SPO: 'Sporting CP',
  BRU: 'Club Brugge',
  CEL: 'Celtic',
  BAY: 'Bayern Munich',
  MCI: 'Manchester City',
  JUV: 'Juventus',
  DOR: 'Borussia Dortmund',
  PSG: 'Paris Saint-Germain',
  BEN: 'Benfica',
};
