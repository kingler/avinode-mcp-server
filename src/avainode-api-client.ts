interface AircraftSearchParams {
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  return_date?: string;
  passengers: number;
  aircraft_category?: string;
  max_price?: number;
}

interface CharterRequestParams {
  aircraft_id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  departure_time: string;
  passengers: number;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  special_requests?: string;
}

interface PricingParams {
  aircraft_id: string;
  departure_airport: string;
  arrival_airport: string;
  departure_date: string;
  return_date?: string;
  passengers: number;
  include_all_fees?: boolean;
}

interface BookingManagementParams {
  booking_id: string;
  action: 'confirm' | 'cancel' | 'get_details' | 'modify';
  payment_method?: string;
  cancellation_reason?: string;
  modifications?: any;
}

export class AvainodeAPIClient {
  private readonly baseUrl = "https://api.avinodegroup.com/v1";
  private readonly userAgent = "jetvision-avainode-mcp/1.0";
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async searchAircraft(params: AircraftSearchParams): Promise<any> {
    // Validate required parameters
    if (!params.departure_airport || !params.arrival_airport || !params.departure_date) {
      throw new Error("Missing required parameters: departure_airport, arrival_airport, and departure_date are required");
    }

    return this.makeRequest("/aircraft/search", "POST", params);
  }

  async createCharterRequest(params: CharterRequestParams): Promise<any> {
    // Validate required fields
    const requiredFields = ['aircraft_id', 'departure_airport', 'arrival_airport', 
                           'departure_date', 'departure_time', 'passengers'];
    
    for (const field of requiredFields) {
      if (!(field in params)) {
        throw new Error(`Missing required booking parameters: ${field}`);
      }
    }

    if (!params.contact || !params.contact.name || !params.contact.email || !params.contact.phone) {
      throw new Error("Missing required booking parameters: contact information");
    }

    return this.makeRequest("/charter/requests", "POST", params);
  }

  async calculatePricing(params: PricingParams): Promise<any> {
    if (!params.aircraft_id || !params.departure_airport || !params.arrival_airport || 
        !params.departure_date || !params.passengers) {
      throw new Error("Missing required pricing parameters");
    }

    return this.makeRequest("/pricing/quote", "POST", params);
  }

  async manageBooking(params: BookingManagementParams): Promise<any> {
    if (!params.booking_id || !params.action) {
      throw new Error("Missing required parameters: booking_id and action");
    }

    const endpoint = `/bookings/${params.booking_id}/${params.action}`;
    return this.makeRequest(endpoint, "POST", params);
  }

  async getOperatorInfo(operatorId: string): Promise<any> {
    if (!operatorId) {
      throw new Error("Operator ID is required");
    }

    return this.makeRequest(`/operators/${operatorId}`, "GET");
  }

  private async makeRequest(endpoint: string, method: string, data?: any): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": this.userAgent,
      "Accept": "application/json"
    };

    const options: RequestInit = {
      method,
      headers,
      body: method !== "GET" && data ? JSON.stringify(data) : undefined
    };

    // Add query params for GET requests
    let finalUrl = url;
    if (method === "GET" && data) {
      const params = new URLSearchParams(data);
      finalUrl = `${url}?${params}`;
    }

    try {
      const response = await fetch(finalUrl, options);

      // Handle rate limiting with exponential backoff
      if (response.status === 429) {
        const retryAfter = response.headers.get("Retry-After");
        const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : 2000;
        
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return this.makeRequest(endpoint, method, data);
      }

      if (response.status === 401) {
        throw new Error("Authentication failed: Invalid API key");
      }

      const responseData = await response.json() as any;

      if (!response.ok) {
        const errorMessage = responseData?.message || responseData?.error || `HTTP ${response.status}`;
        throw new Error(errorMessage);
      }

      // Validate response format for specific endpoints
      if (endpoint.includes("/aircraft/search") && !responseData?.aircraft) {
        throw new Error("Invalid response format: missing 'aircraft' field");
      }

      return responseData;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Network error occurred");
    }
  }
}