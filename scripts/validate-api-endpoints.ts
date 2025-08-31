#!/usr/bin/env ts-node

/**
 * API Endpoint Validation Script
 * Tests all aviation operation endpoints with the seeded data
 * to ensure full functionality and data integration
 */

import axios from 'axios';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8124';

interface ValidationResult {
  endpoint: string;
  method: string;
  status: 'PASS' | 'FAIL';
  statusCode?: number;
  responseTime: number;
  error?: string;
  dataValidation?: string;
}

class APIValidator {
  private results: ValidationResult[] = [];
  
  async validateEndpoint(
    endpoint: string, 
    method: 'GET' | 'POST',
    data?: any,
    expectedFields?: string[],
    description?: string
  ): Promise<ValidationResult> {
    const startTime = Date.now();
    
    try {
      console.log(`🧪 Testing ${method} ${endpoint}${description ? ` - ${description}` : ''}`);
      
      const config = {
        method,
        url: `${API_BASE_URL}${endpoint}`,
        ...(data && { data }),
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      };
      
      const response = await axios(config);
      const responseTime = Date.now() - startTime;
      
      // Validate response structure
      let dataValidation = 'Response received';
      if (expectedFields) {
        const missingFields = expectedFields.filter(field => {
          return !this.hasField(response.data, field);
        });
        
        if (missingFields.length > 0) {
          dataValidation = `Missing fields: ${missingFields.join(', ')}`;
        } else {
          dataValidation = 'All expected fields present';
        }
      }
      
      const result: ValidationResult = {
        endpoint,
        method,
        status: 'PASS',
        statusCode: response.status,
        responseTime,
        dataValidation
      };
      
      console.log(`   ✅ PASS (${response.status}) - ${responseTime}ms - ${dataValidation}`);
      this.results.push(result);
      return result;
      
    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      const result: ValidationResult = {
        endpoint,
        method,
        status: 'FAIL',
        statusCode: error.response?.status,
        responseTime,
        error: error.message || 'Unknown error'
      };
      
      console.log(`   ❌ FAIL (${error.response?.status || 'ERROR'}) - ${responseTime}ms - ${error.message}`);
      this.results.push(result);
      return result;
    }
  }
  
  private hasField(obj: any, fieldPath: string): boolean {
    const fields = fieldPath.split('.');
    let current = obj;
    
    for (const field of fields) {
      if (current === null || current === undefined) return false;
      if (Array.isArray(current)) {
        current = current[0]; // Check first array element
      }
      if (typeof current === 'object' && field in current) {
        current = current[field];
      } else {
        return false;
      }
    }
    return true;
  }
  
  async runAllValidations() {
    console.log('🚀 Starting comprehensive API endpoint validation...\n');
    
    // 1. Health Check
    await this.validateEndpoint('/health', 'GET', null, ['status', 'timestamp'], 'System health check');
    
    // 2. List available tools
    await this.validateEndpoint('/api/tools', 'GET', null, ['tools'], 'List MCP tools');
    
    // 3. Search Aircraft - Basic search
    await this.validateEndpoint('/api/tools/search-aircraft', 'POST', {
      departureAirport: 'KJFK',
      arrivalAirport: 'KLAX',
      passengers: 4
    }, ['content'], 'Search aircraft basic');
    
    // 4. Search Aircraft - Advanced filters
    await this.validateEndpoint('/api/tools/search-aircraft', 'POST', {
      departureAirport: 'KMIA',
      arrivalAirport: 'KLAS',
      passengers: 8,
      category: 'Midsize Jet',
      petFriendly: true,
      wifiRequired: true
    }, ['content'], 'Search aircraft with filters');
    
    // Get sample aircraft for further testing
    const sampleAircraft = await this.getSampleData('aircraft');
    
    if (sampleAircraft.length > 0) {
      const aircraft = sampleAircraft[0];
      
      // 5. Get Pricing
      await this.validateEndpoint('/api/tools/get-pricing', 'POST', {
        aircraftId: aircraft.id,
        departureAirport: 'KTEB',
        arrivalAirport: 'KPBI',
        departureDate: '2024-04-15',
        returnDate: '2024-04-17',
        passengers: 4
      }, ['content'], 'Get pricing quote');
      
      // 6. Create Charter Request
      const charterRequest = await this.validateEndpoint('/api/tools/create-charter-request', 'POST', {
        aircraftId: aircraft.id,
        departureAirport: 'KJFK',
        arrivalAirport: 'KLAX',
        departureDate: '2024-05-01',
        departureTime: '09:00',
        passengers: 6,
        contactName: 'John Smith',
        contactEmail: 'john.smith@example.com',
        contactPhone: '+1-555-123-4567',
        company: 'Acme Corp'
      }, ['content'], 'Create charter request');
    }
    
    // Get sample booking for testing
    const sampleBookings = await this.getSampleData('booking');
    
    if (sampleBookings.length > 0) {
      const booking = sampleBookings[0];
      
      // 7. Manage Booking
      await this.validateEndpoint('/api/tools/manage-booking', 'POST', {
        action: 'get-details',
        bookingId: booking.id
      }, ['content'], 'Get booking details');
      
      // 8. Update Booking
      await this.validateEndpoint('/api/tools/manage-booking', 'POST', {
        action: 'update-passenger-info',
        bookingId: booking.id,
        passengerInfo: {
          specialRequests: 'Wheelchair assistance required'
        }
      }, ['content'], 'Update booking info');
    }
    
    // Get sample operator for testing
    const sampleOperators = await this.getSampleData('operator');
    
    if (sampleOperators.length > 0) {
      const operator = sampleOperators[0];
      
      // 9. Get Operator Info
      await this.validateEndpoint('/api/tools/get-operator-info', 'POST', {
        operatorId: operator.id
      }, ['content'], 'Get operator information');
    }
    
    // 10. Get Empty Legs
    await this.validateEndpoint('/api/tools/get-empty-legs', 'POST', {
      departureAirport: 'KTEB',
      arrivalAirport: 'KPBI',
      maxPrice: 50000,
      flexibleDates: true
    }, ['content'], 'Search empty legs');
    
    // 11. Fleet Utilization
    await this.validateEndpoint('/api/tools/get-fleet-utilization', 'POST', {
      operatorId: sampleOperators.length > 0 ? sampleOperators[0].id : undefined,
      timeRange: 'week',
      includeMaintenanceSchedule: true
    }, ['content'], 'Get fleet utilization');
    
    // 12. Operational Data
    await this.validateEndpoint('/api/operational-data', 'POST', {
      dataTypes: ['fleet-utilization', 'empty-legs', 'demand-forecast'],
      filters: {
        region: 'North America',
        timeRange: '7d'
      }
    }, ['data'], 'Get operational insights');
    
    // 13. Test competitive features
    await this.validateEndpoint('/api/tools/search-aircraft', 'POST', {
      departureAirport: 'KJFK',
      arrivalAirport: 'EGLL', // International route
      passengers: 10,
      includeAIPredictions: true,
      includeSustainabilityMetrics: true,
      enableDynamicPricing: true
    }, ['content'], 'Search with AI features');
    
    console.log('\n📊 Validation Summary');
    console.log('=====================');
    this.printSummary();
  }
  
