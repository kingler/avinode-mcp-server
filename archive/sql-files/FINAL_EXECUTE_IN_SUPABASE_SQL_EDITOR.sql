-- =====================================================
-- EXECUTE THIS IN SUPABASE SQL EDITOR
-- Complete Aviation Platform Database Schema - FINAL VERSION
-- Copy and paste this entire file into your Supabase SQL Editor
-- =====================================================

-- 1. OPERATORS TABLE
CREATE TABLE IF NOT EXISTS operators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    certificate TEXT NOT NULL,
    established INTEGER NOT NULL,
    headquarters TEXT NOT NULL,
    operating_bases TEXT[] NOT NULL,
    fleet_size INTEGER DEFAULT 0,
    safety_rating TEXT NOT NULL,
    insurance TEXT NOT NULL,
    certifications TEXT[] NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    website TEXT,
    description TEXT,
    avg_rating DECIMAL DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    response_time_hours INTEGER DEFAULT 24,
    instant_booking_enabled BOOLEAN DEFAULT FALSE,
    ai_optimized_pricing BOOLEAN DEFAULT FALSE,
    predictive_maintenance_enabled BOOLEAN DEFAULT FALSE,
    smart_routing_enabled BOOLEAN DEFAULT FALSE,
    blockchain_verified BOOLEAN DEFAULT FALSE,
    blockchain_address TEXT,
    carbon_offset_program BOOLEAN DEFAULT FALSE,
    saf_percentage DECIMAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. FLIGHT_LEGS TABLE
CREATE TABLE IF NOT EXISTS flight_legs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aircraft_id UUID REFERENCES aircraft(id),
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    arrival_date DATE NOT NULL,
    arrival_time TIME NOT NULL,
    flight_time DECIMAL NOT NULL,
    distance INTEGER NOT NULL,
    status TEXT CHECK (status IN ('Available', 'Booked', 'InProgress', 'Completed')) DEFAULT 'Available',
    price DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    leg_type TEXT CHECK (leg_type IN ('EmptyLeg', 'Charter', 'Positioning')) NOT NULL,
    dynamic_pricing BOOLEAN DEFAULT FALSE,
    instant_booking BOOLEAN DEFAULT FALSE,
    special_offers JSONB,
    weather_alerts JSONB,
    demand_score DECIMAL DEFAULT 0,
    price_optimized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. PRICING_QUOTES TABLE
CREATE TABLE IF NOT EXISTS pricing_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT,
    aircraft_id UUID REFERENCES aircraft(id),
    total_price DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    price_breakdown JSONB NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    terms TEXT[] NOT NULL,
    cancellation_policy TEXT,
    competitor_comparison JSONB,
    price_match_guarantee BOOLEAN DEFAULT FALSE,
    instant_acceptance BOOLEAN DEFAULT FALSE,
    smart_contract_address TEXT,
    blockchain_verified BOOLEAN DEFAULT FALSE,
    escrow_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. CHARTER_REQUESTS TABLE
