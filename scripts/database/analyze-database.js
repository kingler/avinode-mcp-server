#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function analyzeDatabase() {
  console.log('🔍 Analyzing database tables and data...\n');
  
  try {
    // First, let's try to get existing tables by querying known ones
    const knownTables = [
      'aircraft', 'operators', 'charter_requests', 'bookings', 'airports',
      'flight_logs', 'maintenance_records', 'crew_assignments', 'payments',
      'invoices', 'empty_legs', 'quotes', 'avinode_sync', 'paynode_transactions',
      'schedaero_events', 'utilization_metrics', 'route_analytics', 
      'customer_preferences', 'competitive_features', 'opensky_tracking'
    ];

    console.log('📊 CURRENT DATABASE INVENTORY:\n');
    console.log('='.repeat(80));

    const tableAnalysis = [];

    // Check each known table
    for (const tableName of knownTables) {
      try {
        // Try to query the table to see if it exists and get count
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });

        const rowCount = error ? 0 : (count || 0);
        const exists = !error || error.code !== 'PGRST106'; // PGRST106 = table not found

        if (exists) {
          const analysis = {
            name: tableName,
            description: 'No description', // We'll set descriptions manually
            rowCount: rowCount,
            exists: true
          };

          tableAnalysis.push(analysis);

          // Display current status
          const status = rowCount === 0 ? '❌ EMPTY' : 
                        rowCount < 20 ? `⚠️  SPARSE (${rowCount})` : 
                        `✅ POPULATED (${rowCount})`;
          
          console.log(`${status.padEnd(20)} ${tableName.padEnd(25)} - ${getTableDescription(tableName)}`);
        }

      } catch (error) {
        // Table doesn't exist or other error
        if (error.code === 'PGRST106') {
          console.log(`⚪ MISSING         ${tableName.padEnd(25)} - Table does not exist`);
        } else {
          console.error(`Error checking table ${tableName}:`, error.message);
        }
      }
    }

    console.log('\n' + '='.repeat(80));
    
    // Analysis results
    const emptyTables = tableAnalysis.filter(t => t.rowCount === 0);
    const sparseTables = tableAnalysis.filter(t => t.rowCount > 0 && t.rowCount < 20);
    const noDescriptionTables = tableAnalysis.filter(t => t.description === 'No description');

    console.log('\n## EMPTY TABLES REQUIRING IMMEDIATE POPULATION (0 records):');
    emptyTables.forEach(table => {
      const recommendation = getDataRecommendation(table.name);
      console.log(`- ${table.name}: ${recommendation}`);
    });

    console.log('\n## UNDER-POPULATED TABLES (< 20 records):');
    sparseTables.forEach(table => {
      const additionalRecords = Math.max(20 - table.rowCount, 10);
      const recommendation = getDataRecommendation(table.name, additionalRecords);
      console.log(`- ${table.name} (${table.rowCount}): ${recommendation}`);
    });

    console.log('\n## TABLES MISSING DESCRIPTIONS:');
    noDescriptionTables.forEach(table => {
      const description = getTableDescription(table.name);
      console.log(`- ${table.name}: ${description}`);
    });

    console.log('\n## PRIORITY ORDER FOR DATA POPULATION:');
    const prioritizedTables = prioritizeTables([...emptyTables, ...sparseTables]);
    prioritizedTables.forEach((priority, index) => {
      console.log(`${index + 1}. ${priority.category}:`);
      priority.tables.forEach(table => {
        console.log(`   - ${table.name} (${table.rowCount} records)`);
      });
    });

    return tableAnalysis;

  } catch (error) {
    console.error('❌ Database analysis failed:', error);
    throw error;
  }
}

