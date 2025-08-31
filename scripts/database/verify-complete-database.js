#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyCompleteDatabase() {
  console.log('🔍 COMPREHENSIVE AVIATION DATABASE VERIFICATION');
  console.log('=' .repeat(60));
  console.log('Checking all aviation tables for operational readiness...\n');
  
  // Expected aviation tables for a complete system
  const expectedTables = [
    'users', 'customers', 'aircraft', 'operators', 'flight_legs', 'bookings',
    'charter_requests', 'pricing_quotes', 'payments', 'invoices', 
    'aircraft_maintenance', 'flight_crews', 'routes', 'airports',
    'weather_data', 'notifications', 'analytics', 'reviews',
    'market_data', 'operational_logs'
  ];
  
  let totalRecords = 0;
  let populatedTables = 0;
  let adequatelyPopulated = 0; // 20+ records
  let partiallyPopulated = 0;  // 1-19 records
  let emptyTables = 0;
  let errorTables = 0;
  
  const results = {};
  
  for (const tableName of expectedTables) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${tableName.padEnd(20)} | ERROR: ${error.message}`);
        results[tableName] = { count: 0, status: 'ERROR', error: error.message };
        errorTables++;
      } else {
        const recordCount = count || 0;
        totalRecords += recordCount;
        
        let status, emoji;
        if (recordCount >= 20) {
          status = 'ADEQUATE';
          emoji = '✅';
          adequatelyPopulated++;
          populatedTables++;
        } else if (recordCount > 0) {
          status = 'PARTIAL';
          emoji = '⚠️ ';
          partiallyPopulated++;
          populatedTables++;
        } else {
          status = 'EMPTY';
          emoji = '⚪';
          emptyTables++;
        }
        
        console.log(`${emoji} ${tableName.padEnd(20)} | ${recordCount.toString().padStart(3)} records | ${status}`);
        results[tableName] = { count: recordCount, status, error: null };
      }
      
    } catch (err) {
      console.log(`❌ ${tableName.padEnd(20)} | EXCEPTION: ${err.message}`);
      results[tableName] = { count: 0, status: 'EXCEPTION', error: err.message };
      errorTables++;
    }
  }
  
  // Summary statistics
  console.log('\n' + '='.repeat(60));
  console.log('📊 DATABASE POPULATION SUMMARY:');
  console.log('-'.repeat(40));
  console.log(`📈 Total Records Across All Tables: ${totalRecords.toLocaleString()}`);
  console.log(`📋 Tables Checked: ${expectedTables.length}`);
  console.log(`✅ Adequately Populated (≥20 records): ${adequatelyPopulated}`);
  console.log(`⚠️  Partially Populated (1-19 records): ${partiallyPopulated}`);
  console.log(`⚪ Empty Tables (0 records): ${emptyTables}`);
  console.log(`❌ Error Tables (access issues): ${errorTables}`);
  
  // Calculate success rates
  const successRate = Math.round((adequatelyPopulated / expectedTables.length) * 100);
  const dataAvailability = Math.round((populatedTables / expectedTables.length) * 100);
  
  console.log('\n📊 OPERATIONAL METRICS:');
  console.log('-'.repeat(40));
  console.log(`🎯 Adequately Populated Rate: ${successRate}%`);
  console.log(`📈 Data Availability Rate: ${dataAvailability}%`);
  console.log(`🔧 System Health: ${Math.round(((expectedTables.length - errorTables) / expectedTables.length) * 100)}%`);
  
  // Operational status assessment
  console.log('\n🚀 AVIATION SYSTEM OPERATIONAL ASSESSMENT:');
  console.log('='.repeat(60));
  
  if (adequatelyPopulated >= 12 && errorTables === 0) {
    console.log('🎉 STATUS: FULLY OPERATIONAL FOR PRODUCTION');
    console.log('✈️  Ready for MCP server operations and client demonstrations');
    console.log('🎯 All critical aviation functions have adequate data');
  } else if (adequatelyPopulated >= 8 && errorTables <= 2) {
    console.log('⚡ STATUS: OPERATIONAL WITH MINOR GAPS');
    console.log('🛠️  Most aviation functions ready, some features may have limited data');
    console.log('🔧 Recommended: Address remaining empty tables for full capability');
  } else if (adequatelyPopulated >= 4) {
    console.log('⚠️  STATUS: PARTIALLY OPERATIONAL');
    console.log('🚧 Basic aviation functions available, significant data gaps remain');
    console.log('🔨 Required: Complete population of critical tables');
  } else {
    console.log('❌ STATUS: NOT READY FOR PRODUCTION');
    console.log('🚨 Insufficient data for aviation operations');
    console.log('🛠️  Required: Complete database population before deployment');
  }
  
  // MCP Tool readiness check
  console.log('\n🛠️  MCP AVIATION TOOL READINESS:');
  console.log('-'.repeat(40));
  const coreTablesForMCP = ['aircraft', 'operators', 'flight_legs', 'charter_requests', 'bookings'];
  let mcpReady = 0;
  
  coreTablesForMCP.forEach(table => {
    const result = results[table];
    if (result && result.count > 0) {
      console.log(`✅ ${table.padEnd(16)} - Ready (${result.count} records)`);
      mcpReady++;
    } else {
      console.log(`❌ ${table.padEnd(16)} - Not Ready`);
    }
  });
  
  const mcpReadiness = Math.round((mcpReady / coreTablesForMCP.length) * 100);
  console.log(`\n🎯 MCP Tool Readiness: ${mcpReadiness}%`);
  
  return {
    totalRecords,
    adequatelyPopulated,
    partiallyPopulated,
    emptyTables,
    errorTables,
    successRate,
    mcpReadiness,
    results
  };
}

// Run verification
verifyCompleteDatabase().then(summary => {
  console.log('\n✅ DATABASE VERIFICATION COMPLETE');
}).catch(error => {
  console.error('💥 Verification failed:', error);
});