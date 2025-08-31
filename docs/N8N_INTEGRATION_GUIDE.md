# N8N Integration Guide - Avinode MCP Server

## ✅ **SOLUTION IMPLEMENTED**

The connection error has been resolved by implementing N8N-compatible REST API endpoints alongside the existing MCP protocol server.

## 🚀 **Quick Start**

### 1. Server Configuration
```bash
# Use the provided environment configuration
cp .env.n8n .env
USE_MOCK_DATA=true npm run dev
```

### 2. N8N Node Configuration

Update your N8N MCP Agent custom node to use these endpoints:

#### **Base URL Configuration**
```
API URL: http://localhost:8124/api
```

#### **Authentication** (Optional)
```
API Key: mcp-server-api-key-12345
```

### 3. Available Endpoints

#### **Health Check**
```
GET /health
```

#### **List Available Tools**
```
GET /api/tools
```

#### **Execute Specific Tools**
```
POST /api/tools/{toolName}
Content-Type: application/json

Body: {
  "departureAirport": "KJFK",
  "arrivalAirport": "KLAX",
  "departureDate": "2024-12-25",
  "passengers": 6
}
```

#### **Get Operational Data** (Primary N8N Endpoint)
```
POST /api/operational-data
Content-Type: application/json

Body: {
  "dataType": "fleet-utilization",
  "operatorId": "OP001"
}
```

## 📋 **Supported Tools**

1. **search-aircraft** - Find available aircraft
2. **create-charter-request** - Submit charter requests
3. **get-pricing** - Generate pricing quotes
4. **manage-booking** - Handle booking operations
5. **get-operator-info** - Retrieve operator details
6. **get-empty-legs** - Find discounted flights
7. **get-fleet-utilization** - Get operational data

## 🔧 **N8N Workflow Integration**

### Example HTTP Request Node Configuration

```json
{
  "method": "POST",
  "url": "http://localhost:8124/api/operational-data",
  "headers": {
    "Content-Type": "application/json"
  },
  "body": {
    "dataType": "fleet-utilization",
    "operatorId": "OP001"
  }
}
```

### Expected Response Format

```json
{
  "success": true,
  "dataType": "fleet-utilization",
  "result": {
    "content": [
      {
        "type": "text",
        "text": "# Fleet Utilization Report\\n\\n## Operator: JetVision Charter..."
      }
    ]
  },
  "timestamp": "2025-08-29T16:14:17.216Z"
}
```

## ✅ **Mock Data Configuration**

The server is configured to run with comprehensive mock data:

- **10 diverse aircraft** (Light Jet to Ultra Long Range)
- **5 realistic operators** with safety ratings
- **Dynamic pricing calculations** with fuel surcharges
- **Fleet utilization tracking**
- **Empty leg offerings**

## 🔧 **Environment Variables**

```env
# Mock Mode (default)
USE_MOCK_DATA=true
NODE_ENV=development

# Server Configuration
MCP_SERVER_PORT=8124
MCP_SERVER_HOST=0.0.0.0

# Leave empty for mock mode
# AVAINODE_API_KEY=your_actual_api_key_here
```

## 🧪 **Testing the Connection**

Run the test script to verify everything works:

```bash
node test-n8n-connection.js
```

Expected output:
```
✅ Health check result: { status: 'healthy', mode: 'mock' }
🛩️ Aircraft search successful
🎉 N8N MCP Server is ready for integration
```

## 📈 **Production Migration**

When ready for production:

1. Set `AVAINODE_API_KEY` environment variable
2. Set `USE_MOCK_DATA=false`
3. Implement real API client in `src/avainode-api-client.ts`
4. Update authentication in N8N credentials

## 🚨 **Troubleshooting**

### Common Issues:

1. **Connection Refused**
   - Verify server is running on port 8124
   - Check firewall settings

2. **Mock Data Not Loading**
   - Ensure `USE_MOCK_DATA=true`
   - Verify no `AVAINODE_API_KEY` is set

3. **Tool Not Found Errors**
   - Check tool name matches exactly
   - Verify required parameters are provided

### Debug Commands:

```bash
# Check server status
curl http://localhost:8124/health

# List available tools
curl http://localhost:8124/api/tools

# Test operational data endpoint
curl -X POST http://localhost:8124/api/operational-data \
  -H "Content-Type: application/json" \
  -d '{"dataType": "fleet-utilization"}'
```

## 📞 **Support**

- Check server logs for detailed error messages
- Verify environment variables are correctly set
- Ensure mock data is enabled for testing
- Review the test script output for connection validation

---

**Status: ✅ RESOLVED** - N8N can now successfully connect to the Avinode MCP Server using the REST API endpoints.