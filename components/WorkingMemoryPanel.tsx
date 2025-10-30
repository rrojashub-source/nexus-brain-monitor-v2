'use client';

import { formatDistanceToNow } from 'date-fns';
import type { WorkingMemoryItem } from '@/lib/types';

interface WorkingMemoryPanelProps {
  memories: WorkingMemoryItem[];
}

export default function WorkingMemoryPanel({ memories }: WorkingMemoryPanelProps) {
  return (
    <div className="bg-nexus-darker border border-nexus-gray/20 rounded-lg p-6 h-full">
      <h3 className="text-lg font-semibold text-nexus-white mb-4 flex items-center gap-2">
        <span className="text-2xl">💭</span>
        Working Memory
        <span className="ml-auto text-sm text-nexus-gray font-normal">
          (7±2 items)
        </span>
      </h3>

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto custom-scrollbar">
        {memories.length === 0 ? (
          <div className="text-center py-12 text-nexus-gray">
            <div className="text-6xl mb-4 opacity-30">🧠</div>
            <p className="text-lg mb-2">No hay memorias cargadas</p>
            <p className="text-sm">Procesa una query para ver resultados</p>
          </div>
        ) : (
          memories.map((memory, idx) => (
            <div
              key={memory.episode_id}
              className="bg-gradient-to-br from-nexus-dark to-nexus-dark/50 border border-nexus-gray/20 rounded-lg p-4 hover:border-nexus-primary/50 transition-all hover:shadow-lg hover:shadow-nexus-primary/10 relative overflow-hidden group"
              style={{
                animation: `slideUp 0.3s ease-out ${idx * 0.1}s backwards`,
              }}
            >
              {/* Indicador de orden */}
              <div className="absolute top-2 right-2 w-8 h-8 bg-nexus-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-nexus-primary">{idx + 1}</span>
              </div>

              {/* Header */}
              <div className="flex items-start justify-between mb-3 pr-10">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-nexus-gray bg-nexus-darker px-2 py-0.5 rounded">
                      {memory.episode_id.slice(0, 8)}...
                    </span>
                    <span className="text-xs text-nexus-gray">
                      {formatDistanceToNow(new Date(memory.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contenido */}
              <p className="text-sm text-nexus-white mb-4 line-clamp-3 leading-relaxed">
                {memory.content}
              </p>

              {/* Métricas con barras visuales */}
              <div className="space-y-3">
                {/* Barra de Atención */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-nexus-gray flex items-center gap-1">
                      <span>🎯</span>
                      Atención
                    </span>
                    <span className="text-nexus-white font-mono font-semibold">
                      {(memory.attention * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-nexus-darker rounded-full h-2 overflow-hidden relative">
                    <div
                      className="h-2 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                      style={{
                        width: `${memory.attention * 100}%`,
                        background: `linear-gradient(90deg, #00d9ff, #3b82f6)`,
                        boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)',
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                    </div>
                  </div>
                </div>

                {/* Badge de Salience */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-nexus-gray flex items-center gap-1">
                    <span>⭐</span>
                    Salience
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-nexus-darker rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full"
                        style={{
                          width: `${memory.salience * 100}%`,
                          backgroundColor:
                            memory.salience > 0.8 ? '#4ade80' :
                            memory.salience > 0.5 ? '#facc15' :
                            '#f87171',
                        }}
                      />
                    </div>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full font-semibold ${
                      memory.salience > 0.8 ? 'bg-green-500/20 text-green-400' :
                      memory.salience > 0.5 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {memory.salience.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Efecto hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-nexus-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--color-nexus-darker);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--color-nexus-primary);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00b8d4;
        }
      `}</style>
    </div>
  );
}
