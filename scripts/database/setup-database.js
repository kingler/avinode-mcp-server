#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use SERVICE_ROLE_KEY for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTables() {
  console.log('Creating tables...');
  
  // Aircraft table
  const { error: aircraftError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS aircraft (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tail_number VARCHAR(10) UNIQUE NOT NULL,
        aircraft_type VARCHAR(100) NOT NULL,
        category VARCHAR(50) NOT NULL,
        manufacturer VARCHAR(100) NOT NULL,
        model VARCHAR(100) NOT NULL,
        year_manufactured INTEGER,
        passenger_capacity INTEGER NOT NULL,
        hourly_rate DECIMAL(10,2) NOT NULL,
        base_airport VARCHAR(4) NOT NULL,
        availability_status VARCHAR(20) DEFAULT 'available',
        operator_id UUID,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  if (aircraftError) {
    console.error('Error creating aircraft table:', aircraftError);
  } else {
    console.log('✓ Aircraft table created');
  }

  // Operators table
  const { error: operatorError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS operators (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(200) NOT NULL,
        code VARCHAR(10) UNIQUE NOT NULL,
        base_location VARCHAR(100) NOT NULL,
        contact_email VARCHAR(100),
        contact_phone VARCHAR(20),
        rating DECIMAL(3,2) DEFAULT 0.0,
        fleet_size INTEGER DEFAULT 0,
        years_in_business INTEGER,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  if (operatorError) {
    console.error('Error creating operators table:', operatorError);
  } else {
    console.log('✓ Operators table created');
  }

  // Charter requests table
  const { error: charterError } = await supabase.rpc('execute_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS charter_requests (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        departure_airport VARCHAR(4) NOT NULL,
        arrival_airport VARCHAR(4) NOT NULL,
        departure_date TIMESTAMPTZ NOT NULL,
        return_date TIMESTAMPTZ,
        passenger_count INTEGER NOT NULL,
        aircraft_category VARCHAR(50),
        status VARCHAR(20) DEFAULT 'pending',
        total_cost DECIMAL(10,2),
        customer_email VARCHAR(100),
        customer_phone VARCHAR(20),
        special_requirements TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      );
    `
  });

  if (charterError) {
    console.error('Error creating charter_requests table:', charterError);
  } else {
    console.log('✓ Charter requests table created');
  }
}

async function seedData() {
  console.log('Seeding data...');

  // Seed operators
  const operators = [
    {
      name: 'Executive Aviation Services',
      code: 'EAS',
      base_location: 'New York, NY',
      contact_email: 'ops@execaviation.com',
      contact_phone: '+1-555-0101',
      rating: 4.8,
      fleet_size: 12,
      years_in_business: 15
    },
    {
      name: 'Premier Charter Solutions',
      code: 'PCS',
      base_location: 'Los Angeles, CA',
      contact_email: 'charter@premier.com',
      contact_phone: '+1-555-0102',
      rating: 4.6,
      fleet_size: 8,
      years_in_business: 12
    }
  ];

  for (const operator of operators) {
    const { error } = await supabase
      .from('operators')
      .upsert(operator, { onConflict: 'code' });
    
    if (error) {
      console.error('Error seeding operator:', error);
    } else {
      console.log(`✓ Seeded operator: ${operator.name}`);
    }
  }

  // Get operator IDs for aircraft seeding
  const { data: operatorData } = await supabase
    .from('operators')
    .select('id, code');

  const operatorMap = {};
  operatorData?.forEach(op => {
    operatorMap[op.code] = op.id;
  });

  // Seed aircraft
  const aircraft = [
    {
      tail_number: 'N123JT',
      aircraft_type: 'Citation XLS+',
      category: 'Midsize Jet',
      manufacturer: 'Cessna',
      model: 'Citation XLS+',
      year_manufactured: 2018,
      passenger_capacity: 9,
      hourly_rate: 3200.00,
      base_airport: 'KTEB',
      operator_id: operatorMap['EAS']
    },
    {
      tail_number: 'N456GX',
      aircraft_type: 'Gulfstream G550',
      category: 'Heavy Jet',
      manufacturer: 'Gulfstream',
      model: 'G550',
      year_manufactured: 2019,
      passenger_capacity: 14,
      hourly_rate: 6800.00,
      base_airport: 'KLAX',
      operator_id: operatorMap['PCS']
    }
  ];

  for (const plane of aircraft) {
    const { error } = await supabase
      .from('aircraft')
      .upsert(plane, { onConflict: 'tail_number' });
    
    if (error) {
      console.error('Error seeding aircraft:', error);
    } else {
      console.log(`✓ Seeded aircraft: ${plane.tail_number}`);
    }
  }
}

async function main() {
  try {
    await createTables();
    await seedData();
    console.log('\n✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Setup failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { createTables, seedData };