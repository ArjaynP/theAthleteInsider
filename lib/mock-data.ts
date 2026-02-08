// ============ ARTICLES ============
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  league: "NBA" | "NFL";
  featured: boolean;
  imageUrl: string;
  category: string;
  readTime: string;
}

export const articles: Article[] = [
  {
    id: "1",
    title: "Lakers Dynasty 2.0: How LA Built a Championship Contender",
    excerpt:
      "A deep dive into the front office moves that transformed the Lakers into the Western Conference favorites this season.",
    content: `The Los Angeles Lakers have emerged as legitimate championship contenders this season, and the transformation didn't happen overnight. It was a calculated series of moves by the front office that turned a rebuilding franchise into a powerhouse.\n\nThe key acquisition was the mid-season trade that brought in a two-way wing player who immediately elevated the defense. Combined with the development of their young core, the Lakers now boast one of the deepest rosters in the league.\n\n"We knew we had the pieces," head coach said after a dominant win. "It was about finding the right chemistry and letting these guys compete."\n\nThe numbers back up the eye test. The Lakers rank top-5 in both offensive and defensive efficiency, a combination that historically correlates strongly with championship success. Their net rating of +8.2 is the best in franchise history since the Showtime era.`,
    author: "Marcus Johnson",
    date: "Feb 8, 2026",
    league: "NBA",
    featured: true,
    imageUrl: "/placeholder.svg",
    category: "Analysis",
    readTime: "6 min read",
  },
  {
    id: "2",
    title: "Super Bowl LX Preview: Chiefs vs. Lions Showdown",
    excerpt:
      "Everything you need to know about the biggest game of the year. Matchup analysis, key players, and our prediction.",
    content: `Super Bowl LX promises to be one for the ages. The Kansas City Chiefs, seeking a three-peat, face off against the Detroit Lions, who are making their first Super Bowl appearance in franchise history.\n\nThe storylines write themselves. Patrick Mahomes vs. the Lions' historic defense. The Dynasty vs. the Cinderella story.\n\nKey matchup to watch: The Chiefs' offensive line against the Lions' pass rush, which led the NFL with 58 sacks this season.`,
    author: "Sarah Mitchell",
    date: "Feb 7, 2026",
    league: "NFL",
    featured: true,
    imageUrl: "/placeholder.svg",
    category: "Preview",
    readTime: "8 min read",
  },
  {
    id: "3",
    title: "MVP Race Heats Up: Top 5 Candidates Ranked",
    excerpt:
      "The NBA MVP race is tighter than ever. We break down the top contenders and who has the edge.",
    content: `With the All-Star break approaching, the MVP race has never been more competitive. Here's our definitive ranking of the top five candidates and what separates them.`,
    author: "David Chen",
    date: "Feb 7, 2026",
    league: "NBA",
    featured: false,
    imageUrl: "/placeholder.svg",
    category: "Rankings",
    readTime: "5 min read",
  },
  {
    id: "4",
    title: "NFL Free Agency: Top 25 Players Available This Offseason",
    excerpt:
      "A comprehensive look at the biggest names hitting the open market and where they might land.",
    content: `The NFL free agency period is approaching and several star players are set to hit the open market. Here's our ranking of the top 25 available players and potential landing spots.`,
    author: "James Rodriguez",
    date: "Feb 6, 2026",
    league: "NFL",
    featured: false,
    imageUrl: "/placeholder.svg",
    category: "Free Agency",
    readTime: "10 min read",
  },
  {
    id: "5",
    title: "Rookie Watch: First-Year Stars Making Immediate Impact",
    excerpt:
      "This year's rookie class is delivering. We highlight the freshmen who are already changing the game.",
    content: `The 2025 NBA Draft class is proving to be one of the most talented in recent memory. Several rookies are not just contributing - they're starring.`,
    author: "Alicia Torres",
    date: "Feb 6, 2026",
    league: "NBA",
    featured: false,
    imageUrl: "/placeholder.svg",
    category: "Rookies",
    readTime: "4 min read",
  },
  {
    id: "6",
    title: "Trade Deadline Tracker: Every Deal and Rumor",
    excerpt:
      "Live updates on every NBA trade deadline move. Who's buying, who's selling, and who got fleeced.",
    content: `The NBA trade deadline is upon us and the phones are ringing off the hook. Here's your one-stop shop for every confirmed deal and the hottest rumors circulating around the league.`,
    author: "Marcus Johnson",
    date: "Feb 5, 2026",
    league: "NBA",
    featured: false,
    imageUrl: "/placeholder.svg",
    category: "Trades",
    readTime: "7 min read",
  },
  {
    id: "7",
    title: "NFL Combine Preview: Prospects Who Will Soar",
    excerpt:
      "The NFL Combine is around the corner. These draft prospects are poised to boost their stock.",
    content: `The NFL Scouting Combine is a make-or-break event for draft prospects. Here are the players we expect to see their stock skyrocket.`,
    author: "Sarah Mitchell",
    date: "Feb 5, 2026",
    league: "NFL",
    featured: false,
    imageUrl: "/placeholder.svg",
    category: "Draft",
    readTime: "6 min read",
  },
  {
    id: "8",
    title: "Coaching Carousel: Which Teams Got It Right?",
    excerpt:
      "NFL coaching changes are complete. Grading every hire and what it means for next season.",
    content: `The NFL coaching carousel has come to a stop with all vacancies filled. Let's grade every hire and project how these new coaches will impact their franchises.`,
    author: "James Rodriguez",
    date: "Feb 4, 2026",
    league: "NFL",
    featured: false,
    imageUrl: "/placeholder.svg",
    category: "Coaches",
    readTime: "9 min read",
  },
];

