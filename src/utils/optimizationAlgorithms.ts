import {
  Hospital,
  Patient,
  Ambulance,
  OptimizationResult,
  TrafficCondition,
} from '../types';

// Calculate distance between two points using Haversine formula
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get traffic condition based on time and distance
export function getTrafficCondition(distance: number): TrafficCondition {
  // Simulate traffic: longer distances and certain times have worse traffic
  const hour = new Date().getHours();
  const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 16 && hour <= 19);
  const baseSeverity = Math.random() * 0.3; // Random component
  const rushHourBonus = isRushHour ? 0.3 : 0;
  const distanceBonus = Math.min(distance / 20, 0.2); // Longer distances = more traffic
  
  const severity = Math.min(baseSeverity + rushHourBonus + distanceBonus, 1);
  const factor = 1 + severity * 0.8; // Traffic can increase time by up to 80%
  
  return { severity, factor };
}

// Calculate estimated travel time
export function calculateTravelTime(
  distance: number,
  speed: number,
  trafficCondition: TrafficCondition
): number {
  const baseTime = (distance / speed) * 60; // Convert to minutes
  return baseTime * trafficCondition.factor;
}

// Check if hospital matches patient condition
function getSpecializationMatch(hospital: Hospital, patient: Patient): number {
  const conditionToSpecialization: { [key: string]: string[] } = {
    Trauma: ['Trauma'],
    Cardiac: ['Cardiology'],
    Neurological: ['Neurology'],
    Respiratory: ['General'],
    General: ['General'],
  };

  const requiredSpecs = conditionToSpecialization[patient.condition] || ['General'];
  const matches = hospital.specializations.filter((spec) =>
    requiredSpecs.includes(spec)
  );

  return matches.length > 0 ? 1.0 : 0.5; // Full match or partial match
}

// Calculate capacity score
function getCapacityScore(hospital: Hospital, patient: Patient): number {
  if (patient.requiresICU) {
    if (hospital.availableIcuBeds === 0) return 0;
    const icuUtilization = hospital.availableIcuBeds / hospital.icuBeds;
    return icuUtilization;
  }
  
  if (hospital.availableBeds === 0) return 0;
  const bedUtilization = hospital.availableBeds / hospital.totalBeds;
  return bedUtilization;
}

// Multi-criteria scoring function
export function calculateHospitalScore(
  hospital: Hospital,
  patient: Patient,
  distance: number,
  estimatedTime: number
): OptimizationResult['metrics'] {
  const severityWeights = {
    Critical: { distance: 0.5, capacity: 0.3, specialization: 0.15, availability: 0.05 },
    High: { distance: 0.4, capacity: 0.3, specialization: 0.2, availability: 0.1 },
    Moderate: { distance: 0.3, capacity: 0.25, specialization: 0.25, availability: 0.2 },
    Low: { distance: 0.25, capacity: 0.2, specialization: 0.3, availability: 0.25 },
  };

  const weights = severityWeights[patient.severity];

  // Distance score (inverse - closer is better, normalize to 0-1)
  const maxDistance = 20; // km
  const distanceScore = Math.max(0, 1 - distance / maxDistance);

  // Capacity score
  const capacityScore = getCapacityScore(hospital, patient);

  // Specialization match score
  const specializationScore = getSpecializationMatch(hospital, patient);

  // Availability score (based on wait time and doctors)
  const maxWaitTime = 30; // minutes
  const waitTimeScore = Math.max(0, 1 - hospital.avgWaitTime / maxWaitTime);
  const doctorScore = Math.min(hospital.doctorsOnDuty / 30, 1);
  const availabilityScore = (waitTimeScore * 0.6 + doctorScore * 0.4);

  // Calculate weighted overall score
  const overallScore =
    distanceScore * weights.distance +
    capacityScore * weights.capacity +
    specializationScore * weights.specialization +
    availabilityScore * weights.availability;

  return {
    distanceScore,
    capacityScore,
    specializationScore,
    availabilityScore,
    overallScore,
  };
}

