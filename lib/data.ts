// ===== LEAGUE DATA =====
export type League = "NBA" | "NFL" | "MLB" | "NHL" | "UCL" | "WC"

export const leagues: { id: League; name: string; color: string }[] = [
  { id: "NBA", name: "NBA", color: "#C9082A" },
  { id: "NFL", name: "NFL", color: "#013369" },
  { id: "MLB", name: "MLB", color: "#002D72" },
  { id: "NHL", name: "NHL", color: "#000000" },
  { id: "UCL", name: "Champions League", color: "#1A2B5E" },
  { id: "WC", name: "World Cup", color: "#56042C" },
]

// ===== SCORES =====
export interface Game {
  id: string
  league: League
  homeTeam: string
  awayTeam: string
  homeScore: number
  awayScore: number
  status: "live" | "final" | "upcoming"
  time: string
  homeRecord?: string
  awayRecord?: string
}

export const liveGames: Game[] = [
  {
    id: "1",
    league: "NBA",
    homeTeam: "Lakers",
    awayTeam: "Celtics",
    homeScore: 108,
    awayScore: 112,
    status: "live",
    time: "Q4 2:34",
    homeRecord: "32-18",
    awayRecord: "38-12",
  },
  {
    id: "2",
    league: "NBA",
    homeTeam: "Warriors",
    awayTeam: "Bucks",
    homeScore: 95,
    awayScore: 89,
    status: "live",
    time: "Q3 8:15",
    homeRecord: "28-22",
    awayRecord: "34-16",
  },
  {
    id: "3",
    league: "NFL",
    homeTeam: "Chiefs",
    awayTeam: "49ers",
    homeScore: 24,
    awayScore: 21,
    status: "final",
    time: "Final",
    homeRecord: "11-3",
    awayRecord: "10-4",
  },
  {
    id: "4",
    league: "NBA",
    homeTeam: "Nuggets",
    awayTeam: "Thunder",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    time: "7:00 PM ET",
    homeRecord: "35-15",
    awayRecord: "36-14",
  },
  {
    id: "5",
    league: "NFL",
    homeTeam: "Eagles",
    awayTeam: "Cowboys",
    homeScore: 31,
    awayScore: 17,
    status: "final",
    time: "Final",
    homeRecord: "12-2",
    awayRecord: "8-6",
  },
  {
    id: "6",
    league: "NBA",
    homeTeam: "Knicks",
    awayTeam: "76ers",
    homeScore: 101,
    awayScore: 98,
    status: "live",
    time: "Q4 5:02",
    homeRecord: "30-20",
    awayRecord: "26-24",
  },
  {
    id: "7",
    league: "NBA",
    homeTeam: "Cavaliers",
    awayTeam: "Heat",
    homeScore: 0,
    awayScore: 0,
    status: "upcoming",
    time: "8:30 PM ET",
    homeRecord: "37-13",
    awayRecord: "25-25",
  },
  {
    id: "8",
    league: "NFL",
    homeTeam: "Ravens",
    awayTeam: "Bills",
    homeScore: 28,
    awayScore: 27,
    status: "final",
    time: "Final",
    homeRecord: "12-3",
    awayRecord: "11-4",
  },
]

