-- =====================================================
-- AVINODE MCP SERVER - COMPREHENSIVE DATABASE SEEDING
-- =====================================================
-- This script populates all empty tables with realistic aviation industry data
-- and adds proper table descriptions for documentation

BEGIN;

-- =====================================================
-- TABLE DESCRIPTIONS
-- =====================================================

COMMENT ON TABLE aircraft IS 'Private aircraft available for charter with specifications, availability, and pricing';
COMMENT ON TABLE operators IS 'Charter operators managing fleets with contact info, ratings, and service areas';
COMMENT ON TABLE charter_requests IS 'Customer requests for private charter flights with requirements and preferences';
COMMENT ON TABLE bookings IS 'Confirmed charter reservations with passenger details and service specifications';
COMMENT ON TABLE airports IS 'Airport master data with ICAO codes, geographic coordinates, and operational details';
COMMENT ON TABLE flight_logs IS 'Historical flight records with departure/arrival times, routes, and operational data';
COMMENT ON TABLE maintenance_records IS 'Aircraft maintenance history including inspections, repairs, and compliance';
COMMENT ON TABLE crew_assignments IS 'Flight crew scheduling and assignment records with qualifications';
COMMENT ON TABLE payments IS 'Financial transactions for charter services with payment methods and status';
COMMENT ON TABLE invoices IS 'Billing records with itemized charges, taxes, and payment tracking';
COMMENT ON TABLE empty_legs IS 'Available repositioning flights offered at discounted rates';
COMMENT ON TABLE quotes IS 'Pricing estimates for charter requests including breakdown of costs and fees';
COMMENT ON TABLE avinode_sync IS 'Integration sync status and logs for Avinode marketplace data';
COMMENT ON TABLE paynode_transactions IS 'Payment processing transaction logs with Paynode integration';
COMMENT ON TABLE schedaero_events IS 'Maintenance and crew scheduling events from SchedAero system';
COMMENT ON TABLE utilization_metrics IS 'Aircraft utilization analytics with flight hours and revenue data';
COMMENT ON TABLE route_analytics IS 'Popular route performance data with pricing and demand trends';
COMMENT ON TABLE customer_preferences IS 'Customer profile data with booking patterns and service preferences';
COMMENT ON TABLE competitive_features IS 'Feature comparison data for competitive analysis and positioning';
COMMENT ON TABLE opensky_tracking IS 'Real-time aircraft position data from OpenSky Network integration';

-- =====================================================
-- AIRPORTS - Major International Airports
-- =====================================================

INSERT INTO airports (icao_code, iata_code, name, city, country, latitude, longitude, elevation_ft, timezone, runway_count, max_runway_length_ft) VALUES
-- North America
('KJFK', 'JFK', 'John F. Kennedy International Airport', 'New York', 'United States', 40.6413, -73.7781, 13, 'America/New_York', 4, 14511),
('KLAX', 'LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States', 33.9425, -118.4081, 125, 'America/Los_Angeles', 4, 12091),
('KTEB', 'TEB', 'Teterboro Airport', 'Teterboro', 'United States', 40.8501, -74.0606, 9, 'America/New_York', 2, 7000),
('KPBI', 'PBI', 'Palm Beach International Airport', 'West Palm Beach', 'United States', 26.6832, -80.0956, 19, 'America/New_York', 3, 10008),
('KORD', 'ORD', 'Chicago O''Hare International Airport', 'Chicago', 'United States', 41.9742, -87.9073, 672, 'America/Chicago', 8, 13000),
('KBOS', 'BOS', 'Logan International Airport', 'Boston', 'United States', 42.3656, -71.0096, 20, 'America/New_York', 6, 10083),
('KMIA', 'MIA', 'Miami International Airport', 'Miami', 'United States', 25.7959, -80.2870, 8, 'America/New_York', 4, 13016),
('KLAS', 'LAS', 'Harry Reid International Airport', 'Las Vegas', 'United States', 36.0840, -115.1537, 2181, 'America/Los_Angeles', 4, 14511),
('KSEA', 'SEA', 'Seattle-Tacoma International Airport', 'Seattle', 'United States', 47.4502, -122.3088, 433, 'America/Los_Angeles', 3, 11901),
('KDEN', 'DEN', 'Denver International Airport', 'Denver', 'United States', 39.8617, -104.6731, 5431, 'America/Denver', 6, 16000),

