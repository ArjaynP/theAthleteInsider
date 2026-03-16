import 'dotenv/config';
import { fetchNBAStandings } from '../lib/sportsApi';

async function testNBAAPI() {
  console.log('🏀 Testing NBA API...\n');

  const hasKey = Boolean(process.env.SPORTSRADAR_API_KEY);

  console.log('Environment check:');
  console.log(`- SPORTSRADAR_API_KEY: ${hasKey ? '✅ Set' : '❌ Missing'}`);

  if (!hasKey) {
    console.error('\n❌ Missing required environment variables.');
    console.error('Set SPORTSRADAR_API_KEY in .env.local');
    process.exit(1);
  }

  try {
    console.log('\nTesting NBA Standings...');
    const standings = await fetchNBAStandings();
    console.log('✅ Standings data received');
    console.log('   Teams found:', Array.isArray(standings) ? standings.length : 0);

    if (Array.isArray(standings) && standings.length > 0) {
      const firstTeam = standings[0];
      console.log('   Example team:', {
        name: firstTeam?.team?.displayName ?? firstTeam?.team?.name ?? 'Unknown',
        wins: firstTeam?.stats?.find((stat: any) => stat.type === 'wins')?.displayValue ?? 'N/A',
        losses: firstTeam?.stats?.find((stat: any) => stat.type === 'losses')?.displayValue ?? 'N/A',
      });
    }

    console.log('\n🎉 NBA standings API test passed!');
  } catch (error) {
    console.error('❌ NBA API test failed:', error);
    process.exit(1);
  }
}

testNBAAPI();