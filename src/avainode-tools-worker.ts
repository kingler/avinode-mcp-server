import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { AvinodeMockClient } from "./mock/avinode-mock-client";
import { formatCurrency } from "./mock/avinode-mock-data";

export class AvainodeTools {
  private mockClient: AvinodeMockClient;
  private useMockData: boolean;

  constructor(apiKey?: string, useMock?: boolean) {
    // In Cloudflare Workers, API key is passed directly from the env binding
    this.useMockData = !apiKey || useMock === true;
    
    if (this.useMockData) {
      console.log("Using Avinode mock data (set AVAINODE_API_KEY to use real API)");
    }
    
    this.mockClient = new AvinodeMockClient(this.useMockData);
  }

  async handleToolCall(request: CallToolRequest) {
    const { name, arguments: args } = request.params;

    if (!args) {
      throw new Error("Missing required parameters");
    }

    switch (name) {
      case "search-aircraft":
        return await this.searchAircraft(args);
      
      case "create-charter-request":
        return await this.createCharterRequest(args);
      
      case "get-pricing":
        return await this.getPricing(args);
      
      case "manage-booking":
        return await this.manageBooking(args);
      
      case "get-operator-info":
        return await this.getOperatorInfo(args);
      
      case "get-empty-legs":
        return await this.getEmptyLegs(args);
        
      case "get-fleet-utilization":
        return await this.getFleetUtilization(args);
      
      // Legacy compatibility for N8N workflows
      case "get-aircraft-availability":
        return await this.getAircraftAvailability(args);
      
      case "request-charter-quote":
        return await this.getPricing(args);
      
      case "search-operators":
        return await this.searchOperators(args);
      
      case "get-airport-info":
        return await this.getAirportInfo(args);
      
      case "calculate-flight-time":
        return await this.calculateFlightTime(args);
      
      case "get-fuel-prices":
        return await this.getFuelPrices(args);
      
      case "get-weather-briefing":
        return await this.getWeatherBriefing(args);
      
      case "get-slot-availability":
        return await this.getSlotAvailability(args);
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async searchAircraft(args: any) {
    const { 
      departureAirport,
      arrivalAirport,
      departureDate,
      passengers,
      aircraftType,
      maxRange,
      maxPrice
    } = args;

    if (!departureAirport || !arrivalAirport || !departureDate || !passengers) {
      throw new Error("Missing required parameters: departureAirport, arrivalAirport, departureDate, and passengers are required");
    }

    try {
      const aircraft = await this.mockClient.searchAvailableAircraft({
        departure: departureAirport,
        arrival: arrivalAirport,
        date: departureDate,
        pax: passengers,
        category: aircraftType,
        maxRange,
        maxPrice
      });

      return {
        content: [
          {
            type: "text",
            text: `Found ${aircraft.length} available aircraft for ${departureAirport} to ${arrivalAirport} on ${departureDate}:\n\n${this.formatAircraftResults(aircraft)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching aircraft: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getAircraftAvailability(args: any) {
    const { aircraftId, startDate, endDate } = args;

    if (!aircraftId || !startDate || !endDate) {
      throw new Error("Missing required parameters: aircraftId, startDate, and endDate are required");
    }

    try {
      const availability = await this.mockClient.checkAircraftAvailability(
        aircraftId,
        startDate,
        endDate
      );

      return {
        content: [
          {
            type: "text",
            text: `Aircraft ${aircraftId} availability from ${startDate} to ${endDate}:\n${JSON.stringify(availability, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error checking availability: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async requestCharterQuote(args: any) {
    const {
      aircraftId,
      departureAirport,
      arrivalAirport,
      departureDate,
      returnDate,
      passengers,
      specialRequests
    } = args;

    if (!aircraftId || !departureAirport || !arrivalAirport || !departureDate || !passengers) {
      throw new Error("Missing required parameters for charter quote");
    }

    try {
      const quote = await this.mockClient.requestQuote({
        aircraftId,
        departure: departureAirport,
        arrival: arrivalAirport,
        departureDate,
        returnDate,
        passengers,
        specialRequests
      });

      return {
        content: [
          {
            type: "text",
            text: `Charter Quote #${quote.quoteId}:
Aircraft: ${quote.aircraft}
Route: ${quote.route}
Dates: ${quote.dates}
Total Cost: ${quote.totalCost}
Breakdown: ${JSON.stringify(quote.breakdown, null, 2)}
Valid Until: ${quote.validUntil}
Terms: ${quote.terms}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error requesting quote: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async searchOperators(args: any) {
    const { location, certifications, fleetSize, rating } = args;

    try {
      const operators = await this.mockClient.searchOperators({
        location,
        certifications,
        minFleetSize: fleetSize,
        minRating: rating
      });

      return {
        content: [
          {
            type: "text",
            text: `Found ${operators.length} operators:\n\n${this.formatOperatorResults(operators)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching operators: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getAirportInfo(args: any) {
    const { airportCode } = args;

    if (!airportCode) {
      throw new Error("Airport code is required");
    }

    try {
      const info = await this.mockClient.getAirportInformation(airportCode);

      return {
        content: [
          {
            type: "text",
            text: `Airport Information for ${airportCode}:\n${JSON.stringify(info, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting airport info: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async calculateFlightTime(args: any) {
    const { departureAirport, arrivalAirport, aircraftType } = args;

    if (!departureAirport || !arrivalAirport || !aircraftType) {
      throw new Error("Missing required parameters: departureAirport, arrivalAirport, and aircraftType are required");
    }

    try {
      const flightInfo = await this.mockClient.calculateFlightTime(
        departureAirport,
        arrivalAirport,
        aircraftType
      );

      return {
        content: [
          {
            type: "text",
            text: `Flight Time Calculation:
Route: ${departureAirport} to ${arrivalAirport}
Aircraft Type: ${aircraftType}
Distance: ${flightInfo.distance} nm
Flight Time: ${flightInfo.flightTime}
Block Time: ${flightInfo.blockTime}
Fuel Required: ${flightInfo.fuelRequired}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating flight time: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getFuelPrices(args: any) {
    const { airportCode } = args;

    if (!airportCode) {
      throw new Error("Airport code is required");
    }

    try {
      const prices = await this.mockClient.getFuelPrices(airportCode);

      return {
        content: [
          {
            type: "text",
            text: `Fuel Prices at ${airportCode}:\n${JSON.stringify(prices, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting fuel prices: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async searchEmptyLegs(args: any) {
    const { departureRegion, arrivalRegion, dateRange, maxPrice } = args;

    try {
      const emptyLegs = await this.mockClient.searchEmptyLegs({
        departureRegion,
        arrivalRegion,
        dateRange,
        maxPrice
      });

      return {
        content: [
          {
            type: "text",
            text: `Found ${emptyLegs.length} empty leg flights:\n\n${this.formatEmptyLegResults(emptyLegs)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching empty legs: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getWeatherBriefing(args: any) {
    const { airportCode, date } = args;

    if (!airportCode || !date) {
      throw new Error("Airport code and date are required");
    }

    try {
      const weather = await this.mockClient.getWeatherBriefing(airportCode, date);

      return {
        content: [
          {
            type: "text",
            text: `Weather Briefing for ${airportCode} on ${date}:\n${JSON.stringify(weather, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting weather briefing: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getSlotAvailability(args: any) {
    const { airportCode, date, timeWindow } = args;

    if (!airportCode || !date) {
      throw new Error("Airport code and date are required");
    }

    try {
      const slots = await this.mockClient.getSlotAvailability(
        airportCode,
        date,
        timeWindow
      );

      return {
        content: [
          {
            type: "text",
            text: `Slot availability at ${airportCode} on ${date}:\n${JSON.stringify(slots, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error checking slot availability: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  // Helper methods for formatting results
  private formatAircraftResults(aircraft: any[]) {
    return aircraft.map(a => 
      `• ${a.model} (${a.tailNumber})
  Operator: ${a.operator}
  Capacity: ${a.capacity} passengers
  Range: ${a.range} nm
  Hourly Rate: ${formatCurrency(a.hourlyRate)}
  Availability: ${a.availability}`
    ).join("\n\n");
  }

  private formatOperatorResults(operators: any[]) {
    return operators.map(o => 
      `• ${o.name} (${o.certificateNumber})
  Location: ${o.location}
  Fleet Size: ${o.fleetSize} aircraft
  Certifications: ${o.certifications.join(", ")}
  Rating: ${o.rating}/5
  Specializations: ${o.specializations.join(", ")}`
    ).join("\n\n");
  }

  private formatEmptyLegResults(legs: any[]) {
    return legs.map(l => 
      `• ${l.departureAirport} → ${l.arrivalAirport}
  Date: ${l.date}
  Aircraft: ${l.aircraft}
  Original Price: ${formatCurrency(l.originalPrice)}
  Discounted Price: ${formatCurrency(l.discountedPrice)}
  Savings: ${l.savingsPercentage}%`
    ).join("\n\n");
  }

  // Core methods matching main avainode-tools.ts
  private async createCharterRequest(args: any) {
    const { aircraftId, departureAirport, arrivalAirport, departureDate, 
            departureTime, passengers, contactName, contactEmail, 
            contactPhone, company, specialRequests } = args;

    if (!aircraftId || !departureAirport || !arrivalAirport || !departureDate || 
        !departureTime || !passengers || !contactName || !contactEmail || !contactPhone) {
      throw new Error("Missing required booking parameters");
    }

    try {
      const response = await this.mockClient.createCharterRequest({
        aircraftId,
        departureAirport,
        arrivalAirport,
        departureDate,
        departureTime,
        passengers,
        contactName,
        contactEmail,
        contactPhone,
        company,
        specialRequests
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Charter request failed");
      }

      const request = response.data;
      return {
        content: [
          {
            type: "text",
            text: `# Charter Request Created Successfully

## Booking Details
- **Booking ID:** ${request.bookingId}
- **Status:** ${request.status}
- **Aircraft:** ${request.aircraft}
- **Route:** ${request.route}
- **Date:** ${request.date}
- **Time:** ${request.time}
- **Passengers:** ${request.passengers}

## Contact Information
- **Name:** ${request.contact.name}
- **Email:** ${request.contact.email}
- **Phone:** ${request.contact.phone}

## Next Steps
${request.nextSteps}

*Booking reference: ${request.bookingId}*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating charter request: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getPricing(args: any) {
    const { aircraftId, departureAirport, arrivalAirport, departureDate, 
            departureTime, returnDate, returnTime, passengers, includeAllFees = true } = args;

    if (!aircraftId || !departureAirport || !arrivalAirport || !departureDate || !passengers) {
      throw new Error("Missing required pricing parameters");
    }

    try {
      const response = await this.mockClient.getPricing({
        aircraftId,
        departureAirport,
        arrivalAirport,
        departureDate,
        departureTime,
        returnDate,
        returnTime,
        passengers,
        includeAllFees
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Pricing calculation failed");
      }

      const quote = response.data;
      return {
        content: [
          {
            type: "text",
            text: quote.formattedQuote || `Charter Flight Quote: $${quote.totalPrice} USD`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error calculating pricing: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async manageBooking(args: any) {
    const { bookingId, action, paymentMethod, cancellationReason, modifications } = args;

    if (!bookingId || !action) {
      throw new Error("Missing required parameters: bookingId and action are required");
    }

    try {
      const response = await this.mockClient.manageBooking({
        bookingId,
        action,
        paymentMethod,
        cancellationReason,
        modifications
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Booking management failed");
      }

      const booking = response.data;
      return {
        content: [
          {
            type: "text",
            text: `Booking ${action} successful: ${JSON.stringify(booking, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error managing booking: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getEmptyLegs(args: any) {
    const { departureAirport, arrivalAirport, startDate, endDate, maxPrice } = args;

    try {
      const response = await this.mockClient.getEmptyLegs({
        departureAirport,
        arrivalAirport,
        startDate,
        endDate,
        maxPrice
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Empty legs search failed");
      }

      const { emptyLegs, totalResults } = response.data;
      return {
        content: [
          {
            type: "text",
            text: `Found ${totalResults} empty leg flights:\n\n${this.formatEmptyLegResults(emptyLegs.map(el => el.leg))}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching empty legs: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getFleetUtilization(args: any) {
    const { operatorId = "OP001", startDate, endDate } = args;

    try {
      const response = await this.mockClient.getFleetUtilization({
        operatorId,
        startDate,
        endDate
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Fleet utilization failed");
      }

      const data = response.data;
      return {
        content: [
          {
            type: "text",
            text: `Fleet Utilization Report for ${data.operator.name}:\n\n${JSON.stringify(data.summary, null, 2)}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error getting fleet utilization: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }
}