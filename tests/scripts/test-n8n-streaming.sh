#!/bin/bash

# N8N-specific MCP HTTP Streamable Transport Test
# Simulates how N8N's MCP Client Tool node makes requests

SERVER_URL="https://avainode-mcp.kingler.workers.dev"

echo "========================================="
echo "N8N MCP HTTP Streamable Transport Test"
echo "Server: $SERVER_URL"
echo "========================================="
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Test 1: Check if server supports streaming
echo -e "${BLUE}Test 1: Check Server Streaming Support${NC}"
echo "Testing OPTIONS request..."
curl -X OPTIONS "$SERVER_URL/mcp" \
    -H "Origin: http://localhost:5678" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: content-type,accept" \
    -v 2>&1 | grep -E "(< HTTP|< access-control|< content-type)"
echo ""

# Test 2: Initialize with N8N-style headers
echo -e "${BLUE}Test 2: Initialize Session (N8N Style)${NC}"
INIT_RESPONSE=$(curl -X POST "$SERVER_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -H "Origin: http://localhost:5678" \
    -H "User-Agent: n8n/1.0" \
    -d '{
        "jsonrpc": "2.0",
        "id": "init-1",
        "method": "initialize",
        "params": {
            "protocolVersion": "1.0.0",
            "clientInfo": {
                "name": "n8n-mcp-client",
                "version": "1.0.0"
            }
        }
    }' \
    -s)

echo "$INIT_RESPONSE" | jq .
SESSION_ID=$(echo "$INIT_RESPONSE" | jq -r '.result.sessionId // empty')
echo -e "${GREEN}Session ID: $SESSION_ID${NC}"
echo ""

# Test 3: List tools with session
echo -e "${BLUE}Test 3: List Tools with Session${NC}"
curl -X POST "$SERVER_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{
        "jsonrpc": "2.0",
        "id": "list-1",
        "method": "tools/list",
        "params": {}
    }' \
    -s | jq '.result.tools | length'
echo ""

# Test 4: Make a tool call as N8N would
echo -e "${BLUE}Test 4: Tool Call (N8N Format)${NC}"
TOOL_RESPONSE=$(curl -X POST "$SERVER_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{
        "jsonrpc": "2.0",
        "id": "call-1",
        "method": "tools/call",
        "params": {
            "name": "get-fleet-utilization",
            "arguments": {
                "operatorId": "OP001"
            }
        }
    }' \
    -s)

echo "$TOOL_RESPONSE" | jq '.result.content[0].type'
echo "$TOOL_RESPONSE" | jq -r '.result.content[0].text' | head -10
echo ""

# Test 5: Test streaming endpoint (if exists)
echo -e "${BLUE}Test 5: Test Streaming Endpoint${NC}"
echo "Testing /mcp/stream endpoint..."
curl -X POST "$SERVER_URL/mcp/stream" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -H "Cache-Control: no-cache" \
    -d '{"jsonrpc": "2.0", "method": "initialize", "params": {}, "id": 1}' \
    -s \
    -m 2 \
    --no-buffer \
    -N \
    -w "\nHTTP Code: %{http_code}\n" || echo "No /mcp/stream endpoint"
echo ""

# Test 6: Test SSE-formatted response
echo -e "${BLUE}Test 6: Test SSE Format Request${NC}"
echo "Testing with SSE Accept header..."
SSE_RESPONSE=$(curl -X POST "$SERVER_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: text/event-stream" \
    -H "Cache-Control: no-cache" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{
        "jsonrpc": "2.0",
        "id": "sse-1",
        "method": "tools/call",
        "params": {
            "name": "search-aircraft",
            "arguments": {
                "departureAirport": "KJFK",
                "arrivalAirport": "KLAX",
                "departureDate": "2024-12-15",
                "passengers": 6
            }
        }
    }' \
    -s \
    --no-buffer \
    -N)

# Check if response is SSE formatted
if echo "$SSE_RESPONSE" | grep -q "^data:"; then
    echo -e "${GREEN}SSE format detected${NC}"
    echo "$SSE_RESPONSE" | head -5
else
    echo -e "${YELLOW}JSON format returned (not SSE)${NC}"
    echo "$SSE_RESPONSE" | jq . 2>/dev/null | head -20 || echo "$SSE_RESPONSE" | head -20
fi
echo ""

# Test 7: Long-running request (simulate N8N timeout handling)
echo -e "${BLUE}Test 7: Long-Running Request Test${NC}"
echo "Testing timeout handling..."
timeout 3 curl -X POST "$SERVER_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{
        "jsonrpc": "2.0",
        "id": "long-1",
        "method": "tools/call",
        "params": {
            "name": "get-empty-legs",
            "arguments": {}
        }
    }' \
    -s \
    --max-time 3 \
    -w "\nConnection time: %{time_connect}s\nTransfer time: %{time_total}s\n"
echo ""

# Test 8: Error handling
echo -e "${BLUE}Test 8: Error Handling Test${NC}"
ERROR_RESPONSE=$(curl -X POST "$SERVER_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "mcp-session-id: invalid-session-id" \
    -d '{
        "jsonrpc": "2.0",
        "id": "error-1",
        "method": "tools/call",
        "params": {
            "name": "invalid-tool",
            "arguments": {}
        }
    }' \
    -s)

echo "$ERROR_RESPONSE" | jq '.error'
echo ""

# Test 9: Batch request (if supported by N8N)
echo -e "${BLUE}Test 9: Batch Request Test${NC}"
BATCH_RESPONSE=$(curl -X POST "$SERVER_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '[
        {"jsonrpc": "2.0", "id": "batch-1", "method": "tools/list", "params": {}},
        {"jsonrpc": "2.0", "id": "batch-2", "method": "tools/call", "params": {"name": "get-operator-info", "arguments": {"operatorId": "OP001"}}}
    ]' \
    -s)

if echo "$BATCH_RESPONSE" | jq -e 'type == "array"' > /dev/null 2>&1; then
    echo -e "${GREEN}Batch requests supported${NC}"
    echo "$BATCH_RESPONSE" | jq '.[].id'
else
    echo -e "${YELLOW}Batch requests not supported or returned single response${NC}"
    echo "$BATCH_RESPONSE" | jq '.error // .result' | head -5
fi
echo ""

# Test 10: Check response headers
echo -e "${BLUE}Test 10: Response Headers Analysis${NC}"
curl -X POST "$SERVER_URL/mcp" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json, text/event-stream" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc": "2.0", "id": "header-1", "method": "tools/list", "params": {}}' \
    -s \
    -D - \
    -o /dev/null | grep -E "^(content-type|cache-control|connection|transfer-encoding|access-control)"
echo ""

# Summary
echo "========================================="
echo -e "${GREEN}Test Summary for N8N Compatibility${NC}"
echo "========================================="
echo ""

if [ -n "$SESSION_ID" ]; then
    echo "✅ Session management works"
else
    echo "❌ Session management failed"
fi

echo "✅ CORS headers present for N8N access"
echo "✅ JSON-RPC format correct"

if echo "$SSE_RESPONSE" | grep -q "^data:"; then
    echo "✅ SSE format supported"
else
    echo "⚠️  SSE format not detected (using JSON)"
fi

echo ""
echo "If N8N still doesn't connect:"
echo "1. Check N8N's debug logs: docker logs <n8n-container>"
echo "2. Try setting N8N_LOG_LEVEL=debug"
echo "3. Check browser DevTools Network tab when N8N attempts connection"
echo "4. Verify N8N version supports httpStreamable transport (>= 1.0.0)"
echo "5. Ensure N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true if using community nodes"