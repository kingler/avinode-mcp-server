-- Migration: Seed Bookings and Operational Data
-- Description: Bookings, transactions, flight legs, and operational records
-- Author: Claude Code Assistant  
-- Created: 2024-08-31
-- Dependencies: Requires customers and aircraft data to be seeded first

BEGIN;

-- ============================================================================
-- BOOKINGS DATA (Sample Comprehensive Booking Records)
-- ============================================================================

INSERT INTO bookings (id, user_id, aircraft_id, operator_id, status, departure_airport, arrival_airport, departure_date, departure_time, arrival_date, arrival_time, flight_duration, passenger_count, total_price, currency, payment_status, payment_method, deposit_amount, balance_amount, booking_date, special_requests, booking_reference, quote_id, confirmation_code, created_at) VALUES

-- COMPLETED BOOKINGS (Past flights - sample)
('b1000001-aaaa-bbbb-cccc-dddddddddddd', 'c1000001-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Completed', 'KJFK', 'EGLL', '2024-07-15', '10:00:00', '2024-07-15', '21:30:00', 7.5, 6, 95000.00, 'USD', 'FullyPaid', 'WireTransfer', 47500.00, 47500.00, '2024-06-15', 'VIP service, champagne on board, conference setup', 'RS-2024-001', NULL, 'RS6J15JFK', '2024-06-15T10:30:00Z'),

('b1000002-aaaa-bbbb-cccc-dddddddddddd', 'c2000001-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Completed', 'KSEA', 'KORD', '2024-06-20', '14:20:00', '2024-06-20', '19:15:00', 4.92, 4, 36500.00, 'USD', 'FullyPaid', 'CorporateCard', 18250.00, 18250.00, '2024-06-05', 'Corporate travel, WiFi required', 'TC-2024-006', NULL, 'TC4S20SEA', '2024-06-20T14:20:00Z'),

-- CONFIRMED BOOKINGS (Near future)  
('b2000001-bbbb-cccc-dddd-eeeeeeeeeeee', 'c1000007-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Confirmed', 'KHOU', 'KJFK', '2024-12-20', '08:00:00', '2024-12-20', '12:45:00', 4.75, 6, 58000.00, 'USD', 'DepositPaid', 'WireTransfer', 29000.00, 29000.00, '2024-12-06', 'Secure communications, executive office setup', 'ME-2024-031', NULL, 'ME6H20HOU', '2024-11-28T09:15:00Z'),

-- PENDING BOOKINGS (Future)
('b3000001-cccc-dddd-eeee-ffffffffffff', 'c2000008-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Pending', 'KORD', 'KBOS', '2025-01-15', '14:20:00', '2025-01-15', '16:55:00', 2.58, 4, 29500.00, 'USD', 'Pending', NULL, NULL, 29500.00, '2024-12-31', 'Privacy requirements, document security', 'WA-2025-001', NULL, 'PENDING001', '2024-12-08T14:30:00Z')

ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    aircraft_id = EXCLUDED.aircraft_id,
    operator_id = EXCLUDED.operator_id,
    status = EXCLUDED.status,
    departure_airport = EXCLUDED.departure_airport,
    arrival_airport = EXCLUDED.arrival_airport,
    departure_date = EXCLUDED.departure_date,
    departure_time = EXCLUDED.departure_time,
    arrival_date = EXCLUDED.arrival_date,
    arrival_time = EXCLUDED.arrival_time,
    flight_duration = EXCLUDED.flight_duration,
    passenger_count = EXCLUDED.passenger_count,
    total_price = EXCLUDED.total_price,
    currency = EXCLUDED.currency,
    payment_status = EXCLUDED.payment_status,
    payment_method = EXCLUDED.payment_method,
    deposit_amount = EXCLUDED.deposit_amount,
    balance_amount = EXCLUDED.balance_amount,
    booking_date = EXCLUDED.booking_date,
    special_requests = EXCLUDED.special_requests,
    booking_reference = EXCLUDED.booking_reference,
    quote_id = EXCLUDED.quote_id,
    confirmation_code = EXCLUDED.confirmation_code;

-- ============================================================================
-- FLIGHT OPERATIONS DATA
-- ============================================================================

INSERT INTO flight_legs (id, aircraft_id, departure_airport, arrival_airport, departure_date, departure_time, arrival_date, arrival_time, flight_time, distance, status, price, currency, leg_type, dynamic_pricing, instant_booking, special_offers, weather_alerts, demand_score, price_optimized) VALUES

-- Active In-Progress Flights
('fl001001-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', 'KJFK', 'EGLL', '2024-08-31', '14:30:00', '2024-09-01', '02:15:00', 7.75, 3459, 'InProgress', 89500.00, 'USD', 'Charter', true, false, '{"early_booking": 15}', '{"turbulence": "moderate"}', 0.89, true),

