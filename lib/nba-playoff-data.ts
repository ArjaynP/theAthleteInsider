/**
 * NBA Playoff Bracket data structure (Play-In + main rounds).
 * Update series scores and winnerId to reflect live/current state.
 */

export interface PlayoffTeam {
  id: string;
  name: string;
  abbreviation: string;
  seed: number;
  logoUrl?: string;
  primaryColor?: string; // e.g. "#552583"
}

export interface PlayInGame {
  id: string;
  label: string; // "7 vs 8", "9 vs 10", "Final Play-In"
  topTeam: PlayoffTeam;
  bottomTeam: PlayoffTeam;
  topScore: number;
  bottomScore: number;
  winnerId: string | null; // null = not yet decided
  /** Winner gets 7 seed and advances to First Round 2v7 */
  advancesToSeed?: 7;
  /** Winner gets 8 seed and advances to First Round 1v8 */
  advancesToSeed8?: boolean;
  /** Loser is eliminated (no further games) */
  loserEliminated?: boolean;
}

export interface PlayoffMatchup {
  id: string;
  round: "first" | "semifinals" | "conference_finals" | "nba_finals";
  topTeam: PlayoffTeam;
  bottomTeam: PlayoffTeam;
  topScore: number;
  bottomScore: number;
  winnerId: string | null;
  /** For first round: slot index 0 = 1v8, 1 = 2v7, 2 = 3v6, 3 = 4v5 */
  slotIndex?: number;
}

export interface ConferenceBracket {
  conference: "WEST" | "EAST";
  playIn: PlayInGame[];
  firstRound: PlayoffMatchup[];
  semifinals: PlayoffMatchup[];
  conferenceFinals: PlayoffMatchup | null;
}

export interface NBAPlayoffBracket {
  west: ConferenceBracket;
  east: ConferenceBracket;
  nbaFinals: PlayoffMatchup | null;
}

// Mock data: 2025-style bracket with placeholder teams
const westTeams: Record<string, PlayoffTeam> = {
  okc: { id: "okc", name: "Oklahoma City Thunder", abbreviation: "OKC", seed: 1, primaryColor: "#007AC1" },
  den: { id: "den", name: "Denver Nuggets", abbreviation: "DEN", seed: 2, primaryColor: "#0E2240" },
  min: { id: "min", name: "Minnesota Timberwolves", abbreviation: "MIN", seed: 3, primaryColor: "#0C2340" },
  lac: { id: "lac", name: "LA Clippers", abbreviation: "LAC", seed: 4, primaryColor: "#C8102E" },
  dal: { id: "dal", name: "Dallas Mavericks", abbreviation: "DAL", seed: 5, primaryColor: "#00538C" },
  phx: { id: "phx", name: "Phoenix Suns", abbreviation: "PHX", seed: 6, primaryColor: "#1D1160" },
  sac: { id: "sac", name: "Sacramento Kings", abbreviation: "SAC", seed: 7, primaryColor: "#5A2D81" },
  lal: { id: "lal", name: "Los Angeles Lakers", abbreviation: "LAL", seed: 8, primaryColor: "#552583" },
  gsw: { id: "gsw", name: "Golden State Warriors", abbreviation: "GSW", seed: 9, primaryColor: "#1D428A" },
  hou: { id: "hou", name: "Houston Rockets", abbreviation: "HOU", seed: 10, primaryColor: "#CE1141" },
};

const eastTeams: Record<string, PlayoffTeam> = {
  bos: { id: "bos", name: "Boston Celtics", abbreviation: "BOS", seed: 1, primaryColor: "#007A33" },
  ny: { id: "ny", name: "New York Knicks", abbreviation: "NY", seed: 2, primaryColor: "#006BB6" },
  mil: { id: "mil", name: "Milwaukee Bucks", abbreviation: "MIL", seed: 3, primaryColor: "#00471B" },
  cle: { id: "cle", name: "Cleveland Cavaliers", abbreviation: "CLE", seed: 4, primaryColor: "#860038" },
  orl: { id: "orl", name: "Orlando Magic", abbreviation: "ORL", seed: 5, primaryColor: "#0077C0" },
  ind: { id: "ind", name: "Indiana Pacers", abbreviation: "IND", seed: 6, primaryColor: "#002D62" },
  phi: { id: "phi", name: "Philadelphia 76ers", abbreviation: "PHI", seed: 7, primaryColor: "#006BB6" },
  mia: { id: "mia", name: "Miami Heat", abbreviation: "MIA", seed: 8, primaryColor: "#98002E" },
  chi: { id: "chi", name: "Chicago Bulls", abbreviation: "CHI", seed: 9, primaryColor: "#CE1141" },
  atl: { id: "atl", name: "Atlanta Hawks", abbreviation: "ATL", seed: 10, primaryColor: "#E03A3E" },
};

