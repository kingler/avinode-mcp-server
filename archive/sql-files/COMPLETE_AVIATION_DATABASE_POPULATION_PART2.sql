-- ============================================================================
-- COMPLETE AVIATION DATABASE POPULATION - PART 2
-- ============================================================================
-- Execute AFTER Part 1 - Contains remaining tables for full operational status
-- ============================================================================

BEGIN;

-- ============================================================================
-- 9. AIRCRAFT_REVIEWS TABLE (25+ aircraft review records)
-- ============================================================================

INSERT INTO aircraft_reviews (id, aircraft_id, booking_id, customer_name, customer_email, rating, title, review, comfort_rating, cleanliness_rating, amenities_rating, verified_booking, helpful, created_at, updated_at)
SELECT 
    'rev_ac' || generate_random_uuid()::text,
    (SELECT id FROM aircraft ORDER BY random() LIMIT 1),
    (SELECT id FROM bookings ORDER BY random() LIMIT 1),
    (ARRAY['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson', 'Lisa Garcia', 'James Martinez', 'Amanda Rodriguez', 'William Anderson', 'Jennifer Thompson'])[ceil(random() * 10)],
    'customer' || i || '@example.com',
    (4 + floor(random() * 2))::integer,
    (ARRAY[
        'Excellent flight experience',
        'Comfortable and luxurious', 
        'Professional service',
        'Great aircraft condition',
        'Smooth flight',
        'Outstanding interior',
        'Reliable and punctual',
        'Top-notch amenities',
        'Spacious cabin',
        'Impressive performance'
    ])[ceil(random() * 10)],
    'This was an exceptional flight experience. The aircraft was in pristine condition and the service was professional. The cabin was spacious and comfortable, with all amenities working perfectly. The crew was attentive and the flight was smooth throughout. Highly recommended for business travel and would definitely book again.',
    (4 + floor(random() * 2))::integer,
    (4 + floor(random() * 2))::integer,
    (3 + floor(random() * 3))::integer,
    (random() > 0.2)::boolean,
    floor(random() * 15)::integer,
    NOW() - INTERVAL '180 days' + (i * 7 || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 25) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 10. OPERATOR_REVIEWS TABLE (25+ operator review records)
-- ============================================================================

INSERT INTO operator_reviews (id, operator_id, booking_id, customer_name, customer_email, rating, title, review, service_rating, communication_rating, value_rating, timeliness_rating, verified_booking, helpful, created_at, updated_at)
SELECT 
    'rev_op' || generate_random_uuid()::text,
    (SELECT id FROM operators ORDER BY random() LIMIT 1),
    (SELECT id FROM bookings ORDER BY random() LIMIT 1),
    (ARRAY['Robert Miller', 'Jessica Garcia', 'Christopher Moore', 'Michelle Taylor', 'Andrew Martin', 'Kimberly Jackson', 'Daniel Lee', 'Ashley White', 'Matthew Clark', 'Stephanie Lewis'])[ceil(random() * 10)],
    'customer' || (i + 25) || '@example.com',
    (4 + floor(random() * 2))::integer,
    (ARRAY[
        'Outstanding operator service',
        'Professional and reliable',
        'Excellent communication',
        'Great value for money',
        'Punctual and efficient',
        'Exceptional customer service',
        'Highly recommended operator',
        'Seamless booking process',
        'Top-tier aviation service',
        'World-class operator'
    ])[ceil(random() * 10)],
    'Outstanding operator with excellent communication and service. They handled everything professionally and made the entire experience seamless. The booking process was smooth, communication was clear throughout, and they delivered exactly what was promised. The crew was professional and the aircraft was in perfect condition. Great value for the service provided.',
    (4 + floor(random() * 2))::integer,
    (4 + floor(random() * 2))::integer,
    (3 + floor(random() * 3))::integer,
    (4 + floor(random() * 2))::integer,
    (random() > 0.2)::boolean,
    floor(random() * 20)::integer,
    NOW() - INTERVAL '200 days' + (i * 8 || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 25) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 11. MARKET_ANALYTICS TABLE (30+ market analytics records)
-- ============================================================================