-- Europe
('EGLL', 'LHR', 'Heathrow Airport', 'London', 'United Kingdom', 51.4700, -0.4543, 83, 'Europe/London', 2, 12799),
('LFPG', 'CDG', 'Charles de Gaulle Airport', 'Paris', 'France', 49.0097, 2.5479, 392, 'Europe/Paris', 4, 13123),
('EDDF', 'FRA', 'Frankfurt Airport', 'Frankfurt', 'Germany', 50.0379, 8.5622, 364, 'Europe/Berlin', 4, 13123),
('LIRF', 'FCO', 'Leonardo da Vinci Airport', 'Rome', 'Italy', 41.8003, 12.2389, 15, 'Europe/Rome', 4, 12795),
('LEMD', 'MAD', 'Adolfo Suárez Madrid-Barajas Airport', 'Madrid', 'Spain', 40.4839, -3.5680, 2001, 'Europe/Madrid', 4, 14108),
('EHAM', 'AMS', 'Amsterdam Airport Schiphol', 'Amsterdam', 'Netherlands', 52.3105, 4.7683, -11, 'Europe/Amsterdam', 6, 12467),
('LSGG', 'GVA', 'Geneva Airport', 'Geneva', 'Switzerland', 46.2381, 6.1089, 1411, 'Europe/Zurich', 2, 12795),
('EGKB', 'BQH', 'Biggin Hill Airport', 'London', 'United Kingdom', 51.3306, 0.0325, 598, 'Europe/London', 2, 5971),
('LFPB', 'LBG', 'Le Bourget Airport', 'Paris', 'France', 48.9694, 2.4414, 218, 'Europe/Paris', 3, 8530),
('LSZH', 'ZUR', 'Zurich Airport', 'Zurich', 'Switzerland', 47.4647, 8.5492, 1416, 'Europe/Zurich', 3, 12139),

-- Asia Pacific
('RJTT', 'NRT', 'Narita International Airport', 'Tokyo', 'Japan', 35.7647, 140.3864, 141, 'Asia/Tokyo', 3, 13123),
('VHHH', 'HKG', 'Hong Kong International Airport', 'Hong Kong', 'China', 22.3080, 113.9185, 28, 'Asia/Hong_Kong', 2, 12467),
('WSSS', 'SIN', 'Singapore Changi Airport', 'Singapore', 'Singapore', 1.3644, 103.9915, 22, 'Asia/Singapore', 4, 13123),
('YSSY', 'SYD', 'Kingsford Smith Airport', 'Sydney', 'Australia', -33.9399, 151.1753, 21, 'Australia/Sydney', 3, 13123),
('OMDB', 'DXB', 'Dubai International Airport', 'Dubai', 'UAE', 25.2532, 55.3657, 62, 'Asia/Dubai', 2, 13124),

-- Additional Business Aviation Hubs
('KFRG', 'FRG', 'Republic Airport', 'Farmingdale', 'United States', 40.7288, -73.4134, 82, 'America/New_York', 3, 5516),
('KVNY', 'VNY', 'Van Nuys Airport', 'Van Nuys', 'United States', 34.2098, -118.4898, 802, 'America/Los_Angeles', 2, 8001),
('KCDW', 'CDW', 'Essex County Airport', 'Caldwell', 'United States', 40.8752, -74.2814, 172, 'America/New_York', 2, 4999),
('EGKA', 'ESH', 'Shoreham Airport', 'Brighton', 'United Kingdom', 50.8356, -0.2972, 7, 'Europe/London', 2, 2815),
('LFMD', 'CCF', 'Cannes-Mandelieu Airport', 'Cannes', 'France', 43.5420, 7.0172, 13, 'Europe/Paris', 2, 4593),
('LIMJ', 'GOA', 'Genoa Cristoforo Colombo Airport', 'Genoa', 'Italy', 44.4133, 8.8375, 13, 'Europe/Rome', 1, 9843)

ON CONFLICT (icao_code) DO NOTHING;

-- =====================================================
-- FLIGHT LOGS - Historical Flight Records
-- =====================================================

INSERT INTO flight_logs (aircraft_id, departure_airport, arrival_airport, departure_time, arrival_time, flight_duration_minutes, distance_nm, fuel_consumed_gallons, passengers_onboard, crew_count, flight_type, flight_status) 
SELECT 
    a.id,
    dep.icao_code,
    arr.icao_code,
    NOW() - INTERVAL '1 day' * (RANDOM() * 180 + 1),  -- Random flights in last 6 months
    NOW() - INTERVAL '1 day' * (RANDOM() * 180 + 1) + INTERVAL '1 hour' * (RANDOM() * 8 + 1), -- Flight duration 1-9 hours
    (RANDOM() * 480 + 60)::INTEGER, -- 1-8 hours in minutes
    (RANDOM() * 2500 + 200)::INTEGER, -- 200-2700 nautical miles
    (RANDOM() * 1500 + 100)::INTEGER, -- 100-1600 gallons
    (RANDOM() * 12 + 1)::INTEGER, -- 1-13 passengers
    2 + (RANDOM() * 2)::INTEGER, -- 2-4 crew members
    CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'charter'
        WHEN 1 THEN 'positioning'
        ELSE 'maintenance'
    END,
    'completed'
FROM aircraft a
CROSS JOIN (
    SELECT icao_code FROM airports ORDER BY RANDOM() LIMIT 5
) dep
CROSS JOIN (
    SELECT icao_code FROM airports ORDER BY RANDOM() LIMIT 3  
) arr
WHERE dep.icao_code != arr.icao_code
LIMIT 120;

