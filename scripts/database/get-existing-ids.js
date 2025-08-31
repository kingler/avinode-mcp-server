#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getExistingIds() {
  console.log('🔍 Getting existing IDs from database...');
  
  try {
    // Get existing users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, email, first_name, last_name');
    
    if (usersError) {
      console.error('❌ Error querying users:', usersError);
    } else {
      console.log('\n👥 Existing Users:');
      users.forEach(user => {
        console.log(`   ${user.id} - ${user.email} (${user.first_name} ${user.last_name})`);
      });
    }
    
    // Get existing aircraft
    const { data: aircraft, error: aircraftError } = await supabase
      .from('aircraft')
      .select('id, tail_number, model, manufacturer')
      .limit(5);
    
    if (aircraftError) {
      console.error('❌ Error querying aircraft:', aircraftError);
    } else {
      console.log('\n✈️ Sample Aircraft:');
      aircraft.forEach(plane => {
        console.log(`   ${plane.id} - ${plane.tail_number} (${plane.manufacturer} ${plane.model})`);
      });
    }
    
    // Get existing operators
    const { data: operators, error: operatorsError } = await supabase
      .from('operators')
      .select('id, name, certificate');
    
    if (operatorsError) {
      console.error('❌ Error querying operators:', operatorsError);
    } else {
      console.log('\n🏢 Existing Operators:');
      operators.forEach(op => {
        console.log(`   ${op.id} - ${op.name} (${op.certificate})`);
      });
    }
    
  } catch (error) {
    console.error('💥 Failed to get existing IDs:', error);
  }
}

getExistingIds();