#!/usr/bin/env ts-node

/**
 * Comprehensive Database Population Script
 * Populates all remaining 14 aviation database tables to achieve full operational status
 * Target: ≥20 records per table for complete business intelligence capabilities
 */

import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// Generate unique IDs
const generateId = (prefix: string): string => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Date utilities
const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
const addHours = (date: Date, hours: number): Date => new Date(date.getTime() + hours * 60 * 60 * 1000);
const addMinutes = (date: Date, minutes: number): Date => new Date(date.getTime() + minutes * 60 * 1000);

// Aviation industry constants
const MAJOR_AIRPORTS = [
  'KJFK', 'KLAX', 'KORD', 'KATL', 'KDEN', 'KDFW', 'KSFO', 'KLAS', 'KMIA', 'KTEB',
  'KPBI', 'KBOS', 'KIAD', 'KPHX', 'KSEA', 'KMSP', 'KDTW', 'KBWI', 'KFLL', 'KTPA',
  'EGLL', 'LFPG', 'EDDF', 'EHAM', 'LIRF', 'LEMD', 'LGAV', 'UUDD', 'RJAA', 'VHHH'
];

const AIRLINE_COMPANIES = [
  'Goldman Sachs Aviation', 'JPMorgan Flight Services', 'Tesla Executive Travel',
  'Apple Corporate Jets', 'Microsoft Flight Division', 'Amazon Prime Air Charter',
  'Google Sky Services', 'Meta Aviation Group', 'Netflix Executive Travel',
  'Disney Corporate Flight', 'Berkshire Hathaway Air', 'BlackRock Aviation',
  'Vanguard Flight Services', 'Oracle Executive Jets', 'Salesforce Air Charter',
  'Adobe Sky Division', 'IBM Corporate Aviation', 'Intel Flight Services',
  'Cisco Executive Travel', 'PayPal Private Jets', 'Square Aviation Group'
];

const FIRST_NAMES = [
  'James', 'John', 'Robert', 'Michael', 'William', 'David', 'Richard', 'Joseph',
  'Thomas', 'Christopher', 'Charles', 'Daniel', 'Matthew', 'Anthony', 'Mark',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan',
  'Jessica', 'Sarah', 'Karen', 'Nancy', 'Lisa', 'Betty', 'Dorothy', 'Sandra'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson',
  'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

const CREW_POSITIONS = ['Captain', 'First Officer', 'Flight Attendant', 'Purser', 'Co-Pilot'];

// Status enums
const BOOKING_STATUSES = ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'] as const;
const PAYMENT_STATUSES = ['Pending', 'DepositPaid', 'FullyPaid', 'Refunded'] as const;
const FLIGHT_STATUSES = ['Available', 'Booked', 'InProgress', 'Completed'] as const;
const FLIGHT_TYPES = ['EmptyLeg', 'Charter', 'Positioning'] as const;

// Weather conditions
const WEATHER_CONDITIONS = ['Clear', 'Partly Cloudy', 'Overcast', 'Light Rain', 'Heavy Rain', 'Snow', 'Fog', 'Thunderstorm'];

async function checkCurrentData() {
  console.log('🔍 Checking current data state...');
  
  const counts = {
    operators: await prisma.operator.count(),
    aircraft: await prisma.aircraft.count(),
    flightLegs: await prisma.flightLeg.count(),
    charterRequests: await prisma.charterRequest.count(),
    pricingQuotes: await prisma.pricingQuote.count(),
    bookings: await prisma.booking.count(),
    bookingLegs: await prisma.bookingLeg.count(),
    operatorReviews: await prisma.operatorReview.count(),
    aircraftReviews: await prisma.aircraftReview.count(),
    maintenanceRecords: await prisma.maintenanceRecord.count(),
    transactions: await prisma.transaction.count(),
    marketAnalytics: await prisma.marketAnalytics.count(),
    userBehaviorAnalytics: await prisma.userBehaviorAnalytics.count(),
    pricePredictions: await prisma.pricePrediction.count(),
    demandForecasts: await prisma.demandForecast.count(),
    realTimeAlerts: await prisma.realTimeAlert.count(),
    notificationPreferences: await prisma.notificationPreference.count()
  };

  console.log('📊 Current record counts:');
  Object.entries(counts).forEach(([table, count]) => {
    const status = count >= 20 ? '✅' : count > 0 ? '⚠️' : '❌';
    console.log(`   ${status} ${table}: ${count} records`);
  });

  return counts;
}

async function getExistingData() {
  console.log('📂 Loading existing reference data...');
  
  const operators = await prisma.operator.findMany();
  const aircraft = await prisma.aircraft.findMany();
  const bookings = await prisma.booking.findMany();
  const flightLegs = await prisma.flightLeg.findMany();
  
  console.log(`✅ Loaded ${operators.length} operators, ${aircraft.length} aircraft, ${bookings.length} bookings, ${flightLegs.length} flight legs`);
  
  return { operators, aircraft, bookings, flightLegs };
}

async function populateCharterRequests(aircraft: any[], operators: any[]) {
  console.log('📋 Populating charter requests...');
  
  const existing = await prisma.charterRequest.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Charter requests already sufficient');
    return [];
  }

  const requests = [];
  
  for (let i = 0; i < needed; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const selectedOperator = operators.find(op => op.id === selectedAircraft.operatorId);
    
    const departureDate = addDays(new Date(), Math.floor(Math.random() * 60) + 1);
    const hasReturn = Math.random() > 0.3;
    
    const request = {
      id: generateId('CR'),
      aircraftId: selectedAircraft.id,
      operatorId: selectedOperator.id,
      departureAirport: MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)],
      arrivalAirport: MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)],
      departureDate: departureDate.toISOString().split('T')[0],
      departureTime: `${8 + Math.floor(Math.random() * 12)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`,
      returnDate: hasReturn ? addDays(departureDate, Math.floor(Math.random() * 7) + 1).toISOString().split('T')[0] : null,
      returnTime: hasReturn ? `${8 + Math.floor(Math.random() * 12)}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}` : null,
      passengers: Math.floor(Math.random() * selectedAircraft.maxPassengers) + 1,
      contactName: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
      contactEmail: `customer${i}@${AIRLINE_COMPANIES[i % AIRLINE_COMPANIES.length].toLowerCase().replace(/\s+/g, '')}.com`,
      contactPhone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company: AIRLINE_COMPANIES[i % AIRLINE_COMPANIES.length],
      specialRequests: i % 3 === 0 ? ['Catering required', 'Ground transportation needed'][Math.floor(Math.random() * 2)] : null,
      status: BOOKING_STATUSES[Math.floor(Math.random() * BOOKING_STATUSES.length)],
      preferredCommunication: ['email', 'sms'][Math.floor(Math.random() * 2)],
      urgencyLevel: ['urgent', 'standard', 'flexible'][Math.floor(Math.random() * 3)],
      budgetRange: `${25000 + Math.floor(Math.random() * 50000)}-${75000 + Math.floor(Math.random() * 50000)}`,
      flexibleDates: Math.random() > 0.5,
      flexibleAirports: Math.random() > 0.7,
      aiMatchScore: Math.random(),
      aiRecommendations: {
        alternatives: [
          { aircraftId: aircraft[(i + 1) % aircraft.length].id, score: Math.random() },
          { aircraftId: aircraft[(i + 2) % aircraft.length].id, score: Math.random() }
        ]
      } as any
    };
    
    requests.push(request);
  }

  for (const request of requests) {
    await prisma.charterRequest.create({ data: request });
  }
  
  console.log(`✅ Created ${requests.length} charter requests`);
  return requests;
}

