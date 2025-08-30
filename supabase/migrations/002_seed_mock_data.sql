-- Avinode MCP Server Database Seed Data
-- Migration 002: Populate tables with realistic mock data

-- ===================================
-- SEED OPERATORS DATA
-- ===================================

INSERT INTO operators (
    id, name, certificate, established, headquarters, operating_bases, fleet_size,
    safety_rating, insurance, certifications, contact_email, contact_phone, website, description
) VALUES
('OP001', 'JetVision Charter', 'Part 135 (DOT-JV123456)', 2010, 'Teterboro, NJ', 
 ARRAY['KTEB', 'KJFK', 'KBOS', 'KPBI'], 15, 'ARGUS Gold', '$100M liability coverage',
 ARRAY['ARGUS Gold', 'IS-BAO Stage 2', 'NBAA Certified'],
 'charter@jetvision.com', '+1-201-555-JETS', 'www.jetvision.com',
 'Premier charter operator based in the New York metropolitan area, specializing in business aviation services.'),

('OP002', 'Elite Aviation', 'Part 135 (DOT-EA789012)', 2005, 'Las Vegas, NV',
 ARRAY['KLAS', 'KLAX', 'KPHX', 'KSJC'], 18, 'ARGUS Gold', '$150M liability coverage',
 ARRAY['ARGUS Gold', 'Wyvern Wingman', 'IS-BAO Stage 3'],
 'ops@eliteaviation.net', '+1-702-555-ELITE', 'www.eliteaviation.net',
 'West Coast charter specialist offering midsize and super-midsize aircraft for business and leisure travel.'),

('OP003', 'Prestige Air', 'Part 135 (DOT-PA345678)', 2012, 'Los Angeles, CA',
 ARRAY['KLAX', 'KBUR', 'KSNA', 'KLAS'], 25, 'ARGUS Platinum', '$200M liability coverage',
 ARRAY['ARGUS Platinum', 'Wyvern Wingman', 'IS-BAO Stage 3'],
 'info@prestigeair.com', '+1-888-PRESTIGE', 'www.prestigeair.com',
 'West Coast''s premier charter operator offering super-midsize and large cabin aircraft for discerning travelers.'),

('OP004', 'Global Jets', 'Part 135 (DOT-GJ901234)', 2003, 'New York, NY',
 ARRAY['KTEB', 'KJFK', 'KIAD', 'KBOS', 'EGLL', 'LFPB'], 30, 'ARGUS Platinum', '$300M liability coverage',
 ARRAY['ARGUS Platinum', 'IS-BAO Stage 3', 'EASA Certified'],
 'charter@globaljets.aero', '+1-800-GLOBAL-J', 'www.globaljets.aero',
 'International charter operator with transatlantic capabilities and a fleet of heavy jets for global travel.'),

('OP005', 'Luxury Wings', 'Part 135 (DOT-LW567890)', 2015, 'Miami, FL',
 ARRAY['KMIA', 'KLAX', 'KTEB', 'LFPB', 'OMDB'], 10, 'ARGUS Platinum', '$500M liability coverage',
 ARRAY['ARGUS Platinum', 'IS-BAO Stage 3', 'NBAA Certified'],
 'concierge@luxurywings.com', '+1-888-LUX-WING', 'www.luxurywings.com',
 'Ultra-luxury charter operator specializing in ultra-long-range aircraft for the most demanding international travelers.');

-- ===================================
-- SEED AIRCRAFT DATA
-- ===================================

INSERT INTO aircraft (
    id, registration_number, model, manufacturer, category, subcategory,
    year_of_manufacture, max_passengers, cruise_speed, range, hourly_rate,
    operator_id, operator_name, base_airport, availability,
    amenities, images, certifications, wifi_available, pet_friendly, smoking_allowed
) VALUES
-- Light Jets
('ACF001', 'N123JV', 'Citation CJ3+', 'Cessna', 'Light Jet', 'Light Jet', 2019, 7, 478, 2040, 3500.00,
 'OP001', 'JetVision Charter', 'KTEB', 'Available',
 ARRAY['WiFi', 'Refreshment Center', 'Lavatory', 'Baggage Compartment'],
 ARRAY['/images/cj3plus.jpg'], ARRAY['ARGUS Gold', 'IS-BAO Stage 2'], true, true, false),

