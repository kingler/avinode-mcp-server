/**
 * SchedAero Mock API Client
 * Simulates SchedAero API responses for aircraft scheduling, maintenance, and crew management
 * Supports both in-memory and Supabase-backed mock data
 */

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
  calculateFlightTime,
  isCrewQualified,
  calculateMaintenanceCost,
  formatMaintenanceStatus,
  formatCrewExperience
} from './schedaero-mock-data';

import { SchedAeroSupabaseMockClient } from './schedaero-supabase-client';
import { isSupabaseAvailable } from '../lib/supabase';

// Function to get environment variables - works in both Node.js and Cloudflare Workers
function getEnvVar(key: string): string | undefined {
  // Check if we're in a Cloudflare Worker environment (global 'env' might be available)
  if (typeof globalThis !== 'undefined' && (globalThis as any).env) {
    return (globalThis as any).env[key];
  }
  // Check if we're in Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
}

// ===================================
// IN-MEMORY MOCK DATA
// ===================================

const MOCK_MAINTENANCE_FACILITIES: MaintenanceFacility[] = [
  {
    id: 'MF001',
    name: 'JetTech Aviation Services',
    location: 'Teterboro, New Jersey',
    airportCode: 'KTEB',
    facilityType: 'Full Service MRO',
    certifications: ['FAR Part 145', 'EASA Part 145', 'IS-BAO Stage III'],
    capabilities: ['Engine Overhaul', 'Avionics Upgrade', 'Structural Repair', 'Paint Services', 'Interior Refurbishment'],
    contactEmail: 'maintenance@jettech-aviation.com',
    contactPhone: '+1-201-555-0123',
    operatingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { open: '08:00', close: '18:00' },
      sunday: { open: '08:00', close: '18:00' }
    },
    hangarCapacity: 8
  },
  {
    id: 'MF002',
    name: 'Stevens Aerospace & Defense Systems',
    location: 'Greenville, South Carolina',
    airportCode: 'KGMU',
    facilityType: 'Base Maintenance',
    certifications: ['FAR Part 145', 'FAR Part 135', 'FAR Part 91K'],
    capabilities: ['Heavy Maintenance', 'Aircraft Modifications', 'Completions', 'Avionics Installation'],
    contactEmail: 'service@stevensaero.com',
    contactPhone: '+1-864-555-0234',
    operatingHours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
      wednesday: { open: '06:00', close: '22:00' },
      thursday: { open: '06:00', close: '22:00' },
      friday: { open: '06:00', close: '22:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    hangarCapacity: 12
  },
  {
    id: 'MF003',
    name: 'Duncan Aviation',
    location: 'Lincoln, Nebraska',
    airportCode: 'KLNK',
    facilityType: 'Full Service MRO',
    certifications: ['FAR Part 145', 'EASA Part 145', 'CAAC'],
    capabilities: ['Engine Services', 'Avionics', 'Aircraft Services', 'Interior', 'Paint'],
    contactEmail: 'lincoln@duncanaviation.com',
    contactPhone: '+1-402-555-0345',
    operatingHours: {
      monday: { open: '06:00', close: '23:00' },
      tuesday: { open: '06:00', close: '23:00' },
      wednesday: { open: '06:00', close: '23:00' },
      thursday: { open: '06:00', close: '23:00' },
      friday: { open: '06:00', close: '23:00' },
      saturday: { open: '07:00', close: '19:00' },
      sunday: { open: '08:00', close: '18:00' }
    },
    hangarCapacity: 15
  }
];

