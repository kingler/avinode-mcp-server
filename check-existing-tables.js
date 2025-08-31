const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkExistingTables() {
    console.log('🔍 Checking existing tables in jetvision-agent-db...\n');
    
    try {
        // Get all user tables
        const { data: tables, error } = await supabase
            .rpc('exec', { 
                sql: `
                    SELECT table_name, 
                           (SELECT COUNT(*) FROM information_schema.columns 
                            WHERE table_schema = 'public' AND table_name = t.table_name) as column_count
                    FROM information_schema.tables t
                    WHERE table_schema = 'public' 
                    AND table_type = 'BASE TABLE'
                    AND table_name NOT LIKE 'auth_%'
                    AND table_name NOT LIKE 'storage_%'
                    AND table_name NOT LIKE 'supabase_%'
                    AND table_name NOT LIKE 'vault_%'
                    ORDER BY table_name;
                `
            });

        if (error) {
            console.error('❌ Error checking tables:', error.message);
            return;
        }

        console.log('📊 Current Database Tables:');
        console.log('═══════════════════════════════════════════════');
        
        if (tables && tables.length > 0) {
            tables.forEach(table => {
                console.log(`✅ ${table.table_name} (${table.column_count} columns)`);
            });
            
            console.log(`\n📈 Total Tables: ${tables.length}`);
            
            // Check for required tables for OpenSky integration
            const requiredTables = [
                'operators',
                'aircraft'
            ];
            
            const existingTableNames = tables.map(t => t.table_name);
            const missingTables = requiredTables.filter(table => !existingTableNames.includes(table));
            
            console.log('\n🎯 Required Tables Check:');
            requiredTables.forEach(table => {
                const exists = existingTableNames.includes(table);
                console.log(`${exists ? '✅' : '❌'} ${table}`);
            });
            
            if (missingTables.length > 0) {
                console.log('\n⚠️  Missing Tables:', missingTables.join(', '));
                console.log('💡 Need to create these tables for OpenSky integration');
            } else {
                console.log('\n✅ All required tables exist!');
                
                // Check if aircraft table has OpenSky fields
                const { data: aircraftColumns, error: colError } = await supabase
                    .rpc('exec', {
                        sql: `
                            SELECT column_name, data_type 
                            FROM information_schema.columns 
                            WHERE table_schema = 'public' 
                            AND table_name = 'aircraft' 
                            ORDER BY ordinal_position;
                        `
                    });
                
                if (!colError && aircraftColumns) {
                    console.log('\n🛩️  Aircraft Table Columns:');
                    const columnNames = aircraftColumns.map(col => col.column_name);
                    
                    const openSkyFields = [
                        'icao24', 'callsign', 'current_latitude', 'current_longitude', 
                        'current_altitude', 'current_velocity', 'on_ground', 
                        'last_position_update', 'opensky_category'
                    ];
                    
                    openSkyFields.forEach(field => {
                        const exists = columnNames.includes(field);
                        console.log(`${exists ? '✅' : '❌'} ${field}`);
                    });
                    
                    const missingFields = openSkyFields.filter(field => !columnNames.includes(field));
                    if (missingFields.length > 0) {
                        console.log('\n⚠️  Missing OpenSky fields:', missingFields.join(', '));
                        console.log('💡 Need to add these fields for OpenSky tracking');
                    } else {
                        console.log('\n✅ All OpenSky tracking fields present!');
                    }
                }
            }
            
            // Check for data
            if (existingTableNames.includes('operators')) {
                const { data: operatorCount } = await supabase
                    .rpc('exec', { sql: 'SELECT COUNT(*) as count FROM operators' });
                
                if (operatorCount && operatorCount[0]) {
                    console.log(`\n📊 Data Status:`);
                    console.log(`✅ Operators: ${operatorCount[0].count} records`);
                }
            }
            
            if (existingTableNames.includes('aircraft')) {
                const { data: aircraftCount } = await supabase
                    .rpc('exec', { sql: 'SELECT COUNT(*) as count FROM aircraft' });
                
                if (aircraftCount && aircraftCount[0]) {
                    console.log(`✅ Aircraft: ${aircraftCount[0].count} records`);
                }
            }
            
        } else {
            console.log('❌ No tables found in public schema');
            console.log('\n💡 Database appears to be empty. Need to create tables.');
        }
        
        console.log('\n🔗 Database URL:', supabaseUrl);
        
    } catch (error) {
        console.error('❌ Failed to check tables:', error.message);
    }
}

checkExistingTables();