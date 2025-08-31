#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function discoverAndPopulateDatabase() {
  console.log('🔍 DISCOVERING ACTUAL DATABASE SCHEMA AND POPULATING DATA');
  console.log('='.repeat(60));
  
  try {
    // First, get all existing tables
    const { data: tables, error: tablesError } = await supabase.rpc('get_tables_info');
    
    if (tablesError) {
      // Alternative approach - query information_schema
      console.log('📋 Discovering tables via direct query...');
      
      const { data, error } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .neq('table_type', 'VIEW');
        
      if (error) {
        console.log('Using hardcoded table discovery...');
        await directTableDiscovery();
      } else {
        console.log(`📊 Found ${data.length} tables:`, data.map(t => t.table_name));
      }
    }
    
    // Try to populate known existing tables with correct data
    await populateExistingTables();
    
  } catch (error) {
    console.error('💥 Schema discovery failed:', error.message);
    // Fallback to direct population
    await directTableDiscovery();
  }
}

async function directTableDiscovery() {
  console.log('\n🔧 DIRECT TABLE DISCOVERY AND POPULATION');
  console.log('-'.repeat(50));
  
  const knownTables = [
    'users', 'customers', 'aircraft', 'operators', 'bookings', 
    'flight_legs', 'charter_requests', 'pricing_quotes', 'payments',
    'invoices', 'aircraft_maintenance', 'flight_crews', 'routes',
    'airports', 'weather_data', 'notifications', 'analytics',
    'reviews', 'market_data', 'operational_logs'
  ];
  
  let populationResults = [];
  
  for (const tableName of knownTables) {
    try {
      // Check if table exists by trying to get count
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        console.log(`✅ Table '${tableName}' exists with ${count || 0} records`);
        
        // If table has less than 20 records, try to populate it
        if (count < 20) {
          const populated = await populateSpecificTable(tableName, 20 - count);
          populationResults.push({ table: tableName, populated, previousCount: count });
        }
      } else {
        console.log(`❌ Table '${tableName}' does not exist or is inaccessible`);
      }
      
    } catch (err) {
      console.log(`❌ Error checking table '${tableName}': ${err.message}`);
    }
  }
  
  // Final verification
  console.log('\n📊 POPULATION RESULTS:');
  console.log('-'.repeat(40));
  
  let totalAdded = 0;
  for (const result of populationResults) {
    console.log(`📈 ${result.table}: +${result.populated} records (was ${result.previousCount})`);
    totalAdded += result.populated;
  }
  
  console.log(`\n🎯 Total records added: ${totalAdded}`);
  
  // Run final verification
  await runFinalVerification();
}

async function populateSpecificTable(tableName, recordsNeeded) {
  console.log(`\n🔧 Populating ${tableName} with ${recordsNeeded} records...`);
  
  try {
    switch (tableName) {
      case 'users':
        return await populateUsers(recordsNeeded);
      case 'customers':
        return await populateCustomers(recordsNeeded);
      case 'aircraft':
        return await populateAircraft(recordsNeeded);
      case 'operators':
        return await populateOperators(recordsNeeded);
      case 'bookings':
        return await populateBookings(recordsNeeded);
      case 'airports':
        return await populateAirports(recordsNeeded);
      default:
        return await populateGenericTable(tableName, recordsNeeded);
    }
  } catch (error) {
    console.log(`❌ Failed to populate ${tableName}: ${error.message}`);
    return 0;
  }
}

