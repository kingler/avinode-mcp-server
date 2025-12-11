#!/usr/bin/env node

/**
 * Test script to connect to Avinode API sandbox and search for flights
 */

const https = require('https');

// Sandbox credentials
const API_TOKEN = '2fb95826-bcde-4caf-94ed-f74049b86bb8';
const AUTH_TOKEN = 'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImUxMjNmMTE4LTM1NjgtNGE3MC05YTE3LWNjZTgyYzJmN2Q1ZCJ9.eyJzdWIiOiI1QUU2RTFERC0wNzZCLTQxNzMtQTFERS0xNUI2NTZFQzVCOTgiLCJpc3MiOiJhdmlub2RlIiwiYXZpdHlwZSI6MTUsImF2aWRvbWFpbiI6Ii5hdmlub2RlLmNvbSIsImF2aW5vbmNlIjoiNGExZjMzNjItYTA3My00YThhLWFkMjktNTRiODUwNGExNTBiIiwiYXZpdGVuYW50IjoxMzc5Mn0.cAWFYd2YIY0L0nTB1882MZUsL6F4lYkENEzz03Qm7K3eLwrGJl7DNcZQFDa4ET4p3AwT2_3jDKQfLzMIdzSxHkcjyA29Pse5WMbNRwgNBJtJXOttJiWNiyAjNmXP0sPZ2PWxtsHPMnqLqgMyqCidEUU0RWUnRSgGNyo1HFsZZo95MOm9eY8-nrhVBKxCmqOcKTaR1SyNN5-_0rrksuA4colOC5IDmCXQcwd7dyuClIxpSB5fYWEx09MkVgIAmonO9w0kgS-25f1ysdSrT_6PV4SuGHXkpZ0NaNCPmUBuyvNuKRs789n1RP3nwMnyjQi4-ghEO-kHtDmmesUPjK2w2A';

// Generate ISO 8601 timestamp (must be within 5 minutes of server time)
const timestamp = new Date().toISOString();

// Sample trip search request
const tripData = {
  "legs": [
    {
      "departureAirport": {
        "icao": "KTEB"
      },
      "arrivalAirport": {
        "icao": "KLAX"
      },
      "departureDate": "2025-12-15T14:00:00Z"
    }
  ],
  "passengers": 6,
  "aircraftCategory": "Midsize Jet"
};

const options = {
  hostname: 'sandbox.avinode.com',
  port: 443,
  path: '/api/v1/trips',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Avinode-ApiToken': API_TOKEN,
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'X-Avinode-SentTimestamp': timestamp,
    'X-Avinode-ApiVersion': 'v1.0',
    'X-Avinode-Product': 'avinode-mcp-server/1.0.0',
    'Accept-Encoding': 'gzip',
    'Content-Length': Buffer.byteLength(JSON.stringify(tripData))
  }
};

console.log('Testing Avinode API Connection...');
console.log('Endpoint:', `https://${options.hostname}${options.path}`);
console.log('Timestamp:', timestamp);
console.log('Request Data:', JSON.stringify(tripData, null, 2));
console.log('\nSending request...\n');

const req = https.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Response Headers:', JSON.stringify(res.headers, null, 2));

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('\n=== Response Body ===');
      console.log(JSON.stringify(response, null, 2));

      // Look for the searchInAvinode link
      if (response.actions) {
        const searchLink = response.actions.find(action => action.name === 'searchInAvinode');
        if (searchLink) {
          console.log('\n✅ SUCCESS! Avinode Web UI Link:');
          console.log(searchLink.href);
          console.log('\nYou can click this link to view available flights in the Avinode Web UI.');
        }
      }

      // Also check for trip ID
      if (response.id) {
        console.log(`\n✅ Trip Created! Trip ID: ${response.id}`);
      }
    } catch (e) {
      console.log('\n=== Raw Response ===');
      console.log(data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error:', error.message);
});

req.write(JSON.stringify(tripData));
req.end();
