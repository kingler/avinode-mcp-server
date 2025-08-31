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

interface Aircraft {
  id: string;
  tail_number: string;
  manufacturer: string;
  model: string;
  category: string;
  max_passengers: number;
  hourly_rate: number;
}

interface Operator {
  id: string;
  name: string;
}

interface FlightLeg {
  id: string;
  aircraft_id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  departure_time: string;
  arrival_date: string;
  arrival_time: string;
  flight_time: number;
  distance: number;
  price: number;
  status: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

async function getExistingData() {
  console.log('🔍 Fetching existing data...');

  // Get aircraft data
  const { data: aircraft, error: aircraftError } = await supabase
    .from('aircraft')
    .select('id, tail_number, manufacturer, model, category, max_passengers, hourly_rate')
    .limit(10);

  if (aircraftError) throw aircraftError;

  // Get operators data  
  const { data: operators, error: operatorsError } = await supabase
    .from('operators')
    .select('id, name');

  if (operatorsError) throw operatorsError;

  // Get flight legs data
  const { data: flightLegs, error: flightLegsError } = await supabase
    .from('flight_legs')
    .select('*')
    .eq('status', 'Available');

  if (flightLegsError) throw flightLegsError;

  // Get users data
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, email, first_name, last_name');

  if (usersError) throw usersError;

  console.log(`✅ Found ${aircraft?.length} aircraft, ${operators?.length} operators, ${flightLegs?.length} flight legs, ${users?.length} users`);

  return { aircraft, operators, flightLegs, users };
}

function generateBookings(aircraft: Aircraft[], operators: Operator[], flightLegs: FlightLeg[], users: User[]) {
  const bookingStatuses = ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'] as const;
  const paymentStatuses = ['Pending', 'DepositPaid', 'FullyPaid'] as const;
  const paymentMethods = ['Credit Card', 'Wire Transfer', 'Corporate Account', 'ACH', 'Check'];

  const passengerNames = [
    'James Anderson', 'Sarah Wilson', 'Michael Chen', 'Emily Rodriguez', 
    'David Thompson', 'Jessica Martinez', 'Robert Taylor', 'Amanda Johnson',
    'Christopher Brown', 'Lisa Davis', 'Matthew Garcia', 'Jennifer Smith'
  ];

  const companies = [
    'Sterling Wealth Management', 'TechCorp Industries', 'Global Consulting Group',
    'Premier Investment Partners', 'Executive Solutions LLC', 'Apex Capital Management',
    'Strategic Business Solutions', 'Elite Corporate Services'
  ];

  const specialRequests = [
    'Vegetarian catering for all passengers',
    'Pet transportation - small dog',
    'Ground transportation to downtown hotel',
    'Extra baggage space for equipment',
    'Wheelchair accessible boarding',
    'Kosher meal preparation',
    'Early boarding for elderly passenger',
    'Child seat for 3-year-old',
    null, null // Some bookings have no special requests
  ];

  const bookings = [];
  const bookingLegs = [];

  // Create 15 realistic bookings
  for (let i = 0; i < 15; i++) {
    const aircraftItem = aircraft[Math.floor(Math.random() * aircraft.length)];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    const user = users[Math.floor(Math.random() * users.length)];
    const flightLeg = flightLegs[Math.floor(Math.random() * flightLegs.length)];
    
    const status = bookingStatuses[Math.floor(Math.random() * bookingStatuses.length)];
    const paymentStatus = paymentStatuses[Math.floor(Math.random() * paymentStatuses.length)];
    
    // Calculate pricing
    const basePrice = flightLeg.price || (aircraftItem.hourly_rate * flightLeg.flight_time);
    const totalPrice = Math.round(basePrice * (0.9 + Math.random() * 0.2)); // Add some variation
    const depositAmount = Math.round(totalPrice * 0.3); // 30% deposit
    const balanceAmount = totalPrice - depositAmount;

    // Generate passenger info
    const passengerName = passengerNames[Math.floor(Math.random() * passengerNames.length)];
    const company = Math.random() > 0.3 ? companies[Math.floor(Math.random() * companies.length)] : null;
    
    const bookingId = `booking-${Date.now()}-${i.toString().padStart(3, '0')}`;

    const booking = {
      id: bookingId,
      quote_id: null, // Most bookings won't have associated quotes for simplicity
      aircraft_id: aircraftItem.id,
      operator_id: operator.id,
      status: status,
      total_price: totalPrice,
      currency: 'USD',
      payment_status: paymentStatus,
      payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      deposit_amount: depositAmount,
      balance_amount: balanceAmount,
      deposit_due_date: status === 'Pending' ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null, // 7 days from now
      balance_due_date: status !== 'Cancelled' ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString() : null, // 14 days from now
      passenger_info: {
        name: passengerName,
        email: user.email,
        phone: `+1-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
        company: company,
        passengers: Math.floor(Math.random() * Math.min(aircraftItem.max_passengers, 8)) + 1, // 1 to 8 passengers
        special_dietary: Math.random() > 0.8 ? ['Vegetarian', 'Gluten-free', 'Kosher'][Math.floor(Math.random() * 3)] : null,
        frequent_flyer: Math.random() > 0.7
      },
      special_requests: specialRequests[Math.floor(Math.random() * specialRequests.length)],
      created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(), // Up to 30 days ago
      updated_at: new Date().toISOString()
    };

    bookings.push(booking);

    // Create booking leg relationship
    bookingLegs.push({
      booking_id: bookingId,
      flight_leg_id: flightLeg.id,
      leg_order: 1
    });
  }

  return { bookings, bookingLegs };
}

async function insertBookings() {
  try {
    console.log('🚀 Starting booking data insertion...\n');

    // Get existing data
    const { aircraft, operators, flightLegs, users } = await getExistingData();

    if (!aircraft?.length || !operators?.length || !flightLegs?.length || !users?.length) {
      console.error('❌ Missing required reference data. Please ensure users, aircraft, operators, and flight_legs tables have data.');
      return;
    }

    // Generate booking data
    console.log('📝 Generating realistic booking data...');
    const { bookings, bookingLegs } = generateBookings(aircraft, operators, flightLegs, users);

    // Insert bookings
    console.log(`💾 Inserting ${bookings.length} bookings...`);
    const { data: insertedBookings, error: bookingsError } = await supabase
      .from('bookings')
      .insert(bookings)
      .select('id, status, total_price, passenger_info');

    if (bookingsError) {
      console.error('❌ Error inserting bookings:', bookingsError);
      return;
    }

    console.log(`✅ Successfully inserted ${insertedBookings?.length} bookings`);

    // Insert booking legs relationships
    console.log(`🔗 Inserting ${bookingLegs.length} booking-leg relationships...`);
    const { error: bookingLegsError } = await supabase
      .from('booking_legs')
      .insert(bookingLegs);

    if (bookingLegsError) {
      console.error('❌ Error inserting booking legs:', bookingLegsError);
      return;
    }

    console.log('✅ Successfully inserted booking-leg relationships');

    // Display summary
    console.log('\n📊 BOOKING DATA SUMMARY:');
    console.log('========================');
    
    const statusCounts = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('Booking Status Distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    const paymentCounts = bookings.reduce((acc, booking) => {
      acc[booking.payment_status] = (acc[booking.payment_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('\nPayment Status Distribution:');
    Object.entries(paymentCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });

    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.total_price, 0);
    const avgBookingValue = totalRevenue / bookings.length;

    console.log(`\nFinancial Summary:`);
    console.log(`  Total Revenue: $${totalRevenue.toLocaleString()}`);
    console.log(`  Average Booking Value: $${avgBookingValue.toLocaleString()}`);

    // Show sample bookings
    console.log('\n📋 Sample Bookings:');
    console.log('==================');
    insertedBookings?.slice(0, 3).forEach((booking, index) => {
      console.log(`${index + 1}. ID: ${booking.id}`);
      console.log(`   Status: ${booking.status}`);
      console.log(`   Price: $${booking.total_price.toLocaleString()}`);
      console.log(`   Passenger: ${booking.passenger_info.name}`);
      console.log(`   Company: ${booking.passenger_info.company || 'Individual'}`);
      console.log('');
    });

    console.log('🎉 Booking data insertion completed successfully!');
    console.log('\nNext steps:');
    console.log('- Test booking queries and relationships');
    console.log('- Verify data integrity');
    console.log('- Test aviation charter system functionality');

  } catch (error) {
    console.error('💥 Unexpected error during booking insertion:', error);
  }
}

// Main execution
insertBookings();