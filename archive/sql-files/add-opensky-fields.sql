-- ================================================
-- ADD OPENSKY TRACKING FIELDS TO EXISTING DATABASE  
-- ================================================
-- Run this in Supabase SQL Editor to add OpenSky Network integration
-- to your existing jetvision-agent-db

-- Add OpenSky Network tracking fields to existing aircraft table
ALTER TABLE public.aircraft 
ADD COLUMN IF NOT EXISTS icao24 VARCHAR(6),
ADD COLUMN IF NOT EXISTS callsign VARCHAR(20),
ADD COLUMN IF NOT EXISTS current_latitude DECIMAL(10, 6),
ADD COLUMN IF NOT EXISTS current_longitude DECIMAL(11, 6),
ADD COLUMN IF NOT EXISTS current_altitude INTEGER,
ADD COLUMN IF NOT EXISTS current_velocity DECIMAL(8, 2),
ADD COLUMN IF NOT EXISTS on_ground BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_position_update TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS opensky_category INTEGER DEFAULT 0;

-- Add indexes for OpenSky lookups
CREATE INDEX IF NOT EXISTS idx_aircraft_icao24 ON public.aircraft(icao24);
CREATE INDEX IF NOT EXISTS idx_aircraft_current_position ON public.aircraft(current_latitude, current_longitude);
CREATE INDEX IF NOT EXISTS idx_aircraft_last_update ON public.aircraft(last_position_update);

-- Add unique constraint on icao24 (but allow nulls for aircraft without ICAO codes)
CREATE UNIQUE INDEX IF NOT EXISTS idx_aircraft_icao24_unique ON public.aircraft(icao24) WHERE icao24 IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.aircraft.icao24 IS 'ICAO 24-bit transponder address from OpenSky Network';
COMMENT ON COLUMN public.aircraft.callsign IS 'Current callsign/flight number from OpenSky Network';
COMMENT ON COLUMN public.aircraft.current_latitude IS 'Current latitude from OpenSky Network (WGS-84)';
COMMENT ON COLUMN public.aircraft.current_longitude IS 'Current longitude from OpenSky Network (WGS-84)';
COMMENT ON COLUMN public.aircraft.current_altitude IS 'Current altitude in meters from OpenSky Network';
COMMENT ON COLUMN public.aircraft.current_velocity IS 'Current ground speed in m/s from OpenSky Network';
COMMENT ON COLUMN public.aircraft.on_ground IS 'Whether aircraft is currently on ground from OpenSky Network';
COMMENT ON COLUMN public.aircraft.last_position_update IS 'Timestamp of last position update from OpenSky';
COMMENT ON COLUMN public.aircraft.opensky_category IS 'Aircraft category from OpenSky Network (0-7)';

-- Create function to update aircraft positions from OpenSky data
CREATE OR REPLACE FUNCTION update_aircraft_position(
    p_icao24 VARCHAR(6),
    p_callsign VARCHAR(20),
    p_latitude DECIMAL(10,6),
    p_longitude DECIMAL(11,6),
    p_altitude INTEGER,
    p_velocity DECIMAL(8,2),
    p_on_ground BOOLEAN,
    p_category INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.aircraft 
    SET 
        callsign = p_callsign,
        current_latitude = p_latitude,
        current_longitude = p_longitude,
        current_altitude = p_altitude,
        current_velocity = p_velocity,
        on_ground = p_on_ground,
        opensky_category = p_category,
        last_position_update = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE icao24 = p_icao24;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create function to get aircraft near a location (for proximity searches)
CREATE OR REPLACE FUNCTION get_aircraft_near_location(
    p_latitude DECIMAL(10,6),
    p_longitude DECIMAL(11,6),
    p_radius_km DECIMAL DEFAULT 100
)
RETURNS TABLE (
    id VARCHAR(50),
    tail_number VARCHAR(20),
    manufacturer VARCHAR(100),
    model VARCHAR(100),
    current_latitude DECIMAL(10,6),
    current_longitude DECIMAL(11,6),
    distance_km DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.tail_number,
        a.manufacturer,
        a.model,
        a.current_latitude,
        a.current_longitude,
        (6371 * acos(
            cos(radians(p_latitude)) * 
            cos(radians(a.current_latitude)) * 
            cos(radians(a.current_longitude) - radians(p_longitude)) + 
            sin(radians(p_latitude)) * 
            sin(radians(a.current_latitude))
        ))::DECIMAL(10,2) as distance_km
    FROM public.aircraft a
    WHERE a.current_latitude IS NOT NULL 
    AND a.current_longitude IS NOT NULL
    AND (6371 * acos(
        cos(radians(p_latitude)) * 
        cos(radians(a.current_latitude)) * 
        cos(radians(a.current_longitude) - radians(p_longitude)) + 
        sin(radians(p_latitude)) * 
        sin(radians(a.current_latitude))
    )) <= p_radius_km
    ORDER BY distance_km;
END;
$$ LANGUAGE plpgsql;

-- Test the new columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'aircraft' 
AND column_name IN ('icao24', 'callsign', 'current_latitude', 'current_longitude', 'opensky_category')
ORDER BY column_name;

-- Show current aircraft count
SELECT COUNT(*) as aircraft_count FROM public.aircraft;

-- Success message
DO $$
BEGIN
    RAISE NOTICE '✅ OpenSky tracking fields added successfully!';
    RAISE NOTICE '🛩️  Ready for OpenSky Network data integration';
    RAISE NOTICE '🚀 Next step: npm run seed:opensky';
END $$;