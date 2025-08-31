#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingTablesAndPopulate() {
  console.log('🏗️  CREATING MISSING TABLES AND POPULATING DATABASE');
  console.log('='.repeat(60));
  
  try {
    // Create missing tables first
    await createMissingTables();
    
    // Then populate all tables
    await populateAllTables();
    
    // Final verification
    await runFinalVerification();
    
  } catch (error) {
    console.error('💥 Process failed:', error.message);
    process.exit(1);
  }
}

async function createMissingTables() {
  console.log('\n🔧 CREATING MISSING TABLES...');
  console.log('-'.repeat(40));
  
  const tableCreationQueries = [
    // Customers table (doesn't exist)
    {
      name: 'customers',
      query: `
        CREATE TABLE IF NOT EXISTS public.customers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          type VARCHAR(50) DEFAULT 'Individual',
          email VARCHAR(255) UNIQUE NOT NULL,
          phone VARCHAR(50),
          company VARCHAR(255),
          address TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Payments table (doesn't exist)
    {
      name: 'payments',
      query: `
        CREATE TABLE IF NOT EXISTS public.payments (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          booking_id UUID REFERENCES public.bookings(id),
          amount DECIMAL(10,2) NOT NULL,
          currency VARCHAR(3) DEFAULT 'USD',
          payment_method VARCHAR(50) DEFAULT 'credit_card',
          status VARCHAR(50) DEFAULT 'pending',
          transaction_id VARCHAR(255),
          processed_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Airports table (doesn't exist)
    {
      name: 'airports',
      query: `
        CREATE TABLE IF NOT EXISTS public.airports (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          icao_code VARCHAR(4) UNIQUE NOT NULL,
          iata_code VARCHAR(3),
          name VARCHAR(255) NOT NULL,
          city VARCHAR(255) NOT NULL,
          country VARCHAR(255) NOT NULL,
          latitude DECIMAL(10, 8),
          longitude DECIMAL(11, 8),
          elevation_ft INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Routes table (doesn't exist)
    {
      name: 'routes',
      query: `
        CREATE TABLE IF NOT EXISTS public.routes (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          departure_airport VARCHAR(4) NOT NULL,
          arrival_airport VARCHAR(4) NOT NULL,
          distance_nm INTEGER,
          estimated_flight_time INTEGER,
          popularity_score INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Weather Data table (doesn't exist)
    {
      name: 'weather_data',
      query: `
        CREATE TABLE IF NOT EXISTS public.weather_data (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          airport_code VARCHAR(4) NOT NULL,
          temperature_celsius DECIMAL(5,2),
          visibility_km DECIMAL(5,2),
          wind_speed_kt INTEGER,
          wind_direction INTEGER,
          conditions VARCHAR(100),
          recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Notifications table (doesn't exist)
    {
      name: 'notifications',
      query: `
        CREATE TABLE IF NOT EXISTS public.notifications (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id),
          type VARCHAR(50) NOT NULL,
          title VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Analytics table (doesn't exist)
    {
      name: 'analytics',
      query: `
        CREATE TABLE IF NOT EXISTS public.analytics (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          event_type VARCHAR(100) NOT NULL,
          event_data JSONB,
          user_id UUID,
          session_id VARCHAR(255),
          occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Reviews table (doesn't exist) 
    {
      name: 'reviews',
      query: `
        CREATE TABLE IF NOT EXISTS public.reviews (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          booking_id UUID REFERENCES public.bookings(id),
          customer_id UUID REFERENCES public.customers(id),
          rating INTEGER CHECK (rating >= 1 AND rating <= 5),
          title VARCHAR(255),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Market Data table (doesn't exist)
    {
      name: 'market_data',
      query: `
        CREATE TABLE IF NOT EXISTS public.market_data (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          aircraft_category VARCHAR(100) NOT NULL,
          route VARCHAR(255),
          average_price DECIMAL(10,2),
          demand_score INTEGER,
          supply_score INTEGER,
          recorded_date DATE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    
    // Operational Logs table (doesn't exist)
    {
      name: 'operational_logs',
      query: `
        CREATE TABLE IF NOT EXISTS public.operational_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          operation_type VARCHAR(100) NOT NULL,
          entity_type VARCHAR(100),
          entity_id UUID,
          description TEXT NOT NULL,
          severity VARCHAR(20) DEFAULT 'info',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];
  
  let createdCount = 0;
  let errorCount = 0;
  
  for (const table of tableCreationQueries) {
    try {
      console.log(`🔧 Creating table: ${table.name}...`);
      
      const { data, error } = await supabase.rpc('exec_sql', { 
        sql: table.query.trim() 
      });
      
      if (error) {
        console.log(`❌ Failed to create ${table.name}: ${error.message}`);
        errorCount++;
      } else {
        console.log(`✅ Successfully created table: ${table.name}`);
        createdCount++;
      }
      
      // Small delay between operations
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (err) {
      console.log(`❌ Exception creating ${table.name}: ${err.message}`);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Table Creation Results: ${createdCount} created, ${errorCount} errors`);
}

async function populateAllTables() {
  console.log('\n📋 POPULATING ALL TABLES WITH DATA...');
  console.log('-'.repeat(40));
  
  const populationPlan = [
    { table: 'customers', target: 25, populate: populateCustomers },
    { table: 'airports', target: 25, populate: populateAirports },
    { table: 'routes', target: 20, populate: populateRoutes },
    { table: 'payments', target: 20, populate: populatePayments },
    { table: 'weather_data', target: 30, populate: populateWeatherData },
    { table: 'notifications', target: 25, populate: populateNotifications },
    { table: 'analytics', target: 40, populate: populateAnalytics },
    { table: 'reviews', target: 20, populate: populateReviews },
    { table: 'market_data', target: 20, populate: populateMarketData },
    { table: 'operational_logs', target: 30, populate: populateOperationalLogs }
  ];
  
  let totalAdded = 0;
  
  for (const plan of populationPlan) {
    try {
      console.log(`\n🔧 Populating ${plan.table} with ${plan.target} records...`);
      const added = await plan.populate(plan.target);
      console.log(`✅ Added ${added} records to ${plan.table}`);
      totalAdded += added;
      
      // Small delay between operations
      await new Promise(resolve => setTimeout(resolve, 300));
      
    } catch (error) {
      console.log(`❌ Failed to populate ${plan.table}: ${error.message}`);
    }
  }
  
  console.log(`\n🎯 Total records added: ${totalAdded}`);
}

async function populateCustomers(count) {
  const customers = [];
  const customerTypes = ['VIP', 'Corporate', 'Individual', 'Government'];
  const companies = ['Microsoft', 'Google', 'Amazon', 'Apple', 'Tesla', 'Netflix', 'Meta'];
  
  for (let i = 0; i < count; i++) {
    const type = customerTypes[i % customerTypes.length];
    customers.push({
      id: crypto.randomUUID(),
      name: `${type} Customer ${i + 1}`,
      type: type,
      email: `customer${Date.now() + i}@aviation${i}.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      company: type === 'Corporate' ? companies[i % companies.length] : null,
      address: `${100 + i} Aviation Blvd, Flight City, FC ${10000 + i}`,
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('customers').insert(customers);
  if (error) throw error;
  return customers.length;
}

async function populateAirports(count) {
  const majorAirports = [
    { icao: 'KJFK', iata: 'JFK', name: 'John F Kennedy International', city: 'New York', country: 'USA' },
    { icao: 'KLAX', iata: 'LAX', name: 'Los Angeles International', city: 'Los Angeles', country: 'USA' },
    { icao: 'EGLL', iata: 'LHR', name: 'London Heathrow', city: 'London', country: 'United Kingdom' },
    { icao: 'LFPG', iata: 'CDG', name: 'Charles de Gaulle', city: 'Paris', country: 'France' },
    { icao: 'EDDF', iata: 'FRA', name: 'Frankfurt am Main', city: 'Frankfurt', country: 'Germany' },
    { icao: 'RJTT', iata: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'Japan' },
    { icao: 'OMDB', iata: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'UAE' },
    { icao: 'WSSS', iata: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'Singapore' },
    { icao: 'CYYZ', iata: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'Canada' },
    { icao: 'SBGR', iata: 'GRU', name: 'São Paulo International', city: 'São Paulo', country: 'Brazil' },
    { icao: 'YSSY', iata: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'Australia' },
    { icao: 'ZSPD', iata: 'PVG', name: 'Shanghai Pudong', city: 'Shanghai', country: 'China' },
    { icao: 'LEMD', iata: 'MAD', name: 'Madrid Barajas', city: 'Madrid', country: 'Spain' },
    { icao: 'LIRF', iata: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'Italy' },
    { icao: 'EHAM', iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'Netherlands' },
    { icao: 'OTHH', iata: 'DOH', name: 'Hamad International', city: 'Doha', country: 'Qatar' },
    { icao: 'KJFK', iata: 'JFK', name: 'Kennedy International', city: 'New York', country: 'USA' },
    { icao: 'KORD', iata: 'ORD', name: 'Chicago O\'Hare', city: 'Chicago', country: 'USA' },
    { icao: 'KDEN', iata: 'DEN', name: 'Denver International', city: 'Denver', country: 'USA' },
    { icao: 'KLAS', iata: 'LAS', name: 'McCarran International', city: 'Las Vegas', country: 'USA' },
    { icao: 'KMIA', iata: 'MIA', name: 'Miami International', city: 'Miami', country: 'USA' },
    { icao: 'KSEA', iata: 'SEA', name: 'Seattle Tacoma', city: 'Seattle', country: 'USA' },
    { icao: 'KBOS', iata: 'BOS', name: 'Boston Logan', city: 'Boston', country: 'USA' },
    { icao: 'KATL', iata: 'ATL', name: 'Atlanta Hartsfield', city: 'Atlanta', country: 'USA' },
    { icao: 'KDFW', iata: 'DFW', name: 'Dallas Fort Worth', city: 'Dallas', country: 'USA' }
  ];
  
  const airports = [];
  for (let i = 0; i < Math.min(count, majorAirports.length); i++) {
    const airport = majorAirports[i];
    airports.push({
      id: crypto.randomUUID(),
      icao_code: airport.icao,
      iata_code: airport.iata,
      name: airport.name,
      city: airport.city,
      country: airport.country,
      latitude: (Math.random() - 0.5) * 180,
      longitude: (Math.random() - 0.5) * 360,
      elevation_ft: Math.floor(Math.random() * 5000),
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('airports').insert(airports);
  if (error) throw error;
  return airports.length;
}

async function populateRoutes(count) {
  const routes = [];
  const popularRoutes = [
    { name: 'New York - Los Angeles', dep: 'KJFK', arr: 'KLAX', dist: 2145 },
    { name: 'London - Paris', dep: 'EGLL', arr: 'LFPG', dist: 214 },
    { name: 'Miami - New York', dep: 'KMIA', arr: 'KJFK', dist: 1090 },
    { name: 'Los Angeles - Las Vegas', dep: 'KLAX', arr: 'KLAS', dist: 236 },
    { name: 'Chicago - New York', dep: 'KORD', arr: 'KJFK', dist: 740 }
  ];
  
  for (let i = 0; i < count; i++) {
    const base = popularRoutes[i % popularRoutes.length];
    routes.push({
      id: crypto.randomUUID(),
      name: `${base.name} Route ${i + 1}`,
      departure_airport: base.dep,
      arrival_airport: base.arr,
      distance_nm: base.dist + Math.floor(Math.random() * 100),
      estimated_flight_time: Math.floor(base.dist / 8) + Math.floor(Math.random() * 30),
      popularity_score: Math.floor(Math.random() * 100),
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('routes').insert(routes);
  if (error) throw error;
  return routes.length;
}

async function populatePayments(count) {
  // Get some existing booking IDs
  const { data: bookings } = await supabase.from('bookings').select('id').limit(10);
  if (!bookings?.length) {
    console.log('⚠️  No bookings found, skipping payments');
    return 0;
  }
  
  const payments = [];
  const methods = ['credit_card', 'wire_transfer', 'check', 'cash'];
  const statuses = ['completed', 'pending', 'failed', 'refunded'];
  
  for (let i = 0; i < count; i++) {
    payments.push({
      id: crypto.randomUUID(),
      booking_id: bookings[i % bookings.length].id,
      amount: (Math.random() * 50000 + 5000).toFixed(2),
      currency: 'USD',
      payment_method: methods[i % methods.length],
      status: statuses[i % statuses.length],
      transaction_id: `TXN-${Date.now()}-${i}`,
      processed_at: new Date().toISOString(),
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('payments').insert(payments);
  if (error) throw error;
  return payments.length;
}

async function populateWeatherData(count) {
  const weatherData = [];
  const conditions = ['Clear', 'Partly Cloudy', 'Overcast', 'Rain', 'Snow', 'Fog'];
  const airports = ['KJFK', 'KLAX', 'EGLL', 'LFPG', 'EDDF', 'RJTT', 'OMDB'];
  
  for (let i = 0; i < count; i++) {
    const recordTime = new Date();
    recordTime.setHours(recordTime.getHours() - Math.floor(Math.random() * 72));
    
    weatherData.push({
      id: crypto.randomUUID(),
      airport_code: airports[i % airports.length],
      temperature_celsius: (Math.random() * 40 - 10).toFixed(1),
      visibility_km: (Math.random() * 20 + 1).toFixed(1),
      wind_speed_kt: Math.floor(Math.random() * 40),
      wind_direction: Math.floor(Math.random() * 360),
      conditions: conditions[i % conditions.length],
      recorded_at: recordTime.toISOString(),
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('weather_data').insert(weatherData);
  if (error) throw error;
  return weatherData.length;
}

async function populateNotifications(count) {
  // Get some user IDs
  const { data: users } = await supabase.from('users').select('id').limit(5);
  if (!users?.length) {
    console.log('⚠️  No users found, creating notifications without user_id');
  }
  
  const notifications = [];
  const types = ['booking_confirmed', 'flight_update', 'payment_received', 'system_alert'];
  const titles = [
    'Booking Confirmed',
    'Flight Status Update',
    'Payment Processed',
    'System Maintenance',
    'Weather Advisory'
  ];
  
  for (let i = 0; i < count; i++) {
    notifications.push({
      id: crypto.randomUUID(),
      user_id: users?.length ? users[i % users.length].id : null,
      type: types[i % types.length],
      title: titles[i % titles.length],
      message: `This is notification message ${i + 1} with important aviation information.`,
      read: Math.random() > 0.7,
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('notifications').insert(notifications);
  if (error) throw error;
  return notifications.length;
}

async function populateAnalytics(count) {
  const analytics = [];
  const eventTypes = ['page_view', 'booking_search', 'quote_request', 'user_login', 'flight_booking'];
  
  for (let i = 0; i < count; i++) {
    const eventTime = new Date();
    eventTime.setMinutes(eventTime.getMinutes() - Math.floor(Math.random() * 10080)); // Last week
    
    analytics.push({
      id: crypto.randomUUID(),
      event_type: eventTypes[i % eventTypes.length],
      event_data: JSON.stringify({
        page: `/aviation/page${i % 10}`,
        duration: Math.floor(Math.random() * 300),
        user_agent: 'Aviation Browser 1.0'
      }),
      user_id: crypto.randomUUID(),
      session_id: `session_${Date.now()}_${i}`,
      occurred_at: eventTime.toISOString(),
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('analytics').insert(analytics);
  if (error) throw error;
  return analytics.length;
}

async function populateReviews(count) {
  // Get some existing booking and customer IDs
  const { data: bookings } = await supabase.from('bookings').select('id').limit(10);
  const { data: customers } = await supabase.from('customers').select('id').limit(10);
  
  if (!bookings?.length || !customers?.length) {
    console.log('⚠️  Insufficient bookings/customers for reviews');
    return 0;
  }
  
  const reviews = [];
  const titles = [
    'Excellent Service',
    'Great Flight Experience',
    'Professional Crew',
    'Comfortable Journey',
    'Outstanding Value'
  ];
  
  const comments = [
    'The flight crew was professional and the aircraft was in excellent condition.',
    'Smooth booking process and on-time departure. Highly recommended!',
    'Great service from start to finish. Will definitely book again.',
    'The aircraft was clean and well-maintained. Excellent experience overall.',
    'Outstanding customer service and attention to detail.'
  ];
  
  for (let i = 0; i < count; i++) {
    reviews.push({
      id: crypto.randomUUID(),
      booking_id: bookings[i % bookings.length].id,
      customer_id: customers[i % customers.length].id,
      rating: Math.floor(Math.random() * 2) + 4, // 4 or 5 stars
      title: titles[i % titles.length],
      comment: comments[i % comments.length],
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('reviews').insert(reviews);
  if (error) throw error;
  return reviews.length;
}

async function populateMarketData(count) {
  const marketData = [];
  const categories = ['Light Jet', 'Midsize Jet', 'Heavy Jet', 'Ultra Long Range'];
  const routes = ['KJFK-KLAX', 'EGLL-LFPG', 'KMIA-KJFK', 'KLAS-KLAX'];
  
  for (let i = 0; i < count; i++) {
    const recordDate = new Date();
    recordDate.setDate(recordDate.getDate() - Math.floor(Math.random() * 30));
    
    marketData.push({
      id: crypto.randomUUID(),
      aircraft_category: categories[i % categories.length],
      route: routes[i % routes.length],
      average_price: (Math.random() * 30000 + 10000).toFixed(2),
      demand_score: Math.floor(Math.random() * 100),
      supply_score: Math.floor(Math.random() * 100),
      recorded_date: recordDate.toISOString().split('T')[0],
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('market_data').insert(marketData);
  if (error) throw error;
  return marketData.length;
}

async function populateOperationalLogs(count) {
  const logs = [];
  const operationTypes = ['booking_created', 'payment_processed', 'flight_scheduled', 'maintenance_completed'];
  const entityTypes = ['booking', 'payment', 'aircraft', 'flight'];
  const severities = ['info', 'warning', 'error', 'debug'];
  
  for (let i = 0; i < count; i++) {
    logs.push({
      id: crypto.randomUUID(),
      operation_type: operationTypes[i % operationTypes.length],
      entity_type: entityTypes[i % entityTypes.length],
      entity_id: crypto.randomUUID(),
      description: `Operational log entry ${i + 1}: ${operationTypes[i % operationTypes.length]} completed successfully`,
      severity: severities[i % severities.length],
      created_at: new Date().toISOString()
    });
  }
  
  const { error } = await supabase.from('operational_logs').insert(logs);
  if (error) throw error;
  return logs.length;
}

async function runFinalVerification() {
  console.log('\n🎯 FINAL COMPREHENSIVE VERIFICATION');
  console.log('='.repeat(50));
  
  const expectedTables = [
    'users', 'customers', 'aircraft', 'operators', 'flight_legs', 'bookings',
    'charter_requests', 'pricing_quotes', 'payments', 'invoices', 
    'routes', 'airports', 'weather_data', 'notifications', 'analytics', 
    'reviews', 'market_data', 'operational_logs'
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
    console.log('🚀 All critical systems now have adequate data');
  } else if (adequatelyPopulated >= 12) {
    console.log('\n⚡ GOOD: Major progress made, most tables adequately populated');
    console.log('🔧 Minor gaps remain but system is largely functional');
  } else {
    console.log('\n⚠️  PARTIAL: Some progress made but more work needed');
    console.log('🚧 System requires additional population for full functionality');
  }
}

// Execute the comprehensive process
createMissingTablesAndPopulate().catch(console.error);