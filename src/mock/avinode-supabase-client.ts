/**
 * Avinode Supabase Mock Client
 * Provides mock data from Supabase database instead of in-memory arrays
 */

import { supabase, isSupabaseAvailable, testSupabaseConnection, dbToMockAircraft, dbToMockOperator, dbToMockFlightLeg, dbToMockQuote, dbToMockBooking, DbAircraft, DbOperator, DbFlightLeg, DbPricingQuote, DbBooking } from '../lib/supabase';
import { Aircraft, Operator, FlightLeg, Quote, Booking, generateBookingId, generateQuoteId, formatCurrency, calculateFlightTime } from './avinode-mock-data';

interface SearchAircraftRequest {
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  aircraftCategory?: string;
  maxPrice?: number;
  petFriendly?: boolean;
  wifiRequired?: boolean;
}

interface CreateCharterRequestData {
  aircraftId: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  passengers: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  company?: string;
  specialRequests?: string;
}

interface GetPricingRequest {
  aircraftId: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime?: string;
  returnDate?: string;
  returnTime?: string;
  passengers: number;
  includeAllFees?: boolean;
}

interface ManageBookingRequest {
  bookingId: string;
  action: 'confirm' | 'cancel' | 'get_details' | 'modify';
  paymentMethod?: string;
  cancellationReason?: string;
  modifications?: any;
}

interface GetEmptyLegsRequest {
  departureAirport?: string;
  arrivalAirport?: string;
  startDate?: string;
  endDate?: string;
  maxPrice?: number;
}

interface GetFleetUtilizationRequest {
  operatorId?: string;
  startDate?: string;
  endDate?: string;
}

export class AvinodeSupabaseMockClient {
  private isSupabaseEnabled: boolean;

  constructor(useSupabase: boolean = false) {
    this.isSupabaseEnabled = useSupabase && isSupabaseAvailable();
    
    if (useSupabase && !isSupabaseAvailable()) {
      console.warn('Supabase not configured properly. Falling back to in-memory mock data.');
    } else if (this.isSupabaseEnabled) {
      console.log('Using Supabase-backed mock data');
      this.testConnection();
    }
  }

  private async testConnection() {
    const isConnected = await testSupabaseConnection();
    if (!isConnected) {
      console.warn('Supabase connection test failed. Some features may not work properly.');
      this.isSupabaseEnabled = false;
    }
  }

  // ===================================
  // AIRCRAFT SEARCH
  // ===================================

