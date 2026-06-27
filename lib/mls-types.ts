/**
 * Type definitions for Major League Soccer (MLS) data.
 */

export interface MLSTeamStanding {
  rank: number;
  team: string;
  abbreviation: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[]; // last 5 results: 'W' | 'D' | 'L'
  conference: 'Eastern' | 'Western';
}

export interface MLSMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: 'UPCOMING' | 'LIVE' | 'FINAL';
  kickoff?: string; // ISO date-time for sorting/metadata
  clock?: string; // e.g. "67'"
  kickoffDisplay?: string; // e.g. "7:30 PM ET"
  matchweek?: number;
  venue?: string;
}

export interface MLSStatEntry {
  rank: number;
  player: string;
  team: string;
  value: number;
}

export interface MLSStatCategory {
  id: string;
  label: string;
  abbreviation: string;
  leaders: MLSStatEntry[];
}
