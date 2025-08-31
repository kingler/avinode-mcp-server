#!/usr/bin/env ts-node

/**
 * Comprehensive Database Seeding Script
 * Populates the aviation charter system with realistic operational data
 * for full testing of all aviation operations and API endpoints.
 */

import { PrismaClient } from '@prisma/client';
import { createClient } from '@supabase/supabase-js';

// Initialize clients
const prisma = new PrismaClient();

// Supabase client for fallback
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && supabaseServiceKey ? 
  createClient(supabaseUrl, supabaseServiceKey) : null;

// Generate unique IDs
const generateId = (prefix: string): string => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Date utilities
const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
const addHours = (date: Date, hours: number): Date => new Date(date.getTime() + hours * 60 * 60 * 1000);

// Major airports for realistic routes
const MAJOR_AIRPORTS = [
  'KJFK', 'KLAX', 'KORD', 'KATL', 'KDEN', 'KDFW', 'KSFO', 'KLAS', 'KMIA', 'KTEB',
  'KPBI', 'KBOS', 'KIAD', 'KPHX', 'KSEA', 'KMSP', 'KDTW', 'KBWI', 'KFLL', 'KTPA',
  'EGLL', 'LFPB', 'EDDF', 'EHAM', 'EGKK', 'LEMD', 'LIRF', 'LOWW', 'LSZH', 'OMDB'
];

// Customer types and profiles
const CUSTOMER_TYPES = ['VIP', 'Corporate', 'Individual', 'Government', 'Entertainment'];
const COMPANIES = [
  'Goldman Sachs', 'Microsoft', 'Apple Inc.', 'Netflix', 'Tesla Motors', 'Amazon', 'Meta',
  'Berkshire Hathaway', 'JPMorgan Chase', 'Johnson & Johnson', 'ExxonMobil', 'Walmart',
  'Procter & Gamble', 'Bank of America', 'Visa Inc.', 'Mastercard', 'Nike', 'Disney',
  'Coca-Cola', 'PepsiCo', 'McDonald\'s', 'IBM', 'Intel', 'Oracle', 'Salesforce'
];

const FIRST_NAMES = [
  'James', 'Robert', 'John', 'Michael', 'William', 'David', 'Richard', 'Joseph', 'Thomas', 'Christopher',
  'Mary', 'Patricia', 'Jennifer', 'Linda', 'Elizabeth', 'Barbara', 'Susan', 'Jessica', 'Sarah', 'Karen',
  'Alexander', 'Jonathan', 'Benjamin', 'Matthew', 'Andrew', 'Joshua', 'Daniel', 'Anthony', 'Mark', 'Paul',
  'Ashley', 'Kimberly', 'Emily', 'Donna', 'Margaret', 'Carol', 'Ruth', 'Sharon', 'Michelle', 'Laura'
];

const LAST_NAMES = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson'
];

// Dietary restrictions and preferences
const DIETARY_RESTRICTIONS = [
  'Vegetarian', 'Vegan', 'Gluten-free', 'Kosher', 'Halal', 'Dairy-free', 'Nut allergy', 'Shellfish allergy'
];

const AMENITY_PREFERENCES = [
  'WiFi', 'Entertainment System', 'Conference Table', 'Sleeping Configuration', 'Full Galley',
  'Multiple Lavatories', 'Shower', 'Office Area', 'Pet-friendly', 'Champagne Service'
];

// Flight statuses and operational data
const FLIGHT_STATUSES = ['Scheduled', 'InProgress', 'Completed', 'Delayed', 'Cancelled'];
const BOOKING_STATUSES = ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'];
const PAYMENT_STATUSES = ['Pending', 'DepositPaid', 'FullyPaid', 'Refunded'];

// Generate random GPS coordinates for realistic locations
const generateGPSCoordinates = (airport: string) => {
  const airportCoords: { [key: string]: { lat: number; lng: number } } = {
    'KJFK': { lat: 40.6413, lng: -73.7781 },
    'KLAX': { lat: 34.0522, lng: -118.2437 },
    'KMIA': { lat: 25.7933, lng: -80.2906 },
    'KORD': { lat: 41.9742, lng: -87.9073 },
    'KDEN': { lat: 39.8561, lng: -104.6737 },
    'KTEB': { lat: 40.8501, lng: -74.0606 },
    'KLAS': { lat: 36.0840, lng: -115.1537 },
    'EGLL': { lat: 51.4700, lng: -0.4543 },
    'LFPB': { lat: 48.9694, lng: 2.4414 }
  };
  
  const coords = airportCoords[airport] || { lat: 40.0, lng: -74.0 };
  return {
    latitude: coords.lat + (Math.random() - 0.5) * 0.1,
    longitude: coords.lng + (Math.random() - 0.5) * 0.1,
    altitude: 35000 + Math.random() * 10000,
    speed: 450 + Math.random() * 200
  };
};

async function clearExistingData() {
  console.log('🗑️  Clearing existing data...');
  
  // Clear in dependency order
  await prisma.userBehaviorAnalytics.deleteMany();
  await prisma.marketAnalytics.deleteMany();
  await prisma.demandForecast.deleteMany();
  await prisma.pricePrediction.deleteMany();
  await prisma.realTimeAlert.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.maintenanceRecord.deleteMany();
  await prisma.aircraftReview.deleteMany();
  await prisma.operatorReview.deleteMany();
  await prisma.bookingLeg.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.pricingQuote.deleteMany();
  await prisma.charterRequest.deleteMany();
  await prisma.flightLeg.deleteMany();
  await prisma.aircraft.deleteMany();
  await prisma.operator.deleteMany();
  
  console.log('✅ Existing data cleared');
}

