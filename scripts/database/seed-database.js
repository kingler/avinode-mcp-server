#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Comprehensive customer data
const customers = [
  // VIP CUSTOMERS (10 high-value profiles)
  {
    id: 'c1000001-1111-2222-3333-444444444444',
    email: 'richard.sterling@sterlingwealth.com',
    name: 'Richard Sterling',
    phone: '+1-212-555-0101',
    company: 'Sterling Wealth Management',
    customer_type: 'VIP',
    preferences: {
      aircraft: ['Ultra Long Range', 'Heavy Jet'],
      amenities: ['Conference Room', 'Champagne Service'],
      loyalty: 'Platinum'
    },
    total_flights: 45,
    total_spent: 2850000,
    rating: 4.9,
    created_at: '2022-03-15T10:30:00Z'
  },
  {
    id: 'c1000002-1111-2222-3333-444444444444',
    email: 's.chen@techcorp.com',
    name: 'Sarah Chen',
    phone: '+1-206-555-0201',
    company: 'TechCorp Innovations',
    customer_type: 'VIP',
    preferences: {
      aircraft: ['Super Midsize Jet', 'Midsize Jet'],
      amenities: ['WiFi', 'Conference Setup'],
      loyalty: 'Gold'
    },
    total_flights: 32,
    total_spent: 1650000,
    rating: 4.8,
    created_at: '2021-08-22T14:20:00Z'
  },
  {
    id: 'c1000003-1111-2222-3333-444444444444',
    email: 'm.hamilton@bostongeneral.org',
    name: 'Dr. Margaret Hamilton',
    phone: '+1-617-555-0301',
    company: 'Boston General Hospital',
    customer_type: 'VIP',
    preferences: {
      aircraft: ['Heavy Jet', 'Super Midsize Jet'],
      amenities: ['Medical Equipment Storage', 'Priority Service'],
      loyalty: 'Platinum'
    },
    total_flights: 28,
    total_spent: 1420000,
    rating: 4.9,
    created_at: '2020-11-08T16:15:00Z'
  },
  {
    id: 'c1000004-1111-2222-3333-444444444444',
    email: 'global.exec@globalenterprises.com',
    name: 'Marcus Thompson',
    phone: '+44-20-7946-0001',
    company: 'Global Enterprises Ltd',
    customer_type: 'VIP',
    preferences: {
      aircraft: ['Ultra Long Range', 'Heavy Jet'],
      amenities: ['International Communications', 'Executive Suite'],
      loyalty: 'Diamond'
    },
    total_flights: 52,
    total_spent: 3100000,
    rating: 4.8,
    created_at: '2019-05-12T11:45:00Z'
  },
  {
    id: 'c1000005-1111-2222-3333-444444444444',
    email: 'a.martinez@techinnovations.es',
    name: 'Antonio Martinez',
    phone: '+34-91-123-4567',
    company: 'Tech Innovations Spain',
    customer_type: 'VIP',
    preferences: {
      aircraft: ['Super Midsize Jet', 'Midsize Jet'],
      amenities: ['European Routes', 'Business Setup'],
      loyalty: 'Gold'
    },
    total_flights: 23,
    total_spent: 1180000,
    rating: 4.7,
    created_at: '2021-01-29T13:45:00Z'
  },
  // CORPORATE CUSTOMERS (5 sample business accounts)
  {
    id: 'c2000001-2222-3333-4444-555555555555',
    email: 'travel@techcorpinc.com',
    name: 'Lisa Wang',
    phone: '+1-415-555-1001',
    company: 'TechCorp Inc',
    customer_type: 'Corporate',
    preferences: {
      aircraft: ['Midsize Jet', 'Super Midsize Jet'],
      amenities: ['WiFi', 'Business Setup'],
      contract: 'Annual'
    },
    total_flights: 24,
    total_spent: 850000,
    rating: 4.6,
    created_at: '2022-01-15T10:00:00Z'
  },
  {
    id: 'c2000002-2222-3333-4444-555555555555',
    email: 'logistics@gm-auto.com',
    name: 'Robert Johnson',
    phone: '+1-313-555-1002',
    company: 'Global Motors',
    customer_type: 'Corporate',
    preferences: {
      aircraft: ['Super Midsize Jet', 'Heavy Jet'],
      amenities: ['Cargo Space', 'Executive Transport'],
      contract: 'Quarterly'
    },
    total_flights: 18,
    total_spent: 720000,
    rating: 4.5,
    created_at: '2021-09-22T11:40:00Z'
  },
  {
    id: 'c2000008-2222-3333-4444-555555555555',
    email: 'exec@washingtonadvocacy.com',
    name: 'Amanda Rodriguez',
    phone: '+1-202-555-1008',
    company: 'Washington Advocacy Group',
    customer_type: 'Corporate',
    preferences: {
      aircraft: ['Midsize Jet', 'Super Midsize Jet'],
      amenities: ['Privacy', 'Secure Communications'],
      contract: 'Monthly'
    },
    total_flights: 16,
    total_spent: 520000,
    rating: 4.7,
    created_at: '2022-05-14T14:30:00Z'
  },
  // INDIVIDUAL CUSTOMERS (2 sample personal travelers)
  {
    id: 'c3000001-3333-4444-5555-666666666666',
    email: 'j.martinez@personaltravel.com',
    name: 'Jennifer Martinez',
    phone: '+1-617-555-2001',
    company: null,
    customer_type: 'Individual',
    preferences: {
      aircraft: ['Light Jet', 'Midsize Jet'],
      amenities: ['Basic Service', 'Comfortable Seating'],
      occasions: 'Personal'
    },
    total_flights: 8,
    total_spent: 180000,
    rating: 4.5,
    created_at: '2022-09-28T15:20:00Z'
  },
  {
    id: 'c3000003-3333-4444-5555-666666666666',
    email: 'startup.founder@techventure.com',
    name: 'Alex Chen',
    phone: '+1-206-555-2003',
    company: 'Tech Venture Startup',
    customer_type: 'Individual',
    preferences: {
      aircraft: ['Midsize Jet', 'Super Midsize Jet'],
      amenities: ['WiFi Essential', 'Meeting Space'],
      occasions: 'Business'
    },
    total_flights: 9,
    total_spent: 220000,
    rating: 4.6,
    created_at: '2022-11-10T09:45:00Z'
  }
];

