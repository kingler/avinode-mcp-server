# Supabase Integration for Aviation Charter System

## Overview

The Aviation Charter System now supports comprehensive database-backed operations across three major APIs:

### **Avinode Integration**
- Aircraft search and charter booking
- Operator management and fleet data
- Flight legs and pricing quotes

### **SchedAero Integration** 
- Aircraft scheduling and crew management
- Maintenance tracking and facility coordination
- Flight operations and status monitoring

### **Paynode Integration**
- Payment processing and transaction management
- Invoice generation and billing
- Refund handling and financial reporting

All systems support dual-mode operation:
- **In-Memory Mode**: Fast mock data stored in memory (default)
- **Supabase Mode**: Persistent database-backed data with full relationships

## Quick Start

### Environment Configuration

Update your `.env.n8n` file:

```bash
# Mock Data Configuration
USE_MOCK_DATA=true
USE_SUPABASE_MOCK=true  # Enable database-backed mock data

# Supabase Configuration
SUPABASE_URL="https://fshvzvxqgwgoujtcevyy.supabase.co"
SUPABASE_ANON_KEY="your_anon_key"
SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
```

### Database Setup

#### Option 1: Supabase CLI (Recommended)

1. **Install Supabase CLI**:
   ```bash
   npm install -g supabase
   # or
   brew install supabase/tap/supabase
   ```

2. **Login and link project**:
   ```bash
   supabase login
   supabase link --project-ref fshvzvxqgwgoujtcevyy
   ```

3. **Run migrations**:
   ```bash
   supabase db push
   ```

#### Option 2: SQL Editor

