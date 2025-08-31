# Avinode Mock System Documentation

## Overview

The Avinode MCP Server includes a comprehensive mock implementation that simulates realistic aircraft availability and charter data responses matching the Avinode API specification. This allows full testing and development without requiring actual Avinode API credentials.

## Features

### Mock Data Sets

The mock system provides realistic data for:

1. **Aircraft Fleet (10 aircraft)**
   - Light Jets: Citation CJ3+, Phenom 300E
   - Midsize Jets: Citation XLS+, Hawker 900XP
   - Super Midsize Jets: Citation Sovereign+, Challenger 350
   - Heavy Jets: Gulfstream G450, G550
   - Ultra Long Range: Global 7500, Gulfstream G650ER

2. **Operators (5 companies)**
   - JetVision Charter (Teterboro, NJ)
   - Elite Aviation (Las Vegas, NV)
   - Prestige Air (Los Angeles, CA)
   - Global Jets (New York, NY)
   - Luxury Wings (Miami, FL)

3. **Empty Legs**
   - Discounted positioning flights
   - Dynamic pricing calculations
   - Real-time availability simulation

4. **Fleet Utilization**
   - Aircraft status tracking
   - Revenue calculations
   - Utilization metrics

## Configuration

### Environment Variables

- `USE_MOCK_DATA`: Set to `"true"` to enable mock mode (default: enabled if no API key)
- `AVAINODE_API_KEY`: When set, disables mock mode and attempts to use real API

### Switching Between Mock and Real API

```bash
# Use mock data
USE_MOCK_DATA=true bun run dev

# Use real API (when credentials available)
AVAINODE_API_KEY=your-api-key bun run dev
```

## Available Tools

The mock system fully implements all Avinode MCP tools:

### 1. search-aircraft
Search for available aircraft based on trip requirements.

**Parameters:**
- `departureAirport`: ICAO airport code (e.g., "KJFK")
- `arrivalAirport`: ICAO airport code (e.g., "KLAX")
- `departureDate`: Date in YYYY-MM-DD format
- `returnDate`: Optional return date
- `passengers`: Number of passengers
- `aircraftCategory`: Optional category filter
- `maxPrice`: Optional maximum hourly rate
- `petFriendly`: Optional pet-friendly requirement
- `wifiRequired`: Optional WiFi requirement

### 2. create-charter-request
Submit a charter request for a specific aircraft.

**Parameters:**
- `aircraftId`: Aircraft ID from search results
- `departureAirport`: ICAO airport code
- `arrivalAirport`: ICAO airport code
- `departureDate`: Date in YYYY-MM-DD format
- `departureTime`: Time in HH:MM format
- `passengers`: Number of passengers
- `contactName`: Primary contact name
- `contactEmail`: Contact email
- `contactPhone`: Contact phone
- `company`: Optional company name
- `specialRequests`: Optional special requirements

### 3. get-pricing
Generate a detailed pricing quote for a charter flight.

**Parameters:**
- `aircraftId`: Aircraft ID
- `departureAirport`: ICAO airport code
- `arrivalAirport`: ICAO airport code
- `departureDate`: Date in YYYY-MM-DD format
- `departureTime`: Time in HH:MM format
- `returnDate`: Optional return date
- `returnTime`: Optional return time
- `passengers`: Number of passengers
- `includeAllFees`: Include all fees in quote (default: true)

### 4. get-empty-legs
Search for discounted empty leg flights.

**Parameters:**
- `departureAirport`: Optional departure airport filter
- `arrivalAirport`: Optional arrival airport filter
- `startDate`: Optional start date for search range
- `endDate`: Optional end date for search range
- `maxPrice`: Optional maximum price filter

### 5. get-fleet-utilization
Get fleet utilization statistics and aircraft status.

**Parameters:**
- `operatorId`: Optional operator ID (defaults to "OP001")
- `startDate`: Optional start date for report
- `endDate`: Optional end date for report

### 6. manage-booking
Manage existing bookings (confirm, cancel, get details, modify).

**Parameters:**
- `bookingId`: Booking ID
- `action`: Action to perform ("confirm", "cancel", "get_details", "modify")
- `paymentMethod`: Payment method for confirmation
- `cancellationReason`: Reason for cancellation
- `modifications`: Object with modification details

### 7. get-operator-info
Retrieve detailed information about an aircraft operator.

