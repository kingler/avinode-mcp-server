/**
 * Avinode Mock Data Generator
 * Provides realistic mock data matching Avinode API specifications
 */

export interface Aircraft {
  id: string;
  registrationNumber: string;
  model: string;
  manufacturer: string;
  category: string;
  subcategory: string;
  yearOfManufacture: number;
  maxPassengers: number;
  cruiseSpeed: number;
  range: number;
  hourlyRate: number;
  operatorId: string;
  operatorName: string;
  baseAirport: string;
  availability: 'Available' | 'OnRequest' | 'Unavailable';
  amenities: string[];
  images: string[];
  certifications: string[];
  wifiAvailable: boolean;
  petFriendly: boolean;
  smokingAllowed: boolean;
}

export interface Operator {
  id: string;
  name: string;
  certificate: string;
  established: number;
  headquarters: string;
  operatingBases: string[];
  fleetSize: number;
  safetyRating: string;
  insurance: string;
  certifications: string[];
  contactEmail: string;
  contactPhone: string;
  website: string;
  description: string;
}

export interface FlightLeg {
  id: string;
  aircraftId: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  flightTime: number;
  distance: number;
  status: 'Available' | 'Booked' | 'InProgress' | 'Completed';
  price: number;
  currency: string;
  type: 'EmptyLeg' | 'Charter' | 'Positioning';
}

export interface Quote {
  id: string;
  requestId: string;
  aircraftId: string;
  totalPrice: number;
  currency: string;
  priceBreakdown: {
    flightHours: number;
    hourlyRate: number;
    baseCost: number;
    fuelSurcharge: number;
    landingFees: number;
    handlingFees: number;
    catering: number;
    crewFees: number;
    overnightFees: number;
    deicingFees: number;
    taxes: number;
    discount: number;
  };
  validUntil: string;
  terms: string[];
  cancellationPolicy: string;
}