async function seedOperators() {
  console.log('🏢 Seeding operators...');
  
  const operators = [
    {
      id: 'OP_JVC_001',
      name: 'JetVision Charter',
      certificate: 'Part 135 (DOT-JVC123456)',
      established: 2010,
      headquarters: 'Teterboro, NJ',
      operatingBases: ['KTEB', 'KJFK', 'KBOS', 'KPBI'],
      fleetSize: 15,
      safetyRating: 'ARGUS Gold',
      insurance: '$100M liability coverage',
      certifications: ['ARGUS Gold', 'Wyvern Wingman', 'IS-BAO Stage 2'],
      contactEmail: 'charter@jetvision.aero',
      contactPhone: '+1-800-JET-VISI',
      website: 'www.jetvision.aero',
      description: 'Premium charter operator specializing in East Coast operations with a modern fleet and exceptional safety record.',
      avgRating: 4.8,
      totalReviews: 127,
      responseTimeHours: 2,
      instantBookingEnabled: true,
      aiOptimizedPricing: true,
      predictiveMaintenanceEnabled: true,
      smartRoutingEnabled: true,
      blockchainVerified: true,
      blockchainAddress: '0x1234...abcd',
      carbonOffsetProgram: true,
      safPercentage: 15.0
    },
    {
      id: 'OP_EA_002',
      name: 'Elite Aviation',
      certificate: 'Part 135 (DOT-EA789012)',
      established: 2005,
      headquarters: 'Las Vegas, NV',
      operatingBases: ['KLAS', 'KMIA', 'KDAL', 'KPHX'],
      fleetSize: 20,
      safetyRating: 'ARGUS Platinum',
      insurance: '$150M liability coverage',
      certifications: ['ARGUS Platinum', 'IS-BAO Stage 3', 'NBAA Certified'],
      contactEmail: 'fly@eliteaviation.com',
      contactPhone: '+1-800-FLY-ELIT',
      website: 'www.eliteaviation.com',
      description: 'Leading charter operator with coast-to-coast coverage and specialization in casino and entertainment industry flights.',
      avgRating: 4.6,
      totalReviews: 89,
      responseTimeHours: 4,
      instantBookingEnabled: true,
      aiOptimizedPricing: false,
      predictiveMaintenanceEnabled: true,
      smartRoutingEnabled: false,
      blockchainVerified: false,
      carbonOffsetProgram: true,
      safPercentage: 8.5
    },
    {
      id: 'OP_PA_003',
      name: 'Prestige Air',
      certificate: 'Part 135 (DOT-PA345678)',
      established: 2008,
      headquarters: 'Los Angeles, CA',
      operatingBases: ['KLAX', 'KORD', 'KSFO', 'KDEN'],
      fleetSize: 25,
      safetyRating: 'ARGUS Platinum',
      insurance: '$200M liability coverage',
      certifications: ['ARGUS Platinum', 'Wyvern Wingman', 'IS-BAO Stage 3'],
      contactEmail: 'info@prestigeair.com',
      contactPhone: '+1-888-PRESTIGE',
      website: 'www.prestigeair.com',
      description: 'West Coast\'s premier charter operator offering super-midsize and large cabin aircraft for discerning travelers.',
      avgRating: 4.9,
      totalReviews: 156,
      responseTimeHours: 1,
      instantBookingEnabled: true,
      aiOptimizedPricing: true,
      predictiveMaintenanceEnabled: true,
      smartRoutingEnabled: true,
      blockchainVerified: true,
      blockchainAddress: '0x5678...efgh',
      carbonOffsetProgram: true,
      safPercentage: 25.0
    },
    {
      id: 'OP_GJ_004',
      name: 'Global Jets',
      certificate: 'Part 135 (DOT-GJ901234)',
      established: 2003,
      headquarters: 'New York, NY',
      operatingBases: ['KTEB', 'KJFK', 'KIAD', 'KBOS', 'EGLL', 'LFPB'],
      fleetSize: 30,
      safetyRating: 'ARGUS Platinum',
      insurance: '$300M liability coverage',
      certifications: ['ARGUS Platinum', 'IS-BAO Stage 3', 'EASA Certified'],
      contactEmail: 'charter@globaljets.aero',
      contactPhone: '+1-800-GLOBAL-J',
      website: 'www.globaljets.aero',
      description: 'International charter operator with transatlantic capabilities and a fleet of heavy jets for global travel.',
      avgRating: 4.7,
      totalReviews: 203,
      responseTimeHours: 6,
      instantBookingEnabled: false,
      aiOptimizedPricing: true,
      predictiveMaintenanceEnabled: false,
      smartRoutingEnabled: true,
      blockchainVerified: false,
      carbonOffsetProgram: false,
      safPercentage: 5.0
    },
    {
      id: 'OP_LW_005',
      name: 'Luxury Wings',
      certificate: 'Part 135 (DOT-LW567890)',
      established: 2015,
      headquarters: 'Miami, FL',
      operatingBases: ['KMIA', 'KLAX', 'KTEB', 'LFPB', 'OMDB'],
      fleetSize: 10,
      safetyRating: 'ARGUS Platinum',
      insurance: '$500M liability coverage',
      certifications: ['ARGUS Platinum', 'IS-BAO Stage 3', 'NBAA Certified'],
      contactEmail: 'concierge@luxurywings.com',
      contactPhone: '+1-888-LUX-WING',
      website: 'www.luxurywings.com',
      description: 'Ultra-luxury charter operator specializing in ultra-long-range aircraft for the most demanding international travelers.',
      avgRating: 4.95,
      totalReviews: 73,
      responseTimeHours: 1,
      instantBookingEnabled: true,
      aiOptimizedPricing: true,
      predictiveMaintenanceEnabled: true,
      smartRoutingEnabled: true,
      blockchainVerified: true,
      blockchainAddress: '0x9abc...ijkl',
      carbonOffsetProgram: true,
      safPercentage: 40.0
    }
  ];

  for (const operator of operators) {
    await prisma.operator.create({ data: operator });
  }
  
  console.log(`✅ Created ${operators.length} operators`);
  return operators;
}

