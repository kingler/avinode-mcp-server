#!/usr/bin/env ts-node

/**
 * Check Schema Constraints for Problematic Tables
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure(tableName: string) {
  console.log(`\n🔍 Detailed schema check for: ${tableName}`);
  
  // Get sample data to understand structure
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1);
  
  if (error) {
    console.log(`   ❌ ${error.message}`);
    return null;
  }
  
  if (data && data.length > 0) {
    console.log(`   📝 Sample record structure:`);
    Object.entries(data[0]).forEach(([key, value]) => {
      console.log(`      ${key}: ${typeof value} = ${value}`);
    });
    return data[0];
  } else {
    console.log(`   📄 Table exists but empty`);
    return {};
  }
}

async function checkConstraints() {
  console.log('🔍 Checking schema constraints for problematic tables...');
  
  // Check charter_requests status constraint
  console.log('\n📋 Charter Requests Status Values:');
  const { data: charterData } = await supabase
    .from('charter_requests')
    .select('status')
    .limit(5);
  
  if (charterData) {
    charterData.forEach((row, i) => {
      console.log(`   ${i + 1}. status: "${row.status}"`);
    });
  }
  
  // Check flight_legs columns
  await checkTableStructure('flight_legs');
  
  // Check notification_preferences user_id format
  await checkTableStructure('notification_preferences');
  
  // Try to determine if missing tables exist
  console.log('\n🔍 Checking for missing tables...');
  
  try {
    const { data: bookingLegsTest } = await supabase
      .from('booking_legs')
      .select('*')
      .limit(1);
    console.log('   ✅ booking_legs table exists');
  } catch (error) {
    console.log('   ❌ booking_legs table missing or inaccessible');
  }
  
  try {
    const { data: ubaTest } = await supabase
      .from('user_behavior_analytics')
      .select('*')
      .limit(1);
    console.log('   ✅ user_behavior_analytics table exists');
  } catch (error) {
    console.log('   ❌ user_behavior_analytics table missing or inaccessible');
  }
}

async function main() {
  await checkConstraints();
}

if (require.main === module) {
  main().catch(console.error);
}