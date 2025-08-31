import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function analyzeBookingsSchema() {
  console.log('🔍 Analyzing bookings table schema...\n');

  // Get table schema using PostgreSQL information_schema
  const { data: columns, error: columnsError } = await supabase
    .from('information_schema.columns')
    .select('column_name, data_type, is_nullable, column_default')
    .eq('table_name', 'bookings')
    .eq('table_schema', 'public')
    .order('ordinal_position');

  if (columnsError) {
    console.error('Error fetching columns:', columnsError);
    return;
  }

  console.log('📊 Bookings table columns:');
  console.table(columns);

  // Get foreign key constraints
  const { data: constraints, error: constraintsError } = await supabase.rpc('get_foreign_keys', {
    table_name: 'bookings'
  });

  if (!constraintsError && constraints) {
    console.log('\n🔗 Foreign key constraints:');
    console.table(constraints);
  }

  // Check existing data count
  const { count, error: countError } = await supabase
    .from('bookings')
    .select('*', { count: 'exact', head: true });

  if (!countError) {
    console.log(`\n📈 Current bookings count: ${count}`);
  }

  // Examine related tables to understand relationships
  console.log('\n🔗 Examining related tables...');
  
  const tables = ['users', 'aircraft', 'operators', 'flight_legs'];
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .limit(2);
    
    if (!error && data && data.length > 0) {
      console.log(`\n${table.toUpperCase()} sample (showing first record structure):`);
      console.log(JSON.stringify(data[0], null, 2));
    }
  }
}

// Function to create the foreign keys check if it doesn't exist
async function createForeignKeysFunction() {
  const sql = `
    CREATE OR REPLACE FUNCTION get_foreign_keys(table_name text)
    RETURNS TABLE (
      constraint_name text,
      column_name text,
      foreign_table_name text,
      foreign_column_name text
    )
    AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        tc.constraint_name::text,
        kcu.column_name::text,
        ccu.table_name::text as foreign_table_name,
        ccu.column_name::text as foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name = $1;
    END;
    $$ LANGUAGE plpgsql;
  `;

  const { error } = await supabase.rpc('exec_sql', { sql });
  if (error) {
    console.log('Note: Could not create foreign keys function, continuing without constraint analysis');
  }
}

async function main() {
  try {
    await createForeignKeysFunction();
    await analyzeBookingsSchema();
  } catch (error) {
    console.error('Error:', error);
  }
}

main();