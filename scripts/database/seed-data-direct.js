#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedDatabase() {
  console.log('🚀 Starting direct database seeding...\n');
  
  try {
    // =====================================================
    // AIRPORTS
    // =====================================================
    console.log('✈️  Seeding airports...');
    
    const airports = [
      // North America
      { icao_code: 'KJFK', iata_code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781, elevation_ft: 13, timezone: 'America/New_York', runway_count: 4, max_runway_length_ft: 14511 },
      { icao_code: 'KLAX', iata_code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.9425, longitude: -118.4081, elevation_ft: 125, timezone: 'America/Los_Angeles', runway_count: 4, max_runway_length_ft: 12091 },
      { icao_code: 'KTEB', iata_code: 'TEB', name: 'Teterboro Airport', city: 'Teterboro', country: 'United States', latitude: 40.8501, longitude: -74.0606, elevation_ft: 9, timezone: 'America/New_York', runway_count: 2, max_runway_length_ft: 7000 },
      { icao_code: 'KPBI', iata_code: 'PBI', name: 'Palm Beach International Airport', city: 'West Palm Beach', country: 'United States', latitude: 26.6832, longitude: -80.0956, elevation_ft: 19, timezone: 'America/New_York', runway_count: 3, max_runway_length_ft: 10008 },
      { icao_code: 'KORD', iata_code: 'ORD', name: 'Chicago O\'Hare International Airport', city: 'Chicago', country: 'United States', latitude: 41.9742, longitude: -87.9073, elevation_ft: 672, timezone: 'America/Chicago', runway_count: 8, max_runway_length_ft: 13000 },
      { icao_code: 'KBOS', iata_code: 'BOS', name: 'Logan International Airport', city: 'Boston', country: 'United States', latitude: 42.3656, longitude: -71.0096, elevation_ft: 20, timezone: 'America/New_York', runway_count: 6, max_runway_length_ft: 10083 },
      { icao_code: 'KMIA', iata_code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', latitude: 25.7959, longitude: -80.2870, elevation_ft: 8, timezone: 'America/New_York', runway_count: 4, max_runway_length_ft: 13016 },
      { icao_code: 'KLAS', iata_code: 'LAS', name: 'Harry Reid International Airport', city: 'Las Vegas', country: 'United States', latitude: 36.0840, longitude: -115.1537, elevation_ft: 2181, timezone: 'America/Los_Angeles', runway_count: 4, max_runway_length_ft: 14511 },
      { icao_code: 'KSEA', iata_code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States', latitude: 47.4502, longitude: -122.3088, elevation_ft: 433, timezone: 'America/Los_Angeles', runway_count: 3, max_runway_length_ft: 11901 },
      { icao_code: 'KDEN', iata_code: 'DEN', name: 'Denver International Airport', city: 'Denver', country: 'United States', latitude: 39.8617, longitude: -104.6731, elevation_ft: 5431, timezone: 'America/Denver', runway_count: 6, max_runway_length_ft: 16000 },
      // Europe
      { icao_code: 'EGLL', iata_code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543, elevation_ft: 83, timezone: 'Europe/London', runway_count: 2, max_runway_length_ft: 12799 },
      { icao_code: 'LFPG', iata_code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479, elevation_ft: 392, timezone: 'Europe/Paris', runway_count: 4, max_runway_length_ft: 13123 },
      { icao_code: 'EDDF', iata_code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', latitude: 50.0379, longitude: 8.5622, elevation_ft: 364, timezone: 'Europe/Berlin', runway_count: 4, max_runway_length_ft: 13123 },
      { icao_code: 'LIRF', iata_code: 'FCO', name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'Italy', latitude: 41.8003, longitude: 12.2389, elevation_ft: 15, timezone: 'Europe/Rome', runway_count: 4, max_runway_length_ft: 12795 },
      { icao_code: 'LEMD', iata_code: 'MAD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', latitude: 40.4839, longitude: -3.5680, elevation_ft: 2001, timezone: 'Europe/Madrid', runway_count: 4, max_runway_length_ft: 14108 },
      // Business Aviation Hubs
      { icao_code: 'KFRG', iata_code: 'FRG', name: 'Republic Airport', city: 'Farmingdale', country: 'United States', latitude: 40.7288, longitude: -73.4134, elevation_ft: 82, timezone: 'America/New_York', runway_count: 3, max_runway_length_ft: 5516 },
      { icao_code: 'KVNY', iata_code: 'VNY', name: 'Van Nuys Airport', city: 'Van Nuys', country: 'United States', latitude: 34.2098, longitude: -118.4898, elevation_ft: 802, timezone: 'America/Los_Angeles', runway_count: 2, max_runway_length_ft: 8001 },
      { icao_code: 'EGKA', iata_code: 'ESH', name: 'Shoreham Airport', city: 'Brighton', country: 'United Kingdom', latitude: 50.8356, longitude: -0.2972, elevation_ft: 7, timezone: 'Europe/London', runway_count: 2, max_runway_length_ft: 2815 },
      { icao_code: 'LFMD', iata_code: 'CCF', name: 'Cannes-Mandelieu Airport', city: 'Cannes', country: 'France', latitude: 43.5420, longitude: 7.0172, elevation_ft: 13, timezone: 'Europe/Paris', runway_count: 2, max_runway_length_ft: 4593 },
      { icao_code: 'LSGG', iata_code: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', latitude: 46.2381, longitude: 6.1089, elevation_ft: 1411, timezone: 'Europe/Zurich', runway_count: 2, max_runway_length_ft: 12795 }
    ];

    const { error: airportsError } = await supabase
      .from('airports')
      .upsert(airports, { onConflict: 'icao_code' });
    
    if (airportsError) {
      console.error('❌ Error seeding airports:', airportsError);
    } else {
      console.log(`✅ Seeded ${airports.length} airports`);
    }

    // =====================================================
    // EMPTY LEGS
    // =====================================================
    console.log('🛩️  Seeding empty legs...');
    
    // Get some aircraft for empty legs
    const { data: aircraftList } = await supabase
      .from('aircraft')
      .select('id, passenger_capacity')
      .limit(10);

    if (aircraftList && aircraftList.length > 0) {
      const emptyLegs = [];
      const airportCodes = ['KJFK', 'KLAX', 'KTEB', 'KBOS', 'KMIA', 'EGLL', 'LFPG', 'LSGG'];
      
      for (let i = 0; i < 25; i++) {
        const aircraft = aircraftList[Math.floor(Math.random() * aircraftList.length)];
        const depAirport = airportCodes[Math.floor(Math.random() * airportCodes.length)];
        let arrAirport = airportCodes[Math.floor(Math.random() * airportCodes.length)];
        while (arrAirport === depAirport) {
          arrAirport = airportCodes[Math.floor(Math.random() * airportCodes.length)];
        }
        
        const departureTime = new Date();
        departureTime.setDate(departureTime.getDate() + Math.floor(Math.random() * 30) + 1);
        
        const originalPrice = Math.random() * 25000 + 5000;
        const discountedPrice = originalPrice * (0.4 + Math.random() * 0.4); // 40-80% of original
        
        emptyLegs.push({
          aircraft_id: aircraft.id,
          departure_airport: depAirport,
          arrival_airport: arrAirport,
          departure_time: departureTime.toISOString(),
          estimated_duration_minutes: Math.floor(Math.random() * 300) + 60,
          original_price_usd: Math.round(originalPrice * 100) / 100,
          discounted_price_usd: Math.round(discountedPrice * 100) / 100,
          availability_status: ['available', 'reserved', 'expired'][Math.floor(Math.random() * 3)],
          passenger_capacity: aircraft.passenger_capacity,
          booking_deadline: new Date(departureTime.getTime() - 24 * 60 * 60 * 1000).toISOString(),
          special_notes: ['Catering available upon request', 'Pet-friendly flight', 'Ground transportation can be arranged', 'Flexible departure time within 2-hour window'][Math.floor(Math.random() * 4)]
        });
      }

      const { error: emptyLegsError } = await supabase
        .from('empty_legs')
        .insert(emptyLegs);
      
      if (emptyLegsError) {
        console.error('❌ Error seeding empty legs:', emptyLegsError);
      } else {
        console.log(`✅ Seeded ${emptyLegs.length} empty legs`);
      }
    }

    // =====================================================
    // CUSTOMER PREFERENCES
    // =====================================================
    console.log('👥 Seeding customer preferences...');
    
    const customerPreferences = [
      {
        customer_email: 'john.executive@corp.com',
        preferred_aircraft_category: 'Heavy Jet',
        preferred_departure_times: ['morning', 'afternoon'],
        catering_preferences: ['gourmet', 'dietary_restrictions'],
        ground_transportation: 'luxury_car',
        special_requests: 'Extra baggage space for golf clubs',
        booking_frequency: 24,
        average_spend_usd: 45000.00,
        loyalty_tier: 'platinum',
        last_booking_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        customer_email: 'sarah.ceo@startup.com',
        preferred_aircraft_category: 'Midsize Jet',
        preferred_departure_times: ['early_morning', 'late_evening'],
        catering_preferences: ['healthy', 'quick'],
        ground_transportation: 'standard_car',
        special_requests: 'Pet-friendly flights',
        booking_frequency: 18,
        average_spend_usd: 32000.00,
        loyalty_tier: 'gold',
        last_booking_date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        customer_email: 'michael.investor@fund.com',
        preferred_aircraft_category: 'Ultra Long Range',
        preferred_departure_times: ['flexible'],
        catering_preferences: ['premium', 'wine_selection'],
        ground_transportation: 'luxury_car',
        special_requests: 'Meeting setup onboard',
        booking_frequency: 32,
        average_spend_usd: 78000.00,
        loyalty_tier: 'platinum',
        last_booking_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        customer_email: 'lisa.director@pharma.com',
        preferred_aircraft_category: 'Super Midsize Jet',
        preferred_departure_times: ['morning', 'early_afternoon'],
        catering_preferences: ['standard', 'vegetarian_options'],
        ground_transportation: 'standard_car',
        special_requests: 'Wi-Fi required for video calls',
        booking_frequency: 15,
        average_spend_usd: 38000.00,
        loyalty_tier: 'gold',
        last_booking_date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        customer_email: 'david.founder@tech.com',
        preferred_aircraft_category: 'Light Jet',
        preferred_departure_times: ['late_morning', 'afternoon'],
        catering_preferences: ['casual', 'healthy'],
        ground_transportation: 'ride_share',
        special_requests: 'Minimal formalities preferred',
        booking_frequency: 12,
        average_spend_usd: 22000.00,
        loyalty_tier: 'silver',
        last_booking_date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    const { error: customerPrefsError } = await supabase
      .from('customer_preferences')
      .upsert(customerPreferences, { onConflict: 'customer_email' });
    
    if (customerPrefsError) {
      console.error('❌ Error seeding customer preferences:', customerPrefsError);
    } else {
      console.log(`✅ Seeded ${customerPreferences.length} customer preferences`);
    }

    // =====================================================
    // COMPETITIVE FEATURES
    // =====================================================
    console.log('🏢 Seeding competitive features...');
    
    const competitiveFeatures = [
      {
        competitor_name: 'NetJets',
        feature_category: 'Fleet Management',
        feature_name: 'Guaranteed Aircraft Availability',
        feature_description: 'Guaranteed aircraft availability with 10-hour notice',
        our_capability: 'partial',
        competitor_capability: 'full',
        competitive_advantage: 'established_fractional_model',
        importance_score: 9,
        last_updated: new Date().toISOString()
      },
      {
        competitor_name: 'Flexjet',
        feature_category: 'Aircraft Quality',
        feature_name: 'Red Label Fleet',
        feature_description: 'Premium aircraft with enhanced interiors and amenities',
        our_capability: 'standard',
        competitor_capability: 'premium',
        competitive_advantage: 'luxury_positioning',
        importance_score: 8,
        last_updated: new Date().toISOString()
      },
      {
        competitor_name: 'VistaJet',
        feature_category: 'Global Coverage',
        feature_name: 'Worldwide Network',
        feature_description: 'Global fleet with consistent service standards',
        our_capability: 'regional',
        competitor_capability: 'global',
        competitive_advantage: 'established_international_presence',
        importance_score: 9,
        last_updated: new Date().toISOString()
      },
      {
        competitor_name: 'Wheels Up',
        feature_category: 'Technology Platform',
        feature_name: 'Mobile App Experience',
        feature_description: 'Comprehensive mobile app with booking and flight tracking',
        our_capability: 'basic',
        competitor_capability: 'advanced',
        competitive_advantage: 'user_experience_focus',
        importance_score: 7,
        last_updated: new Date().toISOString()
      },
      {
        competitor_name: 'XO',
        feature_category: 'Pricing Model',
        feature_name: 'Dynamic Pricing',
        feature_description: 'Real-time pricing based on demand and availability',
        our_capability: 'static',
        competitor_capability: 'dynamic',
        competitive_advantage: 'revenue_optimization',
        importance_score: 6,
        last_updated: new Date().toISOString()
      }
    ];

    const { error: competitiveFeaturesError } = await supabase
      .from('competitive_features')
      .insert(competitiveFeatures);
    
    if (competitiveFeaturesError) {
      console.error('❌ Error seeding competitive features:', competitiveFeaturesError);
    } else {
      console.log(`✅ Seeded ${competitiveFeatures.length} competitive features`);
    }

    // =====================================================
    // VERIFICATION
    // =====================================================
    console.log('\n🔍 Verifying seeded data...\n');
    
    const tables = ['airports', 'empty_legs', 'customer_preferences', 'competitive_features'];
    
    for (const tableName of tables) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        const recordCount = error ? 'ERROR' : (count || 0);
        const status = error ? '❌' : (count > 0 ? '✅' : '⚠️');
        
        console.log(`${status} ${tableName.padEnd(25)}: ${recordCount} records`);
        
      } catch (error) {
        console.log(`❌ ${tableName.padEnd(25)}: Verification failed`);
      }
    }
    
    console.log('\n🎯 Partial database seeding complete!');
    console.log('ℹ️  Note: Some tables may require schema adjustments before full seeding');

  } catch (error) {
    console.error('💥 Fatal error during seeding:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  seedDatabase().catch(console.error);
}

module.exports = { seedDatabase };