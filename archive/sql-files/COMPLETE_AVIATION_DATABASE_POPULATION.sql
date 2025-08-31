-- ============================================================================
-- COMPLETE AVIATION DATABASE POPULATION
-- ============================================================================
-- CRITICAL: Execute this script in Supabase SQL Editor to populate all 14 tables
-- This script assumes existing aircraft, operators, bookings tables have some data
-- Target: Each table should have ≥20 records for full operational status
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. USERS TABLE (Add 25 users for comprehensive coverage)
-- ============================================================================

INSERT INTO users (id, email, name, company, phone, role, created_at, updated_at) VALUES
('u000001-0001-0001-0001-000000000001', 'john.sterling@sterlingwealth.com', 'John Sterling', 'Sterling Wealth Management', '+1-212-555-0101', 'passenger', '2023-01-15T10:30:00Z', NOW()),
('u000002-0002-0002-0002-000000000002', 'sarah.chen@techcorp.com', 'Sarah Chen', 'TechCorp Innovations', '+1-206-555-0201', 'passenger', '2023-02-22T14:20:00Z', NOW()),
('u000003-0003-0003-0003-000000000003', 'mike.hamilton@bostongeneral.org', 'Mike Hamilton', 'Boston General Hospital', '+1-617-555-0301', 'passenger', '2023-03-08T16:15:00Z', NOW()),
('u000004-0004-0004-0004-000000000004', 'lisa.thompson@globalent.com', 'Lisa Thompson', 'Global Enterprises Ltd', '+44-20-7946-0001', 'passenger', '2023-04-12T11:45:00Z', NOW()),
('u000005-0005-0005-0005-000000000005', 'david.martinez@techinnovations.es', 'David Martinez', 'Tech Innovations Spain', '+34-91-123-4567', 'passenger', '2023-05-29T13:45:00Z', NOW()),
('u000006-0006-0006-0006-000000000006', 'emma.rossi@milanoluxury.it', 'Emma Rossi', 'Milano Luxury Group', '+39-02-1234-5678', 'passenger', '2023-06-18T16:40:00Z', NOW()),
('u000007-0007-0007-0007-000000000007', 'james.edwards@edwardsenergy.com', 'James Edwards', 'Edwards Energy Holdings', '+1-713-555-0701', 'passenger', '2023-07-03T09:15:00Z', NOW()),
('u000008-0008-0008-0008-000000000008', 'anna.antonov@vac-moscow.ru', 'Anna Antonov', 'Vladislav Art Collection', '+7-495-123-4567', 'passenger', '2023-08-25T14:20:00Z', NOW()),
('u000009-0009-0009-0009-000000000009', 'omar.hassan@middleeastcorp.ae', 'Omar Hassan', 'Middle East Corporation', '+971-4-123-4567', 'passenger', '2023-09-14T16:10:00Z', NOW()),
('u000010-0010-0010-0010-000000000010', 'marie.dubois@lecordonbleu.fr', 'Marie Dubois', 'Le Cordon Bleu', '+33-1-45-67-8900', 'passenger', '2023-10-01T12:45:00Z', NOW()),
('u000011-0011-0011-0011-000000000011', 'robert.wang@techcorpinc.com', 'Robert Wang', 'TechCorp Inc', '+1-415-555-1001', 'passenger', '2023-11-15T10:00:00Z', NOW()),
('u000012-0012-0012-0012-000000000012', 'jennifer.johnson@gm-auto.com', 'Jennifer Johnson', 'Global Motors', '+1-313-555-1002', 'passenger', '2023-12-22T11:40:00Z', NOW()),
('u000013-0013-0013-0013-000000000013', 'carlos.miller@medicalpharma.com', 'Carlos Miller', 'Medical Pharma Solutions', '+1-617-555-1003', 'passenger', '2024-01-11T10:45:00Z', NOW()),
('u000014-0014-0014-0014-000000000014', 'sophia.davis@phoenixfinancial.com', 'Sophia Davis', 'Phoenix Financial Group', '+1-602-555-1004', 'passenger', '2024-02-18T11:30:00Z', NOW()),
('u000015-0015-0015-0015-000000000015', 'alex.brown@atlantaconsulting.com', 'Alex Brown', 'Atlanta Consulting Group', '+1-404-555-1005', 'passenger', '2024-03-07T13:20:00Z', NOW()),
('u000016-0016-0016-0016-000000000016', 'olivia.sullivan@renewableenergy.com', 'Olivia Sullivan', 'Renewable Energy Solutions', '+1-303-555-1006', 'passenger', '2024-04-28T08:55:00Z', NOW()),
('u000017-0017-0017-0017-000000000017', 'noah.wilson@energysolutions.com', 'Noah Wilson', 'Energy Solutions Inc', '+1-713-555-1007', 'passenger', '2024-05-08T08:15:00Z', NOW()),
('u000018-0018-0018-0018-000000000018', 'ava.rodriguez@washingtonadvocacy.com', 'Ava Rodriguez', 'Washington Advocacy Group', '+1-202-555-1008', 'passenger', '2024-06-14T14:30:00Z', NOW()),
('u000019-0019-0019-0019-000000000019', 'liam.martinez@supplychaincorp.com', 'Liam Martinez', 'Supply Chain Corporation', '+1-617-555-1009', 'passenger', '2024-07-05T14:25:00Z', NOW()),
('u000020-0020-0020-0020-000000000020', 'isabella.garcia@propertycorp.com', 'Isabella Garcia', 'Property Development Corp', '+1-305-555-1010', 'passenger', '2024-08-24T10:55:00Z', NOW()),
('u000021-0021-0021-0021-000000000021', 'admin1@avinode.com', 'Aviation Admin', 'Avinode Aviation', '+1-555-100-0001', 'admin', '2023-01-01T00:00:00Z', NOW()),
('u000022-0022-0022-0022-000000000022', 'operator1@jetexcellence.com', 'Jet Excellence Ops', 'Jet Excellence', '+1-555-200-0002', 'operator', '2023-02-01T00:00:00Z', NOW()),
('u000023-0023-0023-0023-000000000023', 'operator2@eliteaviation.com', 'Elite Aviation Ops', 'Elite Aviation', '+1-555-300-0003', 'operator', '2023-03-01T00:00:00Z', NOW()),
('u000024-0024-0024-0024-000000000024', 'manager@skyconnect.com', 'Sky Connect Manager', 'Sky Connect Aviation', '+1-555-400-0004', 'operator', '2023-04-01T00:00:00Z', NOW()),
('u000025-0025-0025-0025-000000000025', 'support@avinode.com', 'Aviation Support', 'Avinode Aviation', '+1-555-500-0005', 'admin', '2023-05-01T00:00:00Z', NOW())

ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    company = EXCLUDED.company,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    updated_at = NOW();

