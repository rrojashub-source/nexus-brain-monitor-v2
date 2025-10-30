'use client';

import { formatDistanceToNow } from 'date-fns';
import { LAB_COLORS, LAB_INFO } from '@/lib/types';

interface LABStatusGridProps {
  labs?: Array<{
    id: string;
    name: string;
    status: 'active' | 'inactive';
    last_processed?: string;
    total_invocations?: number;
  }>;
  activeLabIds?: string[];
}

const DEFAULT_LABS = Object.keys(LAB_INFO);

export default function LABStatusGrid({ labs, activeLabIds = [] }: LABStatusGridProps) {
  const labsToDisplay = labs || DEFAULT_LABS.map(id => ({
    id,
    name: LAB_INFO[id].name,
    status: 'active' as const,
  }));

  return (
    <div className="bg-nexus-darker border border-nexus-gray/20 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-nexus-white mb-4">
        LAB Status Grid
      </h3>

      <div className="grid grid-cols-3 gap-4">
        {labsToDisplay.map((lab) => {
          const isActive = activeLabIds.includes(lab.id);
          const color = LAB_COLORS[lab.id] || '#8B92A8';
          const info = LAB_INFO[lab.id];

          return (
            <div
              key={lab.id}
              className={`bg-nexus-dark border rounded-lg p-4 transition-all ${
                isActive
                  ? 'border-2 shadow-lg'
                  : 'border-nexus-gray/20'
              }`}
              style={{
                borderColor: isActive ? color : undefined,
                boxShadow: isActive ? `0 0 20px ${color}40` : undefined,
              }}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className={`text-xs px-2 py-0.5 rounded ${
                  lab.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {lab.status}
                </span>
              </div>

              <div className="font-mono text-xs text-nexus-gray mb-1">
                {lab.id}
              </div>

              <div className="text-sm font-semibold text-nexus-white mb-1">
                {lab.name || info?.name}
              </div>

              {info && (
                <div className="text-xs text-nexus-gray mb-2">
                  {info.region}
                </div>
              )}

              <div className="text-xs text-nexus-gray space-y-1">
                {'last_processed' in lab && lab.last_processed && (
                  <div>
                    Last: {formatDistanceToNow(new Date(lab.last_processed), { addSuffix: true })}
                  </div>
                )}
                {'total_invocations' in lab && lab.total_invocations !== undefined && (
                  <div>Invocations: {lab.total_invocations}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
