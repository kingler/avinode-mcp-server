/**
 * OpenSky Network API Integration
 * Fetches real aircraft data for database seeding
 */

export interface OpenSkyStateVector {
  icao24: string;           // Unique ICAO 24-bit address of the transponder in hex string representation
  callsign: string | null; // Callsign of the vehicle (8 chars). Can be null if no callsign has been received
  origin_country: string;  // Country name inferred from the ICAO 24-bit address
  time_position: number | null; // Unix timestamp (seconds) for the last position update
  last_contact: number;    // Unix timestamp (seconds) for the last update in general
  longitude: number | null; // WGS-84 longitude in decimal degrees
  latitude: number | null;  // WGS-84 latitude in decimal degrees  
  baro_altitude: number | null; // Barometric altitude in meters
  on_ground: boolean;      // true if aircraft is on ground (sends ADS-B surface position reports)
  velocity: number | null; // Velocity over ground in m/s
  true_track: number | null; // True track in decimal degrees clockwise from north (north=0°)
  vertical_rate: number | null; // Vertical rate in m/s. A positive value indicates that the airplane is climbing
  sensors: number[] | null; // IDs of the receivers which contributed to this state vector
  geo_altitude: number | null; // Geometric altitude in meters
  squawk: string | null;   // The transponder code aka Squawk
  spi: boolean;           // Whether flight status indicates special purpose indicator
  position_source: number; // Origin of this state's position
  category: number;       // Aircraft category
}

export interface OpenSkyResponse {
  time: number;
  states: (string | number | boolean | null)[][] | null;
}

export interface ProcessedAircraft {
  icao24: string;
  callsign: string;
  registration: string;
  model: string;
  manufacturer: string;
  category: string;
  operator: string;
  homeBase: string;
  maxPassengers: number;
  hourlyRate: number;
  images: string[];
  latitude: number | null;
  longitude: number | null;
  altitude: number | null;
  velocity: number | null;
  onGround: boolean;
  lastSeen: Date;
}

/**
 * Aircraft category mapping based on ICAO aircraft categories
 */
const AIRCRAFT_CATEGORY_MAPPING: Record<number, { category: string; passengers: number; rate: number; manufacturer: string; models: string[] }> = {
  0: { category: 'Unknown', passengers: 4, rate: 2500, manufacturer: 'Unknown', models: ['Unknown Aircraft'] },
  1: { category: 'Light', passengers: 6, rate: 3500, manufacturer: 'Cessna', models: ['Citation CJ3+', 'Citation M2', 'Citation CJ4'] },
  2: { category: 'Small', passengers: 8, rate: 4200, manufacturer: 'Embraer', models: ['Phenom 300E', 'Phenom 100EV'] },
  3: { category: 'Large', passengers: 14, rate: 8500, manufacturer: 'Gulfstream', models: ['G450', 'G550', 'G280'] },
  4: { category: 'High Vortex Large', passengers: 16, rate: 11500, manufacturer: 'Gulfstream', models: ['G650ER', 'Global 7500'] },
  5: { category: 'Heavy', passengers: 18, rate: 12000, manufacturer: 'Bombardier', models: ['Global 6000', 'Global 7500'] },
  6: { category: 'High Performance', passengers: 10, rate: 6500, manufacturer: 'Dassault', models: ['Falcon 2000', 'Falcon 7X'] },
  7: { category: 'Rotorcraft', passengers: 6, rate: 4800, manufacturer: 'Airbus', models: ['H155', 'H175'] }
};

/**
 * Generate realistic operator names
 */
const OPERATOR_NAMES = [
  'Elite Aviation', 'Prestige Air', 'Global Jets', 'Luxury Wings',
  'Premier Charter', 'Executive Air', 'Diamond Aviation', 'Platinum Jets',
  'Supreme Air', 'Royal Flight', 'VIP Aviation', 'Crown Charter',
  'Signature Flight', 'Sterling Aviation', 'Meridian Jets'
];

/**
 * Common airport codes for home bases
 */
const HOME_BASES = [
  'KTEB', 'KJFK', 'KLAX', 'KBOS', 'KPBI', 'KLAS', 'KPHX', 'KSNA',
  'KBUR', 'KOAK', 'KSJC', 'KDCA', 'KBWI', 'KIAD', 'KMIA', 'KFLL'
];

/**
 * Fetch current aircraft states from OpenSky Network
 */
export async function fetchOpenSkyStates(bbox?: {
  laMin: number;
  loMin: number;
  laMax: number;
  loMax: number;
}): Promise<OpenSkyResponse> {
  const baseUrl = 'https://opensky-network.org/api/states/all';
  
  let url = baseUrl;
  if (bbox) {
    const params = new URLSearchParams({
      lamin: bbox.laMin.toString(),
      lomin: bbox.loMin.toString(),
      lamax: bbox.laMax.toString(),
      lomax: bbox.loMax.toString()
    });
    url += `?${params.toString()}`;
  }

  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`OpenSky API error: ${response.status} ${response.statusText}`);
  }

  return await response.json() as OpenSkyResponse;
}

/**
 * Convert raw OpenSky state vector to structured format
 */
