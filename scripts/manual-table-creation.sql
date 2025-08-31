-- ================================================
-- MANUAL TABLE CREATION FOR SUPABASE DASHBOARD
-- ================================================
-- Copy and paste this SQL in Supabase SQL Editor
-- This creates the minimal tables needed for OpenSky data seeding

-- Create operators table
CREATE TABLE IF NOT EXISTS public.operators (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  certificate VARCHAR(100) NOT NULL,
  established INTEGER NOT NULL,
  headquarters VARCHAR(255) NOT NULL,
  operating_bases TEXT[] NOT NULL DEFAULT '{}',
  fleet_size INTEGER NOT NULL DEFAULT 0,
  safety_rating VARCHAR(100) NOT NULL,
  insurance VARCHAR(255) NOT NULL,
  certifications TEXT[] NOT NULL DEFAULT '{}',
  contact_email VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  website VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create aircraft table with OpenSky tracking fields
CREATE TABLE IF NOT EXISTS public.aircraft (
  id VARCHAR(50) PRIMARY KEY,
  registration_number VARCHAR(20) NOT NULL UNIQUE,
  model VARCHAR(100) NOT NULL,
  manufacturer VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50) NOT NULL,
  year_of_manufacture INTEGER NOT NULL,
  max_passengers INTEGER NOT NULL,
  cruise_speed INTEGER NOT NULL,
  range INTEGER NOT NULL,
  hourly_rate DECIMAL(10,2) NOT NULL,
  operator_id VARCHAR(50) NOT NULL,
  operator_name VARCHAR(255) NOT NULL,
  base_airport VARCHAR(10) NOT NULL,
  availability VARCHAR(20) NOT NULL DEFAULT 'Available',
  amenities TEXT[] NOT NULL DEFAULT '{}',
  images TEXT[] NOT NULL DEFAULT '{}',
  certifications TEXT[] NOT NULL DEFAULT '{}',
  wifi_available BOOLEAN NOT NULL DEFAULT false,
  pet_friendly BOOLEAN NOT NULL DEFAULT false,
  smoking_allowed BOOLEAN NOT NULL DEFAULT false,
  
  -- OpenSky Network tracking fields
  icao24 VARCHAR(6) UNIQUE,
  callsign VARCHAR(20),
  current_latitude DECIMAL(10, 6),
  current_longitude DECIMAL(11, 6),
  current_altitude INTEGER,
  current_velocity DECIMAL(8, 2),
  on_ground BOOLEAN DEFAULT false,
  last_position_update TIMESTAMP WITH TIME ZONE,
  opensky_category INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_aircraft_operator_id ON aircraft(operator_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_category ON aircraft(category);
CREATE INDEX IF NOT EXISTS idx_aircraft_availability ON aircraft(availability);
CREATE INDEX IF NOT EXISTS idx_aircraft_icao24 ON aircraft(icao24);

-- Enable RLS (Row Level Security) - required for Supabase
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aircraft ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (can be refined later)
CREATE POLICY "Enable read access for all users" ON public.operators FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON public.operators FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for all users" ON public.aircraft FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON public.aircraft FOR ALL USING (auth.role() = 'service_role');

-- Test the tables by inserting a sample operator
INSERT INTO public.operators (
  id, name, certificate, established, headquarters, fleet_size, 
  safety_rating, insurance, contact_email, contact_phone, description
) VALUES (
  'OP001', 
  'Test Aviation', 
  'Part 135 Operator', 
  2020, 
  'Miami, FL', 
  5, 
  'ARGUS Gold', 
  '$50M Liability Coverage', 
  'ops@testaviation.com', 
  '+1-305-555-0001',
  'Test operator for database setup verification'
) ON CONFLICT (id) DO NOTHING;

-- Verify tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('operators', 'aircraft')
ORDER BY table_name;