import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function findActualBookingsSchema() {
  console.log('🔍 Investigating actual bookings table schema...\n');

  // First, try to get existing aircraft and user IDs to use in tests
  const { data: aircraft } = await supabase
    .from('aircraft')
    .select('id')
    .limit(1);

  const { data: users } = await supabase
    .from('users')
    .select('id')
    .limit(1);

  const aircraftId = aircraft?.[0]?.id;
  const userId = users?.[0]?.id;

  console.log('Using test IDs:');
  console.log(`Aircraft ID: ${aircraftId}`);
  console.log(`User ID: ${userId}\n`);

  // Test different combinations systematically
  const testCombinations = [
    // Based on our column discovery
    {
      name: 'Simple working fields only',
      data: {
        id: 'test-simple',
        aircraft_id: aircraftId,
        status: 'Pending',
        total_price: 50000,
        currency: 'USD',
        special_requests: 'Test booking'
      }
    },
    // Try adding user_id (from index creation)  
    {
      name: 'With user_id',
      data: {
        id: 'test-with-user',
        aircraft_id: aircraftId,
        user_id: userId,
        status: 'Pending',
        total_price: 50000,
        currency: 'USD',
        special_requests: 'Test booking with user'
      }
    },
    // Try the original 001 schema fields
    {
      name: 'Original schema format (001 migration)',
      data: {
        id: 'test-original',
        aircraft_id: aircraftId,
        quote_id: null,
        status: 'Pending',
        total_price: 50000,
        currency: 'USD',
        payment_status: 'Pending',
        payment_method: null,
        deposit_amount: 25000,
        balance_amount: 25000,
        passenger_info: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1-555-0123'
        },
        special_requests: 'Test booking original format'
      }
    }
  ];

  let workingSchema = null;

  for (const test of testCombinations) {
    console.log(`Testing: ${test.name}`);
    console.log(`Fields: ${Object.keys(test.data).join(', ')}`);
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(test.data)
      .select();
    
    if (error) {
      console.log(`❌ Failed: ${error.message}\n`);
    } else {
      console.log('✅ SUCCESS! This schema works!');
      console.log('Inserted data:', JSON.stringify(data, null, 2));
      workingSchema = test;
      
      // Clean up the test record
      await supabase
        .from('bookings')
        .delete()
        .eq('id', test.data.id);
      
      break;
    }
  }

  if (workingSchema) {
    console.log('\n🎉 DISCOVERED WORKING SCHEMA:');
    console.log('==============================');
    console.log('Working fields:', Object.keys(workingSchema.data));
    console.log('\nNow I can create realistic booking data using this schema!');
  } else {
    console.log('\n❌ Could not determine working schema');
    console.log('The bookings table may have constraints or different field types than expected');
  }
}

findActualBookingsSchema();