export interface Booking {
  id: string;
  quoteId: string;
  aircraftId: string;
  operatorId: string;
  status: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled';
  legs: FlightLeg[];
  totalPrice: number;
  currency: string;
  paymentStatus: 'Pending' | 'DepositPaid' | 'FullyPaid' | 'Refunded';
  paymentMethod: string;
  depositAmount: number;
  balanceAmount: number;
  depositDueDate: string;
  balanceDueDate: string;
  passenger: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Mock Data Collections
 */
export const MOCK_AIRCRAFT: Aircraft[] = [
  // Light Jets
  {
    id: "ACF001",
    registrationNumber: "N123JV",
    model: "Citation CJ3+",
    manufacturer: "Cessna",
    category: "Light Jet",
    subcategory: "Light Jet",
    yearOfManufacture: 2019,
    maxPassengers: 7,
    cruiseSpeed: 478,
    range: 2040,
    hourlyRate: 3500,
    operatorId: "OP001",
    operatorName: "JetVision Charter",
    baseAirport: "KTEB",
    availability: "Available",
    amenities: ["WiFi", "Refreshment Center", "Lavatory", "Baggage Compartment"],
    images: ["/images/cj3plus.jpg"],
    certifications: ["ARGUS Gold", "IS-BAO Stage 2"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  },
  {
    id: "ACF002",
    registrationNumber: "N456JV",
    model: "Phenom 300E",
    manufacturer: "Embraer",
    category: "Light Jet",
    subcategory: "Light Jet",
    yearOfManufacture: 2021,
    maxPassengers: 8,
    cruiseSpeed: 521,
    range: 2010,
    hourlyRate: 3800,
    operatorId: "OP001",
    operatorName: "JetVision Charter",
    baseAirport: "KJFK",
    availability: "Available",
    amenities: ["WiFi", "Entertainment System", "Refreshment Center", "Lavatory"],
    images: ["/images/phenom300e.jpg"],
    certifications: ["ARGUS Gold", "Wyvern Wingman"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  },
  
  // Midsize Jets
  {
    id: "ACF003",
    registrationNumber: "N789JV",
    model: "Citation XLS+",
    manufacturer: "Cessna",
    category: "Midsize Jet",
    subcategory: "Mid-Size Jet",
    yearOfManufacture: 2018,
    maxPassengers: 9,
    cruiseSpeed: 507,
    range: 2100,
    hourlyRate: 4500,
    operatorId: "OP002",
    operatorName: "Elite Aviation",
    baseAirport: "KLAS",
    availability: "Available",
    amenities: ["WiFi", "Full Galley", "Entertainment System", "Lavatory"],
    images: ["/images/xlsplus.jpg"],
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  },
  {
    id: "ACF004",
    registrationNumber: "N321EA",
    model: "Hawker 900XP",
    manufacturer: "Beechcraft",
    category: "Midsize Jet",
    subcategory: "Mid-Size Jet",
    yearOfManufacture: 2017,
    maxPassengers: 8,
    cruiseSpeed: 514,
    range: 2900,
    hourlyRate: 5200,
    operatorId: "OP002",
    operatorName: "Elite Aviation",
    baseAirport: "KMIA",
    availability: "Available",
    amenities: ["WiFi", "Full Galley", "Entertainment System", "Lavatory", "Sleeping Configuration"],
    images: ["/images/hawker900xp.jpg"],
    certifications: ["ARGUS Gold", "Wyvern Wingman"],
    wifiAvailable: true,
    petFriendly: false,
    smokingAllowed: false
  },
  
  // Super Midsize Jets
  {
    id: "ACF005",
    registrationNumber: "N654PA",
    model: "Citation Sovereign+",
    manufacturer: "Cessna",
    category: "Super Midsize Jet",
    subcategory: "Super Mid-Size Jet",
    yearOfManufacture: 2020,
    maxPassengers: 12,
    cruiseSpeed: 527,
    range: 3200,
    hourlyRate: 6000,
    operatorId: "OP003",
    operatorName: "Prestige Air",
    baseAirport: "KLAX",
    availability: "Available",
    amenities: ["WiFi", "Full Galley", "Entertainment System", "Lavatory", "Conference Table"],
    images: ["/images/sovereign.jpg"],
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  },
  {
    id: "ACF006",
    registrationNumber: "N987PA",
    model: "Challenger 350",
    manufacturer: "Bombardier",
    category: "Super Midsize Jet",
    subcategory: "Super Mid-Size Jet",
    yearOfManufacture: 2021,
    maxPassengers: 10,
    cruiseSpeed: 541,
    range: 3500,
    hourlyRate: 6500,
    operatorId: "OP003",
    operatorName: "Prestige Air",
    baseAirport: "KORD",
    availability: "OnRequest",
    amenities: ["High-Speed WiFi", "Full Galley", "Entertainment System", "Lavatory", "Flat-Floor Cabin"],
    images: ["/images/challenger350.jpg"],
    certifications: ["ARGUS Platinum", "Wyvern Wingman"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  },
  
  // Heavy Jets
  {
    id: "ACF007",
    registrationNumber: "N111GJ",
    model: "Gulfstream G450",
    manufacturer: "Gulfstream",
    category: "Heavy Jet",
    subcategory: "Large Cabin",
    yearOfManufacture: 2019,
    maxPassengers: 14,
    cruiseSpeed: 561,
    range: 4350,
    hourlyRate: 8500,
    operatorId: "OP004",
    operatorName: "Global Jets",
    baseAirport: "KTEB",
    availability: "Available",
    amenities: ["High-Speed WiFi", "Full Galley", "Entertainment System", "Lavatory", "Sleeping Configuration", "Conference Area"],
    images: ["/images/g450.jpg"],
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  },
  {
    id: "ACF008",
    registrationNumber: "N222GJ",
    model: "Gulfstream G550",
    manufacturer: "Gulfstream",
    category: "Heavy Jet",
    subcategory: "Large Cabin",
    yearOfManufacture: 2020,
    maxPassengers: 16,
    cruiseSpeed: 585,
    range: 6750,
    hourlyRate: 9500,
    operatorId: "OP004",
    operatorName: "Global Jets",
    baseAirport: "KJFK",
    availability: "Available",
    amenities: ["High-Speed WiFi", "Full Galley", "Entertainment System", "Multiple Lavatories", "Sleeping Configuration", "Office Area"],
    images: ["/images/g550.jpg"],
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  },
  
  // Ultra Long Range
  {
    id: "ACF009",
    registrationNumber: "N333UL",
    model: "Global 7500",
    manufacturer: "Bombardier",
    category: "Ultra Long Range",
    subcategory: "Ultra Long Range",
    yearOfManufacture: 2022,
    maxPassengers: 19,
    cruiseSpeed: 590,
    range: 7700,
    hourlyRate: 12000,
    operatorId: "OP005",
    operatorName: "Luxury Wings",
    baseAirport: "KLAX",
    availability: "OnRequest",
    amenities: ["Ka-Band WiFi", "Full Galley", "Entertainment System", "Multiple Lavatories", "Master Suite", "Conference Room", "Crew Rest Area"],
    images: ["/images/global7500.jpg"],
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  },
  {
    id: "ACF010",
    registrationNumber: "N444UL",
    model: "Gulfstream G650ER",
    manufacturer: "Gulfstream",
    category: "Ultra Long Range",
    subcategory: "Ultra Long Range",
    yearOfManufacture: 2021,
    maxPassengers: 18,
    cruiseSpeed: 610,
    range: 7500,
    hourlyRate: 11500,
    operatorId: "OP005",
    operatorName: "Luxury Wings",
    baseAirport: "KMIA",
    availability: "Available",
    amenities: ["High-Speed WiFi", "Full Galley", "Entertainment System", "Multiple Lavatories", "Sleeping Quarters", "Office Area", "Shower"],
    images: ["/images/g650er.jpg"],
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3"],
    wifiAvailable: true,
    petFriendly: true,
    smokingAllowed: false
  }
];

export const MOCK_OPERATORS: Operator[] = [
  {
    id: "OP001",
    name: "JetVision Charter",
    certificate: "Part 135 (DOT-JVC123456)",
    established: 2010,
    headquarters: "Teterboro, NJ",
    operatingBases: ["KTEB", "KJFK", "KBOS", "KPBI"],
    fleetSize: 15,
    safetyRating: "ARGUS Gold",
    insurance: "$100M liability coverage",
    certifications: ["ARGUS Gold", "Wyvern Wingman", "IS-BAO Stage 2"],
    contactEmail: "charter@jetvision.aero",
    contactPhone: "+1-800-JET-VISI",
    website: "www.jetvision.aero",
    description: "Premium charter operator specializing in East Coast operations with a modern fleet and exceptional safety record."
  },
  {
    id: "OP002",
    name: "Elite Aviation",
    certificate: "Part 135 (DOT-EA789012)",
    established: 2005,
    headquarters: "Las Vegas, NV",
    operatingBases: ["KLAS", "KMIA", "KDAL", "KPHX"],
    fleetSize: 20,
    safetyRating: "ARGUS Platinum",
    insurance: "$150M liability coverage",
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3", "NBAA Certified"],
    contactEmail: "fly@eliteaviation.com",
    contactPhone: "+1-800-FLY-ELIT",
    website: "www.eliteaviation.com",
    description: "Leading charter operator with coast-to-coast coverage and specialization in casino and entertainment industry flights."
  },
  {
    id: "OP003",
    name: "Prestige Air",
    certificate: "Part 135 (DOT-PA345678)",
    established: 2008,
    headquarters: "Los Angeles, CA",
    operatingBases: ["KLAX", "KORD", "KSFO", "KDEN"],
    fleetSize: 25,
    safetyRating: "ARGUS Platinum",
    insurance: "$200M liability coverage",
    certifications: ["ARGUS Platinum", "Wyvern Wingman", "IS-BAO Stage 3"],
    contactEmail: "info@prestigeair.com",
    contactPhone: "+1-888-PRESTIGE",
    website: "www.prestigeair.com",
    description: "West Coast's premier charter operator offering super-midsize and large cabin aircraft for discerning travelers."
  },
  {
    id: "OP004",
    name: "Global Jets",
    certificate: "Part 135 (DOT-GJ901234)",
    established: 2003,
    headquarters: "New York, NY",
    operatingBases: ["KTEB", "KJFK", "KIAD", "KBOS", "EGLL", "LFPB"],
    fleetSize: 30,
    safetyRating: "ARGUS Platinum",
    insurance: "$300M liability coverage",
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3", "EASA Certified"],
    contactEmail: "charter@globaljets.aero",
    contactPhone: "+1-800-GLOBAL-J",
    website: "www.globaljets.aero",
    description: "International charter operator with transatlantic capabilities and a fleet of heavy jets for global travel."
  },
  {
    id: "OP005",
    name: "Luxury Wings",
    certificate: "Part 135 (DOT-LW567890)",
    established: 2015,
    headquarters: "Miami, FL",
    operatingBases: ["KMIA", "KLAX", "KTEB", "LFPB", "OMDB"],
    fleetSize: 10,
    safetyRating: "ARGUS Platinum",
    insurance: "$500M liability coverage",
    certifications: ["ARGUS Platinum", "IS-BAO Stage 3", "NBAA Certified"],
    contactEmail: "concierge@luxurywings.com",
    contactPhone: "+1-888-LUX-WING",
    website: "www.luxurywings.com",
    description: "Ultra-luxury charter operator specializing in ultra-long-range aircraft for the most demanding international travelers."
  }
];

export const MOCK_EMPTY_LEGS: FlightLeg[] = [
  {
    id: "LEG001",
    aircraftId: "ACF001",
    departureAirport: "KTEB",
    arrivalAirport: "KPBI",
    departureDate: "2024-03-20",
    departureTime: "10:00",
    arrivalDate: "2024-03-20",
    arrivalTime: "12:45",
    flightTime: 2.75,
    distance: 1065,
    status: "Available",
    price: 8500,
    currency: "USD",
    type: "EmptyLeg"
  },
  {
    id: "LEG002",
    aircraftId: "ACF007",
    departureAirport: "KLAX",
    arrivalAirport: "KJFK",
    departureDate: "2024-03-22",
    departureTime: "14:00",
    arrivalDate: "2024-03-22",
    arrivalTime: "22:00",
    flightTime: 5.0,
    distance: 2475,
    status: "Available",
    price: 25000,
    currency: "USD",
    type: "EmptyLeg"
  },
  {
    id: "LEG003",
    aircraftId: "ACF005",
    departureAirport: "KMIA",
    arrivalAirport: "KLAS",
    departureDate: "2024-03-25",
    departureTime: "09:00",
    arrivalDate: "2024-03-25",
    arrivalTime: "11:30",
    flightTime: 4.5,
    distance: 2174,
    status: "Available",
    price: 18000,
    currency: "USD",
    type: "EmptyLeg"
  }
];

/**
 * Mock Data Generator Functions
 */

export function generateFlightTime(departure: string, arrival: string): number {
  // Simplified flight time calculation based on common routes
  const routes: { [key: string]: number } = {
    "KJFK-KLAX": 5.5,
    "KLAX-KJFK": 5.0,
    "KTEB-KLAS": 5.0,
    "KLAS-KTEB": 4.5,
    "KJFK-EGLL": 7.5,
    "EGLL-KJFK": 8.0,
    "KMIA-KJFK": 2.75,
    "KJFK-KMIA": 2.5,
    "KLAX-KLAS": 1.0,
    "KLAS-KLAX": 1.0,
    "KTEB-KPBI": 2.75,
    "KPBI-KTEB": 2.5,
    "KORD-KLAX": 4.0,
    "KLAX-KORD": 3.75,
    "KJFK-KBOS": 1.0,
    "KBOS-KJFK": 1.0,
    "KDAL-KATL": 2.0,
    "KATL-KDAL": 2.0,
    "KSFO-KLAX": 1.5,
    "KLAX-KSFO": 1.5,
    "KDEN-KPHX": 1.75,
    "KPHX-KDEN": 2.0,
    "KMIA-KLAS": 4.5,
    "KLAS-KMIA": 4.0,
    "KTEB-KMIA": 2.75,
    "KMIA-KTEB": 2.5
  };
  
  const routeKey = `${departure}-${arrival}`;
  return routes[routeKey] || 3.5; // Default flight time
}

export function calculatePricing(
  aircraft: Aircraft,
  flightTime: number,
  isRoundTrip: boolean = false,
  includeAllFees: boolean = true
): Quote["priceBreakdown"] {
  const baseCost = aircraft.hourlyRate * flightTime;
  const multiplier = isRoundTrip ? 1.9 : 1.0; // Round trip discount
  
  const breakdown = {
    flightHours: flightTime * (isRoundTrip ? 2 : 1),
    hourlyRate: aircraft.hourlyRate,
    baseCost: baseCost * multiplier,
    fuelSurcharge: baseCost * 0.075 * multiplier,
    landingFees: 1200 * (isRoundTrip ? 2 : 1),
    handlingFees: 800 * (isRoundTrip ? 2 : 1),
    catering: aircraft.maxPassengers * 150 * (isRoundTrip ? 2 : 1),
    crewFees: 1500 * (isRoundTrip ? 2 : 1),
    overnightFees: isRoundTrip ? 2500 : 0,
    deicingFees: 0, // Seasonal
    taxes: 0, // Calculated separately
    discount: isRoundTrip ? baseCost * 0.1 : 0
  };
  
  // Calculate taxes
  const subtotal = Object.values(breakdown).reduce((a, b) => a + b, 0) - breakdown.taxes;
  breakdown.taxes = subtotal * 0.08;
  
  return includeAllFees ? breakdown : {
    ...breakdown,
    fuelSurcharge: 0,
    landingFees: 0,
    handlingFees: 0,
    catering: 0,
    crewFees: 0,
    overnightFees: 0,
    deicingFees: 0
  };
}

export function filterAircraftByRequirements(
  aircraft: Aircraft[],
  requirements: {
    departureAirport?: string;
    arrivalAirport?: string;
    passengers: number;
    category?: string;
    maxPrice?: number;
    petFriendly?: boolean;
    wifiRequired?: boolean;
  }
): Aircraft[] {
  let filtered = [...aircraft];
  
  // Filter by passenger capacity
  filtered = filtered.filter(a => a.maxPassengers >= requirements.passengers);
  
  // Filter by category if specified
  if (requirements.category) {
    filtered = filtered.filter(a => 
      a.category === requirements.category || 
      a.subcategory === requirements.category
    );
  }
  
  // Filter by max price if specified
  if (requirements.maxPrice !== undefined) {
    const maxPrice = requirements.maxPrice;
    filtered = filtered.filter(a => a.hourlyRate <= maxPrice);
  }
  
  // Filter by pet-friendly if required
  if (requirements.petFriendly) {
    filtered = filtered.filter(a => a.petFriendly);
  }
  
  // Filter by WiFi if required
  if (requirements.wifiRequired) {
    filtered = filtered.filter(a => a.wifiAvailable);
  }
  
  // Sort by hourly rate (ascending)
  filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
  
  return filtered;
}

export function generateBookingId(): string {
  return `BK${Date.now().toString().slice(-8)}`;
}

export function generateQuoteId(): string {
  return `QT${Date.now().toString().slice(-8)}`;
}

export function generateRequestId(): string {
  return `REQ${Date.now().toString().slice(-8)}`;
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}