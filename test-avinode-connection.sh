#!/bin/bash

# Avinode API Connection Test Script

API_TOKEN="2fb95826-bcde-4caf-94ed-f74049b86bb8"
AUTH_TOKEN="eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImUxMjNmMTE4LTM1NjgtNGE3MC05YTE3LWNjZTgyYzJmN2Q1ZCJ9.eyJzdWIiOiI1QUU2RTFERC0wNzZCLTQxNzMtQTFERS0xNUI2NTZFQzVCOTgiLCJpc3MiOiJhdmlub2RlIiwiYXZpdHlwZSI6MTUsImF2aWRvbWFpbiI6Ii5hdmlub2RlLmNvbSIsImF2aW5vbmNlIjoiNGExZjMzNjItYTA3My00YThhLWFkMjktNTRiODUwNGExNTBiIiwiYXZpdGVuYW50IjoxMzc5Mn0.cAWFYd2YIY0L0nTB1882MZUsL6F4lYkENEzz03Qm7K3eLwrGJl7DNcZQFDa4ET4p3AwT2_3jDKQfLzMIdzSxHkcjyA29Pse5WMbNRwgNBJtJXOttJiWNiyAjNmXP0sPZ2PWxtsHPMnqLqgMyqCidEUU0RWUnRSgGNyo1HFsZZo95MOm9eY8-nrhVBKxCmqOcKTaR1SyNN5-_0rrksuA4colOC5IDmCXQcwd7dyuClIxpSB5fYWEx09MkVgIAmonO9w0kgS-25f1ysdSrT_6PV4SuGHXkpZ0NaNCPmUBuyvNuKRs789n1RP3nwMnyjQi4-ghEO-kHtDmmesUPjK2w2A"

# Generate proper ISO-8601 timestamp
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

echo "=========================================="
echo "Testing Avinode API Connection"
echo "=========================================="
echo "Endpoint: https://sandbox.avinode.com/api/trips"
echo "Timestamp: $TIMESTAMP"
echo ""

# Make the API request
RESPONSE=$(curl -s -w "\nHTTP_STATUS:%{http_code}" -X POST "https://sandbox.avinode.com/api/trips" \
  -H "Content-Type: application/json" \
  -H "X-Avinode-ApiToken: $API_TOKEN" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Avinode-SentTimestamp: $TIMESTAMP" \
  -H "X-Avinode-Product: avinode-mcp-server/1.0.0" \
  -d '{
    "criteria": {
      "requiredLift": [{
        "aircraftCategory": "Midsize jet"
      }]
    },
    "segments": [{
      "startAirport": {
        "icao": "KTEB"
      },
      "endAirport": {
        "icao": "KLAX"
      },
      "dateTime": {
        "date": "2025-12-15",
        "time": "14:00",
        "departure": true,
        "local": true
      },
      "paxCount": "6",
      "paxSegment": true
    }],
    "sourcing": true
  }')

# Extract HTTP status code
HTTP_STATUS=$(echo "$RESPONSE" | grep -o "HTTP_STATUS:[0-9]*" | cut -d: -f2)
BODY=$(echo "$RESPONSE" | sed 's/HTTP_STATUS:[0-9]*//')

echo "HTTP Status Code: $HTTP_STATUS"
echo ""
echo "Response Body:"
echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
echo ""

# Check for searchInAvinode link
if echo "$BODY" | jq -e '.actions[]? | select(.name == "searchInAvinode")' > /dev/null 2>&1; then
  echo "=========================================="
  echo "✅ SUCCESS! Trip Created!"
  echo "=========================================="

  TRIP_ID=$(echo "$BODY" | jq -r '.id // empty')
  if [ -n "$TRIP_ID" ]; then
    echo "Trip ID: $TRIP_ID"
  fi

  SEARCH_LINK=$(echo "$BODY" | jq -r '.actions[]? | select(.name == "searchInAvinode") | .href')
  if [ -n "$SEARCH_LINK" ]; then
    echo ""
    echo "🔗 Avinode Web UI Link:"
    echo "$SEARCH_LINK"
    echo ""
    echo "Click this link to view available flights in the Avinode Web UI!"
  fi
else
  echo "=========================================="
  echo "Response received but no searchInAvinode link found"
  echo "=========================================="
fi
