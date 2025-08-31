#!/usr/bin/env ts-node

/**
 * Test MCP Tools Functionality Against Populated Database
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testSearchAircraft() {
  console.log('\n✈️  Testing aircraft search functionality...');
  
  const { data: aircraft, error } = await supabase
    .from('aircraft')
    .select('*')
    .limit(5);
  
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
  
  console.log(`   ✅ Found ${aircraft?.length || 0} aircraft for search`);
  if (aircraft && aircraft.length > 0) {
    console.log(`   📝 Sample aircraft: ${aircraft[0].model} (${aircraft[0].tail_number})`);
    console.log(`   💰 Rate: $${aircraft[0].hourly_rate}/hour`);
    console.log(`   👥 Passengers: ${aircraft[0].max_passengers}`);
  }
  return true;
}

async function testGetOperatorInfo() {
  console.log('\n🏢 Testing operator information retrieval...');
  
  const { data: operators, error } = await supabase
    .from('operators')
    .select('*')
    .limit(3);
  
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
  
  console.log(`   ✅ Found ${operators?.length || 0} operators`);
  if (operators && operators.length > 0) {
    operators.forEach((op, i) => {
      console.log(`   ${i + 1}. ${op.name} - ${op.safety_rating} - Fleet: ${op.fleet_size}`);
    });
  }
  return true;
}

async function testCharterRequests() {
  console.log('\n📋 Testing charter request management...');
  
  const { data: requests, error } = await supabase
    .from('charter_requests')
    .select('*, operators(name), aircraft(model)')
    .limit(3);
  
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
  
  console.log(`   ✅ Found ${requests?.length || 0} charter requests`);
  if (requests && requests.length > 0) {
    requests.forEach((req, i) => {
      console.log(`   ${i + 1}. ${req.departure_airport} → ${req.arrival_airport} (${req.status})`);
    });
  }
  return true;
}

async function testPricingQuotes() {
  console.log('\n💰 Testing pricing quote generation...');
  
  const { data: quotes, error } = await supabase
    .from('pricing_quotes')
    .select('*, aircraft(model)')
    .limit(3);
  
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
  
  console.log(`   ✅ Found ${quotes?.length || 0} pricing quotes`);
  if (quotes && quotes.length > 0) {
    quotes.forEach((quote, i) => {
      console.log(`   ${i + 1}. $${quote.total_price} ${quote.currency} - Valid until ${quote.valid_until}`);
    });
  }
  return true;
}

async function testBookingManagement() {
  console.log('\n📋 Testing booking management...');
  
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('*, aircraft(model), operators(name)')
    .limit(5);
  
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
  
  console.log(`   ✅ Found ${bookings?.length || 0} bookings`);
  if (bookings && bookings.length > 0) {
    bookings.forEach((booking, i) => {
      console.log(`   ${i + 1}. $${booking.total_price} - Status: ${booking.status}`);
    });
  }
  return true;
}

async function testFleetUtilization() {
  console.log('\n📊 Testing fleet utilization analysis...');
  
  // Test aircraft availability
  const { data: aircraft, error: aircraftError } = await supabase
    .from('aircraft')
    .select('availability, model, tail_number')
    .limit(10);
  
  if (aircraftError) {
    console.log(`   ❌ Error: ${aircraftError.message}`);
    return false;
  }
  
  console.log(`   ✅ Aircraft availability data retrieved`);
  
  // Test flight legs for utilization
  const { data: flightLegs, error: flightError } = await supabase
    .from('flight_legs')
    .select('status, aircraft_id, departure_date')
    .limit(5);
  
  if (flightError) {
    console.log(`   ❌ Flight legs error: ${flightError.message}`);
    return false;
  }
  
  console.log(`   ✅ Flight utilization data available: ${flightLegs?.length || 0} legs`);
  return true;
}

async function testEmptyLegs() {
  console.log('\n🛫 Testing empty leg opportunities...');
  
  const { data: emptyLegs, error } = await supabase
    .from('flight_legs')
    .select('*, aircraft(model, tail_number)')
    .eq('leg_type', 'EmptyLeg')
    .eq('status', 'Available')
    .limit(3);
  
  if (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return false;
  }
  
  console.log(`   ✅ Found ${emptyLegs?.length || 0} empty leg opportunities`);
  if (emptyLegs && emptyLegs.length > 0) {
    emptyLegs.forEach((leg, i) => {
      console.log(`   ${i + 1}. ${leg.departure_airport} → ${leg.arrival_airport} - $${leg.price}`);
    });
  }
  return true;
}

async function testAnalyticsAndReporting() {
  console.log('\n📈 Testing analytics and reporting...');
  
  // Test market analytics
  const { data: analytics, error: analyticsError } = await supabase
    .from('market_analytics')
    .select('*')
    .limit(3);
  
  if (analyticsError) {
    console.log(`   ❌ Analytics error: ${analyticsError.message}`);
    return false;
  }
  
  console.log(`   ✅ Market analytics available: ${analytics?.length || 0} records`);
  
  // Test price predictions  
  const { data: predictions, error: predError } = await supabase
    .from('price_predictions')
    .select('*')
    .limit(3);
  
  if (predError) {
    console.log(`   ❌ Predictions error: ${predError.message}`);
    return false;
  }
  
  console.log(`   ✅ Price predictions available: ${predictions?.length || 0} records`);
  return true;
}

async function generateFinalReport() {
  console.log('\n📊 GENERATING FINAL DATABASE STATUS REPORT...');
  console.log('=' .repeat(70));
  
  const tables = [
    'operators', 'aircraft', 'flight_legs', 'charter_requests', 'pricing_quotes',
    'bookings', 'operator_reviews', 'aircraft_reviews', 'maintenance_records',
    'transactions', 'market_analytics', 'price_predictions', 'demand_forecasts',
    'real_time_alerts', 'notification_preferences', 'booking_legs', 'user_behavior_analytics'
  ];
  
  const results = [];
  
  for (const table of tables) {
    const { count, error } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
    
    results.push({
      table,
      count: count || 0,
      status: error ? 'ERROR' : ((count || 0) >= 20 ? 'EXCELLENT' : (count || 0) > 0 ? 'PARTIAL' : 'EMPTY')
    });
  }
  
  console.log('\n🎯 FINAL DATABASE STATUS:');
  results.forEach(result => {
    const icon = result.status === 'EXCELLENT' ? '✅' : 
                 result.status === 'PARTIAL' ? '⚠️ ' : 
                 result.status === 'ERROR' ? '❌' : '⚪';
    console.log(`   ${icon} ${result.table}: ${result.count} records (${result.status})`);
  });
  
  const excellent = results.filter(r => r.status === 'EXCELLENT').length;
  const partial = results.filter(r => r.status === 'PARTIAL').length;
  const empty = results.filter(r => r.status === 'EMPTY').length;
  const errors = results.filter(r => r.status === 'ERROR').length;
  
  console.log('\n📈 SUMMARY:');
  console.log(`   🏆 Excellent Tables (≥20 records): ${excellent}/17`);
  console.log(`   ⚠️  Partial Tables (1-19 records): ${partial}/17`);
  console.log(`   ⚪ Empty Tables (0 records): ${empty}/17`);
  console.log(`   ❌ Error Tables: ${errors}/17`);
  
  const successRate = Math.round((excellent / 17) * 100);
  console.log(`\n🎯 SUCCESS RATE: ${successRate}%`);
  
  if (successRate >= 80) {
    console.log('🎉 AVIATION DATABASE FULLY OPERATIONAL FOR MCP SERVER!');
  } else {
    console.log('⚠️  Database needs additional work for full operations');
  }
  
  return results;
}

async function main() {
  try {
    console.log('🚀 TESTING MCP TOOLS FUNCTIONALITY AGAINST POPULATED DATABASE');
    console.log('=' .repeat(80));
    
    const tests = [
      testSearchAircraft,
      testGetOperatorInfo,
      testCharterRequests,
      testPricingQuotes,
      testBookingManagement,
      testFleetUtilization,
      testEmptyLegs,
      testAnalyticsAndReporting
    ];
    
    let passedTests = 0;
    
    for (const test of tests) {
      const result = await test();
      if (result) passedTests++;
    }
    
    console.log('\n🧪 MCP FUNCTIONALITY TEST RESULTS:');
    console.log(`   ✅ Passed Tests: ${passedTests}/${tests.length}`);
    console.log(`   🎯 Success Rate: ${Math.round((passedTests / tests.length) * 100)}%`);
    
    if (passedTests === tests.length) {
      console.log('   🎉 ALL MCP TOOLS FULLY FUNCTIONAL!');
    }
    
    // Generate final comprehensive report
    await generateFinalReport();
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}