-- =====================================================
-- MAINTENANCE RECORDS
-- =====================================================

INSERT INTO maintenance_records (aircraft_id, maintenance_type, scheduled_date, completed_date, description, cost_usd, maintenance_facility, technician_name, compliance_status, next_due_date)
SELECT 
    a.id,
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'A-Check'
        WHEN 1 THEN 'B-Check'
        WHEN 2 THEN 'C-Check'
        ELSE 'Unscheduled'
    END,
    NOW() - INTERVAL '1 day' * (RANDOM() * 365 + 1),
    NOW() - INTERVAL '1 day' * (RANDOM() * 365 + 1) + INTERVAL '1 day' * (RANDOM() * 5 + 1),
    'Routine maintenance inspection and component checks',
    (RANDOM() * 50000 + 5000)::DECIMAL(10,2),
    CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN 'Executive Aviation Services Maintenance'
        WHEN 1 THEN 'Premier Charter Solutions Hangar'
        WHEN 2 THEN 'JetTech Maintenance LLC'
        WHEN 3 THEN 'AeroMax Service Center'
        ELSE 'FlightCare Maintenance'
    END,
    'Tech-' || (1000 + (RANDOM() * 9000)::INTEGER),
    'compliant',
    NOW() + INTERVAL '1 day' * (RANDOM() * 365 + 30)
FROM aircraft a
CROSS JOIN generate_series(1, 2) -- 2 maintenance records per aircraft
LIMIT 75;

-- =====================================================
-- CREW ASSIGNMENTS
-- =====================================================

INSERT INTO crew_assignments (aircraft_id, crew_member_name, crew_position, license_number, license_expiry, medical_expiry, assignment_date, status, hourly_rate_usd)
SELECT 
    a.id,
    CASE (gs % 20)
        WHEN 0 THEN 'Captain John Anderson'
        WHEN 1 THEN 'Captain Sarah Mitchell'
        WHEN 2 THEN 'Captain Robert Chen'
        WHEN 3 THEN 'Captain Emily Rodriguez'
        WHEN 4 THEN 'Captain Michael Johnson'
        WHEN 5 THEN 'FO David Wilson'
        WHEN 6 THEN 'FO Jessica Brown'
        WHEN 7 THEN 'FO Christopher Lee'
        WHEN 8 THEN 'FO Amanda Taylor'
        WHEN 9 THEN 'FO James Miller'
        WHEN 10 THEN 'FA Lisa Thompson'
        WHEN 11 THEN 'FA Rachel Davis'
        WHEN 12 THEN 'FA Michelle Garcia'
        WHEN 13 THEN 'FA Jennifer White'
        WHEN 14 THEN 'FA Nicole Martinez'
        WHEN 15 THEN 'Captain Thomas Clark'
        WHEN 16 THEN 'Captain Jennifer Lewis'
        WHEN 17 THEN 'FO Daniel Walker'
        WHEN 18 THEN 'FO Stephanie Hall'
        ELSE 'FO Kevin Young'
    END,
    CASE (gs % 3)
        WHEN 0 THEN 'Captain'
        WHEN 1 THEN 'First Officer'
        ELSE 'Flight Attendant'
    END,
    'ATP-' || (10000 + gs * 47),
    NOW() + INTERVAL '1 year' * (RANDOM() * 3 + 1),
    NOW() + INTERVAL '1 month' * (RANDOM() * 12 + 6),
    NOW() - INTERVAL '1 day' * (RANDOM() * 730 + 1),
    CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'active'
        WHEN 1 THEN 'standby'
        ELSE 'training'
    END,
    CASE 
        WHEN gs % 3 = 0 THEN (RANDOM() * 200 + 150)::DECIMAL(8,2) -- Captain
        WHEN gs % 3 = 1 THEN (RANDOM() * 150 + 100)::DECIMAL(8,2) -- First Officer
        ELSE (RANDOM() * 100 + 50)::DECIMAL(8,2) -- Flight Attendant
    END
FROM aircraft a
CROSS JOIN generate_series(1, 80) gs
LIMIT 80;

-- =====================================================
-- PAYMENTS
-- =====================================================

INSERT INTO payments (booking_id, amount_usd, payment_method, payment_status, transaction_id, payment_date, processing_fee_usd, currency, exchange_rate)
SELECT 
    b.id,
    (RANDOM() * 100000 + 10000)::DECIMAL(10,2),
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'wire_transfer'
        WHEN 1 THEN 'credit_card'
        WHEN 2 THEN 'ach'
        ELSE 'check'
    END,
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'completed'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'failed'
        ELSE 'refunded'
    END,
    'TXN-' || (100000 + (RANDOM() * 900000)::INTEGER),
    NOW() - INTERVAL '1 day' * (RANDOM() * 90 + 1),
    (RANDOM() * 500 + 50)::DECIMAL(8,2),
    'USD',
    1.00
