-- NextAvinode Competitive Platform - Enhanced Seed Data
-- Migration 008: Seed data showcasing competitive advantages

-- ===================================
-- ENHANCED OPERATOR DATA WITH COMPETITIVE FEATURES
-- ===================================

-- Update existing operators with competitive features
UPDATE operators SET
    avg_rating = 4.8,
    total_reviews = 127,
    response_time_hours = 2,
    instant_booking_enabled = true,
    ai_optimized_pricing = true,
    predictive_maintenance_enabled = true,
    smart_routing_enabled = true,
    blockchain_verified = true,
    blockchain_address = '0x1234567890abcdef1234567890abcdef12345678',
    carbon_offset_program = true,
    saf_percentage = 25.50
WHERE id = 'op-001';

UPDATE operators SET
    avg_rating = 4.6,
    total_reviews = 89,
    response_time_hours = 1,
    instant_booking_enabled = true,
    ai_optimized_pricing = true,
    predictive_maintenance_enabled = false,
    smart_routing_enabled = true,
    blockchain_verified = true,
    blockchain_address = '0xabcdef1234567890abcdef1234567890abcdef12',
    carbon_offset_program = false,
    saf_percentage = 15.25
WHERE id = 'op-002';

UPDATE operators SET
    avg_rating = 4.9,
    total_reviews = 203,
    response_time_hours = 1,
    instant_booking_enabled = true,
    ai_optimized_pricing = true,
    predictive_maintenance_enabled = true,
    smart_routing_enabled = true,
    blockchain_verified = true,
    blockchain_address = '0x9876543210fedcba9876543210fedcba98765432',
    carbon_offset_program = true,
    saf_percentage = 40.75
WHERE id = 'op-003';

-- ===================================
-- ENHANCED AIRCRAFT DATA WITH COMPETITIVE FEATURES
-- ===================================

-- Update existing aircraft with competitive features
UPDATE aircraft SET
    avg_rating = 4.7,
    total_flights = 1247,
    last_maintenance_date = '2024-01-15 10:00:00+00',
    next_maintenance_date = '2024-04-15 10:00:00+00',
    predicted_availability = '{"next_7_days": [0.95, 0.90, 0.85, 0.92, 0.88, 0.93, 0.89], "confidence": 0.87}',
    dynamic_pricing_enabled = true,
    current_dynamic_rate = 7250.00,
    real_time_location = '{"latitude": 40.6413, "longitude": -73.7781, "altitude": 0, "last_updated": "2024-01-20T15:30:00Z"}',
    fuel_level = 87.5,
    maintenance_status = '{"engine_hours": 2847.3, "cycles": 1891, "next_inspection": "2024-02-15", "status": "green"}',
    fuel_efficiency_rating = 'A',
    carbon_footprint_per_hour = 2.34
WHERE id = 'ac-001';

UPDATE aircraft SET
    avg_rating = 4.9,
    total_flights = 892,
    last_maintenance_date = '2024-01-10 14:00:00+00',
    next_maintenance_date = '2024-04-10 14:00:00+00',
    predicted_availability = '{"next_7_days": [0.92, 0.94, 0.88, 0.96, 0.91, 0.89, 0.95], "confidence": 0.91}',
    dynamic_pricing_enabled = true,
    current_dynamic_rate = 12500.00,
    real_time_location = '{"latitude": 34.0522, "longitude": -118.2437, "altitude": 0, "last_updated": "2024-01-20T15:30:00Z"}',
    fuel_level = 92.1,
    maintenance_status = '{"engine_hours": 1564.7, "cycles": 1023, "next_inspection": "2024-03-01", "status": "green"}',
    fuel_efficiency_rating = 'A',
    carbon_footprint_per_hour = 3.12
WHERE id = 'ac-002';

UPDATE aircraft SET
    avg_rating = 4.5,
    total_flights = 1543,
    last_maintenance_date = '2024-01-05 09:00:00+00',
    next_maintenance_date = '2024-04-05 09:00:00+00',
    predicted_availability = '{"next_7_days": [0.88, 0.91, 0.93, 0.87, 0.94, 0.90, 0.92], "confidence": 0.83}',
    dynamic_pricing_enabled = false,
    current_dynamic_rate = NULL,
    real_time_location = '{"latitude": 25.7617, "longitude": -80.1918, "altitude": 0, "last_updated": "2024-01-20T15:30:00Z"}',
    fuel_level = 78.3,
    maintenance_status = '{"engine_hours": 3421.8, "cycles": 2156, "next_inspection": "2024-02-20", "status": "yellow"}',
    fuel_efficiency_rating = 'B',
    carbon_footprint_per_hour = 4.87