// ============ GAMES & SCORES ============
export interface Game {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  status: "LIVE" | "FINAL" | "UPCOMING";
  quarter?: string;
  time?: string;
  startTime?: string;
  league: "NBA" | "NFL";
  homeRecord: string;
  awayRecord: string;
}

export const games: Game[] = [
  {
    id: "g1",
    homeTeam: "LAL",
    awayTeam: "BOS",
    homeScore: 98,
    awayScore: 94,
    status: "LIVE",
    quarter: "Q3",
    time: "4:32",
    league: "NBA",
    homeRecord: "38-15",
    awayRecord: "40-13",
  },
  {
    id: "g2",
    homeTeam: "GSW",
    awayTeam: "MIL",
    homeScore: 112,
    awayScore: 108,
    status: "LIVE",
    quarter: "Q4",
    time: "2:15",
    league: "NBA",
    homeRecord: "32-20",
    awayRecord: "34-19",
  },
  {
    id: "g3",
    homeTeam: "DEN",
    awayTeam: "PHX",
    homeScore: 121,
    awayScore: 115,
    status: "FINAL",
    league: "NBA",
    homeRecord: "35-18",
    awayRecord: "30-22",
  },
  {
    id: "g4",
    homeTeam: "MIA",
    awayTeam: "NYK",
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    startTime: "7:30 PM ET",
    league: "NBA",
    homeRecord: "28-24",
    awayRecord: "36-17",
  },
  {
    id: "g5",
    homeTeam: "DAL",
    awayTeam: "PHI",
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    startTime: "8:00 PM ET",
    league: "NBA",
    homeRecord: "33-20",
    awayRecord: "29-23",
  },
  {
    id: "g6",
    homeTeam: "KC",
    awayTeam: "DET",
    homeScore: 24,
    awayScore: 21,
    status: "FINAL",
    league: "NFL",
    homeRecord: "16-3",
    awayRecord: "15-4",
  },
  {
    id: "g7",
    homeTeam: "BUF",
    awayTeam: "BAL",
    homeScore: 31,
    awayScore: 27,
    status: "FINAL",
    league: "NFL",
    homeRecord: "14-5",
    awayRecord: "13-6",
  },
  {
    id: "g8",
    homeTeam: "SF",
    awayTeam: "DAL",
    homeScore: 17,
    awayScore: 14,
    status: "FINAL",
    league: "NFL",
    homeRecord: "13-6",
    awayRecord: "12-7",
  },
];

