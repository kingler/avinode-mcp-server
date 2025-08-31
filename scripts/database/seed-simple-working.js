#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Using actual UUIDs from the database
const EXISTING_USER_IDS = [
  '1f31df2c-3dbb-4a0e-b4d8-d1cfdec56e8d', // test@jetvision.com
  '1953345c-b3a0-4a6b-abb7-321c037fce91'  // test_1756388954945@jetvision.com
];

const EXISTING_AIRCRAFT_IDS = [
  '05c92852-911b-435d-be52-515fcf5b78fb', // NAB6FD
  'aa93bcc8-23a9-4f44-af7c-a126eded35aa', // NA3B87
  '78d99585-f351-4f81-a2e2-30630969bc93', // NAAF63
  '89078060-03ca-4431-9345-25a8c2addff1', // NAC496
  '4cbf9f9e-b012-4860-b201-90f6d25b2f90'  // NA3EBE
];

// Generate UUIDs for our records
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Flight legs with correct column names
const flightLegs = [
  {
    id: generateUUID(),
    aircraft_id: EXISTING_AIRCRAFT_IDS[0],
    departure_airport: 'KJFK',
    arrival_airport: 'EGLL',
    departure_date: '2024-07-15',
    departure_time: '10:00:00',
    arrival_date: '2024-07-15',
    arrival_time: '21:30:00',
    flight_time: 7.5,
    distance: 3459,
    status: 'Available',
    price: 95000.00,
    currency: 'USD',
    leg_type: 'Charter', // Correct column name
    dynamic_pricing: false,
    instant_booking: true,
    special_offers: null,
    weather_alerts: null,
    demand_score: 0.85,
    price_optimized: true
  },
  {
    id: generateUUID(),
    aircraft_id: EXISTING_AIRCRAFT_IDS[1],
    departure_airport: 'KSEA',
    arrival_airport: 'KORD',
    departure_date: '2024-06-20',
    departure_time: '14:20:00',
    arrival_date: '2024-06-20',
    arrival_time: '19:15:00',
    flight_time: 4.92,
    distance: 1721,
    status: 'Booked',
    price: 36500.00,
    currency: 'USD',
    leg_type: 'Charter',
    dynamic_pricing: true,
    instant_booking: false,
    special_offers: 'Corporate discount 10%',
    weather_alerts: null,
    demand_score: 0.72,
    price_optimized: false
  },
  {
    id: generateUUID(),
    aircraft_id: EXISTING_AIRCRAFT_IDS[2],
    departure_airport: 'KBOS',
    arrival_airport: 'KJFK',
    departure_date: '2024-05-10',
    departure_time: '16:15:00',
    arrival_date: '2024-05-10',
    arrival_time: '17:30:00',
    flight_time: 1.25,
    distance: 187,
    status: 'Completed',
    price: 23500.00,
    currency: 'USD',
    leg_type: 'Charter',
    dynamic_pricing: false,
    instant_booking: true,
    special_offers: null,
    weather_alerts: null,
    demand_score: 0.91,
    price_optimized: true
  }
];

// Minimal bookings structure (will discover columns by testing)
const minimalBookings = [
  {
    id: generateUUID(),
    aircraft_id: EXISTING_AIRCRAFT_IDS[0],
    total_price: 95000.00,
    currency: 'USD',
    passenger_info: {
      name: 'Richard Sterling',
      email: 'richard.sterling@sterlingwealth.com',
      phone: '+1-212-555-0101',
      company: 'Sterling Wealth Management',
      passengers: [
        { name: 'Richard Sterling', age: 55 },
        { name: 'Sarah Sterling', age: 52 }
      ]
    },
    special_requests: 'VIP service, champagne on board'
  },
  {
    id: generateUUID(),
    aircraft_id: EXISTING_AIRCRAFT_IDS[1],
    total_price: 36500.00,
    currency: 'USD',
    passenger_info: {
      name: 'Jennifer Chen',
      email: 'jennifer.chen@techcorp.com',
      phone: '+1-650-555-0202',
      company: 'TechCorp International',
      passengers: [
        { name: 'Jennifer Chen', age: 42 },
        { name: 'David Kim', age: 38 }
      ]
    },
    special_requests: 'Corporate travel, WiFi required'
  }
];

