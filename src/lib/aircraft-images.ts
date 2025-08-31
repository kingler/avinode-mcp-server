/**
 * Aircraft Image Integration
 * Fetches real aircraft photos from various sources
 */

export interface AircraftImageData {
  url: string;
  source: 'aerodatabox' | 'placeholder' | 'stock';
  license?: string;
  attribution?: string;
}

/**
 * Fetch real aircraft photo from AeroDataBox API
 */
export async function fetchAeroDataBoxImage(registration: string): Promise<AircraftImageData | null> {
  const apiKey = process.env.AERODATABOX_API_KEY;
  const rapidApiKey = process.env.RAPIDAPI_KEY;
  
  if (!apiKey && !rapidApiKey) {
    console.log('No AeroDataBox API key available, skipping real photo fetch');
    return null;
  }
  
  try {
    const response = await fetch(
      `https://aerodatabox.p.rapidapi.com/aircrafts/reg/${registration}?withImage=true`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': rapidApiKey || apiKey!,
          'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
        }
      }
    );
    
    if (!response.ok) {
      console.log(`AeroDataBox API error for ${registration}: ${response.status}`);
      return null;
    }
    
    const data = await response.json() as any;
    
    if (data.image && data.image.url) {
      return {
        url: data.image.url,
        source: 'aerodatabox',
        license: data.image.license || 'Commercial use approved',
        attribution: data.image.attribution || 'AeroDataBox'
      };
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching AeroDataBox image for ${registration}:`, error);
    return null;
  }
}

/**
 * Generate placeholder aircraft images
 */
export function generatePlaceholderImages(
  registration: string, 
  manufacturer: string, 
  model: string
): AircraftImageData[] {
  const images: AircraftImageData[] = [];
  
  // Clean up strings for URLs
  const cleanModel = model.replace(/\s+/g, '+').replace(/[^a-zA-Z0-9+]/g, '');
  const cleanManufacturer = manufacturer.replace(/\s+/g, '+').replace(/[^a-zA-Z0-9+]/g, '');
  const cleanReg = registration.replace(/[^a-zA-Z0-9]/g, '');
  
  // Add manufacturer/model specific placeholder
  images.push({
    url: `https://via.placeholder.com/800x600/0066cc/ffffff?text=${cleanManufacturer}+${cleanModel}`,
    source: 'placeholder',
    attribution: 'Via Placeholder Service'
  });
  
  // Add random photo based on registration (for variety)
  const seed = cleanReg.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  images.push({
    url: `https://picsum.photos/800/600?random=${seed}`,
    source: 'placeholder',
    attribution: 'Lorem Picsum'
  });
  
  // Add aircraft silhouette placeholder
  images.push({
    url: `https://via.placeholder.com/800x600/f8f9fa/6c757d?text=✈️+${cleanReg}`,
    source: 'placeholder',
    attribution: 'Via Placeholder Service'
  });
  
  return images;
}

/**
 * Generate comprehensive aircraft image URLs
 */
export async function getAircraftImages(
  registration: string,
  manufacturer: string, 
  model: string,
  fetchRealImages: boolean = false
): Promise<AircraftImageData[]> {
  const images: AircraftImageData[] = [];
  
  // Try to get real photo from AeroDataBox if enabled
  if (fetchRealImages) {
    const realImage = await fetchAeroDataBoxImage(registration);
    if (realImage) {
      images.push(realImage);
    }
  }
  
  // Add placeholder images
  const placeholders = generatePlaceholderImages(registration, manufacturer, model);
  images.push(...placeholders);
  
  return images;
}

/**
 * Extract just the URLs from image data for database storage
 */
export function extractImageUrls(images: AircraftImageData[]): string[] {
  return images.map(img => img.url);
}