INSERT INTO market_analytics (id, date, region, total_bookings, total_revenue, average_price, utilization_rate, top_routes, top_aircraft, market_share, competitor_pricing, created_at)
SELECT 
    'mkt' || generate_random_uuid()::text,
    (DATE '2024-01-01' + (i * 10 || ' days')::INTERVAL)::date,
    (ARRAY['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Latin America', 'Africa'])[ceil(random() * 6)],
    floor(random() * 80 + 20)::integer,
    (random() * 1500000 + 500000)::numeric(12,2),
    (random() * 25000 + 10000)::numeric(10,2),
    (random() * 0.4 + 0.6)::numeric(4,3),
    jsonb_build_array(
        jsonb_build_object('route', 'KJFK-KLAX', 'bookings', floor(random() * 20 + 5)::integer, 'revenue', (random() * 800000 + 200000)::numeric(10,2)),
        jsonb_build_object('route', 'EGLL-LFPG', 'bookings', floor(random() * 15 + 3)::integer, 'revenue', (random() * 150000 + 50000)::numeric(10,2)),
        jsonb_build_object('route', 'KTEB-KPBI', 'bookings', floor(random() * 12 + 2)::integer, 'revenue', (random() * 300000 + 100000)::numeric(10,2))
    ),
    jsonb_build_array(
        jsonb_build_object('type', 'Gulfstream G650', 'bookings', floor(random() * 15 + 5)::integer, 'utilization', (random() * 0.3 + 0.7)::numeric(3,2)),
        jsonb_build_object('type', 'Cessna Citation X+', 'bookings', floor(random() * 12 + 3)::integer, 'utilization', (random() * 0.3 + 0.6)::numeric(3,2)),
        jsonb_build_object('type', 'Bombardier Global 7500', 'bookings', floor(random() * 10 + 2)::integer, 'utilization', (random() * 0.3 + 0.65)::numeric(3,2))
    ),
    (random() * 0.25 + 0.1)::numeric(4,3),
    jsonb_build_object(
        'average_hourly_rate', (random() * 4000 + 3000)::numeric(8,2),
        'premium_vs_economy_ratio', (random() * 1.5 + 1.5)::numeric(3,2),
        'seasonal_variance', (random() * 0.3 + 0.8)::numeric(3,2),
        'fuel_surcharge_avg', (random() * 500 + 200)::numeric(6,2)
    ),
    DATE '2024-01-01' + (i * 10 || ' days')::INTERVAL
FROM generate_series(1, 30) i
ON CONFLICT (date, region) DO UPDATE SET
    total_bookings = EXCLUDED.total_bookings,
    total_revenue = EXCLUDED.total_revenue,
    average_price = EXCLUDED.average_price,
    utilization_rate = EXCLUDED.utilization_rate,
    top_routes = EXCLUDED.top_routes,
    top_aircraft = EXCLUDED.top_aircraft,
    market_share = EXCLUDED.market_share,
    competitor_pricing = EXCLUDED.competitor_pricing;

-- ============================================================================
-- 12. PRICE_PREDICTIONS TABLE (30+ price prediction records)
-- ============================================================================

