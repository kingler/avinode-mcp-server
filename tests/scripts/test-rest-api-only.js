#!/usr/bin/env node

/**
 * Test script for N8N REST API integration (bypasses MCP protocol issues)
 * This script tests the recommended approach for N8N workflows
 */

const http = require('http');

const API_BASE_URL = 'http://localhost:8124';

class RestAPITestClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async makeRequest(endpoint, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.baseUrl);
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
      };

      const req = http.request(url, options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          try {
            const parsedData = JSON.parse(responseData);
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: parsedData
            });
          } catch (error) {
            resolve({
              statusCode: res.statusCode,
              headers: res.headers,
              data: responseData
            });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  // Health check
  async checkHealth() {
    console.log('🏥 Testing server health...');
    try {
      const response = await this.makeRequest('/health', 'GET');
      console.log('✅ Health check result:', response.data);
      return response.statusCode === 200;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      return false;
    }
  }

  // List available tools
  async listTools() {
    console.log('📋 Listing available tools...');
    try {
      const response = await this.makeRequest('/api/tools', 'GET');
      console.log('🔧 Available tools:', response.data.tools.length, 'tools found');
      return response.data.tools || [];
    } catch (error) {
      console.error('❌ Failed to list tools:', error.message);
      return [];
    }
  }

  // Test operational data (primary N8N use case)
  async getOperationalData() {
    console.log('📊 Testing operational data retrieval...');
    try {
      const response = await this.makeRequest('/api/operational-data', 'POST', {
        dataType: 'fleet-utilization',
        operatorId: 'OP001',
        startDate: '2025-01-01',
        endDate: '2025-12-31'
      });

      if (response.data.success) {
        console.log('✅ Operational data retrieved successfully');
        console.log('📈 Fleet utilization data available');
        return response.data.result;
      } else {
        console.log('❌ Operational data failed:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Operational data request failed:', error.message);
      return null;
    }
  }

  // Test aircraft search
  async searchAircraft() {
    console.log('✈️ Testing aircraft search...');
    try {
      const response = await this.makeRequest('/api/tools/search-aircraft', 'POST', {
        departureAirport: 'KJFK',
        arrivalAirport: 'KLAX',
        departureDate: '2024-12-25',
        passengers: 6,
        aircraftCategory: 'Light Jet',
        maxPrice: 5000
      });

      if (response.data.success) {
        console.log('✅ Aircraft search successful');
        const content = response.data.result.content[0].text;
        const aircraftCount = (content.match(/Aircraft ID:/g) || []).length;
        console.log('🛩️ Found', aircraftCount, 'aircraft options');
        return response.data.result;
      } else {
        console.log('❌ Aircraft search failed:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Aircraft search failed:', error.message);
      return null;
    }
  }

  // Test pricing quote
  async getPricing() {
    console.log('💰 Testing pricing quote...');
    try {
      const response = await this.makeRequest('/api/tools/get-pricing', 'POST', {
        aircraftId: 'ACF001',
        departureAirport: 'KJFK',
        arrivalAirport: 'KLAX',
        departureDate: '2024-12-25',
        departureTime: '10:00',
        passengers: 6,
        includeAllFees: true
      });

      if (response.data.success) {
        console.log('✅ Pricing quote generated');
        const content = response.data.result.content[0].text;
        const totalMatch = content.match(/Total Price:\\s*\\$([\\d,]+)/);
        if (totalMatch) {
          console.log('💵 Quote total:', '$' + totalMatch[1]);
        }
        return response.data.result;
      } else {
        console.log('❌ Pricing quote failed:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Pricing quote failed:', error.message);
      return null;
    }
  }

  // Test empty legs
  async getEmptyLegs() {
    console.log('🚁 Testing empty legs search...');
    try {
      const response = await this.makeRequest('/api/tools/get-empty-legs', 'POST', {
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        maxPrice: 10000
      });

      if (response.data.success) {
        console.log('✅ Empty legs search successful');
        const content = response.data.result.content[0].text;
        const discountMatches = content.match(/\\d+% OFF!/g) || [];
        console.log('🔥 Found', discountMatches.length, 'discounted flights');
        return response.data.result;
      } else {
        console.log('❌ Empty legs search failed:', response.data.error);
        return null;
      }
    } catch (error) {
      console.error('❌ Empty legs search failed:', error.message);
      return null;
    }
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting N8N REST API Integration Tests');
  console.log('=' .repeat(55));

  const client = new RestAPITestClient(API_BASE_URL);

  // Step 1: Health Check
  const healthOk = await client.checkHealth();
  if (!healthOk) {
    console.log('❌ Server health check failed - aborting tests');
    process.exit(1);
  }

  console.log('');

  // Step 2: List Tools
  const tools = await client.listTools();
  if (tools.length === 0) {
    console.log('⚠️ No tools available');
  }

  console.log('');

  // Step 3: Test Core Functionality
  const tests = [
    { name: 'Operational Data', test: () => client.getOperationalData() },
    { name: 'Aircraft Search', test: () => client.searchAircraft() },
    { name: 'Pricing Quote', test: () => client.getPricing() },
    { name: 'Empty Legs', test: () => client.getEmptyLegs() }
  ];

  const results = [];
  for (const { name, test } of tests) {
    try {
      const result = await test();
      results.push({ name, success: result !== null });
    } catch (error) {
      console.error(`❌ ${name} test failed:`, error.message);
      results.push({ name, success: false });
    }
    console.log('');
  }

  // Summary
  console.log('=' .repeat(55));
  console.log('📋 TEST SUMMARY');
  console.log('=' .repeat(55));

  const successful = results.filter(r => r.success).length;
  const total = results.length;

  results.forEach(({ name, success }) => {
    console.log(`${success ? '✅' : '❌'} ${name}`);
  });

  console.log('');
  
  if (successful === total) {
    console.log(`🎉 ALL TESTS PASSED (${successful}/${total})`);
    console.log('✅ N8N REST API integration is fully functional!');
    console.log('');
    console.log('🔧 NEXT STEPS:');
    console.log('1. Import workflow from: n8n-configurations/complete-aviation-workflow.json');
    console.log('2. Configure HTTP Request nodes with endpoints shown above');
    console.log('3. Use operational-data endpoint for your "Get Operational Data" node');
    console.log('');
    console.log('📖 Full setup guide: N8N_SETUP_GUIDE.md');
  } else {
    console.log(`⚠️ PARTIAL SUCCESS (${successful}/${total} tests passed)`);
    console.log('Some functionality may be limited, but basic integration works.');
  }

  console.log('');
  console.log('🌐 Server running at:', API_BASE_URL);
  console.log('📡 Health endpoint:', API_BASE_URL + '/health');
  console.log('🔧 Tools endpoint:', API_BASE_URL + '/api/tools');
  console.log('📊 Operational data:', API_BASE_URL + '/api/operational-data');
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});