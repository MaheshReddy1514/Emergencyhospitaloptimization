import { OptimizationResult } from '../types';
import { Navigation, MapPin } from 'lucide-react';

interface RouteVisualizationProps {
  result: OptimizationResult;
  patientLocation: { lat: number; lng: number };
}

export function RouteVisualization({ result, patientLocation }: RouteVisualizationProps) {
  const { hospital, route } = result;

  // Create a simple 2D visualization
  const mapWidth = 400;
  const mapHeight = 300;

  // Find bounds
  const allPoints = route || [patientLocation, hospital.location];
  const lats = allPoints.map((p) => p.lat);
  const lngs = allPoints.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  // Add padding
  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;
  const paddedMinLat = minLat - latRange * 0.1;
  const paddedMaxLat = maxLat + latRange * 0.1;
  const paddedMinLng = minLng - lngRange * 0.1;
  const paddedMaxLng = maxLng + lngRange * 0.1;

  // Convert lat/lng to x/y
  const toXY = (lat: number, lng: number) => {
    const x =
      ((lng - paddedMinLng) / (paddedMaxLng - paddedMinLng)) * (mapWidth - 40) + 20;
    const y =
      mapHeight - ((lat - paddedMinLat) / (paddedMaxLat - paddedMinLat)) * (mapHeight - 40) - 20;
    return { x, y };
  };

  const patientXY = toXY(patientLocation.lat, patientLocation.lng);
  const hospitalXY = toXY(hospital.location.lat, hospital.location.lng);

  const routePoints = route?.map((p) => toXY(p.lat, p.lng)) || [patientXY, hospitalXY];
  const pathD = `M ${routePoints.map((p) => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="flex items-center gap-2 mb-4">
        <Navigation className="w-5 h-5 text-blue-600" />
        Route Visualization
      </h3>

      <svg
        width={mapWidth}
        height={mapHeight}
        className="border border-gray-200 rounded-lg bg-gray-50"
      >
        {/* Grid lines */}
        <defs>
          <pattern
            id="grid"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

        {/* Route path */}
        <path
          d={pathD}
          stroke="#3b82f6"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
        />

        {/* Route points */}
        {routePoints.slice(1, -1).map((point, idx) => (
          <circle
            key={idx}
            cx={point.x}
            cy={point.y}
            r="3"
            fill="#93c5fd"
          />
        ))}

        {/* Patient location */}
        <circle cx={patientXY.x} cy={patientXY.y} r="8" fill="#ef4444" />
        <circle cx={patientXY.x} cy={patientXY.y} r="12" fill="#ef4444" opacity="0.3" />

        {/* Hospital location */}
        <rect
          x={hospitalXY.x - 8}
          y={hospitalXY.y - 8}
          width="16"
          height="16"
          fill="#22c55e"
          rx="2"
        />
        <rect
          x={hospitalXY.x - 12}
          y={hospitalXY.y - 12}
          width="24"
          height="24"
          fill="#22c55e"
          opacity="0.2"
          rx="3"
        />
      </svg>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Patient Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-700">Hospital</span>
        </div>
      </div>

      <div className="mt-4 bg-blue-50 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
          <div>
            <div className="text-sm text-gray-700 mb-1">Destination</div>
            <div>{hospital.name}</div>
            <div className="text-sm text-gray-600">
              {hospital.location.lat.toFixed(4)}, {hospital.location.lng.toFixed(4)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
