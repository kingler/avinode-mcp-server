#!/usr/bin/env ts-node

/**
 * Complete Database Schema Analysis
 * Discovers all tables, their structures, and current data counts
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

// Expected tables from Prisma schema
const EXPECTED_TABLES = [
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

async function getAllTables() {
  console.log('🔍 Discovering all tables in database...');
  
  try {
    const { data, error } = await supabase
      .rpc('get_all_tables');
    
    if (error) {
      console.log('❌ Using direct table queries instead...');
      return EXPECTED_TABLES;
    }
    
    return data.map((row: any) => row.table_name);
  } catch (error) {
    console.log('🔄 Using expected table list...');
    return EXPECTED_TABLES;
  }
}

async function analyzeTable(tableName: string) {
  console.log(`\n📋 Analyzing table: ${tableName}`);
  
  try {
    // Try to get table structure and data
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.log(`   ❌ ${tableName}: ${error.message}`);
      return {
        name: tableName,
        exists: false,
        count: 0,
        columns: [],
        error: error.message
      };
    }
    
    // Get sample record to determine structure
    const { data: sampleData } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    const columns = sampleData && sampleData.length > 0 
      ? Object.keys(sampleData[0]) 
      : [];
    
    console.log(`   ✅ ${tableName}: ${count || 0} records`);
    if (columns.length > 0) {
      console.log(`   📝 Columns: ${columns.slice(0, 5).join(', ')}${columns.length > 5 ? '...' : ''}`);
    }
    
    return {
      name: tableName,
      exists: true,
      count: count || 0,
      columns,
      error: null
    };
    
  } catch (error) {
    console.log(`   ❌ ${tableName}: ${error}`);
    return {
      name: tableName,
      exists: false,
      count: 0,
      columns: [],
      error: String(error)
    };
  }
}

async function generateTableReport(tableResults: any[]) {
  console.log('\n\n🎯 DATABASE ANALYSIS REPORT');
  console.log('=' .repeat(50));
  
  const existingTables = tableResults.filter(t => t.exists);
  const missingTables = tableResults.filter(t => !t.exists);
  const populatedTables = existingTables.filter(t => t.count >= 20);
  const partialTables = existingTables.filter(t => t.count > 0 && t.count < 20);
  const emptyTables = existingTables.filter(t => t.count === 0);
  
  console.log(`📊 SUMMARY:`);
  console.log(`   Total Expected Tables: ${EXPECTED_TABLES.length}`);
  console.log(`   Existing Tables: ${existingTables.length}`);
  console.log(`   Missing Tables: ${missingTables.length}`);
  console.log(`   Well-Populated (≥20 records): ${populatedTables.length}`);
  console.log(`   Partially Populated (1-19 records): ${partialTables.length}`);
  console.log(`   Empty Tables (0 records): ${emptyTables.length}`);
  
  if (populatedTables.length > 0) {
    console.log(`\n✅ WELL-POPULATED TABLES:`);
    populatedTables.forEach(t => {
      console.log(`   • ${t.name}: ${t.count} records`);
    });
  }
  
  if (partialTables.length > 0) {
    console.log(`\n⚠️  PARTIALLY POPULATED TABLES:`);
    partialTables.forEach(t => {
      console.log(`   • ${t.name}: ${t.count} records`);
    });
  }
  
  if (emptyTables.length > 0) {
    console.log(`\n❌ EMPTY TABLES NEEDING DATA:`);
    emptyTables.forEach(t => {
      console.log(`   • ${t.name}: 0 records (columns: ${t.columns.length})`);
    });
  }
  
  if (missingTables.length > 0) {
    console.log(`\n🚫 MISSING TABLES:`);
    missingTables.forEach(t => {
      console.log(`   • ${t.name}: ${t.error}`);
    });
  }
  
  return {
    existingTables,
    missingTables,
    populatedTables,
    partialTables,
    emptyTables
  };
}

async function checkSchemaDetails(tableName: string) {
  console.log(`\n🔍 Detailed schema check for: ${tableName}`);
  
  // Get a few sample records to understand the data structure
  const { data: samples, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(3);
  
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return;
  }
  
  if (samples && samples.length > 0) {
    const sampleRecord = samples[0];
    console.log(`   📝 Schema structure:`);
    
    Object.entries(sampleRecord).forEach(([key, value]) => {
      const type = typeof value;
      const isNull = value === null;
      const preview = isNull ? 'null' : 
        (type === 'string' && String(value).length > 30) ? `"${String(value).slice(0, 30)}..."` :
        (type === 'object') ? JSON.stringify(value).slice(0, 50) + '...' :
        String(value);
      
      console.log(`      ${key}: ${type}${isNull ? ' (null)' : ''} = ${preview}`);
    });
  } else {
    console.log(`   📄 Table exists but has no data`);
  }
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive database schema analysis...');
    
    // Get all tables
    const allTables = await getAllTables();
    
    // Analyze each table
    const results = [];
    for (const tableName of EXPECTED_TABLES) {
      const result = await analyzeTable(tableName);
      results.push(result);
    }
    
    // Generate report
    const report = await generateTableReport(results);
    
    // Show detailed schema for key tables
    console.log('\n\n🔍 DETAILED SCHEMA ANALYSIS');
    console.log('=' .repeat(50));
    
    const keyTables = ['operators', 'aircraft'];
    for (const tableName of keyTables) {
      if (results.find(r => r.name === tableName && r.exists)) {
        await checkSchemaDetails(tableName);
      }
    }
    
    console.log('\n🎯 NEXT STEPS REQUIRED:');
    console.log(`   1. Create ${report.missingTables.length} missing tables`);
    console.log(`   2. Populate ${report.emptyTables.length} empty tables with realistic data`);
    console.log(`   3. Enhance ${report.partialTables.length} partially populated tables to minimum 20 records`);
    console.log(`   4. Validate all foreign key relationships work correctly`);
    
    return report;
    
  } catch (error) {
    console.error('❌ Error during analysis:', error);
    process.exit(1);
  }
}

// Run the analysis
if (require.main === module) {
  main()
    .then((report) => {
      console.log('\n✅ Database analysis completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Analysis failed:', error);
      process.exit(1);
    });
}

export { main as analyzeCompleteSchema };