('ACF002', 'N456JV', 'Phenom 300E', 'Embraer', 'Light Jet', 'Light Jet', 2021, 8, 464, 2010, 3800.00,
 'OP001', 'JetVision Charter', 'KTEB', 'Available',
 ARRAY['WiFi', 'Refreshment Center', 'Lavatory', 'Entertainment System'],
 ARRAY['/images/phenom300e.jpg'], ARRAY['ARGUS Gold', 'IS-BAO Stage 2'], true, true, false),

-- Midsize Jets
('ACF003', 'N789EA', 'Citation XLS+', 'Cessna', 'Midsize Jet', 'Midsize Jet', 2018, 9, 441, 2100, 4200.00,
 'OP002', 'Elite Aviation', 'KLAS', 'Available',
 ARRAY['WiFi', 'Full Galley', 'Enclosed Lavatory', 'Conference Seating'],
 ARRAY['/images/xls_plus.jpg'], ARRAY['ARGUS Gold', 'Wyvern Wingman'], true, true, false),

('ACF004', 'N012EA', 'Hawker 900XP', 'Hawker Beechcraft', 'Midsize Jet', 'Midsize Jet', 2017, 8, 450, 2540, 4500.00,
 'OP002', 'Elite Aviation', 'KLAS', 'OnRequest',
 ARRAY['WiFi', 'Full Galley', 'Enclosed Lavatory', 'Entertainment System'],
 ARRAY['/images/hawker900xp.jpg'], ARRAY['ARGUS Gold', 'Wyvern Wingman'], true, false, false),

-- Super Midsize Jets
('ACF005', 'N345PA', 'Citation Sovereign+', 'Cessna', 'Super Midsize Jet', 'Super Midsize Jet', 2020, 12, 460, 3200, 5500.00,
 'OP003', 'Prestige Air', 'KLAX', 'Available',
 ARRAY['WiFi', 'Full Galley', 'Enclosed Lavatory', 'Conference Table', 'Entertainment System'],
 ARRAY['/images/sovereign_plus.jpg'], ARRAY['ARGUS Platinum', 'Wyvern Wingman'], true, true, false),

('ACF006', 'N678PA', 'Challenger 350', 'Bombardier', 'Super Midsize Jet', 'Super Midsize Jet', 2019, 10, 470, 3200, 5800.00,
 'OP003', 'Prestige Air', 'KLAX', 'Available',
 ARRAY['WiFi', 'Full Galley', 'Enclosed Lavatory', 'Conference Seating', 'Satellite Phone'],
 ARRAY['/images/challenger350.jpg'], ARRAY['ARGUS Platinum', 'Wyvern Wingman'], true, true, false),

-- Heavy Jets
('ACF007', 'N901GJ', 'Gulfstream G450', 'Gulfstream', 'Heavy Jet', 'Heavy Jet', 2016, 14, 476, 4350, 7500.00,
 'OP004', 'Global Jets', 'KTEB', 'Available',
 ARRAY['WiFi', 'Full Galley', 'Private Lavatory', 'Conference Room', 'Satellite Communication'],
 ARRAY['/images/g450.jpg'], ARRAY['ARGUS Platinum', 'IS-BAO Stage 3'], true, true, false),

('ACF008', 'N234GJ', 'Gulfstream G550', 'Gulfstream', 'Heavy Jet', 'Heavy Jet', 2018, 16, 488, 6750, 8500.00,
 'OP004', 'Global Jets', 'KTEB', 'Available',
 ARRAY['WiFi', 'Full Galley', 'Private Lavatory', 'Conference Room', 'Satellite Communication', 'Bedroom'],
 ARRAY['/images/g550.jpg'], ARRAY['ARGUS Platinum', 'IS-BAO Stage 3'], true, true, false),

-- Ultra Long Range
('ACF009', 'N567LW', 'Global 7500', 'Bombardier', 'Ultra Long Range', 'Ultra Long Range', 2022, 19, 488, 7700, 12000.00,
 'OP005', 'Luxury Wings', 'KMIA', 'Available',
 ARRAY['WiFi', 'Full Kitchen', 'Multiple Lavatories', 'Master Bedroom', 'Conference Room', 'Entertainment Suite'],
 ARRAY['/images/global7500.jpg'], ARRAY['ARGUS Platinum', 'IS-BAO Stage 3'], true, true, false),

('ACF010', 'N890LW', 'Gulfstream G650ER', 'Gulfstream', 'Ultra Long Range', 'Ultra Long Range', 2021, 18, 516, 7500, 13500.00,
 'OP005', 'Luxury Wings', 'KMIA', 'OnRequest',
 ARRAY['WiFi', 'Full Kitchen', 'Multiple Lavatories', 'Master Bedroom', 'Conference Room', 'Shower', 'Entertainment Suite'],
 ARRAY['/images/g650er.jpg'], ARRAY['ARGUS Platinum', 'IS-BAO Stage 3'], true, true, false);

-- ===================================
-- SEED FLIGHT LEGS DATA (Empty Legs)
-- ===================================

INSERT INTO flight_legs (
    id, aircraft_id, departure_airport, arrival_airport, departure_date, departure_time,
    arrival_date, arrival_time, flight_time, distance, status, price, currency, type
) VALUES
('LEG001', 'ACF001', 'KTEB', 'KPBI', '2024-03-20', '10:00', '2024-03-20', '12:45', 2.75, 1065, 'Available', 8500.00, 'USD', 'EmptyLeg'),
('LEG002', 'ACF007', 'KLAX', 'KJFK', '2024-03-22', '14:00', '2024-03-22', '22:00', 5.0, 2475, 'Available', 25000.00, 'USD', 'EmptyLeg'),
('LEG003', 'ACF005', 'KMIA', 'KLAS', '2024-03-25', '09:00', '2024-03-25', '11:30', 4.5, 2174, 'Available', 18000.00, 'USD', 'EmptyLeg'),
('LEG004', 'ACF002', 'KBOS', 'KMIA', '2024-03-28', '15:30', '2024-03-28', '18:45', 3.25, 1255, 'Available', 12500.00, 'USD', 'EmptyLeg'),
('LEG005', 'ACF003', 'KJFK', 'KORD', '2024-04-02', '11:00', '2024-04-02', '13:15', 2.25, 740, 'Available', 9500.00, 'USD', 'EmptyLeg'),
('LEG006', 'ACF008', 'KLAS', 'KIAD', '2024-04-05', '16:00', '2024-04-05', '23:30', 4.5, 2100, 'Available', 32000.00, 'USD', 'EmptyLeg'),
('LEG007', 'ACF006', 'KPBI', 'KTEB', '2024-04-08', '08:00', '2024-04-08', '10:45', 2.75, 1065, 'Available', 15000.00, 'USD', 'EmptyLeg'),
('LEG008', 'ACF009', 'KMIA', 'LFPG', '2024-04-12', '20:00', '2024-04-13', '11:00', 8.0, 4430, 'Available', 85000.00, 'USD', 'EmptyLeg'),
('LEG009', 'ACF004', 'KPHX', 'KBOS', '2024-04-15', '13:00', '2024-04-15', '19:45', 4.75, 2300, 'Available', 21000.00, 'USD', 'EmptyLeg'),
('LEG010', 'ACF010', 'KTEB', 'EGLL', '2024-04-18', '22:00', '2024-04-19', '09:00', 7.0, 3450, 'Available', 95000.00, 'USD', 'EmptyLeg');

-- ===================================
-- SEED SAMPLE CHARTER REQUESTS
-- ===================================

INSERT INTO charter_requests (
    id, aircraft_id, operator_id, departure_airport, arrival_airport, departure_date, departure_time,
    return_date, return_time, passengers, contact_name, contact_email, contact_phone,
    company, special_requests, status
) VALUES
('REQ001', 'ACF001', 'OP001', 'KTEB', 'KBOS', '2024-04-20', '09:00', '2024-04-22', '17:00', 4,
 'John Smith', 'john.smith@businesscorp.com', '+1-212-555-0123', 'Business Corp',
 'Ground transportation arranged', 'Pending'),

('REQ002', 'ACF005', 'OP003', 'KLAX', 'KLAS', '2024-05-01', '14:30', NULL, NULL, 8,
 'Sarah Johnson', 'sarah.johnson@techstart.io', '+1-310-555-0456', 'TechStart Inc',
 'Catering for 8, vegetarian options', 'Confirmed'),

('REQ003', 'ACF007', 'OP004', 'KJFK', 'EGLL', '2024-05-15', '18:00', '2024-05-20', '10:00', 12,
 'Michael Brown', 'mbrown@globalfirm.com', '+1-646-555-0789', 'Global Firm LLC',
 'International travel, customs assistance needed', 'Pending');

-- ===================================
-- SEED SAMPLE PRICING QUOTES
-- ===================================

INSERT INTO pricing_quotes (
    id, request_id, aircraft_id, total_price, currency, price_breakdown,
    valid_until, terms, cancellation_policy
) VALUES
('QT001', 'REQ001', 'ACF001', 19250.00, 'USD', 
 '{"flightHours": 5.5, "hourlyRate": 3500, "baseCost": 19250, "fuelSurcharge": 1443.75, "landingFees": 1200, "handlingFees": 800, "catering": 1050, "crewFees": 1500, "overnightFees": 0, "deicingFees": 0, "taxes": 2019.54, "discount": 0}',
 '2024-04-25 23:59:59+00', 
 ARRAY['20% deposit required within 48 hours', 'Balance due 24 hours before departure', 'All prices subject to fuel surcharge adjustments'],
 'Standard industry cancellation policy applies'),

('QT002', 'REQ002', 'ACF005', 24750.00, 'USD',
 '{"flightHours": 4.5, "hourlyRate": 5500, "baseCost": 24750, "fuelSurcharge": 1856.25, "landingFees": 1000, "handlingFees": 600, "catering": 1600, "crewFees": 1800, "overnightFees": 0, "deicingFees": 0, "taxes": 2599.50, "discount": 0}',
 '2024-05-06 23:59:59+00',
 ARRAY['25% deposit required within 24 hours', 'Balance due 48 hours before departure', 'Catering charges additional'],
 'Cancellation within 7 days: 50% penalty; within 48 hours: 100% penalty'),

('QT003', 'REQ003', 'ACF007', 67500.00, 'USD',
 '{"flightHours": 9.0, "hourlyRate": 7500, "baseCost": 67500, "fuelSurcharge": 5062.50, "landingFees": 2500, "handlingFees": 1500, "catering": 2400, "crewFees": 3000, "overnightFees": 2500, "deicingFees": 0, "taxes": 7087.50, "discount": 0}',
 '2024-05-20 23:59:59+00',
 ARRAY['30% deposit required within 72 hours', 'Balance due 72 hours before departure', 'International handling fees included', 'Customs clearance assistance provided'],
 'International flights: cancellation within 14 days: 25% penalty; within 7 days: 50% penalty; within 48 hours: 100% penalty');

-- ===================================
-- SEED SAMPLE BOOKINGS
-- ===================================

