/**
 * MCP Server with HTTP Streaming Transport
 * Implements NDJSON (newline-delimited JSON) streaming for N8N compatibility
 * Uses HTTP streaming (not SSE) as per N8N's httpStreamable transport requirements
 */
/// <reference types="@cloudflare/workers-types" />

import { AvainodeTools } from './avainode-tools';
import { SchedAeroMockClient } from './mock/schedaero-mock-client';
import { PaynodeMockClient } from './mock/paynode-mock-client';
import { AvinodeSupabaseMockClient } from './mock/avinode-supabase-client';
import { SchedAeroSupabaseMockClient } from './mock/schedaero-supabase-client';
import { PaynodeSupabaseMockClient } from './mock/paynode-supabase-client';
import { createSupabaseClient } from './lib/supabase';
import { getProcessedAircraftData } from './lib/opensky-integration';
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

// Get all available tools (Avinode + SchedAero + Paynode)
function getTools() {
  return [
    // AVINODE TOOLS (7)
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
    
    // SCHEDAERO TOOLS (6)
    {
      name: "search-maintenance-facilities",
      description: "Search for maintenance facilities",
      inputSchema: {
        type: "object",
        properties: {
          location: { type: "string", description: "Location/airport code" },
          certifications: { type: "string", description: "Required certifications" },
          capabilities: { type: "string", description: "Required maintenance capabilities" }
        }
      }
    },
    {
      name: "search-crew",
      description: "Search for available crew members",
      inputSchema: {
        type: "object",
        properties: {
          aircraftType: { type: "string", description: "Aircraft type" },
          qualifications: { type: "string", description: "Required qualifications" },
          availability: { type: "string", description: "Availability date range" },
          location: { type: "string", description: "Location/base airport" }
        }
      }
    },
    {
      name: "create-maintenance-schedule",
      description: "Schedule aircraft maintenance",
      inputSchema: {
        type: "object",
        properties: {
          aircraftId: { type: "string", description: "Aircraft ID" },
          facilityId: { type: "string", description: "Maintenance facility ID" },
          maintenanceType: { type: "string", description: "Type of maintenance" },
          scheduledDate: { type: "string", description: "Scheduled date (YYYY-MM-DD)" },
          estimatedHours: { type: "number", description: "Estimated maintenance hours" }
        },
        required: ["aircraftId", "facilityId", "maintenanceType", "scheduledDate"]
      }
    },
    {
      name: "create-flight-schedule",
      description: "Create a flight schedule",
      inputSchema: {
        type: "object",
        properties: {
          aircraftId: { type: "string", description: "Aircraft ID" },
          crewIds: { type: "array", description: "Array of crew member IDs" },
          departureAirport: { type: "string", description: "ICAO departure airport code" },
          arrivalAirport: { type: "string", description: "ICAO arrival airport code" },
          departureTime: { type: "string", description: "Departure time (YYYY-MM-DD HH:MM)" },
          passengers: { type: "number", description: "Number of passengers" }
        },
        required: ["aircraftId", "crewIds", "departureAirport", "arrivalAirport", "departureTime"]
      }
    },
    {
      name: "update-aircraft-status",
      description: "Update aircraft operational status",
      inputSchema: {
        type: "object",
        properties: {
          aircraftId: { type: "string", description: "Aircraft ID" },
          status: { type: "string", description: "New status (available, maintenance, in-flight, etc.)" },
          reason: { type: "string", description: "Reason for status change" },
          estimatedAvailability: { type: "string", description: "Estimated availability date (YYYY-MM-DD)" }
        },
        required: ["aircraftId", "status"]
      }
    },
    {
      name: "assign-crew",
      description: "Assign crew to a flight",
      inputSchema: {
        type: "object",
        properties: {
          flightId: { type: "string", description: "Flight ID" },
          crewAssignments: { type: "object", description: "Crew assignments object with roles and crew IDs" }
        },
        required: ["flightId", "crewAssignments"]
      }
    },
    
    // PAYNODE TOOLS (8)
    {
      name: "create-invoice",
      description: "Create a new invoice",
      inputSchema: {
        type: "object",
        properties: {
          accountId: { type: "string", description: "Account ID" },
          customerAccountId: { type: "string", description: "Customer account ID" },
          lineItems: { type: "array", description: "Array of line items" },
          dueDate: { type: "string", description: "Due date (YYYY-MM-DD)" },
          currency: { type: "string", description: "Currency code (USD, EUR, etc.)" }
        },
        required: ["accountId", "customerAccountId", "lineItems", "currency"]
      }
    },
    {
      name: "process-payment",
      description: "Process a payment",
      inputSchema: {
        type: "object",
        properties: {
          invoiceId: { type: "string", description: "Invoice ID" },
          paymentMethodId: { type: "string", description: "Payment method ID" },
          amount: { type: "number", description: "Payment amount" },
          currency: { type: "string", description: "Currency code" }
        },
        required: ["invoiceId", "paymentMethodId", "amount", "currency"]
      }
    },
    {
      name: "create-refund",
      description: "Create a refund for a transaction",
      inputSchema: {
        type: "object",
        properties: {
          transactionId: { type: "string", description: "Transaction ID" },
          amount: { type: "number", description: "Refund amount" },
          reason: { type: "string", description: "Reason for refund" }
        },
        required: ["transactionId", "amount", "reason"]
      }
    },
    {
      name: "get-account-balance",
      description: "Get account balance and pending transactions",
      inputSchema: {
        type: "object",
        properties: {
          accountId: { type: "string", description: "Account ID" }
        },
        required: ["accountId"]
      }
    },
    {
      name: "get-transaction-history",
      description: "Get transaction history for an account",
      inputSchema: {
        type: "object",
        properties: {
          accountId: { type: "string", description: "Account ID" },
          startDate: { type: "string", description: "Start date (YYYY-MM-DD)" },
          endDate: { type: "string", description: "End date (YYYY-MM-DD)" },
          transactionType: { type: "string", description: "Transaction type filter" }
        },
        required: ["accountId"]
      }
    },
    {
      name: "add-payment-method",
      description: "Add a new payment method",
      inputSchema: {
        type: "object",
        properties: {
          accountId: { type: "string", description: "Account ID" },
          methodType: { type: "string", description: "Payment method type (card, bank, etc.)" },
          methodDetails: { type: "object", description: "Payment method details" }
        },
        required: ["accountId", "methodType", "methodDetails"]
      }
    },
    {
      name: "create-payout",
      description: "Create a payout to a bank account",
      inputSchema: {
        type: "object",
        properties: {
          accountId: { type: "string", description: "Account ID" },
          amount: { type: "number", description: "Payout amount" },
          currency: { type: "string", description: "Currency code" },
          bankDetails: { type: "object", description: "Bank account details" }
        },
        required: ["accountId", "amount", "currency", "bankDetails"]
      }
    },
    {
      name: "generate-statement",
      description: "Generate an account statement",
      inputSchema: {
        type: "object",
        properties: {
          accountId: { type: "string", description: "Account ID" },
          startDate: { type: "string", description: "Start date (YYYY-MM-DD)" },
          endDate: { type: "string", description: "End date (YYYY-MM-DD)" },
          format: { type: "string", description: "Statement format (PDF, CSV, etc.)" }
        },
        required: ["accountId", "startDate", "endDate"]
      }
    }
  ];
}