async function populatePricingQuotes(aircraft: any[], charterRequests: any[]) {
  console.log('💰 Populating pricing quotes...');
  
  const existing = await prisma.pricingQuote.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Pricing quotes already sufficient');
    return [];
  }

  const quotes = [];
  
  for (let i = 0; i < needed; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const selectedRequest = charterRequests.length > 0 ? charterRequests[i % charterRequests.length] : null;
    
    const basePrice = parseFloat(selectedAircraft.hourlyRate) * (3 + Math.random() * 5); // 3-8 hours
    const totalPrice = basePrice + (basePrice * 0.15); // Add taxes and fees
    
    const quote = {
      id: generateId('PQ'),
      requestId: selectedRequest?.id || null,
      aircraftId: selectedAircraft.id,
      totalPrice: new Decimal(Math.round(totalPrice)),
      currency: 'USD',
      priceBreakdown: {
        aircraftRate: Math.round(basePrice),
        fuelSurcharge: Math.round(basePrice * 0.08),
        landingFees: Math.round(1200 + Math.random() * 800),
        handlingFees: Math.round(800 + Math.random() * 600),
        cateringFees: Math.round(500 + Math.random() * 1000),
        crewFees: Math.round(1000 + Math.random() * 500),
        taxes: Math.round(totalPrice * 0.08)
      },
      validUntil: addDays(new Date(), 7 + Math.floor(Math.random() * 14)),
      terms: [
        'Payment due 48 hours before departure',
        '50% deposit required to confirm booking',
        'Cancellation fees apply within 72 hours',
        'Weather delays not covered'
      ],
      cancellationPolicy: 'Full refund if cancelled >72 hours before departure. 50% refund 24-72 hours. No refund <24 hours.',
      competitorComparison: {
        ourPrice: Math.round(totalPrice),
        avgCompetitorPrice: Math.round(totalPrice * (1.05 + Math.random() * 0.1)),
        savings: Math.round(totalPrice * (0.05 + Math.random() * 0.1))
      },
      priceMatchGuarantee: Math.random() > 0.5,
      instantAcceptance: Math.random() > 0.3,
      smartContractAddress: Math.random() > 0.7 ? `0x${Math.random().toString(16).substr(2, 40)}` : null,
      blockchainVerified: Math.random() > 0.6,
      escrowEnabled: Math.random() > 0.8
    };
    
    quotes.push(quote);
  }

  for (const quote of quotes) {
    await prisma.pricingQuote.create({ data: quote });
  }
  
  console.log(`✅ Created ${quotes.length} pricing quotes`);
  return quotes;
}

