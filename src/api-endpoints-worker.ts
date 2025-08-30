/**
 * REST API Endpoints for SchedAero and Paynode Integration (Cloudflare Worker version)
 * Provides N8N-compatible REST endpoints for aviation scheduling and payment processing
 */

import { SchedAeroMockClient } from './mock/schedaero-mock-client';
import { PaynodeMockClient } from './mock/paynode-mock-client';

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, X-API-Key',
  'Access-Control-Max-Age': '86400',
};

/**
 * SchedAero API Endpoints
 */

// List available SchedAero operations
export async function handleSchedAeroList(): Promise<Response> {
  const operations = [
    {
      name: 'search-maintenance-facilities',
      description: 'Search for maintenance facilities',
      parameters: ['location', 'certifications', 'capabilities']
    },
    {
      name: 'search-crew',
      description: 'Search for available crew members',
      parameters: ['aircraftType', 'qualifications', 'availability', 'location']
    },
    {
      name: 'create-maintenance-schedule',
      description: 'Schedule aircraft maintenance',
      parameters: ['aircraftId', 'facilityId', 'maintenanceType', 'scheduledDate', 'estimatedHours']
    },
    {
      name: 'create-flight-schedule',
      description: 'Create a flight schedule',
      parameters: ['aircraftId', 'crewIds', 'departureAirport', 'arrivalAirport', 'departureTime', 'passengers']
    },
    {
      name: 'update-aircraft-status',
      description: 'Update aircraft operational status',
      parameters: ['aircraftId', 'status', 'reason', 'estimatedAvailability']
    },
    {
      name: 'assign-crew',
      description: 'Assign crew to a flight',
      parameters: ['flightId', 'crewAssignments']
    }
  ];

  return new Response(JSON.stringify({
    success: true,
    service: 'SchedAero',
    operations: operations,
    count: operations.length
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Execute SchedAero operation
export async function handleSchedAeroOperation(operation: string, request: Request): Promise<Response> {
  try {
    const params = await request.json() as any;
    const schedAeroClient = new SchedAeroMockClient();
    let result;
    
    switch (operation) {
      case 'search-maintenance-facilities':
        result = await schedAeroClient.searchMaintenanceFacilities(params);
        break;
        
      case 'search-crew':
        result = await schedAeroClient.searchCrew(params);
        break;
        
      case 'create-maintenance-schedule':
        result = await schedAeroClient.createMaintenanceSchedule(params);
        break;
        
      case 'create-flight-schedule':
        result = await schedAeroClient.createFlightSchedule(params);
        break;
        
      case 'update-aircraft-status':
        result = await schedAeroClient.updateAircraftStatus(params);
        break;
        
      case 'assign-crew':
        result = await schedAeroClient.assignCrew(params);
        break;
        
      default:
        throw new Error(`Unknown SchedAero operation: ${operation}`);
    }

    return new Response(JSON.stringify({
      success: true,
      service: 'SchedAero',
      operation: operation,
      result: result,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(`SchedAero operation error for ${operation}:`, error);
    return new Response(JSON.stringify({
      success: false,
      service: 'SchedAero',
      operation: operation,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Paynode API Endpoints
 */

// List available Paynode operations
export async function handlePaynodeList(): Promise<Response> {
  const operations = [
    {
      name: 'create-invoice',
      description: 'Create a new invoice',
      parameters: ['accountId', 'customerAccountId', 'lineItems', 'dueDate', 'currency']
    },
    {
      name: 'process-payment',
      description: 'Process a payment',
      parameters: ['invoiceId', 'paymentMethodId', 'amount', 'currency']
    },
    {
      name: 'create-refund',
      description: 'Create a refund for a transaction',
      parameters: ['transactionId', 'amount', 'reason']
    },
    {
      name: 'get-account-balance',
      description: 'Get account balance and pending transactions',
      parameters: ['accountId']
    },
    {
      name: 'get-transaction-history',
      description: 'Get transaction history for an account',
      parameters: ['accountId', 'startDate', 'endDate', 'transactionType']
    },
    {
      name: 'add-payment-method',
      description: 'Add a new payment method',
      parameters: ['accountId', 'methodType', 'methodDetails']
    },
    {
      name: 'create-payout',
      description: 'Create a payout to a bank account',
      parameters: ['accountId', 'amount', 'currency', 'bankDetails']
    },
    {
      name: 'generate-statement',
      description: 'Generate an account statement',
      parameters: ['accountId', 'startDate', 'endDate', 'format']
    }
  ];

  return new Response(JSON.stringify({
    success: true,
    service: 'Paynode',
    operations: operations,
    count: operations.length
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

// Execute Paynode operation
export async function handlePaynodeOperation(operation: string, request: Request): Promise<Response> {
  try {
    const params = await request.json() as any;
    const paynodeClient = new PaynodeMockClient();
    let result;
    
    switch (operation) {
      case 'create-invoice':
        result = await paynodeClient.createInvoice(params);
        break;
        
      case 'process-payment':
        result = await paynodeClient.processPayment(params);
        break;
        
      case 'create-refund':
        result = await paynodeClient.createRefund(params);
        break;
        
      case 'get-account-balance':
        result = await paynodeClient.getAccountBalance(params.accountId);
        break;
        
      case 'get-transaction-history':
        result = await paynodeClient.getTransactionHistory(params);
        break;
        
      case 'add-payment-method':
        result = { message: 'Payment method operation not yet implemented' };
        break;
        
      case 'create-payout':
        result = { message: 'Payout operation not yet implemented' };
        break;
        
      case 'generate-statement':
        result = { message: 'Statement generation not yet implemented' };
        break;
        
      default:
        throw new Error(`Unknown Paynode operation: ${operation}`);
    }

    return new Response(JSON.stringify({
      success: true,
      service: 'Paynode',
      operation: operation,
      result: result,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error(`Paynode operation error for ${operation}:`, error);
    return new Response(JSON.stringify({
      success: false,
      service: 'Paynode',
      operation: operation,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}

/**
 * Combined services endpoint for multi-service operations
 */
export async function handleAllServices(): Promise<Response> {
  return new Response(JSON.stringify({
    success: true,
    services: {
      avinode: {
        description: 'Aviation marketplace and charter management',
        endpoint: '/api/tools',
        operations: 7
      },
      schedaero: {
        description: 'Aircraft scheduling and crew management',
        endpoint: '/api/schedaero',
        operations: 6
      },
      paynode: {
        description: 'Payment processing and financial management',
        endpoint: '/api/paynode',
        operations: 8
      }
    },
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}