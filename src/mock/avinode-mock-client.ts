/**
 * Avinode Mock API Client
 * Simulates Avinode API responses with realistic data
 */

import {
  Aircraft,
  Operator,
  FlightLeg,
  Quote,
  Booking,
  MOCK_AIRCRAFT,
  MOCK_OPERATORS,
  MOCK_EMPTY_LEGS,
  generateFlightTime,
  calculatePricing,
  filterAircraftByRequirements,
  generateBookingId,
  generateQuoteId,
  generateRequestId,
  formatCurrency
} from './avinode-mock-data';

export interface SearchAircraftRequest {
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

export interface SearchAircraftResponse {
  success: boolean;
  data?: {
    searchId: string;
    results: Array<{
      aircraft: Aircraft;
      flightDetails: {
        departureAirport: string;
        arrivalAirport: string;
        departureDate: string;
        estimatedFlightTime: number;
        distance: number;
      };
      pricing: {
        hourlyRate: number;
        estimatedTotal: number;
        currency: string;
      };
      operator: Operator;
      availability: string;
    }>;
    totalResults: number;
    searchCriteria: SearchAircraftRequest;
  };
  error?: string;
}

export interface CreateQuoteRequest {
  aircraftId: string;
  departureAirport: string;
  arrivalAirport: string;
  departureDate: string;
  departureTime: string;
  returnDate?: string;
  returnTime?: string;
  passengers: number;
  includeAllFees?: boolean;
}

export interface CreateQuoteResponse {
  success: boolean;
  data?: Quote;
  error?: string;
}

export interface CreateBookingRequest {
  quoteId?: string;
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
  paymentMethod?: string;
}

export interface CreateBookingResponse {
  success: boolean;
  data?: Booking;
  error?: string;
}

export interface GetEmptyLegsRequest {
  departureAirport?: string;
  arrivalAirport?: string;
  startDate?: string;
  endDate?: string;
  maxPrice?: number;
}

export interface GetEmptyLegsResponse {
  success: boolean;
  data?: {
    emptyLegs: Array<{
      leg: FlightLeg;
      aircraft: Aircraft;
      operator: Operator;
      discount: number;
    }>;
    totalResults: number;
  };
  error?: string;
}

export interface GetFleetUtilizationRequest {
  operatorId?: string;
  startDate?: string;
  endDate?: string;
}

export interface GetFleetUtilizationResponse {
  success: boolean;
  data?: {
    operator: Operator;
    utilizationRate: number;
    fleetStatus: Array<{
      aircraft: Aircraft;
      status: 'Available' | 'OnCharter' | 'Maintenance' | 'Positioning';
      currentLocation: string;
      nextAvailableDate: string;
      hoursFlown: number;
      revenue: number;
    }>;
    summary: {
      totalAircraft: number;
      availableAircraft: number;
      onCharterAircraft: number;
      maintenanceAircraft: number;
      totalRevenue: number;
      averageUtilization: number;
    };
  };
  error?: string;
}

export class AvinodeMockClient {
  private mockBookings: Map<string, Booking> = new Map();
  private mockQuotes: Map<string, Quote> = new Map();
  
  constructor(private useMockData: boolean = true) {}

