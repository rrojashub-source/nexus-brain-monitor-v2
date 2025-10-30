'use client';

import { useHealth } from '@/hooks/useHealth';
import { formatDistanceToNow } from 'date-fns';

export default function Header() {
  const { health, isConnected, isLoading } = useHealth();

  return (
    <header className="bg-gradient-to-r from-nexus-darker via-nexus-dark to-nexus-darker border-b border-nexus-gray/20 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="text-4xl animate-pulse">🧠</div>
            {isConnected && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
            )}
          </div>
          
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-nexus-primary via-purple-400 to-nexus-primary bg-clip-text text-transparent animate-gradient">
              NEXUS Brain Monitor
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-nexus-gray px-2 py-0.5 bg-nexus-dark rounded-full border border-nexus-gray/30">
                v2.0 Enhanced
              </span>
              <span className="text-xs text-nexus-gray">•</span>
              <span className="text-xs font-mono text-nexus-gray/70">
                Cognitive Processing System
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {health && (
            <>
              <div className="flex items-center gap-2 bg-nexus-dark/50 px-4 py-2 rounded-lg border border-nexus-gray/20">
                <span className="text-sm text-nexus-gray">Agente:</span>
                <span className="font-mono text-nexus-primary font-bold uppercase tracking-wider">
                  {health.agent_id}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-nexus-dark/50 px-4 py-2 rounded-lg border border-nexus-gray/20">
                <span className="text-sm text-nexus-gray">Versión:</span>
                <span className="font-mono text-nexus-white font-semibold">
                  {health.version}
                </span>
              </div>
            </>
          )}

          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-all ${
            isLoading ? 'bg-yellow-500/10 border-yellow-500/30' :
            isConnected ? 'bg-green-500/10 border-green-500/30' :
            'bg-red-500/10 border-red-500/30'
          }`}>
            <div className="relative">
              <div className={`w-3 h-3 rounded-full ${
                isLoading ? 'bg-yellow-500 animate-pulse' :
                isConnected ? 'bg-green-500' :
                'bg-red-500'
              }`} />
              {isConnected && (
                <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
              )}
            </div>
            
            <div>
              <div className={`text-sm font-semibold ${
                isLoading ? 'text-yellow-400' :
                isConnected ? 'text-green-400' :
                'text-red-400'
              }`}>
                {isLoading ? 'Conectando...' :
                 isConnected ? 'Sistema Activo' :
                 'Desconectado'}
              </div>
              {health?.timestamp && isConnected && (
                <div className="text-xs text-nexus-gray font-mono">
                  Actualizado {formatDistanceToNow(new Date(health.timestamp), { addSuffix: true })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% {
            background-size: 200% 200%;
            background-position: left center;
          }
          50% {
            background-size: 200% 200%;
            background-position: right center;
          }
        }
        .animate-gradient {
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </header>
  );
}
