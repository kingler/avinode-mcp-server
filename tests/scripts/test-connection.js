const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testConnection() {
    console.log('🔌 Testing Supabase Connection...\n');
    
    try {
        // Test basic connectivity
        const { data: healthCheck, error: healthError } = await supabase
            .from('_supabase_info')
            .select('*')
            .limit(1);
            
        if (healthError) {
            console.log('ℹ️  Basic health check completed (expected behavior)');
        }

        // Test if we can create a simple table
        console.log('🔧 Creating test table...');
        const { error: createError } = await supabase.rpc('exec', {
            sql: `
                CREATE TABLE IF NOT EXISTS test_connection (
                    id SERIAL PRIMARY KEY,
                    message TEXT,
                    created_at TIMESTAMP DEFAULT NOW()
                );
                
                INSERT INTO test_connection (message) VALUES ('NextAvinode database connection test');
            `
        });

        if (createError) {
            console.log('⚠️  Note: Using direct SQL approach...');
            
            // Alternative: Use Supabase REST API directly
            const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
                method: 'POST',
                headers: {
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    sql: 'SELECT 1 as test_value'
                })
            });
            
            if (response.ok) {
                console.log('✅ Database connection successful via REST API!');
                console.log('🔗 Connection string: Working');
                console.log('🔑 Authentication: Valid');
                console.log('🌍 Network: Accessible');
            } else {
                console.log('❌ Connection failed:', response.statusText);
            }
        } else {
            console.log('✅ Database connection and table creation successful!');
        }

        console.log('\n📋 Next Steps:');
        console.log('1. Go to Supabase SQL Editor:');
        console.log('   https://supabase.com/dashboard/project/fshvzvxqgwgoujtcevyy/sql');
        console.log('');
        console.log('2. Copy and run the SQL from: apply-via-sql-editor.sql');
        console.log('');
        console.log('3. This will create all operators, aircraft, and other tables');
        console.log('');
        console.log('4. Then test with: node test-database-features.js');

    } catch (error) {
        console.error('❌ Connection test failed:', error.message);
        
        console.log('\n🛠️  Manual Setup Instructions:');
        console.log('Since the automated approach had issues, please:');
        console.log('');
        console.log('1. Open Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/fshvzvxqgwgoujtcevyy');
        console.log('');
        console.log('2. Go to SQL Editor tab');
        console.log('');
        console.log('3. Run the SQL from apply-via-sql-editor.sql');
        console.log('');
        console.log('4. This will set up your NextAvinode database');
    }
}

testConnection();