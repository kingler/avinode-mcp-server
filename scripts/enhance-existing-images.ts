#!/usr/bin/env ts-node
/**
 * Enhance JetVision aircraft with real photos from AeroDataBox API
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fetchAeroDataBoxImage } from '../src/lib/aircraft-images';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function enhanceExistingAircraftImages() {
  try {
    console.log('🖼️  Enhancing JetVision aircraft with real photos...');
    
    // Check if AeroDataBox API key is available
    if (!process.env.RAPIDAPI_KEY && !process.env.AERODATABOX_API_KEY) {
      console.log('⚠️  No AeroDataBox API key found. Add RAPIDAPI_KEY to .env file');
      console.log('💡 Get a free API key at: https://rapidapi.com/aedbx-aedbx/api/aerodatabox');
      console.log('📈 Free tier: 700 requests/month');
      return false;
    }
    
    // Get aircraft with tail numbers for photo enhancement
    const { data: aircraft, error } = await supabase
      .from('aircraft')
      .select('id, tail_number, manufacturer, model, images')
      .not('tail_number', 'is', null)
      .limit(20); // Start with first 20 to stay within API limits
    
    if (error) {
      console.error('Error fetching aircraft:', error.message);
      return false;
    }
    
    if (!aircraft || aircraft.length === 0) {
      console.log('No aircraft with tail numbers found in database.');
      return false;
    }
    
    console.log(`📋 Found ${aircraft.length} aircraft with tail numbers. Enhancing with real photos...`);
    
    let enhanced = 0;
    let skipped = 0;
    
    for (const ac of aircraft) {
      if (!ac.tail_number) {
        skipped++;
        continue;
      }
      
      console.log(`🔍 Processing ${ac.tail_number} (${ac.manufacturer} ${ac.model})...`);
      
      try {
        // Fetch real photo from AeroDataBox
        const realImage = await fetchAeroDataBoxImage(ac.tail_number);
        
        if (realImage) {
          // Parse existing images (may be JSONB array)
          let existingImages: string[] = [];
          if (ac.images) {
            if (Array.isArray(ac.images)) {
              existingImages = ac.images;
            } else if (typeof ac.images === 'string') {
              try {
                existingImages = JSON.parse(ac.images);
              } catch (e) {
                existingImages = [ac.images];
              }
            }
          }
          
          // Add real photo to existing images (prepend so it's first)
          const updatedImages = [realImage.url, ...existingImages];
          
          // Update aircraft record
          const { error: updateError } = await supabase
            .from('aircraft')
            .update({ 
              images: updatedImages,
              updated_at: new Date().toISOString()
            })
            .eq('id', ac.id);
          
          if (updateError) {
            console.error(`❌ Error updating ${ac.tail_number}:`, updateError.message);
            skipped++;
          } else {
            console.log(`✅ Enhanced ${ac.tail_number} with real photo`);
            enhanced++;
          }
        } else {
          console.log(`⏸️  No real photo available for ${ac.tail_number}`);
          skipped++;
        }
        
        // Rate limiting: wait 2 seconds between requests to respect API limits
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.error(`❌ Error processing ${ac.tail_number}:`, error);
        skipped++;
      }
    }
    
    console.log('🎉 Aircraft image enhancement completed!');
    console.log(`📊 Summary: ${enhanced} enhanced, ${skipped} skipped`);
    
    if (enhanced > 0) {
      console.log('💡 Real photos are now available in the MCP server aircraft search results');
      
      // Show sample of enhanced aircraft
      const { data: sampleAircraft } = await supabase
        .from('aircraft')
        .select('tail_number, manufacturer, model, images')
        .not('images', 'is', null)
        .limit(3);
      
      if (sampleAircraft && sampleAircraft.length > 0) {
        console.log('\n📸 Sample aircraft with photos:');
        sampleAircraft.forEach((ac, i) => {
          const imageCount = Array.isArray(ac.images) ? ac.images.length : 0;
          console.log(`   ${i + 1}. ${ac.tail_number} - ${ac.manufacturer} ${ac.model} (${imageCount} images)`);
        });
      }
    }
    
    return enhanced > 0;
    
  } catch (error) {
    console.error('❌ Error enhancing aircraft images:', error);
    return false;
  }
}

/**
 * Run the enhancement script
 */
if (require.main === module) {
  enhanceExistingAircraftImages()
    .then((success) => {
      if (success) {
        console.log('\n🎯 Enhancement completed successfully!');
        console.log('🚀 MCP server ready with real aircraft photos');
        process.exit(0);
      } else {
        console.log('❌ Image enhancement completed with no changes');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('Enhancement failed:', error);
      process.exit(1);
    });
}