INSERT INTO price_predictions (id, aircraft_id, route, predicted_date, predicted_price, confidence_score, demand_forecast, historical_pricing, seasonal_factors, weather_factors, event_factors, model_version, training_accuracy, created_at)
SELECT 
    'pred' || generate_random_uuid()::text,
    (SELECT id FROM aircraft ORDER BY random() LIMIT 1),
    (ARRAY['KJFK-KLAX', 'EGLL-LFPG', 'KTEB-KPBI', 'KBOS-KMIA', 'KSFO-KLAS', 'KDCA-KATL', 'KORD-KDEN', 'KIAH-KJFK'])[ceil(random() * 8)],
    (NOW() + (i * 3 || ' days')::INTERVAL + INTERVAL '1 day')::timestamptz,
    (random() * 20000 + 8000)::numeric(10,2),
    (random() * 0.25 + 0.75)::numeric(4,3),
    (random() * 0.35 + 0.65)::numeric(4,3),
    jsonb_build_object(
        'last_30_days_avg', (random() * 18000 + 7500)::numeric(10,2),
        'last_90_days_trend', (ARRAY['increasing', 'decreasing', 'stable'])[ceil(random() * 3)],
        'historical_volatility', (random() * 0.15 + 0.05)::numeric(4,3),
        'price_range', jsonb_build_object('min', (random() * 5000 + 5000)::numeric(8,2), 'max', (random() * 15000 + 20000)::numeric(8,2))
    ),
    jsonb_build_object(
        'holiday_impact_factor', (random() * 0.3 + 0.9)::numeric(4,3),
        'weather_seasonal_factor', (random() * 0.2 + 0.9)::numeric(4,3),
        'business_season_factor', (random() * 0.25 + 0.9)::numeric(4,3),
        'vacation_season_factor', (random() * 0.4 + 0.8)::numeric(4,3)
    ),
    jsonb_build_object(
        'precipitation_probability', (random() * 0.6)::numeric(3,2),
        'wind_conditions', (ARRAY['favorable', 'moderate', 'challenging'])[ceil(random() * 3)],
        'visibility_forecast', (ARRAY['excellent', 'good', 'limited'])[ceil(random() * 3)],
        'temperature_impact', (random() * 0.1 + 0.95)::numeric(4,3)
    ),
    jsonb_build_object(
        'major_events', CASE WHEN random() > 0.7 THEN jsonb_build_array('Business Conference', 'Sports Event') ELSE jsonb_build_array() END,
        'business_activity_level', (ARRAY['high', 'medium', 'low'])[ceil(random() * 3)],
        'tourism_events', CASE WHEN random() > 0.6 THEN jsonb_build_array('Festival', 'Convention') ELSE jsonb_build_array() END
    ),
    '2.1.0',
    (random() * 0.12 + 0.88)::numeric(4,3),
    NOW()
FROM generate_series(1, 30) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 13. DEMAND_FORECASTS TABLE (25+ demand forecast records)
-- ============================================================================

INSERT INTO demand_forecasts (id, route, forecast_date, expected_bookings, demand_intensity, peak_hours, seasonality, events, economic_indicators, actual_bookings, prediction_accuracy, created_at)
SELECT 
    'demand' || generate_random_uuid()::text,
    (ARRAY['KJFK-KLAX', 'EGLL-LFPG', 'KTEB-KPBI', 'KBOS-KMIA', 'KSFO-KLAS', 'KDCA-KATL', 'KORD-KDEN'])[ceil(random() * 7)],
    (NOW() + (i * 2 || ' days')::INTERVAL + INTERVAL '12 hours')::timestamptz,
    floor(random() * 40 + 10)::integer,
    (random() * 0.35 + 0.65)::numeric(4,3),
    ARRAY[8, 9, 10, 11, 17, 18, 19, 20],
    (random() * 0.25 + 0.85)::numeric(4,3),
    jsonb_build_object(
        'conferences', CASE WHEN random() > 0.7 THEN jsonb_build_array('Tech Summit', 'Aviation Expo', 'Business Forum') ELSE jsonb_build_array() END,
        'holidays', CASE WHEN random() > 0.8 THEN jsonb_build_array('Independence Day', 'Thanksgiving') ELSE jsonb_build_array() END,
        'sports_events', CASE WHEN random() > 0.6 THEN jsonb_build_array('Championship Game', 'World Series') ELSE jsonb_build_array() END,
        'entertainment', CASE WHEN random() > 0.75 THEN jsonb_build_array('Concert', 'Awards Show') ELSE jsonb_build_array() END
    ),
    jsonb_build_object(
        'gdp_growth_rate', (random() * 0.05 + 0.02)::numeric(4,3),
        'business_confidence_index', (random() * 0.2 + 0.7)::numeric(3,2),
        'fuel_price_per_gallon', (random() * 2.0 + 4.0)::numeric(4,2),
        'unemployment_rate', (random() * 0.03 + 0.03)::numeric(4,3),
        'stock_market_performance', (random() * 0.15 + 0.9)::numeric(4,3)
    ),
    CASE WHEN random() > 0.4 THEN floor((floor(random() * 40 + 10)) * (random() * 0.25 + 0.85))::integer ELSE NULL END,
    CASE WHEN random() > 0.4 THEN (random() * 0.15 + 0.85)::numeric(4,3) ELSE NULL END,
    NOW()
FROM generate_series(1, 25) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 14. REAL_TIME_ALERTS TABLE (25+ alert records)
-- ============================================================================