// Generate simple route (straight line with waypoints)
export function generateRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number }
): { lat: number; lng: number }[] {
  const steps = 5;
  const route: { lat: number; lng: number }[] = [from];
  
  for (let i = 1; i <= steps; i++) {
    const ratio = i / (steps + 1);
    route.push({
      lat: from.lat + (to.lat - from.lat) * ratio,
      lng: from.lng + (to.lng - from.lng) * ratio,
    });
  }
  
  route.push(to);
  return route;
}

// Find nearest available ambulance
export function findNearestAmbulance(
  location: { lat: number; lng: number },
  ambulances: Ambulance[]
): Ambulance | undefined {
  const available = ambulances.filter((a) => a.available);
  if (available.length === 0) return undefined;

  let nearest = available[0];
  let minDistance = calculateDistance(
    location.lat,
    location.lng,
    nearest.location.lat,
    nearest.location.lng
  );

  for (const ambulance of available) {
    const distance = calculateDistance(
      location.lat,
      location.lng,
      ambulance.location.lat,
      ambulance.location.lng
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearest = ambulance;
    }
  }

  return nearest;
}

// ALGORITHM 1: Greedy/Scoring-based approach
export function greedyAlgorithm(
  patient: Patient,
  hospitals: Hospital[],
  ambulances: Ambulance[]
): OptimizationResult | null {
  let bestResult: OptimizationResult | null = null;
  let bestScore = -1;

  for (const hospital of hospitals) {
    // Filter out hospitals that can't handle the patient
    if (patient.requiresICU && hospital.availableIcuBeds === 0) continue;
    if (!patient.requiresICU && hospital.availableBeds === 0) continue;

    const distance = calculateDistance(
      patient.location.lat,
      patient.location.lng,
      hospital.location.lat,
      hospital.location.lng
    );

    const ambulance = findNearestAmbulance(patient.location, ambulances);
    const speed = ambulance?.speed || 60;
    const traffic = getTrafficCondition(distance);
    const estimatedTime = calculateTravelTime(distance, speed, traffic);

    const metrics = calculateHospitalScore(hospital, patient, distance, estimatedTime);

    if (metrics.overallScore > bestScore) {
      bestScore = metrics.overallScore;
      bestResult = {
        hospital,
        distance,
        estimatedTime,
        score: metrics.overallScore,
        ambulance,
        route: generateRoute(patient.location, hospital.location),
        metrics,
      };
    }
  }

  return bestResult;
}

// ALGORITHM 2: A* algorithm (distance + heuristic)
export function aStarAlgorithm(
  patient: Patient,
  hospitals: Hospital[],
  ambulances: Ambulance[]
): OptimizationResult | null {
  const validHospitals = hospitals.filter((h) => {
    if (patient.requiresICU) return h.availableIcuBeds > 0;
    return h.availableBeds > 0;
  });

  if (validHospitals.length === 0) return null;

  // A* uses actual cost (distance) + heuristic (suitability)
  let bestResult: OptimizationResult | null = null;
  let bestFScore = Infinity;

  for (const hospital of validHospitals) {
    const distance = calculateDistance(
      patient.location.lat,
      patient.location.lng,
      hospital.location.lat,
      hospital.location.lng
    );

    const ambulance = findNearestAmbulance(patient.location, ambulances);
    const speed = ambulance?.speed || 60;
    const traffic = getTrafficCondition(distance);
    const estimatedTime = calculateTravelTime(distance, speed, traffic);

    const metrics = calculateHospitalScore(hospital, patient, distance, estimatedTime);

    // A* f-score: g(n) = distance, h(n) = inverted suitability score
    const gScore = distance;
    const hScore = (1 - metrics.overallScore) * 10; // Weight the heuristic
    const fScore = gScore + hScore;

    if (fScore < bestFScore) {
      bestFScore = fScore;
      bestResult = {
        hospital,
        distance,
        estimatedTime,
        score: metrics.overallScore,
        ambulance,
        route: generateRoute(patient.location, hospital.location),
        metrics,
      };
    }
  }

  return bestResult;
}

