#!/usr/bin/env node

/**
 * Direct Migration Runner
 * Executes all migration files directly against Supabase database
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.n8n' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.n8n');
  process.exit(1);
}

console.log('🚀 Running database migrations directly');
console.log(`📍 Supabase URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Migration files in order
const migrationFiles = [
  '001_create_avinode_schema.sql',
  '002_seed_mock_data.sql',
  '003_create_schedaero_schema.sql',
  '004_create_paynode_schema.sql',
  '005_seed_schedaero_data.sql',
  '006_seed_paynode_data.sql'
];

async function runMigration(migrationFile) {
  console.log(`📜 Running migration: ${migrationFile}`);
  
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${migrationPath}`);
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  try {
    // Execute the SQL using the rpc function to run raw SQL
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      // If exec_sql doesn't exist, try alternative approach
      if (error.message.includes('function exec_sql')) {
        console.log(`   ⚠️  Cannot execute raw SQL directly. Please run this migration manually in the SQL editor.`);
        console.log(`   📝 File: ${migrationPath}`);
        console.log(`   🔗 SQL Editor: https://app.supabase.com/project/fshvzvxqgwgoujtcevyy/sql`);
        return { success: false, requiresManual: true };
      } else {
        throw error;
      }
    }
    
    console.log(`   ✅ Migration completed successfully`);
    return { success: true };
    
  } catch (error) {
    console.log(`   ❌ Migration failed: ${error.message}`);
    throw error;
  }
}

async function testTables() {
  console.log('🔍 Testing database tables...');
  
  const tables = [
    'operators',
    'aircraft', 
    'flight_legs',
    'maintenance_facilities',
    'crew_members',
    'payment_accounts',
    'invoices',
    'transactions'
  ];
  
  const results = {};
  let totalRecords = 0;
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ⚠️  Table ${table}: ${error.message}`);
        results[table] = 0;
      } else {
        results[table] = count || 0;
        totalRecords += count || 0;
        console.log(`   ✅ Table ${table}: ${count || 0} records`);
      }
    } catch (error) {
      console.log(`   ❌ Table ${table}: ${error.message}`);
      results[table] = 0;
    }
  }
  
  return { results, totalRecords };
}

async function main() {
  try {
    console.log('═'.repeat(60));
    
    let requiresManualSetup = false;
    
    for (const migrationFile of migrationFiles) {
      const result = await runMigration(migrationFile);
      if (result.requiresManual) {
        requiresManualSetup = true;
      }
    }
    
    if (requiresManualSetup) {
      console.log('\n📋 Manual Migration Required');
      console.log('════════════════════════════════════════════════════════');
      console.log('\nThe migrations need to be run manually in the Supabase SQL editor:');
      console.log('\n1. Open: https://app.supabase.com/project/fshvzvxqgwgoujtcevyy/sql');
      console.log('\n2. Execute each migration file in order:');
      migrationFiles.forEach((file, index) => {
        console.log(`   ${index + 1}. supabase/migrations/${file}`);
      });
      console.log('\n3. After completion, run: node scripts/setup-supabase.js');
      
    } else {
      console.log('\n🎉 All migrations completed! Testing tables...');
      
      const { results, totalRecords } = await testTables();
      
      if (totalRecords > 0) {
        console.log('\n🎉 Database migration successful!');
        console.log(`   Total records created: ${totalRecords}`);
        console.log('\n✅ Ready to use database-backed mock data:');
        console.log('   - Set USE_SUPABASE_MOCK=true in your environment');
        console.log('   - Restart your Aviation Charter Server');
        console.log('   - All three systems (Avinode, SchedAero, Paynode) are ready!');
      } else {
        console.log('\n⚠️  Migrations may not have completed successfully.');
        console.log('   Please check the migration files and run manually if needed.');
      }
    }
    
    console.log('\n═'.repeat(60));
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error.message);
    console.log('\n📋 Manual Setup Required');
    console.log('Please run the migrations manually in the Supabase SQL editor.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}