#!/usr/bin/env ts-node
/**
 * Test database connection and table existence
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection and table existence...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);
    
    // Test basic connection
    console.log('Testing basic connection...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('operators')
      .select('id')
      .limit(1);
    
    if (connectionError) {
      if (connectionError.message.includes('relation "operators" does not exist')) {
        console.log('❌ Operators table does not exist');
        console.log('Please run the SQL in scripts/manual-table-creation.sql in Supabase dashboard');
        return false;
      } else {
        console.error('❌ Connection error:', connectionError.message);
        return false;
      }
    } else {
      console.log('✅ Operators table exists and is accessible');
    }
    
    // Test aircraft table
    console.log('Testing aircraft table...');
    const { data: aircraftTest, error: aircraftError } = await supabase
      .from('aircraft')
      .select('id')
      .limit(1);
    
    if (aircraftError) {
      if (aircraftError.message.includes('relation "aircraft" does not exist')) {
        console.log('❌ Aircraft table does not exist');
        console.log('Please run the SQL in scripts/manual-table-creation.sql in Supabase dashboard');
        return false;
      } else {
        console.error('❌ Aircraft table error:', aircraftError.message);
        return false;
      }
    } else {
      console.log('✅ Aircraft table exists and is accessible');
    }
    
    // Check current data counts
    const { count: operatorCount } = await supabase
      .from('operators')
      .select('*', { count: 'exact', head: true });
    
    const { count: aircraftCount } = await supabase
      .from('aircraft')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Current data: ${operatorCount} operators, ${aircraftCount} aircraft`);
    
    console.log('🎉 Database test completed successfully!');
    console.log('✅ Ready for OpenSky data seeding');
    
    return true;
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

/**
 * Run the test
 */
if (require.main === module) {
  testDatabase()
    .then((success) => {
      if (success) {
        console.log('Database test passed');
        process.exit(0);
      } else {
        console.log('Database test failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Test execution failed:', error);
      process.exit(1);
    });
}

export { testDatabase };