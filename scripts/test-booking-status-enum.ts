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

async function testBookingStatusEnum(): Promise<void> {
  console.log('🔍 Testing booking status enum values...\n');

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
    console.error('❌ No aircraft or users found in database');
    return;
  }

  const aircraftId = aircraft[0].id;
  const userId = users[0].id;

  // From the 001 migration, the booking_status enum was defined as:
  // CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled');
  // But the error suggests "Pending" is not valid. Let me try the other values.
  
  const possibleStatuses = ['Confirmed', 'InProgress', 'Completed', 'Cancelled', 'pending', 'confirmed'];

  for (const status of possibleStatuses) {
    const testBooking = {
      id: randomUUID(),
      aircraft_id: aircraftId,
      user_id: userId,
      status: status,
      total_price: 50000,
      currency: 'USD',
      special_requests: `Test booking with status: ${status}`
    };

    console.log(`Testing status: "${status}"`);

    const { data, error } = await supabase
      .from('bookings')
      .insert(testBooking)
      .select();

    if (error) {
      console.log(`❌ Failed with status "${status}": ${error.message}`);
    } else {
      console.log(`✅ SUCCESS with status "${status}"!`);
      console.log('Working booking data:', JSON.stringify(data, null, 2));
      
      // Clean up and stop testing once we find a working status
      await supabase.from('bookings').delete().eq('id', testBooking.id);
      
      console.log('\n🎉 Found working schema!');
      console.log('Working fields:');
      Object.keys(testBooking).forEach(key => {
        console.log(`  ${key}: ${typeof testBooking[key as keyof typeof testBooking]}`);
      });
      
      return;
    }
  }

  console.log('\n❌ No valid status values found');
}

testBookingStatusEnum();