import 'dotenv/config';
import { PrismaClient } from '../lib/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const nbaTeams = [
  // Eastern Conference - Atlantic Division
  {
    name: 'Boston Celtics',
    city: 'Boston',
    abbreviation: 'BOS',
    conference: 'Eastern',
    division: 'Atlantic',
    primaryColor: '#007A33',
    secondaryColor: '#BA9653',
  },
  {
    name: 'Brooklyn Nets',
    city: 'Brooklyn',
    abbreviation: 'BKN',
    conference: 'Eastern',
    division: 'Atlantic',
    primaryColor: '#000000',
    secondaryColor: '#FFFFFF',
  },
  {
    name: 'New York Knicks',
    city: 'New York',
    abbreviation: 'NYK',
    conference: 'Eastern',
    division: 'Atlantic',
    primaryColor: '#006BB6',
    secondaryColor: '#F58426',
  },
  {
    name: 'Philadelphia 76ers',
    city: 'Philadelphia',
    abbreviation: 'PHI',
    conference: 'Eastern',
    division: 'Atlantic',
    primaryColor: '#006BB6',
    secondaryColor: '#ED174C',
  },
  {
    name: 'Toronto Raptors',
    city: 'Toronto',
    abbreviation: 'TOR',
    conference: 'Eastern',
    division: 'Atlantic',
    primaryColor: '#CE1141',
    secondaryColor: '#000000',
  },
  
  // Eastern Conference - Central Division
  {
    name: 'Chicago Bulls',
    city: 'Chicago',
    abbreviation: 'CHI',
    conference: 'Eastern',
    division: 'Central',
    primaryColor: '#CE1141',
    secondaryColor: '#000000',
  },
  {
    name: 'Cleveland Cavaliers',
    city: 'Cleveland',
    abbreviation: 'CLE',
    conference: 'Eastern',
    division: 'Central',
    primaryColor: '#860038',
    secondaryColor: '#FDBB30',
  },
  {
    name: 'Detroit Pistons',
    city: 'Detroit',
    abbreviation: 'DET',
    conference: 'Eastern',
    division: 'Central',
    primaryColor: '#C8102E',
    secondaryColor: '#1D42BA',
  },
  {
    name: 'Indiana Pacers',
    city: 'Indiana',
    abbreviation: 'IND',
    conference: 'Eastern',
    division: 'Central',
    primaryColor: '#002D62',
    secondaryColor: '#FDBB30',
  },
  {
    name: 'Milwaukee Bucks',
    city: 'Milwaukee',
    abbreviation: 'MIL',
    conference: 'Eastern',
    division: 'Central',
    primaryColor: '#00471B',
    secondaryColor: '#EEE1C6',
  },
  
  // Eastern Conference - Southeast Division
  {
    name: 'Atlanta Hawks',
    city: 'Atlanta',
    abbreviation: 'ATL',
    conference: 'Eastern',
    division: 'Southeast',
    primaryColor: '#E03A3E',
    secondaryColor: '#C1D32F',
  },
  {
    name: 'Charlotte Hornets',
    city: 'Charlotte',
    abbreviation: 'CHA',
    conference: 'Eastern',
    division: 'Southeast',
    primaryColor: '#1D1160',
    secondaryColor: '#00788C',
  },
  {
    name: 'Miami Heat',
    city: 'Miami',
    abbreviation: 'MIA',
    conference: 'Eastern',
    division: 'Southeast',
    primaryColor: '#98002E',
    secondaryColor: '#F9A01B',
  },
  {
    name: 'Orlando Magic',
    city: 'Orlando',
    abbreviation: 'ORL',
    conference: 'Eastern',
    division: 'Southeast',
    primaryColor: '#0077C0',
    secondaryColor: '#C4CED4',
  },
  {
    name: 'Washington Wizards',
    city: 'Washington',
    abbreviation: 'WAS',
    conference: 'Eastern',
    division: 'Southeast',
    primaryColor: '#002B5C',
    secondaryColor: '#E31837',
  },
  
  // Western Conference - Northwest Division
  {
    name: 'Denver Nuggets',
    city: 'Denver',
    abbreviation: 'DEN',
    conference: 'Western',
    division: 'Northwest',
    primaryColor: '#0E2240',
    secondaryColor: '#FEC524',
  },
  {
    name: 'Minnesota Timberwolves',
    city: 'Minnesota',
    abbreviation: 'MIN',
    conference: 'Western',
    division: 'Northwest',
    primaryColor: '#0C2340',
    secondaryColor: '#236192',
  },
  {
    name: 'Oklahoma City Thunder',
    city: 'Oklahoma City',
    abbreviation: 'OKC',
    conference: 'Western',
    division: 'Northwest',
    primaryColor: '#007AC1',
    secondaryColor: '#EF3B24',
  },
  {
    name: 'Portland Trail Blazers',
    city: 'Portland',
    abbreviation: 'POR',
    conference: 'Western',
    division: 'Northwest',
    primaryColor: '#E03A3E',
    secondaryColor: '#000000',
  },
  {
    name: 'Utah Jazz',
    city: 'Utah',
    abbreviation: 'UTA',
    conference: 'Western',
    division: 'Northwest',
    primaryColor: '#002B5C',
    secondaryColor: '#00471B',
  },
  
  // Western Conference - Pacific Division
  {
    name: 'Golden State Warriors',
    city: 'Golden State',
    abbreviation: 'GSW',
    conference: 'Western',
    division: 'Pacific',
    primaryColor: '#1D428A',
    secondaryColor: '#FFC72C',
  },
  {
    name: 'LA Clippers',
    city: 'Los Angeles',
    abbreviation: 'LAC',
    conference: 'Western',
    division: 'Pacific',
    primaryColor: '#C8102E',
    secondaryColor: '#1D428A',
  },
  {
    name: 'Los Angeles Lakers',
    city: 'Los Angeles',
    abbreviation: 'LAL',
    conference: 'Western',
    division: 'Pacific',
    primaryColor: '#552583',
    secondaryColor: '#FDB927',
  },
  {
    name: 'Phoenix Suns',
    city: 'Phoenix',
    abbreviation: 'PHX',
    conference: 'Western',
    division: 'Pacific',
    primaryColor: '#1D1160',
    secondaryColor: '#E56020',
  },
  {
    name: 'Sacramento Kings',
    city: 'Sacramento',
    abbreviation: 'SAC',
    conference: 'Western',
    division: 'Pacific',
    primaryColor: '#5A2D81',
    secondaryColor: '#63727A',
  },
  
  // Western Conference - Southwest Division
  {
    name: 'Dallas Mavericks',
    city: 'Dallas',
    abbreviation: 'DAL',
    conference: 'Western',
    division: 'Southwest',
    primaryColor: '#00538C',
    secondaryColor: '#002B5E',
  },
  {
    name: 'Houston Rockets',
    city: 'Houston',
    abbreviation: 'HOU',
    conference: 'Western',
    division: 'Southwest',
    primaryColor: '#CE1141',
    secondaryColor: '#000000',
  },
  {
    name: 'Memphis Grizzlies',
    city: 'Memphis',
    abbreviation: 'MEM',
    conference: 'Western',
    division: 'Southwest',
    primaryColor: '#5D76A9',
    secondaryColor: '#12173F',
  },
  {
    name: 'New Orleans Pelicans',
    city: 'New Orleans',
    abbreviation: 'NOP',
    conference: 'Western',
    division: 'Southwest',
    primaryColor: '#0C2340',
    secondaryColor: '#C8102E',
  },
  {
    name: 'San Antonio Spurs',
    city: 'San Antonio',
    abbreviation: 'SAS',
    conference: 'Western',
    division: 'Southwest',
    primaryColor: '#C4CED4',
    secondaryColor: '#000000',
  },
];