-- ============================================================================
-- 2. CUSTOMERS TABLE (30 comprehensive customer profiles)
-- ============================================================================

INSERT INTO customers (id, email, name, phone, company, customer_type, preferences, total_flights, total_spent, rating, created_at) VALUES

-- VIP CUSTOMERS (10 high-value profiles)
('c1000001-1111-2222-3333-444444444444', 'richard.sterling@sterlingwealth.com', 'Richard Sterling', '+1-212-555-0101', 'Sterling Wealth Management', 'VIP', '{"aircraft": ["Ultra Long Range", "Heavy Jet"], "amenities": ["Conference Room", "Champagne Service"], "loyalty": "Platinum"}', 45, 2850000, 4.9, '2022-03-15T10:30:00Z'),
('c1000002-1111-2222-3333-444444444444', 's.chen@techcorp.com', 'Sarah Chen', '+1-206-555-0201', 'TechCorp Innovations', 'VIP', '{"aircraft": ["Super Midsize Jet", "Midsize Jet"], "amenities": ["WiFi", "Conference Setup"], "loyalty": "Gold"}', 32, 1650000, 4.8, '2021-08-22T14:20:00Z'),
('c1000003-1111-2222-3333-444444444444', 'm.hamilton@bostongeneral.org', 'Dr. Margaret Hamilton', '+1-617-555-0301', 'Boston General Hospital', 'VIP', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Medical Equipment Storage", "Priority Service"], "loyalty": "Platinum"}', 28, 1420000, 4.9, '2020-11-08T16:15:00Z'),
('c1000004-1111-2222-3333-444444444444', 'global.exec@globalenterprises.com', 'Marcus Thompson', '+44-20-7946-0001', 'Global Enterprises Ltd', 'VIP', '{"aircraft": ["Ultra Long Range", "Heavy Jet"], "amenities": ["International Communications", "Executive Suite"], "loyalty": "Diamond"}', 52, 3100000, 4.8, '2019-05-12T11:45:00Z'),
('c1000005-1111-2222-3333-444444444444', 'a.martinez@techinnovations.es', 'Antonio Martinez', '+34-91-123-4567', 'Tech Innovations Spain', 'VIP', '{"aircraft": ["Super Midsize Jet", "Midsize Jet"], "amenities": ["European Routes", "Business Setup"], "loyalty": "Gold"}', 23, 1180000, 4.7, '2021-01-29T13:45:00Z'),
('c1000006-1111-2222-3333-444444444444', 'ceo@milanoluxury.it', 'Isabella Rossi', '+39-02-1234-5678', 'Milano Luxury Group', 'VIP', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Luxury Service", "Italian Cuisine"], "loyalty": "Platinum"}', 31, 1980000, 4.9, '2020-06-18T16:40:00Z'),
('c1000007-1111-2222-3333-444444444444', 'marcus.edwards@edwardsenergy.com', 'Marcus Edwards', '+1-713-555-0701', 'Edwards Energy Holdings', 'VIP', '{"aircraft": ["Heavy Jet", "Ultra Long Range"], "amenities": ["Secure Communications", "Executive Office"], "loyalty": "Diamond"}', 38, 2450000, 4.8, '2019-12-03T09:15:00Z'),
('c1000008-1111-2222-3333-444444444444', 'vladislav.antonov@vac-moscow.ru', 'Vladislav Antonov', '+7-495-123-4567', 'Vladislav Art Collection', 'VIP', '{"aircraft": ["Ultra Long Range", "Heavy Jet"], "amenities": ["Art Transport", "Climate Control"], "loyalty": "Platinum"}', 19, 1750000, 4.9, '2021-07-25T14:20:00Z'),
('c1000009-1111-2222-3333-444444444444', 'ahmed.hassan@middleeastcorp.ae', 'Ahmed Hassan', '+971-4-123-4567', 'Middle East Corporation', 'VIP', '{"aircraft": ["Ultra Long Range", "Heavy Jet"], "amenities": ["Halal Service", "Prayer Area"], "loyalty": "Diamond"}', 41, 2890000, 4.8, '2020-02-14T16:10:00Z'),
('c1000010-1111-2222-3333-444444444444', 'chef.dubois@lecordonbleu.fr', 'Pierre Dubois', '+33-1-45-67-8900', 'Le Cordon Bleu', 'VIP', '{"aircraft": ["Super Midsize Jet", "Heavy Jet"], "amenities": ["Gourmet Catering", "Wine Selection"], "loyalty": "Gold"}', 27, 1520000, 4.9, '2021-03-01T12:45:00Z'),

-- CORPORATE CUSTOMERS (15 business accounts)
('c2000001-2222-3333-4444-555555555555', 'travel@techcorpinc.com', 'Lisa Wang', '+1-415-555-1001', 'TechCorp Inc', 'Corporate', '{"aircraft": ["Midsize Jet", "Super Midsize Jet"], "amenities": ["WiFi", "Business Setup"], "contract": "Annual"}', 24, 850000, 4.6, '2022-01-15T10:00:00Z'),
('c2000002-2222-3333-4444-555555555555', 'logistics@gm-auto.com', 'Robert Johnson', '+1-313-555-1002', 'Global Motors', 'Corporate', '{"aircraft": ["Super Midsize Jet", "Heavy Jet"], "amenities": ["Cargo Space", "Executive Transport"], "contract": "Quarterly"}', 18, 720000, 4.5, '2021-09-22T11:40:00Z'),
('c2000003-2222-3333-4444-555555555555', 'exec@medicalpharma.com', 'Dr. Susan Miller', '+1-617-555-1003', 'Medical Pharma Solutions', 'Corporate', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Medical Storage", "Temperature Control"], "contract": "Annual"}', 22, 980000, 4.7, '2021-06-11T10:45:00Z'),
('c2000004-2222-3333-4444-555555555555', 'cfo@phoenixfinancial.com', 'Michael Davis', '+1-602-555-1004', 'Phoenix Financial Group', 'Corporate', '{"aircraft": ["Midsize Jet", "Light Jet"], "amenities": ["Basic Service", "Efficiency"], "contract": "Monthly"}', 15, 450000, 4.4, '2022-04-18T11:30:00Z'),
('c2000005-2222-3333-4444-555555555555', 'ops@atlantaconsulting.com', 'Jennifer Brown', '+1-404-555-1005', 'Atlanta Consulting Group', 'Corporate', '{"aircraft": ["Super Midsize Jet", "Midsize Jet"], "amenities": ["Meeting Space", "Presentation Setup"], "contract": "Quarterly"}', 20, 680000, 4.6, '2021-11-07T13:20:00Z'),
('c2000006-2222-3333-4444-555555555555', 'research@renewableenergy.com', 'Dr. Emily Sullivan', '+1-303-555-1006', 'Renewable Energy Solutions', 'Corporate', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Equipment Transport", "Multi-destination"], "contract": "Annual"}', 17, 780000, 4.5, '2022-02-28T08:55:00Z'),
('c2000007-2222-3333-4444-555555555555', 'travel@energysolutions.com', 'David Wilson', '+1-713-555-1007', 'Energy Solutions Inc', 'Corporate', '{"aircraft": ["Heavy Jet", "Ultra Long Range"], "amenities": ["Long Range", "Weather Radar"], "contract": "Annual"}', 19, 890000, 4.6, '2021-10-08T08:15:00Z'),
('c2000008-2222-3333-4444-555555555555', 'exec@washingtonadvocacy.com', 'Amanda Rodriguez', '+1-202-555-1008', 'Washington Advocacy Group', 'Corporate', '{"aircraft": ["Midsize Jet", "Super Midsize Jet"], "amenities": ["Privacy", "Secure Communications"], "contract": "Monthly"}', 16, 520000, 4.7, '2022-05-14T14:30:00Z'),
('c2000009-2222-3333-4444-555555555555', 'ops@supplychaincorp.com', 'James Martinez', '+1-617-555-1009', 'Supply Chain Corporation', 'Corporate', '{"aircraft": ["Super Midsize Jet", "Heavy Jet"], "amenities": ["Cargo Capability", "Multiple Stops"], "contract": "Quarterly"}', 21, 670000, 4.5, '2021-12-05T14:25:00Z'),
('c2000010-2222-3333-4444-555555555555', 'travel@propertycorp.com', 'Maria Garcia', '+1-305-555-1010', 'Property Development Corp', 'Corporate', '{"aircraft": ["Super Midsize Jet", "Midsize Jet"], "amenities": ["Site Visits", "Client Entertainment"], "contract": "Annual"}', 14, 580000, 4.6, '2022-03-24T10:55:00Z'),
('c2000011-2222-3333-4444-555555555555', 'rd@autoinnovations.com', 'Kevin Thompson', '+1-248-555-1011', 'Automotive Innovations LLC', 'Corporate', '{"aircraft": ["Midsize Jet", "Super Midsize Jet"], "amenities": ["Prototype Transport", "Secure Storage"], "contract": "Quarterly"}', 13, 480000, 4.4, '2022-07-11T15:30:00Z'),
('c2000012-2222-3333-4444-555555555555', 'medical@advancedhealthcare.com', 'Dr. Patricia Lee', '+1-713-555-1012', 'Advanced Healthcare Systems', 'Corporate', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Medical Equipment", "Emergency Response"], "contract": "Annual"}', 18, 840000, 4.7, '2021-08-08T09:40:00Z'),
('c2000013-2222-3333-4444-555555555555', 'exec@agriculturalcorp.com', 'Thomas Anderson', '+1-559-555-1013', 'Agricultural Corporation', 'Corporate', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Survey Equipment", "Weather Monitoring"], "contract": "Seasonal"}', 12, 380000, 4.3, '2022-06-18T08:55:00Z'),
('c2000014-2222-3333-4444-555555555555', 'talent@entertainmentgroup.com', 'Alexandra Stone', '+1-323-555-1014', 'Entertainment Solutions Group', 'Corporate', '{"aircraft": ["Heavy Jet", "Ultra Long Range"], "amenities": ["Privacy", "Luxury Amenities"], "contract": "Annual"}', 25, 1200000, 4.8, '2021-04-25T10:30:00Z'),
('c2000015-2222-3333-4444-555555555555', 'ops@elitesports.com', 'Coach Martinez', '+1-214-555-1015', 'Elite Sports Management', 'Corporate', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Team Transport", "Equipment Storage"], "contract": "Seasonal"}', 16, 750000, 4.6, '2022-01-07T07:20:00Z'),

-- INDIVIDUAL CUSTOMERS (5 personal travel customers)
('c3000001-3333-4444-5555-666666666666', 'j.martinez@personaltravel.com', 'Jennifer Martinez', '+1-617-555-2001', NULL, 'Individual', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Basic Service", "Comfortable Seating"], "occasions": "Personal"}', 8, 180000, 4.5, '2022-09-28T15:20:00Z'),
('c3000002-3333-4444-5555-666666666666', 'michael.photographer@gmail.com', 'Michael Johnson', '+1-602-555-2002', 'Freelance Photography', 'Individual', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Photography Equipment", "Scenic Routes"], "occasions": "Business/Personal"}', 6, 140000, 4.4, '2023-01-20T13:35:00Z'),
('c3000003-3333-4444-5555-666666666666', 'startup.founder@techventure.com', 'Alex Chen', '+1-206-555-2003', 'Tech Venture Startup', 'Individual', '{"aircraft": ["Midsize Jet", "Super Midsize Jet"], "amenities": ["WiFi Essential", "Meeting Space"], "occasions": "Business"}', 9, 220000, 4.6, '2022-11-10T09:45:00Z'),
('c3000004-3333-4444-5555-666666666666', 'luxury.traveler@wealthy.com', 'Sophia Williams', '+1-702-555-2004', NULL, 'Individual', '{"aircraft": ["Super Midsize Jet", "Heavy Jet"], "amenities": ["Luxury Service", "Premium Catering"], "occasions": "Leisure"}', 11, 350000, 4.8, '2021-12-18T16:45:00Z'),
('c3000005-3333-4444-5555-666666666666', 'budget.efficient@traveler.com', 'Robert Brown', '+1-612-555-2005', NULL, 'Individual', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Cost Effective", "Reliable Service"], "occasions": "Personal"}', 5, 95000, 4.2, '2023-03-12T12:15:00Z')

ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    customer_type = EXCLUDED.customer_type,
    preferences = EXCLUDED.preferences,
    total_flights = EXCLUDED.total_flights,
    total_spent = EXCLUDED.total_spent,
    rating = EXCLUDED.rating,
    created_at = EXCLUDED.created_at;

-- ============================================================================
-- 3. PAYMENTS/TRANSACTIONS TABLE (25+ transaction records)
-- ============================================================================

-- First, get existing booking IDs by creating some sample bookings if none exist
INSERT INTO bookings (id, user_id, aircraft_id, operator_id, status, departure_airport, arrival_airport, departure_date, departure_time, arrival_date, arrival_time, flight_duration, passenger_count, total_price, currency, payment_status, payment_method, deposit_amount, balance_amount, booking_date, special_requests, booking_reference, confirmation_code, created_at) 
SELECT 
    'b' || generate_random_uuid()::text,
    'u000001-0001-0001-0001-000000000001',
    (SELECT id FROM aircraft LIMIT 1 OFFSET (i % (SELECT COUNT(*) FROM aircraft))),
    (SELECT id FROM operators LIMIT 1 OFFSET (i % (SELECT COUNT(*) FROM operators))),
    'Completed',
    'KJFK',
    'KLAX', 
    '2024-08-' || LPAD((i % 28 + 1)::text, 2, '0'),
    '10:00:00',
    '2024-08' || LPAD((i % 28 + 1)::text, 2, '0'),
    '13:30:00',
    3.5,
    4,
    25000.00 + (i * 5000),
    'USD',
    'FullyPaid',
    'CreditCard',
    12500.00 + (i * 2500),
    12500.00 + (i * 2500),
    '2024-07-' || LPAD((i % 28 + 1)::text, 2, '0'),
    'Standard service',
    'BK-2024-' || LPAD(i::text, 3, '0'),
    'CONF' || UPPER(substr(md5(random()::text), 1, 6)),
    NOW() - INTERVAL '30 days' + (i || ' days')::INTERVAL
FROM generate_series(1, 5) i
WHERE NOT EXISTS (SELECT 1 FROM bookings LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- Now insert transactions
INSERT INTO transactions (id, booking_id, transaction_type, amount, currency, status, payment_method, processor_name, processor_transaction_id, processor_fee, risk_score, fraud_flags, description, customer_reference, merchant_reference, initiated_date, completed_date, created_at, updated_at) 
SELECT 
    'tx' || generate_random_uuid()::text,
    (SELECT id FROM bookings ORDER BY random() LIMIT 1),
    (ARRAY['Payment', 'Refund', 'Fee'])[ceil(random() * 3)],
    (random() * 40000 + 5000)::numeric(10,2),
    'USD',
    (ARRAY['Completed', 'Pending', 'Failed'])[ceil(random() * 3)],
    (ARRAY['Credit Card', 'Bank Transfer', 'PayPal', 'Crypto', 'Check'])[ceil(random() * 5)],
    (ARRAY['Stripe', 'PayPal', 'Square', 'Coinbase', 'Bank'])[ceil(random() * 5)],
    'proc_' || substr(md5(random()::text), 1, 12),
    (random() * 500 + 50)::numeric(8,2),
    floor(random() * 100)::integer,
    CASE WHEN random() > 0.8 THEN ARRAY['high_amount'] ELSE ARRAY[]::text[] END,
    'Charter flight transaction ' || i,
    'CUST_' || substr(md5(random()::text), 1, 8),
    'MERCH_' || substr(md5(random()::text), 1, 8),
    NOW() - INTERVAL '60 days' + (i || ' days')::INTERVAL,
    CASE WHEN random() > 0.2 THEN NOW() - INTERVAL '60 days' + (i || ' days')::INTERVAL + INTERVAL '1 hour' ELSE NULL END,
    NOW() - INTERVAL '60 days' + (i || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 25) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 4. INVOICES TABLE (25+ invoice records)
-- ============================================================================

INSERT INTO invoices (id, booking_id, invoice_number, amount, currency, status, due_date, line_items, tax_amount, discount_amount, customer_info, payment_terms, notes, created_at, updated_at)
SELECT 
    'inv' || generate_random_uuid()::text,
    (SELECT id FROM bookings ORDER BY random() LIMIT 1),
    'INV-2024-' || LPAD(i::text, 4, '0'),
    (random() * 50000 + 10000)::numeric(10,2),
    'USD',
    (ARRAY['draft', 'sent', 'paid', 'overdue'])[ceil(random() * 4)],
    (NOW() + INTERVAL '30 days')::date,
    jsonb_build_array(
        jsonb_build_object(
            'description', 'Charter Flight Service',
            'quantity', 1,
            'rate', (random() * 40000 + 8000)::numeric(10,2),
            'amount', (random() * 40000 + 8000)::numeric(10,2)
        ),
        jsonb_build_object(
            'description', 'Fuel Surcharge', 
            'quantity', 1,
            'rate', (random() * 5000 + 1000)::numeric(10,2),
            'amount', (random() * 5000 + 1000)::numeric(10,2)
        )
    ),
    ((random() * 50000 + 10000) * 0.08)::numeric(8,2),
    CASE WHEN random() > 0.7 THEN ((random() * 50000 + 10000) * 0.1)::numeric(8,2) ELSE 0 END,
    jsonb_build_object(
        'name', 'Customer ' || i,
        'email', 'customer' || i || '@example.com',
        'address', (1000 + i) || ' Business Blvd, Suite ' || (100 + i) || ', City, ST 12345'
    ),
    (ARRAY['Net 15', 'Net 30', 'Due on Receipt', 'Net 45'])[ceil(random() * 4)],
    'Thank you for your business. Payment is due within the specified terms.',
    NOW() - INTERVAL '30 days' + (i || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 25) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. MAINTENANCE_RECORDS TABLE (30+ maintenance records)
-- ============================================================================

INSERT INTO maintenance_records (id, aircraft_id, maintenance_type, description, scheduled_date, completed_date, cost, currency, facility, technician, work_orders, hours_at_maintenance, cycles_at_maintenance, prediction_accuracy, created_at, updated_at)
SELECT 
    'mnt' || generate_random_uuid()::text,
    (SELECT id FROM aircraft ORDER BY random() LIMIT 1),
    (ARRAY['Routine', 'Progressive', 'AOG', 'Compliance'])[ceil(random() * 4)],
    (ARRAY[
        '100-hour inspection',
        'Annual inspection', 
        'Avionics upgrade',
        'Engine maintenance',
        'Landing gear service',
        'Interior refurbishment',
        'Paint touch-up',
        'Emergency repair',
        'Compliance check',
        'Software update'
    ])[ceil(random() * 10)],
    NOW() - INTERVAL '365 days' + (i * 10 || ' days')::INTERVAL,
    CASE WHEN random() > 0.3 THEN NOW() - INTERVAL '365 days' + (i * 10 || ' days')::INTERVAL + INTERVAL '3 days' ELSE NULL END,
    (random() * 45000 + 5000)::numeric(10,2),
    'USD',
    (ARRAY['Jet Aviation', 'Duncan Aviation', 'Textron Aviation', 'Bombardier Service', 'Gulfstream Service'])[ceil(random() * 5)],
    (ARRAY['Mike Johnson', 'Sarah Williams', 'David Brown', 'Lisa Garcia', 'Tom Martinez'])[ceil(random() * 5)],
    ARRAY['WO-' || substr(md5(random()::text), 1, 6), 'WO-' || substr(md5(random()::text), 1, 6)],
    (random() * 9000 + 1000)::numeric(8,2),
    floor(random() * 4500 + 500)::integer,
    (random() * 0.3 + 0.7)::numeric(3,2),
    NOW() - INTERVAL '365 days' + (i * 10 || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 30) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. CREW_ASSIGNMENTS TABLE (35+ crew assignment records)
-- ============================================================================

INSERT INTO crew_assignments (id, booking_id, aircraft_id, crew_type, crew_member_name, crew_member_id, license_number, certification_expiry, assignment_date, status, created_at, updated_at)
SELECT 
    'crew' || generate_random_uuid()::text,
    (SELECT id FROM bookings ORDER BY random() LIMIT 1),
    (SELECT id FROM aircraft ORDER BY random() LIMIT 1),
    (ARRAY['Captain', 'First Officer', 'Flight Attendant'])[ceil(random() * 3)],
    CASE 
        WHEN ceil(random() * 3) = 1 THEN (ARRAY['John Smith', 'Sarah Johnson', 'Michael Brown', 'Emily Davis', 'David Wilson'])[ceil(random() * 5)]
        WHEN ceil(random() * 3) = 2 THEN (ARRAY['Robert Miller', 'Jessica Garcia', 'James Martinez', 'Amanda Rodriguez', 'William Anderson'])[ceil(random() * 5)]
        ELSE (ARRAY['Lisa Thompson', 'Michelle Taylor', 'Christopher Moore', 'Kimberly Jackson', 'Andrew Martin'])[ceil(random() * 5)]
    END,
    'CREW_' || i || '_' || (ARRAY['CAPT', 'FO', 'FA'])[ceil(random() * 3)],
    (ARRAY['ATP', 'CPL', 'FA'])[ceil(random() * 3)] || '-' || substr(md5(random()::text), 1, 8),
    (NOW() + INTERVAL '365 days' + (random() * 365 || ' days')::INTERVAL)::date,
    NOW() - INTERVAL '30 days' + (i || ' days')::INTERVAL,
    (ARRAY['Assigned', 'Confirmed', 'Completed'])[ceil(random() * 3)],
    NOW() - INTERVAL '30 days' + (i || ' days')::INTERVAL,
    NOW()
FROM generate_series(1, 35) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 7. ROUTES TABLE (25+ route records)
-- ============================================================================

-- Create routes table if it doesn't exist
CREATE TABLE IF NOT EXISTS routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    route_code TEXT UNIQUE NOT NULL,
    departure_airport TEXT NOT NULL,
    arrival_airport TEXT NOT NULL,
    distance INTEGER NOT NULL,
    typical_flight_time DECIMAL NOT NULL,
    popular_aircraft_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    average_price DECIMAL DEFAULT 0,
    demand_level TEXT DEFAULT 'Medium',
    seasonal_factors JSONB DEFAULT '{}',
    weather_considerations JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO routes (id, route_code, departure_airport, arrival_airport, distance, typical_flight_time, popular_aircraft_types, average_price, demand_level, seasonal_factors, weather_considerations, created_at, updated_at)
VALUES
('r001', 'KJFK-KLAX', 'KJFK', 'KLAX', 2445, 5.5, ARRAY['Heavy Jet', 'Ultra Long Range'], 45000, 'High', '{"summer": 1.2, "winter": 0.9}', '{"turbulence_risk": "moderate", "weather_delays": "low"}', NOW(), NOW()),
('r002', 'EGLL-LFPG', 'EGLL', 'LFPG', 214, 1.2, ARRAY['Light Jet', 'Midsize Jet'], 8500, 'Very High', '{"summer": 1.3, "winter": 1.0}', '{"fog_risk": "high", "slot_restrictions": "severe"}', NOW(), NOW()),
('r003', 'KTEB-KPBI', 'KTEB', 'KPBI', 1028, 2.8, ARRAY['Midsize Jet', 'Super Midsize Jet'], 22000, 'High', '{"winter": 1.4, "summer": 1.1}', '{"thunderstorms": "frequent", "hurricane_season": "high_risk"}', NOW(), NOW()),
('r004', 'KBOS-KMIA', 'KBOS', 'KMIA', 1258, 3.2, ARRAY['Super Midsize Jet', 'Heavy Jet'], 28000, 'Medium', '{"winter": 1.2, "spring": 1.1}', '{"ice_risk": "winter_high", "convective_activity": "summer_high"}', NOW(), NOW()),
('r005', 'KSFO-KLAS', 'KSFO', 'KLAS', 414, 1.8, ARRAY['Light Jet', 'Midsize Jet'], 15000, 'High', '{"conventions": 1.5, "holidays": 1.3}', '{"turbulence": "frequent", "wind_shear": "moderate"}', NOW(), NOW()),
('r006', 'KDCA-KATL', 'KDCA', 'KATL', 547, 2.1, ARRAY['Midsize Jet', 'Super Midsize Jet'], 18500, 'Medium', '{"business_season": 1.2}', '{"thunderstorms": "spring_summer", "fog": "winter_morning"}', NOW(), NOW()),
('r007', 'KORD-KDEN', 'KORD', 'KDEN', 888, 2.6, ARRAY['Super Midsize Jet', 'Heavy Jet'], 24000, 'Medium', '{"ski_season": 1.3, "summer": 1.1}', '{"mountain_weather": "unpredictable", "altitude_performance": "critical"}', NOW(), NOW()),
('r008', 'KIAH-KJFK', 'KIAH', 'KJFK', 1420, 3.8, ARRAY['Heavy Jet', 'Ultra Long Range'], 35000, 'High', '{"business_travel": 1.2}', '{"thunderstorms": "frequent", "traffic_delays": "high"}', NOW(), NOW()),
('r009', 'KPHX-KSEA', 'KPHX', 'KSEA', 1107, 3.1, ARRAY['Midsize Jet', 'Super Midsize Jet'], 26500, 'Medium', '{"winter_escape": 1.4}', '{"mountain_turbulence": "moderate", "icing": "winter_risk"}', NOW(), NOW()),
('r010', 'KMCO-KLGA', 'KMCO', 'KLGA', 950, 2.9, ARRAY['Super Midsize Jet', 'Heavy Jet'], 25000, 'High', '{"disney_season": 1.3, "spring_break": 1.5}', '{"thunderstorms": "afternoon", "slot_restrictions": "severe"}', NOW(), NOW()),
('r011', 'CYVR-KLAX', 'CYVR', 'KLAX', 1278, 3.4, ARRAY['Heavy Jet', 'Ultra Long Range'], 32000, 'Medium', '{"olympics": 2.0, "summer": 1.2}', '{"mountain_weather": "variable", "international": "customs_required"}', NOW(), NOW()),
('r012', 'CYYZ-KJFK', 'CYYZ', 'KJFK', 342, 1.6, ARRAY['Light Jet', 'Midsize Jet'], 12000, 'High', '{"business_travel": 1.3}', '{"ice_accumulation": "winter", "customs": "required"}', NOW(), NOW()),
('r013', 'KSAN-KPHX', 'KSAN', 'KPHX', 306, 1.4, ARRAY['Light Jet', 'Midsize Jet'], 11000, 'Medium', '{"desert_season": 1.1}', '{"desert_turbulence": "thermal", "heat_performance": "summer_concern"}', NOW(), NOW()),
('r014', 'KPDX-KSFB', 'KPDX', 'KSFB', 2421, 5.4, ARRAY['Heavy Jet', 'Ultra Long Range'], 42000, 'Low', '{"tech_conferences": 1.4}', '{"mountain_weather": "complex", "long_range": "required"}', NOW(), NOW()),
('r015', 'KBWI-KCLT', 'KBWI', 'KCLT', 288, 1.3, ARRAY['Light Jet', 'Midsize Jet'], 9500, 'Medium', '{"business_travel": 1.1}', '{"thunderstorms": "frequent", "traffic": "moderate"}', NOW(), NOW()),
('r016', 'KSTL-KDFW', 'KSTL', 'KDFW', 547, 2.0, ARRAY['Midsize Jet', 'Super Midsize Jet'], 17000, 'Medium', '{"conventions": 1.2}', '{"thunderstorms": "severe", "tornado_season": "spring"}', NOW(), NOW()),
('r017', 'KCVG-KTPA', 'KCVG', 'KTPA', 777, 2.4, ARRAY['Super Midsize Jet', 'Heavy Jet'], 21000, 'Medium', '{"winter_escape": 1.3}', '{"thunderstorms": "daily", "hurricane_season": "risk"}', NOW(), NOW()),
('r018', 'KMDW-KAUS', 'KMDW', 'KAUS', 925, 2.7, ARRAY['Midsize Jet', 'Super Midsize Jet'], 23000, 'Medium', '{"sxsw": 2.0, "f1": 1.8}', '{"thunderstorms": "severe", "tech_events": "high_demand"}', NOW(), NOW()),
('r019', 'KBUR-KSJC', 'KBUR', 'KSJC', 295, 1.3, ARRAY['Light Jet', 'Midsize Jet'], 10500, 'High', '{"tech_season": 1.4}', '{"marine_layer": "morning", "traffic_delays": "frequent"}', NOW(), NOW()),
('r020', 'KRIC-KBOS', 'KRIC', 'KBOS', 429, 1.7, ARRAY['Light Jet', 'Midsize Jet'], 13500, 'Medium', '{"fall_foliage": 1.3}', '{"ice_risk": "winter", "traffic": "northeast_corridor"}', NOW(), NOW()),
('r021', 'KOAK-KPDX', 'KOAK', 'KPDX', 554, 2.0, ARRAY['Midsize Jet', 'Super Midsize Jet'], 16500, 'Medium', '{"wine_season": 1.2}', '{"marine_conditions": "variable", "mountain_weather": "challenging"}', NOW(), NOW()),
('r022', 'KPHL-KCMH', 'KPHL', 'KCMH', 292, 1.4, ARRAY['Light Jet', 'Midsize Jet'], 11500, 'Low', '{"business_travel": 1.1}', '{"thunderstorms": "frequent", "ice": "winter_concern"}', NOW(), NOW()),
('r023', 'KMEM-KNOU', 'KMEM', 'KNOU', 295, 1.4, ARRAY['Light Jet', 'Midsize Jet'], 10000, 'Medium', '{"jazz_fest": 1.8, "mardi_gras": 2.2}', '{"thunderstorms": "severe", "hurricane_risk": "seasonal"}', NOW(), NOW()),
('r024', 'KSLC-KDEN', 'KSLC', 'KDEN', 371, 1.6, ARRAY['Light Jet', 'Midsize Jet'], 12500, 'Medium', '{"ski_season": 1.5}', '{"mountain_weather": "severe", "altitude": "performance_critical"}', NOW(), NOW()),
('r025', 'KGSP-KATL', 'KGSP', 'KATL', 147, 0.8, ARRAY['Light Jet', 'Midsize Jet'], 7500, 'Low', '{"business_travel": 1.1}', '{"thunderstorms": "frequent", "short_distance": "traffic_sensitive"}', NOW(), NOW())

ON CONFLICT (route_code) DO UPDATE SET
    departure_airport = EXCLUDED.departure_airport,
    arrival_airport = EXCLUDED.arrival_airport,
    distance = EXCLUDED.distance,
    typical_flight_time = EXCLUDED.typical_flight_time,
    popular_aircraft_types = EXCLUDED.popular_aircraft_types,
    average_price = EXCLUDED.average_price,
    demand_level = EXCLUDED.demand_level,
    seasonal_factors = EXCLUDED.seasonal_factors,
    weather_considerations = EXCLUDED.weather_considerations,
    updated_at = NOW();

-- ============================================================================
-- 8. AIRPORTS TABLE (30+ airport records)
-- ============================================================================

CREATE TABLE IF NOT EXISTS airports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icao_code TEXT UNIQUE NOT NULL,
    iata_code TEXT,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    elevation INTEGER,
    timezone TEXT,
    runway_count INTEGER DEFAULT 1,
    longest_runway INTEGER,
    aircraft_categories TEXT[] DEFAULT ARRAY[]::TEXT[],
    services JSONB DEFAULT '{}',
    operating_hours TEXT DEFAULT '24/7',
    customs_available BOOLEAN DEFAULT false,
    fuel_types TEXT[] DEFAULT ARRAY[]::TEXT[],
    handling_agents TEXT[] DEFAULT ARRAY[]::TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO airports (icao_code, iata_code, name, city, country, latitude, longitude, elevation, timezone, runway_count, longest_runway, aircraft_categories, services, operating_hours, customs_available, fuel_types, handling_agents, created_at, updated_at)
VALUES
('KJFK', 'JFK', 'John F. Kennedy International Airport', 'New York', 'United States', 40.63980103, -73.77890015, 13, 'America/New_York', 4, 14511, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet', 'Ultra Long Range'], '{"fbo": ["Jet Aviation", "Signature Flight Support"], "catering": true, "ground_transport": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Jet Aviation', 'Atlantic Aviation'], NOW(), NOW()),
('KLAX', 'LAX', 'Los Angeles International Airport', 'Los Angeles', 'United States', 33.94250107, -118.4081001, 125, 'America/Los_Angeles', 4, 12091, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet', 'Ultra Long Range'], '{"fbo": ["Atlantic Aviation", "Signature Flight Support"], "catering": true, "ground_transport": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Atlantic Aviation', 'Signature Flight Support', 'Clay Lacy Aviation'], NOW(), NOW()),
('EGLL', 'LHR', 'London Heathrow Airport', 'London', 'United Kingdom', 51.4706, -0.461941, 83, 'Europe/London', 2, 12799, ARRAY['Heavy Jet', 'Ultra Long Range'], '{"fbo": ["Harrods Aviation", "Signature Flight Support"], "catering": true, "concierge": true}', '24/7', true, ARRAY['Jet A'], ARRAY['Harrods Aviation', 'Signature Flight Support'], NOW(), NOW()),
('LFPG', 'CDG', 'Charles de Gaulle Airport', 'Paris', 'France', 49.012798, 2.55, 392, 'Europe/Paris', 4, 13123, ARRAY['Heavy Jet', 'Ultra Long Range'], '{"fbo": ["Jetex", "Universal Aviation"], "catering": true, "concierge": true}', '24/7', true, ARRAY['Jet A'], ARRAY['Jetex', 'Universal Aviation'], NOW(), NOW()),
('KTEB', 'TEB', 'Teterboro Airport', 'Teterboro', 'United States', 40.850101, -74.060997, 9, 'America/New_York', 1, 7000, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet'], '{"fbo": ["Atlantic Aviation", "Signature Flight Support", "Meridian"], "catering": true, "ground_transport": true}', '06:00-23:00', false, ARRAY['Jet A'], ARRAY['Atlantic Aviation', 'Signature Flight Support', 'Meridian'], NOW(), NOW()),
('KPBI', 'PBI', 'Palm Beach International Airport', 'West Palm Beach', 'United States', 26.683161, -80.095589, 19, 'America/New_York', 2, 10008, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support", "Atlantic Aviation"], "catering": true, "concierge": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Atlantic Aviation'], NOW(), NOW()),
('KBOS', 'BOS', 'Logan International Airport', 'Boston', 'United States', 42.364347, -71.005181, 19, 'America/New_York', 6, 10081, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support", "Atlantic Aviation"], "catering": true, "ground_transport": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Atlantic Aviation'], NOW(), NOW()),
('KMIA', 'MIA', 'Miami International Airport', 'Miami', 'United States', 25.79319, -80.29056, 8, 'America/New_York', 4, 13016, ARRAY['Midsize Jet', 'Super Midsize Jet', 'Heavy Jet', 'Ultra Long Range'], '{"fbo": ["Signature Flight Support", "Atlantic Aviation"], "catering": true, "customs": "24/7"}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Atlantic Aviation', 'Jet Aviation'], NOW(), NOW()),
('KSFO', 'SFO', 'San Francisco International Airport', 'San Francisco', 'United States', 37.621311, -122.378998, 13, 'America/Los_Angeles', 4, 11870, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support"], "catering": true, "ground_transport": true}', '24/7', true, ARRAY['Jet A'], ARRAY['Signature Flight Support'], NOW(), NOW()),
('KLAS', 'LAS', 'McCarran International Airport', 'Las Vegas', 'United States', 36.080056, -115.15225, 2181, 'America/Los_Angeles', 4, 14511, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support", "Atlantic Aviation"], "catering": true, "entertainment": true}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Atlantic Aviation'], NOW(), NOW()),
('KDCA', 'DCA', 'Ronald Reagan Washington National Airport', 'Washington DC', 'United States', 38.852085, -77.037722, 15, 'America/New_York', 3, 6869, ARRAY['Light Jet', 'Midsize Jet'], '{"fbo": ["Signature Flight Support"], "catering": true, "security": "enhanced"}', '24/7', false, ARRAY['Jet A'], ARRAY['Signature Flight Support'], NOW(), NOW()),
('KATL', 'ATL', 'Hartsfield-Jackson Atlanta International Airport', 'Atlanta', 'United States', 33.636719, -84.428067, 1026, 'America/New_York', 5, 12390, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support", "Atlantic Aviation"], "catering": true, "ground_transport": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Atlantic Aviation'], NOW(), NOW()),
('KORD', 'ORD', 'Chicago O\''Hare International Airport', 'Chicago', 'United States', 41.978603, -87.904842, 672, 'America/Chicago', 8, 13000, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support", "Atlantic Aviation"], "catering": true, "ground_transport": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Atlantic Aviation'], NOW(), NOW()),
('KDEN', 'DEN', 'Denver International Airport', 'Denver', 'United States', 39.861656, -104.673178, 5431, 'America/Denver', 6, 16000, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support", "Atlantic Aviation"], "catering": true, "altitude": "high"}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Atlantic Aviation'], NOW(), NOW()),
('KIAH', 'IAH', 'George Bush Intercontinental Airport', 'Houston', 'United States', 29.984433, -95.341442, 97, 'America/Chicago', 5, 12000, ARRAY['Midsize Jet', 'Super Midsize Jet', 'Heavy Jet', 'Ultra Long Range'], '{"fbo": ["Atlantic Aviation", "Jet Aviation"], "catering": true, "customs": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Atlantic Aviation', 'Jet Aviation'], NOW(), NOW()),
('KPHX', 'PHX', 'Phoenix Sky Harbor International Airport', 'Phoenix', 'United States', 33.434278, -112.011583, 1135, 'America/Phoenix', 3, 11489, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support", "Atlantic Aviation"], "catering": true, "ground_transport": true}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Atlantic Aviation'], NOW(), NOW()),
('KSEA', 'SEA', 'Seattle-Tacoma International Airport', 'Seattle', 'United States', 47.449, -122.309306, 433, 'America/Los_Angeles', 3, 11901, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support"], "catering": true, "ground_transport": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support'], NOW(), NOW()),
('KMCO', 'MCO', 'Orlando International Airport', 'Orlando', 'United States', 28.429394, -81.308994, 96, 'America/New_York', 4, 12004, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Signature Flight Support", "Sheltair"], "catering": true, "entertainment": "disney"}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support', 'Sheltair'], NOW(), NOW()),
('KLGA', 'LGA', 'LaGuardia Airport', 'New York', 'United States', 40.777245, -73.872608, 21, 'America/New_York', 2, 7003, ARRAY['Light Jet', 'Midsize Jet'], '{"fbo": ["Atlantic Aviation"], "catering": true, "slots": "restricted"}', '24/7', false, ARRAY['Jet A'], ARRAY['Atlantic Aviation'], NOW(), NOW()),
('CYVR', 'YVR', 'Vancouver International Airport', 'Vancouver', 'Canada', 49.193901, -123.184998, 4, 'America/Vancouver', 3, 11500, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Landmark Aviation"], "catering": true, "customs": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Landmark Aviation'], NOW(), NOW()),
('CYYZ', 'YYZ', 'Toronto Pearson International Airport', 'Toronto', 'Canada', 43.677223, -79.630556, 569, 'America/Toronto', 5, 11120, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Landmark Aviation", "Flying Colours Corp"], "catering": true, "customs": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Landmark Aviation', 'Flying Colours Corp'], NOW(), NOW()),
('KSAN', 'SAN', 'San Diego International Airport', 'San Diego', 'United States', 32.7336, -117.1897, 17, 'America/Los_Angeles', 1, 9401, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet'], '{"fbo": ["Signature Flight Support"], "catering": true, "noise_sensitive": true}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support'], NOW(), NOW()),
('KSFB', 'SFB', 'Orlando Sanford International Airport', 'Sanford', 'United States', 28.777599, -81.237503, 55, 'America/New_York', 2, 9600, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Sheltair"], "catering": true, "cargo": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Sheltair'], NOW(), NOW()),
('KPDX', 'PDX', 'Portland International Airport', 'Portland', 'United States', 45.588722, -122.5975, 31, 'America/Los_Angeles', 3, 11000, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet'], '{"fbo": ["Signature Flight Support"], "catering": true, "environmental": "green"}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support'], NOW(), NOW()),
('KBWI', 'BWI', 'Baltimore/Washington International Thurgood Marshall Airport', 'Baltimore', 'United States', 39.175361, -76.668333, 146, 'America/New_York', 4, 10502, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet'], '{"fbo": ["Signature Flight Support"], "catering": true, "government": true}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support'], NOW(), NOW()),
('KCLT', 'CLT', 'Charlotte Douglas International Airport', 'Charlotte', 'United States', 35.214, -80.943139, 748, 'America/New_York', 4, 10000, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet'], '{"fbo": ["Wilson Air Center"], "catering": true, "banking": true}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Wilson Air Center'], NOW(), NOW()),
('KSTL', 'STL', 'Lambert-St. Louis International Airport', 'St. Louis', 'United States', 38.748697, -90.370028, 618, 'America/Chicago', 4, 11019, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet'], '{"fbo": ["Signature Flight Support"], "catering": true, "central": true}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Signature Flight Support'], NOW(), NOW()),
('KDFW', 'DFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'United States', 32.896828, -97.037997, 607, 'America/Chicago', 7, 13401, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet', 'Heavy Jet'], '{"fbo": ["Atlantic Aviation", "Signature Flight Support"], "catering": true, "business": true}', '24/7', true, ARRAY['Jet A', 'Avgas'], ARRAY['Atlantic Aviation', 'Signature Flight Support'], NOW(), NOW()),
('KCVG', 'CVG', 'Cincinnati/Northern Kentucky International Airport', 'Cincinnati', 'United States', 39.048836, -84.667822, 896, 'America/New_York', 4, 12000, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet'], '{"fbo": ["Comair"], "catering": true, "cargo": true}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Comair'], NOW(), NOW()),
('KTPA', 'TPA', 'Tampa International Airport', 'Tampa', 'United States', 27.975477, -82.533194, 26, 'America/New_York', 3, 11002, ARRAY['Light Jet', 'Midsize Jet', 'Super Midsize Jet'], '{"fbo": ["Sheltair"], "catering": true, "beaches": true}', '24/7', false, ARRAY['Jet A', 'Avgas'], ARRAY['Sheltair'], NOW(), NOW())

ON CONFLICT (icao_code) DO UPDATE SET
    iata_code = EXCLUDED.iata_code,
    name = EXCLUDED.name,
    city = EXCLUDED.city,
    country = EXCLUDED.country,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    elevation = EXCLUDED.elevation,
    timezone = EXCLUDED.timezone,
    runway_count = EXCLUDED.runway_count,
    longest_runway = EXCLUDED.longest_runway,
    aircraft_categories = EXCLUDED.aircraft_categories,
    services = EXCLUDED.services,
    operating_hours = EXCLUDED.operating_hours,
    customs_available = EXCLUDED.customs_available,
    fuel_types = EXCLUDED.fuel_types,
    handling_agents = EXCLUDED.handling_agents,
    updated_at = NOW();

-- ============================================================================
-- Continue with remaining tables in next section due to length...
-- ============================================================================

COMMIT;