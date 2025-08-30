#!/bin/bash

# MCP HTTP Streaming Transport Test Script
# Tests the Avinode MCP Server with HTTP streaming transport as used by N8N

SERVER_URL="https://avainode-mcp.kingler.workers.dev/mcp"
SESSION_ID=""

echo "========================================="
echo "MCP HTTP Streaming Transport Test"
echo "Server: $SERVER_URL"
echo "========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to make streaming request
make_streaming_request() {
    local method=$1
    local params=$2
    local id=$3
    
    local request_body=$(cat <<EOF
{
    "jsonrpc": "2.0",
    "method": "$method",
    "params": $params,
    "id": $id
}
EOF
    )
    
    echo -e "${YELLOW}Request:${NC}"
    echo "$request_body" | jq .
    echo ""
    
    # Make request with streaming support
    # -N disables buffering for streaming
    # --no-buffer forces output as it arrives
    local response=$(curl -X POST "$SERVER_URL" \
        -H "Content-Type: application/json" \
        -H "Accept: text/event-stream, application/json" \
        -H "Cache-Control: no-cache" \
        -H "Connection: keep-alive" \
        ${SESSION_ID:+-H "mcp-session-id: $SESSION_ID"} \
        -d "$request_body" \
        -s \
        -N \
        --no-buffer \
        2>&1)
    
    echo -e "${GREEN}Response:${NC}"
    echo "$response" | jq . 2>/dev/null || echo "$response"
    echo ""
    
    # Extract session ID if present
    if [ "$method" = "initialize" ]; then
        SESSION_ID=$(echo "$response" | jq -r '.result.sessionId // empty')
        if [ -n "$SESSION_ID" ]; then
            echo -e "${GREEN}Session ID captured: $SESSION_ID${NC}"
            echo ""
        fi
    fi
    
    return 0
}

# Test 1: Initialize connection
echo "========================================="
echo "Test 1: Initialize MCP Session"
echo "========================================="
make_streaming_request "initialize" '{"protocolVersion": "1.0.0", "clientInfo": {"name": "test-client", "version": "1.0.0"}}' 1

# Test 2: List available tools
echo "========================================="
echo "Test 2: List Available Tools"
echo "========================================="
make_streaming_request "tools/list" '{}' 2

# Test 3: Call a simple tool
echo "========================================="
echo "Test 3: Call get-fleet-utilization Tool"
echo "========================================="
make_streaming_request "tools/call" '{"name": "get-fleet-utilization", "arguments": {"operatorId": "OP001"}}' 3

# Test 4: Call search-aircraft tool with parameters
echo "========================================="
echo "Test 4: Call search-aircraft Tool"
echo "========================================="
make_streaming_request "tools/call" '{"name": "search-aircraft", "arguments": {"departureAirport": "KJFK", "arrivalAirport": "KLAX", "departureDate": "2024-12-01", "passengers": 8}}' 4

# Test 5: Test streaming with multiple chunks (if supported)
echo "========================================="
echo "Test 5: Call get-empty-legs Tool (Large Response)"
echo "========================================="
make_streaming_request "tools/call" '{"name": "get-empty-legs", "arguments": {}}' 5

# Test 6: Test error handling
echo "========================================="
echo "Test 6: Test Error Handling (Invalid Tool)"
echo "========================================="
make_streaming_request "tools/call" '{"name": "non-existent-tool", "arguments": {}}' 6

# Test streaming with curl's write-out to see timing
echo "========================================="
echo "Test 7: Connection and Timing Analysis"
echo "========================================="
echo -e "${YELLOW}Testing connection metrics...${NC}"
curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream, application/json" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 7}' \
    -s \
    -o /dev/null \
    -w "HTTP Code: %{http_code}\nConnect Time: %{time_connect}s\nStart Transfer: %{time_starttransfer}s\nTotal Time: %{time_total}s\nDownload Size: %{size_download} bytes\n"

echo ""
echo "========================================="
echo "Test 8: SSE-Style Streaming Test"
echo "========================================="
echo -e "${YELLOW}Testing Server-Sent Events style streaming...${NC}"
echo ""

# Test with SSE-specific headers
(
    echo -e "GET /mcp HTTP/1.1\r"
    echo -e "Host: avainode-mcp.kingler.workers.dev\r"
    echo -e "Accept: text/event-stream\r"
    echo -e "Cache-Control: no-cache\r"
    echo -e "Connection: keep-alive\r"
    echo -e "\r"
) | timeout 2 openssl s_client -connect avainode-mcp.kingler.workers.dev:443 -quiet 2>/dev/null | head -20

echo ""
echo "========================================="
echo "Test 9: HTTP/2 Streaming Test"
echo "========================================="
echo -e "${YELLOW}Testing HTTP/2 streaming support...${NC}"
curl -X POST "$SERVER_URL" \
    --http2 \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream, application/json" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc": "2.0", "method": "tools/call", "params": {"name": "get-operator-info", "arguments": {"operatorId": "OP001"}}, "id": 9}' \
    -s \
    -N \
    --no-buffer \
    -w "\n\nHTTP Version: %{http_version}\n" \
    | jq . 2>/dev/null || cat

echo ""
echo "========================================="
echo "Test 10: Chunked Transfer Encoding Test"
echo "========================================="
echo -e "${YELLOW}Testing chunked transfer encoding...${NC}"
curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream, application/json" \
    -H "Transfer-Encoding: chunked" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc": "2.0", "method": "tools/list", "params": {}, "id": 10}' \
    -s \
    -v 2>&1 | grep -E "(< HTTP|< Transfer-Encoding|< Content-Type)" || echo "No chunked encoding detected"

echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "${GREEN}Tests completed!${NC}"
echo ""
echo "Key observations for N8N compatibility:"
echo "1. Check if responses are properly formatted JSON-RPC"
echo "2. Verify session management works correctly"
echo "3. Ensure streaming/chunked responses are handled"
echo "4. Confirm CORS headers are present for browser-based access"
echo ""
echo "If N8N still fails to connect, check:"
echo "- N8N logs for specific error messages"
echo "- Network tab in browser DevTools when N8N makes requests"
echo "- Whether N8N expects SSE format (data: prefix) for streaming"