// ============ STANDINGS ============
export interface TeamStanding {
  rank: number;
  team: string;
  abbreviation: string;
  wins: number;
  losses: number;
  pct: string;
  gb: string;
  streak: string;
  conference: string;
  league: "NBA" | "NFL";
}

export const nbaStandings: TeamStanding[] = [
  { rank: 1, team: "Boston Celtics", abbreviation: "BOS", wins: 40, losses: 13, pct: ".755", gb: "-", streak: "W5", conference: "East", league: "NBA" },
  { rank: 2, team: "New York Knicks", abbreviation: "NYK", wins: 36, losses: 17, pct: ".679", gb: "4", streak: "W3", conference: "East", league: "NBA" },
  { rank: 3, team: "Milwaukee Bucks", abbreviation: "MIL", wins: 34, losses: 19, pct: ".642", gb: "6", streak: "L1", conference: "East", league: "NBA" },
  { rank: 4, team: "Cleveland Cavaliers", abbreviation: "CLE", wins: 34, losses: 20, pct: ".630", gb: "6.5", streak: "W2", conference: "East", league: "NBA" },
  { rank: 5, team: "Miami Heat", abbreviation: "MIA", wins: 28, losses: 24, pct: ".538", gb: "11.5", streak: "L2", conference: "East", league: "NBA" },
  { rank: 6, team: "Los Angeles Lakers", abbreviation: "LAL", wins: 38, losses: 15, pct: ".717", gb: "-", streak: "W7", conference: "West", league: "NBA" },
  { rank: 7, team: "Denver Nuggets", abbreviation: "DEN", wins: 35, losses: 18, pct: ".660", gb: "3", streak: "W1", conference: "West", league: "NBA" },
  { rank: 8, team: "Golden State Warriors", abbreviation: "GSW", wins: 32, losses: 20, pct: ".615", gb: "5.5", streak: "W2", conference: "West", league: "NBA" },
  { rank: 9, team: "Phoenix Suns", abbreviation: "PHX", wins: 30, losses: 22, pct: ".577", gb: "7.5", streak: "L3", conference: "West", league: "NBA" },
  { rank: 10, team: "Dallas Mavericks", abbreviation: "DAL", wins: 33, losses: 20, pct: ".623", gb: "5", streak: "W1", conference: "West", league: "NBA" },
];

export const nflStandings: TeamStanding[] = [
  { rank: 1, team: "Kansas City Chiefs", abbreviation: "KC", wins: 16, losses: 3, pct: ".842", gb: "-", streak: "W8", conference: "AFC", league: "NFL" },
  { rank: 2, team: "Buffalo Bills", abbreviation: "BUF", wins: 14, losses: 5, pct: ".737", gb: "2", streak: "W3", conference: "AFC", league: "NFL" },
  { rank: 3, team: "Baltimore Ravens", abbreviation: "BAL", wins: 13, losses: 6, pct: ".684", gb: "3", streak: "L1", conference: "AFC", league: "NFL" },
  { rank: 4, team: "Houston Texans", abbreviation: "HOU", wins: 12, losses: 7, pct: ".632", gb: "4", streak: "W1", conference: "AFC", league: "NFL" },
  { rank: 5, team: "Miami Dolphins", abbreviation: "MIA", wins: 11, losses: 8, pct: ".579", gb: "5", streak: "L2", conference: "AFC", league: "NFL" },
  { rank: 6, team: "Detroit Lions", abbreviation: "DET", wins: 15, losses: 4, pct: ".789", gb: "-", streak: "W5", conference: "NFC", league: "NFL" },
  { rank: 7, team: "San Francisco 49ers", abbreviation: "SF", wins: 13, losses: 6, pct: ".684", gb: "2", streak: "W2", conference: "NFC", league: "NFL" },
  { rank: 8, team: "Dallas Cowboys", abbreviation: "DAL", wins: 12, losses: 7, pct: ".632", gb: "3", streak: "L1", conference: "NFC", league: "NFL" },
  { rank: 9, team: "Philadelphia Eagles", abbreviation: "PHI", wins: 12, losses: 7, pct: ".632", gb: "3", streak: "W1", conference: "NFC", league: "NFL" },
  { rank: 10, team: "Green Bay Packers", abbreviation: "GB", wins: 11, losses: 8, pct: ".579", gb: "4", streak: "W3", conference: "NFC", league: "NFL" },
];