**Parameters:**
- `operatorId`: Operator ID
- `includeFleetDetails`: Include fleet information (default: false)
- `includeSafetyRecords`: Include safety records (default: true)

## Mock Response Examples

### Aircraft Search Response
```json
{
  "success": true,
  "data": {
    "searchId": "SRCH1735399123456",
    "results": [
      {
        "aircraft": {
          "id": "ACF001",
          "model": "Citation CJ3+",
          "category": "Light Jet",
          "maxPassengers": 7,
          "hourlyRate": 3500,
          "amenities": ["WiFi", "Refreshment Center", "Lavatory"]
        },
        "operator": {
          "name": "JetVision Charter",
          "safetyRating": "ARGUS Gold"
        },
        "pricing": {
          "hourlyRate": 3500,
          "estimatedTotal": 19250,
          "currency": "USD"
        }
      }
    ],
    "totalResults": 3
  }
}
```

### Quote Response
```json
{
  "success": true,
  "data": {
    "id": "QT12345678",
    "totalPrice": 19250,
    "currency": "USD",
    "priceBreakdown": {
      "flightHours": 5.5,
      "hourlyRate": 3500,
      "baseCost": 19250,
      "fuelSurcharge": 1443.75,
      "landingFees": 1200,
      "handlingFees": 800,
      "catering": 1050,
      "crewFees": 1500,
      "taxes": 2019.54
    },
    "validUntil": "2024-03-25T00:00:00.000Z"
  }
}
```

## Testing with JetVision Agent

The mock system is fully compatible with the JetVision Agent E2E test suite. The four charter operation prompts are supported:

1. **Aircraft Availability**: Search for available aircraft
2. **Empty Legs**: Find discounted positioning flights
3. **Fleet Utilization**: View operator fleet status
4. **Heavy Jet Search**: Search for specific aircraft categories

### Running E2E Tests

```bash
# Start the mock server
USE_MOCK_DATA=true bun run dev

# In another terminal, run the JetVision Agent tests
cd ../jetvision-agent
bun run test:e2e
```

## Migrating to Real API

When Avinode API credentials become available:

1. **Set the API key environment variable:**
   ```bash
   export AVAINODE_API_KEY="your-api-key-here"
   ```

2. **Update the avainode-tools.ts constructor:**
   - The system automatically detects the API key
   - Mock mode is disabled when a valid key is present

3. **Implement the real API client:**
   - Create `src/avainode-api-client.ts`
   - Implement the same interface as `AvinodeMockClient`
   - Update `avainode-tools.ts` to use the real client

4. **Test the migration:**
   ```bash
   # Test with real API
   AVAINODE_API_KEY=your-key bun run dev
   
   # Fallback to mock if needed
   USE_MOCK_DATA=true bun run dev
   ```

## Architecture

```
avainode-mcp-server/
├── src/
│   ├── mock/
│   │   ├── avinode-mock-data.ts    # Mock data sets and generators
│   │   └── avinode-mock-client.ts  # Mock API client implementation
│   ├── avainode-tools.ts          # Tool handlers (uses mock or real client)
│   ├── server.ts                  # MCP server with tool definitions
│   ├── index.ts                   # Express server entry point
│   └── worker.ts                  # Cloudflare Worker adapter
```

## Benefits

1. **Development without API access**: Full functionality testing while awaiting credentials
2. **Predictable testing**: Consistent responses for automated testing
3. **Cost savings**: No API calls during development and testing
4. **Rapid prototyping**: Immediate feedback without external dependencies
5. **Easy migration**: Simple switch to real API when ready

## Limitations

The mock system provides realistic but simulated data:
- Flight times are estimates based on common routes
- Pricing uses simplified calculations
- Availability is randomly generated
- Operator data is fictional but realistic

## Support

For questions or issues with the mock system:
1. Check the mock data definitions in `src/mock/avinode-mock-data.ts`
2. Review the mock client implementation in `src/mock/avinode-mock-client.ts`
3. Ensure environment variables are correctly set
4. Verify the server is running on the expected port (8124)

## Future Enhancements

Planned improvements to the mock system:
- [ ] Add more aircraft models
- [ ] Implement seasonal pricing variations
- [ ] Add weather-based availability changes
- [ ] Include more detailed operator certifications
- [ ] Add international route support
- [ ] Implement webhook notifications
- [ ] Add data persistence with KV storage