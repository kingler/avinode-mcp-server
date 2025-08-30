/**
 * SchedAero Mock Data Types and Interfaces
 * Comprehensive data models for aircraft scheduling, maintenance, and crew management
 */

// ===================================
// CORE INTERFACES
// ===================================

export interface MaintenanceFacility {
  id: string;
  name: string;
  location: string;
  airportCode: string;
  facilityType: string;
  certifications: string[];
  capabilities: string[];
  contactEmail: string;
  contactPhone: string;
  operatingHours: Record<string, { open?: string; close?: string; closed?: boolean }>;
  hangarCapacity: number;
}

export interface CrewMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  role: 'Captain' | 'FirstOfficer' | 'FlightEngineer' | 'FlightAttendant';
  status: 'Available' | 'Assigned' | 'OnDuty' | 'OffDuty' | 'Unavailable';
  email: string;
  phone: string;
  licenses: string[];
  typeRatings: string[];
  medicalCertificateExpiry: string;
  recurrentTrainingDue: string;
  totalFlightHours: number;
  pilotInCommandHours: number;
  hoursLast90Days: number;
  hoursLast30Days: number;
  baseAirport: string;
  hireDate: string;
  certifications: Record<string, any>;
  languagesSpoken: string[];
}

export interface MaintenanceSchedule {
  id: string;
  aircraftId: string;
  maintenanceType: 'Routine' | 'Progressive' | 'AircraftOnGround' | 'Compliance' | 'Modification';
  description: string;
  facilityId: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  actualStartDate?: string;
  actualEndDate?: string;
  status: 'Scheduled' | 'InProgress' | 'Completed' | 'Overdue' | 'Cancelled';
  estimatedCost: number;
  actualCost?: number;
  currency: string;
  priority: number;
  flightHoursAtSchedule: number;
  flightCyclesAtSchedule: number;
  complianceReferences: string[];
  notes: string;
  technicianNotes?: string;
  partsRequired?: Record<string, any>;
}

export interface FlightSchedule {
  id: string;
  flightNumber: string;
  aircraftId: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  actualDeparture?: string;
  actualArrival?: string;
  estimatedFlightTime: number;
  status: 'Scheduled' | 'Confirmed' | 'InProgress' | 'Completed' | 'Cancelled' | 'Delayed';
  delayReason?: string;
  cancellationReason?: string;
  captainId: string;
  firstOfficerId: string;
  flightAttendants: string[];
  passengerCount: number;
  cargoWeight: number;
  fuelRequired?: number;
  fuelLoaded?: number;
  operationalNotes?: string;
  charterCustomer?: string;
  billingReference?: string;
  preFlightInspectionRequired: boolean;
  postFlightInspectionRequired: boolean;
}

export interface AircraftStatus {
  id: string;
  aircraftId: string;
  status: 'Available' | 'InService' | 'Maintenance' | 'OutOfService';
  previousStatus?: string;
  statusChangeDate: string;
  reason?: string;
  location?: string;
  currentFlightHours?: number;
  currentFlightCycles?: number;
  hoursSinceLastMaintenance?: number;
  cyclesSinceLastMaintenance?: number;
  notes?: string;
  updatedBy?: string;
}

export interface CrewAssignment {
  id: string;
  flightScheduleId: string;
  crewMemberId: string;
  role: 'Captain' | 'FirstOfficer' | 'FlightEngineer' | 'FlightAttendant';
  isPrimary: boolean;
  isBackup: boolean;
  dutyStartTime?: string;
  dutyEndTime?: string;
  qualifiedForAircraft: boolean;
  qualificationNotes?: string;
  assignedBy?: string;
}

// ===================================
// API REQUEST/RESPONSE INTERFACES
// ===================================

export interface SearchMaintenanceFacilitiesRequest {
  airportCode?: string;
  facilityType?: string;
  capabilities?: string[];
  availableDate?: string;
}

export interface SearchMaintenanceFacilitiesResponse {
  success: boolean;
  data?: {
    facilities: MaintenanceFacility[];
    totalResults: number;
  };
  error?: string;
}

export interface SearchCrewRequest {
  role?: 'Captain' | 'FirstOfficer' | 'FlightEngineer' | 'FlightAttendant';
  baseAirport?: string;
  typeRatings?: string[];
  availableDate?: string;
  minExperienceHours?: number;
  languages?: string[];
}

export interface SearchCrewResponse {
  success: boolean;
  data?: {
    crewMembers: CrewMember[];
    totalResults: number;
  };
  error?: string;
}

export interface CreateMaintenanceScheduleRequest {
  aircraftId: string;
  maintenanceType: string;
  description: string;
  facilityId: string;
  scheduledStartDate: string;
  scheduledEndDate: string;
  estimatedCost: number;
  priority: number;
  complianceReferences?: string[];
  notes?: string;
}

export interface CreateMaintenanceScheduleResponse {
  success: boolean;
  data?: MaintenanceSchedule;
  error?: string;
}

