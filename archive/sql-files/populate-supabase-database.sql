-- Direct SQL execution for Supabase SQL Editor
-- This approach inserts data directly into tables without using exec_sql function

-- ============================================================================
-- 1. USERS TABLE - Add additional users to reach 25+ total
-- ============================================================================

INSERT INTO users (id, email, first_name, last_name, phone, role, created_at, updated_at) VALUES
('u000001-0001-0001-0001-000000000001', 'john.sterling@sterlingwealth.com', 'John', 'Sterling', '+1-212-555-0101', 'customer', '2023-01-15T10:30:00Z', NOW()),
('u000002-0002-0002-0002-000000000002', 'sarah.chen@techcorp.com', 'Sarah', 'Chen', '+1-206-555-0201', 'customer', '2023-02-22T14:20:00Z', NOW()),
('u000003-0003-0003-0003-000000000003', 'mike.hamilton@bostongeneral.org', 'Mike', 'Hamilton', '+1-617-555-0301', 'customer', '2023-03-08T16:15:00Z', NOW()),
('u000004-0004-0004-0004-000000000004', 'lisa.thompson@globalent.com', 'Lisa', 'Thompson', '+44-20-7946-0001', 'customer', '2023-04-12T11:45:00Z', NOW()),
('u000005-0005-0005-0005-000000000005', 'david.martinez@techinnovations.es', 'David', 'Martinez', '+34-91-123-4567', 'customer', '2023-05-29T13:45:00Z', NOW()),
('u000006-0006-0006-0006-000000000006', 'emma.rossi@milanoluxury.it', 'Emma', 'Rossi', '+39-02-1234-5678', 'customer', '2023-06-18T16:40:00Z', NOW()),
('u000007-0007-0007-0007-000000000007', 'james.edwards@edwardsenergy.com', 'James', 'Edwards', '+1-713-555-0701', 'customer', '2023-07-03T09:15:00Z', NOW()),
('u000008-0008-0008-0008-000000000008', 'anna.antonov@vac-moscow.ru', 'Anna', 'Antonov', '+7-495-123-4567', 'customer', '2023-08-25T14:20:00Z', NOW()),
('u000009-0009-0009-0009-000000000009', 'omar.hassan@middleeastcorp.ae', 'Omar', 'Hassan', '+971-4-123-4567', 'customer', '2023-09-14T16:10:00Z', NOW()),
('u000010-0010-0010-0010-000000000010', 'marie.dubois@lecordonbleu.fr', 'Marie', 'Dubois', '+33-1-45-67-8900', 'customer', '2023-10-01T12:45:00Z', NOW()),
('u000011-0011-0011-0011-000000000011', 'robert.wang@techcorpinc.com', 'Robert', 'Wang', '+1-415-555-1001', 'customer', '2023-11-15T10:00:00Z', NOW()),
('u000012-0012-0012-0012-000000000012', 'jennifer.johnson@gm-auto.com', 'Jennifer', 'Johnson', '+1-313-555-1002', 'customer', '2023-12-22T11:40:00Z', NOW()),
('u000013-0013-0013-0013-000000000013', 'carlos.miller@medicalpharma.com', 'Carlos', 'Miller', '+1-617-555-1003', 'customer', '2024-01-11T10:45:00Z', NOW()),
('u000014-0014-0014-0014-000000000014', 'sophia.davis@phoenixfinancial.com', 'Sophia', 'Davis', '+1-602-555-1004', 'customer', '2024-02-18T11:30:00Z', NOW()),
('u000015-0015-0015-0015-000000000015', 'alex.brown@atlantaconsulting.com', 'Alex', 'Brown', '+1-404-555-1005', 'customer', '2024-03-07T13:20:00Z', NOW()),
('u000016-0016-0016-0016-000000000016', 'olivia.sullivan@renewableenergy.com', 'Olivia', 'Sullivan', '+1-303-555-1006', 'customer', '2024-04-28T08:55:00Z', NOW()),
('u000017-0017-0017-0017-000000000017', 'noah.wilson@energysolutions.com', 'Noah', 'Wilson', '+1-713-555-1007', 'customer', '2024-05-08T08:15:00Z', NOW()),
('u000018-0018-0018-0018-000000000018', 'ava.rodriguez@washingtonadvocacy.com', 'Ava', 'Rodriguez', '+1-202-555-1008', 'customer', '2024-06-14T14:30:00Z', NOW()),
('u000019-0019-0019-0019-000000000019', 'liam.martinez@supplychaincorp.com', 'Liam', 'Martinez', '+1-617-555-1009', 'customer', '2024-07-05T14:25:00Z', NOW()),
('u000020-0020-0020-0020-000000000020', 'isabella.garcia@propertycorp.com', 'Isabella', 'Garcia', '+1-305-555-1010', 'customer', '2024-08-24T10:55:00Z', NOW()),
('u000021-0021-0021-0021-000000000021', 'admin1@avinode.com', 'Aviation', 'Admin', '+1-555-100-0001', 'admin', '2023-01-01T00:00:00Z', NOW()),
('u000022-0022-0022-0022-000000000022', 'operator1@jetexcellence.com', 'Jet Excellence', 'Ops', '+1-555-200-0002', 'operator', '2023-02-01T00:00:00Z', NOW()),
('u000023-0023-0023-0023-000000000023', 'operator2@eliteaviation.com', 'Elite Aviation', 'Ops', '+1-555-300-0003', 'operator', '2023-03-01T00:00:00Z', NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. CUSTOMERS TABLE - Create customer profiles
-- ============================================================================

CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    company TEXT,
    customer_type TEXT CHECK (customer_type IN ('VIP', 'Corporate', 'Individual')),
    total_flights INTEGER DEFAULT 0,
    total_spent DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO customers (id, email, name, phone, company, customer_type, total_flights, total_spent, created_at) VALUES
('c000001-0001-0001-0001-000000000001', 'vip1@sterling.com', 'VIP Customer 1', '+1-212-555-1001', 'Sterling Enterprises', 'VIP', 25, 450000.00, '2023-01-01T00:00:00Z'),
('c000002-0002-0002-0002-000000000002', 'vip2@techcorp.com', 'VIP Customer 2', '+1-415-555-1002', 'TechCorp Elite', 'VIP', 32, 620000.00, '2023-02-01T00:00:00Z'),
('c000003-0003-0003-0003-000000000003', 'vip3@globalent.com', 'VIP Customer 3', '+44-20-7946-1003', 'Global Enterprises', 'VIP', 18, 380000.00, '2023-03-01T00:00:00Z'),
('c000004-0004-0004-0004-000000000004', 'corp1@manufacturing.com', 'Corporate Client 1', '+1-313-555-2001', 'Manufacturing Corp', 'Corporate', 15, 180000.00, '2023-04-01T00:00:00Z'),
('c000005-0005-0005-0005-000000000005', 'corp2@pharmaceutical.com', 'Corporate Client 2', '+1-617-555-2002', 'Pharmaceutical Solutions', 'Corporate', 22, 265000.00, '2023-05-01T00:00:00Z'),
('c000006-0006-0006-0006-000000000006', 'corp3@energy.com', 'Corporate Client 3', '+1-713-555-2003', 'Energy Holdings', 'Corporate', 28, 340000.00, '2023-06-01T00:00:00Z'),
('c000007-0007-0007-0007-000000000007', 'corp4@consulting.com', 'Corporate Client 4', '+1-404-555-2004', 'Consulting Group', 'Corporate', 12, 145000.00, '2023-07-01T00:00:00Z'),
('c000008-0008-0008-0008-000000000008', 'corp5@renewable.com', 'Corporate Client 5', '+1-303-555-2005', 'Renewable Energy', 'Corporate', 19, 230000.00, '2023-08-01T00:00:00Z'),
('c000009-0009-0009-0009-000000000009', 'corp6@advocacy.com', 'Corporate Client 6', '+1-202-555-2006', 'Advocacy Group', 'Corporate', 8, 95000.00, '2023-09-01T00:00:00Z'),
('c000010-0010-0010-0010-000000000010', 'corp7@property.com', 'Corporate Client 7', '+1-305-555-2007', 'Property Development', 'Corporate', 16, 195000.00, '2023-10-01T00:00:00Z'),
('c000011-0011-0011-0011-000000000011', 'ind1@email.com', 'Individual Customer 1', '+1-555-123-3001', NULL, 'Individual', 3, 35000.00, '2024-01-01T00:00:00Z'),
('c000012-0012-0012-0012-000000000012', 'ind2@email.com', 'Individual Customer 2', '+1-555-123-3002', NULL, 'Individual', 2, 28000.00, '2024-02-01T00:00:00Z'),
('c000013-0013-0013-0013-000000000013', 'ind3@email.com', 'Individual Customer 3', '+1-555-123-3003', NULL, 'Individual', 5, 42000.00, '2024-03-01T00:00:00Z'),
('c000014-0014-0014-0014-000000000014', 'ind4@email.com', 'Individual Customer 4', '+1-555-123-3004', NULL, 'Individual', 1, 18000.00, '2024-04-01T00:00:00Z'),
('c000015-0015-0015-0015-000000000015', 'ind5@email.com', 'Individual Customer 5', '+1-555-123-3005', NULL, 'Individual', 4, 38000.00, '2024-05-01T00:00:00Z'),
('c000016-0016-0016-0016-000000000016', 'ind6@email.com', 'Individual Customer 6', '+1-555-123-3006', NULL, 'Individual', 6, 52000.00, '2024-06-01T00:00:00Z'),
('c000017-0017-0017-0017-000000000017', 'ind7@email.com', 'Individual Customer 7', '+1-555-123-3007', NULL, 'Individual', 2, 25000.00, '2024-07-01T00:00:00Z'),
('c000018-0018-0018-0018-000000000018', 'ind8@email.com', 'Individual Customer 8', '+1-555-123-3008', NULL, 'Individual', 3, 32000.00, '2024-08-01T00:00:00Z'),
('c000019-0019-0019-0019-000000000019', 'ind9@email.com', 'Individual Customer 9', '+1-555-123-3009', NULL, 'Individual', 7, 58000.00, '2024-09-01T00:00:00Z'),
('c000020-0020-0020-0020-000000000020', 'ind10@email.com', 'Individual Customer 10', '+1-555-123-3010', NULL, 'Individual', 2, 22000.00, '2024-10-01T00:00:00Z'),
('c000021-0021-0021-0021-000000000021', 'vip4@luxury.com', 'VIP Customer 4', '+33-1-4567-8901', 'Luxury Group', 'VIP', 40, 750000.00, '2023-11-01T00:00:00Z'),
('c000022-0022-0022-0022-000000000022', 'vip5@investment.com', 'VIP Customer 5', '+7-495-123-4567', 'Investment Holdings', 'VIP', 35, 680000.00, '2023-12-01T00:00:00Z'),
('c000023-0023-0023-0023-000000000023', 'corp8@healthcare.com', 'Corporate Client 8', '+1-713-555-2008', 'Healthcare Systems', 'Corporate', 14, 168000.00, '2024-01-15T00:00:00Z'),
('c000024-0024-0024-0024-000000000024', 'corp9@financial.com', 'Corporate Client 9', '+1-602-555-2009', 'Financial Group', 'Corporate', 21, 252000.00, '2024-02-15T00:00:00Z'),
('c000025-0025-0025-0025-000000000025', 'corp10@supply.com', 'Corporate Client 10', '+1-617-555-2010', 'Supply Chain Corp', 'Corporate', 17, 204000.00, '2024-03-15T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. AIRPORTS TABLE - Major international airports
-- ============================================================================

CREATE TABLE IF NOT EXISTS airports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    city TEXT NOT NULL,
    country TEXT NOT NULL,
    timezone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO airports (id, code, name, city, country, timezone, created_at) VALUES
('a000001-0001-0001-0001-000000000001', 'KJFK', 'John F. Kennedy International Airport', 'New York', 'USA', 'America/New_York', NOW()),
('a000002-0002-0002-0002-000000000002', 'KLAX', 'Los Angeles International Airport', 'Los Angeles', 'USA', 'America/Los_Angeles', NOW()),
('a000003-0003-0003-0003-000000000003', 'KORD', 'O''Hare International Airport', 'Chicago', 'USA', 'America/Chicago', NOW()),
('a000004-0004-0004-0004-000000000004', 'KBOS', 'Logan International Airport', 'Boston', 'USA', 'America/New_York', NOW()),
('a000005-0005-0005-0005-000000000005', 'KSEA', 'Seattle-Tacoma International Airport', 'Seattle', 'USA', 'America/Los_Angeles', NOW()),
('a000006-0006-0006-0006-000000000006', 'KMIA', 'Miami International Airport', 'Miami', 'USA', 'America/New_York', NOW()),
('a000007-0007-0007-0007-000000000007', 'KLAS', 'McCarran International Airport', 'Las Vegas', 'USA', 'America/Los_Angeles', NOW()),
('a000008-0008-0008-0008-000000000008', 'KDEN', 'Denver International Airport', 'Denver', 'USA', 'America/Denver', NOW()),
('a000009-0009-0009-0009-000000000009', 'KATL', 'Hartsfield-Jackson International Airport', 'Atlanta', 'USA', 'America/New_York', NOW()),
('a000010-0010-0010-0010-000000000010', 'KDFW', 'Dallas/Fort Worth International Airport', 'Dallas', 'USA', 'America/Chicago', NOW()),
('a000011-0011-0011-0011-000000000011', 'EGLL', 'London Heathrow Airport', 'London', 'UK', 'Europe/London', NOW()),
('a000012-0012-0012-0012-000000000012', 'LFPG', 'Charles de Gaulle Airport', 'Paris', 'France', 'Europe/Paris', NOW()),
('a000013-0013-0013-0013-000000000013', 'EDDF', 'Frankfurt Airport', 'Frankfurt', 'Germany', 'Europe/Berlin', NOW()),
('a000014-0014-0014-0014-000000000014', 'LIRF', 'Leonardo da Vinci Airport', 'Rome', 'Italy', 'Europe/Rome', NOW()),
('a000015-0015-0015-0015-000000000015', 'LEMD', 'Adolfo Suárez Madrid-Barajas Airport', 'Madrid', 'Spain', 'Europe/Madrid', NOW()),
('a000016-0016-0016-0016-000000000016', 'UUDD', 'Domodedovo International Airport', 'Moscow', 'Russia', 'Europe/Moscow', NOW()),
('a000017-0017-0017-0017-000000000017', 'OMDB', 'Dubai International Airport', 'Dubai', 'UAE', 'Asia/Dubai', NOW()),
('a000018-0018-0018-0018-000000000018', 'RJAA', 'Narita International Airport', 'Tokyo', 'Japan', 'Asia/Tokyo', NOW()),
('a000019-0019-0019-0019-000000000019', 'VHHH', 'Hong Kong International Airport', 'Hong Kong', 'China', 'Asia/Hong_Kong', NOW()),
('a000020-0020-0020-0020-000000000020', 'YSSY', 'Kingsford Smith Airport', 'Sydney', 'Australia', 'Australia/Sydney', NOW()),
('a000021-0021-0021-0021-000000000021', 'CYYZ', 'Pearson International Airport', 'Toronto', 'Canada', 'America/Toronto', NOW()),
('a000022-0022-0022-0022-000000000022', 'SBGR', 'São Paulo-Guarulhos International Airport', 'São Paulo', 'Brazil', 'America/Sao_Paulo', NOW()),
('a000023-0023-0023-0023-000000000023', 'FAOR', 'OR Tambo International Airport', 'Johannesburg', 'South Africa', 'Africa/Johannesburg', NOW()),
('a000024-0024-0024-0024-000000000024', 'LTFM', 'Istanbul Airport', 'Istanbul', 'Turkey', 'Europe/Istanbul', NOW()),
('a000025-0025-0025-0025-000000000025', 'WSSS', 'Singapore Changi Airport', 'Singapore', 'Singapore', 'Asia/Singapore', NOW())
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Check population results
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'customers' as table_name, COUNT(*) as record_count FROM customers
UNION ALL
SELECT 'airports' as table_name, COUNT(*) as record_count FROM airports
UNION ALL
SELECT 'aircraft' as table_name, COUNT(*) as record_count FROM aircraft
UNION ALL
SELECT 'operators' as table_name, COUNT(*) as record_count FROM operators
UNION ALL
SELECT 'flight_legs' as table_name, COUNT(*) as record_count FROM flight_legs
UNION ALL
SELECT 'bookings' as table_name, COUNT(*) as record_count FROM bookings
UNION ALL
SELECT 'charter_requests' as table_name, COUNT(*) as record_count FROM charter_requests
UNION ALL
SELECT 'pricing_quotes' as table_name, COUNT(*) as record_count FROM pricing_quotes
ORDER BY record_count DESC;