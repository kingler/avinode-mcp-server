/**
 * Cloudflare Worker adapter for Avainode MCP Server
 */
/// <reference types="@cloudflare/workers-types" />

import { Router } from 'itty-router';
import { AvainodeTools } from './avainode-tools';

export interface Env {
  AVAINODE_API_KEY: string;
  SESSIONS: KVNamespace;
  NODE_ENV: string;
  LOG_LEVEL: string;
  USE_MOCK_DATA?: string;
}

const router = Router();

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, mcp-session-id',
  'Access-Control-Max-Age': '86400',
};

// Initialize Avainode tools
let avainodeTools: AvainodeTools;

// Handle OPTIONS requests for CORS
router.options('*', () => {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
});

// MCP initialize endpoint
router.post('/mcp/initialize', async (request: Request, env: Env) => {
  const body = await request.json() as any;
  
  // Generate session ID
  const sessionId = crypto.randomUUID();
  
  // Store session in KV
  await env.SESSIONS.put(sessionId, JSON.stringify({
    created: new Date().toISOString(),
    protocolVersion: body.params?.protocolVersion || '0.1.0',
    clientInfo: body.params?.clientInfo || {},
  }), {
    expirationTtl: 3600 // 1 hour TTL
  });

  const response = {
    jsonrpc: '2.0',
    result: {
      protocolVersion: '0.1.0',
      serverInfo: {
        name: 'avainode-mcp-server',
        version: '1.0.0',
      },
      capabilities: {
        tools: {},
        logging: {},
      },
    },
    id: body.id,
  };

  return new Response(JSON.stringify(response), {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
      'mcp-session-id': sessionId,
    },
  });
});