const mlbTeams = [
  // American League - East Division
  {
    name: 'New York Yankees',
    city: 'New York',
    abbreviation: 'NYY',
    league: 'American',
    division: 'East',
    primaryColor: '#003087',
    secondaryColor: '#E4002C',
  },
  {
    name: 'Boston Red Sox',
    city: 'Boston',
    abbreviation: 'BOS',
    league: 'American',
    division: 'East',
    primaryColor: '#BD3039',
    secondaryColor: '#0C2340',
  },
  {
    name: 'Toronto Blue Jays',
    city: 'Toronto',
    abbreviation: 'TOR',
    league: 'American',
    division: 'East',
    primaryColor: '#134A8E',
    secondaryColor: '#1D2D5C',
  },
  {
    name: 'Tampa Bay Rays',
    city: 'Tampa Bay',
    abbreviation: 'TB',
    league: 'American',
    division: 'East',
    primaryColor: '#092C5C',
    secondaryColor: '#8FBCE6',
  },
  {
    name: 'Baltimore Orioles',
    city: 'Baltimore',
    abbreviation: 'BAL',
    league: 'American',
    division: 'East',
    primaryColor: '#DF4601',
    secondaryColor: '#000000',
  },

  // American League - Central Division
  {
    name: 'Chicago White Sox',
    city: 'Chicago',
    abbreviation: 'CWS',
    league: 'American',
    division: 'Central',
    primaryColor: '#27251F',
    secondaryColor: '#C4CED4',
  },
  {
    name: 'Cleveland Guardians',
    city: 'Cleveland',
    abbreviation: 'CLE',
    league: 'American',
    division: 'Central',
    primaryColor: '#00385D',
    secondaryColor: '#E31937',
  },
  {
    name: 'Detroit Tigers',
    city: 'Detroit',
    abbreviation: 'DET',
    league: 'American',
    division: 'Central',
    primaryColor: '#0C2340',
    secondaryColor: '#FA4616',
  },
  {
    name: 'Kansas City Royals',
    city: 'Kansas City',
    abbreviation: 'KC',
    league: 'American',
    division: 'Central',
    primaryColor: '#004687',
    secondaryColor: '#BD9B60',
  },
  {
    name: 'Minnesota Twins',
    city: 'Minnesota',
    abbreviation: 'MIN',
    league: 'American',
    division: 'Central',
    primaryColor: '#002B5C',
    secondaryColor: '#D31145',
  },

  // American League - West Division
  {
    name: 'Houston Astros',
    city: 'Houston',
    abbreviation: 'HOU',
    league: 'American',
    division: 'West',
    primaryColor: '#002D62',
    secondaryColor: '#EB6E1F',
  },
  {
    name: 'Los Angeles Angels',
    city: 'Los Angeles',
    abbreviation: 'LAA',
    league: 'American',
    division: 'West',
    primaryColor: '#BA0021',
    secondaryColor: '#003263',
  },
  {
    name: 'Athletics',
    city: 'Sacramento',
    abbreviation: 'ATH',
    league: 'American',
    division: 'West',
    primaryColor: '#003831',
    secondaryColor: '#EFB21E',
  },
  {
    name: 'Seattle Mariners',
    city: 'Seattle',
    abbreviation: 'SEA',
    league: 'American',
    division: 'West',
    primaryColor: '#0C2C56',
    secondaryColor: '#005C5C',
  },
  {
    name: 'Texas Rangers',
    city: 'Texas',
    abbreviation: 'TEX',
    league: 'American',
    division: 'West',
    primaryColor: '#003278',
    secondaryColor: '#C0111F',
  },

  // National League - East Division
  {
    name: 'New York Mets',
    city: 'New York',
    abbreviation: 'NYM',
    league: 'National',
    division: 'East',
    primaryColor: '#002D72',
    secondaryColor: '#FF5910',
  },
  {
    name: 'Philadelphia Phillies',
    city: 'Philadelphia',
    abbreviation: 'PHI',
    league: 'National',
    division: 'East',
    primaryColor: '#E81828',
    secondaryColor: '#002D72',
  },
  {
    name: 'Atlanta Braves',
    city: 'Atlanta',
    abbreviation: 'ATL',
    league: 'National',
    division: 'East',
    primaryColor: '#CE1141',
    secondaryColor: '#13274F',
  },
  {
    name: 'Miami Marlins',
    city: 'Miami',
    abbreviation: 'MIA',
    league: 'National',
    division: 'East',
    primaryColor: '#00A3E0',
    secondaryColor: '#EF3340',
  },
  {
    name: 'Washington Nationals',
    city: 'Washington',
    abbreviation: 'WSH',
    league: 'National',
    division: 'East',
    primaryColor: '#AB0003',
    secondaryColor: '#14225A',
  },

  // National League - Central Division
  {
    name: 'Chicago Cubs',
    city: 'Chicago',
    abbreviation: 'CHC',
    league: 'National',
    division: 'Central',
    primaryColor: '#0E3386',
    secondaryColor: '#CC3433',
  },
  {
    name: 'Milwaukee Brewers',
    city: 'Milwaukee',
    abbreviation: 'MIL',
    league: 'National',
    division: 'Central',
    primaryColor: '#12284B',
    secondaryColor: '#FFC52F',
  },
  {
    name: 'St. Louis Cardinals',
    city: 'St. Louis',
    abbreviation: 'STL',
    league: 'National',
    division: 'Central',
    primaryColor: '#C41E3A',
    secondaryColor: '#FEDB00',
  },
  {
    name: 'Cincinnati Reds',
    city: 'Cincinnati',
    abbreviation: 'CIN',
    league: 'National',
    division: 'Central',
    primaryColor: '#C6011F',
    secondaryColor: '#000000',
  },
  {
    name: 'Pittsburgh Pirates',
    city: 'Pittsburgh',
    abbreviation: 'PIT',
    league: 'National',
    division: 'Central',
    primaryColor: '#27251F',
    secondaryColor: '#FDB827',
  },

  // National League - West Division
  {
    name: 'Los Angeles Dodgers',
    city: 'Los Angeles',
    abbreviation: 'LAD',
    league: 'National',
    division: 'West',
    primaryColor: '#005A9C',
    secondaryColor: '#EF3E42',
  },
  {
    name: 'San Francisco Giants',
    city: 'San Francisco',
    abbreviation: 'SF',
    league: 'National',
    division: 'West',
    primaryColor: '#FD5A1E',
    secondaryColor: '#27251F',
  },
  {
    name: 'San Diego Padres',
    city: 'San Diego',
    abbreviation: 'SD',
    league: 'National',
    division: 'West',
    primaryColor: '#2F241D',
    secondaryColor: '#FFC425',
  },
  {
    name: 'Arizona Diamondbacks',
    city: 'Arizona',
    abbreviation: 'ARI',
    league: 'National',
    division: 'West',
    primaryColor: '#A71930',
    secondaryColor: '#E3D4AD',
  },
  {
    name: 'Colorado Rockies',
    city: 'Colorado',
    abbreviation: 'COL',
    league: 'National',
    division: 'West',
    primaryColor: '#33006F',
    secondaryColor: '#C4CED4',
  },
];

