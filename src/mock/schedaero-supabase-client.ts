/**
 * SchedAero Supabase Mock Client
 * Database-backed implementation for SchedAero operations
 * Handles aircraft scheduling, maintenance, and crew management with persistent data
 */

import { supabase } from '../lib/supabase';
import {
  MaintenanceFacility,
  CrewMember,
  MaintenanceSchedule,
  FlightSchedule,
  AircraftStatus,
  CrewAssignment,
  SearchMaintenanceFacilitiesRequest,
  SearchMaintenanceFacilitiesResponse,
  SearchCrewRequest,
  SearchCrewResponse,
  CreateMaintenanceScheduleRequest,
  CreateMaintenanceScheduleResponse,
  CreateFlightScheduleRequest,
  CreateFlightScheduleResponse,
  UpdateAircraftStatusRequest,
  UpdateAircraftStatusResponse,
  AssignCrewRequest,
  AssignCrewResponse,
  generateMaintenanceId,
  generateFlightScheduleId,
  generateCrewAssignmentId,
  generateStatusLogId,
  calculateFlightTime
} from './schedaero-mock-data';

// ===================================
// DATABASE TYPE INTERFACES
// ===================================

interface DbMaintenanceFacility {
  id: string;
  name: string;
  location: string;
  airport_code: string;
  facility_type: string;
  certifications: string[];
  capabilities: string[];
  contact_email: string;
  contact_phone: string;
  operating_hours: any;
  hangar_capacity: number;
  created_at: string;
  updated_at: string;
}

interface DbCrewMember {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  role: string;
  status: string;
  email: string;
  phone: string;
  licenses: string[];
  type_ratings: string[];
  medical_certificate_expiry: string;
  recurrent_training_due: string;
  total_flight_hours: number;
  pilot_in_command_hours: number;
  hours_last_90_days: number;
  hours_last_30_days: number;
  base_airport: string;
  hire_date: string;
  certifications: any;
  languages_spoken: string[];
  created_at: string;
  updated_at: string;
}

interface DbMaintenanceSchedule {
  id: string;
  aircraft_id: string;
  maintenance_type: string;
  description: string;
  facility_id: string;
  scheduled_start_date: string;
  scheduled_end_date: string;
  actual_start_date?: string;
  actual_end_date?: string;
  status: string;
  estimated_cost: number;
  actual_cost?: number;
  currency: string;
  priority: number;
  flight_hours_at_schedule: number;
  flight_cycles_at_schedule: number;
  compliance_references: string[];
  notes: string;
  technician_notes?: string;
  parts_required?: any;
  created_at: string;
  updated_at: string;
}

interface DbFlightSchedule {
  id: string;
  flight_number: string;
  aircraft_id: string;
  departure_airport: string;
  arrival_airport: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  actual_departure?: string;
  actual_arrival?: string;
  estimated_flight_time: number;
  status: string;
  delay_reason?: string;
  cancellation_reason?: string;
  captain_id: string;
  first_officer_id: string;
  flight_attendants: string[];
  passenger_count: number;
  cargo_weight: number;
  fuel_required?: number;
  fuel_loaded?: number;
  operational_notes?: string;
  charter_customer?: string;
  billing_reference?: string;
  pre_flight_inspection_required: boolean;
  post_flight_inspection_required: boolean;
  created_at: string;
  updated_at: string;
}

// ===================================
// CONVERSION FUNCTIONS
// ===================================

function dbToMaintenanceFacility(dbFacility: DbMaintenanceFacility): MaintenanceFacility {
  return {
    id: dbFacility.id,
    name: dbFacility.name,
    location: dbFacility.location,
    airportCode: dbFacility.airport_code,
    facilityType: dbFacility.facility_type,
    certifications: dbFacility.certifications,
    capabilities: dbFacility.capabilities,
    contactEmail: dbFacility.contact_email,
    contactPhone: dbFacility.contact_phone,
    operatingHours: dbFacility.operating_hours || {},
    hangarCapacity: dbFacility.hangar_capacity
  };
}

