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

async function discoverSchema() {
  console.log('🔍 Discovering database schema...\n');

  try {
    // Try to insert a test record to see what fields are expected
    console.log('📝 Attempting test insert to discover required fields...');
    
    const testBooking = {
      id: 'test-booking-123',
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    const { error: insertError } = await supabase
      .from('bookings')
      .insert(testBooking);

    if (insertError) {
      console.log('❌ Test insert error (this helps us understand the schema):');
      console.log(insertError);
    }

    // Try to query the table to see what's there
    console.log('\n📊 Querying existing bookings...');
    const { data: existingBookings, error: queryError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);

    if (queryError) {
      console.log('Query error:', queryError);
    } else {
      console.log('Existing bookings:', existingBookings);
    }

    // Check related tables
    console.log('\n🔗 Examining related tables structure...\n');
    
    const tables = ['users', 'aircraft', 'operators', 'flight_legs'];
    
    for (const table of tables) {
      console.log(`--- ${table.toUpperCase()} ---`);
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact' })
        .limit(1);
      
      if (error) {
        console.log(`Error querying ${table}:`, error.message);
      } else {
        console.log(`Count: ${count}`);
        if (data && data.length > 0) {
          console.log('Sample record keys:', Object.keys(data[0]));
          console.log('Sample record:', JSON.stringify(data[0], null, 2));
        }
      }
      console.log('');
    }

    // Try different field combinations for bookings
    console.log('🧪 Testing different booking field combinations...\n');
    
    const testCombinations = [
      // Basic booking
      {
        name: 'Basic booking',
        data: {
          user_id: 'test-user',
          aircraft_id: 'test-aircraft',
          flight_leg_id: 'test-flight',
          status: 'confirmed',
        }
      },
      // With operator
      {
        name: 'With operator_id',
        data: {
          user_id: 'test-user',
          aircraft_id: 'test-aircraft',
          operator_id: 'test-operator',
          status: 'confirmed',
        }
      },
      // Minimal fields
      {
        name: 'Minimal fields',
        data: {
          status: 'pending'
        }
      }
    ];

    for (const combo of testCombinations) {
      console.log(`Testing: ${combo.name}`);
      const { error } = await supabase
        .from('bookings')
        .insert(combo.data);
      
      if (error) {
        console.log(`❌ ${error.message}`);
        // Extract missing columns from error message
        if (error.message.includes('Could not find')) {
          console.log('   This helps identify missing/incorrect columns');
        }
      } else {
        console.log('✅ Success! This combination works');
      }
      console.log('');
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

discoverSchema();