INSERT INTO bookings (
    id, quote_id, aircraft_id, operator_id, status, total_price, currency,
    payment_status, payment_method, deposit_amount, balance_amount,
    deposit_due_date, balance_due_date, passenger_info, special_requests
) VALUES
('BKG001', 'QT002', 'ACF005', 'OP003', 'Confirmed', 24750.00, 'USD',
 'DepositPaid', 'wire_transfer', 6187.50, 18562.50,
 '2024-04-26 23:59:59+00', '2024-04-29 23:59:59+00',
 '{"name": "Sarah Johnson", "email": "sarah.johnson@techstart.io", "phone": "+1-310-555-0456", "company": "TechStart Inc"}',
 'Catering for 8, vegetarian options'),

('BKG002', NULL, 'ACF001', 'OP001', 'Pending', 15750.00, 'USD',
 'Pending', NULL, 3150.00, 12600.00,
 '2024-05-10 23:59:59+00', '2024-05-13 23:59:59+00',
 '{"name": "Robert Wilson", "email": "rwilson@email.com", "phone": "+1-555-123-4567"}',
 'Pet transport required - small dog');

-- ===================================
-- SEED BOOKING LEGS RELATIONSHIPS
-- ===================================

-- Note: This would typically be populated when bookings are created with specific flight legs
-- For now, we'll add a few sample relationships

-- Sample booking leg for BKG001 (this would normally be created dynamically)
INSERT INTO flight_legs (
    id, aircraft_id, departure_airport, arrival_airport, departure_date, departure_time,
    arrival_date, arrival_time, flight_time, distance, status, price, currency, type
) VALUES
('LEG_BKG001', 'ACF005', 'KLAX', 'KLAS', '2024-05-01', '14:30', '2024-05-01', '15:45', 1.25, 236, 'Booked', 24750.00, 'USD', 'Charter');

INSERT INTO booking_legs (booking_id, flight_leg_id, leg_order) VALUES
('BKG001', 'LEG_BKG001', 1);

-- ===================================
-- UPDATE SEQUENCES AND STATISTICS
-- ===================================

-- Update table statistics for better query planning
ANALYZE operators;
ANALYZE aircraft;
ANALYZE flight_legs;
ANALYZE charter_requests;
ANALYZE pricing_quotes;
ANALYZE bookings;
ANALYZE booking_legs;

-- ===================================
-- VERIFICATION QUERIES
-- ===================================

-- Verify data was inserted correctly
DO $$
DECLARE
    operator_count INTEGER;
    aircraft_count INTEGER;
    flight_legs_count INTEGER;
    charter_requests_count INTEGER;
    pricing_quotes_count INTEGER;
    bookings_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO operator_count FROM operators;
    SELECT COUNT(*) INTO aircraft_count FROM aircraft;
    SELECT COUNT(*) INTO flight_legs_count FROM flight_legs;
    SELECT COUNT(*) INTO charter_requests_count FROM charter_requests;
    SELECT COUNT(*) INTO pricing_quotes_count FROM pricing_quotes;
    SELECT COUNT(*) INTO bookings_count FROM bookings;
    
    RAISE NOTICE 'Data seeding completed successfully:';
    RAISE NOTICE '  - Operators: %', operator_count;
    RAISE NOTICE '  - Aircraft: %', aircraft_count;
    RAISE NOTICE '  - Flight Legs: %', flight_legs_count;
    RAISE NOTICE '  - Charter Requests: %', charter_requests_count;
    RAISE NOTICE '  - Pricing Quotes: %', pricing_quotes_count;
    RAISE NOTICE '  - Bookings: %', bookings_count;
    
    -- Verify foreign key relationships
    IF NOT EXISTS (
        SELECT 1 FROM aircraft a 
        LEFT JOIN operators o ON a.operator_id = o.id 
        WHERE o.id IS NULL
    ) THEN
        RAISE NOTICE '  - All aircraft properly linked to operators ✓';
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM flight_legs fl 
        LEFT JOIN aircraft a ON fl.aircraft_id = a.id 
        WHERE a.id IS NULL
    ) THEN
        RAISE NOTICE '  - All flight legs properly linked to aircraft ✓';
    END IF;
    
    RAISE NOTICE 'Database seeding completed successfully! 🚁✈️';
END $$;