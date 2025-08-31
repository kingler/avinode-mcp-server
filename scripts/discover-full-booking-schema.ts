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

async function discoverFullBookingSchema(): Promise<void> {
  console.log('🔍 Discovering full booking schema by adding fields progressively...\n');

  // Get real IDs from the database
  const { data: aircraft } = await supabase
    .from('aircraft')
    .select('id')
    .limit(1);

  const { data: users } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  const { data: operators } = await supabase
    .from('operators')
    .select('id')
    .limit(1);

  if (!aircraft?.[0] || !users?.[0] || !operators?.[0]) {
    console.error('❌ Missing required reference data');
    return;
  }

  const aircraftId = aircraft[0].id;
  const userId = users[0].id;
  const operatorId = operators[0].id;

  console.log('Using reference IDs:');
  console.log(`Aircraft: ${aircraftId}`);
  console.log(`User: ${userId}`);
  console.log(`Operator: ${operatorId}\n`);

  // Progressive field testing
  const fieldSets = [
    {
      name: 'Base fields with departure_airport',
      data: {
        id: randomUUID(),
        user_id: userId,
        aircraft_id: aircraftId,
        status: 'confirmed',
        departure_airport: 'KJFK',
        total_price: 50000,
        currency: 'USD',
        special_requests: 'Test booking'
      }
    },
    {
      name: 'Add arrival_airport',
      data: {
        id: randomUUID(),
        user_id: userId,
        aircraft_id: aircraftId,
        status: 'confirmed',
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        total_price: 50000,
        currency: 'USD',
        special_requests: 'Test booking'
      }
    },
    {
      name: 'Add date/time fields',
      data: {
        id: randomUUID(),
        user_id: userId,
        aircraft_id: aircraftId,
        status: 'confirmed',
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-12-15',
        departure_time: '10:00:00',
        arrival_date: '2024-12-15',
        arrival_time: '14:30:00',
        total_price: 50000,
        currency: 'USD',
        special_requests: 'Test booking'
      }
    },
    {
      name: 'Add flight duration and passenger count',
      data: {
        id: randomUUID(),
        user_id: userId,
        aircraft_id: aircraftId,
        status: 'confirmed',
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-12-15',
        departure_time: '10:00:00',
        arrival_date: '2024-12-15',
        arrival_time: '14:30:00',
        flight_duration: 4.5,
        passenger_count: 6,
        total_price: 50000,
        currency: 'USD',
        special_requests: 'Test booking'
      }
    },
    {
      name: 'Add payment fields',
      data: {
        id: randomUUID(),
        user_id: userId,
        aircraft_id: aircraftId,
        status: 'confirmed',
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-12-15',
        departure_time: '10:00:00',
        arrival_date: '2024-12-15',
        arrival_time: '14:30:00',
        flight_duration: 4.5,
        passenger_count: 6,
        total_price: 50000,
        currency: 'USD',
        payment_status: 'confirmed',
        payment_method: 'Credit Card',
        deposit_amount: 25000,
        balance_amount: 25000,
        special_requests: 'Test booking'
      }
    },
    {
      name: 'Add booking metadata',
      data: {
        id: randomUUID(),
        user_id: userId,
        aircraft_id: aircraftId,
        operator_id: operatorId,
        status: 'confirmed',
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-12-15',
        departure_time: '10:00:00',
        arrival_date: '2024-12-15',
        arrival_time: '14:30:00',
        flight_duration: 4.5,
        passenger_count: 6,
        total_price: 50000,
        currency: 'USD',
        payment_status: 'confirmed',
        payment_method: 'Credit Card',
        deposit_amount: 25000,
        balance_amount: 25000,
        booking_date: '2024-12-01',
        booking_reference: 'BK-2024-001',
        confirmation_code: 'ABC123',
        special_requests: 'Test booking'
      }
    }
  ];

  for (const fieldSet of fieldSets) {
    console.log(`\nTesting: ${fieldSet.name}`);
    console.log(`Fields (${Object.keys(fieldSet.data).length}): ${Object.keys(fieldSet.data).join(', ')}`);

    const { data, error } = await supabase
      .from('bookings')
      .insert(fieldSet.data)
      .select();

    if (error) {
      console.log(`❌ Failed: ${error.message}`);
      
      // If we get a missing column error, continue to next test
      if (error.message.includes('Could not find') || error.message.includes('violates not-null constraint')) {
        continue;
      } else {
        // Other errors might be enum issues or constraint violations
        console.log('   This might be a data type or constraint issue');
      }
    } else {
      console.log('✅ SUCCESS! This field set works!');
      console.log('Sample inserted data:');
      console.log(JSON.stringify(data, null, 2));
      
      // Clean up
      await supabase.from('bookings').delete().eq('id', fieldSet.data.id);
      
      console.log('\n🎉 DISCOVERED WORKING BOOKING SCHEMA!');
      console.log('=====================================');
      console.log('Working fields:');
      Object.entries(fieldSet.data).forEach(([key, value]) => {
        console.log(`  ${key}: ${typeof value} = ${value}`);
      });
      
      return;
    }
  }

  console.log('\n❌ Could not find a fully working schema');
  console.log('The table may have additional constraints or required fields not tested');
}

discoverFullBookingSchema();