  /**
   * Search for available aircraft
   */
  async searchAircraft(request: SearchAircraftRequest): Promise<SearchAircraftResponse> {
    if (!this.useMockData) {
      // In production, this would call the real Avinode API
      throw new Error('Real Avinode API not configured. Please set AVINODE_API_KEY.');
    }

    try {
      // Validate request
      if (!request.departureAirport || !request.arrivalAirport || !request.departureDate || !request.passengers) {
        throw new Error('Missing required search parameters');
      }

      // Filter aircraft based on requirements
      const availableAircraft = filterAircraftByRequirements(MOCK_AIRCRAFT, {
        passengers: request.passengers,
        category: request.aircraftCategory,
        maxPrice: request.maxPrice,
        petFriendly: request.petFriendly,
        wifiRequired: request.wifiRequired
      });

      // Generate search results
      const results = availableAircraft.map(aircraft => {
        const operator = MOCK_OPERATORS.find(op => op.id === aircraft.operatorId)!;
        const flightTime = generateFlightTime(request.departureAirport, request.arrivalAirport);
        const pricing = calculatePricing(aircraft, flightTime, !!request.returnDate);
        
        return {
          aircraft,
          flightDetails: {
            departureAirport: request.departureAirport,
            arrivalAirport: request.arrivalAirport,
            departureDate: request.departureDate,
            estimatedFlightTime: flightTime,
            distance: Math.round(flightTime * 450) // Approximate distance
          },
          pricing: {
            hourlyRate: aircraft.hourlyRate,
            estimatedTotal: Object.values(pricing).reduce((a, b) => a + b, 0),
            currency: 'USD'
          },
          operator,
          availability: aircraft.availability
        };
      });

      return {
        success: true,
        data: {
          searchId: `SRCH${Date.now()}`,
          results,
          totalResults: results.length,
          searchCriteria: request
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  /**
   * Create a price quote
   */
  async createQuote(request: CreateQuoteRequest): Promise<CreateQuoteResponse> {
    if (!this.useMockData) {
      throw new Error('Real Avinode API not configured');
    }

    try {
      const aircraft = MOCK_AIRCRAFT.find(a => a.id === request.aircraftId);
      if (!aircraft) {
        throw new Error('Aircraft not found');
      }

      const flightTime = generateFlightTime(request.departureAirport, request.arrivalAirport);
      const isRoundTrip = !!request.returnDate;
      const priceBreakdown = calculatePricing(aircraft, flightTime, isRoundTrip, request.includeAllFees);
      
      const totalPrice = Object.values(priceBreakdown).reduce((a, b) => a + b, 0);
      
      const quote: Quote = {
        id: generateQuoteId(),
        requestId: generateRequestId(),
        aircraftId: request.aircraftId,
        totalPrice,
        currency: 'USD',
        priceBreakdown,
        validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days
        terms: [
          '20% deposit required within 48 hours of booking confirmation',
          'Balance due 24 hours before departure',
          'Cancellation within 7 days: 50% penalty',
          'Cancellation within 48 hours: 100% penalty',
          'All prices subject to fuel surcharge adjustments'
        ],
        cancellationPolicy: 'Standard industry cancellation policy applies'
      };

      this.mockQuotes.set(quote.id, quote);

      return {
        success: true,
        data: quote
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Create a booking
   */
  async createBooking(request: CreateBookingRequest): Promise<CreateBookingResponse> {
    if (!this.useMockData) {
      throw new Error('Real Avinode API not configured');
    }

    try {
      const aircraft = MOCK_AIRCRAFT.find(a => a.id === request.aircraftId);
      if (!aircraft) {
        throw new Error('Aircraft not found');
      }

      const operator = MOCK_OPERATORS.find(op => op.id === aircraft.operatorId);
      if (!operator) {
        throw new Error('Operator not found');
      }

      let quote: Quote | undefined;
      if (request.quoteId) {
        quote = this.mockQuotes.get(request.quoteId);
      } else {
        // Create a quote if not provided
        const quoteResponse = await this.createQuote({
          aircraftId: request.aircraftId,
          departureAirport: request.departureAirport,
          arrivalAirport: request.arrivalAirport,
          departureDate: request.departureDate,
          departureTime: request.departureTime,
          passengers: request.passengers,
          includeAllFees: true
        });
        
        if (quoteResponse.success && quoteResponse.data) {
          quote = quoteResponse.data;
        }
      }

      if (!quote) {
        throw new Error('Unable to generate quote');
      }

      const flightTime = generateFlightTime(request.departureAirport, request.arrivalAirport);
      
      const booking: Booking = {
        id: generateBookingId(),
        quoteId: quote.id,
        aircraftId: request.aircraftId,
        operatorId: aircraft.operatorId,
        status: 'Pending',
        legs: [{
          id: `LEG${generateBookingId()}`,
          aircraftId: request.aircraftId,
          departureAirport: request.departureAirport,
          arrivalAirport: request.arrivalAirport,
          departureDate: request.departureDate,
          departureTime: request.departureTime,
          arrivalDate: request.departureDate,
          arrivalTime: this.calculateArrivalTime(request.departureTime, flightTime),
          flightTime,
          distance: Math.round(flightTime * 450),
          status: 'Available',
          price: quote.totalPrice,
          currency: 'USD',
          type: 'Charter'
        }],
        totalPrice: quote.totalPrice,
        currency: 'USD',
        paymentStatus: 'Pending',
        paymentMethod: request.paymentMethod || 'wire_transfer',
        depositAmount: quote.totalPrice * 0.2,
        balanceAmount: quote.totalPrice * 0.8,
        depositDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        balanceDueDate: new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString(),
        passenger: {
          name: request.contactName,
          email: request.contactEmail,
          phone: request.contactPhone,
          company: request.company
        },
        specialRequests: request.specialRequests,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.mockBookings.set(booking.id, booking);

      return {
        success: true,
        data: booking
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get empty leg opportunities
   */
  async getEmptyLegs(request: GetEmptyLegsRequest): Promise<GetEmptyLegsResponse> {
    if (!this.useMockData) {
      throw new Error('Real Avinode API not configured');
    }

    try {
      let filteredLegs = [...MOCK_EMPTY_LEGS];
      
      // Filter by departure airport
      if (request.departureAirport) {
        filteredLegs = filteredLegs.filter(leg => 
          leg.departureAirport === request.departureAirport
        );
      }
      
      // Filter by arrival airport
      if (request.arrivalAirport) {
        filteredLegs = filteredLegs.filter(leg => 
          leg.arrivalAirport === request.arrivalAirport
        );
      }
      
      // Filter by date range
      if (request.startDate) {
        filteredLegs = filteredLegs.filter(leg => 
          leg.departureDate >= request.startDate!
        );
      }
      
      if (request.endDate) {
        filteredLegs = filteredLegs.filter(leg => 
          leg.departureDate <= request.endDate!
        );
      }
      
      // Filter by max price
      if (request.maxPrice) {
        filteredLegs = filteredLegs.filter(leg => 
          leg.price <= request.maxPrice!
        );
      }

      // Map with aircraft and operator details
      const results = filteredLegs.map(leg => {
        const aircraft = MOCK_AIRCRAFT.find(a => a.id === leg.aircraftId)!;
        const operator = MOCK_OPERATORS.find(op => op.id === aircraft.operatorId)!;
        const normalPrice = aircraft.hourlyRate * leg.flightTime;
        const discount = Math.round((1 - leg.price / normalPrice) * 100);
        
        return {
          leg,
          aircraft,
          operator,
          discount
        };
      });

      return {
        success: true,
        data: {
          emptyLegs: results,
          totalResults: results.length
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get fleet utilization statistics
   */
  async getFleetUtilization(request: GetFleetUtilizationRequest): Promise<GetFleetUtilizationResponse> {
    if (!this.useMockData) {
      throw new Error('Real Avinode API not configured');
    }

    try {
      const operatorId = request.operatorId || 'OP001';
      const operator = MOCK_OPERATORS.find(op => op.id === operatorId);
      
      if (!operator) {
        throw new Error('Operator not found');
      }

      const operatorAircraft = MOCK_AIRCRAFT.filter(a => a.operatorId === operatorId);
      
      // Generate mock utilization data
      const fleetStatus = operatorAircraft.map(aircraft => {
        const randomStatus = Math.random();
        let status: 'Available' | 'OnCharter' | 'Maintenance' | 'Positioning';
        
        if (randomStatus < 0.4) status = 'Available';
        else if (randomStatus < 0.7) status = 'OnCharter';
        else if (randomStatus < 0.9) status = 'Positioning';
        else status = 'Maintenance';
        
        const hoursFlown = Math.floor(Math.random() * 100) + 20;
        const revenue = hoursFlown * aircraft.hourlyRate;
        
        return {
          aircraft,
          status,
          currentLocation: ['KTEB', 'KJFK', 'KLAX', 'KMIA', 'KLAS'][Math.floor(Math.random() * 5)],
          nextAvailableDate: new Date(Date.now() + Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          hoursFlown,
          revenue
        };
      });

      const availableCount = fleetStatus.filter(s => s.status === 'Available').length;
      const onCharterCount = fleetStatus.filter(s => s.status === 'OnCharter').length;
      const maintenanceCount = fleetStatus.filter(s => s.status === 'Maintenance').length;
      const totalRevenue = fleetStatus.reduce((sum, s) => sum + s.revenue, 0);
      const utilizationRate = ((onCharterCount + fleetStatus.filter(s => s.status === 'Positioning').length) / operatorAircraft.length) * 100;

      return {
        success: true,
        data: {
          operator,
          utilizationRate,
          fleetStatus,
          summary: {
            totalAircraft: operatorAircraft.length,
            availableAircraft: availableCount,
            onCharterAircraft: onCharterCount,
            maintenanceAircraft: maintenanceCount,
            totalRevenue,
            averageUtilization: utilizationRate
          }
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Get booking details
   */
  async getBooking(bookingId: string): Promise<Booking | null> {
    return this.mockBookings.get(bookingId) || null;
  }

  /**
   * Update booking status
   */
  async updateBookingStatus(
    bookingId: string, 
    status: Booking['status']
  ): Promise<{ success: boolean; booking?: Booking; error?: string }> {
    const booking = this.mockBookings.get(bookingId);
    
    if (!booking) {
      return {
        success: false,
        error: 'Booking not found'
      };
    }

    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    
    if (status === 'Confirmed') {
      booking.paymentStatus = 'DepositPaid';
    } else if (status === 'Cancelled') {
      booking.paymentStatus = 'Refunded';
    }

    this.mockBookings.set(bookingId, booking);

    return {
      success: true,
      booking
    };
  }

  /**
   * Helper function to calculate arrival time
   */
  private calculateArrivalTime(departureTime: string, flightHours: number): string {
    const [hours, minutes] = departureTime.split(':').map(Number);
    const departureMinutes = hours * 60 + minutes;
    const arrivalMinutes = departureMinutes + Math.round(flightHours * 60);
    
    const arrivalHours = Math.floor(arrivalMinutes / 60) % 24;
    const arrivalMins = arrivalMinutes % 60;
    
    return `${String(arrivalHours).padStart(2, '0')}:${String(arrivalMins).padStart(2, '0')}`;
  }
}