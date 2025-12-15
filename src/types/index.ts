export type HospitalSpecialization = 
  | 'General'
  | 'Trauma'
  | 'Cardiology'
  | 'Neurology'
  | 'Pediatrics'
  | 'Oncology';

export type PatientSeverity = 'Critical' | 'High' | 'Moderate' | 'Low';

export type PatientCondition =
  | 'Trauma'
  | 'Cardiac'
  | 'Neurological'
  | 'Respiratory'
  | 'General';

export interface Hospital {
  id: string;
  name: string;
  location: { lat: number; lng: number };
  specializations: HospitalSpecialization[];
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcuBeds: number;
  doctorsOnDuty: number;
  rating: number;
  avgWaitTime: number; // minutes
}

export interface Patient {
  location: { lat: number; lng: number };
  severity: PatientSeverity;
  condition: PatientCondition;
  requiresICU: boolean;
}

export interface Ambulance {
  id: string;
  location: { lat: number; lng: number };
  available: boolean;
  speed: number; // km/h
}

export interface TrafficCondition {
  severity: number; // 0-1, where 1 is heavy traffic
  factor: number; // multiplier for travel time
}

export interface OptimizationResult {
  hospital: Hospital;
  distance: number; // km
  estimatedTime: number; // minutes
  score: number;
  ambulance?: Ambulance;
  route?: { lat: number; lng: number }[];
  metrics: {
    distanceScore: number;
    capacityScore: number;
    specializationScore: number;
    availabilityScore: number;
    overallScore: number;
  };
}

export interface AlgorithmResult {
  name: string;
  result: OptimizationResult;
  executionTime: number; // ms
  iterationsOrSteps?: number;
}
