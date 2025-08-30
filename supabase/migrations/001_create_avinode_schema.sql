-- Avinode MCP Server Database Schema
-- Migration 001: Create core tables with proper relationships and indexing

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE availability_status AS ENUM ('Available', 'OnRequest', 'Unavailable');
CREATE TYPE flight_leg_status AS ENUM ('Available', 'Booked', 'InProgress', 'Completed');
CREATE TYPE flight_leg_type AS ENUM ('EmptyLeg', 'Charter', 'Positioning');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled');
CREATE TYPE payment_status AS ENUM ('Pending', 'DepositPaid', 'FullyPaid', 'Refunded');

-- ===================================
-- OPERATORS TABLE
-- ===================================
CREATE TABLE operators (
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
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_established_year CHECK (established >= 1900 AND established <= EXTRACT(YEAR FROM CURRENT_DATE)),
    CONSTRAINT valid_fleet_size CHECK (fleet_size >= 0),
    CONSTRAINT valid_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ===================================
-- AIRCRAFT TABLE
-- ===================================
CREATE TABLE aircraft (
    id VARCHAR(50) PRIMARY KEY,
    registration_number VARCHAR(20) NOT NULL UNIQUE,
    model VARCHAR(100) NOT NULL,
    manufacturer VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50) NOT NULL,
    year_of_manufacture INTEGER NOT NULL,
    max_passengers INTEGER NOT NULL,
    cruise_speed INTEGER NOT NULL, -- knots
    range INTEGER NOT NULL, -- nautical miles
    hourly_rate DECIMAL(10,2) NOT NULL,
    operator_id VARCHAR(50) NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    operator_name VARCHAR(255) NOT NULL, -- Denormalized for performance
    base_airport VARCHAR(10) NOT NULL, -- ICAO code
    availability availability_status NOT NULL DEFAULT 'Available',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    certifications TEXT[] NOT NULL DEFAULT '{}',
    wifi_available BOOLEAN NOT NULL DEFAULT false,
    pet_friendly BOOLEAN NOT NULL DEFAULT false,
    smoking_allowed BOOLEAN NOT NULL DEFAULT false,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_year_of_manufacture CHECK (year_of_manufacture >= 1950 AND year_of_manufacture <= EXTRACT(YEAR FROM CURRENT_DATE) + 5),
    CONSTRAINT valid_max_passengers CHECK (max_passengers > 0 AND max_passengers <= 50),
    CONSTRAINT valid_cruise_speed CHECK (cruise_speed > 0),
    CONSTRAINT valid_range CHECK (range > 0),
    CONSTRAINT valid_hourly_rate CHECK (hourly_rate > 0),
    CONSTRAINT valid_base_airport CHECK (LENGTH(base_airport) = 4) -- ICAO format
);

-- ===================================
-- FLIGHT LEGS TABLE
-- ===================================
CREATE TABLE flight_legs (
    id VARCHAR(50) PRIMARY KEY,
    aircraft_id VARCHAR(50) NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
    departure_airport VARCHAR(10) NOT NULL, -- ICAO code
    arrival_airport VARCHAR(10) NOT NULL, -- ICAO code
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    flight_time DECIMAL(5,2) NOT NULL, -- hours
    distance INTEGER NOT NULL, -- nautical miles
    status flight_leg_status NOT NULL DEFAULT 'Available',
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    type flight_leg_type NOT NULL,
    
    -- Calculated departure/arrival timestamps for easy querying
    departure_timestamp TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
        (departure_date::TEXT || ' ' || departure_time::TEXT)::TIMESTAMP WITH TIME ZONE
    ) STORED,
    arrival_timestamp TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
        (arrival_date::TEXT || ' ' || arrival_time::TEXT)::TIMESTAMP WITH TIME ZONE
    ) STORED,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_departure_airport CHECK (LENGTH(departure_airport) = 4),
    CONSTRAINT valid_arrival_airport CHECK (LENGTH(arrival_airport) = 4),
    CONSTRAINT different_airports CHECK (departure_airport != arrival_airport),
    CONSTRAINT valid_flight_time CHECK (flight_time > 0 AND flight_time <= 24),
    CONSTRAINT valid_distance CHECK (distance > 0),
    CONSTRAINT valid_price CHECK (price >= 0),
    CONSTRAINT valid_currency CHECK (LENGTH(currency) = 3),
    CONSTRAINT valid_arrival_after_departure CHECK (
        arrival_timestamp > departure_timestamp
    )
);

