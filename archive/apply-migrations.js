#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase configuration in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Migration files in order
const migrations = [
    '001_create_avinode_schema.sql',
    '002_seed_mock_data.sql', 
    '003_create_schedaero_schema.sql',
    '004_create_paynode_schema.sql',
    '005_seed_schedaero_data.sql',
    '006_seed_paynode_data.sql',
    '007_create_competitive_features.sql',
    '008_seed_competitive_data.sql'
];

async function applyMigration(filename) {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', filename);
    
    if (!fs.existsSync(migrationPath)) {
        console.log(`⚠️  Migration file not found: ${filename}`);
        return false;
    }
    
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log(`🔄 Applying migration: ${filename}`);
    
    try {
        const { error } = await supabase.rpc('exec_sql', { sql });
        
        if (error) {
            console.error(`❌ Error applying ${filename}:`, error);
            return false;
        }
        
        console.log(`✅ Successfully applied: ${filename}`);
        return true;
    } catch (err) {
        console.error(`❌ Exception applying ${filename}:`, err);
        return false;
    }
}

async function runAllMigrations() {
    console.log('🚀 Starting NextAvinode database setup...\n');
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const migration of migrations) {
        const success = await applyMigration(migration);
        if (success) {
            successCount++;
        } else {
            errorCount++;
        }
        console.log(''); // Add spacing
    }
    
    console.log('📊 Migration Summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
    if (errorCount === 0) {
        console.log('\n🎉 All migrations applied successfully!');
        console.log('🏆 NextAvinode competitive database is ready!');
        console.log('\nDatabase includes:');
        console.log('• 31 tables with full aviation marketplace functionality');
        console.log('• AI-powered price predictions and demand forecasting');
        console.log('• Blockchain transaction transparency');
        console.log('• Real-time alerts and IoT integration');
        console.log('• Customer reviews and ratings system');
        console.log('• Dynamic pricing engine with automated rules');
        console.log('• Market analytics and competitive intelligence');
        console.log('• Enhanced operator and aircraft management');
        
        console.log('\n🔗 Supabase Dashboard:', supabaseUrl.replace('/rest/v1', ''));
    } else {
        console.log('\n⚠️  Some migrations failed. Please check the errors above.');
        process.exit(1);
    }
}

// Create the exec_sql function if it doesn't exist
async function createExecFunction() {
    const createFunctionSql = `
        CREATE OR REPLACE FUNCTION exec_sql(sql text)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
            EXECUTE sql;
        END;
        $$;
    `;
    
    try {
        const { error } = await supabase.rpc('exec', { 
            sql: createFunctionSql 
        });
        
        if (error) {
            // Try alternative approach
            const { error: altError } = await supabase
                .from('_temp') // This will fail but might create the function
                .select('*')
                .limit(1);
        }
    } catch (err) {
        // Function might already exist, continue
    }
}

// Run the migrations
createExecFunction().then(() => {
    runAllMigrations();
}).catch(err => {
    console.error('❌ Setup error:', err);
    runAllMigrations(); // Try anyway
});