// ALGORITHM 3: Genetic Algorithm
interface Chromosome {
  hospitalId: string;
  fitness: number;
}

export function geneticAlgorithm(
  patient: Patient,
  hospitals: Hospital[],
  ambulances: Ambulance[],
  generations: number = 50,
  populationSize: number = 20
): { result: OptimizationResult | null; iterations: number } {
  const validHospitals = hospitals.filter((h) => {
    if (patient.requiresICU) return h.availableIcuBeds > 0;
    return h.availableBeds > 0;
  });

  if (validHospitals.length === 0) return { result: null, iterations: 0 };

  // Initialize population
  let population: Chromosome[] = [];
  for (let i = 0; i < populationSize; i++) {
    const randomHospital =
      validHospitals[Math.floor(Math.random() * validHospitals.length)];
    const distance = calculateDistance(
      patient.location.lat,
      patient.location.lng,
      randomHospital.location.lat,
      randomHospital.location.lng
    );
    const ambulance = findNearestAmbulance(patient.location, ambulances);
    const speed = ambulance?.speed || 60;
    const traffic = getTrafficCondition(distance);
    const estimatedTime = calculateTravelTime(distance, speed, traffic);
    const metrics = calculateHospitalScore(
      randomHospital,
      patient,
      distance,
      estimatedTime
    );

    population.push({
      hospitalId: randomHospital.id,
      fitness: metrics.overallScore,
    });
  }

  // Evolution
  for (let gen = 0; gen < generations; gen++) {
    // Sort by fitness
    population.sort((a, b) => b.fitness - a.fitness);

    // Selection: keep top 50%
    const survivors = population.slice(0, Math.floor(populationSize / 2));

    // Crossover and mutation
    const newPopulation = [...survivors];
    while (newPopulation.length < populationSize) {
      // Select random hospital (mutation)
      const randomHospital =
        validHospitals[Math.floor(Math.random() * validHospitals.length)];
      const distance = calculateDistance(
        patient.location.lat,
        patient.location.lng,
        randomHospital.location.lat,
        randomHospital.location.lng
      );
      const ambulance = findNearestAmbulance(patient.location, ambulances);
      const speed = ambulance?.speed || 60;
      const traffic = getTrafficCondition(distance);
      const estimatedTime = calculateTravelTime(distance, speed, traffic);
      const metrics = calculateHospitalScore(
        randomHospital,
        patient,
        distance,
        estimatedTime
      );

      newPopulation.push({
        hospitalId: randomHospital.id,
        fitness: metrics.overallScore,
      });
    }

    population = newPopulation;
  }

  // Get best chromosome
  population.sort((a, b) => b.fitness - a.fitness);
  const bestChromosome = population[0];
  const bestHospital = hospitals.find((h) => h.id === bestChromosome.hospitalId)!;

  const distance = calculateDistance(
    patient.location.lat,
    patient.location.lng,
    bestHospital.location.lat,
    bestHospital.location.lng
  );
  const ambulance = findNearestAmbulance(patient.location, ambulances);
  const speed = ambulance?.speed || 60;
  const traffic = getTrafficCondition(distance);
  const estimatedTime = calculateTravelTime(distance, speed, traffic);
  const metrics = calculateHospitalScore(bestHospital, patient, distance, estimatedTime);

  return {
    result: {
      hospital: bestHospital,
      distance,
      estimatedTime,
      score: metrics.overallScore,
      ambulance,
      route: generateRoute(patient.location, bestHospital.location),
      metrics,
    },
    iterations: generations,
  };
}

