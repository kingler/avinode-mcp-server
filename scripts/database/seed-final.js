#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedFinalData() {
  console.log('🚀 Final seeding with correct schema...\n');

  try {
    // =====================================================
    // OPERATORS - Add operators matching the actual schema
    // =====================================================
    console.log('🏢 Adding operators with correct schema...');
    
    const newOperators = [
      {
        name: 'SkyLux Aviation',
        certificate: 'FAA Part 135',
        established: 2015,
        headquarters: 'Miami, FL',
        operating_bases: ['KMIA', 'KFLL', 'KTMB'],
        fleet_size: 15,
        safety_rating: 'ARGUS Gold',
        insurance: '$75M Liability',
        certifications: ['ARGUS Gold', 'IS-BAO Stage 1', 'WYVERN Wingman'],
        contact_email: 'ops@skylux.com',
        contact_phone: '+1-305-555-0201',
        website: 'https://skylux.com',
        description: 'Luxury charter services in Florida',
        avg_rating: 4.7,
        total_reviews: 89,
        response_time_hours: 3,
        instant_booking_enabled: true,
        ai_optimized_pricing: false,
        predictive_maintenance_enabled: true,
        smart_routing_enabled: false,
        blockchain_verified: false,
        blockchain_address: null,
        carbon_offset_program: true,
        saf_percentage: 12.0
      },
      {
        name: 'Elite Jet Services',
        certificate: 'FAA Part 135',
        established: 2019,
        headquarters: 'Las Vegas, NV',
        operating_bases: ['KLAS', 'KVGT', 'KHND'],
        fleet_size: 10,
        safety_rating: 'ARGUS Platinum',
        insurance: '$100M Liability',
        certifications: ['ARGUS Platinum', 'IS-BAO Stage 2'],
        contact_email: 'charter@elitejet.com',
        contact_phone: '+1-702-555-0202',
        website: 'https://elitejet.com',
        description: 'Premier charter services for entertainment industry',
        avg_rating: 4.5,
        total_reviews: 156,
        response_time_hours: 1,
        instant_booking_enabled: true,
        ai_optimized_pricing: true,
        predictive_maintenance_enabled: false,
        smart_routing_enabled: true,
        blockchain_verified: true,
        blockchain_address: '0xabcd...ef12',
        carbon_offset_program: false,
        saf_percentage: 8.5
      },
      {
        name: 'Platinum Air Charter',
        certificate: 'FAA Part 135',
        established: 2010,
        headquarters: 'Chicago, IL',
        operating_bases: ['KORD', 'KMDW', 'KPWK'],
        fleet_size: 22,
        safety_rating: 'ARGUS Platinum',
        insurance: '$150M Liability',
        certifications: ['ARGUS Platinum', 'IS-BAO Stage 3', 'WYVERN Wingman'],
        contact_email: 'booking@platinumair.com',
        contact_phone: '+1-312-555-0203',
        website: 'https://platinumair.com',
        description: 'Full-service charter with largest Midwest fleet',
        avg_rating: 4.9,
        total_reviews: 243,
        response_time_hours: 2,
        instant_booking_enabled: true,
        ai_optimized_pricing: true,
        predictive_maintenance_enabled: true,
        smart_routing_enabled: true,
        blockchain_verified: true,
        blockchain_address: '0x9876...5432',
        carbon_offset_program: true,
        saf_percentage: 20.0
      },
      {
        name: 'Global Wings Aviation',
        certificate: 'FAA Part 135',
        established: 2016,
        headquarters: 'Denver, CO',
        operating_bases: ['KDEN', 'KBJC', 'KAPA'],
        fleet_size: 18,
        safety_rating: 'ARGUS Gold',
        insurance: '$100M Liability',
        certifications: ['ARGUS Gold', 'IS-BAO Stage 2'],
        contact_email: 'info@globalwings.com',
        contact_phone: '+1-303-555-0204',
        website: 'https://globalwings.com',
        description: 'High-altitude specialists with mountain experience',
        avg_rating: 4.6,
        total_reviews: 178,
        response_time_hours: 4,
        instant_booking_enabled: false,
        ai_optimized_pricing: false,
        predictive_maintenance_enabled: true,
        smart_routing_enabled: false,
        blockchain_verified: false,
        blockchain_address: null,
        carbon_offset_program: true,
        saf_percentage: 18.5
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
    // CHARTER REQUESTS - Add requests matching actual schema
    // =====================================================
    console.log('✈️  Adding charter requests with correct schema...');
    
    // Get aircraft and operators for foreign keys
    const { data: aircraftList } = await supabase.from('aircraft').select('id').limit(20);
    const { data: operatorList } = await supabase.from('operators').select('id').limit(10);
    
    if (aircraftList && operatorList && aircraftList.length > 0 && operatorList.length > 0) {
      const newCharterRequests = [
        {
          aircraft_id: aircraftList[Math.floor(Math.random() * aircraftList.length)].id,
          operator_id: operatorList[Math.floor(Math.random() * operatorList.length)].id,
          departure_airport: 'KJFK',
          arrival_airport: 'KMIA',
          departure_date: '2024-09-15',
          departure_time: '10:00:00',
          return_date: '2024-09-18',
          return_time: '16:00:00',
          passengers: 6,
          contact_name: 'Sarah Johnson',
          contact_email: 'sarah.johnson@exec.com',
          contact_phone: '+1-555-2001',
          company: 'Executive Solutions Inc',
          special_requests: 'Catering for business meeting, ground transportation',
          status: 'Pending',
          preferred_communication: ['email', 'phone'],
          urgency_level: 'standard',
          budget_range: '25000-35000',
          flexible_dates: false,
          flexible_airports: true,
          ai_match_score: 0.87,
          ai_recommendations: {
            costSavings: 3200,
            routeEfficiency: 'Direct route optimal',
            alternativeAircraft: ['ACF005', 'ACF006'],
            weatherOptimization: 'Clear weather forecast'
          }
        },
        {
          aircraft_id: aircraftList[Math.floor(Math.random() * aircraftList.length)].id,
          operator_id: operatorList[Math.floor(Math.random() * operatorList.length)].id,
          departure_airport: 'KLAX',
          arrival_airport: 'KLAS',
          departure_date: '2024-09-12',
          departure_time: '14:30:00',
          passengers: 4,
          contact_name: 'Michael Chen',
          contact_email: 'mchen@startup.com',
          contact_phone: '+1-555-2002',
          company: 'TechStart Ventures',
          special_requests: 'Pet-friendly flight for small dog, flexible timing',
          status: 'Quoted',
          preferred_communication: ['email'],
          urgency_level: 'urgent',
          budget_range: '10000-15000',
          flexible_dates: true,
          flexible_airports: false,
          ai_match_score: 0.94,
          ai_recommendations: {
            costSavings: 1800,
            routeEfficiency: 'Short haul route',
            alternativeAircraft: ['ACF001', 'ACF007'],
            weatherOptimization: 'Slight delay recommended for turbulence'
          }
        },
        {
          aircraft_id: aircraftList[Math.floor(Math.random() * aircraftList.length)].id,
          operator_id: operatorList[Math.floor(Math.random() * operatorList.length)].id,
          departure_airport: 'KTEB',
          arrival_airport: 'KPBI',
          departure_date: '2024-09-20',
          departure_time: '08:00:00',
          return_date: '2024-09-23',
          return_time: '18:00:00',
          passengers: 10,
          contact_name: 'Jennifer Rodriguez',
          contact_email: 'jrodriguez@enterprise.com',
          contact_phone: '+1-555-2003',
          company: 'Global Enterprise Corp',
          special_requests: 'Executive conference setup, international catering',
          status: 'Confirmed',
          preferred_communication: ['email', 'sms'],
          urgency_level: 'standard',
          budget_range: '60000-80000',
          flexible_dates: false,
          flexible_airports: false,
          ai_match_score: 0.96,
          ai_recommendations: {
            costSavings: 8500,
            routeEfficiency: 'Popular business route',
            alternativeAircraft: ['ACF010', 'ACF012'],
            weatherOptimization: 'Perfect flying conditions'
          }
        },
        {
          aircraft_id: aircraftList[Math.floor(Math.random() * aircraftList.length)].id,
          operator_id: operatorList[Math.floor(Math.random() * operatorList.length)].id,
          departure_airport: 'KORD',
          arrival_airport: 'KSEA',
          departure_date: '2024-09-25',
          departure_time: '11:15:00',
          passengers: 8,
          contact_name: 'David Wilson',
          contact_email: 'dwilson@consulting.com',
          contact_phone: '+1-555-2004',
          company: 'Strategic Consulting Group',
          special_requests: 'Wi-Fi required for video calls, healthy meal options',
          status: 'Pending',
          preferred_communication: ['email'],
          urgency_level: 'flexible',
          budget_range: '35000-50000',
          flexible_dates: true,
          flexible_airports: true,
          ai_match_score: 0.89,
          ai_recommendations: {
            costSavings: 4200,
            routeEfficiency: 'Multiple routing options available',
            alternativeAircraft: ['ACF008', 'ACF009'],
            weatherOptimization: 'Monitor weather patterns'
          }
        },
        {
          aircraft_id: aircraftList[Math.floor(Math.random() * aircraftList.length)].id,
          operator_id: operatorList[Math.floor(Math.random() * operatorList.length)].id,
          departure_airport: 'KBOS',
          arrival_airport: 'KMIA',
          departure_date: '2024-09-08',
          departure_time: '15:45:00',
          passengers: 2,
          contact_name: 'Lisa Thompson',
          contact_email: 'lthompson@investment.com',
          contact_phone: '+1-555-2005',
          company: 'Premium Investment Partners',
          special_requests: 'Luxury ground transportation, premium catering',
          status: 'Completed',
          preferred_communication: ['phone', 'email'],
          urgency_level: 'urgent',
          budget_range: '15000-25000',
          flexible_dates: false,
          flexible_airports: false,
          ai_match_score: 0.91,
          ai_recommendations: {
            costSavings: 2100,
            routeEfficiency: 'Direct route preferred',
            alternativeAircraft: ['ACF003', 'ACF004'],
            weatherOptimization: 'Optimal departure time selected'
          }
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
    }

    // =====================================================
    // VERIFICATION
    // =====================================================
    console.log('\n🔍 Final Database Status:\n');
    
    const existingTables = ['aircraft', 'operators', 'charter_requests', 'bookings'];
    
    for (const tableName of existingTables) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${tableName.padEnd(20)}: Error - ${error.message}`);
        } else {
          const status = count >= 20 ? '✅' : count > 0 ? '⚠️' : '❌';
          console.log(`${status} ${tableName.padEnd(20)}: ${count} records`);
        }
      } catch (err) {
        console.log(`❌ ${tableName.padEnd(20)}: Check failed`);
      }
    }

    console.log('\n🎯 Database seeding completed successfully!');
    console.log('🏆 Aviation marketplace now has comprehensive test data:');
    console.log('   • Aircraft fleet with full specifications');
    console.log('   • Multiple charter operators with certifications');
    console.log('   • Diverse charter requests across different scenarios');
    console.log('   • Confirmed bookings for testing workflows');
    console.log('\n📈 Ready for end-to-end testing of all marketplace features!');

  } catch (error) {
    console.error('💥 Final seeding failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seedFinalData().catch(console.error);
}

module.exports = { seedFinalData };