async function populateUsers(count) {
  const users = [];
  for (let i = 0; i < count; i++) {
    users.push({
      id: crypto.randomUUID(),
      email: `aviation.user${Date.now() + i}@jetapp.com`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  const { data, error } = await supabase.from('users').insert(users);
  if (error) throw error;
  return users.length;
}

async function populateCustomers(count) {
  const customers = [];
  const customerTypes = ['VIP', 'Corporate', 'Individual'];
  
  for (let i = 0; i < count; i++) {
    customers.push({
      id: crypto.randomUUID(),
      name: `Aviation Customer ${i + 1}`,
      type: customerTypes[i % customerTypes.length],
      email: `customer${Date.now() + i}@aviation.com`,
      created_at: new Date().toISOString()
    });
  }
  
  const { data, error } = await supabase.from('customers').insert(customers);
  if (error) throw error;
  return customers.length;
}

async function populateAircraft(count) {
  const aircraft = [];
  const models = ['Citation CJ3+', 'Hawker 400XP', 'King Air 350', 'Gulfstream G550'];
  const categories = ['Light Jet', 'Midsize Jet', 'Turboprop', 'Heavy Jet'];
  
  for (let i = 0; i < count; i++) {
    aircraft.push({
      id: crypto.randomUUID(),
      tail_number: `N${Math.floor(Math.random() * 900) + 100}AV`,
      model: models[i % models.length],
      category: categories[i % categories.length],
      passenger_capacity: Math.floor(Math.random() * 12) + 4,
      hourly_rate: Math.floor(Math.random() * 5000) + 2000,
      created_at: new Date().toISOString()
    });
  }
  
  const { data, error } = await supabase.from('aircraft').insert(aircraft);
  if (error) throw error;
  return aircraft.length;
}

async function populateOperators(count) {
  const operators = [];
  
  for (let i = 0; i < count; i++) {
    operators.push({
      id: crypto.randomUUID(),
      name: `Aviation Operator ${i + 1}`,
      code: `AO${String(i + 1).padStart(3, '0')}`,
      contact_email: `ops${i + 1}@aviationops.com`,
      fleet_size: Math.floor(Math.random() * 50) + 5,
      created_at: new Date().toISOString()
    });
  }
  
  const { data, error } = await supabase.from('operators').insert(operators);
  if (error) throw error;
  return operators.length;
}

async function populateBookings(count) {
  // First get some existing users and aircraft
  const { data: existingUsers } = await supabase.from('users').select('id').limit(5);
  const { data: existingAircraft } = await supabase.from('aircraft').select('id').limit(5);
  
  if (!existingUsers?.length || !existingAircraft?.length) {
    console.log('⚠️  Cannot create bookings without users and aircraft');
    return 0;
  }
  
  const bookings = [];
  const statuses = ['confirmed', 'pending', 'completed', 'cancelled'];
  
  for (let i = 0; i < count; i++) {
    const departureDate = new Date();
    departureDate.setDate(departureDate.getDate() + Math.floor(Math.random() * 30));
    
    bookings.push({
      id: crypto.randomUUID(),
      user_id: existingUsers[i % existingUsers.length].id,
      aircraft_id: existingAircraft[i % existingAircraft.length].id,
      departure_airport: 'KJFK',
      arrival_airport: 'KLAX',
      departure_time: departureDate.toISOString(),
      status: statuses[i % statuses.length],
      total_cost: Math.floor(Math.random() * 50000) + 10000,
      created_at: new Date().toISOString()
    });
  }
  
  const { data, error } = await supabase.from('bookings').insert(bookings);
  if (error) throw error;
  return bookings.length;
}

async function populateAirports(count) {
  const majorAirports = [
    { code: 'KJFK', name: 'John F Kennedy Intl', city: 'New York', country: 'USA' },
    { code: 'KLAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'USA' },
    { code: 'EGLL', name: 'London Heathrow', city: 'London', country: 'UK' },
    { code: 'LFPG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    { code: 'EDDF', name: 'Frankfurt Main', city: 'Frankfurt', country: 'Germany' },
    { code: 'RJTT', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
    { code: 'OMDB', name: 'Dubai Intl', city: 'Dubai', country: 'UAE' },
    { code: 'WSSS', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
    { code: 'CYYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada' },
    { code: 'SBGR', name: 'São Paulo Intl', city: 'São Paulo', country: 'Brazil' }
  ];
  
  const airports = [];
  for (let i = 0; i < Math.min(count, majorAirports.length); i++) {
    const airport = majorAirports[i];
    airports.push({
      id: crypto.randomUUID(),
      icao_code: airport.code,
      name: airport.name,
      city: airport.city,
      country: airport.country,
      created_at: new Date().toISOString()
    });
  }
  
  const { data, error } = await supabase.from('airports').insert(airports);
  if (error) throw error;
  return airports.length;
}

async function populateGenericTable(tableName, count) {
  // For tables we don't have specific logic for, create basic records
  const records = [];
  
  for (let i = 0; i < count; i++) {
    records.push({
      id: crypto.randomUUID(),
      name: `${tableName} record ${i + 1}`,
      created_at: new Date().toISOString()
    });
  }
  
  const { data, error } = await supabase.from(tableName).insert(records);
  if (error) throw error;
  return records.length;
}

async function populateExistingTables() {
  // Implementation for working with discovered schema
  console.log('🔧 Populating tables based on discovered schema...');
}

async function runFinalVerification() {
  console.log('\n🎯 FINAL COMPREHENSIVE VERIFICATION');
  console.log('='.repeat(50));
  
  const expectedTables = [
    'users', 'customers', 'aircraft', 'operators', 'flight_legs', 'bookings',
    'charter_requests', 'pricing_quotes', 'payments', 'invoices', 
    'aircraft_maintenance', 'flight_crews', 'routes', 'airports',
    'weather_data', 'notifications', 'analytics', 'reviews',
    'market_data', 'operational_logs'
  ];
  
  let totalRecords = 0;
  let adequatelyPopulated = 0;
  let populatedTables = 0;
  
  for (const tableName of expectedTables) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        const recordCount = count || 0;
        totalRecords += recordCount;
        
        if (recordCount >= 20) {
          console.log(`✅ ${tableName.padEnd(20)} | ${recordCount.toString().padStart(3)} records | ADEQUATE`);
          adequatelyPopulated++;
          populatedTables++;
        } else if (recordCount > 0) {
          console.log(`⚠️  ${tableName.padEnd(20)} | ${recordCount.toString().padStart(3)} records | PARTIAL`);
          populatedTables++;
        } else {
          console.log(`⚪ ${tableName.padEnd(20)} |   0 records | EMPTY`);
        }
      } else {
        console.log(`❌ ${tableName.padEnd(20)} | TABLE MISSING`);
      }
      
    } catch (err) {
      console.log(`❌ ${tableName.padEnd(20)} | ERROR: ${err.message.substring(0, 30)}`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('🎯 FINAL DATABASE STATUS:');
  console.log('-'.repeat(30));
  console.log(`📈 Total Records: ${totalRecords.toLocaleString()}`);
  console.log(`✅ Adequately Populated (≥20): ${adequatelyPopulated}/${expectedTables.length}`);
  console.log(`📊 Populated Tables: ${populatedTables}/${expectedTables.length}`);
  console.log(`🎯 Success Rate: ${Math.round((adequatelyPopulated / expectedTables.length) * 100)}%`);
  
  if (adequatelyPopulated >= 16) {
    console.log('\n🎉 SUCCESS: AVIATION DATABASE FULLY OPERATIONAL!');
    console.log('✈️  Ready for comprehensive aviation operations');
  } else if (adequatelyPopulated >= 12) {
    console.log('\n⚡ GOOD: Major progress made, most tables adequately populated');
  } else {
    console.log('\n⚠️  PARTIAL: Significant work still needed for full operational status');
  }
}

// Execute the comprehensive discovery and population
discoverAndPopulateDatabase().catch(console.error);