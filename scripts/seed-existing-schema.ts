#!/usr/bin/env ts-node
/**
 * Seed OpenSky Network data into existing JetVision database schema
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { getProcessedAircraftData, ProcessedAircraft } from '../src/lib/opensky-integration';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Map OpenSky aircraft data to existing JetVision schema
 */
function mapToJetVisionSchema(aircraft: ProcessedAircraft) {
  return {
    avainode_id: aircraft.icao24, // Use ICAO24 as unique identifier
    tail_number: aircraft.registration,
    manufacturer: aircraft.manufacturer,
    model: aircraft.model,
    category: aircraft.category,
    max_passengers: aircraft.maxPassengers,
    range: Math.round(aircraft.hourlyRate * 8), // Estimate range from hourly rate
    speed: aircraft.velocity ? Math.round(aircraft.velocity * 1.94384) : 450, // Convert m/s to knots
    home_base: aircraft.homeBase,
    hourly_rate: aircraft.hourlyRate,
    availability: {
      status: 'available',
      last_updated: new Date().toISOString()
    },
    specifications: {
      icao24: aircraft.icao24,
      callsign: aircraft.callsign,
      operator: aircraft.operator,
      current_position: aircraft.latitude && aircraft.longitude ? {
        latitude: aircraft.latitude,
        longitude: aircraft.longitude,
        altitude: aircraft.altitude,
        on_ground: aircraft.onGround,
        last_seen: aircraft.lastSeen
      } : null,
      opensky_category: 1
    },
    images: aircraft.images
  };
}

async function seedExistingDatabase() {
  try {
    console.log('🛩️  Seeding JetVision database with OpenSky Network data...');
    
    // Check existing aircraft count
    const { count: existingCount } = await supabase
      .from('aircraft')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Current aircraft in database: ${existingCount}`);
    
    // Fetch OpenSky data
    console.log('📡 Fetching live aircraft data from OpenSky Network...');
    const openSkyAircraft = await getProcessedAircraftData('usa');
    
    console.log(`✈️  Processing ${openSkyAircraft.length} aircraft for database insertion...`);
    
    // Map to JetVision schema
    const mappedAircraft = openSkyAircraft.map(mapToJetVisionSchema);
    
    // Insert in batches of 10
    let inserted = 0;
    let skipped = 0;
    
    for (let i = 0; i < mappedAircraft.length; i += 10) {
      const batch = mappedAircraft.slice(i, i + 10);
      
      console.log(`📝 Inserting batch ${Math.floor(i/10) + 1}/${Math.ceil(mappedAircraft.length/10)}...`);
      
      const { data, error } = await supabase
        .from('aircraft')
        .upsert(batch, { 
          onConflict: 'avainode_id',
          ignoreDuplicates: false
        })
        .select('id, tail_number');
      
      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i/10) + 1}:`, error.message);
        skipped += batch.length;
      } else {
        console.log(`✅ Inserted ${data?.length || 0} aircraft in batch ${Math.floor(i/10) + 1}`);
        inserted += data?.length || 0;
      }
      
      // Rate limiting - wait 500ms between batches
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Final count check
    const { count: finalCount } = await supabase
      .from('aircraft')
      .select('*', { count: 'exact', head: true });
    
    console.log('🎉 OpenSky Network data seeding completed!');
    console.log(`📊 Final Summary:`);
    console.log(`   • Aircraft inserted: ${inserted}`);
    console.log(`   • Aircraft skipped: ${skipped}`);
    console.log(`   • Total aircraft in database: ${finalCount}`);
    console.log(`   • Database growth: ${(finalCount || 0) - (existingCount || 0)} new records`);
    
    if (finalCount && finalCount > 0) {
      console.log('✅ Database successfully seeded with real aviation data!');
      console.log('🚀 MCP server ready to serve real aircraft data');
      
      // Show sample of inserted data
      const { data: sampleAircraft } = await supabase
        .from('aircraft')
        .select('tail_number, manufacturer, model, category, home_base')
        .limit(3);
      
      if (sampleAircraft && sampleAircraft.length > 0) {
        console.log('\n📋 Sample aircraft in database:');
        sampleAircraft.forEach((ac, i) => {
          console.log(`   ${i + 1}. ${ac.tail_number} - ${ac.manufacturer} ${ac.model} (${ac.category}) @ ${ac.home_base}`);
        });
      }
      
      return true;
    } else {
      console.log('⚠️  No aircraft found in database after seeding');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return false;
  }
}

/**
 * Run the seeding script
 */
if (require.main === module) {
  seedExistingDatabase()
    .then((success) => {
      if (success) {
        console.log('\n🎯 Next Steps:');
        console.log('1. Test MCP server: npm run dev');
        console.log('2. Enhance photos: npm run enhance:images');
        console.log('3. Use in N8N workflows with real data');
        process.exit(0);
      } else {
        console.log('❌ Seeding failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Seeding execution failed:', error);
      process.exit(1);
    });
}