// ===== NEWS / ARTICLES =====
export interface Article {
  id: string
  title: string
  excerpt: string
  category: League | "Fantasy" | "Betting"
  author: string
  date: string
  readTime: string
  featured?: boolean
  imageUrl?: string
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Lakers Trade Deadline: Three Moves That Could Save Their Season",
    excerpt:
      "With the trade deadline approaching, the Lakers have several options to bolster their roster. We break down the most impactful potential deals and their championship implications.",
    category: "NBA",
    author: "Marcus Johnson",
    date: "Feb 7, 2026",
    readTime: "6 min read",
    featured: true,
  },
  {
    id: "2",
    title: "NFL Draft 2026: Early Mock Draft and Top Prospects",
    excerpt:
      "The 2026 NFL Draft class is loaded with talent. Our early mock draft breaks down the top prospects and where they could land.",
    category: "NFL",
    author: "Sarah Chen",
    date: "Feb 6, 2026",
    readTime: "8 min read",
    featured: true,
  },
  {
    id: "3",
    title: "Fantasy Basketball: Week 16 Waiver Wire Pickups",
    excerpt:
      "Looking for streaming options? These under-rostered players could be difference-makers in your fantasy matchup this week.",
    category: "Fantasy",
    author: "David Park",
    date: "Feb 6, 2026",
    readTime: "5 min read",
  },
  {
    id: "4",
    title: "Betting Edge: Super Bowl Prop Bets with Positive Expected Value",
    excerpt:
      "Our analytics team identified five prop bets for the Super Bowl that present genuine value based on our models.",
    category: "Betting",
    author: "Alex Rivera",
    date: "Feb 5, 2026",
    readTime: "4 min read",
  },
  {
    id: "5",
    title: "Thunder's Defensive Scheme Is the Blueprint for Modern NBA Defense",
    excerpt:
      "Oklahoma City's switching defense and paint protection are setting new standards. We look at the numbers behind their elite unit.",
    category: "NBA",
    author: "Marcus Johnson",
    date: "Feb 5, 2026",
    readTime: "7 min read",
  },
  {
    id: "6",
    title: "NFL Combine Preview: Storylines to Watch",
    excerpt:
      "The NFL Combine is just weeks away. Here are the players and position groups that will generate the most buzz.",
    category: "NFL",
    author: "Sarah Chen",
    date: "Feb 4, 2026",
    readTime: "5 min read",
  },
]

// ===== STANDINGS =====
export interface TeamStanding {
  rank: number
  team: string
  wins: number
  losses: number
  pct: number
  gb: string
  streak: string
  last10: string
}

export const nbaEastStandings: TeamStanding[] = [
  { rank: 1, team: "Cavaliers", wins: 37, losses: 13, pct: 0.740, gb: "-", streak: "W5", last10: "8-2" },
  { rank: 2, team: "Celtics", wins: 38, losses: 12, pct: 0.760, gb: "-", streak: "W3", last10: "7-3" },
  { rank: 3, team: "Knicks", wins: 30, losses: 20, pct: 0.600, gb: "7.0", streak: "W2", last10: "6-4" },
  { rank: 4, team: "Bucks", wins: 34, losses: 16, pct: 0.680, gb: "3.0", streak: "L1", last10: "7-3" },
  { rank: 5, team: "Pacers", wins: 28, losses: 22, pct: 0.560, gb: "9.0", streak: "W1", last10: "5-5" },
]

export const nbaWestStandings: TeamStanding[] = [
  { rank: 1, team: "Thunder", wins: 36, losses: 14, pct: 0.720, gb: "-", streak: "W4", last10: "9-1" },
  { rank: 2, team: "Nuggets", wins: 35, losses: 15, pct: 0.700, gb: "1.0", streak: "W2", last10: "7-3" },
  { rank: 3, team: "Lakers", wins: 32, losses: 18, pct: 0.640, gb: "4.0", streak: "L2", last10: "5-5" },
  { rank: 4, team: "Timberwolves", wins: 30, losses: 20, pct: 0.600, gb: "6.0", streak: "W1", last10: "6-4" },
  { rank: 5, team: "Warriors", wins: 28, losses: 22, pct: 0.560, gb: "8.0", streak: "L1", last10: "4-6" },
]

// ===== POWER RANKINGS =====
export interface PowerRanking {
  rank: number
  prevRank: number
  team: string
  league: League
  record: string
  description: string
}

export const powerRankings: PowerRanking[] = [
  { rank: 1, prevRank: 1, team: "Cavaliers", league: "NBA", record: "37-13", description: "The Cavs continue to dominate with elite defense and Donovan Mitchell in MVP form." },
  { rank: 2, prevRank: 3, team: "Thunder", league: "NBA", record: "36-14", description: "SGA is making a strong MVP case as OKC's young core continues to improve." },
  { rank: 3, prevRank: 2, team: "Celtics", league: "NBA", record: "38-12", description: "Boston's title defense hits a minor speed bump but talent keeps them elite." },
  { rank: 4, prevRank: 5, team: "Chiefs", league: "NFL", record: "11-3", description: "Mahomes doing Mahomes things. The three-peat remains alive." },
  { rank: 5, prevRank: 4, team: "Eagles", league: "NFL", record: "12-2", description: "Saquon Barkley has transformed this offense into a juggernaut." },
]

