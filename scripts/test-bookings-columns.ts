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

async function testBookingsColumns() {
  console.log('🔍 Testing bookings table columns...\n');

  // Try different column combinations to understand what exists
  const testFields = [
    'id',
    'aircraft_id', 
    'operator_id',
    'status',
    'total_price',
    'currency', 
    'payment_status',
    'payment_method',
    'deposit_amount',
    'balance_amount',
    'deposit_due_date',
    'balance_due_date',
    'passenger_info',
    'special_requests',
    'quote_id',
    'created_at',
    'updated_at'
  ];

  // Test each field individually
  for (const field of testFields) {
    try {
      const { error } = await supabase
        .from('bookings')
        .select(field)
        .limit(1);
      
      if (error) {
        console.log(`❌ ${field}: ${error.message}`);
      } else {
        console.log(`✅ ${field}: EXISTS`);
      }
    } catch (err) {
      console.log(`💥 ${field}: Unexpected error`);
    }
  }

  // Try a minimal insert to see what's required
  console.log('\n🧪 Testing minimal insert...');
  
  const testInserts = [
    // Basic fields only
    {
      name: 'Basic required fields only',
      data: {
        id: 'test-booking-minimal',
        aircraft_id: 'test-aircraft',
        status: 'Pending'
      }
    },
    // Add passenger_info
    {
      name: 'With passenger_info', 
      data: {
        id: 'test-booking-passenger',
        aircraft_id: 'test-aircraft',
        status: 'Pending',
        passenger_info: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1-555-0123'
        }
      }
    }
  ];

  for (const test of testInserts) {
    console.log(`\nTesting: ${test.name}`);
    const { error } = await supabase
      .from('bookings')
      .insert(test.data);
    
    if (error) {
      console.log(`❌ ${error.message}`);
    } else {
      console.log('✅ Insert successful');
      // Clean up
      await supabase
        .from('bookings')
        .delete()
        .eq('id', test.data.id);
    }
  }
}

testBookingsColumns();