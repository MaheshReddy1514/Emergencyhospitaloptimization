import { Brain, GitBranch, Sparkles, Target } from 'lucide-react';

export type AlgorithmType = 'greedy' | 'astar' | 'genetic' | 'pso' | 'all';

interface AlgorithmSelectorProps {
  selectedAlgorithm: AlgorithmType;
  onSelect: (algorithm: AlgorithmType) => void;
}

const algorithms = [
  {
    id: 'greedy' as AlgorithmType,
    name: 'Greedy/Scoring',
    description: 'Fast weighted multi-criteria scoring',
    icon: Target,
    color: 'blue',
  },
  {
    id: 'astar' as AlgorithmType,
    name: 'A* Algorithm',
    description: 'Pathfinding with heuristic optimization',
    icon: GitBranch,
    color: 'green',
  },
  {
    id: 'genetic' as AlgorithmType,
    name: 'Genetic Algorithm',
    description: 'Evolutionary optimization approach',
    icon: Brain,
    color: 'purple',
  },
  {
    id: 'pso' as AlgorithmType,
    name: 'Particle Swarm',
    description: 'Swarm intelligence optimization',
    icon: Sparkles,
    color: 'orange',
  },
];

export function AlgorithmSelector({ selectedAlgorithm, onSelect }: AlgorithmSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="mb-4">Select Optimization Algorithm</h3>

      <div className="space-y-3">
        <button
          onClick={() => onSelect('all')}
          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
            selectedAlgorithm === 'all'
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div>Compare All Algorithms</div>
              <div className="text-sm text-gray-600">
                Run all algorithms and compare results
              </div>
            </div>
          </div>
        </button>

        {algorithms.map((algo) => {
          const Icon = algo.icon;
          return (
            <button
              key={algo.id}
              onClick={() => onSelect(algo.id)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedAlgorithm === algo.id
                  ? `border-${algo.color}-500 bg-${algo.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`bg-${algo.color}-100 p-2 rounded-lg`}>
                  <Icon className={`w-5 h-5 text-${algo.color}-600`} />
                </div>
                <div>
                  <div>{algo.name}</div>
                  <div className="text-sm text-gray-600">{algo.description}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
