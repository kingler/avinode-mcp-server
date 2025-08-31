#!/usr/bin/env ts-node
/**
 * Create tables directly using Supabase SQL execution
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

async function createTables() {
  try {
    console.log('🗄️  Creating database tables directly...');
    
    // Create operators table
    console.log('Creating operators table...');
    const operatorsSQL = `
      CREATE TABLE IF NOT EXISTS public.operators (
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
      
      -- Enable RLS
      ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.operators FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Enable all for service role" ON public.operators FOR ALL USING (auth.role() = 'service_role');
      
      -- Test insert
      INSERT INTO public.operators (
        id, name, certificate, established, headquarters, fleet_size, 
        safety_rating, insurance, contact_email, contact_phone, description
      ) VALUES (
        'OP001', 
        'Test Aviation', 
        'Part 135 Operator', 
        2020, 
        'Miami, FL', 
        5, 
        'ARGUS Gold', 
        '$50M Liability Coverage', 
        'ops@testaviation.com', 
        '+1-305-555-0001',
        'Test operator for database setup verification'
      ) ON CONFLICT (id) DO NOTHING;
    `;
    
    // Use raw SQL query
    const { error: operatorsError } = await supabase.rpc('exec', { sql: operatorsSQL });
    
    if (operatorsError) {
      console.log('Standard exec failed, trying alternative approach...');
      
      // Try using the REST API directly
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'apikey': supabaseServiceKey
        },
        body: JSON.stringify({ sql: operatorsSQL })
      });
      
      if (!response.ok) {
        console.log('Direct API call also failed. Let me try creating via edge function...');
        
        // Create a simpler approach - create minimal table structure
        const simpleOperatorsSQL = `
          CREATE TABLE public.operators (
            id text PRIMARY KEY,
            name text NOT NULL,
            certificate text NOT NULL,
            established integer NOT NULL,
            headquarters text NOT NULL,
            operating_bases text[] DEFAULT '{}',
            fleet_size integer DEFAULT 0,
            safety_rating text NOT NULL,
            insurance text NOT NULL,
            certifications text[] DEFAULT '{}',
            contact_email text NOT NULL,
            contact_phone text NOT NULL,
            website text,
            description text,
            created_at timestamptz DEFAULT now(),
            updated_at timestamptz DEFAULT now()
          );
        `;
        
        console.log('❌ Automated table creation failed.');
        console.log('📋 Please manually execute this SQL in Supabase dashboard:');
        console.log('---');
        console.log(simpleOperatorsSQL);
        console.log('---');
        
        return false;
      }
    }
    
    console.log('✅ Operators table created');
    
    // Create aircraft table
    console.log('Creating aircraft table...');
    const aircraftSQL = `
      CREATE TABLE IF NOT EXISTS public.aircraft (
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
      
      -- Enable RLS
      ALTER TABLE public.aircraft ENABLE ROW LEVEL SECURITY;
      
      -- Create policies
      CREATE POLICY IF NOT EXISTS "Enable read access for all users" ON public.aircraft FOR SELECT USING (true);
      CREATE POLICY IF NOT EXISTS "Enable all for service role" ON public.aircraft FOR ALL USING (auth.role() = 'service_role');
      
      -- Create indexes
      CREATE INDEX IF NOT EXISTS idx_aircraft_operator_id ON aircraft(operator_id);
      CREATE INDEX IF NOT EXISTS idx_aircraft_category ON aircraft(category);
      CREATE INDEX IF NOT EXISTS idx_aircraft_availability ON aircraft(availability);
      CREATE INDEX IF NOT EXISTS idx_aircraft_icao24 ON aircraft(icao24);
    `;
    
    const { error: aircraftError } = await supabase.rpc('exec', { sql: aircraftSQL });
    
    if (aircraftError) {
      console.log('❌ Aircraft table creation also failed');
      console.log('📋 Please manually execute both SQLs in Supabase dashboard');
      return false;
    }
    
    console.log('✅ Aircraft table created');
    console.log('🎉 Database tables created successfully!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    return false;
  }
}

/**
 * Run the table creation
 */
if (require.main === module) {
  createTables()
    .then((success) => {
      if (success) {
        console.log('✅ Table creation completed successfully');
        console.log('🚀 Now run: npm run seed:opensky');
        process.exit(0);
      } else {
        console.log('❌ Manual table creation required');
        console.log('📖 See scripts/manual-table-creation.sql for complete SQL');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Table creation failed:', error);
      process.exit(1);
    });
}

export { createTables };