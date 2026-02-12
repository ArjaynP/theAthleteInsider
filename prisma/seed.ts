import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function main() {
  console.log('Start seeding NBA teams...');
  
  for (const team of nbaTeams) {
    await prisma.nBATeam.upsert({
      where: { abbreviation: team.abbreviation },
      update: team,
      create: team,
    });
  }
  
  console.log('Seeding finished. All 30 NBA teams have been added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
