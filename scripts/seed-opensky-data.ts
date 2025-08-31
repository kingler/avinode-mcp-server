#!/usr/bin/env ts-node
/**
 * OpenSky Network Data Seeding Script
 * Fetches real aircraft data and populates the Supabase database
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
 * Create operators from unique operator names in aircraft data
 */
async function createOperators(aircraft: ProcessedAircraft[]): Promise<Map<string, string>> {
  const uniqueOperators = [...new Set(aircraft.map(a => a.operator))];
  const operatorMap = new Map<string, string>();
  
  console.log(`Creating ${uniqueOperators.length} operators...`);
  
  for (let i = 0; i < uniqueOperators.length; i++) {
    const operatorName = uniqueOperators[i];
    const operatorId = `OP${(i + 100).toString().padStart(3, '0')}`;
    
    const operatorData = {
      id: operatorId,
      name: operatorName,
      certificate: `Part 135 (DOT-${operatorId})`,
      established: 2000 + Math.floor(Math.random() * 24), // Random year between 2000-2024
      headquarters: getRandomHeadquarters(),
      operating_bases: [getRandomBase(), getRandomBase()],
      fleet_size: Math.floor(Math.random() * 20) + 5,
      safety_rating: getRandomSafetyRating(),
      insurance: '$100M liability coverage',
      certifications: ['ARGUS Gold', 'IS-BAO Stage 2'],
      contact_email: `ops@${operatorName.toLowerCase().replace(/\s+/g, '')}.com`,
      contact_phone: `+1-${Math.floor(Math.random() * 900) + 100}-555-${Math.floor(Math.random() * 9000) + 1000}`,
      website: `www.${operatorName.toLowerCase().replace(/\s+/g, '')}.com`,
      description: `Professional charter operator specializing in ${getRandomSpecialty()}.`
    };
    
    // Insert or update operator
    const { error } = await supabase
      .from('operators')
      .upsert(operatorData, { onConflict: 'id' });
    
    if (error) {
      console.error(`Error creating operator ${operatorName}:`, error.message);
    } else {
      operatorMap.set(operatorName, operatorId);
    }
  }
  
  console.log(`Created ${operatorMap.size} operators`);
  return operatorMap;
}

/**
 * Insert aircraft data into the database
 */
async function insertAircraftData(aircraft: ProcessedAircraft[], operatorMap: Map<string, string>): Promise<void> {
  console.log(`Inserting ${aircraft.length} aircraft...`);
  
  const aircraftData = aircraft.map((ac, index) => {
    const aircraftId = `ACF${(index + 1000).toString().padStart(3, '0')}`;
    const operatorId = operatorMap.get(ac.operator) || 'OP001';
    
    return {
      id: aircraftId,
      registration_number: ac.registration,
      model: ac.model,
      manufacturer: ac.manufacturer,
      category: mapCategoryName(ac.category),
      subcategory: ac.category,
      year_of_manufacture: getCurrentYear() - Math.floor(Math.random() * 15), // 0-15 years old
      max_passengers: ac.maxPassengers,
      cruise_speed: Math.floor(Math.random() * 200) + 400, // 400-600 knots
      range: Math.floor(Math.random() * 2000) + 1500, // 1500-3500 nm
      hourly_rate: ac.hourlyRate,
      operator_id: operatorId,
      operator_name: ac.operator,
      base_airport: ac.homeBase,
      availability: getRandomAvailability(),
      amenities: getRandomAmenities(),
      images: ac.images,
      certifications: ['FAA Certified', 'Annual Inspection Current'],
      wifi_available: Math.random() > 0.2, // 80% have WiFi
      pet_friendly: Math.random() > 0.5, // 50% are pet-friendly
      smoking_allowed: Math.random() > 0.8, // 20% allow smoking
      
      // OpenSky Network fields
      icao24: ac.icao24.toLowerCase(),
      callsign: ac.callsign,
      current_latitude: ac.latitude,
      current_longitude: ac.longitude,
      current_altitude: ac.altitude,
      current_velocity: ac.velocity,
      on_ground: ac.onGround,
      last_position_update: ac.lastSeen.toISOString(),
      opensky_category: getCategoryNumber(ac.category)
    };
  });
  
  // Insert in batches to avoid timeout
  const batchSize = 10;
  for (let i = 0; i < aircraftData.length; i += batchSize) {
    const batch = aircraftData.slice(i, i + batchSize);
    
    const { error } = await supabase
      .from('aircraft')
      .upsert(batch, { onConflict: 'icao24' });
    
    if (error) {
      console.error(`Error inserting aircraft batch ${i / batchSize + 1}:`, error.message);
    } else {
      console.log(`Inserted aircraft batch ${i / batchSize + 1}/${Math.ceil(aircraftData.length / batchSize)}`);
    }
  }
  
  console.log(`Successfully inserted ${aircraftData.length} aircraft`);
}

