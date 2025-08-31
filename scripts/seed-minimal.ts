#!/usr/bin/env ts-node
/**
 * Minimal seeding script that creates tables and inserts basic data
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function seedMinimal() {
  try {
    console.log('🌱 Starting minimal database seeding...');
    
    // Step 1: Create and insert one operator to establish the table
    console.log('👥 Creating operators table via insert...');
    const operatorData = {
      id: 'OP001',
      name: 'Elite Aviation',
      certificate: 'Part 135 (DOT-OP001)',
      established: 2010,
      headquarters: 'Miami, FL',
      contact_email: 'ops@eliteaviation.com',
      contact_phone: '+1-305-555-0001'
    };
    
    const { data: opData, error: opError } = await supabase
      .from('operators')
      .upsert(operatorData, { onConflict: 'id' })
      .select();
    
    if (opError) {
      console.log('❌ Operator creation error:', opError.message);
    } else {
      console.log('✅ Created operator:', opData?.[0]?.name);
    }
    
    // Step 2: Create minimal aircraft record to establish table structure
    console.log('✈️ Creating aircraft table via insert...');
    const aircraftData = {
      id: 'ACF001',
      registration_number: 'N123EL',
      model: 'Citation CJ3+',
      manufacturer: 'Cessna',
      category: 'Light Jet',
      subcategory: 'Light',
      year_of_manufacture: 2020,
      max_passengers: 7,
      cruise_speed: 450,
      range: 2040,
      hourly_rate: 3500,
      operator_id: 'OP001',
      operator_name: 'Elite Aviation',
      base_airport: 'KMIA'
    };
    
    const { data: acData, error: acError } = await supabase
      .from('aircraft')
      .upsert(aircraftData, { onConflict: 'id' })
      .select();
    
    if (acError) {
      console.log('❌ Aircraft creation error:', acError.message);
    } else {
      console.log('✅ Created aircraft:', acData?.[0]?.registration_number);
    }
    
    // Step 3: Check final counts
    const { count: opCount } = await supabase
      .from('operators')
      .select('*', { count: 'exact', head: true });
      
    const { count: acCount } = await supabase
      .from('aircraft')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Final counts: ${opCount} operators, ${acCount} aircraft`);
    
    if (opCount && opCount > 0 && acCount && acCount > 0) {
      console.log('✅ Minimal database setup successful!');
      console.log('🚀 Ready to test MCP server with basic data');
      return true;
    } else {
      console.log('❌ Database setup incomplete');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Minimal seeding error:', error);
    return false;
  }
}

if (require.main === module) {
  seedMinimal()
    .then((success) => {
      if (success) {
        console.log('🎉 Minimal seeding completed - ready for MCP server testing!');
        process.exit(0);
      } else {
        console.log('❌ Minimal seeding failed');
        process.exit(1);
      }
    });
}