async function populateFlightLegs(aircraft: any[]) {
  console.log('🛫 Populating flight legs...');
  
  const existing = await prisma.flightLeg.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Flight legs already sufficient');
    return [];
  }

  const legs = [];
  
  for (let i = 0; i < needed; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const departureAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    let arrivalAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    while (arrivalAirport === departureAirport) {
      arrivalAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    }
    
    const departureDate = addDays(new Date(), Math.floor(Math.random() * 45) + 1);
    const departureHour = 6 + Math.floor(Math.random() * 16); // 6 AM to 10 PM
    const departureTime = `${departureHour.toString().padStart(2, '0')}:${['00', '15', '30', '45'][Math.floor(Math.random() * 4)]}`;
    
    const flightHours = 1 + Math.random() * 6; // 1-7 hours
    const arrivalDateTime = addMinutes(new Date(`${departureDate.toISOString().split('T')[0]}T${departureTime}`), Math.round(flightHours * 60));
    const arrivalDate = arrivalDateTime.toISOString().split('T')[0];
    const arrivalTime = arrivalDateTime.toISOString().split('T')[1].substr(0, 5);
    
    const distance = Math.round(100 + Math.random() * 2500); // 100-2600 nm
    const hourlyRate = parseFloat(selectedAircraft.hourlyRate);
    const legPrice = hourlyRate * flightHours * (0.9 + Math.random() * 0.2); // ±10% variation
    
    const leg = {
      id: generateId('FL'),
      aircraftId: selectedAircraft.id,
      departureAirport,
      arrivalAirport,
      departureDate: departureDate.toISOString().split('T')[0],
      departureTime,
      arrivalDate,
      arrivalTime,
      flightTime: new Decimal(Math.round(flightHours * 100) / 100), // 2 decimal places
      distance,
      status: FLIGHT_STATUSES[Math.floor(Math.random() * FLIGHT_STATUSES.length)],
      price: new Decimal(Math.round(legPrice)),
      currency: 'USD',
      type: FLIGHT_TYPES[Math.floor(Math.random() * FLIGHT_TYPES.length)],
      dynamicPricing: Math.random() > 0.4,
      instantBooking: Math.random() > 0.3,
      specialOffers: i % 5 === 0 ? { discount: 0.1, reason: 'Empty leg special' } as any : null,
      weatherAlerts: i % 8 === 0 ? { severity: 'low', message: 'Light turbulence expected' } as any : null,
      demandScore: Math.random(),
      priceOptimized: Math.random() > 0.5
    };
    
    legs.push(leg);
  }

  for (const leg of legs) {
    await prisma.flightLeg.create({ data: leg });
  }
  
  console.log(`✅ Created ${legs.length} flight legs`);
  return legs;
}

async function populateBookings(aircraft: any[], operators: any[], quotes: any[]) {
  console.log('📋 Populating bookings...');
  
  const existing = await prisma.booking.count();
  const needed = Math.max(0, 25 - existing);
  
  if (needed === 0) {
    console.log('✅ Bookings already sufficient');
    return [];
  }

  const bookings = [];
  
  for (let i = 0; i < needed; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const selectedOperator = operators.find(op => op.id === selectedAircraft.operatorId);
    const selectedQuote = quotes.length > 0 ? quotes[i % quotes.length] : null;
    
    const totalPrice = selectedQuote ? parseFloat(selectedQuote.totalPrice) : 25000 + Math.random() * 75000;
    const depositAmount = totalPrice * (0.3 + Math.random() * 0.3); // 30-60% deposit
    const balanceAmount = totalPrice - depositAmount;
    
    const booking = {
      id: generateId('BK'),
      quoteId: selectedQuote?.id || null,
      aircraftId: selectedAircraft.id,
      operatorId: selectedOperator.id,
      status: BOOKING_STATUSES[Math.floor(Math.random() * BOOKING_STATUSES.length)],
      totalPrice: new Decimal(Math.round(totalPrice)),
      currency: 'USD',
      paymentStatus: PAYMENT_STATUSES[Math.floor(Math.random() * PAYMENT_STATUSES.length)],
      paymentMethod: ['CreditCard', 'BankTransfer', 'Wire', 'ACH'][Math.floor(Math.random() * 4)],
      depositAmount: new Decimal(Math.round(depositAmount)),
      balanceAmount: new Decimal(Math.round(balanceAmount)),
      depositDueDate: addDays(new Date(), Math.floor(Math.random() * 14) + 1),
      balanceDueDate: addDays(new Date(), Math.floor(Math.random() * 30) + 15),
      confirmationCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      qrCode: `QR_${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
      digitalWallet: Math.random() > 0.7,
      realTimeUpdates: true,
      updatePreferences: {
        sms: Math.random() > 0.4,
        email: true,
        push: Math.random() > 0.3
      } as any,
      passengerInfo: {
        primaryContact: {
          name: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
          email: `passenger${i}@${AIRLINE_COMPANIES[i % AIRLINE_COMPANIES.length].toLowerCase().replace(/\s+/g, '')}.com`,
          phone: `+1-555-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
        },
        totalPassengers: Math.floor(Math.random() * selectedAircraft.maxPassengers) + 1
      } as any,
      specialRequests: i % 4 === 0 ? ['Vegetarian catering', 'Extra legroom', 'WiFi priority'][Math.floor(Math.random() * 3)] : null,
      dietaryRestrictions: i % 6 === 0 ? ['Vegetarian', 'Gluten-free', 'Kosher', 'Halal'][Math.floor(Math.random() * 4)] : null,
      accessibilityNeeds: i % 10 === 0 ? ['Wheelchair accessible', 'Visual assistance', 'Hearing assistance'][Math.floor(Math.random() * 3)] : null,
      travelInsurance: Math.random() > 0.6,
      cancelProtection: Math.random() > 0.5,
      weatherProtection: Math.random() > 0.7
    };
    
    bookings.push(booking);
  }

  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }
  
  console.log(`✅ Created ${bookings.length} bookings`);
  return bookings;
}

