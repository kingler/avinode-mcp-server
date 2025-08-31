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

async function testWithUUIDs() {
  console.log('🔍 Testing bookings with proper UUID format...\n');

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

  console.log('Using real IDs:');
  console.log(`Aircraft ID: ${aircraftId}`);
  console.log(`User ID: ${userId}\n`);

  const testBooking = {
    id: randomUUID(),
    aircraft_id: aircraftId,
    user_id: userId,
    status: 'Pending',
    total_price: 50000,
    currency: 'USD',
    special_requests: 'Test booking with proper UUIDs'
  };

  console.log('Test booking data:', JSON.stringify(testBooking, null, 2));

  const { data, error } = await supabase
    .from('bookings')
    .insert(testBooking)
    .select();

  if (error) {
    console.log(`❌ Insert failed: ${error.message}`);
    
    // Try to understand what fields are actually available by inspecting the error
    if (error.message.includes('Could not find')) {
      console.log('\n💡 Trying minimal fields only...');
      
      const minimalBooking = {
        id: randomUUID(),
        aircraft_id: aircraftId,
        status: 'Pending',
        total_price: 50000
      };

      const { data: minimalData, error: minimalError } = await supabase
        .from('bookings')
        .insert(minimalBooking)
        .select();

      if (minimalError) {
        console.log(`❌ Minimal insert failed: ${minimalError.message}`);
      } else {
        console.log('✅ Minimal insert worked!');
        console.log('Minimal schema data:', JSON.stringify(minimalData, null, 2));
        
        // Clean up
        await supabase.from('bookings').delete().eq('id', minimalBooking.id);
      }
    }
  } else {
    console.log('✅ SUCCESS! Full insert worked!');
    console.log('Inserted data:', JSON.stringify(data, null, 2));
    
    // Clean up
    await supabase.from('bookings').delete().eq('id', testBooking.id);
  }
}

testWithUUIDs();