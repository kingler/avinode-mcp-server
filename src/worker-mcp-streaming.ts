/**
 * MCP Server with HTTP Streaming Transport
 * Implements NDJSON (newline-delimited JSON) streaming for N8N compatibility
 * Uses HTTP streaming (not SSE) as per N8N's httpStreamable transport requirements
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
  MCP_VERSION?: string;
}

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-API-Key, mcp-session-id, Last-Event-ID',
  'Access-Control-Max-Age': '86400',
};

// Get all available tools (same as before)
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
    }
  ];
}

/**
 * Handle MCP request and return response
 */
async function processMcpRequest(body: any, env: Env, sessionId?: string | null): Promise<any> {
  const method = body.method;
  
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
      if (!sessionId && env.SESSIONS) {
        await env.SESSIONS.put(newSessionId, JSON.stringify({
          created: new Date().toISOString(),
          protocolVersion: body.params?.protocolVersion || '1.0.0',
          clientInfo: body.params?.clientInfo || {},
        }), {
          expirationTtl: 3600, // 1 hour
        });
      }

      return {
        jsonrpc: '2.0',
        result: {
          protocolVersion: '1.0.0',
          serverInfo: {
            name: 'avainode-mcp-server',
            version: env.MCP_VERSION || '1.0.0',
          },
          capabilities: {
            tools: true,
            logging: true,
          },
          sessionId: newSessionId,
        },
        id: body.id,
      };
    }

    case 'tools/list': {
      return {
        jsonrpc: '2.0',
        result: {
          tools: getTools(),
        },
        id: body.id,
      };
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

      return {
        jsonrpc: '2.0',
        result,
        id: body.id,
      };
    }

    default: {
      return {
        jsonrpc: '2.0',
        error: {
          code: -32601,
          message: `Method not found: ${method}`,
        },
        id: body.id,
      };
    }
  }
}

/**
 * Handle HTTP streaming for MCP protocol (NDJSON format)
 * This is the main transport for N8N's httpStreamable
 */
async function handleHttpStream(request: Request, env: Env): Promise<Response> {
  const sessionId = request.headers.get('mcp-session-id');
  
  // Create a TransformStream for NDJSON
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Function to send NDJSON line
  const sendLine = async (data: any) => {
    const line = JSON.stringify(data) + '\n';
    await writer.write(encoder.encode(line));
  };

  // Handle the stream asynchronously
  const processStream = async () => {
    try {
      // For GET requests, this could be used for server-push notifications
      if (request.method === 'GET') {
        // Send initial connection message
        await sendLine({
          jsonrpc: '2.0',
          method: 'connection.established',
          params: {
            sessionId: sessionId || crypto.randomUUID(),
            timestamp: new Date().toISOString()
          }
        });
        
        // Could implement server-push notifications here
        // For now, just close after initial message
        await writer.close();
        return;
      }
      
      // For POST requests, process the incoming data
      if (request.method === 'POST') {
        const body = await request.json();
        
        // Handle batch or single requests
        const requests = Array.isArray(body) ? body : [body];
        
        for (const req of requests) {
          try {
            // Optionally send progress updates for long-running operations
            if (req.method === 'tools/call') {
              // Send progress notification
              await sendLine({
                jsonrpc: '2.0',
                method: 'progress.update',
                params: {
                  requestId: req.id,
                  message: 'Processing tool call...',
                  progress: 0.5
                }
              });
            }
            
            // Process the actual request
            const response = await processMcpRequest(req, env, sessionId);
            
            // Send the response
            await sendLine(response);
            
          } catch (error) {
            // Send error response
            await sendLine({
              jsonrpc: '2.0',
              error: {
                code: -32603,
                message: error instanceof Error ? error.message : 'Internal error',
              },
              id: req.id || null,
            });
          }
        }
      }
      
      // Close the stream
      await writer.close();
    } catch (error) {
      console.error('HTTP Stream error:', error);
      
      // Try to send error before closing
      try {
        await sendLine({
          jsonrpc: '2.0',
          error: {
            code: -32603,
            message: error instanceof Error ? error.message : 'Stream processing error',
          },
          id: null,
        });
      } catch (e) {
        // Ignore errors when writing error message
      }
      
      await writer.close();
    }
  };

  // Start processing in background
  processStream();

  // Return streaming response immediately
  return new Response(readable, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/x-ndjson',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Transfer-Encoding': 'chunked',
      'X-Accel-Buffering': 'no', // Disable proxy buffering
      ...(sessionId ? { 'Mcp-Session-Id': sessionId } : {}),
    },
  });
}


/**
 * Main request handler
 */
async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname;
  const method = request.method;
  
  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  // Check Accept header to determine response format
  const acceptHeader = request.headers.get('Accept') || '';
  const wantsNDJSON = acceptHeader.includes('application/x-ndjson') || 
                      acceptHeader.includes('application/ndjson') ||
                      acceptHeader.includes('text/plain'); // Some clients use text/plain for NDJSON
  
  // Handle different endpoints
  if (path === '/health') {
    return new Response(JSON.stringify({
      status: 'healthy',
      service: 'avainode-mcp-server',
      timestamp: new Date().toISOString(),
      version: env.MCP_VERSION || '1.0.0',
      transports: ['http-streaming', 'ndjson', 'json'],
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  // MCP endpoints
  if (path === '/mcp' || path === '/') {
    // If client wants NDJSON streaming (N8N httpStreamable)
    if (wantsNDJSON && method === 'POST') {
      return handleHttpStream(request, env);
    }
    
    // Default to regular JSON response for POST
    if (method === 'POST') {
      try {
        const sessionId = request.headers.get('mcp-session-id');
        const body = await request.json();
        const response = await processMcpRequest(body, env, sessionId);
        
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            ...(response.result?.sessionId ? { 'Mcp-Session-Id': response.result.sessionId } : {}),
          },
        });
      } catch (error) {
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
  }
  
  // HTTP streaming endpoint (explicit)
  if (path === '/stream' && method === 'POST') {
    return handleHttpStream(request, env);
  }
  
  // REST API endpoints (keep existing functionality)
  if (path === '/api/tools' && method === 'GET') {
    return new Response(JSON.stringify({
      success: true,
      tools: getTools().map(t => ({
        name: t.name,
        description: t.description,
        parameters: Object.keys(t.inputSchema.properties || {})
      })),
      count: getTools().length
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
  
  if (path.startsWith('/api/tools/') && method === 'POST') {
    const toolName = path.substring(11);
    const args = await request.json();
    
    const avainodeTools = new AvainodeTools(
      env.AVAINODE_API_KEY,
      env.USE_MOCK_DATA === 'true' || !env.AVAINODE_API_KEY
    );

    try {
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
      return new Response(JSON.stringify({
        success: false,
        tool: toolName,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
  
  // SchedAero endpoints
  if (path === '/api/schedaero' && method === 'GET') {
    return handleSchedAeroList();
  }
  
  if (path.startsWith('/api/schedaero/') && method === 'POST') {
    const operation = path.substring(15);
    return handleSchedAeroOperation(operation, request);
  }
  
  // Paynode endpoints
  if (path === '/api/paynode' && method === 'GET') {
    return handlePaynodeList();
  }
  
  if (path.startsWith('/api/paynode/') && method === 'POST') {
    const operation = path.substring(13);
    return handlePaynodeOperation(operation, request);
  }
  
  // Combined services endpoint
  if (path === '/api/services' && method === 'GET') {
    return handleAllServices();
  }
  
  return new Response('Not Found', {
    status: 404,
    headers: corsHeaders,
  });
}

// Export worker
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    return handleRequest(request, env);
  },
};