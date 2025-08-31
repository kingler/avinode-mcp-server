#!/bin/bash

# Comprehensive test to prove N8N httpStreamable compatibility
# This script tests all aspects of the MCP server that N8N requires

SERVER_URL="https://avainode-mcp.kingler.workers.dev/mcp"
SESSION_ID=""

echo "========================================="
echo "COMPREHENSIVE N8N MCP SERVER TEST"
echo "========================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

PASS_COUNT=0
FAIL_COUNT=0

# Function to check test result
check_test() {
    local test_name=$1
    local condition=$2
    
    if [ "$condition" = "true" ]; then
        echo -e "${GREEN}✅ PASS: $test_name${NC}"
        ((PASS_COUNT++))
    else
        echo -e "${RED}❌ FAIL: $test_name${NC}"
        ((FAIL_COUNT++))
    fi
}

echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 1: CORS Headers for N8N Browser Access${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

CORS_HEADERS=$(curl -X OPTIONS "$SERVER_URL" \
    -H "Origin: http://localhost:5678" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: content-type,accept,mcp-session-id" \
    -s -D - -o /dev/null)

HAS_CORS_ORIGIN=$(echo "$CORS_HEADERS" | grep -i "access-control-allow-origin: \*" | wc -l)
HAS_CORS_METHODS=$(echo "$CORS_HEADERS" | grep -i "access-control-allow-methods" | grep -i "POST" | wc -l)
HAS_CORS_HEADERS=$(echo "$CORS_HEADERS" | grep -i "access-control-allow-headers" | grep -i "mcp-session-id" | wc -l)

check_test "CORS allows all origins" "$([ "$HAS_CORS_ORIGIN" -gt 0 ] && echo true || echo false)"
check_test "CORS allows POST method" "$([ "$HAS_CORS_METHODS" -gt 0 ] && echo true || echo false)"
check_test "CORS allows mcp-session-id header" "$([ "$HAS_CORS_HEADERS" -gt 0 ] && echo true || echo false)"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 2: HTTP Streaming Transport (NDJSON)${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Test with NDJSON accept header (what N8N sends)
STREAM_RESPONSE=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -d '{"jsonrpc":"2.0","method":"initialize","params":{"protocolVersion":"1.0.0","clientInfo":{"name":"n8n-test"}},"id":1}' \
    -s -D -)

CONTENT_TYPE=$(echo "$STREAM_RESPONSE" | grep -i "^content-type:" | cut -d' ' -f2 | tr -d '\r')
RESPONSE_BODY=$(echo "$STREAM_RESPONSE" | tail -n 1)

check_test "Returns NDJSON content type" "$(echo "$CONTENT_TYPE" | grep -q "application/x-ndjson" && echo true || echo false)"

# Check if response is valid JSON
IS_VALID_JSON=$(echo "$RESPONSE_BODY" | jq -e . >/dev/null 2>&1 && echo true || echo false)
check_test "Response is valid JSON" "$IS_VALID_JSON"

# Extract session ID
SESSION_ID=$(echo "$RESPONSE_BODY" | jq -r '.result.sessionId // empty')
check_test "Session ID generated" "$([ -n "$SESSION_ID" ] && echo true || echo false)"

echo -e "${YELLOW}Session ID: $SESSION_ID${NC}"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 3: Multiple Messages in Stream${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Test tool call that should return progress + result
TOOL_STREAM=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get-fleet-utilization","arguments":{"operatorId":"OP001"}},"id":2}' \
    -s --no-buffer)

# Count number of JSON messages (each line should be a JSON object)
MESSAGE_COUNT=$(echo "$TOOL_STREAM" | grep -c '^{')
check_test "Streams multiple messages (progress + result)" "$([ "$MESSAGE_COUNT" -eq 2 ] && echo true || echo false)"

# Check if first message is progress
HAS_PROGRESS=$(echo "$TOOL_STREAM" | head -1 | jq -r '.method // empty' | grep -q "progress" && echo true || echo false)
check_test "First message is progress update" "$HAS_PROGRESS"

# Check if second message has result
HAS_RESULT=$(echo "$TOOL_STREAM" | tail -1 | jq -e '.result' >/dev/null 2>&1 && echo true || echo false)
check_test "Second message contains result" "$HAS_RESULT"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 4: Tool Discovery${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

TOOLS_RESPONSE=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":3}' \
    -s)

TOOL_COUNT=$(echo "$TOOLS_RESPONSE" | jq '.result.tools | length')
check_test "Returns tool list" "$([ "$TOOL_COUNT" -gt 0 ] && echo true || echo false)"
echo -e "${YELLOW}Available tools: $TOOL_COUNT${NC}"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 5: Tool Execution${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Test actual tool execution
TOOL_EXEC=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get-empty-legs","arguments":{}},"id":4}' \
    -s --no-buffer | tail -1)

HAS_CONTENT=$(echo "$TOOL_EXEC" | jq -e '.result.content[0].text' >/dev/null 2>&1 && echo true || echo false)
check_test "Tool returns content" "$HAS_CONTENT"

CONTENT_TEXT=$(echo "$TOOL_EXEC" | jq -r '.result.content[0].text' | head -1)
check_test "Content is not empty" "$([ -n "$CONTENT_TEXT" ] && echo true || echo false)"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 6: Error Handling${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

ERROR_RESPONSE=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"non-existent-tool"},"id":5}' \
    -s --no-buffer | tail -1)

HAS_ERROR=$(echo "$ERROR_RESPONSE" | jq -e '.error' >/dev/null 2>&1 && echo true || echo false)
check_test "Returns error for invalid tool" "$HAS_ERROR"

ERROR_CODE=$(echo "$ERROR_RESPONSE" | jq '.error.code')
check_test "Error has correct code" "$([ "$ERROR_CODE" = "-32603" ] && echo true || echo false)"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 7: Session Persistence${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Use same session for another call
SESSION_TEST=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":6}' \
    -s)

SESSION_VALID=$(echo "$SESSION_TEST" | jq -e '.result.tools' >/dev/null 2>&1 && echo true || echo false)
check_test "Session persists across requests" "$SESSION_VALID"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 8: Batch Requests${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

BATCH_RESPONSE=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '[{"jsonrpc":"2.0","method":"tools/list","params":{},"id":"batch-1"},{"jsonrpc":"2.0","method":"tools/call","params":{"name":"get-operator-info","arguments":{"operatorId":"OP001"}},"id":"batch-2"}]' \
    -s --no-buffer)

BATCH_COUNT=$(echo "$BATCH_RESPONSE" | grep -c '"id":"batch-')
check_test "Processes batch requests" "$([ "$BATCH_COUNT" -ge 2 ] && echo true || echo false)"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 9: Regular JSON Fallback${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Test without NDJSON accept header (should return regular JSON)
JSON_RESPONSE=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/list","params":{},"id":7}' \
    -s -D -)

JSON_CONTENT_TYPE=$(echo "$JSON_RESPONSE" | grep -i "^content-type:" | cut -d' ' -f2 | tr -d '\r')
check_test "Falls back to JSON when not requesting NDJSON" "$(echo "$JSON_CONTENT_TYPE" | grep -q "application/json" && echo true || echo false)"

echo ""
echo -e "${BLUE}═══════════════════════════════════════${NC}"
echo -e "${BLUE}TEST 10: Real Tool Data${NC}"
echo -e "${BLUE}═══════════════════════════════════════${NC}"

# Test search-aircraft with real parameters
SEARCH_RESULT=$(curl -X POST "$SERVER_URL" \
    -H "Content-Type: application/json" \
    -H "Accept: application/x-ndjson" \
    -H "mcp-session-id: $SESSION_ID" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"search-aircraft","arguments":{"departureAirport":"KJFK","arrivalAirport":"KLAX","departureDate":"2024-12-25","passengers":6}},"id":8}' \
    -s --no-buffer | tail -1)

SEARCH_SUCCESS=$(echo "$SEARCH_RESULT" | jq -e '.result.content[0].text' >/dev/null 2>&1 && echo true || echo false)
check_test "search-aircraft tool works" "$SEARCH_SUCCESS"

# Extract some data from result
AIRCRAFT_DATA=$(echo "$SEARCH_RESULT" | jq -r '.result.content[0].text' 2>/dev/null | grep -c "aircraft" || echo 0)
check_test "Returns aircraft data" "$([ "$AIRCRAFT_DATA" -gt 0 ] && echo true || echo false)"

echo ""
echo "========================================="
echo -e "${GREEN}TEST SUMMARY${NC}"
echo "========================================="
echo -e "${GREEN}✅ Passed: $PASS_COUNT${NC}"
echo -e "${RED}❌ Failed: $FAIL_COUNT${NC}"
echo ""

if [ "$FAIL_COUNT" -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED!${NC}"
    echo ""
    echo "The server is FULLY COMPATIBLE with N8N's httpStreamable transport:"
    echo "✅ CORS headers configured correctly"
    echo "✅ Returns NDJSON format when requested"
    echo "✅ Streams multiple messages (progress updates)"
    echo "✅ Session management works"
    echo "✅ Tool discovery and execution functional"
    echo "✅ Error handling in place"
    echo "✅ Batch requests supported"
    echo "✅ Falls back to JSON for non-streaming clients"
    echo ""
    echo "N8N Configuration:"
    echo "{"
    echo "  \"endpointUrl\": \"$SERVER_URL\","
    echo "  \"serverTransport\": \"httpStreamable\""
    echo "}"
else
    echo -e "${RED}⚠️  SOME TESTS FAILED${NC}"
    echo "Please review the failures above."
fi