export interface CreateFlightScheduleRequest {
  flightNumber: string;
  aircraftId: string;
  departureAirport: string;
  arrivalAirport: string;
  scheduledDeparture: string;
  scheduledArrival: string;
  captainId: string;
  firstOfficerId: string;
  passengerCount: number;
  charterCustomer?: string;
  operationalNotes?: string;
}

export interface CreateFlightScheduleResponse {
  success: boolean;
  data?: FlightSchedule;
  error?: string;
}

export interface UpdateAircraftStatusRequest {
  aircraftId: string;
  status: string;
  reason?: string;
  location?: string;
  notes?: string;
}

export interface UpdateAircraftStatusResponse {
  success: boolean;
  data?: AircraftStatus;
  error?: string;
}

export interface AssignCrewRequest {
  flightScheduleId: string;
  crewMemberId: string;
  role: string;
  isPrimary?: boolean;
  isBackup?: boolean;
  dutyStartTime?: string;
  dutyEndTime?: string;
}

export interface AssignCrewResponse {
  success: boolean;
  data?: CrewAssignment;
  error?: string;
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

export function generateMaintenanceId(): string {
  return `MS${Math.random().toString(36).substr(2, 9).padStart(9, '0')}`.toUpperCase();
}

export function generateFlightScheduleId(): string {
  return `FS${Math.random().toString(36).substr(2, 9).padStart(9, '0')}`.toUpperCase();
}

export function generateCrewAssignmentId(): string {
  return `CA${Math.random().toString(36).substr(2, 9).padStart(9, '0')}`.toUpperCase();
}

export function generateStatusLogId(): string {
  return `ASL${Math.random().toString(36).substr(2, 9).padStart(9, '0')}`.toUpperCase();
}

export function calculateFlightTime(departureAirport: string, arrivalAirport: string): number {
  // Simplified flight time calculation based on common routes
  const routeTimes: Record<string, number> = {
    'KTEB-KPBI': 2.75,
    'KPBI-KLAX': 4.75,
    'KLAX-KBOS': 5.5,
    'KBOS-KTEB': 1.25,
    'KTEB-KORD': 2.5,
    'KORD-KDEN': 1.75,
    'KDEN-KPHX': 1.75,
    'KPHX-KLAS': 0.75,
    'KLAS-KSEA': 2.5,
    'KSEA-KSJC': 2.5
  };
  
  const route = `${departureAirport}-${arrivalAirport}`;
  const reverseRoute = `${arrivalAirport}-${departureAirport}`;
  
  return routeTimes[route] || routeTimes[reverseRoute] || 3.0;
}

export function isCrewQualified(crewMember: CrewMember, aircraftType: string): boolean {
  // Check if crew member has required type rating
  return crewMember.typeRatings.some(rating => 
    rating.toLowerCase().includes(aircraftType.toLowerCase()) ||
    aircraftType.toLowerCase().includes(rating.toLowerCase())
  );
}

export function calculateMaintenanceCost(
  maintenanceType: string, 
  aircraftCategory: string, 
  estimatedHours: number = 8
): number {
  const baseCosts: Record<string, number> = {
    'Routine': 150,
    'Progressive': 250,
    'AircraftOnGround': 400,
    'Compliance': 300,
    'Modification': 350
  };
  
  const categoryMultipliers: Record<string, number> = {
    'Light Jet': 1.0,
    'Midsize Jet': 1.5,
    'Heavy Jet': 2.0,
    'Ultra Long Range': 2.5
  };
  
  const baseCost = baseCosts[maintenanceType] || 200;
  const multiplier = categoryMultipliers[aircraftCategory] || 1.5;
  
  return Math.round(baseCost * multiplier * estimatedHours);
}

export function formatMaintenanceStatus(schedule: MaintenanceSchedule): string {
  const now = new Date();
  const startDate = new Date(schedule.scheduledStartDate);
  const endDate = new Date(schedule.scheduledEndDate);
  
  if (schedule.status === 'Completed') {
    return `✅ ${schedule.status} - ${schedule.actualEndDate ? new Date(schedule.actualEndDate).toLocaleDateString() : 'Date TBD'}`;
  } else if (schedule.status === 'InProgress') {
    return `🔧 ${schedule.status} - Est. completion ${endDate.toLocaleDateString()}`;
  } else if (schedule.status === 'Overdue') {
    return `⚠️ ${schedule.status} - Was due ${endDate.toLocaleDateString()}`;
  } else if (schedule.status === 'Scheduled') {
    if (startDate <= now) {
      return `📅 ${schedule.status} - Starting ${startDate.toLocaleDateString()}`;
    } else {
      return `📋 ${schedule.status} - Scheduled for ${startDate.toLocaleDateString()}`;
    }
  }
  
  return `${schedule.status}`;
}

export function formatCrewExperience(crewMember: CrewMember): string {
  const totalHours = crewMember.totalFlightHours;
  const picHours = crewMember.pilotInCommandHours;
  
  if (totalHours >= 15000) {
    return 'Very Experienced';
  } else if (totalHours >= 8000) {
    return 'Experienced';
  } else if (totalHours >= 3000) {
    return 'Intermediate';
  } else {
    return 'Entry Level';
  }
}