const nflTeams = [
  // AFC - East Division
  {
    name: 'Buffalo Bills',
    city: 'Buffalo',
    abbreviation: 'BUF',
    conference: 'AFC',
    division: 'East',
    primaryColor: '#00338D',
    secondaryColor: '#C60C30',
  },
  {
    name: 'Miami Dolphins',
    city: 'Miami',
    abbreviation: 'MIA',
    conference: 'AFC',
    division: 'East',
    primaryColor: '#008E97',
    secondaryColor: '#FC4C02',
  },
  {
    name: 'New England Patriots',
    city: 'New England',
    abbreviation: 'NE',
    conference: 'AFC',
    division: 'East',
    primaryColor: '#002244',
    secondaryColor: '#C60C30',
  },
  {
    name: 'New York Jets',
    city: 'New York',
    abbreviation: 'NYJ',
    conference: 'AFC',
    division: 'East',
    primaryColor: '#125740',
    secondaryColor: '#000000',
  },

  // AFC - North Division
  {
    name: 'Baltimore Ravens',
    city: 'Baltimore',
    abbreviation: 'BAL',
    conference: 'AFC',
    division: 'North',
    primaryColor: '#241773',
    secondaryColor: '#9E7C0C',
  },
  {
    name: 'Cincinnati Bengals',
    city: 'Cincinnati',
    abbreviation: 'CIN',
    conference: 'AFC',
    division: 'North',
    primaryColor: '#FB4F14',
    secondaryColor: '#000000',
  },
  {
    name: 'Cleveland Browns',
    city: 'Cleveland',
    abbreviation: 'CLE',
    conference: 'AFC',
    division: 'North',
    primaryColor: '#FF3C00',
    secondaryColor: '#311D00',
  },
  {
    name: 'Pittsburgh Steelers',
    city: 'Pittsburgh',
    abbreviation: 'PIT',
    conference: 'AFC',
    division: 'North',
    primaryColor: '#FFB612',
    secondaryColor: '#101820',
  },

  // AFC - South Division
  {
    name: 'Houston Texans',
    city: 'Houston',
    abbreviation: 'HOU',
    conference: 'AFC',
    division: 'South',
    primaryColor: '#03202F',
    secondaryColor: '#A71930',
  },
  {
    name: 'Indianapolis Colts',
    city: 'Indianapolis',
    abbreviation: 'IND',
    conference: 'AFC',
    division: 'South',
    primaryColor: '#002C5F',
    secondaryColor: '#A2AAAD',
  },
  {
    name: 'Jacksonville Jaguars',
    city: 'Jacksonville',
    abbreviation: 'JAX',
    conference: 'AFC',
    division: 'South',
    primaryColor: '#006778',
    secondaryColor: '#9F792C',
  },
  {
    name: 'Tennessee Titans',
    city: 'Tennessee',
    abbreviation: 'TEN',
    conference: 'AFC',
    division: 'South',
    primaryColor: '#0C2340',
    secondaryColor: '#4B92DB',
  },

  // AFC - West Division
  {
    name: 'Denver Broncos',
    city: 'Denver',
    abbreviation: 'DEN',
    conference: 'AFC',
    division: 'West',
    primaryColor: '#FB4F14',
    secondaryColor: '#002244',
  },
  {
    name: 'Kansas City Chiefs',
    city: 'Kansas City',
    abbreviation: 'KC',
    conference: 'AFC',
    division: 'West',
    primaryColor: '#E31837',
    secondaryColor: '#FFB81C',
  },
  {
    name: 'Las Vegas Raiders',
    city: 'Las Vegas',
    abbreviation: 'LV',
    conference: 'AFC',
    division: 'West',
    primaryColor: '#000000',
    secondaryColor: '#A5ACAF',
  },
  {
    name: 'Los Angeles Chargers',
    city: 'Los Angeles',
    abbreviation: 'LAC',
    conference: 'AFC',
    division: 'West',
    primaryColor: '#0080C6',
    secondaryColor: '#FFC20E',
  },

  // NFC - East Division
  {
    name: 'Dallas Cowboys',
    city: 'Dallas',
    abbreviation: 'DAL',
    conference: 'NFC',
    division: 'East',
    primaryColor: '#003594',
    secondaryColor: '#041E42',
  },
  {
    name: 'New York Giants',
    city: 'New York',
    abbreviation: 'NYG',
    conference: 'NFC',
    division: 'East',
    primaryColor: '#0B2265',
    secondaryColor: '#A71930',
  },
  {
    name: 'Philadelphia Eagles',
    city: 'Philadelphia',
    abbreviation: 'PHI',
    conference: 'NFC',
    division: 'East',
    primaryColor: '#004C54',
    secondaryColor: '#A5ACAF',
  },
  {
    name: 'Washington Commanders',
    city: 'Washington',
    abbreviation: 'WAS',
    conference: 'NFC',
    division: 'East',
    primaryColor: '#5A1414',
    secondaryColor: '#FFB612',
  },

  // NFC - North Division
  {
    name: 'Chicago Bears',
    city: 'Chicago',
    abbreviation: 'CHI',
    conference: 'NFC',
    division: 'North',
    primaryColor: '#0B162A',
    secondaryColor: '#C83803',
  },
  {
    name: 'Detroit Lions',
    city: 'Detroit',
    abbreviation: 'DET',
    conference: 'NFC',
    division: 'North',
    primaryColor: '#0076B6',
    secondaryColor: '#B0B7BC',
  },
  {
    name: 'Green Bay Packers',
    city: 'Green Bay',
    abbreviation: 'GB',
    conference: 'NFC',
    division: 'North',
    primaryColor: '#203731',
    secondaryColor: '#FFB612',
  },
  {
    name: 'Minnesota Vikings',
    city: 'Minnesota',
    abbreviation: 'MIN',
    conference: 'NFC',
    division: 'North',
    primaryColor: '#4F2683',
    secondaryColor: '#FFC62F',
  },

  // NFC - South Division
  {
    name: 'Atlanta Falcons',
    city: 'Atlanta',
    abbreviation: 'ATL',
    conference: 'NFC',
    division: 'South',
    primaryColor: '#A71930',
    secondaryColor: '#000000',
  },
  {
    name: 'Carolina Panthers',
    city: 'Carolina',
    abbreviation: 'CAR',
    conference: 'NFC',
    division: 'South',
    primaryColor: '#0085CA',
    secondaryColor: '#101820',
  },
  {
    name: 'New Orleans Saints',
    city: 'New Orleans',
    abbreviation: 'NO',
    conference: 'NFC',
    division: 'South',
    primaryColor: '#D3BC8D',
    secondaryColor: '#101820',
  },
  {
    name: 'Tampa Bay Buccaneers',
    city: 'Tampa Bay',
    abbreviation: 'TB',
    conference: 'NFC',
    division: 'South',
    primaryColor: '#D50A0A',
    secondaryColor: '#FF7900',
  },

  // NFC - West Division
  {
    name: 'Arizona Cardinals',
    city: 'Arizona',
    abbreviation: 'ARI',
    conference: 'NFC',
    division: 'West',
    primaryColor: '#97233F',
    secondaryColor: '#000000',
  },
  {
    name: 'Los Angeles Rams',
    city: 'Los Angeles',
    abbreviation: 'LAR',
    conference: 'NFC',
    division: 'West',
    primaryColor: '#003594',
    secondaryColor: '#FFA300',
  },
  {
    name: 'San Francisco 49ers',
    city: 'San Francisco',
    abbreviation: 'SF',
    conference: 'NFC',
    division: 'West',
    primaryColor: '#AA0000',
    secondaryColor: '#B3995D',
  },
  {
    name: 'Seattle Seahawks',
    city: 'Seattle',
    abbreviation: 'SEA',
    conference: 'NFC',
    division: 'West',
    primaryColor: '#002244',
    secondaryColor: '#69BE28',
  },
];

