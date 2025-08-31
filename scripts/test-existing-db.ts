#!/usr/bin/env ts-node
/**
 * Test connection to existing JetVision database
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

async function testExistingDatabase() {
  try {
    console.log('🔍 Testing JetVision database connection...');
    console.log(`📡 Connecting to: ${supabaseUrl}`);
    
    // Test aircraft table
    console.log('📋 Testing aircraft table...');
    const { data: aircraftTest, error: aircraftError } = await supabase
      .from('aircraft')
      .select('*')
      .limit(1);
    
    if (aircraftError) {
      console.log('❌ Aircraft table error:', aircraftError.message);
      return false;
    } else {
      console.log('✅ Aircraft table accessible');
      
      const { count: aircraftCount } = await supabase
        .from('aircraft')
        .select('*', { count: 'exact', head: true });
      
      console.log(`📊 Current aircraft count: ${aircraftCount}`);
      
      if (aircraftTest && aircraftTest.length > 0) {
        console.log('📝 Aircraft table schema:', Object.keys(aircraftTest[0]));
      }
    }
    
    // Test other relevant tables
    const tables = ['users', 'bookings', 'conversations'];
    
    for (const table of tables) {
      try {
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        console.log(`✅ ${table} table: ${count} records`);
      } catch (error) {
        console.log(`❌ ${table} table: ${(error as Error).message}`);
      }
    }
    
    console.log('🎉 Database connection test completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
    return false;
  }
}

if (require.main === module) {
  testExistingDatabase()
    .then((success) => {
      if (success) {
        console.log('✅ Database ready for OpenSky seeding!');
        process.exit(0);
      } else {
        console.log('❌ Database test failed');
        process.exit(1);
      }
    });
}