function getDataRecommendation(tableName, additionalCount = 0) {
  const recommendations = {
    // Core aviation entities
    'aircraft': `25-50 aircraft across all categories (Light Jet, Midsize, Heavy, Ultra Long Range) with realistic tail numbers, specifications, and hourly rates`,
    'operators': `15-25 charter operators with diverse geographic coverage, fleet sizes, and specializations`,
    'airports': `100+ major airports worldwide with ICAO codes, geographic data, and operational details`,
    
    // Charter and booking system
    'charter_requests': `30-50 charter requests in various status (pending, confirmed, completed, cancelled) spanning 6 months`,
    'bookings': `25-40 confirmed bookings with payment status, passenger details, and service requirements`,
    'quotes': `40-60 pricing quotes with varying aircraft types, routes, and pricing structures`,
    
    // Fleet management
    'flight_logs': `100+ historical flight records with realistic flight times, fuel consumption, and maintenance triggers`,
    'maintenance_records': `50-75 maintenance entries including scheduled, unscheduled, and compliance checks`,
    'crew_assignments': `60-80 crew assignments covering pilots, flight attendants, and maintenance personnel`,
    
    // Financial and operational
    'payments': `30-45 payment records with various methods (wire, card, ACH) and statuses`,
    'invoices': `35-50 invoices with line items, tax calculations, and payment tracking`,
    'empty_legs': `20-30 empty leg opportunities with dynamic pricing and availability windows`,
    
    // Integration data
    'avinode_sync': `Sync records for all aircraft and operators to track API integration status`,
    'paynode_transactions': `Payment transaction logs with reference numbers and status tracking`,
    'schedaero_events': `Maintenance and crew scheduling events with calendar integration`,
    
    // Analytics and reporting
    'utilization_metrics': `Monthly utilization data for all aircraft over 12-month period`,
    'route_analytics': `Popular route data with frequency, pricing trends, and seasonal variations`,
    'customer_preferences': `Customer profile data with booking history and preferences`,
  };

  const base = recommendations[tableName] || `20-30 realistic records for ${tableName} table`;
  return additionalCount > 0 ? `add ${additionalCount} more records - ${base}` : base;
}

function getTableDescription(tableName) {
  const descriptions = {
    'aircraft': 'Private aircraft available for charter with specifications, availability, and pricing',
    'operators': 'Charter operators managing fleets with contact info, ratings, and service areas',
    'airports': 'Airport master data with ICAO codes, geographic coordinates, and operational details',
    'charter_requests': 'Customer requests for private charter flights with requirements and preferences',
    'bookings': 'Confirmed charter reservations with passenger details and service specifications',
    'quotes': 'Pricing estimates for charter requests including breakdown of costs and fees',
    'flight_logs': 'Historical flight records with departure/arrival times, routes, and operational data',
    'maintenance_records': 'Aircraft maintenance history including inspections, repairs, and compliance',
    'crew_assignments': 'Flight crew scheduling and assignment records with qualifications',
    'payments': 'Financial transactions for charter services with payment methods and status',
    'invoices': 'Billing records with itemized charges, taxes, and payment tracking',
    'empty_legs': 'Available repositioning flights offered at discounted rates',
    'avinode_sync': 'Integration sync status and logs for Avinode marketplace data',
    'paynode_transactions': 'Payment processing transaction logs with Paynode integration',
    'schedaero_events': 'Maintenance and crew scheduling events from SchedAero system',
    'utilization_metrics': 'Aircraft utilization analytics with flight hours and revenue data',
    'route_analytics': 'Popular route performance data with pricing and demand trends',
    'customer_preferences': 'Customer profile data with booking patterns and service preferences',
    'competitive_features': 'Feature comparison data for competitive analysis and positioning',
    'opensky_tracking': 'Real-time aircraft position data from OpenSky Network integration'
  };

  return descriptions[tableName] || `Data table for ${tableName.replace(/_/g, ' ')} management`;
}

function prioritizeTables(tables) {
  const priorities = [
    {
      category: 'Critical Path Tables (Core Functionality)',
      tables: tables.filter(t => ['aircraft', 'operators', 'airports', 'charter_requests', 'bookings'].includes(t.name))
    },
    {
      category: 'Integration-Dependent Tables',
      tables: tables.filter(t => ['avinode_sync', 'paynode_transactions', 'schedaero_events', 'payments'].includes(t.name))
    },
    {
      category: 'Operational Support Tables', 
      tables: tables.filter(t => ['flight_logs', 'maintenance_records', 'crew_assignments', 'empty_legs'].includes(t.name))
    },
    {
      category: 'Analytics and Reporting Tables',
      tables: tables.filter(t => ['utilization_metrics', 'route_analytics', 'competitive_features', 'opensky_tracking'].includes(t.name))
    }
  ].filter(priority => priority.tables.length > 0);

  return priorities;
}

if (require.main === module) {
  analyzeDatabase().catch(console.error);
}

module.exports = { analyzeDatabase };