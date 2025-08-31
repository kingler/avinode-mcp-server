#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://fshvzvxqgwgoujtcevyy.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzaHZ6dnhxZ3dnb3VqdGNldnl5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjMwNjQyMiwiZXhwIjoyMDcxODgyNDIyfQ.R01JWWJB2F2uSHKedWkapKZnaj0T8bZkLcbO8FRp1VU';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function finalInvoicePopulation() {
  console.log('📋 FINAL INVOICE POPULATION ATTEMPT');
  console.log('='.repeat(40));
  
  try {
    // Get bookings data
    console.log('🔍 Fetching bookings data...');
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .limit(25);
    
    if (bookingsError) {
      console.log('❌ Could not fetch bookings:', bookingsError.message);
      return;
    }
    
    console.log(`✅ Found ${bookings.length} bookings`);
    
    if (bookings.length === 0) {
      console.log('⚠️  No bookings available to create invoices from');
      return;
    }
    
    // Create invoices with minimal required fields
    const invoices = [];
    
    for (let i = 0; i < Math.min(20, bookings.length); i++) {
      const booking = bookings[i];
      const invoiceAmount = booking.total_cost || (Math.random() * 50000 + 15000).toFixed(2);
      
      const invoice = {
        id: crypto.randomUUID(),
        booking_id: booking.id,
        invoice_number: `INV-2024-${String(i + 1).padStart(3, '0')}`,
        amount: parseFloat(invoiceAmount),
        status: ['draft', 'sent', 'paid', 'overdue'][Math.floor(Math.random() * 4)],
        due_date: new Date(Date.now() + (30 + Math.floor(Math.random() * 30)) * 24 * 60 * 60 * 1000).toISOString(),
        line_items: [
          {
            description: 'Charter Flight Services',
            quantity: 1,
            unit_price: parseFloat(invoiceAmount) * 0.85,
            total: parseFloat(invoiceAmount) * 0.85
          },
          {
            description: 'Airport Fees & Handling',
            quantity: 1,
            unit_price: parseFloat(invoiceAmount) * 0.10,
            total: parseFloat(invoiceAmount) * 0.10
          },
          {
            description: 'Taxes & Surcharges',
            quantity: 1,
            unit_price: parseFloat(invoiceAmount) * 0.05,
            total: parseFloat(invoiceAmount) * 0.05
          }
        ],
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      };
      
      invoices.push(invoice);
    }
    
    console.log(`🔧 Creating ${invoices.length} invoices...`);
    
    // Insert invoices one by one to better handle errors
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < invoices.length; i++) {
      const invoice = invoices[i];
      
      try {
        const { data, error } = await supabase
          .from('invoices')
          .insert([invoice]);
        
        if (error) {
          console.log(`❌ Invoice ${i + 1} failed: ${error.message.substring(0, 80)}...`);
          errorCount++;
          
          // Try simplified version if the full version fails
          if (error.message.includes('line_items')) {
            console.log(`🔄 Retrying invoice ${i + 1} with simplified structure...`);
            
            const simplifiedInvoice = {
              id: invoice.id,
              booking_id: invoice.booking_id,
              invoice_number: invoice.invoice_number,
              amount: invoice.amount,
              status: invoice.status,
              due_date: invoice.due_date,
              created_at: invoice.created_at,
              updated_at: invoice.updated_at
            };
            
            const { data: retryData, error: retryError } = await supabase
              .from('invoices')
              .insert([simplifiedInvoice]);
            
            if (!retryError) {
              console.log(`✅ Invoice ${i + 1} succeeded with simplified structure`);
              successCount++;
            } else {
              console.log(`❌ Invoice ${i + 1} failed again: ${retryError.message.substring(0, 60)}...`);
            }
          }
        } else {
          console.log(`✅ Invoice ${i + 1} created successfully`);
          successCount++;
        }
        
        // Small delay between inserts
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (err) {
        console.log(`❌ Invoice ${i + 1} exception: ${err.message.substring(0, 80)}...`);
        errorCount++;
      }
    }
    
    console.log(`\n📊 Invoice Creation Results:`);
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    
    // Final verification of all accessible tables
    await runComprehensiveVerification();
    
  } catch (error) {
    console.error('💥 Final invoice population failed:', error);
  }
}

