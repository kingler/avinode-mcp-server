-- =====================================================
-- ULTIMATE AVIATION CHARTER SYSTEM SEEDING SCRIPT
-- Complete operational data for full platform testing
-- Execute this AFTER creating all tables in FINAL_EXECUTE_IN_SUPABASE_SQL_EDITOR.sql
-- =====================================================

-- First, let's get a list of available aircraft IDs to work with
-- We'll use the existing aircraft in the system

-- COMPREHENSIVE CUSTOMER PROFILES (30 customers)
-- VIP customers, corporate accounts, and individual travelers
INSERT INTO users (id, email, name, phone, company, user_type, preferences, total_bookings, total_spent, customer_rating, created_at) VALUES
-- VIP Customers (10)
('c1000001-1111-2222-3333-444444444444', 'richard.sterling@sterlingwealth.com', 'Richard Sterling', '+1-212-555-0101', 'Sterling Wealth Management', 'VIP', '{"aircraft": ["Ultra Long Range", "Heavy Jet"], "amenities": ["Conference Room", "Champagne Service", "Satellite Internet"], "dietary": ["Gluten-Free"], "communication": "WhatsApp", "loyalty": "Platinum"}', 45, 2850000, 4.9, '2022-03-15T10:30:00Z'),

('c1000002-1111-2222-3333-444444444444', 'sophia.alexandre@alexandregroup.com', 'Sophia Alexandre', '+1-310-555-0102', 'Alexandre International Group', 'VIP', '{"aircraft": ["Heavy Jet", "Ultra Long Range"], "amenities": ["Private Bedroom", "Fine Dining", "Executive Lounge"], "dietary": ["Vegan", "Kosher"], "communication": "Email", "loyalty": "Diamond"}', 38, 2650000, 5.0, '2021-11-20T14:15:00Z'),

('c1000003-1111-2222-3333-444444444444', 'marcus.wellington@wellingtonltd.com', 'Marcus Wellington', '+44-207-555-0103', 'Wellington Financial Ltd', 'VIP', '{"aircraft": ["Ultra Long Range"], "amenities": ["Conference Area", "Satellite Communication", "Premium Catering"], "dietary": [], "communication": "Phone", "loyalty": "Platinum"}', 52, 3200000, 4.8, '2021-08-10T09:45:00Z'),

('c1000004-1111-2222-3333-444444444444', 'elena.rodriguez@techinnova.com', 'Elena Rodriguez', '+34-91-555-0104', 'TechInnova Solutions', 'VIP', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["High-Speed Internet", "Workstation", "Video Conferencing"], "dietary": ["Vegetarian"], "communication": "Email", "loyalty": "Gold"}', 29, 1890000, 4.7, '2022-01-08T16:20:00Z'),

('c1000005-1111-2222-3333-444444444444', 'david.chen@chenfoundation.org', 'David Chen', '+1-415-555-0105', 'Chen Family Foundation', 'VIP', '{"aircraft": ["Ultra Long Range", "Heavy Jet"], "amenities": ["Medical Equipment", "Extended Range", "Luxury Seating"], "dietary": ["Heart-Healthy"], "communication": "Email", "loyalty": "Diamond"}', 41, 2750000, 4.9, '2022-05-22T11:10:00Z'),