const MOCK_CREW_MEMBERS: CrewMember[] = [
  {
    id: 'CM001',
    employeeId: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    role: 'Captain',
    status: 'Available',
    email: 'sarah.mitchell@example.com',
    phone: '+1-555-0101',
    licenses: ['ATP', 'CFI', 'CFII'],
    typeRatings: ['Citation CJ3+', 'Citation Sovereign', 'Hawker 400XP'],
    medicalCertificateExpiry: '2025-12-15',
    recurrentTrainingDue: '2025-06-30',
    totalFlightHours: 12500.5,
    pilotInCommandHours: 8200.0,
    hoursLast90Days: 180.0,
    hoursLast30Days: 65.0,
    baseAirport: 'KTEB',
    hireDate: '2018-03-15',
    certifications: { type: 'medical', class: 'First Class', expiry: '2025-12-15' },
    languagesSpoken: ['English', 'Spanish']
  },
  {
    id: 'CM002',
    employeeId: 'EMP-002',
    firstName: 'Michael',
    lastName: 'Rodriguez',
    role: 'FirstOfficer',
    status: 'Available',
    email: 'michael.rodriguez@example.com',
    phone: '+1-555-0102',
    licenses: ['Commercial', 'CFI', 'MEI'],
    typeRatings: ['Citation CJ3+', 'Citation XLS+'],
    medicalCertificateExpiry: '2025-08-20',
    recurrentTrainingDue: '2025-04-15',
    totalFlightHours: 3800.2,
    pilotInCommandHours: 1200.0,
    hoursLast90Days: 120.0,
    hoursLast30Days: 42.0,
    baseAirport: 'KTEB',
    hireDate: '2020-11-20',
    certifications: { type: 'medical', class: 'First Class', expiry: '2025-08-20' },
    languagesSpoken: ['English', 'Portuguese']
  },
  {
    id: 'CM003',
    employeeId: 'EMP-003',
    firstName: 'Emily',
    lastName: 'Chen',
    role: 'Captain',
    status: 'Available',
    email: 'emily.chen@example.com',
    phone: '+1-555-0103',
    licenses: ['ATP', 'CFI'],
    typeRatings: ['G650', 'G550', 'G450'],
    medicalCertificateExpiry: '2026-01-10',
    recurrentTrainingDue: '2025-09-10',
    totalFlightHours: 15200.0,
    pilotInCommandHours: 11500.0,
    hoursLast90Days: 160.0,
    hoursLast30Days: 58.0,
    baseAirport: 'KPBI',
    hireDate: '2015-07-12',
    certifications: { type: 'medical', class: 'First Class', expiry: '2026-01-10' },
    languagesSpoken: ['English', 'Mandarin']
  }
];

const MOCK_MAINTENANCE_SCHEDULES: MaintenanceSchedule[] = [
  {
    id: 'MS001',
    aircraftId: 'ACF001',
    maintenanceType: 'Progressive',
    description: '200-Hour Progressive Inspection',
    facilityId: 'MF001',
    scheduledStartDate: '2025-01-15T08:00:00Z',
    scheduledEndDate: '2025-01-17T18:00:00Z',
    status: 'Scheduled',
    estimatedCost: 15000.00,
    currency: 'USD',
    priority: 2,
    flightHoursAtSchedule: 4250.5,
    flightCyclesAtSchedule: 1820,
    complianceReferences: ['FAR 91.409(d)'],
    notes: 'Scheduled progressive inspection per manufacturer recommendations'
  },
  {
    id: 'MS002',
    aircraftId: 'ACF002',
    maintenanceType: 'Routine',
    description: 'Annual Inspection',
    facilityId: 'MF002',
    scheduledStartDate: '2025-02-01T06:00:00Z',
    scheduledEndDate: '2025-02-05T17:00:00Z',
    status: 'Scheduled',
    estimatedCost: 25000.00,
    currency: 'USD',
    priority: 1,
    flightHoursAtSchedule: 2100.0,
    flightCyclesAtSchedule: 980,
    complianceReferences: ['FAR 91.409(a)'],
    notes: 'Annual inspection due. Aircraft grounded until completion'
  }
];

const MOCK_FLIGHT_SCHEDULES: FlightSchedule[] = [
  {
    id: 'FS001',
    flightNumber: 'EXE101',
    aircraftId: 'ACF001',
    departureAirport: 'KTEB',
    arrivalAirport: 'KPBI',
    scheduledDeparture: '2025-01-12T14:00:00Z',
    scheduledArrival: '2025-01-12T16:45:00Z',
    estimatedFlightTime: 2.75,
    status: 'Confirmed',
    captainId: 'CM001',
    firstOfficerId: 'CM002',
    flightAttendants: [],
    passengerCount: 6,
    cargoWeight: 150.0,
    operationalNotes: 'VIP charter flight. Catering required.',
    charterCustomer: 'Goldman Sachs Executive',
    billingReference: 'GS-2025-001',
    preFlightInspectionRequired: true,
    postFlightInspectionRequired: false
  }
];

/**
 * SchedAero Mock Client Class
 * Handles aircraft scheduling, maintenance, and crew management operations
 */
export class SchedAeroMockClient {
  private supabaseClient: SchedAeroSupabaseMockClient | null = null;
  private useSupabase: boolean = false;