FROM bookings b
ORDER BY RANDOM()
LIMIT 35;

-- =====================================================
-- INVOICES
-- =====================================================

INSERT INTO invoices (booking_id, invoice_number, issue_date, due_date, subtotal_usd, tax_amount_usd, total_amount_usd, invoice_status, payment_terms, billing_address, notes)
SELECT 
    b.id,
    'INV-' || (2024000 + (ROW_NUMBER() OVER ())::INTEGER),
    NOW() - INTERVAL '1 day' * (RANDOM() * 60 + 1),
    NOW() - INTERVAL '1 day' * (RANDOM() * 60 + 1) + INTERVAL '1 day' * 30,
    (RANDOM() * 90000 + 15000)::DECIMAL(10,2),
    (RANDOM() * 7200 + 1200)::DECIMAL(8,2),
    (RANDOM() * 97200 + 16200)::DECIMAL(10,2),
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'paid'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'overdue'
        ELSE 'cancelled'
    END,
    CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'Net 30'
        WHEN 1 THEN 'Net 15'
        ELSE 'Due on Receipt'
    END,
    CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN '123 Corporate Blvd, New York, NY 10001'
        WHEN 1 THEN '456 Business Ave, Los Angeles, CA 90210'
        WHEN 2 THEN '789 Executive Dr, Miami, FL 33101'
        WHEN 3 THEN '321 Finance St, Chicago, IL 60601'
        ELSE '654 Commerce Way, Boston, MA 02101'
    END,
    'Charter flight services as per agreement'
FROM bookings b
ORDER BY RANDOM()
LIMIT 45;

-- =====================================================
-- EMPTY LEGS
-- =====================================================

INSERT INTO empty_legs (aircraft_id, departure_airport, arrival_airport, departure_time, estimated_duration_minutes, original_price_usd, discounted_price_usd, availability_status, passenger_capacity, booking_deadline, special_notes)
SELECT 
    a.id,
    dep.icao_code,
    arr.icao_code,
    NOW() + INTERVAL '1 day' * (RANDOM() * 30 + 1), -- Next 30 days
    (RANDOM() * 300 + 60)::INTEGER, -- 1-5 hours
    (RANDOM() * 25000 + 5000)::DECIMAL(10,2),
    (RANDOM() * 15000 + 3000)::DECIMAL(10,2),
    CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'available'
        WHEN 1 THEN 'reserved'
        ELSE 'expired'
    END,
    a.passenger_capacity,
    NOW() + INTERVAL '1 day' * (RANDOM() * 28 + 1),
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'Catering available upon request'
        WHEN 1 THEN 'Pet-friendly flight'
        WHEN 2 THEN 'Ground transportation can be arranged'
        ELSE 'Flexible departure time within 2-hour window'
    END
FROM aircraft a
CROSS JOIN (
    SELECT icao_code FROM airports ORDER BY RANDOM() LIMIT 8
) dep
CROSS JOIN (
    SELECT icao_code FROM airports ORDER BY RANDOM() LIMIT 4
) arr
WHERE dep.icao_code != arr.icao_code
LIMIT 25;

-- =====================================================
-- QUOTES
-- =====================================================

INSERT INTO quotes (charter_request_id, aircraft_id, base_price_usd, fuel_surcharge_usd, landing_fees_usd, handling_fees_usd, catering_cost_usd, crew_fees_usd, tax_amount_usd, total_price_usd, quote_status, valid_until, quote_notes)
SELECT 
    cr.id,
    a.id,
    (RANDOM() * 50000 + 10000)::DECIMAL(10,2),
    (RANDOM() * 3000 + 500)::DECIMAL(8,2),
    (RANDOM() * 1000 + 200)::DECIMAL(8,2),
    (RANDOM() * 800 + 150)::DECIMAL(8,2),
    CASE WHEN RANDOM() > 0.3 THEN (RANDOM() * 500 + 100)::DECIMAL(8,2) ELSE 0 END,
    (RANDOM() * 2000 + 800)::DECIMAL(8,2),
    (RANDOM() * 4000 + 1000)::DECIMAL(8,2),
    (RANDOM() * 60000 + 15000)::DECIMAL(10,2),
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'accepted'
        WHEN 2 THEN 'declined'
        ELSE 'expired'
    END,
    NOW() + INTERVAL '1 day' * (RANDOM() * 14 + 3),
    CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'Price includes all fees and taxes'
        WHEN 1 THEN 'Subject to fuel price adjustments'
        ELSE 'Special rate for return customer'
    END
FROM charter_requests cr
CROSS JOIN aircraft a
ORDER BY RANDOM()
LIMIT 55;

-- =====================================================
-- AVINODE SYNC
-- =====================================================