function dbToCrewMember(dbCrew: DbCrewMember): CrewMember {
  return {
    id: dbCrew.id,
    employeeId: dbCrew.employee_id,
    firstName: dbCrew.first_name,
    lastName: dbCrew.last_name,
    role: dbCrew.role as any,
    status: dbCrew.status as any,
    email: dbCrew.email,
    phone: dbCrew.phone,
    licenses: dbCrew.licenses,
    typeRatings: dbCrew.type_ratings,
    medicalCertificateExpiry: dbCrew.medical_certificate_expiry,
    recurrentTrainingDue: dbCrew.recurrent_training_due,
    totalFlightHours: dbCrew.total_flight_hours,
    pilotInCommandHours: dbCrew.pilot_in_command_hours,
    hoursLast90Days: dbCrew.hours_last_90_days,
    hoursLast30Days: dbCrew.hours_last_30_days,
    baseAirport: dbCrew.base_airport,
    hireDate: dbCrew.hire_date,
    certifications: dbCrew.certifications || {},
    languagesSpoken: dbCrew.languages_spoken
  };
}

function dbToMaintenanceSchedule(dbSchedule: DbMaintenanceSchedule): MaintenanceSchedule {
  return {
    id: dbSchedule.id,
    aircraftId: dbSchedule.aircraft_id,
    maintenanceType: dbSchedule.maintenance_type as any,
    description: dbSchedule.description,
    facilityId: dbSchedule.facility_id,
    scheduledStartDate: dbSchedule.scheduled_start_date,
    scheduledEndDate: dbSchedule.scheduled_end_date,
    actualStartDate: dbSchedule.actual_start_date,
    actualEndDate: dbSchedule.actual_end_date,
    status: dbSchedule.status as any,
    estimatedCost: dbSchedule.estimated_cost,
    actualCost: dbSchedule.actual_cost,
    currency: dbSchedule.currency,
    priority: dbSchedule.priority,
    flightHoursAtSchedule: dbSchedule.flight_hours_at_schedule,
    flightCyclesAtSchedule: dbSchedule.flight_cycles_at_schedule,
    complianceReferences: dbSchedule.compliance_references,
    notes: dbSchedule.notes,
    technicianNotes: dbSchedule.technician_notes,
    partsRequired: dbSchedule.parts_required
  };
}

function dbToFlightSchedule(dbFlight: DbFlightSchedule): FlightSchedule {
  return {
    id: dbFlight.id,
    flightNumber: dbFlight.flight_number,
    aircraftId: dbFlight.aircraft_id,
    departureAirport: dbFlight.departure_airport,
    arrivalAirport: dbFlight.arrival_airport,
    scheduledDeparture: dbFlight.scheduled_departure,
    scheduledArrival: dbFlight.scheduled_arrival,
    actualDeparture: dbFlight.actual_departure,
    actualArrival: dbFlight.actual_arrival,
    estimatedFlightTime: dbFlight.estimated_flight_time,
    status: dbFlight.status as any,
    delayReason: dbFlight.delay_reason,
    cancellationReason: dbFlight.cancellation_reason,
    captainId: dbFlight.captain_id,
    firstOfficerId: dbFlight.first_officer_id,
    flightAttendants: dbFlight.flight_attendants,
    passengerCount: dbFlight.passenger_count,
    cargoWeight: dbFlight.cargo_weight,
    fuelRequired: dbFlight.fuel_required,
    fuelLoaded: dbFlight.fuel_loaded,
    operationalNotes: dbFlight.operational_notes,
    charterCustomer: dbFlight.charter_customer,
    billingReference: dbFlight.billing_reference,
    preFlightInspectionRequired: dbFlight.pre_flight_inspection_required,
    postFlightInspectionRequired: dbFlight.post_flight_inspection_required
  };
}

/**
 * SchedAero Supabase Mock Client Class
 * Database-backed implementation for SchedAero operations
 */
export class SchedAeroSupabaseMockClient {
  
  constructor() {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
  }

  // ===================================
  // MAINTENANCE FACILITIES
  // ===================================

  async searchMaintenanceFacilities(request: SearchMaintenanceFacilitiesRequest): Promise<SearchMaintenanceFacilitiesResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      let query = supabase
        .from('maintenance_facilities')
        .select('*');

      // Apply filters
      if (request.airportCode) {
        query = query.eq('airport_code', request.airportCode.toUpperCase());
      }

      if (request.facilityType) {
        query = query.ilike('facility_type', `%${request.facilityType}%`);
      }

      if (request.capabilities && request.capabilities.length > 0) {
        // Use array overlap operator for capabilities search
        query = query.overlaps('capabilities', request.capabilities);
      }

