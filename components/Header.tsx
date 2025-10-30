'use client';

import { useHealth } from '@/hooks/useHealth';
import { formatDistanceToNow } from 'date-fns';

export default function Header() {
  const { health, isConnected, isLoading } = useHealth();

  return (
    <header className="bg-nexus-darker border-b border-nexus-gray/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-nexus-white">
            🧠 NEXUS Brain Monitor
          </h1>
          <span className="text-sm text-nexus-gray">v2.0</span>
        </div>

        <div className="flex items-center gap-6">
          {health && (
            <>
              <div className="flex items-center gap-2">
                <span className="text-sm text-nexus-gray">Agent:</span>
                <span className="font-mono text-nexus-primary font-semibold">
                  {health.agent_id?.toUpperCase()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-nexus-gray">Version:</span>
                <span className="font-mono text-nexus-white">
                  {health.version}
                </span>
              </div>
            </>
          )}

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isLoading ? 'bg-yellow-500 animate-pulse' :
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-nexus-gray">
              {isLoading ? 'Connecting...' :
               isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {health?.timestamp && (
            <div className="text-xs text-nexus-gray font-mono">
              Updated {formatDistanceToNow(new Date(health.timestamp), { addSuffix: true })}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