async function main() {
  console.log('Start seeding NBA teams...');
  
  for (const team of nbaTeams) {
    await prisma.nBATeam.upsert({
      where: { abbreviation: team.abbreviation },
      update: team,
      create: team,
    });
  }

  // Create conference standings for all teams
  console.log('Seeding NBA Conference Standings...');
  await prisma.nBAConferenceStandings.createMany({
    data: nbaTeams.map((team, index) => ({
      team: team.name,
      abbreviation: team.abbreviation,
      conference: team.conference,
      division: team.division,
      wins: Math.floor(Math.random() * 50) + 10, // Random wins between 10-60
      losses: Math.floor(Math.random() * 50) + 10, // Random losses between 10-60
      pct: '.500', // Will be calculated in real app
      gb: index === 0 ? '-' : `${Math.random() * 10}`, // Games back
      streak: Math.random() > 0.5 ? `W${Math.floor(Math.random() * 5) + 1}` : `L${Math.floor(Math.random() * 5) + 1}`,
    })),
    skipDuplicates: true,
  });

  // Create power rankings for all teams
  console.log('Seeding NBA Power Rankings...');
  await prisma.nBAPowerRankings.createMany({
    data: nbaTeams.map((team, index) => ({
      rank: index + 1,
      team: team.name,
      abbreviation: team.abbreviation,
      record: `${Math.floor(Math.random() * 30) + 20}-${Math.floor(Math.random() * 30) + 10}`,
      lastWeek: Math.max(1, index + Math.floor(Math.random() * 5) - 2),
      trend: index % 3 === 0 ? 'up' : index % 3 === 1 ? 'down' : 'same',
      summary: `${team.name} continue to show strong performance this season with key players stepping up.`,
    })),
    skipDuplicates: true,
  });

  // Seed MLB Teams
  console.log('Seeding MLB Teams...');
  for (const team of mlbTeams) {
    await prisma.mLBTeam.upsert({
      where: { abbreviation: team.abbreviation },
      update: team,
      create: team,
    });
  }

  // Seed NFL Teams
  console.log('Seeding NFL Teams...');
  for (const team of nflTeams) {
    await prisma.nFLTeam.upsert({
      where: { abbreviation: team.abbreviation },
      update: team,
      create: team,
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
