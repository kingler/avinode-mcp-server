/**
 * Supabase Configuration for Avinode MCP Server
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn('Supabase credentials not found. Database-backed mock data will not be available.');
}

// Create Supabase client with service role key for full access
export const supabase = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : null;

// Type definitions matching our database schema
export interface DbAircraft {
  id: string;
  registration_number: string;
  model: string;
  manufacturer: string;
  category: string;
  subcategory: string;
  year_of_manufacture: number;
  max_passengers: number;
  cruise_speed: number;
  range: number;
  hourly_rate: number;
  operator_id: string;
  operator_name: string;
  base_airport: string;
  availability: 'Available' | 'OnRequest' | 'Unavailable';
  amenities: string[];
  images: string[];
  certifications: string[];
  wifi_available: boolean;
  pet_friendly: boolean;
  smoking_allowed: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbOperator {
  id: string;
  name: string;
  certificate: string;
  established: number;
  headquarters: string;
  operating_bases: string[];
  fleet_size: number;
  safety_rating: string;
  insurance: string;
  certifications: string[];
  contact_email: string;
  contact_phone: string;
  website?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface DbFlightLeg {
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
  status: 'Available' | 'Booked' | 'InProgress' | 'Completed';
  price: number;
  currency: string;
  type: 'EmptyLeg' | 'Charter' | 'Positioning';
  departure_timestamp: string;
  arrival_timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface DbCharterRequest {
  id: string;
  aircraft_id: string;
  operator_id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  departure_time: string;
  return_date?: string;
  return_time?: string;
  passengers: number;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  company?: string;
  special_requests?: string;
  status: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled';
  departure_timestamp: string;
  return_timestamp?: string;
  created_at: string;
  updated_at: string;
}

export interface DbPricingQuote {
  id: string;
  request_id?: string;
  aircraft_id: string;
  total_price: number;
  currency: string;
  price_breakdown: {
    flightHours: number;
    hourlyRate: number;
    baseCost: number;
    fuelSurcharge: number;
    landingFees: number;
    handlingFees: number;
    catering: number;
    crewFees: number;
    overnightFees?: number;
    deicingFees?: number;
    taxes: number;
    discount?: number;
  };
  valid_until: string;
  terms: string[];
  cancellation_policy?: string;
  created_at: string;
  updated_at: string;
}

export interface DbBooking {
  id: string;
  quote_id?: string;
  aircraft_id: string;
  operator_id: string;
  status: 'Pending' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled';
  total_price: number;
  currency: string;
  payment_status: 'Pending' | 'DepositPaid' | 'FullyPaid' | 'Refunded';
  payment_method?: string;
  deposit_amount: number;
  balance_amount: number;
  deposit_due_date?: string;
  balance_due_date?: string;
  passenger_info: {
    name: string;
    email: string;
    phone: string;
    company?: string;
  };
  special_requests?: string;
  created_at: string;
  updated_at: string;
}

// Helper functions to convert database records to mock data interfaces
export function dbToMockAircraft(dbAircraft: DbAircraft) {
  return {
    id: dbAircraft.id,
    registrationNumber: dbAircraft.registration_number,
    model: dbAircraft.model,
    manufacturer: dbAircraft.manufacturer,
    category: dbAircraft.category,
    subcategory: dbAircraft.subcategory,
    yearOfManufacture: dbAircraft.year_of_manufacture,
    maxPassengers: dbAircraft.max_passengers,
    cruiseSpeed: dbAircraft.cruise_speed,
    range: dbAircraft.range,
    hourlyRate: dbAircraft.hourly_rate,
    operatorId: dbAircraft.operator_id,
    operatorName: dbAircraft.operator_name,
    baseAirport: dbAircraft.base_airport,
    availability: dbAircraft.availability,
    amenities: dbAircraft.amenities,
    images: dbAircraft.images,
    certifications: dbAircraft.certifications,
    wifiAvailable: dbAircraft.wifi_available,
    petFriendly: dbAircraft.pet_friendly,
    smokingAllowed: dbAircraft.smoking_allowed,
  };
}

export function dbToMockOperator(dbOperator: DbOperator) {
  return {
    id: dbOperator.id,
    name: dbOperator.name,
    certificate: dbOperator.certificate,
    established: dbOperator.established,
    headquarters: dbOperator.headquarters,
    operatingBases: dbOperator.operating_bases,
    fleetSize: dbOperator.fleet_size,
    safetyRating: dbOperator.safety_rating,
    insurance: dbOperator.insurance,
    certifications: dbOperator.certifications,
    contactEmail: dbOperator.contact_email,
    contactPhone: dbOperator.contact_phone,
    website: dbOperator.website || '',
    description: dbOperator.description || '',
  };
}

export function dbToMockFlightLeg(dbFlightLeg: DbFlightLeg) {
  return {
    id: dbFlightLeg.id,
    aircraftId: dbFlightLeg.aircraft_id,
    departureAirport: dbFlightLeg.departure_airport,
    arrivalAirport: dbFlightLeg.arrival_airport,
    departureDate: dbFlightLeg.departure_date,
    departureTime: dbFlightLeg.departure_time,
    arrivalDate: dbFlightLeg.arrival_date,
    arrivalTime: dbFlightLeg.arrival_time,
    flightTime: dbFlightLeg.flight_time,
    distance: dbFlightLeg.distance,
    status: dbFlightLeg.status,
    price: dbFlightLeg.price,
    currency: dbFlightLeg.currency,
    type: dbFlightLeg.type,
  };
}

export function dbToMockQuote(dbQuote: DbPricingQuote) {
  return {
    id: dbQuote.id,
    requestId: dbQuote.request_id || '',
    aircraftId: dbQuote.aircraft_id,
    totalPrice: dbQuote.total_price,
    currency: dbQuote.currency,
    priceBreakdown: dbQuote.price_breakdown,
    validUntil: dbQuote.valid_until,
    terms: dbQuote.terms,
    cancellationPolicy: dbQuote.cancellation_policy || '',
  };
}

export function dbToMockBooking(dbBooking: DbBooking) {
  return {
    id: dbBooking.id,
    quoteId: dbBooking.quote_id || '',
    aircraftId: dbBooking.aircraft_id,
    operatorId: dbBooking.operator_id,
    status: dbBooking.status,
    legs: [], // Flight legs would be populated separately
    totalPrice: dbBooking.total_price,
    currency: dbBooking.currency,
    paymentStatus: dbBooking.payment_status,
    paymentMethod: dbBooking.payment_method || '',
    depositAmount: dbBooking.deposit_amount,
    balanceAmount: dbBooking.balance_amount,
    depositDueDate: dbBooking.deposit_due_date || '',
    balanceDueDate: dbBooking.balance_due_date || '',
    passenger: dbBooking.passenger_info,
    specialRequests: dbBooking.special_requests,
    createdAt: dbBooking.created_at,
    updatedAt: dbBooking.updated_at,
  };
}

// Check if Supabase is configured and available
export function isSupabaseAvailable(): boolean {
  return supabase !== null;
}

// Test Supabase connection
export async function testSupabaseConnection(): Promise<boolean> {
  if (!supabase) return false;
  
  try {
    const { data, error } = await supabase
      .from('operators')
      .select('count', { count: 'exact' })
      .limit(1);
    
    return !error;
  } catch (error) {
    console.error('Supabase connection test failed:', error);
    return false;
  }
}