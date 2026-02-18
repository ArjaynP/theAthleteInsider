export interface NFLPlayoffTeam {
  id: string;
  name: string;
  abbreviation: string;
  seed: number;
  conference: "AFC" | "NFC";
  primaryColor?: string;
}

export interface NFLPlayoffGame {
  id: string;
  round: "wild_card" | "divisional" | "conference" | "super_bowl";
  label: string;
  topTeam: NFLPlayoffTeam;
  bottomTeam: NFLPlayoffTeam;
  topScore: number;
  bottomScore: number;
  winnerId: string | null;
}

export interface NFLConferenceBracket {
  conference: "AFC" | "NFC";
  byeTeam: NFLPlayoffTeam;
  wildCard: NFLPlayoffGame[];
  divisional: NFLPlayoffGame[];
  conferenceChampionship: NFLPlayoffGame;
}

export interface NFLPostseasonBracket {
  afc: NFLConferenceBracket;
  nfc: NFLConferenceBracket;
  superBowl: NFLPlayoffGame;
  seasonLabel: string;
  championLabel: string;
}

const afcTeams: Record<string, NFLPlayoffTeam> = {
  den: { id: "den", name: "Broncos", abbreviation: "DEN", seed: 1, conference: "AFC", primaryColor: "#FB4F14" },
  ne: { id: "ne", name: "Patriots", abbreviation: "NE", seed: 2, conference: "AFC", primaryColor: "#002244" },
  jax: { id: "jax", name: "Jaguars", abbreviation: "JAX", seed: 3, conference: "AFC", primaryColor: "#006778" },
  pit: { id: "pit", name: "Steelers", abbreviation: "PIT", seed: 4, conference: "AFC", primaryColor: "#FFB612" },
  hou: { id: "hou", name: "Texans", abbreviation: "HOU", seed: 5, conference: "AFC", primaryColor: "#03202F" },
  buf: { id: "buf", name: "Bills", abbreviation: "BUF", seed: 6, conference: "AFC", primaryColor: "#00338D" },
  lac: { id: "lac", name: "Chargers", abbreviation: "LAC", seed: 7, conference: "AFC", primaryColor: "#0080C6" },
};

const nfcTeams: Record<string, NFLPlayoffTeam> = {
  sea: { id: "sea", name: "Seahawks", abbreviation: "SEA", seed: 1, conference: "NFC", primaryColor: "#002244" },
  chi: { id: "chi", name: "Bears", abbreviation: "CHI", seed: 2, conference: "NFC", primaryColor: "#0B162A" },
  phi: { id: "phi", name: "Eagles", abbreviation: "PHI", seed: 3, conference: "NFC", primaryColor: "#004C54" },
  car: { id: "car", name: "Panthers", abbreviation: "CAR", seed: 4, conference: "NFC", primaryColor: "#0085CA" },
  lar: { id: "lar", name: "Rams", abbreviation: "LAR", seed: 5, conference: "NFC", primaryColor: "#003594" },
  sf: { id: "sf", name: "49ers", abbreviation: "SF", seed: 6, conference: "NFC", primaryColor: "#AA0000" },
  gb: { id: "gb", name: "Packers", abbreviation: "GB", seed: 7, conference: "NFC", primaryColor: "#203731" },
};

export const nflPostseasonBracket: NFLPostseasonBracket = {
  seasonLabel: "2025-2026 NFL POSTSEASON",
  championLabel: "Super Bowl Champions",
  afc: {
    conference: "AFC",
    byeTeam: afcTeams.den,
    wildCard: [
      {
        id: "afc-wc-1",
        round: "wild_card",
        label: "Final",
        topTeam: afcTeams.pit,
        bottomTeam: afcTeams.hou,
        topScore: 6,
        bottomScore: 30,
        winnerId: "hou",
      },
      {
        id: "afc-wc-2",
        round: "wild_card",
        label: "Final",
        topTeam: afcTeams.jax,
        bottomTeam: afcTeams.buf,
        topScore: 24,
        bottomScore: 27,
        winnerId: "buf",
      },
      {
        id: "afc-wc-3",
        round: "wild_card",
        label: "Final",
        topTeam: afcTeams.ne,
        bottomTeam: afcTeams.lac,
        topScore: 16,
        bottomScore: 3,
        winnerId: "ne",
      },
    ],
    divisional: [
      {
        id: "afc-div-1",
        round: "divisional",
        label: "Final/OT",
        topTeam: afcTeams.den,
        bottomTeam: afcTeams.buf,
        topScore: 33,
        bottomScore: 30,
        winnerId: "den",
      },
      {
        id: "afc-div-2",
        round: "divisional",
        label: "Final",
        topTeam: afcTeams.ne,
        bottomTeam: afcTeams.hou,
        topScore: 28,
        bottomScore: 16,
        winnerId: "ne",
      },
    ],
    conferenceChampionship: {
      id: "afc-conf-final",
      round: "conference",
      label: "Final",
      topTeam: afcTeams.den,
      bottomTeam: afcTeams.ne,
      topScore: 7,
      bottomScore: 10,
      winnerId: "ne",
    },
  },
  nfc: {
    conference: "NFC",
    byeTeam: nfcTeams.sea,
    wildCard: [
      {
        id: "nfc-wc-1",
        round: "wild_card",
        label: "Final",
        topTeam: nfcTeams.car,
        bottomTeam: nfcTeams.lar,
        topScore: 31,
        bottomScore: 34,
        winnerId: "lar",
      },
      {
        id: "nfc-wc-2",
        round: "wild_card",
        label: "Final",
        topTeam: nfcTeams.phi,
        bottomTeam: nfcTeams.sf,
        topScore: 19,
        bottomScore: 23,
        winnerId: "sf",
      },
      {
        id: "nfc-wc-3",
        round: "wild_card",
        label: "Final",
        topTeam: nfcTeams.chi,
        bottomTeam: nfcTeams.gb,
        topScore: 31,
        bottomScore: 27,
        winnerId: "chi",
      },
    ],
    divisional: [
      {
        id: "nfc-div-1",
        round: "divisional",
        label: "Final",
        topTeam: nfcTeams.sea,
        bottomTeam: nfcTeams.sf,
        topScore: 41,
        bottomScore: 6,
        winnerId: "sea",
      },
      {
        id: "nfc-div-2",
        round: "divisional",
        label: "Final/OT",
        topTeam: nfcTeams.chi,
        bottomTeam: nfcTeams.lar,
        topScore: 17,
        bottomScore: 20,
        winnerId: "lar",
      },
    ],
    conferenceChampionship: {
      id: "nfc-conf-final",
      round: "conference",
      label: "Final",
      topTeam: nfcTeams.sea,
      bottomTeam: nfcTeams.lar,
      topScore: 31,
      bottomScore: 27,
      winnerId: "sea",
    },
  },
  superBowl: {
    id: "sb-lx",
    round: "super_bowl",
    label: "Final",
    topTeam: afcTeams.ne,
    bottomTeam: nfcTeams.sea,
    topScore: 13,
    bottomScore: 29,
    winnerId: "sea",
  },
};
