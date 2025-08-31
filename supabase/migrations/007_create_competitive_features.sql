-- NextAvinode Competitive Features Migration
-- Migration 007: Advanced features to compete with Avinode

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geospatial queries
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- Create additional enum types for competitive features
CREATE TYPE alert_severity AS ENUM ('Low', 'Medium', 'High', 'Critical');
CREATE TYPE alert_type AS ENUM ('WeatherDelay', 'MaintenanceIssue', 'PriceChange', 'AircraftAvailable', 'BookingConfirmed', 'PaymentDue');
CREATE TYPE communication_channel AS ENUM ('email', 'sms', 'whatsapp', 'push', 'call');
CREATE TYPE pricing_strategy AS ENUM ('Fixed', 'Dynamic', 'Competitive', 'Premium', 'Promotional');

-- ===================================
-- ENHANCED OPERATORS WITH COMPETITIVE FEATURES
-- ===================================
ALTER TABLE operators ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS response_time_hours INTEGER DEFAULT 24;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS instant_booking_enabled BOOLEAN DEFAULT false;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS ai_optimized_pricing BOOLEAN DEFAULT false;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS predictive_maintenance_enabled BOOLEAN DEFAULT false;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS smart_routing_enabled BOOLEAN DEFAULT false;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS blockchain_verified BOOLEAN DEFAULT false;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS blockchain_address VARCHAR(255);
ALTER TABLE operators ADD COLUMN IF NOT EXISTS carbon_offset_program BOOLEAN DEFAULT false;
ALTER TABLE operators ADD COLUMN IF NOT EXISTS saf_percentage DECIMAL(5,2) DEFAULT 0;

-- Add indexes for new operator features
CREATE INDEX idx_operators_rating ON operators(avg_rating);
CREATE INDEX idx_operators_response_time ON operators(response_time_hours);
CREATE INDEX idx_operators_instant_booking ON operators(instant_booking_enabled);
CREATE INDEX idx_operators_blockchain ON operators(blockchain_verified);

-- ===================================
-- ENHANCED AIRCRAFT WITH COMPETITIVE FEATURES
-- ===================================
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(3,2) DEFAULT 0;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS total_flights INTEGER DEFAULT 0;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS last_maintenance_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS next_maintenance_date TIMESTAMP WITH TIME ZONE;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS predicted_availability JSONB;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS dynamic_pricing_enabled BOOLEAN DEFAULT false;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS current_dynamic_rate DECIMAL(10,2);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS real_time_location JSONB;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS fuel_level DECIMAL(5,2);
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS maintenance_status JSONB;
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS fuel_efficiency_rating VARCHAR(1) CHECK (fuel_efficiency_rating IN ('A', 'B', 'C', 'D', 'E'));
ALTER TABLE aircraft ADD COLUMN IF NOT EXISTS carbon_footprint_per_hour DECIMAL(8,4);

-- Add indexes for aircraft enhancements
CREATE INDEX idx_aircraft_dynamic_pricing ON aircraft(dynamic_pricing_enabled);
CREATE INDEX idx_aircraft_fuel_efficiency ON aircraft(fuel_efficiency_rating);
CREATE INDEX idx_aircraft_maintenance_dates ON aircraft(last_maintenance_date, next_maintenance_date);

-- ===================================
-- ENHANCED FLIGHT LEGS WITH COMPETITIVE FEATURES
-- ===================================
ALTER TABLE flight_legs ADD COLUMN IF NOT EXISTS dynamic_pricing BOOLEAN DEFAULT false;
ALTER TABLE flight_legs ADD COLUMN IF NOT EXISTS instant_booking BOOLEAN DEFAULT false;
ALTER TABLE flight_legs ADD COLUMN IF NOT EXISTS special_offers JSONB;
ALTER TABLE flight_legs ADD COLUMN IF NOT EXISTS weather_alerts JSONB;
ALTER TABLE flight_legs ADD COLUMN IF NOT EXISTS demand_score DECIMAL(3,2) DEFAULT 0;
ALTER TABLE flight_legs ADD COLUMN IF NOT EXISTS price_optimized BOOLEAN DEFAULT false;

