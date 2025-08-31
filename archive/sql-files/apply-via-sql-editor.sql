-- Execute this in Supabase SQL Editor to apply all migrations at once
-- Go to: https://supabase.com/dashboard/project/fshvzvxqgwgoujtcevyy/sql

-- ===================================
-- CORE AVINODE SCHEMA (Migration 001)
-- ===================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE availability_status AS ENUM ('Available', 'OnRequest', 'Unavailable');
CREATE TYPE flight_leg_status AS ENUM ('Available', 'Booked', 'InProgress', 'Completed');
CREATE TYPE flight_leg_type AS ENUM ('EmptyLeg', 'Charter', 'Positioning');
CREATE TYPE booking_status AS ENUM ('Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled');
CREATE TYPE payment_status AS ENUM ('Pending', 'DepositPaid', 'FullyPaid', 'Refunded');

-- Create main tables
CREATE TABLE IF NOT EXISTS operators (
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_established_year CHECK (established >= 1900 AND established <= EXTRACT(YEAR FROM CURRENT_DATE)),
    CONSTRAINT valid_fleet_size CHECK (fleet_size >= 0),
    CONSTRAINT valid_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE IF NOT EXISTS aircraft (
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
    operator_id VARCHAR(50) NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    operator_name VARCHAR(255) NOT NULL,
    base_airport VARCHAR(10) NOT NULL,
    availability availability_status NOT NULL DEFAULT 'Available',
    amenities TEXT[] NOT NULL DEFAULT '{}',
    images TEXT[] NOT NULL DEFAULT '{}',
    certifications TEXT[] NOT NULL DEFAULT '{}',
    wifi_available BOOLEAN NOT NULL DEFAULT false,
    pet_friendly BOOLEAN NOT NULL DEFAULT false,
    smoking_allowed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_year_of_manufacture CHECK (year_of_manufacture >= 1950 AND year_of_manufacture <= EXTRACT(YEAR FROM CURRENT_DATE) + 5),
    CONSTRAINT valid_max_passengers CHECK (max_passengers > 0 AND max_passengers <= 50),
    CONSTRAINT valid_cruise_speed CHECK (cruise_speed > 0),
    CONSTRAINT valid_range CHECK (range > 0),
    CONSTRAINT valid_hourly_rate CHECK (hourly_rate > 0),
    CONSTRAINT valid_base_airport CHECK (LENGTH(base_airport) = 4)
);

-- Add basic indexes
CREATE INDEX IF NOT EXISTS idx_operators_name ON operators(name);
CREATE INDEX IF NOT EXISTS idx_aircraft_operator ON aircraft(operator_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_category ON aircraft(category);

-- Insert sample data
INSERT INTO operators (id, name, certificate, established, headquarters, operating_bases, fleet_size, safety_rating, insurance, certifications, contact_email, contact_phone, website, description) VALUES
('op-001', 'JetVision Elite', 'FAA Part 135', 2015, 'Teterboro, NJ', '{"KTEB", "KJFK", "KBOS"}', 12, 'IS-BAO Stage 3', 'AIG $100M', '{"ARGUS Gold", "Wyvern Wingman"}', 'ops@jetvision-elite.com', '+1-201-555-0101', 'https://jetvision-elite.com', 'Premium charter operator specializing in transcontinental flights')
ON CONFLICT (id) DO NOTHING;

INSERT INTO aircraft (id, registration_number, model, manufacturer, category, subcategory, year_of_manufacture, max_passengers, cruise_speed, range, hourly_rate, operator_id, operator_name, base_airport, availability, amenities, images, certifications, wifi_available, pet_friendly, smoking_allowed) VALUES
('ac-001', 'N123JV', 'Citation Mustang', 'Cessna', 'Light Jet', 'Entry Level', 2018, 4, 340, 1150, 3500.00, 'op-001', 'JetVision Elite', 'KTEB', 'Available', '{"WiFi", "Refreshments", "Power Outlets"}', '{"https://example.com/ac-001-1.jpg"}', '{"FAA Certified", "EASA Approved"}', true, true, false)
ON CONFLICT (id) DO NOTHING;

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'NextAvinode core tables created successfully!';
    RAISE NOTICE 'Tables: operators, aircraft';  
    RAISE NOTICE 'Sample data inserted';
    RAISE NOTICE 'Ready to add more features!';
END $$;