-- ===================================
-- CHARTER REQUESTS TABLE
-- ===================================
CREATE TABLE charter_requests (
    id VARCHAR(50) PRIMARY KEY,
    aircraft_id VARCHAR(50) NOT NULL REFERENCES aircraft(id),
    operator_id VARCHAR(50) NOT NULL REFERENCES operators(id),
    departure_airport VARCHAR(10) NOT NULL,
    arrival_airport VARCHAR(10) NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    return_date DATE,
    return_time TIME,
    passengers INTEGER NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    company VARCHAR(255),
    special_requests TEXT,
    status booking_status NOT NULL DEFAULT 'Pending',
    
    -- Calculated timestamps
    departure_timestamp TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
        (departure_date::TEXT || ' ' || departure_time::TEXT)::TIMESTAMP WITH TIME ZONE
    ) STORED,
    return_timestamp TIMESTAMP WITH TIME ZONE GENERATED ALWAYS AS (
        CASE 
            WHEN return_date IS NOT NULL AND return_time IS NOT NULL 
            THEN (return_date::TEXT || ' ' || return_time::TEXT)::TIMESTAMP WITH TIME ZONE
            ELSE NULL
        END
    ) STORED,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_passengers CHECK (passengers > 0 AND passengers <= 50),
    CONSTRAINT valid_contact_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_return_after_departure CHECK (
        return_timestamp IS NULL OR return_timestamp > departure_timestamp
    )
);

-- ===================================
-- PRICING QUOTES TABLE
-- ===================================
CREATE TABLE pricing_quotes (
    id VARCHAR(50) PRIMARY KEY,
    request_id VARCHAR(50) REFERENCES charter_requests(id),
    aircraft_id VARCHAR(50) NOT NULL REFERENCES aircraft(id),
    total_price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    
    -- Price breakdown (stored as JSONB for flexibility)
    price_breakdown JSONB NOT NULL,
    
    valid_until TIMESTAMP WITH TIME ZONE NOT NULL,
    terms TEXT[] NOT NULL DEFAULT '{}',
    cancellation_policy TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_total_price CHECK (total_price > 0),
    CONSTRAINT valid_valid_until CHECK (valid_until > created_at),
    
    -- Ensure price breakdown has required fields
    CONSTRAINT valid_price_breakdown CHECK (
        price_breakdown ? 'flightHours' AND
        price_breakdown ? 'hourlyRate' AND
        price_breakdown ? 'baseCost' AND
        (price_breakdown->>'flightHours')::NUMERIC > 0 AND
        (price_breakdown->>'hourlyRate')::NUMERIC > 0 AND
        (price_breakdown->>'baseCost')::NUMERIC > 0
    )
);

-- ===================================
-- BOOKINGS TABLE
-- ===================================
CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY,
    quote_id VARCHAR(50) REFERENCES pricing_quotes(id),
    aircraft_id VARCHAR(50) NOT NULL REFERENCES aircraft(id),
    operator_id VARCHAR(50) NOT NULL REFERENCES operators(id),
    status booking_status NOT NULL DEFAULT 'Pending',
    
    -- Financial details
    total_price DECIMAL(12,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    payment_status payment_status NOT NULL DEFAULT 'Pending',
    payment_method VARCHAR(50),
    deposit_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    balance_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    deposit_due_date TIMESTAMP WITH TIME ZONE,
    balance_due_date TIMESTAMP WITH TIME ZONE,
    
    -- Passenger information
    passenger_info JSONB NOT NULL,
    
    special_requests TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_total_price CHECK (total_price > 0),
    CONSTRAINT valid_deposit_amount CHECK (deposit_amount >= 0),
    CONSTRAINT valid_balance_amount CHECK (balance_amount >= 0),
    CONSTRAINT valid_amounts CHECK (deposit_amount + balance_amount = total_price),
    
    -- Ensure passenger info has required fields
    CONSTRAINT valid_passenger_info CHECK (
        passenger_info ? 'name' AND
        passenger_info ? 'email' AND
        passenger_info ? 'phone' AND
        LENGTH(passenger_info->>'name') > 0 AND
        LENGTH(passenger_info->>'email') > 0 AND
        LENGTH(passenger_info->>'phone') > 0
    )
);

