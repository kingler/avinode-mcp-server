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

async function findMinimalWorkingBooking(): Promise<void> {
  console.log('🔍 Finding minimal working booking schema...\n');

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

  // Start with just what we know works and gradually add required fields
  let workingFields: any = {
    id: randomUUID(),
    user_id: userId,
    aircraft_id: aircraftId,
    status: 'confirmed'
  };

  // Fields we know are likely required based on NOT NULL constraint errors
  const potentialRequiredFields = [
    { key: 'departure_airport', value: 'KJFK' },
    { key: 'arrival_airport', value: 'KLAX' },
    { key: 'departure_date', value: '2024-12-15' },
    { key: 'total_price', value: 50000 },
    { key: 'currency', value: 'USD' },
    { key: 'special_requests', value: 'Test booking' },
    { key: 'flight_duration', value: 4.5 },
    { key: 'passenger_count', value: 6 },
    { key: 'payment_status', value: 'pending' },
    { key: 'booking_date', value: '2024-12-01' }
  ];

  console.log('Testing progressive field addition...\n');

  for (let i = 0; i <= potentialRequiredFields.length; i++) {
    // Add next field
    if (i > 0) {
      const field = potentialRequiredFields[i - 1];
      workingFields[field.key] = field.value;
    }

    console.log(`Attempt ${i + 1}: Testing with ${Object.keys(workingFields).length} fields`);
    console.log(`Fields: ${Object.keys(workingFields).join(', ')}`);

    // Generate new ID for each attempt
    workingFields.id = randomUUID();

    const { data, error } = await supabase
      .from('bookings')
      .insert(workingFields)
      .select();

    if (error) {
      console.log(`❌ Failed: ${error.message}`);
      
      // Check if it's a NOT NULL constraint
      if (error.message.includes('violates not-null constraint')) {
        const match = error.message.match(/column "([^"]+)"/);
        if (match) {
          const missingField = match[1];
          console.log(`   → Missing required field: ${missingField}`);
        }
      } else if (error.message.includes('Could not find')) {
        const match = error.message.match(/'([^']+)'/);
        if (match) {
          const invalidField = match[1];
          console.log(`   → Invalid field: ${invalidField}`);
          // Remove this field and continue
          delete workingFields[invalidField];
          continue;
        }
      }
      console.log('');
    } else {
      console.log('✅ SUCCESS!');
      console.log('Working booking data:', JSON.stringify(data, null, 2));
      
      // Clean up
      await supabase.from('bookings').delete().eq('id', workingFields.id);
      
      console.log('\n🎉 DISCOVERED MINIMAL WORKING BOOKING SCHEMA!');
      console.log('============================================');
      console.log('Working fields:');
      Object.entries(workingFields).forEach(([key, value]) => {
        console.log(`  ${key}: ${typeof value} = ${value}`);
      });
      
      return;
    }
  }

  console.log('\n❌ Could not find working schema with available fields');
}

findMinimalWorkingBooking();