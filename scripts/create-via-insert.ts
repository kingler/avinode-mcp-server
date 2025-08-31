#!/usr/bin/env ts-node
/**
 * Create tables by triggering Supabase to auto-create schema
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

async function createViaInsert() {
  try {
    console.log('🔧 Creating tables by forcing Supabase to recognize schema...');
    
    // First, let's see what tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (!tablesError) {
      console.log('📋 Existing tables:', tables?.map(t => t.table_name));
    }
    
    // Try direct SQL execution using Supabase's built-in function
    console.log('🔨 Executing table creation SQL...');
    
    const createSQL = `
      CREATE TABLE IF NOT EXISTS operators (
        id text PRIMARY KEY,
        name text NOT NULL,
        certificate text,
        established integer,
        headquarters text,
        operating_bases text[],
        fleet_size integer DEFAULT 0,
        safety_rating text,
        insurance text,
        certifications text[],
        contact_email text,
        contact_phone text,
        website text,
        description text
      );
      
      CREATE TABLE IF NOT EXISTS aircraft (
        id text PRIMARY KEY,
        registration_number text UNIQUE,
        model text,
        manufacturer text,
        category text,
        subcategory text,
        year_of_manufacture integer,
        max_passengers integer,
        cruise_speed integer,
        range integer,
        hourly_rate decimal,
        operator_id text,
        operator_name text,
        base_airport text,
        availability text DEFAULT 'Available',
        amenities text[],
        images text[],
        certifications text[],
        wifi_available boolean DEFAULT false,
        pet_friendly boolean DEFAULT false,
        smoking_allowed boolean DEFAULT false,
        icao24 text,
        callsign text,
        current_latitude decimal,
        current_longitude decimal,
        current_altitude integer,
        current_velocity decimal,
        on_ground boolean,
        last_position_update timestamptz,
        opensky_category integer
      );
    `;
    
    // Use the SQL editor endpoint directly
    const response = await fetch(`${supabaseUrl.replace('/rest/v1', '')}/sql`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: createSQL })
    });
    
    if (response.ok) {
      console.log('✅ SQL executed successfully via direct endpoint');
    } else {
      const errorText = await response.text();
      console.log('❌ Direct SQL failed:', errorText);
      
      // Try alternative: Create minimal records to force table creation
      console.log('🔄 Trying alternative approach: force table creation via upsert...');
      
      try {
        // This will either work (if table exists) or force Supabase to create it
        const { error: upsertError } = await supabase
          .from('operators')
          .upsert({
            id: 'FORCE_CREATE',
            name: 'Force Table Creation',
            certificate: 'Test',
            established: 2020,
            headquarters: 'Test',
            fleet_size: 0,
            safety_rating: 'Test',
            insurance: 'Test',
            certifications: [],
            contact_email: 'test@test.com',
            contact_phone: '555-0000',
            operating_bases: []
          }, { onConflict: 'id' });
        
        if (upsertError) {
          console.log('📝 Table creation needed. Error details:', upsertError.message);
          console.log('🎯 This confirms the table needs to be created manually.');
          return false;
        } else {
          console.log('✅ Operators table exists and working!');
          
          // Now try aircraft table
          const { error: aircraftError } = await supabase
            .from('aircraft')
            .upsert({
              id: 'FORCE_CREATE',
              registration_number: 'TEST123',
              model: 'Test Aircraft',
              manufacturer: 'Test',
              category: 'Test',
              subcategory: 'Test',
              year_of_manufacture: 2020,
              max_passengers: 4,
              cruise_speed: 400,
              range: 1000,
              hourly_rate: 5000,
              operator_id: 'FORCE_CREATE',
              operator_name: 'Test Operator',
              base_airport: 'KTEST',
              amenities: [],
              images: [],
              certifications: []
            }, { onConflict: 'id' });
          
          if (aircraftError) {
            console.log('📝 Aircraft table creation needed:', aircraftError.message);
            return false;
          } else {
            console.log('✅ Aircraft table exists and working!');
            return true;
          }
        }
      } catch (error) {
        console.log('❌ Force creation failed:', error);
        return false;
      }
    }
    
    return true;
    
  } catch (error) {
    console.error('❌ Error in table creation:', error);
    return false;
  }
}

/**
 * Run the creation
 */
if (require.main === module) {
  createViaInsert()
    .then((success) => {
      if (success) {
        console.log('✅ Tables are ready!');
        process.exit(0);
      } else {
        console.log('❌ Manual intervention required');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Creation failed:', error);
      process.exit(1);
    });
}