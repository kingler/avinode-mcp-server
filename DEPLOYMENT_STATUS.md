# Avinode MCP Server - Deployment Status

## Current Status: ✅ FULLY OPERATIONAL

All endpoints have been verified and are working correctly with comprehensive mock data.

## Deployment Details

- **Production URL**: https://avainode-mcp.kingler.workers.dev
- **Alternative URL**: https://avainode-mcp.designthru.ai
- **Version ID**: 4a14764d-44a6-4f7a-bfa1-bc3d317d1851
- **Last Deployed**: 2025-08-30

## Configuration

- **Data Mode**: Mock Data (USE_MOCK_DATA=true)
- **Transport**: HTTP Streaming (NDJSON format)
- **Session Storage**: Cloudflare KV Namespace
- **CORS**: Enabled for all origins

## Verified Endpoints (33 Total)

### MCP Protocol Endpoints (3)
- ✅ `POST /mcp` - Main MCP endpoint
- ✅ `POST /stream` - Streaming endpoint
- ✅ `POST /` - Root endpoint

### System Endpoints (2)
- ✅ `GET /health` - Health check
- ✅ `GET /api/services` - List all services

### Avinode Endpoints (10)
- ✅ `GET /api/tools` - List Avinode tools
- ✅ `POST /api/tools/search-aircraft` - Search available aircraft
- ✅ `POST /api/tools/create-charter-request` - Create charter request
- ✅ `POST /api/tools/get-pricing` - Get pricing quote
- ✅ `POST /api/tools/manage-booking` - Manage bookings
- ✅ `POST /api/tools/get-operator-info` - Get operator details
- ✅ `POST /api/tools/get-empty-legs` - Search empty legs
- ✅ `POST /api/tools/get-fleet-utilization` - Fleet utilization stats
- ✅ `POST /api/operational-data` - Operational data (fleet/empty-legs)

### SchedAero Endpoints (7)
- ✅ `GET /api/schedaero` - List SchedAero operations
- ✅ `POST /api/schedaero/search-maintenance-facilities`
- ✅ `POST /api/schedaero/search-crew`
- ✅ `POST /api/schedaero/create-maintenance-schedule`
- ✅ `POST /api/schedaero/create-flight-schedule`
- ✅ `POST /api/schedaero/update-aircraft-status`
- ✅ `POST /api/schedaero/assign-crew`

### Paynode Endpoints (9)
- ✅ `GET /api/paynode` - List Paynode operations
- ✅ `POST /api/paynode/create-invoice`
- ✅ `POST /api/paynode/process-payment`
- ✅ `POST /api/paynode/create-refund`
- ✅ `POST /api/paynode/get-account-balance`
- ✅ `POST /api/paynode/get-transaction-history`
- ✅ `POST /api/paynode/add-payment-method`
- ✅ `POST /api/paynode/create-payout`
- ✅ `POST /api/paynode/generate-statement`

## Mock Data Summary

### Avinode
- 10 Aircraft (Light to Ultra Long Range Jets)
- 5 Operators with certifications
- Realistic pricing with all fees
- Empty leg opportunities

### SchedAero
- 5 Maintenance facilities
- 10 Crew members (pilots & attendants)
- Complete qualification tracking
- Maintenance scheduling

### Paynode
- 5 Payment accounts
- Multiple payment methods
- Transaction history
- Invoice management

## N8N Integration

### Option A: MCP Client Tool
```json
{
  "endpointUrl": "https://avainode-mcp.kingler.workers.dev/mcp",
  "serverTransport": "httpStreamable"
}
```

### Option B: HTTP Request Node (Recommended)
Use direct REST API calls to any endpoint listed above.

Example:
```json
{
  "method": "POST",
  "url": "https://avainode-mcp.kingler.workers.dev/api/tools/search-aircraft",
  "body": {
    "from": "KJFK",
    "to": "KLAX",
    "departureDate": "2024-12-15",
    "passengers": 8
  }
}
```

## Parameter Mapping

The API supports both short-form and full-form parameters:

- `from` → `departureAirport`
- `to` → `arrivalAirport`
- `date` → `departureDate`
- `customerName` → `contactName`
- `customerEmail` → `contactEmail`
- `customerPhone` → `contactPhone`

## Testing

Run comprehensive tests:
```bash
./test-all-endpoints.sh    # Full test suite (33 tests)
./test-fixes.sh            # Quick verification (7 tests)
./test-n8n-proof.sh        # N8N compatibility tests
```

## Known Issues

None - All endpoints are functioning correctly.

## Support

For issues or questions:
- Check logs: `npm run tail`
- Test locally: `npm run dev`
- Deploy updates: `npm run deploy:production`