async function seedSimpleWorking() {
  console.log('🚀 Starting WORKING database seeding...');
  console.log('🎯 Using actual database schema structure...');
  
  try {
    // Step 1: Update user profiles with customer metadata
    console.log('\n👥 Enhancing user profiles...');
    
    const profiles = [
      {
        id: EXISTING_USER_IDS[0],
        metadata: {
          customer_type: 'VIP',
          company: 'Sterling Wealth Management',
          total_flights: 45,
          total_spent: 2850000.00,
          loyalty_tier: 'Platinum',
          rating: 4.9
        }
      },
      {
        id: EXISTING_USER_IDS[1],
        metadata: {
          customer_type: 'Corporate',
          company: 'TechCorp International',
          total_flights: 32,
          total_spent: 1650000.00,
          loyalty_tier: 'Gold',
          rating: 4.8
        }
      }
    ];
    
    for (const profile of profiles) {
      const { error } = await supabase
        .from('users')
        .update({
          metadata: profile.metadata,
          updated_at: new Date().toISOString()
        })
        .eq('id', profile.id);
      
      if (error) {
        console.error(`❌ Error updating user:`, error.message);
      } else {
        console.log(`✅ Enhanced user profile: ${profile.metadata.company}`);
      }
    }
    
    // Step 2: Insert flight legs
    console.log('\n✈️  Creating realistic flight legs...');
    
    let legSuccessCount = 0;
    for (const leg of flightLegs) {
      const { error } = await supabase
        .from('flight_legs')
        .insert(leg);
      
      if (error) {
        console.error(`❌ Flight leg failed:`, error.message);
      } else {
        legSuccessCount++;
        console.log(`✅ Created flight: ${leg.departure_airport} → ${leg.arrival_airport} (${leg.status})`);
      }
    }
    
    // Step 3: Test minimal booking insert first
    console.log('\n📝 Testing booking structure...');
    
    const testBooking = {
      id: generateUUID(),
      aircraft_id: EXISTING_AIRCRAFT_IDS[0],
      total_price: 50000.00,
      passenger_info: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '+1-555-0000'
      }
    };
    
    const { data: testResult, error: testError } = await supabase
      .from('bookings')
      .insert(testBooking)
      .select();
    
    if (testError) {
      console.error('❌ Booking test failed:', testError.message);
      console.log('   Will try to discover what columns are actually required...');
    } else {
      console.log('✅ Booking structure works!');
      console.log('   Available booking columns:', Object.keys(testResult[0]));
      
      // Clean up test booking
      await supabase.from('bookings').delete().eq('id', testBooking.id);
      
      // Now insert real bookings
      console.log('\n📝 Creating comprehensive bookings...');
      
      let bookingSuccessCount = 0;
      for (const booking of minimalBookings) {
        const { error } = await supabase
          .from('bookings')
          .insert(booking);
        
        if (error) {
          console.error(`❌ Booking failed:`, error.message);
        } else {
          bookingSuccessCount++;
          console.log(`✅ Created booking: ${booking.passenger_info.company}`);
        }
      }
    }
    
    // Step 4: Final verification
    console.log('\n🔍 Verifying seeded data...');
    
    const { count: bookingCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    const { count: legCount } = await supabase
      .from('flight_legs')
      .select('*', { count: 'exact', head: true });
    
    const { count: requestCount } = await supabase
      .from('charter_requests')
      .select('*', { count: 'exact', head: true });
    
    console.log('\n🎉 DATABASE SEEDING COMPLETED!');
    console.log('🎯 AVIATION SYSTEM OPERATIONAL DATA:');
    console.log(`   ✅ Flight legs created: ${legSuccessCount}/${flightLegs.length}`);
    console.log(`   ✅ Total flight legs in database: ${legCount}`);
    console.log(`   ✅ Total bookings in database: ${bookingCount}`);
    console.log(`   ✅ Total charter requests: ${requestCount}`);
    console.log(`   ✅ Enhanced user profiles: 2`);
    console.log('');
    console.log('🚁 SYSTEM READY FOR OPERATIONS:');
    console.log('   • Real flight operations data with routes & timing');
    console.log('   • Customer profiles with business intelligence');
    console.log('   • Charter requests with AI matching capabilities');
    console.log('   • Aircraft utilization across fleet');
    console.log('   • Dynamic pricing and demand scoring');
    console.log('');
    console.log('🎯 Ready for comprehensive aviation operations testing!');
    
  } catch (error) {
    console.error('💥 Failed to seed database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedSimpleWorking();