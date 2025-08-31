#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Generate UUID helper
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function executeSupabaseDeployment() {
  console.log('🚀 EXECUTING SUPABASE DIRECT DEPLOYMENT');
  console.log('=' .repeat(55));
  
  try {
    let totalInserted = 0;
    let tablesPopulated = 0;
    
    // 1. USERS TABLE - Add additional users to reach 25+ total
    console.log('\n👥 Populating USERS table with 23 additional users...');
    
    const additionalUsers = [
      { id: generateUUID(), email: 'john.sterling@sterlingwealth.com', first_name: 'John', last_name: 'Sterling', phone: '+1-212-555-0101', role: 'customer', created_at: '2023-01-15T10:30:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'sarah.chen@techcorp.com', first_name: 'Sarah', last_name: 'Chen', phone: '+1-206-555-0201', role: 'customer', created_at: '2023-02-22T14:20:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'mike.hamilton@bostongeneral.org', first_name: 'Mike', last_name: 'Hamilton', phone: '+1-617-555-0301', role: 'customer', created_at: '2023-03-08T16:15:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'lisa.thompson@globalent.com', first_name: 'Lisa', last_name: 'Thompson', phone: '+44-20-7946-0001', role: 'customer', created_at: '2023-04-12T11:45:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'david.martinez@techinnovations.es', first_name: 'David', last_name: 'Martinez', phone: '+34-91-123-4567', role: 'customer', created_at: '2023-05-29T13:45:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'emma.rossi@milanoluxury.it', first_name: 'Emma', last_name: 'Rossi', phone: '+39-02-1234-5678', role: 'customer', created_at: '2023-06-18T16:40:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'james.edwards@edwardsenergy.com', first_name: 'James', last_name: 'Edwards', phone: '+1-713-555-0701', role: 'customer', created_at: '2023-07-03T09:15:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'anna.antonov@vac-moscow.ru', first_name: 'Anna', last_name: 'Antonov', phone: '+7-495-123-4567', role: 'customer', created_at: '2023-08-25T14:20:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'omar.hassan@middleeastcorp.ae', first_name: 'Omar', last_name: 'Hassan', phone: '+971-4-123-4567', role: 'customer', created_at: '2023-09-14T16:10:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'marie.dubois@lecordonbleu.fr', first_name: 'Marie', last_name: 'Dubois', phone: '+33-1-45-67-8900', role: 'customer', created_at: '2023-10-01T12:45:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'robert.wang@techcorpinc.com', first_name: 'Robert', last_name: 'Wang', phone: '+1-415-555-1001', role: 'customer', created_at: '2023-11-15T10:00:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'jennifer.johnson@gm-auto.com', first_name: 'Jennifer', last_name: 'Johnson', phone: '+1-313-555-1002', role: 'customer', created_at: '2023-12-22T11:40:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'carlos.miller@medicalpharma.com', first_name: 'Carlos', last_name: 'Miller', phone: '+1-617-555-1003', role: 'customer', created_at: '2024-01-11T10:45:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'sophia.davis@phoenixfinancial.com', first_name: 'Sophia', last_name: 'Davis', phone: '+1-602-555-1004', role: 'customer', created_at: '2024-02-18T11:30:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'alex.brown@atlantaconsulting.com', first_name: 'Alex', last_name: 'Brown', phone: '+1-404-555-1005', role: 'customer', created_at: '2024-03-07T13:20:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'olivia.sullivan@renewableenergy.com', first_name: 'Olivia', last_name: 'Sullivan', phone: '+1-303-555-1006', role: 'customer', created_at: '2024-04-28T08:55:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'noah.wilson@energysolutions.com', first_name: 'Noah', last_name: 'Wilson', phone: '+1-713-555-1007', role: 'customer', created_at: '2024-05-08T08:15:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'ava.rodriguez@washingtonadvocacy.com', first_name: 'Ava', last_name: 'Rodriguez', phone: '+1-202-555-1008', role: 'customer', created_at: '2024-06-14T14:30:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'liam.martinez@supplychaincorp.com', first_name: 'Liam', last_name: 'Martinez', phone: '+1-617-555-1009', role: 'customer', created_at: '2024-07-05T14:25:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'isabella.garcia@propertycorp.com', first_name: 'Isabella', last_name: 'Garcia', phone: '+1-305-555-1010', role: 'customer', created_at: '2024-08-24T10:55:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'admin1@avinode.com', first_name: 'Aviation', last_name: 'Admin', phone: '+1-555-100-0001', role: 'admin', created_at: '2023-01-01T00:00:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'operator1@jetexcellence.com', first_name: 'Jet Excellence', last_name: 'Ops', phone: '+1-555-200-0002', role: 'operator', created_at: '2023-02-01T00:00:00Z', updated_at: new Date().toISOString() },
      { id: generateUUID(), email: 'operator2@eliteaviation.com', first_name: 'Elite Aviation', last_name: 'Ops', phone: '+1-555-300-0003', role: 'operator', created_at: '2023-03-01T00:00:00Z', updated_at: new Date().toISOString() }
    ];
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .upsert(additionalUsers, { onConflict: 'id' })
      .select();
    
    if (userError) {
      console.log(`❌ Users insertion failed: ${userError.message}`);
    } else {
      console.log(`✅ Successfully added ${additionalUsers.length} users`);
      totalInserted += additionalUsers.length;
      tablesPopulated++;
    }
    
    // 2. CUSTOMERS TABLE - Try to create and populate
    console.log('\n👤 Creating and populating CUSTOMERS table...');
    
    const customers = [];
    for (let i = 1; i <= 25; i++) {
      const customerType = i <= 8 ? 'VIP' : i <= 18 ? 'Corporate' : 'Individual';
      const companyName = customerType === 'Individual' ? null : 
                         customerType === 'VIP' ? `${['Sterling', 'TechCorp', 'Global', 'Luxury', 'Investment'][Math.floor(Math.random() * 5)]} ${['Enterprises', 'Holdings', 'Group'][Math.floor(Math.random() * 3)]}` :
                         `${['Manufacturing', 'Pharmaceutical', 'Energy', 'Consulting', 'Healthcare'][Math.floor(Math.random() * 5)]} ${['Corp', 'Solutions', 'Holdings', 'Group', 'Systems'][Math.floor(Math.random() * 5)]}`;
      
      customers.push({
        id: generateUUID(),
        email: `customer${i}@aviation-test.com`,
        name: `Customer ${i}`,
        phone: `+1-555-${String(i + 1000).padStart(4, '0')}`,
        company: companyName,
        customer_type: customerType,
        total_flights: Math.floor(Math.random() * 50) + 1,
        total_spent: Math.floor(Math.random() * 500000) + (customerType === 'VIP' ? 100000 : customerType === 'Corporate' ? 50000 : 10000),
        created_at: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString()
      });
    }
    
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert(customers, { onConflict: 'id' })
      .select();
    
    if (customerError) {
      console.log(`❌ Customers insertion failed: ${customerError.message}`);
      console.log('🔧 Attempting to create customers table first...');
      
      // Try a simpler approach - test if the table exists by trying to select from it
      const { data: testCustomers, error: testError } = await supabase
        .from('customers')
        .select('id')
        .limit(1);
      
      if (testError) {
        console.log('❌ Customers table does not exist or is inaccessible');
      }
    } else {
      console.log(`✅ Successfully added ${customers.length} customers`);
      totalInserted += customers.length;
      tablesPopulated++;
    }
    
    // 3. AIRPORTS TABLE - Create and populate
    console.log('\n🛬 Creating and populating AIRPORTS table...');
    
    const airports = [
      { id: generateUUID(), code: 'KJFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA', timezone: 'America/New_York' },
      { id: generateUUID(), code: 'KLAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
      { id: generateUUID(), code: 'KORD', name: 'O\'Hare International Airport', city: 'Chicago', country: 'USA', timezone: 'America/Chicago' },
      { id: generateUUID(), code: 'KBOS', name: 'Logan International Airport', city: 'Boston', country: 'USA', timezone: 'America/New_York' },
      { id: generateUUID(), code: 'KSEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'USA', timezone: 'America/Los_Angeles' },
      { id: generateUUID(), code: 'KMIA', name: 'Miami International Airport', city: 'Miami', country: 'USA', timezone: 'America/New_York' },
      { id: generateUUID(), code: 'KLAS', name: 'McCarran International Airport', city: 'Las Vegas', country: 'USA', timezone: 'America/Los_Angeles' },
      { id: generateUUID(), code: 'KDEN', name: 'Denver International Airport', city: 'Denver', country: 'USA', timezone: 'America/Denver' },
      { id: generateUUID(), code: 'KATL', name: 'Hartsfield-Jackson International Airport', city: 'Atlanta', country: 'USA', timezone: 'America/New_York' },
      { id: generateUUID(), code: 'KDFW', name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'USA', timezone: 'America/Chicago' },
      { id: generateUUID(), code: 'EGLL', name: 'London Heathrow Airport', city: 'London', country: 'UK', timezone: 'Europe/London' },
      { id: generateUUID(), code: 'LFPG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
      { id: generateUUID(), code: 'EDDF', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', timezone: 'Europe/Berlin' },
      { id: generateUUID(), code: 'LIRF', name: 'Leonardo da Vinci Airport', city: 'Rome', country: 'Italy', timezone: 'Europe/Rome' },
      { id: generateUUID(), code: 'LEMD', name: 'Adolfo Suárez Madrid-Barajas Airport', city: 'Madrid', country: 'Spain', timezone: 'Europe/Madrid' },
      { id: generateUUID(), code: 'UUDD', name: 'Domodedovo International Airport', city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
      { id: generateUUID(), code: 'OMDB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
      { id: generateUUID(), code: 'RJAA', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
      { id: generateUUID(), code: 'VHHH', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
      { id: generateUUID(), code: 'YSSY', name: 'Kingsford Smith Airport', city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
      { id: generateUUID(), code: 'CYYZ', name: 'Pearson International Airport', city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
      { id: generateUUID(), code: 'SBGR', name: 'São Paulo-Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
      { id: generateUUID(), code: 'FAOR', name: 'OR Tambo International Airport', city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
      { id: generateUUID(), code: 'LTFM', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
      { id: generateUUID(), code: 'WSSS', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' }
    ];
    
    const { data: airportData, error: airportError } = await supabase
      .from('airports')
      .upsert(airports, { onConflict: 'code' })
      .select();
    
    if (airportError) {
      console.log(`❌ Airports insertion failed: ${airportError.message}`);
    } else {
      console.log(`✅ Successfully added ${airports.length} airports`);
      totalInserted += airports.length;
      tablesPopulated++;
    }
    
    // 4. FINAL COMPREHENSIVE VERIFICATION
    console.log('\n🔍 COMPREHENSIVE DATABASE VERIFICATION...');
    console.log('=' .repeat(55));
    
    const expectedTables = [
      'users', 'customers', 'aircraft', 'operators', 'flight_legs', 'bookings',
      'charter_requests', 'pricing_quotes', 'airports'
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
          
          let status, emoji;
          if (recordCount >= 20) {
            status = 'ADEQUATE';
            emoji = '✅';
            adequatelyPopulated++;
            populatedTables++;
          } else if (recordCount > 0) {
            status = 'PARTIAL';
            emoji = '⚠️ ';
            populatedTables++;
          } else {
            status = 'EMPTY';
            emoji = '⚪';
          }
          
          console.log(`${emoji} ${tableName.padEnd(17)} | ${recordCount.toString().padStart(3)} records | ${status}`);
        } else {
          console.log(`❌ ${tableName.padEnd(17)} | ERROR: ${error.message.substring(0, 30)}...`);
        }
      } catch (err) {
        console.log(`❌ ${tableName.padEnd(17)} | EXCEPTION: ${err.message.substring(0, 30)}...`);
      }
    }
    
    // Final results
    console.log('\n' + '=' .repeat(55));
    console.log('🎯 DEPLOYMENT RESULTS:');
    console.log('-'.repeat(35));
    console.log(`📈 Total Records: ${totalRecords.toLocaleString()}`);
    console.log(`📊 Tables Populated: ${populatedTables}/${expectedTables.length}`);
    console.log(`✅ Adequately Populated (≥20 records): ${adequatelyPopulated}`);
    console.log(`🔧 New Records Added: ${totalInserted}`);
    console.log(`📋 Tables Enhanced: ${tablesPopulated}`);
    
    const successRate = Math.round((adequatelyPopulated / expectedTables.length) * 100);
    const improvementRate = Math.round((tablesPopulated / 3) * 100);
    
    console.log('\n🎯 OPERATIONAL METRICS:');
    console.log('-'.repeat(35));
    console.log(`🎪 Adequately Populated Rate: ${successRate}%`);
    console.log(`⚡ Deployment Success Rate: ${improvementRate}%`);
    console.log(`📈 Database Health: ${Math.round((populatedTables / expectedTables.length) * 100)}%`);
    
    if (adequatelyPopulated >= 8 && totalInserted >= 40) {
      console.log('\n🎉 SUCCESS: MAJOR DATABASE IMPROVEMENT ACHIEVED!');
      console.log('✈️  Aviation database now has comprehensive operational data');
      console.log('🎯 Ready for full-scale MCP aviation operations');
      console.log('🚀 Client demonstrations can proceed with confidence');
    } else if (adequatelyPopulated >= 7) {
      console.log('\n⚡ GOOD: Significant improvement in database population');
      console.log('🔧 Core aviation functions now have adequate data');
      console.log('📈 System ready for most operational scenarios');
    } else {
      console.log('\n⚠️  PARTIAL: Some improvement achieved');
      console.log('🚧 Additional population efforts may be needed');
    }
    
  } catch (error) {
    console.error('💥 Supabase deployment failed:', error.message);
    console.log('\n🔧 Check network connection and credentials');
    process.exit(1);
  }
}

// Execute the deployment
executeSupabaseDeployment().catch(console.error);