// MCP tools list endpoint
router.post('/mcp/tools/list', async (request: Request, env: Env) => {
  const sessionId = request.headers.get('mcp-session-id');
  
  if (!sessionId) {
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Session ID required',
      },
      id: null,
    }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const tools = [
    {
      name: 'search-aircraft',
      description: 'Search for available aircraft based on trip requirements',
      inputSchema: {
        type: 'object',
        properties: {
          departureAirport: { type: 'string' },
          arrivalAirport: { type: 'string' },
          departureDate: { type: 'string' },
          returnDate: { type: 'string' },
          passengers: { type: 'number' },
          aircraftCategory: { 
            type: 'string',
            enum: ['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet', 'Ultra Long Range']
          },
          maxPrice: { type: 'number' },
        },
        required: ['departureAirport', 'arrivalAirport', 'departureDate', 'passengers'],
      },
    },
    {
      name: 'create-charter-request',
      description: 'Submit a charter request for a specific aircraft',
      inputSchema: {
        type: 'object',
        properties: {
          aircraftId: { type: 'string' },
          departureAirport: { type: 'string' },
          arrivalAirport: { type: 'string' },
          departureDate: { type: 'string' },
          departureTime: { type: 'string' },
          passengers: { type: 'number' },
          contactName: { type: 'string' },
          contactEmail: { type: 'string' },
          contactPhone: { type: 'string' },
          specialRequests: { type: 'string' },
        },
        required: ['aircraftId', 'departureAirport', 'arrivalAirport', 'departureDate', 
                  'departureTime', 'passengers', 'contactName', 'contactEmail', 'contactPhone'],
      },
    },
    {
      name: 'get-pricing',
      description: 'Generate a detailed pricing quote for a charter flight',
      inputSchema: {
        type: 'object',
        properties: {
          aircraftId: { type: 'string' },
          departureAirport: { type: 'string' },
          arrivalAirport: { type: 'string' },
          departureDate: { type: 'string' },
          returnDate: { type: 'string' },
          passengers: { type: 'number' },
          includeAllFees: { type: 'boolean', default: true },
        },
        required: ['aircraftId', 'departureAirport', 'arrivalAirport', 'departureDate', 'passengers'],
      },
    },
    {
      name: 'manage-booking',
      description: 'Manage existing bookings (confirm, cancel, or get details)',
      inputSchema: {
        type: 'object',
        properties: {
          bookingId: { type: 'string' },
          action: { 
            type: 'string',
            enum: ['confirm', 'cancel', 'get_details', 'modify']
          },
          paymentMethod: { 
            type: 'string',
            enum: ['wire_transfer', 'credit_card', 'check']
          },
          cancellationReason: { type: 'string' },
          modifications: { type: 'object' },
        },
        required: ['bookingId', 'action'],
      },
    },
    {
      name: 'get-operator-info',
      description: 'Retrieve detailed information about an aircraft operator',
      inputSchema: {
        type: 'object',
        properties: {
          operatorId: { type: 'string' },
          includeFleetDetails: { type: 'boolean', default: false },
          includeSafetyRecords: { type: 'boolean', default: true },
        },
        required: ['operatorId'],
      },
    },
    {
      name: 'get-empty-legs',
      description: 'Search for discounted empty leg flights (repositioning flights)',
      inputSchema: {
        type: 'object',
        properties: {
          departureAirport: { type: 'string' },
          arrivalAirport: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          maxPrice: { type: 'number' },
        },
      },
    },
    {
      name: 'get-fleet-utilization',
      description: 'Get fleet utilization statistics and aircraft status for an operator',
      inputSchema: {
        type: 'object',
        properties: {
          operatorId: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
        },
      },
    },
    
    // SCHEDAERO TOOLS (6)
    {
      name: 'search-maintenance-facilities',
      description: 'Search for maintenance facilities',
      inputSchema: {
        type: 'object',
        properties: {
          location: { type: 'string' },
          certifications: { type: 'string' },
          capabilities: { type: 'string' },
        },
      },
    },
    {
      name: 'search-crew',
      description: 'Search for available crew members',
      inputSchema: {
        type: 'object',
        properties: {
          aircraftType: { type: 'string' },
          qualifications: { type: 'string' },
          availability: { type: 'string' },
          location: { type: 'string' },
        },
      },
    },
    {
      name: 'create-maintenance-schedule',
      description: 'Schedule aircraft maintenance',
      inputSchema: {
        type: 'object',
        properties: {
          aircraftId: { type: 'string' },
          facilityId: { type: 'string' },
          maintenanceType: { type: 'string' },
          scheduledDate: { type: 'string' },
          estimatedHours: { type: 'number' },
        },
        required: ['aircraftId', 'facilityId', 'maintenanceType', 'scheduledDate'],
      },
    },
    {
      name: 'create-flight-schedule',
      description: 'Create a flight schedule',
      inputSchema: {
        type: 'object',
        properties: {
          aircraftId: { type: 'string' },
          crewIds: { type: 'array' },
          departureAirport: { type: 'string' },
          arrivalAirport: { type: 'string' },
          departureTime: { type: 'string' },
          passengers: { type: 'number' },
        },
        required: ['aircraftId', 'crewIds', 'departureAirport', 'arrivalAirport', 'departureTime'],
      },
    },
    {
      name: 'update-aircraft-status',
      description: 'Update aircraft operational status',
      inputSchema: {
        type: 'object',
        properties: {
          aircraftId: { type: 'string' },
          status: { type: 'string' },
          reason: { type: 'string' },
          estimatedAvailability: { type: 'string' },
        },
        required: ['aircraftId', 'status'],
      },
    },
    {
      name: 'assign-crew',
      description: 'Assign crew to a flight',
      inputSchema: {
        type: 'object',
        properties: {
          flightId: { type: 'string' },
          crewAssignments: { type: 'object' },
        },
        required: ['flightId', 'crewAssignments'],
      },
    },
    
    // PAYNODE TOOLS (8)
    {
      name: 'create-invoice',
      description: 'Create a new invoice',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: { type: 'string' },
          customerAccountId: { type: 'string' },
          lineItems: { type: 'array' },
          dueDate: { type: 'string' },
          currency: { type: 'string' },
        },
        required: ['accountId', 'customerAccountId', 'lineItems', 'currency'],
      },
    },
    {
      name: 'process-payment',
      description: 'Process a payment',
      inputSchema: {
        type: 'object',
        properties: {
          invoiceId: { type: 'string' },
          paymentMethodId: { type: 'string' },
          amount: { type: 'number' },
          currency: { type: 'string' },
        },
        required: ['invoiceId', 'paymentMethodId', 'amount', 'currency'],
      },
    },
    {
      name: 'create-refund',
      description: 'Create a refund for a transaction',
      inputSchema: {
        type: 'object',
        properties: {
          transactionId: { type: 'string' },
          amount: { type: 'number' },
          reason: { type: 'string' },
        },
        required: ['transactionId', 'amount', 'reason'],
      },
    },
    {
      name: 'get-account-balance',
      description: 'Get account balance and pending transactions',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: { type: 'string' },
        },
        required: ['accountId'],
      },
    },
    {
      name: 'get-transaction-history',
      description: 'Get transaction history for an account',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          transactionType: { type: 'string' },
        },
        required: ['accountId'],
      },
    },
    {
      name: 'add-payment-method',
      description: 'Add a new payment method',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: { type: 'string' },
          methodType: { type: 'string' },
          methodDetails: { type: 'object' },
        },
        required: ['accountId', 'methodType', 'methodDetails'],
      },
    },
    {
      name: 'create-payout',
      description: 'Create a payout to a bank account',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: { type: 'string' },
          amount: { type: 'number' },
          currency: { type: 'string' },
          bankDetails: { type: 'object' },
        },
        required: ['accountId', 'amount', 'currency', 'bankDetails'],
      },
    },
    {
      name: 'generate-statement',
      description: 'Generate an account statement',
      inputSchema: {
        type: 'object',
        properties: {
          accountId: { type: 'string' },
          startDate: { type: 'string' },
          endDate: { type: 'string' },
          format: { type: 'string' },
        },
        required: ['accountId', 'startDate', 'endDate'],
      },
    },
  ];

  const body = await request.json() as any;

  return new Response(JSON.stringify({
    jsonrpc: '2.0',
    result: { tools },
    id: body.id,
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

// MCP tool call endpoint
router.post('/mcp/tools/call', async (request: Request, env: Env) => {
  const sessionId = request.headers.get('mcp-session-id');
  
  if (!sessionId) {
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32000,
        message: 'Session ID required',
      },
      id: null,
    }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  const body = await request.json() as any;
  
  // Initialize Avainode tools with API key from environment
  if (!avainodeTools) {
    // Set environment variable for the tools to use
    (globalThis as any).AVAINODE_API_KEY = env.AVAINODE_API_KEY;
    avainodeTools = new AvainodeTools();
  }

  try {
    const result = await avainodeTools.handleToolCall({
      method: 'tools/call',
      params: body.params,
    });

    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      result,
      id: body.id,
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error',
      },
      id: body.id,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Simplified MCP endpoint that routes based on method
router.post('/mcp', async (request: Request, env: Env) => {
  const body = await request.json() as any;
  const method = body.method;

  if (method === 'initialize') {
    return router.handle(new Request(new URL('/mcp/initialize', request.url), {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(body),
    }), env);
  } else if (method === 'tools/list') {
    return router.handle(new Request(new URL('/mcp/tools/list', request.url), {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(body),
    }), env);
  } else if (method === 'tools/call') {
    return router.handle(new Request(new URL('/mcp/tools/call', request.url), {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify(body),
    }), env);
  }

  return new Response(JSON.stringify({
    jsonrpc: '2.0',
    error: {
      code: -32601,
      message: `Method not found: ${method}`,
    },
    id: body.id,
  }), {
    status: 404,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

// Health check endpoint
router.get('/health', () => {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'avainode-mcp-server',
    timestamp: new Date().toISOString(),
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});

// 404 handler
router.all('*', () => {
  return new Response('Not Found', {
    status: 404,
    headers: corsHeaders,
  });
});

// Export worker
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    // Set environment variables for tools to use
    if (env.AVAINODE_API_KEY) {
      process.env.AVAINODE_API_KEY = env.AVAINODE_API_KEY;
    }
    if (env.USE_MOCK_DATA) {
      process.env.USE_MOCK_DATA = env.USE_MOCK_DATA;
    }
    return router.handle(request, env, ctx);
  },
};