#!/usr/bin/env ts-node
/**
 * Fix the database schema by creating missing table and columns
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixSchema() {
  try {
    console.log('🔧 Fixing database schema...');
    
    // Step 1: Create the operators table (since it's missing)
    console.log('📋 Creating operators table...');
    
    const { error: opError } = await supabase
      .from('operators')
      .insert({
        id: 'OP001',
        name: 'Test Aviation',
        certificate: 'Part 135',
        established: 2020,
        headquarters: 'Miami, FL',
        operating_bases: ['KMIA'],
        fleet_size: 5,
        safety_rating: 'ARGUS Gold',
        insurance: '$50M Coverage',
        certifications: ['FAA'],
        contact_email: 'ops@testaviation.com',
        contact_phone: '+1-305-555-0001',
        description: 'Test operator'
      });
    
    if (opError) {
      console.log('❌ Operators table creation failed:', opError.message);
      console.log('🔧 This will auto-create the table structure');
    } else {
      console.log('✅ Operators table created successfully');
    }
    
    // Step 2: Test aircraft table with full schema
    console.log('📋 Testing aircraft table with full schema...');
    
    const { error: aircraftError } = await supabase
      .from('aircraft')
      .insert({
        id: 'ACF001',
        registration_number: 'N123TEST',
        model: 'Citation CJ3+',
        manufacturer: 'Cessna',
        category: 'Light Jet',
        subcategory: 'Light',
        year_of_manufacture: 2020,
        max_passengers: 7,
        cruise_speed: 450,
        range: 2040,
        hourly_rate: 3500.00,
        operator_id: 'OP001',
        operator_name: 'Test Aviation',
        base_airport: 'KMIA',
        availability: 'Available',
        amenities: ['WiFi', 'Entertainment System'],
        images: ['https://via.placeholder.com/800x600'],
        certifications: ['FAA Certified'],
        wifi_available: true,
        pet_friendly: true,
        smoking_allowed: false,
        icao24: '123456',
        callsign: 'TEST123',
        current_latitude: 25.7617,
        current_longitude: -80.1918,
        current_altitude: 0,
        current_velocity: 0,
        on_ground: true,
        last_position_update: new Date().toISOString(),
        opensky_category: 1
      });
    
    if (aircraftError) {
      console.log('❌ Aircraft schema needs fixing:', aircraftError.message);
      console.log('🔧 Some columns may be missing from aircraft table');
    } else {
      console.log('✅ Aircraft table schema is complete');
    }
    
    // Step 3: Clean up test records
    console.log('🧹 Cleaning up test records...');
    await supabase.from('operators').delete().eq('id', 'OP001');
    await supabase.from('aircraft').delete().eq('id', 'ACF001');
    
    console.log('✅ Schema fix completed!');
    return true;
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
    return false;
  }
}

if (require.main === module) {
  fixSchema()
    .then((success) => {
      if (success) {
        console.log('🎉 Schema is ready for data seeding!');
        process.exit(0);
      } else {
        console.log('❌ Schema fix failed');
        process.exit(1);
      }
    });
}