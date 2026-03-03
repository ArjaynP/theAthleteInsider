import 'dotenv/config';
import { fetchNBAStandings } from '../lib/sportsApi';

async function testNBAAPI() {
  console.log('🏀 Testing NBA API...\n');

  const hasKey = Boolean(process.env.RAPIDAPI_KEY);
  const hasHost = Boolean(process.env.RAPIDAPI_HOST_NBA);

  console.log('Environment check:');
  console.log(`- RAPIDAPI_KEY: ${hasKey ? '✅ Set' : '❌ Missing'}`);
  console.log(`- RAPIDAPI_HOST_NBA: ${hasHost ? '✅ Set' : '❌ Missing'}`);

  if (!hasKey || !hasHost) {
    console.error('\n❌ Missing required environment variables.');
    console.error('Set RAPIDAPI_KEY and RAPIDAPI_HOST_NBA in .env.local');
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