#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function seedCriticalTables() {
  console.log('🚀 Seeding critical aviation marketplace tables...\n');

  try {
    // =====================================================
    // AIRPORTS - Core reference data
    // =====================================================
    console.log('✈️  Seeding airports...');
    
    const airportData = [
      { icao_code: 'KJFK', iata_code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', latitude: 40.6413, longitude: -73.7781 },
      { icao_code: 'KLAX', iata_code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', latitude: 33.9425, longitude: -118.4081 },
      { icao_code: 'KTEB', iata_code: 'TEB', name: 'Teterboro Airport', city: 'Teterboro', country: 'United States', latitude: 40.8501, longitude: -74.0606 },
      { icao_code: 'KPBI', iata_code: 'PBI', name: 'Palm Beach International Airport', city: 'West Palm Beach', country: 'United States', latitude: 26.6832, longitude: -80.0956 },
      { icao_code: 'KMIA', iata_code: 'MIA', name: 'Miami International Airport', city: 'Miami', country: 'United States', latitude: 25.7959, longitude: -80.2870 },
      { icao_code: 'EGLL', iata_code: 'LHR', name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', latitude: 51.4700, longitude: -0.4543 },
      { icao_code: 'LFPG', iata_code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', latitude: 49.0097, longitude: 2.5479 },
      { icao_code: 'LSGG', iata_code: 'GVA', name: 'Geneva Airport', city: 'Geneva', country: 'Switzerland', latitude: 46.2381, longitude: 6.1089 }
    ];

    const { data: airportResult, error: airportError } = await supabase
      .from('airports')
      .insert(airportData)
      .select();

    if (airportError) {
      console.error('❌ Airports error:', airportError.message);
    } else {
      console.log(`✅ Successfully seeded ${airportResult.length} airports`);
    }

    // =====================================================
    // EMPTY LEGS - Revenue opportunities
    // =====================================================
    console.log('🛩️  Seeding empty legs...');
    
    // Get aircraft for empty legs
    const { data: aircraftForLegs } = await supabase
      .from('aircraft')
      .select('id, passenger_capacity')
      .limit(8);

    if (aircraftForLegs && aircraftForLegs.length > 0) {
      const emptyLegsData = [];
      const routes = [
        ['KJFK', 'KMIA'], ['KLAX', 'KPBI'], ['KTEB', 'KJFK'], 
        ['EGLL', 'LFPG'], ['LSGG', 'LFPG'], ['KMIA', 'KJFK']
      ];

      for (let i = 0; i < 12; i++) {
        const aircraft = aircraftForLegs[Math.floor(Math.random() * aircraftForLegs.length)];
        const route = routes[Math.floor(Math.random() * routes.length)];
        const departureTime = new Date();
        departureTime.setDate(departureTime.getDate() + Math.floor(Math.random() * 14) + 1);

        emptyLegsData.push({
          aircraft_id: aircraft.id,
          departure_airport: route[0],
          arrival_airport: route[1],
          departure_time: departureTime.toISOString(),
          estimated_duration_minutes: Math.floor(Math.random() * 240) + 90,
          original_price_usd: Math.round((Math.random() * 15000 + 8000) * 100) / 100,
          discounted_price_usd: Math.round((Math.random() * 10000 + 4000) * 100) / 100,
          availability_status: 'available',
          passenger_capacity: aircraft.passenger_capacity,
          booking_deadline: new Date(departureTime.getTime() - 12 * 60 * 60 * 1000).toISOString(),
          special_notes: 'Flexible departure time'
        });
      }

      const { data: emptyLegsResult, error: emptyLegsError } = await supabase
        .from('empty_legs')
        .insert(emptyLegsData)
        .select();

      if (emptyLegsError) {
        console.error('❌ Empty legs error:', emptyLegsError.message);
      } else {
        console.log(`✅ Successfully seeded ${emptyLegsResult.length} empty legs`);
      }
    }

    // =====================================================
    // PAYMENTS - Financial transactions
    // =====================================================
    console.log('💳 Seeding payments...');
    
    // Get some bookings for payments
    const { data: bookingsForPayments } = await supabase
      .from('bookings')
      .select('id')
      .limit(15);

    if (bookingsForPayments && bookingsForPayments.length > 0) {
      const paymentsData = [];

      for (let i = 0; i < 15; i++) {
        const booking = bookingsForPayments[Math.floor(Math.random() * bookingsForPayments.length)];
        const paymentDate = new Date();
        paymentDate.setDate(paymentDate.getDate() - Math.floor(Math.random() * 60));

        paymentsData.push({
          booking_id: booking.id,
          amount_usd: Math.round((Math.random() * 80000 + 15000) * 100) / 100,
          payment_method: ['wire_transfer', 'credit_card', 'ach'][Math.floor(Math.random() * 3)],
          payment_status: ['completed', 'pending', 'failed'][Math.floor(Math.random() * 3)],
          transaction_id: `TXN-${Math.floor(Math.random() * 900000) + 100000}`,
          payment_date: paymentDate.toISOString(),
          processing_fee_usd: Math.round((Math.random() * 400 + 50) * 100) / 100,
          currency: 'USD',
          exchange_rate: 1.00
        });
      }

      const { data: paymentsResult, error: paymentsError } = await supabase
        .from('payments')
        .insert(paymentsData)
        .select();

      if (paymentsError) {
        console.error('❌ Payments error:', paymentsError.message);
      } else {
        console.log(`✅ Successfully seeded ${paymentsResult.length} payments`);
      }
    }

    // =====================================================
    // QUOTES - Pricing estimates
    // =====================================================
    console.log('💰 Seeding quotes...');
    
    // Get charter requests and aircraft for quotes
    const { data: charterRequests } = await supabase
      .from('charter_requests')
      .select('id')
      .limit(5);

    const { data: aircraftForQuotes } = await supabase
      .from('aircraft')
      .select('id')
      .limit(10);

    if (charterRequests && aircraftForQuotes && charterRequests.length > 0 && aircraftForQuotes.length > 0) {
      const quotesData = [];

      for (let i = 0; i < 20; i++) {
        const charterRequest = charterRequests[Math.floor(Math.random() * charterRequests.length)];
        const aircraft = aircraftForQuotes[Math.floor(Math.random() * aircraftForQuotes.length)];
        const validUntil = new Date();
        validUntil.setDate(validUntil.getDate() + Math.floor(Math.random() * 14) + 3);

        const basePrice = Math.random() * 40000 + 15000;
        const fuelSurcharge = Math.random() * 2500 + 800;
        const landingFees = Math.random() * 800 + 300;
        const handlingFees = Math.random() * 600 + 200;
        const cateringCost = Math.random() > 0.4 ? Math.random() * 400 + 150 : 0;
        const crewFees = Math.random() * 1800 + 1000;
        const subtotal = basePrice + fuelSurcharge + landingFees + handlingFees + cateringCost + crewFees;
        const taxAmount = subtotal * 0.08;

        quotesData.push({
          charter_request_id: charterRequest.id,
          aircraft_id: aircraft.id,
          base_price_usd: Math.round(basePrice * 100) / 100,
          fuel_surcharge_usd: Math.round(fuelSurcharge * 100) / 100,
          landing_fees_usd: Math.round(landingFees * 100) / 100,
          handling_fees_usd: Math.round(handlingFees * 100) / 100,
          catering_cost_usd: Math.round(cateringCost * 100) / 100,
          crew_fees_usd: Math.round(crewFees * 100) / 100,
          tax_amount_usd: Math.round(taxAmount * 100) / 100,
          total_price_usd: Math.round((subtotal + taxAmount) * 100) / 100,
          quote_status: ['pending', 'accepted', 'declined'][Math.floor(Math.random() * 3)],
          valid_until: validUntil.toISOString(),
          quote_notes: 'Price includes all fees and taxes'
        });
      }

      const { data: quotesResult, error: quotesError } = await supabase
        .from('quotes')
        .insert(quotesData)
        .select();

      if (quotesError) {
        console.error('❌ Quotes error:', quotesError.message);
      } else {
        console.log(`✅ Successfully seeded ${quotesResult.length} quotes`);
      }
    }

    // =====================================================
    // VERIFICATION
    // =====================================================
    console.log('\n🔍 Verification Results:\n');
    
    const tablesToCheck = ['airports', 'empty_legs', 'payments', 'quotes'];
    
    for (const tableName of tablesToCheck) {
      try {
        const { count, error } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ ${tableName.padEnd(20)}: Error - ${error.message}`);
        } else {
          const status = count > 0 ? '✅' : '⚠️';
          console.log(`${status} ${tableName.padEnd(20)}: ${count} records`);
        }
      } catch (err) {
        console.log(`❌ ${tableName.padEnd(20)}: Check failed`);
      }
    }

    console.log('\n🎯 Critical tables seeding completed successfully!');
    console.log('📈 Aviation marketplace now has core operational data for testing');

  } catch (error) {
    console.error('💥 Seeding failed:', error);
    throw error;
  }
}

if (require.main === module) {
  seedCriticalTables().catch(console.error);
}

module.exports = { seedCriticalTables };