// ===== FANTASY HUB =====
export interface FantasyPlayer {
  name: string
  team: string
  position: string
  fantasyPts: number
  projectedPts: number
  recommendation: "Start" | "Sit" | "Flex"
  injuryStatus?: string
  usage: number
  minutes: number
  matchup: string
  matchupRating: "Easy" | "Medium" | "Hard"
}

export const fantasyPlayers: FantasyPlayer[] = [
  { name: "Shai Gilgeous-Alexander", team: "OKC", position: "PG", fantasyPts: 58.2, projectedPts: 55.0, recommendation: "Start", usage: 33.1, minutes: 34.2, matchup: "vs LAL", matchupRating: "Easy" },
  { name: "Donovan Mitchell", team: "CLE", position: "SG", fantasyPts: 49.8, projectedPts: 47.5, recommendation: "Start", usage: 30.8, minutes: 35.1, matchup: "vs MIA", matchupRating: "Medium" },
  { name: "Jayson Tatum", team: "BOS", position: "SF", fantasyPts: 52.1, projectedPts: 50.0, recommendation: "Start", usage: 29.5, minutes: 36.0, matchup: "@ LAL", matchupRating: "Easy" },
  { name: "Anthony Davis", team: "LAL", position: "PF/C", fantasyPts: 55.4, projectedPts: 48.0, recommendation: "Start", injuryStatus: "Questionable", usage: 28.2, minutes: 33.5, matchup: "vs BOS", matchupRating: "Hard" },
  { name: "Nikola Jokic", team: "DEN", position: "C", fantasyPts: 62.3, projectedPts: 58.0, recommendation: "Start", usage: 31.0, minutes: 34.8, matchup: "vs OKC", matchupRating: "Hard" },
  { name: "Darius Garland", team: "CLE", position: "PG", fantasyPts: 38.5, projectedPts: 36.0, recommendation: "Flex", usage: 24.1, minutes: 32.0, matchup: "vs MIA", matchupRating: "Medium" },
  { name: "Brandon Ingram", team: "NOP", position: "SF", fantasyPts: 35.2, projectedPts: 30.0, recommendation: "Sit", injuryStatus: "GTD", usage: 27.5, minutes: 28.0, matchup: "@ MIN", matchupRating: "Hard" },
  { name: "Marcus Smart", team: "MEM", position: "PG", fantasyPts: 28.1, projectedPts: 25.0, recommendation: "Sit", usage: 20.3, minutes: 30.0, matchup: "@ MIL", matchupRating: "Hard" },
]

// ===== BETTING ODDS =====
export interface BettingOdds {
  game: string
  league: League
  fanduel: { spread: string; total: string; moneyline: string }
  draftkings: { spread: string; total: string; moneyline: string }
  betmgm: { spread: string; total: string; moneyline: string }
}

export const bettingOdds: BettingOdds[] = [
  {
    game: "Lakers vs Celtics",
    league: "NBA",
    fanduel: { spread: "BOS -4.5", total: "O/U 224.5", moneyline: "BOS -190" },
    draftkings: { spread: "BOS -5.0", total: "O/U 225.0", moneyline: "BOS -195" },
    betmgm: { spread: "BOS -4.5", total: "O/U 224.0", moneyline: "BOS -185" },
  },
  {
    game: "Warriors vs Bucks",
    league: "NBA",
    fanduel: { spread: "MIL -2.5", total: "O/U 231.5", moneyline: "MIL -135" },
    draftkings: { spread: "MIL -3.0", total: "O/U 232.0", moneyline: "MIL -140" },
    betmgm: { spread: "MIL -2.5", total: "O/U 231.0", moneyline: "MIL -130" },
  },
  {
    game: "Nuggets vs Thunder",
    league: "NBA",
    fanduel: { spread: "OKC -1.5", total: "O/U 219.5", moneyline: "OKC -120" },
    draftkings: { spread: "OKC -2.0", total: "O/U 220.0", moneyline: "OKC -125" },
    betmgm: { spread: "OKC -1.5", total: "O/U 219.0", moneyline: "OKC -115" },
  },
]