WHERE id = 'ac-003';

-- ===================================
-- ENHANCED FLIGHT LEGS WITH COMPETITIVE FEATURES
-- ===================================

UPDATE flight_legs SET
    dynamic_pricing = true,
    instant_booking = true,
    special_offers = '{"early_bird": {"discount": 15, "valid_until": "2024-02-15"}, "weekend_special": {"discount": 10}}',
    weather_alerts = '{"conditions": "Clear", "visibility": "10+ miles", "wind": "Light", "last_updated": "2024-01-20T15:00:00Z"}',
    demand_score = 0.78,
    price_optimized = true
WHERE id = 'fl-001';

UPDATE flight_legs SET
    dynamic_pricing = true,
    instant_booking = false,
    special_offers = '{"luxury_upgrade": {"included": ["champagne", "gourmet_catering", "ground_transport"]}}',
    weather_alerts = '{"conditions": "Partly Cloudy", "visibility": "8 miles", "wind": "Moderate", "last_updated": "2024-01-20T15:00:00Z"}',
    demand_score = 0.65,
    price_optimized = true
WHERE id = 'fl-002';

-- ===================================
-- CUSTOMER REVIEWS AND RATINGS
-- ===================================

-- Operator Reviews
INSERT INTO operator_reviews (id, operator_id, customer_name, customer_email, rating, title, review, service_rating, communication_rating, value_rating, timeliness_rating, verified_booking, helpful_votes) VALUES
('or-001', 'op-001', 'Sarah Johnson', 'sarah.johnson@email.com', 5, 'Outstanding Service!', 'JetVision Elite exceeded all expectations. The AI-powered booking was seamless, and the predictive maintenance gave us complete confidence. The carbon offset program is a fantastic touch for environmentally conscious travelers.', 5, 5, 4, 5, true, 23),
('or-002', 'op-001', 'Michael Chen', 'michael.chen@email.com', 4, 'Great Technology Integration', 'Love the blockchain verification and real-time tracking. The smart routing saved us 30 minutes on our LA-Vegas trip. Only minor issue was the dynamic pricing changed while we were deciding.', 4, 5, 4, 4, true, 15),
('or-003', 'op-002', 'Emily Rodriguez', 'emily.rodriguez@email.com', 5, 'Lightning Fast Response', '1-hour response time is incredible! The instant booking feature worked flawlessly. The crew was professional and the aircraft was immaculate.', 5, 5, 5, 5, true, 31),
('or-004', 'op-003', 'David Park', 'david.park@email.com', 5, 'Premium Experience', 'Skyline Premium delivers exactly what they promise. The 40%+ SAF usage shows real commitment to sustainability. The predictive maintenance transparency is refreshing.', 5, 4, 5, 5, true, 27),
('or-005', 'op-001', 'Jennifer Walsh', 'jennifer.walsh@email.com', 4, 'Solid Choice', 'Good overall experience. The AI pricing optimization seems fair, and the blockchain payment was surprisingly smooth. Would definitely book again.', 4, 4, 4, 4, true, 8);

-- Aircraft Reviews  
INSERT INTO aircraft_reviews (id, aircraft_id, customer_name, customer_email, rating, title, review, comfort_rating, cleanliness_rating, amenities_rating, verified_booking, helpful_votes) VALUES
('ar-001', 'ac-001', 'Robert Taylor', 'robert.taylor@email.com', 5, 'Perfect Light Jet', 'Citation Mustang was in pristine condition. The fuel efficiency rating of A is evident in the smooth, quiet flight. Real-time location tracking gave my family peace of mind.', 5, 5, 4, true, 19),
('ar-002', 'ac-002', 'Lisa Thompson', 'lisa.thompson@email.com', 5, 'Luxury Redefined', 'Gulfstream G280 is absolutely stunning. Every amenity you could want. The predictive maintenance status was transparent and reassuring. Worth every penny.', 5, 5, 5, true, 34),
('ar-003', 'ac-003', 'Mark Stevens', 'mark.stevens@email.com', 4, 'Reliable Workhorse', 'Global Express 6000 handled our long-haul flight beautifully. Some wear showing but well-maintained. The maintenance transparency is a huge plus.', 4, 4, 5, true, 12),
('ar-004', 'ac-001', 'Amanda Davis', 'amanda.davis@email.com', 5, 'Tech-Forward Flying', 'The IoT integration showing real-time fuel levels and maintenance data is incredible. Felt like flying in the future!', 5, 5, 4, true, 22);

