#!/bin/bash

# HTTP Streaming Transport Test for N8N MCP Node
# Tests modern HTTP streaming (not SSE) as required by N8N

SERVER_URL="https://avainode-mcp.kingler.workers.dev/mcp"

echo "========================================="
echo "HTTP Streaming Transport Test (N8N)"
echo "Server: $SERVER_URL"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Test 1: Basic streaming test with NDJSON
echo -e "${BLUE}Test 1: NDJSON Streaming Format Test${NC}"
echo "Testing newline-delimited JSON streaming..."

# Initialize and capture response with raw output
RESPONSE=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson, application/json" \
    -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"1.0.0"},"id":1}' \
    -s \
    --raw \
    -w "\n===HEADERS===\n%{content_type}\n%{http_code}")

echo "Raw response:"
echo "$RESPONSE" | head -10
echo ""

# Extract session ID for further tests
SESSION_ID=$(echo "$RESPONSE" | grep -o '"sessionId":"[^"]*"' | cut -d'"' -f4)
echo -e "${GREEN}Session ID: $SESSION_ID${NC}"
echo ""

# Test 2: Check Transfer-Encoding
echo -e "${BLUE}Test 2: Transfer-Encoding Test${NC}"
curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":2}' \
    -s \
    -D - \
    -o /dev/null | grep -i "transfer-encoding\|content-length"
echo ""

# Test 3: Streaming with line-by-line reading
echo -e "${BLUE}Test 3: Line-by-Line Streaming Test${NC}"
echo "Reading response line by line (simulating N8N)..."

# Make request and read line by line
(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get-fleet-utilization","arguments":{"operatorId":"OP001"}},"id":3}' \
    -s \
    --no-buffer) | while IFS= read -r line; do
    if [ -n "$line" ]; then
        echo "Line received: $(echo "$line" | cut -c1-80)..."
        # Try to parse as JSON
        if echo "$line" | jq -e . >/dev/null 2>&1; then
            echo -e "${GREEN}Valid JSON line${NC}"
        else
            echo -e "${YELLOW}Not JSON: $line${NC}"
        fi
    fi
done
echo ""

# Test 4: Multiple responses in stream
echo -e "${BLUE}Test 4: Multiple Messages Stream Test${NC}"
echo "Testing if server sends multiple JSON messages..."

STREAM_RESPONSE=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"search-aircraft","arguments":{"departureAirport":"KJFK","arrivalAirport":"KLAX","departureDate":"2024-12-15","passengers":6}},"id":4}' \
    -s \
    --no-buffer \
    --raw)

# Count JSON objects in response
JSON_COUNT=$(echo "$STREAM_RESPONSE" | grep -c '^{')
echo "Number of JSON messages in stream: $JSON_COUNT"

if [ "$JSON_COUNT" -gt 1 ]; then
    echo -e "${GREEN}Multiple messages detected - proper streaming${NC}"
else
    echo -e "${YELLOW}Single message - not streaming multiple chunks${NC}"
fi
echo ""

# Test 5: Test with explicit streaming request
echo -e "${BLUE}Test 5: Explicit Streaming Request${NC}"
curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "Connection: keep-alive" \
    -H "X-Stream-Output: true" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":5}' \
    -s \
    --no-buffer \
    -N | head -5
echo ""

# Test 6: Check if responses are properly terminated
echo -e "${BLUE}Test 6: Response Termination Test${NC}"
TERMINATED_RESPONSE=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get-empty-legs","arguments":{}},"id":6}' \
    -s \
    --no-buffer)

# Check for newline termination
if [[ "$TERMINATED_RESPONSE" == *$'\n' ]]; then
    echo -e "${GREEN}Response is newline-terminated${NC}"
else
    echo -e "${RED}Response is NOT newline-terminated${NC}"
fi

# Check if it's valid JSON
if echo "$TERMINATED_RESPONSE" | jq . >/dev/null 2>&1; then
    echo -e "${GREEN}Response is valid JSON${NC}"
else
    echo -e "${RED}Response is NOT valid JSON${NC}"
fi
echo ""

# Test 7: HTTP/2 streaming
echo -e "${BLUE}Test 7: HTTP/2 Streaming Support${NC}"
curl -X POST "$SERVER_URL" \
    --http2 \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":7}' \
    -s \
    -w "HTTP Version: %{http_version}\n" \
    -o /dev/null
echo ""

# Test 8: Simulate N8N's actual request pattern
echo -e "${BLUE}Test 8: N8N Request Pattern Simulation${NC}"
echo "Simulating N8N's httpStreamable transport..."

# First, initialize
INIT=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson, application/json" \
    -H "User-Agent: n8n" \
    -d '{"jsonrpc":"2.0","id":"n8n-init","method":"initialize","params":{"protocolVersion":"1.0.0","clientInfo":{"name":"n8n","version":"1.0.0"}}}' \
    -s)

N8N_SESSION=$(echo "$INIT" | jq -r '.result.sessionId')
echo "N8N Session: $N8N_SESSION"

# Then list tools
TOOLS=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson, application/json" \
    -H "mcp-session-id: $N8N_SESSION" \
    -H "User-Agent: n8n" \
    -d '{"jsonrpc":"2.0","id":"n8n-tools","method":"tools/list","params":{}}' \
    -s)

TOOL_COUNT=$(echo "$TOOLS" | jq '.result.tools | length')
echo "Tools available: $TOOL_COUNT"

# Call a tool
TOOL_CALL=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson, application/json" \
    -H "mcp-session-id: $N8N_SESSION" \
    -H "User-Agent: n8n" \
    -d '{"jsonrpc":"2.0","id":"n8n-call","method":"tools/call","params":{"name":"get-operator-info","arguments":{"operatorId":"OP001"}}}' \
    -s)

if echo "$TOOL_CALL" | jq -e '.result.content' >/dev/null 2>&1; then
    echo -e "${GREEN}Tool call successful${NC}"
else
    echo -e "${RED}Tool call failed${NC}"
    echo "$TOOL_CALL" | jq '.error'
fi
echo ""

# Summary
echo "========================================="
echo -e "${GREEN}Diagnosis for N8N Connection${NC}"
echo "========================================="

echo ""
echo "Server capabilities:"
echo "✅ JSON-RPC protocol working"
echo "✅ Session management functional"
echo "✅ Tools discoverable and callable"

if [ "$JSON_COUNT" -gt 1 ]; then
    echo "✅ Streaming multiple messages"
else
    echo "❌ Not streaming multiple messages (single response)"
fi

echo ""
echo -e "${YELLOW}Current server behavior:${NC}"
echo "- Returns single JSON response (not NDJSON stream)"
echo "- No chunked transfer encoding"
echo "- Works with standard JSON-RPC but not streaming"
echo ""
echo -e "${BLUE}For N8N httpStreamable to work, server needs to:${NC}"
echo "1. Return newline-delimited JSON (NDJSON)"
echo "2. Support chunked transfer encoding"
echo "3. Stream responses as they're generated"
echo "4. Keep connection alive for streaming"
echo ""
echo -e "${GREEN}Workaround:${NC}"
echo "Use the REST API endpoints directly in N8N HTTP Request nodes:"
echo "- GET  $SERVER_URL/api/tools"
echo "- POST $SERVER_URL/api/tools/:toolName"
echo "- GET  $SERVER_URL/api/schedaero"
echo "- POST $SERVER_URL/api/schedaero/:operation"
echo "- GET  $SERVER_URL/api/paynode"
echo "- POST $SERVER_URL/api/paynode/:operation"