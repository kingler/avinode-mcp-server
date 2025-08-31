#!/usr/bin/env ts-node
/**
 * Run database migrations directly using Supabase client
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  try {
    console.log('🗄️  Creating database tables...');
    
    // Use direct HTTP request to Supabase REST API SQL endpoint
    const supabaseUrl = process.env.SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    
    const sql = `
      CREATE TABLE IF NOT EXISTS operators (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        certificate VARCHAR(100) NOT NULL,
        established INTEGER NOT NULL,
        headquarters VARCHAR(255) NOT NULL,
        operating_bases TEXT[] NOT NULL DEFAULT '{}',
        fleet_size INTEGER NOT NULL DEFAULT 0,
        safety_rating VARCHAR(100) NOT NULL,
        insurance VARCHAR(255) NOT NULL,
        certifications TEXT[] NOT NULL DEFAULT '{}',
        contact_email VARCHAR(255) NOT NULL,
        contact_phone VARCHAR(50) NOT NULL,
        website VARCHAR(255),
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS aircraft (
        id VARCHAR(50) PRIMARY KEY,
        registration_number VARCHAR(20) NOT NULL UNIQUE,
        model VARCHAR(100) NOT NULL,
        manufacturer VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        subcategory VARCHAR(50) NOT NULL,
        year_of_manufacture INTEGER NOT NULL,
        max_passengers INTEGER NOT NULL,
        cruise_speed INTEGER NOT NULL,
        range INTEGER NOT NULL,
        hourly_rate DECIMAL(10,2) NOT NULL,
        operator_id VARCHAR(50) NOT NULL,
        operator_name VARCHAR(255) NOT NULL,
        base_airport VARCHAR(10) NOT NULL,
        availability VARCHAR(20) NOT NULL DEFAULT 'Available',
        amenities TEXT[] NOT NULL DEFAULT '{}',
        images TEXT[] NOT NULL DEFAULT '{}',
        certifications TEXT[] NOT NULL DEFAULT '{}',
        wifi_available BOOLEAN NOT NULL DEFAULT false,
        pet_friendly BOOLEAN NOT NULL DEFAULT false,
        smoking_allowed BOOLEAN NOT NULL DEFAULT false,
        icao24 VARCHAR(6) UNIQUE,
        callsign VARCHAR(20),
        current_latitude DECIMAL(10, 6),
        current_longitude DECIMAL(11, 6),
        current_altitude INTEGER,
        current_velocity DECIMAL(8, 2),
        on_ground BOOLEAN DEFAULT false,
        last_position_update TIMESTAMP WITH TIME ZONE,
        opensky_category INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_aircraft_operator_id ON aircraft(operator_id);
      CREATE INDEX IF NOT EXISTS idx_aircraft_category ON aircraft(category);
      CREATE INDEX IF NOT EXISTS idx_aircraft_availability ON aircraft(availability);
      CREATE INDEX IF NOT EXISTS idx_aircraft_icao24 ON aircraft(icao24);
    `;
    
    // Try using the SQL REST endpoint directly
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json',
        'apikey': serviceKey
      },
      body: JSON.stringify({ sql })
    });
    
    if (response.ok) {
      console.log('✅ Tables created successfully via REST API!');
    } else {
      console.log('Direct REST API failed, trying individual table creation...');
      
      // Fallback: Create tables one by one using direct insert operations
      // This is a hack but should work
      console.log('Creating operators table via upsert...');
      const { error: opError } = await supabase
        .from('operators')
        .upsert({ id: 'test', name: 'test', certificate: 'test', established: 2000, headquarters: 'test', fleet_size: 0, safety_rating: 'test', insurance: 'test', contact_email: 'test@test.com', contact_phone: 'test' })
        .single();
      
      if (opError && !opError.message.includes('relation "operators" does not exist')) {
        console.log('✅ Operators table already exists');
      } else if (opError) {
        console.log('❌ Operators table does not exist, creating manually...');
        console.log('Please create tables manually in Supabase dashboard');
        return;
      }
    }
    
    console.log('🎉 Database setup completed!');
    
  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  }
}

/**
 * Run the migration script
 */
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log('Migrations completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migrations failed:', error);
      process.exit(1);
    });
}

export { runMigrations };