-- ===================================
-- MARKET ANALYTICS DATA
-- ===================================

INSERT INTO market_analytics (id, analysis_date, region, total_bookings, total_revenue, average_price, utilization_rate, top_routes, top_aircraft_categories, our_market_share, competitor_pricing, price_competitiveness_score) VALUES
('ma-001', '2024-01-20', 'North America', 1247, 18750000.00, 15036.45, 0.73, 
 '[{"from": "KJFK", "to": "KLAX", "count": 89, "avgPrice": 45000}, {"from": "KORD", "to": "KSFO", "count": 67, "avgPrice": 42000}, {"from": "KJFK", "to": "EGLL", "count": 45, "avgPrice": 89000}]',
 '[{"category": "Light Jet", "count": 412, "avgPrice": 8500}, {"category": "Midsize Jet", "count": 356, "avgPrice": 18500}, {"category": "Heavy Jet", "count": 287, "avgPrice": 35000}]',
 0.12, '{"KJFK-KLAX": 47500, "KORD-KSFO": 44500, "KJFK-EGLL": 92000}', 0.94),

('ma-002', '2024-01-19', 'North America', 1189, 17890000.00, 15046.89, 0.71,
 '[{"from": "KJFK", "to": "KLAX", "count": 92, "avgPrice": 44500}, {"from": "KORD", "to": "KSFO", "count": 71, "avgPrice": 41500}, {"from": "KJFK", "to": "EGLL", "count": 48, "avgPrice": 88500}]',
 '[{"category": "Light Jet", "count": 398, "avgPrice": 8200}, {"category": "Midsize Jet", "count": 367, "avgPrice": 18200}, {"category": "Heavy Jet", "count": 301, "avgPrice": 34500}]',
 0.11, '{"KJFK-KLAX": 47000, "KORD-KSFO": 44000, "KJFK-EGLL": 91500}', 0.96),

('ma-003', '2024-01-20', 'Europe', 843, 15620000.00, 18531.55, 0.68,
 '[{"from": "EGLL", "to": "LFPG", "count": 156, "avgPrice": 12000}, {"from": "EGLL", "to": "EDDF", "count": 134, "avgPrice": 15000}, {"from": "LFPG", "to": "LIRF", "count": 89, "avgPrice": 18000}]',
 '[{"category": "Light Jet", "count": 298, "avgPrice": 9500}, {"category": "Midsize Jet", "count": 287, "avgPrice": 19500}, {"category": "Heavy Jet", "count": 258, "avgPrice": 32000}]',
 0.08, '{"EGLL-LFPG": 12500, "EGLL-EDDF": 15500, "LFPG-LIRF": 18500}', 0.92);

-- ===================================
-- USER BEHAVIOR ANALYTICS
-- ===================================

INSERT INTO user_behavior_analytics (id, session_id, user_id, entry_point, referral_source, search_criteria, viewed_aircraft, quotes_requested, booking_completed, conversion_value, session_duration_seconds, page_views, bounce_rate, device_type, browser, country, city) VALUES
('uba-001', 'sess-001', 'user-001', 'Search', 'google.com', '{"departure": "KJFK", "arrival": "KLAX", "date": "2024-02-15", "passengers": 4, "category": "Midsize Jet"}', 
 '{ac-002, ac-005, ac-007}', 2, true, 52000.00, 1847, 12, false, 'Desktop', 'Chrome', 'USA', 'New York'),

('uba-002', 'sess-002', 'user-002', 'Direct', 'newsletter', '{"departure": "EGLL", "arrival": "LFPG", "date": "2024-02-20", "passengers": 2, "flexible_dates": true}',
 '{ac-001, ac-003}', 1, false, 0.00, 456, 5, true, 'Mobile', 'Safari', 'GBR', 'London'),

('uba-003', 'sess-003', 'user-003', 'Referral', 'privatejetcompany.com', '{"departure": "KLAX", "arrival": "KSFO", "date": "2024-02-10", "passengers": 6, "budget_max": 25000}',
 '{ac-004, ac-006}', 3, true, 23500.00, 2134, 18, false, 'Tablet', 'Chrome', 'USA', 'Los Angeles');

-- ===================================
-- AI PREDICTIONS DATA
-- ===================================