/**
 * Handle MCP request and return response
 */
async function processMcpRequest(body: any, env: Env, sessionId?: string | null): Promise<any> {
  const method = body.method;
  
  // Check if we should use Supabase-backed mock data
  const useSupabaseMock = env.USE_SUPABASE_MOCK === 'true' && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY;
  const supabase = useSupabaseMock ? createSupabaseClient(env) : null;
  
  // Log configuration for debugging
  console.log(`MCP Request - USE_SUPABASE_MOCK: ${env.USE_SUPABASE_MOCK}, HAS_SUPABASE_URL: ${!!env.SUPABASE_URL}, HAS_SERVICE_KEY: ${!!env.SUPABASE_SERVICE_ROLE_KEY}, useSupabaseMock: ${useSupabaseMock}`);
  
  // Initialize Avainode tools (keeping existing for now, but will replace calls below)
  const avainodeTools = new AvainodeTools(
    env.AVAINODE_API_KEY,
    env.USE_MOCK_DATA === 'true' || !env.AVAINODE_API_KEY
  );

  switch (method) {
    case 'initialize': {
      // Generate or use existing session ID
      const newSessionId = sessionId || crypto.randomUUID();
      
      // Support both old and new protocol versions
      const clientProtocolVersion = body.params?.protocolVersion || '2025-03-26';
      const supportedProtocolVersion = clientProtocolVersion === '1.0.0' ? '1.0.0' : '2025-03-26';
      
      // Store session in KV if not exists
      if (!sessionId && env.SESSIONS) {
        await env.SESSIONS.put(newSessionId, JSON.stringify({
          created: new Date().toISOString(),
          protocolVersion: supportedProtocolVersion,
          clientInfo: body.params?.clientInfo || {},
        }), {
          expirationTtl: 3600, // 1 hour
        });
      }

      return {
        jsonrpc: '2.0',
        result: {
          protocolVersion: supportedProtocolVersion,
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

      // Map common short-form parameters to full form
      let mappedArgs = { ...(args || {}) };
      if (mappedArgs.from) mappedArgs.departureAirport = mappedArgs.from;
      if (mappedArgs.to) mappedArgs.arrivalAirport = mappedArgs.to;
      if (mappedArgs.date) mappedArgs.departureDate = mappedArgs.date;
      if (mappedArgs.customerName) mappedArgs.contactName = mappedArgs.customerName;
      if (mappedArgs.customerEmail) mappedArgs.contactEmail = mappedArgs.customerEmail;
      if (mappedArgs.customerPhone) mappedArgs.contactPhone = mappedArgs.customerPhone;
      if (mappedArgs.distance && !mappedArgs.flightHours) {
        // Estimate flight hours from distance (average 500mph)
        mappedArgs.flightHours = mappedArgs.distance / 500;
      }

      let result;

      // Route to appropriate service based on tool name
      const avainodeToolNames = [
        'search-aircraft', 'create-charter-request', 'get-pricing',
        'manage-booking', 'get-operator-info', 'get-empty-legs', 'get-fleet-utilization'
      ];
      
      const schedaeroToolNames = [
        'search-maintenance-facilities', 'search-crew', 'create-maintenance-schedule',
        'create-flight-schedule', 'update-aircraft-status', 'assign-crew'
      ];
      
      const paynodeToolNames = [
        'create-invoice', 'process-payment', 'create-refund', 'get-account-balance',
        'get-transaction-history', 'add-payment-method', 'create-payout', 'generate-statement'
      ];

      if (avainodeToolNames.includes(name)) {
        // Handle Avinode tools - use Supabase client if configured
        if (useSupabaseMock && supabase) {
          console.log('Using Supabase database for Avinode tools');
          
          // Direct Supabase database query implementation
          try {
            if (name === 'search-aircraft') {
              // First try to get any aircraft to test the connection
              const { data: aircraft, error } = await supabase
                .from('aircraft')
                .select('*')
                .limit(10);
              
              if (error) {
                console.error('Supabase query error:', error);
                throw new Error(`Database error: ${error.message}`);
              }
              
              result = {
                content: [{
                  type: "text",
                  text: `# Supabase Aircraft Search Results\n\n**Found ${aircraft?.length || 0} aircraft from database**\n\n${aircraft?.map(a => 
                    `## ${a.model} (${a.registration_number})\n` +
                    `**Operator:** ${a.operator_name}\n` +
                    `**Category:** ${a.category}\n` +
                    `**Capacity:** ${a.max_passengers} passengers\n` +
                    `**Hourly Rate:** $${a.hourly_rate}\n` +
                    `**Base:** ${a.base_airport}\n` +
                    `**Status:** ${a.availability}\n` +
                    `**Aircraft ID:** ${a.id}\n`
                  ).join('\n---\n\n') || 'No aircraft found'}`
                }]
              };
            } else if (name === 'get-empty-legs') {
              const { data: legs, error } = await supabase
                .from('flight_legs')
                .select('*')
                .eq('type', 'EmptyLeg')
                .eq('status', 'Available')
                .limit(5);
              
              if (error) {
                console.error('Supabase query error:', error);
                throw new Error(`Database error: ${error.message}`);
              }
              
              result = {
                content: [{
                  type: "text",
                  text: `# Supabase Empty Legs\n\n**Found ${legs?.length || 0} empty legs from database**\n\n${legs?.map(leg => 
                    `## ${leg.departure_airport} → ${leg.arrival_airport}\n` +
                    `**Date:** ${leg.departure_date} at ${leg.departure_time}\n` +
                    `**Price:** $${leg.price}\n` +
                    `**Aircraft:** ${leg.aircraft_id}\n` +
                    `**Flight Time:** ${leg.flight_time} hours\n`
                  ).join('\n---\n\n') || 'No empty legs found'}`
                }]
              };
            } else {
              // For other tools, fall back to mock client
              result = await avainodeTools.handleToolCall({
                params: {
                  name,
                  arguments: mappedArgs,
                },
              } as any);
            }
          } catch (dbError) {
            console.error('Database operation failed:', dbError);
            // Fall back to mock client on database errors
            result = await avainodeTools.handleToolCall({
              params: {
                name,
                arguments: mappedArgs,
              },
            } as any);
          }
        } else {
          // Use regular mock client
          result = await avainodeTools.handleToolCall({
            params: {
              name,
              arguments: mappedArgs,
            },
          } as any);
        }
      } else if (schedaeroToolNames.includes(name)) {
        // Handle SchedAero tools - use Supabase client if configured
        const schedAeroClient = useSupabaseMock && supabase 
          ? new SchedAeroSupabaseMockClient()
          : new SchedAeroMockClient();
        
        switch (name) {
          case 'search-maintenance-facilities':
            result = await schedAeroClient.searchMaintenanceFacilities(mappedArgs);
            break;
          case 'search-crew':
            result = await schedAeroClient.searchCrew(mappedArgs);
            break;
          case 'create-maintenance-schedule':
            result = await schedAeroClient.createMaintenanceSchedule(mappedArgs);
            break;
          case 'create-flight-schedule':
            result = await schedAeroClient.createFlightSchedule(mappedArgs);
            break;
          case 'update-aircraft-status':
            result = await schedAeroClient.updateAircraftStatus(mappedArgs);
            break;
          case 'assign-crew':
            result = await schedAeroClient.assignCrew(mappedArgs);
            break;
        }
      } else if (paynodeToolNames.includes(name)) {
        // Handle Paynode tools - use Supabase client if configured
        const paynodeClient = useSupabaseMock && supabase 
          ? new PaynodeSupabaseMockClient()
          : new PaynodeMockClient();
        
        switch (name) {
          case 'create-invoice':
            result = await paynodeClient.createInvoice(mappedArgs);
            break;
          case 'process-payment':
            result = await paynodeClient.processPayment(mappedArgs);
            break;
          case 'create-refund':
            result = await paynodeClient.createRefund(mappedArgs);
            break;
          case 'get-account-balance':
            result = await paynodeClient.getAccountBalance(mappedArgs);
            break;
          case 'get-transaction-history':
            result = await paynodeClient.getTransactionHistory(mappedArgs);
            break;
          case 'add-payment-method':
            result = { success: false, error: 'addPaymentMethod method not implemented' };
            break;
          case 'create-payout':
            result = { success: false, error: 'createPayout method not implemented' };
            break;
          case 'generate-statement':
            result = { success: false, error: 'generateStatement method not implemented' };
            break;
        }
      } else {
        throw new Error(`Unknown tool: ${name}`);
      }

      // Ensure result has proper MCP format
      if (result && !(result as any).content) {
        result = {
          content: [
            {
              type: "text",
              text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
            }
          ]
        };
      }

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
 * Handle HTTP streaming for MCP protocol (NDJSON or SSE format)
 * This is the main transport for N8N's httpStreamable and standard SSE
 */
async function handleHttpStream(request: Request, env: Env, useSSE = false): Promise<Response> {
  const sessionId = request.headers.get('mcp-session-id');
  
  // Create a TransformStream for NDJSON
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  // Function to send line (NDJSON or SSE format)
  const sendLine = async (data: any) => {
    let line: string;
    if (useSSE) {
      // SSE format: data: {json}\n\n
      line = `data: ${JSON.stringify(data)}\n\n`;
    } else {
      // NDJSON format: {json}\n
      line = JSON.stringify(data) + '\n';
    }
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
      'Content-Type': useSSE ? 'text/event-stream' : 'application/x-ndjson',
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
  const wantsEventStream = acceptHeader.includes('text/event-stream');
  const wantsNDJSON = acceptHeader.includes('application/x-ndjson') || 
                      acceptHeader.includes('application/ndjson') ||
                      acceptHeader.includes('text/plain'); // Some clients use text/plain for NDJSON
  const wantsStreaming = wantsEventStream || wantsNDJSON;
  
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
    // If client wants streaming (N8N httpStreamable or SSE)
    if (wantsStreaming && method === 'POST') {
      return handleHttpStream(request, env, wantsEventStream);
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
    return handleHttpStream(request, env, wantsEventStream);
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
    let args: any = await request.json();
    
    // Map common short-form parameters to full form
    if (args.from) args.departureAirport = args.from;
    if (args.to) args.arrivalAirport = args.to;
    if (args.date) args.departureDate = args.date;
    if (args.customerName) args.contactName = args.customerName;
    if (args.customerEmail) args.contactEmail = args.customerEmail;
    if (args.customerPhone) args.contactPhone = args.customerPhone;
    if (args.distance && !args.flightHours) {
      // Estimate flight hours from distance (average 500mph)
      args.flightHours = args.distance / 500;
    }
    // For pricing, if no date provided, use tomorrow
    if (toolName === 'get-pricing' && !args.departureDate) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      args.departureDate = tomorrow.toISOString().split('T')[0];
    }
    
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
  
  // Operational data endpoint
  if (path === '/api/operational-data' && method === 'POST') {
    const data: any = await request.json();
    const { category, operatorId } = data;
    
    const avainodeTools = new AvainodeTools(
      env.AVAINODE_API_KEY,
      env.USE_MOCK_DATA === 'true' || !env.AVAINODE_API_KEY
    );
    
    try {
      let result;
      if (category === 'fleet-utilization' && operatorId) {
        result = await avainodeTools.handleToolCall({
          params: {
            name: 'get-fleet-utilization',
            arguments: { operatorId }
          }
        } as any);
      } else if (category === 'empty-legs') {
        result = await avainodeTools.handleToolCall({
          params: {
            name: 'get-empty-legs',
            arguments: data
          }
        } as any);
      } else {
        throw new Error(`Unknown operational data category: ${category}`);
      }
      
      return new Response(JSON.stringify({
        success: true,
        category,
        data: result,
        timestamp: new Date().toISOString()
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        success: false,
        category,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
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