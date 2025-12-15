import { Hospital } from '../types';
import { Building2, Bed, Activity, Users, Clock, Star } from 'lucide-react';

interface HospitalCardProps {
  hospital: Hospital;
  distance?: number;
  estimatedTime?: number;
  isRecommended?: boolean;
  score?: number;
}

export function HospitalCard({
  hospital,
  distance,
  estimatedTime,
  isRecommended,
  score,
}: HospitalCardProps) {
  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-2 ${
        isRecommended ? 'border-green-500' : 'border-transparent'
      } relative`}
    >
      {isRecommended && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full">
          Recommended
        </div>
      )}

      <div className="mb-4">
        <h3 className="flex items-center gap-2 mb-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          {hospital.name}
        </h3>
        <div className="flex items-center gap-1 text-yellow-500">
          <Star className="w-4 h-4 fill-current" />
          <span className="text-gray-700">{hospital.rating.toFixed(1)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center gap-2 text-gray-700">
          <Bed className="w-4 h-4" />
          <div>
            <div className="text-sm">Available Beds</div>
            <div>{hospital.availableBeds}/{hospital.totalBeds}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Activity className="w-4 h-4" />
          <div>
            <div className="text-sm">ICU Beds</div>
            <div>{hospital.availableIcuBeds}/{hospital.icuBeds}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Users className="w-4 h-4" />
          <div>
            <div className="text-sm">Doctors</div>
            <div>{hospital.doctorsOnDuty}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Clock className="w-4 h-4" />
          <div>
            <div className="text-sm">Wait Time</div>
            <div>{hospital.avgWaitTime} min</div>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="text-sm text-gray-600 mb-1">Specializations:</div>
        <div className="flex flex-wrap gap-1">
          {hospital.specializations.map((spec) => (
            <span
              key={spec}
              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {distance !== undefined && (
        <div className="pt-3 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-sm text-gray-600">Distance</div>
              <div className="text-blue-600">{distance.toFixed(2)} km</div>
            </div>
            {estimatedTime !== undefined && (
              <div>
                <div className="text-sm text-gray-600">ETA</div>
                <div className="text-blue-600">{Math.ceil(estimatedTime)} min</div>
              </div>
            )}
          </div>
          {score !== undefined && (
            <div className="mt-2">
              <div className="text-sm text-gray-600">Suitability Score</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${score * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm mt-1">{(score * 100).toFixed(1)}%</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