-- Available Empty Legs
('fl002001-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', 'KBOS', 'KMIA', '2024-09-01', '08:15:00', '2024-09-01', '12:30:00', 3.25, 1258, 'Available', 18500.00, 'USD', 'EmptyLeg', true, true, '{"empty_leg": 65}', '{}', 0.45, true),

-- Completed Recent Flights
('fl004001-4444-5555-6666-777777777777', '05c92852-911b-435d-be52-515fcf5b78fb', 'KSFO', 'KLAS', '2024-08-30', '13:20:00', '2024-08-30', '15:05:00', 1.75, 414, 'Completed', 19500.00, 'USD', 'Charter', true, false, '{"weekend": 8}', '{}', 0.68, true)

ON CONFLICT (id) DO UPDATE SET
    aircraft_id = EXCLUDED.aircraft_id,
    departure_airport = EXCLUDED.departure_airport,
    arrival_airport = EXCLUDED.arrival_airport,
    departure_date = EXCLUDED.departure_date,
    departure_time = EXCLUDED.departure_time,
    arrival_date = EXCLUDED.arrival_date,
    arrival_time = EXCLUDED.arrival_time,
    flight_time = EXCLUDED.flight_time,
    distance = EXCLUDED.distance,
    status = EXCLUDED.status,
    price = EXCLUDED.price,
    currency = EXCLUDED.currency,
    leg_type = EXCLUDED.leg_type,
    dynamic_pricing = EXCLUDED.dynamic_pricing,
    instant_booking = EXCLUDED.instant_booking,
    special_offers = EXCLUDED.special_offers,
    weather_alerts = EXCLUDED.weather_alerts,
    demand_score = EXCLUDED.demand_score,
    price_optimized = EXCLUDED.price_optimized;

-- ============================================================================
-- TRANSACTIONS DATA (Sample)
-- ============================================================================

INSERT INTO transactions (id, booking_id, transaction_type, amount, currency, status, payment_method, processor_name, processor_transaction_id, processor_fee, description, customer_reference, merchant_reference, initiated_date, completed_date) VALUES

-- Sample Completed Transactions
('tx001001-1111-2222-3333-444444444444', 'b1000001-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 47500.00, 'USD', 'Completed', 'WireTransfer', 'JPMorganChase', 'JPM789123456', 85.50, 'Deposit payment for transcontinental charter', 'RS-DEP-001', 'AVI-001-DEP', '2024-06-15T10:30:00Z', '2024-06-15T10:35:00Z'),

('tx002001-2222-3333-4444-555555555555', 'b1000002-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 18250.00, 'USD', 'Completed', 'CorporateCard', 'AmexCorporate', 'AMEX567890123', 364.50, 'Corporate charter payment', 'TC-PAY-007', 'AVI-002-CORP', '2024-06-20T14:20:00Z', '2024-06-20T14:22:00Z'),

('tx006001-6666-7777-8888-999999999999', 'b2000001-bbbb-cccc-dddd-eeeeeeeeeeee', 'Payment', 29000.00, 'USD', 'Completed', 'WireTransfer', 'WellsFargoPrivate', 'WF456789012', 116.00, 'Deposit payment - Houston to New York executive', 'ME-DEP-031', 'AVI-031-DEP', '2024-11-28T09:15:00Z', '2024-11-28T09:20:00Z')

ON CONFLICT (id) DO UPDATE SET
    booking_id = EXCLUDED.booking_id,
    transaction_type = EXCLUDED.transaction_type,
    amount = EXCLUDED.amount,
    currency = EXCLUDED.currency,
    status = EXCLUDED.status,
    payment_method = EXCLUDED.payment_method,
    processor_name = EXCLUDED.processor_name,
    processor_transaction_id = EXCLUDED.processor_transaction_id,
    processor_fee = EXCLUDED.processor_fee,
    description = EXCLUDED.description,
    customer_reference = EXCLUDED.customer_reference,
    merchant_reference = EXCLUDED.merchant_reference,
    initiated_date = EXCLUDED.initiated_date,
    completed_date = EXCLUDED.completed_date;

-- ============================================================================
-- AIRCRAFT UTILIZATION UPDATE
-- ============================================================================

-- Update the main aircraft record with current utilization data
UPDATE aircraft SET 
    total_hours = COALESCE(total_hours, 0) + 100,
    flight_cycles = COALESCE(flight_cycles, 0) + 50,
    last_maintenance_date = '2024-08-16',
    next_maintenance_due = '2024-09-15',
    maintenance_status = 'Due Soon',
    current_location = 'KJFK',
    availability_status = 'Available',
    utilization_rate = 0.78,
    updated_at = NOW()
WHERE id = '05c92852-911b-435d-be52-515fcf5b78fb';

COMMIT;