INSERT INTO real_time_alerts (id, alert_type, severity, title, message, affected_users, affected_bookings, affected_aircraft, affected_routes, is_active, resolved_at, sent_via_email, sent_via_sms, sent_via_push, created_at)
SELECT 
    'alert' || generate_random_uuid()::text,
    (ARRAY['WeatherDelay', 'MaintenanceIssue', 'PriceChange', 'FlightUpdate', 'BookingConfirmation'])[ceil(random() * 5)],
    (ARRAY['Low', 'Medium', 'High', 'Critical'])[ceil(random() * 4)],
    CASE 
        WHEN ceil(random() * 5) = 1 THEN 'Weather-Related Flight Delay'
        WHEN ceil(random() * 5) = 2 THEN 'Aircraft Maintenance Required'  
        WHEN ceil(random() * 5) = 3 THEN 'Dynamic Pricing Update'
        WHEN ceil(random() * 5) = 4 THEN 'Flight Schedule Update'
        ELSE 'Booking Confirmed'
    END,
    CASE 
        WHEN ceil(random() * 5) = 1 THEN 'Flight delayed due to severe weather conditions at departure airport. Estimated delay: ' || floor(random() * 4 + 1)::text || ' hours. Alternative arrangements being made.'
        WHEN ceil(random() * 5) = 2 THEN 'Routine maintenance check required for aircraft safety. Alternative aircraft being arranged with minimal schedule impact.'
        WHEN ceil(random() * 5) = 3 THEN 'Flight prices have been updated based on current market conditions and demand forecasting. New rates now available.'
        WHEN ceil(random() * 5) = 4 THEN 'Your flight departure time has been updated. New departure: ' || (9 + floor(random() * 10))::text || ':' || (floor(random() * 6) * 10)::text || ' ' || (ARRAY['AM', 'PM'])[ceil(random() * 2)] || '.'
        ELSE 'Your charter flight booking has been confirmed. Check-in details and flight information will be sent 24 hours before departure.'
    END,
    ARRAY[(SELECT id FROM users ORDER BY random() LIMIT 1), (SELECT id FROM users ORDER BY random() LIMIT 1)],
    ARRAY[(SELECT id FROM bookings ORDER BY random() LIMIT 1)],
    ARRAY[(SELECT id FROM aircraft ORDER BY random() LIMIT 1)],
    ARRAY[(ARRAY['KJFK-KLAX', 'EGLL-LFPG', 'KTEB-KPBI', 'KBOS-KMIA'])[ceil(random() * 4)]],
    (random() > 0.3)::boolean,
    CASE WHEN random() > 0.3 THEN NULL ELSE NOW() - INTERVAL '12 hours' + (random() * 12 || ' hours')::INTERVAL END,
    (random() > 0.15)::boolean,
    (random() > 0.4)::boolean,
    (random() > 0.25)::boolean,
    NOW() - INTERVAL '7 days' + (i || ' hours')::INTERVAL
FROM generate_series(1, 25) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 15. NOTIFICATION_PREFERENCES TABLE (25+ notification preference records)
-- ============================================================================

INSERT INTO notification_preferences (id, user_id, email_enabled, sms_enabled, push_enabled, whatsapp_enabled, booking_updates, price_alerts, weather_alerts, promotions, email, phone, whatsapp_number, created_at, updated_at)
SELECT 
    'notif' || generate_random_uuid()::text,
    (SELECT id FROM users ORDER BY random() LIMIT 1),
    (random() > 0.05)::boolean,
    (random() > 0.35)::boolean, 
    (random() > 0.15)::boolean,
    (random() > 0.65)::boolean,
    (random() > 0.02)::boolean,
    (random() > 0.25)::boolean,
    (random() > 0.15)::boolean,
    (random() > 0.55)::boolean,
    'user' || i || '@example.com',
    '+1' || floor(random() * 900 + 100)::text || floor(random() * 900 + 100)::text || floor(random() * 9000 + 1000)::text,
    CASE WHEN random() > 0.65 THEN '+1' || floor(random() * 900 + 100)::text || floor(random() * 900 + 100)::text || floor(random() * 9000 + 1000)::text ELSE NULL END,
    NOW() - INTERVAL '365 days' + (i * 14 || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 25) i