async function populateOperatorReviews(operators: any[], bookings: any[]) {
  console.log('⭐ Populating operator reviews...');
  
  const existing = await prisma.operatorReview.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Operator reviews already sufficient');
    return [];
  }

  const reviews = [];
  const reviewTitles = [
    'Excellent Service', 'Professional Crew', 'Smooth Operation', 'Great Experience',
    'Highly Recommended', 'Outstanding Service', 'Perfect Flight', 'Exceptional Quality',
    'Reliable Operator', 'First-Class Service', 'Top Notch', 'Impressed with Service',
    'Seamless Experience', 'Professional Team', 'Quality Aircraft', 'Timely Service',
    'Great Communication', 'Attention to Detail', 'Luxury Experience', 'Safe and Comfortable'
  ];
  
  const reviewTexts = [
    'The entire experience was flawless from booking to landing. Professional crew and immaculate aircraft.',
    'Outstanding service with attention to every detail. The crew was friendly and accommodating.',
    'Punctual departure and arrival. Aircraft was clean and well-maintained. Highly recommend.',
    'Excellent communication throughout the process. Made our business trip very smooth.',
    'Top-quality service with a professional team. Will definitely book again for future flights.',
    'The aircraft exceeded expectations and the crew provided exceptional service throughout.',
    'Smooth booking process and reliable operator. Everything went exactly as planned.',
    'Professional pilots and cabin crew. Aircraft was equipped with modern amenities.',
    'Great value for money with premium service quality. Very satisfied with the experience.',
    'Flexible scheduling and accommodating to our special requests. Outstanding operator.'
  ];
  
  for (let i = 0; i < needed; i++) {
    const selectedOperator = operators[i % operators.length];
    const selectedBooking = bookings.length > 0 && i < bookings.length ? bookings[i] : null;
    
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars (mostly positive)
    
    const review = {
      id: generateId('OR'),
      operatorId: selectedOperator.id,
      bookingId: selectedBooking?.id || null,
      customerName: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
      customerEmail: `reviewer${i}@${AIRLINE_COMPANIES[i % AIRLINE_COMPANIES.length].toLowerCase().replace(/\s+/g, '')}.com`,
      rating,
      title: reviewTitles[i % reviewTitles.length],
      review: reviewTexts[i % reviewTexts.length],
      serviceRating: Math.max(3, rating + Math.floor(Math.random() * 2) - 1),
      communicationRating: Math.max(3, rating + Math.floor(Math.random() * 2) - 1),
      valueRating: Math.max(3, rating + Math.floor(Math.random() * 2) - 1),
      timelinessRating: Math.max(3, rating + Math.floor(Math.random() * 2) - 1),
      verifiedBooking: selectedBooking !== null,
      helpful: Math.floor(Math.random() * 25) + 1
    };
    
    reviews.push(review);
  }

  for (const review of reviews) {
    await prisma.operatorReview.create({ data: review });
  }
  
  console.log(`✅ Created ${reviews.length} operator reviews`);
  return reviews;
}

async function populateAircraftReviews(aircraft: any[], bookings: any[]) {
  console.log('✈️ Populating aircraft reviews...');
  
  const existing = await prisma.aircraftReview.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Aircraft reviews already sufficient');
    return [];
  }

  const reviews = [];
  const reviewTitles = [
    'Comfortable Cabin', 'Modern Aircraft', 'Clean and Well-Maintained', 'Spacious Interior',
    'Great Amenities', 'Smooth Flight', 'Luxurious Experience', 'Impressive Aircraft',
    'Comfortable Seating', 'Well-Equipped Cabin', 'Beautiful Interior', 'Top-Quality Aircraft',
    'Excellent Condition', 'Perfect for Business', 'Quiet Cabin', 'Premium Aircraft',
    'Outstanding Comfort', 'Modern Amenities', 'Immaculate Aircraft', 'First-Class Cabin'
  ];
  
  const reviewTexts = [
    'The aircraft interior was immaculate and very comfortable for our 4-hour flight.',
    'Modern amenities including WiFi and entertainment system made the flight enjoyable.',
    'Spacious cabin with comfortable seating. The aircraft was clearly well-maintained.',
    'Clean and comfortable with excellent amenities. Perfect for business travel.',
    'The aircraft exceeded our expectations with its modern interior and smooth flight.',
    'Comfortable seating and quiet cabin made for a relaxing flight experience.',
    'Well-appointed interior with premium amenities. Very impressed with the aircraft quality.',
    'The cabin was spacious and elegantly designed. Great attention to detail.',
    'Modern aircraft with excellent comfort features. Would fly this aircraft again.',
    'Pristine condition aircraft with comfortable seating and good amenities.'
  ];
  
  for (let i = 0; i < needed; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const selectedBooking = bookings.length > 0 && i < bookings.length ? bookings[i] : null;
    
    const rating = Math.floor(Math.random() * 2) + 4; // 4-5 stars (mostly positive)
    
    const review = {
      id: generateId('AR'),
      aircraftId: selectedAircraft.id,
      bookingId: selectedBooking?.id || null,
      customerName: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
      customerEmail: `reviewer${i}@${AIRLINE_COMPANIES[i % AIRLINE_COMPANIES.length].toLowerCase().replace(/\s+/g, '')}.com`,
      rating,
      title: reviewTitles[i % reviewTitles.length],
      review: reviewTexts[i % reviewTexts.length],
      comfortRating: Math.max(3, rating + Math.floor(Math.random() * 2) - 1),
      cleanlinessRating: Math.max(4, rating + Math.floor(Math.random() * 2) - 1),
      amenitiesRating: Math.max(3, rating + Math.floor(Math.random() * 2) - 1),
      verifiedBooking: selectedBooking !== null,
      helpful: Math.floor(Math.random() * 20) + 1
    };
    
    reviews.push(review);
  }

  for (const review of reviews) {
    await prisma.aircraftReview.create({ data: review });
  }
  
  console.log(`✅ Created ${reviews.length} aircraft reviews`);
  return reviews;
}

