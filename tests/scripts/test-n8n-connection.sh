#!/bin/bash

# N8N Connection Diagnostic Script
# Tests different endpoint configurations to find what works with N8N

BASE_URL="https://avainode-mcp.kingler.workers.dev"

echo "========================================="
echo "N8N MCP CONNECTION DIAGNOSTIC"
echo "========================================="
echo ""

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Testing different endpoint configurations...${NC}"
echo ""

# Test 1: /mcp endpoint (what we've been using)
echo "1. Testing: $BASE_URL/mcp"
RESPONSE1=$(curl -X POST "$BASE_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"1.0.0"},"id":1}' \
    -s -w "\nSTATUS: %{http_code}")

STATUS1=$(echo "$RESPONSE1" | tail -1 | cut -d' ' -f2)
echo "   Status: $STATUS1"
echo "   Response: $(echo "$RESPONSE1" | head -1 | cut -c1-50)..."
echo ""

# Test 2: /stream endpoint (N8N might expect this)
echo "2. Testing: $BASE_URL/stream"
RESPONSE2=$(curl -X POST "$BASE_URL/stream" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"1.0.0"},"id":1}' \
    -s -w "\nSTATUS: %{http_code}")

STATUS2=$(echo "$RESPONSE2" | tail -1 | cut -d' ' -f2)
echo "   Status: $STATUS2"
echo "   Response: $(echo "$RESPONSE2" | head -1 | cut -c1-50)..."
echo ""

# Test 3: Root endpoint
echo "3. Testing: $BASE_URL/"
RESPONSE3=$(curl -X POST "$BASE_URL/" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"1.0.0"},"id":1}' \
    -s -w "\nSTATUS: %{http_code}")

STATUS3=$(echo "$RESPONSE3" | tail -1 | cut -d' ' -f2)
echo "   Status: $STATUS3"
echo "   Response: $(echo "$RESPONSE3" | head -1 | cut -c1-50)..."
echo ""

# Test 4: Check what N8N might be sending
echo -e "${BLUE}Testing with different Accept headers...${NC}"
echo ""

echo "4. With Accept: text/event-stream (old SSE)"
curl -X POST "$BASE_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -d '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' \
    -s -D - | grep -i "^content-type:"
echo ""

echo "5. With Accept: application/ndjson (without x-)"
curl -X POST "$BASE_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/ndjson" \
    -d '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' \
    -s -D - | grep -i "^content-type:"
echo ""

echo "6. With Accept: application/json (fallback)"
curl -X POST "$BASE_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -d '{"jsonrpc":"2.0","method":"initialize","params":{},"id":1}' \
    -s -D - | grep -i "^content-type:"
echo ""

echo "========================================="
echo -e "${GREEN}N8N Configuration Options:${NC}"
echo "========================================="
echo ""
echo "Try these in your N8N MCP Client Tool node:"
echo ""
echo -e "${YELLOW}Option 1: Main MCP endpoint${NC}"
echo "{"
echo "  \"endpointUrl\": \"$BASE_URL/mcp\","
echo "  \"serverTransport\": \"httpStreamable\""
echo "}"
echo ""
echo -e "${YELLOW}Option 2: Dedicated streaming endpoint${NC}"
echo "{"
echo "  \"endpointUrl\": \"$BASE_URL/stream\","
echo "  \"serverTransport\": \"httpStreamable\""
echo "}"
echo ""
echo -e "${YELLOW}Option 3: Root endpoint${NC}"
echo "{"
echo "  \"endpointUrl\": \"$BASE_URL/\","
echo "  \"serverTransport\": \"httpStreamable\""
echo "}"
echo ""
echo -e "${BLUE}Alternative: Use REST API directly${NC}"
echo "Instead of MCP Client Tool, use HTTP Request node with:"
echo "- Method: POST"
echo "- URL: $BASE_URL/api/tools/get-fleet-utilization"
echo "- Body: {\"operatorId\": \"OP001\"}"
echo "- Response Format: JSON"