// Sample booking data
const bookings = [
  // COMPLETED BOOKINGS
  {
    id: 'b1000001-aaaa-bbbb-cccc-dddddddddddd',
    user_id: 'c1000001-1111-2222-3333-444444444444',
    aircraft_id: '05c92852-911b-435d-be52-515fcf5b78fb',
    operator_id: '550e8400-e29b-41d4-a716-446655440001',
    status: 'Completed',
    departure_airport: 'KJFK',
    arrival_airport: 'EGLL',
    departure_date: '2024-07-15',
    departure_time: '10:00:00',
    arrival_date: '2024-07-15',
    arrival_time: '21:30:00',
    flight_duration: 7.5,
    passenger_count: 6,
    total_price: 95000.00,
    currency: 'USD',
    payment_status: 'FullyPaid',
    payment_method: 'WireTransfer',
    deposit_amount: 47500.00,
    balance_amount: 47500.00,
    booking_date: '2024-06-15',
    special_requests: 'VIP service, champagne on board, conference setup',
    booking_reference: 'RS-2024-001',
    confirmation_code: 'RS6J15JFK',
    created_at: '2024-06-15T10:30:00Z'
  },
  {
    id: 'b1000002-aaaa-bbbb-cccc-dddddddddddd',
    user_id: 'c2000001-2222-3333-4444-555555555555',
    aircraft_id: '05c92852-911b-435d-be52-515fcf5b78fb',
    operator_id: '550e8400-e29b-41d4-a716-446655440001',
    status: 'Completed',
    departure_airport: 'KSEA',
    arrival_airport: 'KORD',
    departure_date: '2024-06-20',
    departure_time: '14:20:00',
    arrival_date: '2024-06-20',
    arrival_time: '19:15:00',
    flight_duration: 4.92,
    passenger_count: 4,
    total_price: 36500.00,
    currency: 'USD',
    payment_status: 'FullyPaid',
    payment_method: 'CorporateCard',
    deposit_amount: 18250.00,
    balance_amount: 18250.00,
    booking_date: '2024-06-05',
    special_requests: 'Corporate travel, WiFi required',
    booking_reference: 'TC-2024-006',
    confirmation_code: 'TC4S20SEA',
    created_at: '2024-06-20T14:20:00Z'
  },
  // CONFIRMED BOOKINGS
  {
    id: 'b2000001-bbbb-cccc-dddd-eeeeeeeeeeee',
    user_id: 'c1000001-1111-2222-3333-444444444444',
    aircraft_id: '05c92852-911b-435d-be52-515fcf5b78fb',
    operator_id: '550e8400-e29b-41d4-a716-446655440001',
    status: 'Confirmed',
    departure_airport: 'KHOU',
    arrival_airport: 'KJFK',
    departure_date: '2024-12-20',
    departure_time: '08:00:00',
    arrival_date: '2024-12-20',
    arrival_time: '12:45:00',
    flight_duration: 4.75,
    passenger_count: 6,
    total_price: 58000.00,
    currency: 'USD',
    payment_status: 'DepositPaid',
    payment_method: 'WireTransfer',
    deposit_amount: 29000.00,
    balance_amount: 29000.00,
    booking_date: '2024-12-06',
    special_requests: 'Secure communications, executive office setup',
    booking_reference: 'ME-2024-031',
    confirmation_code: 'ME6H20HOU',
    created_at: '2024-11-28T09:15:00Z'
  },
  // PENDING BOOKINGS
  {
    id: 'b3000001-cccc-dddd-eeee-ffffffffffff',
    user_id: 'c2000008-2222-3333-4444-555555555555',
    aircraft_id: '05c92852-911b-435d-be52-515fcf5b78fb',
    operator_id: '550e8400-e29b-41d4-a716-446655440001',
    status: 'Pending',
    departure_airport: 'KORD',
    arrival_airport: 'KBOS',
    departure_date: '2025-01-15',
    departure_time: '14:20:00',
    arrival_date: '2025-01-15',
    arrival_time: '16:55:00',
    flight_duration: 2.58,
    passenger_count: 4,
    total_price: 29500.00,
    currency: 'USD',
    payment_status: 'Pending',
    payment_method: null,
    deposit_amount: null,
    balance_amount: 29500.00,
    booking_date: '2024-12-31',
    special_requests: 'Privacy requirements, document security',
    booking_reference: 'WA-2025-001',
    confirmation_code: 'PENDING001',
    created_at: '2024-12-08T14:30:00Z'
  }
];

