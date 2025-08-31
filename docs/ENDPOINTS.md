# Complete API Endpoints Documentation

## Base URL
`https://avainode-mcp.kingler.workers.dev`

## MCP Protocol Endpoints (3 variants)
- `POST /mcp` - Main MCP endpoint
- `POST /stream` - Dedicated streaming endpoint  
- `POST /` - Root endpoint (also supports MCP)

## System Endpoints
- `GET /health` - Health check and system status
- `GET /api/services` - List all available services

## Avinode API Endpoints (7 operations)
- `GET /api/tools` - List all Avinode tools
- `POST /api/tools/search-aircraft` - Search for available aircraft
- `POST /api/tools/create-charter-request` - Submit charter request
- `POST /api/tools/get-pricing` - Get pricing quote
- `POST /api/tools/manage-booking` - Manage bookings
- `POST /api/tools/get-operator-info` - Get operator information
- `POST /api/tools/get-empty-legs` - Search empty leg flights
- `POST /api/tools/get-fleet-utilization` - Get fleet utilization stats
- `POST /api/operational-data` - Get operational data (fleet/empty-legs)

## SchedAero API Endpoints (6 operations)
- `GET /api/schedaero` - List all SchedAero operations
- `POST /api/schedaero/search-maintenance-facilities` - Search maintenance facilities
- `POST /api/schedaero/search-crew` - Search available crew members
- `POST /api/schedaero/create-maintenance-schedule` - Schedule aircraft maintenance
- `POST /api/schedaero/create-flight-schedule` - Create flight schedule
- `POST /api/schedaero/update-aircraft-status` - Update aircraft status
- `POST /api/schedaero/assign-crew` - Assign crew to flight

## Paynode API Endpoints (8 operations)
- `GET /api/paynode` - List all Paynode operations
- `POST /api/paynode/create-invoice` - Create new invoice
- `POST /api/paynode/process-payment` - Process payment
- `POST /api/paynode/create-refund` - Create refund
- `POST /api/paynode/get-account-balance` - Get account balance
- `POST /api/paynode/get-transaction-history` - Get transaction history
- `POST /api/paynode/add-payment-method` - Add payment method (placeholder)
- `POST /api/paynode/create-payout` - Create payout (placeholder)
- `POST /api/paynode/generate-statement` - Generate statement (placeholder)

## Total: 31+ Endpoints

### For N8N Integration

#### Option A: Use MCP Client Tool
Configure with one of these URLs:
- `https://avainode-mcp.kingler.workers.dev/mcp`
- `https://avainode-mcp.kingler.workers.dev/stream`
- `https://avainode-mcp.kingler.workers.dev/`

#### Option B: Use HTTP Request Node (Recommended)
Directly call any of the REST API endpoints above.

Example for fleet utilization:
```json
{
  "method": "POST",
  "url": "https://avainode-mcp.kingler.workers.dev/api/tools/get-fleet-utilization",
  "body": {
    "operatorId": "OP001"
  }
}
```

Example for SchedAero crew search:
```json
{
  "method": "POST",
  "url": "https://avainode-mcp.kingler.workers.dev/api/schedaero/search-crew",
  "body": {
    "aircraftType": "Gulfstream G550",
    "availability": "2024-12-01"
  }
}
```

Example for Paynode invoice creation:
```json
{
  "method": "POST",
  "url": "https://avainode-mcp.kingler.workers.dev/api/paynode/create-invoice",
  "body": {
    "accountId": "PA001",
    "customerAccountId": "PA002",
    "lineItems": [
      {
        "description": "Charter Flight JFK-LAX",
        "quantity": 1,
        "unitPrice": 25000
      }
    ],
    "dueDate": "2024-12-31",
    "currency": "USD"
  }
}
```