# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Building and Running

- `npm run build` - Compile TypeScript to JavaScript
- `npm run build:worker` - Build for Cloudflare Worker deployment
- `npm run dev` - Start development server with ts-node
- `npm start` - Run production server (requires build first)
- `npm start -- --port=8080` - Start on custom port

### Testing

- `npm test` - Run all tests
- `npm run test:unit` - Run unit tests only
- `npm run test:unit:quick` - Quick unit tests (single worker, silent)
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Watch mode for development

### Quality Assurance

- `npm run type-check` - TypeScript type checking (no emit)
- `npm run lint` - ESLint code analysis
- `npm run format` - Prettier code formatting

### Cloudflare Workers

- `npm run dev:worker` - Start Cloudflare Worker dev environment
- `npm run deploy` - Deploy to production
- `npm run deploy:staging` - Deploy to staging environment
- `npm run deploy:production` - Deploy to production environment
- `npm run tail` - Stream Cloudflare Worker logs

## Architecture Overview

### Multi-Platform MCP Server

This project implements an Avinode aviation marketplace integration server using the Model Context Protocol (MCP). It supports multiple deployment targets:

1. **Express Server** (`src/index.ts`) - Traditional Node.js server for local development
2. **Cloudflare Worker** (`src/worker-n8n.ts`) - Edge deployment with KV storage
3. **N8N Integration** - REST API endpoints for workflow automation

### Core Components

#### MCP Tool System (`src/avainode-tools.ts`)

- Implements 7 aviation-specific tools: search-aircraft, create-charter-request, get-pricing, manage-booking, get-operator-info, get-empty-legs, get-fleet-utilization
- Uses mock data by default (when `AVAINODE_API_KEY` not set)
- Automatically switches between mock and real API based on environment variables

#### Mock System (`src/mock/`)

- `avinode-mock-client.ts` - Complete mock implementation of Avinode API
- `avinode-mock-data.ts` - Realistic aviation data (10 aircraft, 5 operators)
- Supports all tools without requiring actual API credentials
- Enables full development and testing workflow

#### Supabase Integration (`src/lib/supabase.ts`)

- Optional persistent storage for production deployments
- Database schema in `supabase/migrations/`
- Mock data seeding scripts included

### Environment Configuration

#### Mock vs Production Mode

- **Mock Mode**: Default when `AVAINODE_API_KEY` is not set or `USE_MOCK_DATA=true`
- **Production Mode**: Enabled when `AVAINODE_API_KEY` is provided
- Use `npm run dev` with `USE_MOCK_DATA=true` for consistent mock testing

#### Required Environment Variables

```bash
# For production
AVAINODE_API_KEY=your_api_key_here

# For Supabase integration
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Server configuration
PORT=8124  # Default port, different from other MCP servers
```

### Aviation Domain Knowledge

#### Airport Codes

- Uses ICAO 4-letter codes (KJFK, KLAX, KTEB, EGLL, LFPG)
- Validation in `isValidAirportCode()` method

#### Aircraft Categories

- Light Jet (4-7 passengers)
- Midsize Jet (6-9 passengers)  
- Super Midsize Jet (8-10 passengers)
- Heavy Jet (10-16 passengers)
- Ultra Long Range (12-19 passengers)

#### Pricing Structure

- Base hourly rates by aircraft category
- Includes fuel surcharge, landing fees, handling fees, catering, crew fees
- Automated tax calculations (8%)
- Round-trip discounts and overnight fees

### Testing Strategy

#### Test Structure

- **Unit Tests** (`tests/unit/`) - Individual component testing
- **Integration Tests** (`tests/integration/`) - API endpoint testing  
- **E2E Tests** (`tests/e2e/`) - Full server workflow testing
- **Mock Fixtures** (`tests/fixtures/`) - Shared test data

#### Coverage Requirements

- Minimum 95% coverage for branches, functions, lines, statements
- Configured in `jest.config.js`

### N8N Workflow Integration

#### REST API Endpoints

- `GET /api/tools` - List available MCP tools
- `POST /api/tools/:toolName` - Execute specific tool
- `POST /api/operational-data` - Retrieve operational data (fleet-utilization, empty-legs)
- `GET /health` - Health check with mode detection

#### Workflow Patterns

- Supports both synchronous tool execution and batch operations
- JSON response format with success/error handling
- Compatible with N8N HTTP Request nodes

### Deployment Targets

#### Local Development

```bash
npm run dev  # Express server on port 8124
```

#### Cloudflare Workers

```bash
npm run deploy:staging   # Staging environment
npm run deploy:production # Production environment  
```

Configuration in `wrangler.toml` with environment-specific variables and KV namespaces.