async function populateMaintenanceRecords(aircraft: any[]) {
  console.log('🔧 Populating maintenance records...');
  
  const existing = await prisma.maintenanceRecord.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Maintenance records already sufficient');
    return [];
  }

  const maintenanceTypes = ['Routine', 'Progressive', 'AOG', 'Compliance'];
  const facilities = [
    'JetVision Maintenance - KTEB', 'Elite Aviation Service - KLAS', 'Prestige Air MRO - KLAX',
    'Atlantic Aviation - KJFK', 'Signature Flight Support - KMIA', 'TAC Air - KBOS',
    'Clay Lacy Aviation - KBUR', 'Million Air - KORD', 'Sheltair - KFLL', 'Ross Aviation - KDEN'
  ];
  
  const records = [];
  
  for (let i = 0; i < needed; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const maintenanceType = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
    
    const scheduledDate = addDays(new Date(), -Math.floor(Math.random() * 180)); // Past maintenance
    const wasCompleted = Math.random() > 0.1; // 90% completion rate
    const completedDate = wasCompleted ? addDays(scheduledDate, Math.floor(Math.random() * 7) + 1) : null;
    
    let description = '';
    let cost = 0;
    
    switch (maintenanceType) {
      case 'Routine':
        description = 'Scheduled 100-hour inspection including engine, avionics, and systems checks';
        cost = 5000 + Math.random() * 10000;
        break;
      case 'Progressive':
        description = 'Progressive inspection Phase ' + ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)];
        cost = 15000 + Math.random() * 25000;
        break;
      case 'AOG':
        description = 'Aircraft on Ground - ' + ['Engine repair', 'Avionics malfunction', 'Landing gear issue', 'Hydraulic system repair'][Math.floor(Math.random() * 4)];
        cost = 25000 + Math.random() * 75000;
        break;
      case 'Compliance':
        description = 'Airworthiness Directive (AD) compliance - ' + ['Engine mod', 'Safety bulletin', 'Structural inspection'][Math.floor(Math.random() * 3)];
        cost = 8000 + Math.random() * 20000;
        break;
    }
    
    const record = {
      id: generateId('MR'),
      aircraftId: selectedAircraft.id,
      maintenanceType,
      description,
      scheduledDate,
      completedDate,
      cost: new Decimal(Math.round(cost)),
      currency: 'USD',
      facility: facilities[Math.floor(Math.random() * facilities.length)],
      technician: `${FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]}`,
      workOrders: [
        `WO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        `WO-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      ],
      hoursAtMaintenance: new Decimal(Math.round((1000 + Math.random() * 8000) * 100) / 100),
      cyclesAtMaintenance: Math.floor(Math.random() * 5000) + 500,
      predictionAccuracy: Math.random() * 0.4 + 0.6 // 60-100% accuracy
    };
    
    records.push(record);
  }

  for (const record of records) {
    await prisma.maintenanceRecord.create({ data: record });
  }
  
  console.log(`✅ Created ${records.length} maintenance records`);
  return records;
}

