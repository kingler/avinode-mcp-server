import { createClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lhwksxtscaadtwjhvhau.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxod2tzeHRzY2FhZHR3amh2aGF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2NjE1OCwiZXhwIjoyMDQwNDQyMTU4fQ.qKNJRRTt2kFXWQU9y-JBxGYb6kK4bJEgQNlElDKAOFM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function checkExistingData() {
  console.log('🔍 Checking existing data in aviation database...\n');

  const tables = [
    'aircraft', 'operators', 'bookings', 'users', 'charter_requests',
    'flight_legs', 'pricing_quotes', 'transactions', 'invoices',
    'maintenance_records', 'crew_assignments', 'aircraft_reviews',
    'operator_reviews', 'market_analytics', 'price_predictions',
    'demand_forecasts', 'real_time_alerts', 'notification_preferences'
  ];

  console.log('📊 Table Status:');
  console.log('='.repeat(60));

  let totalRecords = 0;
  const tableData = [];

  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`❌ ${table.padEnd(25)}: ERROR - ${error.message}`);
        tableData.push({ table, count: 0, status: 'ERROR', error: error.message });
      } else {
        const recordCount = count ?? 0;
        totalRecords += recordCount;
        let status = '❌ EMPTY';
        if (recordCount >= 20) {
          status = '✅ ADEQUATE';
        } else if (recordCount > 0) {
          status = `⚠️  NEEDS MORE (${recordCount})`;
        }
        console.log(`${status} ${table.padEnd(25)}: ${recordCount} records`);
        tableData.push({ table, count: recordCount, status });
      }

      // If table has data, show a sample record
      if ((count ?? 0) > 0) {
        const { data: sample, error: sampleError } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (!sampleError && sample && sample.length > 0) {
          console.log(`   📋 Sample structure: ${Object.keys(sample[0]).slice(0, 5).join(', ')}...`);
        }
      }
      
    } catch (err) {
      console.log(`❌ ${table.padEnd(25)}: EXCEPTION - ${err}`);
      tableData.push({ table, count: 0, status: 'EXCEPTION', error: String(err) });
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log(`📊 SUMMARY:`);
  console.log(`   Total Records: ${totalRecords}`);
  console.log(`   Tables with Data: ${tableData.filter(t => t.count && t.count > 0).length}/${tables.length}`);
  console.log(`   Adequate Tables (≥20): ${tableData.filter(t => t.count && t.count >= 20).length}/${tables.length}`);
  console.log(`   Empty Tables: ${tableData.filter(t => t.count === 0).length}/${tables.length}`);
  
  console.log('\n📋 POPULATED TABLES:');
  tableData
    .filter(t => t.count && t.count > 0)
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .forEach(t => {
      console.log(`   ${t.table}: ${t.count} records`);
    });

  console.log('\n❌ EMPTY TABLES:');
  tableData
    .filter(t => t.count === 0)
    .forEach(t => {
      console.log(`   ${t.table}: ${t.error ? `ERROR - ${t.error}` : 'No data'}`);
    });

  console.log('='.repeat(60));
}

// Run the check
checkExistingData().then(() => {
  console.log('\n✅ Data check complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Check failed:', error);
  process.exit(1);
});