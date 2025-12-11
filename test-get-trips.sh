#!/bin/bash

API_TOKEN="2fb95826-bcde-4caf-94ed-f74049b86bb8"
AUTH_TOKEN="eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCIsImtpZCI6ImUxMjNmMTE4LTM1NjgtNGE3MC05YTE3LWNjZTgyYzJmN2Q1ZCJ9.eyJzdWIiOiI1QUU2RTFERC0wNzZCLTQxNzMtQTFERS0xNUI2NTZFQzVCOTgiLCJpc3MiOiJhdmlub2RlIiwiYXZpdHlwZSI6MTUsImF2aWRvbWFpbiI6Ii5hdmlub2RlLmNvbSIsImF2aW5vbmNlIjoiNGExZjMzNjItYTA3My00YThhLWFkMjktNTRiODUwNGExNTBiIiwiYXZpdGVuYW50IjoxMzc5Mn0.cAWFYd2YIY0L0nTB1882MZUsL6F4lYkENEzz03Qm7K3eLwrGJl7DNcZQFDa4ET4p3AwT2_3jDKQfLzMIdzSxHkcjyA29Pse5WMbNRwgNBJtJXOttJiWNiyAjNmXP0sPZ2PWxtsHPMnqLqgMyqCidEUU0RWUnRSgGNyo1HFsZZo95MOm9eY8-nrhVBKxCmqOcKTaR1SyNN5-_0rrksuA4colOC5IDmCXQcwd7dyuClIxpSB5fYWEx09MkVgIAmonO9w0kgS-25f1ysdSrT_6PV4SuGHXkpZ0NaNCPmUBuyvNuKRs789n1RP3nwMnyjQi4-ghEO-kHtDmmesUPjK2w2A"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

echo "Testing GET /api/trips endpoint..."
echo "Timestamp: $TIMESTAMP"
echo ""

curl -s -w "\nHTTP_STATUS:%{http_code}\n" -X GET "https://sandbox.avinode.com/api/trips" \
  -H "Content-Type: application/json" \
  -H "X-Avinode-ApiToken: $API_TOKEN" \
  -H "Authorization: Bearer $AUTH_TOKEN" \
  -H "X-Avinode-SentTimestamp: $TIMESTAMP" \
  -H "X-Avinode-Product: avinode-mcp-server/1.0.0" | jq '.'
