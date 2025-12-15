import { OptimizationResult } from '../types';
import { TrendingUp, Clock, MapPin, Target } from 'lucide-react';

interface MetricsDisplayProps {
  result: OptimizationResult;
}

export function MetricsDisplay({ result }: MetricsDisplayProps) {
  const { hospital, distance, estimatedTime, metrics } = result;

  const metricItems = [
    {
      label: 'Distance Score',
      value: metrics.distanceScore,
      icon: MapPin,
      color: 'blue',
    },
    {
      label: 'Capacity Score',
      value: metrics.capacityScore,
      icon: TrendingUp,
      color: 'green',
    },
    {
      label: 'Specialization Match',
      value: metrics.specializationScore,
      icon: Target,
      color: 'purple',
    },
    {
      label: 'Availability Score',
      value: metrics.availabilityScore,
      icon: Clock,
      color: 'orange',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="mb-6">Performance Metrics</h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {metricItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 text-${item.color}-600`} />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`bg-${item.color}-500 h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${item.value * 100}%` }}
                ></div>
              </div>
              <div className="text-right text-sm mt-1">
                {(item.value * 100).toFixed(1)}%
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl text-blue-600 mb-1">
              {distance.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600">Distance (km)</div>
          </div>
          <div>
            <div className="text-2xl text-green-600 mb-1">
              {Math.ceil(estimatedTime)}
            </div>
            <div className="text-sm text-gray-600">ETA (min)</div>
          </div>
          <div>
            <div className="text-2xl text-purple-600 mb-1">
              {(metrics.overallScore * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">Overall Score</div>
          </div>
        </div>
      </div>

      {result.ambulance && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Assigned Ambulance</div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex justify-between">
              <span>ID: {result.ambulance.id.toUpperCase()}</span>
              <span>Speed: {result.ambulance.speed} km/h</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
