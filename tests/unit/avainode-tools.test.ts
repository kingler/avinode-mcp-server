import { describe, test, expect, beforeEach } from '@jest/globals';
import { AvainodeTools } from '../../src/avainode-tools';
import { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';

describe('Avainode MCP Tools', () => {
  let avainodeTools: AvainodeTools;

  beforeEach(() => {
    avainodeTools = new AvainodeTools();
  });

  describe('search-aircraft tool', () => {
    test('validates search parameters', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'search-aircraft',
          arguments: {}
        }
      };

      await expect(avainodeTools.handleToolCall(request))
        .rejects
        .toThrow('Missing required search parameters');
    });

    test('returns available aircraft', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'search-aircraft',
          arguments: {
            departureAirport: 'KJFK',
            arrivalAirport: 'KLAX',
            departureDate: '2024-03-15',
            passengers: 8,
            aircraftCategory: 'Heavy Jet'
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content).toBeInstanceOf(Array);
      expect(result.content[0]).toHaveProperty('type', 'text');
      expect(result.content[0].text).toContain('Available Aircraft Search Results');
    });

    test('handles invalid airport codes', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'search-aircraft',
          arguments: {
            departureAirport: 'INVALID',
            arrivalAirport: 'KLAX',
            departureDate: '2024-03-15',
            passengers: 8
          }
        }
      };

      await expect(avainodeTools.handleToolCall(request))
        .rejects
        .toThrow('Invalid airport code');
    });
  });

  describe('create-charter-request tool', () => {
    test('handles booking data correctly', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'create-charter-request',
          arguments: {
            aircraftId: 'ACF001',
            departureAirport: 'KJFK',
            arrivalAirport: 'KLAX',
            departureDate: '2024-03-15',
            departureTime: '10:00',
            passengers: 8,
            contactName: 'John Doe',
            contactEmail: 'john@jetvision.com',
            contactPhone: '+1-555-0123'
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Charter Request Created Successfully');
      expect(result.content[0].text).toContain('Booking ID');
    });

    test('validates required booking fields', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'create-charter-request',
          arguments: {
            aircraftId: 'ACF001',
            // Missing required fields
          }
        }
      };

      await expect(avainodeTools.handleToolCall(request))
        .rejects
        .toThrow('Missing required booking parameters');
    });
  });

  describe('get-pricing tool', () => {
    test('calculates accurate quotes', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get-pricing',
          arguments: {
            aircraftId: 'ACF001',
            departureAirport: 'KJFK',
            arrivalAirport: 'KLAX',
            departureDate: '2024-03-15',
            returnDate: '2024-03-18',
            passengers: 8,
            includeAllFees: true
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Charter Flight Quote');
      expect(result.content[0].text).toContain('Total cost');
      expect(result.content[0].text).toContain('Flight time');
    });

    test('handles one-way pricing', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get-pricing',
          arguments: {
            aircraftId: 'ACF001',
            departureAirport: 'KJFK',
            arrivalAirport: 'KLAX',
            departureDate: '2024-03-15',
            passengers: 8
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('One-way');
    });
  });

  describe('manage-booking tool', () => {
    test('updates booking status', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'manage-booking',
          arguments: {
            bookingId: 'BK12345678',
            action: 'confirm',
            paymentMethod: 'wire_transfer'
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Booking Confirmed');
    });

    test('handles booking cancellation', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'manage-booking',
          arguments: {
            bookingId: 'BK12345678',
            action: 'cancel',
            cancellationReason: 'Client request'
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Booking Cancelled');
    });

    test('retrieves booking details', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'manage-booking',
          arguments: {
            bookingId: 'BK12345678',
            action: 'get_details'
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Booking Details');
    });
  });

  describe('get-operator-info tool', () => {
    test('retrieves operator details', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get-operator-info',
          arguments: {
            operatorId: 'OP001'
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Operator Information');
      expect(result.content[0].text).toContain('Safety Rating');
      expect(result.content[0].text).toContain('Fleet Size');
    });

    test('handles invalid operator ID', async () => {
      const request: CallToolRequest = {
        method: 'tools/call',
        params: {
          name: 'get-operator-info',
          arguments: {
            operatorId: 'INVALID'
          }
        }
      };

      const result = await avainodeTools.handleToolCall(request);
      
      expect(result).toHaveProperty('content');
      expect(result.content[0].text).toContain('Operator not found');
    });
  });
});