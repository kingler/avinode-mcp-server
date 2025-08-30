-- SchedAero MCP Server Database Schema
-- Migration 003: Create SchedAero tables for scheduling, maintenance, and crew management

-- Enable necessary extensions (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create SchedAero-specific enum types
CREATE TYPE maintenance_status AS ENUM ('Scheduled', 'InProgress', 'Completed', 'Overdue', 'Cancelled');
CREATE TYPE maintenance_type AS ENUM ('Routine', 'Progressive', 'AircraftOnGround', 'Compliance', 'Modification');
CREATE TYPE crew_status AS ENUM ('Available', 'Assigned', 'OnDuty', 'OffDuty', 'Unavailable');
CREATE TYPE crew_role AS ENUM ('Captain', 'FirstOfficer', 'FlightEngineer', 'FlightAttendant');
CREATE TYPE flight_schedule_status AS ENUM ('Scheduled', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'Delayed');
CREATE TYPE aircraft_status AS ENUM ('Available', 'InService', 'Maintenance', 'OutOfService');

-- ===================================
-- MAINTENANCE FACILITIES TABLE
-- ===================================
CREATE TABLE maintenance_facilities (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    airport_code VARCHAR(10) NOT NULL, -- ICAO code
    facility_type VARCHAR(100) NOT NULL, -- Line, Base, Component, etc.
    certifications TEXT[] NOT NULL DEFAULT '{}',
    capabilities TEXT[] NOT NULL DEFAULT '{}', -- Engine, Avionics, Structural, etc.
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    operating_hours JSONB, -- {"monday": {"open": "06:00", "close": "22:00"}, ...}
    hangar_capacity INTEGER NOT NULL DEFAULT 0,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_facility_email CHECK (contact_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_airport_code CHECK (LENGTH(airport_code) = 4),
    CONSTRAINT valid_hangar_capacity CHECK (hangar_capacity >= 0)
);

-- ===================================
-- MAINTENANCE SCHEDULES TABLE
-- ===================================
CREATE TABLE maintenance_schedules (
    id VARCHAR(50) PRIMARY KEY,
    aircraft_id VARCHAR(50) NOT NULL, -- References aircraft from Avinode schema
    maintenance_type maintenance_type NOT NULL,
    description TEXT NOT NULL,
    facility_id VARCHAR(50) REFERENCES maintenance_facilities(id) ON DELETE SET NULL,
    scheduled_start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_start_date TIMESTAMP WITH TIME ZONE,
    actual_end_date TIMESTAMP WITH TIME ZONE,
    status maintenance_status NOT NULL DEFAULT 'Scheduled',
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    work_orders TEXT[] NOT NULL DEFAULT '{}',
    priority INTEGER NOT NULL DEFAULT 3 CHECK (priority BETWEEN 1 AND 5), -- 1=Critical, 5=Low
    recurring_interval_days INTEGER, -- NULL for non-recurring maintenance
    last_completed_date TIMESTAMP WITH TIME ZONE,
    
    -- Flight hour/cycle tracking
    flight_hours_at_schedule DECIMAL(10,2),
    flight_cycles_at_schedule INTEGER,
    required_flight_hours_interval DECIMAL(10,2),
    required_flight_cycles_interval INTEGER,
    
    -- Compliance tracking
    compliance_references TEXT[] NOT NULL DEFAULT '{}', -- AD numbers, SB numbers, etc.
    regulatory_deadline TIMESTAMP WITH TIME ZONE,
    
    -- Notes and documentation
    notes TEXT,
    technician_notes TEXT,
    parts_required JSONB, -- {"part_number": "qty", ...}
    documentation_references TEXT[] NOT NULL DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT valid_schedule_dates CHECK (scheduled_end_date > scheduled_start_date),
    CONSTRAINT valid_actual_dates CHECK (actual_end_date IS NULL OR actual_start_date IS NULL OR actual_end_date > actual_start_date),
    CONSTRAINT valid_costs CHECK (estimated_cost IS NULL OR estimated_cost >= 0),
    CONSTRAINT valid_actual_cost CHECK (actual_cost IS NULL OR actual_cost >= 0),
    CONSTRAINT valid_flight_hours CHECK (flight_hours_at_schedule IS NULL OR flight_hours_at_schedule >= 0),
    CONSTRAINT valid_flight_cycles CHECK (flight_cycles_at_schedule IS NULL OR flight_cycles_at_schedule >= 0)
);

-- ===================================
-- CREW MEMBERS TABLE
-- ===================================
CREATE TABLE crew_members (
    id VARCHAR(50) PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role crew_role NOT NULL,
    status crew_status NOT NULL DEFAULT 'Available',
    
    -- Contact information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT,
    emergency_contact JSONB, -- {"name": "", "phone": "", "relationship": ""}
    
    -- Certification and qualifications
    licenses TEXT[] NOT NULL DEFAULT '{}', -- ATP, Commercial, etc.
    type_ratings TEXT[] NOT NULL DEFAULT '{}', -- Aircraft type ratings
    medical_certificate_expiry DATE,
    recurrent_training_due DATE,
    certifications JSONB, -- {"cert_type": {"number": "", "expiry": ""}, ...}
    
    -- Experience and hours
    total_flight_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
    pilot_in_command_hours DECIMAL(10,2) NOT NULL DEFAULT 0,
    hours_last_90_days DECIMAL(10,2) NOT NULL DEFAULT 0,
    hours_last_30_days DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Scheduling preferences and constraints
    base_airport VARCHAR(10) NOT NULL, -- ICAO code
    max_duty_hours_day INTEGER NOT NULL DEFAULT 14,
    max_duty_hours_week INTEGER NOT NULL DEFAULT 60,
    preferred_aircraft_types TEXT[] NOT NULL DEFAULT '{}',
    languages_spoken TEXT[] NOT NULL DEFAULT '{"English"}',
    
    -- Employment details
    hire_date DATE NOT NULL,
    employment_status VARCHAR(50) NOT NULL DEFAULT 'Active', -- Active, OnLeave, Terminated
    salary_grade VARCHAR(10),
    
    -- Availability and scheduling
    availability_calendar JSONB, -- Complex availability rules
    time_zone VARCHAR(50) NOT NULL DEFAULT 'UTC',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_crew_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_base_airport CHECK (LENGTH(base_airport) = 4),
    CONSTRAINT valid_flight_hours CHECK (total_flight_hours >= 0),
    CONSTRAINT valid_pic_hours CHECK (pilot_in_command_hours >= 0 AND pilot_in_command_hours <= total_flight_hours),
    CONSTRAINT valid_recent_hours CHECK (hours_last_90_days >= 0 AND hours_last_30_days >= 0 AND hours_last_30_days <= hours_last_90_days),
    CONSTRAINT valid_duty_hours CHECK (max_duty_hours_day > 0 AND max_duty_hours_week > 0),
    CONSTRAINT valid_hire_date CHECK (hire_date <= CURRENT_DATE)
);

-- ===================================
-- FLIGHT SCHEDULES TABLE
-- ===================================
CREATE TABLE flight_schedules (
    id VARCHAR(50) PRIMARY KEY,
    flight_number VARCHAR(20) NOT NULL,
    aircraft_id VARCHAR(50) NOT NULL, -- References aircraft from Avinode schema
    
    -- Route information
    departure_airport VARCHAR(10) NOT NULL, -- ICAO code
    arrival_airport VARCHAR(10) NOT NULL, -- ICAO code
    alternate_airports TEXT[] NOT NULL DEFAULT '{}',
    
    -- Timing
    scheduled_departure TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_arrival TIMESTAMP WITH TIME ZONE NOT NULL,
    actual_departure TIMESTAMP WITH TIME ZONE,
    actual_arrival TIMESTAMP WITH TIME ZONE,
    estimated_flight_time DECIMAL(5,2) NOT NULL, -- hours
    
    -- Status and operational info
    status flight_schedule_status NOT NULL DEFAULT 'Scheduled',
    delay_reason VARCHAR(255),
    cancellation_reason VARCHAR(255),
    
    -- Crew assignments
    captain_id VARCHAR(50) REFERENCES crew_members(id) ON DELETE SET NULL,
    first_officer_id VARCHAR(50) REFERENCES crew_members(id) ON DELETE SET NULL,
    flight_attendants VARCHAR(50)[], -- Array of crew_member IDs
    
    -- Flight details
    passenger_count INTEGER NOT NULL DEFAULT 0,
    cargo_weight DECIMAL(8,2) NOT NULL DEFAULT 0, -- pounds
    fuel_required DECIMAL(8,2), -- gallons
    fuel_loaded DECIMAL(8,2), -- gallons
    
    -- Weather and operational considerations
    weather_conditions JSONB,
    notams TEXT[],
    operational_notes TEXT,
    dispatch_notes TEXT,
    
    -- Customer/charter information (if applicable)
    charter_customer VARCHAR(255),
    charter_reference VARCHAR(100),
    billing_reference VARCHAR(100),
    
    -- Maintenance integration
    pre_flight_inspection_required BOOLEAN NOT NULL DEFAULT true,
    post_flight_inspection_required BOOLEAN NOT NULL DEFAULT false,
    maintenance_write_ups TEXT[] NOT NULL DEFAULT '{}',
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT valid_airports CHECK (departure_airport != arrival_airport),
    CONSTRAINT valid_departure_arrival CHECK (LENGTH(departure_airport) = 4 AND LENGTH(arrival_airport) = 4),
    CONSTRAINT valid_scheduled_times CHECK (scheduled_arrival > scheduled_departure),
    CONSTRAINT valid_actual_times CHECK (actual_arrival IS NULL OR actual_departure IS NULL OR actual_arrival > actual_departure),
    CONSTRAINT valid_passenger_count CHECK (passenger_count >= 0),
    CONSTRAINT valid_cargo_weight CHECK (cargo_weight >= 0),
    CONSTRAINT valid_fuel CHECK (fuel_required IS NULL OR fuel_required >= 0),
    CONSTRAINT valid_fuel_loaded CHECK (fuel_loaded IS NULL OR fuel_loaded >= 0),
    CONSTRAINT valid_flight_time CHECK (estimated_flight_time > 0),
    CONSTRAINT different_crew_roles CHECK (captain_id IS NULL OR first_officer_id IS NULL OR captain_id != first_officer_id)
);

-- ===================================
-- AIRCRAFT STATUS TRACKING TABLE
-- ===================================
CREATE TABLE aircraft_status_log (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    aircraft_id VARCHAR(50) NOT NULL, -- References aircraft from Avinode schema
    status aircraft_status NOT NULL,
    previous_status aircraft_status,
    
    -- Status change details
    status_change_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reason VARCHAR(255),
    location VARCHAR(10), -- ICAO airport code
    
    -- Related records
    maintenance_schedule_id VARCHAR(50) REFERENCES maintenance_schedules(id) ON DELETE SET NULL,
    flight_schedule_id VARCHAR(50) REFERENCES flight_schedules(id) ON DELETE SET NULL,
    
    -- Operational metrics
    current_flight_hours DECIMAL(10,2),
    current_flight_cycles INTEGER,
    hours_since_last_maintenance DECIMAL(10,2),
    cycles_since_last_maintenance INTEGER,
    
    -- Notes and documentation
    notes TEXT,
    updated_by VARCHAR(100),
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT valid_location CHECK (location IS NULL OR LENGTH(location) = 4),
    CONSTRAINT valid_flight_metrics CHECK (current_flight_hours IS NULL OR current_flight_hours >= 0),
    CONSTRAINT valid_cycles CHECK (current_flight_cycles IS NULL OR current_flight_cycles >= 0)
);

-- ===================================
-- CREW ASSIGNMENTS TABLE
-- ===================================
CREATE TABLE crew_assignments (
    id VARCHAR(50) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    flight_schedule_id VARCHAR(50) NOT NULL REFERENCES flight_schedules(id) ON DELETE CASCADE,
    crew_member_id VARCHAR(50) NOT NULL REFERENCES crew_members(id) ON DELETE CASCADE,
    role crew_role NOT NULL,
    assignment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    -- Assignment details
    is_primary BOOLEAN NOT NULL DEFAULT true,
    is_backup BOOLEAN NOT NULL DEFAULT false,
    duty_start_time TIMESTAMP WITH TIME ZONE,
    duty_end_time TIMESTAMP WITH TIME ZONE,
    
    -- Qualification verification
    qualified_for_aircraft BOOLEAN NOT NULL DEFAULT true,
    qualification_notes TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    assigned_by VARCHAR(100),
    
    -- Constraints
    CONSTRAINT valid_duty_times CHECK (duty_end_time IS NULL OR duty_start_time IS NULL OR duty_end_time > duty_start_time),
    CONSTRAINT unique_flight_crew_primary UNIQUE (flight_schedule_id, role) DEFERRABLE INITIALLY DEFERRED
);

-- ===================================
-- INDEXES FOR PERFORMANCE
-- ===================================

-- Maintenance Facilities
CREATE INDEX idx_maintenance_facilities_airport ON maintenance_facilities(airport_code);
CREATE INDEX idx_maintenance_facilities_type ON maintenance_facilities(facility_type);

-- Maintenance Schedules
CREATE INDEX idx_maintenance_schedules_aircraft ON maintenance_schedules(aircraft_id);
CREATE INDEX idx_maintenance_schedules_facility ON maintenance_schedules(facility_id);
CREATE INDEX idx_maintenance_schedules_status ON maintenance_schedules(status);
CREATE INDEX idx_maintenance_schedules_dates ON maintenance_schedules(scheduled_start_date, scheduled_end_date);
CREATE INDEX idx_maintenance_schedules_type ON maintenance_schedules(maintenance_type);
CREATE INDEX idx_maintenance_schedules_priority ON maintenance_schedules(priority);

-- Crew Members
CREATE INDEX idx_crew_members_role ON crew_members(role);
CREATE INDEX idx_crew_members_status ON crew_members(status);
CREATE INDEX idx_crew_members_base ON crew_members(base_airport);
CREATE INDEX idx_crew_members_employee_id ON crew_members(employee_id);
CREATE INDEX idx_crew_members_certifications ON crew_members USING GIN(certifications);

-- Flight Schedules
CREATE INDEX idx_flight_schedules_aircraft ON flight_schedules(aircraft_id);
CREATE INDEX idx_flight_schedules_departure ON flight_schedules(departure_airport, scheduled_departure);
CREATE INDEX idx_flight_schedules_arrival ON flight_schedules(arrival_airport, scheduled_arrival);
CREATE INDEX idx_flight_schedules_status ON flight_schedules(status);
CREATE INDEX idx_flight_schedules_crew ON flight_schedules(captain_id, first_officer_id);
CREATE INDEX idx_flight_schedules_dates ON flight_schedules(scheduled_departure, scheduled_arrival);

-- Aircraft Status Log
CREATE INDEX idx_aircraft_status_aircraft ON aircraft_status_log(aircraft_id);
CREATE INDEX idx_aircraft_status_date ON aircraft_status_log(status_change_date);
CREATE INDEX idx_aircraft_status_status ON aircraft_status_log(status);

-- Crew Assignments
CREATE INDEX idx_crew_assignments_flight ON crew_assignments(flight_schedule_id);
CREATE INDEX idx_crew_assignments_crew ON crew_assignments(crew_member_id);
CREATE INDEX idx_crew_assignments_role ON crew_assignments(role);

-- ===================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMPS
-- ===================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to all relevant tables
CREATE TRIGGER update_maintenance_facilities_updated_at 
    BEFORE UPDATE ON maintenance_facilities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_schedules_updated_at 
    BEFORE UPDATE ON maintenance_schedules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_members_updated_at 
    BEFORE UPDATE ON crew_members 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_flight_schedules_updated_at 
    BEFORE UPDATE ON flight_schedules 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crew_assignments_updated_at 
    BEFORE UPDATE ON crew_assignments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- ROW LEVEL SECURITY (RLS)
-- ===================================

-- Enable RLS on all tables
ALTER TABLE maintenance_facilities ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft_status_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE crew_assignments ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (adjust based on your auth requirements)
CREATE POLICY "Allow full access to authenticated users" ON maintenance_facilities
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON maintenance_schedules
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON crew_members
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON flight_schedules
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON aircraft_status_log
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Allow full access to authenticated users" ON crew_assignments
    FOR ALL USING (auth.role() = 'authenticated');

-- ===================================
-- COMMENTS FOR DOCUMENTATION
-- ===================================

COMMENT ON TABLE maintenance_facilities IS 'Maintenance facilities and service providers';
COMMENT ON TABLE maintenance_schedules IS 'Scheduled and completed maintenance activities';
COMMENT ON TABLE crew_members IS 'Flight crew members and their qualifications';
COMMENT ON TABLE flight_schedules IS 'Scheduled flights and operational details';
COMMENT ON TABLE aircraft_status_log IS 'Real-time aircraft status tracking';
COMMENT ON TABLE crew_assignments IS 'Crew assignments to specific flights';

COMMENT ON COLUMN maintenance_schedules.priority IS '1=Critical, 2=High, 3=Medium, 4=Low, 5=Defer';
COMMENT ON COLUMN crew_members.medical_certificate_expiry IS 'FAA medical certificate expiration date';
COMMENT ON COLUMN crew_members.recurrent_training_due IS 'Next recurrent training due date';
COMMENT ON COLUMN flight_schedules.flight_number IS 'Internal flight number or callsign';