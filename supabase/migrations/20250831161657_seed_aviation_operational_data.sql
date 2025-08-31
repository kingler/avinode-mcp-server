-- Migration: Seed Aviation Operational Data
-- Description: Comprehensive seed data for aviation charter system testing
-- Author: Claude Code Assistant
-- Created: 2024-08-31
-- Dependencies: Requires customers, aircraft, bookings tables to exist

BEGIN;

-- ============================================================================
-- CUSTOMERS DATA (30 Comprehensive Profiles)
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

('c2000003-2222-3333-4444-555555555555', 'exec@medicalpharma.com', 'Dr. Susan Miller', '+1-Boston-555-1003', 'Medical Pharma Solutions', 'Corporate', '{"aircraft": ["Heavy Jet", "Super Midsize Jet"], "amenities": ["Medical Storage", "Temperature Control"], "contract": "Annual"}', 22, 980000, 4.7, '2021-06-11T10:45:00Z'),

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

COMMIT;