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

async function testSimplifiedBooking(): Promise<void> {
  console.log('🔍 Testing simplified booking schema (no arrival_date fields)...\n');

  // Get real IDs from the database
  const { data: aircraft } = await supabase
    .from('aircraft')
    .select('id')
    .limit(1);

  const { data: users } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  if (!aircraft?.[0] || !users?.[0]) {
    console.error('❌ Missing required reference data');
    return;
  }

  const aircraftId = aircraft[0].id;
  const userId = users[0].id;

  // Test with just the required fields we've discovered
  const testBooking = {
    id: randomUUID(),
    user_id: userId,
    aircraft_id: aircraftId,
    status: 'confirmed',
    departure_airport: 'KJFK',
    arrival_airport: 'KLAX',
    departure_date: '2024-12-15',
    departure_time: '10:00:00',
    total_price: 50000,
    currency: 'USD',
    special_requests: 'Test booking simplified schema'
  };

  console.log('Test booking data:');
  console.log(JSON.stringify(testBooking, null, 2));

  const { data, error } = await supabase
    .from('bookings')
    .insert(testBooking)
    .select();

  if (error) {
    console.log(`❌ Insert failed: ${error.message}`);
    
    // Try to add more fields based on the error
    if (error.message.includes('violates not-null constraint')) {
      const match = error.message.match(/column "([^"]+)"/);
      if (match) {
        const missingColumn = match[1];
        console.log(`\n💡 Missing required field: ${missingColumn}`);
        
        // Add the missing field and try again
        if (missingColumn === 'flight_duration') {
          (testBooking as any).flight_duration = 4.5;
        } else if (missingColumn === 'passenger_count') {
          (testBooking as any).passenger_count = 6;
        } else if (missingColumn === 'payment_status') {
          (testBooking as any).payment_status = 'pending';
        } else if (missingColumn === 'booking_date') {
          (testBooking as any).booking_date = '2024-12-01';
        } else {
          (testBooking as any)[missingColumn] = 'default_value';
        }

        console.log(`Retrying with ${missingColumn} added...`);
        
        const { data: retryData, error: retryError } = await supabase
          .from('bookings')
          .insert(testBooking)
          .select();

        if (retryError) {
          console.log(`❌ Retry failed: ${retryError.message}`);
        } else {
          console.log('✅ SUCCESS with added field!');
          console.log('Working booking data:', JSON.stringify(retryData, null, 2));
          
          // Clean up
          await supabase.from('bookings').delete().eq('id', testBooking.id);
        }
      }
    }
  } else {
    console.log('✅ SUCCESS! Simple schema works!');
    console.log('Working booking data:', JSON.stringify(data, null, 2));
    
    // Clean up
    await supabase.from('bookings').delete().eq('id', testBooking.id);
    
    console.log('\n🎉 DISCOVERED WORKING BOOKING SCHEMA!');
    console.log('=====================================');
    console.log('Required fields:');
    Object.entries(testBooking).forEach(([key, value]) => {
      console.log(`  ${key}: ${typeof value} = ${value}`);
    });
  }
}

testSimplifiedBooking();