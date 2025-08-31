const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function checkSchema() {
    console.log('🔍 Checking NextAvinode Database Schema...\n');
    
    try {
        // Check if tables exist using information_schema
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .order('table_name');

        if (tablesError) {
            console.error('❌ Error checking tables:', tablesError.message);
            return;
        }

        console.log('📊 Database Tables Found:');
        console.log('═══════════════════════════════════');
        
        if (tables && tables.length > 0) {
            const expectedTables = [
                'operators', 'aircraft', 'flight_legs', 'charter_requests', 'pricing_quotes', 'bookings',
                'maintenance_schedules', 'crew_members', 'flight_schedules', 
                'payment_accounts', 'transactions', 'invoices',
                'operator_reviews', 'aircraft_reviews', 'market_analytics', 'price_predictions', 'real_time_alerts'
            ];
            
            const foundTables = tables.map(t => t.table_name).filter(name => 
                !name.startsWith('_') && !name.includes('schema') && !name.includes('auth')
            );
            
            foundTables.forEach((table, index) => {
                const status = expectedTables.includes(table) ? '✅' : '📋';
                console.log(`${status} ${table}`);
            });
            
            console.log(`\n📈 Total Tables: ${foundTables.length}`);
            
            // Check for key expected tables
            const coreTablesFound = expectedTables.filter(table => foundTables.includes(table));
            console.log(`🎯 Core Tables Found: ${coreTablesFound.length}/${expectedTables.length}`);
            
            if (coreTablesFound.length >= 5) {
                console.log('\n✅ Database schema appears to be set up!');
                
                // Test a few key tables with data
                console.log('\n🔍 Testing Table Access:');
                
                // Test operators table
                const { data: ops, error: opsError } = await supabase
                    .from('operators')
                    .select('id, name')
                    .limit(3);
                    
                if (!opsError && ops) {
                    console.log(`✅ operators: ${ops.length} records`);
                    ops.forEach(op => console.log(`   • ${op.name} (${op.id})`));
                } else {
                    console.log(`❌ operators: ${opsError?.message || 'No access'}`);
                }
                
                // Test aircraft table
                const { data: aircraft, error: aircraftError } = await supabase
                    .from('aircraft')
                    .select('id, model, manufacturer')
                    .limit(3);
                    
                if (!aircraftError && aircraft) {
                    console.log(`✅ aircraft: ${aircraft.length} records`);
                    aircraft.forEach(ac => console.log(`   • ${ac.manufacturer} ${ac.model} (${ac.id})`));
                } else {
                    console.log(`❌ aircraft: ${aircraftError?.message || 'No access'}`);
                }
                
                console.log('\n🚀 Database Status: OPERATIONAL');
                console.log('🔗 Dashboard: https://supabase.com/dashboard/project/fshvzvxqgwgoujtcevyy');
                
            } else {
                console.log('\n⚠️  Schema incomplete. Missing key tables.');
                console.log('💡 Please run the SQL migrations in Supabase Dashboard');
            }
            
        } else {
            console.log('❌ No tables found in public schema');
            console.log('\n💡 Next Steps:');
            console.log('1. Go to https://supabase.com/dashboard/project/fshvzvxqgwgoujtcevyy/sql');
            console.log('2. Run the SQL from apply-via-sql-editor.sql');
        }
        
    } catch (error) {
        console.error('❌ Schema check failed:', error.message);
        console.log('\n🛠️  Troubleshooting:');
        console.log('• Check your SUPABASE_SERVICE_ROLE_KEY in .env');
        console.log('• Verify network connection');
        console.log('• Try manual setup via Supabase Dashboard');
    }
}

checkSchema();