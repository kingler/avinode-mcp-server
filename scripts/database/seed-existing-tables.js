#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedExistingTables() {
  console.log('🚀 Seeding existing aviation marketplace tables...\n');

  try {
    // Check which tables exist and add more data to existing ones
    
    // =====================================================
    // OPERATORS - Add more operators (currently has 3)
    // =====================================================
    console.log('🏢 Adding more operators...');
    
    const newOperators = [
      {
        name: 'SkyLux Aviation',
        code: 'SLA',
        base_location: 'Miami, FL',
        contact_email: 'ops@skylux.com',
        contact_phone: '+1-555-0201',
        rating: 4.7,
        fleet_size: 15,
        years_in_business: 18
      },
      {
        name: 'Elite Jet Services',
        code: 'EJS',
        base_location: 'Las Vegas, NV',
        contact_email: 'charter@elitejet.com',
        contact_phone: '+1-555-0202',
        rating: 4.5,
        fleet_size: 10,
        years_in_business: 8
      },
      {
        name: 'Platinum Air Charter',
        code: 'PAC',
        base_location: 'Chicago, IL',
        contact_email: 'booking@platinumair.com',
        contact_phone: '+1-555-0203',
        rating: 4.9,
        fleet_size: 22,
        years_in_business: 25
      },
      {
        name: 'Global Wings Aviation',
        code: 'GWA',
        base_location: 'Denver, CO',
        contact_email: 'info@globalwings.com',
        contact_phone: '+1-555-0204',
        rating: 4.6,
        fleet_size: 18,
        years_in_business: 14
      },
      {
        name: 'Meridian Charter Group',
        code: 'MCG',
        base_location: 'Boston, MA',
        contact_email: 'operations@meridiangroup.com',
        contact_phone: '+1-555-0205',
        rating: 4.8,
        fleet_size: 12,
        years_in_business: 20
      }
    ];

    const { data: operatorResult, error: operatorError } = await supabase
      .from('operators')
      .insert(newOperators)
      .select();

    if (operatorError) {
      console.error('❌ Operators error:', operatorError.message);
    } else {
      console.log(`✅ Successfully added ${operatorResult.length} new operators`);
    }

    // =====================================================
    // CHARTER REQUESTS - Add more requests (currently has 3)
    // =====================================================
    console.log('✈️  Adding more charter requests...');
    
    const newCharterRequests = [
      {
        departure_airport: 'KJFK',
        arrival_airport: 'KMIA',
        departure_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        return_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days from now
        passenger_count: 6,
        aircraft_category: 'Midsize Jet',
        status: 'pending',
        total_cost: 28500.00,
        customer_email: 'exec@company1.com',
        customer_phone: '+1-555-1001',
        special_requirements: 'Catering for business meeting'
      },
      {
        departure_airport: 'KLAX',
        arrival_airport: 'KLAS',
        departure_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        passenger_count: 4,
        aircraft_category: 'Light Jet',
        status: 'confirmed',
        total_cost: 12800.00,
        customer_email: 'travel@startup.com',
        customer_phone: '+1-555-1002',
        special_requirements: 'Pet-friendly flight required'
      },
      {
        departure_airport: 'KTEB',
        arrival_airport: 'KPBI',
        departure_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        return_date: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000).toISOString(),
        passenger_count: 10,
        aircraft_category: 'Heavy Jet',
        status: 'quoted',
        total_cost: 65200.00,
        customer_email: 'ceo@enterprise.com',
        customer_phone: '+1-555-1003',
        special_requirements: 'Executive conference setup onboard'
      },
      {
        departure_airport: 'KORD',
        arrival_airport: 'KSEA',
        departure_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        passenger_count: 8,
        aircraft_category: 'Super Midsize Jet',
        status: 'pending',
        total_cost: 38900.00,
        customer_email: 'planning@corporation.com',
        customer_phone: '+1-555-1004',
        special_requirements: 'Flexible departure time within 3-hour window'
      },
      {
        departure_airport: 'KBOS',
        arrival_airport: 'KJFK',
        departure_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        passenger_count: 2,
        aircraft_category: 'Light Jet',
        status: 'completed',
        total_cost: 8500.00,
        customer_email: 'vip@client.com',
        customer_phone: '+1-555-1005',
        special_requirements: 'Ground transportation arranged'
      },
      {
        departure_airport: 'KMIA',
        arrival_airport: 'KTEB',
        departure_date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000).toISOString(),
        passenger_count: 12,
        aircraft_category: 'Ultra Long Range',
        status: 'pending',
        total_cost: 89500.00,
        customer_email: 'travel@investment.com',
        customer_phone: '+1-555-1006',
        special_requirements: 'International catering and customs clearance'
      }
    ];

    const { data: charterResult, error: charterError } = await supabase
      .from('charter_requests')
      .insert(newCharterRequests)
      .select();

    if (charterError) {
      console.error('❌ Charter requests error:', charterError.message);
    } else {
      console.log(`✅ Successfully added ${charterResult.length} new charter requests`);
    }

    // =====================================================
    // Try to add data to other existing empty tables
    // =====================================================
    
    // Check if flight_logs exists and add data
    console.log('📝 Attempting to seed flight logs...');
    try {
      // Get some aircraft for flight logs
      const { data: aircraftList } = await supabase
        .from('aircraft')
        .select('id')
        .limit(10);

      if (aircraftList && aircraftList.length > 0) {
        const flightLogsData = [];
        const airports = ['KJFK', 'KLAX', 'KTEB', 'KMIA', 'KORD', 'KBOS', 'KLAS', 'KSEA'];
        
        for (let i = 0; i < 25; i++) {
          const aircraft = aircraftList[Math.floor(Math.random() * aircraftList.length)];
          const depAirport = airports[Math.floor(Math.random() * airports.length)];
          let arrAirport = airports[Math.floor(Math.random() * airports.length)];
          while (arrAirport === depAirport) {
            arrAirport = airports[Math.floor(Math.random() * airports.length)];
          }
          
          const departureTime = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000); // Last 90 days
          const flightDuration = Math.floor(Math.random() * 360) + 60; // 1-7 hours
          const arrivalTime = new Date(departureTime.getTime() + flightDuration * 60 * 1000);

          flightLogsData.push({
            aircraft_id: aircraft.id,
            departure_airport: depAirport,
            arrival_airport: arrAirport,
            departure_time: departureTime.toISOString(),
            arrival_time: arrivalTime.toISOString(),
            flight_duration_minutes: flightDuration,
            distance_nm: Math.floor(Math.random() * 2000) + 300,
            fuel_consumed_gallons: Math.floor(Math.random() * 1200) + 200,
            passengers_onboard: Math.floor(Math.random() * 10) + 1,
            crew_count: 2 + Math.floor(Math.random() * 2),
            flight_type: ['charter', 'positioning', 'maintenance'][Math.floor(Math.random() * 3)],
            flight_status: 'completed'
          });
        }

        const { data: flightResult, error: flightError } = await supabase
          .from('flight_logs')
          .insert(flightLogsData)
          .select();

        if (flightError) {
          console.error('❌ Flight logs error:', flightError.message);
        } else {
          console.log(`✅ Successfully added ${flightResult.length} flight logs`);
        }
      }
    } catch (error) {
      console.log('⚠️  Flight logs table may not exist or have schema issues');
    }

    // =====================================================
    // VERIFICATION
    // =====================================================
    console.log('\n🔍 Final Verification:\n');
    
    const existingTables = ['aircraft', 'operators', 'charter_requests', 'bookings'];
    
    for (const tableName of existingTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${tableName.padEnd(20)}: Error - ${error.message}`);
        } else {
          const status = count > 20 ? '✅' : count > 0 ? '⚠️' : '❌';
          console.log(`${status} ${tableName.padEnd(20)}: ${count} records`);
        }
      } catch (err) {
        console.log(`❌ ${tableName.padEnd(20)}: Check failed`);
      }
    }

    console.log('\n🎯 Successfully enhanced existing tables with additional data!');
    console.log('📊 Operators and Charter Requests now have sufficient test data');

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seedExistingTables().catch(console.error);
}

module.exports = { seedExistingTables };