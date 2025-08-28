# Avainode MCP Server

MCP server for Avainode aviation marketplace and aircraft charter platform integration.

## Features

- **Aircraft Search**: Search for available aircraft based on trip requirements
- **Charter Requests**: Submit and manage charter requests
- **Pricing Quotes**: Generate detailed pricing quotes for charter flights
- **Booking Management**: Confirm, cancel, or modify existing bookings
- **Operator Information**: Retrieve detailed information about aircraft operators

## Installation

```bash
npm install
```

## Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Avainode API key to `.env`:
```
AVAINODE_API_KEY=your_actual_api_key_here
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Custom Port
```bash
npm start -- --port=8080
```

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## Available MCP Tools

### search-aircraft
Search for available aircraft based on trip requirements.

**Parameters:**
- `departureAirport`: Departure airport code (ICAO format, required)
- `arrivalAirport`: Arrival airport code (ICAO format, required)
- `departureDate`: Departure date (YYYY-MM-DD, required)
- `returnDate`: Return date for round trips (optional)
- `passengers`: Number of passengers (required)
- `aircraftCategory`: Aircraft category (Light Jet, Midsize Jet, Heavy Jet, etc.)
- `maxPrice`: Maximum price per hour (optional)

### create-charter-request
Submit a charter request for a specific aircraft.

**Parameters:**
- `aircraftId`: Aircraft ID from search results (required)
- `departureAirport`: Departure airport code (required)
- `arrivalAirport`: Arrival airport code (required)
- `departureDate`: Departure date (required)
- `departureTime`: Departure time in HH:MM format (required)
- `passengers`: Number of passengers (required)
- `contactName`: Primary contact name (required)
- `contactEmail`: Contact email address (required)
- `contactPhone`: Contact phone number (required)
- `specialRequests`: Any special requirements (optional)

### get-pricing
Generate a detailed pricing quote for a charter flight.

**Parameters:**
- `aircraftId`: Aircraft ID (required)
- `departureAirport`: Departure airport code (required)
- `arrivalAirport`: Arrival airport code (required)
- `departureDate`: Departure date (required)
- `returnDate`: Return date for round trips (optional)
- `passengers`: Number of passengers (required)
- `includeAllFees`: Include all fees in quote (default: true)

### manage-booking
Manage existing bookings.

**Parameters:**
- `bookingId`: Booking ID (required)
- `action`: Action to perform (confirm, cancel, get_details, modify) (required)
- `paymentMethod`: Payment method for confirmation
- `cancellationReason`: Reason for cancellation
- `modifications`: Modifications to the booking

### get-operator-info
Retrieve detailed information about an aircraft operator.

**Parameters:**
- `operatorId`: Operator ID (required)
- `includeFleetDetails`: Include detailed fleet information (default: false)
- `includeSafetyRecords`: Include safety records (default: true)

## Airport Codes

This server uses ICAO airport codes (4-letter codes). Examples:
- KJFK - John F. Kennedy International Airport (New York)
- KLAX - Los Angeles International Airport
- KTEB - Teterboro Airport (New Jersey)
- EGLL - London Heathrow
- LFPG - Paris Charles de Gaulle

## Aircraft Categories

Available aircraft categories:
- Light Jet (4-7 passengers)
- Midsize Jet (6-9 passengers)
- Super Midsize Jet (8-10 passengers)
- Heavy Jet (10-16 passengers)
- Ultra Long Range (12-19 passengers)

## API Rate Limits

The server implements rate limiting to comply with Avainode API restrictions:
- Automatic exponential backoff on rate limit errors
- Proper error handling and retry logic
- Session management for multiple concurrent connections

## Architecture

The server follows MCP (Model Context Protocol) standards with:
- HTTP Streaming Transport for real-time communication
- Session management for multiple concurrent connections
- Structured error handling and logging
- TypeScript for type safety
- Comprehensive test coverage

## License

ISC