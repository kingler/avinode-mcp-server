# MCP Streamable HTTP Rules

This document defines the rules and practical guidance for implementing and consuming Streamable HTTP (NDJSON and SSE) in this MCP server. It consolidates behavior from the Express server and the Cloudflare Worker to enable compatible clients like N8N (httpStreamable) and standard SSE consumers.

## Transport Modes

- NDJSON (httpStreamable)
  - Content: line‑delimited JSON objects ending with `\n`.
  - Usage: N8N httpStreamable and generic streaming clients reading chunked responses.
- SSE (Server‑Sent Events)
  - Content: lines formatted as `data: {json}\n\n`.
  - Usage: Browser/EventSource or any SSE client. Used for push notifications and live updates.

## Endpoints

- Primary: `POST /mcp`
  - Behaves as streaming when `Accept` requests it (NDJSON or SSE). Otherwise returns a buffered JSON response.
- Explicit stream alias (Worker): `POST /stream`
  - Forces streaming behavior based on `Accept`.
- SSE stream (Express): `GET /mcp`
  - Establishes an SSE stream for an existing session.

## Required Headers

- Initialization (first `POST /mcp`):
  - `Accept: application/json, text/event-stream`
    - Either value can appear; the server validates presence for MCP initialize.
  - `Content-Type: application/json`
- Streaming mode selection:
  - NDJSON: `Accept: application/x-ndjson` (or `application/ndjson`, or `text/plain` fallback)
  - SSE: `Accept: text/event-stream`
- Session continuity:
  - `mcp-session-id: <uuid>` required for follow‑up requests and SSE `GET /mcp`.

## Streaming Response Headers

Always set for streaming responses:

- `Cache-Control: no-cache`
- `Connection: keep-alive`
- `Transfer-Encoding: chunked`
- `X-Accel-Buffering: no`
- `Content-Type:`
  - NDJSON: `application/x-ndjson`
  - SSE: `text/event-stream`
- Optional: `Mcp-Session-Id: <uuid>` (echo when available)

## Session Lifecycle Rules

- Session creation:
  - On first MCP initialize request without `mcp-session-id`, generate a UUID and bind a transport to it.
- Session reuse:
  - All subsequent requests must include `mcp-session-id` to reuse the existing transport and stream.
- SSE establishment (Express):
  - After initialization, open `GET /mcp` with `mcp-session-id` to start receiving SSE notifications.

## JSON-RPC Contract

- Protocol: JSON‑RPC 2.0 objects with `jsonrpc: "2.0"`, `id`, `method`, and optional `params`.
- Core methods used:
  - `initialize` — establishes protocol session and returns capabilities.
  - `tools/list` — lists available tools with schemas.
  - `tools/call` — executes a tool with parameters.
- Notification examples sent by the server (streamed):
  - `notifications/message` — logging/info messages.
  - `progress.update` — ad‑hoc progress emission during long‑running tool calls.

## Message Formats

- NDJSON line: `{json}\n`
- SSE line: `data: {json}\n\n`
- Typical streamed items:
  - JSON‑RPC responses for each request (including `tools/call` results).
  - Interleaved notifications (e.g., `progress.update`).

## Server Implementation Rules

These rules align with the existing implementation in `src/server.ts` (Express + StreamableHTTPServerTransport) and `src/worker-mcp-streaming.ts` (Cloudflare Worker NDJSON/SSE).

1) Content Negotiation
- Determine streaming vs buffered JSON from `Accept` header.
- NDJSON when `Accept` includes `application/x-ndjson` or `application/ndjson` (or `text/plain` fallback).
- SSE when `Accept` includes `text/event-stream`.

2) Initialization Validation
- For initialize requests without a session header, require `Accept` includes `application/json` and/or `text/event-stream`.
- Return 400/406 with a helpful message if missing.

3) Transport Binding (Express)
- Create a `StreamableHTTPServerTransport` per session ID.
- Store transports in memory keyed by `mcp-session-id`.
- `POST /mcp` routes through `transport.handleRequest(req, res, body)`.
- `GET /mcp` establishes SSE and allows `transport.send(...)` notifications.

4) Streaming Writer (Worker)
- Use a `TransformStream` with a writer and `TextEncoder`.
- Implement a helper `sendLine(data)` that formats NDJSON or SSE depending on `useSSE`.
- Process batch/single requests, emit optional `progress.update`, then stream the JSON‑RPC result line.
- Close the writer when done or on unrecoverable error.

5) CORS & Preflight
- Respond to `OPTIONS` with appropriate CORS headers.
- For all responses, include permissive CORS headers (`*`) unless stricter policy is required.

6) Error Handling
- Missing/invalid headers → 400/406 with descriptive JSON‑RPC error body.
- Unknown methods → JSON‑RPC `error` with code `-32601`.
- Internal errors → JSON‑RPC `error` with code `-32603`.

## Client Rules

- Maintain and reuse `mcp-session-id` across requests.
- SSE client:
  - Open `GET /mcp` with `Accept: text/event-stream` and `mcp-session-id`.
  - Parse `data: {json}` events; handle reconnects and `onerror`.
- NDJSON client:
  - Use `fetch` with `Accept: application/x-ndjson` and stream the body.
  - Read by lines; parse each as a JSON object.

## N8N Integration Rules

- Community MCP client (httpStreamable):
  - Configure account with Base URL pointing to `/mcp`.
  - The node sets streaming `Accept` header; server streams NDJSON lines.
- Native N8N MCP client (SSE):
  - Ensure your server supports the `GET /mcp` SSE stream after initialize.

## Curl Test Recipes

Initialize session (create or negotiate capabilities):

```bash
curl -i -X POST "$BASE/mcp" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":"1","method":"initialize","params":{}}'
```

SSE connect (Express server):

```bash
curl -N -H 'Accept: text/event-stream' \
  -H "mcp-session-id: <uuid-from-initialize>" \
  "$BASE/mcp"
```

NDJSON streaming request (Worker or negotiated POST):

```bash
curl -N -X POST "$BASE/mcp" \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/x-ndjson' \
  -H "mcp-session-id: <uuid>" \
  -d '{"jsonrpc":"2.0","id":"2","method":"tools/list","params":{}}'
```

## Do’s and Don’ts

- Do include `mcp-session-id` for all follow‑up calls and SSE establishment.
- Do set `Accept` correctly to activate the desired streaming mode.
- Do disable proxy buffering (`X-Accel-Buffering: no`) to prevent chunk coalescing.
- Don’t assume browsers allow custom headers in EventSource; use polyfills or alternative transports if needed.
- Don’t buffer entire responses when a client requested streamable output.

## Security & Operational Notes

- Consider rate limiting and session expiry for transports stored in memory.
- Restrict CORS and allowed headers/methods for production.
- Ensure logs don’t leak PII when streaming notifications.

## Implementation References (source)

- Express server (StreamableHTTPServerTransport):
  - `src/server.ts`
- Cloudflare Worker (NDJSON/SSE):
  - `src/worker-mcp-streaming.ts`

