#!/usr/bin/env ts-node

/**
 * Comprehensive Database Seeding Script (Fixed)
 * Populates the aviation charter system with realistic operational data
 */

import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

// Generate unique IDs
const generateId = (prefix: string): string => `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Date utilities
const addDays = (date: Date, days: number): Date => new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
const addHours = (date: Date, hours: number): Date => new Date(date.getTime() + hours * 60 * 60 * 1000);

// Constants
const MAJOR_AIRPORTS = [
  'KJFK', 'KLAX', 'KORD', 'KATL', 'KDEN', 'KDFW', 'KSFO', 'KLAS', 'KMIA', 'KTEB',
  'KPBI', 'KBOS', 'KIAD', 'KPHX', 'KSEA', 'KMSP', 'KDTW', 'KBWI', 'KFLL', 'KTPA'
];

const POPULAR_ROUTES = ['KJFK-KLAX', 'KMIA-KTEB', 'KLAS-KSFO', 'KORD-KDEN', 'KBOS-KMIA'];

const BOOKING_STATUSES = ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled'] as const;
const PAYMENT_STATUSES = ['Pending', 'DepositPaid', 'FullyPaid', 'Refunded'] as const;
const FLIGHT_STATUSES = ['Available', 'Booked', 'InProgress', 'Completed'] as const;

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
      description: 'Premium charter operator specializing in East Coast operations.',
      avgRating: 4.8,
      totalReviews: 127,
      responseTimeHours: 2,
      instantBookingEnabled: true,
      aiOptimizedPricing: true,
      predictiveMaintenanceEnabled: true,
      smartRoutingEnabled: true,
      blockchainVerified: true,
      blockchainAddress: '0x1234abcd',
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
      certifications: ['ARGUS Platinum', 'IS-BAO Stage 3'],
      contactEmail: 'fly@eliteaviation.com',
      contactPhone: '+1-800-FLY-ELIT',
      website: 'www.eliteaviation.com',
      description: 'Leading charter operator with coast-to-coast coverage.',
      avgRating: 4.6,
      totalReviews: 89,
      responseTimeHours: 4,
      instantBookingEnabled: true,
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
      certifications: ['ARGUS Platinum', 'Wyvern Wingman'],
      contactEmail: 'info@prestigeair.com',
      contactPhone: '+1-888-PRESTIGE',
      website: 'www.prestigeair.com',
      description: 'West Coast premier charter operator.',
      avgRating: 4.9,
      totalReviews: 156,
      responseTimeHours: 1,
      instantBookingEnabled: true,
      aiOptimizedPricing: true,
      blockchainVerified: true,
      blockchainAddress: '0x5678efgh',
      carbonOffsetProgram: true,
      safPercentage: 25.0
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
      hourlyRate: new Decimal(3500.00),
      operatorId: 'OP_JVC_001',
      operatorName: 'JetVision Charter',
      baseAirport: 'KTEB',
      availability: 'Available' as const,
      amenities: ['WiFi', 'Refreshment Center', 'Lavatory'],
      images: ['/images/cj3plus.jpg'],
      certifications: ['ARGUS Gold'],
      wifiAvailable: true,
      petFriendly: true,
      smokingAllowed: false,
      avgRating: 4.7,
      totalFlights: 342,
      lastMaintenanceDate: new Date('2024-01-15'),
      nextMaintenanceDate: new Date('2024-04-15'),
      dynamicPricingEnabled: true,
      currentDynamicRate: new Decimal(3850.00),
      realTimeLocation: { latitude: 40.85, longitude: -74.06, altitude: 0, speed: 0 },
      fuelLevel: 85.5,
      fuelEfficiencyRating: 'B+',
      carbonFootprintPerHour: new Decimal(2.1)
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
      hourlyRate: new Decimal(3800.00),
      operatorId: 'OP_JVC_001',
      operatorName: 'JetVision Charter',
      baseAirport: 'KJFK',
      availability: 'Available' as const,
      amenities: ['WiFi', 'Entertainment System'],
      images: ['/images/phenom300e.jpg'],
      certifications: ['ARGUS Gold'],
      wifiAvailable: true,
      petFriendly: true,
      smokingAllowed: false,
      avgRating: 4.8,
      totalFlights: 198,
      lastMaintenanceDate: new Date('2024-02-01'),
      nextMaintenanceDate: new Date('2024-05-01'),
      realTimeLocation: { latitude: 40.64, longitude: -73.78, altitude: 0, speed: 0 },
      fuelLevel: 92.3,
      fuelEfficiencyRating: 'A-',
      carbonFootprintPerHour: new Decimal(1.9)
    },
    {
      id: 'ACF_XLS_003',
      registrationNumber: 'N789EA',
      model: 'Citation XLS+',
      manufacturer: 'Cessna',
      category: 'Midsize Jet',
      subcategory: 'Mid-Size Jet', 
      yearOfManufacture: 2018,
      maxPassengers: 9,
      cruiseSpeed: 507,
      range: 2100,
      hourlyRate: new Decimal(4500.00),
      operatorId: 'OP_EA_002',
      operatorName: 'Elite Aviation',
      baseAirport: 'KLAS',
      availability: 'Available' as const,
      amenities: ['WiFi', 'Full Galley'],
      images: ['/images/xlsplus.jpg'],
      certifications: ['ARGUS Platinum'],
      wifiAvailable: true,
      petFriendly: true,
      smokingAllowed: false,
      avgRating: 4.6,
      totalFlights: 287,
      lastMaintenanceDate: new Date('2024-01-20'),
      nextMaintenanceDate: new Date('2024-04-20'),
      realTimeLocation: { latitude: 36.08, longitude: -115.15, altitude: 0, speed: 0 },
      fuelLevel: 78.1,
      fuelEfficiencyRating: 'B',
      carbonFootprintPerHour: new Decimal(2.4)
    }
  ];

  for (const aircraft of aircraftData) {
    await prisma.aircraft.create({ data: aircraft });
  }
  
  console.log(`✅ Created ${aircraftData.length} aircraft`);
  return aircraftData;
}

async function seedBookings(aircraft: any[], operators: any[]) {
  console.log('📋 Seeding bookings...');
  
  const bookings = [];
  
  for (let i = 0; i < 10; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const selectedOperator = operators.find(op => op.id === selectedAircraft.operatorId);
    
    const totalPrice = 25000 + Math.random() * 50000;
    
    const booking = {
      id: generateId('BK'),
      aircraftId: selectedAircraft.id,
      operatorId: selectedOperator.id,
      status: BOOKING_STATUSES[Math.floor(Math.random() * BOOKING_STATUSES.length)],
      totalPrice: new Decimal(Math.round(totalPrice)),
      currency: 'USD',
      paymentStatus: PAYMENT_STATUSES[Math.floor(Math.random() * PAYMENT_STATUSES.length)],
      paymentMethod: 'CreditCard',
      depositAmount: new Decimal(Math.round(totalPrice * 0.5)),
      balanceAmount: new Decimal(Math.round(totalPrice * 0.5)),
      confirmationCode: Math.random().toString(36).substr(2, 6).toUpperCase(),
      realTimeUpdates: true,
      passengerInfo: {
        primaryContact: {
          name: 'John Smith',
          email: 'john.smith@example.com',
          phone: '+1-555-123-4567'
        }
      },
      travelInsurance: Math.random() > 0.5,
      cancelProtection: Math.random() > 0.5,
      weatherProtection: Math.random() > 0.5
    };
    
    bookings.push(booking);
  }

  for (const booking of bookings) {
    await prisma.booking.create({ data: booking });
  }
  
  console.log(`✅ Created ${bookings.length} bookings`);
  return bookings;
}

async function seedFlightLegs(aircraft: any[]) {
  console.log('🛫 Seeding flight legs...');
  
  const flightLegs = [];
  
  for (let i = 0; i < 15; i++) {
    const selectedAircraft = aircraft[i % aircraft.length];
    const departureAirport = MAJOR_AIRPORTS[Math.floor(Math.random() * MAJOR_AIRPORTS.length)];
    const arrivalAirport = MAJOR_AIRPORTS.filter(ap => ap !== departureAirport)[0];
    
    const departureDate = addDays(new Date(), Math.floor(Math.random() * 30) + 1);
    const departureTime = '09:00';
    const arrivalTime = '12:00';
    const flightTime = 3.0;
    
    const leg = {
      id: generateId('FL'),
      aircraftId: selectedAircraft.id,
      departureAirport,
      arrivalAirport, 
      departureDate: departureDate.toISOString().split('T')[0],
      departureTime,
      arrivalDate: departureDate.toISOString().split('T')[0],
      arrivalTime,
      flightTime: new Decimal(flightTime),
      distance: 1500,
      status: FLIGHT_STATUSES[Math.floor(Math.random() * FLIGHT_STATUSES.length)],
      price: new Decimal(15000),
      currency: 'USD',
      type: i < 10 ? 'Charter' as const : 'EmptyLeg' as const,
      dynamicPricing: Math.random() > 0.5,
      instantBooking: true,
      demandScore: Math.random(),
      priceOptimized: true
    };
    
    flightLegs.push(leg);
  }

  for (const leg of flightLegs) {
    await prisma.flightLeg.create({ data: leg });
  }
  
  console.log(`✅ Created ${flightLegs.length} flight legs`);
  return flightLegs;
}

async function seedTransactions(bookings: any[]) {
  console.log('💳 Seeding transactions...');
  
  const transactions = [];
  
  for (const booking of bookings.slice(0, 5)) {
    const transaction = {
      id: generateId('TXN'),
      bookingId: booking.id,
      transactionType: 'Payment',
      amount: booking.depositAmount,
      currency: 'USD',
      status: 'Completed',
      paymentMethod: 'CreditCard',
      processorName: 'Stripe',
      processorTransactionId: `stripe_${Math.random().toString(36).slice(2, 15)}`,
      processorFee: new Decimal(29.00),
      riskScore: 15,
      fraudFlags: [],
      description: `Deposit payment for booking ${booking.confirmationCode}`,
      customerReference: booking.confirmationCode,
      merchantReference: `AVINODE-${booking.id}`,
      initiatedDate: new Date(),
      completedDate: new Date()
    };
    
    transactions.push(transaction);
  }

  for (const transaction of transactions) {
    await prisma.transaction.create({ data: transaction });
  }
  
  console.log(`✅ Created ${transactions.length} transactions`);
  return transactions;
}

async function seedAnalytics() {
  console.log('📊 Seeding analytics data...');
  
  // Market Analytics
  const marketAnalytics = [];
  const regions = ['North America', 'Europe', 'Asia Pacific'];
  
  for (let i = 0; i < 10; i++) {
    const date = addDays(new Date(), -i);
    
    for (const region of regions) {
      const analytics = {
        id: generateId('MA'),
        date,
        region,
        totalBookings: Math.floor(Math.random() * 50) + 25,
        totalRevenue: new Decimal(Math.floor(Math.random() * 500000) + 250000),
        averagePrice: new Decimal(Math.floor(Math.random() * 10000) + 15000),
        utilizationRate: 0.6 + Math.random() * 0.3,
        topRoutes: [
          { from: 'KJFK', to: 'KLAX', count: 10 },
          { from: 'KMIA', to: 'KTEB', count: 8 }
        ],
        topAircraft: [
          { category: 'Light Jet', count: 15 },
          { category: 'Midsize Jet', count: 12 }
        ],
        marketShare: 0.18,
        competitorPricing: { average: 22000, median: 20000 }
      };
      
      marketAnalytics.push(analytics);
    }
  }

  for (const analytics of marketAnalytics) {
    await prisma.marketAnalytics.create({ data: analytics });
  }
  
  console.log(`✅ Created ${marketAnalytics.length} market analytics records`);
  return marketAnalytics;
}

async function seedRealTimeFeatures() {
  console.log('⚡ Seeding real-time features...');
  
  // Real-time Alerts
  const alerts = [];
  
  for (let i = 0; i < 5; i++) {
    const alert = {
      id: generateId('AL'),
      alertType: 'WeatherDelay',
      severity: 'Medium',
      title: 'Weather Delay Advisory',
      message: `Weather conditions may impact flights in the ${MAJOR_AIRPORTS[i]} area.`,
      affectedUsers: ['all'],
      affectedBookings: [],
      affectedAircraft: [],
      affectedRoutes: [`${MAJOR_AIRPORTS[i]}-${MAJOR_AIRPORTS[i + 1] || MAJOR_AIRPORTS[0]}`],
      isActive: true,
      sentViaEmail: true,
      sentViaSMS: false,
      sentViaPush: true
    };
    
    alerts.push(alert);
  }

  for (const alert of alerts) {
    await prisma.realTimeAlert.create({ data: alert });
  }
  
  // Notification Preferences
  const notificationPrefs = [];
  
  for (let i = 0; i < 10; i++) {
    const pref = {
      id: generateId('NP'),
      userId: generateId('USER'),
      emailEnabled: true,
      smsEnabled: Math.random() > 0.5,
      pushEnabled: true,
      bookingUpdates: true,
      priceAlerts: true,
      weatherAlerts: true,
      promotions: Math.random() > 0.5,
      email: `user${i}@example.com`,
      phone: `+1555123456${i}`
    };
    
    notificationPrefs.push(pref);
  }

  for (const pref of notificationPrefs) {
    await prisma.notificationPreference.create({ data: pref });
  }
  
  console.log(`✅ Created ${alerts.length} alerts and ${notificationPrefs.length} notification preferences`);
  return { alerts, notificationPrefs };
}

async function main() {
  try {
    console.log('🚀 Starting comprehensive database seeding...');
    
    // Clear existing data
    await clearExistingData();
    
    // Seed core data
    const operators = await seedOperators();
    const aircraft = await seedAircraft(operators);
    
    // Seed operational data
    const bookings = await seedBookings(aircraft, operators);
    const flightLegs = await seedFlightLegs(aircraft);
    
    // Seed financial data
    const transactions = await seedTransactions(bookings);
    
    // Seed analytics
    const analytics = await seedAnalytics();
    const realTimeData = await seedRealTimeFeatures();
    
    console.log('\n🎉 Comprehensive seeding completed successfully!');
    console.log('\n📈 Summary:');
    console.log(`   • ${operators.length} operators`);
    console.log(`   • ${aircraft.length} aircraft`);
    console.log(`   • ${bookings.length} bookings`);
    console.log(`   • ${flightLegs.length} flight legs`);
    console.log(`   • ${transactions.length} transactions`);
    console.log(`   • ${analytics.length} market analytics records`);
    console.log(`   • ${realTimeData.alerts.length} real-time alerts`);
    
    console.log('\n✅ Database is now populated with realistic operational data');
    
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