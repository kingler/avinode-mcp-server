#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBookingsSchema() {
  console.log('🔍 Checking bookings table schema...');
  
  try {
    // Try to insert a minimal record to see what columns are required/available
    const testBooking = {
      id: 'test-booking-schema-check',
      user_id: '1', // placeholder
      status: 'Pending'
    };
    
    const { data, error } = await supabase
      .from('bookings')
      .insert(testBooking)
      .select();
    
    if (error) {
      console.error('❌ Error details:', error);
      console.log('This will help us understand the actual column structure');
    } else {
      console.log('✅ Test insert successful:', data);
      
      // Clean up
      await supabase
        .from('bookings')
        .delete()
        .eq('id', 'test-booking-schema-check');
    }
    
    // Also check if we can query any existing bookings
    const { data: existingBookings, error: queryError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);
      
    if (queryError) {
      console.error('❌ Query error:', queryError);
    } else if (existingBookings && existingBookings.length > 0) {
      console.log('📋 Existing booking columns:', Object.keys(existingBookings[0]));
    } else {
      console.log('📝 No existing bookings to examine schema from');
    }
    
  } catch (error) {
    console.error('💥 Failed to check bookings schema:', error);
  }
}

checkBookingsSchema();