async function seedAircraft(operators: any[]) {
  console.log('✈️  Seeding aircraft...');
  
  const aircraftData = [
    // Light Jets
    {
      id: 'ACF_CJ3_001',
      registrationNumber: 'N123JV',
      model: 'Citation CJ3+',
      manufacturer: 'Cessna',
      category: 'Light Jet',
      subcategory: 'Light Jet',
      yearOfManufacture: 2019,
      maxPassengers: 7,
      cruiseSpeed: 478,
      range: 2040,
      hourlyRate: 3500.00,
      operatorId: 'OP_JVC_001',
      operatorName: 'JetVision Charter',
      baseAirport: 'KTEB',
      amenities: ['WiFi', 'Refreshment Center', 'Lavatory', 'Baggage Compartment'],
      images: ['/images/cj3plus.jpg'],
      certifications: ['ARGUS Gold', 'IS-BAO Stage 2'],
      wifiAvailable: true,
      petFriendly: true,
      smokingAllowed: false,
      avgRating: 4.7,
      totalFlights: 342,
      lastMaintenanceDate: new Date('2024-01-15'),
      nextMaintenanceDate: new Date('2024-04-15'),
      dynamicPricingEnabled: true,
      currentDynamicRate: 3850.00,
      realTimeLocation: generateGPSCoordinates('KTEB'),
      fuelLevel: 85.5,
      fuelEfficiencyRating: 'B+',
      carbonFootprintPerHour: 2.1
    },
    {
      id: 'ACF_P300_002',
      registrationNumber: 'N456JV',
      model: 'Phenom 300E',
      manufacturer: 'Embraer',
      category: 'Light Jet',
      subcategory: 'Light Jet',
      yearOfManufacture: 2021,
      maxPassengers: 8,
      cruiseSpeed: 521,
      range: 2010,
      hourlyRate: 3800.00,
      operatorId: 'OP_JVC_001',
      operatorName: 'JetVision Charter',
      baseAirport: 'KJFK',
      amenities: ['WiFi', 'Entertainment System', 'Refreshment Center', 'Lavatory'],
      images: ['/images/phenom300e.jpg'],
      certifications: ['ARGUS Gold', 'Wyvern Wingman'],
      wifiAvailable: true,
      petFriendly: true,
      smokingAllowed: false,
      avgRating: 4.8,
      totalFlights: 198,
      lastMaintenanceDate: new Date('2024-02-01'),
      nextMaintenanceDate: new Date('2024-05-01'),
      dynamicPricingEnabled: true,
      currentDynamicRate: 4100.00,
      realTimeLocation: generateGPSCoordinates('KJFK'),
      fuelLevel: 92.3,
      fuelEfficiencyRating: 'A-',
      carbonFootprintPerHour: 1.9
    },
    // Midsize Jets
    {
      id: 'ACF_XLS_003',
      registrationNumber: 'N789JV',
      model: 'Citation XLS+',
      manufacturer: 'Cessna',
      category: 'Midsize Jet',
      subcategory: 'Mid-Size Jet',
      yearOfManufacture: 2018,
      maxPassengers: 9,
      cruiseSpeed: 507,
      range: 2100,
      hourlyRate: 4500.00,
      operatorId: 'OP_EA_002',
      operatorName: 'Elite Aviation',
      baseAirport: 'KLAS',
      amenities: ['WiFi', 'Full Galley', 'Entertainment System', 'Lavatory'],
      images: ['/images/xlsplus.jpg'],
      certifications: ['ARGUS Platinum', 'IS-BAO Stage 3'],
      wifiAvailable: true,
      petFriendly: true,
      smokingAllowed: false,
      avgRating: 4.6,
      totalFlights: 287,
      lastMaintenanceDate: new Date('2024-01-20'),
      nextMaintenanceDate: new Date('2024-04-20'),
      dynamicPricingEnabled: false,
      realTimeLocation: generateGPSCoordinates('KLAS'),
      fuelLevel: 78.1,
      fuelEfficiencyRating: 'B',
      carbonFootprintPerHour: 2.4
    },
    // Add more aircraft types...
  ];

  // Generate additional aircraft variations
  const allAircraft = [];
  for (let i = 0; i < 25; i++) {
    const baseAircraft = aircraftData[i % aircraftData.length];
    const aircraft = {
      ...baseAircraft,
      id: generateId('ACF'),
      registrationNumber: `N${Math.floor(Math.random() * 999)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      operatorId: operators[Math.floor(Math.random() * operators.length)].id,
      operatorName: operators[Math.floor(Math.random() * operators.length)].name,
      baseAirport: MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)],
      avgRating: 4.0 + Math.random() * 1.0,
      totalFlights: Math.floor(Math.random() * 500) + 50,
      lastMaintenanceDate: addDays(new Date(), -Math.floor(Math.random() * 90)),
      nextMaintenanceDate: addDays(new Date(), Math.floor(Math.random() * 90) + 30),
      realTimeLocation: generateGPSCoordinates(MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)]),
      fuelLevel: 50 + Math.random() * 50
    };
    allAircraft.push(aircraft);
  }

  for (const aircraft of allAircraft) {
    await prisma.aircraft.create({ data: aircraft });
  }
  
  console.log(`✅ Created ${allAircraft.length} aircraft`);
  return allAircraft;
}

async function seedCustomersAndBookings(aircraft: any[], operators: any[]) {
  console.log('👥 Seeding customers and bookings...');
  
  const bookings = [];
  
  // Generate 30 diverse customers with bookings
  for (let i = 0; i < 30; i++) {
    const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const customerType = CUSTOMER_TYPES[Math.floor(Math.random() * CUSTOMER_TYPES.length)];
    const company = customerType === 'Corporate' ? COMPANIES[Math.floor(Math.random() * COMPANIES.length)] : null;
    
    // Create customer profile
    const customer = {
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${company ? company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/gi, '') + '.com' : 'gmail.com'}`,
      phone: `+1-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
      company: company,
      customerType: customerType,
      preferences: {
        aircraftTypes: AMENITY_PREFERENCES.slice(Math.floor(Math.random() * 5)),
        dietaryRestrictions: Math.random() > 0.7 ? [DIETARY_RESTRICTIONS[Math.floor(Math.random() * DIETARY_RESTRICTIONS.length)]] : [],
        communicationPreference: ['email', 'sms'][Math.floor(Math.random() * 2)]
      }
    };
    
    // Create 1-3 bookings per customer
    const numBookings = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numBookings; j++) {
      const selectedAircraft = aircraft[Math.floor(Math.random() * aircraft.length)];
      const selectedOperator = operators.find(op => op.id === selectedAircraft.operatorId);
      
      const departureAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
      const arrivalAirport = MAJOR_AIRPORTS.filter(ap => ap !== departureAirport)[Math.floor(Math.random() * (MAJOR_AIRPORTS.length - 1))];
      
      const isRoundTrip = Math.random() > 0.6;
      const departureDate = addDays(new Date(), Math.floor(Math.random() * 60) - 30); // -30 to +30 days
      const returnDate = isRoundTrip ? addDays(departureDate, Math.floor(Math.random() * 7) + 1) : null;
      
      const flightTime = 2 + Math.random() * 6; // 2-8 hours
      const totalPrice = selectedAircraft.hourlyRate * flightTime * (isRoundTrip ? 1.9 : 1) + Math.random() * 5000;
      
      const booking = {
        id: generateId('BK'),
        aircraftId: selectedAircraft.id,
        operatorId: selectedOperator.id,
        status: BOOKING_STATUSES[Math.floor(Math.random() * BOOKING_STATUSES.length)],
        totalPrice: Math.round(totalPrice),
        currency: 'USD',
        paymentStatus: PAYMENT_STATUSES[Math.floor(Math.random() * PAYMENT_STATUSES.length)],
        paymentMethod: ['CreditCard', 'BankTransfer', 'Cryptocurrency'][Math.floor(Math.random() * 3)],
        depositAmount: Math.round(totalPrice * 0.5),
        balanceAmount: Math.round(totalPrice * 0.5),
        depositDueDate: addDays(departureDate, -14),
        balanceDueDate: addDays(departureDate, -7),
        confirmationCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
        qrCode: `qr-${generateId('QR')}`,
        digitalWallet: Math.random() > 0.5,
        realTimeUpdates: true,
        updatePreferences: {
          sms: true,
          email: true,
          push: Math.random() > 0.3
        },
        passengerInfo: {
          primaryContact: customer,
          passengers: [{
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            dateOfBirth: new Date(1970 + Math.floor(Math.random() * 40), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
            passportNumber: `P${Math.random().toString().slice(2, 10)}`
          }]
        },
        specialRequests: Math.random() > 0.7 ? 'Ground transportation and catering required' : null,
        dietaryRestrictions: customer.preferences.dietaryRestrictions.length > 0 ? customer.preferences.dietaryRestrictions : null,
        accessibilityNeeds: Math.random() > 0.9 ? ['Wheelchair assistance'] : null,
        travelInsurance: Math.random() > 0.6,
        cancelProtection: Math.random() > 0.4,
        weatherProtection: Math.random() > 0.7
      };
      
      bookings.push(booking);
    }
  }

  // Create bookings in database
  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }
  
  console.log(`✅ Created ${bookings.length} bookings with customers`);
  return bookings;
}

async function seedFlightOperations(aircraft: any[], bookings: any[]) {
  console.log('🛫 Seeding flight operations data...');
  
  const flightLegs = [];
  
  // Create flight legs for each booking
  for (const booking of bookings) {
    const selectedAircraft = aircraft.find(ac => ac.id === booking.aircraftId);
    if (!selectedAircraft) continue;
    
    // Create outbound flight leg
    const departureAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    const arrivalAirport = MAJOR_AIRPORTS.filter(ap => ap !== departureAirport)[Math.floor(Math.random() * (MAJOR_AIRPORTS.length - 1))];
    
    const departureDate = addDays(new Date(), Math.floor(Math.random() * 60) - 30);
    const departureTime = addHours(new Date(departureDate), Math.floor(Math.random() * 12) + 8);
    const flightTime = 2 + Math.random() * 6;
    const arrivalTime = addHours(departureTime, flightTime);
    
    const outboundLeg = {
      id: generateId('FL'),
      aircraftId: selectedAircraft.id,
      departureAirport,
      arrivalAirport,
      departureDate: departureDate.toISOString().split('T')[0],
      departureTime: departureTime.toISOString().split('T')[1].slice(0, 5),
      arrivalDate: arrivalTime.toISOString().split('T')[0],
      arrivalTime: arrivalTime.toISOString().split('T')[1].slice(0, 5),
      flightTime: Math.round(flightTime * 100) / 100,
      distance: Math.floor(flightTime * selectedAircraft.cruiseSpeed * 0.8), // Estimate distance
      status: FLIGHT_STATUSES[Math.floor(Math.random() * FLIGHT_STATUSES.length)],
      price: Math.round(selectedAircraft.hourlyRate * flightTime),
      currency: 'USD',
      type: 'Charter',
      dynamicPricing: Math.random() > 0.5,
      instantBooking: Math.random() > 0.3,
      specialOffers: Math.random() > 0.8 ? { discount: 0.1, reason: 'Early booking discount' } : null,
      weatherAlerts: Math.random() > 0.9 ? [{ type: 'turbulence', severity: 'moderate' }] : null,
      demandScore: Math.random(),
      priceOptimized: Math.random() > 0.5
    };
    
    flightLegs.push(outboundLeg);
    
    // Create return leg if round trip (30% chance)
    if (Math.random() > 0.7) {
      const returnDate = addDays(new Date(departureDate), Math.floor(Math.random() * 7) + 1);
      const returnDepartureTime = addHours(new Date(returnDate), Math.floor(Math.random() * 12) + 8);
      const returnArrivalTime = addHours(returnDepartureTime, flightTime);
      
      const returnLeg = {
        ...outboundLeg,
        id: generateId('FL'),
        departureAirport: arrivalAirport,
        arrivalAirport: departureAirport,
        departureDate: returnDate.toISOString().split('T')[0],
        departureTime: returnDepartureTime.toISOString().split('T')[1].slice(0, 5),
        arrivalDate: returnArrivalTime.toISOString().split('T')[0],
        arrivalTime: returnArrivalTime.toISOString().split('T')[1].slice(0, 5),
      };
      
      flightLegs.push(returnLeg);
    }
  }
  
  // Add some empty legs (positioning flights)
  for (let i = 0; i < 15; i++) {
    const selectedAircraft = aircraft[Math.floor(Math.random() * aircraft.length)];
    const departureAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    const arrivalAirport = MAJOR_AIRPORTS.filter(ap => ap !== departureAirport)[Math.floor(Math.random() * (MAJOR_AIRPORTS.length - 1))];
    
    const departureDate = addDays(new Date(), Math.floor(Math.random() * 30) + 1);
    const departureTime = addHours(new Date(departureDate), Math.floor(Math.random() * 12) + 8);
    const flightTime = 2 + Math.random() * 6;
    const arrivalTime = addHours(departureTime, flightTime);
    
    const emptyLeg = {
      id: generateId('EL'),
      aircraftId: selectedAircraft.id,
      departureAirport,
      arrivalAirport,
      departureDate: departureDate.toISOString().split('T')[0],
      departureTime: departureTime.toISOString().split('T')[1].slice(0, 5),
      arrivalDate: arrivalTime.toISOString().split('T')[0],
      arrivalTime: arrivalTime.toISOString().split('T')[1].slice(0, 5),
      flightTime: Math.round(flightTime * 100) / 100,
      distance: Math.floor(flightTime * selectedAircraft.cruiseSpeed * 0.8),
      status: 'Available',
      price: Math.round(selectedAircraft.hourlyRate * flightTime * 0.6), // Empty legs at discount
      currency: 'USD',
      type: 'EmptyLeg',
      dynamicPricing: true,
      instantBooking: true,
      specialOffers: { discount: 0.4, reason: 'Empty leg special pricing' },
      demandScore: Math.random() * 0.3, // Lower demand for empty legs
      priceOptimized: true
    };
    
    flightLegs.push(emptyLeg);
  }
  
  // Create flight legs in database
  for (const leg of flightLegs) {
    await prisma.flightLeg.create({ data: leg });
  }
  
  console.log(`✅ Created ${flightLegs.length} flight legs`);
  return flightLegs;
}

async function seedTransactionsAndPayments(bookings: any[]) {
  console.log('💳 Seeding transactions and payment data...');
  
  const transactions = [];
  
  for (const booking of bookings) {
    // Create deposit transaction
    if (booking.paymentStatus !== 'Pending') {
      const depositTx = {
        id: generateId('TXN'),
        bookingId: booking.id,
        transactionType: 'Payment',
        amount: booking.depositAmount,
        currency: 'USD',
        status: 'Completed',
        paymentMethod: booking.paymentMethod,
        processorName: booking.paymentMethod === 'CreditCard' ? 'Stripe' : booking.paymentMethod === 'BankTransfer' ? 'Plaid' : 'Coinbase',
        processorTransactionId: `${booking.paymentMethod.toLowerCase()}_${Math.random().toString(36).slice(2, 15)}`,
        processorFee: Math.round(booking.depositAmount * 0.029 + 30), // Typical payment processing fee
        blockchainTxHash: booking.paymentMethod === 'Cryptocurrency' ? `0x${Math.random().toString(16).slice(2, 66)}` : null,
        riskScore: Math.floor(Math.random() * 30), // Low risk scores
        fraudFlags: Math.random() > 0.95 ? ['unusual_amount'] : [],
        description: `Deposit payment for booking ${booking.confirmationCode}`,
        customerReference: booking.confirmationCode,
        merchantReference: `AVINODE-${booking.id}`,
        initiatedDate: addDays(new Date(), -Math.floor(Math.random() * 30)),
        completedDate: addDays(new Date(), -Math.floor(Math.random() * 28))
      };
      
      transactions.push(depositTx);
      
      // Create balance payment if fully paid
      if (booking.paymentStatus === 'FullyPaid') {
        const balanceTx = {
          ...depositTx,
          id: generateId('TXN'),
          transactionType: 'Payment',
          amount: booking.balanceAmount,
          processorTransactionId: `${booking.paymentMethod.toLowerCase()}_${Math.random().toString(36).slice(2, 15)}`,
          processorFee: Math.round(booking.balanceAmount * 0.029 + 30),
          blockchainTxHash: booking.paymentMethod === 'Cryptocurrency' ? `0x${Math.random().toString(16).slice(2, 66)}` : null,
          description: `Balance payment for booking ${booking.confirmationCode}`,
          initiatedDate: addDays(new Date(), -Math.floor(Math.random() * 14)),
          completedDate: addDays(new Date(), -Math.floor(Math.random() * 12))
        };
        
        transactions.push(balanceTx);
      }
    }
    
    // Add some refunds (5% of bookings)
    if (Math.random() < 0.05 && booking.status === 'Cancelled') {
      const refundTx = {
        id: generateId('TXN'),
        bookingId: booking.id,
        transactionType: 'Refund',
        amount: -booking.totalPrice * 0.8, // 80% refund after fees
        currency: 'USD',
        status: 'Completed',
        paymentMethod: booking.paymentMethod,
        processorName: booking.paymentMethod === 'CreditCard' ? 'Stripe' : booking.paymentMethod === 'BankTransfer' ? 'Plaid' : 'Coinbase',
        processorTransactionId: `refund_${Math.random().toString(36).slice(2, 15)}`,
        processorFee: 0,
        riskScore: 0,
        fraudFlags: [],
        description: `Refund for cancelled booking ${booking.confirmationCode}`,
        customerReference: booking.confirmationCode,
        merchantReference: `AVINODE-REFUND-${booking.id}`,
        initiatedDate: addDays(new Date(), -Math.floor(Math.random() * 7)),
        completedDate: addDays(new Date(), -Math.floor(Math.random() * 5))
      };
      
      transactions.push(refundTx);
    }
  }
  
  // Create transactions in database
  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }
  
  console.log(`✅ Created ${transactions.length} transactions`);
  return transactions;
}

async function seedMaintenanceRecords(aircraft: any[]) {
  console.log('🔧 Seeding maintenance records...');
  
  const maintenanceRecords = [];
  const maintenanceTypes = ['Routine', 'Progressive', 'AOG', 'Compliance', 'Scheduled', 'Unscheduled'];
  
  for (const aircraftUnit of aircraft) {
    // Create 2-5 maintenance records per aircraft
    const numRecords = Math.floor(Math.random() * 4) + 2;
    
    for (let i = 0; i < numRecords; i++) {
      const maintenanceType = maintenanceTypes[Math.floor(Math.random() * maintenanceTypes.length)];
      const scheduledDate = addDays(new Date(), -(Math.floor(Math.random() * 365) + 30)); // Last year
      const completedDate = maintenanceType !== 'Scheduled' ? addDays(scheduledDate, Math.floor(Math.random() * 5)) : null;
      
      const record = {
        id: generateId('MR'),
        aircraftId: aircraftUnit.id,
        maintenanceType,
        description: `${maintenanceType} maintenance - ${[
          'Engine inspection', 'Avionics update', 'Interior refurbishment', 'Landing gear service',
          'Hydraulic system check', 'Navigation system calibration', 'Safety equipment inspection'
        ][Math.floor(Math.random() * 7)]}`,
        scheduledDate,
        completedDate,
        cost: completedDate ? Math.floor(Math.random() * 50000) + 5000 : null,
        currency: 'USD',
        facility: [
          'JetCenter Dallas', 'Signature Flight Support', 'Atlantic Aviation', 'Million Air',
          'Ross Aviation', 'Landmark Aviation', 'Sheltair Aviation'
        ][Math.floor(Math.random() * 7)],
        technician: `Tech-${Math.floor(Math.random() * 100) + 1}`,
        workOrders: [`WO-${Math.random().toString().slice(2, 8)}`],
        hoursAtMaintenance: aircraftUnit.totalFlights * (2 + Math.random() * 3), // 2-5 hours per flight
        cyclesAtMaintenance: aircraftUnit.totalFlights,
        predictionAccuracy: Math.random() > 0.3 ? 0.7 + Math.random() * 0.3 : null // 70-100% accuracy when available
      };
      
      maintenanceRecords.push(record);
    }
  }
  
  // Create maintenance records in database
  for (const record of maintenanceRecords) {
    await prisma.maintenanceRecord.create({ data: record });
  }
  
  console.log(`✅ Created ${maintenanceRecords.length} maintenance records`);
  return maintenanceRecords;
}

async function seedReviews(aircraft: any[], operators: any[], bookings: any[]) {
  console.log('⭐ Seeding reviews and ratings...');
  
  const operatorReviews = [];
  const aircraftReviews = [];
  
  // Create operator reviews (30% of bookings get reviews)
  for (const booking of bookings) {
    if (Math.random() < 0.3 && booking.status === 'Completed') {
      const rating = Math.floor(Math.random() * 2) + 4; // 4-5 star ratings mostly
      const passengerName = booking.passengerInfo.primaryContact.name;
      const passengerEmail = booking.passengerInfo.primaryContact.email;
      
      const operatorReview = {
        id: generateId('OR'),
        operatorId: booking.operatorId,
        bookingId: booking.id,
        customerName: passengerName,
        customerEmail: passengerEmail,
        rating,
        title: [
          'Excellent service', 'Outstanding experience', 'Highly recommended', 'Professional operation',
          'Great crew and aircraft', 'Smooth flight', 'Will book again', 'Top-tier service'
        ][Math.floor(Math.random() * 8)],
        review: [
          'The crew was professional and the aircraft was immaculate. Highly recommend for business travel.',
          'Exceptional service from booking to landing. The team went above and beyond our expectations.',
          'Smooth flight, comfortable cabin, and excellent customer service throughout.',
          'Professional operation with attention to detail. Will definitely use again.',
          'Outstanding experience. The aircraft was well-maintained and the crew was courteous.',
          'Perfect for our business trip. Everything was handled professionally and efficiently.'
        ][Math.floor(Math.random() * 6)],
        serviceRating: rating,
        communicationRating: Math.max(rating - 1, 1),
        valueRating: Math.max(rating - (Math.floor(Math.random() * 2)), 1),
        timelinessRating: rating,
        verifiedBooking: true,
        helpful: Math.floor(Math.random() * 15)
      };
      
      operatorReviews.push(operatorReview);
      
      // Create corresponding aircraft review
      const aircraftReview = {
        id: generateId('AR'),
        aircraftId: booking.aircraftId,
        bookingId: booking.id,
        customerName: passengerName,
        customerEmail: passengerEmail,
        rating: Math.max(rating - (Math.floor(Math.random() * 2)), 3),
        title: [
          'Comfortable flight', 'Well-maintained aircraft', 'Great cabin', 'Modern amenities',
          'Spacious interior', 'Clean and comfortable', 'Excellent aircraft', 'Perfect for our needs'
        ][Math.floor(Math.random() * 8)],
        review: [
          'The aircraft was in excellent condition with modern amenities.',
          'Comfortable seating and a clean, well-maintained cabin.',
          'Spacious interior with all the amenities we needed.',
          'Modern aircraft with reliable performance and comfort.',
          'Great cabin layout and comfortable seating for our group.'
        ][Math.floor(Math.random() * 5)],
        comfortRating: rating,
        cleanlinessRating: rating,
        amenitiesRating: Math.max(rating - 1, 1),
        verifiedBooking: true,
        helpful: Math.floor(Math.random() * 10)
      };
      
      aircraftReviews.push(aircraftReview);
    }
  }
  
  // Create reviews in database
  for (const review of operatorReviews) {
    await prisma.operatorReview.create({ data: review });
  }
  
  for (const review of aircraftReviews) {
    await prisma.aircraftReview.create({ data: review });
  }
  
  console.log(`✅ Created ${operatorReviews.length} operator reviews and ${aircraftReviews.length} aircraft reviews`);
  return { operatorReviews, aircraftReviews };
}

async function seedAnalyticsAndAI(aircraft: any[]) {
  console.log('🤖 Seeding analytics and AI data...');
  
  // Market Analytics
  const marketAnalytics = [];
  const regions = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'South America'];
  
  // Generate 90 days of market data
  for (let i = 0; i < 90; i++) {
    const date = addDays(new Date(), -i);
    
    for (const region of regions) {
      const analytics = {
        id: generateId('MA'),
        date,
        region,
        totalBookings: Math.floor(Math.random() * 100) + 50,
        totalRevenue: Math.floor(Math.random() * 1000000) + 500000,
        averagePrice: Math.floor(Math.random() * 20000) + 15000,
        utilizationRate: 0.6 + Math.random() * 0.3, // 60-90% utilization
        topRoutes: [
          { from: 'KJFK', to: 'KLAX', count: Math.floor(Math.random() * 20) + 5 },
          { from: 'KMIA', to: 'KTEB', count: Math.floor(Math.random() * 15) + 3 },
          { from: 'KLAS', to: 'KSFO', count: Math.floor(Math.random() * 12) + 2 }
        ],
        topAircraft: [
          { category: 'Light Jet', count: Math.floor(Math.random() * 30) + 10 },
          { category: 'Midsize Jet', count: Math.floor(Math.random() * 25) + 8 },
          { category: 'Heavy Jet', count: Math.floor(Math.random() * 15) + 5 }
        ],
        marketShare: 0.15 + Math.random() * 0.05, // 15-20% market share
        competitorPricing: {
          average: Math.floor(Math.random() * 25000) + 20000,
          median: Math.floor(Math.random() * 22000) + 18000
        }
      };
      
      marketAnalytics.push(analytics);
    }
  }
  
  // Price Predictions
  const pricePredictions = [];
  const popularRoutes = ['KJFK-KLAX', 'KMIA-KTEB', 'KLAS-KSFO', 'KORD-KDEN', 'KBOS-KMIA'];
  
  for (const aircraftUnit of aircraft.slice(0, 15)) { // Predictions for first 15 aircraft
    for (const route of popularRoutes) {
      const prediction = {
        id: generateId('PP'),
        aircraftId: aircraftUnit.id,
        route,
        predictedDate: addDays(new Date(), Math.floor(Math.random() * 30) + 1),
        predictedPrice: aircraftUnit.hourlyRate * (2 + Math.random() * 4), // 2-6 hour flights
        confidenceScore: 0.7 + Math.random() * 0.3,
        demandForecast: Math.random(),
        historicalPricing: {
          last30Days: Array.from({ length: 30 }, () => aircraftUnit.hourlyRate * (2 + Math.random() * 4)),
          yearOverYear: aircraftUnit.hourlyRate * 0.95 + Math.random() * aircraftUnit.hourlyRate * 0.1
        },
        seasonalFactors: {
          holiday: Math.random() > 0.8 ? 1.2 : 1.0,
          summer: Math.random() > 0.6 ? 1.1 : 1.0,
          winter: Math.random() > 0.7 ? 0.9 : 1.0
        },
        weatherFactors: {
          forecast: Math.random() > 0.8 ? 'stormy' : 'clear',
          impact: Math.random() * 0.1
        },
        eventFactors: Math.random() > 0.9 ? [{ event: 'Formula 1 Race', impact: 1.3 }] : [],
        modelVersion: '2.1',
        trainingAccuracy: 0.85 + Math.random() * 0.1
      };
      
      pricePredictions.push(prediction);
    }
  }
  
  // Demand Forecasts
  const demandForecasts = [];
  
  for (const route of popularRoutes) {
    for (let i = 1; i <= 14; i++) { // 14 days of forecasts
      const forecast = {
        id: generateId('DF'),
        route,
        forecastDate: addDays(new Date(), i),
        expectedBookings: Math.floor(Math.random() * 20) + 5,
        demandIntensity: Math.random(),
        peakHours: [9, 10, 11, 14, 15, 16].filter(() => Math.random() > 0.3),
        seasonality: 0.8 + Math.random() * 0.4, // 0.8 - 1.2 multiplier
        events: Math.random() > 0.9 ? [{ name: 'Business Conference', impact: 1.4 }] : null,
        economicIndicators: {
          gdp: 0.98 + Math.random() * 0.04,
          businessTravel: 0.95 + Math.random() * 0.1
        },
        actualBookings: i <= 7 ? Math.floor(Math.random() * 18) + 3 : null, // Only past week has actuals
        predictionAccuracy: i <= 7 ? 0.8 + Math.random() * 0.2 : null
      };
      
      demandForecasts.push(forecast);
    }
  }
  
  // Create analytics data in database
  for (const analytics of marketAnalytics) {
    await prisma.marketAnalytics.create({ data: analytics });
  }
  
  for (const prediction of pricePredictions) {
    await prisma.pricePrediction.create({ data: prediction });
  }
  
  for (const forecast of demandForecasts) {
    await prisma.demandForecast.create({ data: forecast });
  }
  
  console.log(`✅ Created ${marketAnalytics.length} market analytics, ${pricePredictions.length} price predictions, ${demandForecasts.length} demand forecasts`);
  return { marketAnalytics, pricePredictions, demandForecasts };
}

async function seedRealTimeFeatures(aircraft: any[], bookings: any[]) {
  console.log('⚡ Seeding real-time features...');
  
  // Real-time Alerts
  const alerts = [];
  const alertTypes = ['WeatherDelay', 'MaintenanceIssue', 'PriceChange', 'FlightUpdate', 'BookingConfirmation'];
  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];
  
  for (let i = 0; i < 25; i++) {
    const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const severity = severityLevels[Math.floor(Math.random() * severityLevels.length)];
    
    const alert = {
      id: generateId('AL'),
      alertType,
      severity,
      title: {
        WeatherDelay: 'Weather Delay Advisory',
        MaintenanceIssue: 'Maintenance Schedule Update',
        PriceChange: 'Dynamic Pricing Update',
        FlightUpdate: 'Flight Status Update',
        BookingConfirmation: 'Booking Confirmed'
      }[alertType],
      message: {
        WeatherDelay: `Weather conditions may impact flights in the ${MAJOR_AIRPORTS[Math.floor(Math.random() * 5)]} area. Monitor updates.`,
        MaintenanceIssue: `Aircraft ${aircraft[Math.floor(Math.random() * aircraft.length)].registrationNumber} scheduled for maintenance. Alternative options available.`,
        PriceChange: `Pricing updated for ${popularRoutes[Math.floor(Math.random() * popularRoutes.length)]} route due to demand changes.`,
        FlightUpdate: `Flight status updated to ${FLIGHT_STATUSES[Math.floor(Math.random() * FLIGHT_STATUSES.length)]}`,
        BookingConfirmation: 'Your booking has been confirmed. Check-in details will be sent 24 hours before departure.'
      }[alertType],
      affectedUsers: Math.random() > 0.7 ? ['all'] : [generateId('USER')],
      affectedBookings: alertType === 'FlightUpdate' ? [bookings[Math.floor(Math.random() * Math.min(bookings.length, 10))].id] : [],
      affectedAircraft: alertType === 'MaintenanceIssue' ? [aircraft[Math.floor(Math.random() * aircraft.length)].id] : [],
      affectedRoutes: alertType === 'WeatherDelay' ? [`${MAJOR_AIRPORTS[Math.floor(Math.random() * 10)]}-${MAJOR_AIRPORTS[Math.floor(Math.random() * 10)]}`] : [],
      isActive: Math.random() > 0.3,
      resolvedAt: Math.random() > 0.7 ? addHours(new Date(), -Math.floor(Math.random() * 48)) : null,
      sentViaEmail: true,
      sentViaSMS: Math.random() > 0.4,
      sentViaPush: Math.random() > 0.2
    };
    
    alerts.push(alert);
  }
  
  // Notification Preferences
  const notificationPrefs = [];
  
  for (let i = 0; i < 50; i++) {
    const userId = generateId('USER');
    const pref = {
      id: generateId('NP'),
      userId,
      emailEnabled: Math.random() > 0.1, // 90% enable email
      smsEnabled: Math.random() > 0.4, // 60% enable SMS
      pushEnabled: Math.random() > 0.2, // 80% enable push
      whatsappEnabled: Math.random() > 0.7, // 30% enable WhatsApp
      bookingUpdates: Math.random() > 0.05, // 95% want booking updates
      priceAlerts: Math.random() > 0.3, // 70% want price alerts
      weatherAlerts: Math.random() > 0.2, // 80% want weather alerts
      promotions: Math.random() > 0.6, // 40% want promotions
      email: `user${i}@example.com`,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      whatsappNumber: Math.random() > 0.7 ? `+1${Math.floor(Math.random() * 9000000000) + 1000000000}` : null
    };
    
    notificationPrefs.push(pref);
  }
  
  // Create real-time data in database
  for (const alert of alerts) {
    await prisma.realTimeAlert.create({ data: alert });
  }
  
  for (const pref of notificationPrefs) {
    await prisma.notificationPreference.create({ data: pref });
  }
  
  console.log(`✅ Created ${alerts.length} real-time alerts and ${notificationPrefs.length} notification preferences`);
  return { alerts, notificationPrefs };
}

async function seedUserBehaviorAnalytics() {
  console.log('📊 Seeding user behavior analytics...');
  
  const userSessions = [];
  const entryPoints = ['Search', 'Direct', 'Referral', 'Social', 'Email'];
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
    'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0'
  ];
  
  for (let i = 0; i < 200; i++) {
    const session = {
      id: generateId('UBA'),
      sessionId: generateId('SES'),
      userId: Math.random() > 0.6 ? generateId('USER') : null, // 40% logged in users
      entryPoint: entryPoints[Math.floor(Math.random() * entryPoints.length)],
      searchCriteria: Math.random() > 0.3 ? {
        departureAirport: MAJOR_AIRPORTS[Math.floor(Math.random() * 10)],
        arrivalAirport: MAJOR_AIRPORTS[Math.floor(Math.random() * 10)],
        passengers: Math.floor(Math.random() * 8) + 1,
        category: ['Light Jet', 'Midsize Jet', 'Heavy Jet'][Math.floor(Math.random() * 3)]
      } : null,
      viewedAircraft: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => generateId('ACF')),
      quotesRequested: Math.floor(Math.random() * 5),
      bookingCompleted: Math.random() > 0.85, // 15% conversion rate
      sessionDuration: Math.floor(Math.random() * 3600) + 300, // 5 minutes to 1 hour
      pageViews: Math.floor(Math.random() * 15) + 1,
      bounceRate: Math.random() > 0.7, // 30% bounce rate
      userAgent: userAgents[Math.floor(Math.random() * userAgents.length)],
      ipAddress: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      country: ['USA', 'Canada', 'UK', 'Germany', 'France', 'UAE', 'Japan'][Math.floor(Math.random() * 7)],
      city: ['New York', 'Los Angeles', 'London', 'Paris', 'Dubai', 'Tokyo', 'Toronto'][Math.floor(Math.random() * 7)]
    };
    
    userSessions.push(session);
  }
  
  // Create user behavior analytics in database
  for (const session of userSessions) {
    await prisma.userBehaviorAnalytics.create({ data: session });
  }
  
  console.log(`✅ Created ${userSessions.length} user behavior analytics records`);
  return userSessions;
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive database seeding...');
    console.log('⚠️  This will clear all existing data and create fresh seed data');
    
    // Clear existing data
    await clearExistingData();
    
    // Seed core data
    const operators = await seedOperators();
    const aircraft = await seedAircraft(operators);
    
    // Seed operational data
    const bookings = await seedCustomersAndBookings(aircraft, operators);
    const flightLegs = await seedFlightOperations(aircraft, bookings);
    
    // Seed financial data
    const transactions = await seedTransactionsAndPayments(bookings);
    const maintenanceRecords = await seedMaintenanceRecords(aircraft);
    
    // Seed customer experience data
    const reviews = await seedReviews(aircraft, operators, bookings);
    
    // Seed competitive advantage data
    const analyticsData = await seedAnalyticsAndAI(aircraft);
    const realTimeData = await seedRealTimeFeatures(aircraft, bookings);
    const behaviorData = await seedUserBehaviorAnalytics();
    
    console.log('\n🎉 Comprehensive seeding completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`   • ${operators.length} operators`);
    console.log(`   • ${aircraft.length} aircraft`);
    console.log(`   • ${bookings.length} bookings`);
    console.log(`   • ${flightLegs.length} flight legs`);
    console.log(`   • ${transactions.length} transactions`);
    console.log(`   • ${maintenanceRecords.length} maintenance records`);
    console.log(`   • ${reviews.operatorReviews.length} operator reviews`);
    console.log(`   • ${reviews.aircraftReviews.length} aircraft reviews`);
    console.log(`   • ${analyticsData.marketAnalytics.length} market analytics records`);
    console.log(`   • ${analyticsData.pricePredictions.length} price predictions`);
    console.log(`   • ${analyticsData.demandForecasts.length} demand forecasts`);
    console.log(`   • ${realTimeData.alerts.length} real-time alerts`);
    console.log(`   • ${realTimeData.notificationPrefs.length} notification preferences`);
    console.log(`   • ${behaviorData.length} user behavior records`);
    
    console.log('\n✅ Database is now fully populated with realistic operational data');
    console.log('🔗 All API endpoints should now return comprehensive test data');
    console.log('🎯 Ready for full aviation operations testing!');
    
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding script
if (require.main === module) {
  main()
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default main;