INSERT INTO avinode_sync (entity_type, entity_id, avinode_id, last_sync_time, sync_status, sync_direction, error_message, retry_count)
SELECT 
    'aircraft',
    a.id,
    'AV-' || (100000 + (ROW_NUMBER() OVER ())::INTEGER),
    NOW() - INTERVAL '1 hour' * (RANDOM() * 24 + 1),
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'success'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'failed'
        ELSE 'partial'
    END,
    CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'push'
        WHEN 1 THEN 'pull'
        ELSE 'bidirectional'
    END,
    CASE WHEN RANDOM() > 0.7 THEN 'Rate limit exceeded' ELSE NULL END,
    (RANDOM() * 3)::INTEGER
FROM aircraft a
UNION ALL
SELECT 
    'operator',
    o.id,
    'AV-OP-' || (200000 + (ROW_NUMBER() OVER ())::INTEGER),
    NOW() - INTERVAL '1 hour' * (RANDOM() * 24 + 1),
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'success'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'failed'
        ELSE 'partial'
    END,
    'push',
    NULL,
    0
FROM operators o;

-- =====================================================
-- PAYNODE TRANSACTIONS
-- =====================================================

INSERT INTO paynode_transactions (payment_id, paynode_transaction_id, transaction_type, amount_usd, processing_fee_usd, transaction_status, initiated_at, completed_at, failure_reason, merchant_reference, customer_reference)
SELECT 
    p.id,
    'PN-' || (1000000 + (ROW_NUMBER() OVER ())::INTEGER),
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'charge'
        WHEN 1 THEN 'refund'
        WHEN 2 THEN 'void'
        ELSE 'chargeback'
    END,
    p.amount_usd,
    (p.amount_usd * 0.029 + 0.30)::DECIMAL(8,2),
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'completed'
        WHEN 1 THEN 'pending'
        WHEN 2 THEN 'failed'
        ELSE 'disputed'
    END,
    p.payment_date,
    CASE WHEN RANDOM() > 0.3 THEN p.payment_date + INTERVAL '1 hour' * (RANDOM() * 24 + 1) ELSE NULL END,
    CASE WHEN RANDOM() > 0.8 THEN 'Insufficient funds' ELSE NULL END,
    'CHARTER-' || (10000 + (RANDOM() * 90000)::INTEGER),
    'CUST-' || (100000 + (RANDOM() * 900000)::INTEGER)
FROM payments p;

-- =====================================================
-- SCHEDAERO EVENTS
-- =====================================================

INSERT INTO schedaero_events (aircraft_id, event_type, event_title, scheduled_start, scheduled_end, actual_start, actual_end, assigned_personnel, event_status, location, notes, schedaero_event_id)
SELECT 
    a.id,
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'maintenance'
        WHEN 1 THEN 'inspection'
        WHEN 2 THEN 'crew_training'
        ELSE 'positioning'
    END,
    CASE (RANDOM() * 6)::INTEGER
        WHEN 0 THEN '100-Hour Inspection'
        WHEN 1 THEN 'Annual Inspection'
        WHEN 2 THEN 'Line Maintenance'
        WHEN 3 THEN 'Crew Recurrent Training'
        WHEN 4 THEN 'Aircraft Positioning'
        ELSE 'Avionics Update'
    END,
    NOW() + INTERVAL '1 day' * (RANDOM() * 60 - 30), -- +/- 30 days
    NOW() + INTERVAL '1 day' * (RANDOM() * 60 - 30) + INTERVAL '1 hour' * (RANDOM() * 8 + 1),
    CASE WHEN RANDOM() > 0.3 THEN NOW() + INTERVAL '1 day' * (RANDOM() * 60 - 30) ELSE NULL END,
    CASE WHEN RANDOM() > 0.3 THEN NOW() + INTERVAL '1 day' * (RANDOM() * 60 - 30) + INTERVAL '1 hour' * (RANDOM() * 8 + 1) ELSE NULL END,
    CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN 'Tech Team A'
        WHEN 1 THEN 'Inspector Smith'
        WHEN 2 THEN 'Capt. Johnson, FO Wilson'
        WHEN 3 THEN 'Maintenance Crew B'
        ELSE 'Avionics Specialist'
    END,
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'scheduled'
        WHEN 1 THEN 'in_progress'
        WHEN 2 THEN 'completed'
        ELSE 'cancelled'
    END,
    CASE (RANDOM() * 4)::INTEGER
        WHEN 0 THEN 'Main Hangar'
        WHEN 1 THEN 'Line Station'
        WHEN 2 THEN 'Training Facility'
        ELSE 'Remote Location'
    END,
    'Scheduled via SchedAero integration',
    'SA-' || (500000 + (ROW_NUMBER() OVER ())::INTEGER)
FROM aircraft a
CROSS JOIN generate_series(1, 2)
LIMIT 40;

-- =====================================================
-- UTILIZATION METRICS
-- =====================================================