// ALGORITHM 4: Particle Swarm Optimization
interface Particle {
  position: number; // Index of hospital
  velocity: number;
  bestPosition: number;
  bestFitness: number;
  fitness: number;
}

export function particleSwarmOptimization(
  patient: Patient,
  hospitals: Hospital[],
  ambulances: Ambulance[],
  iterations: number = 30,
  swarmSize: number = 15
): { result: OptimizationResult | null; iterations: number } {
  const validHospitals = hospitals.filter((h) => {
    if (patient.requiresICU) return h.availableIcuBeds > 0;
    return h.availableBeds > 0;
  });

  if (validHospitals.length === 0) return { result: null, iterations: 0 };

  // Evaluate fitness for a hospital index
  const evaluateFitness = (hospitalIndex: number): number => {
    const idx = Math.floor(hospitalIndex) % validHospitals.length;
    const hospital = validHospitals[idx];
    const distance = calculateDistance(
      patient.location.lat,
      patient.location.lng,
      hospital.location.lat,
      hospital.location.lng
    );
    const ambulance = findNearestAmbulance(patient.location, ambulances);
    const speed = ambulance?.speed || 60;
    const traffic = getTrafficCondition(distance);
    const estimatedTime = calculateTravelTime(distance, speed, traffic);
    const metrics = calculateHospitalScore(hospital, patient, distance, estimatedTime);
    return metrics.overallScore;
  };

  // Initialize swarm
  const swarm: Particle[] = [];
  let globalBestPosition = 0;
  let globalBestFitness = -1;

  for (let i = 0; i < swarmSize; i++) {
    const position = Math.random() * validHospitals.length;
    const fitness = evaluateFitness(position);

    swarm.push({
      position,
      velocity: (Math.random() - 0.5) * 2,
      bestPosition: position,
      bestFitness: fitness,
      fitness,
    });

    if (fitness > globalBestFitness) {
      globalBestFitness = fitness;
      globalBestPosition = position;
    }
  }

  // PSO parameters
  const w = 0.7; // Inertia
  const c1 = 1.5; // Cognitive component
  const c2 = 1.5; // Social component

  // Iterate
  for (let iter = 0; iter < iterations; iter++) {
    for (const particle of swarm) {
      // Update velocity
      const r1 = Math.random();
      const r2 = Math.random();
      particle.velocity =
        w * particle.velocity +
        c1 * r1 * (particle.bestPosition - particle.position) +
        c2 * r2 * (globalBestPosition - particle.position);

      // Update position
      particle.position += particle.velocity;
      particle.position = Math.max(
        0,
        Math.min(validHospitals.length - 0.01, particle.position)
      );

      // Evaluate fitness
      particle.fitness = evaluateFitness(particle.position);

      // Update personal best
      if (particle.fitness > particle.bestFitness) {
        particle.bestFitness = particle.fitness;
        particle.bestPosition = particle.position;
      }

      // Update global best
      if (particle.fitness > globalBestFitness) {
        globalBestFitness = particle.fitness;
        globalBestPosition = particle.position;
      }
    }
  }

  // Get best hospital
  const bestIndex = Math.floor(globalBestPosition) % validHospitals.length;
  const bestHospital = validHospitals[bestIndex];

  const distance = calculateDistance(
    patient.location.lat,
    patient.location.lng,
    bestHospital.location.lat,
    bestHospital.location.lng
  );
  const ambulance = findNearestAmbulance(patient.location, ambulances);
  const speed = ambulance?.speed || 60;
  const traffic = getTrafficCondition(distance);
  const estimatedTime = calculateTravelTime(distance, speed, traffic);
  const metrics = calculateHospitalScore(bestHospital, patient, distance, estimatedTime);

  return {
    result: {
      hospital: bestHospital,
      distance,
      estimatedTime,
      score: metrics.overallScore,
      ambulance,
      route: generateRoute(patient.location, bestHospital.location),
      metrics,
    },
    iterations,
  };
}