  constructor() {
    // Check if Supabase should be used
    const useSupabaseMock = getEnvVar('USE_SUPABASE_MOCK') === 'true';
    
    if (useSupabaseMock && isSupabaseAvailable()) {
      this.supabaseClient = new SchedAeroSupabaseMockClient();
      this.useSupabase = true;
      console.log('SchedAero Mock Client: Using Supabase-backed data');
    } else {
      console.log('SchedAero Mock Client: Using in-memory mock data');
    }
  }

  // ===================================
  // MAINTENANCE FACILITIES
  // ===================================

  async searchMaintenanceFacilities(request: SearchMaintenanceFacilitiesRequest): Promise<SearchMaintenanceFacilitiesResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.searchMaintenanceFacilities(request);
      }

      // In-memory implementation
      let facilities = [...MOCK_MAINTENANCE_FACILITIES];

      // Apply filters
      if (request.airportCode) {
        facilities = facilities.filter(f => 
          f.airportCode.toLowerCase() === request.airportCode!.toLowerCase()
        );
      }

      if (request.facilityType) {
        facilities = facilities.filter(f => 
          f.facilityType.toLowerCase().includes(request.facilityType!.toLowerCase())
        );
      }

      if (request.capabilities && request.capabilities.length > 0) {
        facilities = facilities.filter(f =>
          request.capabilities!.some(cap =>
            f.capabilities.some(fcap => fcap.toLowerCase().includes(cap.toLowerCase()))
          )
        );
      }

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

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
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // CREW MANAGEMENT
  // ===================================

  async searchCrew(request: SearchCrewRequest): Promise<SearchCrewResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.searchCrew(request);
      }

      // In-memory implementation
      let crewMembers = [...MOCK_CREW_MEMBERS];

      // Apply filters
      if (request.role) {
        crewMembers = crewMembers.filter(c => c.role === request.role);
      }

      if (request.baseAirport) {
        crewMembers = crewMembers.filter(c => 
          c.baseAirport.toLowerCase() === request.baseAirport!.toLowerCase()
        );
      }

      if (request.typeRatings && request.typeRatings.length > 0) {
        crewMembers = crewMembers.filter(c =>
          request.typeRatings!.some(rating =>
            c.typeRatings.some(crating => crating.toLowerCase().includes(rating.toLowerCase()))
          )
        );
      }

      if (request.minExperienceHours) {
        crewMembers = crewMembers.filter(c => 
          c.totalFlightHours >= request.minExperienceHours!
        );
      }

      if (request.languages && request.languages.length > 0) {
        crewMembers = crewMembers.filter(c =>
          request.languages!.some(lang =>
            c.languagesSpoken.some(clang => clang.toLowerCase().includes(lang.toLowerCase()))
          )
        );
      }

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

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
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // MAINTENANCE SCHEDULING
  // ===================================

  async createMaintenanceSchedule(request: CreateMaintenanceScheduleRequest): Promise<CreateMaintenanceScheduleResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.createMaintenanceSchedule(request);
      }

      // In-memory implementation
      const newSchedule: MaintenanceSchedule = {
        id: generateMaintenanceId(),
        aircraftId: request.aircraftId,
        maintenanceType: request.maintenanceType as any,
        description: request.description,
        facilityId: request.facilityId,
        scheduledStartDate: request.scheduledStartDate,
        scheduledEndDate: request.scheduledEndDate,
        status: 'Scheduled',
        estimatedCost: request.estimatedCost,
        currency: 'USD',
        priority: request.priority,
        flightHoursAtSchedule: 0, // Would be populated from aircraft data
        flightCyclesAtSchedule: 0, // Would be populated from aircraft data
        complianceReferences: request.complianceReferences || [],
        notes: request.notes || '',
        technicianNotes: ''
      };

      // Add to mock data
      MOCK_MAINTENANCE_SCHEDULES.push(newSchedule);

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        success: true,
        data: newSchedule
      };

    } catch (error) {
      console.error('Error creating maintenance schedule:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getMaintenanceSchedules(aircraftId?: string): Promise<{ success: boolean; data?: MaintenanceSchedule[]; error?: string }> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getMaintenanceSchedules(aircraftId);
      }

      // In-memory implementation
      let schedules = [...MOCK_MAINTENANCE_SCHEDULES];

      if (aircraftId) {
        schedules = schedules.filter(s => s.aircraftId === aircraftId);
      }

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        data: schedules
      };

    } catch (error) {
      console.error('Error getting maintenance schedules:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // FLIGHT SCHEDULING
  // ===================================

  async createFlightSchedule(request: CreateFlightScheduleRequest): Promise<CreateFlightScheduleResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.createFlightSchedule(request);
      }

      // In-memory implementation
      const estimatedFlightTime = calculateFlightTime(request.departureAirport, request.arrivalAirport);

      const newFlightSchedule: FlightSchedule = {
        id: generateFlightScheduleId(),
        flightNumber: request.flightNumber,
        aircraftId: request.aircraftId,
        departureAirport: request.departureAirport,
        arrivalAirport: request.arrivalAirport,
        scheduledDeparture: request.scheduledDeparture,
        scheduledArrival: request.scheduledArrival,
        estimatedFlightTime,
        status: 'Scheduled',
        captainId: request.captainId,
        firstOfficerId: request.firstOfficerId,
        flightAttendants: [],
        passengerCount: request.passengerCount,
        cargoWeight: 0,
        operationalNotes: request.operationalNotes,
        charterCustomer: request.charterCustomer,
        preFlightInspectionRequired: true,
        postFlightInspectionRequired: false
      };

      // Add to mock data
      MOCK_FLIGHT_SCHEDULES.push(newFlightSchedule);

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 200));

      return {
        success: true,
        data: newFlightSchedule
      };

    } catch (error) {
      console.error('Error creating flight schedule:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getFlightSchedules(aircraftId?: string): Promise<{ success: boolean; data?: FlightSchedule[]; error?: string }> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getFlightSchedules(aircraftId);
      }

      // In-memory implementation
      let schedules = [...MOCK_FLIGHT_SCHEDULES];

      if (aircraftId) {
        schedules = schedules.filter(s => s.aircraftId === aircraftId);
      }

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        data: schedules
      };

    } catch (error) {
      console.error('Error getting flight schedules:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // AIRCRAFT STATUS
  // ===================================

  async updateAircraftStatus(request: UpdateAircraftStatusRequest): Promise<UpdateAircraftStatusResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.updateAircraftStatus(request);
      }

      // In-memory implementation
      const newStatus: AircraftStatus = {
        id: generateStatusLogId(),
        aircraftId: request.aircraftId,
        status: request.status as any,
        statusChangeDate: new Date().toISOString(),
        reason: request.reason,
        location: request.location,
        notes: request.notes,
        updatedBy: 'system'
      };

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        data: newStatus
      };

    } catch (error) {
      console.error('Error updating aircraft status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // CREW ASSIGNMENT
  // ===================================

  async assignCrew(request: AssignCrewRequest): Promise<AssignCrewResponse> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.assignCrew(request);
      }

      // In-memory implementation
      const newAssignment: CrewAssignment = {
        id: generateCrewAssignmentId(),
        flightScheduleId: request.flightScheduleId,
        crewMemberId: request.crewMemberId,
        role: request.role as any,
        isPrimary: request.isPrimary ?? true,
        isBackup: request.isBackup ?? false,
        dutyStartTime: request.dutyStartTime,
        dutyEndTime: request.dutyEndTime,
        qualifiedForAircraft: true, // Would check actual qualifications
        assignedBy: 'system'
      };

      // Simulate response delay
      await new Promise(resolve => setTimeout(resolve, 100));

      return {
        success: true,
        data: newAssignment
      };

    } catch (error) {
      console.error('Error assigning crew:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  async getCrewMember(crewId: string): Promise<{ success: boolean; data?: CrewMember; error?: string }> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getCrewMember(crewId);
      }

      const crewMember = MOCK_CREW_MEMBERS.find(c => c.id === crewId);
      
      if (!crewMember) {
        return {
          success: false,
          error: 'Crew member not found'
        };
      }

      return {
        success: true,
        data: crewMember
      };

    } catch (error) {
      console.error('Error getting crew member:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async getMaintenanceFacility(facilityId: string): Promise<{ success: boolean; data?: MaintenanceFacility; error?: string }> {
    try {
      if (this.useSupabase && this.supabaseClient) {
        return await this.supabaseClient.getMaintenanceFacility(facilityId);
      }

      const facility = MOCK_MAINTENANCE_FACILITIES.find(f => f.id === facilityId);
      
      if (!facility) {
        return {
          success: false,
          error: 'Maintenance facility not found'
        };
      }

      return {
        success: true,
        data: facility
      };

    } catch (error) {
      console.error('Error getting maintenance facility:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
}