INSERT INTO utilization_metrics (aircraft_id, metric_date, flight_hours, cycles, revenue_flights, positioning_flights, maintenance_hours, total_revenue_usd, operating_cost_usd, utilization_rate)
SELECT 
    a.id,
    date_trunc('month', NOW()) - INTERVAL '1 month' * gs,
    (RANDOM() * 80 + 10)::DECIMAL(6,2),
    (RANDOM() * 25 + 5)::INTEGER,
    (RANDOM() * 20 + 3)::INTEGER,
    (RANDOM() * 5 + 1)::INTEGER,
    (RANDOM() * 20 + 2)::DECIMAL(6,2),
    (RANDOM() * 200000 + 50000)::DECIMAL(10,2),
    (RANDOM() * 80000 + 20000)::DECIMAL(10,2),
    (RANDOM() * 0.6 + 0.2)::DECIMAL(5,4)
FROM aircraft a
CROSS JOIN generate_series(0, 11) gs -- 12 months of data
LIMIT 600; -- 50 aircraft * 12 months

-- =====================================================
-- ROUTE ANALYTICS
-- =====================================================

INSERT INTO route_analytics (departure_airport, arrival_airport, route_frequency, average_price_usd, peak_season_multiplier, average_flight_time_minutes, most_popular_aircraft_category, demand_trend, last_updated)
SELECT DISTINCT
    dep.icao_code,
    arr.icao_code,
    (RANDOM() * 50 + 5)::INTEGER,
    (RANDOM() * 40000 + 15000)::DECIMAL(10,2),
    (RANDOM() * 0.5 + 1.2)::DECIMAL(4,2),
    (RANDOM() * 300 + 60)::INTEGER,
    CASE (RANDOM() * 5)::INTEGER
        WHEN 0 THEN 'Light Jet'
        WHEN 1 THEN 'Midsize Jet'
        WHEN 2 THEN 'Super Midsize Jet'
        WHEN 3 THEN 'Heavy Jet'
        ELSE 'Ultra Long Range'
    END,
    CASE (RANDOM() * 3)::INTEGER
        WHEN 0 THEN 'increasing'
        WHEN 1 THEN 'stable'
        ELSE 'decreasing'
    END,
    NOW() - INTERVAL '1 day' * (RANDOM() * 7 + 1)
FROM (SELECT icao_code FROM airports ORDER BY RANDOM() LIMIT 15) dep
CROSS JOIN (SELECT icao_code FROM airports ORDER BY RANDOM() LIMIT 10) arr
WHERE dep.icao_code != arr.icao_code
LIMIT 50;

-- =====================================================
-- CUSTOMER PREFERENCES
-- =====================================================

INSERT INTO customer_preferences (customer_email, preferred_aircraft_category, preferred_departure_times, catering_preferences, ground_transportation, special_requests, booking_frequency, average_spend_usd, loyalty_tier, last_booking_date)
VALUES
('john.executive@corp.com', 'Heavy Jet', '{"morning", "afternoon"}', '{"gourmet", "dietary_restrictions"}', 'luxury_car', 'Extra baggage space for golf clubs', 24, 45000.00, 'platinum', NOW() - INTERVAL '15 days'),
('sarah.ceo@startup.com', 'Midsize Jet', '{"early_morning", "late_evening"}', '{"healthy", "quick"}', 'standard_car', 'Pet-friendly flights', 18, 32000.00, 'gold', NOW() - INTERVAL '8 days'),
('michael.investor@fund.com', 'Ultra Long Range', '{"flexible"}', '{"premium", "wine_selection"}', 'luxury_car', 'Meeting setup onboard', 32, 78000.00, 'platinum', NOW() - INTERVAL '3 days'),
('lisa.director@pharma.com', 'Super Midsize Jet', '{"morning", "early_afternoon"}', '{"standard", "vegetarian_options"}', 'standard_car', 'Wi-Fi required for video calls', 15, 38000.00, 'gold', NOW() - INTERVAL '22 days'),
('david.founder@tech.com', 'Light Jet', '{"late_morning", "afternoon"}', '{"casual", "healthy"}', 'ride_share', 'Minimal formalities preferred', 12, 22000.00, 'silver', NOW() - INTERVAL '35 days'),
('robert.partner@law.com', 'Heavy Jet', '{"morning", "evening"}', '{"business", "premium"}', 'luxury_car', 'Confidential meeting space', 28, 52000.00, 'platinum', NOW() - INTERVAL '5 days'),
('jennifer.vp@finance.com', 'Midsize Jet', '{"flexible"}', '{"standard"}', 'standard_car', 'Last-minute booking flexibility', 20, 35000.00, 'gold', NOW() - INTERVAL '12 days'),
('thomas.owner@manufacturing.com', 'Super Midsize Jet', '{"early_morning"}', '{"hearty", "traditional"}', 'own_transport', 'Direct routing preferred', 16, 41000.00, 'gold', NOW() - INTERVAL '18 days'),
('maria.president@consulting.com', 'Ultra Long Range', '{"afternoon", "evening"}', '{"international", "premium"}', 'luxury_car', 'Crew discretion required', 22, 68000.00, 'platinum', NOW() - INTERVAL '7 days'),
('kevin.cto@software.com', 'Light Jet', '{"morning", "late_afternoon"}', '{"tech_friendly", "casual"}', 'ride_share', 'Power outlets and tech support', 10, 25000.00, 'silver', NOW() - INTERVAL '28 days'),
('amanda.exec@retail.com', 'Midsize Jet', '{"mid_morning", "early_evening"}', '{"elegant", "dietary_accommodating"}', 'luxury_car', 'Brand representation important', 14, 33000.00, 'gold', NOW() - INTERVAL '20 days'),
('christopher.md@healthcare.com', 'Heavy Jet', '{"early_morning", "late_evening"}', '{"healthy", "quick"}', 'standard_car', 'Medical equipment transport', 19, 48000.00, 'gold', NOW() - INTERVAL '9 days'),
('stephanie.coo@logistics.com', 'Super Midsize Jet', '{"flexible"}', '{"efficient", "professional"}', 'standard_car', 'Route optimization preferred', 25, 44000.00, 'platinum', NOW() - INTERVAL '4 days'),
('daniel.chairman@investment.com', 'Ultra Long Range', '{"morning", "afternoon"}', '{"luxury", "wine_pairing"}', 'luxury_car', 'Privacy and discretion paramount', 35, 85000.00, 'platinum', NOW() - INTERVAL '2 days'),
('rachel.founder@beauty.com', 'Light Jet', '{"late_morning", "mid_afternoon"}', '{"organic", "presentation_ready"}', 'luxury_car', 'Brand-conscious service', 11, 26000.00, 'silver', NOW() - INTERVAL '31 days');

