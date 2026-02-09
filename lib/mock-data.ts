// ============ ARTICLES ============
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  league: "NBA" | "NFL" | "MLB";
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
  {
    id: "9",
    title: "Opening Day Preview: Yankees vs Red Sox",
    excerpt:
      "Baseball is back! A comprehensive look at the biggest rivalry in sports as they kick off the 2026 season.",
    content: `The 2026 MLB season begins with a bang as the Yankees host the Red Sox in the Bronx. Both teams have retooled significantly in the offseason.\n\nThe Yankees added a big bat to protect their captain in the lineup, while the Red Sox focused on shoreing up their rotation.\n\n"It's always special," said the Yankees ace. "Opening Day, Red Sox, it doesn't get better than this."`,
    author: "David Ortiz",
    date: "Feb 9, 2026",
    league: "MLB",
    featured: true,
    imageUrl: "/placeholder.svg",
    category: "Preview",
    readTime: "5 min read",
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
  league: "NBA" | "NFL" | "MLB";
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
  {
    id: "g9",
    homeTeam: "NYY",
    awayTeam: "BOS",
    homeScore: 5,
    awayScore: 3,
    status: "LIVE",
    quarter: "Bot 7",
    league: "MLB",
    homeRecord: "10-5",
    awayRecord: "8-7",
  },
  {
    id: "g10",
    homeTeam: "LAD",
    awayTeam: "SF",
    homeScore: 2,
    awayScore: 1,
    status: "FINAL",
    league: "MLB",
    homeRecord: "12-3",
    awayRecord: "7-8",
  },
  {
    id: "g11",
    homeTeam: "CHC",
    awayTeam: "STL",
    homeScore: 0,
    awayScore: 0,
    status: "UPCOMING",
    startTime: "2:20 PM ET",
    league: "MLB",
    homeRecord: "9-6",
    awayRecord: "8-7",
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
  division: string;
  league: "NBA" | "NFL" | "MLB";
}

export const nbaStandings: TeamStanding[] = [
  { rank: 1, team: "Boston Celtics", abbreviation: "BOS", wins: 40, losses: 13, pct: ".755", gb: "-", streak: "W5", conference: "East", division: "Atlantic", league: "NBA" },
  { rank: 2, team: "New York Knicks", abbreviation: "NYK", wins: 36, losses: 17, pct: ".679", gb: "4", streak: "W3", conference: "East", division: "Atlantic", league: "NBA" },
  { rank: 3, team: "Philadelphia 76ers", abbreviation: "PHI", wins: 30, losses: 23, pct: ".566", gb: "10", streak: "L1", conference: "East", division: "Atlantic", league: "NBA" },
  { rank: 4, team: "Milwaukee Bucks", abbreviation: "MIL", wins: 34, losses: 19, pct: ".642", gb: "-", streak: "L1", conference: "East", division: "Central", league: "NBA" },
  { rank: 5, team: "Cleveland Cavaliers", abbreviation: "CLE", wins: 34, losses: 20, pct: ".630", gb: "0.5", streak: "W2", conference: "East", division: "Central", league: "NBA" },
  { rank: 6, team: "Indiana Pacers", abbreviation: "IND", wins: 27, losses: 26, pct: ".509", gb: "7", streak: "W1", conference: "East", division: "Central", league: "NBA" },
  { rank: 7, team: "Miami Heat", abbreviation: "MIA", wins: 28, losses: 24, pct: ".538", gb: "-", streak: "L2", conference: "East", division: "Southeast", league: "NBA" },
  { rank: 8, team: "Orlando Magic", abbreviation: "ORL", wins: 26, losses: 26, pct: ".500", gb: "2", streak: "W2", conference: "East", division: "Southeast", league: "NBA" },
  { rank: 9, team: "Atlanta Hawks", abbreviation: "ATL", wins: 23, losses: 29, pct: ".442", gb: "5", streak: "L1", conference: "East", division: "Southeast", league: "NBA" },
  { rank: 10, team: "Los Angeles Lakers", abbreviation: "LAL", wins: 38, losses: 15, pct: ".717", gb: "-", streak: "W7", conference: "West", division: "Pacific", league: "NBA" },
  { rank: 11, team: "Golden State Warriors", abbreviation: "GSW", wins: 32, losses: 20, pct: ".615", gb: "5.5", streak: "W2", conference: "West", division: "Pacific", league: "NBA" },
  { rank: 12, team: "LA Clippers", abbreviation: "LAC", wins: 31, losses: 21, pct: ".596", gb: "6.5", streak: "L1", conference: "West", division: "Pacific", league: "NBA" },
  { rank: 13, team: "Denver Nuggets", abbreviation: "DEN", wins: 35, losses: 18, pct: ".660", gb: "-", streak: "W1", conference: "West", division: "Northwest", league: "NBA" },
  { rank: 14, team: "Oklahoma City Thunder", abbreviation: "OKC", wins: 33, losses: 20, pct: ".623", gb: "2", streak: "W3", conference: "West", division: "Northwest", league: "NBA" },
  { rank: 15, team: "Minnesota Timberwolves", abbreviation: "MIN", wins: 30, losses: 23, pct: ".566", gb: "5", streak: "L2", conference: "West", division: "Northwest", league: "NBA" },
  { rank: 16, team: "Dallas Mavericks", abbreviation: "DAL", wins: 33, losses: 20, pct: ".623", gb: "-", streak: "W1", conference: "West", division: "Southwest", league: "NBA" },
  { rank: 17, team: "Phoenix Suns", abbreviation: "PHX", wins: 30, losses: 22, pct: ".577", gb: "2.5", streak: "L3", conference: "West", division: "Southwest", league: "NBA" },
  { rank: 18, team: "Houston Rockets", abbreviation: "HOU", wins: 25, losses: 28, pct: ".472", gb: "8", streak: "W1", conference: "West", division: "Southwest", league: "NBA" },
];

export const nflStandings: TeamStanding[] = [
  { rank: 1, team: "Buffalo Bills", abbreviation: "BUF", wins: 14, losses: 5, pct: ".737", gb: "-", streak: "W3", conference: "AFC", division: "East", league: "NFL" },
  { rank: 2, team: "Miami Dolphins", abbreviation: "MIA", wins: 11, losses: 8, pct: ".579", gb: "3", streak: "L2", conference: "AFC", division: "East", league: "NFL" },
  { rank: 3, team: "New York Jets", abbreviation: "NYJ", wins: 7, losses: 12, pct: ".368", gb: "7", streak: "L1", conference: "AFC", division: "East", league: "NFL" },
  { rank: 4, team: "Baltimore Ravens", abbreviation: "BAL", wins: 13, losses: 6, pct: ".684", gb: "-", streak: "L1", conference: "AFC", division: "North", league: "NFL" },
  { rank: 5, team: "Pittsburgh Steelers", abbreviation: "PIT", wins: 10, losses: 9, pct: ".526", gb: "3", streak: "W1", conference: "AFC", division: "North", league: "NFL" },
  { rank: 6, team: "Cleveland Browns", abbreviation: "CLE", wins: 9, losses: 10, pct: ".474", gb: "4", streak: "L2", conference: "AFC", division: "North", league: "NFL" },
  { rank: 7, team: "Houston Texans", abbreviation: "HOU", wins: 12, losses: 7, pct: ".632", gb: "-", streak: "W1", conference: "AFC", division: "South", league: "NFL" },
  { rank: 8, team: "Jacksonville Jaguars", abbreviation: "JAX", wins: 8, losses: 11, pct: ".421", gb: "4", streak: "L1", conference: "AFC", division: "South", league: "NFL" },
  { rank: 9, team: "Indianapolis Colts", abbreviation: "IND", wins: 7, losses: 12, pct: ".368", gb: "5", streak: "W1", conference: "AFC", division: "South", league: "NFL" },
  { rank: 10, team: "Kansas City Chiefs", abbreviation: "KC", wins: 16, losses: 3, pct: ".842", gb: "-", streak: "W8", conference: "AFC", division: "West", league: "NFL" },
  { rank: 11, team: "Las Vegas Raiders", abbreviation: "LV", wins: 8, losses: 11, pct: ".421", gb: "8", streak: "L3", conference: "AFC", division: "West", league: "NFL" },
  { rank: 12, team: "Los Angeles Chargers", abbreviation: "LAC", wins: 8, losses: 11, pct: ".421", gb: "8", streak: "W1", conference: "AFC", division: "West", league: "NFL" },
  { rank: 13, team: "Philadelphia Eagles", abbreviation: "PHI", wins: 12, losses: 7, pct: ".632", gb: "-", streak: "W1", conference: "NFC", division: "East", league: "NFL" },
  { rank: 14, team: "Dallas Cowboys", abbreviation: "DAL", wins: 12, losses: 7, pct: ".632", gb: "-", streak: "L1", conference: "NFC", division: "East", league: "NFL" },
  { rank: 15, team: "New York Giants", abbreviation: "NYG", wins: 6, losses: 13, pct: ".316", gb: "6", streak: "L2", conference: "NFC", division: "East", league: "NFL" },
  { rank: 16, team: "Detroit Lions", abbreviation: "DET", wins: 15, losses: 4, pct: ".789", gb: "-", streak: "W5", conference: "NFC", division: "North", league: "NFL" },
  { rank: 17, team: "Green Bay Packers", abbreviation: "GB", wins: 11, losses: 8, pct: ".579", gb: "4", streak: "W3", conference: "NFC", division: "North", league: "NFL" },
  { rank: 18, team: "Minnesota Vikings", abbreviation: "MIN", wins: 9, losses: 10, pct: ".474", gb: "6", streak: "L1", conference: "NFC", division: "North", league: "NFL" },
  { rank: 19, team: "Tampa Bay Buccaneers", abbreviation: "TB", wins: 10, losses: 9, pct: ".526", gb: "-", streak: "W2", conference: "NFC", division: "South", league: "NFL" },
  { rank: 20, team: "Atlanta Falcons", abbreviation: "ATL", wins: 8, losses: 11, pct: ".421", gb: "2", streak: "L1", conference: "NFC", division: "South", league: "NFL" },
  { rank: 21, team: "New Orleans Saints", abbreviation: "NO", wins: 7, losses: 12, pct: ".368", gb: "3", streak: "W1", conference: "NFC", division: "South", league: "NFL" },
  { rank: 22, team: "San Francisco 49ers", abbreviation: "SF", wins: 13, losses: 6, pct: ".684", gb: "-", streak: "W2", conference: "NFC", division: "West", league: "NFL" },
  { rank: 23, team: "Los Angeles Rams", abbreviation: "LAR", wins: 10, losses: 9, pct: ".526", gb: "3", streak: "W1", conference: "NFC", division: "West", league: "NFL" },
  { rank: 24, team: "Seattle Seahawks", abbreviation: "SEA", wins: 9, losses: 10, pct: ".474", gb: "4", streak: "L2", conference: "NFC", division: "West", league: "NFL" },
];

export const mlbStandings: TeamStanding[] = [
  { rank: 1, team: "New York Yankees", abbreviation: "NYY", wins: 10, losses: 5, pct: ".667", gb: "-", streak: "W2", conference: "AL", division: "East", league: "MLB" },
  { rank: 2, team: "Baltimore Orioles", abbreviation: "BAL", wins: 9, losses: 6, pct: ".600", gb: "1", streak: "L1", conference: "AL", division: "East", league: "MLB" },
  { rank: 3, team: "Boston Red Sox", abbreviation: "BOS", wins: 8, losses: 7, pct: ".533", gb: "2", streak: "L2", conference: "AL", division: "East", league: "MLB" },
  { rank: 4, team: "Tampa Bay Rays", abbreviation: "TB", wins: 7, losses: 8, pct: ".467", gb: "3", streak: "W1", conference: "AL", division: "East", league: "MLB" },
  { rank: 5, team: "Toronto Blue Jays", abbreviation: "TOR", wins: 6, losses: 9, pct: ".400", gb: "4", streak: "L3", conference: "AL", division: "East", league: "MLB" },
  { rank: 6, team: "Minnesota Twins", abbreviation: "MIN", wins: 11, losses: 4, pct: ".733", gb: "-", streak: "W3", conference: "AL", division: "Central", league: "MLB" },
  { rank: 7, team: "Cleveland Guardians", abbreviation: "CLE", wins: 9, losses: 6, pct: ".600", gb: "2", streak: "W1", conference: "AL", division: "Central", league: "MLB" },
  { rank: 8, team: "Chicago White Sox", abbreviation: "CHW", wins: 6, losses: 9, pct: ".400", gb: "5", streak: "L2", conference: "AL", division: "Central", league: "MLB" },
  { rank: 9, team: "Houston Astros", abbreviation: "HOU", wins: 10, losses: 5, pct: ".667", gb: "-", streak: "W2", conference: "AL", division: "West", league: "MLB" },
  { rank: 10, team: "Texas Rangers", abbreviation: "TEX", wins: 9, losses: 6, pct: ".600", gb: "1", streak: "W1", conference: "AL", division: "West", league: "MLB" },
  { rank: 11, team: "Seattle Mariners", abbreviation: "SEA", wins: 7, losses: 8, pct: ".467", gb: "3", streak: "L1", conference: "AL", division: "West", league: "MLB" },
  { rank: 12, team: "Los Angeles Dodgers", abbreviation: "LAD", wins: 12, losses: 3, pct: ".800", gb: "-", streak: "W4", conference: "NL", division: "West", league: "MLB" },
  { rank: 13, team: "Arizona Diamondbacks", abbreviation: "ARI", wins: 9, losses: 6, pct: ".600", gb: "3", streak: "W1", conference: "NL", division: "West", league: "MLB" },
  { rank: 14, team: "San Francisco Giants", abbreviation: "SF", wins: 7, losses: 8, pct: ".467", gb: "5", streak: "L1", conference: "NL", division: "West", league: "MLB" },
  { rank: 15, team: "San Diego Padres", abbreviation: "SD", wins: 7, losses: 8, pct: ".467", gb: "5", streak: "W2", conference: "NL", division: "West", league: "MLB" },
  { rank: 16, team: "Colorado Rockies", abbreviation: "COL", wins: 4, losses: 11, pct: ".267", gb: "8", streak: "L4", conference: "NL", division: "West", league: "MLB" },
  { rank: 17, team: "Atlanta Braves", abbreviation: "ATL", wins: 11, losses: 4, pct: ".733", gb: "-", streak: "W3", conference: "NL", division: "East", league: "MLB" },
  { rank: 18, team: "Philadelphia Phillies", abbreviation: "PHI", wins: 9, losses: 6, pct: ".600", gb: "2", streak: "W1", conference: "NL", division: "East", league: "MLB" },
  { rank: 19, team: "New York Mets", abbreviation: "NYM", wins: 7, losses: 8, pct: ".467", gb: "4", streak: "L2", conference: "NL", division: "East", league: "MLB" },
  { rank: 20, team: "Milwaukee Brewers", abbreviation: "MIL", wins: 10, losses: 5, pct: ".667", gb: "-", streak: "W2", conference: "NL", division: "Central", league: "MLB" },
  { rank: 21, team: "Chicago Cubs", abbreviation: "CHC", wins: 8, losses: 7, pct: ".533", gb: "2", streak: "L1", conference: "NL", division: "Central", league: "MLB" },
  { rank: 22, team: "Cincinnati Reds", abbreviation: "CIN", wins: 6, losses: 9, pct: ".400", gb: "4", streak: "W1", conference: "NL", division: "Central", league: "MLB" },
];

// ============ POWER RANKINGS ============
export interface PowerRanking {
  rank: number;
  team: string;
  abbreviation: string;
  record: string;
  lastWeek: number;
  trend: "up" | "down" | "same";
  summary: string;
  league: "NBA" | "NFL" | "MLB";
}

export const nbaPowerRankings: PowerRanking[] = [
  { rank: 1, team: "Boston Celtics", abbreviation: "BOS", record: "40-13", lastWeek: 1, trend: "same", summary: "Dominant on both ends with league-best defense.", league: "NBA" },
  { rank: 2, team: "Los Angeles Lakers", abbreviation: "LAL", record: "38-15", lastWeek: 3, trend: "up", summary: "LeBron and AD firing on all cylinders during 7-game win streak.", league: "NBA" },
  { rank: 3, team: "New York Knicks", abbreviation: "NYK", record: "36-17", lastWeek: 2, trend: "down", summary: "Still elite but showing signs of fatigue in recent games.", league: "NBA" },
  { rank: 4, team: "Denver Nuggets", abbreviation: "DEN", record: "35-18", lastWeek: 5, trend: "up", summary: "Jokic remains unstoppable as the reigning MVP.", league: "NBA" },
  { rank: 5, team: "Milwaukee Bucks", abbreviation: "MIL", record: "34-19", lastWeek: 4, trend: "down", summary: "Giannis doing Giannis things but role players inconsistent.", league: "NBA" },
  { rank: 6, team: "Cleveland Cavaliers", abbreviation: "CLE", record: "34-20", lastWeek: 6, trend: "same", summary: "Balanced attack keeps them in contention.", league: "NBA" },
  { rank: 7, team: "Dallas Mavericks", abbreviation: "DAL", record: "33-20", lastWeek: 9, trend: "up", summary: "Luka's scoring tear has them surging in the West.", league: "NBA" },
  { rank: 8, team: "Golden State Warriors", abbreviation: "GSW", record: "32-20", lastWeek: 7, trend: "down", summary: "Curry still cooking but defense needs work.", league: "NBA" },
  { rank: 9, team: "Phoenix Suns", abbreviation: "PHX", record: "30-22", lastWeek: 8, trend: "down", summary: "Three-game skid raises questions about depth.", league: "NBA" },
  { rank: 10, team: "Miami Heat", abbreviation: "MIA", record: "28-24", lastWeek: 10, trend: "same", summary: "Butler and Bam keep them competitive in the East.", league: "NBA" },
];

export const nflPowerRankings: PowerRanking[] = [
  { rank: 1, team: "Kansas City Chiefs", abbreviation: "KC", record: "16-3", lastWeek: 1, trend: "same", summary: "Mahomes and Reid dynasty continues with 8 straight wins.", league: "NFL" },
  { rank: 2, team: "Detroit Lions", abbreviation: "DET", record: "15-4", lastWeek: 2, trend: "same", summary: "Most complete team in the NFC with elite offense and defense.", league: "NFL" },
  { rank: 3, team: "Buffalo Bills", abbreviation: "BUF", record: "14-5", lastWeek: 4, trend: "up", summary: "Josh Allen playing MVP-caliber football down the stretch.", league: "NFL" },
  { rank: 4, team: "San Francisco 49ers", abbreviation: "SF", record: "13-6", lastWeek: 3, trend: "down", summary: "Injuries piling up but still dangerous playoff contender.", league: "NFL" },
  { rank: 5, team: "Baltimore Ravens", abbreviation: "BAL", record: "13-6", lastWeek: 6, trend: "up", summary: "Lamar Jackson finding his groove at the perfect time.", league: "NFL" },
  { rank: 6, team: "Dallas Cowboys", abbreviation: "DAL", record: "12-7", lastWeek: 5, trend: "down", summary: "Defense regressing; playoff concerns mounting.", league: "NFL" },
  { rank: 7, team: "Philadelphia Eagles", abbreviation: "PHI", record: "12-7", lastWeek: 8, trend: "up", summary: "Jalen Hurts' return has reinvigorated the offense.", league: "NFL" },
  { rank: 8, team: "Houston Texans", abbreviation: "HOU", record: "12-7", lastWeek: 7, trend: "down", summary: "CJ Stroud impressive but lack playoff experience.", league: "NFL" },
  { rank: 9, team: "Green Bay Packers", abbreviation: "GB", record: "11-8", lastWeek: 10, trend: "up", summary: "Young team peaking at the right time.", league: "NFL" },
  { rank: 10, team: "Miami Dolphins", abbreviation: "MIA", record: "11-8", lastWeek: 9, trend: "down", summary: "Cold weather struggles persist heading into playoffs.", league: "NFL" },
];

// ============ POLLS ============
export interface Poll {
  id: string;
  question: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
  league: "NBA" | "NFL" | "MLB";
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
  league: "NBA" | "NFL" | "MLB";
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

// ============ TRENDING TOPICS ============
export interface TrendingTopic {
  id: string;
  title: string;
  count: string;
  league: "NBA" | "NFL" | "MLB";
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

// ============ PLAYER STATS ============
export interface PlayerStatEntry {
  rank: number;
  player: string;
  team: string;
  value: number;
}

export interface StatCategory {
  id: string;
  label: string;
  abbreviation: string;
  leaders: PlayerStatEntry[];
}

export const nbaPlayerStats: StatCategory[] = [
  {
    id: "ppg",
    label: "Points Per Game",
    abbreviation: "PPG",
    leaders: [
      { rank: 1, player: "Luka Doncic", team: "DAL", value: 34.5 },
      { rank: 2, player: "Shai Gilgeous-Alexander", team: "OKC", value: 31.2 },
      { rank: 3, player: "Giannis Antetokounmpo", team: "MIL", value: 30.8 },
      { rank: 4, player: "Joel Embiid", team: "PHI", value: 30.1 },
      { rank: 5, player: "Jayson Tatum", team: "BOS", value: 28.5 },
    ],
  },
  {
    id: "rpg",
    label: "Rebounds Per Game",
    abbreviation: "RPG",
    leaders: [
      { rank: 1, player: "Domantas Sabonis", team: "SAC", value: 13.8 },
      { rank: 2, player: "Rudy Gobert", team: "MIN", value: 12.9 },
      { rank: 3, player: "Nikola Jokic", team: "DEN", value: 12.4 },
      { rank: 4, player: "Anthony Davis", team: "LAL", value: 12.2 },
      { rank: 5, player: "Jalen Duren", team: "DET", value: 11.8 },
    ],
  },
  {
    id: "apg",
    label: "Assists Per Game",
    abbreviation: "APG",
    leaders: [
      { rank: 1, player: "Tyrese Haliburton", team: "IND", value: 11.2 },
      { rank: 2, player: "Trae Young", team: "ATL", value: 10.9 },
      { rank: 3, player: "Luka Doncic", team: "DAL", value: 9.8 },
      { rank: 4, player: "Nikola Jokic", team: "DEN", value: 9.2 },
      { rank: 5, player: "James Harden", team: "LAC", value: 8.5 },
    ],
  },
  {
    id: "3pm",
    label: "3-Pointers Made",
    abbreviation: "3PM",
    leaders: [
      { rank: 1, player: "Stephen Curry", team: "GSW", value: 4.8 },
      { rank: 2, player: "Luka Doncic", team: "DAL", value: 4.1 },
      { rank: 3, player: "Trae Young", team: "ATL", value: 3.5 },
      { rank: 4, player: "Klay Thompson", team: "DAL", value: 3.4 },
      { rank: 5, player: "Donovan Mitchell", team: "CLE", value: 3.3 },
    ],
  },
  {
    id: "bpg",
    label: "Blocks Per Game",
    abbreviation: "BPG",
    leaders: [
      { rank: 1, player: "Victor Wembanyama", team: "SAS", value: 3.4 },
      { rank: 2, player: "Walker Kessler", team: "UTA", value: 2.8 },
      { rank: 3, player: "Chet Holmgren", team: "OKC", value: 2.6 },
      { rank: 4, player: "Brook Lopez", team: "MIL", value: 2.5 },
      { rank: 5, player: "Anthony Davis", team: "LAL", value: 2.4 },
    ],
  },
  {
    id: "spg",
    label: "Steals Per Game",
    abbreviation: "SPG",
    leaders: [
      { rank: 1, player: "Shai Gilgeous-Alexander", team: "OKC", value: 2.1 },
      { rank: 2, player: "De'Aaron Fox", team: "SAC", value: 1.9 },
      { rank: 3, player: "Alex Caruso", team: "CHI", value: 1.8 },
      { rank: 4, player: "Donovan Mitchell", team: "CLE", value: 1.8 },
      { rank: 5, player: "Kawhi Leonard", team: "LAC", value: 1.7 },
    ],
  },
  {
    id: "fg_pct",
    label: "Field Goal %",
    abbreviation: "FG%",
    leaders: [
      { rank: 1, player: "Daniel Gafford", team: "DAL", value: 72.5 },
      { rank: 2, player: "Rudy Gobert", team: "MIN", value: 68.3 },
      { rank: 3, player: "Jarrett Allen", team: "CLE", value: 66.8 },
      { rank: 4, player: "Nic Claxton", team: "BKN", value: 65.4 },
      { rank: 5, player: "Dereck Lively II", team: "DAL", value: 64.9 },
    ],
  },
  {
    id: "3p_pct",
    label: "3-Point %",
    abbreviation: "3P%",
    leaders: [
      { rank: 1, player: "Grayson Allen", team: "PHX", value: 46.1 },
      { rank: 2, player: "Luke Kennard", team: "MEM", value: 45.0 },
      { rank: 3, player: "Mike Conley", team: "MIN", value: 44.2 },
      { rank: 4, player: "CJ McCollum", team: "NOP", value: 43.8 },
      { rank: 5, player: "Norman Powell", team: "LAC", value: 43.5 },
    ],
  },
  {
    id: "ft_pct",
    label: "Free Throw %",
    abbreviation: "FT%",
    leaders: [
      { rank: 1, player: "Stephen Curry", team: "GSW", value: 92.3 },
      { rank: 2, player: "Klay Thompson", team: "DAL", value: 92.1 },
      { rank: 3, player: "Damian Lillard", team: "MIL", value: 91.8 },
      { rank: 4, player: "Kyrie Irving", team: "DAL", value: 90.5 },
      { rank: 5, player: "Tyler Herro", team: "MIA", value: 90.2 },
    ],
  },
  {
    id: "mpg",
    label: "Minutes Per Game",
    abbreviation: "MPG",
    leaders: [
      { rank: 1, player: "DeMar DeRozan", team: "CHI", value: 37.8 },
      { rank: 2, player: "Luka Doncic", team: "DAL", value: 37.5 },
      { rank: 3, player: "Kevin Durant", team: "PHX", value: 37.2 },
      { rank: 4, player: "Tyrese Maxey", team: "PHI", value: 37.0 },
      { rank: 5, player: "Mikal Bridges", team: "BKN", value: 36.8 },
    ],
  },
  {
    id: "gp",
    label: "Games Played",
    abbreviation: "GP",
    leaders: [
      { rank: 1, player: "Harrison Barnes", team: "SAC", value: 58 },
      { rank: 2, player: "Jonas Valanciunas", team: "NOP", value: 58 },
      { rank: 3, player: "Austin Reaves", team: "LAL", value: 58 },
      { rank: 4, player: "Mikal Bridges", team: "BKN", value: 57 },
      { rank: 5, player: "Domantas Sabonis", team: "SAC", value: 57 },
    ],
  },
  {
    id: "pf",
    label: "Fouls Per Game",
    abbreviation: "PF",
    leaders: [
      { rank: 1, player: "Jaren Jackson Jr.", team: "MEM", value: 3.6 },
      { rank: 2, player: "Karl-Anthony Towns", team: "MIN", value: 3.4 },
      { rank: 3, player: "Dillon Brooks", team: "HOU", value: 3.3 },
      { rank: 4, player: "Jaylen Brown", team: "BOS", value: 3.2 },
      { rank: 5, player: "Alperen Sengun", team: "HOU", value: 3.1 },
    ],
  },
  {
    id: "tov",
    label: "Turnovers",
    abbreviation: "TOV",
    leaders: [
      { rank: 1, player: "Trae Young", team: "ATL", value: 4.4 },
      { rank: 2, player: "Luka Doncic", team: "DAL", value: 4.0 },
      { rank: 3, player: "Giannis Antetokounmpo", team: "MIL", value: 3.6 },
      { rank: 4, player: "Cade Cunningham", team: "DET", value: 3.5 },
      { rank: 5, player: "Domantas Sabonis", team: "SAC", value: 3.4 },
    ],
  },
  {
    id: "ast_to",
    label: "AST/TO Ratio",
    abbreviation: "AST/TO",
    leaders: [
      { rank: 1, player: "Tyus Jones", team: "WAS", value: 7.3 },
      { rank: 2, player: "Mike Conley", team: "MIN", value: 6.2 },
      { rank: 3, player: "Chris Paul", team: "GSW", value: 5.8 },
      { rank: 4, player: "Fred VanVleet", team: "HOU", value: 4.5 },
      { rank: 5, player: "Tyrese Haliburton", team: "IND", value: 4.1 },
    ],
  },
  {
    id: "oreb",
    label: "Offensive Rebounds",
    abbreviation: "OREB",
    leaders: [
      { rank: 1, player: "Clint Capela", team: "ATL", value: 4.6 },
      { rank: 2, player: "Mitchell Robinson", team: "NYK", value: 4.5 },
      { rank: 3, player: "Jalen Duren", team: "DET", value: 4.2 },
      { rank: 4, player: "Andre Drummond", team: "CHI", value: 4.0 },
      { rank: 5, player: "Rudy Gobert", team: "MIN", value: 3.8 },
    ],
  },
  {
    id: "dreb",
    label: "Defensive Rebounds",
    abbreviation: "DREB",
    leaders: [
      { rank: 1, player: "Domantas Sabonis", team: "SAC", value: 10.2 },
      { rank: 2, player: "Nikola Jokic", team: "DEN", value: 9.8 },
      { rank: 3, player: "Anthony Davis", team: "LAL", value: 9.5 },
      { rank: 4, player: "Rudy Gobert", team: "MIN", value: 9.1 },
      { rank: 5, player: "Giannis Antetokounmpo", team: "MIL", value: 8.8 },
    ],
  },
];

export const nflPlayerStats: StatCategory[] = [
  {
    id: "pass_yds",
    label: "Passing Yards",
    abbreviation: "PASS YDS",
    leaders: [
      { rank: 1, player: "Tua Tagovailoa", team: "MIA", value: 4624 },
      { rank: 2, player: "Dak Prescott", team: "DAL", value: 4516 },
      { rank: 3, player: "Jordan Love", team: "GB", value: 4159 },
      { rank: 4, player: "Baker Mayfield", team: "TB", value: 4044 },
      { rank: 5, player: "Jared Goff", team: "DET", value: 3934 },
    ],
  },
  {
    id: "qbr",
    label: "Quarterback Rating",
    abbreviation: "QBR",
    leaders: [
      { rank: 1, player: "Brock Purdy", team: "SF", value: 113.0 },
      { rank: 2, player: "Dak Prescott", team: "DAL", value: 105.9 },
      { rank: 3, player: "Lamar Jackson", team: "BAL", value: 102.7 },
      { rank: 4, player: "Jared Goff", team: "DET", value: 97.1 },
      { rank: 5, player: "Tua Tagovailoa", team: "MIA", value: 101.5 },
    ],
  },
  {
    id: "rush_yds",
    label: "Rushing Yards",
    abbreviation: "RUSH YDS",
    leaders: [
      { rank: 1, player: "Christian McCaffrey", team: "SF", value: 1459 },
      { rank: 2, player: "Kyren Williams", team: "LAR", value: 1144 },
      { rank: 3, player: "Raheem Mostert", team: "MIA", value: 1012 },
      { rank: 4, player: "Derrick Henry", team: "BAL", value: 1325 },
      { rank: 5, player: "De'Von Achane", team: "MIA", value: 800 },
    ],
  },
  {
    id: "tackles",
    label: "Total Tackles",
    abbreviation: "TACKLES",
    leaders: [
      { rank: 1, player: "Bobby Okereke", team: "NYG", value: 149 },
      { rank: 2, player: "Zaire Franklin", team: "IND", value: 145 },
      { rank: 3, player: "Foyesade Oluokun", team: "JAX", value: 144 },
      { rank: 4, player: "Roquan Smith", team: "BAL", value: 158 },
      { rank: 5, player: "Fred Warner", team: "SF", value: 132 },
    ],
  },
  {
    id: "sacks",
    label: "Sacks",
    abbreviation: "SACKS",
    leaders: [
      { rank: 1, player: "T.J. Watt", team: "PIT", value: 19.0 },
      { rank: 2, player: "Myles Garrett", team: "CLE", value: 14.0 },
      { rank: 3, player: "Danielle Hunter", team: "HOU", value: 12.5 },
      { rank: 4, player: "Maxx Crosby", team: "LV", value: 14.5 },
      { rank: 5, player: "Micah Parsons", team: "DAL", value: 14.0 },
    ],
  },
  {
    id: "interceptions",
    label: "Interceptions",
    abbreviation: "INT",
    leaders: [
      { rank: 1, player: "DaRon Bland", team: "DAL", value: 9 },
      { rank: 2, player: "Brian Branch", team: "DET", value: 6 },
      { rank: 3, player: "Kyle Hamilton", team: "BAL", value: 4 },
      { rank: 4, player: "C.J. Gardner-Johnson", team: "DET", value: 6 },
      { rank: 5, player: "Xavier McKinney", team: "GB", value: 8 },
    ],
  },
];
export const mlbPlayerStats: StatCategory[] = [
  {
    id: "runs",
    label: "Runs",
    abbreviation: "R",
    leaders: [
      { rank: 1, player: "Ronald Acuña Jr.", team: "ATL", value: 149 },
      { rank: 2, player: "Mookie Betts", team: "LAD", value: 122 },
      { rank: 3, player: "Corey Seager", team: "TEX", value: 119 },
      { rank: 4, player: "Marcus Semien", team: "TEX", value: 122 },
      { rank: 5, player: "Freddie Freeman", team: "LAD", value: 106 },
    ],
  },
  {
    id: "hits",
    label: "Hits",
    abbreviation: "H",
    leaders: [
      { rank: 1, player: "Luis Arraez", team: "MIA", value: 200 },
      { rank: 2, player: "Ronald Acuña Jr.", team: "ATL", value: 217 },
      { rank: 3, player: "Freddie Freeman", team: "LAD", value: 197 },
      { rank: 4, player: "Corey Seager", team: "TEX", value: 191 },
      { rank: 5, player: "Marcus Semien", team: "TEX", value: 194 },
    ],
  },
  {
    id: "home_runs",
    label: "Home Runs",
    abbreviation: "HR",
    leaders: [
      { rank: 1, player: "Matt Olson", team: "ATL", value: 54 },
      { rank: 2, player: "Kyle Schwarber", team: "PHI", value: 47 },
      { rank: 3, player: "Mookie Betts", team: "LAD", value: 39 },
      { rank: 4, player: "Aaron Judge", team: "NYY", value: 37 },
      { rank: 5, player: "Pete Alonso", team: "NYM", value: 46 },
    ],
  },
  {
    id: "rbi",
    label: "Runs Batted In",
    abbreviation: "RBI",
    leaders: [
      { rank: 1, player: "Matt Olson", team: "ATL", value: 139 },
      { rank: 2, player: "Kyle Schwarber", team: "PHI", value: 104 },
      { rank: 3, player: "Mookie Betts", team: "LAD", value: 107 },
      { rank: 4, player: "Corey Seager", team: "TEX", value: 102 },
      { rank: 5, player: "Pete Alonso", team: "NYM", value: 118 },
    ],
  },
  {
    id: "stolen_bases",
    label: "Stolen Bases",
    abbreviation: "SB",
    leaders: [
      { rank: 1, player: "Ronald Acuña Jr.", team: "ATL", value: 73 },
      { rank: 2, player: "Esteury Ruiz", team: "OAK", value: 67 },
      { rank: 3, player: "Corbin Carroll", team: "ARI", value: 54 },
      { rank: 4, player: "Elly De La Cruz", team: "CIN", value: 35 },
      { rank: 5, player: "Bobby Witt Jr.", team: "KC", value: 49 },
    ],
  },
  {
    id: "batting_avg",
    label: "Batting Average",
    abbreviation: "AVG",
    leaders: [
      { rank: 1, player: "Luis Arraez", team: "MIA", value: 0.354 },
      { rank: 2, player: "Ronald Acuña Jr.", team: "ATL", value: 0.337 },
      { rank: 3, player: "Freddie Freeman", team: "LAD", value: 0.331 },
      { rank: 4, player: "Yandy Díaz", team: "TB", value: 0.330 },
      { rank: 5, player: "Corey Seager", team: "TEX", value: 0.327 },
    ],
  },
  {
    id: "wins",
    label: "Wins",
    abbreviation: "W",
    leaders: [
      { rank: 1, player: "Spencer Strider", team: "ATL", value: 20 },
      { rank: 2, player: "Gerrit Cole", team: "NYY", value: 15 },
      { rank: 3, player: "Blake Snell", team: "SD", value: 14 },
      { rank: 4, player: "Zack Wheeler", team: "PHI", value: 13 },
      { rank: 5, player: "Kevin Gausman", team: "TOR", value: 13 },
    ],
  },
  {
    id: "losses",
    label: "Losses",
    abbreviation: "L",
    leaders: [
      { rank: 1, player: "Patrick Corbin", team: "WSH", value: 16 },
      { rank: 2, player: "Zack Greinke", team: "KC", value: 15 },
      { rank: 3, player: "Kyle Gibson", team: "BAL", value: 14 },
      { rank: 4, player: "Jordan Lyles", team: "KC", value: 14 },
      { rank: 5, player: "Zach Eflin", team: "TB", value: 13 },
    ],
  },
  {
    id: "era",
    label: "Earned Run Average",
    abbreviation: "ERA",
    leaders: [
      { rank: 1, player: "Blake Snell", team: "SD", value: 2.25 },
      { rank: 2, player: "Zack Wheeler", team: "PHI", value: 3.61 },
      { rank: 3, player: "Spencer Strider", team: "ATL", value: 3.86 },
      { rank: 4, player: "Gerrit Cole", team: "NYY", value: 2.63 },
      { rank: 5, player: "Kevin Gausman", team: "TOR", value: 3.16 },
    ],
  },
  {
    id: "games",
    label: "Games Pitched",
    abbreviation: "G",
    leaders: [
      { rank: 1, player: "Ryan Thompson", team: "TB", value: 73 },
      { rank: 2, player: "Andrew Kittredge", team: "TB", value: 72 },
      { rank: 3, player: "Phil Maton", team: "HOU", value: 71 },
      { rank: 4, player: "Brent Suter", team: "MIL", value: 70 },
      { rank: 5, player: "Yimi García", team: "TOR", value: 69 },
    ],
  },
  {
    id: "games_started",
    label: "Games Started",
    abbreviation: "GS",
    leaders: [
      { rank: 1, player: "Zack Wheeler", team: "PHI", value: 32 },
      { rank: 2, player: "Kevin Gausman", team: "TOR", value: 33 },
      { rank: 3, player: "Logan Webb", team: "SF", value: 33 },
      { rank: 4, player: "Kyle Gibson", team: "BAL", value: 32 },
      { rank: 5, player: "Gerrit Cole", team: "NYY", value: 33 },
    ],
  },
  {
    id: "complete_games",
    label: "Complete Games",
    abbreviation: "CG",
    leaders: [
      { rank: 1, player: "Logan Webb", team: "SF", value: 3 },
      { rank: 2, player: "Zack Wheeler", team: "PHI", value: 2 },
      { rank: 3, player: "Gerrit Cole", team: "NYY", value: 2 },
      { rank: 4, player: "Blake Snell", team: "SD", value: 1 },
      { rank: 5, player: "Spencer Strider", team: "ATL", value: 1 },
    ],
  },
  {
    id: "shutouts",
    label: "Shutouts",
    abbreviation: "SHO",
    leaders: [
      { rank: 1, player: "Logan Webb", team: "SF", value: 2 },
      { rank: 2, player: "Zack Wheeler", team: "PHI", value: 1 },
      { rank: 3, player: "Gerrit Cole", team: "NYY", value: 1 },
      { rank: 4, player: "Blake Snell", team: "SD", value: 1 },
      { rank: 5, player: "Dylan Cease", team: "CHW", value: 1 },
    ],
  },
  {
    id: "saves",
    label: "Saves",
    abbreviation: "SV",
    leaders: [
      { rank: 1, player: "Félix Bautista", team: "BAL", value: 33 },
      { rank: 2, player: "Evan Phillips", team: "LAD", value: 31 },
      { rank: 3, player: "Emmanuel Clase", team: "CLE", value: 42 },
      { rank: 4, player: "Edwin Díaz", team: "NYM", value: 23 },
      { rank: 5, player: "Jhoan Duran", team: "MIN", value: 22 },
    ],
  },
  {
    id: "save_opportunities",
    label: "Save Opportunities",
    abbreviation: "SVO",
    leaders: [
      { rank: 1, player: "Emmanuel Clase", team: "CLE", value: 45 },
      { rank: 2, player: "Félix Bautista", team: "BAL", value: 37 },
      { rank: 3, player: "Evan Phillips", team: "LAD", value: 36 },
      { rank: 4, player: "Camilo Doval", team: "SF", value: 33 },
      { rank: 5, player: "Edwin Díaz", team: "NYM", value: 25 },
    ],
  },
  {
    id: "innings_pitched",
    label: "Innings Pitched",
    abbreviation: "IP",
    leaders: [
      { rank: 1, player: "Zack Wheeler", team: "PHI", value: 212.0 },
      { rank: 2, player: "Kevin Gausman", team: "TOR", value: 212.0 },
      { rank: 3, player: "Gerrit Cole", team: "NYY", value: 209.0 },
      { rank: 4, player: "Framber Valdez", team: "HOU", value: 201.1 },
      { rank: 5, player: "Spencer Strider", team: "ATL", value: 186.2 },
    ],
  },
  {
    id: "hits_allowed",
    label: "Hits Allowed",
    abbreviation: "H",
    leaders: [
      { rank: 1, player: "Patrick Corbin", team: "WSH", value: 214 },
      { rank: 2, player: "Kyle Gibson", team: "BAL", value: 202 },
      { rank: 3, player: "Jordan Lyles", team: "KC", value: 198 },
      { rank: 4, player: "Zack Greinke", team: "KC", value: 191 },
      { rank: 5, player: "Logan Webb", team: "SF", value: 186 },
    ],
  },
  {
    id: "runs_allowed",
    label: "Runs Allowed",
    abbreviation: "R",
    leaders: [
      { rank: 1, player: "Patrick Corbin", team: "WSH", value: 118 },
      { rank: 2, player: "Kyle Gibson", team: "BAL", value: 110 },
      { rank: 3, player: "Jordan Lyles", team: "KC", value: 108 },
      { rank: 4, player: "Zack Greinke", team: "KC", value: 102 },
      { rank: 5, player: "José Berríos", team: "TOR", value: 97 },
    ],
  },
  {
    id: "earned_runs",
    label: "Earned Runs",
    abbreviation: "ER",
    leaders: [
      { rank: 1, player: "Patrick Corbin", team: "WSH", value: 113 },
      { rank: 2, player: "Kyle Gibson", team: "BAL", value: 105 },
      { rank: 3, player: "Jordan Lyles", team: "KC", value: 102 },
      { rank: 4, player: "Zack Greinke", team: "KC", value: 95 },
      { rank: 5, player: "José Berríos", team: "TOR", value: 92 },
    ],
  },
  {
    id: "home_runs_allowed",
    label: "Home Runs Allowed",
    abbreviation: "HR",
    leaders: [
      { rank: 1, player: "Patrick Corbin", team: "WSH", value: 35 },
      { rank: 2, player: "Jordan Lyles", team: "KC", value: 33 },
      { rank: 3, player: "Kyle Gibson", team: "BAL", value: 31 },
      { rank: 4, player: "Zack Greinke", team: "KC", value: 28 },
      { rank: 5, player: "Logan Webb", team: "SF", value: 26 },
    ],
  },
  {
    id: "hit_by_pitch",
    label: "Hit By Pitch",
    abbreviation: "HB",
    leaders: [
      { rank: 1, player: "Aaron Nola", team: "PHI", value: 15 },
      { rank: 2, player: "Tyler Glasnow", team: "TB", value: 13 },
      { rank: 3, player: "Logan Gilbert", team: "SEA", value: 12 },
      { rank: 4, player: "Zack Wheeler", team: "PHI", value: 11 },
      { rank: 5, player: "Freddy Peralta", team: "MIL", value: 11 },
    ],
  },
  {
    id: "walks",
    label: "Walks",
    abbreviation: "BB",
    leaders: [
      { rank: 1, player: "Patrick Corbin", team: "WSH", value: 74 },
      { rank: 2, player: "Freddy Peralta", team: "MIL", value: 73 },
      { rank: 3, player: "Tyler Glasnow", team: "TB", value: 71 },
      { rank: 4, player: "Spencer Strider", team: "ATL", value: 69 },
      { rank: 5, player: "Jordan Lyles", team: "KC", value: 68 },
    ],
  },
  {
    id: "strikeouts",
    label: "Strikeouts",
    abbreviation: "K",
    leaders: [
      { rank: 1, player: "Spencer Strider", team: "ATL", value: 281 },
      { rank: 2, player: "Kevin Gausman", team: "TOR", value: 237 },
      { rank: 3, player: "Blake Snell", team: "SD", value: 234 },
      { rank: 4, player: "Gerrit Cole", team: "NYY", value: 222 },
      { rank: 5, player: "Zack Wheeler", team: "PHI", value: 212 },
    ],
  },
  {
    id: "whip",
    label: "Walks + Hits Per IP",
    abbreviation: "WHIP",
    leaders: [
      { rank: 1, player: "Blake Snell", team: "SD", value: 1.19 },
      { rank: 2, player: "Spencer Strider", team: "ATL", value: 1.08 },
      { rank: 3, player: "Gerrit Cole", team: "NYY", value: 0.98 },
      { rank: 4, player: "Kevin Gausman", team: "TOR", value: 1.22 },
      { rank: 5, player: "Zack Wheeler", team: "PHI", value: 1.07 },
    ],
  },
  {
    id: "opp_batting_avg",
    label: "Opponent Batting Avg",
    abbreviation: "AVG",
    leaders: [
      { rank: 1, player: "Blake Snell", team: "SD", value: 0.180 },
      { rank: 2, player: "Spencer Strider", team: "ATL", value: 0.192 },
      { rank: 3, player: "Gerrit Cole", team: "NYY", value: 0.201 },
      { rank: 4, player: "Kevin Gausman", team: "TOR", value: 0.217 },
      { rank: 5, player: "Zack Wheeler", team: "PHI", value: 0.223 },
    ],
  },
];