      const { data, error } = await query.order('name');

      if (error) {
        throw error;
      }

      const facilities = data ? data.map(dbToMaintenanceFacility) : [];

      return {
        success: true,
        data: {
          facilities,
          totalResults: facilities.length
        }
      };

    } catch (error) {
      console.error('Error searching maintenance facilities:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  async getMaintenanceFacility(facilityId: string): Promise<{ success: boolean; data?: MaintenanceFacility; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const { data, error } = await supabase
        .from('maintenance_facilities')
        .select('*')
        .eq('id', facilityId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data ? dbToMaintenanceFacility(data) : undefined
      };

    } catch (error) {
      console.error('Error getting maintenance facility:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // CREW MANAGEMENT
  // ===================================

  async searchCrew(request: SearchCrewRequest): Promise<SearchCrewResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      let query = supabase
        .from('crew_members')
        .select('*');

      // Apply filters
      if (request.role) {
        query = query.eq('role', request.role);
      }

      if (request.baseAirport) {
        query = query.eq('base_airport', request.baseAirport.toUpperCase());
      }

      if (request.typeRatings && request.typeRatings.length > 0) {
        query = query.overlaps('type_ratings', request.typeRatings);
      }

      if (request.minExperienceHours) {
        query = query.gte('total_flight_hours', request.minExperienceHours);
      }

      if (request.languages && request.languages.length > 0) {
        query = query.overlaps('languages_spoken', request.languages);
      }

      // Only show available crew members by default
      query = query.eq('status', 'Available');

      const { data, error } = await query.order('last_name');

      if (error) {
        throw error;
      }

      const crewMembers = data ? data.map(dbToCrewMember) : [];

      return {
        success: true,
        data: {
          crewMembers,
          totalResults: crewMembers.length
        }
      };

    } catch (error) {
      console.error('Error searching crew:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  async getCrewMember(crewId: string): Promise<{ success: boolean; data?: CrewMember; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const { data, error } = await supabase
        .from('crew_members')
        .select('*')
        .eq('id', crewId)
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data ? dbToCrewMember(data) : undefined
      };

    } catch (error) {
      console.error('Error getting crew member:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // MAINTENANCE SCHEDULING
  // ===================================

  async createMaintenanceSchedule(request: CreateMaintenanceScheduleRequest): Promise<CreateMaintenanceScheduleResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const newSchedule = {
        id: generateMaintenanceId(),
        aircraft_id: request.aircraftId,
        maintenance_type: request.maintenanceType,
        description: request.description,
        facility_id: request.facilityId,
        scheduled_start_date: request.scheduledStartDate,
        scheduled_end_date: request.scheduledEndDate,
        status: 'Scheduled',
        estimated_cost: request.estimatedCost,
        currency: 'USD',
        priority: request.priority,
        flight_hours_at_schedule: 0, // Would get from aircraft status
        flight_cycles_at_schedule: 0, // Would get from aircraft status
        compliance_references: request.complianceReferences || [],
        notes: request.notes || '',
        created_by: 'api_user'
      };

      const { data, error } = await supabase
        .from('maintenance_schedules')
        .insert(newSchedule)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data ? dbToMaintenanceSchedule(data) : undefined
      };

    } catch (error) {
      console.error('Error creating maintenance schedule:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  async getMaintenanceSchedules(aircraftId?: string): Promise<{ success: boolean; data?: MaintenanceSchedule[]; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      let query = supabase
        .from('maintenance_schedules')
        .select('*');

      if (aircraftId) {
        query = query.eq('aircraft_id', aircraftId);
      }

      const { data, error } = await query.order('scheduled_start_date');

      if (error) {
        throw error;
      }

      const schedules = data ? data.map(dbToMaintenanceSchedule) : [];

      return {
        success: true,
        data: schedules
      };

    } catch (error) {
      console.error('Error getting maintenance schedules:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // FLIGHT SCHEDULING
  // ===================================

  async createFlightSchedule(request: CreateFlightScheduleRequest): Promise<CreateFlightScheduleResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const estimatedFlightTime = calculateFlightTime(request.departureAirport, request.arrivalAirport);

      const newFlightSchedule = {
        id: generateFlightScheduleId(),
        flight_number: request.flightNumber,
        aircraft_id: request.aircraftId,
        departure_airport: request.departureAirport,
        arrival_airport: request.arrivalAirport,
        scheduled_departure: request.scheduledDeparture,
        scheduled_arrival: request.scheduledArrival,
        estimated_flight_time: estimatedFlightTime,
        status: 'Scheduled',
        captain_id: request.captainId,
        first_officer_id: request.firstOfficerId,
        flight_attendants: [],
        passenger_count: request.passengerCount,
        cargo_weight: 0,
        operational_notes: request.operationalNotes,
        charter_customer: request.charterCustomer,
        pre_flight_inspection_required: true,
        post_flight_inspection_required: false,
        created_by: 'api_user'
      };

      const { data, error } = await supabase
        .from('flight_schedules')
        .insert(newFlightSchedule)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return {
        success: true,
        data: data ? dbToFlightSchedule(data) : undefined
      };

    } catch (error) {
      console.error('Error creating flight schedule:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  async getFlightSchedules(aircraftId?: string): Promise<{ success: boolean; data?: FlightSchedule[]; error?: string }> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      let query = supabase
        .from('flight_schedules')
        .select('*');

      if (aircraftId) {
        query = query.eq('aircraft_id', aircraftId);
      }

      const { data, error } = await query.order('scheduled_departure');

      if (error) {
        throw error;
      }

      const schedules = data ? data.map(dbToFlightSchedule) : [];

      return {
        success: true,
        data: schedules
      };

    } catch (error) {
      console.error('Error getting flight schedules:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // AIRCRAFT STATUS
  // ===================================

  async updateAircraftStatus(request: UpdateAircraftStatusRequest): Promise<UpdateAircraftStatusResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const newStatusLog = {
        id: generateStatusLogId(),
        aircraft_id: request.aircraftId,
        status: request.status,
        status_change_date: new Date().toISOString(),
        reason: request.reason,
        location: request.location,
        notes: request.notes,
        updated_by: 'api_user'
      };

      const { data, error } = await supabase
        .from('aircraft_status_log')
        .insert(newStatusLog)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const aircraftStatus: AircraftStatus = {
        id: data.id,
        aircraftId: data.aircraft_id,
        status: data.status,
        previousStatus: data.previous_status,
        statusChangeDate: data.status_change_date,
        reason: data.reason,
        location: data.location,
        currentFlightHours: data.current_flight_hours,
        currentFlightCycles: data.current_flight_cycles,
        hoursSinceLastMaintenance: data.hours_since_last_maintenance,
        cyclesSinceLastMaintenance: data.cycles_since_last_maintenance,
        notes: data.notes,
        updatedBy: data.updated_by
      };

      return {
        success: true,
        data: aircraftStatus
      };

    } catch (error) {
      console.error('Error updating aircraft status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }

  // ===================================
  // CREW ASSIGNMENT
  // ===================================

  async assignCrew(request: AssignCrewRequest): Promise<AssignCrewResponse> {
    try {
      if (!supabase) {
        throw new Error('Supabase not available');
      }

      const newAssignment = {
        id: generateCrewAssignmentId(),
        flight_schedule_id: request.flightScheduleId,
        crew_member_id: request.crewMemberId,
        role: request.role,
        is_primary: request.isPrimary ?? true,
        is_backup: request.isBackup ?? false,
        duty_start_time: request.dutyStartTime,
        duty_end_time: request.dutyEndTime,
        qualified_for_aircraft: true, // Would verify actual qualifications
        assigned_by: 'api_user'
      };

      const { data, error } = await supabase
        .from('crew_assignments')
        .insert(newAssignment)
        .select()
        .single();

      if (error) {
        throw error;
      }

      const crewAssignment: CrewAssignment = {
        id: data.id,
        flightScheduleId: data.flight_schedule_id,
        crewMemberId: data.crew_member_id,
        role: data.role,
        isPrimary: data.is_primary,
        isBackup: data.is_backup,
        dutyStartTime: data.duty_start_time,
        dutyEndTime: data.duty_end_time,
        qualifiedForAircraft: data.qualified_for_aircraft,
        qualificationNotes: data.qualification_notes,
        assignedBy: data.assigned_by
      };

      return {
        success: true,
        data: crewAssignment
      };

    } catch (error) {
      console.error('Error assigning crew:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Database error occurred'
      };
    }
  }
}