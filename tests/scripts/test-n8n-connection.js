#!/usr/bin/env node

/**
 * Test script to validate N8N MCP Server connectivity
 * This script simulates what the N8N MCP Agent custom node would do
 */

const https = require('http');

const MCP_SERVER_URL = 'http://localhost:8124';

class MCPTestClient {
  constructor(apiUrl, apiKey) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
    this.sessionId = null;
  }

  async makeRequest(endpoint, method = 'POST', data = null, isMCPRequest = false) {
    return new Promise((resolve, reject) => {
      const url = new URL(endpoint, this.apiUrl);
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': isMCPRequest ? 'application/json, text/event-stream' : 'application/json',
        }
      };

      if (this.sessionId) {
        options.headers['mcp-session-id'] = this.sessionId;
      }

      if (this.apiKey) {
        options.headers['Authorization'] = `Bearer ${this.apiKey}`;
        options.headers['X-API-Key'] = this.apiKey;
      }

      const req = https.request(url, options, (res) => {
        let responseData = '';

        // Capture session ID from response headers
        if (res.headers['mcp-session-id']) {
          this.sessionId = res.headers['mcp-session-id'];
        }

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
    console.log('🏥 Checking server health...');
    try {
      const response = await this.makeRequest('/health', 'GET');
      console.log('✅ Health check result:', response.data);
      return response.statusCode === 200;
    } catch (error) {
      console.error('❌ Health check failed:', error.message);
      return false;
    }
  }

  // Initialize MCP session
  async initialize() {
    console.log('🔄 Initializing MCP session...');
    try {
      const response = await this.makeRequest('/mcp', 'POST', {
        jsonrpc: '2.0',
        id: 1,
        method: 'initialize',
        params: {
          protocolVersion: '1.17.4',
          clientInfo: {
            name: 'n8n-mcp-test-client',
            version: '1.0.0'
          },
          capabilities: {}
        }
      }, true); // true = isMCPRequest

      console.log('📡 Initialize response:', JSON.stringify(response.data, null, 2));
      
      if (response.data.result && response.data.result.sessionId) {
        this.sessionId = response.data.result.sessionId;
        console.log('✅ Session initialized:', this.sessionId);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('❌ Initialization failed:', error.message);
      return false;
    }
  }

  // List available tools
  async listTools() {
    console.log('📋 Listing available tools...');
    try {
      const response = await this.makeRequest('/mcp', 'POST', {
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/list'
      }, true);

      console.log('🔧 Available tools:', JSON.stringify(response.data, null, 2));
      return response.data.result?.tools || [];
    } catch (error) {
      console.error('❌ Failed to list tools:', error.message);
      return [];
    }
  }

  // Test aircraft search
  async searchAircraft() {
    console.log('✈️ Testing aircraft search...');
    try {
      const response = await this.makeRequest('/mcp', 'POST', {
        jsonrpc: '2.0',
        id: 3,
        method: 'tools/call',
        params: {
          name: 'search-aircraft',
          arguments: {
            departureAirport: 'KJFK',
            arrivalAirport: 'KLAX',
            departureDate: '2024-12-25',
            passengers: 6,
            aircraftCategory: 'Light Jet'
          }
        }
      }, true);

      console.log('🛩️ Aircraft search result:', JSON.stringify(response.data, null, 2));
      return response.data.result;
    } catch (error) {
      console.error('❌ Aircraft search failed:', error.message);
      return null;
    }
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting N8N MCP Server Connection Tests');
  console.log('=' .repeat(50));

  const client = new MCPTestClient(MCP_SERVER_URL, 'mcp-server-api-key-12345');

  // Step 1: Health Check
  const healthOk = await client.checkHealth();
  if (!healthOk) {
    console.log('❌ Server health check failed - aborting tests');
    process.exit(1);
  }

  console.log('');

  // Step 2: Initialize Session
  const initOk = await client.initialize();
  if (!initOk) {
    console.log('❌ Session initialization failed - aborting tests');
    process.exit(1);
  }

  console.log('');

  // Step 3: List Tools
  const tools = await client.listTools();
  if (tools.length === 0) {
    console.log('⚠️ No tools available');
  }

  console.log('');

  // Step 4: Test Aircraft Search
  const searchResult = await client.searchAircraft();
  
  console.log('');
  console.log('=' .repeat(50));
  
  if (searchResult) {
    console.log('✅ All tests completed successfully!');
    console.log('🎉 N8N MCP Server is ready for integration');
  } else {
    console.log('⚠️ Some tests failed, but basic connectivity works');
  }
}

// Run tests
runTests().catch(error => {
  console.error('💥 Test suite failed:', error);
  process.exit(1);
});