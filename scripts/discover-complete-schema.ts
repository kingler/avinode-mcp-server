import { createClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lhwksxtscaadtwjhvhau.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxod2tzeHRzY2FhZHR3amh2aGF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2NjE1OCwiZXhwIjoyMDQwNDQyMTU4fQ.qKNJRRTt2kFXWQU9y-JBxGYb6kK4bJEgQNlElDKAOFM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function discoverCompleteSchema() {
  console.log('🔍 Discovering complete database schema...\n');

  try {
    // Get all table names
    const { data: tables, error: tablesError } = await supabase.rpc('get_table_names');
    
    if (tablesError) {
      console.error('Error getting table names:', tablesError);
      // Fallback: get tables from information_schema
      const { data: tablesData, error: infoError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .eq('table_type', 'BASE TABLE');
        
      if (infoError) {
        console.error('Error getting tables from information_schema:', infoError);
        return;
      }
      
      console.log('📋 Available tables:');
      tablesData?.forEach((table: any) => {
        console.log(`  - ${table.table_name}`);
      });
      return;
    }

    // Define our target tables to analyze
    const targetTables = [
      'users', 'customers', 'payments', 'invoices', 
      'aircraft_maintenance', 'flight_crews', 'routes', 'airports',
      'weather_data', 'notifications', 'analytics', 'reviews',
      'market_data', 'operational_logs',
      // Also check populated tables for reference
      'aircraft', 'operators', 'bookings', 'charter_requests', 
      'flight_legs', 'pricing_quotes'
    ];

    for (const tableName of targetTables) {
      console.log(`\n📊 Analyzing table: ${tableName}`);
      console.log('=' .repeat(50));

      // Get table schema using information_schema
      const { data: columns, error: columnsError } = await supabase
        .from('information_schema.columns')
        .select(`
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length,
          numeric_precision,
          numeric_scale
        `)
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .order('ordinal_position');

      if (columnsError) {
        console.error(`❌ Error getting columns for ${tableName}:`, columnsError);
        continue;
      }

      if (!columns || columns.length === 0) {
        console.log(`⚠️  Table ${tableName} not found or has no columns`);
        continue;
      }

      // Display column information
      console.log('📋 Columns:');
      columns.forEach((col: any) => {
        const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
        const defaultVal = col.column_default ? ` DEFAULT ${col.column_default}` : '';
        const length = col.character_maximum_length ? `(${col.character_maximum_length})` : '';
        console.log(`  - ${col.column_name}: ${col.data_type}${length} ${nullable}${defaultVal}`);
      });

      // Get foreign key constraints
      const { data: foreignKeys, error: fkError } = await supabase
        .from('information_schema.key_column_usage')
        .select(`
          column_name,
          referenced_table_name,
          referenced_column_name
        `)
        .eq('table_schema', 'public')
        .eq('table_name', tableName)
        .not('referenced_table_name', 'is', null);

      if (!fkError && foreignKeys && foreignKeys.length > 0) {
        console.log('🔗 Foreign Keys:');
        foreignKeys.forEach((fk: any) => {
          console.log(`  - ${fk.column_name} -> ${fk.referenced_table_name}.${fk.referenced_column_name}`);
        });
      }

      // Get current record count
      const { count, error: countError } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      if (!countError) {
        console.log(`📈 Current record count: ${count ?? 0}`);
        const recordCount = count ?? 0;
        const status = recordCount === 0 ? '❌ EMPTY' : recordCount < 20 ? `⚠️  NEEDS MORE (${20 - recordCount} records needed)` : '✅ ADEQUATE';
        console.log(`📊 Status: ${status}`);
      } else {
        console.log(`❌ Error getting count: ${countError.message}`);
      }

      // Get a sample record if available
      if (count && count > 0) {
        const { data: sample, error: sampleError } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);

        if (!sampleError && sample && sample.length > 0) {
          console.log('🔍 Sample record structure:');
          console.log(JSON.stringify(sample[0], null, 2));
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 SUMMARY');
    console.log('='.repeat(80));

    // Generate summary of all tables
    for (const tableName of targetTables) {
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });

      const recordCount = count ?? 0;
      const status = recordCount === 0 ? '❌ EMPTY' : recordCount < 20 ? `⚠️  NEEDS MORE (${recordCount}/20)` : `✅ ADEQUATE (${recordCount})`;
      console.log(`${tableName.padEnd(20)}: ${status}`);
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

// Run the schema discovery
discoverCompleteSchema().then(() => {
  console.log('\n✅ Schema discovery complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});