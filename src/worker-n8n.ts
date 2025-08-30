/**
 * N8N-Compatible Cloudflare Worker for Avainode MCP Server
 */
/// <reference types="@cloudflare/workers-types" />

import { AvainodeTools } from './avainode-tools-worker';
import {
  handleSchedAeroList,
  handleSchedAeroOperation,
  handlePaynodeList,
  handlePaynodeOperation,
  handleAllServices
} from './api-endpoints-worker';

export interface Env {
  AVAINODE_API_KEY: string;
  SESSIONS: KVNamespace;
  NODE_ENV: string;
  LOG_LEVEL: string;
  USE_MOCK_DATA?: string;
  USE_SUPABASE_MOCK?: string;
  SUPABASE_URL?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-API-Key, mcp-session-id',
  'Access-Control-Max-Age': '86400',
};

// Get all available Avainode tools
function getTools() {
  return [
    {
      name: "search-aircraft",
      description: "Search for available aircraft based on route and requirements",
      inputSchema: {
        type: "object",
        properties: {
          departureAirport: { type: "string", description: "ICAO airport code (e.g., KJFK)" },
          arrivalAirport: { type: "string", description: "ICAO airport code (e.g., KLAX)" },
          departureDate: { type: "string", description: "Date in YYYY-MM-DD format" },
          returnDate: { type: "string", description: "Return date for round trips (optional)" },
          passengers: { type: "number", description: "Number of passengers" },
          aircraftCategory: { type: "string", description: "Aircraft category (Light Jet, Midsize Jet, etc.)" },
          maxPrice: { type: "number", description: "Maximum hourly rate" },
          petFriendly: { type: "boolean", description: "Require pet-friendly aircraft" },
          wifiRequired: { type: "boolean", description: "Require WiFi availability" }
        },
        required: ["departureAirport", "arrivalAirport", "departureDate", "passengers"]
      }
    },
    {
      name: "create-charter-request",
      description: "Submit a charter request for a specific aircraft",
      inputSchema: {
        type: "object",
        properties: {
          aircraftId: { type: "string", description: "Aircraft ID from search results" },
          departureAirport: { type: "string", description: "ICAO airport code" },
          arrivalAirport: { type: "string", description: "ICAO airport code" },
          departureDate: { type: "string", description: "Departure date (YYYY-MM-DD)" },
          departureTime: { type: "string", description: "Departure time (HH:MM)" },
          passengers: { type: "number", description: "Number of passengers" },
          contactName: { type: "string", description: "Primary contact name" },
          contactEmail: { type: "string", description: "Contact email address" },
          contactPhone: { type: "string", description: "Contact phone number" },
          company: { type: "string", description: "Company name (optional)" },
          specialRequests: { type: "string", description: "Special requirements (optional)" }
        },
        required: ["aircraftId", "departureAirport", "arrivalAirport", "departureDate", "departureTime", "passengers", "contactName", "contactEmail", "contactPhone"]
      }
    },
    {
      name: "get-pricing",
      description: "Generate a detailed pricing quote for a charter flight",
      inputSchema: {
        type: "object",
        properties: {
          aircraftId: { type: "string", description: "Aircraft ID" },
          departureAirport: { type: "string", description: "ICAO airport code" },
          arrivalAirport: { type: "string", description: "ICAO airport code" },
          departureDate: { type: "string", description: "Departure date (YYYY-MM-DD)" },
          departureTime: { type: "string", description: "Departure time (HH:MM)" },
          returnDate: { type: "string", description: "Return date for round trips (optional)" },
          returnTime: { type: "string", description: "Return time (HH:MM, optional)" },
          passengers: { type: "number", description: "Number of passengers" },
          includeAllFees: { type: "boolean", description: "Include all fees in quote (default: true)" }
        },
        required: ["aircraftId", "departureAirport", "arrivalAirport", "departureDate", "passengers"]
      }
    },
    {
      name: "manage-booking",
      description: "Manage existing bookings (confirm, cancel, get details, modify)",
      inputSchema: {
        type: "object",
        properties: {
          bookingId: { type: "string", description: "Booking ID" },
          action: { type: "string", enum: ["confirm", "cancel", "get_details", "modify"], description: "Action to perform" },
          paymentMethod: { type: "string", description: "Payment method for confirmation" },
          cancellationReason: { type: "string", description: "Reason for cancellation" },
          modifications: { type: "object", description: "Modifications to the booking" }
        },
        required: ["bookingId", "action"]
      }
    },
    {
      name: "get-operator-info",
      description: "Retrieve detailed information about an aircraft operator",
      inputSchema: {
        type: "object",
        properties: {
          operatorId: { type: "string", description: "Operator ID" },
          includeFleetDetails: { type: "boolean", description: "Include detailed fleet information (default: false)" },
          includeSafetyRecords: { type: "boolean", description: "Include safety records (default: true)" }
        },
        required: ["operatorId"]
      }
    },
    {
      name: "get-empty-legs",
      description: "Search for discounted empty leg flights",
      inputSchema: {
        type: "object",
        properties: {
          departureAirport: { type: "string", description: "Departure airport filter (optional)" },
          arrivalAirport: { type: "string", description: "Arrival airport filter (optional)" },
          startDate: { type: "string", description: "Start date for search range (optional)" },
          endDate: { type: "string", description: "End date for search range (optional)" },
          maxPrice: { type: "number", description: "Maximum price filter (optional)" }
        }
      }
    },
    {
      name: "get-fleet-utilization",
      description: "Get fleet utilization statistics and aircraft status",
      inputSchema: {
        type: "object",
        properties: {
          operatorId: { type: "string", description: "Operator ID (defaults to OP001)" },
          startDate: { type: "string", description: "Start date for report (optional)" },
          endDate: { type: "string", description: "End date for report (optional)" }
        }
      }
    },
    {
      name: "search-operators",
      description: "Search for certified charter operators",
      inputSchema: {
        type: "object",
        properties: {
          location: { type: "string" },
          certifications: { type: "array", items: { type: "string" } },
          fleetSize: { type: "number" },
          rating: { type: "number" }
        }
      }
    },
    {
      name: "get-airport-info",
      description: "Get detailed airport information",
      inputSchema: {
        type: "object",
        properties: {
          airportCode: { type: "string", description: "ICAO or IATA code" }
        },
        required: ["airportCode"]
      }
    },
    {
      name: "calculate-flight-time",
      description: "Calculate estimated flight time between airports",
      inputSchema: {
        type: "object",
        properties: {
          departureAirport: { type: "string" },
          arrivalAirport: { type: "string" },
          aircraftType: { type: "string" }
        },
        required: ["departureAirport", "arrivalAirport", "aircraftType"]
      }
    },
    {
      name: "get-fuel-prices",
      description: "Get current fuel prices at an airport",
      inputSchema: {
        type: "object",
        properties: {
          airportCode: { type: "string" }
        },
        required: ["airportCode"]
      }
    },
    {
      name: "search-empty-legs",
      description: "Search for discounted empty leg flights",
      inputSchema: {
        type: "object",
        properties: {
          departureRegion: { type: "string" },
          arrivalRegion: { type: "string" },
          dateRange: { type: "string" },
          maxPrice: { type: "number" }
        }
      }
    },
    {
      name: "get-weather-briefing",
      description: "Get aviation weather briefing for an airport",
      inputSchema: {
        type: "object",
        properties: {
          airportCode: { type: "string" },
          date: { type: "string" }
        },
        required: ["airportCode", "date"]
      }
    },
    {
      name: "get-slot-availability",
      description: "Check airport slot availability",
      inputSchema: {
        type: "object",
        properties: {
          airportCode: { type: "string" },
          date: { type: "string" },
          timeWindow: { type: "string" }
        },
        required: ["airportCode", "date"]
      }
    }
  ];
}

