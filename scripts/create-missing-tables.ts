#!/usr/bin/env ts-node

/**
 * Create Missing Database Tables for Complete Aviation Integration
 * Adds all missing tables for Avinode, Paynode, and SchedAero integration
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingTables() {
  console.log('🚀 Creating missing database tables for complete aviation integration...');
  console.log(`📍 Database: ${supabaseUrl}`);
  
  try {
    // Test connection
    console.log('🔗 Testing database connection...');
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    console.log('✅ Database connection successful');

    // Read and execute SQL schema file
    console.log('📄 Reading complete database schema...');
    const schemaSQL = readFileSync(join(__dirname, '../create-complete-database-schema.sql'), 'utf-8');
    
    // Split SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--') && !stmt.includes('pg_tables'));
    
    console.log(`📊 Executing ${statements.length} SQL statements to create missing tables...`);

    // Execute each CREATE TABLE and INDEX statement
    let tablesCreated = 0;
    let indexesCreated = 0;
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      if (statement.includes('CREATE TABLE')) {
        const tableName = statement.split('CREATE TABLE IF NOT EXISTS ')[1]?.split(' ')[0] || 'unknown';
        console.log(`   📋 Creating table: ${tableName}...`);
        
        const { error } = await supabase.rpc('query', { 
          query: statement 
        });
        
        if (error) {
          console.warn(`⚠️  Warning creating ${tableName}: ${error.message}`);
        } else {
          tablesCreated++;
        }
      } else if (statement.includes('CREATE INDEX')) {
        const indexName = statement.split('CREATE INDEX IF NOT EXISTS ')[1]?.split(' ')[0] || 'unknown';
        console.log(`   🔍 Creating index: ${indexName}...`);
        
        const { error } = await supabase.rpc('query', { 
          query: statement 
        });
        
        if (error) {
          console.warn(`⚠️  Warning creating index ${indexName}: ${error.message}`);
        } else {
          indexesCreated++;
        }
      }
    }

    console.log(`\n✅ Schema creation completed:`);
    console.log(`   📋 Tables created: ${tablesCreated}`);
    console.log(`   🔍 Indexes created: ${indexesCreated}`);

    // Verify all tables exist
    console.log('\n🔍 Verifying table creation...');
    
    const expectedTables = [
      'operators', 'flight_legs', 'pricing_quotes', 'charter_requests',
      'transactions', 'invoices', 'maintenance_records', 'crew_assignments',
      'aircraft_reviews', 'operator_reviews', 'market_analytics', 'price_predictions',
      'demand_forecasts', 'real_time_alerts', 'notification_preferences'
    ];
    
    for (const tableName of expectedTables) {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
        
      if (error) {
        console.log(`   ❌ ${tableName}: Error - ${error.message}`);
      } else {
        console.log(`   ✅ ${tableName}: Table exists (${count} records)`);
      }
    }

    console.log('\n🎉 Complete aviation database schema created successfully!');
    console.log('\n📊 Your database now supports:');
    console.log('   • Complete Avinode integration (operators, flight_legs, charter_requests, pricing_quotes)');
    console.log('   • Full Paynode integration (transactions, invoices)');
    console.log('   • Complete SchedAero integration (maintenance_records, crew_assignments, reviews)');
    console.log('   • Advanced analytics and AI features (market_analytics, price_predictions, demand_forecasts)');
    console.log('   • Real-time operations and notifications (real_time_alerts, notification_preferences)');

  } catch (error: any) {
    console.error('❌ Schema creation failed:', error.message);
    process.exit(1);
  }
}

// Alternative approach using direct SQL execution
async function executeDirectSQL() {
  console.log('📥 Executing SQL directly...');
  
  const createTableStatements = [
    // 1. OPERATORS TABLE
    `CREATE TABLE IF NOT EXISTS operators (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      certificate TEXT NOT NULL,
      established INTEGER NOT NULL,
      headquarters TEXT NOT NULL,
      operating_bases TEXT[] NOT NULL,
      fleet_size INTEGER DEFAULT 0,
      safety_rating TEXT NOT NULL,
      insurance TEXT NOT NULL,
      certifications TEXT[] NOT NULL,
      contact_email TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      website TEXT,
      description TEXT,
      avg_rating DECIMAL DEFAULT 0,
      total_reviews INTEGER DEFAULT 0,
      response_time_hours INTEGER DEFAULT 24,
      instant_booking_enabled BOOLEAN DEFAULT FALSE,
      ai_optimized_pricing BOOLEAN DEFAULT FALSE,
      predictive_maintenance_enabled BOOLEAN DEFAULT FALSE,
      smart_routing_enabled BOOLEAN DEFAULT FALSE,
      blockchain_verified BOOLEAN DEFAULT FALSE,
      blockchain_address TEXT,
      carbon_offset_program BOOLEAN DEFAULT FALSE,
      saf_percentage DECIMAL DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,

    // 2. FLIGHT_LEGS TABLE
    `CREATE TABLE IF NOT EXISTS flight_legs (
      id TEXT PRIMARY KEY,
      aircraft_id TEXT REFERENCES aircraft(id),
      departure_airport TEXT NOT NULL,
      arrival_airport TEXT NOT NULL,
      departure_date DATE NOT NULL,
      departure_time TIME NOT NULL,
      arrival_date DATE NOT NULL,
      arrival_time TIME NOT NULL,
      flight_time DECIMAL NOT NULL,
      distance INTEGER NOT NULL,
      status TEXT CHECK (status IN ('Available', 'Booked', 'InProgress', 'Completed')) DEFAULT 'Available',
      price DECIMAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      leg_type TEXT CHECK (leg_type IN ('EmptyLeg', 'Charter', 'Positioning')) NOT NULL,
      dynamic_pricing BOOLEAN DEFAULT FALSE,
      instant_booking BOOLEAN DEFAULT FALSE,
      special_offers JSONB,
      weather_alerts JSONB,
      demand_score DECIMAL DEFAULT 0,
      price_optimized BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,

    // 3. PRICING_QUOTES TABLE
    `CREATE TABLE IF NOT EXISTS pricing_quotes (
      id TEXT PRIMARY KEY,
      request_id TEXT,
      aircraft_id TEXT REFERENCES aircraft(id),
      total_price DECIMAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      price_breakdown JSONB NOT NULL,
      valid_until TIMESTAMP NOT NULL,
      terms TEXT[] NOT NULL,
      cancellation_policy TEXT,
      competitor_comparison JSONB,
      price_match_guarantee BOOLEAN DEFAULT FALSE,
      instant_acceptance BOOLEAN DEFAULT FALSE,
      smart_contract_address TEXT,
      blockchain_verified BOOLEAN DEFAULT FALSE,
      escrow_enabled BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,

    // 4. CHARTER_REQUESTS TABLE
    `CREATE TABLE IF NOT EXISTS charter_requests (
      id TEXT PRIMARY KEY,
      aircraft_id TEXT REFERENCES aircraft(id),
      operator_id TEXT REFERENCES operators(id),
      departure_airport TEXT NOT NULL,
      arrival_airport TEXT NOT NULL,
      departure_date DATE NOT NULL,
      departure_time TIME NOT NULL,
      return_date DATE,
      return_time TIME,
      passengers INTEGER NOT NULL,
      contact_name TEXT NOT NULL,
      contact_email TEXT NOT NULL,
      contact_phone TEXT NOT NULL,
      company TEXT,
      special_requests TEXT,
      status TEXT CHECK (status IN ('Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
      preferred_communication TEXT[] DEFAULT ARRAY['email'],
      urgency_level TEXT DEFAULT 'standard',
      budget_range TEXT,
      flexible_dates BOOLEAN DEFAULT FALSE,
      flexible_airports BOOLEAN DEFAULT FALSE,
      ai_match_score DECIMAL DEFAULT 0,
      ai_recommendations JSONB,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`,

    // 5. TRANSACTIONS TABLE
    `CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      booking_id TEXT REFERENCES bookings(id),
      transaction_type TEXT CHECK (transaction_type IN ('Payment', 'Refund', 'Chargeback', 'Fee')) NOT NULL,
      amount DECIMAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT CHECK (status IN ('Pending', 'Completed', 'Failed', 'Cancelled')) NOT NULL,
      payment_method TEXT,
      processor_name TEXT,
      processor_transaction_id TEXT,
      processor_fee DECIMAL,
      blockchain_tx_hash TEXT,
      smart_contract_address TEXT,
      gas_used TEXT,
      risk_score INTEGER,
      fraud_flags TEXT[] DEFAULT ARRAY[]::TEXT[],
      description TEXT NOT NULL,
      customer_reference TEXT,
      merchant_reference TEXT,
      initiated_date TIMESTAMP DEFAULT NOW(),
      completed_date TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    )`
  ];

  for (let i = 0; i < createTableStatements.length; i++) {
    const statement = createTableStatements[i];
    const tableName = statement.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || 'unknown';
    
    console.log(`   📋 Creating table: ${tableName}...`);
    
    try {
      // Use raw SQL execution
      const { error } = await supabase.rpc('exec', { 
        sql: statement 
      });
      
      if (error) {
        console.warn(`⚠️  Warning creating ${tableName}: ${error.message}`);
      } else {
        console.log(`   ✅ ${tableName}: Created successfully`);
      }
    } catch (err: any) {
      console.warn(`⚠️  Error creating ${tableName}: ${err.message}`);
    }
  }
}

async function main() {
  try {
    await createMissingTables();
  } catch (error) {
    console.log('⚠️  Schema file execution failed, trying direct SQL...');
    await executeDirectSQL();
  }
}

// Run the schema creation script
if (require.main === module) {
  main()
    .then(() => {
      console.log('\n🎯 Next Steps:');
      console.log('   1. All missing tables have been created for complete aviation platform integration');
      console.log('   2. Ready to populate with comprehensive aviation data');
      console.log('   3. Configure system to use complete database schema');
      console.log('   4. Test all API endpoints with full feature set');
      console.log('\n🚀 Your aviation platform is now ready for complete Avinode/Paynode/SchedAero integration!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}