#!/usr/bin/env ts-node
/**
 * Enhance Aircraft Images
 * Fetches real aircraft photos from AeroDataBox and updates database
 */

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { fetchAeroDataBoxImage, extractImageUrls } from '../src/lib/aircraft-images';

// Load environment variables
config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function enhanceAircraftImages() {
  try {
    console.log('🖼️  Enhancing aircraft images with real photos...');
    
    // Check if AeroDataBox API key is available
    if (!process.env.AERODATABOX_API_KEY && !process.env.RAPIDAPI_KEY) {
      console.log('⚠️  No AeroDataBox API key found. Add AERODATABOX_API_KEY or RAPIDAPI_KEY to .env file');
      console.log('💡 Get a free API key at: https://rapidapi.com/aedbx-aedbx/api/aerodatabox');
      console.log('📈 Free tier: 700 requests/month');
      return;
    }
    
    // Get all aircraft from database
    const { data: aircraft, error } = await supabase
      .from('aircraft')
      .select('id, registration_number, manufacturer, model, images')
      .limit(20); // Start with first 20 aircraft to stay within free tier
    
    if (error) {
      console.error('Error fetching aircraft:', error.message);
      return;
    }
    
    if (!aircraft || aircraft.length === 0) {
      console.log('No aircraft found in database. Run the seeding script first.');
      return;
    }
    
    console.log(`📋 Found ${aircraft.length} aircraft. Enhancing with real photos...`);
    
    let enhanced = 0;
    let skipped = 0;
    
    for (const ac of aircraft) {
      console.log(`🔍 Processing ${ac.registration_number} (${ac.manufacturer} ${ac.model})...`);
      
      try {
        // Fetch real photo from AeroDataBox
        const realImage = await fetchAeroDataBoxImage(ac.registration_number);
        
        if (realImage) {
          // Add real photo to existing images (prepend so it's first)
          const updatedImages = [realImage.url, ...ac.images];
          
          // Update aircraft record
          const { error: updateError } = await supabase
            .from('aircraft')
            .update({ 
              images: updatedImages,
              updated_at: new Date().toISOString()
            })
            .eq('id', ac.id);
          
          if (updateError) {
            console.error(`❌ Error updating ${ac.registration_number}:`, updateError.message);
            skipped++;
          } else {
            console.log(`✅ Enhanced ${ac.registration_number} with real photo`);
            enhanced++;
          }
        } else {
          console.log(`⏸️  No real photo available for ${ac.registration_number}`);
          skipped++;
        }
        
        // Rate limiting: wait 1 second between requests
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${ac.registration_number}:`, error);
        skipped++;
      }
    }
    
    console.log('🎉 Aircraft image enhancement completed!');
    console.log(`📊 Summary: ${enhanced} enhanced, ${skipped} skipped`);
    
    if (enhanced > 0) {
      console.log('💡 Real photos are now available in the MCP server aircraft search results');
    }
    
  } catch (error) {
    console.error('❌ Error enhancing aircraft images:', error);
    throw error;
  }
}

/**
 * Run the enhancement script
 */
if (require.main === module) {
  enhanceAircraftImages()
    .then(() => {
      console.log('Image enhancement completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Image enhancement failed:', error);
      process.exit(1);
    });
}

export { enhanceAircraftImages };