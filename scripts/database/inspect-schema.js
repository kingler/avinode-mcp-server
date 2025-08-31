#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function inspectSchema() {
  console.log('🔍 Inspecting database schema...');
  
  try {
    // Check users table first (which exists)
    console.log('\n📋 Users table:');
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(2);
    
    if (userError) {
      console.error('❌ Error querying users:', userError);
    } else {
      console.log(`   Found ${userData?.length || 0} users`);
      if (userData && userData.length > 0) {
        console.log('   Sample user columns:', Object.keys(userData[0]));
      }
    }
    
    // Check aircraft table
    console.log('\n✈️ Aircraft table:');
    const { data: aircraftData, error: aircraftError } = await supabase
      .from('aircraft')
      .select('*')
      .limit(1);
    
    if (aircraftError) {
      console.error('❌ Error querying aircraft:', aircraftError);
    } else {
      console.log(`   Found aircraft records`);
      if (aircraftData && aircraftData.length > 0) {
        console.log('   Aircraft columns:', Object.keys(aircraftData[0]));
      }
    }
    
    // Try to query bookings
    console.log('\n📝 Bookings table:');
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .select('*')
      .limit(1);
    
    if (bookingError) {
      console.error('❌ Error querying bookings:', bookingError);
    } else {
      console.log(`   Bookings query successful`);
      if (bookingData && bookingData.length > 0) {
        console.log('   Booking columns:', Object.keys(bookingData[0]));
      } else {
        console.log('   No bookings found (empty table)');
      }
    }
    
    // Try direct insert to see what happens
    console.log('\n🧪 Testing direct insert...');
    const testCustomer = {
      id: 'test-customer-id',
      email: 'test@test.com',
      name: 'Test User',
      phone: '+1-555-0000',
      customer_type: 'Individual'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('customers')
      .insert(testCustomer)
      .select();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
    } else {
      console.log('✅ Insert test succeeded:', insertData);
      
      // Clean up test record
      await supabase
        .from('customers')
        .delete()
        .eq('id', 'test-customer-id');
    }
    
  } catch (error) {
    console.error('💥 Failed to inspect schema:', error);
  }
}

inspectSchema();