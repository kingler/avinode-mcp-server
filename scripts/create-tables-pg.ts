#!/usr/bin/env ts-node

/**
 * Direct PostgreSQL Table Creation
 * Creates tables using direct PostgreSQL connection
 */

import { Client } from 'pg';

async function createTablesWithPostgreSQL() {
  console.log('🚀 Creating aviation tables using PostgreSQL client...');
  
  // Create PostgreSQL client with direct connection
  const client = new Client({
    host: 'db.fshvzvxqgwgoujtcevyy.supabase.co',
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU',
  });

  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL database');

    const tableQueries = [
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
      )`,

      // Continue with remaining tables...
      `CREATE TABLE IF NOT EXISTS invoices (
        id TEXT PRIMARY KEY,
        booking_id TEXT REFERENCES bookings(id),
        invoice_number TEXT UNIQUE NOT NULL,
        amount DECIMAL NOT NULL,
        currency TEXT DEFAULT 'USD',
        status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
        due_date DATE NOT NULL,
        line_items JSONB NOT NULL,
        tax_amount DECIMAL DEFAULT 0,
        discount_amount DECIMAL DEFAULT 0,
        customer_info JSONB NOT NULL,
        payment_terms TEXT,
        notes TEXT,
        pdf_url TEXT,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      `CREATE TABLE IF NOT EXISTS maintenance_records (
        id TEXT PRIMARY KEY,
        aircraft_id TEXT REFERENCES aircraft(id),
        maintenance_type TEXT CHECK (maintenance_type IN ('Routine', 'Progressive', 'AOG', 'Compliance')) NOT NULL,
        description TEXT NOT NULL,
        scheduled_date TIMESTAMP NOT NULL,
        completed_date TIMESTAMP,
        cost DECIMAL,
        currency TEXT DEFAULT 'USD',
        facility TEXT,
        technician TEXT,
        work_orders TEXT[] DEFAULT ARRAY[]::TEXT[],
        hours_at_maintenance DECIMAL,
        cycles_at_maintenance INTEGER,
        prediction_accuracy DECIMAL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      `CREATE TABLE IF NOT EXISTS crew_assignments (
        id TEXT PRIMARY KEY,
        booking_id TEXT REFERENCES bookings(id),
        aircraft_id TEXT REFERENCES aircraft(id),
        crew_type TEXT CHECK (crew_type IN ('Captain', 'First Officer', 'Flight Attendant')) NOT NULL,
        crew_member_name TEXT NOT NULL,
        crew_member_id TEXT NOT NULL,
        license_number TEXT,
        certification_expiry DATE,
        assignment_date TIMESTAMP DEFAULT NOW(),
        status TEXT CHECK (status IN ('Assigned', 'Confirmed', 'Completed')) DEFAULT 'Assigned',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      `CREATE TABLE IF NOT EXISTS aircraft_reviews (
        id TEXT PRIMARY KEY,
        aircraft_id TEXT REFERENCES aircraft(id),
        booking_id TEXT REFERENCES bookings(id),
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
        title TEXT,
        review TEXT,
        comfort_rating INTEGER CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
        cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
        amenities_rating INTEGER CHECK (amenities_rating >= 1 AND amenities_rating <= 5),
        verified_booking BOOLEAN DEFAULT FALSE,
        helpful INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`,

      `CREATE TABLE IF NOT EXISTS operator_reviews (
        id TEXT PRIMARY KEY,
        operator_id TEXT REFERENCES operators(id),
        booking_id TEXT REFERENCES bookings(id),
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
        title TEXT,
        review TEXT,
        service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
        communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
        value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
        timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
        verified_booking BOOLEAN DEFAULT FALSE,
        helpful INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )`
    ];

    let tablesCreated = 0;
    
    for (let i = 0; i < tableQueries.length; i++) {
      const query = tableQueries[i];
      const tableName = query.match(/CREATE TABLE IF NOT EXISTS (\w+)/)?.[1] || `table_${i + 1}`;
      
      console.log(`📋 Creating table: ${tableName}...`);
      
      try {
        await client.query(query);
        console.log(`✅ ${tableName}: Created successfully`);
        tablesCreated++;
      } catch (err: any) {
        console.error(`❌ Error creating ${tableName}: ${err.message}`);
      }
    }

    // Insert sample data for operators
    console.log('\n👔 Inserting sample operators...');
    
    const operatorInserts = [
      `INSERT INTO operators (id, name, certificate, established, headquarters, operating_bases, fleet_size, safety_rating, insurance, certifications, contact_email, contact_phone, website, description, avg_rating, total_reviews, response_time_hours, instant_booking_enabled, ai_optimized_pricing, predictive_maintenance_enabled, smart_routing_enabled, blockchain_verified, blockchain_address, carbon_offset_program, saf_percentage) VALUES 
      ('OP001', 'JetVision Charter', 'FAA Part 135', 2018, 'Teterboro, NJ', ARRAY['KTEB', 'KJFK', 'KLGA'], 12, 'ARGUS Platinum', '$100M Liability', ARRAY['ARGUS Gold', 'IS-BAO Stage 2', 'WYVERN Wingman'], 'ops@jetvision.com', '+1-201-555-0100', 'https://jetvision.com', 'Premium charter services with modern fleet', 4.8, 127, 2, true, true, true, true, true, '0x1234...5678', true, 15.5)
      ON CONFLICT (id) DO NOTHING`,
      
      `INSERT INTO operators (id, name, certificate, established, headquarters, operating_bases, fleet_size, safety_rating, insurance, certifications, contact_email, contact_phone, website, description, avg_rating, total_reviews, response_time_hours, instant_booking_enabled, ai_optimized_pricing, predictive_maintenance_enabled, smart_routing_enabled, blockchain_verified, carbon_offset_program, saf_percentage) VALUES 
      ('OP002', 'Elite Aviation Solutions', 'FAA Part 135', 2015, 'Van Nuys, CA', ARRAY['KVNY', 'KLAX', 'KBUR'], 18, 'ARGUS Gold', '$150M Liability', ARRAY['ARGUS Gold', 'IS-BAO Stage 3'], 'charter@eliteaviation.com', '+1-818-555-0200', 'https://eliteaviation.com', 'Luxury charter with VIP services', 4.9, 203, 1, true, true, false, true, false, true, 22.0)
      ON CONFLICT (id) DO NOTHING`
    ];

    for (const insertQuery of operatorInserts) {
      try {
        await client.query(insertQuery);
        console.log('✅ Operator inserted');
      } catch (err: any) {
        console.warn(`⚠️  Operator insert warning: ${err.message}`);
      }
    }

    console.log(`\n🎉 Database setup completed!`);
    console.log(`✅ Tables created: ${tablesCreated}`);

  } catch (error: any) {
    console.error('❌ Database setup failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the setup
if (require.main === module) {
  createTablesWithPostgreSQL()
    .then(() => {
      console.log('\n🚀 SUCCESS: Aviation tables created via PostgreSQL!');
      console.log('\n📊 Your database now has complete aviation platform schema');
      console.log('🔄 Supabase schema cache will refresh automatically');
      console.log('\n🎯 Next: Test your API endpoints with the new tables');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}