import { Hospital, Patient } from '../types';
import { HospitalCard } from './HospitalCard';
import { calculateDistance, calculateHospitalScore, getTrafficCondition, calculateTravelTime } from '../utils/optimizationAlgorithms';

interface HospitalListProps {
  hospitals: Hospital[];
  patient?: Patient;
  recommendedHospitalId?: string;
}

export function HospitalList({ hospitals, patient, recommendedHospitalId }: HospitalListProps) {
  const hospitalsWithScores = patient
    ? hospitals.map((hospital) => {
        const distance = calculateDistance(
          patient.location.lat,
          patient.location.lng,
          hospital.location.lat,
          hospital.location.lng
        );
        const traffic = getTrafficCondition(distance);
        const estimatedTime = calculateTravelTime(distance, 60, traffic);
        const metrics = calculateHospitalScore(hospital, patient, distance, estimatedTime);
        
        return {
          hospital,
          distance,
          estimatedTime,
          score: metrics.overallScore,
        };
      }).sort((a, b) => b.score - a.score)
    : hospitals.map((hospital) => ({ hospital, distance: undefined, estimatedTime: undefined, score: undefined }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="mb-4">
        {patient ? 'Ranked Hospitals' : 'Available Hospitals'}
      </h3>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {hospitalsWithScores.map(({ hospital, distance, estimatedTime, score }) => (
          <HospitalCard
            key={hospital.id}
            hospital={hospital}
            distance={distance}
            estimatedTime={estimatedTime}
            score={score}
            isRecommended={hospital.id === recommendedHospitalId}
          />
        ))}
      </div>
    </div>
  );
}