async function seedDatabase() {
  console.log('🚀 Starting comprehensive database seeding...');
  
  try {
    // Insert customers
    console.log('👥 Seeding customers...');
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .upsert(customers, { onConflict: 'id' });
    
    if (customerError) {
      console.error('❌ Error inserting customers:', customerError);
      throw customerError;
    }
    
    console.log(`✅ Successfully seeded ${customers.length} customers`);
    
    // Insert bookings
    console.log('📝 Seeding bookings...');
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .upsert(bookings, { onConflict: 'id' });
    
    if (bookingError) {
      console.error('❌ Error inserting bookings:', bookingError);
      throw bookingError;
    }
    
    console.log(`✅ Successfully seeded ${bookings.length} bookings`);
    
    // Update aircraft utilization
    console.log('✈️ Updating aircraft utilization...');
    const { data: aircraftData, error: aircraftError } = await supabase
      .from('aircraft')
      .update({
        total_hours: 2945.7,
        flight_cycles: 1492,
        last_maintenance_date: '2024-08-16',
        next_maintenance_due: '2024-09-15',
        maintenance_status: 'Due Soon',
        current_location: 'KJFK',
        availability_status: 'Available',
        utilization_rate: 0.78,
        updated_at: new Date().toISOString()
      })
      .eq('id', '05c92852-911b-435d-be52-515fcf5b78fb');
    
    if (aircraftError) {
      console.error('❌ Error updating aircraft:', aircraftError);
      throw aircraftError;
    }
    
    console.log('✅ Successfully updated aircraft utilization');
    
    // Verify data insertion
    console.log('🔍 Verifying data insertion...');
    
    const { count: customerCount } = await supabase
      .from('customers')
      .select('*', { count: 'exact', head: true });
    
    const { count: bookingCount } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });
    
    console.log(`📊 Database verification:`);
    console.log(`   - Total customers: ${customerCount}`);
    console.log(`   - Total bookings: ${bookingCount}`);
    
    console.log('🎉 COMPREHENSIVE DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('🎯 Your aviation charter system is now populated with realistic operational data');
    
  } catch (error) {
    console.error('💥 Failed to seed database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase();