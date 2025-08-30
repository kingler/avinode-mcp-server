-- SchedAero Seed Data Migration
-- Migration 005: Populate SchedAero tables with realistic mock data

-- ===================================
-- MAINTENANCE FACILITIES
-- ===================================

INSERT INTO maintenance_facilities (id, name, location, airport_code, facility_type, certifications, capabilities, contact_email, contact_phone, operating_hours, hangar_capacity) VALUES
    ('MF001', 'JetTech Aviation Services', 'Teterboro, New Jersey', 'KTEB', 'Full Service MRO', 
     '{"FAR Part 145", "EASA Part 145", "IS-BAO Stage III"}', 
     '{"Engine Overhaul", "Avionics Upgrade", "Structural Repair", "Paint Services", "Interior Refurbishment"}',
     'maintenance@jettech-aviation.com', '+1-201-555-0123',
     '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "18:00"}, "sunday": {"open": "08:00", "close": "18:00"}}',
     8),
     
    ('MF002', 'Stevens Aerospace & Defense Systems', 'Greenville, South Carolina', 'KGMU', 'Base Maintenance', 
     '{"FAR Part 145", "FAR Part 135", "FAR Part 91K"}', 
     '{"Heavy Maintenance", "Aircraft Modifications", "Completions", "Avionics Installation"}',
     'service@stevensaero.com', '+1-864-555-0234',
     '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"closed": true}, "sunday": {"closed": true}}',
     12),
     
    ('MF003', 'Duncan Aviation', 'Lincoln, Nebraska', 'KLNK', 'Full Service MRO', 
     '{"FAR Part 145", "EASA Part 145", "CAAC"}', 
     '{"Engine Services", "Avionics", "Aircraft Services", "Interior", "Paint"}',
     'lincoln@duncanaviation.com', '+1-402-555-0345',
     '{"monday": {"open": "06:00", "close": "23:00"}, "tuesday": {"open": "06:00", "close": "23:00"}, "wednesday": {"open": "06:00", "close": "23:00"}, "thursday": {"open": "06:00", "close": "23:00"}, "friday": {"open": "06:00", "close": "23:00"}, "saturday": {"open": "07:00", "close": "19:00"}, "sunday": {"open": "08:00", "close": "18:00"}}',
     15),
     
    ('MF004', 'StandardAero Business Aviation', 'Scottsdale, Arizona', 'KSDL', 'Engine Services', 
     '{"FAR Part 145", "EASA Part 145", "Transport Canada AMO"}', 
     '{"PT6A Engines", "TFE731 Engines", "PW300 Series", "Honeywell Engines"}',
     'scottsdale@standardaero.com', '+1-480-555-0456',
     '{"monday": {"open": "06:00", "close": "22:00"}, "tuesday": {"open": "06:00", "close": "22:00"}, "wednesday": {"open": "06:00", "close": "22:00"}, "thursday": {"open": "06:00", "close": "22:00"}, "friday": {"open": "06:00", "close": "22:00"}, "saturday": {"open": "08:00", "close": "16:00"}, "sunday": {"closed": true}}',
     6),
     
    ('MF005', 'Signature Flight Support', 'West Palm Beach, Florida', 'KPBI', 'Line Maintenance', 
     '{"FAR Part 145"}', 
     '{"Line Maintenance", "AOG Support", "Fuel Services", "Ground Handling"}',
     'maintenance.wpb@signatureflight.com', '+1-561-555-0567',
     '{"monday": {"open": "05:00", "close": "23:00"}, "tuesday": {"open": "05:00", "close": "23:00"}, "wednesday": {"open": "05:00", "close": "23:00"}, "thursday": {"open": "05:00", "close": "23:00"}, "friday": {"open": "05:00", "close": "23:00"}, "saturday": {"open": "05:00", "close": "23:00"}, "sunday": {"open": "05:00", "close": "23:00"}}',
     4);

-- ===================================
-- CREW MEMBERS
-- ===================================

INSERT INTO crew_members (id, employee_id, first_name, last_name, role, status, email, phone, licenses, type_ratings, medical_certificate_expiry, recurrent_training_due, total_flight_hours, pilot_in_command_hours, hours_last_90_days, hours_last_30_days, base_airport, hire_date, certifications, languages_spoken) VALUES
    ('CM001', 'EMP-001', 'Captain', 'Sarah', 'Captain', 'Available', 'sarah.mitchell@example.com', '+1-555-0101',
     '{"ATP", "CFI", "CFII"}', '{"Citation CJ3+", "Citation Sovereign", "Hawker 400XP"}',
     '2025-12-15', '2025-06-30', 12500.5, 8200.0, 180.0, 65.0, 'KTEB',
     '2018-03-15', '{"type": "medical", "class": "First Class", "expiry": "2025-12-15"}',
     '{"English", "Spanish"}'),
     
    ('CM002', 'EMP-002', 'Michael', 'Rodriguez', 'FirstOfficer', 'Available', 'michael.rodriguez@example.com', '+1-555-0102',
     '{"Commercial", "CFI", "MEI"}', '{"Citation CJ3+", "Citation XLS+"}',
     '2025-08-20', '2025-04-15', 3800.2, 1200.0, 120.0, 42.0, 'KTEB',
     '2020-11-20', '{"type": "medical", "class": "First Class", "expiry": "2025-08-20"}',
     '{"English", "Portuguese"}'),
     
    ('CM003', 'EMP-003', 'Emily', 'Chen', 'Captain', 'Available', 'emily.chen@example.com', '+1-555-0103',
     '{"ATP", "CFI"}', '{"G650", "G550", "G450"}',
     '2026-01-10', '2025-09-10', 15200.0, 11500.0, 160.0, 58.0, 'KPBI',
     '2015-07-12', '{"type": "medical", "class": "First Class", "expiry": "2026-01-10"}',
     '{"English", "Mandarin"}'),
     
    ('CM004', 'EMP-004', 'James', 'Thompson', 'FirstOfficer', 'OnDuty', 'james.thompson@example.com', '+1-555-0104',
     '{"Commercial", "CFI"}', '{"G650", "G550"}',
     '2025-11-30', '2025-07-20', 4500.0, 800.0, 95.0, 28.0, 'KPBI',
     '2019-09-05', '{"type": "medical", "class": "First Class", "expiry": "2025-11-30"}',
     '{"English"}'),
     
    ('CM005', 'EMP-005', 'Lisa', 'Anderson', 'FlightAttendant', 'Available', 'lisa.anderson@example.com', '+1-555-0105',
     '{"Private Pilot"}', '{}',
     '2025-10-15', '2025-05-30', 850.0, 0.0, 0.0, 0.0, 'KLAX',
     '2021-04-10', '{"type": "medical", "class": "Second Class", "expiry": "2025-10-15"}',
     '{"English", "French"}'),
     
    ('CM006', 'EMP-006', 'Robert', 'Davis', 'Captain', 'Available', 'robert.davis@example.com', '+1-555-0106',
     '{"ATP", "CFI", "CFII"}', '{"Challenger 350", "Challenger 605", "Global 6000"}',
     '2025-09-25', '2025-08-15', 18500.0, 14200.0, 175.0, 61.0, 'KLAX',
     '2012-01-15', '{"type": "medical", "class": "First Class", "expiry": "2025-09-25"}',
     '{"English"}'),
     
    ('CM007', 'EMP-007', 'Alexandra', 'Wilson', 'FirstOfficer', 'Available', 'alexandra.wilson@example.com', '+1-555-0107',
     '{"Commercial", "CFI"}', '{"Challenger 350", "Challenger 605"}',
     '2025-12-05', '2025-03-20', 2800.0, 450.0, 85.0, 32.0, 'KLAX',
     '2022-06-01', '{"type": "medical", "class": "First Class", "expiry": "2025-12-05"}',
     '{"English", "German"}'),
     
    ('CM008', 'EMP-008', 'David', 'Brown', 'Captain', 'Available', 'david.brown@example.com', '+1-555-0108',
     '{"ATP", "CFI"}', '{"Falcon 7X", "Falcon 900EX", "Falcon 2000EX"}',
     '2025-07-18', '2025-11-10', 16800.0, 12100.0, 140.0, 48.0, 'KBOS',
     '2014-03-20', '{"type": "medical", "class": "First Class", "expiry": "2025-07-18"}',
     '{"English"}'),
     
    ('CM009', 'EMP-009', 'Jennifer', 'Garcia', 'FirstOfficer', 'Available', 'jennifer.garcia@example.com', '+1-555-0109',
     '{"Commercial", "CFI"}', '{"Falcon 7X", "Falcon 2000EX"}',
     '2025-06-12', '2025-09-05', 3200.0, 600.0, 110.0, 38.0, 'KBOS',
     '2021-10-15', '{"type": "medical", "class": "First Class", "expiry": "2025-06-12"}',
     '{"English", "Spanish"}'),
     
    ('CM010', 'EMP-010', 'Mark', 'Johnson', 'FlightAttendant', 'Available', 'mark.johnson@example.com', '+1-555-0110',
     '{}', '{}',
     '2025-08-28', '2025-12-01', 0.0, 0.0, 0.0, 0.0, 'KBOS',
     '2020-08-12', '{"type": "medical", "class": "Third Class", "expiry": "2025-08-28"}',
     '{"English", "Italian"}');

-- ===================================
-- MAINTENANCE SCHEDULES
-- ===================================

INSERT INTO maintenance_schedules (id, aircraft_id, maintenance_type, description, facility_id, scheduled_start_date, scheduled_end_date, status, estimated_cost, currency, priority, flight_hours_at_schedule, flight_cycles_at_schedule, compliance_references, notes) VALUES
    ('MS001', 'ACF001', 'Progressive', '200-Hour Progressive Inspection', 'MF001', 
     '2025-01-15 08:00:00+00', '2025-01-17 18:00:00+00', 'Scheduled', 
     15000.00, 'USD', 2, 4250.5, 1820, 
     '{"FAR 91.409(d)"}', 'Scheduled progressive inspection per manufacturer recommendations'),
     
    ('MS002', 'ACF002', 'Routine', 'Annual Inspection', 'MF002', 
     '2025-02-01 06:00:00+00', '2025-02-05 17:00:00+00', 'Scheduled', 
     25000.00, 'USD', 1, 2100.0, 980, 
     '{"FAR 91.409(a)"}', 'Annual inspection due. Aircraft grounded until completion'),
     
    ('MS003', 'ACF003', 'Compliance', 'Engine Hot Section Inspection', 'MF004', 
     '2025-01-20 07:00:00+00', '2025-01-25 16:00:00+00', 'InProgress', 
     45000.00, 'USD', 1, 3800.0, 2100, 
     '{"SB PW300-72-408", "AD 2024-15-02"}', 'Hot section inspection on left engine. Parts ordered'),
     
    ('MS004', 'ACF004', 'Routine', '100-Hour Inspection', 'MF001', 
     '2025-01-10 09:00:00+00', '2025-01-11 17:00:00+00', 'Completed', 
     5500.00, 'USD', 3, 1950.0, 850, 
     '{"FAR 91.409(b)"}', 'Completed 100-hour inspection. No major discrepancies found'),
     
    ('MS005', 'ACF005', 'AircraftOnGround', 'Avionics System Repair', 'MF003', 
     '2025-01-08 10:00:00+00', '2025-01-12 15:00:00+00', 'Completed', 
     32000.00, 'USD', 1, 2800.0, 1200, 
     '{"AD 2024-22-05"}', 'Emergency repair of flight management system. Aircraft returned to service'),
     
    ('MS006', 'ACF006', 'Progressive', '300-Hour Progressive Inspection', 'MF002', 
     '2025-02-10 08:00:00+00', '2025-02-14 18:00:00+00', 'Scheduled', 
     18000.00, 'USD', 2, 3200.0, 1450, 
     '{"FAR 91.409(d)"}', '300-hour progressive inspection scheduled'),
     
    ('MS007', 'ACF007', 'Modification', 'Interior Refurbishment', 'MF003', 
     '2025-03-01 07:00:00+00', '2025-03-20 17:00:00+00', 'Scheduled', 
     125000.00, 'USD', 4, 4100.0, 1850, 
     '{}', 'Complete interior refurbishment including new seats and cabin management system'),
     
    ('MS008', 'ACF008', 'Routine', '50-Hour Inspection', 'MF005', 
     '2025-01-12 06:00:00+00', '2025-01-12 14:00:00+00', 'Completed', 
     2800.00, 'USD', 3, 1450.0, 680, 
     '{"FAR 91.409(b)"}', '50-hour inspection completed. Minor squawks addressed'),
     
    ('MS009', 'ACF009', 'Compliance', 'Landing Gear Overhaul', 'MF001', 
     '2025-02-15 08:00:00+00', '2025-02-28 17:00:00+00', 'Scheduled', 
     65000.00, 'USD', 1, 5200.0, 2300, 
     '{"SB G650-32-001", "AD 2024-18-12"}', 'Scheduled landing gear overhaul per service bulletin'),
     
    ('MS010', 'ACF010', 'Routine', 'Phase 1 Inspection', 'MF004', 
     '2025-01-25 07:00:00+00', '2025-01-28 16:00:00+00', 'Scheduled', 
     22000.00, 'USD', 2, 3600.0, 1600, 
     '{"FAR 91.409(d)"}', 'Phase 1 inspection of progressive maintenance program');

-- ===================================
-- FLIGHT SCHEDULES
-- ===================================

INSERT INTO flight_schedules (id, flight_number, aircraft_id, departure_airport, arrival_airport, scheduled_departure, scheduled_arrival, estimated_flight_time, status, captain_id, first_officer_id, passenger_count, operational_notes, charter_customer, billing_reference, pre_flight_inspection_required, post_flight_inspection_required) VALUES
    ('FS001', 'EXE101', 'ACF001', 'KTEB', 'KPBI', 
     '2025-01-12 14:00:00+00', '2025-01-12 16:45:00+00', 2.75, 'Confirmed',
     'CM001', 'CM002', 6, 'VIP charter flight. Catering required.',
     'Goldman Sachs Executive', 'GS-2025-001', true, false),
     
    ('FS002', 'EXE102', 'ACF003', 'KPBI', 'KLAX', 
     '2025-01-13 09:30:00+00', '2025-01-13 12:15:00+00', 4.75, 'Scheduled',
     'CM003', 'CM004', 8, 'Transcontinental flight. Extra fuel required.',
     'Tech Conference Group', 'TCG-2025-012', true, true),
     
    ('FS003', 'EXE103', 'ACF006', 'KLAX', 'KBOS', 
     '2025-01-14 16:00:00+00', '2025-01-15 00:30:00+00', 5.5, 'Confirmed',
     'CM006', 'CM007', 4, 'Red-eye flight. Crew rest facilities required.',
     'Private Client', 'PC-2025-089', true, false),
     
    ('FS004', 'EXE104', 'ACF008', 'KBOS', 'KTEB', 
     '2025-01-15 11:00:00+00', '2025-01-15 12:15:00+00', 1.25, 'InProgress',
     'CM008', 'CM009', 2, 'Short business trip. Weather monitoring required.',
     'Financial Services Corp', 'FSC-2025-156', true, false),
     
    ('FS005', 'EXE105', 'ACF002', 'KTEB', 'KORD', 
     '2025-01-16 13:00:00+00', '2025-01-16 15:30:00+00', 2.5, 'Scheduled',
     'CM001', 'CM002', 7, 'Business meeting transport. Ground transport arranged.',
     'Manufacturing Executive', 'ME-2025-033', true, false),
     
    ('FS006', 'EXE106', 'ACF005', 'KORD', 'KDEN', 
     '2025-01-17 08:15:00+00', '2025-01-17 10:00:00+00', 1.75, 'Confirmed',
     'CM003', 'CM004', 5, 'Mountain weather considerations. De-icing equipment standby.',
     'Sports Team Management', 'STM-2025-021', true, false),
     
    ('FS007', 'EXE107', 'ACF010', 'KDEN', 'KPHX', 
     '2025-01-18 15:30:00+00', '2025-01-18 17:15:00+00', 1.75, 'Scheduled',
     'CM006', 'CM007', 3, 'Desert operations. High temperature considerations.',
     'Real Estate Investor', 'REI-2025-078', true, false),
     
    ('FS008', 'EXE108', 'ACF007', 'KPHX', 'KLAS', 
     '2025-01-19 10:00:00+00', '2025-01-19 10:45:00+00', 0.75, 'Confirmed',
     'CM008', 'CM009', 8, 'Short hop to Las Vegas. Gaming industry client.',
     'Entertainment Group', 'EG-2025-144', true, false),
     
    ('FS009', 'EXE109', 'ACF004', 'KLAS', 'KSEA', 
     '2025-01-20 12:30:00+00', '2025-01-20 15:00:00+00', 2.5, 'Scheduled',
     'CM001', 'CM002', 6, 'Pacific Northwest destination. Rain gear required.',
     'Technology Startup', 'TS-2025-067', true, false),
     
    ('FS010', 'EXE110', 'ACF009', 'KSEA', 'KSJC', 
     '2025-01-21 14:00:00+00', '2025-01-21 16:30:00+00', 2.5, 'Confirmed',
     'CM003', 'CM004', 4, 'Silicon Valley executive transport. Security considerations.',
     'Venture Capital Firm', 'VCF-2025-198', true, false);

-- ===================================
-- AIRCRAFT STATUS LOG
-- ===================================

INSERT INTO aircraft_status_log (id, aircraft_id, status, previous_status, status_change_date, reason, location, current_flight_hours, current_flight_cycles, notes, updated_by) VALUES
    ('ASL001', 'ACF001', 'Available', 'InService', '2025-01-11 18:30:00+00', 'Flight completed', 'KTEB', 4250.5, 1820, 'Aircraft returned from KPBI charter', 'system'),
    ('ASL002', 'ACF002', 'Available', 'InService', '2025-01-10 16:45:00+00', 'Flight completed', 'KTEB', 2100.0, 980, 'Post-flight inspection completed', 'maint_tech_01'),
    ('ASL003', 'ACF003', 'InService', 'Available', '2025-01-13 09:15:00+00', 'Flight departure', 'KPBI', 3800.0, 2100, 'Departed for KLAX charter', 'dispatch'),
    ('ASL004', 'ACF004', 'Available', 'Maintenance', '2025-01-11 17:00:00+00', 'Maintenance completed', 'KTEB', 1950.0, 850, '100-hour inspection completed successfully', 'maint_supervisor'),
    ('ASL005', 'ACF005', 'Available', 'Maintenance', '2025-01-12 15:00:00+00', 'AOG repair completed', 'KLNK', 2800.0, 1200, 'Avionics repair completed, aircraft serviceable', 'maint_tech_05'),
    ('ASL006', 'ACF006', 'Available', 'InService', '2025-01-12 20:15:00+00', 'Flight completed', 'KLAX', 3200.0, 1450, 'Transcontinental flight completed', 'system'),
    ('ASL007', 'ACF007', 'Available', 'InService', '2025-01-11 14:20:00+00', 'Flight completed', 'KPHX', 4100.0, 1850, 'Regular charter service completed', 'system'),
    ('ASL008', 'ACF008', 'InService', 'Available', '2025-01-15 10:45:00+00', 'Flight departure', 'KBOS', 1450.0, 680, 'Departed for KTEB business flight', 'dispatch'),
    ('ASL009', 'ACF009', 'Available', 'InService', '2025-01-12 19:45:00+00', 'Flight completed', 'KSEA', 5200.0, 2300, 'West coast charter completed', 'system'),
    ('ASL010', 'ACF010', 'Available', 'InService', '2025-01-11 22:30:00+00', 'Flight completed', 'KDEN', 3600.0, 1600, 'Mountain region flight completed', 'system');

-- ===================================
-- CREW ASSIGNMENTS
-- ===================================

INSERT INTO crew_assignments (id, flight_schedule_id, crew_member_id, role, assignment_date, is_primary, is_backup, duty_start_time, duty_end_time, assigned_by) VALUES
    ('CA001', 'FS001', 'CM001', 'Captain', '2025-01-10 10:00:00+00', true, false, '2025-01-12 13:00:00+00', '2025-01-12 18:00:00+00', 'crew_scheduler'),
    ('CA002', 'FS001', 'CM002', 'FirstOfficer', '2025-01-10 10:00:00+00', true, false, '2025-01-12 13:00:00+00', '2025-01-12 18:00:00+00', 'crew_scheduler'),
    ('CA003', 'FS002', 'CM003', 'Captain', '2025-01-11 14:00:00+00', true, false, '2025-01-13 08:30:00+00', '2025-01-13 14:30:00+00', 'crew_scheduler'),
    ('CA004', 'FS002', 'CM004', 'FirstOfficer', '2025-01-11 14:00:00+00', true, false, '2025-01-13 08:30:00+00', '2025-01-13 14:30:00+00', 'crew_scheduler'),
    ('CA005', 'FS003', 'CM006', 'Captain', '2025-01-12 09:00:00+00', true, false, '2025-01-14 15:00:00+00', '2025-01-15 02:30:00+00', 'crew_scheduler'),
    ('CA006', 'FS003', 'CM007', 'FirstOfficer', '2025-01-12 09:00:00+00', true, false, '2025-01-14 15:00:00+00', '2025-01-15 02:30:00+00', 'crew_scheduler'),
    ('CA007', 'FS004', 'CM008', 'Captain', '2025-01-13 16:00:00+00', true, false, '2025-01-15 10:00:00+00', '2025-01-15 14:00:00+00', 'crew_scheduler'),
    ('CA008', 'FS004', 'CM009', 'FirstOfficer', '2025-01-13 16:00:00+00', true, false, '2025-01-15 10:00:00+00', '2025-01-15 14:00:00+00', 'crew_scheduler'),
    ('CA009', 'FS005', 'CM001', 'Captain', '2025-01-14 11:00:00+00', true, false, '2025-01-16 12:00:00+00', '2025-01-16 17:00:00+00', 'crew_scheduler'),
    ('CA010', 'FS005', 'CM002', 'FirstOfficer', '2025-01-14 11:00:00+00', true, false, '2025-01-16 12:00:00+00', '2025-01-16 17:00:00+00', 'crew_scheduler');

-- Add some backup crew assignments
INSERT INTO crew_assignments (id, flight_schedule_id, crew_member_id, role, assignment_date, is_primary, is_backup, qualified_for_aircraft, qualification_notes, assigned_by) VALUES
    ('CA011', 'FS001', 'CM003', 'Captain', '2025-01-10 10:00:00+00', false, true, true, 'Backup captain - qualified on Citation CJ3+', 'crew_scheduler'),
    ('CA012', 'FS002', 'CM006', 'Captain', '2025-01-11 14:00:00+00', false, true, false, 'Backup captain - requires type rating checkout', 'crew_scheduler'),
    ('CA013', 'FS003', 'CM008', 'Captain', '2025-01-12 09:00:00+00', false, true, true, 'Backup captain - current on Challenger 350', 'crew_scheduler');

-- ===================================
-- DATA VERIFICATION QUERIES
-- ===================================

-- Verify data was inserted correctly
DO $$
DECLARE
    facility_count INTEGER;
    crew_count INTEGER;
    schedule_count INTEGER;
    flight_count INTEGER;
    status_count INTEGER;
    assignment_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO facility_count FROM maintenance_facilities;
    SELECT COUNT(*) INTO crew_count FROM crew_members;
    SELECT COUNT(*) INTO schedule_count FROM maintenance_schedules;
    SELECT COUNT(*) INTO flight_count FROM flight_schedules;
    SELECT COUNT(*) INTO status_count FROM aircraft_status_log;
    SELECT COUNT(*) INTO assignment_count FROM crew_assignments;
    
    RAISE NOTICE 'SchedAero seed data verification:';
    RAISE NOTICE '- Maintenance Facilities: %', facility_count;
    RAISE NOTICE '- Crew Members: %', crew_count;
    RAISE NOTICE '- Maintenance Schedules: %', schedule_count;
    RAISE NOTICE '- Flight Schedules: %', flight_count;
    RAISE NOTICE '- Aircraft Status Logs: %', status_count;
    RAISE NOTICE '- Crew Assignments: %', assignment_count;
    RAISE NOTICE 'SchedAero seed data migration completed successfully!';
END $$;