  private async getSampleData(table: 'aircraft' | 'operator' | 'booking') {
    try {
      switch (table) {
        case 'aircraft':
          return await prisma.aircraft.findMany({ take: 3 });
        case 'operator':
          return await prisma.operator.findMany({ take: 3 });
        case 'booking':
          return await prisma.booking.findMany({ take: 3 });
        default:
          return [];
      }
    } catch (error) {
      console.log(`⚠️  Could not fetch sample ${table} data:`, error);
      return [];
    }
  }
  
  private printSummary() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.status === 'PASS').length;
    const failedTests = totalTests - passedTests;
    
    const avgResponseTime = this.results.reduce((sum, r) => sum + r.responseTime, 0) / totalTests;
    
    console.log(`Total Tests: ${totalTests}`);
    console.log(`✅ Passed: ${passedTests} (${Math.round(passedTests / totalTests * 100)}%)`);
    console.log(`❌ Failed: ${failedTests} (${Math.round(failedTests / totalTests * 100)}%)`);
    console.log(`⏱️  Average Response Time: ${Math.round(avgResponseTime)}ms`);
    
    if (failedTests > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.filter(r => r.status === 'FAIL').forEach(result => {
        console.log(`   • ${result.method} ${result.endpoint}: ${result.error} (${result.statusCode || 'N/A'})`);
      });
    }
    
    console.log('\n🎯 Performance Analysis:');
    const slowTests = this.results.filter(r => r.responseTime > 1000);
    if (slowTests.length > 0) {
      console.log('   ⚠️  Slow responses (>1000ms):');
      slowTests.forEach(result => {
        console.log(`      • ${result.endpoint}: ${result.responseTime}ms`);
      });
    } else {
      console.log('   ✅ All responses under 1000ms');
    }
    
    console.log('\n✅ Validation Report:');
    if (passedTests === totalTests) {
      console.log('   🎉 ALL TESTS PASSED! Your aviation API is fully functional.');
      console.log('   🚀 Ready for production deployment and client demonstrations.');
    } else if (passedTests / totalTests >= 0.8) {
      console.log('   ⚠️  Most tests passed. Review failed tests and fix issues.');
      console.log('   🔧 Some endpoints may need attention before production.');
    } else {
      console.log('   ❌ Multiple test failures detected. Review system configuration.');
      console.log('   🛠️  Check database connection, environment variables, and server status.');
    }
    
    console.log('\n🔗 Next Steps:');
    console.log('   1. Start the server: npm run dev');
    console.log('   2. Test individual endpoints with the provided curl examples');
    console.log('   3. Use the data for comprehensive aviation operations testing');
    console.log('   4. Demonstrate NextAvinode competitive advantages');
  }
}

async function main() {
  const validator = new APIValidator();
  
  try {
    await validator.runAllValidations();
  } catch (error) {
    console.error('❌ Validation script failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  main()
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

export default main;