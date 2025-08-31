-- Create remaining aviation database tables
-- This migration creates all missing tables to complete the aviation system

-- Customers table (separate from auth.users for business data)
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50) DEFAULT 'Individual' CHECK (type IN ('VIP', 'Corporate', 'Individual', 'Government')),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  company VARCHAR(255),
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  currency VARCHAR(3) DEFAULT 'USD',
  payment_method VARCHAR(50) DEFAULT 'credit_card' CHECK (payment_method IN ('credit_card', 'wire_transfer', 'check', 'cash')),
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_id VARCHAR(255),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Airports table  
CREATE TABLE IF NOT EXISTS public.airports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icao_code VARCHAR(4) UNIQUE NOT NULL,
  iata_code VARCHAR(3),
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  elevation_ft INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Routes table
CREATE TABLE IF NOT EXISTS public.routes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  departure_airport VARCHAR(4) NOT NULL,
  arrival_airport VARCHAR(4) NOT NULL,
  distance_nm INTEGER CHECK (distance_nm > 0),
  estimated_flight_time INTEGER CHECK (estimated_flight_time > 0),
  popularity_score INTEGER DEFAULT 0 CHECK (popularity_score >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Weather Data table
CREATE TABLE IF NOT EXISTS public.weather_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  airport_code VARCHAR(4) NOT NULL,
  temperature_celsius DECIMAL(5,2),
  visibility_km DECIMAL(5,2) CHECK (visibility_km >= 0),
  wind_speed_kt INTEGER CHECK (wind_speed_kt >= 0),
  wind_direction INTEGER CHECK (wind_direction >= 0 AND wind_direction < 360),
  conditions VARCHAR(100),
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('booking_confirmed', 'flight_update', 'payment_received', 'system_alert', 'weather_advisory')),
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics table
CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  event_data JSONB,
  user_id UUID,
  session_id VARCHAR(255),
  occurred_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Market Data table
CREATE TABLE IF NOT EXISTS public.market_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aircraft_category VARCHAR(100) NOT NULL,
  route VARCHAR(255),
  average_price DECIMAL(10,2) CHECK (average_price > 0),
  demand_score INTEGER CHECK (demand_score >= 0 AND demand_score <= 100),
  supply_score INTEGER CHECK (supply_score >= 0 AND supply_score <= 100),
  recorded_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Operational Logs table
CREATE TABLE IF NOT EXISTS public.operational_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  operation_type VARCHAR(100) NOT NULL,
  entity_type VARCHAR(100),
  entity_id UUID,
  description TEXT NOT NULL,
  severity VARCHAR(20) DEFAULT 'info' CHECK (severity IN ('debug', 'info', 'warning', 'error', 'critical')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Aircraft Maintenance table (if it doesn't exist)
CREATE TABLE IF NOT EXISTS public.aircraft_maintenance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  aircraft_id UUID REFERENCES public.aircraft(id) ON DELETE CASCADE,
  maintenance_type VARCHAR(100) NOT NULL,
  description TEXT,
  scheduled_date DATE NOT NULL,
  completed_date DATE,
  status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  cost DECIMAL(10,2),
  technician_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Flight Crews table (if it doesn't exist)  
CREATE TABLE IF NOT EXISTS public.flight_crews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL CHECK (role IN ('captain', 'co_pilot', 'flight_attendant')),
  license_number VARCHAR(100),
  experience_hours INTEGER DEFAULT 0 CHECK (experience_hours >= 0),
  certification_expiry DATE,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_airports_icao_code ON public.airports(icao_code);
CREATE INDEX IF NOT EXISTS idx_routes_departure_airport ON public.routes(departure_airport);
CREATE INDEX IF NOT EXISTS idx_routes_arrival_airport ON public.routes(arrival_airport);
CREATE INDEX IF NOT EXISTS idx_weather_data_airport_code ON public.weather_data(airport_code);
CREATE INDEX IF NOT EXISTS idx_weather_data_recorded_at ON public.weather_data(recorded_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON public.notifications(read);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_occurred_at ON public.analytics(occurred_at);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);
CREATE INDEX IF NOT EXISTS idx_reviews_customer_id ON public.reviews(customer_id);
CREATE INDEX IF NOT EXISTS idx_market_data_recorded_date ON public.market_data(recorded_date);
CREATE INDEX IF NOT EXISTS idx_operational_logs_operation_type ON public.operational_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_operational_logs_created_at ON public.operational_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_aircraft_maintenance_aircraft_id ON public.aircraft_maintenance(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_maintenance_status ON public.aircraft_maintenance(status);
CREATE INDEX IF NOT EXISTS idx_flight_crews_role ON public.flight_crews(role);
CREATE INDEX IF NOT EXISTS idx_flight_crews_status ON public.flight_crews(status);