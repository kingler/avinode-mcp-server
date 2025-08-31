import express, { Request, Response } from "express";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { MCPServer } from "./server";

// Default port
let PORT = 8124; // Different port from Apollo server

// Parse command-line arguments for --port=XXXX
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (arg.startsWith("--port=")) {
    const value = parseInt(arg.split("=")[1], 10);
    if (!isNaN(value)) {
      PORT = value;
    } else {
      console.error("Invalid value for --port");
      process.exit(1);
    }
  }
}

const server = new MCPServer(
  new Server(
    {
      name: "avainode-mcp-server",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
        logging: {},
      },
    }
  )
);

const app = express();
app.use(express.json());

const router = express.Router();

// Health check endpoint
router.get("/health", (req: Request, res: Response) => {
  const useMockData = !process.env.AVAINODE_API_KEY || process.env.USE_MOCK_DATA === "true";
  
  res.json({
    status: "healthy",
    service: "avainode-mcp-server",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    mode: useMockData ? "mock" : "production",
    environment: process.env.NODE_ENV || "development",
    endpoints: {
      mcp: "/mcp",
      health: "/health",
      api: "/api"
    }
  });
});

// N8N-compatible API endpoints
import { AvainodeTools } from "./avainode-tools";
import {
  listSchedAeroOperations,
  executeSchedAeroOperation,
  listPaynodeOperations,
  executePaynodeOperation,
  listAllServices
} from "./api-endpoints";
const avainodeTools = new AvainodeTools();

// List available tools for N8N
router.get("/api/tools", (req: Request, res: Response) => {
  const tools = [
    // AVINODE TOOLS (7)
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
    },
    
    // SCHEDAERO TOOLS (6)
    {
      name: "search-maintenance-facilities",
      description: "Search for maintenance facilities",
      parameters: ["location", "certifications", "capabilities"]
    },
    {
      name: "search-crew",
      description: "Search for available crew members",
      parameters: ["aircraftType", "qualifications", "availability", "location"]
    },
    {
      name: "create-maintenance-schedule",
      description: "Schedule aircraft maintenance",
      parameters: ["aircraftId", "facilityId", "maintenanceType", "scheduledDate", "estimatedHours"]
    },
    {
      name: "create-flight-schedule",
      description: "Create a flight schedule",
      parameters: ["aircraftId", "crewIds", "departureAirport", "arrivalAirport", "departureTime", "passengers"]
    },
    {
      name: "update-aircraft-status",
      description: "Update aircraft operational status",
      parameters: ["aircraftId", "status", "reason", "estimatedAvailability"]
    },
    {
      name: "assign-crew",
      description: "Assign crew to a flight",
      parameters: ["flightId", "crewAssignments"]
    },
    
    // PAYNODE TOOLS (8)
    {
      name: "create-invoice",
      description: "Create a new invoice",
      parameters: ["accountId", "customerAccountId", "lineItems", "dueDate", "currency"]
    },
    {
      name: "process-payment",
      description: "Process a payment",
      parameters: ["invoiceId", "paymentMethodId", "amount", "currency"]
    },
    {
      name: "create-refund",
      description: "Create a refund for a transaction",
      parameters: ["transactionId", "amount", "reason"]
    },
    {
      name: "get-account-balance",
      description: "Get account balance and pending transactions",
      parameters: ["accountId"]
    },
    {
      name: "get-transaction-history",
      description: "Get transaction history for an account",
      parameters: ["accountId", "startDate", "endDate", "transactionType"]
    },
    {
      name: "add-payment-method",
      description: "Add a new payment method",
      parameters: ["accountId", "methodType", "methodDetails"]
    },
    {
      name: "create-payout",
      description: "Create a payout to a bank account",
      parameters: ["accountId", "amount", "currency", "bankDetails"]
    },
    {
      name: "generate-statement",
      description: "Generate an account statement",
      parameters: ["accountId", "startDate", "endDate", "format"]
    }
  ];

  res.json({
    success: true,
    tools: tools,
    count: tools.length
  });
});

// Execute tool for N8N
router.post("/api/tools/:toolName", async (req: Request, res: Response) => {
  const toolName = req.params.toolName;
  const args = req.body;

  try {
    const result = await avainodeTools.handleToolCall({
      params: {
        name: toolName,
        arguments: args
      }
    } as any);

    res.json({
      success: true,
      tool: toolName,
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Tool execution error for ${toolName}:`, error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      tool: toolName,
      timestamp: new Date().toISOString()
    });
  }
});

// SchedAero API endpoints
router.get("/api/schedaero", listSchedAeroOperations);
router.post("/api/schedaero/:operation", executeSchedAeroOperation);

// Paynode API endpoints  
router.get("/api/paynode", listPaynodeOperations);
router.post("/api/paynode/:operation", executePaynodeOperation);

// Combined services endpoint
router.get("/api/services", listAllServices);

// Operational data endpoint for N8N
router.post("/api/operational-data", async (req: Request, res: Response) => {
  try {
    const { dataType = "fleet-utilization", ...params } = req.body;
    
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

    res.json({
      success: true,
      dataType: dataType,
      result: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Operational data error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString()
    });
  }
});

// single endpoint for the client to send messages to
const MCP_ENDPOINT = "/mcp";

router.post(MCP_ENDPOINT, async (req: Request, res: Response) => {
  await server.handlePostRequest(req, res);
});

router.get(MCP_ENDPOINT, async (req: Request, res: Response) => {
  await server.handleGetRequest(req, res);
});

app.use("/", router);

app.listen(PORT, () => {
  console.log(`Avainode MCP Server listening on port ${PORT}`);
});

process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await server.cleanup();
  process.exit(0);
});