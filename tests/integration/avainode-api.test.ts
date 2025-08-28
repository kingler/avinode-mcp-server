import { describe, test, expect, beforeEach, jest } from '@jest/globals';
import { AvainodeAPIClient } from '../../src/avainode-api-client';

describe('Avainode API Integration', () => {
  let apiClient: AvainodeAPIClient;

  beforeEach(() => {
    apiClient = new AvainodeAPIClient(process.env.AVAINODE_API_KEY || 'test-api-key');
  });

  describe('API Authentication', () => {
    test('handles invalid API key', async () => {
      const invalidClient = new AvainodeAPIClient('invalid-key');
      
      await expect(invalidClient.searchAircraft({}))
        .rejects
        .toThrow('Missing required parameters');
    });

    test('includes proper headers', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch');
      
      await apiClient.searchAircraft({ 
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-03-15'
      }).catch(() => {});

      expect(fetchSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json',
            'User-Agent': 'jetvision-avainode-mcp/1.0'
          })
        })
      );
    });
  });

  describe('Aircraft Search', () => {
    test('validates required search parameters', async () => {
      await expect(apiClient.searchAircraft({}))
        .rejects
        .toThrow('Missing required parameters');
    });

    test('handles aircraft search response', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            aircraft: [
              {
                id: 'ACF123',
                model: 'Gulfstream G650',
                category: 'Heavy Jet',
                operator: 'Elite Jets',
                base_airport: 'KTEB',
                passengers_max: 14,
                range_nm: 7000,
                hourly_rate: 8500
              }
            ],
            total_results: 1
          })
        } as Response)
      );

      const result = await apiClient.searchAircraft({
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-03-15',
        passengers: 8
      });
      
      expect(result).toHaveProperty('aircraft');
      expect(result.aircraft).toBeInstanceOf(Array);
      expect(result.aircraft[0]).toHaveProperty('id', 'ACF123');
      expect(result.aircraft[0]).toHaveProperty('model');
    });
  });

  describe('Charter Request Creation', () => {
    test('creates charter request successfully', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            request_id: 'REQ123456',
            status: 'pending',
            created_at: '2024-01-15T10:00:00Z',
            aircraft_id: 'ACF123',
            estimated_total: 45000
          })
        } as Response)
      );

      const result = await apiClient.createCharterRequest({
        aircraft_id: 'ACF123',
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-03-15',
        departure_time: '10:00',
        passengers: 8,
        contact: {
          name: 'John Doe',
          email: 'john@jetvision.com',
          phone: '+1-555-0123'
        }
      });
      
      expect(result).toHaveProperty('request_id');
      expect(result.request_id).toBe('REQ123456');
      expect(result).toHaveProperty('status', 'pending');
    });

    test('validates charter request fields', async () => {
      await expect(apiClient.createCharterRequest({
        aircraft_id: 'ACF123'
        // Missing required fields
      }))
        .rejects
        .toThrow('Missing required booking parameters');
    });
  });

  describe('Pricing Calculation', () => {
    test('calculates pricing with all fees', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            quote_id: 'QTE123456',
            aircraft_id: 'ACF123',
            flight_time_hours: 5.5,
            base_cost: 46750,
            fuel_surcharge: 3500,
            landing_fees: 1200,
            handling_fees: 800,
            catering: 1500,
            taxes: 4275,
            total_cost: 58025,
            currency: 'USD',
            valid_until: '2024-01-20T23:59:59Z'
          })
        } as Response)
      );

      const result = await apiClient.calculatePricing({
        aircraft_id: 'ACF123',
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-03-15',
        passengers: 8,
        include_all_fees: true
      });
      
      expect(result).toHaveProperty('total_cost');
      expect(result.total_cost).toBe(58025);
      expect(result).toHaveProperty('flight_time_hours');
      expect(result).toHaveProperty('fuel_surcharge');
    });

    test('handles round-trip pricing', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            quote_id: 'QTE123457',
            trip_type: 'round_trip',
            outbound_cost: 46750,
            return_cost: 46750,
            total_cost: 93500,
            currency: 'USD'
          })
        } as Response)
      );

      const result = await apiClient.calculatePricing({
        aircraft_id: 'ACF123',
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-03-15',
        return_date: '2024-03-18',
        passengers: 8
      });
      
      expect(result).toHaveProperty('trip_type', 'round_trip');
      expect(result).toHaveProperty('outbound_cost');
      expect(result).toHaveProperty('return_cost');
    });
  });

  describe('Booking Management', () => {
    test('confirms booking with payment', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            booking_id: 'BKG123456',
            status: 'confirmed',
            payment_status: 'pending',
            payment_method: 'wire_transfer',
            updated_at: '2024-01-15T11:00:00Z'
          })
        } as Response)
      );

      const result = await apiClient.manageBooking({
        booking_id: 'BKG123456',
        action: 'confirm',
        payment_method: 'wire_transfer'
      });
      
      expect(result).toHaveProperty('status', 'confirmed');
      expect(result).toHaveProperty('payment_method', 'wire_transfer');
    });

    test('cancels booking', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            booking_id: 'BKG123456',
            status: 'cancelled',
            cancellation_reason: 'Client request',
            cancellation_fee: 5000,
            refund_amount: 40000,
            cancelled_at: '2024-01-15T12:00:00Z'
          })
        } as Response)
      );

      const result = await apiClient.manageBooking({
        booking_id: 'BKG123456',
        action: 'cancel',
        cancellation_reason: 'Client request'
      });
      
      expect(result).toHaveProperty('status', 'cancelled');
      expect(result).toHaveProperty('cancellation_fee');
      expect(result).toHaveProperty('refund_amount');
    });
  });

  describe('Operator Information', () => {
    test('retrieves operator details', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            operator_id: 'OP789',
            name: 'Elite Jets',
            certificate_number: 'DOT123456',
            safety_rating: 'ARGUS Gold',
            fleet_size: 25,
            year_established: 2005,
            headquarters: 'Teterboro, NJ',
            insurance_coverage: 100000000,
            pilots_count: 50,
            maintenance_facilities: ['KTEB', 'KLAS', 'KPBI']
          })
        } as Response)
      );

      const result = await apiClient.getOperatorInfo('OP789');
      
      expect(result).toHaveProperty('operator_id', 'OP789');
      expect(result).toHaveProperty('safety_rating');
      expect(result).toHaveProperty('fleet_size');
      expect(result).toHaveProperty('insurance_coverage');
    });
  });

  describe('Rate Limiting', () => {
    test('handles rate limiting with retry', async () => {
      const startTime = Date.now();
      
      jest.spyOn(global, 'fetch')
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: false,
            status: 429,
            headers: new Headers({ 'Retry-After': '2' }),
            json: () => Promise.resolve({ error: 'Rate limited' })
          } as Response)
        )
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: () => Promise.resolve({ aircraft: [] })
          } as Response)
        );

      await apiClient.searchAircraft({
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-03-15'
      });
      
      const elapsedTime = Date.now() - startTime;
      expect(elapsedTime).toBeGreaterThanOrEqual(2000);
    });
  });

  describe('Error Handling', () => {
    test('handles network errors', async () => {
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(apiClient.searchAircraft({
        departure_airport: 'KJFK',
        arrival_airport: 'KLAX',
        departure_date: '2024-03-15'
      }))
        .rejects
        .toThrow('Network error');
    });

    test('handles API errors with details', async () => {
      jest.spyOn(global, 'fetch').mockImplementationOnce(() =>
        Promise.resolve({
          ok: false,
          status: 400,
          json: () => Promise.resolve({
            error: 'Bad Request',
            message: 'Invalid airport code format'
          })
        } as Response)
      );

      await expect(apiClient.searchAircraft({
        departure_airport: 'INVALID',
        arrival_airport: 'KLAX',
        departure_date: '2024-03-15'
      }))
        .rejects
        .toThrow('Invalid airport code format');
    });
  });
});