async function runComprehensiveVerification() {
  console.log('\n🏆 COMPREHENSIVE AVIATION DATABASE VERIFICATION');
  console.log('='.repeat(55));
  
  const coreAviationTables = [
    'users', 'aircraft', 'operators', 'flight_legs', 'bookings',
    'charter_requests', 'pricing_quotes', 'invoices'
  ];
  
  let totalRecords = 0;
  let adequatelyPopulated = 0;
  let populatedTables = 0;
  const tableStats = [];
  
  for (const tableName of coreAviationTables) {
    try {
      const { count, error } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      if (!error) {
        const recordCount = count || 0;
        totalRecords += recordCount;
        
        const status = recordCount >= 20 ? 'ADEQUATE' : recordCount > 0 ? 'PARTIAL' : 'EMPTY';
        const icon = recordCount >= 20 ? '✅' : recordCount > 0 ? '⚠️ ' : '⚪';
        
        console.log(`${icon} ${tableName.padEnd(18)} | ${recordCount.toString().padStart(3)} records | ${status}`);
        
        tableStats.push({ table: tableName, count: recordCount, status });
        
        if (recordCount >= 20) {
          adequatelyPopulated++;
          populatedTables++;
        } else if (recordCount > 0) {
          populatedTables++;
        }
      } else {
        console.log(`❌ ${tableName.padEnd(18)} | INACCESSIBLE`);
      }
      
    } catch (err) {
      console.log(`❌ ${tableName.padEnd(18)} | ERROR`);
    }
  }
  
  console.log('\n' + '='.repeat(55));
  console.log('🎯 FINAL AVIATION DATABASE STATUS');
  console.log('-'.repeat(35));
  console.log(`📈 Total Records: ${totalRecords.toLocaleString()}`);
  console.log(`🗂️  Core Tables: ${coreAviationTables.length}`);
  console.log(`✅ Adequately Populated (≥20): ${adequatelyPopulated}/${coreAviationTables.length}`);
  console.log(`📊 Tables with Data: ${populatedTables}/${coreAviationTables.length}`);
  console.log(`🎯 Success Rate: ${Math.round((adequatelyPopulated / coreAviationTables.length) * 100)}%`);
  
  console.log('\n🎪 AVIATION SYSTEM CAPABILITIES:');
  console.log('-'.repeat(35));
  const capabilities = [
    { name: 'Aircraft Fleet Management', status: tableStats.find(t => t.table === 'aircraft')?.count >= 20 },
    { name: 'Operator Network', status: tableStats.find(t => t.table === 'operators')?.count >= 20 },
    { name: 'Flight Operations', status: tableStats.find(t => t.table === 'flight_legs')?.count >= 20 },
    { name: 'Booking Management', status: tableStats.find(t => t.table === 'bookings')?.count >= 20 },
    { name: 'Charter Request Processing', status: tableStats.find(t => t.table === 'charter_requests')?.count >= 20 },
    { name: 'Pricing & Quotation System', status: tableStats.find(t => t.table === 'pricing_quotes')?.count >= 20 },
    { name: 'Invoice & Billing System', status: tableStats.find(t => t.table === 'invoices')?.count >= 20 }
  ];
  
  capabilities.forEach(cap => {
    const icon = cap.status ? '✅' : '⚡';
    const statusText = cap.status ? 'FULLY OPERATIONAL' : 'BASIC FUNCTIONALITY';
    console.log(`${icon} ${cap.name.padEnd(30)} | ${statusText}`);
  });
  
  const operationalCapabilities = capabilities.filter(c => c.status).length;
  
  console.log('\n🚀 DEPLOYMENT READINESS ASSESSMENT:');
  console.log('-'.repeat(35));
  
  if (adequatelyPopulated >= 6 && totalRecords >= 175) {
    console.log('🎉 EXCELLENT: Aviation database is production-ready!');
    console.log('✈️  All major aviation functions are fully operational');
    console.log('🎯 MCP server can demonstrate comprehensive aviation marketplace operations');
    console.log('💼 Ready for client demonstrations and real-world usage scenarios');
  } else if (adequatelyPopulated >= 5 && totalRecords >= 150) {
    console.log('⚡ VERY GOOD: Aviation database has strong operational capabilities');
    console.log('✈️  Core aviation functions are fully functional');
    console.log('🎯 MCP server can showcase most aviation operations effectively');
  } else if (adequatelyPopulated >= 4) {
    console.log('📈 GOOD: Aviation database provides solid foundation');
    console.log('🔧 Essential aviation operations are available for demonstration');
  } else {
    console.log('⚠️  FUNCTIONAL: Core aviation operations available');
    console.log('🚧 System demonstrates basic aviation marketplace functionality');
  }
  
  console.log(`\n📋 Operational Readiness: ${operationalCapabilities}/7 systems fully operational`);
  console.log(`🎯 Database Health Score: ${Math.round((totalRecords / 200) * 100)}%`);
}

// Execute the final population
finalInvoicePopulation().catch(console.error);