// ============ POLLS ============
export interface Poll {
  id: string;
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
  league: "NBA" | "NFL";
}

export const polls: Poll[] = [
  {
    id: "p1",
    question: "Who wins tonight: Lakers vs Celtics?",
    options: [
      { label: "Los Angeles Lakers", votes: 2847 },
      { label: "Boston Celtics", votes: 3201 },
    ],
    totalVotes: 6048,
    league: "NBA",
  },
  {
    id: "p2",
    question: "2026 NBA MVP - Who takes it?",
    options: [
      { label: "Luka Doncic", votes: 4521 },
      { label: "Jayson Tatum", votes: 3890 },
      { label: "Nikola Jokic", votes: 5102 },
      { label: "Shai Gilgeous-Alexander", votes: 4230 },
    ],
    totalVotes: 17743,
    league: "NBA",
  },
  {
    id: "p3",
    question: "Super Bowl LX Winner?",
    options: [
      { label: "Kansas City Chiefs", votes: 8934 },
      { label: "Detroit Lions", votes: 7821 },
    ],
    totalVotes: 16755,
    league: "NFL",
  },
];

// ============ QUIZ ============
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: string;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    question: "Which player holds the NBA record for most points in a single game?",
    options: ["Michael Jordan", "Kobe Bryant", "Wilt Chamberlain", "LeBron James"],
    correctAnswer: 2,
    category: "NBA History",
  },
  {
    id: "q2",
    question: "Which team has won the most Super Bowls?",
    options: ["Dallas Cowboys", "New England Patriots", "Pittsburgh Steelers", "San Francisco 49ers"],
    correctAnswer: 2,
    category: "NFL History",
  },
  {
    id: "q3",
    question: "Who was the first overall pick in the 2003 NBA Draft?",
    options: ["Carmelo Anthony", "Chris Bosh", "Dwyane Wade", "LeBron James"],
    correctAnswer: 3,
    category: "NBA Draft",
  },
  {
    id: "q4",
    question: "Which NFL quarterback has the most career touchdown passes?",
    options: ["Peyton Manning", "Tom Brady", "Drew Brees", "Aaron Rodgers"],
    correctAnswer: 1,
    category: "NFL Records",
  },
  {
    id: "q5",
    question: "What year was the NBA three-point line introduced?",
    options: ["1977", "1979", "1981", "1983"],
    correctAnswer: 1,
    category: "NBA History",
  },
];

// ============ LEADERBOARD ============
export interface LeaderboardEntry {
  rank: number;
  username: string;
  score: number;
  streak: number;
  correctPicks: number;
  totalPicks: number;
}

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, username: "HoopsGuru99", score: 2450, streak: 12, correctPicks: 89, totalPicks: 102 },
  { rank: 2, username: "GridironKing", score: 2380, streak: 8, correctPicks: 85, totalPicks: 102 },
  { rank: 3, username: "StatsMaster", score: 2290, streak: 5, correctPicks: 82, totalPicks: 102 },
  { rank: 4, username: "BetterThanVegas", score: 2150, streak: 3, correctPicks: 79, totalPicks: 102 },
  { rank: 5, username: "AllDayAce", score: 2080, streak: 6, correctPicks: 76, totalPicks: 102 },
  { rank: 6, username: "CourtVision", score: 1990, streak: 2, correctPicks: 74, totalPicks: 102 },
  { rank: 7, username: "EndZoneExpert", score: 1920, streak: 4, correctPicks: 72, totalPicks: 102 },
  { rank: 8, username: "TripleDouble", score: 1850, streak: 1, correctPicks: 70, totalPicks: 102 },
  { rank: 9, username: "BlitzAnalyst", score: 1780, streak: 7, correctPicks: 68, totalPicks: 102 },
  { rank: 10, username: "SlamDunkPro", score: 1710, streak: 3, correctPicks: 66, totalPicks: 102 },
];