export function parseStateVector(state: (string | number | boolean | null)[]): OpenSkyStateVector | null {
  if (!state || state.length < 17) return null;
  
  return {
    icao24: state[0] as string,
    callsign: state[1] as string | null,
    origin_country: state[2] as string,
    time_position: state[3] as number | null,
    last_contact: state[4] as number,
    longitude: state[5] as number | null,
    latitude: state[6] as number | null,
    baro_altitude: state[7] as number | null,
    on_ground: state[8] as boolean,
    velocity: state[9] as number | null,
    true_track: state[10] as number | null,
    vertical_rate: state[11] as number | null,
    sensors: state[12] as number[] | null,
    geo_altitude: state[13] as number | null,
    squawk: state[14] as string | null,
    spi: state[15] as boolean,
    position_source: state[16] as number,
    category: (state[17] as number) || 0
  };
}

/**
 * Generate aircraft image URLs based on aircraft data (synchronous version)
 */
function generateAircraftImages(registration: string, manufacturer: string, model: string): string[] {
  // Clean up strings for URLs
  const cleanModel = model.replace(/\s+/g, '+').replace(/[^a-zA-Z0-9+]/g, '');
  const cleanManufacturer = manufacturer.replace(/\s+/g, '+').replace(/[^a-zA-Z0-9+]/g, '');
  const cleanReg = registration.replace(/[^a-zA-Z0-9]/g, '');
  
  const images: string[] = [];
  
  // Add placeholder images for immediate use
  images.push(`https://via.placeholder.com/800x600/0066cc/ffffff?text=${cleanManufacturer}+${cleanModel}`);
  
  // Add random photo based on registration hash for variety
  const seed = cleanReg.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  images.push(`https://picsum.photos/800/600?random=${seed}`);
  
  // Add aircraft silhouette placeholder
  images.push(`https://via.placeholder.com/800x600/f8f9fa/6c757d?text=✈️+${cleanReg}`);
  
  return images;
}

/**
 * Generate realistic registration number from ICAO24
 */
function generateRegistration(icao24: string, country: string): string {
  // Map common countries to their registration prefixes
  const countryPrefixes: Record<string, string> = {
    'United States': 'N',
    'United Kingdom': 'G-',
    'Germany': 'D-',
    'France': 'F-',
    'Canada': 'C-',
    'Australia': 'VH-',
    'Switzerland': 'HB-',
    'Netherlands': 'PH-'
  };
  
  const prefix = countryPrefixes[country] || 'N';
  const suffix = icao24.substring(0, 5).toUpperCase();
  
  return `${prefix}${suffix}`;
}

/**
 * Process OpenSky aircraft data into aviation-specific format
 */
export function processAircraftData(states: OpenSkyStateVector[]): ProcessedAircraft[] {
  console.log(`Processing ${states.length} aircraft states...`);
  
  const filtered = states.filter(state => {
    const hasBasicData = state.icao24 && state.latitude && state.longitude;
    return hasBasicData;
  });
  
  console.log(`${filtered.length} aircraft have basic position data`);
  
  return filtered
    .map(state => {
      const categoryInfo = AIRCRAFT_CATEGORY_MAPPING[state.category] || AIRCRAFT_CATEGORY_MAPPING[1];
      const randomModel = categoryInfo.models[Math.floor(Math.random() * categoryInfo.models.length)];
      const randomOperator = OPERATOR_NAMES[Math.floor(Math.random() * OPERATOR_NAMES.length)];
      const randomBase = HOME_BASES[Math.floor(Math.random() * HOME_BASES.length)];
      
      const registration = generateRegistration(state.icao24, state.origin_country);
      
      return {
        icao24: state.icao24,
        callsign: state.callsign?.trim() || `${state.icao24.toUpperCase()}`,
        registration,
        model: randomModel,
        manufacturer: categoryInfo.manufacturer,
        category: categoryInfo.category,
        operator: randomOperator,
        homeBase: randomBase,
        maxPassengers: categoryInfo.passengers + Math.floor(Math.random() * 4), // Add some variation
        hourlyRate: categoryInfo.rate + Math.floor(Math.random() * 1000), // Add price variation
        images: generateAircraftImages(registration, categoryInfo.manufacturer, randomModel),
        latitude: state.latitude,
        longitude: state.longitude,
        altitude: state.baro_altitude || state.geo_altitude,
        velocity: state.velocity,
        onGround: state.on_ground,
        lastSeen: new Date(state.last_contact * 1000)
      };
    })
    .slice(0, 50); // Limit to 50 aircraft for initial seeding
}

/**
 * Fetch and process aircraft data for database seeding
 */
export async function getProcessedAircraftData(region?: 'usa' | 'europe'): Promise<ProcessedAircraft[]> {
  // Define bounding boxes for different regions
  const regions = {
    usa: { laMin: 25.0, loMin: -125.0, laMax: 49.0, loMax: -66.0 },
    europe: { laMin: 35.0, loMin: -10.0, laMax: 70.0, loMax: 40.0 }
  };
  
  const bbox = region ? regions[region] : undefined;
  
  console.log(`Fetching aircraft data from OpenSky Network${region ? ` (${region})` : ' (global)'}`);
  
  const response = await fetchOpenSkyStates(bbox);
  
  if (!response.states || response.states.length === 0) {
    console.log('No aircraft states received from OpenSky Network');
    return [];
  }
  
  console.log(`Received ${response.states.length} aircraft states`);
  
  const parsedStates = response.states
    .map(parseStateVector)
    .filter((state): state is OpenSkyStateVector => state !== null);
  
  const processedAircraft = processAircraftData(parsedStates);
  
  console.log(`Processed ${processedAircraft.length} aircraft for database seeding`);
  
  return processedAircraft;
}