-- Price Predictions
INSERT INTO price_predictions (id, aircraft_id, route, prediction_date, predicted_price, confidence_score, demand_forecast, historical_pricing, seasonal_factors, model_version, training_accuracy) VALUES
('pp-001', 'ac-001', 'KJFK-KLAX', '2024-02-15', 8750.00, 0.87, 0.73,
 '{"avg_30_days": 8200, "avg_90_days": 7950, "trend": "increasing"}',
 '{"february": 1.12, "valentine_week": 1.25, "presidents_day": 1.08}', '2.1', 0.91),

('pp-002', 'ac-002', 'KJFK-EGLL', '2024-02-20', 95000.00, 0.82, 0.68,
 '{"avg_30_days": 91000, "avg_90_days": 89500, "trend": "stable"}',
 '{"february": 0.95, "off_season": 0.88}', '2.1', 0.91),

('pp-003', 'ac-003', 'KLAX-KSFO', '2024-02-12', 34500.00, 0.79, 0.81,
 '{"avg_30_days": 33800, "avg_90_days": 32900, "trend": "increasing"}',
 '{"february": 1.05, "tech_conference_season": 1.18}', '2.1', 0.91);

-- Demand Forecasts
INSERT INTO demand_forecasts (id, route, forecast_date, expected_bookings, demand_intensity, peak_demand_hours, seasonality_factor, events_impact, forecast_accuracy) VALUES
('df-001', 'KJFK-KLAX', '2024-02-15', 23, 0.78, '{9, 10, 15, 16, 17}', 1.12,
 '{"events": [{"name": "Tech Summit LA", "impact": 0.15}, {"name": "Fashion Week", "impact": 0.08}]}', 0.89),

('df-002', 'EGLL-LFPG', '2024-02-20', 18, 0.65, '{8, 9, 14, 15, 18}', 0.95,
 '{"events": [{"name": "Paris Fashion Week", "impact": 0.22}]}', 0.84),

('df-003', 'KLAX-KSFO', '2024-02-12', 31, 0.85, '{7, 8, 17, 18, 19}', 1.08,
 '{"events": [{"name": "Silicon Valley Conference", "impact": 0.28}]}', 0.92);

-- ===================================
-- REAL-TIME ALERTS
-- ===================================

INSERT INTO real_time_alerts (id, alert_type, severity, title, message, affected_routes, affected_aircraft, is_active, channels_used, total_recipients) VALUES
('rta-001', 'WeatherDelay', 'Medium', 'Weather Advisory: NYC Area', 
 'Light snow expected in the NYC area may cause 1-2 hour delays for departures from JFK, LGA, and TEB airports. We recommend flexible departure times.',
 '{KJFK-KLAX, KJFK-KSFO, KTEB-KBOS}', '{ac-001, ac-004, ac-007}', true, '{email, push}', 47),

('rta-002', 'PriceChange', 'Low', 'Price Drop Alert: LA to Vegas', 
 'Great news! Dynamic pricing has reduced rates on the popular LA-Vegas route by 15% for the next 48 hours.',
 '{KLAX-KLAS}', '{ac-002, ac-005}', true, '{email, sms}', 156),

('rta-003', 'AircraftAvailable', 'High', 'Last-Minute Availability: Gulfstream G650', 
 'A premium Gulfstream G650 just became available for tomorrow''s flights. Perfect for transcontinental routes with ultimate luxury.',
 '{}', '{ac-009}', true, '{email, push, whatsapp}', 203);

-- ===================================
-- NOTIFICATION PREFERENCES
-- ===================================

INSERT INTO notification_preferences (id, user_id, email_enabled, sms_enabled, push_enabled, whatsapp_enabled, booking_updates, price_alerts, weather_alerts, promotional_offers, email, phone, timezone) VALUES
('np-001', 'user-001', true, true, true, false, true, true, true, false, 'user1@example.com', '+1-555-0101', 'America/New_York'),
('np-002', 'user-002', true, false, true, true, true, true, false, true, 'user2@example.com', '+44-20-1234-5678', 'Europe/London'),
('np-003', 'user-003', true, true, false, false, true, false, true, false, 'user3@example.com', '+1-555-0103', 'America/Los_Angeles');

-- ===================================
-- DYNAMIC PRICING RULES
-- ===================================

