'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetricsProps {
  processingTime?: number;
  activeLabs?: number;
  totalLabs?: number;
  confidence?: number;
  totalEpisodes?: number;
}

export default function PerformanceMetrics({
  processingTime,
  activeLabs = 0,
  totalLabs = 9,
  confidence,
  totalEpisodes = 0,
}: PerformanceMetricsProps) {
  const [animatedTime, setAnimatedTime] = useState(0);
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    if (processingTime) {
      const timer = setTimeout(() => setAnimatedTime(processingTime), 100);
      return () => clearTimeout(timer);
    }
  }, [processingTime]);

  useEffect(() => {
    if (confidence) {
      const timer = setTimeout(() => setAnimatedConfidence(confidence), 100);
      return () => clearTimeout(timer);
    }
  }, [confidence]);

  const getProcessingTimeColor = (time?: number) => {
    if (!time) return 'text-nexus-gray';
    if (time < 50) return 'text-green-400';
    if (time < 100) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProcessingTimeGradient = (time?: number) => {
    if (!time) return 'from-nexus-gray/20 to-nexus-gray/5';
    if (time < 50) return 'from-green-500/20 to-green-500/5';
    if (time < 100) return 'from-yellow-500/20 to-yellow-500/5';
    return 'from-red-500/20 to-red-500/5';
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <MetricCard
        icon="⚡"
        label="Tiempo de Procesamiento"
        value={processingTime ? `${animatedTime.toFixed(1)}ms` : '—'}
        valueClassName={getProcessingTimeColor(processingTime)}
        gradientClassName={getProcessingTimeGradient(processingTime)}
        showProgress={!!processingTime}
        progress={processingTime ? Math.min(100, (processingTime / 100) * 100) : 0}
        animated={!!processingTime}
      />
      
      <MetricCard
        icon="🧠"
        label="LABs Activos"
        value={`${activeLabs}/${totalLabs}`}
        valueClassName="text-nexus-primary"
        gradientClassName="from-nexus-primary/20 to-nexus-primary/5"
        showProgress={true}
        progress={(activeLabs / totalLabs) * 100}
        animated={activeLabs > 0}
      />
      
      {confidence !== undefined && (
        <MetricCard
          icon="🎯"
          label="Nivel de Confianza"
          value={`${(animatedConfidence * 100).toFixed(0)}%`}
          valueClassName="text-purple-400"
          gradientClassName="from-purple-500/20 to-purple-500/5"
          showProgress={true}
          progress={animatedConfidence * 100}
          animated={true}
        />
      )}
      
      <MetricCard
        icon="💭"
        label="Memorias Recuperadas"
        value={totalEpisodes.toString()}
        valueClassName="text-cyan-400"
        gradientClassName="from-cyan-500/20 to-cyan-500/5"
        showProgress={false}
        animated={totalEpisodes > 0}
      />
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  valueClassName,
  gradientClassName,
  showProgress = false,
  progress = 0,
  animated = false,
}: {
  icon: string;
  label: string;
  value: string;
  valueClassName?: string;
  gradientClassName?: string;
  showProgress?: boolean;
  progress?: number;
  animated?: boolean;
}) {
  return (
    <div 
      className={`relative bg-gradient-to-br ${gradientClassName} backdrop-blur-sm border border-nexus-gray/20 rounded-lg p-4 overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-nexus-primary/10`}
    >
      {/* Efecto de brillo animado */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
      )}

      {/* Icono */}
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {animated && (
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
        )}
      </div>

      {/* Label */}
      <div className="text-xs text-nexus-gray mb-2">{label}</div>

      {/* Valor */}
      <div className={`text-3xl font-bold font-mono mb-2 ${valueClassName || 'text-nexus-white'}`}>
        {value}
      </div>

      {/* Barra de progreso */}
      {showProgress && (
        <div className="w-full bg-nexus-dark/50 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ease-out ${
              animated ? 'animate-pulse' : ''
            }`}
            style={{
              width: `${progress}%`,
              backgroundColor: valueClassName?.includes('green') ? '#4ade80' :
                             valueClassName?.includes('yellow') ? '#facc15' :
                             valueClassName?.includes('red') ? '#f87171' :
                             valueClassName?.includes('purple') ? '#c084fc' :
                             valueClassName?.includes('cyan') ? '#22d3ee' :
                             '#00d9ff',
              boxShadow: animated ? `0 0 10px currentColor` : 'none',
            }}
          />
        </div>
      )}

      {/* Decoración */}
      <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl" />

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </div>
  );
}
