import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { randomUUID } from 'crypto';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface WorkingBooking {
  id: string;
  user_id: string;
  aircraft_id: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  passengers: number;
  total_price: number;
  currency: string;
  special_requests: string | null;
}

async function createWorkingBookings(): Promise<void> {
  console.log('🚀 Creating realistic bookings with discovered working schema...\n');

  // Get real data from the database
  const { data: aircraft, error: aircraftError } = await supabase
    .from('aircraft')
    .select('id, tail_number, manufacturer, model, max_passengers, hourly_rate')
    .limit(10);

  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name')
    .limit(5);

  if (aircraftError || usersError) {
    console.error('❌ Error fetching reference data:', { aircraftError, usersError });
    return;
  }

  if (!aircraft?.length || !users?.length) {
    console.error('❌ No aircraft or users found in database');
    return;
  }

  console.log(`✅ Found ${aircraft.length} aircraft and ${users.length} users`);

  // Create realistic booking data
  const bookings: WorkingBooking[] = [];
  const airportPairs = [
    ['KJFK', 'KLAX'], ['KTEB', 'KMIA'], ['KBOS', 'KORD'], ['KSEA', 'KDEN'],
    ['KHOU', 'KJFK'], ['KLAS', 'KSFO'], ['KATL', 'KBOS'], ['KDCA', 'KMCO']
  ];

  const specialRequestOptions = [
    'VIP catering and champagne service',
    'Pet-friendly accommodation for small dog', 
    'Wheelchair accessible boarding assistance',
    'Corporate meeting setup with WiFi',
    'Vegetarian meal preferences',
    'Extra baggage space for equipment',
    'Privacy partition for confidential discussion',
    'Child safety seats for 2 passengers',
    null, null, null // Some bookings have no special requests
  ];

  const statusOptions: ('confirmed' | 'cancelled' | 'completed')[] = 
    ['confirmed', 'confirmed', 'confirmed', 'completed', 'cancelled']; // Only valid enum values

  // Generate 20 realistic bookings
  for (let i = 0; i < 20; i++) {
    const aircraftItem = aircraft[Math.floor(Math.random() * aircraft.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const [depAirport, arrAirport] = airportPairs[Math.floor(Math.random() * airportPairs.length)];
    const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    
    // Generate date (mix of past, present, and future)
    const daysOffset = Math.floor(Math.random() * 120 - 60); // -60 to +60 days from today
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + daysOffset);
    
    // Calculate passengers (1 to max capacity, but more realistic distribution)
    const maxPassengers = Math.min(aircraftItem.max_passengers, 12); // Cap at 12 for realism
    const passengers = Math.floor(Math.random() * maxPassengers) + 1;
    
    // Calculate realistic pricing (base on hourly rate * estimated flight time + markup)
    const estimatedFlightTime = Math.random() * 5 + 1; // 1-6 hours
    const basePrice = aircraftItem.hourly_rate * estimatedFlightTime;
    const totalPrice = Math.round(basePrice * (1.2 + Math.random() * 0.4)); // 20-60% markup

    const booking: WorkingBooking = {
      id: randomUUID(),
      user_id: user.id,
      aircraft_id: aircraftItem.id,
      status: status,
      departure_airport: depAirport,
      arrival_airport: arrAirport,
      departure_date: departureDate.toISOString().split('T')[0], // YYYY-MM-DD format
      passengers: passengers,
      total_price: totalPrice,
      currency: 'USD',
      special_requests: specialRequestOptions[Math.floor(Math.random() * specialRequestOptions.length)]
    };

    bookings.push(booking);
  }

  // Insert bookings in batches
  console.log(`📝 Inserting ${bookings.length} bookings...`);
  
  const batchSize = 5;
  let inserted = 0;
  let failed = 0;

  for (let i = 0; i < bookings.length; i += batchSize) {
    const batch = bookings.slice(i, i + batchSize);
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(batch)
      .select('id, status, total_price, departure_airport, arrival_airport');

    if (error) {
      console.log(`❌ Batch ${Math.floor(i/batchSize) + 1} failed: ${error.message}`);
      failed += batch.length;
    } else {
      console.log(`✅ Batch ${Math.floor(i/batchSize) + 1}: Inserted ${data?.length} bookings`);
      inserted += data?.length || 0;
    }
  }

  console.log(`\n📊 INSERTION SUMMARY:`);
  console.log(`===================`);
  console.log(`✅ Successfully inserted: ${inserted} bookings`);
  console.log(`❌ Failed to insert: ${failed} bookings`);
  console.log(`📈 Success rate: ${Math.round((inserted / bookings.length) * 100)}%`);

  if (inserted > 0) {
    // Show statistics
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log(`\n📋 Booking Statistics:`);
    console.log(`====================`);
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`${status}: ${count} bookings`);
    });

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total_price, 0);
    const avgBookingValue = totalRevenue / bookings.length;

    console.log(`\n💰 Financial Summary:`);
    console.log(`====================`);
    console.log(`Total Revenue: $${totalRevenue.toLocaleString()}`);
    console.log(`Average Booking: $${Math.round(avgBookingValue).toLocaleString()}`);

    // Sample bookings
    console.log(`\n📋 Sample Bookings:`);
    console.log(`==================`);
    const sampleBookings = await supabase
      .from('bookings')
      .select(`
        id, 
        status, 
        departure_airport, 
        arrival_airport, 
        departure_date, 
        passengers, 
        total_price,
        special_requests
      `)
      .limit(3);

    if (sampleBookings.data) {
      sampleBookings.data.forEach((booking, index) => {
        console.log(`${index + 1}. ${booking.departure_airport} → ${booking.arrival_airport}`);
        console.log(`   Date: ${booking.departure_date} | Passengers: ${booking.passengers}`);
        console.log(`   Status: ${booking.status} | Price: $${booking.total_price.toLocaleString()}`);
        console.log(`   Special: ${booking.special_requests || 'None'}`);
        console.log('');
      });
    }

    console.log('🎉 Aviation charter system is now fully operational with realistic booking data!');
    console.log('\n🔗 Next steps:');
    console.log('- Test booking queries and filtering');
    console.log('- Verify relationships with aircraft and users');
    console.log('- Test MCP tools with real booking data');
  }
}

// Test the schema first
async function testSchema(): Promise<boolean> {
  console.log('🧪 Testing discovered schema...');

  const { data: aircraft } = await supabase.from('aircraft').select('id').limit(1);
  const { data: users } = await supabase.from('users').select('id').limit(1);

  if (!aircraft?.[0] || !users?.[0]) {
    console.error('❌ No test data available');
    return false;
  }

  const testBooking: WorkingBooking = {
    id: randomUUID(),
    user_id: users[0].id,
    aircraft_id: aircraft[0].id,
    status: 'confirmed',
    departure_airport: 'KJFK',
    arrival_airport: 'KLAX',
    departure_date: '2024-12-15',
    passengers: 4,
    total_price: 50000,
    currency: 'USD',
    special_requests: 'Schema test booking'
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(testBooking)
    .select();

  if (error) {
    console.log(`❌ Schema test failed: ${error.message}`);
    return false;
  }

  console.log('✅ Schema test passed!');
  
  // Clean up
  await supabase.from('bookings').delete().eq('id', testBooking.id);
  
  return true;
}

async function main() {
  const schemaValid = await testSchema();
  if (schemaValid) {
    await createWorkingBookings();
  } else {
    console.error('❌ Cannot proceed with booking creation - schema test failed');
  }
}

main();