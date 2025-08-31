#!/usr/bin/env ts-node
/**
 * Check what tables and columns exist in Supabase
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

async function checkSchema() {
  try {
    console.log('🔍 Checking existing database schema...');
    
    // Check what we can actually query
    console.log('📋 Testing aircraft table access...');
    const { data: aircraftTest, error: aircraftError } = await supabase
      .from('aircraft')
      .select('*')
      .limit(1);
    
    if (aircraftError) {
      console.log('❌ Aircraft table error:', aircraftError.message);
    } else {
      console.log('✅ Aircraft table accessible');
      console.log('📊 Sample aircraft data:', aircraftTest?.[0] ? Object.keys(aircraftTest[0]) : 'No data');
    }
    
    // Check operators table
    console.log('📋 Testing operators table access...');
    const { data: operatorsTest, error: operatorsError } = await supabase
      .from('operators')
      .select('*')
      .limit(1);
    
    if (operatorsError) {
      console.log('❌ Operators table error:', operatorsError.message);
      console.log('🔧 Need to create operators table');
    } else {
      console.log('✅ Operators table accessible');
      console.log('📊 Operators data:', operatorsTest?.[0] ? Object.keys(operatorsTest[0]) : 'No data');
    }
    
    // Try to get counts
    const { count: aircraftCount } = await supabase
      .from('aircraft')
      .select('*', { count: 'exact', head: true });
      
    console.log(`📈 Current aircraft count: ${aircraftCount}`);
    
    if (aircraftCount && aircraftCount > 0) {
      // Get sample record to see actual schema
      const { data: sampleAircraft } = await supabase
        .from('aircraft')
        .select('*')
        .limit(1);
        
      if (sampleAircraft?.[0]) {
        console.log('📝 Actual aircraft table columns:');
        Object.keys(sampleAircraft[0]).forEach(col => {
          console.log(`   - ${col}: ${typeof sampleAircraft[0][col]}`);
        });
      }
    }
    
    return { aircraftExists: !aircraftError, operatorsExists: !operatorsError, aircraftCount };
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
    return { aircraftExists: false, operatorsExists: false, aircraftCount: 0 };
  }
}

/**
 * Run the check
 */
if (require.main === module) {
  checkSchema()
    .then((result) => {
      console.log('📊 Schema check results:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Schema check failed:', error);
      process.exit(1);
    });
}

export { checkSchema };