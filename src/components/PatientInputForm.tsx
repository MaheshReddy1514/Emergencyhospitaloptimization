import { useState } from 'react';
import { Patient, PatientSeverity, PatientCondition } from '../types';
import { MapPin, Activity, Heart } from 'lucide-react';

interface PatientInputFormProps {
  onSubmit: (patient: Patient) => void;
  isProcessing?: boolean;
}

export function PatientInputForm({ onSubmit, isProcessing }: PatientInputFormProps) {
  const [latitude, setLatitude] = useState('40.7589');
  const [longitude, setLongitude] = useState('-73.9751');
  const [severity, setSeverity] = useState<PatientSeverity>('High');
  const [condition, setCondition] = useState<PatientCondition>('General');
  const [requiresICU, setRequiresICU] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      location: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      },
      severity,
      condition,
      requiresICU,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="flex items-center gap-2 mb-6">
        <Activity className="w-6 h-6 text-red-600" />
        Patient Emergency Details
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Latitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Longitude
            </label>
            <input
              type="number"
              step="0.0001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">Patient Severity</label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as PatientSeverity)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Moderate">Moderate</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">
            <Heart className="w-4 h-4 inline mr-1" />
            Patient Condition
          </label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value as PatientCondition)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="General">General</option>
            <option value="Trauma">Trauma</option>
            <option value="Cardiac">Cardiac</option>
            <option value="Neurological">Neurological</option>
            <option value="Respiratory">Respiratory</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="requiresICU"
            checked={requiresICU}
            onChange={(e) => setRequiresICU(e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="requiresICU" className="text-gray-700">
            Requires ICU
          </label>
        </div>

        <button
          type="submit"
          disabled={isProcessing}
          className={`w-full py-3 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isProcessing ? 'Finding Optimal Hospital...' : 'Find Optimal Hospital'}
        </button>
      </form>
    </div>
  );
}