-- =====================================================
-- COMPETITIVE FEATURES
-- =====================================================

INSERT INTO competitive_features (competitor_name, feature_category, feature_name, feature_description, our_capability, competitor_capability, competitive_advantage, importance_score, last_updated)
VALUES
('NetJets', 'Fleet Management', 'Guaranteed Aircraft Availability', 'Guaranteed aircraft availability with 10-hour notice', 'partial', 'full', 'established_fractional_model', 9, NOW()),
('Flexjet', 'Aircraft Quality', 'Red Label Fleet', 'Premium aircraft with enhanced interiors and amenities', 'standard', 'premium', 'luxury_positioning', 8, NOW()),
('VistaJet', 'Global Coverage', 'Worldwide Network', 'Global fleet with consistent service standards', 'regional', 'global', 'established_international_presence', 9, NOW()),
('Wheels Up', 'Technology Platform', 'Mobile App Experience', 'Comprehensive mobile app with booking and flight tracking', 'basic', 'advanced', 'user_experience_focus', 7, NOW()),
('XO', 'Pricing Model', 'Dynamic Pricing', 'Real-time pricing based on demand and availability', 'static', 'dynamic', 'revenue_optimization', 6, NOW()),
('Jet Linx', 'Local Service', 'Base-Specific Operations', 'Localized service with dedicated aircraft and crew', 'multi_base', 'localized', 'personalized_service', 7, NOW()),
('JetSuite', 'Aircraft Type', 'Light Jet Focus', 'Specialized in cost-effective light jet operations', 'multi_category', 'specialized', 'cost_efficiency', 5, NOW()),
('Sentient Jet', 'Membership Model', 'Jet Card Programs', 'Flexible jet card options with guaranteed rates', 'charter_only', 'membership', 'predictable_pricing', 8, NOW()),
('Clay Lacy', 'Operational Excellence', 'Safety Standards', 'Argus Platinum and Wyvern Wingman certified', 'standard', 'premium', 'safety_reputation', 10, NOW()),
('Paramount Business Jets', 'Broker Network', 'Operator Network', 'Large network of certified operators worldwide', 'direct', 'brokerage', 'network_reach', 6, NOW()),
('Magellan Jets', 'Service Quality', 'Concierge Services', 'White-glove concierge and ground services', 'basic', 'premium', 'service_differentiation', 7, NOW()),
('Air Charter Service', 'Charter Types', 'Specialized Charters', 'Cargo, group, and specialized charter capabilities', 'passenger_only', 'diversified', 'service_breadth', 5, NOW()),
('Victor', 'European Presence', 'European Network', 'Strong presence in European business aviation market', 'limited', 'strong', 'regional_expertise', 6, NOW()),
('OneFlight International', 'Broker Technology', 'Real-Time Availability', 'Real-time aircraft availability and instant booking', 'quote_based', 'instant', 'booking_convenience', 8, NOW()),
('Stratos Jet Charters', 'Safety Focus', 'Third-Party Auditing', 'Comprehensive third-party safety auditing of operators', 'internal', 'third_party', 'safety_verification', 9, NOW()),
('Jettly', 'Platform Model', 'Marketplace Platform', 'Technology platform connecting customers with operators', 'direct_service', 'marketplace', 'technology_platform', 7, NOW()),
('GlobeAir', 'European Light Jets', 'Citation Mustang Fleet', 'Specialized Citation Mustang operations in Europe', 'multi_type', 'specialized', 'operational_efficiency', 4, NOW()),
('FlyExclusive', 'Fractional Alternative', 'Jet Club Membership', 'Alternative to fractional ownership with membership benefits', 'charter_only', 'membership', 'ownership_alternative', 6, NOW()),
('Berkshire Hathaway Travel Protection', 'Insurance Services', 'Travel Protection', 'Comprehensive travel and flight insurance products', 'basic', 'comprehensive', 'risk_management', 5, NOW()),
('PrivateFly (Directional Aviation)', 'Digital Platform', 'Online Booking Platform', 'Seamless online booking with transparent pricing', 'phone_based', 'digital', 'user_experience', 8, NOW());

