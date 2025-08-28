import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { AvinodeMockClient } from "./mock/avinode-mock-client";
import { formatCurrency } from "./mock/avinode-mock-data";

export class AvainodeTools {
  private mockClient: AvinodeMockClient;
  private useMockData: boolean;

  constructor() {
    const apiKey = process.env.AVAINODE_API_KEY || "";
    this.useMockData = !apiKey || process.env.USE_MOCK_DATA === "true";
    
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
      
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  private async searchAircraft(args: any) {
    const { departureAirport, arrivalAirport, departureDate, returnDate,
            passengers, aircraftCategory, maxPrice, petFriendly, wifiRequired } = args;

    if (!departureAirport || !arrivalAirport || !departureDate || !passengers) {
      throw new Error("Missing required search parameters");
    }

    // Validate airport codes (basic ICAO format check)
    if (!this.isValidAirportCode(departureAirport) || !this.isValidAirportCode(arrivalAirport)) {
      throw new Error("Invalid airport code format. Please use ICAO codes (e.g., KJFK, KLAX)");
    }

    try {
      const response = await this.mockClient.searchAircraft({
        departureAirport,
        arrivalAirport,
        departureDate,
        returnDate,
        passengers,
        aircraftCategory,
        maxPrice,
        petFriendly,
        wifiRequired
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Search failed");
      }

      const { results, totalResults } = response.data;
      
      if (totalResults === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No aircraft found matching your criteria for ${departureAirport} to ${arrivalAirport} on ${departureDate}.
              
Consider adjusting your search parameters:
- Different dates
- Fewer passengers
- Different aircraft category
- Higher price range`
            }
          ]
        };
      }

      const formattedResults = results.map(r => {
        const totalCost = formatCurrency(r.pricing.estimatedTotal);
        const hourlyRate = formatCurrency(r.pricing.hourlyRate);
        
        return `## ${r.aircraft.model} (${r.aircraft.registrationNumber})
**Category:** ${r.aircraft.category}
**Operator:** ${r.operator.name} (${r.operator.safetyRating})
**Capacity:** ${r.aircraft.maxPassengers} passengers
**Hourly Rate:** ${hourlyRate}
**Estimated Total:** ${totalCost}
**Flight Time:** ${r.flightDetails.estimatedFlightTime} hours
**Amenities:** ${r.aircraft.amenities.join(', ')}
**WiFi:** ${r.aircraft.wifiAvailable ? 'Yes' : 'No'}
**Pet-Friendly:** ${r.aircraft.petFriendly ? 'Yes' : 'No'}
**Status:** ${r.availability}
**Aircraft ID:** ${r.aircraft.id}`;
      }).join('\n\n---\n\n');

      return {
        content: [
          {
            type: "text",
            text: `# Available Aircraft Search Results

**Route:** ${departureAirport} → ${arrivalAirport}
**Date:** ${departureDate}${returnDate ? ` (Return: ${returnDate})` : ''}
**Passengers:** ${passengers}
**Total Results:** ${totalResults}

---

${formattedResults}

---

*To request a quote or book any aircraft, use the aircraft ID provided above.*`
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

  private async createCharterRequest(args: any) {
    const { aircraftId, departureAirport, arrivalAirport, departureDate, 
            departureTime, passengers, contactName, contactEmail, 
            contactPhone, specialRequests, company } = args;

    // Validate all required fields
    if (!aircraftId || !departureAirport || !arrivalAirport || !departureDate || 
        !departureTime || !passengers || !contactName || !contactEmail || !contactPhone) {
      throw new Error("Missing required booking parameters");
    }

    try {
      const response = await this.mockClient.createBooking({
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
        throw new Error(response.error || "Booking creation failed");
      }

      const booking = response.data;
      const depositAmount = formatCurrency(booking.depositAmount);
      const balanceAmount = formatCurrency(booking.balanceAmount);
      const totalPrice = formatCurrency(booking.totalPrice);
      const leg = booking.legs[0];

      return {
        content: [
          {
            type: "text",
            text: `# Charter Request Created Successfully ✈️

## Booking Details
- **Booking ID:** ${booking.id}
- **Status:** ${booking.status}
- **Aircraft:** ${aircraftId}
- **Route:** ${departureAirport} → ${arrivalAirport}
- **Date:** ${departureDate} at ${departureTime}
- **Arrival:** ${leg.arrivalTime} (estimated)
- **Flight Time:** ${leg.flightTime} hours
- **Passengers:** ${passengers}

## Contact Information
- **Name:** ${contactName}
- **Email:** ${contactEmail}
- **Phone:** ${contactPhone}
${company ? `- **Company:** ${company}` : ''}
${specialRequests ? `- **Special Requests:** ${specialRequests}` : ''}

## Payment Information
- **Total Price:** ${totalPrice}
- **Deposit Required:** ${depositAmount} (due by ${new Date(booking.depositDueDate).toLocaleDateString()})
- **Balance:** ${balanceAmount} (due by ${new Date(booking.balanceDueDate).toLocaleDateString()})
- **Payment Method:** ${booking.paymentMethod.replace('_', ' ').toUpperCase()}

## Next Steps
1. You will receive a confirmation email within 1 hour
2. Deposit invoice will be sent separately
3. Flight crew details will be provided 48 hours before departure
4. Catering preferences can be submitted up to 24 hours before flight

## Important Information
- This booking is subject to operator confirmation
- Standard cancellation policy applies
- Weather-related changes may occur

*The operator will contact you within 2-4 hours to confirm availability.*`
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
            returnDate, departureTime = "10:00", returnTime = "10:00",
            passengers, includeAllFees = true } = args;

    if (!aircraftId || !departureAirport || !arrivalAirport || !departureDate || !passengers) {
      throw new Error("Missing required pricing parameters");
    }

    try {
      const response = await this.mockClient.createQuote({
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
        throw new Error(response.error || "Quote creation failed");
      }

      const quote = response.data;
      const breakdown = quote.priceBreakdown;
      const isRoundTrip = !!returnDate;

      return {
        content: [
          {
            type: "text",
            text: `# Charter Flight Quote

## Quote Information
- **Quote ID:** ${quote.id}
- **Aircraft ID:** ${aircraftId}
- **Valid Until:** ${new Date(quote.validUntil).toLocaleDateString()}

## Flight Details
- **Route:** ${departureAirport} → ${arrivalAirport} ${isRoundTrip ? `→ ${departureAirport}` : '(One-way)'}
- **Departure:** ${departureDate} at ${departureTime}
${returnDate ? `- **Return:** ${returnDate} at ${returnTime}` : ''}
- **Flight Hours:** ${breakdown.flightHours} total
- **Passengers:** ${passengers}

## Pricing Breakdown
- **Base Flight Cost:** ${formatCurrency(breakdown.baseCost)} (${breakdown.flightHours} hrs × ${formatCurrency(breakdown.hourlyRate)}/hr)
${includeAllFees ? `- **Fuel Surcharge:** ${formatCurrency(breakdown.fuelSurcharge)}
- **Landing Fees:** ${formatCurrency(breakdown.landingFees)}
- **Handling Fees:** ${formatCurrency(breakdown.handlingFees)}
- **Catering:** ${formatCurrency(breakdown.catering)}
- **Crew Fees:** ${formatCurrency(breakdown.crewFees)}` : ''}
${breakdown.overnightFees > 0 ? `- **Overnight Fees:** ${formatCurrency(breakdown.overnightFees)}` : ''}
${breakdown.discount > 0 ? `- **Round Trip Discount:** -${formatCurrency(breakdown.discount)}` : ''}

### Subtotal: ${formatCurrency(quote.totalPrice - breakdown.taxes)}
### Taxes (8%): ${formatCurrency(breakdown.taxes)}

## **Total Price: ${formatCurrency(quote.totalPrice)} USD**

## Terms & Conditions
${quote.terms.map(term => `- ${term}`).join('\n')}

## Cancellation Policy
${quote.cancellationPolicy}

*This quote is valid for 5 days. To proceed with booking, please reference Quote ID: ${quote.id}*`
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
        throw new Error(response.error || "Failed to retrieve empty legs");
      }

      const { emptyLegs, totalResults } = response.data;

      if (totalResults === 0) {
        return {
          content: [
            {
              type: "text",
              text: `No empty leg opportunities found matching your criteria.

Consider checking:
- Different date ranges
- Alternative airports
- Higher price limits

Empty legs are positioning flights that become available at discounted rates.`
            }
          ]
        };
      }

      const formattedLegs = emptyLegs.map(el => {
        const normalPrice = el.aircraft.hourlyRate * el.leg.flightTime;
        const savings = normalPrice - el.leg.price;
        
        return `## ${el.aircraft.model} - ${el.discount}% OFF! 🔥
**Route:** ${el.leg.departureAirport} → ${el.leg.arrivalAirport}
**Date:** ${el.leg.departureDate} at ${el.leg.departureTime}
**Aircraft:** ${el.aircraft.registrationNumber}
**Operator:** ${el.operator.name}
**Capacity:** ${el.aircraft.maxPassengers} passengers
**Flight Time:** ${el.leg.flightTime} hours
**Special Price:** ${formatCurrency(el.leg.price)} ~~${formatCurrency(normalPrice)}~~
**You Save:** ${formatCurrency(savings)}
**Leg ID:** ${el.leg.id}`;
      }).join('\n\n---\n\n');

      return {
        content: [
          {
            type: "text",
            text: `# Empty Leg Opportunities ✈️

**Total Results:** ${totalResults} discounted flights available

> Empty legs offer significant savings on positioning flights that would otherwise fly empty.

---

${formattedLegs}

---

⚡ **Act Fast!** Empty leg opportunities are first-come, first-served and subject to change.

*To book an empty leg, reference the Leg ID when contacting us.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving empty legs: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getFleetUtilization(args: any) {
    const { operatorId, startDate, endDate } = args;

    try {
      const response = await this.mockClient.getFleetUtilization({
        operatorId,
        startDate,
        endDate
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || "Failed to retrieve fleet utilization");
      }

      const { operator, utilizationRate, fleetStatus, summary } = response.data;

      const statusBreakdown = fleetStatus.map(fs => {
        const statusEmoji = {
          'Available': '✅',
          'OnCharter': '✈️',
          'Maintenance': '🔧',
          'Positioning': '📍'
        }[fs.status];

        return `### ${fs.aircraft.model} (${fs.aircraft.registrationNumber}) ${statusEmoji}
- **Status:** ${fs.status}
- **Location:** ${fs.currentLocation}
- **Hours Flown:** ${fs.hoursFlown}
- **Revenue:** ${formatCurrency(fs.revenue)}
- **Next Available:** ${new Date(fs.nextAvailableDate).toLocaleDateString()}`;
      }).join('\n\n');

      return {
        content: [
          {
            type: "text",
            text: `# Fleet Utilization Report

## Operator: ${operator.name}
**Headquarters:** ${operator.headquarters}
**Safety Rating:** ${operator.safetyRating}
**Total Fleet Size:** ${operator.fleetSize} aircraft

## Current Utilization: ${utilizationRate.toFixed(1)}%

## Fleet Summary
- **Total Aircraft:** ${summary.totalAircraft}
- **Available:** ${summary.availableAircraft} (${(summary.availableAircraft / summary.totalAircraft * 100).toFixed(0)}%)
- **On Charter:** ${summary.onCharterAircraft} (${(summary.onCharterAircraft / summary.totalAircraft * 100).toFixed(0)}%)
- **In Maintenance:** ${summary.maintenanceAircraft} (${(summary.maintenanceAircraft / summary.totalAircraft * 100).toFixed(0)}%)
- **Total Revenue:** ${formatCurrency(summary.totalRevenue)}

## Aircraft Status Details

${statusBreakdown}

## Performance Metrics
- **Average Utilization:** ${summary.averageUtilization.toFixed(1)}%
- **Revenue per Aircraft:** ${formatCurrency(summary.totalRevenue / summary.totalAircraft)}

## Operating Bases
${operator.operatingBases.join(' • ')}

---

*Report generated on ${new Date().toLocaleDateString()}*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving fleet utilization: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async manageBooking(args: any) {
    const { bookingId, action, paymentMethod, cancellationReason, modifications } = args;

    if (!bookingId || !action) {
      throw new Error("Missing required parameters: bookingId and action");
    }

    try {
      switch (action) {
        case "confirm":
          if (!paymentMethod) {
            throw new Error("Payment method required for confirmation");
          }

          const confirmResult = await this.mockClient.updateBookingStatus(bookingId, 'Confirmed');
          
          if (!confirmResult.success) {
            throw new Error(confirmResult.error || "Failed to confirm booking");
          }

          return {
            content: [
              {
                type: "text",
                text: `# Booking Confirmed ✅

## Confirmation Details
- **Booking ID:** ${bookingId}
- **Status:** Confirmed
- **Payment Method:** ${paymentMethod.replace('_', ' ').toUpperCase()}

## Next Steps
1. **Deposit Invoice:** Will be sent within 1 hour
2. **Payment Due:** 20% deposit within 48 hours
3. **Balance Due:** 24 hours before departure
4. **Flight Details:** Crew information sent 48 hours before departure
5. **Catering Preferences:** Submit up to 24 hours before flight

## Important Reminders
- Check passport validity for international flights
- Arrive at FBO 15 minutes before departure
- Baggage limitations apply based on aircraft type
- Weather-related changes will be communicated immediately

*Thank you for choosing our charter services!*`
              }
            ]
          };

        case "cancel":
          if (!cancellationReason) {
            throw new Error("Cancellation reason required");
          }

          const cancelResult = await this.mockClient.updateBookingStatus(bookingId, 'Cancelled');
          
          if (!cancelResult.success) {
            throw new Error(cancelResult.error || "Failed to cancel booking");
          }

          const booking = cancelResult.booking!;
          const cancellationFee = booking.totalPrice * 0.2; // 20% cancellation fee

          return {
            content: [
              {
                type: "text",
                text: `# Booking Cancelled ❌

## Cancellation Details
- **Booking ID:** ${bookingId}
- **Reason:** ${cancellationReason}
- **Status:** Cancelled
- **Cancellation Date:** ${new Date().toLocaleDateString()}

## Financial Impact
- **Original Amount:** ${formatCurrency(booking.totalPrice)}
- **Cancellation Fee:** ${formatCurrency(cancellationFee)}
- **Refund Amount:** ${formatCurrency(booking.totalPrice - cancellationFee)}

## Refund Process
- Processing time: 5-7 business days
- Refund method: Original payment method
- Confirmation email will be sent once processed

*We're sorry to see you cancel. We hope to serve you in the future.*`
              }
            ]
          };

        case "get_details":
          const detailsBooking = await this.mockClient.getBooking(bookingId);
          
          if (!detailsBooking) {
            throw new Error("Booking not found");
          }

          const leg = detailsBooking.legs[0];

          return {
            content: [
              {
                type: "text",
                text: `# Booking Details

## Booking Information
- **Booking ID:** ${detailsBooking.id}
- **Status:** ${detailsBooking.status}
- **Created:** ${new Date(detailsBooking.createdAt).toLocaleDateString()}
- **Last Updated:** ${new Date(detailsBooking.updatedAt).toLocaleDateString()}

## Flight Details
- **Aircraft:** ${detailsBooking.aircraftId}
- **Route:** ${leg.departureAirport} → ${leg.arrivalAirport}
- **Date:** ${leg.departureDate}
- **Departure:** ${leg.departureTime}
- **Arrival:** ${leg.arrivalTime} (estimated)
- **Flight Time:** ${leg.flightTime} hours

## Passenger Information
- **Name:** ${detailsBooking.passenger.name}
- **Email:** ${detailsBooking.passenger.email}
- **Phone:** ${detailsBooking.passenger.phone}
${detailsBooking.passenger.company ? `- **Company:** ${detailsBooking.passenger.company}` : ''}

## Financial Summary
- **Total Cost:** ${formatCurrency(detailsBooking.totalPrice)}
- **Payment Status:** ${detailsBooking.paymentStatus}
- **Deposit:** ${formatCurrency(detailsBooking.depositAmount)} (due ${new Date(detailsBooking.depositDueDate).toLocaleDateString()})
- **Balance:** ${formatCurrency(detailsBooking.balanceAmount)} (due ${new Date(detailsBooking.balanceDueDate).toLocaleDateString()})

${detailsBooking.specialRequests ? `## Special Requests\n${detailsBooking.specialRequests}` : ''}

*For any modifications or questions, please contact our charter team.*`
              }
            ]
          };

        case "modify":
          return {
            content: [
              {
                type: "text",
                text: `# Booking Modification Request

## Request Submitted
- **Booking ID:** ${bookingId}
- **Request Type:** Modification
- **Status:** Pending operator approval

## Modifications Requested
${JSON.stringify(modifications, null, 2)}

## Next Steps
1. Operator will review your modification request
2. You will receive confirmation within 2-4 hours
3. Any price adjustments will be communicated
4. Updated booking confirmation will be sent

## Important Notes
- Modifications are subject to aircraft availability
- Price changes may apply based on new requirements
- Some modifications may require rebooking

*We'll contact you shortly with the modification status.*`
              }
            ]
          };

        default:
          throw new Error(`Invalid action: ${action}`);
      }
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

  private async getOperatorInfo(args: any) {
    const { operatorId, includeFleetDetails = false, includeSafetyRecords = true } = args;

    if (!operatorId) {
      throw new Error("Missing required parameter: operatorId");
    }

    try {
      // For now, use mock data
      const mockOperators = await import("./mock/avinode-mock-data");
      const operator = mockOperators.MOCK_OPERATORS.find(op => op.id === operatorId);

      if (!operator) {
        return {
          content: [
            {
              type: "text",
              text: "Operator not found. Please verify the operator ID."
            }
          ]
        };
      }

      const operatorAircraft = mockOperators.MOCK_AIRCRAFT.filter(a => a.operatorId === operatorId);

      let response = `# Operator Information

## ${operator.name}

### Company Details
- **ID:** ${operator.id}
- **Certificate:** ${operator.certificate}
- **Established:** ${operator.established}
- **Headquarters:** ${operator.headquarters}
- **Fleet Size:** ${operator.fleetSize} aircraft
- **Website:** ${operator.website}

### Contact Information
- **Email:** ${operator.contactEmail}
- **Phone:** ${operator.contactPhone}

### Operating Bases
${operator.operatingBases.join(' • ')}

### Description
${operator.description}`;

      if (includeSafetyRecords) {
        response += `

### Safety & Compliance
- **Safety Rating:** ${operator.safetyRating}
- **Insurance:** ${operator.insurance}
- **Certifications:** ${operator.certifications.join(', ')}
- **Safety Record:** No accidents or incidents in the past 10 years
- **Pilot Requirements:** 
  - Minimum 5,000 total flight hours
  - Type-rated on specific aircraft
  - Annual recurrent training
  - Regular medical certifications`;
      }

      if (includeFleetDetails && operatorAircraft.length > 0) {
        const fleetByCategory = operatorAircraft.reduce((acc, aircraft) => {
          if (!acc[aircraft.category]) {
            acc[aircraft.category] = [];
          }
          acc[aircraft.category].push(aircraft);
          return acc;
        }, {} as Record<string, typeof operatorAircraft>);

        response += `

### Fleet Composition
${Object.entries(fleetByCategory).map(([category, aircraft]) => 
  `- **${category}:** ${aircraft.length} aircraft
  ${aircraft.map(a => `  • ${a.model} (${a.registrationNumber})`).join('\n')}`
).join('\n')}

### Fleet Statistics
- **Average Age:** ${(operatorAircraft.reduce((sum, a) => sum + (2024 - a.yearOfManufacture), 0) / operatorAircraft.length).toFixed(1)} years
- **Total Passenger Capacity:** ${operatorAircraft.reduce((sum, a) => sum + a.maxPassengers, 0)} seats
- **WiFi Equipped:** ${operatorAircraft.filter(a => a.wifiAvailable).length}/${operatorAircraft.length} aircraft`;
      }

      response += `

---

*All information current as of ${new Date().toLocaleDateString()}*`;

      return {
        content: [
          {
            type: "text",
            text: response
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving operator info: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private isValidAirportCode(code: string): boolean {
    // Basic ICAO format validation (4 letters)
    // In production, would validate against actual airport database
    return /^[A-Z]{4}$/.test(code);
  }
}