async function populateTransactions(bookings: any[]) {
  console.log('💳 Populating transactions...');
  
  const existing = await prisma.transaction.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Transactions already sufficient');
    return [];
  }

  const transactionTypes = ['Payment', 'Refund', 'Chargeback', 'Fee'];
  const paymentMethods = ['CreditCard', 'BankTransfer', 'Wire', 'ACH', 'Crypto'];
  const processors = ['Stripe', 'Square', 'PayPal', 'Authorize.Net', 'Coinbase'];
  const statuses = ['Pending', 'Completed', 'Failed', 'Cancelled'];
  
  const transactions = [];
  
  for (let i = 0; i < needed; i++) {
    const selectedBooking = bookings.length > 0 ? bookings[i % bookings.length] : null;
    const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    const processor = processors[Math.floor(Math.random() * processors.length)];
    const status = i < needed * 0.85 ? 'Completed' : statuses[Math.floor(Math.random() * statuses.length)]; // 85% completed
    
    let amount = 0;
    let description = '';
    
    if (selectedBooking && transactionType === 'Payment') {
      amount = Math.random() > 0.5 ? parseFloat(selectedBooking.depositAmount) : parseFloat(selectedBooking.balanceAmount);
      description = `Payment for booking ${selectedBooking.confirmationCode}`;
    } else {
      amount = 1000 + Math.random() * 50000;
      description = `${transactionType} transaction`;
    }
    
    const transaction = {
      id: generateId('TXN'),
      bookingId: selectedBooking?.id || null,
      transactionType,
      amount: new Decimal(Math.round(amount)),
      currency: 'USD',
      status,
      paymentMethod,
      processorName: processor,
      processorTransactionId: `${processor.toLowerCase()}_${Math.random().toString(36).substr(2, 15)}`,
      processorFee: new Decimal(Math.round(amount * 0.029 + 30)), // ~2.9% + $0.30
      blockchainTxHash: paymentMethod === 'Crypto' ? `0x${Math.random().toString(16).substr(2, 64)}` : null,
      smartContractAddress: paymentMethod === 'Crypto' ? `0x${Math.random().toString(16).substr(2, 40)}` : null,
      gasUsed: paymentMethod === 'Crypto' ? (Math.floor(Math.random() * 100000) + 21000).toString() : null,
      riskScore: Math.floor(Math.random() * 100),
      fraudFlags: Math.random() < 0.05 ? ['high_velocity', 'suspicious_location'] : [],
      description,
      customerReference: selectedBooking?.confirmationCode || `REF-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      merchantReference: `AVINODE-${generateId('MR')}`,
      initiatedDate: addDays(new Date(), -Math.floor(Math.random() * 30)),
      completedDate: status === 'Completed' ? addDays(new Date(), -Math.floor(Math.random() * 28)) : null
    };
    
    transactions.push(transaction);
  }

  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }
  
  console.log(`✅ Created ${transactions.length} transactions`);
  return transactions;
}

async function populateMarketAnalytics() {
  console.log('📊 Populating market analytics...');
  
  const existing = await prisma.marketAnalytics.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Market analytics already sufficient');
    return [];
  }

  const regions = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East', 'Africa'];
  const analytics = [];
  
  for (let i = 0; i < needed; i++) {
    const date = addDays(new Date(), -i);
    const region = regions[i % regions.length];
    
    const totalBookings = Math.floor(Math.random() * 100) + 50;
    const avgPrice = 20000 + Math.random() * 30000;
    const totalRevenue = totalBookings * avgPrice * (0.8 + Math.random() * 0.4);
    
    const record = {
      id: generateId('MA'),
      date,
      region,
      totalBookings,
      totalRevenue: new Decimal(Math.round(totalRevenue)),
      averagePrice: new Decimal(Math.round(avgPrice)),
      utilizationRate: 0.5 + Math.random() * 0.4, // 50-90%
      topRoutes: [
        { from: MAJOR_AIRPORTS[0], to: MAJOR_AIRPORTS[1], count: Math.floor(Math.random() * 20) + 5 },
        { from: MAJOR_AIRPORTS[2], to: MAJOR_AIRPORTS[3], count: Math.floor(Math.random() * 15) + 3 },
        { from: MAJOR_AIRPORTS[4], to: MAJOR_AIRPORTS[5], count: Math.floor(Math.random() * 10) + 2 }
      ],
      topAircraft: [
        { category: 'Light Jet', count: Math.floor(Math.random() * 30) + 10 },
        { category: 'Midsize Jet', count: Math.floor(Math.random() * 25) + 8 },
        { category: 'Heavy Jet', count: Math.floor(Math.random() * 20) + 5 }
      ],
      marketShare: 0.15 + Math.random() * 0.1, // 15-25% market share
      competitorPricing: {
        average: Math.round(avgPrice * (1.05 + Math.random() * 0.1)),
        median: Math.round(avgPrice * (1.02 + Math.random() * 0.08)),
        percentile75: Math.round(avgPrice * (1.15 + Math.random() * 0.1)),
        percentile25: Math.round(avgPrice * (0.95 + Math.random() * 0.08))
      }
    };
    
    analytics.push(record);
  }

  for (const record of analytics) {
    await prisma.marketAnalytics.create({ data: record });
  }
  
  console.log(`✅ Created ${analytics.length} market analytics records`);
  return analytics;
}

async function populateUserBehaviorAnalytics() {
  console.log('👤 Populating user behavior analytics...');
  
  const existing = await prisma.userBehaviorAnalytics.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ User behavior analytics already sufficient');
    return [];
  }

  const entryPoints = ['Search', 'Direct', 'Referral', 'Social Media', 'Email Campaign', 'Google Ads'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0'
  ];
  const countries = ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia'];
  const cities = ['New York', 'Los Angeles', 'London', 'Paris', 'Tokyo', 'Sydney', 'Toronto'];
  
  const analytics = [];
  
  for (let i = 0; i < needed; i++) {
    const sessionDuration = Math.floor(Math.random() * 3600) + 60; // 1 minute to 1 hour
    const pageViews = Math.floor(sessionDuration / 120) + 1; // Roughly 1 page per 2 minutes
    const quotesRequested = Math.random() < 0.3 ? Math.floor(Math.random() * 5) + 1 : 0;
    const bookingCompleted = quotesRequested > 0 && Math.random() < 0.15; // 15% conversion from quotes
    
    const record = {
      id: generateId('UBA'),
      sessionId: `sess_${Math.random().toString(36).substr(2, 16)}`,
      userId: Math.random() < 0.4 ? `user_${Math.random().toString(36).substr(2, 12)}` : null,
      entryPoint: entryPoints[Math.floor(Math.random() * entryPoints.length)],
      searchCriteria: quotesRequested > 0 ? {
        departureAirport: MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)],
        arrivalAirport: MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)],
        passengers: Math.floor(Math.random() * 8) + 1,
        category: ['Light Jet', 'Midsize Jet', 'Heavy Jet'][Math.floor(Math.random() * 3)]
      } as any : null,
      viewedAircraft: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => 
        `ACF_${Math.random().toString(36).substr(2, 8).toUpperCase()}`
      ),
      quotesRequested,
      bookingCompleted,
      sessionDuration,
      pageViews,
      bounceRate: pageViews === 1,
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: countries[Math.floor(Math.random() * countries.length)],
      city: cities[Math.floor(Math.random() * cities.length)]
    };
    
    analytics.push(record);
  }

  for (const record of analytics) {
    await prisma.userBehaviorAnalytics.create({ data: record });
  }
  
  console.log(`✅ Created ${analytics.length} user behavior analytics records`);
  return analytics;
}

async function populatePricePredictions(aircraft: any[]) {
  console.log('🔮 Populating price predictions...');
  
  const existing = await prisma.pricePrediction.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Price predictions already sufficient');
    return [];
  }

  const predictions = [];
  
  for (let i = 0; i < needed; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const departureAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    let arrivalAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    while (arrivalAirport === departureAirport) {
      arrivalAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    }
    const route = `${departureAirport}-${arrivalAirport}`;
    
    const basePrice = parseFloat(selectedAircraft.hourlyRate) * (2 + Math.random() * 6); // 2-8 hours
    const predictedPrice = basePrice * (0.85 + Math.random() * 0.3); // ±15% variation
    
    const prediction = {
      id: generateId('PP'),
      aircraftId: selectedAircraft.id,
      route,
      predictedDate: addDays(new Date(), Math.floor(Math.random() * 60) + 1),
      predictedPrice: new Decimal(Math.round(predictedPrice)),
      confidenceScore: 0.6 + Math.random() * 0.35, // 60-95% confidence
      demandForecast: Math.random(),
      historicalPricing: {
        last30Days: Math.round(basePrice * (0.9 + Math.random() * 0.2)),
        last90Days: Math.round(basePrice * (0.85 + Math.random() * 0.3)),
        lastYear: Math.round(basePrice * (0.8 + Math.random() * 0.4)),
        trend: ['increasing', 'decreasing', 'stable'][Math.floor(Math.random() * 3)]
      },
      seasonalFactors: {
        holidayImpact: Math.random() * 0.3, // 0-30% impact
        summerPremium: Math.random() * 0.2, // 0-20% premium
        winterDiscount: Math.random() * 0.15, // 0-15% discount
        weekendPremium: Math.random() * 0.1 // 0-10% weekend premium
      },
      weatherFactors: {
        stormRisk: Math.random() * 0.1, // 0-10% risk
        turbulenceRisk: Math.random() * 0.05, // 0-5% risk
        visibilityRisk: Math.random() * 0.08 // 0-8% risk
      },
      eventFactors: {
        sportsEvents: Math.random() > 0.8 ? { impact: Math.random() * 0.25, events: ['Super Bowl', 'World Series'] } : null,
        conferences: Math.random() > 0.7 ? { impact: Math.random() * 0.2, events: ['CES', 'TechCrunch'] } : null,
        holidays: Math.random() > 0.6 ? { impact: Math.random() * 0.3, holidays: ['Thanksgiving', 'Christmas'] } : null
      },
      modelVersion: ['1.0', '1.1', '2.0'][Math.floor(Math.random() * 3)],
      trainingAccuracy: 0.75 + Math.random() * 0.2 // 75-95% accuracy
    };
    
    predictions.push(prediction);
  }

  for (const prediction of predictions) {
    await prisma.pricePrediction.create({ data: prediction });
  }
  
  console.log(`✅ Created ${predictions.length} price predictions`);
  return predictions;
}

async function populateDemandForecasts() {
  console.log('📈 Populating demand forecasts...');
  
  const existing = await prisma.demandForecast.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Demand forecasts already sufficient');
    return [];
  }

  const forecasts = [];
  
  for (let i = 0; i < needed; i++) {
    const departureAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    let arrivalAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    while (arrivalAirport === departureAirport) {
      arrivalAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    }
    const route = `${departureAirport}-${arrivalAirport}`;
    
    const expectedBookings = Math.floor(Math.random() * 50) + 10; // 10-60 bookings
    const actualBookings = Math.random() < 0.7 ? Math.floor(expectedBookings * (0.8 + Math.random() * 0.4)) : null;
    
    const forecast = {
      id: generateId('DF'),
      route,
      forecastDate: addDays(new Date(), Math.floor(Math.random() * 30) + 1),
      expectedBookings,
      demandIntensity: Math.random(),
      peakHours: Array.from({ length: 3 }, () => Math.floor(Math.random() * 24)).sort(),
      seasonality: 0.5 + Math.random() * 0.5, // 50-100% seasonal factor
      events: Math.random() > 0.6 ? [
        { name: 'Business Conference', impact: 0.2 + Math.random() * 0.3 },
        { name: 'Sports Event', impact: 0.1 + Math.random() * 0.2 }
      ] as any : null,
      economicIndicators: {
        gdpGrowth: -0.02 + Math.random() * 0.06, // -2% to +4%
        inflationRate: 0.02 + Math.random() * 0.06, // 2% to 8%
        businessConfidence: 0.6 + Math.random() * 0.3, // 60-90%
        oilPrices: 70 + Math.random() * 50 // $70-120 per barrel
      },
      actualBookings,
      predictionAccuracy: actualBookings ? Math.max(0.5, 1 - Math.abs(expectedBookings - actualBookings) / expectedBookings) : null
    };
    
    forecasts.push(forecast);
  }

  for (const forecast of forecasts) {
    await prisma.demandForecast.create({ data: forecast });
  }
  
  console.log(`✅ Created ${forecasts.length} demand forecasts`);
  return forecasts;
}

async function populateRealTimeAlerts() {
  console.log('🚨 Populating real-time alerts...');
  
  const existing = await prisma.realTimeAlert.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Real-time alerts already sufficient');
    return [];
  }

  const alertTypes = ['WeatherDelay', 'MaintenanceIssue', 'PriceChange', 'ScheduleChange', 'SecurityAlert'];
  const severities = ['Low', 'Medium', 'High', 'Critical'];
  
  const alertTemplates = {
    WeatherDelay: {
      titles: ['Weather Advisory', 'Storm Warning', 'Fog Alert', 'Wind Shear Warning'],
      messages: [
        'Severe weather conditions expected in the area. Delays possible.',
        'Thunderstorms forecast for departure time. Monitor conditions.',
        'Heavy fog reducing visibility below minimums.',
        'High winds may impact takeoff and landing operations.'
      ]
    },
    MaintenanceIssue: {
      titles: ['Maintenance Alert', 'Aircraft Inspection', 'Technical Issue', 'Service Advisory'],
      messages: [
        'Scheduled maintenance will impact aircraft availability.',
        'Technical inspection required before next flight.',
        'Minor technical issue resolved, operations normal.',
        'Maintenance complete, aircraft returned to service.'
      ]
    },
    PriceChange: {
      titles: ['Price Update', 'Rate Change', 'Special Offer', 'Market Adjustment'],
      messages: [
        'Pricing updated based on current market conditions.',
        'Special discount available for next 24 hours.',
        'Dynamic pricing adjustment due to demand changes.',
        'Promotional rates now available for select routes.'
      ]
    }
  };
  
  const alerts = [];
  
  for (let i = 0; i < needed; i++) {
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const templates = (alertTemplates as any)[alertType] || alertTemplates.WeatherDelay;
    
    const isActive = Math.random() > 0.2; // 80% active alerts
    const resolvedAt = isActive ? null : addHours(new Date(), -Math.floor(Math.random() * 48));
    
    const alert = {
      id: generateId('AL'),
      alertType,
      severity,
      title: templates.titles[Math.floor(Math.random() * templates.titles.length)],
      message: templates.messages[Math.floor(Math.random() * templates.messages.length)],
      affectedUsers: Math.random() > 0.5 ? ['all'] : Array.from(
        { length: Math.floor(Math.random() * 5) + 1 }, 
        () => `user_${Math.random().toString(36).substr(2, 12)}`
      ),
      affectedBookings: Math.random() > 0.7 ? Array.from(
        { length: Math.floor(Math.random() * 3) + 1 }, 
        () => `BK_${Math.random().toString(36).substr(2, 12)}`
      ) : [],
      affectedAircraft: Math.random() > 0.6 ? Array.from(
        { length: Math.floor(Math.random() * 2) + 1 }, 
        () => `ACF_${Math.random().toString(36).substr(2, 12)}`
      ) : [],
      affectedRoutes: Array.from(
        { length: Math.floor(Math.random() * 3) + 1 }, 
        () => `${MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)]}-${MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)]}`
      ),
      isActive,
      resolvedAt,
      sentViaEmail: Math.random() > 0.2,
      sentViaSMS: Math.random() > 0.5,
      sentViaPush: Math.random() > 0.3
    };
    
    alerts.push(alert);
  }

  for (const alert of alerts) {
    await prisma.realTimeAlert.create({ data: alert });
  }
  
  console.log(`✅ Created ${alerts.length} real-time alerts`);
  return alerts;
}

async function populateNotificationPreferences() {
  console.log('🔔 Populating notification preferences...');
  
  const existing = await prisma.notificationPreference.count();
  const needed = Math.max(0, 20 - existing);
  
  if (needed === 0) {
    console.log('✅ Notification preferences already sufficient');
    return [];
  }

  const preferences = [];
  
  for (let i = 0; i < needed; i++) {
    const pref = {
      id: generateId('NP'),
      userId: `user_${Math.random().toString(36).substr(2, 12)}`,
      emailEnabled: Math.random() > 0.1, // 90% enable email
      smsEnabled: Math.random() > 0.4, // 60% enable SMS
      pushEnabled: Math.random() > 0.2, // 80% enable push
      whatsappEnabled: Math.random() > 0.7, // 30% enable WhatsApp
      bookingUpdates: Math.random() > 0.05, // 95% want booking updates
      priceAlerts: Math.random() > 0.3, // 70% want price alerts
      weatherAlerts: Math.random() > 0.2, // 80% want weather alerts
      promotions: Math.random() > 0.6, // 40% want promotions
      email: `user${i}@${AIRLINE_COMPANIES[i % AIRLINE_COMPANIES.length].toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      whatsappNumber: Math.random() > 0.7 ? `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}` : null
    };
    
    preferences.push(pref);
  }

  for (const pref of preferences) {
    await prisma.notificationPreference.create({ data: pref });
  }
  
  console.log(`✅ Created ${preferences.length} notification preferences`);
  return preferences;
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive database population for all remaining tables...');
    console.log('🎯 Target: ≥20 records per table for full operational status\n');
    
    // Check current state
    await checkCurrentData();
    
    // Load existing reference data
    const { operators, aircraft, bookings, flightLegs } = await getExistingData();
    
    // Populate all remaining tables systematically
    console.log('\n📝 Populating remaining tables...\n');
    
    const charterRequests = await populateCharterRequests(aircraft, operators);
    const pricingQuotes = await populatePricingQuotes(aircraft, charterRequests);
    const newFlightLegs = await populateFlightLegs(aircraft);
    const newBookings = await populateBookings(aircraft, operators, pricingQuotes);
    const operatorReviews = await populateOperatorReviews(operators, [...bookings, ...newBookings]);
    const aircraftReviews = await populateAircraftReviews(aircraft, [...bookings, ...newBookings]);
    const maintenanceRecords = await populateMaintenanceRecords(aircraft);
    const transactions = await populateTransactions([...bookings, ...newBookings]);
    const marketAnalytics = await populateMarketAnalytics();
    const userBehaviorAnalytics = await populateUserBehaviorAnalytics();
    const pricePredictions = await populatePricePredictions(aircraft);
    const demandForecasts = await populateDemandForecasts();
    const realTimeAlerts = await populateRealTimeAlerts();
    const notificationPrefs = await populateNotificationPreferences();
    
    // Final verification
    console.log('\n🔍 Final verification of all tables...\n');
    const finalCounts = await checkCurrentData();
    
    // Calculate totals
    const totalRecords = Object.values(finalCounts).reduce((sum, count) => sum + count, 0);
    const tablesWithSufficientData = Object.values(finalCounts).filter(count => count >= 20).length;
    const totalTables = Object.keys(finalCounts).length;
    
    console.log('\n🎉 COMPREHENSIVE DATABASE POPULATION COMPLETED!');
    console.log('\n📊 FINAL SUMMARY:');
    console.log(`   🎯 Total Records: ${totalRecords}`);
    console.log(`   ✅ Tables with ≥20 records: ${tablesWithSufficientData}/${totalTables}`);
    console.log(`   📈 Database Completion: ${Math.round((tablesWithSufficientData / totalTables) * 100)}%`);
    
    if (totalRecords >= 400 && tablesWithSufficientData >= 17) {
      console.log('\n🏆 SUCCESS CRITERIA MET:');
      console.log('   ✅ All tables have ≥20 records');
      console.log('   ✅ Total database records >400');
      console.log('   ✅ Full aviation business intelligence operational');
      console.log('   ✅ Ready for comprehensive MCP server demonstrations');
    } else {
      console.log('\n⚠️  Some tables may still need additional records');
    }
    
    console.log('\n🚀 Database is now fully operational with comprehensive aviation industry data!');
    
  } catch (error) {
    console.error('❌ Error during comprehensive population:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the population script
if (require.main === module) {
  main()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Fatal error:', error);
      process.exit(1);
    });
}

export default main;