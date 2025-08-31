#!/usr/bin/env ts-node

/**
 * Check Actual Database Schema and ID Formats
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure(tableName: string) {
  console.log(`\n🔍 Checking table: ${tableName}`);
  
  try {
    // Check if table exists and get sample
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`   ❌ Table ${tableName}: ${error.message}`);
      return false;
    }
    
    if (data && data.length > 0) {
      console.log(`   ✅ Table ${tableName} exists with data`);
      console.log(`   📝 Sample ID format: ${data[0].id}`);
      console.log(`   🏗️  ID type: ${typeof data[0].id} (${data[0].id.length} chars)`);
      
      // Check if it's a UUID format
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(data[0].id);
      console.log(`   🆔 Is UUID format: ${isUUID}`);
      
      return true;
    } else {
      console.log(`   ⚪ Table ${tableName} exists but empty`);
      return true;
    }
  } catch (error) {
    console.log(`   ❌ Error checking ${tableName}: ${error}`);
    return false;
  }
}

async function checkAllTables() {
  console.log('🚀 Checking all table structures and ID formats...');
  
  const expectedTables = [
    'operators',
    'aircraft',
    'flight_legs',
    'charter_requests', 
    'pricing_quotes',
    'bookings',
    'booking_legs',
    'operator_reviews',
    'aircraft_reviews', 
    'maintenance_records',
    'transactions',
    'market_analytics',
    'user_behavior_analytics',
    'price_predictions',
    'demand_forecasts',
    'real_time_alerts',
    'notification_preferences'
  ];
  
  const results: Record<string, boolean> = {};
  
  for (const tableName of expectedTables) {
    const exists = await checkTableStructure(tableName);
    results[tableName] = exists;
  }
  
  console.log('\n📊 SUMMARY:');
  const existingTables = Object.entries(results).filter(([_, exists]) => exists);
  const missingTables = Object.entries(results).filter(([_, exists]) => !exists);
  
  console.log(`   ✅ Existing tables: ${existingTables.length}`);
  console.log(`   ❌ Missing tables: ${missingTables.length}`);
  
  if (missingTables.length > 0) {
    console.log('\n🚫 MISSING TABLES:');
    missingTables.forEach(([tableName]) => {
      console.log(`   • ${tableName}`);
    });
  }
  
  return results;
}

// Also check for specific UUID generation
async function testUUIDGeneration() {
  console.log('\n🆔 Testing UUID generation...');
  
  // Test with a simple insert to operators table
  try {
    const { data, error } = await supabase
      .from('operators')
      .select('id')
      .limit(1);
      
    if (data && data.length > 0) {
      const sampleId = data[0].id;
      console.log(`   📝 Sample existing ID: ${sampleId}`);
      console.log(`   🧩 ID pattern analysis: ${sampleId.length} characters`);
      
      // Check if UUIDs or custom format
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sampleId);
      console.log(`   ✅ Uses UUID format: ${isUUID}`);
      
      if (!isUUID) {
        console.log('   📋 Custom ID format detected - will use similar pattern');
      }
    }
  } catch (error) {
    console.log(`   ❌ Error testing UUID: ${error}`);
  }
}

async function main() {
  const results = await checkAllTables();
  await testUUIDGeneration();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('   1. Use proper UUID format for all ID fields');
  console.log('   2. Create any missing tables before populating');
  console.log('   3. Match exact table names from database');
  console.log('   4. Use existing ID patterns for foreign key relationships');
}

if (require.main === module) {
  main().catch(console.error);
}