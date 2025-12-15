import { useState } from 'react';
import { Patient, AlgorithmResult, OptimizationResult } from './types';
import { hospitals, ambulances } from './data/hospitalData';
import { PatientInputForm } from './components/PatientInputForm';
import { AlgorithmSelector, AlgorithmType } from './components/AlgorithmSelector';
import { HospitalList } from './components/HospitalList';
import { MetricsDisplay } from './components/MetricsDisplay';
import { RouteVisualization } from './components/RouteVisualization';
import { AlgorithmComparison } from './components/AlgorithmComparison';
import {
  greedyAlgorithm,
  aStarAlgorithm,
  geneticAlgorithm,
  particleSwarmOptimization,
} from './utils/optimizationAlgorithms';
import { Activity, Info } from 'lucide-react';

export default function App() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<AlgorithmType>('all');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [algorithmResults, setAlgorithmResults] = useState<AlgorithmResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePatientSubmit = async (patientData: Patient) => {
    setIsProcessing(true);
    setPatient(patientData);
    
    // Simulate processing delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (selectedAlgorithm === 'all') {
      // Run all algorithms and compare
      const results: AlgorithmResult[] = [];

      // Greedy
      const greedyStart = performance.now();
      const greedyResult = greedyAlgorithm(patientData, hospitals, ambulances);
      const greedyTime = performance.now() - greedyStart;
      if (greedyResult) {
        results.push({
          name: 'Greedy/Scoring',
          result: greedyResult,
          executionTime: greedyTime,
        });
      }

      // A*
      const astarStart = performance.now();
      const astarResult = aStarAlgorithm(patientData, hospitals, ambulances);
      const astarTime = performance.now() - astarStart;
      if (astarResult) {
        results.push({
          name: 'A* Algorithm',
          result: astarResult,
          executionTime: astarTime,
        });
      }

      // Genetic Algorithm
      const gaStart = performance.now();
      const gaOutput = geneticAlgorithm(patientData, hospitals, ambulances, 50, 20);
      const gaTime = performance.now() - gaStart;
      if (gaOutput.result) {
        results.push({
          name: 'Genetic Algorithm',
          result: gaOutput.result,
          executionTime: gaTime,
          iterationsOrSteps: gaOutput.iterations,
        });
      }

      // PSO
      const psoStart = performance.now();
      const psoOutput = particleSwarmOptimization(patientData, hospitals, ambulances, 30, 15);
      const psoTime = performance.now() - psoStart;
      if (psoOutput.result) {
        results.push({
          name: 'Particle Swarm',
          result: psoOutput.result,
          executionTime: psoTime,
          iterationsOrSteps: psoOutput.iterations,
        });
      }

      setAlgorithmResults(results);
      // Set the best result as the main result
      const bestResult = results.reduce((best, current) =>
        current.result.score > best.result.score ? current : best
      );
      setResult(bestResult.result);
    } else {
      // Run single algorithm
      let singleResult: OptimizationResult | null = null;
      const start = performance.now();

      switch (selectedAlgorithm) {
        case 'greedy':
          singleResult = greedyAlgorithm(patientData, hospitals, ambulances);
          break;
        case 'astar':
          singleResult = aStarAlgorithm(patientData, hospitals, ambulances);
          break;
        case 'genetic':
          singleResult = geneticAlgorithm(patientData, hospitals, ambulances).result;
          break;
        case 'pso':
          singleResult = particleSwarmOptimization(patientData, hospitals, ambulances).result;
          break;
      }

      const executionTime = performance.now() - start;

      if (singleResult) {
        setResult(singleResult);
        setAlgorithmResults([
          {
            name: selectedAlgorithm.toUpperCase(),
            result: singleResult,
            executionTime,
          },
        ]);
      }
    }

    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-red-600" />
            Emergency Hospital Routing Optimization System
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Multi-objective optimization for emergency medical services using advanced algorithms
            to minimize response time and maximize treatment suitability
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-900">
              <p className="mb-2">
                This system considers multiple factors including:
              </p>
              <ul className="list-disc list-inside space-y-1 text-blue-800">
                <li>Distance from patient location with real-time traffic simulation</li>
                <li>Hospital capacity (ICU beds, general beds availability)</li>
                <li>Patient severity and specialized care requirements</li>
                <li>Ambulance availability and routing efficiency</li>
                <li>Hospital ratings, doctor availability, and average wait times</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Input and Algorithm Selection */}
          <div className="space-y-6">
            <PatientInputForm onSubmit={handlePatientSubmit} isProcessing={isProcessing} />
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onSelect={setSelectedAlgorithm}
            />
          </div>

          {/* Middle Column - Results */}
          <div className="space-y-6">
            {result ? (
              <>
                <MetricsDisplay result={result} />
                <RouteVisualization result={result} patientLocation={patient!.location} />
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-gray-400 mb-2">No Results Yet</h3>
                <p className="text-gray-500 text-sm">
                  Enter patient details and click "Find Optimal Hospital" to see results
                </p>
              </div>
            )}
          </div>

          {/* Right Column - Hospital List */}
          <div>
            <HospitalList
              hospitals={hospitals}
              patient={patient || undefined}
              recommendedHospitalId={result?.hospital.id}
            />
          </div>
        </div>

        {/* Algorithm Comparison */}
        {algorithmResults.length > 1 && (
          <div className="max-w-7xl mx-auto">
            <AlgorithmComparison results={algorithmResults} />
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p className="mb-2">
            Research Implementation: Multi-Objective Optimization for Emergency Medical Services
          </p>
          <p>
            Algorithms: Greedy Scoring, A* Pathfinding, Genetic Algorithm, Particle Swarm Optimization
          </p>
        </div>
      </div>
    </div>
  );
}
