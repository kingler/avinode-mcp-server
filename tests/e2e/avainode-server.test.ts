import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { MCPServer } from '../../src/server';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';

describe('Avainode MCP Server E2E', () => {
  let app: express.Application;
  let mcpServer: MCPServer;
  let sessionId: string;

  beforeAll(async () => {
    const server = new Server(
      {
        name: 'avainode-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          logging: {},
        },
      }
    );

    mcpServer = new MCPServer(server);
    app = express();
    app.use(express.json());

    const router = express.Router();
    router.post('/mcp', async (req, res) => {
      await mcpServer.handlePostRequest(req, res);
    });
    router.get('/mcp', async (req, res) => {
      await mcpServer.handleGetRequest(req, res);
    });
    app.use('/', router);
  });

  afterAll(async () => {
    await mcpServer.cleanup();
  });

  describe('Server Initialization', () => {
    test('handles initialize request', async () => {
      const response = await request(app)
        .post('/mcp')
        .send({
          jsonrpc: '2.0',
          method: 'initialize',
          params: {
            protocolVersion: '0.1.0',
            capabilities: {},
            clientInfo: {
              name: 'test-client',
              version: '1.0.0'
            }
          },
          id: 1
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('protocolVersion');
      
      sessionId = response.headers['mcp-session-id'];
      expect(sessionId).toBeDefined();
    });
  });

  describe('Tool Discovery', () => {
    test('lists available Avainode tools', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/list',
          params: {},
          id: 2
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('tools');
      
      const tools = response.body.result.tools;
      expect(tools).toBeInstanceOf(Array);
      
      const toolNames = tools.map((t: any) => t.name);
      expect(toolNames).toContain('search-aircraft');
      expect(toolNames).toContain('create-charter-request');
      expect(toolNames).toContain('get-pricing');
      expect(toolNames).toContain('manage-booking');
      expect(toolNames).toContain('get-operator-info');
    });

    test('provides proper tool schemas', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/list',
          params: {},
          id: 3
        });

      const searchAircraftTool = response.body.result.tools.find(
        (t: any) => t.name === 'search-aircraft'
      );

      expect(searchAircraftTool).toHaveProperty('description');
      expect(searchAircraftTool).toHaveProperty('inputSchema');
      expect(searchAircraftTool.inputSchema).toHaveProperty('type', 'object');
      expect(searchAircraftTool.inputSchema).toHaveProperty('properties');
      expect(searchAircraftTool.inputSchema.properties).toHaveProperty('departureAirport');
      expect(searchAircraftTool.inputSchema.properties).toHaveProperty('arrivalAirport');
    });
  });

  describe('Aircraft Search Tool', () => {
    test('executes search-aircraft tool', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
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
          },
          id: 4
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('content');
      expect(response.body.result.content[0]).toHaveProperty('type', 'text');
      expect(response.body.result.content[0].text).toContain('Available aircraft');
    });

    test('validates airport codes', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'search-aircraft',
            arguments: {
              departureAirport: 'INVALID',
              arrivalAirport: 'KLAX',
              departureDate: '2024-03-15',
              passengers: 8
            }
          },
          id: 5
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('Invalid airport code');
    });
  });

  describe('Charter Request Tool', () => {
    test('creates charter request', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'create-charter-request',
            arguments: {
              aircraftId: 'ACF123',
              departureAirport: 'KJFK',
              arrivalAirport: 'KLAX',
              departureDate: '2024-03-15',
              departureTime: '10:00',
              passengers: 8,
              contactName: 'John Doe',
              contactEmail: 'john@jetvision.com',
              contactPhone: '+1-555-0123'
            }
          },
          id: 6
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result.content[0].text).toContain('Charter request created');
    });

    test('validates required fields', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'create-charter-request',
            arguments: {
              aircraftId: 'ACF123'
              // Missing required fields
            }
          },
          id: 7
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('required');
    });
  });

  describe('Pricing Tool', () => {
    test('calculates pricing quote', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'get-pricing',
            arguments: {
              aircraftId: 'ACF123',
              departureAirport: 'KJFK',
              arrivalAirport: 'KLAX',
              departureDate: '2024-03-15',
              passengers: 8,
              includeAllFees: true
            }
          },
          id: 8
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result.content[0].text).toContain('Pricing quote');
      expect(response.body.result.content[0].text).toContain('Total cost');
    });

    test('handles round-trip pricing', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'get-pricing',
            arguments: {
              aircraftId: 'ACF123',
              departureAirport: 'KJFK',
              arrivalAirport: 'KLAX',
              departureDate: '2024-03-15',
              returnDate: '2024-03-18',
              passengers: 8
            }
          },
          id: 9
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result.content[0].text).toContain('Round-trip');
    });
  });

  describe('Booking Management Tool', () => {
    test('confirms booking', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'manage-booking',
            arguments: {
              bookingId: 'BKG123456',
              action: 'confirm',
              paymentMethod: 'wire_transfer'
            }
          },
          id: 10
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result.content[0].text).toContain('Booking confirmed');
    });

    test('cancels booking', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'manage-booking',
            arguments: {
              bookingId: 'BKG123456',
              action: 'cancel',
              cancellationReason: 'Client request'
            }
          },
          id: 11
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result.content[0].text).toContain('Booking cancelled');
    });
  });

  describe('Operator Info Tool', () => {
    test('retrieves operator information', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'get-operator-info',
            arguments: {
              operatorId: 'OP789'
            }
          },
          id: 12
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result.content[0].text).toContain('Operator information');
      expect(response.body.result.content[0].text).toContain('Safety rating');
    });
  });

  describe('Error Handling', () => {
    test('handles unknown tools', async () => {
      const response = await request(app)
        .post('/mcp')
        .set('mcp-session-id', sessionId)
        .send({
          jsonrpc: '2.0',
          method: 'tools/call',
          params: {
            name: 'non-existent-tool',
            arguments: {}
          },
          id: 13
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error.message).toContain('Unknown tool');
    });
  });

  describe('SSE Streaming', () => {
    test('establishes SSE connection', (done) => {
      const req = request(app)
        .get('/mcp')
        .set('mcp-session-id', sessionId)
        .set('Accept', 'text/event-stream');

      let messageCount = 0;
      
      req.on('response', (res) => {
        expect(res.headers['content-type']).toContain('text/event-stream');
        
        res.on('data', (chunk: any) => {
          const data = chunk.toString();
          if (data.includes('SSE Connection established')) {
            messageCount++;
          }
          if (messageCount > 0) {
            done();
          }
        });
      });
    });
  });
});