-- ===================================
-- BOOKING LEGS JUNCTION TABLE
-- ===================================
CREATE TABLE booking_legs (
    booking_id VARCHAR(50) NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    flight_leg_id VARCHAR(50) NOT NULL REFERENCES flight_legs(id) ON DELETE CASCADE,
    leg_order INTEGER NOT NULL,
    
    PRIMARY KEY (booking_id, flight_leg_id),
    
    CONSTRAINT valid_leg_order CHECK (leg_order > 0)
);

-- ===================================
-- INDEXES FOR PERFORMANCE
-- ===================================

-- Operators indexes
CREATE INDEX idx_operators_safety_rating ON operators(safety_rating);
CREATE INDEX idx_operators_fleet_size ON operators(fleet_size);

-- Aircraft indexes
CREATE INDEX idx_aircraft_operator_id ON aircraft(operator_id);
CREATE INDEX idx_aircraft_category ON aircraft(category);
CREATE INDEX idx_aircraft_availability ON aircraft(availability);
CREATE INDEX idx_aircraft_base_airport ON aircraft(base_airport);
CREATE INDEX idx_aircraft_hourly_rate ON aircraft(hourly_rate);
CREATE INDEX idx_aircraft_max_passengers ON aircraft(max_passengers);
CREATE INDEX idx_aircraft_range ON aircraft(range);

-- Flight legs indexes
CREATE INDEX idx_flight_legs_aircraft_id ON flight_legs(aircraft_id);
CREATE INDEX idx_flight_legs_departure_airport ON flight_legs(departure_airport);
CREATE INDEX idx_flight_legs_arrival_airport ON flight_legs(arrival_airport);
CREATE INDEX idx_flight_legs_departure_timestamp ON flight_legs(departure_timestamp);
CREATE INDEX idx_flight_legs_status ON flight_legs(status);
CREATE INDEX idx_flight_legs_type ON flight_legs(type);
CREATE INDEX idx_flight_legs_price ON flight_legs(price);

-- Charter requests indexes
CREATE INDEX idx_charter_requests_aircraft_id ON charter_requests(aircraft_id);
CREATE INDEX idx_charter_requests_operator_id ON charter_requests(operator_id);
CREATE INDEX idx_charter_requests_departure_timestamp ON charter_requests(departure_timestamp);
CREATE INDEX idx_charter_requests_status ON charter_requests(status);
CREATE INDEX idx_charter_requests_contact_email ON charter_requests(contact_email);

-- Pricing quotes indexes
CREATE INDEX idx_pricing_quotes_aircraft_id ON pricing_quotes(aircraft_id);
CREATE INDEX idx_pricing_quotes_request_id ON pricing_quotes(request_id);
CREATE INDEX idx_pricing_quotes_valid_until ON pricing_quotes(valid_until);