ON CONFLICT (user_id) DO UPDATE SET
    email_enabled = EXCLUDED.email_enabled,
    sms_enabled = EXCLUDED.sms_enabled,
    push_enabled = EXCLUDED.push_enabled,
    whatsapp_enabled = EXCLUDED.whatsapp_enabled,
    booking_updates = EXCLUDED.booking_updates,
    price_alerts = EXCLUDED.price_alerts,
    weather_alerts = EXCLUDED.weather_alerts,
    promotions = EXCLUDED.promotions,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    whatsapp_number = EXCLUDED.whatsapp_number,
    updated_at = NOW();

-- ============================================================================
-- 16. WEATHER_DATA TABLE (30+ weather records)
-- ============================================================================

CREATE TABLE IF NOT EXISTS weather_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airport_code TEXT NOT NULL,
    report_time TIMESTAMPTZ NOT NULL,
    temperature DECIMAL(5,2),
    humidity INTEGER CHECK (humidity >= 0 AND humidity <= 100),
    pressure DECIMAL(6,2),
    visibility DECIMAL(4,1),
    wind_speed INTEGER,
    wind_direction INTEGER CHECK (wind_direction >= 0 AND wind_direction < 360),
    weather_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    precipitation_probability INTEGER CHECK (precipitation_probability >= 0 AND precipitation_probability <= 100),
    cloud_coverage TEXT,
    flight_category TEXT CHECK (flight_category IN ('VFR', 'MVFR', 'IFR', 'LIFR')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO weather_data (airport_code, report_time, temperature, humidity, pressure, visibility, wind_speed, wind_direction, weather_conditions, precipitation_probability, cloud_coverage, flight_category, created_at)
SELECT 
    (ARRAY['KJFK', 'KLAX', 'EGLL', 'LFPG', 'KTEB', 'KPBI', 'KBOS', 'KMIA', 'KSFO', 'KLAS'])[ceil(random() * 10)],
    NOW() - INTERVAL '48 hours' + (i * 3 || ' hours')::INTERVAL,
    (random() * 60 + 20)::numeric(5,2),
    floor(random() * 70 + 30)::integer,
    (random() * 3.0 + 29.5)::numeric(6,2),
    (random() * 8 + 2)::numeric(4,1),
    floor(random() * 25 + 5)::integer,
    floor(random() * 360)::integer,
    CASE 
        WHEN random() > 0.7 THEN ARRAY['Clear', 'Sunny']
        WHEN random() > 0.5 THEN ARRAY['Partly Cloudy', 'Light Winds'] 
        WHEN random() > 0.3 THEN ARRAY['Overcast', 'Light Rain']
        ELSE ARRAY['Thunderstorms', 'Heavy Rain']
    END,
    floor(random() * 80 + 10)::integer,
    (ARRAY['Clear', 'Few Clouds', 'Scattered', 'Broken', 'Overcast'])[ceil(random() * 5)],
    (ARRAY['VFR', 'MVFR', 'IFR', 'LIFR'])[ceil(random() * 4)],
    NOW() - INTERVAL '48 hours' + (i * 3 || ' hours')::INTERVAL
FROM generate_series(1, 30) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 17. OPERATIONAL_LOGS TABLE (40+ operational log records)
-- ============================================================================

CREATE TABLE IF NOT EXISTS operational_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    log_type TEXT NOT NULL,
    severity TEXT CHECK (severity IN ('DEBUG', 'INFO', 'WARN', 'ERROR', 'CRITICAL')) DEFAULT 'INFO',
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}',
    user_id UUID,
    aircraft_id UUID,
    operator_id UUID,
    booking_id UUID,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO operational_logs (log_type, severity, message, details, user_id, aircraft_id, operator_id, booking_id, ip_address, user_agent, session_id, created_at)
