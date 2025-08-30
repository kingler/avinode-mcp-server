#!/usr/bin/env node

/**
 * Supabase Database Setup Script
 * Sets up the Avinode MCP Server database schema and seed data
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

console.log('🚀 Setting up Supabase database for Avinode MCP Server');
console.log(`📍 Supabase URL: ${supabaseUrl}`);

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration(migrationFile) {
  console.log(`📜 Running migration: ${migrationFile}`);
  
  const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', migrationFile);
  
  if (!fs.existsSync(migrationPath)) {
    throw new Error(`Migration file not found: ${migrationPath}`);
  }
  
  const sql = fs.readFileSync(migrationPath, 'utf8');
  
  // Note: Supabase client doesn't support raw SQL execution through the JS client
  // This would typically be done through the Supabase CLI or direct PostgreSQL connection
  // For demonstration, we'll log what would be executed
  
  console.log(`   SQL commands would be executed (${sql.length} characters)`);
  console.log('   ⚠️  Note: Actual SQL execution requires Supabase CLI or direct PostgreSQL connection');
  
  // Simulate success
  return { success: true };
}

async function testConnection() {
  console.log('🔍 Testing Supabase connection...');
  
  try {
    // Test connection by attempting to query the operators table
    const { data, error } = await supabase
      .from('operators')
      .select('count', { count: 'exact' })
      .limit(1);
    
    if (error) {
      console.log('   ℹ️  Tables not yet created (expected on first run)');
      return { connected: true, tablesExist: false };
    }
    
    console.log('✅ Connection successful, tables exist');
    return { connected: true, tablesExist: true };
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return { connected: false, tablesExist: false };
  }
}

async function verifyData() {
  console.log('🔍 Verifying database data...');
  
  try {
    const tables = ['operators', 'aircraft', 'flight_legs'];
    const results = {};
    
    for (const table of tables) {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`   ⚠️  Table ${table}: ${error.message}`);
        results[table] = 0;
      } else {
        results[table] = count;
        console.log(`   ✅ Table ${table}: ${count} records`);
      }
    }
    
    return results;
  } catch (error) {
    console.error('❌ Data verification failed:', error.message);
    return {};
  }
}

async function generateDatabaseInstructions() {
  console.log('\n📋 Manual Setup Instructions:');
  console.log('════════════════════════════════════════════════════════');
  
  console.log('\n1. Install Supabase CLI:');
  console.log('   npm install -g supabase');
  console.log('   # or');
  console.log('   brew install supabase/tap/supabase');
  
  console.log('\n2. Login to Supabase:');
  console.log('   supabase login');
  
  console.log('\n3. Run migrations:');
  console.log('   # Navigate to project directory');
  console.log(`   cd ${path.join(__dirname, '..')}`);
  console.log('   ');
  console.log('   # Initialize Supabase (if not done)');
  console.log('   supabase init');
  console.log('   ');
  console.log('   # Link to your project');
  console.log('   supabase link --project-ref fshvzvxqgwgoujtcevyy');
  console.log('   ');
  console.log('   # Run migrations');
  console.log('   supabase db push');
  
  console.log('\n4. Alternative: Direct SQL execution');
  console.log('   # Copy and paste the SQL from these files into the Supabase SQL editor:');
  console.log('   - supabase/migrations/001_create_avinode_schema.sql');
  console.log('   - supabase/migrations/002_seed_mock_data.sql');
  
  console.log('\n5. Verify setup:');
  console.log('   node scripts/setup-supabase.js');
  
  console.log('\n📚 Documentation:');
  console.log('   - Supabase CLI: https://supabase.com/docs/guides/cli');
  console.log('   - SQL Editor: https://app.supabase.com/project/fshvzvxqgwgoujtcevyy/sql');
}

async function main() {
  try {
    console.log('═'.repeat(60));
    
    // Test connection
    const connectionResult = await testConnection();
    
    if (!connectionResult.connected) {
      console.error('❌ Cannot connect to Supabase. Please check your credentials.');
      process.exit(1);
    }
    
    if (connectionResult.tablesExist) {
      console.log('📊 Database appears to be set up. Verifying data...');
      const dataResults = await verifyData();
      
      const totalRecords = Object.values(dataResults).reduce((sum, count) => sum + count, 0);
      
      if (totalRecords > 0) {
        console.log('\n🎉 Database setup is complete and contains data!');
        console.log(`   Total records across tables: ${totalRecords}`);
        
        console.log('\n✅ Ready to use Supabase-backed mock data:');
        console.log('   - Set USE_SUPABASE_MOCK=true in your environment');
        console.log('   - Restart your Avinode MCP Server');
        console.log('   - The server will automatically use database-backed mock data');
        
        process.exit(0);
      } else {
        console.log('\n⚠️  Tables exist but no data found. You may need to run the seed migration.');
      }
    }
    
    console.log('\n📋 Database setup required. Please follow these steps:');
    await generateDatabaseInstructions();
    
    console.log('\n═'.repeat(60));
    console.log('🏁 Setup script complete. Follow the manual instructions above.');
    
  } catch (error) {
    console.error('💥 Setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}