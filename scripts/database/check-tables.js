#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  console.log('🔍 Checking available tables in your Supabase database...');
  
  try {
    // Query information schema to get table names
    const { data, error } = await supabase.rpc('sql', {
      query: `
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    });
    
    if (error) {
      console.error('❌ Error querying tables:', error);
      // Try alternative method
      console.log('🔄 Trying alternative method...');
      
      const tables = ['customers', 'bookings', 'aircraft', 'operators', 'users'];
      for (const table of tables) {
        try {
          const { count } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true });
          console.log(`✅ Table '${table}' exists with ${count} records`);
        } catch (err) {
          console.log(`❌ Table '${table}' does not exist or is not accessible`);
        }
      }
      return;
    }
    
    console.log('📋 Available tables:');
    if (data && data.length > 0) {
      data.forEach(row => console.log(`   - ${row.table_name}`));
    } else {
      console.log('   No tables found or query returned empty result');
    }
    
  } catch (error) {
    console.error('💥 Failed to check tables:', error);
  }
}

checkTables();