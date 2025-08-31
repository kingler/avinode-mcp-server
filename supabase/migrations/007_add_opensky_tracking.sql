-- Migration 007: Add OpenSky Network tracking fields to aircraft table
-- Adds real-time position and tracking data capabilities

-- Add tracking fields to aircraft table
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS icao24 VARCHAR(6) UNIQUE;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS callsign VARCHAR(8);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS current_latitude DECIMAL(10, 6);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS current_longitude DECIMAL(10, 6);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS current_altitude INTEGER; -- meters
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS current_velocity DECIMAL(8, 2); -- m/s
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS on_ground BOOLEAN DEFAULT false;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS last_position_update TIMESTAMP WITH TIME ZONE;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS opensky_category INTEGER DEFAULT 0;

-- Add index for ICAO24 lookups (used for OpenSky updates)
CREATE INDEX IF NOT EXISTS idx_aircraft_icao24 ON aircraft(icao24);

-- Add index for position-based searches
CREATE INDEX IF NOT EXISTS idx_aircraft_position ON aircraft(current_latitude, current_longitude) WHERE current_latitude IS NOT NULL AND current_longitude IS NOT NULL;

-- Add index for last update timestamp
CREATE INDEX IF NOT EXISTS idx_aircraft_last_update ON aircraft(last_position_update);

-- Create a function to update aircraft positions from OpenSky data
CREATE OR REPLACE FUNCTION update_aircraft_position(
    p_icao24 VARCHAR(6),
    p_callsign VARCHAR(8),
    p_latitude DECIMAL(10, 6),
    p_longitude DECIMAL(10, 6),
    p_altitude INTEGER,
    p_velocity DECIMAL(8, 2),
    p_on_ground BOOLEAN,
    p_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
) RETURNS BOOLEAN AS $$
BEGIN
    UPDATE aircraft 
    SET 
        callsign = COALESCE(p_callsign, callsign),
        current_latitude = p_latitude,
        current_longitude = p_longitude,
        current_altitude = p_altitude,
        current_velocity = p_velocity,
        on_ground = p_on_ground,
        last_position_update = p_timestamp,
        updated_at = CURRENT_TIMESTAMP
    WHERE icao24 = p_icao24;
    
    -- Return whether any row was updated
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Comment on new columns
COMMENT ON COLUMN aircraft.icao24 IS 'ICAO 24-bit transponder address from OpenSky Network';
COMMENT ON COLUMN aircraft.callsign IS 'Current callsign from ADS-B data';
COMMENT ON COLUMN aircraft.current_latitude IS 'Current latitude from OpenSky Network (WGS-84)';
COMMENT ON COLUMN aircraft.current_longitude IS 'Current longitude from OpenSky Network (WGS-84)';
COMMENT ON COLUMN aircraft.current_altitude IS 'Current barometric altitude in meters';
COMMENT ON COLUMN aircraft.current_velocity IS 'Current ground velocity in m/s';
COMMENT ON COLUMN aircraft.on_ground IS 'Whether aircraft is currently on ground';
COMMENT ON COLUMN aircraft.last_position_update IS 'Timestamp of last position update from OpenSky';
COMMENT ON COLUMN aircraft.opensky_category IS 'Aircraft category from OpenSky Network (0-7)';