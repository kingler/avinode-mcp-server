const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTablesDirect() {
    console.log('🔍 Checking jetvision-agent-db tables directly...\n');
    
    // Try to access each expected table directly
    const tablesToCheck = [
        'operators',
        'aircraft', 
        'flight_legs',
        'charter_requests',
        'pricing_quotes',
        'bookings'
    ];
    
    console.log('📊 Table Access Test:');
    console.log('═══════════════════════════════════');
    
    const existingTables = [];
    
    for (const tableName of tablesToCheck) {
        try {
            const { data, error, count } = await supabase
                .from(tableName)
                .select('*', { count: 'exact', head: true });
                
            if (error) {
                console.log(`❌ ${tableName}: ${error.message}`);
            } else {
                console.log(`✅ ${tableName}: ${count || 0} records`);
                existingTables.push(tableName);
            }
        } catch (err) {
            console.log(`❌ ${tableName}: Access error`);
        }
    }
    
    console.log(`\n📈 Accessible Tables: ${existingTables.length}/${tablesToCheck.length}`);
    
    if (existingTables.includes('aircraft')) {
        console.log('\n🛩️  Checking aircraft table structure...');
        
        try {
            const { data: sample, error } = await supabase
                .from('aircraft')
                .select('*')
                .limit(1)
                .single();
                
            if (!error && sample) {
                console.log('✅ Aircraft table accessible with data');
                console.log('🔍 Sample record columns:', Object.keys(sample).join(', '));
                
                // Check for OpenSky fields
                const openSkyFields = ['icao24', 'current_latitude', 'current_longitude', 'opensky_category'];
                const hasOpenSkyFields = openSkyFields.some(field => field in sample);
                
                if (hasOpenSkyFields) {
                    console.log('✅ OpenSky tracking fields detected');
                } else {
                    console.log('⚠️  OpenSky tracking fields missing');
                }
                
            } else if (error && error.code === 'PGRST116') {
                console.log('✅ Aircraft table exists but is empty');
            }
        } catch (err) {
            console.log('⚠️  Could not check aircraft table structure');
        }
    }
    
    if (existingTables.includes('operators')) {
        console.log('\n🏢 Checking operators table...');
        
        try {
            const { data: sample, error } = await supabase
                .from('operators')
                .select('*')
                .limit(1)
                .single();
                
            if (!error && sample) {
                console.log('✅ Operators table accessible with data');
                console.log('🔍 Sample record columns:', Object.keys(sample).join(', '));
            } else if (error && error.code === 'PGRST116') {
                console.log('✅ Operators table exists but is empty');
            }
        } catch (err) {
            console.log('⚠️  Could not check operators table structure');
        }
    }
    
    // Recommendations
    console.log('\n💡 Recommendations:');
    
    if (existingTables.length === 0) {
        console.log('❌ No tables found. Need to create database schema.');
        console.log('📋 Run the SQL from scripts/manual-table-creation.sql');
        
    } else if (existingTables.length < 3) {
        console.log('⚠️  Incomplete schema. Missing important tables.');
        console.log('📋 Consider running additional migrations');
        
    } else {
        console.log('✅ Core tables exist. Ready for OpenSky data seeding!');
        console.log('🚀 Next step: npm run seed:opensky');
    }
    
    console.log('\n🔗 Supabase Dashboard:');
    console.log(`   ${supabaseUrl.replace('/rest/v1', '').replace('https://', 'https://supabase.com/dashboard/project/')}/editor`);
}

checkTablesDirect();