  async searchAircraft(request: SearchAircraftRequest): Promise<{ success: boolean; data?: { results: any[]; totalResults: number }; error?: string }> {
    try {
      if (!this.isSupabaseEnabled || !supabase) {
        return { success: false, error: 'Supabase not available' };
      }

      let query = supabase
        .from('aircraft')
        .select(`
          *,
          operators!inner(
            name,
            safety_rating,
            certifications,
            contact_email,
            contact_phone
          )
        `)
        .eq('availability', 'Available')
        .gte('max_passengers', request.passengers);

      // Apply filters
      if (request.aircraftCategory) {
        query = query.eq('category', request.aircraftCategory);
      }

      if (request.maxPrice) {
        query = query.lte('hourly_rate', request.maxPrice);
      }

      if (request.petFriendly) {
        query = query.eq('pet_friendly', true);
      }

      if (request.wifiRequired) {
        query = query.eq('wifi_available', true);
      }

      const { data: aircraftData, error } = await query;

      if (error) {
        throw new Error(`Database query failed: ${error.message}`);
      }

      if (!aircraftData || aircraftData.length === 0) {
        return {
          success: true,
          data: {
            results: [],
            totalResults: 0
          }
        };
      }

      const flightTime = calculateFlightTime(request.departureAirport, request.arrivalAirport);
      const isRoundTrip = !!request.returnDate;
      const totalFlightTime = isRoundTrip ? flightTime * 2 : flightTime;

      const results = aircraftData.map((aircraft: any) => {
        const baseRate = aircraft.hourly_rate;
        const baseCost = baseRate * totalFlightTime;
        const estimatedTotal = Math.round(baseCost * 1.35); // Add 35% for fees/taxes

        return {
          aircraft: dbToMockAircraft(aircraft),
          operator: aircraft.operators ? {
            name: aircraft.operators.name,
            safetyRating: aircraft.operators.safety_rating,
            certifications: aircraft.operators.certifications,
            contactEmail: aircraft.operators.contact_email,
            contactPhone: aircraft.operators.contact_phone
          } : null,
          availability: {
            status: aircraft.availability,
            nextAvailableDate: request.departureDate
          },
          pricing: {
            hourlyRate: baseRate,
            estimatedTotal: estimatedTotal,
            currency: 'USD',
            flightTime: totalFlightTime
          },
          route: `${request.departureAirport} → ${request.arrivalAirport}${isRoundTrip ? ` → ${request.departureAirport}` : ''}`,
          suitability: this.calculateSuitabilityScore(aircraft, request)
        };
      });

      // Sort by suitability score
      results.sort((a, b) => b.suitability - a.suitability);

      return {
        success: true,
        data: {
          results: results,
          totalResults: results.length
        }
      };

    } catch (error) {
      console.error('Aircraft search error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private calculateSuitabilityScore(aircraft: any, request: SearchAircraftRequest): number {
    let score = 100;

    // Passenger capacity efficiency
    const passengerRatio = request.passengers / aircraft.max_passengers;
    if (passengerRatio > 0.7 && passengerRatio <= 1.0) {
      score += 20; // Optimal capacity usage
    } else if (passengerRatio > 0.5) {
      score += 10; // Good capacity usage
    } else if (passengerRatio < 0.3) {
      score -= 15; // Wasteful capacity
    }

    // Price competitiveness
    if (request.maxPrice && aircraft.hourly_rate <= request.maxPrice * 0.8) {
      score += 15; // Significantly under budget
    }

    // Special requirements
    if (request.petFriendly && aircraft.pet_friendly) {
      score += 10;
    }
    if (request.wifiRequired && aircraft.wifi_available) {
      score += 5;
    }

    return score;
  }

  // ===================================
  // CHARTER REQUEST CREATION
  // ===================================

  async createCharterRequest(data: CreateCharterRequestData): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.isSupabaseEnabled || !supabase) {
        return { success: false, error: 'Supabase not available' };
      }

      // First, verify the aircraft exists and get operator info
      const { data: aircraftData, error: aircraftError } = await supabase
        .from('aircraft')
        .select(`
          *,
          operators!inner(*)
        `)
        .eq('id', data.aircraftId)
        .single();

      if (aircraftError || !aircraftData) {
        throw new Error('Aircraft not found');
      }

      const requestId = generateBookingId();
      const requestData = {
        id: requestId,
        aircraft_id: data.aircraftId,
        operator_id: aircraftData.operator_id,
        departure_airport: data.departureAirport,
        arrival_airport: data.arrivalAirport,
        departure_date: data.departureDate,
        departure_time: data.departureTime,
        passengers: data.passengers,
        contact_name: data.contactName,
        contact_email: data.contactEmail,
        contact_phone: data.contactPhone,
        company: data.company,
        special_requests: data.specialRequests,
        status: 'Pending'
      };

      const { data: insertedData, error: insertError } = await supabase
        .from('charter_requests')
        .insert(requestData)
        .select()
        .single();

      if (insertError) {
        throw new Error(`Failed to create charter request: ${insertError.message}`);
      }

      return {
        success: true,
        data: {
          bookingId: requestId,
          status: 'pending',
          aircraft: `${aircraftData.manufacturer} ${aircraftData.model}`,
          route: `${data.departureAirport} → ${data.arrivalAirport}`,
          date: data.departureDate,
          time: data.departureTime,
          passengers: data.passengers,
          contact: {
            name: data.contactName,
            email: data.contactEmail,
            phone: data.contactPhone
          },
          nextSteps: 'Your charter request has been submitted. We will review and send you a detailed quote within 2 hours.',
          estimatedResponse: '2 hours',
          operator: aircraftData.operators.name
        }
      };

    } catch (error) {
      console.error('Charter request creation error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ===================================
  // PRICING QUOTES
  // ===================================

  async getPricing(request: GetPricingRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.isSupabaseEnabled || !supabase) {
        return { success: false, error: 'Supabase not available' };
      }

      // Get aircraft details
      const { data: aircraftData, error: aircraftError } = await supabase
        .from('aircraft')
        .select('*')
        .eq('id', request.aircraftId)
        .single();

      if (aircraftError || !aircraftData) {
        throw new Error('Aircraft not found');
      }

      const flightTime = calculateFlightTime(request.departureAirport, request.arrivalAirport);
      const isRoundTrip = !!request.returnDate;
      const totalFlightTime = isRoundTrip ? flightTime * 2 : flightTime;

      const hourlyRate = aircraftData.hourly_rate;
      const baseCost = hourlyRate * totalFlightTime;
      
      // Calculate detailed pricing breakdown
      const fuelSurcharge = Math.round(baseCost * 0.075);
      const landingFees = Math.min(2400, Math.max(800, Math.round(flightTime * 400)));
      const handlingFees = Math.min(1600, Math.max(600, Math.round(flightTime * 300)));
      const catering = request.passengers * 150;
      const crewFees = Math.round(totalFlightTime * 400);
      const overnightFees = isRoundTrip ? 2500 : 0;
      const roundTripDiscount = isRoundTrip ? Math.round(baseCost * 0.05) : 0;

      const subtotal = baseCost + fuelSurcharge + landingFees + handlingFees + catering + crewFees + overnightFees - roundTripDiscount;
      const taxes = Math.round(subtotal * 0.08);
      const totalPrice = subtotal + taxes;

      const quoteId = generateQuoteId();
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 5);

      const priceBreakdown = {
        flightHours: totalFlightTime,
        hourlyRate: hourlyRate,
        baseCost: baseCost,
        fuelSurcharge: fuelSurcharge,
        landingFees: landingFees,
        handlingFees: handlingFees,
        catering: catering,
        crewFees: crewFees,
        overnightFees: overnightFees,
        deicingFees: 0,
        taxes: taxes,
        discount: roundTripDiscount
      };

      // Store quote in database
      const quoteData = {
        id: quoteId,
        aircraft_id: request.aircraftId,
        total_price: totalPrice,
        currency: 'USD',
        price_breakdown: priceBreakdown,
        valid_until: validUntil.toISOString(),
        terms: [
          '20% deposit required within 48 hours of booking confirmation',
          'Balance due 24 hours before departure',
          'All prices subject to fuel surcharge adjustments'
        ],
        cancellation_policy: 'Standard industry cancellation policy applies'
      };

      const { error: insertError } = await supabase
        .from('pricing_quotes')
        .insert(quoteData);

      if (insertError) {
        console.warn('Failed to store quote in database:', insertError.message);
      }

      const route = isRoundTrip 
        ? `${request.departureAirport} → ${request.arrivalAirport} → ${request.departureAirport}`
        : `${request.departureAirport} → ${request.arrivalAirport}`;

      const departureInfo = request.returnDate
        ? `${request.departureDate} at ${request.departureTime || '10:00'}`
        : `${request.departureDate} at ${request.departureTime || '10:00'}`;

      const returnInfo = request.returnDate
        ? `${request.returnDate} at ${request.returnTime || '10:00'}`
        : null;

      const formattedQuote = this.formatQuote(quoteId, request.aircraftId, route, departureInfo, returnInfo, totalFlightTime, request.passengers, priceBreakdown, subtotal, taxes, totalPrice, validUntil);

      return {
        success: true,
        data: {
          id: quoteId,
          totalPrice: totalPrice,
          currency: 'USD',
          priceBreakdown: priceBreakdown,
          validUntil: validUntil.toISOString(),
          formattedQuote: formattedQuote
        }
      };

    } catch (error) {
      console.error('Pricing calculation error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  private formatQuote(quoteId: string, aircraftId: string, route: string, departureInfo: string, returnInfo: string | null, flightHours: number, passengers: number, breakdown: any, subtotal: number, taxes: number, total: number, validUntil: Date): string {
    return `# Charter Flight Quote

## Quote Information
- **Quote ID:** ${quoteId}
- **Aircraft ID:** ${aircraftId}
- **Valid Until:** ${validUntil.toLocaleDateString()}

## Flight Details
- **Route:** ${route}
- **Departure:** ${departureInfo}
${returnInfo ? `- **Return:** ${returnInfo}` : ''}
- **Flight Hours:** ${flightHours} total
- **Passengers:** ${passengers}

## Pricing Breakdown
- **Base Flight Cost:** ${formatCurrency(breakdown.baseCost)} (${flightHours} hrs × ${formatCurrency(breakdown.hourlyRate)}/hr)
- **Fuel Surcharge:** ${formatCurrency(breakdown.fuelSurcharge)}
- **Landing Fees:** ${formatCurrency(breakdown.landingFees)}
- **Handling Fees:** ${formatCurrency(breakdown.handlingFees)}
- **Catering:** ${formatCurrency(breakdown.catering)}
- **Crew Fees:** ${formatCurrency(breakdown.crewFees)}
${breakdown.overnightFees > 0 ? `- **Overnight Fees:** ${formatCurrency(breakdown.overnightFees)}` : ''}
${breakdown.discount > 0 ? `- **Round Trip Discount:** -${formatCurrency(breakdown.discount)}` : ''}

### Subtotal: ${formatCurrency(subtotal)}
### Taxes (8%): ${formatCurrency(taxes)}

## **Total Price: ${formatCurrency(total)} USD**

## Terms & Conditions
- 20% deposit required within 48 hours of booking confirmation
- Balance due 24 hours before departure
- Cancellation within 7 days: 50% penalty
- Cancellation within 48 hours: 100% penalty
- All prices subject to fuel surcharge adjustments

## Cancellation Policy
Standard industry cancellation policy applies

*This quote is valid for 5 days. To proceed with booking, please reference Quote ID: ${quoteId}*`;
  }

  // ===================================
  // BOOKING MANAGEMENT
  // ===================================

  async manageBooking(request: ManageBookingRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.isSupabaseEnabled || !supabase) {
        return { success: false, error: 'Supabase not available' };
      }

      const { data: bookingData, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('id', request.bookingId)
        .single();

      if (error || !bookingData) {
        throw new Error('Booking not found');
      }

      let updateData: any = {};
      let responseMessage = '';

      switch (request.action) {
        case 'confirm':
          updateData = {
            status: 'Confirmed',
            payment_method: request.paymentMethod,
            payment_status: request.paymentMethod === 'credit_card' ? 'DepositPaid' : 'Pending'
          };
          responseMessage = 'Booking has been confirmed successfully';
          break;

        case 'cancel':
          updateData = {
            status: 'Cancelled',
            payment_status: 'Refunded'
          };
          responseMessage = `Booking has been cancelled. Reason: ${request.cancellationReason || 'Not specified'}`;
          break;

        case 'get_details':
          return {
            success: true,
            data: dbToMockBooking(bookingData)
          };

        case 'modify':
          if (request.modifications) {
            updateData = request.modifications;
            responseMessage = 'Booking has been modified successfully';
          } else {
            throw new Error('No modifications specified');
          }
          break;

        default:
          throw new Error('Invalid action');
      }

      if (Object.keys(updateData).length > 0) {
        const { error: updateError } = await supabase
          .from('bookings')
          .update(updateData)
          .eq('id', request.bookingId);

        if (updateError) {
          throw new Error(`Failed to update booking: ${updateError.message}`);
        }
      }

      return {
        success: true,
        data: {
          bookingId: request.bookingId,
          action: request.action,
          status: updateData.status || bookingData.status,
          message: responseMessage,
          timestamp: new Date().toISOString()
        }
      };

    } catch (error) {
      console.error('Booking management error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ===================================
  // EMPTY LEGS
  // ===================================

  async getEmptyLegs(request: GetEmptyLegsRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.isSupabaseEnabled || !supabase) {
        return { success: false, error: 'Supabase not available' };
      }

      let query = supabase
        .from('flight_legs')
        .select(`
          *,
          aircraft!inner(
            model,
            manufacturer,
            category,
            max_passengers,
            operators!inner(name, safety_rating)
          )
        `)
        .eq('type', 'EmptyLeg')
        .eq('status', 'Available');

      // Apply filters
      if (request.departureAirport) {
        query = query.eq('departure_airport', request.departureAirport);
      }

      if (request.arrivalAirport) {
        query = query.eq('arrival_airport', request.arrivalAirport);
      }

      if (request.startDate) {
        query = query.gte('departure_date', request.startDate);
      }

      if (request.endDate) {
        query = query.lte('departure_date', request.endDate);
      }

      if (request.maxPrice) {
        query = query.lte('price', request.maxPrice);
      }

      const { data: emptyLegsData, error } = await query.order('departure_timestamp');

      if (error) {
        throw new Error(`Database query failed: ${error.message}`);
      }

      const emptyLegs = (emptyLegsData || []).map((leg: any) => ({
        leg: dbToMockFlightLeg(leg),
        aircraft: dbToMockAircraft(leg.aircraft),
        operator: leg.aircraft.operators,
        discount: Math.round((1 - (leg.price / (leg.aircraft.hourly_rate * leg.flight_time))) * 100)
      }));

      return {
        success: true,
        data: {
          emptyLegs: emptyLegs,
          totalResults: emptyLegs.length
        }
      };

    } catch (error) {
      console.error('Empty legs search error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ===================================
  // FLEET UTILIZATION
  // ===================================

  async getFleetUtilization(request: GetFleetUtilizationRequest): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.isSupabaseEnabled || !supabase) {
        return { success: false, error: 'Supabase not available' };
      }

      const operatorId = request.operatorId || 'OP001';

      // Get operator details
      const { data: operatorData, error: operatorError } = await supabase
        .from('operators')
        .select('*')
        .eq('id', operatorId)
        .single();

      if (operatorError || !operatorData) {
        throw new Error('Operator not found');
      }

      // Get fleet aircraft
      const { data: fleetData, error: fleetError } = await supabase
        .from('aircraft')
        .select('*')
        .eq('operator_id', operatorId);

      if (fleetError) {
        throw new Error(`Failed to get fleet data: ${fleetError.message}`);
      }

      const fleet = fleetData || [];
      
      // Simulate utilization data
      const fleetStatus = fleet.map((aircraft: any) => {
        const hoursFlown = Math.floor(Math.random() * 150) + 50;
        const revenue = hoursFlown * aircraft.hourly_rate;
        const locations = ['KJFK', 'KLAX', 'KMIA', 'KLAS', 'KBOS', 'KTEB'];
        const statuses = ['Available', 'OnCharter', 'Maintenance', 'Positioning'];
        
        return {
          aircraft: dbToMockAircraft(aircraft),
          status: statuses[Math.floor(Math.random() * statuses.length)] as any,
          currentLocation: locations[Math.floor(Math.random() * locations.length)],
          nextAvailableDate: new Date(Date.now() + Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          hoursFlown: hoursFlown,
          revenue: revenue
        };
      });

      const totalRevenue = fleetStatus.reduce((sum, aircraft) => sum + aircraft.revenue, 0);
      const availableAircraft = fleetStatus.filter(a => a.status === 'Available').length;
      const onCharterAircraft = fleetStatus.filter(a => a.status === 'OnCharter').length;
      const maintenanceAircraft = fleetStatus.filter(a => a.status === 'Maintenance').length;
      const utilizationRate = onCharterAircraft / fleet.length * 100;

      return {
        success: true,
        data: {
          operator: dbToMockOperator(operatorData),
          utilizationRate: Math.round(utilizationRate * 10) / 10,
          fleetStatus: fleetStatus,
          summary: {
            totalAircraft: fleet.length,
            availableAircraft: availableAircraft,
            onCharterAircraft: onCharterAircraft,
            maintenanceAircraft: maintenanceAircraft,
            totalRevenue: totalRevenue
          }
        }
      };

    } catch (error) {
      console.error('Fleet utilization error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // ===================================
  // OPERATOR INFO
  // ===================================

  async getOperatorInfo(operatorId: string, includeFleetDetails: boolean = false, includeSafetyRecords: boolean = true): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      if (!this.isSupabaseEnabled || !supabase) {
        return { success: false, error: 'Supabase not available' };
      }

      const { data: operatorData, error } = await supabase
        .from('operators')
        .select('*')
        .eq('id', operatorId)
        .single();

      if (error || !operatorData) {
        throw new Error('Operator not found');
      }

      let fleetDetails = null;
      if (includeFleetDetails) {
        const { data: fleetData } = await supabase
          .from('aircraft')
          .select('*')
          .eq('operator_id', operatorId);
        
        fleetDetails = fleetData?.map(dbToMockAircraft) || [];
      }

      return {
        success: true,
        data: {
          operator: dbToMockOperator(operatorData),
          fleetDetails: fleetDetails,
          safetyRecords: includeSafetyRecords ? {
            rating: operatorData.safety_rating,
            certifications: operatorData.certifications,
            lastAuditDate: '2024-01-15',
            nextAuditDate: '2025-01-15',
            incidentFreeHours: Math.floor(Math.random() * 50000) + 100000
          } : null
        }
      };

    } catch (error) {
      console.error('Operator info error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}