-- Bookings indexes
CREATE INDEX idx_bookings_aircraft_id ON bookings(aircraft_id);
CREATE INDEX idx_bookings_operator_id ON bookings(operator_id);
CREATE INDEX idx_bookings_quote_id ON bookings(quote_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_payment_status ON bookings(payment_status);

-- Composite indexes for common queries
CREATE INDEX idx_aircraft_search ON aircraft(category, availability, max_passengers, hourly_rate);
CREATE INDEX idx_flight_legs_search ON flight_legs(departure_airport, arrival_airport, departure_timestamp, status, type);

-- ===================================
-- TRIGGERS FOR UPDATED_AT
-- ===================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_operators_updated_at BEFORE UPDATE ON operators 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aircraft_updated_at BEFORE UPDATE ON aircraft 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flight_legs_updated_at BEFORE UPDATE ON flight_legs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_charter_requests_updated_at BEFORE UPDATE ON charter_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_quotes_updated_at BEFORE UPDATE ON pricing_quotes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===================================

-- Enable RLS on all tables
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_legs ENABLE ROW LEVEL SECURITY;
ALTER TABLE charter_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_legs ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - can be refined based on requirements)
-- These are basic policies that allow read access to all authenticated users
-- and full access to service role

-- Operators policies
CREATE POLICY "Allow read access to operators" ON operators FOR SELECT USING (true);
CREATE POLICY "Allow service role full access to operators" ON operators USING (auth.role() = 'service_role');

-- Aircraft policies  
CREATE POLICY "Allow read access to aircraft" ON aircraft FOR SELECT USING (true);
CREATE POLICY "Allow service role full access to aircraft" ON aircraft USING (auth.role() = 'service_role');

-- Flight legs policies
CREATE POLICY "Allow read access to flight_legs" ON flight_legs FOR SELECT USING (true);
CREATE POLICY "Allow service role full access to flight_legs" ON flight_legs USING (auth.role() = 'service_role');

-- Charter requests policies
CREATE POLICY "Allow read access to charter_requests" ON charter_requests FOR SELECT USING (true);
CREATE POLICY "Allow service role full access to charter_requests" ON charter_requests USING (auth.role() = 'service_role');

-- Pricing quotes policies
CREATE POLICY "Allow read access to pricing_quotes" ON pricing_quotes FOR SELECT USING (true);
CREATE POLICY "Allow service role full access to pricing_quotes" ON pricing_quotes USING (auth.role() = 'service_role');

-- Bookings policies
CREATE POLICY "Allow read access to bookings" ON bookings FOR SELECT USING (true);
CREATE POLICY "Allow service role full access to bookings" ON bookings USING (auth.role() = 'service_role');

-- Booking legs policies
CREATE POLICY "Allow read access to booking_legs" ON booking_legs FOR SELECT USING (true);
CREATE POLICY "Allow service role full access to booking_legs" ON booking_legs USING (auth.role() = 'service_role');

-- ===================================
-- COMMENTS FOR DOCUMENTATION
-- ===================================

COMMENT ON TABLE operators IS 'Aviation charter operators with their certifications and contact information';
COMMENT ON TABLE aircraft IS 'Aircraft fleet with specifications, availability, and operator relationships';
COMMENT ON TABLE flight_legs IS 'Individual flight segments including empty legs and charter flights';
COMMENT ON TABLE charter_requests IS 'Customer charter requests with contact information and requirements';
COMMENT ON TABLE pricing_quotes IS 'Detailed pricing quotes with breakdown of costs and terms';
COMMENT ON TABLE bookings IS 'Confirmed bookings with payment status and passenger information';
COMMENT ON TABLE booking_legs IS 'Junction table linking bookings to their associated flight legs';

COMMENT ON COLUMN aircraft.registration_number IS 'Aircraft tail number (e.g., N123JV)';
COMMENT ON COLUMN aircraft.base_airport IS 'Primary operating airport in ICAO format (e.g., KTEB)';
COMMENT ON COLUMN flight_legs.departure_airport IS 'Departure airport in ICAO format';
COMMENT ON COLUMN flight_legs.arrival_airport IS 'Arrival airport in ICAO format';
COMMENT ON COLUMN pricing_quotes.price_breakdown IS 'JSON object containing detailed cost breakdown';
COMMENT ON COLUMN bookings.passenger_info IS 'JSON object containing passenger contact details';