SELECT 
    (ARRAY['USER_LOGIN', 'BOOKING_CREATED', 'PAYMENT_PROCESSED', 'AIRCRAFT_ASSIGNED', 'FLIGHT_SCHEDULED', 'MAINTENANCE_LOGGED', 'PRICE_UPDATED', 'ALERT_SENT', 'REPORT_GENERATED', 'SYSTEM_BACKUP'])[ceil(random() * 10)],
    (ARRAY['DEBUG', 'INFO', 'WARN', 'ERROR'])[ceil(random() * 4)],
    CASE 
        WHEN ceil(random() * 10) = 1 THEN 'User successfully logged in to aviation platform'
        WHEN ceil(random() * 10) = 2 THEN 'New charter booking created and confirmed'
        WHEN ceil(random() * 10) = 3 THEN 'Payment transaction processed successfully'
        WHEN ceil(random() * 10) = 4 THEN 'Aircraft assigned to booking with crew confirmation'
        WHEN ceil(random() * 10) = 5 THEN 'Flight scheduled and slots confirmed at airports'
        WHEN ceil(random() * 10) = 6 THEN 'Maintenance activity logged and tracked'
        WHEN ceil(random() * 10) = 7 THEN 'Dynamic pricing engine updated flight rates'
        WHEN ceil(random() * 10) = 8 THEN 'Real-time alert sent to affected users'
        WHEN ceil(random() * 10) = 9 THEN 'Operational report generated and distributed'
        ELSE 'System backup completed successfully'
    END,
    jsonb_build_object(
        'duration_ms', floor(random() * 5000 + 100)::integer,
        'success', (random() > 0.1)::boolean,
        'retry_count', floor(random() * 3)::integer,
        'module', (ARRAY['auth', 'booking', 'payment', 'scheduling', 'maintenance', 'pricing', 'notification'])[ceil(random() * 7)],
        'version', '2.1.0'
    ),
    (SELECT id FROM users ORDER BY random() LIMIT 1),
    CASE WHEN random() > 0.6 THEN (SELECT id FROM aircraft ORDER BY random() LIMIT 1) ELSE NULL END,
    CASE WHEN random() > 0.7 THEN (SELECT id FROM operators ORDER BY random() LIMIT 1) ELSE NULL END,
    CASE WHEN random() > 0.5 THEN (SELECT id FROM bookings ORDER BY random() LIMIT 1) ELSE NULL END,
    ('192.168.1.' || floor(random() * 255 + 1)::text)::inet,
    (ARRAY[
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36', 
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36',
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15',
        'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15'
    ])[ceil(random() * 5)],
    'sess_' || substr(md5(random()::text), 1, 16),
    NOW() - INTERVAL '72 hours' + (i || ' hours')::INTERVAL
FROM generate_series(1, 40) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- FINAL VERIFICATION QUERY
-- ============================================================================

-- Summary of all table record counts
DO $$
DECLARE
    table_name TEXT;
    record_count INTEGER;
    total_records INTEGER := 0;
    tables_with_20_plus INTEGER := 0;
    table_status TEXT;
BEGIN
    RAISE NOTICE '============================================================================';
    RAISE NOTICE 'AVIATION DATABASE POPULATION COMPLETE - FINAL VERIFICATION';
    RAISE NOTICE '============================================================================';
    
    FOR table_name IN 
        SELECT unnest(ARRAY[
            'users', 'customers', 'aircraft', 'operators', 'bookings', 
            'charter_requests', 'flight_legs', 'pricing_quotes', 'transactions', 
            'invoices', 'maintenance_records', 'crew_assignments', 'routes',
            'airports', 'aircraft_reviews', 'operator_reviews', 'market_analytics', 
            'price_predictions', 'demand_forecasts', 'real_time_alerts', 
            'notification_preferences', 'weather_data', 'operational_logs'
        ])
    LOOP
        EXECUTE 'SELECT COUNT(*) FROM ' || table_name INTO record_count;
        total_records := total_records + record_count;
        
        IF record_count >= 20 THEN
            table_status := '✅ ADEQUATE';
            tables_with_20_plus := tables_with_20_plus + 1;
        ELSIF record_count > 0 THEN
            table_status := '⚠️ NEEDS MORE';
        ELSE
            table_status := '❌ EMPTY';
        END IF;
        
        RAISE NOTICE '% %: % records', table_status, RPAD(table_name, 25), record_count;
    END LOOP;
    
    RAISE NOTICE '============================================================================';
    RAISE NOTICE '🚀 TOTAL RECORDS IN DATABASE: %', total_records;
    RAISE NOTICE '📊 TABLES WITH ≥20 RECORDS: %/23', tables_with_20_plus;
    RAISE NOTICE '🎯 SUCCESS CRITERIA: % (≥18 tables with 20+ records for operational status)', 
        CASE WHEN tables_with_20_plus >= 18 THEN '✅ MET' ELSE '❌ NOT MET' END;
    RAISE NOTICE '============================================================================';
END $$;

COMMIT;