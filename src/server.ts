import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  Notification,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  LoggingMessageNotification,
  JSONRPCNotification,
  JSONRPCError,
  InitializeRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { AvainodeTools } from "./avainode-tools";

const SESSION_ID_HEADER_NAME = "mcp-session-id";
const JSON_RPC = "2.0";

export class MCPServer {
  server: Server;
  transports: { [sessionId: string]: StreamableHTTPServerTransport } = {};
  private avainodeTools: AvainodeTools;

  constructor(server: Server) {
    this.server = server;
    this.avainodeTools = new AvainodeTools();
    this.setupTools();
  }

  async handleGetRequest(req: Request, res: Response) {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId || !this.transports[sessionId]) {
      res
        .status(400)
        .json(
          this.createErrorResponse("Bad Request: invalid session ID or method.")
        );
      return;
    }

    console.log(`Establishing SSE stream for session ${sessionId}`);
    const transport = this.transports[sessionId];
    await transport.handleRequest(req, res);
    await this.streamMessages(transport);

    return;
  }

  async handlePostRequest(req: Request, res: Response) {
    const sessionId = req.headers[SESSION_ID_HEADER_NAME] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    try {
      // reuse existing transport
      if (sessionId && this.transports[sessionId]) {
        transport = this.transports[sessionId];
        await transport.handleRequest(req, res, req.body);
        return;
      }

      // create new transport
      if (!sessionId && this.isInitializeRequest(req.body)) {
        const transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: () => randomUUID(),
        });

        await this.server.connect(transport);
        await transport.handleRequest(req, res, req.body);

        // session ID will only be available (if in not Stateless-Mode)
        // after handling the first request
        const sessionId = transport.sessionId;
        if (sessionId) {
          this.transports[sessionId] = transport;
        }

        return;
      }

      res
        .status(400)
        .json(
          this.createErrorResponse("Bad Request: invalid session ID or method.")
        );
      return;
    } catch (error) {
      console.error("Error handling MCP request:", error);
      res.status(500).json(this.createErrorResponse("Internal server error."));
      return;
    }
  }

  async cleanup() {
    await this.server.close();
  }

  private setupTools() {
    // Define available Avainode tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = [
        {
          name: "search-aircraft",
          description: "Search for available aircraft based on trip requirements",
          inputSchema: {
            type: "object",
            properties: {
              departureAirport: {
                type: "string",
                description: "Departure airport code (ICAO format, e.g., KJFK)"
              },
              arrivalAirport: {
                type: "string",
                description: "Arrival airport code (ICAO format, e.g., KLAX)"
              },
              departureDate: {
                type: "string",
                description: "Departure date (YYYY-MM-DD format)"
              },
              returnDate: {
                type: "string",
                description: "Return date for round trips (YYYY-MM-DD format, optional)"
              },
              passengers: {
                type: "number",
                description: "Number of passengers"
              },
              aircraftCategory: {
                type: "string",
                description: "Aircraft category (e.g., Light Jet, Midsize Jet, Heavy Jet)",
                enum: ["Light Jet", "Midsize Jet", "Super Midsize Jet", "Heavy Jet", "Ultra Long Range"]
              },
              maxPrice: {
                type: "number",
                description: "Maximum price per hour (optional)"
              }
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
              aircraftId: {
                type: "string",
                description: "Aircraft ID from search results"
              },
              departureAirport: {
                type: "string",
                description: "Departure airport code (ICAO format)"
              },
              arrivalAirport: {
                type: "string",
                description: "Arrival airport code (ICAO format)"
              },
              departureDate: {
                type: "string",
                description: "Departure date (YYYY-MM-DD)"
              },
              departureTime: {
                type: "string",
                description: "Departure time (HH:MM format, 24-hour)"
              },
              passengers: {
                type: "number",
                description: "Number of passengers"
              },
              contactName: {
                type: "string",
                description: "Primary contact name"
              },
              contactEmail: {
                type: "string",
                description: "Contact email address"
              },
              contactPhone: {
                type: "string",
                description: "Contact phone number"
              },
              specialRequests: {
                type: "string",
                description: "Any special requests or requirements (optional)"
              }
            },
            required: ["aircraftId", "departureAirport", "arrivalAirport", "departureDate", 
                      "departureTime", "passengers", "contactName", "contactEmail", "contactPhone"]
          }
        },
        {
          name: "get-pricing",
          description: "Generate a detailed pricing quote for a charter flight",
          inputSchema: {
            type: "object",
            properties: {
              aircraftId: {
                type: "string",
                description: "Aircraft ID"
              },
              departureAirport: {
                type: "string",
                description: "Departure airport code"
              },
              arrivalAirport: {
                type: "string",
                description: "Arrival airport code"
              },
              departureDate: {
                type: "string",
                description: "Departure date (YYYY-MM-DD)"
              },
              returnDate: {
                type: "string",
                description: "Return date for round trips (optional)"
              },
              passengers: {
                type: "number",
                description: "Number of passengers"
              },
              includeAllFees: {
                type: "boolean",
                description: "Include all fees in the quote",
                default: true
              }
            },
            required: ["aircraftId", "departureAirport", "arrivalAirport", "departureDate", "passengers"]
          }
        },
        {
          name: "manage-booking",
          description: "Manage existing bookings (confirm, cancel, or get details)",
          inputSchema: {
            type: "object",
            properties: {
              bookingId: {
                type: "string",
                description: "Booking ID"
              },
              action: {
                type: "string",
                description: "Action to perform",
                enum: ["confirm", "cancel", "get_details", "modify"]
              },
              paymentMethod: {
                type: "string",
                description: "Payment method for confirmation",
                enum: ["wire_transfer", "credit_card", "check"]
              },
              cancellationReason: {
                type: "string",
                description: "Reason for cancellation (required for cancel action)"
              },
              modifications: {
                type: "object",
                description: "Modifications to the booking (for modify action)"
              }
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
              operatorId: {
                type: "string",
                description: "Operator ID"
              },
              includeFleetDetails: {
                type: "boolean",
                description: "Include detailed fleet information",
                default: false
              },
              includeSafetyRecords: {
                type: "boolean",
                description: "Include safety records and certifications",
                default: true
              }
            },
            required: ["operatorId"]
          }
        },
        {
          name: "get-empty-legs",
          description: "Search for discounted empty leg flights (repositioning flights)",
          inputSchema: {
            type: "object",
            properties: {
              departureAirport: {
                type: "string",
                description: "Departure airport code (ICAO format, optional)"
              },
              arrivalAirport: {
                type: "string",
                description: "Arrival airport code (ICAO format, optional)"
              },
              startDate: {
                type: "string",
                description: "Start date for search range (YYYY-MM-DD, optional)"
              },
              endDate: {
                type: "string",
                description: "End date for search range (YYYY-MM-DD, optional)"
              },
              maxPrice: {
                type: "number",
                description: "Maximum price filter (optional)"
              }
            }
          }
        },
        {
          name: "get-fleet-utilization",
          description: "Get fleet utilization statistics and aircraft status for an operator",
          inputSchema: {
            type: "object",
            properties: {
              operatorId: {
                type: "string",
                description: "Operator ID (optional, defaults to primary operator)"
              },
              startDate: {
                type: "string",
                description: "Start date for utilization report (YYYY-MM-DD, optional)"
              },
              endDate: {
                type: "string",
                description: "End date for utilization report (YYYY-MM-DD, optional)"
              }
            }
          }
        }
      ];

      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(
      CallToolRequestSchema,
      async (request) => {
        try {
          return await this.avainodeTools.handleToolCall(request);
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          throw new Error(errorMessage);
        }
      }
    );
  }

  private async streamMessages(transport: StreamableHTTPServerTransport) {
    try {
      const message: LoggingMessageNotification = {
        method: "notifications/message",
        params: { level: "info", data: "SSE Connection established" },
      };

      this.sendNotification(transport, message);

      let messageCount = 0;

      const interval = setInterval(async () => {
        messageCount++;

        const data = `Message ${messageCount} at ${new Date().toISOString()}`;

        const message: LoggingMessageNotification = {
          method: "notifications/message",
          params: { level: "info", data: data },
        };

        try {
          this.sendNotification(transport, message);

          if (messageCount === 2) {
            clearInterval(interval);

            const message: LoggingMessageNotification = {
              method: "notifications/message",
              params: { level: "info", data: "Streaming complete!" },
            };

            this.sendNotification(transport, message);
          }
        } catch (error) {
          console.error("Error sending message:", error);
          clearInterval(interval);
        }
      }, 1000);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  private async sendNotification(
    transport: StreamableHTTPServerTransport,
    notification: Notification
  ) {
    const rpcNotification: JSONRPCNotification = {
      ...notification,
      jsonrpc: JSON_RPC,
    };
    await transport.send(rpcNotification);
  }

  private createErrorResponse(message: string): JSONRPCError {
    return {
      jsonrpc: "2.0",
      error: {
        code: -32000,
        message: message,
      },
      id: randomUUID(),
    };
  }

  private isInitializeRequest(body: any): boolean {
    const isInitial = (data: any) => {
      const result = InitializeRequestSchema.safeParse(data);
      return result.success;
    };
    if (Array.isArray(body)) {
      return body.some((request) => isInitial(request));
    }
    return isInitial(body);
  }
}