// ============ ODDS ============
export interface OddsData {
  id: string;
  game: string;
  homeTeam: string;
  awayTeam: string;
  league: "NBA" | "NFL";
  fanduel: { spread: string; moneyline: string; total: string };
  draftkings: { spread: string; moneyline: string; total: string };
  betmgm: { spread: string; moneyline: string; total: string };
  bestBet?: string;
}

export const oddsData: OddsData[] = [
  {
    id: "o1",
    game: "LAL vs BOS",
    homeTeam: "LAL",
    awayTeam: "BOS",
    league: "NBA",
    fanduel: { spread: "LAL -2.5", moneyline: "-135", total: "O/U 224.5" },
    draftkings: { spread: "LAL -3", moneyline: "-140", total: "O/U 225" },
    betmgm: { spread: "LAL -2.5", moneyline: "-130", total: "O/U 224" },
    bestBet: "BetMGM Moneyline",
  },
  {
    id: "o2",
    game: "GSW vs MIL",
    homeTeam: "GSW",
    awayTeam: "MIL",
    league: "NBA",
    fanduel: { spread: "MIL -1.5", moneyline: "-115", total: "O/U 231" },
    draftkings: { spread: "MIL -1", moneyline: "-110", total: "O/U 230.5" },
    betmgm: { spread: "MIL -1.5", moneyline: "-112", total: "O/U 231.5" },
    bestBet: "DraftKings Spread",
  },
  {
    id: "o3",
    game: "MIA vs NYK",
    homeTeam: "MIA",
    awayTeam: "NYK",
    league: "NBA",
    fanduel: { spread: "NYK -4.5", moneyline: "-190", total: "O/U 212" },
    draftkings: { spread: "NYK -4", moneyline: "-185", total: "O/U 211.5" },
    betmgm: { spread: "NYK -4.5", moneyline: "-195", total: "O/U 212.5" },
  },
  {
    id: "o4",
    game: "KC vs DET",
    homeTeam: "KC",
    awayTeam: "DET",
    league: "NFL",
    fanduel: { spread: "KC -1.5", moneyline: "-118", total: "O/U 49.5" },
    draftkings: { spread: "KC -1", moneyline: "-115", total: "O/U 50" },
    betmgm: { spread: "KC -1.5", moneyline: "-120", total: "O/U 49.5" },
    bestBet: "DraftKings Spread",
  },
];

// ============ FANTASY ============
export interface FantasyPick {
  player: string;
  team: string;
  position: string;
  recommendation: "START" | "SIT" | "BUY LOW" | "SELL HIGH" | "STREAM";
  reason: string;
  opponent: string;
  projectedPoints: number;
}