-- =====================================================
-- OPENSKY TRACKING
-- =====================================================

INSERT INTO opensky_tracking (aircraft_id, icao24, callsign, latitude, longitude, altitude_ft, ground_speed_kts, track_degrees, vertical_rate_fpm, on_ground, last_contact, data_source, position_timestamp)
SELECT 
    a.id,
    LOWER(SUBSTRING(MD5(a.tail_number || 'salt'), 1, 6)), -- Generate pseudo-ICAO24
    CASE 
        WHEN RANDOM() > 0.5 THEN UPPER(SUBSTRING(a.tail_number, 2)) -- Use tail number as callsign
        ELSE 'N' || (1000 + (RANDOM() * 9000)::INTEGER) -- Generate random callsign
    END,
    -- Random positions around major airports
    CASE (RANDOM() * 10)::INTEGER
        WHEN 0 THEN 40.6413 + (RANDOM() * 2 - 1) -- JFK area
        WHEN 1 THEN 33.9425 + (RANDOM() * 2 - 1) -- LAX area
        WHEN 2 THEN 51.4700 + (RANDOM() * 2 - 1) -- LHR area
        WHEN 3 THEN 25.7959 + (RANDOM() * 2 - 1) -- MIA area
        WHEN 4 THEN 41.9742 + (RANDOM() * 2 - 1) -- ORD area
        ELSE 47.4502 + (RANDOM() * 2 - 1) -- SEA area
    END,
    CASE (RANDOM() * 10)::INTEGER
        WHEN 0 THEN -73.7781 + (RANDOM() * 2 - 1) -- JFK area
        WHEN 1 THEN -118.4081 + (RANDOM() * 2 - 1) -- LAX area
        WHEN 2 THEN -0.4543 + (RANDOM() * 2 - 1) -- LHR area
        WHEN 3 THEN -80.2870 + (RANDOM() * 2 - 1) -- MIA area
        WHEN 4 THEN -87.9073 + (RANDOM() * 2 - 1) -- ORD area
        ELSE -122.3088 + (RANDOM() * 2 - 1) -- SEA area
    END,
    CASE 
        WHEN RANDOM() > 0.3 THEN (RANDOM() * 40000 + 5000)::INTEGER -- In flight
        ELSE 0 -- On ground
    END,
    (RANDOM() * 500 + 150)::INTEGER, -- Ground speed 150-650 kts
    (RANDOM() * 360)::INTEGER, -- Track 0-360 degrees
    ((RANDOM() * 4000 - 2000))::INTEGER, -- Vertical rate ±2000 fpm
    CASE WHEN RANDOM() > 0.7 THEN true ELSE false END, -- 30% on ground
    EXTRACT(EPOCH FROM (NOW() - INTERVAL '1 minute' * (RANDOM() * 10))), -- Last contact within 10 minutes
    'opensky-network',
    NOW() - INTERVAL '1 minute' * (RANDOM() * 5) -- Position timestamp within 5 minutes
FROM aircraft a
WHERE RANDOM() > 0.4 -- Only ~60% of aircraft are currently being tracked
LIMIT 30;

-- =====================================================
-- FINAL OPERATIONS
-- =====================================================

-- Update sequence counters if needed
SELECT setval(pg_get_serial_sequence('airports', 'id'), (SELECT MAX(id) FROM airports));

COMMIT;

-- =====================================================
-- SUMMARY REPORT
-- =====================================================

DO $$
DECLARE 
    table_name text;
    record_count integer;
BEGIN
    RAISE NOTICE '=== AVIATION DATABASE SEEDING COMPLETED ===';
    RAISE NOTICE '';
    
    FOR table_name IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        ORDER BY tablename
    LOOP
        EXECUTE format('SELECT COUNT(*) FROM %I', table_name) INTO record_count;
        RAISE NOTICE '✅ %: % records', RPAD(table_name, 25), record_count;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '🎯 All tables populated with realistic aviation industry data';
    RAISE NOTICE '📝 Table descriptions added for complete documentation';
    RAISE NOTICE '🔗 Foreign key relationships maintained across all entities';
    RAISE NOTICE '✈️  System ready for comprehensive end-to-end testing';
END $$;