import { CallToolRequest } from "@modelcontextprotocol/sdk/types.js";
import { AvinodeMockClient } from "./mock/avinode-mock-client";
import { formatCurrency, MOCK_OPERATORS, MOCK_AIRCRAFT } from "./mock/avinode-mock-data";
import { supabase, isSupabaseAvailable } from "./lib/supabase";

export class AvainodeTools {
  private mockClient: AvinodeMockClient;
  private useMockData: boolean;

  constructor(apiKey?: string, forceMockData?: boolean) {
    // Use provided apiKey or fallback to environment variable (if in Node.js)
    const effectiveApiKey = apiKey || (typeof process !== 'undefined' ? process.env.AVAINODE_API_KEY : "") || "";
    
    // Check if we should use Supabase database
    const useSupabase = (typeof process !== 'undefined' && 
                        (process.env.USE_SUPABASE === "true" || 
                         process.env.AVAINODE_USE_DATABASE === "true")) && 
                        isSupabaseAvailable();
    
    // Use mock data if explicitly forced, no API key, or USE_MOCK_DATA env is true, but prefer Supabase if available
    this.useMockData = forceMockData || (!effectiveApiKey && !useSupabase) || 
                      (typeof process !== 'undefined' && process.env.USE_MOCK_DATA === "true" && !useSupabase);
    
    if (useSupabase) {
      console.log("Using Supabase database for aviation data");
      this.useMockData = false;
    } else if (this.useMockData) {
      console.log("Using Avinode mock data (set AVAINODE_API_KEY or configure Supabase to use real data)");
    }
    
    this.mockClient = new AvinodeMockClient(this.useMockData, useSupabase);
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
      
      // SCHEDAERO TOOLS
      case "search-maintenance-facilities":
        return await this.searchMaintenanceFacilities(args);
        
      case "search-crew":
        return await this.searchCrew(args);
        
      case "create-maintenance-schedule":
        return await this.createMaintenanceSchedule(args);
        
      case "create-flight-schedule":
        return await this.createFlightSchedule(args);
        
      case "update-aircraft-status":
        return await this.updateAircraftStatus(args);
        
      case "assign-crew":
        return await this.assignCrew(args);
        
      // PAYNODE TOOLS
      case "create-invoice":
        return await this.createInvoice(args);
        
      case "process-payment":
        return await this.processPayment(args);
        
      case "create-refund":
        return await this.createRefund(args);
        
      case "get-account-balance":
        return await this.getAccountBalance(args);
        
      case "get-transaction-history":
        return await this.getTransactionHistory(args);
        
      case "add-payment-method":
        return await this.addPaymentMethod(args);
        
      case "create-payout":
        return await this.createPayout(args);
        
      case "generate-statement":
        return await this.generateStatement(args);
      
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

        case "get-details":
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
      // Use imported mock data
      const operator = MOCK_OPERATORS.find((op: any) => op.id === operatorId);

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

      const operatorAircraft = MOCK_AIRCRAFT.filter((a: any) => a.operatorId === operatorId);

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
        const fleetByCategory = operatorAircraft.reduce((acc: any, aircraft: any) => {
          if (!acc[aircraft.category]) {
            acc[aircraft.category] = [];
          }
          acc[aircraft.category].push(aircraft);
          return acc;
        }, {} as Record<string, typeof operatorAircraft>);

        response += `

### Fleet Composition
${Object.entries(fleetByCategory).map(([category, aircraft]: [string, any]) => 
  `- **${category}:** ${aircraft.length} aircraft
  ${aircraft.map((a: any) => `  • ${a.model} (${a.registrationNumber})`).join('\n')}`
).join('\n')}

### Fleet Statistics
- **Average Age:** ${(operatorAircraft.reduce((sum: number, a: any) => sum + (2024 - a.yearOfManufacture), 0) / operatorAircraft.length).toFixed(1)} years
- **Total Passenger Capacity:** ${operatorAircraft.reduce((sum: number, a: any) => sum + a.maxPassengers, 0)} seats
- **WiFi Equipped:** ${operatorAircraft.filter((a: any) => a.wifiAvailable).length}/${operatorAircraft.length} aircraft`;
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

  // SCHEDAERO TOOL HANDLERS
  private async searchMaintenanceFacilities(args: any) {
    const { location, certifications, capabilities } = args;
    
    try {
      // Mock maintenance facilities data
      const facilities = [
        {
          id: "MF001",
          name: "JetTech Aviation Services",
          location: "Teterboro, NJ (KTEB)",
          certifications: ["FAR Part 145", "EASA Part 145", "IS-BAO Stage III"],
          capabilities: ["Engine Overhaul", "Avionics Upgrade", "Structural Repair"],
          rating: "5.0/5.0",
          contactPhone: "+1-201-555-0101",
          contactEmail: "service@jettech-aviation.com"
        },
        {
          id: "MF002", 
          name: "Stevens Aerospace & Defense",
          location: "Greenville, SC (KGMU)",
          certifications: ["FAR Part 145", "AS9100"],
          capabilities: ["Heavy Maintenance", "Aircraft Modifications", "Paint Services"],
          rating: "4.8/5.0",
          contactPhone: "+1-864-555-0102",
          contactEmail: "mro@stevens.aero"
        }
      ];

      return {
        content: [
          {
            type: "text",
            text: `# Maintenance Facilities Search Results

**Search Criteria:**
${location ? `- Location: ${location}` : ''}
${certifications ? `- Certifications: ${certifications}` : ''}
${capabilities ? `- Capabilities: ${capabilities}` : ''}

---

${facilities.map(f => `## ${f.name} (${f.id})
**Location:** ${f.location}
**Rating:** ${f.rating}
**Certifications:** ${f.certifications.join(', ')}
**Capabilities:** ${f.capabilities.join(', ')}
**Contact:** ${f.contactPhone} | ${f.contactEmail}`).join('\n\n---\n\n')}

*Contact facilities directly to schedule maintenance or request quotes.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching maintenance facilities: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async searchCrew(args: any) {
    const { aircraftType, qualifications, availability, location } = args;
    
    try {
      // Mock crew data
      const crew = [
        {
          id: "CR001",
          name: "Captain Sarah Mitchell",
          role: "Captain",
          totalHours: 12500,
          typeRating: ["Citation CJ3+", "Hawker 400XP"],
          location: "Teterboro, NJ",
          availability: "Available",
          certifications: ["ATP", "First Class Medical", "English Proficient"]
        },
        {
          id: "CR002",
          name: "First Officer Michael Rodriguez", 
          role: "First Officer",
          totalHours: 6800,
          typeRating: ["Learjet 60", "Citation Sovereign"],
          location: "Los Angeles, CA",
          availability: "Available",
          certifications: ["Commercial", "First Class Medical", "Instrument Rating"]
        }
      ];

      return {
        content: [
          {
            type: "text", 
            text: `# Crew Search Results

**Search Criteria:**
${aircraftType ? `- Aircraft Type: ${aircraftType}` : ''}
${qualifications ? `- Qualifications: ${qualifications}` : ''}
${availability ? `- Availability: ${availability}` : ''}
${location ? `- Location: ${location}` : ''}

---

${crew.map(c => `## ${c.name} (${c.id})
**Role:** ${c.role}
**Total Hours:** ${c.totalHours.toLocaleString()}
**Type Ratings:** ${c.typeRating.join(', ')}
**Location:** ${c.location}
**Status:** ${c.availability}
**Certifications:** ${c.certifications.join(', ')}`).join('\n\n---\n\n')}

*Contact crew scheduling to assign crew members to flights.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error searching crew: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async createMaintenanceSchedule(args: any) {
    const { aircraftId, facilityId, maintenanceType, scheduledDate, estimatedHours } = args;

    if (!aircraftId || !facilityId || !maintenanceType || !scheduledDate) {
      throw new Error("Missing required maintenance scheduling parameters");
    }

    try {
      const scheduleId = `MS${Date.now()}`;
      const estimatedCost = (estimatedHours || 8) * 150; // $150/hour labor rate

      return {
        content: [
          {
            type: "text",
            text: `# Maintenance Schedule Created ✅

## Schedule Details
- **Schedule ID:** ${scheduleId}
- **Aircraft ID:** ${aircraftId}
- **Facility ID:** ${facilityId}
- **Maintenance Type:** ${maintenanceType}
- **Scheduled Date:** ${scheduledDate}
- **Estimated Hours:** ${estimatedHours || 8}
- **Estimated Cost:** $${estimatedCost.toLocaleString()}

## Next Steps
1. Facility will contact you for confirmation
2. Aircraft must be available 24 hours before scheduled date
3. Maintenance records will be updated upon completion
4. Final invoice will reflect actual hours and parts

*Maintenance schedule has been submitted to the facility.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating maintenance schedule: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async createFlightSchedule(args: any) {
    const { aircraftId, crewIds, departureAirport, arrivalAirport, departureTime, passengers } = args;

    if (!aircraftId || !crewIds || !departureAirport || !arrivalAirport || !departureTime) {
      throw new Error("Missing required flight scheduling parameters");
    }

    try {
      const flightId = `FL${Date.now()}`;
      const flightTime = 2.5; // Mock flight time

      return {
        content: [
          {
            type: "text",
            text: `# Flight Schedule Created ✈️

## Flight Details
- **Flight ID:** ${flightId}
- **Aircraft ID:** ${aircraftId}
- **Route:** ${departureAirport} → ${arrivalAirport}
- **Departure:** ${departureTime}
- **Passengers:** ${passengers}
- **Estimated Flight Time:** ${flightTime} hours

## Crew Assignment
- **Assigned Crew:** ${Array.isArray(crewIds) ? crewIds.join(', ') : crewIds}

## Status
- **Schedule Status:** Confirmed
- **Aircraft Status:** Reserved
- **Crew Status:** Assigned

## Next Steps
1. Pre-flight briefing 2 hours before departure
2. Aircraft positioning if required
3. Passenger manifest finalization
4. Weather briefing and flight plan filing

*Flight schedule has been created and crew notified.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating flight schedule: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async updateAircraftStatus(args: any) {
    const { aircraftId, status, reason, estimatedAvailability } = args;

    if (!aircraftId || !status) {
      throw new Error("Missing required parameters: aircraftId and status");
    }

    try {
      return {
        content: [
          {
            type: "text",
            text: `# Aircraft Status Updated ✅

## Status Change
- **Aircraft ID:** ${aircraftId}
- **New Status:** ${status.toUpperCase()}
- **Previous Status:** Available
- **Update Time:** ${new Date().toISOString()}

${reason ? `## Reason\n${reason}` : ''}

${estimatedAvailability ? `## Estimated Availability\n${estimatedAvailability}` : ''}

## Impact Assessment
- Flight schedules will be automatically reviewed
- Alternative aircraft may be assigned for pending bookings
- Maintenance teams will be notified if applicable

*Aircraft status has been updated in the fleet management system.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error updating aircraft status: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async assignCrew(args: any) {
    const { flightId, crewAssignments } = args;

    if (!flightId || !crewAssignments) {
      throw new Error("Missing required parameters: flightId and crewAssignments");
    }

    try {
      return {
        content: [
          {
            type: "text",
            text: `# Crew Assignment Completed ✅

## Assignment Details
- **Flight ID:** ${flightId}
- **Assignment Date:** ${new Date().toLocaleDateString()}

## Crew Assignments
${JSON.stringify(crewAssignments, null, 2)}

## Crew Duties
- Pre-flight briefing: 2 hours before departure
- Aircraft inspection: 1 hour before departure
- Passenger briefing: 30 minutes before departure
- Post-flight duties: Aircraft securing and logbook completion

## Notifications
- Crew members have been notified via SMS and email
- Calendar invitations sent with flight details
- Crew rest requirements verified

*Crew assignment completed successfully.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error assigning crew: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  // PAYNODE TOOL HANDLERS
  private async createInvoice(args: any) {
    const { accountId, customerAccountId, lineItems, dueDate, currency } = args;

    if (!accountId || !customerAccountId || !lineItems || !currency) {
      throw new Error("Missing required invoice parameters");
    }

    try {
      const invoiceId = `INV${Date.now()}`;
      const subtotal = Array.isArray(lineItems) ? lineItems.reduce((sum, item) => sum + (item.amount || 0), 0) : 1000;
      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      return {
        content: [
          {
            type: "text",
            text: `# Invoice Created 📄

## Invoice Details
- **Invoice ID:** ${invoiceId}
- **Account ID:** ${accountId}
- **Customer Account:** ${customerAccountId}
- **Currency:** ${currency}
- **Due Date:** ${dueDate || 'Net 30'}
- **Created:** ${new Date().toLocaleDateString()}

## Line Items
${Array.isArray(lineItems) ? lineItems.map((item, i) => 
  `${i + 1}. ${item.description || 'Service'}: ${formatCurrency(item.amount || 0)}`
).join('\n') : 'Charter Flight Service: $1,000.00'}

## Invoice Summary
- **Subtotal:** ${formatCurrency(subtotal)}
- **Tax (8%):** ${formatCurrency(tax)}
- **Total Amount:** ${formatCurrency(total)}

## Payment Terms
- Payment due within 30 days
- Late fees apply after due date
- Multiple payment methods accepted

*Invoice has been generated and sent to customer.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating invoice: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async processPayment(args: any) {
    const { invoiceId, paymentMethodId, amount, currency } = args;

    if (!invoiceId || !paymentMethodId || !amount || !currency) {
      throw new Error("Missing required payment parameters");
    }

    try {
      const transactionId = `TXN${Date.now()}`;
      const processingFee = amount * 0.029; // 2.9% processing fee

      return {
        content: [
          {
            type: "text",
            text: `# Payment Processed ✅

## Transaction Details
- **Transaction ID:** ${transactionId}
- **Invoice ID:** ${invoiceId}
- **Payment Method:** ${paymentMethodId}
- **Amount:** ${formatCurrency(amount)} ${currency}
- **Processing Fee:** ${formatCurrency(processingFee)}
- **Net Amount:** ${formatCurrency(amount - processingFee)}
- **Status:** Completed
- **Processed:** ${new Date().toISOString()}

## Payment Summary
- Payment has been successfully processed
- Funds will be available in 2-3 business days
- Confirmation email sent to all parties
- Invoice status updated to PAID

## Next Steps
- Receipt will be generated automatically
- Accounting records updated
- Customer notified of successful payment

*Payment processing completed successfully.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error processing payment: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async createRefund(args: any) {
    const { transactionId, amount, reason } = args;

    if (!transactionId || !amount || !reason) {
      throw new Error("Missing required refund parameters");
    }

    try {
      const refundId = `REF${Date.now()}`;

      return {
        content: [
          {
            type: "text",
            text: `# Refund Created 💰

## Refund Details
- **Refund ID:** ${refundId}
- **Original Transaction:** ${transactionId}
- **Refund Amount:** ${formatCurrency(amount)}
- **Reason:** ${reason}
- **Status:** Processing
- **Created:** ${new Date().toISOString()}

## Processing Information
- Refund will be processed within 5-7 business days
- Funds will return to original payment method
- Customer will receive email confirmation
- Transaction history updated

## Refund Policy
- Full refunds available within 24 hours of booking
- Partial refunds subject to cancellation policy
- Processing fees may apply

*Refund request has been initiated and is being processed.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating refund: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getAccountBalance(args: any) {
    const { accountId } = args;

    if (!accountId) {
      throw new Error("Missing required parameter: accountId");
    }

    try {
      // Mock account balance data
      const availableBalance = 125000;
      const pendingBalance = 15000;
      const totalBalance = availableBalance + pendingBalance;

      return {
        content: [
          {
            type: "text",
            text: `# Account Balance

## Account: ${accountId}

### Current Balances
- **Available Balance:** ${formatCurrency(availableBalance)}
- **Pending Transactions:** ${formatCurrency(pendingBalance)}
- **Total Balance:** ${formatCurrency(totalBalance)}

### Recent Activity
- Last Transaction: 2 hours ago
- Last Deposit: ${formatCurrency(25000)} (3 days ago)
- Last Withdrawal: ${formatCurrency(5000)} (1 day ago)

### Account Status
- **Status:** Active
- **Credit Limit:** ${formatCurrency(500000)}
- **Available Credit:** ${formatCurrency(375000)}
- **Last Updated:** ${new Date().toISOString()}

*Account balance reflects all processed transactions as of now.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving account balance: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async getTransactionHistory(args: any) {
    const { accountId, startDate, endDate, transactionType } = args;

    if (!accountId) {
      throw new Error("Missing required parameter: accountId");
    }

    try {
      // Mock transaction data
      const transactions = [
        {
          id: "TXN001",
          date: "2024-01-15",
          type: "Payment",
          description: "Charter Flight Payment",
          amount: -15000,
          balance: 125000
        },
        {
          id: "TXN002", 
          date: "2024-01-14",
          type: "Deposit",
          description: "Account Funding",
          amount: 25000,
          balance: 140000
        }
      ];

      return {
        content: [
          {
            type: "text",
            text: `# Transaction History

## Account: ${accountId}
**Period:** ${startDate || 'All Time'} to ${endDate || 'Present'}
${transactionType ? `**Filter:** ${transactionType}` : ''}

---

${transactions.map(t => `### ${t.id}
**Date:** ${t.date}
**Type:** ${t.type}
**Description:** ${t.description}
**Amount:** ${t.amount > 0 ? '+' : ''}${formatCurrency(Math.abs(t.amount))}
**Balance:** ${formatCurrency(t.balance)}`).join('\n\n---\n\n')}

## Summary
- **Total Transactions:** ${transactions.length}
- **Total Credits:** ${formatCurrency(25000)}
- **Total Debits:** ${formatCurrency(15000)}
- **Net Change:** ${formatCurrency(10000)}

*Transaction history complete as of ${new Date().toLocaleDateString()}*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error retrieving transaction history: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async addPaymentMethod(args: any) {
    const { accountId, methodType, methodDetails } = args;

    if (!accountId || !methodType || !methodDetails) {
      throw new Error("Missing required payment method parameters");
    }

    try {
      const methodId = `PM${Date.now()}`;

      return {
        content: [
          {
            type: "text",
            text: `# Payment Method Added ✅

## Method Details
- **Method ID:** ${methodId}
- **Account ID:** ${accountId}
- **Method Type:** ${methodType.toUpperCase()}
- **Status:** Active
- **Added:** ${new Date().toISOString()}

## Method Information
${JSON.stringify(methodDetails, null, 2)}

## Security Notes
- Payment method has been encrypted and stored securely
- Method verification may be required for first use
- Method can be removed at any time from account settings

## Next Steps
- Method is now available for payments
- Default payment method can be set in account preferences
- Transaction limits apply based on method type

*Payment method successfully added to account.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error adding payment method: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async createPayout(args: any) {
    const { accountId, amount, currency, bankDetails } = args;

    if (!accountId || !amount || !currency || !bankDetails) {
      throw new Error("Missing required payout parameters");
    }

    try {
      const payoutId = `PO${Date.now()}`;

      return {
        content: [
          {
            type: "text",
            text: `# Payout Created 💸

## Payout Details
- **Payout ID:** ${payoutId}
- **Account ID:** ${accountId}
- **Amount:** ${formatCurrency(amount)} ${currency}
- **Status:** Processing
- **Created:** ${new Date().toISOString()}

## Bank Details
${JSON.stringify(bankDetails, null, 2)}

## Processing Information
- Payout will be processed within 1-2 business days
- Funds will arrive in 3-5 business days
- Payout fee: $5.00 (deducted from payout amount)
- Net payout: ${formatCurrency(amount - 5)}

## Status Tracking
- Processing confirmation will be sent via email
- Bank transfer reference will be provided
- Account balance will be updated immediately

*Payout request submitted and is being processed.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating payout: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }

  private async generateStatement(args: any) {
    const { accountId, startDate, endDate, format } = args;

    if (!accountId || !startDate || !endDate) {
      throw new Error("Missing required statement parameters");
    }

    try {
      const statementId = `STMT${Date.now()}`;

      return {
        content: [
          {
            type: "text",
            text: `# Account Statement Generated 📊

## Statement Details
- **Statement ID:** ${statementId}
- **Account ID:** ${accountId}
- **Period:** ${startDate} to ${endDate}
- **Format:** ${format || 'PDF'}
- **Generated:** ${new Date().toISOString()}

## Statement Summary
- **Opening Balance:** ${formatCurrency(100000)}
- **Total Credits:** ${formatCurrency(50000)}
- **Total Debits:** ${formatCurrency(25000)}
- **Closing Balance:** ${formatCurrency(125000)}
- **Transaction Count:** 15

## Delivery Information
- Statement will be sent to registered email address
- Download link will be available for 30 days
- Physical copy can be mailed upon request

## Statement Contents
- Complete transaction history for period
- Account balance progression
- Fee summary and analysis
- Contact information for support

*Statement generation completed successfully.*`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error generating statement: ${error instanceof Error ? error.message : "Unknown error"}`
          }
        ]
      };
    }
  }
}