export const fantasyPicks: FantasyPick[] = [
  { player: "Luka Doncic", team: "DAL", position: "PG", recommendation: "START", reason: "Averaging 35+ in last 5 games, facing a bottom-5 defense", opponent: "vs PHI", projectedPoints: 52.3 },
  { player: "Anthony Edwards", team: "MIN", position: "SG", recommendation: "START", reason: "Elite usage rate with key teammate out", opponent: "vs POR", projectedPoints: 48.7 },
  { player: "Joel Embiid", team: "PHI", position: "C", recommendation: "SIT", reason: "Back-to-back, limited minutes expected off injury", opponent: "@ DAL", projectedPoints: 22.1 },
  { player: "Tyrese Haliburton", team: "IND", position: "PG", recommendation: "BUY LOW", reason: "Slow start to season but historically heats up post All-Star break", opponent: "vs CHA", projectedPoints: 38.5 },
  { player: "Devin Booker", team: "PHX", position: "SG", recommendation: "SELL HIGH", reason: "Unsustainable shooting splits, regression incoming", opponent: "@ DEN", projectedPoints: 34.2 },
  { player: "Cade Cunningham", team: "DET", position: "PG", recommendation: "STREAM", reason: "Hot streak with 3 straight triple-doubles, great short-term add", opponent: "vs ORL", projectedPoints: 41.8 },
];

// ============ POWER RANKINGS ============
export interface PowerRanking {
  rank: number;
  team: string;
  abbreviation: string;
  previousRank: number;
  record: string;
  blurb: string;
  league: "NBA" | "NFL";
}

export const nbaPowerRankings: PowerRanking[] = [
  { rank: 1, team: "Boston Celtics", abbreviation: "BOS", previousRank: 1, record: "40-13", blurb: "Dominant on both ends. The team to beat.", league: "NBA" },
  { rank: 2, team: "Los Angeles Lakers", abbreviation: "LAL", previousRank: 4, record: "38-15", blurb: "7-game win streak. Chemistry is clicking.", league: "NBA" },
  { rank: 3, team: "Denver Nuggets", abbreviation: "DEN", previousRank: 2, record: "35-18", blurb: "Jokic doing Jokic things. Bench depth a concern.", league: "NBA" },
  { rank: 4, team: "New York Knicks", abbreviation: "NYK", previousRank: 3, record: "36-17", blurb: "Physical brand of basketball winning games.", league: "NBA" },
  { rank: 5, team: "Dallas Mavericks", abbreviation: "DAL", previousRank: 6, record: "33-20", blurb: "Luka in MVP form. Supporting cast stepping up.", league: "NBA" },
];

export const nflPowerRankings: PowerRanking[] = [
  { rank: 1, team: "Kansas City Chiefs", abbreviation: "KC", previousRank: 1, record: "16-3", blurb: "Three-peat within reach. Mahomes in GOAT mode.", league: "NFL" },
  { rank: 2, team: "Detroit Lions", abbreviation: "DET", previousRank: 2, record: "15-4", blurb: "Historic season. Defense carrying the load.", league: "NFL" },
  { rank: 3, team: "Buffalo Bills", abbreviation: "BUF", previousRank: 3, record: "14-5", blurb: "Josh Allen was robbed of MVP. Elite team.", league: "NFL" },
  { rank: 4, team: "San Francisco 49ers", abbreviation: "SF", previousRank: 5, record: "13-6", blurb: "Getting healthy at the right time.", league: "NFL" },
  { rank: 5, team: "Baltimore Ravens", abbreviation: "BAL", previousRank: 4, record: "13-6", blurb: "Lamar is unstoppable when he's on.", league: "NFL" },
];

// ============ TRENDING TOPICS ============
export interface TrendingTopic {
  id: string;
  title: string;
  count: string;
  league: "NBA" | "NFL";
  hot: boolean;
}

export const trendingTopics: TrendingTopic[] = [
  { id: "t1", title: "NBA Trade Deadline", count: "24.5K posts", league: "NBA", hot: true },
  { id: "t2", title: "Super Bowl LX", count: "18.2K posts", league: "NFL", hot: true },
  { id: "t3", title: "MVP Race", count: "12.8K posts", league: "NBA", hot: true },
  { id: "t4", title: "NFL Free Agency", count: "9.4K posts", league: "NFL", hot: false },
  { id: "t5", title: "Rookie of the Year", count: "7.1K posts", league: "NBA", hot: false },
  { id: "t6", title: "NFL Draft 2026", count: "6.3K posts", league: "NFL", hot: false },
];