CREATE TABLE IF NOT EXISTS charter_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aircraft_id UUID REFERENCES aircraft(id),
    operator_id UUID REFERENCES operators(id),
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    departure_date DATE NOT NULL,
    departure_time TIME NOT NULL,
    return_date DATE,
    return_time TIME,
    passengers INTEGER NOT NULL,
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    company TEXT,
    special_requests TEXT,
    status TEXT CHECK (status IN ('Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    preferred_communication TEXT[] DEFAULT ARRAY['email'],
    urgency_level TEXT DEFAULT 'standard',
    budget_range TEXT,
    flexible_dates BOOLEAN DEFAULT FALSE,
    flexible_airports BOOLEAN DEFAULT FALSE,
    ai_match_score DECIMAL DEFAULT 0,
    ai_recommendations JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    transaction_type TEXT CHECK (transaction_type IN ('Payment', 'Refund', 'Chargeback', 'Fee')) NOT NULL,
    amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('Pending', 'Completed', 'Failed', 'Cancelled')) NOT NULL,
    payment_method TEXT,
    processor_name TEXT,
    processor_transaction_id TEXT,
    processor_fee DECIMAL,
    blockchain_tx_hash TEXT,
    smart_contract_address TEXT,
    gas_used TEXT,
    risk_score INTEGER,
    fraud_flags TEXT[] DEFAULT ARRAY[]::TEXT[],
    description TEXT NOT NULL,
    customer_reference TEXT,
    merchant_reference TEXT,
    initiated_date TIMESTAMP DEFAULT NOW(),
    completed_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. INVOICES TABLE
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    invoice_number TEXT UNIQUE NOT NULL,
    amount DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')) DEFAULT 'draft',
    due_date DATE NOT NULL,
    line_items JSONB NOT NULL,
    tax_amount DECIMAL DEFAULT 0,
    discount_amount DECIMAL DEFAULT 0,
    customer_info JSONB NOT NULL,
    payment_terms TEXT,
    notes TEXT,
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. MAINTENANCE_RECORDS TABLE
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aircraft_id UUID REFERENCES aircraft(id),
    maintenance_type TEXT CHECK (maintenance_type IN ('Routine', 'Progressive', 'AOG', 'Compliance')) NOT NULL,
    description TEXT NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    completed_date TIMESTAMP,
    cost DECIMAL,
    currency TEXT DEFAULT 'USD',
    facility TEXT,
    technician TEXT,
    work_orders TEXT[] DEFAULT ARRAY[]::TEXT[],
    hours_at_maintenance DECIMAL,
    cycles_at_maintenance INTEGER,
    prediction_accuracy DECIMAL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. CREW_ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS crew_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    aircraft_id UUID REFERENCES aircraft(id),
    crew_type TEXT CHECK (crew_type IN ('Captain', 'First Officer', 'Flight Attendant')) NOT NULL,
    crew_member_name TEXT NOT NULL,
    crew_member_id TEXT NOT NULL,
    license_number TEXT,
    certification_expiry DATE,
    assignment_date TIMESTAMP DEFAULT NOW(),
    status TEXT CHECK (status IN ('Assigned', 'Confirmed', 'Completed')) DEFAULT 'Assigned',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. AIRCRAFT_REVIEWS TABLE
CREATE TABLE IF NOT EXISTS aircraft_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aircraft_id UUID REFERENCES aircraft(id),
    booking_id UUID REFERENCES bookings(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    review TEXT,
    comfort_rating INTEGER CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating >= 1 AND cleanliness_rating <= 5),
    amenities_rating INTEGER CHECK (amenities_rating >= 1 AND amenities_rating <= 5),
    verified_booking BOOLEAN DEFAULT FALSE,
    helpful INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 10. OPERATOR_REVIEWS TABLE
CREATE TABLE IF NOT EXISTS operator_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operator_id UUID REFERENCES operators(id),
    booking_id UUID REFERENCES bookings(id),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title TEXT,
    review TEXT,
    service_rating INTEGER CHECK (service_rating >= 1 AND service_rating <= 5),
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    timeliness_rating INTEGER CHECK (timeliness_rating >= 1 AND timeliness_rating <= 5),
    verified_booking BOOLEAN DEFAULT FALSE,
    helpful INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 11. MARKET_ANALYTICS TABLE
CREATE TABLE IF NOT EXISTS market_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    region TEXT NOT NULL,
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL DEFAULT 0,
    average_price DECIMAL DEFAULT 0,
    utilization_rate DECIMAL DEFAULT 0,
    top_routes JSONB,
    top_aircraft JSONB,
    market_share DECIMAL DEFAULT 0,
    competitor_pricing JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(date, region)
);

