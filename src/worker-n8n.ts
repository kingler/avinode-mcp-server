/**
 * N8N-Compatible Cloudflare Worker for Avainode MCP Server
 */
/// <reference types="@cloudflare/workers-types" />

import { AvainodeTools } from './avainode-tools-worker';

export interface Env {
  AVAINODE_API_KEY: string;
  SESSIONS: KVNamespace;
  NODE_ENV: string;
  LOG_LEVEL: string;
  USE_MOCK_DATA?: string;
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
          departureAirport: { type: "string", description: "ICAO or IATA code" },
          arrivalAirport: { type: "string", description: "ICAO or IATA code" },
          departureDate: { type: "string", description: "Date in YYYY-MM-DD format" },
          passengers: { type: "number", description: "Number of passengers" },
          aircraftType: { type: "string", description: "Type of aircraft (e.g., Light Jet, Heavy Jet)" },
          maxRange: { type: "number", description: "Maximum range in nautical miles" },
          maxPrice: { type: "number", description: "Maximum hourly rate" }
        },
        required: ["departureAirport", "arrivalAirport", "departureDate", "passengers"]
      }
    },
    {
      name: "get-aircraft-availability",
      description: "Check availability of a specific aircraft",
      inputSchema: {
        type: "object",
        properties: {
          aircraftId: { type: "string" },
          startDate: { type: "string" },
          endDate: { type: "string" }
        },
        required: ["aircraftId", "startDate", "endDate"]
      }
    },
    {
      name: "request-charter-quote",
      description: "Request a detailed charter quote",
      inputSchema: {
        type: "object",
        properties: {
          aircraftId: { type: "string" },
          departureAirport: { type: "string" },
          arrivalAirport: { type: "string" },
          departureDate: { type: "string" },
          returnDate: { type: "string" },
          passengers: { type: "number" },
          specialRequests: { type: "string" }
        },
        required: ["aircraftId", "departureAirport", "arrivalAirport", "departureDate", "passengers"]
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

async function handleHealth(): Promise<Response> {
  return new Response(JSON.stringify({
    status: 'healthy',
    service: 'avainode-mcp-server-n8n',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: getTools().length,
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
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
    switch (path) {
      case '/health':
        return handleHealth();
      
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