export const nbaPlayoffBracket: NBAPlayoffBracket = {
  west: {
    conference: "WEST",
    playIn: [
      {
        id: "west-pi1",
        label: "7 vs 8",
        topTeam: westTeams.sac,
        bottomTeam: westTeams.lal,
        topScore: 1,
        bottomScore: 0,
        winnerId: "sac",
        advancesToSeed: 7,
      },
      {
        id: "west-pi2",
        label: "9 vs 10",
        topTeam: westTeams.gsw,
        bottomTeam: westTeams.hou,
        topScore: 1,
        bottomScore: 0,
        winnerId: "gsw",
        loserEliminated: true,
      },
      {
        id: "west-pi3",
        label: "Final Play-In",
        topTeam: westTeams.lal,
        bottomTeam: westTeams.gsw,
        topScore: 1,
        bottomScore: 0,
        winnerId: "lal",
        advancesToSeed8: true,
        loserEliminated: true,
      },
    ],
    firstRound: [
      { id: "w-fr1", round: "first", slotIndex: 0, topTeam: westTeams.okc, bottomTeam: westTeams.lal, topScore: 2, bottomScore: 1, winnerId: null },
      { id: "w-fr2", round: "first", slotIndex: 1, topTeam: westTeams.den, bottomTeam: westTeams.sac, topScore: 2, bottomScore: 0, winnerId: "den" },
      { id: "w-fr3", round: "first", slotIndex: 2, topTeam: westTeams.min, bottomTeam: westTeams.phx, topScore: 1, bottomScore: 1, winnerId: null },
      { id: "w-fr4", round: "first", slotIndex: 3, topTeam: westTeams.lac, bottomTeam: westTeams.dal, topScore: 0, bottomScore: 2, winnerId: "dal" },
    ],
    semifinals: [
      { id: "w-sf1", round: "semifinals", topTeam: westTeams.okc, bottomTeam: westTeams.dal, topScore: 2, bottomScore: 1, winnerId: null },
      { id: "w-sf2", round: "semifinals", topTeam: westTeams.den, bottomTeam: westTeams.min, topScore: 0, bottomScore: 0, winnerId: null },
    ],
    conferenceFinals: {
      id: "w-cf",
      round: "conference_finals",
      topTeam: westTeams.okc,
      bottomTeam: westTeams.den,
      topScore: 0,
      bottomScore: 0,
      winnerId: null,
    },
  },
  east: {
    conference: "EAST",
    playIn: [
      {
        id: "east-pi1",
        label: "7 vs 8",
        topTeam: eastTeams.phi,
        bottomTeam: eastTeams.mia,
        topScore: 1,
        bottomScore: 0,
        winnerId: "phi",
        advancesToSeed: 7,
      },
      {
        id: "east-pi2",
        label: "9 vs 10",
        topTeam: eastTeams.chi,
        bottomTeam: eastTeams.atl,
        topScore: 0,
        bottomScore: 1,
        winnerId: "atl",
        loserEliminated: true,
      },
      {
        id: "east-pi3",
        label: "Final Play-In",
        topTeam: eastTeams.mia,
        bottomTeam: eastTeams.atl,
        topScore: 1,
        bottomScore: 0,
        winnerId: "mia",
        advancesToSeed8: true,
        loserEliminated: true,
      },
    ],
    firstRound: [
      { id: "e-fr1", round: "first", slotIndex: 0, topTeam: eastTeams.bos, bottomTeam: eastTeams.mia, topScore: 3, bottomScore: 0, winnerId: "bos" },
      { id: "e-fr2", round: "first", slotIndex: 1, topTeam: eastTeams.ny, bottomTeam: eastTeams.phi, topScore: 1, bottomScore: 2, winnerId: "phi" },
      { id: "e-fr3", round: "first", slotIndex: 2, topTeam: eastTeams.mil, bottomTeam: eastTeams.ind, topScore: 2, bottomScore: 1, winnerId: null },
      { id: "e-fr4", round: "first", slotIndex: 3, topTeam: eastTeams.cle, bottomTeam: eastTeams.orl, topScore: 1, bottomScore: 1, winnerId: null },
    ],
    semifinals: [
      { id: "e-sf1", round: "semifinals", topTeam: eastTeams.bos, bottomTeam: eastTeams.cle, topScore: 0, bottomScore: 0, winnerId: null },
      { id: "e-sf2", round: "semifinals", topTeam: eastTeams.phi, bottomTeam: eastTeams.mil, topScore: 0, bottomScore: 0, winnerId: null },
    ],
    conferenceFinals: {
      id: "e-cf",
      round: "conference_finals",
      topTeam: eastTeams.bos,
      bottomTeam: eastTeams.phi,
      topScore: 0,
      bottomScore: 0,
      winnerId: null,
    },
  },
  nbaFinals: {
    id: "finals",
    round: "nba_finals",
    topTeam: westTeams.okc,
    bottomTeam: eastTeams.bos,
    topScore: 0,
    bottomScore: 0,
    winnerId: null,
  },
};
