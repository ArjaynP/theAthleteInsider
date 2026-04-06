// ─── UCL shared types ─────────────────────────────────────────────────────────
// All types are designed for future API integration.
// Fields map to standard UEFA / football data provider payloads.

// ── Standings ────────────────────────────────────────────────────────────────

export interface UCLTeamStanding {
  /** Club display name, e.g. "Real Madrid" */
  team: string;
  /** Short badge code used for logo lookups, e.g. "RMA" */
  abbreviation: string;
  /** Group letter, e.g. "A" — only set during league/group phase */
  group?: string;
  /** UCL league-phase rank (1–36) or group rank (1–4) */
  rank: number;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  /** Most recent 5 match results as single characters: W / D / L */
  form: string[];
}

// ── Stats ─────────────────────────────────────────────────────────────────────

export interface UCLPlayerStatEntry {
  rank: number;
  player: string;
  team: string;
  value: number;
}

export interface UCLStatCategory {
  id: string;
  label: string;
  abbreviation: string;
  leaders: UCLPlayerStatEntry[];
}

// ── Scores ───────────────────────────────────────────────────────────────────

export type UCLMatchStatus = 'UPCOMING' | 'LIVE' | 'FINAL';

export interface UCLMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: UCLMatchStatus;
  /** ISO 8601 kick-off time */
  kickoff?: string;
  /** Human-readable kick-off, e.g. "7:45 PM ET" */
  kickoffDisplay?: string;
  /** Match week / round label, e.g. "MD6" or "Round of 16 – Leg 1" */
  round?: string;
  /** Leg number for two-legged knockout ties (1 or 2); undefined for league phase */
  leg?: number;
  /** Live match clock, e.g. "67'" */
  clock?: string;
  venue?: string;
}

// ── Knockout bracket ─────────────────────────────────────────────────────────

export type UCLKnockoutRound =
  | 'round_of_16'
  | 'quarter_finals'
  | 'semi_finals'
  | 'final';

export interface UCLKnockoutTeam {
  /** Display name, e.g. "Man City" */
  name: string;
  abbreviation: string;
  /** Seed / qualifier rank shown on bracket */
  seed?: number;
  /** Aggregate goals in a two-legged tie */
  aggregateScore?: number;
  isWinner?: boolean;
  isEliminated?: boolean;
}

export interface UCLKnockoutTie {
  id: string;
  round: UCLKnockoutRound;
  homeTeam: UCLKnockoutTeam;
  awayTeam: UCLKnockoutTeam;
  /** Aggregate score for two-legged ties; score for the final */
  homeAgg?: number;
  awayAgg?: number;
  /** For the Final: full-time score */
  homeScore?: number;
  awayScore?: number;
  status: 'upcoming' | 'in_progress' | 'completed';
  /** Leg 1 result display string, e.g. "2-1" */
  leg1?: string;
  /** Leg 2 result display string */
  leg2?: string;
  /** Extra time / pens note, e.g. "(aet)" | "(4-2 pens)" */
  note?: string;
  winnerId?: string;
}

export interface UCLKnockoutBracket {
  season: string;
  roundOf16: UCLKnockoutTie[];
  quarterFinals: UCLKnockoutTie[];
  semiFinals: UCLKnockoutTie[];
  final: UCLKnockoutTie;
}