-- Add indexes for flight leg enhancements
CREATE INDEX idx_flight_legs_dynamic_pricing ON flight_legs(dynamic_pricing);
CREATE INDEX idx_flight_legs_instant_booking ON flight_legs(instant_booking);
CREATE INDEX idx_flight_legs_demand_score ON flight_legs(demand_score);

-- ===================================
-- CUSTOMER REVIEWS AND RATINGS
-- ===================================
CREATE TABLE operator_reviews (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    operator_id VARCHAR(50) NOT NULL REFERENCES operators(id) ON DELETE CASCADE,
    booking_id VARCHAR(50), -- Optional link to booking
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    review TEXT,
    
    -- Detailed ratings
    service_rating INTEGER CHECK (service_rating BETWEEN 1 AND 5),
    communication_rating INTEGER CHECK (communication_rating BETWEEN 1 AND 5),
    value_rating INTEGER CHECK (value_rating BETWEEN 1 AND 5),
    timeliness_rating INTEGER CHECK (timeliness_rating BETWEEN 1 AND 5),
    
    -- Verification and engagement
    verified_booking BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    
    -- Moderation
    is_flagged BOOLEAN DEFAULT false,
    flag_reason VARCHAR(255),
    is_approved BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_review_email CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE aircraft_reviews (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    aircraft_id VARCHAR(50) NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
    booking_id VARCHAR(50), -- Optional link to booking
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    title VARCHAR(255),
    review TEXT,
    
    -- Detailed ratings
    comfort_rating INTEGER CHECK (comfort_rating BETWEEN 1 AND 5),
    cleanliness_rating INTEGER CHECK (cleanliness_rating BETWEEN 1 AND 5),
    amenities_rating INTEGER CHECK (amenities_rating BETWEEN 1 AND 5),
    
    verified_booking BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    is_flagged BOOLEAN DEFAULT false,
    flag_reason VARCHAR(255),
    is_approved BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_aircraft_review_email CHECK (customer_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ===================================
-- MARKET ANALYTICS AND COMPETITIVE INTELLIGENCE
-- ===================================
CREATE TABLE market_analytics (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    analysis_date DATE NOT NULL,
    region VARCHAR(100) NOT NULL,
    
    -- Market metrics
    total_bookings INTEGER DEFAULT 0,
    total_revenue DECIMAL(15,2) DEFAULT 0,
    average_price DECIMAL(10,2) DEFAULT 0,
    utilization_rate DECIMAL(5,4) DEFAULT 0, -- 0-1
    
    -- Popular routes and aircraft
    top_routes JSONB, -- Array of {from, to, count, avgPrice}
    top_aircraft_categories JSONB, -- Array of {category, count, avgPrice}
    
    -- Competitive intelligence
    our_market_share DECIMAL(5,4) DEFAULT 0, -- 0-1
    competitor_pricing JSONB, -- Average competitor pricing by route
    price_competitiveness_score DECIMAL(3,2) DEFAULT 0, -- 0-1
    
    -- Demand patterns
    peak_booking_hours INTEGER[], -- Hours of day with most bookings
    seasonal_demand_factor DECIMAL(3,2) DEFAULT 1.0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(analysis_date, region)
);

CREATE TABLE user_behavior_analytics (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    session_id VARCHAR(100) NOT NULL,
    user_id VARCHAR(100), -- If logged in
    
    -- User journey
    entry_point VARCHAR(100), -- Search, Direct, Referral, Social, Email
    referral_source VARCHAR(255),
    utm_parameters JSONB,
    search_criteria JSONB,
    viewed_aircraft VARCHAR(50)[],
    quotes_requested INTEGER DEFAULT 0,
    booking_completed BOOLEAN DEFAULT false,
    conversion_value DECIMAL(12,2),
    
    -- Engagement metrics
    session_duration_seconds INTEGER,
    page_views INTEGER DEFAULT 1,
    bounce_rate BOOLEAN DEFAULT true,
    scroll_depth_percentage INTEGER DEFAULT 0,
    
    -- Device and location
    user_agent TEXT,
    ip_address INET,
    country VARCHAR(3), -- ISO code
    city VARCHAR(100),
    device_type VARCHAR(50), -- Desktop, Mobile, Tablet
    browser VARCHAR(50),
    operating_system VARCHAR(50),
    
    -- A/B Testing
    experiment_groups JSONB, -- {"pricing_test": "variant_a", "ui_test": "variant_b"}
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================
-- AI/ML PREDICTIONS AND OPTIMIZATION
-- ===================================
CREATE TABLE price_predictions (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    aircraft_id VARCHAR(50) REFERENCES aircraft(id) ON DELETE CASCADE,
    route VARCHAR(20) NOT NULL, -- "KJFK-KLAX"
    prediction_date DATE NOT NULL,
    
    -- Predictions
    predicted_price DECIMAL(10,2) NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL, -- 0-1
    demand_forecast DECIMAL(3,2) NOT NULL, -- 0-1
    
    -- Contributing factors
    historical_pricing JSONB,
    seasonal_factors JSONB,
    weather_factors JSONB,
    event_factors JSONB, -- Local events
    economic_indicators JSONB,
    
    -- Model metadata
    model_version VARCHAR(20) DEFAULT '1.0',
    training_accuracy DECIMAL(3,2),
    feature_importance JSONB,
    
    -- Accuracy tracking (filled after prediction period)
    actual_price DECIMAL(10,2),
    actual_bookings INTEGER,
    prediction_accuracy DECIMAL(3,2),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(aircraft_id, route, prediction_date)
);

CREATE TABLE demand_forecasts (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    route VARCHAR(20) NOT NULL, -- "KJFK-KLAX"
    forecast_date DATE NOT NULL,
    forecast_horizon_days INTEGER DEFAULT 30, -- How many days ahead
    
    -- Demand predictions
    expected_bookings INTEGER NOT NULL,
    demand_intensity DECIMAL(3,2) NOT NULL, -- 0-1
    peak_demand_hours INTEGER[], -- Hours of day
    confidence_interval JSONB, -- {"lower": 5, "upper": 15}
    
    -- Contributing factors
    seasonality_factor DECIMAL(3,2) DEFAULT 1.0,
    events_impact JSONB, -- Local events driving demand
    economic_impact DECIMAL(3,2) DEFAULT 1.0,
    weather_impact DECIMAL(3,2) DEFAULT 1.0,
    
    -- Accuracy tracking
    actual_bookings INTEGER,
    forecast_accuracy DECIMAL(3,2),
    mean_absolute_error DECIMAL(8,4),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(route, forecast_date, forecast_horizon_days)
);

-- ===================================
-- REAL-TIME ALERTS AND NOTIFICATIONS
-- ===================================
CREATE TABLE real_time_alerts (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    alert_type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Rich content
    action_url VARCHAR(500), -- Deep link or web URL
    image_url VARCHAR(500),
    icon VARCHAR(100),
    
    -- Targeting
    affected_users VARCHAR(100)[], -- User IDs or ["all"]
    affected_bookings VARCHAR(50)[],
    affected_aircraft VARCHAR(50)[],
    affected_routes VARCHAR(20)[], -- Route codes like "KJFK-KLAX"
    affected_operators VARCHAR(50)[],
    
    -- Geographic targeting
    affected_regions VARCHAR(100)[],
    affected_airports VARCHAR(10)[], -- ICAO codes
    
    -- Status and lifecycle
    is_active BOOLEAN DEFAULT true,
    auto_resolve BOOLEAN DEFAULT false,
    resolve_condition JSONB, -- Conditions for auto-resolution
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by VARCHAR(100),
    
    -- Delivery tracking
    channels_used communication_channel[],
    total_recipients INTEGER DEFAULT 0,
    successful_deliveries INTEGER DEFAULT 0,
    failed_deliveries INTEGER DEFAULT 0,
    
    -- Engagement metrics
    click_through_rate DECIMAL(5,4) DEFAULT 0,
    total_clicks INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_severity_type CHECK (
        (severity = 'Critical' AND alert_type IN ('MaintenanceIssue', 'WeatherDelay')) OR
        severity IN ('Low', 'Medium', 'High')
    )
);

CREATE TABLE notification_preferences (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    user_id VARCHAR(100) UNIQUE NOT NULL,
    
    -- Communication preferences
    email_enabled BOOLEAN DEFAULT true,
    sms_enabled BOOLEAN DEFAULT false,
    push_enabled BOOLEAN DEFAULT true,
    whatsapp_enabled BOOLEAN DEFAULT false,
    
    -- Notification types
    booking_updates BOOLEAN DEFAULT true,
    price_alerts BOOLEAN DEFAULT true,
    weather_alerts BOOLEAN DEFAULT true,
    maintenance_alerts BOOLEAN DEFAULT false,
    promotional_offers BOOLEAN DEFAULT false,
    market_insights BOOLEAN DEFAULT false,
    
    -- Frequency preferences
    immediate_alerts BOOLEAN DEFAULT true,
    daily_digest BOOLEAN DEFAULT false,
    weekly_summary BOOLEAN DEFAULT false,
    
    -- Contact information
    email VARCHAR(255),
    phone VARCHAR(20),
    whatsapp_number VARCHAR(20),
    push_token VARCHAR(500), -- For mobile push notifications
    
    -- Quiet hours
    quiet_hours_start TIME DEFAULT '22:00:00',
    quiet_hours_end TIME DEFAULT '08:00:00',
    timezone VARCHAR(50) DEFAULT 'UTC',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_user_email CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- ===================================
-- DYNAMIC PRICING ENGINE
-- ===================================
CREATE TABLE dynamic_pricing_rules (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    rule_name VARCHAR(255) NOT NULL,
    aircraft_category VARCHAR(100), -- Apply to specific category or NULL for all
    route_pattern VARCHAR(100), -- Regex pattern for routes, or NULL for all
    
    -- Rule conditions
    demand_threshold_low DECIMAL(3,2) DEFAULT 0.3, -- Below this = price decrease
    demand_threshold_high DECIMAL(3,2) DEFAULT 0.7, -- Above this = price increase
    
    -- Pricing adjustments
    low_demand_discount_pct DECIMAL(5,2) DEFAULT 10.00, -- Percentage discount
    high_demand_markup_pct DECIMAL(5,2) DEFAULT 25.00, -- Percentage markup
    max_discount_pct DECIMAL(5,2) DEFAULT 30.00, -- Maximum total discount
    max_markup_pct DECIMAL(5,2) DEFAULT 100.00, -- Maximum total markup
    
    -- Time-based factors
    advance_booking_discount JSONB, -- {"30_days": 5, "60_days": 10, "90_days": 15}
    seasonal_multipliers JSONB, -- {"summer": 1.2, "winter": 0.9, "holidays": 1.5}
    day_of_week_multipliers JSONB, -- {"monday": 0.9, "friday": 1.2}
    
    -- Market factors
    competitor_price_matching BOOLEAN DEFAULT false,
    competitor_undercut_pct DECIMAL(5,2) DEFAULT 2.00, -- Undercut by %
    
    -- Rule status
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 100, -- Lower number = higher priority
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    
    CONSTRAINT valid_thresholds CHECK (demand_threshold_low < demand_threshold_high),
    CONSTRAINT valid_percentages CHECK (
        low_demand_discount_pct >= 0 AND high_demand_markup_pct >= 0 AND
        max_discount_pct >= 0 AND max_markup_pct >= 0
    )
);

CREATE TABLE pricing_adjustments_log (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    aircraft_id VARCHAR(50) NOT NULL REFERENCES aircraft(id) ON DELETE CASCADE,
    flight_leg_id VARCHAR(50) REFERENCES flight_legs(id) ON DELETE CASCADE,
    
    -- Pricing details
    original_price DECIMAL(10,2) NOT NULL,
    adjusted_price DECIMAL(10,2) NOT NULL,
    adjustment_percentage DECIMAL(6,3) NOT NULL, -- Can be negative
    
    -- Reason for adjustment
    adjustment_reason VARCHAR(255) NOT NULL, -- Dynamic, Competitive, Promotional, Manual
    triggering_rule_id VARCHAR(50) REFERENCES dynamic_pricing_rules(id),
    
    -- Market conditions at time of adjustment
    demand_score DECIMAL(3,2),
    competitor_average_price DECIMAL(10,2),
    booking_lead_time_days INTEGER,
    
    -- Effectiveness tracking
    bookings_after_adjustment INTEGER DEFAULT 0,
    revenue_impact DECIMAL(12,2) DEFAULT 0,
    conversion_rate DECIMAL(5,4),
    
    adjusted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    adjusted_by VARCHAR(100), -- System or User ID
    
    CONSTRAINT valid_price_adjustment CHECK (original_price > 0 AND adjusted_price > 0)
);

-- ===================================
-- BLOCKCHAIN INTEGRATION
-- ===================================
CREATE TABLE blockchain_transactions (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    booking_id VARCHAR(50) REFERENCES bookings(id) ON DELETE CASCADE,
    transaction_hash VARCHAR(255) NOT NULL UNIQUE,
    block_number BIGINT,
    
    -- Smart contract details
    contract_address VARCHAR(255) NOT NULL,
    contract_function VARCHAR(100) NOT NULL, -- createBooking, processPayment, etc.
    gas_used BIGINT,
    gas_price BIGINT,
    transaction_fee DECIMAL(18,8), -- In ETH or other cryptocurrency
    
    -- Transaction details
    blockchain_network VARCHAR(50) NOT NULL, -- Ethereum, Polygon, etc.
    status VARCHAR(50) DEFAULT 'Pending', -- Pending, Confirmed, Failed
    confirmation_count INTEGER DEFAULT 0,
    
    -- Data stored on blockchain (IPFS hashes)
    booking_data_hash VARCHAR(255), -- IPFS hash of booking details
    payment_proof_hash VARCHAR(255), -- IPFS hash of payment proof
    
    -- Verification
    is_verified BOOLEAN DEFAULT false,
    verification_timestamp TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===================================
-- ENHANCED INDEXES
-- ===================================

-- Review tables
CREATE INDEX idx_operator_reviews_operator ON operator_reviews(operator_id);
CREATE INDEX idx_operator_reviews_rating ON operator_reviews(rating);
CREATE INDEX idx_operator_reviews_verified ON operator_reviews(verified_booking);
CREATE INDEX idx_aircraft_reviews_aircraft ON aircraft_reviews(aircraft_id);
CREATE INDEX idx_aircraft_reviews_rating ON aircraft_reviews(rating);

-- Analytics tables
CREATE INDEX idx_market_analytics_date_region ON market_analytics(analysis_date, region);
CREATE INDEX idx_user_behavior_session ON user_behavior_analytics(session_id);
CREATE INDEX idx_user_behavior_user ON user_behavior_analytics(user_id);
CREATE INDEX idx_user_behavior_conversion ON user_behavior_analytics(booking_completed);

-- AI/ML tables
CREATE INDEX idx_price_predictions_aircraft_route ON price_predictions(aircraft_id, route);
CREATE INDEX idx_price_predictions_date ON price_predictions(prediction_date);
CREATE INDEX idx_demand_forecasts_route_date ON demand_forecasts(route, forecast_date);

-- Real-time features
CREATE INDEX idx_real_time_alerts_active ON real_time_alerts(is_active);
CREATE INDEX idx_real_time_alerts_severity ON real_time_alerts(severity, alert_type);
CREATE INDEX idx_notification_preferences_user ON notification_preferences(user_id);

-- Dynamic pricing
CREATE INDEX idx_dynamic_pricing_rules_active ON dynamic_pricing_rules(is_active, priority);
CREATE INDEX idx_pricing_adjustments_aircraft ON pricing_adjustments_log(aircraft_id);
CREATE INDEX idx_pricing_adjustments_date ON pricing_adjustments_log(adjusted_at);

-- Blockchain
CREATE INDEX idx_blockchain_transactions_booking ON blockchain_transactions(booking_id);
CREATE INDEX idx_blockchain_transactions_hash ON blockchain_transactions(transaction_hash);
CREATE INDEX idx_blockchain_transactions_status ON blockchain_transactions(status);

-- Full-text search indexes
CREATE INDEX idx_operators_search ON operators USING gin((name || ' ' || description) gin_trgm_ops);
CREATE INDEX idx_aircraft_search ON aircraft USING gin((model || ' ' || manufacturer) gin_trgm_ops);

-- Geospatial indexes (if using PostGIS for location-based features)
-- CREATE INDEX idx_aircraft_location ON aircraft USING gist(real_time_location);
-- CREATE INDEX idx_user_behavior_location ON user_behavior_analytics USING gist(st_point(longitude, latitude));

-- ===================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- ===================================

-- Update aircraft ratings when new reviews are added
CREATE OR REPLACE FUNCTION update_aircraft_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE aircraft 
    SET avg_rating = (
        SELECT AVG(rating)::NUMERIC(3,2) 
        FROM aircraft_reviews 
        WHERE aircraft_id = NEW.aircraft_id AND is_approved = true
    )
    WHERE id = NEW.aircraft_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_aircraft_rating
    AFTER INSERT OR UPDATE ON aircraft_reviews
    FOR EACH ROW EXECUTE FUNCTION update_aircraft_rating();

-- Update operator ratings when new reviews are added
CREATE OR REPLACE FUNCTION update_operator_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE operators 
    SET avg_rating = (
        SELECT AVG(rating)::NUMERIC(3,2) 
        FROM operator_reviews 
        WHERE operator_id = NEW.operator_id AND is_approved = true
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM operator_reviews 
        WHERE operator_id = NEW.operator_id AND is_approved = true
    )
    WHERE id = NEW.operator_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_operator_rating
    AFTER INSERT OR UPDATE ON operator_reviews
    FOR EACH ROW EXECUTE FUNCTION update_operator_rating();

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_operator_reviews_updated_at 
    BEFORE UPDATE ON operator_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_aircraft_reviews_updated_at 
    BEFORE UPDATE ON aircraft_reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_real_time_alerts_updated_at 
    BEFORE UPDATE ON real_time_alerts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at 
    BEFORE UPDATE ON notification_preferences 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dynamic_pricing_rules_updated_at 
    BEFORE UPDATE ON dynamic_pricing_rules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blockchain_transactions_updated_at 
    BEFORE UPDATE ON blockchain_transactions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- COMMENTS FOR DOCUMENTATION
-- ===================================

COMMENT ON TABLE operator_reviews IS 'Customer reviews and ratings for charter operators';
COMMENT ON TABLE aircraft_reviews IS 'Customer reviews and ratings for specific aircraft';
COMMENT ON TABLE market_analytics IS 'Daily market analysis and competitive intelligence';
COMMENT ON TABLE user_behavior_analytics IS 'User journey and behavior tracking for optimization';
COMMENT ON TABLE price_predictions IS 'AI-generated price predictions for dynamic pricing';
COMMENT ON TABLE demand_forecasts IS 'AI-generated demand forecasts for capacity planning';
COMMENT ON TABLE real_time_alerts IS 'System-wide alerts and notifications';
COMMENT ON TABLE notification_preferences IS 'User preferences for communications';
COMMENT ON TABLE dynamic_pricing_rules IS 'Rules engine for automatic price adjustments';
COMMENT ON TABLE pricing_adjustments_log IS 'Historical log of all price adjustments';
COMMENT ON TABLE blockchain_transactions IS 'Blockchain transaction records for transparency';

COMMENT ON COLUMN price_predictions.confidence_score IS 'AI model confidence in prediction (0-1)';
COMMENT ON COLUMN demand_forecasts.demand_intensity IS 'Predicted demand intensity (0=low, 1=high)';
COMMENT ON COLUMN real_time_alerts.auto_resolve IS 'Whether alert should auto-resolve based on conditions';
COMMENT ON COLUMN dynamic_pricing_rules.priority IS 'Rule priority (lower number = higher priority)';
COMMENT ON COLUMN blockchain_transactions.confirmation_count IS 'Number of blockchain confirmations received';