INSERT INTO dynamic_pricing_rules (id, rule_name, aircraft_category, demand_threshold_low, demand_threshold_high, low_demand_discount_pct, high_demand_markup_pct, advance_booking_discount, seasonal_multipliers, is_active, priority) VALUES
('dpr-001', 'Standard Dynamic Pricing', NULL, 0.30, 0.70, 10.00, 25.00,
 '{"30_days": 5, "60_days": 10, "90_days": 15}',
 '{"summer": 1.15, "winter": 0.90, "holiday_weeks": 1.40}', true, 100),

('dpr-002', 'Light Jet Optimization', 'Light Jet', 0.25, 0.75, 15.00, 30.00,
 '{"7_days": 2, "14_days": 5, "30_days": 8}',
 '{"peak_summer": 1.25, "off_season": 0.85}', true, 90),

('dpr-003', 'Heavy Jet Premium Pricing', 'Heavy Jet', 0.40, 0.60, 5.00, 20.00,
 '{"30_days": 3, "60_days": 7, "90_days": 12}',
 '{"holidays": 1.35, "business_travel_season": 1.10}', true, 80);

-- ===================================
-- PRICING ADJUSTMENTS LOG
-- ===================================

INSERT INTO pricing_adjustments_log (id, aircraft_id, flight_leg_id, original_price, adjusted_price, adjustment_percentage, adjustment_reason, demand_score, booking_lead_time_days, bookings_after_adjustment, revenue_impact) VALUES
('pal-001', 'ac-001', 'fl-001', 7500.00, 8250.00, 10.00, 'Dynamic', 0.78, 14, 3, 24750.00),
('pal-002', 'ac-002', 'fl-002', 45000.00, 40500.00, -10.00, 'Competitive', 0.52, 28, 1, 40500.00),
('pal-003', 'ac-003', 'fl-003', 32000.00, 36800.00, 15.00, 'Dynamic', 0.84, 7, 2, 73600.00);

-- ===================================
-- BLOCKCHAIN TRANSACTIONS (DEMO DATA)
-- ===================================

INSERT INTO blockchain_transactions (id, booking_id, transaction_hash, contract_address, contract_function, gas_used, gas_price, transaction_fee, blockchain_network, status, confirmation_count, booking_data_hash, is_verified) VALUES
('bt-001', 'bk-001', '0xabc123def456789abc123def456789abc123def456789abc123def456789abc123', '0x742d35cc6600c000e41b4c8d43a3e4d2b90e6e15', 'createBooking', 142000, 20000000000, 0.00284, 'Ethereum', 'Confirmed', 12, 'QmYjtig7VJQ6XsnUjqqJvj7QaMcCAwtrgNdahSiFofrE7o', true),
('bt-002', 'bk-002', '0xdef789abc123456def789abc123456def789abc123456def789abc123456def789', '0x742d35cc6600c000e41b4c8d43a3e4d2b90e6e15', 'processPayment', 98000, 18000000000, 0.001764, 'Polygon', 'Confirmed', 25, 'QmPkWYLaGZWwuNzhjdSd6KxemkVrMTVPTjn4LZjXcP8X7Q', true);

-- ===================================
-- UPDATE STATISTICS
-- ===================================

-- Update table statistics for query optimization
ANALYZE operators;
ANALYZE aircraft;
ANALYZE flight_legs;
ANALYZE operator_reviews;
ANALYZE aircraft_reviews;
ANALYZE market_analytics;
ANALYZE user_behavior_analytics;
ANALYZE price_predictions;
ANALYZE demand_forecasts;
ANALYZE real_time_alerts;
ANALYZE notification_preferences;
ANALYZE dynamic_pricing_rules;
ANALYZE pricing_adjustments_log;
ANALYZE blockchain_transactions;

-- ===================================
-- SUCCESS MESSAGE
-- ===================================

DO $$
BEGIN
    RAISE NOTICE 'NextAvinode competitive features and seed data loaded successfully!';
    RAISE NOTICE 'Database now includes:';
    RAISE NOTICE '- Enhanced operators with AI/blockchain features';
    RAISE NOTICE '- Smart aircraft with IoT and predictive maintenance';
    RAISE NOTICE '- Customer reviews and ratings system';
    RAISE NOTICE '- Market analytics and competitive intelligence';
    RAISE NOTICE '- AI price predictions and demand forecasting';
    RAISE NOTICE '- Real-time alerts and notification system';
    RAISE NOTICE '- Dynamic pricing engine with rules';
    RAISE NOTICE '- Blockchain transaction transparency';
    RAISE NOTICE '- User behavior analytics for optimization';
    RAISE NOTICE '';
    RAISE NOTICE 'Ready to compete with Avinode! 🚀';
END $$;