-- 12. PRICE_PREDICTIONS TABLE
CREATE TABLE IF NOT EXISTS price_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aircraft_id UUID REFERENCES aircraft(id),
    route TEXT NOT NULL,
    predicted_date TIMESTAMP NOT NULL,
    predicted_price DECIMAL NOT NULL,
    confidence_score DECIMAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    demand_forecast DECIMAL NOT NULL CHECK (demand_forecast >= 0 AND demand_forecast <= 1),
    historical_pricing JSONB,
    seasonal_factors JSONB,
    weather_factors JSONB,
    event_factors JSONB,
    model_version TEXT DEFAULT '1.0',
    training_accuracy DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 13. DEMAND_FORECASTS TABLE
CREATE TABLE IF NOT EXISTS demand_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route TEXT NOT NULL,
    forecast_date TIMESTAMP NOT NULL,
    expected_bookings INTEGER NOT NULL,
    demand_intensity DECIMAL NOT NULL CHECK (demand_intensity >= 0 AND demand_intensity <= 1),
    peak_hours INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    seasonality DECIMAL NOT NULL,
    events JSONB,
    economic_indicators JSONB,
    actual_bookings INTEGER,
    prediction_accuracy DECIMAL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 14. REAL_TIME_ALERTS TABLE
CREATE TABLE IF NOT EXISTS real_time_alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type TEXT CHECK (alert_type IN ('WeatherDelay', 'MaintenanceIssue', 'PriceChange', 'FlightUpdate', 'BookingConfirmation')) NOT NULL,
    severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    affected_users TEXT[] DEFAULT ARRAY[]::TEXT[],
    affected_bookings TEXT[] DEFAULT ARRAY[]::TEXT[],
    affected_aircraft TEXT[] DEFAULT ARRAY[]::TEXT[],
    affected_routes TEXT[] DEFAULT ARRAY[]::TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    resolved_at TIMESTAMP,
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 15. NOTIFICATION_PREFERENCES TABLE
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) NOT NULL,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    push_enabled BOOLEAN DEFAULT TRUE,
    whatsapp_enabled BOOLEAN DEFAULT FALSE,
    booking_updates BOOLEAN DEFAULT TRUE,
    price_alerts BOOLEAN DEFAULT TRUE,
    weather_alerts BOOLEAN DEFAULT TRUE,
    promotions BOOLEAN DEFAULT FALSE,
    email TEXT,
    phone TEXT,
    whatsapp_number TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- CREATE PERFORMANCE INDEXES (ONLY FOR EXISTING COLUMNS)
-- Index for aircraft table using actual column names
CREATE INDEX IF NOT EXISTS idx_aircraft_category ON aircraft(category);
CREATE INDEX IF NOT EXISTS idx_aircraft_home_base ON aircraft(home_base);
CREATE INDEX IF NOT EXISTS idx_aircraft_manufacturer ON aircraft(manufacturer);
CREATE INDEX IF NOT EXISTS idx_aircraft_model ON aircraft(model);

-- Indexes for bookings table (if columns exist)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'status') THEN
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'user_id') THEN
        CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bookings' AND column_name = 'aircraft_id') THEN
        CREATE INDEX IF NOT EXISTS idx_bookings_aircraft_id ON bookings(aircraft_id);
    END IF;
END
$$;

-- Indexes for new tables
CREATE INDEX IF NOT EXISTS idx_flight_legs_departure_airport ON flight_legs(departure_airport);
CREATE INDEX IF NOT EXISTS idx_flight_legs_arrival_airport ON flight_legs(arrival_airport);
CREATE INDEX IF NOT EXISTS idx_flight_legs_status ON flight_legs(status);
CREATE INDEX IF NOT EXISTS idx_flight_legs_aircraft_id ON flight_legs(aircraft_id);

CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);

