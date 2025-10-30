'use client';

import { LAB_COLORS, LAB_INFO } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';

interface OrbitalHUDProps {
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

export default function OrbitalHUD({ labs, activeLabIds = [] }: OrbitalHUDProps) {
  const labsToDisplay = labs || DEFAULT_LABS.map(id => ({
    id,
    name: LAB_INFO[id].name,
    status: 'active' as const,
  }));

  return (
    <div className="relative w-full h-full">
      {/* Grid de LABs mejorado con efectos */}
      <div className="grid grid-cols-3 gap-4">
        {labsToDisplay.map((lab, index) => {
          const isActive = activeLabIds.includes(lab.id);
          const color = LAB_COLORS[lab.id] || '#8B92A8';
          const info = LAB_INFO[lab.id];

          return (
            <div
              key={lab.id}
              className={`relative bg-gradient-to-br from-nexus-darker to-nexus-dark border rounded-lg p-4 transition-all duration-300 hover:scale-105 ${
                isActive
                  ? 'border-2 shadow-2xl'
                  : 'border-nexus-gray/20'
              }`}
              style={{
                borderColor: isActive ? color : undefined,
                boxShadow: isActive ? `0 0 30px ${color}60, inset 0 0 20px ${color}20` : undefined,
                animation: isActive ? `pulse-glow 2s ease-in-out infinite` : undefined,
              }}
            >
              {/* Indicador de estado animado */}
              <div className="absolute -top-2 -right-2">
                <div
                  className={`w-4 h-4 rounded-full ${
                    isActive ? 'animate-ping' : ''
                  }`}
                  style={{ backgroundColor: color, opacity: 0.5 }}
                />
                <div
                  className="absolute top-0 right-0 w-4 h-4 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>

              {/* Header con icono */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                  style={{
                    backgroundColor: `${color}20`,
                    color: color,
                    boxShadow: isActive ? `0 0 20px ${color}40` : 'none',
                  }}
                >
                  {index + 1}
                </div>
                
                <span className={`text-xs px-2 py-1 rounded-full ${
                  lab.status === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {lab.status}
                </span>
              </div>

              {/* ID y nombre */}
              <div className="font-mono text-xs text-nexus-gray mb-1">
                {lab.id}
              </div>

              <div className="text-sm font-semibold text-nexus-white mb-1 line-clamp-2">
                {lab.name || info?.name}
              </div>

              {info && (
                <div className="text-xs text-nexus-gray/70 mb-3 italic">
                  {info.region}
                </div>
              )}

              {/* Barra de actividad */}
              <div className="mb-2">
                <div className="w-full bg-nexus-dark rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isActive ? 'animate-pulse' : ''
                    }`}
                    style={{
                      width: isActive ? '100%' : '30%',
                      backgroundColor: color,
                      boxShadow: isActive ? `0 0 10px ${color}` : 'none',
                    }}
                  />
                </div>
              </div>

              {/* Estadísticas */}
              <div className="text-xs space-y-1">
                {'last_processed' in lab && lab.last_processed && (
                  <div className="text-nexus-gray/70">
                    ⏱ {formatDistanceToNow(new Date(lab.last_processed), { addSuffix: true })}
                  </div>
                )}
                {'total_invocations' in lab && lab.total_invocations !== undefined && (
                  <div className="text-nexus-primary font-mono">
                    🔄 {lab.total_invocations} invocaciones
                  </div>
                )}
              </div>

              {/* Efecto de brillo en hover */}
              {isActive && (
                <div
                  className="absolute inset-0 rounded-lg opacity-0 hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at center, ${color}10, transparent)`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* CSS para animación personalizada */}
      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
    </div>
  );
}
