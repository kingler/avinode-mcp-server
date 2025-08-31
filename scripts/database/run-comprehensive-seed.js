#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeComprehensiveSeeding() {
  console.log('🚀 EXECUTING COMPREHENSIVE AVIATION DATABASE SEEDING');
  console.log('='.repeat(60));
  
  try {
    // Check what files exist
    const part1File = path.join(__dirname, 'COMPLETE_AVIATION_DATABASE_POPULATION.sql');
    const part2File = path.join(__dirname, 'COMPLETE_AVIATION_DATABASE_POPULATION_PART2.sql');
    
    const part1Exists = fs.existsSync(part1File);
    const part2Exists = fs.existsSync(part2File);
    
    console.log(`📁 Part 1 SQL file exists: ${part1Exists}`);
    console.log(`📁 Part 2 SQL file exists: ${part2Exists}`);
    
    if (!part1Exists) {
      console.error('❌ Part 1 SQL file not found. Cannot proceed.');
      return;
    }
    
    // Execute Part 1 first
    console.log('\n🔧 EXECUTING PART 1: Core Tables Population...');
    console.log('-'.repeat(50));
    
    const part1SQL = fs.readFileSync(part1File, 'utf8');
    
    // Split the SQL into individual statements (basic approach)
    const statements = part1SQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'BEGIN' && stmt !== 'COMMIT');
    
    console.log(`📋 Found ${statements.length} SQL statements to execute in Part 1`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      
      // Skip empty statements and comments
      if (!stmt || stmt.startsWith('--') || stmt.length < 10) continue;
      
      try {
        const { error } = await supabase.rpc('exec_sql', { sql: stmt });
        
        if (error) {
          console.log(`❌ Statement ${i + 1} failed: ${error.message.substring(0, 100)}...`);
          errorCount++;
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
          successCount++;
        }
        
        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.log(`❌ Statement ${i + 1} exception: ${err.message.substring(0, 100)}...`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Part 1 Results: ${successCount} success, ${errorCount} errors`);
    
    // Execute Part 2 if it exists
    if (part2Exists) {
      console.log('\n🔧 EXECUTING PART 2: Analytics & Operations Tables...');
      console.log('-'.repeat(50));
      
      const part2SQL = fs.readFileSync(part2File, 'utf8');
      const part2Statements = part2SQL
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && stmt !== 'BEGIN' && stmt !== 'COMMIT');
      
      console.log(`📋 Found ${part2Statements.length} SQL statements to execute in Part 2`);
      
      let part2SuccessCount = 0;
      let part2ErrorCount = 0;
      
      for (let i = 0; i < part2Statements.length; i++) {
        const stmt = part2Statements[i];
        
        if (!stmt || stmt.startsWith('--') || stmt.length < 10) continue;
        
        try {
          const { error } = await supabase.rpc('exec_sql', { sql: stmt });
          
          if (error) {
            console.log(`❌ Part 2 Statement ${i + 1} failed: ${error.message.substring(0, 100)}...`);
            part2ErrorCount++;
          } else {
            console.log(`✅ Part 2 Statement ${i + 1} executed successfully`);
            part2SuccessCount++;
          }
          
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (err) {
          console.log(`❌ Part 2 Statement ${i + 1} exception: ${err.message.substring(0, 100)}...`);
          part2ErrorCount++;
        }
      }
      
      console.log(`\n📊 Part 2 Results: ${part2SuccessCount} success, ${part2ErrorCount} errors`);
      
      successCount += part2SuccessCount;
      errorCount += part2ErrorCount;
    }
    
    // Final verification
    console.log('\n🔍 COMPREHENSIVE DATABASE VERIFICATION...');
    console.log('='.repeat(60));
    
    const expectedTables = [
      'users', 'customers', 'aircraft', 'operators', 'flight_legs', 'bookings',
      'charter_requests', 'pricing_quotes', 'payments', 'invoices', 
      'aircraft_maintenance', 'flight_crews', 'routes', 'airports',
      'weather_data', 'notifications', 'analytics', 'reviews',
      'market_data', 'operational_logs'
    ];
    
    let totalRecords = 0;
    let adequatelyPopulated = 0;
    let populatedTables = 0;
    
    for (const tableName of expectedTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (!error) {
          const recordCount = count || 0;
          totalRecords += recordCount;
          
          if (recordCount >= 20) {
            console.log(`✅ ${tableName.padEnd(20)} | ${recordCount.toString().padStart(3)} records | ADEQUATE`);
            adequatelyPopulated++;
            populatedTables++;
          } else if (recordCount > 0) {
            console.log(`⚠️  ${tableName.padEnd(20)} | ${recordCount.toString().padStart(3)} records | PARTIAL`);
            populatedTables++;
          } else {
            console.log(`⚪ ${tableName.padEnd(20)} |   0 records | EMPTY`);
          }
        } else {
          console.log(`❌ ${tableName.padEnd(20)} | ERROR: ${error.message.substring(0, 50)}`);
        }
      } catch (err) {
        console.log(`❌ ${tableName.padEnd(20)} | EXCEPTION: ${err.message.substring(0, 50)}`);
      }
    }
    
    // Final results
    console.log('\n' + '='.repeat(60));
    console.log('🎯 FINAL COMPREHENSIVE DATABASE STATUS:');
    console.log('-'.repeat(40));
    console.log(`📈 Total Records: ${totalRecords.toLocaleString()}`);
    console.log(`📋 Tables Checked: ${expectedTables.length}`);
    console.log(`✅ Adequately Populated (≥20 records): ${adequatelyPopulated}`);
    console.log(`📊 Total Populated Tables: ${populatedTables}`);
    console.log(`💻 SQL Statements Executed: ${successCount} success, ${errorCount} errors`);
    
    const successRate = Math.round((adequatelyPopulated / expectedTables.length) * 100);
    const overallHealth = Math.round((successCount / (successCount + errorCount)) * 100);
    
    console.log('\n🎯 OPERATIONAL METRICS:');
    console.log('-'.repeat(40));
    console.log(`🎪 Adequately Populated Rate: ${successRate}%`);
    console.log(`🏥 Database Health Score: ${overallHealth}%`);
    console.log(`📈 Data Availability: ${Math.round((populatedTables / expectedTables.length) * 100)}%`);
    
    if (adequatelyPopulated >= 16 && totalRecords >= 400) {
      console.log('\n🎉 SUCCESS: AVIATION DATABASE FULLY OPERATIONAL!');
      console.log('✈️  Ready for production MCP server operations');
      console.log('🎯 All critical aviation functions have adequate data');
      console.log('🚀 Client demonstrations can proceed with confidence');
    } else if (adequatelyPopulated >= 12) {
      console.log('\n⚡ GOOD: Aviation database is mostly operational');
      console.log('🔧 Minor gaps remain but core functions are ready');
    } else {
      console.log('\n⚠️  PARTIAL: Significant work still needed');
      console.log('🚧 Database requires additional population efforts');
    }
    
  } catch (error) {
    console.error('💥 Comprehensive seeding failed:', error);
    process.exit(1);
  }
}

// Execute the comprehensive seeding
executeComprehensiveSeeding();