# N8N Connection Debug Guide

## ✅ Server Status Confirmed
- Avinode MCP Server is running on port 8124
- Health check: PASSING
- Operational data endpoint: WORKING
- Mock data mode: ACTIVE

## 🔍 N8N Troubleshooting Steps

### Step 1: Verify N8N Network Access
```bash
# Test from N8N's perspective (if running in Docker)
docker exec -it n8n-container curl http://host.docker.internal:8124/health

# Test from local machine
curl http://localhost:8124/health
```

### Step 2: Check N8N Node Configuration
Ensure your HTTP Request node has:
- **URL**: `http://localhost:8124/api/operational-data`
- **Method**: POST
- **Headers**: 
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Body**: 
```json
{
  "dataType": "fleet-utilization",
  "operatorId": "OP001",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

### Step 3: Alternative N8N Configurations

#### Option A: Use localhost alternative
If N8N is in Docker, try:
- `http://host.docker.internal:8124/api/operational-data`
- `http://172.17.0.1:8124/api/operational-data`

#### Option B: Enable CORS (if needed)
The server already has CORS enabled, but verify N8N isn't blocking it.

#### Option C: Test with different timeout
Increase timeout in N8N node to 30 seconds.

### Step 4: Debug N8N Execution
1. Check N8N execution logs
2. Enable debug mode in N8N
3. Verify no proxy/firewall blocking localhost:8124

## 🚨 Common N8N Issues

1. **Docker Network**: N8N in Docker can't reach localhost
2. **Firewall**: Local firewall blocking port 8124
3. **N8N Version**: Older N8N versions have connection bugs
4. **SSL/TLS**: N8N forcing HTTPS on HTTP endpoints

## ✅ Verified Working Test
```bash
curl -X POST http://localhost:8124/api/operational-data \
  -H "Content-Type: application/json" \
  -d '{"dataType": "fleet-utilization", "operatorId": "OP001"}'
```

**Result**: Returns valid fleet utilization data ✅