1. Open [Supabase SQL Editor](https://app.supabase.com/project/fshvzvxqgwgoujtcevyy/sql)
2. Execute the migration files in order:
   - `supabase/migrations/001_create_avinode_schema.sql` - Core Avinode tables
   - `supabase/migrations/002_seed_mock_data.sql` - Avinode seed data
   - `supabase/migrations/003_create_schedaero_schema.sql` - SchedAero tables
   - `supabase/migrations/004_create_paynode_schema.sql` - Paynode tables
   - `supabase/migrations/005_seed_schedaero_data.sql` - SchedAero seed data
   - `supabase/migrations/006_seed_paynode_data.sql` - Paynode seed data

### Verification

Run the setup script to verify your configuration:
```bash
node scripts/setup-supabase.js
```

## Database Schema

The comprehensive aviation system includes 20+ tables across three major domains:

## Avinode Schema (7 tables)

### Core Tables
- **`operators`**: Charter operators with certificates and safety ratings
- **`aircraft`**: Aircraft fleet with specifications and availability  
- **`flight_legs`**: Empty legs and positioning flights

### Transaction Tables
- **`charter_requests`**: Customer charter requests
- **`pricing_quotes`**: Detailed pricing with breakdown
- **`bookings`**: Confirmed bookings with payment tracking

## SchedAero Schema (6 tables)

### Maintenance Management
- **`maintenance_facilities`**: MRO facilities and service providers
- **`maintenance_schedules`**: Scheduled and completed maintenance activities
- **`aircraft_status_log`**: Real-time aircraft status tracking

### Crew & Operations
- **`crew_members`**: Flight crew with qualifications and certifications
- **`flight_schedules`**: Scheduled flights and operational details
- **`crew_assignments`**: Crew assignments to specific flights

## Paynode Schema (7 tables)

### Account Management
- **`payment_accounts`**: Payment accounts for operators and customers
- **`payment_methods`**: Stored payment methods (tokenized)
- **`invoices`**: Invoices for charter flights and services

### Transaction Processing
- **`transactions`**: All payment transactions and activities
- **`refunds`**: Refund requests and processing status
- **`payment_disputes`**: Chargebacks and payment disputes
- **`accounting_entries`**: Double-entry accounting records

### Additional Features
- **Row Level Security (RLS)** policies for data isolation
- **Automatic timestamps** via triggers
- **Performance indexes** on frequently queried columns
- **Foreign key constraints** for data integrity
- **Generated columns** for computed fields

## Mock Client Behavior

### Automatic Mode Selection

The mock client automatically detects available data sources:

```typescript
// Environment check priority:
// 1. USE_SUPABASE_MOCK=true + Supabase available → Database mode
// 2. USE_SUPABASE_MOCK=true + Supabase unavailable → In-memory mode
// 3. USE_SUPABASE_MOCK=false → In-memory mode
```

### Data Fallback

If Supabase becomes unavailable during runtime:
- Client gracefully falls back to in-memory data
- No service interruption occurs
- Warning logged for monitoring

### API Compatibility

Both modes provide identical API interfaces:
- Same method signatures
- Same response formats
- Same error handling
- Same data relationships

## Development Workflow

### Local Development

1. **In-memory mode** (fastest for development):
   ```bash
   USE_MOCK_DATA=true USE_SUPABASE_MOCK=false npm run dev
   ```

2. **Database mode** (testing persistence):
   ```bash
   USE_MOCK_DATA=true USE_SUPABASE_MOCK=true npm run dev
   ```

### Testing

Run tests with appropriate environment:
```bash
# Test in-memory mode
USE_MOCK_DATA=true USE_SUPABASE_MOCK=false npm test

# Test database mode (requires Supabase setup)
USE_MOCK_DATA=true USE_SUPABASE_MOCK=true npm test
```

### N8N Integration

For N8N workflows, use the `.env.n8n` configuration:
- Database mode provides persistent bookings and quotes
- In-memory mode resets data on server restart
- Both modes work with existing N8N workflows

## Data Management

### Seed Data

The system includes comprehensive seed data across all three domains:

#### Avinode Data
- **5 operators** with diverse certificates and safety ratings
- **10 aircraft** across all categories (Light, Mid-size, Heavy, Ultra-long)
- **15 empty legs** with realistic routes and pricing
- **Sample charter requests, quotes, and bookings**

#### SchedAero Data  
- **5 maintenance facilities** with different capabilities
- **10 crew members** with varying experience levels and type ratings
- **10 maintenance schedules** covering all types (Routine, Progressive, AOG)
- **10 flight schedules** with crew assignments
- **Aircraft status logs** and crew assignment records

#### Paynode Data
- **6 payment accounts** (merchants and customers)
- **8 payment methods** (cards, bank transfers, ACH)
- **6 invoices** in various status states
- **8 transactions** with realistic payment flows
- **3 refunds** including weather-related scenarios
- **2 payment disputes** for testing edge cases
- **10 accounting entries** for financial reporting

### Data Relationships

```
operators (1) ←→ (many) aircraft
aircraft (1) ←→ (many) flight_legs
aircraft (1) ←→ (many) charter_requests
charter_requests (1) ←→ (many) pricing_quotes
pricing_quotes (1) ←→ (1) bookings
```

### Real-time Updates

Database mode supports:
- Concurrent user sessions
- Real-time availability updates
- Persistent booking states
- Audit trails via timestamps

## Monitoring and Troubleshooting

### Health Checks

The server provides health endpoints:
```bash
GET /health
# Returns: mock mode status, database connectivity
```

### Connection Testing

Use the setup script for diagnostics:
```bash
node scripts/setup-supabase.js
# Provides: connection status, table verification, data counts
```

### Common Issues

1. **"Tables not yet created"**
   - Run migrations via CLI or SQL editor
   - Verify SUPABASE_SERVICE_ROLE_KEY permissions

2. **"Connection failed"**
   - Check SUPABASE_URL and credentials
   - Verify network connectivity
   - Confirm project is not paused

3. **"Graceful fallback to in-memory"**
   - Normal behavior when Supabase unavailable
   - Check logs for specific error details
   - Server continues operating normally

## Production Considerations

### Environment Variables

Ensure production environment has:
```bash
USE_MOCK_DATA=true
USE_SUPABASE_MOCK=true
SUPABASE_URL=your_production_url
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NODE_ENV=production
```

### Security

- Service role key provides full database access
- Use RLS policies for multi-tenant scenarios
- Rotate keys regularly via Supabase dashboard
- Monitor query patterns and performance

### Scalability

- Supabase handles connection pooling
- Database indexes optimize query performance
- Consider read replicas for high-load scenarios
- Monitor connection limits and usage

## Migration Path

### From In-Memory to Database

1. Set up Supabase project
2. Run migration scripts
3. Update environment variables
4. Restart server
5. Verify via health check

### Data Migration

To migrate existing in-memory data:
1. Export current state via API calls
2. Transform to database schema
3. Insert via Supabase client or SQL
4. Verify data integrity

## Support

- **Supabase Documentation**: https://supabase.com/docs
- **Setup Script**: `scripts/setup-supabase.js`
- **Migration Files**: `supabase/migrations/`
- **Type Definitions**: `src/lib/supabase.ts`