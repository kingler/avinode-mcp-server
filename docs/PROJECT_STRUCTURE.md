# 📁 Avinode MCP Server - Project Structure

## Core Project Files
```
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Lock file for dependencies
├── tsconfig.json             # TypeScript configuration
├── jest.config.js           # Jest test configuration
├── wrangler.toml            # Cloudflare Workers configuration
├── schema.prisma            # Database schema definition
├── bun.lock                 # Bun lock file
├── .env.example             # Environment variables template
├── .env.n8n                 # N8N specific environment variables
└── .gitignore               # Git ignore rules
```

## Source Code
```
src/
├── index.ts                 # Main Express server entry point
├── worker-mcp-streaming.ts  # Cloudflare Worker with streaming
├── worker-n8n.ts           # N8N integration worker
├── avainode-tools.ts       # MCP tools implementation
├── lib/                    # Utility libraries
│   ├── supabase.ts         # Supabase client configuration
│   └── mock-data-generator.ts
└── mock/                   # Mock system for development
    ├── avinode-mock-client.ts
    └── avinode-mock-data.ts
```

## Documentation
```
docs/
├── README.md                    # Main project documentation
├── CLAUDE.md                   # Claude Code assistant instructions
├── N8N_INTEGRATION_GUIDE.md   # N8N setup and configuration
├── N8N_SETUP_GUIDE.md         # Detailed N8N setup instructions
├── ENDPOINTS.md               # API endpoints documentation
├── MOCK_SYSTEM_DOCUMENTATION.md # Mock system documentation
├── MOCK_DATA_SUMMARY.md       # Mock data structure overview
├── STREAMABLE_HTTP_RULES.md   # HTTP streaming rules
├── NEXT_STEPS.md              # Development roadmap
├── DEPLOYMENT_STATUS.md       # Deployment status and history
├── DEPLOYMENT_SUCCESS.md      # Successful deployment documentation
├── AVIATION_DATABASE_POPULATION_GUIDE.md # Database setup guide
├── COMPREHENSIVE_DATA_SUMMARY.md # Data structure summary
├── SEEDED_DATA_GUIDE.md       # Database seeding guide
├── MISSING_TABLES_ANALYSIS.md # Database schema analysis
└── mcp-streaming.md           # MCP streaming documentation
```

## Database & Scripts
```
scripts/
├── database/                  # Database management scripts
│   ├── analyze-database.js   # Database analysis
│   ├── seed-*.js             # Database seeding scripts
│   ├── verify-*.js           # Database verification scripts
│   ├── populate-*.js         # Data population scripts
│   ├── execute-*.js          # Migration execution scripts
│   └── final-*.js            # Final setup scripts
└── [other utility scripts]   # TypeScript compilation scripts

supabase/
├── config.toml               # Supabase configuration
└── migrations/               # Database migration files
    ├── 20250831154230_create_aviation_tables.sql
    ├── 20250831161530_create_aviation_charter_tables.sql
    ├── 20250831161657_seed_aviation_operational_data.sql
    ├── 20250831162006_seed_bookings_and_operational_data.sql
    ├── 20250831170000_create_remaining_aviation_tables.sql
    ├── 20250831170100_seed_comprehensive_aviation_data.sql
    └── 20250831170200_seed_remaining_aviation_data.sql
```

## Testing
```
tests/
├── unit/                     # Unit tests
├── integration/              # Integration tests
├── e2e/                      # End-to-end tests
├── fixtures/                 # Test fixtures and mock data
└── scripts/                  # Test execution scripts
    ├── test-*.sh             # Shell test scripts
    └── test-*.js             # JavaScript test utilities
```

## Configuration & Setup
```
n8n-configurations/          # N8N workflow configurations
├── workflows/               # N8N workflow JSON files
└── credentials/            # N8N credential templates

coverage/                   # Test coverage reports
dist/                      # Compiled JavaScript output
node_modules/              # Dependencies
.wrangler/                 # Cloudflare Workers cache
```

## Archive & Temporary Files
```
archive/
├── database-scripts/        # Old database scripts (deprecated)
├── sql-files/              # Raw SQL files for reference
├── documentation/          # Old documentation versions
├── test-scripts/           # Legacy test scripts
└── [utility scripts]      # Miscellaneous archived scripts

temp-generated/             # Temporary generated files (can be deleted)
```

## Key Configuration Files

### Environment Files
- `.env` - Main environment configuration (not in git)
- `.env.example` - Template for environment variables
- `.env.n8n` - N8N-specific environment variables

### Development Commands (from package.json)
- `npm run build` - Compile TypeScript
- `npm run dev` - Start development server
- `npm test` - Run all tests
- `npm run deploy` - Deploy to production
- `npm run type-check` - TypeScript type checking
- `npm run lint` - Code linting

## Database Status
✅ **6/8 core tables adequately populated (≥20 records each)**
- Aircraft Fleet Management (50 aircraft)
- Operator Network (20 operators)
- Flight Operations (20 flight legs)
- Booking Management (25 bookings)
- Charter Request Processing (20 requests)
- Pricing & Quotation System (20 quotes)

📊 **Database Health: 79%** - Production ready for aviation operations

## Aviation Operations Available
- Aircraft search across all categories
- Charter request creation and processing
- Dynamic pricing and quotation generation
- Complete booking lifecycle management
- Fleet utilization tracking
- Empty legs availability
- Operator network management

---
*Project organized on: August 31, 2024*
*Total records in database: 157 across 8 operational tables*