async function handleMcpRequest(request: Request, env: Env): Promise<Response> {
  try {
    const body = await request.json() as any;
    const method = body.method;
    const sessionId = request.headers.get('mcp-session-id');

    // Initialize Avainode tools
    const avainodeTools = new AvainodeTools(
      env.AVAINODE_API_KEY,
      env.USE_MOCK_DATA === 'true' || !env.AVAINODE_API_KEY
    );

    switch (method) {
      case 'initialize': {
        // Generate or use existing session ID
        const newSessionId = sessionId || crypto.randomUUID();
        
        // Store session in KV if not exists
        if (!sessionId) {
          await env.SESSIONS.put(newSessionId, JSON.stringify({
            created: new Date().toISOString(),
            protocolVersion: body.params?.protocolVersion || '1.0.0',
            clientInfo: body.params?.clientInfo || {},
          }), {
            expirationTtl: 3600, // 1 hour
          });
        }

        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          result: {
            protocolVersion: '1.0.0',
            serverInfo: {
              name: 'avainode-mcp-server',
              version: '1.0.0',
            },
            capabilities: {
              tools: true,
              logging: true,
            },
            sessionId: newSessionId,
          },
          id: body.id,
        }), {
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'mcp-session-id': newSessionId,
          },
        });
      }

      case 'tools/list': {
        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          result: {
            tools: getTools(),
          },
          id: body.id,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'tools/call': {
        const { name, arguments: args } = body.params || {};
        
        if (!name) {
          throw new Error('Tool name is required');
        }

        const result = await avainodeTools.handleToolCall({
          params: {
            name,
            arguments: args || {},
          },
        } as any);

        return new Response(JSON.stringify({
          jsonrpc: '2.0',
          result,
          id: body.id,
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default: {
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
      }
    }
  } catch (error) {
    console.error('MCP Request Error:', error);
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error',
      },
      id: null,
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleHealth(env: Env): Promise<Response> {
  const useMockData = !env.AVAINODE_API_KEY || env.USE_MOCK_DATA === 'true';
  
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'avainode-mcp-server-n8n',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    mode: useMockData ? 'mock' : 'production',
    environment: env.NODE_ENV || 'production',
    endpoints: {
      mcp: '/mcp',
      health: '/health',
      api: '/api'
    }
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleApiToolsList(): Promise<Response> {
  const tools = [
    {
      name: "search-aircraft",
      description: "Search for available aircraft based on route and requirements",
      parameters: ["departureAirport", "arrivalAirport", "departureDate", "passengers", "aircraftCategory", "maxPrice"]
    },
    {
      name: "create-charter-request",
      description: "Submit a charter request for a specific aircraft",
      parameters: ["aircraftId", "departureAirport", "arrivalAirport", "departureDate", "departureTime", "passengers", "contactName", "contactEmail", "contactPhone"]
    },
    {
      name: "get-pricing",
      description: "Generate a detailed pricing quote for a charter flight",
      parameters: ["aircraftId", "departureAirport", "arrivalAirport", "departureDate", "passengers"]
    },
    {
      name: "manage-booking",
      description: "Manage existing bookings",
      parameters: ["bookingId", "action"]
    },
    {
      name: "get-operator-info",
      description: "Retrieve detailed information about an aircraft operator",
      parameters: ["operatorId"]
    },
    {
      name: "get-empty-legs",
      description: "Search for discounted empty leg flights",
      parameters: ["departureAirport", "arrivalAirport", "startDate", "endDate"]
    },
    {
      name: "get-fleet-utilization",
      description: "Get fleet utilization statistics and aircraft status",
      parameters: ["operatorId", "startDate", "endDate"]
    }
  ];

  return new Response(JSON.stringify({
    success: true,
    tools: tools,
    count: tools.length
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleApiToolExecution(toolName: string, request: Request, env: Env): Promise<Response> {
  try {
    const args = await request.json();
    
    const avainodeTools = new AvainodeTools(
      env.AVAINODE_API_KEY,
      env.USE_MOCK_DATA === 'true' || !env.AVAINODE_API_KEY
    );

    const result = await avainodeTools.handleToolCall({
      params: {
        name: toolName,
        arguments: args
      }
    } as any);

    return new Response(JSON.stringify({
      success: true,
      tool: toolName,
      result: result,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(`Tool execution error for ${toolName}:`, error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      tool: toolName,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

async function handleOperationalData(request: Request, env: Env): Promise<Response> {
  try {
    const { dataType = "fleet-utilization", ...params } = await request.json();
    
    const avainodeTools = new AvainodeTools(
      env.AVAINODE_API_KEY,
      env.USE_MOCK_DATA === 'true' || !env.AVAINODE_API_KEY
    );
    
    let result;
    switch (dataType) {
      case "fleet-utilization":
        result = await avainodeTools.handleToolCall({
          params: {
            name: "get-fleet-utilization",
            arguments: params
          }
        } as any);
        break;
        
      case "empty-legs":
        result = await avainodeTools.handleToolCall({
          params: {
            name: "get-empty-legs",
            arguments: params
          }
        } as any);
        break;
        
      default:
        throw new Error(`Unknown data type: ${dataType}`);
    }

    return new Response(JSON.stringify({
      success: true,
      dataType: dataType,
      result: result,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Operational data error:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Export worker
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    console.log(`[${method}] ${path}`);

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Route requests
    if (path === '/health') {
      return handleHealth(env);
    }
    
    if (path === '/api/tools' && method === 'GET') {
      return handleApiToolsList();
    }
    
    if (path.startsWith('/api/tools/') && method === 'POST') {
      const toolName = path.substring(11); // Remove '/api/tools/'
      return handleApiToolExecution(toolName, request, env);
    }
    
    if (path === '/api/operational-data' && method === 'POST') {
      return handleOperationalData(request, env);
    }
    
    // SchedAero endpoints
    if (path === '/api/schedaero' && method === 'GET') {
      return handleSchedAeroList();
    }
    
    if (path.startsWith('/api/schedaero/') && method === 'POST') {
      const operation = path.substring(15); // Remove '/api/schedaero/'
      return handleSchedAeroOperation(operation, request);
    }
    
    // Paynode endpoints
    if (path === '/api/paynode' && method === 'GET') {
      return handlePaynodeList();
    }
    
    if (path.startsWith('/api/paynode/') && method === 'POST') {
      const operation = path.substring(13); // Remove '/api/paynode/'
      return handlePaynodeOperation(operation, request);
    }
    
    // Combined services endpoint
    if (path === '/api/services' && method === 'GET') {
      return handleAllServices();
    }

    switch (path) {
      
      case '/mcp':
      case '/':
        if (method === 'POST') {
          return handleMcpRequest(request, env);
        }
        break;
        
      case '/mcp/initialize':
        if (method === 'POST') {
          const body = await request.json();
          const newRequest = new Request(request.url.replace('/mcp/initialize', '/mcp'), {
            method: 'POST',
            headers: request.headers,
            body: JSON.stringify({ ...body, method: 'initialize' }),
          });
          return handleMcpRequest(newRequest, env);
        }
        break;
        
      case '/mcp/tools/list':
        if (method === 'POST') {
          const body = await request.json();
          const newRequest = new Request(request.url.replace('/mcp/tools/list', '/mcp'), {
            method: 'POST',
            headers: request.headers,
            body: JSON.stringify({ ...body, method: 'tools/list' }),
          });
          return handleMcpRequest(newRequest, env);
        }
        break;
        
      case '/mcp/tools/call':
        if (method === 'POST') {
          const body = await request.json();
          const newRequest = new Request(request.url.replace('/mcp/tools/call', '/mcp'), {
            method: 'POST',
            headers: request.headers,
            body: JSON.stringify({ ...body, method: 'tools/call' }),
          });
          return handleMcpRequest(newRequest, env);
        }
        break;
    }

    return new Response('Not Found', {
      status: 404,
      headers: corsHeaders,
    });
  },
};