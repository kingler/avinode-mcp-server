# N8N Setup Guide - Avinode MCP Server

## 🚀 **Quick Setup Instructions**

### **Step 1: Start the Avinode MCP Server**
```bash
cd avinode-mcp-server
npm run dev
```
Server will start on `http://localhost:8124`

### **Step 2: Verify Server is Running**
```bash
curl http://localhost:8124/health
```
Should return: `{"status": "healthy", "mode": "mock"}`

---

## 📋 **N8N Node Configuration Options**

### **Option A: Using Individual HTTP Request Nodes (Recommended)**

#### 1. **Operational Data Node**
- **Node Type**: HTTP Request
- **URL**: `http://localhost:8124/api/operational-data`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "dataType": "fleet-utilization",
  "operatorId": "OP001",
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

#### 2. **Aircraft Search Node**
- **Node Type**: HTTP Request
- **URL**: `http://localhost:8124/api/tools/search-aircraft`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "departureAirport": "KJFK",
  "arrivalAirport": "KLAX", 
  "departureDate": "2024-12-25",
  "passengers": 6,
  "aircraftCategory": "Light Jet",
  "maxPrice": 5000
}
```

#### 3. **Pricing Quote Node**
- **Node Type**: HTTP Request
- **URL**: `http://localhost:8124/api/tools/get-pricing`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "aircraftId": "ACF001",
  "departureAirport": "KJFK",
  "arrivalAirport": "KLAX",
  "departureDate": "2024-12-25",
  "departureTime": "10:00",
  "passengers": 6,
  "includeAllFees": true
}
```

#### 4. **Empty Legs Node**
- **Node Type**: HTTP Request
- **URL**: `http://localhost:8124/api/tools/get-empty-legs`
- **Method**: POST
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "startDate": "2024-12-01",
  "endDate": "2024-12-31",
  "maxPrice": 10000
}
```

---

## 🔧 **Option B: Using MCP Protocol (Advanced)**

If you need to use MCP protocol, configure your MCP client with:

#### **Required Headers**:
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json, text/event-stream"
}
```

#### **Initialization Request**:
```json
{
  "jsonrpc": "2.0",
  "id": "your-request-id",
  "method": "initialize", 
  "params": {
    "protocolVersion": "1.17.4",
    "clientInfo": {
      "name": "n8n-mcp-client",
      "version": "1.0.0"
    },
    "capabilities": {}
  }
}
```

---

## 📁 **Import Pre-configured Workflows**

### **Complete Aviation Workflow**
1. Copy the contents of `n8n-configurations/complete-aviation-workflow.json`
2. In N8N, go to **Workflows** → **Import from JSON**  
3. Paste the JSON content
4. Click **Import**

This workflow includes:
- ✈️ Aircraft search
- 💰 Pricing quotes
- 📊 Fleet utilization 
- 🚁 Empty leg opportunities
- 📄 Automated report generation

---

## 🧪 **Testing Your Setup**

### **1. Health Check Test**
```bash
curl http://localhost:8124/health
```

### **2. Direct API Test**
```bash
curl -X POST http://localhost:8124/api/operational-data \
  -H "Content-Type: application/json" \
  -d '{
    "dataType": "fleet-utilization",
    "operatorId": "OP001"
  }'
```

### **3. Run Automated Test**
```bash
node test-n8n-connection.js
```

---

## 🛠 **Troubleshooting Common Issues**

### **Issue: "Connection Refused"**
**Solution**: Verify server is running
```bash
lsof -i :8124  # Check if port is in use
npm run dev    # Start server
```

### **Issue: "Invalid JSON Response"**
**Solution**: Check request headers
```json
{
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

### **Issue: "Tool Not Found"**
**Solution**: Use correct endpoint URLs
- ✅ `http://localhost:8124/api/tools/search-aircraft`
- ❌ `http://localhost:8124/search-aircraft`

### **Issue: "MCP Session Errors"**
**Solution**: Use REST API endpoints instead
- Replace `/mcp` endpoints with `/api/tools/` or `/api/operational-data`
- No session management required for REST API

---

## 📚 **Available Tools & Endpoints**

| Tool | REST Endpoint | Purpose |
|------|---------------|---------|
| **Aircraft Search** | `POST /api/tools/search-aircraft` | Find available aircraft |
| **Pricing Quote** | `POST /api/tools/get-pricing` | Generate charter quotes |
| **Charter Request** | `POST /api/tools/create-charter-request` | Submit booking request |
| **Booking Management** | `POST /api/tools/manage-booking` | Handle bookings |
| **Operator Info** | `POST /api/tools/get-operator-info` | Get operator details |
| **Empty Legs** | `POST /api/tools/get-empty-legs` | Find discounted flights |
| **Fleet Utilization** | `POST /api/operational-data` | Get fleet status |

---

## 🎯 **Best Practices**

### **1. Use REST API Over MCP Protocol**
- Simpler integration
- No session management required
- Better error handling
- Clearer debugging

### **2. Handle Response Data**
All successful responses follow this format:
```json
{
  "success": true,
  "result": {
    "content": [
      {
        "type": "text", 
        "text": "Formatted aviation data..."
      }
    ]
  },
  "timestamp": "2025-08-30T09:30:00.000Z"
}
```

### **3. Error Handling**
Failed responses include error details:
```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2025-08-30T09:30:00.000Z"
}
```

---

## 🚀 **Production Considerations**

### **Authentication**
For production deployments:
- Set `AVAINODE_API_KEY` environment variable
- Configure proper API authentication headers
- Use HTTPS endpoints

### **Rate Limiting**
- Server includes automatic rate limiting
- Implement retry logic with exponential backoff
- Monitor API usage patterns

### **Data Persistence**  
- Enable Supabase integration for persistent data
- Set `USE_SUPABASE_MOCK=true` for database-backed mock data
- Configure proper backup and recovery procedures

---

## 📞 **Support**

### **If you encounter issues:**

1. **Check Server Logs**: Look for error messages in the console
2. **Verify Endpoints**: Use `curl` commands to test directly
3. **Review Configuration**: Ensure headers and request format are correct
4. **Test Individual Components**: Start with simple health check, then add complexity

### **Still having problems?**
- Review the `MOCK_SYSTEM_DOCUMENTATION.md` for detailed mock system info
- Check `N8N_INTEGRATION_GUIDE.md` for additional troubleshooting
- Run `node test-n8n-connection.js` for automated diagnostics

---

**✅ Your N8N integration with Avinode MCP Server is now ready to use!**