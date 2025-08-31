-- ==================================================
-- SIMPLE TABLE CREATION FOR SUPABASE SQL EDITOR
-- ==================================================
-- Copy and paste this ENTIRE script into Supabase SQL Editor
-- Then click "Run" to execute

-- Create operators table
CREATE TABLE public.operators (
  id text PRIMARY KEY,
  name text NOT NULL,
  certificate text NOT NULL,
  established integer NOT NULL,
  headquarters text NOT NULL,
  operating_bases text[] DEFAULT '{}',
  fleet_size integer DEFAULT 0,
  safety_rating text NOT NULL,
  insurance text NOT NULL,
  certifications text[] DEFAULT '{}',
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  website text,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create aircraft table
CREATE TABLE public.aircraft (
  id text PRIMARY KEY,
  registration_number text NOT NULL UNIQUE,
  model text NOT NULL,
  manufacturer text NOT NULL,
  category text NOT NULL,
  subcategory text NOT NULL,
  year_of_manufacture integer NOT NULL,
  max_passengers integer NOT NULL,
  cruise_speed integer NOT NULL,
  range integer NOT NULL,
  hourly_rate decimal(10,2) NOT NULL,
  operator_id text NOT NULL,
  operator_name text NOT NULL,
  base_airport text NOT NULL,
  availability text DEFAULT 'Available',
  amenities text[] DEFAULT '{}',
  images text[] DEFAULT '{}',
  certifications text[] DEFAULT '{}',
  wifi_available boolean DEFAULT false,
  pet_friendly boolean DEFAULT false,
  smoking_allowed boolean DEFAULT false,
  icao24 text UNIQUE,
  callsign text,
  current_latitude decimal(10, 6),
  current_longitude decimal(11, 6),
  current_altitude integer,
  current_velocity decimal(8, 2),
  on_ground boolean DEFAULT false,
  last_position_update timestamptz,
  opensky_category integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aircraft ENABLE ROW LEVEL SECURITY;

-- Create policies to allow access
CREATE POLICY "Enable read access for all users" ON public.operators FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON public.operators FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Enable read access for all users" ON public.aircraft FOR SELECT USING (true);
CREATE POLICY "Enable all for service role" ON public.aircraft FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_aircraft_operator_id ON aircraft(operator_id);
CREATE INDEX idx_aircraft_category ON aircraft(category);
CREATE INDEX idx_aircraft_availability ON aircraft(availability);
CREATE INDEX idx_aircraft_icao24 ON aircraft(icao24);

-- Insert test data to verify tables work
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
);

-- Verify tables were created
SELECT 'Tables created successfully!' as status, 
       (SELECT count(*) FROM public.operators) as operators_count,
       (SELECT count(*) FROM public.aircraft) as aircraft_count;