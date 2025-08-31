import { createClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://lhwksxtscaadtwjhvhau.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxod2tzeHRzY2FhZHR3amh2aGF1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyNDg2NjE1OCwiZXhwIjoyMDQwNDQyMTU4fQ.qKNJRRTt2kFXWQU9y-JBxGYb6kK4bJEgQNlElDKAOFM';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper function to generate random dates
function randomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to get random element from array
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Helper function to generate UUID-like string
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

async function populateCompleteAviationDatabase() {
  console.log('🚀 Starting comprehensive aviation database population...\n');

  try {
    // Get existing data for foreign key relationships
    const { data: existingAircraft } = await supabase.from('aircraft').select('id');
    const { data: existingOperators } = await supabase.from('operators').select('id');
    const { data: existingBookings } = await supabase.from('bookings').select('id');
    const { data: existingUsers } = await supabase.from('users').select('id');

    if (!existingAircraft?.length || !existingOperators?.length || !existingBookings?.length) {
      console.error('❌ Required base tables (aircraft, operators, bookings) are not populated!');
      console.log('Please ensure these tables have data before running this script.');
      return;
    }

    console.log(`📊 Found existing data:`);
    console.log(`  - Aircraft: ${existingAircraft.length}`);
    console.log(`  - Operators: ${existingOperators.length}`);
    console.log(`  - Bookings: ${existingBookings.length}`);
    console.log(`  - Users: ${existingUsers?.length || 0}`);
    console.log();

    const aircraftIds = existingAircraft.map(a => a.id);
    const operatorIds = existingOperators.map(o => o.id);
    const bookingIds = existingBookings.map(b => b.id);
    const userIds = existingUsers?.map(u => u.id) || [];

    // 1. POPULATE USERS TABLE (if needed)
    console.log('1️⃣ Populating USERS table...');
    if (userIds.length < 20) {
      const usersToAdd = 20 - userIds.length;
      console.log(`   Adding ${usersToAdd} users to reach 20 total...`);

      const newUsers = [];
      const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Ashley', 'James', 'Amanda', 'William', 'Jennifer', 'Daniel', 'Lisa', 'Matthew', 'Michelle', 'Christopher', 'Kimberly', 'Andrew', 'Susan'];
      const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
      const companies = ['TechCorp Inc', 'Global Solutions', 'Premier Consulting', 'Executive Travel', 'Corporate Jets Ltd', 'Business Aviation', 'Elite Charter', 'VIP Transport', 'Sky Connect', 'Jet Set Inc'];

      for (let i = 0; i < usersToAdd; i++) {
        const firstName = randomElement(firstNames);
        const lastName = randomElement(lastNames);
        const company = Math.random() > 0.3 ? randomElement(companies) : null;

        newUsers.push({
          id: generateId(),
          email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company ? company.replace(/\s+/g, '').toLowerCase() : 'example'}.com`,
          name: `${firstName} ${lastName}`,
          company: company,
          phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
          role: randomElement(['passenger', 'admin', 'operator']),
          created_at: randomDate(new Date('2023-01-01'), new Date()).toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      const { error: usersError } = await supabase.from('users').insert(newUsers);
      if (usersError) {
        console.error('❌ Error inserting users:', usersError);
      } else {
        console.log(`   ✅ Added ${newUsers.length} users successfully`);
        userIds.push(...newUsers.map(u => u.id));
      }
    } else {
      console.log('   ✅ Users table already has sufficient data');
    }

    // 2. POPULATE TRANSACTIONS TABLE
    console.log('\n2️⃣ Populating TRANSACTIONS table...');
    const transactions = [];
    const paymentMethods = ['Credit Card', 'Bank Transfer', 'PayPal', 'Crypto', 'Check'];
    const processors = ['Stripe', 'PayPal', 'Square', 'Coinbase', 'Bank'];

    for (let i = 0; i < 25; i++) {
      const bookingId = randomElement(bookingIds);
      const amount = Math.random() * 50000 + 5000; // $5,000 - $55,000
      const transactionType = randomElement(['Payment', 'Refund', 'Fee']);
      const status = randomElement(['Completed', 'Pending', 'Failed']);
      const paymentMethod = randomElement(paymentMethods);
      const processor = randomElement(processors);

      transactions.push({
        id: generateId(),
        booking_id: bookingId,
        transaction_type: transactionType,
        amount: Math.round(amount * 100) / 100,
        currency: 'USD',
        status: status,
        payment_method: paymentMethod,
        processor_name: processor,
        processor_transaction_id: `${processor.toLowerCase()}_${Math.random().toString(36).substr(2, 9)}`,
        processor_fee: Math.round(amount * 0.029 * 100) / 100, // 2.9% fee
        risk_score: Math.floor(Math.random() * 100),
        description: `${transactionType} for charter booking`,
        customer_reference: `CUST_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        merchant_reference: `MERCH_${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        initiated_date: randomDate(new Date('2024-01-01'), new Date()).toISOString(),
        completed_date: status === 'Completed' ? randomDate(new Date('2024-01-01'), new Date()).toISOString() : null,
        created_at: randomDate(new Date('2024-01-01'), new Date()).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const { error: transactionsError } = await supabase.from('transactions').insert(transactions);
    if (transactionsError) {
      console.error('❌ Error inserting transactions:', transactionsError);
    } else {
      console.log(`   ✅ Added ${transactions.length} transactions successfully`);
    }

    // 3. POPULATE INVOICES TABLE
    console.log('\n3️⃣ Populating INVOICES table...');
    const invoices = [];
    for (let i = 0; i < 25; i++) {
      const bookingId = randomElement(bookingIds);
      const amount = Math.random() * 60000 + 10000; // $10,000 - $70,000
      const taxAmount = Math.round(amount * 0.08 * 100) / 100; // 8% tax
      const discountAmount = Math.random() > 0.7 ? Math.round(amount * 0.1 * 100) / 100 : 0; // 10% discount sometimes

      invoices.push({
        id: generateId(),
        booking_id: bookingId,
        invoice_number: `INV-${new Date().getFullYear()}-${String(i + 1).padStart(4, '0')}`,
        amount: Math.round(amount * 100) / 100,
        currency: 'USD',
        status: randomElement(['draft', 'sent', 'paid', 'overdue']),
        due_date: randomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Next 30 days
        line_items: JSON.stringify([
          { description: 'Charter Flight Service', quantity: 1, rate: amount, amount: amount },
          { description: 'Fuel Surcharge', quantity: 1, rate: amount * 0.15, amount: amount * 0.15 }
        ]),
        tax_amount: taxAmount,
        discount_amount: discountAmount,
        customer_info: JSON.stringify({
          name: `Customer ${i + 1}`,
          email: `customer${i + 1}@example.com`,
          address: `${1000 + i} Business Blvd, Suite ${100 + i}, City, ST 12345`
        }),
        payment_terms: randomElement(['Net 15', 'Net 30', 'Due on Receipt', 'Net 45']),
        notes: 'Thank you for your business. Payment is due within the specified terms.',
        created_at: randomDate(new Date('2024-01-01'), new Date()).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const { error: invoicesError } = await supabase.from('invoices').insert(invoices);
    if (invoicesError) {
      console.error('❌ Error inserting invoices:', invoicesError);
    } else {
      console.log(`   ✅ Added ${invoices.length} invoices successfully`);
    }

    // 4. POPULATE MAINTENANCE_RECORDS TABLE
    console.log('\n4️⃣ Populating MAINTENANCE_RECORDS table...');
    const maintenanceRecords = [];
    const facilities = ['Jet Aviation', 'Duncan Aviation', 'Textron Aviation', 'Bombardier Service', 'Gulfstream Service'];
    const technicians = ['Mike Johnson', 'Sarah Williams', 'David Brown', 'Lisa Garcia', 'Tom Martinez'];

    for (let i = 0; i < 30; i++) {
      const aircraftId = randomElement(aircraftIds);
      const scheduledDate = randomDate(new Date('2024-01-01'), new Date('2024-12-31'));
      const completedDate = Math.random() > 0.3 ? randomDate(scheduledDate, new Date()) : null;
      const cost = Math.random() * 50000 + 5000; // $5,000 - $55,000

      maintenanceRecords.push({
        id: generateId(),
        aircraft_id: aircraftId,
        maintenance_type: randomElement(['Routine', 'Progressive', 'AOG', 'Compliance']),
        description: randomElement([
          '100-hour inspection',
          'Annual inspection',
          'Avionics upgrade',
          'Engine maintenance',
          'Landing gear service',
          'Interior refurbishment',
          'Paint touch-up',
          'Emergency repair',
          'Compliance check',
          'Software update'
        ]),
        scheduled_date: scheduledDate.toISOString(),
        completed_date: completedDate?.toISOString(),
        cost: Math.round(cost * 100) / 100,
        currency: 'USD',
        facility: randomElement(facilities),
        technician: randomElement(technicians),
        work_orders: [
          `WO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
          `WO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        ],
        hours_at_maintenance: Math.random() * 10000 + 1000,
        cycles_at_maintenance: Math.floor(Math.random() * 5000 + 500),
        prediction_accuracy: Math.random() * 0.3 + 0.7, // 70-100% accuracy
        created_at: randomDate(new Date('2023-01-01'), new Date()).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const { error: maintenanceError } = await supabase.from('maintenance_records').insert(maintenanceRecords);
    if (maintenanceError) {
      console.error('❌ Error inserting maintenance records:', maintenanceError);
    } else {
      console.log(`   ✅ Added ${maintenanceRecords.length} maintenance records successfully`);
    }

    // 5. POPULATE CREW_ASSIGNMENTS TABLE
    console.log('\n5️⃣ Populating CREW_ASSIGNMENTS table...');
    const crewAssignments = [];
    const captains = ['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson'];
    const firstOfficers = ['Robert Miller', 'Jessica Garcia', 'James Martinez', 'Amanda Rodriguez', 'William Anderson'];
    const attendants = ['Lisa Thompson', 'Michelle Taylor', 'Christopher Moore', 'Kimberly Jackson', 'Andrew Martin'];

    for (let i = 0; i < 35; i++) {
      const bookingId = randomElement(bookingIds);
      const aircraftId = randomElement(aircraftIds);
      const crewType = randomElement(['Captain', 'First Officer', 'Flight Attendant']);
      let crewMemberName, crewPool;

      switch (crewType) {
        case 'Captain':
          crewMemberName = randomElement(captains);
          crewPool = captains;
          break;
        case 'First Officer':
          crewMemberName = randomElement(firstOfficers);
          crewPool = firstOfficers;
          break;
        default:
          crewMemberName = randomElement(attendants);
          crewPool = attendants;
      }

      crewAssignments.push({
        id: generateId(),
        booking_id: bookingId,
        aircraft_id: aircraftId,
        crew_type: crewType,
        crew_member_name: crewMemberName,
        crew_member_id: `CREW_${crewPool.indexOf(crewMemberName) + 1}_${crewType.replace(/\s/g, '').toUpperCase()}`,
        license_number: `${crewType === 'Captain' ? 'ATP' : crewType === 'First Officer' ? 'CPL' : 'FA'}-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
        certification_expiry: randomDate(new Date(), new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // Next year
        assignment_date: randomDate(new Date('2024-01-01'), new Date()).toISOString(),
        status: randomElement(['Assigned', 'Confirmed', 'Completed']),
        created_at: randomDate(new Date('2024-01-01'), new Date()).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const { error: crewError } = await supabase.from('crew_assignments').insert(crewAssignments);
    if (crewError) {
      console.error('❌ Error inserting crew assignments:', crewError);
    } else {
      console.log(`   ✅ Added ${crewAssignments.length} crew assignments successfully`);
    }

    // 6. POPULATE AIRCRAFT_REVIEWS TABLE
    console.log('\n6️⃣ Populating AIRCRAFT_REVIEWS table...');
    const aircraftReviews = [];
    const reviewTitles = [
      'Excellent flight experience',
      'Comfortable and luxurious',
      'Professional service',
      'Great aircraft condition',
      'Smooth flight',
      'Outstanding interior',
      'Reliable and punctual',
      'Top-notch amenities',
      'Spacious cabin',
      'Impressive performance'
    ];

    for (let i = 0; i < 25; i++) {
      const aircraftId = randomElement(aircraftIds);
      const bookingId = randomElement(bookingIds);
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly

      aircraftReviews.push({
        id: generateId(),
        aircraft_id: aircraftId,
        booking_id: bookingId,
        customer_name: `${randomElement(['John', 'Sarah', 'Michael', 'Emily', 'David'])} ${randomElement(['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson'])}`,
        customer_email: `customer${i + 1}@example.com`,
        rating: rating,
        title: randomElement(reviewTitles),
        review: `This was an exceptional flight experience. The aircraft was in pristine condition and the service was professional. Highly recommended for business travel.`,
        comfort_rating: rating,
        cleanliness_rating: Math.min(5, rating + Math.floor(Math.random() * 2)),
        amenities_rating: Math.max(3, rating - Math.floor(Math.random() * 2)),
        verified_booking: Math.random() > 0.2, // 80% verified
        helpful: Math.floor(Math.random() * 10),
        created_at: randomDate(new Date('2024-01-01'), new Date()).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const { error: aircraftReviewsError } = await supabase.from('aircraft_reviews').insert(aircraftReviews);
    if (aircraftReviewsError) {
      console.error('❌ Error inserting aircraft reviews:', aircraftReviewsError);
    } else {
      console.log(`   ✅ Added ${aircraftReviews.length} aircraft reviews successfully`);
    }

    // 7. POPULATE OPERATOR_REVIEWS TABLE
    console.log('\n7️⃣ Populating OPERATOR_REVIEWS table...');
    const operatorReviews = [];
    for (let i = 0; i < 25; i++) {
      const operatorId = randomElement(operatorIds);
      const bookingId = randomElement(bookingIds);
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars mostly

      operatorReviews.push({
        id: generateId(),
        operator_id: operatorId,
        booking_id: bookingId,
        customer_name: `${randomElement(['Lisa', 'Robert', 'Jennifer', 'William', 'Michelle'])} ${randomElement(['Garcia', 'Martinez', 'Anderson', 'Taylor', 'Thomas'])}`,
        customer_email: `customer${i + 26}@example.com`,
        rating: rating,
        title: randomElement(reviewTitles),
        review: `Outstanding operator with excellent communication and service. They handled everything professionally and made the entire experience seamless.`,
        service_rating: rating,
        communication_rating: Math.min(5, rating + Math.floor(Math.random() * 2)),
        value_rating: Math.max(3, rating - Math.floor(Math.random() * 2)),
        timeliness_rating: rating,
        verified_booking: Math.random() > 0.2, // 80% verified
        helpful: Math.floor(Math.random() * 15),
        created_at: randomDate(new Date('2024-01-01'), new Date()).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const { error: operatorReviewsError } = await supabase.from('operator_reviews').insert(operatorReviews);
    if (operatorReviewsError) {
      console.error('❌ Error inserting operator reviews:', operatorReviewsError);
    } else {
      console.log(`   ✅ Added ${operatorReviews.length} operator reviews successfully`);
    }

    // 8. POPULATE MARKET_ANALYTICS TABLE
    console.log('\n8️⃣ Populating MARKET_ANALYTICS table...');
    const marketAnalytics = [];
    const regions = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Latin America'];
    const startDate = new Date('2024-01-01');
    const endDate = new Date();

    for (let i = 0; i < 30; i++) {
      const region = randomElement(regions);
      const date = randomDate(startDate, endDate);
      const totalBookings = Math.floor(Math.random() * 100) + 20;
      const averagePrice = Math.random() * 30000 + 10000;
      const totalRevenue = totalBookings * averagePrice;

      marketAnalytics.push({
        id: generateId(),
        date: date.toISOString().split('T')[0],
        region: region,
        total_bookings: totalBookings,
        total_revenue: Math.round(totalRevenue * 100) / 100,
        average_price: Math.round(averagePrice * 100) / 100,
        utilization_rate: Math.random() * 0.4 + 0.6, // 60-100%
        top_routes: JSON.stringify([
          { route: 'KJFK-KLAX', bookings: Math.floor(Math.random() * 20) + 5 },
          { route: 'EGLL-LFPG', bookings: Math.floor(Math.random() * 15) + 3 },
          { route: 'KTEB-KPBI', bookings: Math.floor(Math.random() * 10) + 2 }
        ]),
        top_aircraft: JSON.stringify([
          { type: 'Gulfstream G650', bookings: Math.floor(Math.random() * 15) + 5 },
          { type: 'Cessna Citation X+', bookings: Math.floor(Math.random() * 12) + 3 },
          { type: 'Bombardier Global 7500', bookings: Math.floor(Math.random() * 10) + 2 }
        ]),
        market_share: Math.random() * 0.3 + 0.1, // 10-40%
        competitor_pricing: JSON.stringify({
          average_hourly_rate: Math.round((Math.random() * 5000 + 3000) * 100) / 100,
          premium_vs_economy: Math.round((Math.random() * 2 + 1.5) * 100) / 100
        }),
        created_at: date.toISOString()
      });
    }

    const { error: marketAnalyticsError } = await supabase.from('market_analytics').insert(marketAnalytics);
    if (marketAnalyticsError) {
      console.error('❌ Error inserting market analytics:', marketAnalyticsError);
    } else {
      console.log(`   ✅ Added ${marketAnalytics.length} market analytics records successfully`);
    }

    // 9. POPULATE PRICE_PREDICTIONS TABLE
    console.log('\n9️⃣ Populating PRICE_PREDICTIONS table...');
    const pricePredictions = [];
    const routes = ['KJFK-KLAX', 'EGLL-LFPG', 'KTEB-KPBI', 'KBOS-KMIA', 'KSFO-KLAS', 'KDCA-KATL'];

    for (let i = 0; i < 30; i++) {
      const aircraftId = randomElement(aircraftIds);
      const route = randomElement(routes);
      const predictedDate = randomDate(new Date(), new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // Next 90 days
      const predictedPrice = Math.random() * 25000 + 8000; // $8,000 - $33,000

      pricePredictions.push({
        id: generateId(),
        aircraft_id: aircraftId,
        route: route,
        predicted_date: predictedDate.toISOString(),
        predicted_price: Math.round(predictedPrice * 100) / 100,
        confidence_score: Math.random() * 0.3 + 0.7, // 70-100%
        demand_forecast: Math.random() * 0.4 + 0.6, // 60-100%
        historical_pricing: JSON.stringify({
          last_30_days_avg: Math.round((predictedPrice * 0.95) * 100) / 100,
          seasonal_trend: randomElement(['increasing', 'decreasing', 'stable']),
          volatility: Math.random() * 0.2 + 0.05 // 5-25%
        }),
        seasonal_factors: JSON.stringify({
          holiday_impact: Math.random() * 0.2 + 0.9, // 90-110%
          weather_impact: Math.random() * 0.1 + 0.95, // 95-105%
          event_impact: Math.random() * 0.15 + 0.9 // 90-105%
        }),
        weather_factors: JSON.stringify({
          precipitation_risk: Math.random() * 0.3,
          wind_conditions: randomElement(['favorable', 'moderate', 'challenging']),
          visibility: randomElement(['excellent', 'good', 'limited'])
        }),
        event_factors: JSON.stringify({
          major_events: Math.random() > 0.7 ? ['Conference', 'Sports Event'] : [],
          business_activity: randomElement(['high', 'medium', 'low'])
        }),
        model_version: '2.1',
        training_accuracy: Math.random() * 0.15 + 0.85, // 85-100%
        created_at: new Date().toISOString()
      });
    }

    const { error: pricePredictionsError } = await supabase.from('price_predictions').insert(pricePredictions);
    if (pricePredictionsError) {
      console.error('❌ Error inserting price predictions:', pricePredictionsError);
    } else {
      console.log(`   ✅ Added ${pricePredictions.length} price predictions successfully`);
    }

    // 10. POPULATE DEMAND_FORECASTS TABLE
    console.log('\n🔟 Populating DEMAND_FORECASTS table...');
    const demandForecasts = [];

    for (let i = 0; i < 25; i++) {
      const route = randomElement(routes);
      const forecastDate = randomDate(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)); // Next 60 days
      const expectedBookings = Math.floor(Math.random() * 50) + 10;

      demandForecasts.push({
        id: generateId(),
        route: route,
        forecast_date: forecastDate.toISOString(),
        expected_bookings: expectedBookings,
        demand_intensity: Math.random() * 0.4 + 0.6, // 60-100%
        peak_hours: [9, 10, 11, 17, 18, 19], // Business hours
        seasonality: Math.random() * 0.3 + 0.85, // 85-115%
        events: JSON.stringify({
          conferences: Math.random() > 0.7 ? ['Tech Summit', 'Aviation Expo'] : [],
          holidays: Math.random() > 0.8 ? ['Independence Day'] : [],
          sports_events: Math.random() > 0.6 ? ['Championship Game'] : []
        }),
        economic_indicators: JSON.stringify({
          gdp_growth: Math.random() * 0.06 + 0.02, // 2-8%
          business_confidence: Math.random() * 0.2 + 0.7, // 70-90%
          fuel_prices: Math.random() * 50 + 80 // $80-130/barrel
        }),
        actual_bookings: Math.random() > 0.5 ? Math.floor(expectedBookings * (Math.random() * 0.3 + 0.85)) : null,
        prediction_accuracy: Math.random() > 0.5 ? Math.random() * 0.2 + 0.8 : null,
        created_at: new Date().toISOString()
      });
    }

    const { error: demandForecastsError } = await supabase.from('demand_forecasts').insert(demandForecasts);
    if (demandForecastsError) {
      console.error('❌ Error inserting demand forecasts:', demandForecastsError);
    } else {
      console.log(`   ✅ Added ${demandForecasts.length} demand forecasts successfully`);
    }

    // 11. POPULATE REAL_TIME_ALERTS TABLE
    console.log('\n1️⃣1️⃣ Populating REAL_TIME_ALERTS table...');
    const realTimeAlerts = [];
    const alertTypes = ['WeatherDelay', 'MaintenanceIssue', 'PriceChange', 'FlightUpdate', 'BookingConfirmation'];
    const severities = ['Low', 'Medium', 'High', 'Critical'];

    for (let i = 0; i < 25; i++) {
      const alertType = randomElement(alertTypes);
      const severity = randomElement(severities);
      const isActive = Math.random() > 0.3; // 70% active

      let title, message;
      switch (alertType) {
        case 'WeatherDelay':
          title = 'Weather-Related Flight Delay';
          message = 'Flight delayed due to severe weather conditions at departure airport. Estimated delay: 2 hours.';
          break;
        case 'MaintenanceIssue':
          title = 'Aircraft Maintenance Required';
          message = 'Routine maintenance check scheduled. Alternative aircraft being arranged.';
          break;
        case 'PriceChange':
          title = 'Dynamic Pricing Update';
          message = 'Flight prices have been updated based on current market conditions.';
          break;
        case 'FlightUpdate':
          title = 'Flight Schedule Update';
          message = 'Your flight departure time has been updated. New departure: 3:30 PM EST.';
          break;
        default:
          title = 'Booking Confirmed';
          message = 'Your charter flight booking has been confirmed. Check-in details will be sent shortly.';
      }

      realTimeAlerts.push({
        id: generateId(),
        alert_type: alertType,
        severity: severity,
        title: title,
        message: message,
        affected_users: [randomElement(userIds), randomElement(userIds)],
        affected_bookings: [randomElement(bookingIds)],
        affected_aircraft: [randomElement(aircraftIds)],
        affected_routes: [randomElement(routes)],
        is_active: isActive,
        resolved_at: !isActive ? randomDate(new Date('2024-01-01'), new Date()).toISOString() : null,
        sent_via_email: Math.random() > 0.2, // 80% sent via email
        sent_via_sms: Math.random() > 0.5, // 50% sent via SMS
        sent_via_push: Math.random() > 0.3, // 70% sent via push
        created_at: randomDate(new Date('2024-01-01'), new Date()).toISOString()
      });
    }

    const { error: alertsError } = await supabase.from('real_time_alerts').insert(realTimeAlerts);
    if (alertsError) {
      console.error('❌ Error inserting real-time alerts:', alertsError);
    } else {
      console.log(`   ✅ Added ${realTimeAlerts.length} real-time alerts successfully`);
    }

    // 12. POPULATE NOTIFICATION_PREFERENCES TABLE
    console.log('\n1️⃣2️⃣ Populating NOTIFICATION_PREFERENCES table...');
    const notificationPreferences = [];

    for (let i = 0; i < Math.min(25, userIds.length); i++) {
      const userId = userIds[i];

      notificationPreferences.push({
        id: generateId(),
        user_id: userId,
        email_enabled: Math.random() > 0.1, // 90% enable email
        sms_enabled: Math.random() > 0.4, // 60% enable SMS
        push_enabled: Math.random() > 0.2, // 80% enable push
        whatsapp_enabled: Math.random() > 0.7, // 30% enable WhatsApp
        booking_updates: Math.random() > 0.05, // 95% want booking updates
        price_alerts: Math.random() > 0.3, // 70% want price alerts
        weather_alerts: Math.random() > 0.2, // 80% want weather alerts
        promotions: Math.random() > 0.6, // 40% want promotions
        email: `user${i + 1}@example.com`,
        phone: `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
        whatsapp_number: Math.random() > 0.7 ? `+1${Math.floor(Math.random() * 9000000000 + 1000000000)}` : null,
        created_at: randomDate(new Date('2023-01-01'), new Date()).toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const { error: notificationError } = await supabase.from('notification_preferences').insert(notificationPreferences);
    if (notificationError) {
      console.error('❌ Error inserting notification preferences:', notificationError);
    } else {
      console.log(`   ✅ Added ${notificationPreferences.length} notification preferences successfully`);
    }

    // Final verification
    console.log('\n' + '='.repeat(80));
    console.log('🎉 POPULATION COMPLETE - FINAL VERIFICATION');
    console.log('='.repeat(80));

    const tables = [
      'users', 'aircraft', 'operators', 'bookings', 'charter_requests',
      'flight_legs', 'pricing_quotes', 'transactions', 'invoices',
      'maintenance_records', 'crew_assignments', 'aircraft_reviews',
      'operator_reviews', 'market_analytics', 'price_predictions',
      'demand_forecasts', 'real_time_alerts', 'notification_preferences'
    ];

    let totalRecords = 0;
    for (const table of tables) {
      const { count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      const recordCount = count ?? 0;
      totalRecords += recordCount;
      const status = recordCount >= 20 ? '✅' : recordCount >= 10 ? '⚠️ ' : '❌';
      console.log(`${status} ${table.padEnd(25)}: ${recordCount} records`);
    }

    console.log('\n' + '='.repeat(80));
    console.log(`🚀 TOTAL RECORDS IN DATABASE: ${totalRecords}`);
    console.log(`📊 AVERAGE RECORDS PER TABLE: ${Math.round(totalRecords / tables.length)}`);
    console.log(`🎯 SUCCESS CRITERIA (≥20 records per table): ${tables.filter(async (table) => {
      const { count } = await supabase.from(table).select('*', { count: 'exact', head: true });
      return (count ?? 0) >= 20;
    }).length}/${tables.length} tables`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('❌ Fatal error during population:', error);
  }
}

// Run the population script
populateCompleteAviationDatabase().then(() => {
  console.log('\n✅ Aviation database population complete!');
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});