#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function discoverActualSchema() {
  console.log('🔍 Discovering actual database schema...');
  
  try {
    // Check flight_legs table structure
    console.log('\n✈️  Flight legs table:');
    const { data: legData, error: legError } = await supabase
      .from('flight_legs')
      .select('*')
      .limit(1);
    
    if (legError) {
      console.error('❌ Error querying flight_legs:', legError.message);
    } else if (legData && legData.length > 0) {
      console.log('   Available columns:', Object.keys(legData[0]));
    } else {
      console.log('   Table exists but is empty - cannot determine columns from data');
    }
    
    // Check bookings table structure 
    console.log('\n📝 Bookings table:');
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);
    
    if (bookingError) {
      console.error('❌ Error querying bookings:', bookingError.message);
    } else if (bookingData && bookingData.length > 0) {
      console.log('   Available columns:', Object.keys(bookingData[0]));
    } else {
      console.log('   Table exists but is empty - cannot determine columns from data');
    }
    
    // Check charter_requests structure
    console.log('\n📋 Charter requests table:');
    const { data: requestData, error: requestError } = await supabase
      .from('charter_requests')
      .select('*')
      .limit(1);
    
    if (requestError) {
      console.error('❌ Error querying charter_requests:', requestError.message);
    } else if (requestData && requestData.length > 0) {
      console.log('   Available columns:', Object.keys(requestData[0]));
    } else {
      console.log('   Charter requests exist:', requestData.length);
    }
    
    // Try to create minimal records to discover required fields
    console.log('\n🧪 Testing minimal inserts to discover schema...');
    
    // Test flight_legs minimal structure
    const testLegId = 'test-leg-' + Date.now();
    const minimalLeg = {
      id: testLegId,
      aircraft_id: '05c92852-911b-435d-be52-515fcf5b78fb',
      departure_airport: 'KJFK',
      arrival_airport: 'KORD'
    };
    
    const { error: testLegError } = await supabase
      .from('flight_legs')
      .insert(minimalLeg);
    
    if (testLegError) {
      console.log('❌ Minimal flight leg test:', testLegError.message);
    } else {
      console.log('✅ Minimal flight leg structure accepted');
      // Clean up
      await supabase.from('flight_legs').delete().eq('id', testLegId);
    }
    
    // Test bookings minimal structure
    const testBookingId = 'test-booking-' + Date.now();
    const minimalBooking = {
      id: testBookingId,
      aircraft_id: '05c92852-911b-435d-be52-515fcf5b78fb',
      operator_id: '550e8400-e29b-41d4-a716-446655440001',
      total_price: 50000.00,
      passenger_info: {
        name: 'Test User',
        email: 'test@test.com',
        phone: '+1-555-0000'
      }
    };
    
    const { error: testBookingError } = await supabase
      .from('bookings')
      .insert(minimalBooking);
    
    if (testBookingError) {
      console.log('❌ Minimal booking test:', testBookingError.message);
    } else {
      console.log('✅ Minimal booking structure accepted');
      // Clean up
      await supabase.from('bookings').delete().eq('id', testBookingId);
    }
    
  } catch (error) {
    console.error('💥 Failed to discover schema:', error);
  }
}

discoverActualSchema();