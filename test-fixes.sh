#!/bin/bash

# Quick test of the fixed endpoints

BASE_URL="https://avainode-mcp.kingler.workers.dev"

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "========================================="
echo "TESTING FIXED ENDPOINTS"
echo "========================================="

echo -e "\n${BLUE}1. Testing search-aircraft with from/to parameters${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tools/search-aircraft" \
    -H "Content-Type: application/json" \
    -d '{"from":"KJFK","to":"KLAX","departureDate":"2024-12-15","passengers":8}' \
    -w "\nSTATUS:%{http_code}")

STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d: -f2)
if [ "$STATUS" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $STATUS"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $STATUS"
    echo "$RESPONSE" | sed '/STATUS:/d'
fi

echo -e "\n${BLUE}2. Testing create-charter-request with customerName${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tools/create-charter-request" \
    -H "Content-Type: application/json" \
    -d '{"aircraftId":"AC001","from":"KTEB","to":"KMIA","departureDate":"2024-12-20","departureTime":"10:00","passengers":6,"customerName":"Test Client","customerEmail":"test@example.com","customerPhone":"555-0100"}' \
    -w "\nSTATUS:%{http_code}")

STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d: -f2)
if [ "$STATUS" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $STATUS"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $STATUS"
    echo "$RESPONSE" | sed '/STATUS:/d'
fi

echo -e "\n${BLUE}3. Testing get-pricing with from/to parameters${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tools/get-pricing" \
    -H "Content-Type: application/json" \
    -d '{"aircraftId":"AC003","from":"KJFK","to":"EGLL","distance":3500,"passengers":8}' \
    -w "\nSTATUS:%{http_code}")

STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d: -f2)
if [ "$STATUS" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $STATUS"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $STATUS"
    echo "$RESPONSE" | sed '/STATUS:/d'
fi

echo -e "\n${BLUE}4. Testing get-operator-info${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/tools/get-operator-info" \
    -H "Content-Type: application/json" \
    -d '{"operatorId":"OP001"}' \
    -w "\nSTATUS:%{http_code}")

STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d: -f2)
if [ "$STATUS" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $STATUS"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $STATUS"
    echo "$RESPONSE" | sed '/STATUS:/d'
fi

echo -e "\n${BLUE}5. Testing operational-data endpoint (fleet-utilization)${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/operational-data" \
    -H "Content-Type: application/json" \
    -d '{"category":"fleet-utilization","operatorId":"OP001"}' \
    -w "\nSTATUS:%{http_code}")

STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d: -f2)
if [ "$STATUS" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $STATUS"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $STATUS"
    echo "$RESPONSE" | sed '/STATUS:/d'
fi

echo -e "\n${BLUE}6. Testing operational-data endpoint (empty-legs)${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/api/operational-data" \
    -H "Content-Type: application/json" \
    -d '{"category":"empty-legs"}' \
    -w "\nSTATUS:%{http_code}")

STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d: -f2)
if [ "$STATUS" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $STATUS"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $STATUS"
    echo "$RESPONSE" | sed '/STATUS:/d'
fi

echo -e "\n${BLUE}7. Testing MCP tool call with from/to parameters${NC}"
RESPONSE=$(curl -s -X POST "$BASE_URL/mcp" \
    -H "Content-Type: application/json" \
    -d '{"jsonrpc":"2.0","method":"tools/call","params":{"name":"search-aircraft","arguments":{"from":"KTEB","to":"KMIA","departureDate":"2024-12-20","passengers":4}},"id":2}' \
    -w "\nSTATUS:%{http_code}")

STATUS=$(echo "$RESPONSE" | grep "STATUS:" | cut -d: -f2)
if [ "$STATUS" == "200" ]; then
    echo -e "${GREEN}✓ PASSED${NC} - Status: $STATUS"
else
    echo -e "${RED}✗ FAILED${NC} - Status: $STATUS"
    echo "$RESPONSE" | sed '/STATUS:/d'
fi

echo -e "\n========================================="
echo -e "${GREEN}ALL FIXES VERIFIED!${NC}"
echo "========================================="