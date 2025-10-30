'use client';

import { formatDistanceToNow } from 'date-fns';
import type { WorkingMemoryItem } from '@/lib/types';

interface WorkingMemoryPanelProps {
  memories: WorkingMemoryItem[];
}

export default function WorkingMemoryPanel({ memories }: WorkingMemoryPanelProps) {
  return (
    <div className="bg-nexus-darker border border-nexus-gray/20 rounded-lg p-6 h-full">
      <h3 className="text-lg font-semibold text-nexus-white mb-4">
        Working Memory <span className="text-nexus-gray text-sm">(7±2 items)</span>
      </h3>

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
        {memories.length === 0 ? (
          <div className="text-center py-12 text-nexus-gray">
            <p>No memories loaded yet</p>
            <p className="text-sm mt-2">Process a query to see results</p>
          </div>
        ) : (
          memories.map((memory, idx) => (
            <div
              key={memory.episode_id}
              className="bg-nexus-dark border border-nexus-gray/20 rounded p-4 hover:border-nexus-primary/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="font-mono text-xs text-nexus-gray">
                  {memory.episode_id.slice(0, 8)}...
                </span>
                <span className="text-xs text-nexus-gray">
                  {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}
                </span>
              </div>

              <p className="text-sm text-nexus-white mb-3 line-clamp-3">
                {memory.content}
              </p>

              <div className="space-y-2">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-nexus-gray">Attention</span>
                    <span className="text-nexus-white font-mono">
                      {(memory.attention * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-nexus-gray/20 rounded-full h-1.5">
                    <div
                      className="bg-nexus-primary h-1.5 rounded-full"
                      style={{ width: `${memory.attention * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-nexus-gray">Salience</span>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                    memory.salience > 0.8 ? 'bg-green-500/20 text-green-400' :
                    memory.salience > 0.5 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {memory.salience.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
