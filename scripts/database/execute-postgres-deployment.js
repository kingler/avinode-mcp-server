#!/usr/bin/env node

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// PostgreSQL connection string for Supabase
const connectionString = 'postgresql://postgres.fshvzvxqgwgoujtcevyy:UVZBOyQxLa6B7GQh@aws-0-us-west-1.pooler.supabase.com:6543/postgres';

async function executePostgresDeployment() {
  console.log('🚀 EXECUTING POSTGRESQL DEPLOYMENT');
  console.log('=' .repeat(50));
  
  const client = new Client({
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  try {
    // Connect to PostgreSQL
    console.log('🔗 Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('✅ Connected successfully');
    
    // Read the SQL script
    const sqlFile = path.join(__dirname, 'populate-supabase-database.sql');
    const sqlScript = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('\n📝 Executing comprehensive population script...');
    console.log(`📋 Script size: ${Math.round(sqlScript.length / 1024)}KB`);
    
    // Execute the entire SQL script
    const result = await client.query(sqlScript);
    
    console.log('✅ SQL script executed successfully');
    
    // The verification query at the end of the script should return results
    if (result.rows && result.rows.length > 0) {
      console.log('\n📊 POPULATION RESULTS:');
      console.log('-'.repeat(40));
      result.rows.forEach(row => {
        const status = row.record_count >= 20 ? '✅ ADEQUATE' : row.record_count > 0 ? '⚠️  PARTIAL' : '⚪ EMPTY';
        console.log(`${status} ${row.table_name.padEnd(15)} | ${row.record_count.toString().padStart(3)} records`);
      });
      
      const totalRecords = result.rows.reduce((sum, row) => sum + parseInt(row.record_count), 0);
      const adequateCount = result.rows.filter(row => row.record_count >= 20).length;
      
      console.log('\n📈 DEPLOYMENT SUMMARY:');
      console.log('-'.repeat(40));
      console.log(`📊 Total Records: ${totalRecords.toLocaleString()}`);
      console.log(`✅ Adequately Populated Tables (≥20): ${adequateCount}/${result.rows.length}`);
      console.log(`🎯 Success Rate: ${Math.round((adequateCount / result.rows.length) * 100)}%`);
      
      if (adequateCount >= 9) {
        console.log('\n🎉 EXCELLENT: Major improvement in database population!');
        console.log('✈️  Aviation database now has comprehensive operational data');
        console.log('🎯 Ready for full MCP aviation operations');
      } else if (adequateCount >= 7) {
        console.log('\n⚡ GOOD: Significant progress made on database population');
        console.log('🔧 Core aviation functions now have adequate data');
      } else {
        console.log('\n⚠️  PARTIAL: Some population achieved but more work needed');
      }
    }
    
  } catch (error) {
    console.error('❌ PostgreSQL deployment failed:', error.message);
    
    if (error.message.includes('connect')) {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('   • Check network connection');
      console.log('   • Verify Supabase database is running');
      console.log('   • Confirm connection string credentials');
    } else if (error.message.includes('syntax') || error.message.includes('column')) {
      console.log('\n🔧 SCHEMA ISSUES:');
      console.log('   • Some table schemas may differ from expected structure');
      console.log('   • Check column names and data types');
      console.log('   • Review constraint requirements');
    }
    
    process.exit(1);
    
  } finally {
    await client.end();
    console.log('\n🔌 PostgreSQL connection closed');
  }
}

// Execute the deployment
executePostgresDeployment().catch(console.error);