CREATE INDEX IF NOT EXISTS idx_maintenance_records_aircraft_id ON maintenance_records(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_scheduled_date ON maintenance_records(scheduled_date);

CREATE INDEX IF NOT EXISTS idx_operator_reviews_operator_id ON operator_reviews(operator_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_reviews_aircraft_id ON aircraft_reviews(aircraft_id);

CREATE INDEX IF NOT EXISTS idx_charter_requests_status ON charter_requests(status);
CREATE INDEX IF NOT EXISTS idx_charter_requests_departure_date ON charter_requests(departure_date);

CREATE INDEX IF NOT EXISTS idx_pricing_quotes_aircraft_id ON pricing_quotes(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_pricing_quotes_valid_until ON pricing_quotes(valid_until);

-- POPULATE WITH SAMPLE DATA
-- Insert sample operators (using UUIDs)
INSERT INTO operators (id, name, certificate, established, headquarters, operating_bases, fleet_size, safety_rating, insurance, certifications, contact_email, contact_phone, website, description, avg_rating, total_reviews, response_time_hours, instant_booking_enabled, ai_optimized_pricing, predictive_maintenance_enabled, smart_routing_enabled, blockchain_verified, blockchain_address, carbon_offset_program, saf_percentage) VALUES 
('550e8400-e29b-41d4-a716-446655440001', 'JetVision Charter', 'FAA Part 135', 2018, 'Teterboro, NJ', ARRAY['KTEB', 'KJFK', 'KLGA'], 12, 'ARGUS Platinum', '$100M Liability', ARRAY['ARGUS Gold', 'IS-BAO Stage 2', 'WYVERN Wingman'], 'ops@jetvision.com', '+1-201-555-0100', 'https://jetvision.com', 'Premium charter services with modern fleet', 4.8, 127, 2, true, true, true, true, true, '0x1234...5678', true, 15.5),
('550e8400-e29b-41d4-a716-446655440002', 'Elite Aviation Solutions', 'FAA Part 135', 2015, 'Van Nuys, CA', ARRAY['KVNY', 'KLAX', 'KBUR'], 18, 'ARGUS Gold', '$150M Liability', ARRAY['ARGUS Gold', 'IS-BAO Stage 3'], 'charter@eliteaviation.com', '+1-818-555-0200', 'https://eliteaviation.com', 'Luxury charter with VIP services', 4.9, 203, 1, true, true, false, true, false, NULL, true, 22.0),
('550e8400-e29b-41d4-a716-446655440003', 'Global Executive Jets', 'FAA Part 135', 2012, 'Miami, FL', ARRAY['KMIA', 'KFLL', 'KOPF'], 25, 'WYVERN Wingman', '$200M Liability', ARRAY['WYVERN Wingman', 'IS-BAO Stage 2'], 'bookings@globalexecutive.com', '+1-305-555-0300', 'https://globalexecutive.com', 'International charter specialist', 4.7, 89, 4, false, false, true, false, true, '0xabcd...ef12', false, 8.5)
ON CONFLICT (id) DO NOTHING;

-- Insert sample flight legs (using actual aircraft UUID from your database)
INSERT INTO flight_legs (id, aircraft_id, departure_airport, arrival_airport, departure_date, departure_time, arrival_date, arrival_time, flight_time, distance, status, price, currency, leg_type, dynamic_pricing, instant_booking, special_offers, weather_alerts, demand_score, price_optimized) VALUES 
('650e8400-e29b-41d4-a716-446655440001', '05c92852-911b-435d-be52-515fcf5b78fb', 'KTEB', 'KMIA', '2024-04-15', '09:00:00', '2024-04-15', '12:30:00', 3.5, 1200, 'Available', 28500.00, 'USD', 'Charter', true, true, '{"earlyBird": "10% off", "lastMinute": "15% off"}', '{"turbulence": "Light", "visibility": "Good"}', 0.75, true),
('650e8400-e29b-41d4-a716-446655440002', '05c92852-911b-435d-be52-515fcf5b78fb', 'KMIA', 'KTEB', '2024-04-16', '14:00:00', '2024-04-16', '17:00:00', 3.0, 1200, 'Available', 25200.00, 'USD', 'EmptyLeg', true, true, '{"emptyLeg": "40% off regular charter"}', '{}', 0.65, true),
('650e8400-e29b-41d4-a716-446655440003', '05c92852-911b-435d-be52-515fcf5b78fb', 'KLAX', 'KLAS', '2024-04-20', '16:30:00', '2024-04-20', '17:45:00', 1.25, 280, 'Booked', 8750.00, 'USD', 'Charter', false, false, '{}', '{"wind": "Moderate crosswinds expected"}', 0.85, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample pricing quotes
INSERT INTO pricing_quotes (id, request_id, aircraft_id, total_price, currency, price_breakdown, valid_until, terms, cancellation_policy, competitor_comparison, price_match_guarantee, instant_acceptance, smart_contract_address, blockchain_verified, escrow_enabled) VALUES 
('750e8400-e29b-41d4-a716-446655440001', 'REQ001', '05c92852-911b-435d-be52-515fcf5b78fb', 31049.00, 'USD', '{"flightHours": 3.5, "hourlyRate": 4200, "baseCost": 14700, "fuelSurcharge": 3850, "landingFees": 2400, "handlingFees": 1200, "catering": 800, "crewFees": 1500, "overnightFees": 0, "deicingFees": 0, "taxes": 2480, "discount": 0, "total": 31049}', '2024-04-10T23:59:59Z', ARRAY['Payment due 48 hours before departure', 'Cancellation allowed up to 24 hours'], 'Full refund if cancelled 24+ hours before departure', '{"averageMarketPrice": 34500, "savings": 3451, "competitorCount": 5}', true, true, '0x1234567890abcdef', true, true),
('750e8400-e29b-41d4-a716-446655440002', 'REQ002', '05c92852-911b-435d-be52-515fcf5b78fb', 25200.00, 'USD', '{"flightHours": 3.0, "hourlyRate": 3800, "baseCost": 11400, "fuelSurcharge": 2850, "landingFees": 1800, "handlingFees": 900, "catering": 600, "crewFees": 1200, "taxes": 2016, "discount": 4566, "total": 25200}', '2024-04-12T18:00:00Z', ARRAY['Empty leg special pricing', 'Subject to aircraft positioning'], 'Limited refund policy for empty leg bookings', '{"averageMarketPrice": 28800, "savings": 3600, "competitorCount": 3}', false, true, NULL, false, false)
ON CONFLICT (id) DO NOTHING;

-- Insert sample charter requests
INSERT INTO charter_requests (id, aircraft_id, operator_id, departure_airport, arrival_airport, departure_date, departure_time, passengers, contact_name, contact_email, contact_phone, company, special_requests, status, ai_match_score, ai_recommendations) VALUES
('850e8400-e29b-41d4-a716-446655440001', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'KTEB', 'KMIA', '2024-04-15', '09:00:00', 6, 'James Mitchell', 'james.mitchell@techcorp.com', '+1-555-123-4567', 'TechCorp Solutions', 'Ground transportation to hotel, dietary restrictions - vegetarian meals', 'Confirmed', 0.92, '{"alternativeAircraft": ["ACF002", "ACF003"], "costSavings": 2400, "weatherOptimization": "Departure time optimized for weather", "routeEfficiency": "Direct route recommended"}')
ON CONFLICT (id) DO NOTHING;

-- Insert notification preferences for existing users
INSERT INTO notification_preferences (id, user_id, email_enabled, sms_enabled, push_enabled, whatsapp_enabled, booking_updates, price_alerts, weather_alerts, promotions, email, phone, whatsapp_number) VALUES 
('850e8400-e29b-41d4-a716-446655440001', '1f31df2c-3dbb-4a0e-b4d8-d1cfdec56e8d', true, false, true, false, true, true, true, false, 'user@example.com', '+1-555-123-4567', NULL)
ON CONFLICT (user_id) DO NOTHING;

-- Success message
SELECT 'Complete Aviation Platform Database Created Successfully!' as status,
       'All 15 tables created with proper UUID foreign keys and correct column references' as details,
       'Ready for full Avinode, Paynode, and SchedAero integration' as ready;