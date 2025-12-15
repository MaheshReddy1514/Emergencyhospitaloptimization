import { AlgorithmResult } from '../types';
import { BarChart3, Clock, Zap } from 'lucide-react';

interface AlgorithmComparisonProps {
  results: AlgorithmResult[];
}

export function AlgorithmComparison({ results }: AlgorithmComparisonProps) {
  if (results.length === 0) return null;

  const maxScore = Math.max(...results.map((r) => r.result.score));
  const minTime = Math.min(...results.map((r) => r.result.estimatedTime));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-5 h-5 text-purple-600" />
        Algorithm Comparison
      </h3>

      <div className="space-y-4">
        {results.map((algorithmResult, idx) => {
          const isTopScore = algorithmResult.result.score === maxScore;
          const isFastest = algorithmResult.result.estimatedTime === minTime;

          return (
            <div
              key={idx}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="flex items-center gap-2">
                    {algorithmResult.name}
                    {isTopScore && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded">
                        Best Score
                      </span>
                    )}
                    {isFastest && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Fastest Route
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {algorithmResult.result.hospital.name}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Score</div>
                  <div className="text-lg text-purple-600">
                    {(algorithmResult.result.score * 100).toFixed(1)}%
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-gray-50 rounded p-2">
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Clock className="w-3 h-3" />
                    Distance
                  </div>
                  <div>{algorithmResult.result.distance.toFixed(2)} km</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Clock className="w-3 h-3" />
                    ETA
                  </div>
                  <div>{Math.ceil(algorithmResult.result.estimatedTime)} min</div>
                </div>
                <div className="bg-gray-50 rounded p-2">
                  <div className="flex items-center gap-1 text-gray-600 mb-1">
                    <Zap className="w-3 h-3" />
                    Exec Time
                  </div>
                  <div>{algorithmResult.executionTime.toFixed(2)} ms</div>
                </div>
              </div>

              {algorithmResult.iterationsOrSteps !== undefined && (
                <div className="mt-2 text-xs text-gray-500">
                  Iterations: {algorithmResult.iterationsOrSteps}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="mb-3">Algorithm Performance Summary</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-gray-600 mb-1">Best Overall Score</div>
            <div className="text-green-600">
              {results.find((r) => r.result.score === maxScore)?.name}
            </div>
            <div className="text-lg">{(maxScore * 100).toFixed(1)}%</div>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-gray-600 mb-1">Fastest Route</div>
            <div className="text-blue-600">
              {results.find((r) => r.result.estimatedTime === minTime)?.name}
            </div>
            <div className="text-lg">{Math.ceil(minTime)} min</div>
          </div>
        </div>
      </div>
    </div>
  );
}
