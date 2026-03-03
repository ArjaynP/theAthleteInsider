// Add this at the very top of the file
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { fetchNBAStandings } from '../lib/sportsApi';

async function testNBAAPI() {
  console.log('🏀 Testing NBA API...\n');

  // Debug: Check if env vars are loaded
  console.log('Environment check:');
  console.log('- RAPIDAPI_KEY:', process.env.RAPIDAPI_KEY ? '✅ Set' : '❌ Missing');
  console.log('- RAPIDAPI_HOST_NBA:', process.env.RAPIDAPI_HOST_NBA ? '✅ Set' : '❌ Missing');
  console.log('');

  try {
    console.log('Testing NBA Standings...');
    const standings = await fetchNBAStandings();
    
    // Log the entire response to see its structure
    console.log('Full response:', JSON.stringify(standings, null, 2));
    
    // Check different possible structures
    console.log('\nChecking response structure:');
    console.log('- standings.body:', standings?.body ? `Array with ${standings.body.length} items` : 'undefined');
    console.log('- standings.response:', standings?.response ? `Array with ${standings.response.length} items` : 'undefined');
    console.log('- standings.data:', standings?.data ? `Array with ${standings.data.length} items` : 'undefined');
    console.log('- standings itself:', Array.isArray(standings) ? `Array with ${standings.length} items` : 'Not array');
    
    console.log('\n✅ NBA standings API test completed!');
  } catch (error) {
    console.error('❌ NBA API test failed:', error);
    process.exit(1);
  }
}

testNBAAPI();