('c1000006-1111-2222-3333-444444444444', 'isabella.morganti@morgantievents.it', 'Isabella Morganti', '+39-06-555-0106', 'Morganti Luxury Events', 'VIP', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Entertainment System", "Bar Service", "Custom Catering"], "dietary": ["Italian Cuisine"], "communication": "WhatsApp", "loyalty": "Platinum"}', 33, 2100000, 4.8, '2021-12-05T13:30:00Z'),

('c1000007-1111-2222-3333-444444444444', 'james.morrison@morrisonholdings.com', 'James Morrison', '+1-713-555-0107', 'Morrison Energy Holdings', 'VIP', '{"aircraft": ["Ultra Long Range"], "amenities": ["Secure Communications", "Extended Fuel Range", "Executive Office"], "dietary": ["Low-Sodium"], "communication": "Phone", "loyalty": "Diamond"}', 47, 3100000, 4.9, '2021-09-18T08:45:00Z'),

('c1000008-1111-2222-3333-444444444444', 'natasha.volkov@volkovart.ru', 'Natasha Volkov', '+7-495-555-0108', 'Volkov Art Collection', 'VIP', '{"aircraft": ["Heavy Jet"], "amenities": ["Climate Control", "Security Systems", "Art Transportation"], "dietary": ["Russian Cuisine"], "communication": "Email", "loyalty": "Gold"}', 25, 1650000, 4.6, '2022-02-28T15:55:00Z'),

('c1000009-1111-2222-3333-444444444444', 'ahmed.almansouri@almansourigroup.ae', 'Ahmed Al-Mansouri', '+971-4-555-0109', 'Al-Mansouri Trading Group', 'VIP', '{"aircraft": ["Ultra Long Range", "Heavy Jet"], "amenities": ["Prayer Area", "Halal Catering", "Business Center"], "dietary": ["Halal"], "communication": "WhatsApp", "loyalty": "Platinum"}', 39, 2450000, 4.8, '2022-04-12T12:25:00Z'),

('c1000010-1111-2222-3333-444444444444', 'catherine.dubois@duboisventures.fr', 'Catherine Dubois', '+33-1-555-0110', 'Dubois Venture Capital', 'VIP', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Wine Selection", "Gourmet Dining", "Quiet Cabin"], "dietary": ["French Cuisine"], "communication": "Email", "loyalty": "Diamond"}', 44, 2800000, 5.0, '2021-10-30T17:40:00Z'),

-- Corporate Accounts (15)
('c2000001-2222-3333-4444-555555555555', 'travel@techcorp.com', 'Michael Zhang', '+1-408-555-0201', 'TechCorp Innovations', 'Corporate', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["WiFi", "Power Outlets", "Meeting Space"], "dietary": [], "communication": "Email", "loyalty": "Silver"}', 18, 485000, 4.5, '2022-06-15T09:15:00Z'),

('c2000002-2222-3333-4444-555555555555', 'exec.travel@globalmanufacturing.com', 'Sarah Thompson', '+1-313-555-0202', 'Global Manufacturing Corp', 'Corporate', '{"aircraft": ["Midsize Jet", "Super Midsize Jet"], "amenities": ["Cargo Space", "Durable Interior", "Basic Catering"], "dietary": [], "communication": "Phone", "loyalty": "Bronze"}', 22, 650000, 4.3, '2022-03-08T14:20:00Z'),

('c2000003-2222-3333-4444-555555555555', 'flights@mediapharm.com', 'Robert Kim', '+1-617-555-0203', 'MediaPharm Research', 'Corporate', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Medical Storage", "Temperature Control", "Quiet Environment"], "dietary": [], "communication": "Email", "loyalty": "Silver"}', 15, 420000, 4.4, '2022-08-22T11:50:00Z'),

('c2000004-2222-3333-4444-555555555555', 'corporate.travel@financialservices.com', 'Jennifer Martinez', '+1-704-555-0204', 'Premier Financial Services', 'Corporate', '{"aircraft": ["Midsize Jet", "Heavy Jet"], "amenities": ["Secure Communications", "Executive Seating", "Document Storage"], "dietary": [], "communication": "Email", "loyalty": "Gold"}', 28, 820000, 4.6, '2022-01-18T16:35:00Z'),

('c2000005-2222-3333-4444-555555555555', 'travel.dept@constructionplus.com', 'Daniel Johnson', '+1-713-555-0205', 'Construction Plus LLC', 'Corporate', '{"aircraft": ["Light Jet"], "amenities": ["Durability", "Weather Resistance", "Basic Service"], "dietary": [], "communication": "Phone", "loyalty": "Bronze"}', 12, 285000, 4.2, '2022-09-05T08:30:00Z'),

('c2000006-2222-3333-4444-555555555555', 'aviation@retailempire.com', 'Lisa Wang', '+1-206-555-0206', 'Retail Empire International', 'Corporate', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Cargo Capacity", "Multiple Destinations", "Cost Efficiency"], "dietary": [], "communication": "Email", "loyalty": "Silver"}', 25, 590000, 4.4, '2022-05-10T13:45:00Z'),

('c2000007-2222-3333-4444-555555555555', 'exec.flights@energysolutions.com', 'Thomas Anderson', '+1-832-555-0207', 'Energy Solutions Group', 'Corporate', '{"aircraft": ["Super Midsize Jet", "Heavy Jet"], "amenities": ["Long Range", "Fuel Efficiency", "Weather Radar"], "dietary": [], "communication": "Phone", "loyalty": "Gold"}', 31, 950000, 4.5, '2021-11-28T10:20:00Z'),

('c2000008-2222-3333-4444-555555555555', 'travel@lawfirm.com', 'Amanda Wilson', '+1-312-555-0208', 'Wilson & Associates Law', 'Corporate', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Privacy", "Document Security", "Meeting Capability"], "dietary": [], "communication": "Email", "loyalty": "Silver"}', 19, 475000, 4.3, '2022-07-03T15:10:00Z'),

('c2000009-2222-3333-4444-555555555555', 'corporate.jets@consultingfirm.com', 'Kevin Brown', '+1-617-555-0209', 'Strategic Consulting Partners', 'Corporate', '{"aircraft": ["Midsize Jet", "Super Midsize Jet"], "amenities": ["Presentation Equipment", "High-Speed Internet", "Catering"], "dietary": [], "communication": "Email", "loyalty": "Gold"}', 26, 720000, 4.6, '2022-02-14T12:25:00Z'),

('c2000010-2222-3333-4444-555555555555', 'flights@realestate.com', 'Michelle Davis', '+1-305-555-0210', 'Premier Real Estate Group', 'Corporate', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Scenic Views", "Photography Equipment", "Client Entertainment"], "dietary": [], "communication": "Phone", "loyalty": "Silver"}', 21, 525000, 4.4, '2022-04-27T09:55:00Z'),

('c2000011-2222-3333-4444-555555555555', 'travel@automotive.com', 'Christopher Taylor', '+1-313-555-0211', 'Automotive Innovations Inc', 'Corporate', '{"aircraft": ["Midsize Jet"], "amenities": ["Prototype Transport", "Secure Storage", "Technical Equipment"], "dietary": [], "communication": "Email", "loyalty": "Bronze"}', 14, 350000, 4.1, '2022-06-08T14:40:00Z'),

('c2000012-2222-3333-4444-555555555555', 'executive.travel@healthcare.com', 'Dr. Patricia Garcia', '+1-713-555-0212', 'Advanced Healthcare Systems', 'Corporate', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Medical Equipment", "Emergency Capability", "Clean Environment"], "dietary": [], "communication": "Phone", "loyalty": "Silver"}', 17, 425000, 4.5, '2022-08-15T11:15:00Z'),

('c2000013-2222-3333-4444-555555555555', 'flights@agricorp.com', 'Mark Rodriguez', '+1-559-555-0213', 'AgriCorp International', 'Corporate', '{"aircraft": ["Light Jet"], "amenities": ["Weather Equipment", "Agricultural Surveys", "Cargo Space"], "dietary": [], "communication": "Email", "loyalty": "Bronze"}', 11, 275000, 4.0, '2022-09-22T16:50:00Z'),

('c2000014-2222-3333-4444-555555555555', 'corporate.aviation@entertainment.com', 'Ashley Martinez', '+1-323-555-0214', 'Entertainment Studios Group', 'Corporate', '{"aircraft": ["Super Midsize Jet", "Heavy Jet"], "amenities": ["Equipment Transport", "Celebrity Privacy", "Luxury Amenities"], "dietary": ["Organic", "Gluten-Free"], "communication": "WhatsApp", "loyalty": "Gold"}', 29, 890000, 4.7, '2022-01-30T13:20:00Z'),

('c2000015-2222-3333-4444-555555555555', 'travel@sportsmanagement.com', 'Jason Wilson', '+1-214-555-0215', 'Elite Sports Management', 'Corporate', '{"aircraft": ["Heavy Jet"], "amenities": ["Team Transport", "Sports Equipment", "Recovery Facilities"], "dietary": ["High-Protein", "Performance Nutrition"], "communication": "Phone", "loyalty": "Gold"}', 33, 1100000, 4.6, '2021-12-18T10:05:00Z'),

-- Individual Travelers (5)
('c3000001-3333-4444-5555-666666666666', 'john.traveler@email.com', 'John Mitchell', '+1-555-123-4567', NULL, 'Individual', '{"aircraft": ["Light Jet"], "amenities": ["Basic Service", "Comfortable Seating"], "dietary": [], "communication": "Email", "loyalty": "Bronze"}', 8, 125000, 4.2, '2022-10-12T09:30:00Z'),

('c3000002-3333-4444-5555-666666666666', 'mary.vacation@email.com', 'Mary Johnson', '+1-555-234-5678', NULL, 'Individual', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Scenic Routes", "Photography", "Comfortable Interior"], "dietary": ["Vegetarian"], "communication": "Phone", "loyalty": "Bronze"}', 5, 95000, 4.3, '2022-11-05T14:45:00Z'),

('c3000003-3333-4444-5555-666666666666', 'robert.business@email.com', 'Robert Smith', '+1-555-345-6789', 'Smith Consulting', 'Individual', '{"aircraft": ["Midsize Jet"], "amenities": ["WiFi", "Meeting Space", "Productivity Tools"], "dietary": [], "communication": "Email", "loyalty": "Silver"}', 12, 285000, 4.4, '2022-08-28T11:20:00Z'),

('c3000004-3333-4444-5555-666666666666', 'susan.luxury@email.com', 'Susan Williams', '+1-555-456-7890', NULL, 'Individual', '{"aircraft": ["Super Midsize Jet"], "amenities": ["Luxury Interior", "Premium Catering", "Entertainment"], "dietary": ["Gourmet"], "communication": "WhatsApp", "loyalty": "Gold"}', 15, 450000, 4.6, '2022-07-14T16:10:00Z'),

('c3000005-3333-4444-5555-666666666666', 'david.frequent@email.com', 'David Brown', '+1-555-567-8901', 'Brown Enterprises', 'Individual', '{"aircraft": ["Light Jet", "Midsize Jet"], "amenities": ["Reliability", "Punctuality", "Cost-Effective"], "dietary": [], "communication": "Email", "loyalty": "Silver"}', 9, 195000, 4.3, '2022-09-30T12:55:00Z')

ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    phone = EXCLUDED.phone,
    company = EXCLUDED.company,
    user_type = EXCLUDED.user_type,
    preferences = EXCLUDED.preferences,
    total_bookings = EXCLUDED.total_bookings,
    total_spent = EXCLUDED.total_spent,
    customer_rating = EXCLUDED.customer_rating;

-- COMPREHENSIVE BOOKING RECORDS (30 bookings across all categories)
-- We'll spread bookings across past, present, and future with realistic variety

-- First, let's create some operators using the IDs we defined in the schema
-- These should already be inserted if you ran the previous script, but ensuring they exist

-- Now comprehensive bookings across different time periods and statuses
INSERT INTO bookings (id, user_id, aircraft_id, operator_id, status, departure_airport, arrival_airport, departure_date, departure_time, arrival_date, arrival_time, flight_duration, passenger_count, total_price, currency, payment_status, payment_method, deposit_amount, balance_amount, deposit_due_date, balance_due_date, special_requests, booking_reference, quote_id, confirmation_code, created_at) VALUES

-- COMPLETED BOOKINGS (Past - 12 bookings)
('b1000001-aaaa-bbbb-cccc-dddddddddddd', 'c1000001-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Completed', 'KTEB', 'KMIA', '2024-07-15', '09:00:00', '2024-07-15', '12:30:00', 3.5, 4, 35000.00, 'USD', 'FullyPaid', 'CreditCard', 17500.00, 17500.00, '2024-07-01', '2024-07-14', 'Ground transportation, champagne service, dietary: gluten-free', 'JV-2024-001', '750e8400-e29b-41d4-a716-446655440001', 'JV4A15TEB', '2024-06-20T10:30:00Z'),

('b1000002-aaaa-bbbb-cccc-dddddddddddd', 'c1000002-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Completed', 'KLAX', 'EGLL', '2024-06-22', '14:00:00', '2024-06-23', '08:30:00', 11.5, 6, 125000.00, 'USD', 'FullyPaid', 'WireTransfer', 62500.00, 62500.00, '2024-06-08', '2024-06-21', 'Private bedroom setup, vegan meals, conference area', 'EA-2024-003', '750e8400-e29b-41d4-a716-446655440002', 'EA6B22LAX', '2024-05-28T14:15:00Z'),

('b1000003-aaaa-bbbb-cccc-dddddddddddd', 'c2000001-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Completed', 'KSFO', 'KLAS', '2024-08-10', '16:30:00', '2024-08-10', '18:15:00', 1.75, 3, 18500.00, 'USD', 'FullyPaid', 'CorporateCard', 9250.00, 9250.00, '2024-07-27', '2024-08-09', 'WiFi required, meeting space setup', 'TC-2024-007', NULL, 'TC3C10SFO', '2024-07-15T09:45:00Z'),

('b1000004-aaaa-bbbb-cccc-dddddddddddd', 'c1000003-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440003', 'Completed', 'EGLL', 'KJFK', '2024-05-18', '11:00:00', '2024-05-18', '18:45:00', 7.75, 8, 95000.00, 'USD', 'FullyPaid', 'WireTransfer', 47500.00, 47500.00, '2024-05-04', '2024-05-17', 'Conference area, premium catering, satellite communications', 'GE-2024-012', NULL, 'GE8E18LHR', '2024-04-25T16:20:00Z'),

('b1000005-aaaa-bbbb-cccc-dddddddddddd', 'c2000004-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Completed', 'KCLT', 'KJFK', '2024-09-05', '08:15:00', '2024-09-05', '10:30:00', 2.25, 2, 22000.00, 'USD', 'FullyPaid', 'CorporateCard', 11000.00, 11000.00, '2024-08-22', '2024-09-04', 'Secure communications, document storage', 'PF-2024-015', NULL, 'PF2J05CLT', '2024-08-18T11:30:00Z'),

('b1000006-aaaa-bbbb-cccc-dddddddddddd', 'c1000004-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Completed', 'LEMD', 'LFPG', '2024-04-12', '13:20:00', '2024-04-12', '15:45:00', 2.42, 5, 28000.00, 'USD', 'FullyPaid', 'CreditCard', 14000.00, 14000.00, '2024-03-29', '2024-04-11', 'High-speed internet, workstation setup, video conferencing', 'TI-2024-008', NULL, 'TI5M12MAD', '2024-03-22T13:45:00Z'),

('b1000007-aaaa-bbbb-cccc-dddddddddddd', 'c3000001-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Completed', 'KBOS', 'KMIA', '2024-10-18', '12:45:00', '2024-10-18', '16:20:00', 3.58, 1, 24500.00, 'USD', 'FullyPaid', 'CreditCard', 12250.00, 12250.00, '2024-10-04', '2024-10-17', 'Basic service, comfortable seating', 'JM-2024-022', NULL, 'JM1B18BOS', '2024-09-28T15:20:00Z'),

('b1000008-aaaa-bbbb-cccc-dddddddddddd', 'c2000007-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440003', 'Completed', 'KIAH', 'KDEN', '2024-03-25', '07:30:00', '2024-03-25', '09:45:00', 2.25, 4, 26500.00, 'USD', 'FullyPaid', 'CorporateCard', 13250.00, 13250.00, '2024-03-11', '2024-03-24', 'Long range capability, fuel efficiency, weather radar', 'ES-2024-005', NULL, 'ES4H25IAH', '2024-03-08T08:15:00Z'),

('b1000009-aaaa-bbbb-cccc-dddddddddddd', 'c1000005-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Completed', 'KORD', 'KPHL', '2024-11-02', '15:10:00', '2024-11-02', '17:35:00', 2.42, 3, 23500.00, 'USD', 'FullyPaid', 'WireTransfer', 11750.00, 11750.00, '2024-10-19', '2024-11-01', 'Medical equipment transport, extended range, luxury seating', 'CF-2024-028', NULL, 'CF3O02ORD', '2024-10-12T12:40:00Z'),

('b1000010-aaaa-bbbb-cccc-dddddddddddd', 'c2000009-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Completed', 'KBOS', 'KDCA', '2024-08-28', '09:40:00', '2024-08-28', '11:25:00', 1.75, 6, 19500.00, 'USD', 'FullyPaid', 'CorporateCard', 9750.00, 9750.00, '2024-08-14', '2024-08-27', 'Presentation equipment, high-speed internet, catering', 'SC-2024-019', NULL, 'SC6B28BOS', '2024-08-05T14:25:00Z'),

('b1000011-aaaa-bbbb-cccc-dddddddddddd', 'c3000004-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Completed', 'KLAS', 'KPHX', '2024-07-08', '18:20:00', '2024-07-08', '19:35:00', 1.25, 2, 16500.00, 'USD', 'FullyPaid', 'CreditCard', 8250.00, 8250.00, '2024-06-24', '2024-07-07', 'Luxury interior, premium catering, entertainment system', 'SW-2024-014', NULL, 'SW2L08LAS', '2024-06-18T16:45:00Z'),

('b1000012-aaaa-bbbb-cccc-dddddddddddd', 'c2000014-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Completed', 'KLAX', 'KORD', '2024-09-15', '06:45:00', '2024-09-15', '12:30:00', 4.75, 8, 52000.00, 'USD', 'FullyPaid', 'WireTransfer', 26000.00, 26000.00, '2024-09-01', '2024-09-14', 'Equipment transport, celebrity privacy, luxury amenities, organic catering', 'ES-2024-021', NULL, 'ES8L15LAX', '2024-08-25T10:30:00Z'),

-- CONFIRMED BOOKINGS (Near future - 8 bookings)
('b2000001-bbbb-cccc-dddd-eeeeeeeeeeee', 'c1000007-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Confirmed', 'KHOU', 'KJFK', '2024-12-20', '08:00:00', '2024-12-20', '12:45:00', 4.75, 6, 58000.00, 'USD', 'DepositPaid', 'WireTransfer', 29000.00, 29000.00, '2024-12-06', '2024-12-19', 'Secure communications, extended fuel range, executive office setup', 'ME-2024-031', NULL, 'ME6H20HOU', '2024-11-28T09:15:00Z'),

('b2000002-bbbb-cccc-dddd-eeeeeeeeeeee', 'c1000008-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440003', 'Confirmed', 'UUDD', 'LFPG', '2024-12-18', '14:30:00', '2024-12-18', '19:15:00', 4.75, 4, 65000.00, 'USD', 'DepositPaid', 'WireTransfer', 32500.00, 32500.00, '2024-12-04', '2024-12-17', 'Climate control for art transport, security systems, Russian cuisine', 'VA-2024-032', NULL, 'VA4D18DME', '2024-11-25T14:20:00Z'),

('b2000003-bbbb-cccc-dddd-eeeeeeeeeeee', 'c2000002-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Confirmed', 'KDET', 'KATL', '2024-12-15', '11:20:00', '2024-12-15', '13:45:00', 2.42, 5, 28500.00, 'USD', 'DepositPaid', 'CorporateCard', 14250.00, 14250.00, '2024-12-01', '2024-12-14', 'Cargo space for equipment, durable interior, basic catering', 'GM-2024-029', NULL, 'GM5D15DET', '2024-11-22T11:40:00Z'),

('b2000004-bbbb-cccc-dddd-eeeeeeeeeeee', 'c1000009-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Confirmed', 'OMDB', 'EGLL', '2024-12-22', '16:45:00', '2024-12-23', '00:30:00', 7.75, 7, 89000.00, 'USD', 'DepositPaid', 'WireTransfer', 44500.00, 44500.00, '2024-12-08', '2024-12-21', 'Prayer area setup, halal catering, business center configuration', 'AM-2024-033', NULL, 'AM7D22DXB', '2024-11-30T16:10:00Z'),

('b2000005-bbbb-cccc-dddd-eeeeeeeeeeee', 'c3000002-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Confirmed', 'KPHX', 'KDEN', '2024-12-12', '13:15:00', '2024-12-12', '15:20:00', 2.08, 2, 21500.00, 'USD', 'DepositPaid', 'CreditCard', 10750.00, 10750.00, '2024-11-28', '2024-12-11', 'Scenic route for photography, comfortable interior, vegetarian meals', 'MJ-2024-027', NULL, 'MJ2P12PHX', '2024-11-20T13:35:00Z'),

('b2000006-bbbb-cccc-dddd-eeeeeeeeeeee', 'c2000010-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440003', 'Confirmed', 'KMIA', 'KJFK', '2024-12-14', '10:30:00', '2024-12-14', '13:45:00', 3.25, 3, 32500.00, 'USD', 'DepositPaid', 'CorporateCard', 16250.00, 16250.00, '2024-11-30', '2024-12-13', 'Scenic views capability, client entertainment setup', 'PR-2024-030', NULL, 'PR3M14MIA', '2024-11-24T10:55:00Z'),

('b2000007-bbbb-cccc-dddd-eeeeeeeeeeee', 'c2000015-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Confirmed', 'KDFW', 'KORD', '2024-12-16', '07:45:00', '2024-12-16', '10:20:00', 2.58, 12, 45000.00, 'USD', 'DepositPaid', 'CorporateCard', 22500.00, 22500.00, '2024-12-02', '2024-12-15', 'Team transport configuration, sports equipment storage, performance nutrition', 'ES-2024-034', NULL, 'ES12D16DFW', '2024-11-26T07:20:00Z'),

('b2000008-bbbb-cccc-dddd-eeeeeeeeeeee', 'c1000010-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Confirmed', 'LFPG', 'LIMC', '2024-12-19', '12:00:00', '2024-12-19', '14:15:00', 2.25, 5, 31000.00, 'USD', 'DepositPaid', 'WireTransfer', 15500.00, 15500.00, '2024-12-05', '2024-12-18', 'Premium wine selection, gourmet French dining, quiet cabin environment', 'DV-2024-035', NULL, 'DV5F19CDG', '2024-12-01T12:45:00Z'),

-- PENDING BOOKINGS (Future - 6 bookings)
('b3000001-cccc-dddd-eeee-ffffffffffff', 'c2000008-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Pending', 'KORD', 'KBOS', '2025-01-15', '14:20:00', '2025-01-15', '16:55:00', 2.58, 4, 29500.00, 'USD', 'Pending', NULL, NULL, 29500.00, '2024-12-31', '2025-01-14', 'Privacy requirements, document security, meeting capability', 'WA-2025-001', NULL, 'PENDING001', '2024-12-08T14:30:00Z'),

('b3000002-cccc-dddd-eeee-ffffffffffff', 'c3000003-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Pending', 'KSEA', 'KORD', '2025-01-22', '09:10:00', '2025-01-22', '14:35:00', 4.42, 3, 41500.00, 'USD', 'Pending', NULL, NULL, 41500.00, '2025-01-07', '2025-01-21', 'WiFi essential, meeting space setup, productivity tools', 'SC-2025-002', NULL, 'PENDING002', '2024-12-10T09:45:00Z'),

('b3000003-cccc-dddd-eeee-ffffffffffff', 'c2000006-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440003', 'Pending', 'KSEA', 'KLAX', '2025-02-05', '11:45:00', '2025-02-05', '14:20:00', 2.58, 6, 33000.00, 'USD', 'Pending', NULL, NULL, 33000.00, '2025-01-21', '2025-02-04', 'Cargo capacity for samples, multiple destination capability', 'RE-2025-003', NULL, 'PENDING003', '2024-12-12T11:20:00Z'),

('b3000004-cccc-dddd-eeee-ffffffffffff', 'c1000006-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Pending', 'LIMC', 'LEMD', '2025-02-14', '16:30:00', '2025-02-14', '18:45:00', 2.25, 8, 38500.00, 'USD', 'Pending', NULL, NULL, 38500.00, '2025-01-30', '2025-02-13', 'Entertainment system, luxury bar service, custom Italian catering', 'ML-2025-004', NULL, 'PENDING004', '2024-12-15T16:40:00Z'),

('b3000005-cccc-dddd-eeee-ffffffffffff', 'c2000013-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Pending', 'KFRE', 'KPHX', '2025-03-08', '08:30:00', '2025-03-08', '10:15:00', 1.75, 2, 18500.00, 'USD', 'Pending', NULL, NULL, 18500.00, '2025-02-21', '2025-03-07', 'Agricultural survey equipment, weather monitoring, cargo space', 'AC-2025-005', NULL, 'PENDING005', '2024-12-18T08:55:00Z'),

('b3000006-cccc-dddd-eeee-ffffffffffff', 'c3000005-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440003', 'Pending', 'KBOS', 'KMSP', '2025-03-20', '12:00:00', '2025-03-20', '14:30:00', 2.5, 1, 24000.00, 'USD', 'Pending', NULL, NULL, 24000.00, '2025-03-05', '2025-03-19', 'Reliable service, punctuality focus, cost-effective', 'BE-2025-006', NULL, 'PENDING006', '2024-12-20T12:15:00Z'),

-- CANCELLED BOOKINGS (4 bookings for realistic variety)
('b4000001-dddd-eeee-ffff-000000000000', 'c2000011-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Cancelled', 'KDET', 'KORD', '2024-11-25', '15:45:00', '2024-11-25', '18:20:00', 2.58, 3, 27500.00, 'USD', 'Refunded', 'CorporateCard', 13750.00, 0.00, '2024-11-11', '2024-11-24', 'Prototype transport, secure storage - CANCELLED due to schedule change', 'AI-2024-025', NULL, 'CANCELLED001', '2024-11-05T15:30:00Z'),

('b4000002-dddd-eeee-ffff-000000000000', 'c2000012-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440002', 'Cancelled', 'KIAH', 'KBOS', '2024-10-30', '09:15:00', '2024-10-30', '13:45:00', 4.5, 2, 38000.00, 'USD', 'Refunded', 'CreditCard', 19000.00, 0.00, '2024-10-16', '2024-10-29', 'Medical equipment transport - CANCELLED due to weather', 'AH-2024-026', NULL, 'CANCELLED002', '2024-10-08T09:40:00Z'),

('b4000003-dddd-eeee-ffff-000000000000', 'c3000002-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440003', 'Cancelled', 'KLAS', 'KDEN', '2025-01-10', '13:30:00', '2025-01-10', '15:45:00', 2.25, 1, 22000.00, 'USD', 'Refunded', 'CreditCard', 11000.00, 0.00, '2024-12-26', '2025-01-09', 'Photography flight - CANCELLED due to personal reasons', 'MJ-2025-007', NULL, 'CANCELLED003', '2024-12-18T13:50:00Z'),

('b4000004-dddd-eeee-ffff-000000000000', 'c2000003-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', '550e8400-e29b-41d4-a716-446655440001', 'Cancelled', 'KBOS', 'KORD', '2024-12-05', '10:20:00', '2024-12-05', '12:45:00', 2.42, 4, 26500.00, 'USD', 'Refunded', 'CorporateCard', 13250.00, 0.00, '2024-11-21', '2024-12-04', 'Medical storage requirements - CANCELLED due to equipment issues', 'MP-2024-036', NULL, 'CANCELLED004', '2024-11-15T10:45:00Z')

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
    special_requests = EXCLUDED.special_requests,
    booking_reference = EXCLUDED.booking_reference,
    quote_id = EXCLUDED.quote_id,
    confirmation_code = EXCLUDED.confirmation_code;

-- ============================================================================
-- FLIGHT OPERATIONS DATA WITH REAL-TIME TRACKING
-- ============================================================================

-- Flight Legs (Current and Recent Operations)
INSERT INTO flight_legs (id, aircraft_id, departure_airport, arrival_airport, departure_date, departure_time, arrival_date, arrival_time, flight_time, distance, status, price, currency, leg_type, dynamic_pricing, instant_booking, special_offers, weather_alerts, demand_score, price_optimized) VALUES

-- Active In-Progress Flights (Real-time tracking)
('fl001001-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', 'KJFK', 'EGLL', '2024-08-31', '14:30:00', '2024-09-01', '02:15:00', 7.75, 3459, 'InProgress', 89500.00, 'USD', 'Charter', true, false, '{"early_booking": 15, "loyalty_discount": 10}', '{"turbulence": "moderate", "winds": "strong_headwinds"}', 0.89, true),

('fl001002-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', 'KLAX', 'KORD', '2024-08-31', '16:45:00', '2024-08-31', '22:30:00', 4.75, 1745, 'InProgress', 52000.00, 'USD', 'Charter', true, false, '{"group_booking": 12}', '{"weather": "clear", "winds": "favorable"}', 0.76, true),

-- Available Empty Legs (Immediate booking opportunities)
('fl002001-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', 'KBOS', 'KMIA', '2024-09-01', '08:15:00', '2024-09-01', '12:30:00', 3.25, 1258, 'Available', 18500.00, 'USD', 'EmptyLeg', true, true, '{"empty_leg": 65, "instant_book": 5}', '{}', 0.45, true),

('fl002002-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', 'KLAS', 'KDEN', '2024-09-02', '11:20:00', '2024-09-02', '13:35:00', 2.25, 628, 'Available', 12500.00, 'USD', 'EmptyLeg', true, true, '{"empty_leg": 70, "same_day": 10}', '{}', 0.32, true),

('fl002003-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', 'KIAH', 'KATL', '2024-09-03', '15:45:00', '2024-09-03', '18:20:00', 2.58, 789, 'Available', 14800.00, 'USD', 'EmptyLeg', true, true, '{"empty_leg": 60, "weekend": 8}', '{}', 0.28, true),

-- Positioning Flights (Aircraft repositioning)
('fl003001-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', 'KJFK', 'KBOS', '2024-09-04', '07:30:00', '2024-09-04', '08:45:00', 1.25, 187, 'Available', 8500.00, 'USD', 'Positioning', false, false, '{"positioning": 25}', '{}', 0.15, false),

('fl003002-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', 'KMIA', 'KFLL', '2024-09-05', '09:10:00', '2024-09-05', '09:40:00', 0.5, 27, 'Available', 5000.00, 'USD', 'Positioning', false, false, '{"short_hop": 20}', '{}', 0.08, false),

-- Completed Recent Flights
('fl004001-4444-5555-6666-777777777777', '05c92852-911b-435d-be52-515fcf5b78fb', 'KSFO', 'KLAS', '2024-08-30', '13:20:00', '2024-08-30', '15:05:00', 1.75, 414, 'Completed', 19500.00, 'USD', 'Charter', true, false, '{"weekend": 8}', '{}', 0.68, true),

('fl004002-4444-5555-6666-777777777777', '05c92852-911b-435d-be52-515fcf5b78fb', 'KORD', 'KBOS', '2024-08-29', '10:45:00', '2024-08-29', '13:20:00', 2.58, 864, 'Completed', 28500.00, 'USD', 'Charter', true, false, '{"corporate": 5}', '{}', 0.82, true),

-- Scheduled Future Flights
('fl005001-5555-6666-7777-888888888888', '05c92852-911b-435d-be52-515fcf5b78fb', 'EGLL', 'LFPG', '2024-09-15', '16:30:00', '2024-09-15', '17:45:00', 1.25, 214, 'Booked', 24500.00, 'USD', 'Charter', true, false, '{"european": 12}', '{}', 0.91, true),

('fl005002-5555-6666-7777-888888888888', '05c92852-911b-435d-be52-515fcf5b78fb', 'OMDB', 'EGLL', '2024-12-22', '16:45:00', '2024-12-23', '00:30:00', 7.75, 3414, 'Booked', 89000.00, 'USD', 'Charter', true, false, '{"long_haul": 18, "luxury": 25}', '{"route_weather": "seasonal_monitoring"}', 0.94, true)

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
-- PAYMENT RECORDS, INVOICES, AND TRANSACTION HISTORY
-- ============================================================================

-- Transactions for Completed Bookings
INSERT INTO transactions (id, booking_id, transaction_type, amount, currency, status, payment_method, processor_name, processor_transaction_id, processor_fee, blockchain_tx_hash, smart_contract_address, gas_used, risk_score, fraud_flags, description, customer_reference, merchant_reference, initiated_date, completed_date) VALUES

-- Richard Sterling - Ultra Luxury VIP transactions
('tx001001-1111-2222-3333-444444444444', 'b1000001-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 47500.00, 'USD', 'Completed', 'WireTransfer', 'JPMorganChase', 'JPM789123456', 85.50, '0xa1b2c3d4e5f6789012345678901234567890abcdef', '0x1234567890abcdef', '21000', 12, ARRAY[]::TEXT[], 'Deposit payment for transcontinental charter', 'RS-DEP-001', 'AVI-001-DEP', '2024-06-15T10:30:00Z', '2024-06-15T10:35:00Z'),

('tx001002-1111-2222-3333-444444444444', 'b1000001-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 47500.00, 'USD', 'Completed', 'WireTransfer', 'JPMorganChase', 'JPM789123457', 85.50, '0xa1b2c3d4e5f6789012345678901234567890abcdf0', '0x1234567890abcdef', '21000', 8, ARRAY[]::TEXT[], 'Final payment for transcontinental charter', 'RS-FIN-001', 'AVI-001-FIN', '2024-07-14T09:45:00Z', '2024-07-14T09:50:00Z'),

-- TechCorp Innovations - Corporate payments
('tx002001-2222-3333-4444-555555555555', 'b1000002-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 18250.00, 'USD', 'Completed', 'CorporateCard', 'AmexCorporate', 'AMEX567890123', 364.50, NULL, NULL, NULL, 25, ARRAY[]::TEXT[], 'Corporate charter payment - Seattle to Chicago', 'TC-PAY-007', 'AVI-002-CORP', '2024-06-20T14:20:00Z', '2024-06-20T14:22:00Z'),

-- Margaret Hamilton - Medical transport with insurance
('tx003001-3333-4444-5555-666666666666', 'b1000003-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 11750.00, 'USD', 'Completed', 'WireTransfer', 'BankOfAmerica', 'BOA345678901', 47.50, NULL, NULL, NULL, 15, ARRAY[]::TEXT[], 'Medical transport payment with insurance coverage', 'MH-MED-001', 'AVI-003-MED', '2024-05-10T16:15:00Z', '2024-05-10T16:18:00Z'),

-- Global Enterprises - High-value international
('tx004001-4444-5555-6666-777777777777', 'b1000004-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 47500.00, 'USD', 'Completed', 'WireTransfer', 'CitibankGlobal', 'CITI987654321', 142.50, NULL, NULL, NULL, 18, ARRAY[]::TEXT[], 'Deposit - London to New York executive charter', 'GE-INT-012', 'AVI-004-DEP', '2024-05-04T16:20:00Z', '2024-05-04T16:25:00Z'),

('tx004002-4444-5555-6666-777777777777', 'b1000004-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 47500.00, 'USD', 'Completed', 'WireTransfer', 'CitibankGlobal', 'CITI987654322', 142.50, NULL, NULL, NULL, 12, ARRAY[]::TEXT[], 'Final payment - London to New York executive charter', 'GE-INT-012F', 'AVI-004-FIN', '2024-05-17T11:30:00Z', '2024-05-17T11:33:00Z'),

-- Phoenix Financial - Corporate efficiency
('tx005001-5555-6666-7777-888888888888', 'b1000005-aaaa-bbbb-cccc-dddddddddddd', 'Payment', 22000.00, 'USD', 'Completed', 'CorporateCard', 'ChaseBusinessCard', 'CHASE123789456', 440.00, NULL, NULL, NULL, 22, ARRAY[]::TEXT[], 'Corporate charter - Charlotte to New York', 'PF-CORP-015', 'AVI-005-CORP', '2024-08-22T11:30:00Z', '2024-08-22T11:32:00Z'),

-- Confirmed Bookings - Deposit Transactions
('tx006001-6666-7777-8888-999999999999', 'b2000001-bbbb-cccc-dddd-eeeeeeeeeeee', 'Payment', 29000.00, 'USD', 'Completed', 'WireTransfer', 'WellsFargoPrivate', 'WF456789012', 116.00, NULL, NULL, NULL, 10, ARRAY[]::TEXT[], 'Deposit payment - Houston to New York executive', 'ME-DEP-031', 'AVI-031-DEP', '2024-11-28T09:15:00Z', '2024-11-28T09:20:00Z'),

('tx006002-6666-7777-8888-999999999999', 'b2000002-bbbb-cccc-dddd-eeeeeeeeeeee', 'Payment', 32500.00, 'USD', 'Completed', 'WireTransfer', 'UBSPrivate', 'UBS789012345', 162.50, NULL, NULL, NULL, 8, ARRAY[]::TEXT[], 'Deposit payment - Moscow to Paris art transport', 'VA-DEP-032', 'AVI-032-DEP', '2024-11-25T14:20:00Z', '2024-11-25T14:25:00Z'),

-- Refund Transactions for Cancelled Bookings
('tx007001-7777-8888-9999-aaaaaaaaaaaa', 'b4000001-dddd-eeee-ffff-000000000000', 'Refund', 13750.00, 'USD', 'Completed', 'CorporateCard', 'ChaseBusinessCard', 'CHASE789456123', 0.00, NULL, NULL, NULL, 5, ARRAY[]::TEXT[], 'Refund for cancelled Detroit-Chicago charter', 'AI-REF-025', 'AVI-025-REF', '2024-11-20T10:15:00Z', '2024-11-20T10:20:00Z'),

('tx007002-7777-8888-9999-aaaaaaaaaaaa', 'b4000002-dddd-eeee-ffff-000000000000', 'Refund', 19000.00, 'USD', 'Completed', 'CreditCard', 'VisaPlatinum', 'VISA456123789', 0.00, NULL, NULL, NULL, 3, ARRAY[]::TEXT[], 'Weather cancellation refund - Houston to Boston', 'AH-REF-026', 'AVI-026-REF', '2024-10-25T14:30:00Z', '2024-10-25T14:32:00Z'),

-- Processing Fees
('tx008001-8888-9999-aaaa-bbbbbbbbbbbb', 'b1000006-aaaa-bbbb-cccc-dddddddddddd', 'Fee', 280.00, 'USD', 'Completed', 'CreditCard', 'MastercardBusiness', 'MC345678901', 8.40, NULL, NULL, NULL, 5, ARRAY[]::TEXT[], 'Processing fee for Madrid-Paris charter', 'TI-FEE-008', 'AVI-008-FEE', '2024-03-29T13:45:00Z', '2024-03-29T13:47:00Z'),

('tx008002-8888-9999-aaaa-bbbbbbbbbbbb', 'b1000012-aaaa-bbbb-cccc-dddddddddddd', 'Fee', 520.00, 'USD', 'Completed', 'WireTransfer', 'GoldmanSachsPrivate', 'GS123456789', 15.60, NULL, NULL, NULL, 12, ARRAY[]::TEXT[], 'High-value transaction processing fee', 'ES-FEE-021', 'AVI-021-FEE', '2024-09-01T10:30:00Z', '2024-09-01T10:32:00Z')

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
    blockchain_tx_hash = EXCLUDED.blockchain_tx_hash,
    smart_contract_address = EXCLUDED.smart_contract_address,
    gas_used = EXCLUDED.gas_used,
    risk_score = EXCLUDED.risk_score,
    fraud_flags = EXCLUDED.fraud_flags,
    description = EXCLUDED.description,
    customer_reference = EXCLUDED.customer_reference,
    merchant_reference = EXCLUDED.merchant_reference,
    initiated_date = EXCLUDED.initiated_date,
    completed_date = EXCLUDED.completed_date;

-- Invoices for Completed and Confirmed Bookings
INSERT INTO invoices (id, booking_id, invoice_number, amount, currency, status, due_date, line_items, tax_amount, discount_amount, customer_info, payment_terms, notes, pdf_url) VALUES

('inv001001-1111-2222-3333-444444444444', 'b1000001-aaaa-bbbb-cccc-dddddddddddd', 'AVI-2024-001', 95000.00, 'USD', 'paid', '2024-07-30', '[{"description":"Charter Flight KJFK-EGLL","quantity":1,"rate":87962.96,"amount":87962.96},{"description":"Luxury Catering Premium","quantity":1,"rate":2500.00,"amount":2500.00},{"description":"Ground Transportation","quantity":1,"rate":850.00,"amount":850.00},{"description":"Concierge Services","quantity":1,"rate":1200.00,"amount":1200.00}]', 7600.00, 2412.96, '{"name":"Richard Sterling","company":"Sterling Wealth Management","email":"richard.sterling@sterlingwealth.com","address":"432 Park Ave, New York, NY 10016"}', 'Net 30 days', 'VIP service package included. Thank you for choosing our premium charter service.', 'https://invoices.avinode.com/inv001001.pdf'),

('inv002001-2222-3333-4444-555555555555', 'b1000002-aaaa-bbbb-cccc-dddddddddddd', 'AVI-2024-002', 18250.00, 'USD', 'paid', '2024-07-05', '[{"description":"Corporate Charter KSEA-KORD","quantity":1,"rate":16898.15,"amount":16898.15},{"description":"Business Catering","quantity":1,"rate":450.00,"amount":450.00},{"description":"WiFi Service","quantity":1,"rate":125.00,"amount":125.00}]', 1460.00, 773.15, '{"name":"Sarah Chen","company":"TechCorp Innovations","email":"s.chen@techcorp.com","address":"1100 2nd Ave, Seattle, WA 98101"}', 'Net 15 days (Corporate Account)', 'Corporate account - expedited processing', 'https://invoices.avinode.com/inv002001.pdf'),

('inv003001-3333-4444-5555-666666666666', 'b2000001-bbbb-cccc-dddd-eeeeeeeeeeee', 'AVI-2024-031', 58000.00, 'USD', 'sent', '2024-12-30', '[{"description":"Executive Charter KHOU-KJFK","quantity":1,"rate":53703.70,"amount":53703.70},{"description":"Secure Communications","quantity":1,"rate":750.00,"amount":750.00},{"description":"Executive Office Setup","quantity":1,"rate":500.00,"amount":500.00}]', 4640.00, 1043.70, '{"name":"Marcus Edwards","company":"Edwards Energy Holdings","email":"marcus.edwards@edwardsenergy.com","address":"1221 McKinney St, Houston, TX 77010"}', 'Due on completion', 'Confirmed booking - balance due before departure', 'https://invoices.avinode.com/inv003001.pdf'),

('inv004001-4444-5555-6666-777777777777', 'b2000002-bbbb-cccc-dddd-eeeeeeeeeeee', 'AVI-2024-032', 65000.00, 'USD', 'sent', '2024-12-28', '[{"description":"International Charter UUDD-LFPG","quantity":1,"rate":60185.19,"amount":60185.19},{"description":"Art Transport Climate Control","quantity":1,"rate":1200.00,"amount":1200.00},{"description":"Security Systems","quantity":1,"rate":800.00,"amount":800.00},{"description":"Russian Cuisine Catering","quantity":1,"rate":650.00,"amount":650.00}]', 5200.00, 2035.19, '{"name":"Vladislav Antonov","company":"Vladislav Art Collection","email":"vladislav.antonov@vac-moscow.ru","address":"Red Square, Moscow, Russia 103073"}', 'Payment required 48 hours before departure', 'International art transport with specialized climate control', 'https://invoices.avinode.com/inv004001.pdf')

ON CONFLICT (id) DO UPDATE SET
    booking_id = EXCLUDED.booking_id,
    invoice_number = EXCLUDED.invoice_number,
    amount = EXCLUDED.amount,
    currency = EXCLUDED.currency,
    status = EXCLUDED.status,
    due_date = EXCLUDED.due_date,
    line_items = EXCLUDED.line_items,
    tax_amount = EXCLUDED.tax_amount,
    discount_amount = EXCLUDED.discount_amount,
    customer_info = EXCLUDED.customer_info,
    payment_terms = EXCLUDED.payment_terms,
    notes = EXCLUDED.notes,
    pdf_url = EXCLUDED.pdf_url;

-- ============================================================================
-- AIRCRAFT AVAILABILITY AND UTILIZATION DATA
-- ============================================================================

-- Maintenance Records (Affecting aircraft availability)
INSERT INTO maintenance_records (id, aircraft_id, maintenance_type, description, scheduled_date, completed_date, cost, currency, facility, technician, work_orders, hours_at_maintenance, cycles_at_maintenance, prediction_accuracy) VALUES

-- Recent Completed Maintenance
('mnt001001-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', 'Routine', '100-hour inspection completed. All systems operational. Engine performance within normal parameters.', '2024-08-15T08:00:00Z', '2024-08-16T16:30:00Z', 12500.00, 'USD', 'Signature Flight Support (TEB)', 'Chief Tech Michael Rodriguez', ARRAY['WO-2024-0847', 'WO-2024-0848'], 2847.5, 1456, 0.94),

('mnt002001-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', 'Progressive', 'Annual progressive maintenance Phase C. Avionics upgrades, interior refurbishment completed.', '2024-06-10T07:00:00Z', '2024-06-14T18:00:00Z', 85000.00, 'USD', 'Duncan Aviation (LNK)', 'Senior Tech Jennifer Walsh', ARRAY['WO-2024-0623', 'WO-2024-0624', 'WO-2024-0625'], 2680.2, 1398, 0.97),

-- Upcoming Scheduled Maintenance
('mnt003001-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', 'Routine', 'Scheduled 50-hour inspection and oil change. Brake system check.', '2024-09-15T09:00:00Z', NULL, 8500.00, 'USD', 'Jet Aviation (BOS)', 'Tech Supervisor David Kim', ARRAY['WO-2024-0892'], 2895.8, 1475, 0.91),

('mnt004001-4444-5555-6666-777777777777', '05c92852-911b-435d-be52-515fcf5b78fb', 'Compliance', 'Mandatory AD compliance check for engine components. Expected 2-day downtime.', '2024-09-20T07:30:00Z', NULL, 15000.00, 'USD', 'Stevens Aviation (GRR)', 'Lead Tech Sarah Mitchell', ARRAY['WO-2024-0901', 'WO-2024-0902'], 2912.1, 1481, 0.89),

-- Predictive Maintenance Alert
('mnt005001-5555-6666-7777-888888888888', '05c92852-911b-435d-be52-515fcf5b78fb', 'AOG', 'AI-predicted hydraulic system degradation. Preventive replacement recommended within 30 days.', '2024-10-05T10:00:00Z', NULL, 22000.00, 'USD', 'FlightSafety International (WIC)', 'Principal Tech Robert Chen', ARRAY['WO-2024-0915'], 2945.7, 1492, 0.96)

ON CONFLICT (id) DO UPDATE SET
    aircraft_id = EXCLUDED.aircraft_id,
    maintenance_type = EXCLUDED.maintenance_type,
    description = EXCLUDED.description,
    scheduled_date = EXCLUDED.scheduled_date,
    completed_date = EXCLUDED.completed_date,
    cost = EXCLUDED.cost,
    currency = EXCLUDED.currency,
    facility = EXCLUDED.facility,
    technician = EXCLUDED.technician,
    work_orders = EXCLUDED.work_orders,
    hours_at_maintenance = EXCLUDED.hours_at_maintenance,
    cycles_at_maintenance = EXCLUDED.cycles_at_maintenance,
    prediction_accuracy = EXCLUDED.prediction_accuracy;

-- Crew Assignments for Active and Upcoming Flights
INSERT INTO crew_assignments (id, booking_id, aircraft_id, crew_type, crew_member_name, crew_member_id, license_number, certification_expiry, assignment_date, status) VALUES

-- Current Active Flights
('crew001001-1111-2222-3333-444444444444', 'b1000001-aaaa-bbbb-cccc-dddddddddddd', '05c92852-911b-435d-be52-515fcf5b78fb', 'Captain', 'Captain James Thompson', 'CT001847', 'ATP-1847592', '2025-08-15', '2024-07-10T09:00:00Z', 'Completed'),

('crew001002-1111-2222-3333-444444444444', 'b1000001-aaaa-bbbb-cccc-dddddddddddd', '05c92852-911b-435d-be52-515fcf5b78fb', 'First Officer', 'First Officer Maria Santos', 'FO002156', 'CPL-2156847', '2025-11-22', '2024-07-10T09:00:00Z', 'Completed'),

('crew001003-1111-2222-3333-444444444444', 'b1000001-aaaa-bbbb-cccc-dddddddddddd', '05c92852-911b-435d-be52-515fcf5b78fb', 'Flight Attendant', 'Elena Rodriguez', 'FA003421', 'FA-3421896', '2025-06-30', '2024-07-10T09:00:00Z', 'Completed'),

-- Upcoming Confirmed Flights
('crew002001-2222-3333-4444-555555555555', 'b2000001-bbbb-cccc-dddd-eeeeeeeeeeee', '05c92852-911b-435d-be52-515fcf5b78fb', 'Captain', 'Captain Robert Mitchell', 'CT002145', 'ATP-2145789', '2025-12-10', '2024-11-25T10:30:00Z', 'Confirmed'),

('crew002002-2222-3333-4444-555555555555', 'b2000001-bbbb-cccc-dddd-eeeeeeeeeeee', '05c92852-911b-435d-be52-515fcf5b78fb', 'First Officer', 'First Officer Amanda Chen', 'FO002987', 'CPL-2987456', '2026-03-15', '2024-11-25T10:30:00Z', 'Confirmed'),

('crew003001-3333-4444-5555-666666666666', 'b2000002-bbbb-cccc-dddd-eeeeeeeeeeee', '05c92852-911b-435d-be52-515fcf5b78fb', 'Captain', 'Captain Vladimir Petrov', 'CT003078', 'ATP-3078915', '2025-09-28', '2024-11-20T14:00:00Z', 'Confirmed'),

('crew003002-3333-4444-5555-666666666666', 'b2000002-bbbb-cccc-dddd-eeeeeeeeeeee', '05c92852-911b-435d-be52-515fcf5b78fb', 'First Officer', 'First Officer Sophie Laurent', 'FO003456', 'CPL-3456123', '2025-07-18', '2024-11-20T14:00:00Z', 'Confirmed'),

('crew003003-3333-4444-5555-666666666666', 'b2000002-bbbb-cccc-dddd-eeeeeeeeeeee', '05c92852-911b-435d-be52-515fcf5b78fb', 'Flight Attendant', 'Anastasia Volkov', 'FA004789', 'FA-4789234', '2025-10-12', '2024-11-20T14:00:00Z', 'Confirmed'),

-- Assigned for Future Bookings
('crew004001-4444-5555-6666-777777777777', 'b2000004-bbbb-cccc-dddd-eeeeeeeeeeee', '05c92852-911b-435d-be52-515fcf5b78fb', 'Captain', 'Captain Ahmad Hassan', 'CT004123', 'ATP-4123567', '2026-01-20', '2024-11-28T16:00:00Z', 'Assigned'),

('crew004002-4444-5555-6666-777777777777', 'b2000004-bbbb-cccc-dddd-eeeeeeeeeeee', '05c92852-911b-435d-be52-515fcf5b78fb', 'First Officer', 'First Officer Lisa Wang', 'FO004567', 'CPL-4567890', '2025-08-05', '2024-11-28T16:00:00Z', 'Assigned')

ON CONFLICT (id) DO UPDATE SET
    booking_id = EXCLUDED.booking_id,
    aircraft_id = EXCLUDED.aircraft_id,
    crew_type = EXCLUDED.crew_type,
    crew_member_name = EXCLUDED.crew_member_name,
    crew_member_id = EXCLUDED.crew_member_id,
    license_number = EXCLUDED.license_number,
    certification_expiry = EXCLUDED.certification_expiry,
    assignment_date = EXCLUDED.assignment_date,
    status = EXCLUDED.status;

-- ============================================================================
-- MARKET ANALYTICS AND AI-POWERED FEATURES
-- ============================================================================

-- Market Analytics Data
INSERT INTO market_analytics (id, date, region, total_bookings, total_revenue, average_price, utilization_rate, top_routes, top_aircraft, market_share, competitor_pricing) VALUES

('mkt001001-1111-2222-3333-444444444444', '2024-08-01', 'North America', 234, 12750000.00, 54487.18, 0.78, '{"KJFK-EGLL": 18, "KLAX-KORD": 15, "KBOS-KMIA": 12, "KSEA-KJFK": 10, "KIAH-KATL": 9}', '{"Ultra Long Range": 45, "Heavy Jet": 38, "Super Midsize Jet": 32, "Midsize Jet": 28, "Light Jet": 21}', 0.32, '{"NetJets": 125000, "Flexjet": 118000, "VistaJet": 145000, "XO": 98000}'),

('mkt002001-2222-3333-4444-555555555555', '2024-08-01', 'Europe', 187, 15800000.00, 84491.98, 0.82, '{"EGLL-LFPG": 22, "LEMD-LIMC": 16, "EDDM-LOWW": 14, "EGKK-EBBR": 11, "LIRF-LSZH": 9}', '{"Ultra Long Range": 52, "Heavy Jet": 41, "Super Midsize Jet": 28, "Midsize Jet": 22, "Light Jet": 18}', 0.28, '{"VistaJet": 165000, "NetJets Europe": 142000, "Flexjet": 138000, "Air Hamburg": 125000}'),

('mkt003001-3333-4444-5555-666666666666', '2024-07-01', 'North America', 198, 11200000.00, 56565.66, 0.74, '{"KJFK-KBOS": 14, "KLAX-KLAS": 13, "KORD-KATL": 12, "KMIA-KJFK": 11, "KDEN-KBOS": 8}', '{"Heavy Jet": 42, "Ultra Long Range": 38, "Super Midsize Jet": 35, "Midsize Jet": 25, "Light Jet": 19}', 0.31, '{"NetJets": 122000, "Flexjet": 115000, "VistaJet": 148000, "XO": 95000}'),

('mkt004001-4444-5555-6666-777777777777', '2024-06-01', 'Middle East', 89, 8900000.00, 100000.00, 0.89, '{"OMDB-EGLL": 15, "OEJN-LFPG": 12, "OTHH-EGKK": 10, "OMDB-LIMC": 8, "OERK-EGLL": 7}', '{"Ultra Long Range": 34, "Heavy Jet": 28, "Super Midsize Jet": 15, "Midsize Jet": 8, "Light Jet": 4}', 0.45, '{"VistaJet": 180000, "JetSuite": 165000, "Emirates Executive": 195000, "Qatar Executive": 175000}')

ON CONFLICT (id) DO UPDATE SET
    date = EXCLUDED.date,
    region = EXCLUDED.region,
    total_bookings = EXCLUDED.total_bookings,
    total_revenue = EXCLUDED.total_revenue,
    average_price = EXCLUDED.average_price,
    utilization_rate = EXCLUDED.utilization_rate,
    top_routes = EXCLUDED.top_routes,
    top_aircraft = EXCLUDED.top_aircraft,
    market_share = EXCLUDED.market_share,
    competitor_pricing = EXCLUDED.competitor_pricing;

-- Price Predictions (AI-powered dynamic pricing)
INSERT INTO price_predictions (id, aircraft_id, route, predicted_date, predicted_price, confidence_score, demand_forecast, historical_pricing, seasonal_factors, weather_factors, event_factors, model_version, training_accuracy) VALUES

('prd001001-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', 'KJFK-EGLL', '2024-12-25T10:00:00Z', 125000.00, 0.89, 0.95, '{"avg_q4": 110000, "peak_day": 135000, "base_price": 95000}', '{"holiday_surge": 1.25, "winter_premium": 1.1}', '{"crosswind_factor": 0.95, "visibility": 1.0}', '{"christmas_demand": 1.3, "new_year": 1.4}', '2.1', 0.92),

('prd002001-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', 'KLAX-KORD', '2024-09-15T14:30:00Z', 58000.00, 0.84, 0.73, '{"avg_q3": 52000, "weekend": 62000, "weekday": 48000}', '{"autumn_discount": 0.92, "back_to_school": 1.05}', '{"favorable_winds": 0.98, "clear_skies": 1.0}', '{"trade_show": 1.15, "corporate_travel": 1.08}', '2.1', 0.88),

('prd003001-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', 'KBOS-KMIA', '2024-10-12T16:45:00Z', 32000.00, 0.91, 0.68, '{"avg_fall": 28000, "hurricane_season": 35000, "normal": 30000}', '{"autumn_rates": 0.95, "snowbird_early": 1.12}', '{"hurricane_watch": 1.18, "storms": 1.25}', '{"conference_season": 1.08, "leisure_travel": 0.92}', '2.1', 0.94),

('prd004001-4444-5555-6666-777777777777', '05c92852-911b-435d-be52-515fcf5b78fb', 'OMDB-EGLL', '2024-11-20T12:15:00Z', 98000.00, 0.87, 0.82, '{"middle_east": 85000, "premium_routes": 105000, "standard": 90000}', '{"peak_travel": 1.15, "business_season": 1.08}', '{"sandstorm_risk": 1.05, "clear_weather": 0.98}', '{"oil_conference": 1.22, "diplomatic": 1.18}', '2.1', 0.89)

ON CONFLICT (id) DO UPDATE SET
    aircraft_id = EXCLUDED.aircraft_id,
    route = EXCLUDED.route,
    predicted_date = EXCLUDED.predicted_date,
    predicted_price = EXCLUDED.predicted_price,
    confidence_score = EXCLUDED.confidence_score,
    demand_forecast = EXCLUDED.demand_forecast,
    historical_pricing = EXCLUDED.historical_pricing,
    seasonal_factors = EXCLUDED.seasonal_factors,
    weather_factors = EXCLUDED.weather_factors,
    event_factors = EXCLUDED.event_factors,
    model_version = EXCLUDED.model_version,
    training_accuracy = EXCLUDED.training_accuracy;

-- Real-Time Alerts
INSERT INTO real_time_alerts (id, alert_type, severity, title, message, affected_users, affected_bookings, affected_aircraft, affected_routes, is_active, resolved_at, sent_via_email, sent_via_sms, sent_via_push) VALUES

('alert001-1111-2222-3333-444444444444', 'WeatherDelay', 'Medium', 'Weather Delay - JFK Operations', 'Moderate delays expected at KJFK due to thunderstorms. Estimated 45-minute delays for departures.', ARRAY['c1000001-1111-2222-3333-444444444444', 'c2000001-2222-3333-4444-555555555555'], ARRAY['b1000001-aaaa-bbbb-cccc-dddddddddddd'], ARRAY['05c92852-911b-435d-be52-515fcf5b78fb'], ARRAY['KJFK-EGLL', 'KJFK-KBOS'], true, NULL, true, true, true),

('alert002-2222-3333-4444-555555555555', 'PriceChange', 'Low', 'Dynamic Pricing Update', 'Price optimization detected 12% savings opportunity for KBOS-KMIA route on September 1st.', ARRAY['c3000001-3333-4444-5555-666666666666'], ARRAY[], ARRAY['05c92852-911b-435d-be52-515fcf5b78fb'], ARRAY['KBOS-KMIA'], true, NULL, true, false, true),

('alert003-3333-4444-5555-666666666666', 'MaintenanceIssue', 'High', 'Scheduled Maintenance Reminder', 'Aircraft scheduled for routine maintenance on September 15th. Booking window closed from 09:00-17:00 EST.', ARRAY['c2000002-2222-3333-4444-555555555555', 'c1000005-1111-2222-3333-444444444444'], ARRAY[], ARRAY['05c92852-911b-435d-be52-515fcf5b78fb'], ARRAY[], true, NULL, true, false, false),

('alert004-4444-5555-6666-777777777777', 'FlightUpdate', 'Low', 'Flight Departure Update', 'Your flight from KLAX to KORD is on schedule. Boarding begins in 30 minutes.', ARRAY['c1000002-1111-2222-3333-444444444444'], ARRAY['b1000002-aaaa-bbbb-cccc-dddddddddddd'], ARRAY['05c92852-911b-435d-be52-515fcf5b78fb'], ARRAY['KLAX-KORD'], false, '2024-08-31T16:30:00Z', true, true, true),

('alert005-5555-6666-7777-888888888888', 'BookingConfirmation', 'Low', 'Booking Confirmed', 'Your charter booking for December 20th, Houston to New York has been confirmed. Reference: ME-2024-031', ARRAY['c1000007-1111-2222-3333-444444444444'], ARRAY['b2000001-bbbb-cccc-dddd-eeeeeeeeeeee'], ARRAY['05c92852-911b-435d-be52-515fcf5b78fb'], ARRAY['KHOU-KJFK'], false, '2024-11-28T09:20:00Z', true, false, true)

ON CONFLICT (id) DO UPDATE SET
    alert_type = EXCLUDED.alert_type,
    severity = EXCLUDED.severity,
    title = EXCLUDED.title,
    message = EXCLUDED.message,
    affected_users = EXCLUDED.affected_users,
    affected_bookings = EXCLUDED.affected_bookings,
    affected_aircraft = EXCLUDED.affected_aircraft,
    affected_routes = EXCLUDED.affected_routes,
    is_active = EXCLUDED.is_active,
    resolved_at = EXCLUDED.resolved_at,
    sent_via_email = EXCLUDED.sent_via_email,
    sent_via_sms = EXCLUDED.sent_via_sms,
    sent_via_push = EXCLUDED.sent_via_push;

-- Aircraft Reviews (Customer feedback)
INSERT INTO aircraft_reviews (id, aircraft_id, booking_id, customer_name, customer_email, rating, title, review, comfort_rating, cleanliness_rating, amenities_rating, verified_booking, helpful) VALUES

('rev001001-1111-2222-3333-444444444444', '05c92852-911b-435d-be52-515fcf5b78fb', 'b1000001-aaaa-bbbb-cccc-dddddddddddd', 'Richard Sterling', 'richard.sterling@sterlingwealth.com', 5, 'Exceptional Transatlantic Experience', 'Outstanding service from start to finish. The aircraft was immaculate, crew was professional, and the luxury amenities exceeded expectations. The onboard office setup allowed me to conduct business seamlessly during the 7-hour flight.', 5, 5, 5, true, 23),

('rev002001-2222-3333-4444-555555555555', '05c92852-911b-435d-be52-515fcf5b78fb', 'b1000002-aaaa-bbbb-cccc-dddddddddddd', 'Sarah Chen', 's.chen@techcorp.com', 4, 'Great Corporate Travel Solution', 'Perfect for our executive team transport. Reliable, punctual, and the aircraft was well-equipped for business travel. Wi-Fi worked flawlessly throughout the flight. Only minor issue was the catering could have been better.', 4, 5, 4, true, 18),

('rev003001-3333-4444-5555-666666666666', '05c92852-911b-435d-be52-515fcf5b78fb', 'b1000003-aaaa-bbbb-cccc-dddddddddddd', 'Dr. Margaret Hamilton', 'm.hamilton@bostongeneral.org', 5, 'Critical Medical Transport Excellence', 'When every minute counts, this service delivered. Aircraft was configured perfectly for medical transport with proper equipment securing. Crew understood the urgency and handled everything professionally. Grateful for the service.', 5, 5, 5, true, 31),

('rev004001-4444-5555-6666-777777777777', '05c92852-911b-435d-be52-515fcf5b78fb', 'b1000006-aaaa-bbbb-cccc-dddddddddddd', 'Antonio Martinez', 'a.martinez@techinnovations.es', 4, 'Efficient European Business Travel', 'Solid performance for Madrid to Paris route. Aircraft maintained well, punctual departure and arrival. Interior is comfortable for short European flights. Good value for business travelers.', 4, 4, 4, true, 12),

('rev005001-5555-6666-7777-888888888888', '05c92852-911b-435d-be52-515fcf5b78fb', 'b1000007-aaaa-bbbb-cccc-dddddddddddd', 'Jennifer Martinez', 'j.martinez@personaltravel.com', 4, 'Comfortable Personal Travel', 'Nice aircraft for personal travel from Boston to Miami. Clean interior, comfortable seating, and smooth flight. Service was professional though not as luxurious as some competitors. Would book again.', 4, 5, 3, true, 9),

('rev006001-6666-7777-8888-999999999999', '05c92852-911b-435d-be52-515fcf5b78fb', 'b1000008-aaaa-bbbb-cccc-dddddddddddd', 'Dr. Emily Sullivan', 'e.sullivan@energysolutions.com', 5, 'Superior Long-Range Performance', 'Impressive aircraft for long-distance flights. Houston to Denver was smooth despite weather challenges. The aircraft handled turbulence well and arrived on schedule. Fuel efficiency is clearly optimized as promised.', 5, 4, 5, true, 15)

ON CONFLICT (id) DO UPDATE SET
    aircraft_id = EXCLUDED.aircraft_id,
    booking_id = EXCLUDED.booking_id,
    customer_name = EXCLUDED.customer_name,
    customer_email = EXCLUDED.customer_email,
    rating = EXCLUDED.rating,
    title = EXCLUDED.title,
    review = EXCLUDED.review,
    comfort_rating = EXCLUDED.comfort_rating,
    cleanliness_rating = EXCLUDED.cleanliness_rating,
    amenities_rating = EXCLUDED.amenities_rating,
    verified_booking = EXCLUDED.verified_booking,
    helpful = EXCLUDED.helpful;

-- ============================================================================
-- FINAL AIRCRAFT UTILIZATION UPDATE
-- ============================================================================

-- Update the main aircraft record with current utilization data
UPDATE aircraft SET 
    total_hours = 2945.7,
    flight_cycles = 1492,
    last_maintenance_date = '2024-08-16',
    next_maintenance_due = '2024-09-15',
    maintenance_status = 'Due Soon',
    current_location = 'KJFK',
    availability_status = 'Available',
    utilization_rate = 0.78,
    updated_at = NOW()
WHERE id = '05c92852-911b-435d-be52-515fcf5b78fb';

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================

SELECT 'ULTIMATE AVIATION SEED DATA COMPLETED SUCCESSFULLY' as status,
       'Database populated with comprehensive operational data' as message,
       '30 customers, 30 bookings, flight ops, payments, maintenance, crew, analytics' as summary;