/**
 * Helper functions
 */
function getRandomHeadquarters(): string {
  const cities = ['New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Miami, FL', 'Las Vegas, NV', 'Boston, MA'];
  return cities[Math.floor(Math.random() * cities.length)];
}

function getRandomBase(): string {
  const bases = ['KTEB', 'KJFK', 'KLAX', 'KBOS', 'KPBI', 'KLAS', 'KPHX', 'KSNA'];
  return bases[Math.floor(Math.random() * bases.length)];
}

function getRandomSafetyRating(): string {
  const ratings = ['ARGUS Gold', 'ARGUS Platinum', 'Wyvern Wingman', 'IS-BAO Stage 2', 'IS-BAO Stage 3'];
  return ratings[Math.floor(Math.random() * ratings.length)];
}

function getRandomSpecialty(): string {
  const specialties = [
    'business aviation services',
    'luxury charter flights',
    'corporate transportation',
    'executive travel solutions',
    'VIP charter services'
  ];
  return specialties[Math.floor(Math.random() * specialties.length)];
}

function mapCategoryName(category: string): string {
  const mapping: Record<string, string> = {
    'Light': 'Light Jet',
    'Small': 'Light Jet',
    'Large': 'Heavy Jet',
    'High Vortex Large': 'Ultra Long Range',
    'Heavy': 'Ultra Long Range',
    'High Performance': 'Super Midsize Jet',
    'Rotorcraft': 'Helicopter'
  };
  return mapping[category] || 'Midsize Jet';
}

function getRandomAvailability(): 'Available' | 'OnRequest' | 'Unavailable' {
  const rand = Math.random();
  if (rand < 0.7) return 'Available';
  if (rand < 0.9) return 'OnRequest';
  return 'Unavailable';
}

function getRandomAmenities(): string[] {
  const allAmenities = [
    'WiFi', 'Entertainment System', 'Full Galley', 'Lavatory',
    'Conference Table', 'Sleeping Configuration', 'Refreshment Center',
    'Baggage Compartment', 'Air Phone'
  ];
  
  // Randomly select 3-6 amenities
  const count = Math.floor(Math.random() * 4) + 3;
  const shuffled = allAmenities.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function getCategoryNumber(category: string): number {
  const mapping: Record<string, number> = {
    'Unknown': 0,
    'Light': 1,
    'Small': 2,
    'Large': 3,
    'High Vortex Large': 4,
    'Heavy': 5,
    'High Performance': 6,
    'Rotorcraft': 7
  };
  return mapping[category] || 1;
}

function getCurrentYear(): number {
  return new Date().getFullYear();
}

/**
 * Main seeding function
 */
async function seedOpenSkyData() {
  try {
    console.log('🛩️  Starting OpenSky Network data seeding...');
    console.log('📡 Fetching aircraft data from OpenSky Network...');
    
    // Fetch data for USA region (more private jets)
    const aircraftData = await getProcessedAircraftData('usa');
    
    if (aircraftData.length === 0) {
      console.log('⚠️  No aircraft data received. This could be due to:');
      console.log('   - API rate limits');
      console.log('   - No aircraft in the specified region');
      console.log('   - Network connectivity issues');
      return;
    }
    
    console.log(`✅ Successfully fetched ${aircraftData.length} aircraft`);
    
    // Create operators first
    const operatorMap = await createOperators(aircraftData);
    
    // Insert aircraft data
    await insertAircraftData(aircraftData, operatorMap);
    
    console.log('🎉 OpenSky Network data seeding completed successfully!');
    console.log(`📊 Summary: ${operatorMap.size} operators, ${aircraftData.length} aircraft`);
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

/**
 * Run the seeding script
 */
if (require.main === module) {
  seedOpenSkyData()
    .then(() => {
      console.log('Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export { seedOpenSkyData };