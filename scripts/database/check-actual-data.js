#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkActualData() {
  console.log('🔍 ACTUAL DATABASE CONTENT CHECK');
  console.log('='.repeat(50));
  
  const tables = ['users', 'aircraft', 'operators', 'flight_legs', 'charter_requests', 'bookings'];
  
  for (const tableName of tables) {
    console.log(`\n📋 ${tableName.toUpperCase()} TABLE:`);
    console.log('-'.repeat(30));
    
    try {
      // Get count
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.log(`❌ Error getting count: ${countError.message}`);
        continue;
      }
      
      console.log(`📊 Total records: ${count}`);
      
      if (count > 0) {
        // Get sample data
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(3);
        
        if (error) {
          console.log(`❌ Error getting data: ${error.message}`);
        } else if (data && data.length > 0) {
          console.log(`📄 Sample records:`);
          data.forEach((record, index) => {
            console.log(`   ${index + 1}. ID: ${record.id}`);
            // Show key fields for each table type
            if (tableName === 'users') {
              console.log(`      Email: ${record.email}`);
              console.log(`      Name: ${record.first_name} ${record.last_name}`);
              console.log(`      Metadata: ${record.metadata ? 'YES' : 'NO'}`);
            } else if (tableName === 'aircraft') {
              console.log(`      Tail: ${record.tail_number}`);
              console.log(`      Model: ${record.manufacturer} ${record.model}`);
            } else if (tableName === 'flight_legs') {
              console.log(`      Route: ${record.departure_airport} → ${record.arrival_airport}`);
              console.log(`      Status: ${record.status}`);
            } else if (tableName === 'charter_requests') {
              console.log(`      Company: ${record.company}`);
              console.log(`      Status: ${record.status}`);
            }
          });
        }
      } else {
        console.log(`⚪ Table is empty`);
      }
      
    } catch (error) {
      console.log(`💥 Error accessing table: ${error.message}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ ACTUAL DATABASE CHECK COMPLETE');
}

checkActualData();