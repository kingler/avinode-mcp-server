-- Migration: Create Aviation Charter System Tables
-- Description: Complete schema for Avinode, Paynode, and SchedAero integration
-- Author: Claude Code Assistant
-- Created: 2024-08-31

BEGIN;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. OPERATORS TABLE
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. FLIGHT_LEGS TABLE  
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. PRICING_QUOTES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS pricing_quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id TEXT,
    aircraft_id UUID REFERENCES aircraft(id),
    total_price DECIMAL NOT NULL,
    currency TEXT DEFAULT 'USD',
    price_breakdown JSONB NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    terms TEXT[] NOT NULL,
    cancellation_policy TEXT,
    competitor_comparison JSONB,
    price_match_guarantee BOOLEAN DEFAULT FALSE,
    instant_acceptance BOOLEAN DEFAULT FALSE,
    smart_contract_address TEXT,
    blockchain_verified BOOLEAN DEFAULT FALSE,
    escrow_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. CHARTER_REQUESTS TABLE
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. TRANSACTIONS TABLE
-- ============================================================================
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
    initiated_date TIMESTAMPTZ DEFAULT NOW(),
    completed_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. INVOICES TABLE
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. MAINTENANCE_RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aircraft_id UUID REFERENCES aircraft(id),
    maintenance_type TEXT CHECK (maintenance_type IN ('Routine', 'Progressive', 'AOG', 'Compliance')) NOT NULL,
    description TEXT NOT NULL,
    scheduled_date TIMESTAMPTZ NOT NULL,
    completed_date TIMESTAMPTZ,
    cost DECIMAL,
    currency TEXT DEFAULT 'USD',
    facility TEXT,
    technician TEXT,
    work_orders TEXT[] DEFAULT ARRAY[]::TEXT[],
    hours_at_maintenance DECIMAL,
    cycles_at_maintenance INTEGER,
    prediction_accuracy DECIMAL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. CREW_ASSIGNMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS crew_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES bookings(id),
    aircraft_id UUID REFERENCES aircraft(id),
    crew_type TEXT CHECK (crew_type IN ('Captain', 'First Officer', 'Flight Attendant')) NOT NULL,
    crew_member_name TEXT NOT NULL,
    crew_member_id TEXT NOT NULL,
    license_number TEXT,
    certification_expiry DATE,
    assignment_date TIMESTAMPTZ DEFAULT NOW(),
    status TEXT CHECK (status IN ('Assigned', 'Confirmed', 'Completed')) DEFAULT 'Assigned',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. AIRCRAFT_REVIEWS TABLE
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. OPERATOR_REVIEWS TABLE
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11. MARKET_ANALYTICS TABLE
-- ============================================================================
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(date, region)
);

-- ============================================================================
-- 12. PRICE_PREDICTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS price_predictions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    aircraft_id UUID REFERENCES aircraft(id),
    route TEXT NOT NULL,
    predicted_date TIMESTAMPTZ NOT NULL,
    predicted_price DECIMAL NOT NULL,
    confidence_score DECIMAL NOT NULL CHECK (confidence_score >= 0 AND confidence_score <= 1),
    demand_forecast DECIMAL NOT NULL CHECK (demand_forecast >= 0 AND demand_forecast <= 1),
    historical_pricing JSONB,
    seasonal_factors JSONB,
    weather_factors JSONB,
    event_factors JSONB,
    model_version TEXT DEFAULT '1.0',
    training_accuracy DECIMAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 13. DEMAND_FORECASTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS demand_forecasts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route TEXT NOT NULL,
    forecast_date TIMESTAMPTZ NOT NULL,
    expected_bookings INTEGER NOT NULL,
    demand_intensity DECIMAL NOT NULL CHECK (demand_intensity >= 0 AND demand_intensity <= 1),
    peak_hours INTEGER[] DEFAULT ARRAY[]::INTEGER[],
    seasonality DECIMAL NOT NULL,
    events JSONB,
    economic_indicators JSONB,
    actual_bookings INTEGER,
    prediction_accuracy DECIMAL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 14. REAL_TIME_ALERTS TABLE
-- ============================================================================
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
    resolved_at TIMESTAMPTZ,
    sent_via_email BOOLEAN DEFAULT FALSE,
    sent_via_sms BOOLEAN DEFAULT FALSE,
    sent_via_push BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 15. NOTIFICATION_PREFERENCES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT UNIQUE NOT NULL,
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- CREATE PERFORMANCE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_aircraft_category ON aircraft(category);
CREATE INDEX IF NOT EXISTS idx_aircraft_home_base ON aircraft(home_base);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_aircraft_id ON bookings(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_flight_legs_departure_airport ON flight_legs(departure_airport);
CREATE INDEX IF NOT EXISTS idx_flight_legs_arrival_airport ON flight_legs(arrival_airport);
CREATE INDEX IF NOT EXISTS idx_flight_legs_status ON flight_legs(status);
CREATE INDEX IF NOT EXISTS idx_transactions_booking_id ON transactions(booking_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_records_aircraft_id ON maintenance_records(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_operator_reviews_operator_id ON operator_reviews(operator_id);
CREATE INDEX IF NOT EXISTS idx_aircraft_reviews_aircraft_id ON aircraft_reviews(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_charter_requests_status ON charter_requests(status);
CREATE INDEX IF NOT EXISTS idx_charter_requests_departure_date ON charter_requests(departure_date);
CREATE INDEX IF NOT EXISTS idx_pricing_quotes_aircraft_id ON pricing_quotes(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_pricing_quotes_valid_until ON pricing_quotes(valid_until);
CREATE INDEX IF NOT EXISTS idx_crew_assignments_booking_id ON crew_assignments(booking_id);
CREATE INDEX IF NOT EXISTS idx_crew_assignments_aircraft_id ON crew_assignments(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_market_analytics_date_region ON market_analytics(date, region);
CREATE INDEX IF NOT EXISTS idx_price_predictions_aircraft_id ON price_predictions(aircraft_id);
CREATE INDEX IF NOT EXISTS idx_price_predictions_predicted_date ON price_predictions(predicted_date);
CREATE INDEX IF NOT EXISTS idx_real_time_alerts_alert_type ON real_time_alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_real_time_alerts_is_active ON real_time_alerts(is_active);

COMMIT;